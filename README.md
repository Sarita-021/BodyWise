<!-- @format -->

# Be Bodywise Product Companion

A consumer-focused product information app for exploring Be Bodywise products, understanding listed ingredients, and keeping a personal routine journal. The app is informational and does not replace professional medical advice or guarantee product outcomes.

## Features

- Browse the product catalog by category or search product and ingredient names.
- Review product details, ingredient descriptions, source links, and usage guidance.
- Ask a question about a listed ingredient through the Gemini-powered explainer.
- Add products to a personal routine and record dated check-ins, ratings, and notes.
- Review journal history and summary statistics, with an optional product filter.

Routine selections and journal entries are stored in the current browser using `localStorage`. They are not synced to an account or shared between browsers.

## Requirements

- Node.js 20.19+ or 22.12+ (required by Vite 8)
- npm
- A Gemini API key and model ID to use the ingredient explainer
- Vercel CLI for local development of the `/api/explain` function

## Setup

Install dependencies from the project directory:

```sh
npm install
```

Create a `.env.local` file in the project root to configure the ingredient explainer:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_gemini_model_id
```

Keep API credentials private and do not commit `.env.local`.

## Development

Start the frontend with Vite:

```sh
npm run dev
```

The product catalog and browser-stored routine and journal work in this mode. The ingredient explainer uses the Vercel function at `/api/explain`, so run the app with Vercel's local development server to use the complete application:

```sh
npx vercel dev
```

The Vercel function requires both `GEMINI_API_KEY` and `GEMINI_MODEL`. It validates the requested product, ingredient, and question, and responds only with an explanation based on the supplied product data.

## Project Commands

| Command           | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the Vite frontend development server          |
| `npx vercel dev`  | Run the frontend and Vercel API function locally    |
| `npm run build`   | Type-check and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally                |
| `npm run lint`    | Run Oxlint                                          |

## Project Structure

```text
api/explain.ts                 Gemini ingredient explainer API
src/components/                Header, product, check-in, and journal UI
src/data/products.ts           Product and ingredient information
src/types/                     Product and journal data types
src/utils/journalStorage.ts    Browser localStorage persistence
src/App.tsx                    Main page and app state
src/index.css                  Application styling
```

## Data and Privacy Notes

- The product catalog is maintained in `src/data/products.ts`.
- Routine and journal entries remain in the visitor's browser storage.
- The explainer sends the selected product ID, ingredient name, and question to `/api/explain` for processing. The Gemini key is read server-side and should never be added to client code.
- Ingredient descriptions and their source links are included in the explainer context. The app presents explanations as informational and avoids guaranteed health or product claims.

## Deployment

The `api/` directory contains a Vercel serverless function. Deploy the project to Vercel and configure `GEMINI_API_KEY` and `GEMINI_MODEL` in the project's environment variables for the ingredient explainer. The frontend catalog and local journal can be deployed without those variables, but explainer requests will not work until the service is configured.
