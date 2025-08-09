// Flashcard functionality
function loadLocalCSV() {
  fetch('./glossary_words_py.csv')
    .then(response => {
      if (!response.ok) throw new Error('Local CSV not found');
      return response.text();
    })
    .then(csv => {
      window.latestCSV = csv;
      parseAndLoadCSV(csv);
    })
    .catch(error => {
      flashcard.textContent = 'Failed to load local CSV: ' + error;
    });
}

function getCurrentMondayISO() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  return monday.toISOString().split('T')[0];
}

function parseAndLoadCSV(csv) {
  window.latestCSV = csv;
  allCards = parseCSV(csv);
  minWeekStart = allCards.reduce((min, c) => !min || c.week_start < min ? c.week_start : min, null);
  maxWeekStart = allCards.reduce((max, c) => !max || c.week_start > max ? c.week_start : max, null);
  const currentMonday = getCurrentMondayISO();
  const weekExists = allCards.some(c => c.week_start === currentMonday);
  const defaultWeek = weekExists ? currentMonday : minWeekStart;
  calendar.value = new Date().toISOString().split('T')[0];
  setWeek(defaultWeek);
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = [];
    let current = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i] ? values[i].trim() : '');
    return obj;
  });
}

let allCards = [];
let flashcardsByDay = {};
let minWeekStart = null;
let maxWeekStart = null;
let currentDay = 'monday';
let flashcards = [];
let current = 0;
let showingQuestion = true;

// Get DOM elements
const flashcard = document.getElementById('flashcard');
const counter = document.getElementById('counter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const flipBtn = document.getElementById('flipBtn');
const dayBtns = document.querySelectorAll('.day-btn');
const calendar = document.getElementById('calendar');
const weekIndicator = document.getElementById('week-indicator');
const viewSentencesBtn = document.getElementById('viewSentencesBtn');
const frontLabel = document.getElementById('front-label');
const backLabel = document.getElementById('back-label');

// Load data
loadLocalCSV();

function formatDateWords(dateStr) {
  const date = new Date(dateStr);
  const options = { month: 'long', day: 'numeric' };
  const day = date.getDate();
  let suffix = '';
  if (day % 10 === 1 && day !== 11) suffix = '';
  else if (day % 10 === 2 && day !== 12) suffix = '';
  else if (day % 10 === 3 && day !== 13) suffix = '';
  return date.toLocaleDateString(undefined, options) + suffix;
}

function setWeek(weekStart) {
  const weekCards = allCards.filter(c => c.week_start === weekStart);
  const controls = [prevBtn, nextBtn, flipBtn, ...dayBtns];
  
  if (weekCards.length === 0) {
    controls.forEach(btn => { btn.disabled = true; btn.classList.add('inactive-btn'); });
    flashcards = [];
    weekIndicator.textContent = 'No data for this week.';
    updateFlashcard();
    return;
  } else {
    controls.forEach(btn => { btn.disabled = false; btn.classList.remove('inactive-btn'); });
  }
  
  flashcardsByDay = {monday:[],tuesday:[],wednesday:[],thursday:[],friday:[]};
  
  weekCards.forEach(c => {
    if (!flashcardsByDay[c.day]) flashcardsByDay[c.day] = [];
    flashcardsByDay[c.day].push({question: c.word, answer: c.meaning});
  });
  
  flashcardsByDay.saturday = [].concat(
    flashcardsByDay.monday,
    flashcardsByDay.tuesday,
    flashcardsByDay.wednesday,
    flashcardsByDay.thursday,
    flashcardsByDay.friday
  );
  
  flashcardsByDay.sunday = [...flashcardsByDay.saturday];
  currentDay = 'monday';
  flashcards = flashcardsByDay[currentDay];
  current = 0;
  weekIndicator.textContent = `Showing glossary flashcards for week: ${weekStart}`;
  updateFlashcard();
}

// Get the front and back elements
const flashcardFront = document.getElementById('flashcard-front');
const flashcardBack = document.getElementById('flashcard-back');


// problem beginning
function updateFlashcard() {
  showingQuestion = true;
  if (!flashcards || flashcards.length === 0) {
    flashcardFront.textContent = 'No glossary words for this day!';
    flashcardBack.textContent = '';
    counter.textContent = '';
    frontLabel.style.color = '#5a6675';
    backLabel.style.color = '#aaa';
  } else {
    flashcardFront.textContent = flashcards[current].question;
    flashcardBack.textContent = flashcards[current].answer;
    counter.textContent = `Card ${current + 1} of ${flashcards.length}`;
    frontLabel.style.color = '#5a6675';
    backLabel.style.color = '#aaa';
  }
  flashcard.classList.remove('flipped');
}

// Event listeners
flashcard.addEventListener('click', function(e) {
  if (!flashcards || flashcards.length === 0) return;
  
  showingQuestion = !showingQuestion;
  flashcard.classList.toggle('flipped');
  
  frontLabel.style.color = showingQuestion ? '#5a6675' : '#aaa';
  backLabel.style.color = showingQuestion ? '#aaa' : '#5a6675';
});

flipBtn.addEventListener('click', function() {
  if (!flashcards || flashcards.length === 0) return;
  
  showingQuestion = !showingQuestion;
  flashcard.classList.toggle('flipped');
  
  frontLabel.style.color = showingQuestion ? '#5a6675' : '#aaa';
  backLabel.style.color = showingQuestion ? '#aaa' : '#5a6675';
});

prevBtn.addEventListener('click', function() {
  if (!flashcards || flashcards.length === 0) return;
  current = (current - 1 + flashcards.length) % flashcards.length;
  updateFlashcard();
});

nextBtn.addEventListener('click', function() {
  if (!flashcards || flashcards.length === 0) return;
  current = (current + 1) % flashcards.length;
  updateFlashcard();
});

dayBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    currentDay = btn.getAttribute('data-day');
    flashcards = flashcardsByDay[currentDay] || [];
    current = 0;
    updateFlashcard();
  });
});

calendar.addEventListener('change', function() {
  const selectedDate = calendar.value;
  if (!selectedDate) return;
  
  const d = new Date(selectedDate);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  const weekStartStr = monday.toISOString().split('T')[0];
  
  if (weekStartStr < minWeekStart) {
    weekIndicator.textContent = `No data for this week. Earliest available: ${minWeekStart}`;
    flashcard.textContent = 'Cannot backdate that far!';
    counter.textContent = '';
    flashcards = [];
    disableAllControls();
    return;
  }
  
  if (weekStartStr > maxWeekStart) {
    weekIndicator.textContent = `No data for this week. Latest available: ${maxWeekStart}`;
    flashcard.textContent = 'This day is in the future. No words yet!';
    counter.textContent = '';
    flashcards = [];
    disableAllControls();
    return;
  }
  
  setWeek(weekStartStr);
});

function disableAllControls() {
  const controls = [prevBtn, nextBtn, flipBtn, viewSentencesBtn, ...dayBtns];
  controls.forEach(btn => { 
    btn.disabled = true; 
    btn.classList.add('inactive-btn'); 
  });
}

function enableAllControls() {
  const controls = [prevBtn, nextBtn, flipBtn, viewSentencesBtn, ...dayBtns];
  controls.forEach(btn => { 
    btn.disabled = false; 
    btn.classList.remove('inactive-btn'); 
  });
}

// Function to set current card - can be called from sentences.js
function setCurrentCard(index, day) {
  if (typeof flashcardsByDay === 'undefined' || !flashcardsByDay[day]) return;
  
  currentDay = day;
  flashcards = flashcardsByDay[day];
  current = Math.min(index, flashcards.length - 1);
  updateFlashcard();
}

// Export variables and functions to global scope for sentences.js
window.current = current;
window.currentDay = currentDay;
window.flashcards = flashcards;
window.setCurrentCard = setCurrentCard;

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') {
    prevBtn.click();
  } else if (e.key === 'ArrowRight') {
    nextBtn.click();
  } else if (e.key === ' ' || e.key === 'Enter') {
    flipBtn.click();
  }
});
