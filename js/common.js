
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
                <a href="#" class="nav-button">Linkit</a>
                <a href="mailto:omamail@iki.fi" class="nav-button">Sähköposti</a>
                
                <br>
                <hr width="80%">
                
                <div style="font-size: 11px; margin-top: 10px;">
                    <b>Linkit:</b><br>
                    <a href="https://github.com" target="_blank">[ GitHub ]</a><br>
                    <a href="https://google.com" target="_blank">[ Google ]</a><br>
                </div>
                
                <br><br>
                <div style="border: 1px solid #888; background: #fff; padding: 5px; font-size: 10px;">
                    <!-- KUVA SKAALATTU PIENEMMÄKSI (width: 88px) -->
                    <img src="images/firefox.jpg" alt="Best viewed with Firefox" style="width: 88px; height: auto;"><br>
                    Best viewed with<br>Firefox
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
    const KEY = 'visits';
    
    // Using countapi.xyz
    fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
        .then(response => response.json())
        .then(data => {
            counterElement.innerText = data.value.toString().padStart(6, '0');
        })
        .catch(err => {
            console.warn('Counter API failed, falling back to local storage', err);
            // Fallback for demo/local purposes
            let visits = parseInt(localStorage.getItem('visits') || '4286');
            if (isNaN(visits)) visits = 4286;
            visits++;
            localStorage.setItem('visits', visits);
            counterElement.innerText = visits.toString().padStart(6, '0');
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
    }
    
    renderNavigation(page);
    updateVisitorCounter();
});
