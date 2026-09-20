# FoodTruth AI 🥗

**"Don't just recognize your food. Understand what's actually inside."**

FoodTruth AI is an AI-powered **Food Composition, Verification & Nutrition Intelligence Platform**. It goes beyond simple calorie counting by reconstructing what a food is made of, separating verified information from assumptions, identifying unknown ingredients, and simulating "what-if" nutritional scenarios.

## The Problem
A photo can show food, but it can't show everything inside it. Existing AI scanners pretend to know exact calories from a single image. FoodTruth AI explicitly separates what is visually detected from what is verified by evidence, and allows you to simulate the unknowns.

## Key Features
- 👁 **Visual Detection:** Uses computer vision to identify food components.
- 🔎 **Evidence Verification:** Distinguishes between Verified, Detected, Estimated, and Unknown information.
- 🧠 **Deterministic Nutrition Engine:** Calculates macros based on structured ingredient data, not hardcoded guesses.
- 🔄 **"What-If" Simulator:** Allows users to swap unknown ingredients (e.g., Maida vs. Whole Wheat) to dynamically recalculate nutrition.
- 📊 **History & Analytics:** Tracks scan history, verified confidence scores, and calorie trends.

## Technology Stack
- **Frontend:** React, Vite, Framer Motion, React Three Fiber (3D), Recharts, Vanilla CSS (CSS Modules)
- **Backend:** Node.js, Express, JWT Auth
- **Database:** MySQL
- **AI/Processing:** Mock Vision/OCR Engine (Designed to swap with OpenAI/Gemini APIs)

## Project Structure
```
foodtruth-ai/
├── client/          # Vite React Frontend
├── server/          # Node.js Express Backend
├── database/        # MySQL Schema & Seed SQL files
└── docker-compose.yml # Local database environment
```

## How to Run

### 1. Database (MySQL)
Run the database using Docker Compose, which automatically initializes the schema and seed data:
```bash
docker-compose up -d
```
*Note: If running manually, execute `database/schema.sql` and `database/seed.sql` on your MySQL instance.*

### 2. Backend
```bash
cd server
npm install
npm run start
```
*Make sure to copy `.env.example` to `.env` in the root and configure it.*

### 3. Frontend
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## Important Note
> [!WARNING]
> FoodTruth AI provides estimated nutritional information and evidence-based food composition analysis. It does not replace professional medical or nutritional advice. It explicitly states when an ingredient's composition is unknown or estimated.

## Future Improvements
- Integration with live OCR API for ingredient label scanning.
- Live integration with a Vision Model for real-time food analysis.
- User-generated recipe uploads to improve the composition database.
