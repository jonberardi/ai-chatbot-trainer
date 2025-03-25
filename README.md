# AI Chatbot Trainer

An interactive AI chatbot training application that allows instructors to create personas for students to interact with. The chatbot interacts with students while recording and evaluating their responses based on custom criteria. Students receive coaching and scoring, and all interactions and evaluations are logged for reporting.

## Features

- **Custom Persona Creation**: Create chatbot personas with defined attributes and conversation styles
- **Interactive Chat Interface**: Real-time chat interaction between students and AI personas
- **Evaluation Criteria Setup**: Define custom evaluation criteria for each persona
- **Automated Evaluation**: Evaluate student responses against defined criteria
- **Performance Reporting**: Generate detailed feedback and performance analytics
- **Progress Tracking**: Monitor student improvement over multiple sessions

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Cloudflare Workers, D1 Database
- **AI Integration**: OpenAI API
- **Visualization**: Chart.js

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Cloudflare account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-chatbot-trainer.git
cd ai-chatbot-trainer
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
   - Create a `.env.local` file with the following content:
   ```
   OPENAI_API_KEY=your_api_key
   ```

4. Initialize the database:
```bash
npx wrangler d1 execute DB --local --file=migrations/0001_initial.sql
```

5. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

6. Access the application at http://localhost:3000

## Deployment

See the [Deployment Guide](deployment-guide.md) for instructions on deploying to Cloudflare.

## Documentation

- [User Documentation](user-documentation.md): Guide for instructors and students
- [Technical Documentation](technical-documentation.md): System architecture and API reference
- [Deployment Guide](deployment-guide.md): Instructions for local and production deployment

## License

MIT
