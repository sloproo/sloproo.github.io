
document.addEventListener('DOMContentLoaded', () => {
    fetch('sam_archive.json')
        .then(response => response.json())
        .then(data => {
            renderPage(data);
        })
        .catch(err => console.error('Error loading archive:', err));
});

const MONTH_NAMES = [
    'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu',
    'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'
];

const WEEKDAYS = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

function renderPage(data) {
    // Group puzzles by date
    const puzzleGroups = new Map();
    let minDate = new Date();
    let maxDate = new Date(0);

    data.forEach(item => {
        if (!puzzleGroups.has(item.date)) {
            puzzleGroups.set(item.date, []);
        }
        puzzleGroups.get(item.date).push(item);

        // Skip fallback date for min/max calculation of calendar
        if (item.date !== '2025-01-01') {
            const parts = item.date.split('-');
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            if (d < minDate) minDate = d;
            if (d > maxDate) maxDate = d;
        }
    });

    renderCalendar(puzzleGroups, minDate, maxDate);
    renderExtraPuzzles(puzzleGroups);
}

function getPrimaryPuzzle(puzzles) {
    if (!puzzles || puzzles.length === 0) return null;
    // Prefer one with stats
    const withStats = puzzles.filter(p => p.stats);
    if (withStats.length > 0) return withStats[0];
    return puzzles[0];
}

function renderCalendar(puzzleGroups, minDate, maxDate) {
    const container = document.getElementById('calendar-container');
    container.innerHTML = '';

    if (puzzleGroups.size === 0) {
        container.innerHTML = 'Ei dataa.';
        return;
    }

    const startYear = minDate.getFullYear();
    const endYear = maxDate.getFullYear();

    for (let year = startYear; year <= endYear; year++) {
        const yearMonths = [];

        for (let month = 0; month < 12; month++) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month, daysInMonth);

            if (monthEnd < minDate || monthStart > maxDate) continue;

            // Check if month has any puzzles (excluding solo fallback 2025-01-01)
            let monthHasPuzzles = false;
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const p = puzzleGroups.get(dateStr);
                if (p && p.length > 0) {
                    // If it's 2025-01-01, it only counts if it's NOT the grouped fallback one we skip in calendar
                    if (dateStr === '2025-01-01' && p.length > 1) continue;
                    monthHasPuzzles = true;
                    break;
                }
            }

            if (!monthHasPuzzles) continue;

            const monthBlock = document.createElement('div');
            monthBlock.className = 'month-block';

            const monthName = document.createElement('div');
            monthName.className = 'month-name';
            monthName.textContent = MONTH_NAMES[month];
            monthBlock.appendChild(monthName);

            const grid = document.createElement('div');
            grid.className = 'calendar-grid';

            WEEKDAYS.forEach(day => {
                const dh = document.createElement('div');
                dh.className = 'day-header';
                dh.textContent = day;
                grid.appendChild(dh);
            });

            let firstDay = new Date(year, month, 1).getDay();
            firstDay = (firstDay === 0) ? 6 : firstDay - 1;

            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                empty.className = 'day-cell empty';
                grid.appendChild(empty);
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

                // Special case: skip fallback date in calendar if it's the artificial one
                if (dateStr === '2025-01-01' && (puzzleGroups.get(dateStr)?.length || 0) > 1) {
                    const empty = document.createElement('div');
                    empty.className = 'day-cell empty';
                    empty.textContent = d;
                    grid.appendChild(empty);
                    continue;
                }

                const puzzles = puzzleGroups.get(dateStr);
                let dayCell;

                if (puzzles && puzzles.length > 0) {
                    const primary = getPrimaryPuzzle(puzzles);
                    dayCell = document.createElement('a');
                    dayCell.className = 'day-cell has-puzzle';
                    dayCell.href = primary.share_url;
                    dayCell.target = '_blank';

                    if (puzzles.length > 1) {
                        const count = document.createElement('span');
                        count.style.fontSize = '8px';
                        count.style.position = 'absolute';
                        count.style.bottom = '1px';
                        count.style.right = '2px';
                        count.textContent = `x${puzzles.length}`;
                        dayCell.style.position = 'relative';
                        dayCell.appendChild(count);
                    }

                    setupTooltip(dayCell, puzzles);
                } else {
                    dayCell = document.createElement('div');
                    dayCell.className = 'day-cell';
                }

                const num = document.createTextNode(d);
                dayCell.appendChild(num);
                grid.appendChild(dayCell);
            }

            monthBlock.appendChild(grid);
            yearMonths.push(monthBlock);
        }

        if (yearMonths.length > 0) {
            const yearHeader = document.createElement('div');
            yearHeader.className = 'year-header';
            yearHeader.textContent = year;
            container.appendChild(yearHeader);

            const monthsContainer = document.createElement('div');
            monthsContainer.className = 'months-container';
            yearMonths.forEach(m => monthsContainer.appendChild(m));
            container.appendChild(monthsContainer);
        }
    }
}

function renderExtraPuzzles(puzzleGroups) {
    const section = document.getElementById('extra-puzzles-section');
    const container = document.getElementById('extra-puzzles-container');
    container.innerHTML = '';

    const extraDates = Array.from(puzzleGroups.keys()).filter(date => {
        return date === '2025-01-01' || puzzleGroups.get(date).length > 1;
    }).sort((a, b) => b.localeCompare(a)); // Newest first

    if (extraDates.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    extraDates.forEach(date => {
        const puzzles = puzzleGroups.get(date);
        const groupDiv = document.createElement('div');
        groupDiv.style.marginBottom = '10px';
        groupDiv.style.textAlign = 'left';

        const dateParts = date.split('-');
        const dateFormatted = date === '2025-01-01' ? 'Tuntematon pvm' : `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        puzzles.forEach((p, index) => {
            const link = document.createElement('a');
            link.href = p.share_url;
            link.target = '_blank';
            link.className = 'nav-button'; // Reuse existing site style
            link.style.display = 'inline-block';
            link.style.width = 'auto';
            link.style.margin = '2px 5px';
            link.style.padding = '3px 8px';

            const name = puzzles.length > 1 ? `${dateFormatted} #${index + 1}` : dateFormatted;
            link.textContent = name;

            // Re-setup tooltip for these links too
            setupTooltip(link, [p]);

            groupDiv.appendChild(link);
        });

        container.appendChild(groupDiv);
    });
}

// Tooltip Logic
let tooltipTimeout;
const TOOLTIP_DELAY = 500;
const tooltip = document.getElementById('hover-tooltip');

function setupTooltip(element, puzzles) {
    element.addEventListener('mouseenter', () => {
        tooltipTimeout = setTimeout(() => {
            showTooltip(element, puzzles);
        }, TOOLTIP_DELAY);
    });

    element.addEventListener('mouseleave', () => {
        clearTimeout(tooltipTimeout);
        hideTooltip();
    });
}

function formatTime(ms) {
    if (!ms) return '-';
    const s = ms / 1000;
    if (s < 60) return s.toFixed(1) + 's';
    const m = Math.floor(s / 60);
    const remS = (s % 60).toFixed(0);
    return `${m}m ${remS}s`;
}

function showTooltip(element, puzzles) {
    if (!tooltip) return;

    let html = '';
    puzzles.forEach((data, index) => {
        if (index > 0) html += '<hr style="border: 0; border-top: 2px solid #000; margin: 10px 0;">';

        let statsHtml = '';
        if (data.stats) {
            const stats = data.stats;
            const perfectRate = stats.perfect_rate ? (stats.perfect_rate * 100).toFixed(1) + '%' : 'N/A';
            statsHtml = `
                <hr style="margin: 5px 0;">
                <div class="stat-row"><span>Top 1%:</span> <span>${formatTime(stats.p1)}</span></div>
                <div class="stat-row"><span>Top 5%:</span> <span>${formatTime(stats.p5)}</span></div>
                <div class="stat-row"><span>Top 10%:</span> <span>${formatTime(stats.p10)}</span></div>
                <div class="stat-row"><span>Top 25%:</span> <span>${formatTime(stats.p25)}</span></div>
                <div class="stat-row"><span>Top 50%:</span> <span>${formatTime(stats.p50)}</span></div>
                <div class="stat-row" style="margin-top:5px; border-top:1px dashed #ccc;">
                    <span>Erehtymättömät:</span> <span>${perfectRate}</span>
                </div>
            `;
        }

        html += `
            <div style="${puzzles.length > 1 ? 'padding: 5px; background: rgba(0,0,0,0.05);' : ''}">
                <h4>${data.date}${puzzles.length > 1 ? ` (#${index + 1})` : ''}</h4>
                <b>${data.difficulty || 'Vaikeustaso ei tiedossa'}</b><br>
                ${data.flavor_text ? `<i>${data.flavor_text}</i>` : ''}
                ${statsHtml}
            </div>
        `;
    });

    tooltip.innerHTML = html;
    tooltip.style.display = 'block';

    const rect = element.getBoundingClientRect();
    tooltip.style.left = (window.scrollX + rect.left + 25) + 'px';
    tooltip.style.top = (window.scrollY + rect.top + 25) + 'px';

    requestAnimationFrame(() => {
        tooltip.classList.add('visible');
    });
}

function hideTooltip() {
    if (!tooltip) return;
    tooltip.classList.remove('visible');
    tooltip.style.display = 'none';
}
