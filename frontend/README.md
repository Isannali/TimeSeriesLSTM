# Stock Prediction Dashboard

Frontend dashboard built with React, Tailwind CSS, and Recharts.

## Run locally

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## API integration

The dashboard calls `GET /predict/{ticker}` on `http://localhost:8000` by default.

If your backend runs on another URL, set the `VITE_API_BASE_URL` environment variable before starting the app, for example:

```bash
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

## Notes

- Search history is saved in `localStorage`.
- The chart combines historical prices and predicted next-day price.
- Error messages surface via toast notifications and inline alert states.
