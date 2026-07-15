import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { TrendingUp } from 'lucide-react';
import SearchBar from './components/SearchBar';
import StockSummaryCard from './components/StockSummaryCard';
import PriceChart from './components/PriceChart';
import SkeletonLoader from './components/SkeletonLoader';
import EmptyState from './components/EmptyState';
import ErrorAlert from './components/ErrorAlert';

const STORAGE_HISTORY_KEY = 'stock-dashboard-search-history';
const STORAGE_CACHE_KEY = 'stock-dashboard-cache-meta';
const popularTickers = ['AAPL', 'TSLA', 'BBCA', 'GOTO'];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [query, setQuery] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [cacheMeta, setCacheMeta] = useState({});

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_HISTORY_KEY);
    const savedCache = localStorage.getItem(STORAGE_CACHE_KEY);

    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    if (savedCache) {
      setCacheMeta(JSON.parse(savedCache));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(cacheMeta));
  }, [cacheMeta]);

  const cachedStatus = useMemo(() => {
    if (!stockData) return null;
    const meta = cacheMeta[stockData.ticker.toUpperCase()];
    if (!meta?.lastFetched) return null;
    const minutes = Math.max(0, Math.round((Date.now() - meta.lastFetched) / 60000));
    return `Data cached · diperbarui ${minutes} menit lalu`;
  }, [cacheMeta, stockData]);

  const saveSearchHistory = (ticker) => {
    const normalized = ticker.toUpperCase();
    setSearchHistory((current) => {
      const filtered = current.filter((value) => value !== normalized);
      return [normalized, ...filtered].slice(0, 5);
    });
  };

  const saveCacheMeta = (ticker) => {
    const normalized = ticker.toUpperCase();
    setCacheMeta((current) => ({
      ...current,
      [normalized]: {
        lastFetched: Date.now(),
      },
    }));
  };

  const getAxios = () => {
    return axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
  };

  const fetchPrediction = async (ticker) => {
    const normalized = ticker.trim().toUpperCase();
    if (!normalized) {
      toast.error('Silakan masukkan ticker saham terlebih dahulu.');
      return;
    }

    setLoading(true);
    setChartError(null);

    const client = getAxios();
    let response = null;
    let retry = false;

    try {
      response = await client.get(`/predict/${encodeURIComponent(normalized)}`);
    } catch (error) {
      if (error.code === 'ECONNABORTED' && !retry) {
        retry = true;
        try {
          response = await client.get(`/predict/${encodeURIComponent(normalized)}`);
        } catch (retryError) {
          response = null;
          throw retryError;
        }
      } else {
        throw error;
      }
    }

    if (!response) {
      return;
    }

    const payload = response.data;

    if (payload?.status !== 'success') {
      toast.error('Respons API tidak valid. Coba lagi dengan ticker lain.');
      setChartError('Data tidak valid untuk ticker ini.');
      setStockData(null);
      setLoading(false);
      return;
    }

    setStockData({
      ticker: normalized,
      last_close_price: payload.last_close_price,
      predicted_next_price: payload.predicted_next_price,
      historical_prices: payload.historical_prices,
    });
    saveSearchHistory(normalized);
    saveCacheMeta(normalized);
    setLoading(false);
  };

  const handleSearch = async (ticker) => {
    try {
      await fetchPrediction(ticker);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        toast.error('Data ticker tidak ditemukan atau kurang dari 10 hari.');
        setChartError('Data tidak mencukupi untuk menampilkan grafik.');
      } else if (status === 500) {
        toast.error('Terjadi kesalahan server. Silakan coba lagi nanti.');
        setChartError('Server mengembalikan kesalahan internal.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Gagal terhubung ke server, coba lagi.');
        setChartError('Timeout koneksi.');
      } else {
        toast.error('Gagal mengambil data. Periksa koneksi dan coba lagi.');
        setChartError('Terjadi kesalahan jaringan.');
      }
      setStockData(null);
      setLoading(false);
    }
  };

  const handleHistoryClick = (ticker) => {
    setQuery(ticker);
    handleSearch(ticker);
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#141B38]/80 p-6 shadow-lg shadow-black/30 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              <TrendingUp className="h-6 w-6 text-[#00B4D8]" aria-hidden="true" />
              Dashboard Prediksi Saham
            </div>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Cari ticker saham, lihat ringkasan harga terakhir, dan prediksi besok dalam visualisasi interaktif.
            </p>
          </div>
        </header>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => handleSearch(query)}
          popularTickers={popularTickers}
          history={searchHistory}
          onHistoryClick={handleHistoryClick}
        />

        <div className="mt-8">
          {loading ? (
            <SkeletonLoader />
          ) : stockData ? (
            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
              <StockSummaryCard
                ticker={stockData.ticker}
                lastClose={stockData.last_close_price}
                predictedNext={stockData.predicted_next_price}
                cacheLabel={cachedStatus}
              />
              <div className="rounded-3xl border border-white/10 bg-[#1C2541] p-6 shadow-lg shadow-black/30 transition-all duration-300">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Grafik Harga</h2>
                    <p className="text-sm text-slate-400">Histori harga saham dan prediksi harga besok.</p>
                  </div>
                  {chartError ? <ErrorAlert message={chartError} inline /> : null}
                </div>
                <PriceChart
                  historicalPrices={stockData.historical_prices}
                  predictedNextPrice={stockData.predicted_next_price}
                />
              </div>
            </div>
          ) : chartError ? (
            <ErrorAlert message={chartError} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
          },
        }}
      />
    </div>
  );
}

export default App;
