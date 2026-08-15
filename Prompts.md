# Prompt Documentation - Sprint 08: Cine-Stream

This document logs the AI assistance and prompts used during the development of the Cine-Stream media explorer project, in compliance with the corporate AI policy.

---

## Phase 1: Base Architecture & API Consumption

### 1. TMDB API Integration & Environment Setup
* **Prompt used:** 
  > "How do I securely configure the TMDB API read access token in a Vite React application using environment variables?"
* **Outcome/Learnings:** Learned how to set up `VITE_TMDB_KEY` in a `.env` file and access it via `import.meta.env` while ensuring it is excluded from version control via `.gitignore`.

### 2. Grid Layout & Responsive Design
* **Prompt used:** 
  > "Provide a clean, responsive CSS Grid layout for movie cards showing a poster image, title, release year, and rating with vanilla CSS."
* **Outcome/Learnings:** Implemented a mobile-first grid using `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))` along with fallback handling for missing poster images.

---

## Phase 2: Performance Mastery & Persistence

### 1. Input Debouncing for Search
* **Prompt used:** 
  > "Write a simple vanilla JavaScript debounce utility function in React to delay API calls by 500ms when typing in a search input."
* **Outcome/Learnings:** Created a custom hook / timeout-based debounce handler using `setTimeout` and `clearTimeout` inside a `useEffect` to prevent excessive API requests on every keystroke.

### 2. Infinite Scroll with Intersection Observer
* **Prompt used:** 
  > "How do I implement infinite scroll using the native Intersection Observer API in React without external libraries?"
* **Outcome/Learnings:** Attached an observer to a sentinel div at the bottom of the list. When triggered, it increments the page number state and appends new results using `setMovies(prev => [...prev, ...newMovies])`.

### 3. LocalStorage Persistence for Favorites
* **Prompt used:** 
  > "Show a simple pattern to sync a React state array with `localStorage` so favorites persist across page reloads."
* **Outcome/Learnings:** Used lazy initial state evaluation with `localStorage.getItem` and a `useEffect` hook to update `localStorage` whenever the favorites array changes.

---

## Phase 3: AI Architecture & Asset Optimization

### 1. AI Mood Matcher Integration
* **Prompt used:** 
  > "How do I structure a prompt for an LLM API to return only a single movie title string based on a user mood description, and then pass that string into a fetch function?"
* **Outcome/Learnings:** Configured the LLM prompt to strictly return plaintext (e.g., "Return ONLY the movie title as a plaintext string"), sanitized the output, and automatically chained it into the TMDB search endpoint.

### 2. Native Image Lazy Loading
* **Prompt used:** 
  > "What is the syntax for native lazy loading on image tags in HTML/React?"
* **Outcome/Learnings:** Added `loading="lazy"` to all dynamically rendered poster `<img>` tags to improve initial page load performance.