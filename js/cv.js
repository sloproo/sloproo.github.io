document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cv-container');
    if (!container) return;

    container.innerHTML = '<img src="https://web.archive.org/web/20090829023617/http://geocities.com/clipart/pbi/cautions/Ani_Construction.gif" style="vertical-align: middle;"> Ladataan ansioluetteloa...';

    fetch('cv.json')
        .then(response => response.json())
        .then(data => {
            let html = `
                <div style="border-bottom: 2px solid #003366; padding-bottom: 10px; margin-bottom: 20px;">
                    <h2 style="margin-bottom: 5px;">${data.header.name}</h2>
                    <span style="font-size: 1.1em; color: #555;">${data.header.title}</span><br>
                    <small>📍 ${data.header.location} | 📧 <a href="mailto:${data.header.email}">${data.header.email}</a></small>
                    <p><i>${data.header.summary}</i></p>
                </div>
            `;

            if (data.sections && Array.isArray(data.sections)) {
                data.sections.forEach(section => {
                    html += `<h3 style="background-color: #e0e0e0; padding: 5px; border-left: 5px solid #003366;">${section.title}</h3>`;
                    html += `<ul style="list-style-type: square; margin-bottom: 20px;">`;
                    section.items.forEach(item => {
                        html += `<li style="margin-bottom: 8px;">${item}</li>`;
                    });
                    html += `</ul>`;
                });
            }

            container.innerHTML = html;
        })
        .catch(err => {
            container.innerHTML = '<p style="color: red;">Virhe ladattaessa CV:tä. Varmista että cv.json on olemassa ja ehjä.</p>';
            console.error(err);
        });
});
