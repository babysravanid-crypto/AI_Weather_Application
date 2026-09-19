# WeatherWise

A web app that retrieves current weather by city and asks Groq to explain it in plain language.

## Run locally

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env` and add a WeatherAPI.com key plus a Groq API key.
3. Run `npm start`.
4. Open `http://localhost:3000`.

The server calls both external APIs. Keys never reach the browser.

See [docs/requirements.md](docs/requirements.md) for requirements and [docs/project-structure.md](docs/project-structure.md) for architecture notes.
