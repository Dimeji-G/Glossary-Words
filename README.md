# Glossary Flashcards Website

A simple, interactive web application designed to help users learn and memorize a collection of 1000+ glossary words through flashcards and example sentences. Inspired by the principles of *Atomic Habits* – make it simple, easy to access, and attractive.

## Project Story

I'm a lover of good books and I stumbled upon various huge and unheard words. Before I knew it, I compiled 1000+ words and needed a way to learn them effectively. I tried reading from a markdown file, but it was too bland and I lost track multiple times. I even attempted creating a Python SMTP email sender, but the visual wasn't intriguing enough. Here I am trying to use a website – this should work! According to *Atomic Habits*, make it simple, easy to access, and... I've forgotten the last one 😊 (It's "make it attractive" – the website's particle background and smooth animations aim to achieve that!).

This project transforms a static list of words into an engaging learning tool, allowing users to browse flashcards by day of the week, flip cards to reveal meanings, and view example sentences for deeper understanding.

## Features

- **Flashcard System**: Interactive flashcards organized by days of the week (Monday to Sunday). Users can navigate through cards, flip them to see the word's meaning, and select specific days.
- **Calendar Integration**: Select a date to view flashcards for that week's words.
- **Sentence Examples**: Click "Sentences" on a flashcard to view up to 6 example sentences using the word, displayed in a carousel format.
- **Navigation**: Keyboard shortcuts (arrow keys for navigation, space/enter to flip, escape to go back), touch swipe support for mobile, and button controls.
- **Responsive Design**: Works on desktop and mobile devices with a clean, modern UI featuring a particle background effect.
- **Data-Driven**: Loads words from CSV files ([`glossary_words_py.csv`](glossary_words_py.csv ) for flashcards and [`glossary_words_sentence_usage.csv`](glossary_words_sentence_usage.csv ) for sentences).
- **State Persistence**: Saves flashcard state when switching to sentences view.

## Technologies Used

- **HTML**: Structure of the web pages.
- **CSS**: Styling, including responsive design and animations (files: [`main.css`](main.css ), [`sentences.css`](sentences.css )).
- **JavaScript**: Core functionality for flashcards and sentences (files: [`flashcard.js`](flashcard.js ), [`sentences.js`](sentences.js ), [`particle.js`](particle.js )).
- **Particles.js**: For the animated background effect.
- **CSV Parsing**: Custom parsers to load data from CSV files.

## How to Use

1. **Access the Website**: Open [`index.htm`](index.htm ) in a web browser.
2. **Select a Week**: Use the calendar to pick a date. The app will load flashcards for that week.
3. **Browse Days**: Click day buttons (Mon-Sun) to filter flashcards by day.
4. **Navigate Flashcards**: Use Previous/Next buttons, or keyboard arrows. Click or press space/enter to flip the card.
5. **View Sentences**: Click the "Sentences" button on a flashcard to see example sentences. Navigate with buttons, arrows, or swipe on mobile.
6. **Go Back**: Use the "Back to Flashcards" button or press Escape.

## Setup and Installation

This is a static website with no server-side dependencies. To run locally:

1. Clone or download the project files.
2. Ensure the following files are in the same directory:
   - [`index.htm`](index.htm )
   - [`main.css`](main.css )
   - [`sentences.css`](sentences.css )
   - [`flashcard.js`](flashcard.js )
   - [`sentences.js`](sentences.js )
   - [`particle.js`](particle.js )
   - [`glossary_words_py.csv`](glossary_words_py.csv )
   - [`glossary_words_sentence_usage.csv`](glossary_words_sentence_usage.csv )
   - Any images (e.g., [`Dimroid_black_and_white.png`](Dimroid_black_and_white.png ))
3. Open [`index.htm`](index.htm ) in a modern web browser (Chrome, Firefox, etc.).
4. The app will automatically load the CSV data and initialize.

### Requirements
- A web browser with JavaScript enabled.
- Internet connection for loading Particles.js from CDN (optional; can be downloaded locally).

## File Structure

```
/
├── index.htm                 # Main HTML file
├── main.css                  # Main styles
├── sentences.css             # Styles for sentences section
├── flashcard.js              # Flashcard logic
├── sentences.js              # Sentences carousel logic
├── particle.js               # Particle background configuration
├── glossary_words_py.csv     # CSV data for flashcards (words, meanings, days)
├── glossary_words_sentence_usage.csv  # CSV data for example sentences
├── CNAME                     # For GitHub Pages deployment
└── Dimroid_black_and_white.png  # Logo image
```

## Contributing

Feel free to fork the repository and submit pull requests for improvements, such as adding more words, enhancing UI, or fixing bugs.

## License

This project is open-source. Use it freely for personal or educational purposes.

---

Enjoy learning new words! If you have suggestions or feedback, reach out. 📚✨

