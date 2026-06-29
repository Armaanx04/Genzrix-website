/** Service content — single source for Services page copy (from homepage showcase). */

export const SERVICES = [
  {
    id: 'design',
    num: '01',
    title: 'UI/UX Design',
    description:
      'We craft intuitive, user-centered digital experiences grounded in research and real behavior. Every screen is designed to reduce friction, communicate clearly, and drive action — not just look beautiful.',
    includes: [
      'User research and persona mapping',
      'Wireframes and interactive prototypes',
      'Full UI design in Figma',
      'Design system and component library',
    ],
    icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="4" width="32" height="24" rx="2"/><line x1="10" y1="32" x2="26" y2="32"/><line x1="18" y1="28" x2="18" y2="32"/><circle cx="18" cy="16" r="5"/><line x1="9" y1="10" x2="12" y2="10"/></svg>`,
    accent: '#6A98D4',
    accentRgb: '106, 152, 212',
    art: 'design',
  },
  {
    id: 'dev',
    num: '02',
    title: 'Website Development',
    description:
      'We build fast, modern, and conversion-focused websites. Whether a marketing site, portfolio, or complex web application — every project is engineered to perform and built to last.',
    includes: [
      'Responsive, pixel-perfect development',
      'Performance optimization and SEO foundation',
      'CMS integration (WordPress, Webflow, Sanity)',
      'Deployment, hosting setup, and handover',
    ],
    icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><polyline points="10,12 4,18 10,24"/><polyline points="26,12 32,18 26,24"/><line x1="15" y1="23" x2="21" y2="13"/></svg>`,
    accent: '#4A6F9C',
    accentRgb: '74, 111, 156',
    art: 'dev',
  },
  {
    id: 'branding',
    num: '03',
    title: 'Creative Design & Branding',
    description:
      'Your brand is your first impression and your last memory. We build visual identities that communicate your values instantly — from logo conception to full brand systems ready for every medium.',
    includes: [
      'Brand strategy and positioning',
      'Logo design and identity system',
      'Brand guidelines and asset library',
      'Collateral design (pitch decks, social kits, print)',
    ],
    icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M18 4l3.5 11h11l-9 6.5 3.5 11-9-6.5-9 6.5 3.5-11-9-6.5h11z"/></svg>`,
    accent: '#7268A8',
    accentRgb: '114, 104, 168',
    art: 'branding',
  },
  {
    id: 'marketing',
    num: '04',
    title: 'Digital Marketing & Growth',
    description:
      'We plan and execute digital marketing campaigns built around your specific growth goals. From paid ads to organic content strategies — we focus on measurable outcomes, not vanity metrics.',
    includes: [
      'Marketing strategy and channel planning',
      'Social media management and content calendar',
      'Paid advertising (Meta, Google)',
      'Performance tracking and monthly reporting',
    ],
    icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 28 L12 16 L18 21 L26 9 L32 14"/><path d="M4 32 h28" opacity="0.25"/></svg>`,
    accent: '#4F9BA6',
    accentRgb: '79, 155, 166',
    art: 'marketing',
  },
  {
    id: 'ecommerce',
    num: '05',
    title: 'E-Commerce Solutions',
    description:
      'We build online stores engineered to convert — with smart product architecture, seamless checkout flows, and performance-first code. Every detail is designed to maximize revenue.',
    includes: [
      'Shopify or custom e-commerce development',
      'Product catalogue setup and optimization',
      'Payment gateway integration',
      'Conversion rate optimization',
    ],
    icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="6" width="28" height="24" rx="2"/><path d="M11 16 h14 M11 20 h9"/><circle cx="25" cy="25" r="4"/><path d="M27.8 27.8 l3 3"/></svg>`,
    accent: '#A89062',
    accentRgb: '168, 144, 98',
    art: 'ecommerce',
  },
  {
    id: 'app',
    num: '06',
    title: 'App Development',
    description:
      'We develop web and mobile applications that are robust, scalable, and genuinely enjoyable to use. From MVP to full-featured product — we ship code that works, on time.',
    includes: [
      'React / Next.js web applications',
      'Cross-platform apps (Flutter, React Native)',
      'API design and backend integration',
      'QA testing, launch support, and documentation',
    ],
    icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="10" y="2" width="16" height="32" rx="3"/><line x1="14" y1="30" x2="22" y2="30"/><circle cx="18" cy="8" r="1.5" fill="currentColor" stroke="none"/></svg>`,
    accent: '#4A62A8',
    accentRgb: '74, 98, 168',
    art: 'app',
  },
  {
    id: 'content',
    num: '07',
    title: 'Content Production',
    description:
      'We produce photography, video, and written content that tells your story with intent. Every asset is created with distribution in mind — built to perform on platforms, not just fill a folder.',
    includes: [
      'Brand and product photography',
      'Video production and editing (reels, explainers, testimonials)',
      'Copywriting for web, ads, and social',
      'Content strategy and editorial planning',
    ],
    icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="18" cy="12" r="6"/><path d="M8 32a10 10 0 0 1 20 0"/><circle cx="27" cy="16" r="4"/><path d="M31 32a7 7 0 0 0-7.5-5.5"/></svg>`,
    accent: '#A87470',
    accentRgb: '168, 116, 112',
    art: 'content',
  },
  {
    id: 'events',
    num: '08',
    title: 'Event Execution',
    description:
      'We plan and execute on-ground events from concept to close. Launches, college fests, corporate activations, or community meetups — our ground teams handle logistics, design, and live operations.',
    includes: [
      'Event concept and design',
      'Vendor management and logistics coordination',
      'On-ground team deployment',
      'Post-event documentation and media',
    ],
    icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="8" width="28" height="20" rx="2"/><path d="M4 14 h28"/><circle cx="10" cy="11" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="11" r="1.5" fill="currentColor" stroke="none"/><line x1="18" y1="22" x2="28" y2="22"/><line x1="18" y1="26" x2="24" y2="26"/></svg>`,
    accent: '#8E3A48',
    accentRgb: '142, 58, 72',
    art: 'events',
  },
];
