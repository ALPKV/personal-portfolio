import type { Project } from '../data'
import clipLoop from '../assets/projects/clipfarmer-loop.webp'
import legspinMap from '../assets/projects/legspin-pitchmap.webp'
import pingpongShot from '../assets/projects/pingpong-signin.webp'
import rescrubShot from '../assets/projects/rescrub-demo.webp'

// Real captures where a project has them (screenshots, its own output, its own data);
// small SVG + CSS loops for the ones that don't.
export function ProjectArt({ art }: { art: Project['art'] }) {
  switch (art) {
    case 'rescrub':
      return (
        <div className="art art-shot">
          <img src={rescrubShot} alt="reScrub review workspace showing labeled surfaces, tracked hands and a flagged finding" loading="lazy" />
          <div className="scanline" />
          <span className="shot-label">Demo review · rescrub.health</span>
        </div>
      )
    case 'pingpong':
      return (
        <div className="art art-shot">
          <img src={pingpongShot} alt="PFH Ping Pong League sign-in page" loading="lazy" />
          <span className="shot-label">Live · Vercel</span>
        </div>
      )
    case 'clips':
      return (
        <div className="art art-clips">
          <div className="phone">
            <img src={clipLoop} alt="A delivery clip cut automatically from net-session footage" loading="lazy" />
          </div>
          <div className="clips-side">
            <div className="wave">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} className={i % 8 === 3 ? 'peak' : ''} style={{ animationDelay: `${(i % 12) * -0.11}s` }} />
              ))}
            </div>
            <div className="clip-strip">
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ animationDelay: `${i * 0.25}s` }}>
                  clip_{String(i + 1).padStart(2, '0')}.mp4
                </span>
              ))}
            </div>
            <span className="shot-label static">Real output</span>
          </div>
        </div>
      )
    case 'legspin':
      return (
        <div className="art art-shot art-dark">
          <img src={legspinMap} alt="Pitch map of 17,848 leg-spin deliveries by length zone, good length highlighted at 1.16 runs per ball" loading="lazy" />
          <span className="shot-label">Runs per ball · 17,848 real deliveries</span>
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
