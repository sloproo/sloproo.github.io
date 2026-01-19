
/**
 * Bluesky Feed Fetcher
 * Fetches latest posts from pyry.bsky.social
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bluesky-feed');
    if (!container) return; // Exit if container not found

    const ACTOR = 'pyry.bsky.social';
    // Fetch 20 to have buffer for filtering replies
    const API_URL = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${ACTOR}&limit=20`;

    container.innerHTML = '<i>Ladataan Bluesky-feediä...</i>';

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const feed = data.feed;
            if (!feed || feed.length === 0) {
                container.innerHTML = '<small>Ei julkaisuja.</small>';
                return;
            }

            // FILTERING LOGIC:
            // 1. Keep reposts (reason = 'app.bsky.feed.defs#reasonRepost') - usually render the 'post' inside
            // 2. Keep quotes (post.embed.record)
            // 3. Filter out replies to OTHERS (post.record.reply)

            const filteredPosts = feed.filter(item => {
                const post = item.post;
                const record = post.record;

                // If it is a repost, item.reason exists. We generally want to show it.
                // If it is a direct post (no reply), we want it.
                if (!record.reply) return true;

                // User said: "ei vastauksia muiden postauksiin"
                // So if it IS a reply, we check who it is replying to.
                // Note: record.reply contains { root: { uri, cid }, parent: { uri, cid } }
                // It does NOT contain the author handle directly in the record usually, 
                // but the high-level 'reply' object in the response *might* if hydrated, but public API 
                // post record structure is minimal.
                // However, the 'post' object (not record) has 'post.replyCount' etc.
                // Wait, item.reply is often populated in the hydrated feed view if it is a reply.
                // Let's look at `item.reply.parent.author.handle`.

                if (item.reply && item.reply.parent && item.reply.parent.author) {
                    if (item.reply.parent.author.handle !== ACTOR) {
                        return false; // Reply to someone else -> SKIP
                    }
                } else if (record.reply) {
                    // Fallback: if we have record.reply but don't have hydrated parent info, 
                    // assume it is a reply to someone else to be safe/clean?
                    // actually if it is a reply, we probably want to skip it to be 'clean' unless we are sure.
                    return false;
                }

                return true;
            });

            // Take top 3
            const postsToShow = filteredPosts.slice(0, 3);

            if (postsToShow.length === 0) {
                container.innerHTML = '<small>Ei näytettäviä päivityksiä.</small>';
                return;
            }

            let html = '<ul style="list-style-type: none; padding-left: 0; font-size: 16px;">';

            postsToShow.forEach(item => {
                const post = item.post;
                const record = post.record;
                const isRepost = item.reason && item.reason['$type'] === 'app.bsky.feed.defs#reasonRepost';

                const text = record.text || '';
                // Simple linkification could go here but keeping it simple for now
                // Format date
                const date = new Date(record.createdAt).toLocaleDateString('fi-FI');

                // Post URL
                // format: https://bsky.app/profile/<handle>/post/<rkey>
                const uriParts = post.uri.split('/');
                const rkey = uriParts[uriParts.length - 1];
                const postUrl = `https://bsky.app/profile/${post.author.handle}/post/${rkey}`;

                html += `<li style="margin-bottom: 12px; border-bottom: 1px dashed #ccc; padding-bottom: 5px;">`;

                if (isRepost) {
                    html += `<div style="color: #666; margin-bottom: 2px;">↻ Uudelleenpostaus</div>`;
                }

                html += `<a href="${postUrl}" target="_blank" style="text-decoration: none; color: #000;">`;
                html += `<b>${date}:</b> `;
                html += `<span>${text}</span>`;
                html += `</a>`;

                // Embed images if any
                if (post.embed && post.embed.images) {
                    html += `<br><small>[Kuva liitteenä]</small>`;
                }

                html += `</li>`;
            });

            html += '</ul>';
            html += `<div style="text-align: right;"><a href="https://bsky.app/profile/${ACTOR}" target="_blank" style="font-size: 9px;">[ Lisää... ]</a></div>`;

            container.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<small style="color:red;">Latausvirhe.</small>';
        });
});
