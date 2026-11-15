import React from 'react';
import { X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export interface ModalHeaderMeta {
  icon: React.ReactNode;
  iconClassName?: string;
  title: React.ReactNode;
  titleClassName?: string;
  badge?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'centered' | 'floating';
  backdropClassName?: string;
  floatingClassName?: string;
  panelClassName: string;
  headerClassName: string;
  headerMeta?: ModalHeaderMeta;
  headerContent?: React.ReactNode;
  headerActions?: React.ReactNode;
  closeButtonClassName?: string;
  closeIconClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  children: React.ReactNode;
}

/**
 * Shared modal backdrop, frame, header chrome, and sound-enabled close button.
 */
export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  variant = 'centered',
  backdropClassName = 'bg-slate-900/30',
  floatingClassName = 'fixed inset-x-4 bottom-4 md:inset-x-auto md:left-8 md:bottom-8 md:w-[580px] z-40 animate-fade-in select-none font-sans',
  panelClassName,
  headerClassName,
  headerMeta,
  headerContent,
  headerActions,
  closeButtonClassName = 'p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors',
  closeIconClassName = 'w-5 h-5',
  footer,
  footerClassName = 'p-4 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 font-medium',
  children,
}) => {
  if (!isOpen) return null;

  const wrapperClass =
    variant === 'floating'
      ? floatingClassName
      : `fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in font-sans ${backdropClassName}`;

  const handleCloseClick = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className={wrapperClass}>
      <div className={panelClassName}>
        <div className={headerClassName}>
          {headerMeta ? (
            <div className="flex items-center gap-3">
              <div
                className={
                  headerMeta.iconClassName ??
                  'w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0369A1]'
                }
              >
                {headerMeta.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className={
                      headerMeta.titleClassName ??
                      'text-xl font-extrabold text-slate-900 tracking-tight'
                    }
                  >
                    {headerMeta.title}
                  </h2>
                  {headerMeta.badge}
                </div>
                {headerMeta.subtitle}
              </div>
            </div>
          ) : (
            headerContent
          )}

          <div className="flex items-center gap-2">
            {headerActions}
            <button
              type="button"
              aria-label="Close modal"
              onClick={handleCloseClick}
              className={closeButtonClassName}
            >
              <X className={closeIconClassName} />
            </button>
          </div>
        </div>

        {children}

        {footer && <div className={footerClassName}>{footer}</div>}
      </div>
    </div>
  );
};
