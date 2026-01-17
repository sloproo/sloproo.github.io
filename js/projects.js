document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("projects-container");

    // Haetaan JSON-tiedosto
    fetch('projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(projects => {
            // Tyhjennetään "ladataan..." teksti
            container.innerHTML = "";

            projects.forEach(project => {
                // Luodaan HTML-rakenne jokaiselle projektille
                // Tyyli: Windows 95 "window" look
                const projectHTML = `
                    <div style="
                        border: 2px solid #ffffff; 
                        border-right-color: #404040; 
                        border-bottom-color: #404040; 
                        background: #c0c0c0; 
                        padding: 10px; 
                        margin-bottom: 25px; 
                        text-align: left;
                        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
                    ">
                        <table width="100%" border="0" cellpadding="5">
                            <tr>
                                <td width="160" valign="top" align="center">
                                    <div style="border: 2px inset #ffffff; background: #000; padding: 2px; display: inline-block;">
                                        <img src="${project.image}" width="150" height="150" alt="${project.name}" style="display: block;">
                                    </div>
                                </td>
                                <td valign="top">
                                    <h3 style="
                                        margin-top: 0; 
                                        color: #000080; 
                                        font-family: Arial, sans-serif; 
                                        border-bottom: 1px dotted #808080;
                                        padding-bottom: 5px;
                                    ">${project.name}</h3>
                                    
                                    <p style="font-family: 'Times New Roman', serif; font-size: 16px; line-height: 1.4;">
                                        ${project.description}
                                    </p>
                                    
                                    <br>
                                    
                                    <a href="${project.link}" target="_blank" class="nav-button" style="
                                        display:inline-block; 
                                        width: auto; 
                                        padding: 4px 15px; 
                                        margin: 0;
                                        font-family: Arial, sans-serif;
                                        font-size: 12px;
                                    ">
                                        Avaa projekti &raquo;
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
            console.error(error);
            container.innerHTML = `
                <div style="border: 2px solid red; background: #ffcccc; padding: 10px; color: red; font-weight: bold;">
                    Virhe ladatessa projekteja.<br>
                    <small>${error}</small>
                </div>
            `;
        });
});
