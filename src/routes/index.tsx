import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Activity, ArrowDown, ArrowRight, ArrowUp, AudioLines, Check, Clock3, CornerDownLeft, Headphones, Pause, Play, Radio, RotateCcw, Send, ShieldAlert, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRIEFING_DURATION, briefing, getMockAnswer, risks, type SupplierRisk } from '@/lib/supply-signal';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Supply Signal | Daily AI Supply-Chain Briefing' },
    { name: 'description', content: 'Your daily voice-first intelligence briefing on AI supply-chain risk. Monitor supplier exposure, daily changes, and alternative suppliers.' },
    { property: 'og:title', content: 'Supply Signal | Daily AI Supply-Chain Briefing' },
    { property: 'og:description', content: 'A sixty-second signal on the AI supply chain: supplier risks, daily changes, and alternatives.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function RiskCard({ risk }: { risk: SupplierRisk }) {
  const points = risk.history.map((value, i) => `${i * 21},${31 - value * .3}`).join(' ');
  return <article className="risk-card">
    <div className="supplier-title"><h3>{risk.name}</h3><span className="supplier-code mono">{risk.code}</span></div>
    <div className="supplier-category mono">{risk.category}</div>
    <div className="risk-score-row"><div className="risk-score mono">{risk.score}<small>/100</small></div><div className="risk-change mono muted">{risk.change > 0 ? <ArrowUp /> : <ArrowDown />}{Math.abs(risk.change)} <span>vs. yesterday</span></div></div>
    <div className={`gauge gauge-${risk.level}`} role="meter" aria-label={`${risk.name} risk score`} aria-valuenow={risk.score} aria-valuemin={0} aria-valuemax={100}>
      <div className="gauge-track"><svg viewBox="0 0 100 4" preserveAspectRatio="none"><rect width={risk.score} height="4" fill="currentColor" /></svg></div><span className="gauge-label mono">{risk.level === 'high' ? 'HIGH RISK' : risk.level === 'moderate' ? 'ELEVATED' : 'LOW RISK'}</span>
    </div>
    <p className="risk-headline">{risk.headline}</p>
    <div className="sparkline-row"><span className="mono">7-DAY TREND</span><svg className="sparkline" viewBox="0 0 130 34" role="img" aria-label={`${risk.name} seven-day risk trend`}><path d="M0 30H130" stroke="currentColor" opacity=".15" /><polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="126" cy={31 - risk.score * .3} r="2.5" fill="currentColor" /></svg></div>
  </article>;
}

function Index() {
  const [date, setDate] = useState('OCT 07, 2026');
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [listening, setListening] = useState<number | null>(null);
  const [speechUnavailable, setSpeechUnavailable] = useState(false);
  const elapsedRef = useRef(0);
  const spokenLine = useRef(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const started = elapsed > 0 || playing;
  const finished = elapsed >= BRIEFING_DURATION;
  const currentLine = Math.min(briefing.length - 1, Math.floor(elapsed / 10));
  const line = briefing[currentLine];
  const visibleText = line ? line.text.slice(0, Math.floor(Math.max(0, elapsed - line.at) * 28)) : '';

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase());
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  function speak(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) { setSpeechUnavailable(true); onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.03;
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('en') && /Google|Samantha|Daniel|Microsoft/.test(v.name));
    if (voice) utterance.voice = voice;
    utterance.onend = () => { speechRef.current = null; onEnd?.(); };
    utterance.onerror = (event) => { if (event.error !== 'interrupted' && event.error !== 'canceled') { setSpeechUnavailable(true); onEnd?.(); } };
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    if (!playing) return;
    let previous = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now();
      elapsedRef.current = Math.min(BRIEFING_DURATION, elapsedRef.current + (now - previous) / 1000);
      previous = now;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= BRIEFING_DURATION) { setPlaying(false); window.speechSynthesis?.cancel(); }
    }, 100);
    return () => window.clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    if (!playing || spokenLine.current === currentLine || !line) return;
    spokenLine.current = currentLine;
    speak(line.text);
  }, [playing, currentLine]);

  function toggleBriefing() {
    if (playing) { setPlaying(false); window.speechSynthesis?.pause(); return; }
    setListening(null);
    if (finished) { elapsedRef.current = 0; setElapsed(0); spokenLine.current = -1; }
    if (window.speechSynthesis?.paused && speechRef.current && !finished) window.speechSynthesis.resume();
    else {
      const index = finished ? 0 : currentLine;
      const nextLine = briefing[index];
      if (nextLine) { speak(nextLine.text); spokenLine.current = index; }
    }
    setPlaying(true);
  }

  function listen(answer: string, index: number) {
    if (listening === index) { window.speechSynthesis?.cancel(); setListening(null); return; }
    setPlaying(false);
    spokenLine.current = -1;
    setListening(index);
    speak(answer, () => setListening(null));
  }

  return <main className="signal-app">
    <header className="signal-header"><div className="wordmark"><Activity aria-hidden="true" />Supply Signal</div><div className="header-right"><span className="demo-label mono muted">DEMO INTELLIGENCE</span><time className="header-date mono muted">{date}</time></div></header>
    <section className="briefing-section" aria-label="Daily voice briefing">
      <div className="briefing-eyebrow micro"><span className="status-dot" /> YOUR DAILY INTELLIGENCE, DISTILLED</div>
      <h1>The AI supply chain. In 60 seconds.</h1>
      <p className="briefing-subtitle">Critical shifts. Emerging risks. A clearer signal.</p>
      <div className={`player-stage ${playing ? 'is-playing' : ''}`}>
        <div className="player-orbit" />
        <div className="wave-wing left" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} />)}</div>
        <svg className="progress-ring" viewBox="0 0 200 200" aria-label={`Briefing progress: ${Math.floor(elapsed)} of 60 seconds`}><circle className="progress-track" cx="100" cy="100" r="96" fill="none" strokeWidth="1" /><circle className="progress-value" cx="100" cy="100" r="96" fill="none" strokeWidth="2" strokeDasharray={603.19} strokeDashoffset={603.19 * (1 - elapsed / BRIEFING_DURATION)} /></svg>
        <Button variant="briefing" onClick={toggleBriefing} aria-label={playing ? 'Pause briefing' : finished ? 'Replay today’s briefing' : 'Play today’s briefing'}>{playing ? <Pause fill="currentColor" /> : finished ? <RotateCcw /> : <Play fill="currentColor" />}<span>{playing ? 'PAUSE BRIEFING' : finished ? 'REPLAY BRIEFING' : "PLAY TODAY’S BRIEFING"}</span></Button>
        <div className="wave-wing right" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} />)}</div>
      </div>
      <div className="player-meta mono"><Headphones size={12} /><span>{playing ? 'NOW PLAYING' : finished ? 'BRIEFING COMPLETE' : started ? 'PAUSED' : 'DAILY AUDIO BRIEFING'}</span><span className="meta-divider" /><Clock3 size={11} /><span>{Math.floor(elapsed / 60).toString().padStart(2, '0')}:{Math.floor(elapsed % 60).toString().padStart(2, '0')}</span><span>/ 01:00</span></div>
      <div className="transcript"><div className="transcript-label"><span className="micro muted">{started ? 'LIVE TRANSCRIPT' : 'BRIEFING TRANSCRIPT'}</span><span className="micro muted">{finished ? <Check size={12} /> : 'EN'}</span></div><div className="transcript-content">{started ? <>{finished ? briefing.at(-1)?.text : visibleText}{playing && <span className="typing-cursor" />}</> : <span className="transcript-idle">Today's signal: export controls, memory bottlenecks, and the suppliers to watch.</span>}</div>{speechUnavailable && <p className="micro muted">Audio is unavailable in this browser. The timed transcript is still available.</p>}</div>
    </section>
    <section className="risks-section"><div className="section-heading"><h2><ShieldAlert />Top Risks Today</h2><span className="section-meta mono">03 SUPPLIERS · 7-DAY WINDOW</span></div><div className="risk-grid">{risks.map(risk => <RiskCard key={risk.name} risk={risk} />)}</div></section>
    <section className="question-section"><div className="question-heading micro"><Radio /> GO BEYOND THE BRIEFING</div><form className="question-form" onSubmit={event => { event.preventDefault(); if (!question.trim()) return; setAnswers(previous => [...previous, { question: question.trim(), answer: getMockAnswer(question) }]); setQuestion(''); }}><CornerDownLeft aria-hidden="true" /><input aria-label="Ask about supply-chain changes" placeholder="What changed since yesterday?" value={question} onChange={event => setQuestion(event.target.value)} /><Button variant="send" type="submit" aria-label="Send question" disabled={!question.trim()}><ArrowUp /></Button></form>
      <div className="answer-thread" aria-live="polite">{answers.map((item, i) => <div key={i}><div className="asked-question mono">{item.question}</div><div className="answer-bubble"><span className="micro muted">SUPPLY SIGNAL · MOCK ANALYSIS</span><p>{item.answer}</p><Button variant="signal" onClick={() => listen(item.answer, i)} aria-label={listening === i ? 'Stop listening' : 'Listen to answer'}>{listening === i ? <Square /> : <AudioLines />}{listening === i ? 'Stop' : 'Listen'}</Button></div></div>)}</div>
    </section>
    <footer><div className="alternatives-strip"><div className="alternatives-label"><Send />Alternative suppliers</div><div className="alternatives">{risks.map(risk => <div key={risk.name} className="alternative-item mono"><span>{risk.name}</span><ArrowRight /><span className="alternative-chip">{risk.alternative}</span></div>)}</div></div><div className="bottom-footer mono"><span>SUPPLY SIGNAL / INTELLIGENCE WITHOUT THE NOISE</span><span>SIMULATED DATA · NOT INVESTMENT ADVICE</span></div></footer>
  </main>;
}
