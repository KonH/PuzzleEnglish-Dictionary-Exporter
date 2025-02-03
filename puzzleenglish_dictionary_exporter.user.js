// ==UserScript==
// @name         PuzzleEnglish Dictionary Exporter
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Export PuzzleEnglish dictionary words and translations as JSON or TXT files. Supports exporting the current page or all pages (with a delay between pages and exponential backoff with fixed max retries on errors).
// @author       Your Name
// @match        https://puzzle-english.com/dictionary?noredirect=&view=cards*
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Returns a Promise that resolves after a specified delay in milliseconds.
     * @param {number} ms - Delay in milliseconds.
     * @returns {Promise<void>}
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Extract dictionary words from the current page DOM.
     * @returns {Array<{word: string, translation: string}>}
     */
    function getWords() {
        const cards = document.querySelectorAll('.puzzle-card[data-word]');
        return Array.from(cards).map(card => ({
            word: card.getAttribute('data-word'),
            translation: card.getAttribute('data-translation')
        }));
    }

    /**
     * Extract dictionary words from a given Document.
     * @param {Document} doc - A Document object.
     * @returns {Array<{word: string, translation: string}>}
     */
    function getWordsFromDocument(doc) {
        const cards = doc.querySelectorAll('.puzzle-card[data-word]');
        return Array.from(cards).map(card => ({
            word: card.getAttribute('data-word'),
            translation: card.getAttribute('data-translation')
        }));
    }

    /**
     * Triggers a file download with the specified content.
     * @param {string} content - The file content.
     * @param {string} fileName - The name of the file.
     * @param {string} mimeType - The MIME type.
     */
    function downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    /**
     * Export the current page's dictionary as a JSON file.
     */
    function exportAsJSON() {
        const words = getWords();
        if (!words.length) {
            alert('No dictionary words found on this page.');
            return;
        }
        const jsonContent = JSON.stringify(words, null, 2);
        downloadFile(jsonContent, 'dictionary.json', 'application/json');
    }

    /**
     * Export the current page's dictionary as a TXT file.
     */
    function exportAsTXT() {
        const words = getWords();
        if (!words.length) {
            alert('No dictionary words found on this page.');
            return;
        }
        const txtContent = words.map(w => `${w.word}=${w.translation}`).join('\n');
        downloadFile(txtContent, 'dictionary.txt', 'text/plain');
    }

    /**
     * Determine the highest page number available from the paginator.
     * @returns {number} The highest page number.
     */
    function getLastPageNumber() {
        const paginationLinks = document.querySelectorAll('.paginator-style-2__list li a[data-page]');
        let maxPage = 1;
        paginationLinks.forEach(link => {
            const p = parseInt(link.getAttribute('data-page'), 10);
            if (!isNaN(p) && p > maxPage) {
                maxPage = p;
            }
        });
        return maxPage;
    }

    /**
     * Parse an HTML string into a Document.
     * @param {string} htmlText - The HTML string.
     * @returns {Document} The parsed Document.
     */
    function parseHTML(htmlText) {
        const parser = new DOMParser();
        return parser.parseFromString(htmlText, 'text/html');
    }

    /**
     * Fetch the HTML content of a specific dictionary page with exponential backoff.
     * @param {number} pageNumber - The page number to fetch.
     * @param {number} maxRetries - Maximum number of retries.
     * @param {number} initialDelay - Initial delay in milliseconds.
     * @returns {Promise<string>} A promise resolving to the HTML text.
     */
    async function fetchPageWithRetry(pageNumber, maxRetries = 3, initialDelay = 1500) {
        let attempt = 0;
        let delayTime = initialDelay;
        const url = `https://puzzle-english.com/dictionary?noredirect=&view=cards&page=${pageNumber}`;
        while (attempt <= maxRetries) {
            try {
                const response = await fetch(url, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const html = await response.text();
                return html;
            } catch (err) {
                attempt++;
                if (attempt > maxRetries) {
                    throw new Error(`Failed to fetch page ${pageNumber} after ${maxRetries} retries: ${err}`);
                }
                console.log(`Error fetching page ${pageNumber} (attempt ${attempt}/${maxRetries}). Retrying in ${delayTime}ms...`);
                await delay(delayTime);
                delayTime *= 2; // Exponential backoff
            }
        }
    }

    /**
     * Export dictionary words from all pages (from the current page to the last page) as a JSON file.
     */
    async function exportAllPagesAsJSON() {
        const params = new URLSearchParams(window.location.search);
        const currentPage = parseInt(params.get("page") || "1", 10);
        const lastPage = getLastPageNumber();
        console.log(`Exporting pages ${currentPage} to ${lastPage} as JSON.`);

        let allWords = [];

        for (let page = currentPage; page <= lastPage; page++) {
            console.log(`Fetching page ${page}...`);
            let doc;
            if (page === currentPage) {
                doc = document;
            } else {
                try {
                    const html = await fetchPageWithRetry(page);
                    doc = parseHTML(html);
                } catch (err) {
                    console.error(`Error fetching page ${page}:`, err);
                    alert(`Error fetching page ${page}: ${err}. Aborting export.`);
                    return;
                }
            }
            const words = getWordsFromDocument(doc);
            console.log(`Found ${words.length} words on page ${page}.`);
            allWords = allWords.concat(words);
            if (page < lastPage) {
                // Friendly delay between pages
                await delay(1500);
            }
        }
        console.log(`Exporting a total of ${allWords.length} words as JSON.`);
        const jsonContent = JSON.stringify(allWords, null, 2);
        downloadFile(jsonContent, 'dictionary_all.json', 'application/json');
    }

    /**
     * Export dictionary words from all pages (from the current page to the last page) as a TXT file.
     */
    async function exportAllPagesAsTXT() {
        const params = new URLSearchParams(window.location.search);
        const currentPage = parseInt(params.get("page") || "1", 10);
        const lastPage = getLastPageNumber();
        console.log(`Exporting pages ${currentPage} to ${lastPage} as TXT.`);

        let allWords = [];

        for (let page = currentPage; page <= lastPage; page++) {
            console.log(`Fetching page ${page}...`);
            let doc;
            if (page === currentPage) {
                doc = document;
            } else {
                try {
                    const html = await fetchPageWithRetry(page);
                    doc = parseHTML(html);
                } catch (err) {
                    console.error(`Error fetching page ${page}:`, err);
                    alert(`Error fetching page ${page}: ${err}. Aborting export.`);
                    return;
                }
            }
            const words = getWordsFromDocument(doc);
            console.log(`Found ${words.length} words on page ${page}.`);
            allWords = allWords.concat(words);
            if (page < lastPage) {
                await delay(1500);
            }
        }
        console.log(`Exporting a total of ${allWords.length} words as TXT.`);
        const txtContent = allWords.map(w => `${w.word}=${w.translation}`).join('\n');
        downloadFile(txtContent, 'dictionary_all.txt', 'text/plain');
    }

    // Register menu commands via Tampermonkey
    if (typeof GM_registerMenuCommand !== 'undefined') {
        // Export the current page only
        GM_registerMenuCommand('Export Current Page as JSON', exportAsJSON);
        GM_registerMenuCommand('Export Current Page as TXT', exportAsTXT);
        // Export all pages with pagination, friendly delays, and exponential backoff on errors
        GM_registerMenuCommand('Export All Pages as JSON', () => {
            exportAllPagesAsJSON().catch(err => console.error(err));
        });
        GM_registerMenuCommand('Export All Pages as TXT', () => {
            exportAllPagesAsTXT().catch(err => console.error(err));
        });
    } else {
        console.log('GM_registerMenuCommand is not available.');
    }
})();
