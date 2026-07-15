import { Search, Sparkles } from 'lucide-react';

function SearchBar({ value, onChange, onSubmit, popularTickers, history, onHistoryClick }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#1C2541] p-6 shadow-lg shadow-black/30 transition-all duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#00B4D8]">Pencarian Saham</p>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Masukkan ticker untuk melihat prediksi.</h1>
        </div>
        <button
          type="button"
          onClick={() => onSubmit(value)}
          className="inline-flex items-center justify-center rounded-2xl bg-[#00B4D8] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:shadow-[0_0_15px_rgba(0,180,216,0.4)]"
          aria-label="Cari prediksi saham"
        >
          <Search className="mr-2 h-4 w-4" />
          Cari
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_160px]">
        <label className="relative block">
          <span className="sr-only">Cari ticker saham</span>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onSubmit(value);
              }
            }}
            type="text"
            placeholder="Contoh: AAPL, TSLA, BBCA"
            aria-label="Masukkan ticker saham"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-4 pr-14 text-sm text-white outline-none transition focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20"
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        </label>
        <div className="rounded-2xl border border-white/10 bg-slate-950/10 p-4 text-sm text-slate-200">
          <div className="mb-3 flex items-center gap-2 text-[#00B4D8]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="font-semibold">Ticker populer</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTickers.map((ticker) => (
              <button
                key={ticker}
                type="button"
                onClick={() => onSubmit(ticker)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100 transition hover:bg-[#00B4D8]/10"
              >
                {ticker}
              </button>
            ))}
          </div>
        </div>
      </div>

      {history && history.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0F172A]/70 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-300">Riwayat pencarian terakhir</p>
          <div className="flex flex-wrap gap-2">
            {history.map((ticker) => (
              <button
                key={ticker}
                type="button"
                onClick={() => onHistoryClick(ticker)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-100 transition hover:bg-[#00B4D8]/10"
              >
                {ticker}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
