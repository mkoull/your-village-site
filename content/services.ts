export interface Service {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  details: string;
  icon: string;
  features: string[];
  whoItsFor: string;
  category: "practical" | "specialist" | "emotional" | "community";
}

export interface Testimonial {
  quote: string;
  attribution: string;
}

export const services: Service[] = [
  {
    slug: "food",
    title: "Food Support",
    tagline: "Nourishing meals without the mental load",
    description:
      "Nutritious, comforting meals delivered to your door — so you can focus on recovery, not what's for dinner.",
    details:
      "Postpartum-focused meal providers, dietary requirements handled, scheduling managed for you. No planning, no cooking, no dishes.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><line x1="10" y1="22" x2="14" y2="22"/></svg>`,
    features: [
      "Postpartum-focused meal delivery",
      "Dietary requirements handled",
      "Flexible scheduling \u2014 daily, weekly, or as needed",
      "Family meals, not just mum",
    ],
    whoItsFor:
      "Any new parent who wants nutritious food without the effort.",
    category: "practical",
  },
  {
    slug: "postpartum-carers",
    title: "Postpartum Carers",
    tagline: "Experienced hands so you can rest",
    description:
      "Day and overnight carers for baby settling, feeding, and light household help \u2014 so you can actually sleep.",
    details:
      "Experienced with newborns and multiples. Help with settling, nappy changes, feeding, and light housework. Overnight carers mean a real stretch of sleep.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    features: [
      "Day and overnight support",
      "Baby settling and feeding assistance",
      "Light household help",
      "Experienced with newborns and multiples",
    ],
    whoItsFor:
      "Parents who need extra hands \u2014 especially in those first exhausting weeks.",
    category: "practical",
  },
  {
    slug: "sleep",
    title: "Sleep Support",
    tagline: "Gentle guidance for better nights",
    description:
      "Evidence-based sleep specialists matched to your parenting philosophy \u2014 no cry-it-out unless that\u2019s your choice.",
    details:
      "Gentle, evidence-based approaches tailored to your baby\u2019s temperament and your values. In-home and virtual consultations with follow-up support included.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    features: [
      "Evidence-based, gentle approaches",
      "Matched to your parenting philosophy",
      "In-home and virtual consultations",
      "Follow-up support included",
    ],
    whoItsFor:
      "Families struggling with sleep who want expert guidance \u2014 not judgment.",
    category: "specialist",
  },
  {
    slug: "lactation",
    title: "Lactation Support",
    tagline: "Expert feeding support, without the pressure",
    description:
      "Qualified lactation consultants for breastfeeding, bottle-feeding, or a mix \u2014 whatever works for your family.",
    details:
      "IBCLCs and qualified consultants offering practical, non-judgmental support in your home. All feeding methods supported.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2l.01 4A2 2 0 0 0 8 8h.01"/><path d="M18 2l-.01 4A2 2 0 0 1 16 8h-.01"/><path d="M12 8v13"/><path d="M5 22h14"/><circle cx="12" cy="5" r="3"/></svg>`,
    features: [
      "IBCLCs and qualified consultants",
      "In-home visits",
      "All feeding methods supported",
      "Practical, non-judgmental approach",
    ],
    whoItsFor:
      "Any parent navigating feeding \u2014 whether it\u2019s going smoothly or feels like a struggle.",
    category: "specialist",
  },
  {
    slug: "counselling",
    title: "Emotional Support",
    tagline: "Someone to talk to who truly understands",
    description:
      "Perinatal psychologists and counsellors who specialise in the emotional landscape of new parenthood.",
    details:
      "Grief, anxiety, identity shifts, relationship strain \u2014 our perinatal mental health professionals understand this territory deeply. Faster access than typical waitlists.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    features: [
      "Perinatal-specialised psychologists",
      "Faster access than typical waitlists",
      "In-person and telehealth available",
      "Support for both parents",
    ],
    whoItsFor:
      "Parents who are struggling emotionally \u2014 or who want a safe space to process the transition.",
    category: "emotional",
  },
  {
    slug: "cleaning",
    title: "Household Help",
    tagline: "A clean home without lifting a finger",
    description:
      "Reliable cleaning and household support so your home stays manageable while you focus on what matters.",
    details:
      "Cleaning, laundry, tidying, and light organisation. Regular or one-off sessions, scheduled around your family\u2019s rhythm.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    features: [
      "Regular and one-off sessions",
      "Cleaning, laundry, and tidying",
      "Scheduled around your routine",
      "Trusted, vetted providers",
    ],
    whoItsFor:
      "Families who need the house handled so they can focus on recovery and bonding.",
    category: "practical",
  },
  {
    slug: "life-admin",
    title: "Life Admin",
    tagline: "The invisible work, handled",
    description:
      "Appointments, paperwork, calls, and logistics \u2014 taken off your plate.",
    details:
      "Centrelink forms, medical appointments, birth registration, insurance claims \u2014 handled so you don\u2019t have to do them sleep-deprived and holding a baby.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/></svg>`,
    features: [
      "Appointment booking and scheduling",
      "Paperwork and forms assistance",
      "Phone calls on your behalf",
      "Flexible scope \u2014 whatever you need handled",
    ],
    whoItsFor:
      "Parents drowning in admin who just need someone to take things off the list.",
    category: "practical",
  },
  {
    slug: "community",
    title: "Community Connection",
    tagline: "Finding your people, without the effort",
    description:
      "Connections to local parent groups, playgroups, and community support \u2014 curated to your area.",
    details:
      "Mothers\u2019 groups, dad meet-ups, playgroups, and peer support networks. We know what\u2019s available locally and match you to groups where you\u2019ll feel welcome.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    features: [
      "Local mothers\u2019 and parents\u2019 groups",
      "Matched to your area and interests",
      "Dad-specific groups available",
      "Ongoing community integration",
    ],
    whoItsFor:
      "Parents who feel isolated and want to connect with others nearby.",
    category: "community",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "I didn\u2019t realise how much I needed help until someone actually organised it for me. Having meals just arrive \u2014 I cried. It was such a relief.",
    attribution: "New mum, Fitzroy",
  },
  {
    quote:
      "The team just got it. They listened, didn\u2019t rush us, and within days we had a sleep consultant and a cleaner booked. I finally felt like I could breathe.",
    attribution: "First-time parents, Richmond",
  },
  {
    quote:
      "I was too exhausted to even Google. Having someone say \u2018I\u2019ve got this\u2019 \u2014 that changed everything for us.",
    attribution: "New mum, Brunswick",
  },
  {
    quote:
      "As a dad, I felt like I was supposed to just hold it together. The Village helped me see that getting support isn\u2019t weakness \u2014 it\u2019s what our family needed.",
    attribution: "New dad, Carlton",
  },
  {
    quote:
      "We just needed someone to build our village. Now it feels like the most obvious truth.",
    attribution: "Parents of twins, South Yarra",
  },
];

export const highlightedServices = ["food", "postpartum-carers", "sleep", "counselling"];
