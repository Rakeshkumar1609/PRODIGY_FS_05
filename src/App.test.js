import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the social dashboard and composer', () => {
  render(<App />);

  expect(screen.getByText(/PulseBoard/i)).toBeInTheDocument();
  expect(screen.getByText(/Share a post/i)).toBeInTheDocument();
  expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
});
