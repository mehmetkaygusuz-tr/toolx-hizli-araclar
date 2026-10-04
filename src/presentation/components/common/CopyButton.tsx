import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from '../../../application/hooks/useClipboard';
import { useSound } from '../../../application/hooks/useSound';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Kopyala',
  className = '',
  iconOnly = false,
}) => {
  const { copied, copy } = useClipboard();
  const { playSuccess } = useSound();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copy(text);
    playSuccess();
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Kopyalandı!' : label}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
        copied
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/60'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          {!iconOnly && <span>Kopyalandı</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400" />
          {!iconOnly && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
