import type { BookingPackageType, BookingServiceLevel, BookingZone } from '@/types/bookings';

export interface RentPackage {
  slug: BookingPackageType;
  title: string;
  tagline: string;
  description: string;
  bestFor: string;
  includes: string[];
  highlight: string;
  durationUnit: 'hours' | 'days';
}

export const RENT_PACKAGES: RentPackage[] = [
  {
    slug: 'event',
    title: 'For an Event',
    tagline: 'A gathering you’re organizing',
    description: 'Company days, festivals, photo & video. We run the whole thing.',
    bestFor: 'Team days, festivals, brand activations, shoots',
    includes: [
      'Multiple baths for groups',
      'Branding on the bath if you want',
      'Our team runs the whole thing',
    ],
    highlight: 'Event',
    durationUnit: 'hours',
  },
  {
    slug: 'gym',
    title: 'For a Gym',
    tagline: 'Cold therapy for your members',
    description: 'Member days, weekly drop-offs, or cold therapy as a service.',
    bestFor: 'Gyms, boxes, studios',
    includes: [
      'One day or every week',
      'We staff the member day',
      'Split the cost per plunge',
    ],
    highlight: 'Recurring',
    durationUnit: 'hours',
  },
  {
    slug: 'retreat',
    title: 'Hotels, Pools & Retreats',
    tagline: 'Venues with overnight guests',
    description: 'Multi-day stays for hotels, pools, and retreat operators.',
    bestFor: 'Hotels, pools, retreats',
    includes: [
      'Stays the full duration',
      'Fresh water through the run',
      'Attendant on request',
    ],
    highlight: 'Multi-day',
    durationUnit: 'days',
  },
  {
    slug: 'home',
    title: 'For Yourself',
    tagline: 'At home, friends or family',
    description: 'Birthdays, recovery days, or a small group at home.',
    bestFor: 'Couples, friends, small groups',
    includes: [
      'We deliver and set up',
      'We chill the water for you',
      'We pick up after',
    ],
    highlight: 'Personal',
    durationUnit: 'hours',
  },
  {
    slug: 'corporate',
    title: 'Something Else',
    tagline: 'Doesn’t quite fit the others',
    description: 'Tell us what you have in mind and we’ll work it out together.',
    bestFor: 'Anything custom',
    includes: [
      'Talk to us first',
      'We tailor the setup',
      'Quote within hours',
    ],
    highlight: 'Custom',
    durationUnit: 'hours',
  },
];

export interface ServiceLevel {
  slug: BookingServiceLevel;
  title: string;
  subtitle: string;
  bullets: string[];
  popular?: boolean;
}

export const SERVICE_LEVELS: ServiceLevel[] = [
  {
    slug: 'drop_off',
    title: 'Drop-Off',
    subtitle: 'You handle it',
    bullets: [
      'We drop it off',
      'You run your own session',
      'We pick it up when you’re done',
    ],
  },
  {
    slug: 'attended',
    title: 'Attended',
    subtitle: 'We stay with you',
    bullets: [
      'Everything in Drop-Off',
      'We stay the whole time',
      'We handle water, ice and safety',
    ],
    popular: true,
  },
];

export interface Zone {
  slug: BookingZone;
  label: string;
  sub: string;
}

export const ZONES: Zone[] = [
  { slug: 'beirut', label: 'Beirut', sub: 'Greater Beirut' },
  { slug: 'mount_lebanon', label: 'Mount Lebanon', sub: 'Suburbs & mountains' },
  { slug: 'north', label: 'North Lebanon', sub: 'Tripoli & North' },
  { slug: 'south', label: 'South Lebanon', sub: 'Saida, Tyre & South' },
  { slug: 'bekaa', label: 'Bekaa', sub: 'Zahle & Bekaa' },
];

export interface RentAddon {
  slug: string;
  label: string;
  description: string;
}

export const RENT_ADDONS: RentAddon[] = [
  { slug: 'extra_bath', label: 'Extra ice bath', description: 'Parallel plunging for groups' },
  { slug: 'sauna', label: 'Sauna for contrast', description: 'Hot/cold protocol kit' },
  { slug: 'coach', label: 'Breathwork coach', description: 'Certified guide on-site' },
  { slug: 'photographer', label: 'Photographer/videographer', description: 'Capture the experience' },
  { slug: 'branded_wrap', label: 'Branded wrap & signage', description: 'For corporate & events' },
  { slug: 'hot_drinks', label: 'Hot drink station', description: 'Tea & herbal infusions' },
  { slug: 'towels_robes', label: 'Towels & robes', description: 'Premium set for guests' },
];

export const RENT_FAQS = [
  {
    q: 'How much does a rental cost?',
    a: 'Pricing depends on the category, service tier, dates, location, and group size. Call us with your details and we’ll send a personalized quote within hours.',
  },
  {
    q: 'What do you bring and what do I need to provide?',
    a: 'We bring the bath and handle the cooling (ice or chiller, our call based on your setup). You only need access to water. A tap or hose nearby is enough.',
  },
  {
    q: 'How much space does the setup need?',
    a: 'A 2×2m flat area is enough for one bath.',
  },
  {
    q: 'Can multiple people plunge at the same time?',
    a: 'Yes. We can deploy several baths in parallel.',
  },
  {
    q: 'Is the cold plunge safe for everyone?',
    a: 'Yes. Every Attended session includes a safety briefing and on-site supervision. We do not allow plunges for guests with cardiac conditions or under the influence.',
  },
  {
    q: 'Do I need to pay a deposit upfront?',
    a: 'Yes. 25% to secure your date.',
  },
  {
    q: 'Can I cancel or reschedule my booking?',
    a: 'Yes. With at least one day’s notice, no penalty.',
  },
];
