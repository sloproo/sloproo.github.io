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
            container.innerHTML = "";

            projects.forEach(project => {
                // UUSI LAYOUT:
                // Ei enää taulukkoa (table), vaan elementit allekkain.

                const projectHTML = `
                    <div style="
                        border: 2px solid #ffffff; 
                        border-right-color: #404040; 
                        border-bottom-color: #404040; 
                        background: #c0c0c0; 
                        padding: 15px; 
                        margin-bottom: 25px; 
                        text-align: left;
                        box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
                    ">
                        <!-- 1. Otsikko -->
                        <h3 style="
                            margin-top: 0; 
                            color: #000080; 
                            font-family: Arial, sans-serif; 
                            border-bottom: 2px groove #fff;
                            padding-bottom: 5px;
                            margin-bottom: 10px;
                        ">${project.name}</h3>
                        
                        <!-- 2. Kuvaus -->
                        <p style="
                            font-family: 'Times New Roman', serif; 
                            font-size: 16px; 
                            line-height: 1.4;
                            margin-bottom: 15px;
                        ">
                            ${project.description}
                        </p>
                        
                        <!-- 3. Kuva (skaalautuva) - NYT KLIKATTAVA -->
                        <div style="
                            background-color: #808080; 
                            padding: 5px; 
                            border: 2px inset #ffffff; 
                            text-align: center; 
                            margin-bottom: 15px;
                        ">
                            <a href="${project.link}" target="_blank">
                                <img src="${project.image}" alt="${project.name}" style="
                                    max-width: 100%;       /* Ei leveämpi kuin laatikko */
                                    max-height: 300px;     /* Ei korkeampi kuin 300px (säädä tätä jos haluat matalamman) */
                                    width: auto;           /* Säilyttää kuvasuhteen */
                                    height: auto;          /* Säilyttää kuvasuhteen */
                                    display: block; 
                                    margin: 0 auto;        /* Keskitetään kuva */
                                    border: 1px solid #000;
                                ">
                            </a>
                        </div>
                        
                        <!-- 4. Linkki-painike -->
                        <div style="text-align: right;">
                            <a href="${project.link}" target="_blank" class="nav-button" style="
                                display:inline-block; 
                                width: auto; 
                                padding: 6px 20px; 
                                margin: 0;
                                font-family: Arial, sans-serif;
                                font-size: 12px;
                            ">
                                Avaa projekti &raquo;
                            </a>
                        </div>
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
