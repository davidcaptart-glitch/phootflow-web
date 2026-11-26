import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Layers, Palette, SlidersHorizontal, Wand2, ShieldCheck,
  Download, Play, ChevronDown, Monitor, Check, ExternalLink, Info, KeyRound, Smartphone,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useI18n } from '@/i18n/context';
import type { Lang } from '@/i18n/translations';
import { DOWNLOAD_URL_WINDOWS, RELEASES_URL, APP_VERSION, MOBILE_LITE_URL, MOBILE_PRO_URL } from '@/config/download';
import ContactForm from '@/components/ContactForm';

/* ─── Motion variants ─────────────────────────────────── */
const easeExpo = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: d, ease: easeExpo },
  }),
};

/* ─── Feature icon map ────────────────────────────────── */
const featureIcons = [Sparkles, Layers, Palette, SlidersHorizontal, Wand2, ShieldCheck];

/* ─── Real screenshots of PhootFlow Desktop ──────────── */
const screens: Record<string, string> = {
  events: '/assets/screens/events.jpg',
  studio: '/assets/screens/studio.jpg',
  edits: '/assets/screens/edits.jpg',
};

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/* ─── Language toggle ─────────────────────────────────── */
function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {(['es', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
            lang === l
              ? 'bg-[#FF0080] text-white'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ─── Brand (new mark + wordmark) ─────────────────────── */
function Brand({ size = 'md' }: { size?: 'md' | 'sm' }) {
  return (
    <a href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="PhootFlow">
      <img src="/assets/mark.png" alt="" className={size === 'md' ? 'h-7 w-auto' : 'h-6 w-auto'} />
      <img src="/assets/wordmark.png" alt="PhootFlow" className={size === 'md' ? 'h-[17px] w-auto' : 'h-[15px] w-auto'} />
    </a>
  );
}

/* ─── Desktop window frame around a screenshot ─────────── */
function AppWindow({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 60px rgba(255,0,128,0.08)',
        background: '#111',
      }}
    >
      <div className="flex items-center gap-1.5 px-3 h-7" style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-[10px] text-white/30">PhootFlow</span>
      </div>
      <img src={src} alt={alt} className="w-full block" loading="lazy" />
    </div>
  );
}

/* ─── Section Tag ─────────────────────────────────────── */
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="badge-brand w-fit mb-4">
      <Sparkles className="w-3 h-3" />
      {children}
    </div>
  );
}

/* ─── Download button ─────────────────────────────────── */
function DownloadButton({ label, className = '' }: { label: string; className?: string }) {
  return (
    <motion.a
      whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,0,128,0.45)' }}
      whileTap={{ scale: 0.97 }}
      href={DOWNLOAD_URL_WINDOWS}
      className={`btn-brand gap-2 ${className}`}
    >
      <Download className="w-4 h-4" />
      {label}
    </motion.a>
  );
}

/* ─── Main ────────────────────────────────────────────── */
export default function Landing() {
  const { t } = useI18n();
  const [tab, setTab] = useState<string>('events');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const activeTab = t.workflow.tabs.find((x) => x.key === tab) ?? t.workflow.tabs[0];

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center px-4 md:px-10"
        style={{ background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Brand />

        <div className="hidden md:flex items-center gap-7 mx-auto">
          {[
            { label: t.nav.features, href: '#features' },
            { label: t.nav.workflow, href: '#workflow' },
            { label: t.nav.download, href: '#download' },
            { label: t.nav.mobile, href: '#mobile' },
            { label: t.nav.contact, href: '#contact' },
          ].map(({ label, href }) => (
            <a key={href} href={href} className="nav-link text-[13px]">{label}</a>
          ))}
        </div>

        <div className="ml-auto md:ml-0 flex items-center gap-3">
          <LangToggle />
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,0,128,0.45)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo('download')}
            className="btn-brand text-[13px] px-4 py-2"
          >
            {t.nav.getStarted}
          </motion.button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-[60px] overflow-hidden">
        <div
          className="orb w-[700px] h-[700px] animate-orb-float"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,128,0.10) 0%, transparent 70%)',
            filter: 'blur(60px)',
            top: '-200px', left: '25%',
            willChange: 'transform',
          }}
        />
        <div
          className="orb w-[500px] h-[500px] animate-orb-float-2"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,128,0.06) 0%, transparent 70%)',
            filter: 'blur(50px)',
            bottom: '-100px', right: '10%',
            willChange: 'transform',
          }}
        />
        <div className="absolute inset-0 dot-grid opacity-40" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 w-full max-w-[1240px] mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center py-20"
        >
          {/* Left: text */}
          <div>
            <motion.div custom={0.1} variants={fadeUp} initial="hidden" animate="visible">
              <div className="badge-brand w-fit mb-6">
                <Monitor className="w-3 h-3" />
                {t.hero.badge}
              </div>
            </motion.div>

            <motion.h1
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-light tracking-tight leading-[1.02] mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}
            >
              <span className="text-white/90">{t.hero.headline1}</span>
              <br />
              <span className="text-brand-gradient font-medium">{t.hero.headline2}</span>
              <br />
              <span className="text-white/90">{t.hero.headline3}</span>
            </motion.h1>

            <motion.p
              custom={0.35}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-white/50 text-[15px] leading-relaxed mb-8 max-w-[500px]"
            >
              {t.hero.sub}
            </motion.p>

            <motion.div
              custom={0.45}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <DownloadButton label={t.hero.cta} className="text-[14px] px-6 py-3" />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo('video')}
                className="btn-ghost text-[14px] px-6 py-3"
              >
                <Play className="w-4 h-4" />
                {t.hero.ctaSecondary}
              </motion.button>
            </motion.div>

            <motion.ul
              custom={0.55}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {t.hero.facts.map((fact) => (
                <li key={fact} className="flex items-center gap-2.5 text-[13px] text-white/45">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,0,128,0.15)' }}>
                    <Check className="w-2.5 h-2.5 text-[#FF0080]" strokeWidth={2.5} />
                  </span>
                  {fact}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right: real screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: easeExpo }}
          >
            <AppWindow src={screens.events} alt="PhootFlow Events" />
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1"
        >
          <ChevronDown className="w-4 h-4 text-white/20" strokeWidth={1.5} />
        </motion.div>
      </section>

      {/* ── Category Strip ──────────────────────────────────── */}
      <div className="relative py-5 overflow-hidden border-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...t.strip.items, ...t.strip.items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-6 text-[12px] text-white/25 uppercase tracking-widest font-medium">
              <span className="w-1 h-1 rounded-full bg-[#FF0080] opacity-60" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Video ───────────────────────────────────────────── */}
      <section id="video" className="pt-24 pb-4 px-4 md:px-10 scroll-mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: easeExpo }}
          className="max-w-[1100px] mx-auto flex flex-col items-center text-center"
        >
          <SectionTag>{t.video.tag}</SectionTag>
          <h2
            className="text-white/90 font-light tracking-tight mb-10"
            style={{ fontSize: 'clamp(26px, 3.2vw, 42px)', lineHeight: 1.15 }}
          >
            {t.video.headline}
          </h2>
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(255,0,128,0.18)',
              boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 80px rgba(255,0,128,0.10)',
            }}
          >
            {/* Horizontal en escritorio, vertical (formato RRSS) en móvil */}
            <video
              className="hidden md:block w-full h-auto"
              src="/assets/video/phootflow-web-boda.mp4"
              poster="/assets/video/phootflow-web-boda-poster.jpg"
              autoPlay muted loop playsInline preload="metadata"
              aria-label={t.video.headline}
            />
            <video
              className="md:hidden w-full h-auto"
              src="/assets/video/phootflow-vertical-boda.mp4"
              poster="/assets/video/phootflow-vertical-boda-poster.jpg"
              autoPlay muted loop playsInline preload="metadata"
              aria-label={t.video.headline}
            />
          </div>
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="py-28 px-4 md:px-10 scroll-mt-16">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: easeExpo }}
            className="text-center mb-16 flex flex-col items-center"
          >
            <SectionTag>{t.features.tag}</SectionTag>
            <h2
              className="text-white/90 font-light tracking-tight mb-4"
              style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', lineHeight: 1.1 }}
            >
              {t.features.headline}
            </h2>
            <p className="text-white/40 text-[15px] max-w-lg mx-auto">{t.features.sub}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.features.items.map((feat, i) => {
              const Icon = featureIcons[i];
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: easeExpo }}
                  whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(255,0,128,0.08)' }}
                  className="group p-7 rounded-2xl transition-all duration-300 cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(255,0,128,0.1)', border: '1px solid rgba(255,0,128,0.15)' }}
                  >
                    <Icon className="w-5 h-5 text-[#FF0080]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white/90 text-[15px] font-semibold mb-2">{feat.title}</h3>
                  <p className="text-white/40 text-[13px] leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Workflow + environments ──────────────────────────── */}
      <section id="workflow" className="py-28 px-4 md:px-10 relative overflow-hidden scroll-mt-16">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,0,128,0.04) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 dot-grid opacity-20" />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-14 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easeExpo }}
          >
            <SectionTag>{t.workflow.tag}</SectionTag>
            <h2
              className="text-white/90 font-light tracking-tight mb-5"
              style={{ fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1.15 }}
            >
              {t.workflow.headline}
            </h2>

            <div className="space-y-4 mb-8">
              {t.workflow.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: easeExpo }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(255,0,128,0.15)', border: '1px solid rgba(255,0,128,0.25)', color: '#FF0080' }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-white/60 text-[14px] leading-relaxed">{step}</span>
                </motion.div>
              ))}
            </div>

            <DownloadButton label={t.workflow.cta} className="text-[14px] px-6 py-3" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeExpo }}
          >
            <p className="text-white/40 text-[13px] mb-3">{t.workflow.sub}</p>
            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl mb-4"
              role="tablist"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {t.workflow.tabs.map((x) => (
                <button
                  key={x.key}
                  role="tab"
                  aria-selected={tab === x.key}
                  onClick={() => setTab(x.key)}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    tab === x.key ? 'bg-[#FF0080] text-white' : 'text-white/45 hover:text-white/75'
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <AppWindow src={screens[activeTab.key]} alt={`PhootFlow ${activeTab.label}`} />
                <p className="text-white/45 text-[13px] mt-3">
                  <span className="text-white/80 font-semibold">{activeTab.label}</span> — {activeTab.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Facts ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 md:px-10">
        <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {t.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: easeExpo }}
              className="text-center p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div
                className="text-[32px] md:text-[36px] font-light tracking-tight mb-1"
                style={{
                  background: 'linear-gradient(135deg, #FF0080 0%, #FF66C2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </div>
              <div className="text-[11px] text-white/35 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Download ──────────────────────────────────────────── */}
      <section id="download" className="py-24 px-4 md:px-10 scroll-mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeExpo }}
          className="max-w-[760px] mx-auto text-center flex flex-col items-center"
        >
          <div
            className="relative w-full p-8 md:p-12 rounded-3xl flex flex-col items-center overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse 100% 100% at 50% -20%, rgba(255,0,128,0.14) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,0,128,0.2)',
              boxShadow: '0 0 60px rgba(255,0,128,0.10)',
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,0,128,0.6), transparent)' }} />
            <img src="/assets/icon.png" alt="" className="w-16 h-16 rounded-2xl mb-6" />
            <SectionTag>{t.download.tag}</SectionTag>
            <h2
              className="text-white/90 font-light tracking-tight mb-4"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', lineHeight: 1.1 }}
            >
              {t.download.headline}
            </h2>
            <p className="text-white/45 text-[14px] mb-8 max-w-lg mx-auto">{t.download.sub}</p>

            <DownloadButton label={t.download.button} className="text-[15px] px-8 py-3.5 mb-4" />

            <p className="text-white/45 text-[12px]">
              {APP_VERSION && <>{t.download.version} {APP_VERSION} · </>}
              {t.download.requirements}
            </p>
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white/75 transition-colors mt-2"
            >
              {t.download.allVersions}
              <ExternalLink className="w-3 h-3" />
            </a>

            <div
              className="mt-8 w-full max-w-[560px] flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl text-left"
              style={{ background: 'rgba(255,0,128,0.08)', border: '1px solid rgba(255,0,128,0.3)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,0,128,0.15)' }}>
                <KeyRound className="w-5 h-5 text-[#FF0080]" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <div className="text-white/90 text-[14px] font-semibold mb-0.5">{t.download.license.title}</div>
                <p className="text-white/50 text-[12.5px] leading-relaxed">{t.download.license.desc}</p>
              </div>
              <button onClick={() => scrollTo('contact')} className="btn-ghost text-[13px] px-4 py-2 whitespace-nowrap">
                {t.download.license.cta}
              </button>
            </div>

            <ul className="mt-6 space-y-2.5 text-left max-w-[560px]">
              {t.download.notes.map((note) => (
                <li key={note} className="flex items-start gap-2.5 text-[12px] text-white/40 leading-relaxed">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/30" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* ── Mobile apps ─────────────────────────────────────── */}
      <section id="mobile" className="py-24 px-4 md:px-10 scroll-mt-16">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: easeExpo }}
            className="text-center mb-12 flex flex-col items-center"
          >
            <SectionTag>{t.mobile.tag}</SectionTag>
            <h2
              className="text-white/90 font-light tracking-tight mb-4"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', lineHeight: 1.1 }}
            >
              {t.mobile.headline}
            </h2>
            <p className="text-white/45 text-[15px] max-w-xl mx-auto">{t.mobile.sub}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { key: 'lite', name: t.mobile.lite.name, audience: t.mobile.lite.audience, badge: t.mobile.tag, desc: t.mobile.lite.desc, points: t.mobile.lite.points, note: '', cta: t.mobile.lite.cta, url: MOBILE_LITE_URL, primary: true },
              { key: 'pro', name: t.mobile.pro.name, audience: t.mobile.pro.audience, badge: t.mobile.pro.badge, desc: t.mobile.pro.desc, points: t.mobile.pro.points, note: t.mobile.pro.note, cta: t.mobile.pro.cta, url: MOBILE_PRO_URL, primary: false },
            ].map((app, i) => (
              <motion.div
                key={app.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: easeExpo }}
                className="p-7 md:p-8 rounded-3xl flex flex-col"
                style={{
                  background: app.primary ? 'radial-gradient(ellipse 100% 100% at 50% -20%, rgba(255,0,128,0.12) 0%, rgba(255,255,255,0.02) 100%)' : 'rgba(255,255,255,0.03)',
                  border: app.primary ? '1px solid rgba(255,0,128,0.25)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <img src="/assets/mark.png" alt="" className="h-9 w-auto" />
                  <div className="flex flex-col">
                    <span className="text-white/90 text-[17px] font-semibold">{app.name}</span>
                    <span className="text-[#FF4DA6] text-[12px] font-semibold uppercase tracking-widest">{app.audience}</span>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-white/50 px-2.5 py-1 rounded-full whitespace-nowrap" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Smartphone className="w-3 h-3" />
                    {app.badge}
                  </span>
                </div>
                <p className="text-white/65 text-[14px] leading-relaxed mb-5">{app.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {app.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-[13px] text-white/55">
                      <span className="w-4 h-4 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,0,128,0.15)' }}>
                        <Check className="w-2.5 h-2.5 text-[#FF0080]" strokeWidth={2.5} />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                {app.note && <p className="text-white/45 text-[12px] leading-relaxed mb-5">{app.note}</p>}
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${app.primary ? 'btn-brand' : 'btn-ghost'} gap-2 text-[14px] px-6 py-3 mt-auto justify-center`}
                >
                  <Smartphone className="w-4 h-4" />
                  {app.cta}
                </motion.a>
              </motion.div>
            ))}
          </div>

          <ul className="mt-8 space-y-2.5 max-w-[620px] mx-auto">
            {[t.mobile.install, t.mobile.license].map((note) => (
              <li key={note} className="flex items-start gap-2.5 text-[12.5px] text-white/45 leading-relaxed">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/30" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────── */}
      <section id="contact" className="pb-24 px-4 md:px-10 scroll-mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeExpo }}
          className="max-w-[760px] mx-auto flex flex-col items-center text-center"
        >
          <SectionTag>{t.contact.tag}</SectionTag>
          <h2
            className="text-white/90 font-light tracking-tight mb-3"
            style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', lineHeight: 1.1 }}
          >
            {t.contact.headline}
          </h2>
          <p className="text-white/40 text-[14px] mb-8 max-w-lg">{t.contact.sub}</p>
          <div
            className="w-full p-6 md:p-8 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <ContactForm />
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer
        className="px-4 md:px-10 pt-14 pb-8"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-12">
            <div>
              <div className="mb-4"><Brand size="sm" /></div>
              <p className="text-white/30 text-[13px] leading-relaxed max-w-[260px]">{t.footer.tagline}</p>
            </div>

            <div>
              <h4 className="text-white/60 text-[12px] font-semibold uppercase tracking-widest mb-4">{t.footer.product}</h4>
              <ul className="space-y-2.5">
                {[
                  { label: t.footer.links.features, href: '#features' },
                  { label: t.footer.links.workflow, href: '#workflow' },
                  { label: t.footer.links.download, href: '#download' },
                  { label: t.nav.mobile, href: '#mobile' },
                  { label: t.footer.links.contact, href: '#contact' },
                  { label: t.footer.links.releases, href: RELEASES_URL, external: true },
                ].map(({ label, href, external }) => (
                  <li key={href}>
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-white/30 text-[13px] hover:text-white/65 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="text-white/20 text-[12px]">{t.footer.copyright}</span>
            <LangToggle />
          </div>
        </div>
      </footer>
    </div>
  );
}
