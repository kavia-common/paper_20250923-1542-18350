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

### API note for Login (Demo)

The demo login flow is now frontend-only. Clicking "Sign In" on `/login` sets a localStorage flag and navigates to `/dashboard` without calling the backend. Running the Express demo API is no longer required for login or navigation.

If you still want to explore the demo API for other endpoints, you can start it:

- `npm run start:api` to run a lightweight Express API at http://localhost:4000
- The CRA dev server proxy (`"proxy": "http://localhost:4000"`) forwards `/api/*` in development.

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

The proxy remains configured, but the login flow does not depend on the backend.

Security note: Do not use these settings in production. Builds created with `npm run build` do not use the dev server and are unaffected.

## Login and Logout Flow (Demo)

- Navigate to `/login`
- Click "Sign In" to be redirected to `/dashboard`.
- Protected routes are guarded by a localStorage flag `auth.isAuthenticated === "true"`.
- A "Logout" button appears in the top navigation when authenticated. Clicking it clears client auth state and redirects to `/login`.
- Visiting `/` redirects to `/dashboard` when authenticated, and to `/login` otherwise.

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
