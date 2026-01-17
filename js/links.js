document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('links-container');
    if (!container) return;

    container.innerHTML = '<i>Ladataan linkkejä...</i>';

    fetch('links.json')
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                container.innerHTML = '<p>Ei linkkejä.</p>';
                return;
            }

            let html = '';

            data.forEach(link => {
                html += `
                    <div class="link-item" style="border: 1px solid #ccc; background-color: rgba(255, 255, 255, 0.6); padding: 15px; margin-bottom: 20px; box-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
                        <table style="width: 100%; border: 0;">
                            <tr>
                                ${link.image ? `
                                <td style="width: 60px; vertical-align: top; padding-right: 15px;">
                                    <a href="${link.url}" target="_blank">
                                        <img src="${link.image}" alt="${link.name}" style="width: 50px; height: auto; border: 1px solid #555;">
                                    </a>
                                </td>
                                ` : ''}
                                <td style="vertical-align: top;">
                                    <h3 style="margin-top: 0; margin-bottom: 5px;">
                                        <a href="${link.url}" target="_blank" style="text-decoration: underline;">${link.name}</a>
                                    </h3>
                                    <p style="margin: 0; font-size: 14px;">${link.description}</p>
                                    <div style="margin-top: 5px;">
                                        <a href="${link.url}" target="_blank" style="font-size: 11px; color: green;">[ Siirry sivulle ]</a>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                `;
            });

            container.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p style="color: red;">Virhe ladattaessa linkkejä.</p>';
        });
});
