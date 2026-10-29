import Lenis from 'lenis'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './App.css'
import blazer from './assets/photos/blazer.webp'
import headshot from './assets/photos/headshot.webp'
import lions from './assets/photos/lions-squad.webp'
import {
  Counter,
  Cursor,
  Loader,
  Magnetic,
  Reveal,
  ScrollProgress,
  SplitText,
  TiltCard,
  VelocityMarquee,
  WordCycler,
} from './components/effects'
import { useProjects } from './projects'
import { Guestbook } from './Guestbook'
import { ProjectArt } from './components/ProjectArt'
import { ease } from './motion'
import { education, experience, leadership, profile, skills, stats } from './data'

const CricketBall = lazy(() => import('./components/CricketBall'))
const RESUME = '/Aathyanth_Lekshman_Resume.pdf'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 300)
    setScrolled(y > 40)
  })
  return (
    <motion.header
      className={`nav ${scrolled ? 'nav-scrolled' : ''}`}
      animate={{ y: hidden ? '-120%' : '0%' }}
      transition={{ duration: 0.5, ease }}
    >
      <a href="#top" className="nav-logo" data-cursor="Top">
        AL<span>.</span>
      </a>
      <nav aria-label="Main navigation">
        {[
          ['Work', '#work'],
          ['About', '#about'],
          ['Experience', '#experience'],
          ['Guestbook', '#guestbook'],
          ['Contact', '#contact'],
        ].map(([label, href]) => (
          <a key={href} href={href} className="nav-link">
            <span data-text={label}>{label}</span>
          </a>
        ))}
      </nav>
      <Magnetic>
        <a href={RESUME} className="nav-cta" target="_blank" rel="noreferrer" data-cursor="PDF">
          Résumé ↗
        </a>
      </Magnetic>
    </motion.header>
  )
}

function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const ballScale = useTransform(scrollYProgress, [0, 1], [1, 1.6])
  const ballRotate = useTransform(scrollYProgress, [0, 1], [0, 90])

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease, delay },
  })

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-bg" aria-hidden="true">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
        <div className="grid-lines" />
      </div>

      <div className="hero-inner">
        <motion.div className="hero-copy" style={{ opacity: fade }}>
          <motion.p className="eyebrow" {...show(0.2)}>
            <span className="pulse" /> Open to {profile.seeking}
          </motion.p>

          <motion.h1 className="hero-name" style={{ y: nameY }}>
            <SplitText text={profile.first} className="name-line" play={ready} delay={0.1} />
            <SplitText text={profile.last} className="name-line outline" play={ready} delay={0.35} />
          </motion.h1>

          <motion.p className="hero-lede" {...show(0.8)}>
            Computer engineer at <strong>UMD</strong> who builds{' '}
            <WordCycler words={profile.roles} />
            <br />
            and plays pro cricket for the <strong>Fort Lauderdale Lions</strong>.
          </motion.p>

          <motion.div className="hero-actions" {...show(1)}>
            <Magnetic>
              <a href="#work" className="btn btn-primary" data-cursor="Go">
                See my work
              </a>
            </Magnetic>
            <Magnetic>
              <a href={`mailto:${profile.email}`} className="btn btn-ghost">
                Say hello
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div className="hero-visual" style={{ y: photoY }}>
          <motion.div
            className="photo-frame"
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 28px)', scale: 1.15 }}
            animate={ready ? { clipPath: 'inset(0% 0% 0% 0% round 28px)', scale: 1 } : undefined}
            transition={{ duration: 1.4, ease, delay: 0.3 }}
          >
            <img src={headshot} alt="Portrait of Aathyanth Lekshman" fetchPriority="high" />
            <div className="photo-sticker">
              <span>CMPE</span>
              <span>’29</span>
            </div>
          </motion.div>
          <motion.div
            className="ball-wrap"
            style={{ scale: ballScale, rotate: ballRotate }}
            initial={{ opacity: 0, x: 80 }}
            animate={ready ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 1.4, ease, delay: 0.9 }}
            data-cursor="Bowl"
          >
            <Suspense fallback={null}>
              <CricketBall />
            </Suspense>
          </motion.div>
          <svg className="spin-badge" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="circle" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
            </defs>
            <text>
              <textPath href="#circle">
                ENGINEER • CRICKETER • BUILDER • TERP •
              </textPath>
            </text>
          </svg>
        </motion.div>
      </div>

      <motion.a href="#work" className="scroll-cue" style={{ opacity: fade }} aria-label="Scroll to projects">
        <span>Scroll</span>
        <span className="scroll-line" />
      </motion.a>
    </section>
  )
}

function Work() {
  const state = useProjects()
  const { projects } = state
  const ref = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const wide = useMediaQuery('(min-width: 900px)')
  const [distance, setDistance] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const travel = wide ? distance : 0
  const x = useTransform(smooth, [0, 1], [0, -travel])
  const barScale = useTransform(smooth, [0, 1], [0, 1])

  useLayoutEffect(() => {
    if (!wide) return
    const measure = () => setDistance(Math.max(0, track.current!.scrollWidth - window.innerWidth))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [wide, projects])

  return (
    <section
      id="work"
      ref={ref}
      className="work"
      style={wide ? { height: `calc(100vh + ${travel}px)` } : undefined}
    >
      <div className="work-sticky">
        <div className="work-head">
          <p className="section-tag">(01) Selected work</p>
          <SplitText as="h2" text="Things I’ve built" className="section-title" />
          {wide && (
            <div className="work-progress">
              <motion.span style={{ scaleX: barScale }} />
            </div>
          )}
        </div>
        {state.loading && <p role="status" className="project-load-status">Loading projects…</p>}
        {state.error && <div role="alert" className="project-load-status">{state.error} <button type="button" onClick={() => void state.load()}>Retry</button></div>}
        <motion.div className="work-track" ref={track} style={{ x: wide ? x : 0 }}>
          {!state.loading && !state.error && projects.length === 0 && <p>No projects to display.</p>}
          {projects.map((p, i) => (
            <TiltCard key={p.id} className="project-card" accent={p.accent}>
              <div className="card-glow" />
              <div className="card-top">
                <span className="card-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="card-tagline">{p.tagline}</span>
              </div>
              <ProjectArt art={p.art} />
              <h3>{p.title}</h3>
              {p.credit && <span className="card-credit">{p.credit}</span>}
              <p>{p.description}</p>
              <ul className="tags">
                {p.technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="card-links">
                {p.links.length ? (
                  p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-cursor="Open">
                      {l.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))
                ) : (
                  <span className="muted">Project #{p.id}</span>
                )}
              </div>
            </TiltCard>
          ))}
          <a href={profile.github} className="more-card" target="_blank" rel="noreferrer" data-cursor="GitHub">
            <span>More on</span>
            <strong>GitHub</strong>
            <span className="arrow">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="stats" aria-label="By the numbers">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.1} className="stat">
          <span className="stat-value">
            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
          </span>
          <span className="stat-label">{s.label}</span>
        </Reveal>
      ))}
    </section>
  )
}

function About() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [120, -120])
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 160])
  const rot = useTransform(scrollYProgress, [0, 1], [-8, 6])

  return (
    <section id="about" className="about" ref={ref}>
      <div className="about-photos">
        <motion.figure className="about-photo photo-lions" style={{ y: y1, rotate: rot }} data-cursor="Lions">
          <img src={lions} alt="Aathyanth in a Fort Lauderdale Lions jersey, Minor League Cricket squad announcement" loading="lazy" />
        </motion.figure>
        <motion.figure className="about-photo photo-blazer" style={{ y: y2 }}>
          <img src={blazer} alt="Aathyanth in a yellow blazer at a ceremony" loading="lazy" />
        </motion.figure>
      </div>

      <div className="about-copy">
        <p className="section-tag">(02) About</p>
        <SplitText as="h2" text="Two pitches, one mindset." className="section-title" />
        <Reveal>
          <p className="about-lede">
            I’m a first-year Computer Engineering student at the University of Maryland in the ACES Cybersecurity
            Honors Program. I care most about how hardware and software work together, and I like building tools I
            actually use.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p>
            I play for the Fort Lauderdale Lions in Minor League Cricket as a leg-spinning all-rounder. A lot of my
            projects start there: practice film turned into Clip Farmer, and questions about my own bowling turned
            into a Hawk-Eye data study. Competing taught me discipline and how to adapt under pressure. Teaching kids
            to code at Code Ninjas taught me to explain things clearly.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="edu-card">
          <div className="edu-head">
            <div>
              <h3>{education.school}</h3>
              <p>
                {education.degree} · {education.honors}
              </p>
            </div>
            <span className="edu-grad">{education.grad}</span>
          </div>
          <div className="edu-awards">
            {education.awards.map((a) => (
              <span key={a} className="award">
                ★ {a}
              </span>
            ))}
          </div>
          <div className="edu-certs">
            <span className="edu-label">Certifications</span>
            {education.certifications.map((c) => (
              <span key={c} className="cert">
                {c}
              </span>
            ))}
          </div>
          <ul className="coursework">
            {education.coursework.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Reveal>

        <div className="leadership">
          {leadership.map((l, i) => (
            <Reveal key={l.title} delay={i * 0.1} className="lead-item">
              <h4>{l.title}</h4>
              <p>{l.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="experience" className="experience">
      <p className="section-tag">(03) Experience</p>
      <SplitText as="h2" text="Where I’ve put in the reps" className="section-title" />
      <ol className="exp-list">
        {experience.map((e, i) => (
          <Reveal key={e.what} delay={i * 0.05}>
            <li className={`exp-row ${open === i ? 'is-open' : ''}`}>
              <button
                className="exp-button"
                onClick={() => setOpen(open === i ? null : i)}
                onMouseEnter={() => setOpen(i)}
                aria-expanded={open === i}
              >
                <span className="exp-when">{e.when}</span>
                <span className="exp-what">{e.what}</span>
                <span className="exp-where">{e.where}</span>
                <span className="exp-plus" aria-hidden="true">
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.p
                    className="exp-detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <span>{e.detail}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <section id="contact" className="contact">
      <div className="contact-bg" aria-hidden="true" />
      <p className="section-tag">(05) Contact</p>
      <h2 className="contact-title">
        <SplitText text="Let’s build" className="contact-line" />
        <SplitText text="something." className="contact-line accent" delay={0.25} />
      </h2>
      <p className="contact-sub">
        Internships, projects, or a net session. My inbox is open.
      </p>
      <div className="contact-actions">
        <Magnetic strength={0.5}>
          <button className="email-orb" onClick={copy} data-cursor={copied ? 'Copied!' : 'Copy'}>
            <AnimatePresence mode="wait">
              <motion.span
                key={copied ? 'y' : 'n'}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {copied ? 'Copied ✓' : profile.email}
              </motion.span>
            </AnimatePresence>
          </button>
        </Magnetic>
        <div className="socials">
          {[
            ['LinkedIn', profile.linkedin],
            ['GitHub', profile.github],
            ['Résumé', RESUME],
            ['Email', `mailto:${profile.email}`],
          ].map(([label, href]) => (
            <a key={label} href={href} target={href.startsWith('http') || href.endsWith('.pdf') ? '_blank' : undefined} rel="noreferrer" className="social">
              <span>{label}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>College Park, MD</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()
  const done = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 })
    return () => lenis.destroy()
  }, [reduced])

  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden'
  }, [ready])

  return (
    <>
      <AnimatePresence>{!ready && <Loader onDone={done} />}</AnimatePresence>
      <Cursor />
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero ready={ready} />
        <VelocityMarquee items={skills} />
        <Work />
        <Stats />
        <About />
        <VelocityMarquee items={['Code', 'Cricket', 'Build', 'Repeat']} baseVelocity={3} />
        <Experience />
        <Guestbook />
        <Contact />
      </main>
    </>
  )
}
