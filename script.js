// This JavaScript makes the filters work with three states: include, exclude, or off
            document.addEventListener('DOMContentLoaded', () => {

    const filterButtons = document.querySelectorAll('#filter-buttons-group .filter-btn'); // genre filters
    const releaseButtons = document.querySelectorAll('#release-filter-group .release-filter-btn'); // release filters
    const clearAllButton = document.querySelector('#clear-all-btn');
    const gameItems = document.querySelectorAll('#game-grid .game-item');
    const gameCountElement = document.querySelector('#game-count');


    // MAIN FILTER FUNCTION
    // -------------------------
    const filterGames = () => {

        // 1. COLLECT INCLUSION & EXCLUSION GENRE FILTERS
        const inclusionFilters = [];
        const exclusionFilters = [];

        filterButtons.forEach(button => {
            if (button.classList.contains('active')) {
                inclusionFilters.push(button.dataset.genre);
            } else if (button.classList.contains('exclude')) {
                exclusionFilters.push(button.dataset.genre);
            }
        });

        // 2. GET ACTIVE RELEASE WINDOW FILTER (only one)
        let activeReleaseFilter = null;
        releaseButtons.forEach(btn => {
            if (btn.classList.contains('active')) {
                activeReleaseFilter = btn.dataset.release;
            }
        });

        const hasActiveFilters =
        inclusionFilters.length > 0 ||
        exclusionFilters.length > 0 ||
        activeReleaseFilter !== null;


        // 3. RELEASE WINDOW TEST FUNCTION
        function matchesReleaseWindow(item, filter) {
            if (!filter) return true;

            const raw = item.dataset.release;
            const releaseDate = item.parsedDate; // already pre-parsed

            // Special case: TBA → always counts as BEYOND
            if (raw.toUpperCase() === "TBA") {
                return filter === "beyond";
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const year = today.getFullYear();
            const month = today.getMonth();

            const firstThisMonth = new Date(year, month, 1);
            const firstNextMonth = new Date(year, month + 1, 1);
            const firstFollowingMonth = new Date(year, month + 2, 1);

            const firstNextYear = new Date(year + 1, 0, 1);
            const firstYearAfterNext = new Date(year + 2, 0, 1);

            switch (filter) {
            case "this-month":
                return releaseDate >= firstThisMonth && releaseDate < firstNextMonth;

            case "next-month":
                return releaseDate >= firstNextMonth && releaseDate < firstFollowingMonth;

            case "this-year":
                return releaseDate.getFullYear() === year;

            case "next-year":
                return releaseDate.getFullYear() === year + 1;

            case "beyond":
                    return releaseDate >= firstYearAfterNext; // AND includes TBA automatically

                default:
                    return true;
                }
            }

        // 4. PROCESS ALL GAME ITEMS
            let visibleCount = 0;

            gameItems.forEach(item => {
                const itemTags = item.dataset.tags ? item.dataset.tags.split(' ') : [];

            // If NO filters at all → show everything
                if (!hasActiveFilters) {
                    item.classList.remove('hide');
                    visibleCount++;
                    return;
                }

            // Genre INCLUDE – must have ALL selected
                const passesInclusion = inclusionFilters.every(f => itemTags.includes(f));

            // Genre EXCLUDE – must NOT have ANY
                const failsExclusion = exclusionFilters.some(f => itemTags.includes(f));

            // Release Window
                const passesRelease = matchesReleaseWindow(item, activeReleaseFilter);

            // Final decision
                if (passesInclusion && !failsExclusion && passesRelease) {
                    item.classList.remove('hide');
                    visibleCount++;
                } else {
                    item.classList.add('hide');
                }
            });


        // 5. UPDATE COUNTER DISPLAY
            if (gameCountElement) {
                gameCountElement.textContent =
            `${visibleCount} item${visibleCount !== 1 ? 's' : ''} visible`;
        }
    };

    // GENRE FILTER CLICK HANDLERS
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {

            // Three-way toggle: off → include → exclude → off
            if (!button.classList.contains('active') && !button.classList.contains('exclude')) {
                button.classList.add('active');
            } else if (button.classList.contains('active')) {
                button.classList.remove('active');
                button.classList.add('exclude');
            } else {
                button.classList.remove('exclude');
            }

            filterGames();
        });
    });

    // RELEASE FILTER CLICK (single-select)
    releaseButtons.forEach(btn => {
        btn.addEventListener('click', () => {

            // If the button is already active, remove the active class
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
            } else {
                // Turn off all other release buttons
                releaseButtons.forEach(b => b.classList.remove('active'));

                // Activate the clicked button
                btn.classList.add('active');
            }

            // Call the filter function after updating button state
            filterGames();
        });
    });

    // CLEAR ALL BUTTON
    if (clearAllButton) {
        clearAllButton.addEventListener('click', () => {

            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('exclude');
            });

            releaseButtons.forEach(btn => btn.classList.remove('active'));

            filterGames();
        });
    }
    // Run once on load
    filterGames();
});            
        // This JavaScript makes the game card info box expand
document.addEventListener('DOMContentLoaded', function() {
            // Select all expand buttons
    const expandButtons = document.querySelectorAll('.expand-btn');

    expandButtons.forEach(button => {
        button.addEventListener('click', function(event) {
                    // 1. STOP the click from activating the main <a> tag link
            event.preventDefault(); 
            event.stopPropagation();

                    // 2. Find the main game item container
            const gameItem = button.closest('.game-item');

                    // 3. Toggle the expanded class
            gameItem.classList.toggle('is-expanded');

                    // 4. Update the ARIA state for accessibility
            const isExpanded = gameItem.classList.contains('is-expanded');
            button.setAttribute('aria-expanded', isExpanded);
        });
    });
});      

    // This JavaScript handles the sidebar toggle (MODIFIED)
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('menu-toggle');
    const closeButton = document.querySelector('.sidebar .close-btn');
    const sidebar = document.getElementById('sidebar-menu');

    function toggleMenu() {
            // MODIFIED: Toggle class on the BODY element
        const isOpen = document.body.classList.toggle('sidebar-is-open');

            // MODIFIED: Update ARIA on the toggle button
        toggleButton.setAttribute('aria-expanded', isOpen);
    }

        // Open menu when hamburger is clicked
    toggleButton.addEventListener('click', toggleMenu);

        // Close menu when X is clicked
    closeButton.addEventListener('click', toggleMenu);
});

document.addEventListener('DOMContentLoaded', () => {

    // --- NEW SCROLL TO TOP FUNCTIONALITY ---

    const scrollBtn = document.getElementById("scrollToTopBtn");

    // Function to check scroll position and toggle button visibility
    const scrollFunction = () => {
        // Show the button if the user has scrolled down 300 pixels
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    };

const topFunction = () => {
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = 0;
    const distance = targetPosition - startPosition;
    const duration = 1000; // Adjust for speed (in milliseconds)
    let startTimestamp = null;

    // Easing function: "Ease In Out Quad"
    // This makes it slow at start/end and faster in the middle
    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        
        // Calculate the next scroll position
        const nextScroll = easeInOutQuad(elapsed, startPosition, distance, duration);
        
        window.scrollTo(0, nextScroll);

        if (elapsed < duration) {
            window.requestAnimationFrame(step);
        } else {
            window.scrollTo(0, targetPosition); // Ensure we land exactly at 0
        }
    };

    window.requestAnimationFrame(step);
};

    // 1. Add event listener for when the user scrolls
    window.onscroll = scrollFunction;

    // 2. Add event listener for when the button is clicked
    if (scrollBtn) {
        scrollBtn.addEventListener('click', topFunction);
    }
    });
// --- Content Loading Function ---
async function loadMainContent() {
    try {
        const response = await fetch('main-content.html');

                // Check if the file was found
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const htmlContent = await response.text();
        const mainContentEl = document.getElementById('main-content');

        if (mainContentEl) {
            mainContentEl.innerHTML = htmlContent;

                    // --- 3. Initialize Content-Dependent Scripts ---
                    // These functions MUST run *after* the content is loaded
            initFilterButtons();
            initExpandButtons();
        }

    } catch (error) {
        console.error('Could not load main content:', error);
        document.getElementById('main-content').innerHTML = '<p style="color: white; text-align: center;">Error: Could not load game list.</p>';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const items = [...document.querySelectorAll(".game-item")];
    const grid = document.querySelector("#game-grid");
    const sortToggleButton = document.getElementById('sort-toggle-btn');
    const TODAY = new Date();
    TODAY.setHours(0, 0, 0, 0);

    // Function to parse release date string into a date object and label
    function parseReleaseDate(str) {
        if (!str) return { date: new Date(2999, 11, 31), label: "TBA" };

        str = str.trim().toUpperCase();

        // TBA
        if (str === "TBA") {
            return { date: new Date(2999, 11, 31), label: "TBA" };
        }

        // Full date YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
            return { date: new Date(str), label: str };
        }

        // Year-Month (YYYY-MM)
        if (/^\d{4}-\d{2}$/.test(str)) {
            const [year, month] = str.split('-').map(Number);
            // Set date to the last day of the month
            const lastDayOfMonth = new Date(year, month, 0);  // '0' means the last day of the previous month
            return {
                date: lastDayOfMonth,
                label: `${lastDayOfMonth.toLocaleString('default', { month: 'long' })} ${year}`
            };
        }

        // Quarter YYYY-Q#
        const qMatch = str.match(/^(\d{4})-Q([1-4])$/);
        if (qMatch) {
            const year = parseInt(qMatch[1], 10);
            const quarter = parseInt(qMatch[2], 10);

            const quarterStart = {
                1: new Date(year, 3, 30),   // mar 30
                2: new Date(year, 6, 30),   // jun 30
                3: new Date(year, 9, 30),   // sept 30
                4: new Date(year, 12, 30)    // dec 30
            };
            return {
                date: quarterStart[quarter],
                label: `${year} Q${quarter}`
            };
        }

        // Year only "YYYY"
        if (/^\d{4}$/.test(str)) {
            const year = parseInt(str, 10);

            // Assume year-only means **Dec 31**
            return {
                date: new Date(year, 11, 31),
                label: str
            };
        }

        // Unknown format = treat as TBA
        return {
            date: new Date(2999, 11, 31),
            label: "TBA"
        };
    }
    
    // NEW FUNCTION: Calculate days difference and return formatted text
    function getDaysUntilRelease(releaseDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check for TBA/Past Dates
        if (releaseDate.getFullYear() > 2900) return "TBA";
        if (releaseDate < today) return "Released";

        // Calculate days difference
        const diffTime = releaseDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return `${diffDays} days remaining`;
    }

    // Apply parsed date and display readable labels
    items.forEach(item => {
        const raw = item.dataset.release;
        const parsed = parseReleaseDate(raw);

        item.parsedDate = parsed.date;

        const labelEl = item.querySelector(".release-date");
        if (labelEl) labelEl.textContent = parsed.label;
        
        // --- NEW: Populate hidden data-release-date span ---
        const releaseInfoEl = item.querySelector(".data-release-date");
        const daysRemainingText = getDaysUntilRelease(item.parsedDate);
        
        if (releaseInfoEl) {
            // Set the full, descriptive text, removing <br> to keep it on one line.
            releaseInfoEl.innerHTML = `
                ${parsed.label}
                &nbsp;&nbsp;
                (${daysRemainingText})
            `;
        }
    });

    // Sort items by future release date
    const sortByReleaseDate = () => {
        return items.sort((a, b) => a.parsedDate - b.parsedDate);
    };

    // Sort items by Priority (by the numeric data-high-profile rank)
    const sortByPriorityOrder = () => {
        return items.sort((a, b) => {
            // Parse the numeric rank from the data attribute.
            // Use '|| 999' as a fallback to ensure any non-numeric or missing ranks 
            // are treated as low priority (pushed to the end).
            const aRank = parseInt(a.dataset.highProfile, 10) || 999;
            const bRank = parseInt(b.dataset.highProfile, 10) || 999;

            // Since 1 is the highest rank, aRank - bRank sorts ascending (1 comes before 2).
            return aRank - bRank;
        });
    };


    // Update the grid display based on sorted items
    const updateGridDisplay = (sortedItems) => {
        grid.innerHTML = '';  // Clear the grid
        sortedItems.forEach(item => grid.appendChild(item));
        
        // *** NEW: Apply the dynamic color after updating the grid ***
        setDynamicProfileColors(); 
    };

    // Toggle sorting when the button is clicked
    let sortByPriorityFlag = false;  // Flag to track current sorting method

    sortToggleButton.addEventListener('click', () => {
        sortByPriorityFlag = !sortByPriorityFlag;  // Toggle the sorting flag
        const sortedItems = sortByPriorityFlag ? sortByPriorityOrder() : sortByReleaseDate();  // Choose sorting method
        updateGridDisplay(sortedItems);  // Update the grid with sorted items

        // Update button text to reflect the current sorting method
        sortToggleButton.textContent = sortByPriorityFlag ? 'Sorting Priority' : 'Sorting Release Date';
    });

    // Initial sort by Release Date and display the items
    const sortedByReleaseDate = sortByReleaseDate();
    updateGridDisplay(sortedByReleaseDate);

    // Determine the NEXT UPCOMING release (future only)
    const upcomingList = sortedByReleaseDate.filter(x => x.parsedDate >= TODAY);
    const next = upcomingList.length > 0 ? upcomingList[0] : null;

    if (next) {
        document.querySelector("#next-release-box").style.display = "block";

        // Pull the thumbnail image for background
        const img = next.querySelector("img");
        if (img) {
            const box = document.querySelector("#next-release-box");
            box.style.setProperty("--bg-img", `url(${img.src})`);
            box.style.setProperty("background-image", `url(${img.src})`);
            box.style.backgroundSize = "cover";
            box.style.backgroundPosition = "center";
        }

        document.querySelector("#next-title").textContent =
        next.querySelector("h3").innerText.trim();

        const target = next.parsedDate.getTime();

        // Update countdown for the next release
        function updateCountdown() {
            const now = Date.now();
            const diff = target - now;
            const countdownEl = document.querySelector("#countdown");

            // If today IS the release date
            if (Math.abs(diff) < 24 * 60 * 60 * 1000) {
                countdownEl.textContent = "Released Today!";
                return;
            }

            // If the release date is past (rare)
            if (diff < 0) {
                countdownEl.textContent = "Released";
                return;
            }

            // Normal countdown
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / (1000 * 60)) % 60);

            countdownEl.textContent = `${days}d ${hours}h ${mins}m`;
        }

        updateCountdown();
        setInterval(updateCountdown, 60000);
    }
});

// NEW FUNCTION: Dynamically set game item border color based on numeric rank
function setDynamicProfileColors() {
    const gameItems = document.querySelectorAll('.game-item[data-high-profile]');
    
    // --- 🎨 COLOR ADJUSTMENT VARIABLES ---
    const START_HUE = 140; // HUE for BEST rank (1). 120 = Green.
    const END_HUE = 2;     // HUE for WORST rank (10). 0 = Red.
    // -------------------------------------
    
    const maxRank = 10; 
    const minRank = 1;
    const HUE_RANGE = START_HUE - END_HUE; // Calculate the degree difference

    gameItems.forEach(item => {
        const rank = parseInt(item.dataset.highProfile, 10);
        
        if (isNaN(rank) || rank < minRank) {
            item.style.setProperty('--profile-color', 'transparent');
            return;
        }

        const clampedRank = Math.min(Math.max(rank, minRank), maxRank);
        
        // normalizedRank: 0 for Rank 1 (best) to 1 for Rank 7 (worst)
        const normalizedRank = (clampedRank - minRank) / (maxRank - minRank);
        
        // Calculate the final hue
        // START_HUE - (0 to 1) * HUE_RANGE
        const hue = START_HUE - (normalizedRank * HUE_RANGE);

        // Saturation (96%) and Lightness (70%) keep the colors vibrant
        const color = `hsl(${hue}, 96%, 70%)`;

        item.style.setProperty('--profile-color', color);
    });
}

document.addEventListener('scroll', function () {
    const container = document.querySelector('.bottom-buttons-container');

    const scrollPos = window.innerHeight + window.scrollY;
    const bottom = document.body.offsetHeight - 30;

    if (scrollPos >= bottom) {
        container.classList.add('show-buttons');
    } else {
        container.classList.remove('show-buttons');
    }
});

document.addEventListener('DOMContentLoaded', function() {

    function closeCurrentPanel() {
        const existingPanel = document.querySelector('.details-panel');
        if (existingPanel) existingPanel.remove();
        document.querySelectorAll('.game-item').forEach(el => el.classList.remove('active-parent'));
    }

    function createPanel(data) {
        const div = document.createElement('div');
        div.className = 'details-panel';

        // We build the secondary button HTML *only* if the data exists
        const secondaryButtonHTML = data.secLink ? `
            <a href="${data.secLink}" target="_blank" class="filter-btn active" style="text-decoration:none; display:inline-block; border:none; box-shadow: 0 4px 15px rgba(39, 108, 245, 0.4);">
                ${data.secText || "View Alternate Version"}
            </a>
        ` : '';

        div.innerHTML = `
        <div class="details-hero-bg" style="background-image: url('${data.bgSrc}');"></div>

        <div class="details-panel-content">
            <h2>${data.title}</h2>
            <p class="game-desc">${data.desc}</p>

            <div class="details-stats-grid">
                <div class="stat-item"><strong>Genres</strong> ${data.genres}</div>
                <div class="stat-item"><strong>Co-op / PvP</strong> ${data.multiplayer}</div>
                <div class="stat-item"><strong>Release Date</strong> ${data.releaseInfo}</div> 
            </div>

            <div style="margin-top: 25px; display: flex; flex-wrap: wrap; gap: 15px;">
                <a href="${data.link}" target="_blank" class="filter-btn active" style="text-decoration:none; display:inline-block; border:none; box-shadow: 0 4px 15px rgba(39, 108, 245, 0.4);">
                    View Store Page
                </a>

                ${secondaryButtonHTML} 
            </div>
        </div>
        `;
        return div;
    }
    const gameGrid = document.getElementById('game-grid');

    gameGrid.addEventListener('click', function(e) {
        const item = e.target.closest('.game-item');
        if (!item) return;

        e.preventDefault();

        if (item.classList.contains('active-parent')) {
            closeCurrentPanel();
            return;
        }

        closeCurrentPanel();
        item.classList.add('active-parent');

        const infoBlock = item.querySelector('.game-info-hidden');
        if (!infoBlock) return;

        const thumbSrc = item.querySelector('img').src;
        const bgSpan = infoBlock.querySelector('.data-bg');
        const bgSrc = bgSpan ? bgSpan.innerText : thumbSrc;

                // NEW: Check for the secondary link span
        const secLinkSpan = infoBlock.querySelector('.data-secondary-link');

        const data = {
            title: item.querySelector('h3').innerText,
            link: item.querySelector('a').href,
            bgSrc: bgSrc, 
            desc: infoBlock.querySelector('.data-desc').innerHTML,
            genres: infoBlock.querySelector('.data-genres').innerText,
                releaseInfo: infoBlock.querySelector('.data-release-date').innerHTML, // <-- NEW LINE
                multiplayer: infoBlock.querySelector('.data-multiplayer').innerText,
                //comfort: infoBlock.querySelector('.data-comfort').innerText,

                    // NEW: Add the secondary data to the object
                secLink: secLinkSpan ? secLinkSpan.dataset.url : null,
                secText: secLinkSpan ? secLinkSpan.dataset.text : null
            };

            const panel = createPanel(data);

                // (Existing Grid Injection Logic remains unchanged)
            const visibleItems = Array.from(gameGrid.querySelectorAll('.game-item:not(.hide)'));
            const index = visibleItems.indexOf(item);
            const gridComputedStyle = window.getComputedStyle(gameGrid);
            const gridColumnValue = gridComputedStyle.getPropertyValue('grid-template-columns');
            const itemsPerRow = gridColumnValue.split(' ').length;

            const rowNumber = Math.floor(index / itemsPerRow);
            let lastItemIndex = (rowNumber + 1) * itemsPerRow - 1;

            if (lastItemIndex >= visibleItems.length) lastItemIndex = visibleItems.length - 1;

            const referenceNode = visibleItems[lastItemIndex];
            referenceNode.parentNode.insertBefore(panel, referenceNode.nextSibling);

            setTimeout(() => {
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.addEventListener('click', closeCurrentPanel));
});