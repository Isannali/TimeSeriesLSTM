import { AlertTriangle } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const formatCurrency = (value) => {
  if (value == null) {
    return '-';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

function buildChartData(historicalPrices, predictedNextPrice) {
  if (!Array.isArray(historicalPrices) || historicalPrices.length === 0) {
    return [];
  }

  const today = new Date();
  const days = historicalPrices.length;
  const records = historicalPrices.map((price, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - index - 1));

    return {
      label: formatDate(date),
      historical: price,
      predicted: index === days - 1 ? price : null,
      isToday: index === days - 1,
    };
  });

  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);

  records.push({
    label: formatDate(nextDay),
    historical: null,
    predicted: predictedNextPrice,
    isPredicted: true,
  });

  return records;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const historyPayload = payload.find((items) => items.dataKey === 'historical');
  const predictPayload = payload.find((items) => items.dataKey === 'predicted');

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F172A]/95 p-4 text-sm text-slate-100 shadow-lg shadow-black/40">
      <p className="mb-2 font-semibold text-[#00B4D8]">{label}</p>
      {historyPayload ? (
        <p className="text-slate-200">Histori: {formatCurrency(historyPayload.value)}</p>
      ) : null}
      {predictPayload ? (
        <p className="mt-1 text-slate-200">Prediksi: {formatCurrency(predictPayload.value)}</p>
      ) : null}
    </div>
  );
}

function CustomDot({ cx, cy, payload }) {
  if (!payload || (!payload.isToday && !payload.isPredicted)) {
    return null;
  }

  const color = payload.isPredicted ? '#FF5A5F' : '#10B981';
  const label = payload.isPredicted ? 'Predicted' : 'Today';

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />
      <text x={cx} y={cy - 12} fill="#f8fafc" fontSize="11" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function PriceChart({ historicalPrices, predictedNextPrice }) {
  const data = buildChartData(historicalPrices, predictedNextPrice);

  if (!historicalPrices || historicalPrices.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0B132B]/80 p-6 text-slate-300">
        <AlertTriangle className="mb-3 h-10 w-10 text-[#FF5A5F]" />
        <p>Data historis tidak tersedia untuk membuat grafik.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[360px] w-full">
      <ResponsiveContainer width="100%" height={360}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCurrency}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#0B132B', strokeWidth: 2 }} />
          <Area
            type="monotone"
            dataKey="historical"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#historicalGradient)"
            activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#FF5A5F"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={(props) => <CustomDot {...props} />}
            activeDot={false}
            connectNulls
            strokeLinecap="round"
          />
          <Line
            type="monotone"
            dataKey="historical"
            stroke="transparent"
            dot={(props) => <CustomDot {...props} />}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Harga historis
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#FF5A5F]" /> Prediksi besok
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-slate-300">
          <AlertTriangle className="h-4 w-4 text-[#FF5A5F]" /> Titik Today & Predicted
        </span>
      </div>
    </div>
  );
}

export default PriceChart;
