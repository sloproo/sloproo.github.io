document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("projects-container");

    fetch('projects.json')
        .then(response => response.json())
        .then(projects => {
            // Tyhjennetään "ladataan..." teksti
            container.innerHTML = "";

            projects.forEach(project => {
                // Luodaan jokaiselle projektille oma "kortti"
                // Käytetään 90-luvun taulukkotyyliä koodissa generoituna
                const projectHTML = `
                    <div style="border: 2px outset #fff; background: #c0c0c0; padding: 5px; margin-bottom: 20px; text-align: left;">
                        <table width="100%" border="0">
                            <tr>
                                <td width="160" valign="top">
                                    <img src="${project.image}" width="150" height="150" style="border: 2px inset #808080;">
                                </td>
                                <td valign="top">
                                    <h3 style="margin-top: 0; color: #000080;">${project.name}</h3>
                                    <p style="font-size: 14px;">${project.description}</p>
                                    <br>
                                    <a href="${project.link}" target="_blank" class="nav-button" style="display:inline-block; width: auto; padding: 5px 20px;">
                                        [ Avaa projekti ]
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </div>
                `;
                
                container.innerHTML += projectHTML;
            });
        })
        .catch(error => {
            container.innerHTML = "<p style='color:red;'>Virhe ladatessa projekteja: " + error + "</p>";
        });
});
