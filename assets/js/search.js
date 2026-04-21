// Simple HTML decoder
function htmlDecode(input) {
    var e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

// Forensic Levenshtein Distance for typo tolerance
function getLevenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1  // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

(function () {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    const searchOverlay = document.getElementById('search-overlay');
    
    if (!searchInput || !resultsContainer || !searchOverlay) return;

    let searchData = [];
    let isDataFetched = false;

    const fetchSearchData = () => {
        if (isDataFetched) return;
        isDataFetched = true;
        
        console.log('Fetching search index...');
        fetch('{{ "index.json" | relURL }}?v=' + new Date().getTime())
            .then(response => response.json())
            .then(data => {
                searchData = data.map(item => ({
                    ...item,
                    title: htmlDecode(item.title),
                    subtitle: htmlDecode(item.subtitle)
                }));
                console.log('Search index loaded.');
                
                if (searchInput.value.trim().length >= 2) {
                    performSearch(searchInput.value.trim());
                }
            })
            .catch(err => {
                console.error('Failed to load search index:', err);
                isDataFetched = false;
            });
    };

    searchInput.addEventListener('focus', fetchSearchData);
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && searchOverlay.classList.contains('active')) {
                fetchSearchData();
            }
        });
    });
    observer.observe(searchOverlay, { attributes: true });

    const highlightText = (text, query) => {
        if (!query) return text;
        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
        let highlighted = text;
        
        words.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark class="search-highlight">$1</mark>');
        });
        
        return highlighted;
    };

    const renderResults = (results, query) => {
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No results found. Try a different query.</div>';
            return;
        }

        const html = results.map(item => `
            <div class="post-row-container search-row-container">
                <a href="${item.url}" class="post-row-link">
                    <div class="post-row-layout">
                        <div class="post-row-meta">
                            <span class="meta-date-bold">${item.date_day || ''}</span>
                            <span class="meta-month-year">${item.date_month_year || ''}</span>
                            <span class="meta-data-tiny">${item.reading_time || '1'} MIN</span>
                        </div>
                        <div class="post-row-content">
                            <div class="post-row-header">
                                <h2 class="post-row-title">${highlightText(item.title, query)}</h2>
                            </div>
                            ${item.subtitle ? `
                            <div class="post-row-excerpt">
                                <p>${highlightText(item.subtitle, query)}</p>
                            </div>
                            ` : ''}
                        </div>
                        <div class="post-row-arrow">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                </a>
            </div>
        `).join('');

        resultsContainer.innerHTML = html;
    };

    const performSearch = (query) => {
        if (!query || query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }

        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        
        const scoredResults = searchData.map(item => {
            let score = 0;
            const titleLower = item.title.toLowerCase();
            const subtitleLower = item.subtitle.toLowerCase();
            const tagsLower = (item.tags || '').toLowerCase();
            const titleWords = titleLower.split(/\s+/);

            words.forEach(word => {
                // Exact matches in title
                if (titleLower === word) score += 100;
                else if (titleLower.includes(word)) {
                    score += 50;
                    if (titleLower.startsWith(word)) score += 20;
                }

                // Tag matches
                if (tagsLower.includes(word)) score += 30;

                // Subtitle matches
                if (subtitleLower.includes(word)) score += 10;

                // Typo tolerance: Levenshtein distance for title words
                if (word.length >= 4) {
                    titleWords.forEach(tWord => {
                        if (tWord.length >= 4) {
                            const distance = getLevenshteinDistance(word, tWord);
                            if (distance === 1) score += 40;
                            else if (distance === 2) score += 20;
                        }
                    });
                }
            });

            return { ...item, score };
        });

        const filteredResults = scoredResults
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

        renderResults(filteredResults, query);
    };

    let debounceTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            performSearch(e.target.value.trim());
        }, 150);
    });
})();
