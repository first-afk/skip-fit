# skip-fit

Skip Fit is a lightweight fitness-tracking web app to log workouts, quick-add common activities, and schedule simple calendar reminders. It uses a local mock API (localStorage) for data persistence during development.

## Why React

React and the Context API were chosen for straightforward state management across components, making it easy to mock and share app state (user, activity logs) without adding extra dependencies.

## Features

- Log activities with duration and calories
- Quick-add common activities
- Schedule reminders (exports an .ics file)
- Uses a local mock API backed by `localStorage` for easy development

## Getting Started

Prerequisites: Node.js (14+ recommended)

1. Clone the repo and install dependencies:

```bash
git clone <https://github.com/first-afk/skip-fit.git>
cd client
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open the app in your browser at `http://localhost:5173` (Vite default).

## Notes

- The app uses a mock API located at `client/src/assets/mockApi.ts` that persists data to `localStorage` under the key `fitness_db`.
- Authentication is mocked; first login creates a demo user and seed activity data.
- To reset app data, clear `localStorage` for the app/domain.

## Troubleshooting

- If `npm run dev` fails, ensure you are in the `client` directory and Node is up to date.

### Deployed URL

`skip-fit.vercel.app`

## License

This project is provided as-is for learning and prototyping.
