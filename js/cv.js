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

            html += `<h3 style="background-color: #e0e0e0; padding: 5px; border-left: 5px solid #003366;">Työkokemus</h3>`;
            data.experience.forEach(job => {
                html += `
                    <div class="job" style="margin-bottom: 15px; padding-left: 10px;">
                        <h4 style="margin: 0;">${job.position} <span style="font-weight: normal;">@ ${job.company}</span></h4>
                        <small style="color: #666;">📅 ${job.period}</small>
                        <p style="margin-top: 5px;">${job.description}</p>
                    </div>
                `;
            });

            html += `<br><h3 style="background-color: #e0e0e0; padding: 5px; border-left: 5px solid #003366;">Koulutus</h3>`;
            data.education.forEach(edu => {
                html += `
                    <div class="education" style="margin-bottom: 15px; padding-left: 10px;">
                        <h4 style="margin: 0;">${edu.school}</h4>
                        <p style="margin-top: 5px;">${edu.degree} <br><small style="color: #666;">📅 ${edu.period}</small></p>
                    </div>
                `;
            });

            html += `<br><h3 style="background-color: #e0e0e0; padding: 5px; border-left: 5px solid #003366;">Taidot</h3>`;
            html += `<div style="padding-left: 10px;"><p>${data.skills.map(s => `<span style="background: #eee; border: 1px solid #ccc; padding: 2px 5px; margin-right: 5px; border-radius: 3px;">${s}</span>`).join(' ')}</p></div>`;

            container.innerHTML = html;
        })
        .catch(err => {
            container.innerHTML = '<p style="color: red;">Virhe ladattaessa CV:tä. Varmista että cv.json on olemassa.</p>';
            console.error(err);
        });
});
