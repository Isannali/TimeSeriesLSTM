import { AlertTriangle } from 'lucide-react';

function ErrorAlert({ message, inline = false }) {
  return (
    <div
      className={`rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100 ${
        inline ? 'max-w-sm' : 'mx-auto max-w-3xl'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-300" aria-hidden="true" />
        <span>{message}</span>
      </div>
    </div>
  );
}

export default ErrorAlert;
