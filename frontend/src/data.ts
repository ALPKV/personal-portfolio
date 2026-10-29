// Content mirrors ../resume-workflow/library. Only confirmed facts belong here:
// anything tagged [confirm] or [verify] in the library stays out.

export type Project = {
  id: string
  title: string
  tagline: string
  description: string
  credit?: string
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
  seeking: 'Summer 2027 internships & research',
  roles: ['software', 'robots', 'embedded code', 'vision models', 'AI tools', 'things I use'],
}


export const skills = [
  'Python',
  'TypeScript',
  'C++',
  'C',
  'Java',
  'SQL',
  'MATLAB',
  'React',
  'Next.js',
  'FastAPI',
  'PostgreSQL',
  'Supabase',
  'YOLO',
  'pandas',
  'scikit-learn',
  'FFmpeg',
  'Docker',
  'GitHub Actions',
  'Linux',
  'VEX Robotics',
  'Autodesk Inventor',
  'Onshape',
]

export const education = {
  school: 'University of Maryland, College Park',
  degree: 'B.S. Computer Engineering',
  honors: 'ACES Cybersecurity Honors Program',
  grad: 'Expected May 2029',
  awards: [
    'Senator Katie Fry Hester Scholarship',
    'District 4B House of Delegates Scholarship',
    'AP Scholar with Distinction',
  ],
  certifications: [
    'IT Specialist – Java (Certiport)',
    'Autodesk Certified User – Inventor',
    'Onshape CAD Basics (PTC)',
  ],
  coursework: [
    'ENEE 290 · Diff Eq & Linear Algebra',
    'ENES 100 · Engineering Design',
    'CMSC 131 · OOP in Java',
    'HACS 100 · Cybersecurity Foundations',
    'CHEM 135 · Engineering Chemistry',
  ],
}

export const experience = [
  {
    when: 'Sep 2026 — Now',
    what: 'Professional Cricketer',
    where: 'Fort Lauderdale Lions · Minor League Cricket',
    detail:
      'Main squad in the U.S. national T20 league as a leg-spinning all-rounder, after coming up through the Lions’ U23 pathway. I balance training, travel and match prep with a full engineering course load.',
  },
  {
    when: 'Sep 2026 — Now',
    what: 'Web Dev Bootcamp Engineer',
    where: 'App Dev Club · UMD',
    detail:
      'One of 30 selected from a large applicant pool. Building full-stack apps with React, FastAPI and MongoDB, plus DevOps, system design and AI-assisted development.',
  },
  {
    when: 'Mar 2026 — Now',
    what: 'Coding Instructor',
    where: 'Code Ninjas · Ellicott City, MD',
    detail:
      'Teach Python, JavaScript and MakeCode to 20+ students ages 7–16, from block-based projects up to text-based code, and teach them a repeatable way to find their own bugs.',
  },
  {
    when: 'Sep 2025 — Jun 2026',
    what: 'Private Math Tutor',
    where: 'Self-employed · Ellicott City, MD',
    detail: 'Taught trigonometry to 9th and 10th graders, planning each lesson from diagnostic assessments and weekly progress reviews.',
  },
  {
    when: 'Jun — Aug 2025',
    what: 'UX Intern',
    where: 'PathSpark · EdTech',
    detail:
      'Tested new features on a career-focused platform, evaluated layouts, navigation and curriculum content, and presented usability fixes to the product team.',
  },
  {
    when: 'Mar — Jun 2025',
    what: 'Environmental Research Intern',
    where: 'Climate Ecology Institute · Remote',
    detail: 'Synthesized 15+ sources into climate-resilience and land-use feasibility analyses and contributed design recommendations to the final proposal.',
  },
  {
    when: 'Sep 2024 — Jan 2026',
    what: 'Technical Editor',
    where: '3B Sport · Remote',
    detail: 'Produced social campaigns with professional U.S. cricketers that reached 50K+ impressions, using Google Analytics to decide what to post.',
  },
  {
    when: 'Aug 2020 — Mar 2021',
    what: 'Instructional Designer',
    where: 'Kalvi40 · Remote',
    detail:
      'Designed English and STEM lessons, videos and visuals for rural students in grades 3–8 in Tamil Nadu, India, delivered through a mobile app during COVID-19.',
  },
]

export const leadership = [
  {
    title: 'Co-founder & President, MHHS Cricket Club',
    detail: 'Led it for four years, grew it to 40+ members, ran weekly practices and set up partnerships with two regional cricket organizations.',
  },
  {
    title: 'USA Cricket U19 Regionals',
    detail: 'Represented the South Atlantic zone at USA Cricket’s Junior Pathway U19 Regionals in 2024.',
  },
  {
    title: 'Volunteer, Isha Foundation',
    detail: 'Made videos for the Save Soil campaign and helped run a 200+ person walkathon in Washington, DC.',
  },
]

export const stats = [
  { value: 7, label: 'stage GPU vision pipeline in reScrub', prefix: '', suffix: '' },
  { value: 97, label: 'less time reviewing practice footage', prefix: '', suffix: '%' },
  { value: 17848, label: 'Hawk-Eye deliveries analyzed', prefix: '', suffix: '' },
  { value: 40, label: 'members in the club I co-founded', prefix: '', suffix: '+' },
]
