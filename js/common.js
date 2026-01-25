
/**
 * Common JavaScript for navigation and shared functionality
 */

function renderNavigation(activePage) {
    const navHTML = `
                <br>
                <!-- KUVA SKAALATTU PIENEMMÄKSI (width: 60px) -->
                <img src="images/bullet_256.png" alt="bullet" style="width: 60px; height: auto;"> 
                <br>
                <b>Menu</b>
                <br><br>
                
                <a href="index.html" class="nav-button" ${activePage === 'index' ? 'style="background-color: #e0e0e0; border-style: inset;"' : ''}>Etusivu</a>
                <a href="cv.html" class="nav-button" ${activePage === 'cv' ? 'style="background-color: #e0e0e0; border-style: inset;"' : ''}>CV / Resume</a>
                <a href="projects.html" class="nav-button" ${activePage === 'projects' ? 'style="background-color: #e0e0e0; border-style: inset;"' : ''}>Projektit</a>
                <a href="sam_archive.html" class="nav-button" ${activePage === 'sam_archive' ? 'style="background-color: #e0e0e0; border-style: inset;"' : ''}>Sam-arkisto</a>
                <a href="links.html" class="nav-button" ${activePage === 'links' ? 'style="background-color: #e0e0e0; border-style: inset;"' : ''}>Linkit</a>
                <a href="guestbook.html" class="nav-button" ${activePage === 'guestbook' ? 'style="background-color: #e0e0e0; border-style: inset;"' : ''}>Vieraskirja</a>
                <a href="mailto:hallamaa@iki.fi" class="nav-button">Sähköposti</a>
                
                <br>
                <hr width="80%">
                

                
                <br><br>
                <div style="border: 1px solid #888; background: #fff; padding: 5px; font-size: 10px;">
                    <!-- KUVA SKAALATTU PIENEMMÄKSI (width: 88px) -->
                    <a href="https://www.firefox.com/" target="_blank"><img src="images/firefox.jpg" alt="Best viewed with Firefox" style="width: 88px; height: auto; border: 0;"></a><br>
                    Best viewed with<br><a href="https://www.firefox.com/" target="_blank">Firefox</a>
                </div>
    `;

    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = navHTML;
    }
}

function updateVisitorCounter() {
    // Check if element exists (only on index.html)
    const counterElement = document.querySelector('.counter');
    if (!counterElement) return;

    // Namespace for this specific site
    const NAMESPACE = 'sloproo.github.io';
    const KEY = 'visits_v2'; // New key for reset
    const OFFSET = 12; // Start from 12

    // Using countapi.xyz
    fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
        .then(response => response.json())
        .then(data => {
            const count = data.value + OFFSET;
            counterElement.innerText = count.toString().padStart(6, '0');
        })
        .catch(err => {
            console.warn('Counter API failed, falling back to local storage', err);
            // Fallback for demo/local purposes
            let visits = parseInt(localStorage.getItem('visits_v2') || '0');
            visits++;
            localStorage.setItem('visits_v2', visits);

            const count = visits + OFFSET;
            counterElement.innerText = count.toString().padStart(6, '0');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    // Auto-detect active page
    const path = window.location.pathname;
    let page = 'index'; // Default

    if (path.includes('projects.html')) {
        page = 'projects';
    } else if (path.includes('cv.html')) {
        page = 'cv';
    } else if (path.includes('links.html')) {
        page = 'links';
    } else if (path.includes('sam_archive.html')) {
        page = 'sam_archive';
    } else if (path.includes('guestbook.html')) {
        page = 'guestbook';
    }

    renderNavigation(page);
    updateVisitorCounter();
});
