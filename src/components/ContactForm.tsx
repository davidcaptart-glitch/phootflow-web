import { useState, type FormEvent } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useI18n } from '@/i18n/context';
import { CONTACT_ENDPOINT } from '@/config/contact';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const fieldClass =
  'w-full rounded-xl px-4 py-3 text-[14px] text-white/90 placeholder:text-white/25 outline-none transition-colors ' +
  'bg-white/[0.04] border border-white/10 focus:border-[#FF0080]/60 focus:bg-white/[0.06]';

export default function ContactForm() {
  const { t } = useI18n();
  const c = t.contact;
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('_honey')) return; // bots
    setStatus('sending');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === 'false' || json.success === false) throw new Error(json.message || res.statusText);
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-10">
        <CheckCircle2 className="w-10 h-10 text-[#FF0080]" strokeWidth={1.5} />
        <p className="text-white/80 text-[15px]">{c.sent}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full text-left space-y-4">
      {/* Configuración de FormSubmit */}
      <input type="hidden" name="_subject" value="PhootFlow · Nueva solicitud desde phootflow.com" />
      <input type="hidden" name="_template" value="table" />
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <label className="block">
        <span className="block text-[12px] text-white/50 mb-1.5">{c.name} *</span>
        <input name="name" required minLength={3} maxLength={120} autoComplete="name" placeholder={c.namePlaceholder} className={fieldClass} />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-[12px] text-white/50 mb-1.5">{c.email} *</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder={c.emailPlaceholder} className={fieldClass} />
        </label>
        <label className="block">
          <span className="block text-[12px] text-white/50 mb-1.5">{c.phone} *</span>
          <input
            name="telefono"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="\+?[0-9 ]{9,20}"
            title="600 000 000 / +34 600 000 000"
            placeholder={c.phonePlaceholder}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="block text-[12px] text-white/50 mb-1.5">{c.reason} *</span>
        <select name="motivo" defaultValue={c.reasons[0]} className={`${fieldClass} appearance-none`}>
          {c.reasons.map((r) => (
            <option key={r} value={r} className="bg-[#111] text-white">{r}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="block text-[12px] text-white/50 mb-1.5">{c.message} <span className="text-white/30">({c.optional})</span></span>
        <textarea name="message" rows={4} maxLength={4000} placeholder={c.messagePlaceholder} className={`${fieldClass} resize-y`} />
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" name="consentimiento" value="Sí" required className="mt-0.5 w-4 h-4 accent-[#FF0080] flex-shrink-0" />
        <span className="text-[12.5px] text-white/50 leading-relaxed">{c.consent} *</span>
      </label>

      {status === 'error' && (
        <p className="flex items-center gap-2 text-[13px] text-red-400">
          <AlertCircle className="w-4 h-4" /> {c.error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <span className="text-[12px] text-white/30">{c.privacy}</span>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-brand gap-2 text-[14px] px-6 py-3 disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          {status === 'sending' ? c.sending : c.send}
        </button>
      </div>
    </form>
  );
}
