import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SpendWise header', () => {
  render(<App />);
  const headerElement = screen.getByText(/SpendWise - The Fun Financial Advisor/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders all navigation tabs', () => {
  render(<App />);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Add Income')).toBeInTheDocument();
  expect(screen.getByText('Add Expense')).toBeInTheDocument();
  expect(screen.getByText('Goals')).toBeInTheDocument();
  expect(screen.getByText('Financial Advisor')).toBeInTheDocument();
});