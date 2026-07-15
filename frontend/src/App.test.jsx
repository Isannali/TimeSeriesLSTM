import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

vi.mock('axios');

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    axios.create.mockReset();
  });

  test('renders dashboard and fetches prediction data', async () => {
    const getMock = vi.fn().mockResolvedValue({
      data: {
        status: 'success',
        last_close_price: 123.45,
        predicted_next_price: 130.0,
        historical_prices: [120, 121, 122, 123],
      },
    });

    axios.create.mockReturnValue({ get: getMock });

    render(<App />);

    expect(screen.getByText(/Dashboard Prediksi Saham/i)).toBeInTheDocument();

    const input = screen.getByRole('textbox', { name: /Masukkan ticker saham/i });
    fireEvent.change(input, { target: { value: 'AAPL' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(getMock).toHaveBeenCalledWith('/predict/AAPL');
    });
  });
});
