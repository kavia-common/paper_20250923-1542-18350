# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

If you are using a remote preview URL and you see "Invalid Host header", see the section "Fix Invalid Host header (Preview)".

### `npm run start:api`

Starts a lightweight Express API at http://localhost:4000 providing:
- POST `/api/login` (validates hardcoded credentials: `login@papaer.com` / `Pass@123`)
- GET `/api/me`
- POST `/api/logout`

The React app is configured with a development proxy (`"proxy": "http://localhost:4000"`) so any frontend request to `/api/*` is forwarded to this API while running `npm start`.

To test end-to-end locally, open two terminals:
1. Terminal A: `npm run start:api`
2. Terminal B: `npm start`

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Fix "Invalid Host header" (Preview)

Some preview environments access the CRA dev server via a non-local hostname. Webpack Dev Server performs host checks and will show "Invalid Host header".  
This project includes a development-only override file `.env.development` with:

- `HOST=0.0.0.0` to bind the dev server on all interfaces
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` to allow external preview hosts during development

These settings apply only to `npm start` and do not affect production builds.

No changes are required to the proxy: `"proxy": "http://localhost:4000"` remains active so `/api/*` calls are forwarded to the local dev API.

Security note: Do not use these settings in production. Builds created with `npm run build` do not use the dev server and are unaffected.

## Login Flow (Demo)

- Navigate to `/login`
- Use credentials: `login@papaer.com` and `Pass@123`
- On success, you are redirected to `/dashboard`. A simple localStorage flag guards protected routes.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
