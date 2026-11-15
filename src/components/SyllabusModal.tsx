// src/components/SyllabusModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';
import { submitLead, checkEmailTypo } from '../webhook';
import { track } from '../analytics';
import { downloadMockSyllabusPdf } from '../calendar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SyllabusModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [botTrap, setBotTrap] = useState('');
  const [emailTypoHint, setEmailTypoHint] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEmail('');
      setError('');
      setSuccess(false);
      return;
    }

    track('form_open', { cta: 'syllabus' });
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailTypoHint(checkEmailTypo(val));
  };

  const applySuggestion = () => {
    if (emailTypoHint) {
      const match = emailTypoHint.match(/Did you mean (.*)\?/);
      if (match && match[1]) {
        setEmail(match[1]);
        setEmailTypoHint(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (botTrap) return;

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsSubmitting(true);
    track('syllabus_download', { email: email.trim(), name: name.trim() });

    try {
      // Record lead in background with placeholder whatsapp
      await submitLead({
        name: name.trim(),
        whatsappRaw: '9876543210', // Placeholder
        segment: 'Student',
        status: 'partial',
        cta: 'syllabus',
        email: email.trim()
      });

      // Trigger instant download
      downloadMockSyllabusPdf(name.trim());
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error generating download';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="syllabus-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-reveal"
    >
      <div className="w-full max-w-md bg-surface border border-sand-200 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-sand-200 bg-paper/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-moss-700 stroke-[1.5]" />
            <h3 id="syllabus-modal-title" className="font-display text-lg font-semibold text-ink-900">
              Download Full Curriculum Syllabus
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-900 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-moss-50 text-moss-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>
              <h4 className="font-display text-lg font-semibold text-ink-900">
                Syllabus Downloaded!
              </h4>
              <p className="text-xs text-ink-700">
                A copy has been saved to your downloads and sent to your email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <p className="text-xs text-ink-700 leading-relaxed">
                Includes the 6-week breakdown, detailed project architecture rubrics, and recommended reading resources.
              </p>

              <input
                type="text"
                name="form_antispam"
                value={botTrap}
                onChange={(e) => setBotTrap(e.target.value)}
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
              />

              <div>
                <label htmlFor="syl-name" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  Your Name <span className="text-alert-700">*</span>
                </label>
                <input
                  ref={inputRef}
                  id="syl-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full rounded-lg border border-ink-400 px-3.5 py-2.5 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label htmlFor="syl-email" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  Email Address <span className="text-alert-700">*</span>
                </label>
                <input
                  id="syl-email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="aditi@example.com"
                  className="w-full rounded-lg border border-ink-400 px-3.5 py-2.5 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
                {emailTypoHint && (
                  <div className="mt-1 text-xs text-moss-700 bg-moss-50 p-2 rounded flex items-center justify-between">
                    <span>{emailTypoHint}</span>
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="font-mono text-[10px] uppercase font-bold underline ml-2"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-xs text-alert-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center text-sm py-2.5 h-11"
              >
                <Download className="w-4 h-4 mr-2 stroke-[2]" />
                <span>{isSubmitting ? 'Generating...' : 'Download Syllabus (PDF)'}</span>
              </button>

              <p className="text-[10px] font-mono text-ink-400 text-center">
                We respect your inbox. No spam or unsolicited third-party calls.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
