/** Lite / Pro / Max multi-service package overview + comparison matrix. */

export const MULTI_PACKAGE_OVERVIEWS = [
  {
    id: 'lite',
    tier: 'LITE',
    title: 'Lite Package',
    tagline: 'Essential foundation to launch and grow.',
    featured: false,
    highlights: [
      '5 UI/UX Screens',
      '5 Website Pages',
      '12 Social Posts',
      'Basic SEO',
      'Shared Account Manager',
    ],
  },
  {
    id: 'pro',
    tier: 'PRO',
    title: 'Pro Package',
    tagline: 'Growth-ready system to scale your business.',
    featured: true,
    highlights: [
      '3× UI/UX Scope → 15 Screens',
      '3× Website Scope → 15 Pages',
      'Adds Mobile App MVP',
      'Adds Paid Ads',
      'Dedicated Account Manager',
    ],
  },
  {
    id: 'max',
    tier: 'MAX',
    title: 'Max Package',
    tagline: 'End-to-end partnership for ambitious teams.',
    featured: false,
    highlights: [
      'Unlimited UI/UX*',
      'Enterprise Website',
      'Full Mobile App',
      'AI Analytics Dashboard',
      '24×7 Priority Support',
    ],
  },
];

export const MULTI_PACKAGE_MATRIX = [
  {
    group: 'Brand & Product',
    rows: [
      { feature: 'Strategy & Consultation', lite: '✓', pro: '✓', max: '✓' },
      { feature: 'Brand Identity', lite: '✓', pro: '✓', max: '✓' },
      { feature: 'UI/UX Design', lite: '5 Screens', pro: '15 Screens', max: 'Unlimited*' },
      { feature: 'Website Development', lite: '5 Pages', pro: '15 Pages', max: 'Enterprise' },
      { feature: 'Mobile App', lite: '—', pro: 'MVP', max: 'Full App' },
    ],
  },
  {
    group: 'Growth & Intelligence',
    rows: [
      { feature: 'Social Media', lite: '12 Posts', pro: '20 Posts', max: '30 Posts' },
      { feature: 'SEO', lite: 'Basic', pro: 'Advanced', max: 'Enterprise' },
      { feature: 'Paid Ads', lite: '—', pro: '✓', max: '✓' },
      { feature: 'Company Profile', lite: '✓', pro: '✓', max: '✓' },
      { feature: 'Analytics Dashboard', lite: 'Basic', pro: 'Advanced', max: 'AI Dashboard' },
    ],
  },
  {
    group: 'Partnership & Support',
    rows: [
      { feature: 'Event Support', lite: '—', pro: 'Basic', max: 'End-to-End' },
      { feature: 'Account Manager', lite: 'Shared', pro: 'Dedicated', max: 'Senior Dedicated' },
      { feature: 'Review Meetings', lite: 'Monthly', pro: 'Bi-weekly', max: 'Weekly' },
      { feature: 'Priority Support', lite: '—', pro: '✓', max: '24×7' },
    ],
  },
];

export const MULTI_PACKAGE_FOOTNOTE =
  '*Unlimited should be governed by a fair usage policy for subscription-based offerings.';
