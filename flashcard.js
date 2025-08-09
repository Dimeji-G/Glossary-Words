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
  // calendar.value = new Date().toISOString().split('T')[0];
  // Set calendar to the week that will actually be displayed (May 5th week)
  calendar.value = defaultWeek; // This will show the actual week being displayed
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
    // problem beginning
    function updateFlashcard() {
      showingQuestion = true;
      if (!flashcards || flashcards.length === 0) {
        flashcard.textContent = 'No glossary words for this day!';
        counter.textContent = '';
        document.getElementById('front-label').style.color = '#aaa' ;
        document.getElementById('back-label').style.color = '#2d3a4b';
      } else {
        flashcard.textContent = flashcards[current].question;
        counter.textContent = `Card ${current + 1} of ${flashcards.length}`;
        document.getElementById('front-label').style.color = '#aaa' ;
        document.getElementById('back-label').style.color = '#2d3a4b';
      }
      flashcard.classList.remove('flipped'); //lags when you remove this line
    }
    flashcard.onclick = function(e) {
      if (!flashcards || flashcards.length === 0) return;
      const rect = flashcard.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'flashcard-ripple';
      const size = Math.max(rect.width, rect.height) * 1.2;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      flashcard.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
      showingQuestion = !showingQuestion;
      flashcard.classList.toggle('flipped', !showingQuestion);
      setTimeout(() => {
        flashcard.textContent = showingQuestion ? flashcards[current].question : flashcards[current].answer;
        document.getElementById('front-label').style.color = showingQuestion ? '#aaa' : '#2d3a4b';
        document.getElementById('back-label').style.color = showingQuestion ? '#2d3a4b' : '#aaa';
      }, 250);
    };
    flipBtn.onclick = flashcard.onclick;
    prevBtn.onclick = function() {
      if (!flashcards || flashcards.length === 0) return;
      current = (current - 1 + flashcards.length) % flashcards.length;
      updateFlashcard();
    };
    nextBtn.onclick = function() {
      if (!flashcards || flashcards.length === 0) return;
      current = (current + 1) % flashcards.length;
      updateFlashcard();
    };
    dayBtns.forEach(btn => {
      btn.onclick = function(e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'day-btn-ripple';
        const size = Math.max(rect.width, rect.height) * 1.2;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
        currentDay = btn.getAttribute('data-day');
        flashcards = flashcardsByDay[currentDay] || [];
        current = 0;
        const weekStartMatch = weekIndicator.textContent.match(/week: (\d{4}-\d{2}-\d{2})/);
        if (weekStartMatch) {
          const weekStartStr = weekStartMatch[1];
          const weekStartDate = new Date(weekStartStr);
          const dayOffsets = {monday:0, tuesday:1, wednesday:2, thursday:3, friday:4, saturday:5, sunday:6};
          const offset = dayOffsets[currentDay] || 0;
          const newDate = new Date(weekStartDate);
          newDate.setDate(weekStartDate.getDate() + offset);
          calendar.value = newDate.toISOString().split('T')[0];
        }
        updateFlashcard();
      };
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
      const controls = [prevBtn, nextBtn, flipBtn, ...dayBtns];
      controls.forEach(btn => { btn.disabled = true; btn.classList.add('inactive-btn'); });
    }
    function enableAllControls() {
      const controls = [prevBtn, nextBtn, flipBtn, ...dayBtns];
      controls.forEach(btn => { btn.disabled = false; btn.classList.remove('inactive-btn'); });
    }