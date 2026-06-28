# Fullstack AI Agent

An AI-powered chatbot API built with NestJS that can search for products and convert currencies using OpenAI Function Calling.

## Features

- 🤖 OpenAI GPT-4.1 integration with Function Calling
- 🔍 Product search from CSV database
- 💱 Real-time currency conversion via Open Exchange Rates API
- 📚 Automatic API documentation with Swagger
- 🎨 Next.js frontend UI

## Prerequisites

- Node.js 20+
- npm or yarn
- OpenAI API key
- Open Exchange Rates API key

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd fullstack-agent
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```
OPENAI_API_KEY=your_openai_api_key
EXCHANGE_RATES_API_KEY=your_exchange_rates_api_key
PORT=3001
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file in `frontend/`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running Locally

### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

Backend runs on `http://localhost:3001`

API Documentation: `http://localhost:3001/api/docs`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Usage

### POST /chat

Send a user query to the chatbot.

**Request:**
```json
{
  "input": "Do you have any iPhones in stock? What's the price in EUR?"
}
```

**Response:**
```json
{
  "response": "Yes, we have iPhones in stock...",
  "products": [
    {
      "displayTitle": "iPhone 12",
      "price": "900.0 USD",
      "imageUrl": "https://...",
      "url": "https://..."
    }
  ],
  "conversions": [
    {
      "from": "900 USD",
      "to": "790.20 EUR"
    }
  ]
}
```

**Try with Swagger:** `http://localhost:3001/api/docs`

## Example Queries

- "I am looking for a phone"
- "I am looking for a present for my dad"
- "How much does a watch cost?"
- "What is the price of the watch in Euros?"
- "How many Canadian Dollars are 350 Euros?"

## Architecture

### Backend (NestJS)

- **ChatController** — REST endpoint `/chat`
- **ChatService** — OpenAI Function Calling orchestration
- **SearchProductsService** — CSV product search
- **ConvertCurrenciesService** — Currency conversion via API

### Frontend (Next.js)

- Clean chat UI with product cards
- Real-time currency conversion display
- Responsive design with Tailwind CSS

## Deployment

The app is deployed on Railway with auto-deploy on push.

**Production URLs:**
- Backend: `https://wizyagent-production.up.railway.app`
- Frontend: `https://friendly-laughter-production.up.railway.app`

## Technologies

- **Backend:** NestJS, TypeScript, OpenAI API
- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Documentation:** Swagger/OpenAPI
- **Infrastructure:** Docker, Railway, GitHub Actions CI/CD
