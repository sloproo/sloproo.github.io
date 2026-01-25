
document.addEventListener('DOMContentLoaded', () => {
    fetch('sam_archive.json')
        .then(response => response.json())
        .then(data => {
            renderCalendar(data);
        })
        .catch(err => console.error('Error loading archive:', err));
});

const MONTH_NAMES = [
    'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu',
    'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'
];

const WEEKDAYS = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

function renderCalendar(data) {
    const container = document.getElementById('calendar-container');
    container.innerHTML = '';

    // Create a map for quick lookup
    const puzzleMap = new Map();
    let minDate = new Date();
    let maxDate = new Date(0);

    data.forEach(item => {
        puzzleMap.set(item.date, item);
        const parts = item.date.split('-');
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        if (d < minDate) minDate = d;
        if (d > maxDate) maxDate = d;
    });

    if (data.length === 0) {
        container.innerHTML = 'Ei dataa.';
        return;
    }

    // Determine start and end year/month
    // We want to show from the earliest year to the latest year (or user said "grows downwards", usually implies chronological)
    // But commonly latest is at bottom? Or top?
    // "Näkymä kasvaa arkiston kasvaessa alaspäin" -> New content at bottom?
    // Let's assume Chronological: 2024 -> 2025 -> 2026.

    const startYear = minDate.getFullYear();
    const endYear = maxDate.getFullYear();

    for (let year = startYear; year <= endYear; year++) {
        // Year Header
        const yearHeader = document.createElement('div');
        yearHeader.className = 'year-header';
        yearHeader.textContent = year;
        container.appendChild(yearHeader);

        const monthsContainer = document.createElement('div');
        monthsContainer.className = 'months-container';
        container.appendChild(monthsContainer);

        // For each month 0-11
        for (let month = 0; month < 12; month++) {
            // Check if we have any data for this month/year combo
            // Or should we just render all months?
            // Usually nice to just render all months for a complete year view
            // OR only render months within the minDate-maxDate range.

            const currentMonthDate = new Date(year, month, 1);
            const nextMonthDate = new Date(year, month + 1, 1);

            // Check if this month is within range (roughly)
            // Actually, showing full years is probably cleaner visually

            // Render Month
            const monthBlock = document.createElement('div');
            monthBlock.className = 'month-block';

            const monthName = document.createElement('div');
            monthName.className = 'month-name';
            monthName.textContent = MONTH_NAMES[month];
            monthBlock.appendChild(monthName);

            const grid = document.createElement('div');
            grid.className = 'calendar-grid';

            // Headers
            WEEKDAYS.forEach(day => {
                const dh = document.createElement('div');
                dh.className = 'day-header';
                dh.textContent = day;
                grid.appendChild(dh);
            });

            // Days
            // Get day of week of 1st day (0=Sun, 1=Mon...6=Sat)
            // We want Mon=0, Sun=6
            let firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
            // Convert to Mon=0..Sun=6
            // Su(0) -> 6
            // Ma(1) -> 0
            // ...
            firstDay = (firstDay === 0) ? 6 : firstDay - 1;

            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Empty cells before 1st
            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                empty.className = 'day-cell empty';
                grid.appendChild(empty);
            }

            // Fill days
            let hasData = false;
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';
                dayCell.textContent = d;

                const puzzle = puzzleMap.get(dateStr);
                if (puzzle) {
                    hasData = true;
                    dayCell.classList.add('has-puzzle');
                    dayCell.dataset.json = JSON.stringify(puzzle);

                    // Click handler
                    dayCell.addEventListener('click', () => {
                        window.open(puzzle.share_url, '_blank');
                    });

                    // Hover events for tooltip
                    setupTooltip(dayCell, puzzle);
                }

                grid.appendChild(dayCell);
            }

            monthBlock.appendChild(grid);

            // Only append month if it's within the valid range of data?
            // E.g. don't show Jan 2024 if data starts Dec 2024.
            // Check if month is >= minDate's month/year AND <= maxDate's month/year
            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month, daysInMonth);

            // We can loosen this if we want full years
            if (monthEnd >= minDate && monthStart <= maxDate) {
                monthsContainer.appendChild(monthBlock);
            }
        }
    }
}

// Tooltip Logic
let tooltipTimeout;
const TOOLTIP_DELAY = 1500; // 1.5s
const tooltip = document.getElementById('hover-tooltip');

function setupTooltip(element, data) {
    element.addEventListener('mouseenter', (e) => {
        tooltipTimeout = setTimeout(() => {
            showTooltip(e, data);
        }, TOOLTIP_DELAY);
    });

    element.addEventListener('mouseleave', () => {
        clearTimeout(tooltipTimeout);
        hideTooltip();
    });
}

function showTooltip(e, data) {
    if (!tooltip) return;

    // Build content
    const stats = data.stats || {};
    const perfectRate = stats.perfect_rate ? (stats.perfect_rate * 100).toFixed(1) + '%' : 'N/A';

    // Format times (ms) to something readable? e.g. "1m 30s" or "12.5s"
    const formatTime = (ms) => {
        if (!ms) return '-';
        const s = ms / 1000;
        if (s < 60) return s.toFixed(1) + 's';
        const m = Math.floor(s / 60);
        const remS = (s % 60).toFixed(0);
        return `${m}m ${remS}s`;
    };

    let html = `
        <h4>${data.date}</h4>
        <b>${data.difficulty}</b><br>
        <i>${data.flavor_text || ''}</i>
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

    tooltip.innerHTML = html;
    tooltip.style.display = 'block';

    // Position
    const rect = e.target.getBoundingClientRect();
    // Position above or below?
    // Let's position relative to viewport
    tooltip.style.left = (window.scrollX + rect.left + 20) + 'px';
    tooltip.style.top = (window.scrollY + rect.top + 20) + 'px';

    // Show with opacity transition
    requestAnimationFrame(() => {
        tooltip.classList.add('visible');
    });
}

function hideTooltip() {
    if (!tooltip) return;
    tooltip.classList.remove('visible');
    // Hide display:none after transition
    // But opacity handles the visual part
    tooltip.style.display = 'none';
}
