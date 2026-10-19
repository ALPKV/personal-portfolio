export type Project = {
  id: string
  title: string
  tagline: string
  description: string
  tags: string[]
  links: { label: string; href: string }[]
  art: 'rescrub' | 'pingpong' | 'clips' | 'legspin' | 'bot' | 'alerts'
  accent: string
}

export const profile = {
  name: 'Aathyanth Lekshman',
  first: 'Aathyanth',
  last: 'Lekshman',
  email: 'alekshman@terpmail.umd.edu',
  linkedin: 'https://www.linkedin.com/in/aathyanth-lekshman/',
  github: 'https://github.com/ALPKV',
  school: 'University of Maryland',
  major: 'Computer Engineering',
  roles: ['software', 'robots', 'AI tools', 'data stories', 'things I use'],
}

export const projects: Project[] = [
  {
    id: 'rescrub',
    title: 'reScrub',
    tagline: 'Computer vision for surgical training',
    description:
      'Reviews practice-surgery footage for breaks in sterile technique. From one angled camera it anonymously labels everyone, tracks arms and hands, maps sterile surfaces, and flags timestamped moments for instructors to review.',
    tags: ['Python', 'FastAPI', 'Next.js', 'TimescaleDB', 'GPU pipeline'],
    links: [
      { label: 'Live site', href: 'https://rescrub.health' },
      { label: 'Code', href: 'https://github.com/ALPKV/reScrub' },
    ],
    art: 'rescrub',
    accent: '#e8102e',
  },
  {
    id: 'pingpong',
    title: 'PFH Ping Pong League',
    tagline: 'A dorm league, run like a pro tour',
    description:
      'Scan a QR code, play, confirm. Elo rankings, double-elimination brackets and seasons, backed by Postgres functions with row-level security so results can’t be faked.',
    tags: ['TypeScript', 'React', 'Supabase', 'PostgreSQL'],
    links: [
      { label: 'Live site', href: 'https://ping-pong-eight-orcin.vercel.app' },
      { label: 'Code', href: 'https://github.com/ALPKV/pfh-ping-pong' },
    ],
    art: 'pingpong',
    accent: '#e8102e',
  },
  {
    id: 'clips',
    title: 'Clip Farmer',
    tagline: 'Highlights that cut themselves',
    description:
      'An audio peak-detection pipeline that hears the crack of bat on ball through background noise and cuts every delivery into its own clip, no manual tagging. A full practice session takes under three minutes.',
    tags: ['Python', 'Librosa', 'FFmpeg', 'Streamlit'],
    links: [{ label: 'Code', href: 'https://github.com/ALPKV/Clip_farmer' }],
    art: 'clips',
    accent: '#e8102e',
  },
  {
    id: 'legspin',
    title: 'Leg-spin Length Study',
    tagline: 'Does length predict runs?',
    description:
      '17,848 Hawk-Eye-tracked IPL leg-spin deliveries, cleaned and grouped into five pitching-length zones, then modeled against runs with match-grouped cross-validation and honest baselines.',
    tags: ['Python', 'pandas', 'NumPy', 'scikit-learn'],
    links: [{ label: 'Code', href: 'https://github.com/ALPKV/legspin-length-runs' }],
    art: 'legspin',
    accent: '#e8102e',
  },
  {
    id: 'bot',
    title: 'Semi-Autonomous BattleBot',
    tagline: 'C++ that survives contact',
    description:
      'C++ control software for autonomous and driver-controlled play, with sensor-based obstacle detection and manual override, debugged and refined across 10+ competitive matches.',
    tags: ['C++', 'VEX Robotics', 'Sensors'],
    links: [],
    art: 'bot',
    accent: '#e8102e',
  },
  {
    id: 'alerts',
    title: 'Cricket Alert',
    tagline: 'Never miss a first ball',
    description:
      'A scheduled GitHub Action that checks live and upcoming matches through CricAPI every three hours and emails a tidy summary.',
    tags: ['Python', 'GitHub Actions', 'REST APIs'],
    links: [{ label: 'Code', href: 'https://github.com/ALPKV/CrickBet' }],
    art: 'alerts',
    accent: '#e8102e',
  },
]

export const skills = [
  'Python',
  'C++',
  'C',
  'Java',
  'TypeScript',
  'JavaScript',
  'MATLAB',
  'React',
  'pandas',
  'NumPy',
  'scikit-learn',
  'FFmpeg',
  'Linux',
  'GitHub Actions',
  'Fusion 360',
  'VEX Robotics',
]

export const education = {
  school: 'University of Maryland, College Park',
  degree: 'B.S. Computer Engineering',
  honors: 'ACES Cybersecurity Honors Program',
  grad: 'Expected May 2029',
  awards: ['Senator Katie Fry Hester Scholarship', 'District 4B House of Delegates Scholarship'],
  coursework: ['ENEE 290 · Diff Eq & Linear Algebra', 'ENES 100 · Engineering Design', 'CMSC 131 · OOP in Java', 'HACS 100 · Cybersecurity Foundations', 'CHEM 135 · Engineering Chemistry'],
}

export const experience = [
  {
    when: 'Mar 2026 — Now',
    what: 'Coding Instructor',
    where: 'Code Ninjas · Ellicott City, MD',
    detail: 'Teach Python, JavaScript and MakeCode to 20+ students ages 7–16, tuning each project to the kid in front of me.',
  },
  {
    when: 'Season',
    what: 'Professional Cricketer',
    where: 'Fort Lauderdale Lions · Minor League Cricket',
    detail: 'Main-team squad in the US national T20 league, balancing training, travel and match prep with full-time engineering.',
  },
  {
    when: 'Sep 2025 — Jun 2026',
    what: 'Private Math Tutor',
    where: 'Self-employed · Ellicott City, MD',
    detail: 'Taught trigonometry to 9th and 10th graders with diagnostic-driven lesson plans and weekly progress reviews.',
  },
  {
    when: 'Jun — Aug 2025',
    what: 'UX Intern',
    where: 'PathSpark · College Park, MD',
    detail: 'Evaluated layouts and navigation across an EdTech platform and presented usability fixes to the product team.',
  },
  {
    when: 'Mar — Jun 2025',
    what: 'Environmental Research Intern',
    where: 'Climate Ecology Institute · Remote',
    detail: 'Synthesized 15+ sources into climate-resilience and land-use feasibility analyses for the final proposal.',
  },
  {
    when: 'Sep 2024 — Jan 2026',
    what: 'Technical Editor',
    where: '3B Sport · Remote',
    detail: 'Produced social campaigns with professional U.S. cricketers, reaching 50K+ impressions, guided by analytics.',
  },
]

export const leadership = [
  {
    title: 'App Dev Club · Web Dev Bootcamp',
    detail: 'One of 30 selected from a large applicant pool: Git, React, FastAPI, MongoDB, DevOps, system design.',
  },
  {
    title: 'Founder & President, MHHS Cricket Club',
    detail: 'Grew it to 40+ members with weekly practices and partnerships with two regional cricket organizations.',
  },
]

export const stats = [
  { value: 17848, label: 'Hawk-Eye deliveries analyzed', prefix: '', suffix: '' },
  { value: 50, label: 'impressions on cricket campaigns', prefix: '', suffix: 'K+' },
  { value: 40, label: 'members in the club I founded', prefix: '', suffix: '+' },
  { value: 20, label: 'students taught to code', prefix: '', suffix: '+' },
]
