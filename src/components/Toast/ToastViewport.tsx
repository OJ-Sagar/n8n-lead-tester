import type { ToastMessage } from '../../types/lead';

interface ToastViewportProps {
  toasts: ToastMessage[];
}

export function ToastViewport({ toasts }: ToastViewportProps) {
  return (
    <div className="toast-c" id="toastC" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.exiting ? 'out' : ''}`}>
          <span className={`tdot ${toast.type}`} />
          <span>{toast.msg}</span>
        </div>
      ))}
    </div>
  );
}
