import { ArrowDownRight, ArrowUpRight, Clock3 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function AnimatedPrice({ value, label, prefix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef(null);
  const lastValueRef = useRef(0);

  useEffect(() => {
    const start = lastValueRef.current || 0;
    const duration = 700;
    const startTime = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = start + (value - start) * eased;
      setDisplayValue(nextValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
    lastValueRef.current = value;

    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
        {prefix}
        {displayValue.toLocaleString('id-ID', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </p>
    </div>
  );
}

function StockSummaryCard({ ticker, lastClose, predictedNext, cacheLabel }) {
  const change = predictedNext - lastClose;
  const percentage = lastClose > 0 ? (change / lastClose) * 100 : 0;
  const positive = percentage >= 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#1C2541] p-6 shadow-lg shadow-black/30 transition-all duration-300 hover:shadow-[0_0_18px_rgba(0,180,216,0.2)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#00B4D8]">Ringkasan Saham</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{ticker}</h2>
        </div>
        {cacheLabel ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#00B4D8]" aria-hidden="true" />
              <span>{cacheLabel}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl bg-[#0F172A] p-5">
          <AnimatedPrice value={lastClose} label="Harga Terakhir" prefix="Rp " />
        </div>

        <div className="rounded-3xl bg-[#0F172A] p-5">
          <AnimatedPrice value={predictedNext} label="Prediksi Harga Besok" prefix="Rp " />
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-[#0B132B] p-4">
          <div
            className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold ${
              positive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
            }`}
          >
            {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {positive ? '+' : ''}
            {percentage.toFixed(1)}%
          </div>
          <p className="text-sm text-slate-400">
            {positive ? 'Prediksi naik dibanding harga terakhir' : 'Prediksi turun dibanding harga terakhir'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StockSummaryCard;
