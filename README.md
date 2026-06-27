# Wizybot — AI Customer Support Agent

AI-powered chatbot with access to product search and currency conversion tools. Built with NestJS, Next.js, and OpenAI.

## Tech Stack

- **Backend**: NestJS + TypeScript
- **Frontend**: Next.js + React + Tailwind CSS
- **LLM**: OpenAI (gpt-4)
- **APIs**: Open Exchange Rates
- **Deployment**: Docker + Railway
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js 20+
- npm or yarn
- Docker & Docker Compose
- OpenAI API key
- Open Exchange Rates API key

## Setup

### 1. Environment Variables

Create `.env` files:

**`backend/.env`**:
```
OPENAI_API_KEY=your-openai-key
EXCHANGE_RATES_API_KEY=your-exchange-rates-key
PORT=3001
```

**`frontend/.env.local`**:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Development

Run both services locally:

**Terminal 1 - Backend**:
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Access the app at **http://localhost:3000**

## Docker

Run everything with Docker Compose:

```bash
docker-compose up
```

## API Endpoints

### Chat Endpoint

**POST** `/chat`

Request:
```json
{
  "model": "gpt-4",
  "input": "I am looking for a phone"
}
```

Response:
```json
{
  "response": "Based on your search, I found..."
}
```

## Testing

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## Build

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Deployment

Deployed on Railway with automatic CI/CD pipeline:

1. Push to GitHub
2. GitHub Actions runs lint, test, build
3. If all pass, Railway auto-deploys

## Project Structure

```
wizyagent/
├── backend/
│   ├── src/
│   │   ├── chat/
│   │   ├── providers/
│   │   └── main.ts
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── app/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## License

MIT
