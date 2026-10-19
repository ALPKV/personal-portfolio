import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  wrap,
} from 'motion/react'
import { ease } from '../motion'
import { Fragment, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'


/** A dot + ring cursor that grows and labels itself over [data-cursor] elements. */
export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 })
  const [label, setLabel] = useState('')
  const [hovering, setHovering] = useState(false)
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]')
      setHovering(Boolean(target))
      setLabel(target?.dataset.cursor ?? '')
    }
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: label ? 2.6 : hovering ? 1.7 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <span className="cursor-label">{label}</span>
      </motion.div>
    </>
  )
}

/** Pulls its child toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 200, damping: 14 })
  const y = useSpring(0, { stiffness: 200, damping: 14 })
  return (
    <motion.div
      ref={ref}
      className="magnetic"
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/** Splits text into letters that rise into place one after another. */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.035,
  as: Tag = 'span',
  play,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'span' | 'h1' | 'h2' | 'p'
  play?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const MotionTag = motion[Tag] as typeof motion.span
  return (
    <MotionTag ref={ref as RefObject<HTMLSpanElement>} className={className} aria-label={text}>
      {text.split(' ').map((word, wi, words) => (
        <Fragment key={wi}>
        <span className="word" aria-hidden="true">
          {word.split('').map((char, ci) => {
            const index = words.slice(0, wi).join('').length + ci
            return (
              <span className="char-mask" key={ci}>
                <motion.span
                  className="char"
                  initial={{ y: '110%', rotate: 8 }}
                  animate={(play ?? inView) ? { y: '0%', rotate: 0 } : undefined}
                  transition={{ duration: 0.9, ease, delay: delay + index * stagger }}
                >
                  {char}
                </motion.span>
              </span>
            )
          })}
        </span>
        {wi < words.length - 1 && ' '}
        </Fragment>
      ))}
    </MotionTag>
  )
}

/** Fades and lifts content in when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Infinite marquee whose speed and skew react to scroll velocity. */
export function VelocityMarquee({ items, baseVelocity = -2 }: { items: string[]; baseVelocity?: number }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [-2000, 0, 2000], [-6, 0, 6], { clamp: false })
  const skew = useTransform(velocity, [-2500, 2500], [12, -12])
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const direction = useRef(1)
  const reduced = useReducedMotion()

  useAnimationFrame((_, delta) => {
    if (reduced) return
    let move = direction.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) direction.current = -1
    else if (f > 0) direction.current = 1
    move += direction.current * move * f
    baseX.set(baseX.get() + move)
  })

  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" style={{ x, skewX: skew }}>
        {row.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <svg viewBox="0 0 24 24" className="marquee-star">
              <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
            </svg>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/** Counts from 0 up to value when it scrolls into view. */
export function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (node.textContent = prefix + Math.round(v).toLocaleString() + suffix),
    })
    return () => controls.stop()
  }, [inView, value, prefix, suffix])
  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  )
}

/** Cycles through words with a vertical flip. */
export function WordCycler({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2200)
    return () => clearInterval(id)
  }, [words.length])
  return (
    <span className="cycler">
      {words.map((w, n) => (
        <motion.span
          key={w}
          className="cycler-word"
          initial={false}
          animate={{
            y: n === i ? '0%' : n === (i - 1 + words.length) % words.length ? '-110%' : '110%',
            opacity: n === i ? 1 : 0,
          }}
          transition={{ duration: 0.7, ease }}
        >
          {w}
        </motion.span>
      ))}
      <span className="cycler-sizer">{words.reduce((a, b) => (b.length > a.length ? b : a))}</span>
    </span>
  )
}

/** Intro screen: counter to 100, then the curtain lifts. */
export function Loader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    const controls = animate(0, 100, {
      duration: reduced ? 0.2 : 1.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setTimeout(onDone, reduced ? 0 : 250),
    })
    // Never trap visitors behind the intro if animation frames are throttled.
    const fallback = setTimeout(onDone, 3500)
    return () => {
      controls.stop()
      clearTimeout(fallback)
    }
  }, [onDone, reduced])
  return (
    <motion.div
      className="loader"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 1, ease }}
    >
      <div className="loader-words">
        {['Engineer', 'Builder', 'Cricketer'].map((w, i) => (
          <motion.span
            key={w}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0.25], y: 0 }}
            transition={{ duration: 1.4, delay: i * 0.35, times: [0, 0.2, 0.7, 1] }}
          >
            {w}
          </motion.span>
        ))}
      </div>
      <div className="loader-count">{String(count).padStart(3, '0')}</div>
      <div className="loader-bar" style={{ transform: `scaleX(${count / 100})` }} />
    </motion.div>
  )
}

/** Thin bar at the top tracking page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

/** Card that tilts in 3D and casts a spotlight following the pointer. */
export function TiltCard({ children, className, accent }: { children: ReactNode; className?: string; accent: string }) {
  const ref = useRef<HTMLElement>(null)
  const rx = useSpring(0, { stiffness: 150, damping: 15 })
  const ry = useSpring(0, { stiffness: 150, damping: 15 })
  return (
    <motion.article
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, ['--accent' as string]: accent }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        ref.current!.style.setProperty('--mx', `${px * 100}%`)
        ref.current!.style.setProperty('--my', `${py * 100}%`)
        ry.set((px - 0.5) * 10)
        rx.set((0.5 - py) * 10)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      {children}
    </motion.article>
  )
}
