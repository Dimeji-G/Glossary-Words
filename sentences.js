// Sentences functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sentences functionality variables
    const viewSentencesBtn = document.getElementById('viewSentencesBtn');
    const backToFlashcardsBtn = document.getElementById('backToFlashcardsBtn');
    const sentencesSection = document.getElementById('sentences-section');
    const flashcardsSection = document.querySelector('.container:not(#sentences-section)');
    const currentWordSpan = document.getElementById('current-word');
    
    // Sentence carousel variables
    let currentSentenceIndex = 0;
    const totalSentences = 6;
    const sentencesTrack = document.getElementById('sentencesTrack');
    const sentenceDivs = document.querySelectorAll('.sentence-div');
    const sentencePrevBtn = document.getElementById('sentencePrevBtn');
    const sentenceNextBtn = document.getElementById('sentenceNextBtn');
    let sentencesData = [];
    let currentWordIndex = 0;
    let totalWords = 0;
    let savedFlashcardState = { current: 0, day: 'monday' }; // To save flashcard state

    // Load the sentences CSV
    function loadSentencesCSV() {
        fetch('./glossary_words_sentence_usage.csv')
            .then(response => {
                if (!response.ok) throw new Error('Sentences CSV not found');
                return response.text();
            })
            .then(csv => {
                sentencesData = parseSentencesCSV(csv);
                totalWords = sentencesData.length;
                console.log(`Loaded ${totalWords} words from sentences CSV`);
            })
            .catch(error => {
                console.error('Failed to load sentences CSV:', error);
            });
    }

    // Parse sentences CSV
    function parseSentencesCSV(text) {
        const lines = text.trim().split(/\r?\n/);
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let j = 0; j < lines[i].length; j++) {
                const char = lines[i][j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim().replace(/^"|"$/g, ''));
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim().replace(/^"|"$/g, ''));

            if (values.length >= headers.length && values[0]) {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = values[index] || '';
                });
                data.push(rowData);
            }
        }
        return data;
    }

    // Function to find sentences for a word
    function getSentencesForWord(word) {
        const wordData = sentencesData.find(item => 
            item.word && item.word.toLowerCase() === word.toLowerCase()
        );
        
        if (wordData) {
            return [
                wordData['Sentence 1'] || 'No sentence available',
                wordData['Sentence 2'] || 'No sentence available',
                wordData['Sentence 3'] || 'No sentence available',
                wordData['Sentence 4'] || 'No sentence available',
                wordData['Sentence 5'] || 'No sentence available',
                wordData['Sentence 6'] || 'No sentence available'
            ];
        }
        return Array(6).fill('No sentences found for this word');
    }

    // Function to update sentence carousel
    function updateSentenceCarousel() {
        let slideWidth = 100; // 100% width
        
        const translateX = -currentSentenceIndex * slideWidth + '%';
        sentencesTrack.style.transform = `translateX(${translateX})`;
        
        sentenceDivs.forEach((div, index) => {
            if (index === currentSentenceIndex) {
                div.classList.add('active');
            } else {
                div.classList.remove('active');
            }
        });
    }

    // Function to navigate to the next sentence
    function navigateToNextSentence() {
        currentSentenceIndex = (currentSentenceIndex + 1) % totalSentences;
        updateSentenceCarousel();
    }

    // Function to navigate to the previous sentence
    function navigateToPreviousSentence() {
        currentSentenceIndex = (currentSentenceIndex - 1 + totalSentences) % totalSentences;
        updateSentenceCarousel();
    }

    // Function to find word index in sentences data
    function findWordIndexInSentences(word) {
        return sentencesData.findIndex(item => 
            item.word && item.word.toLowerCase() === word.toLowerCase()
        );
    }

    // Update the display for the current word in sentences
    function updateWordDisplay() {
        if (sentencesData.length === 0 || currentWordIndex >= sentencesData.length) return;
        
        const currentWord = sentencesData[currentWordIndex];
        currentWordSpan.textContent = currentWord.word || 'Unknown';
        
        // Update sentences
        const sentences = getSentencesForWord(currentWord.word);
        for (let i = 1; i <= 6; i++) {
            const sentenceDiv = document.getElementById(`sentence${i}`);
            const sentenceText = sentenceDiv.querySelector('.sentence-text');
            sentenceText.textContent = sentences[i-1];
        }
        
        // Reset to first sentence
        currentSentenceIndex = 0;
        updateSentenceCarousel();
    }

    // Function to show sentences section
    function showSentencesSection(word) {
        // Save current flashcard state
        if (typeof current !== 'undefined' && typeof currentDay !== 'undefined') {
            savedFlashcardState = {
                current: current,
                day: currentDay
            };
        }

        // Find the word in sentences data
        currentWordIndex = findWordIndexInSentences(word);
        
        if (currentWordIndex === -1) {
            alert(`Sentences not found for "${word}"`);
            return;
        }

        currentWordSpan.textContent = word;
        
        // Update sentences
        const sentences = getSentencesForWord(word);
        for (let i = 1; i <= 6; i++) {
            const sentenceDiv = document.getElementById(`sentence${i}`);
            const sentenceText = sentenceDiv.querySelector('.sentence-text');
            sentenceText.textContent = sentences[i-1];
        }
        
        // Reset to first sentence
        currentSentenceIndex = 0;
        updateSentenceCarousel();
        
        // Hide flashcards, show sentences
        flashcardsSection.style.display = 'none';
        sentencesSection.style.display = 'flex';
    }

    // Function to show flashcards section
    function showFlashcardsSection() {
        sentencesSection.style.display = 'none';
        flashcardsSection.style.display = 'flex';
        
        // Restore flashcard state if available
        if (typeof setCurrentCard === 'function' && savedFlashcardState) {
            setCurrentCard(savedFlashcardState.current, savedFlashcardState.day);
        }
    }

    // Event listeners
    if (viewSentencesBtn) {
        viewSentencesBtn.addEventListener('click', function() {
            if (typeof flashcards !== 'undefined' && flashcards && flashcards.length > 0 && typeof current !== 'undefined') {
                const currentWord = flashcards[current].question;
                showSentencesSection(currentWord);
            } else {
                alert('No flashcard selected');
            }
        });
    }

    if (backToFlashcardsBtn) {
        backToFlashcardsBtn.addEventListener('click', showFlashcardsSection);
    }

    if (sentenceNextBtn) {
        sentenceNextBtn.addEventListener('click', navigateToNextSentence);
    }

    if (sentencePrevBtn) {
        sentencePrevBtn.addEventListener('click', navigateToPreviousSentence);
    }

    // Keyboard navigation for sentences
    document.addEventListener('keydown', (e) => {
        if (sentencesSection.style.display !== 'none') {
            if (e.key === 'ArrowRight') {
                navigateToNextSentence();
            } else if (e.key === 'ArrowLeft') {
                navigateToPreviousSentence();
            } else if (e.key === 'Escape') {
                showFlashcardsSection();
            }
        }
    });

    // Handle window resize for sentences
    window.addEventListener('resize', updateSentenceCarousel);

    // Touch swipe functionality for sentences
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50; // Minimum distance for a swipe to register

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        // Prevent default scrolling during horizontal swipes
        const touchCurrentX = e.touches[0].clientX;
        const touchCurrentY = e.touches[0].clientY;
        const deltaX = Math.abs(touchCurrentX - touchStartX);
        const deltaY = Math.abs(touchCurrentY - touchStartY);
        
        // If horizontal movement is greater than vertical, prevent default scrolling
        if (deltaX > deltaY) {
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Check if it's a horizontal swipe (horizontal movement > vertical movement)
        if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - go to previous sentence
                navigateToPreviousSentence();
            } else {
                // Swipe left - go to next sentence
                navigateToNextSentence();
            }
        }
    }

    // Add touch event listeners to the sentences wrapper
    const sentencesWrapper = document.querySelector('.sentences-wrapper');
    if (sentencesWrapper) {
        sentencesWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
        sentencesWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
        sentencesWrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Load sentences CSV on page load
    loadSentencesCSV();
});
