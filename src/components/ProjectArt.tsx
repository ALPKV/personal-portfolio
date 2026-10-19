import type { Project } from '../data'
import rescrubLogo from '../assets/photos/rescrub-logo.webp'

// Small looping visuals, one per project. Pure SVG + CSS so they stay cheap.
export function ProjectArt({ art }: { art: Project['art'] }) {
  switch (art) {
    case 'rescrub':
      return (
        <div className="art art-rescrub">
          <img src={rescrubLogo} alt="" className="art-logo" />
          <div className="scanline" />
          {[0, 1, 2].map((i) => (
            <span key={i} className={`track-box tb-${i}`}>
              <em>Person {i + 1}</em>
            </span>
          ))}
        </div>
      )
    case 'pingpong':
      return (
        <div className="art art-pingpong">
          <svg viewBox="0 0 200 120">
            <rect x="4" y="10" width="192" height="100" rx="6" className="table" />
            <line x1="100" y1="10" x2="100" y2="110" className="net" />
            <path d="M24 90 Q100 -20 176 60" className="arc" />
            <circle r="5" className="pp-ball">
              <animateMotion dur="1.6s" repeatCount="indefinite" path="M24 90 Q100 -20 176 60 Q100 -10 24 90" />
            </circle>
          </svg>
          <div className="elo">
            ELO <b>1487</b> <span>▲ 16</span>
          </div>
        </div>
      )
    case 'clips':
      return (
        <div className="art art-clips">
          <div className="wave">
            {Array.from({ length: 36 }, (_, i) => (
              <span key={i} className={i % 9 === 4 ? 'peak' : ''} style={{ animationDelay: `${(i % 12) * -0.11}s` }} />
            ))}
          </div>
          <div className="clip-strip">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{ animationDelay: `${i * 0.25}s` }}>
                clip_{String(i + 1).padStart(2, '0')}.mp4
              </span>
            ))}
          </div>
        </div>
      )
    case 'legspin':
      return (
        <div className="art art-legspin">
          <svg viewBox="0 0 120 200">
            <rect x="30" y="4" width="60" height="192" rx="2" className="pitch" />
            {[40, 70, 100, 130, 160].map((y, i) => (
              <line key={y} x1="30" x2="90" y1={y} y2={y} className="zone" style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
            {Array.from({ length: 46 }, (_, i) => {
              const cx = 44 + ((i * 37) % 32)
              const cy = 60 + ((i * 53) % 110)
              return <circle key={i} cx={cx} cy={cy} r="2" className="dot" style={{ animationDelay: `${(i % 10) * 0.18}s` }} />
            })}
          </svg>
        </div>
      )
    case 'bot':
      return (
        <div className="art art-bot">
          <div className="radar">
            <div className="sweep" />
            <span className="blip b1" />
            <span className="blip b2" />
          </div>
          <code>
            if (sensor.distance() &lt; 30) <br />
            &nbsp;&nbsp;evade(); <span className="caret">▍</span>
          </code>
        </div>
      )
    case 'alerts':
      return (
        <div className="art art-alerts">
          {['IND vs AUS · Live', 'MILC · Ft. Lauderdale Lions', 'ENG vs SA · Tomorrow'].map((t, i) => (
            <div key={t} className="toast" style={{ animationDelay: `${i * 0.9}s` }}>
              <span className="ping" /> {t}
            </div>
          ))}
          <div className="cron">cron: 0 */3 * * *</div>
        </div>
      )
  }
}
