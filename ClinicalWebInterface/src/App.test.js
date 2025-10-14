import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login or header', () => {
  render(<App />);
  // App.tsx renders AppHeader; unauthenticated defaults to Login route
  const headerBrand = screen.getByText(/Clinical Interface/i);
  expect(headerBrand).toBeInTheDocument();
});
