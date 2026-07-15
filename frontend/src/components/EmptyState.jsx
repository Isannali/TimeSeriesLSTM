import { Search } from 'lucide-react';

function EmptyState() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#1C2541] p-10 text-center shadow-lg shadow-black/30 transition-all duration-300">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0B132B] text-[#00B4D8] shadow-[0_0_30px_rgba(0,180,216,0.12)]">
        <Search className="h-10 w-10" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-semibold text-white">Mulai dengan mencari ticker</h2>
      <p className="mt-3 max-w-xl mx-auto text-sm text-slate-300">
        Masukkan ticker saham seperti AAPL, TSLA, BBCA, atau GOTO untuk melihat ringkasan harga dan prediksi harga.
      </p>
    </div>
  );
}

export default EmptyState;
