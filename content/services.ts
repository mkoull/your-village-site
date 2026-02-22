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

export interface Stat {
  label: string;
  value: string;
  description: string;
}

export const services: Service[] = [
  {
    slug: "food",
    title: "Food Support",
    tagline: "Nourishing meals without the mental load",
    description:
      "Nutritious, comforting meals delivered to your door — so you can focus on recovery and your baby, not what's for dinner.",
    details:
      "We connect you with meal providers who specialise in postpartum nutrition. From nourishing broths and lactation-friendly meals to family dinners that just arrive — no planning, no cooking, no dishes. Your coordinator handles the scheduling and dietary requirements.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><line x1="10" y1="22" x2="14" y2="22"/></svg>`,
    features: [
      "Postpartum-focused meal delivery",
      "Dietary requirements handled",
      "Flexible scheduling — daily, weekly, or as needed",
      "Family meals, not just mum",
    ],
    whoItsFor:
      "Any new parent who wants nutritious food without the effort of planning, shopping, or cooking.",
    category: "practical",
  },
  {
    slug: "postpartum-carers",
    title: "Postpartum Carers",
    tagline: "Experienced hands so you can rest",
    description:
      "Day and overnight carers who support you with baby settling, feeding, and light household help — so you can actually sleep.",
    details:
      "Our postpartum carers are experienced with newborns and understand the early weeks intimately. They can help with settling, nappy changes, feeding support, and light housework. Overnight carers mean you can get a real stretch of sleep while your baby is in safe hands.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    features: [
      "Day and overnight support available",
      "Baby settling and feeding assistance",
      "Light household help",
      "Experienced with newborns and multiples",
    ],
    whoItsFor:
      "Parents who need extra hands — especially in those first exhausting weeks when sleep feels impossible.",
    category: "practical",
  },
  {
    slug: "sleep",
    title: "Sleep Support",
    tagline: "Gentle guidance for better nights",
    description:
      "Evidence-based sleep specialists who work with your family's values — no cry-it-out unless that's your choice.",
    details:
      "Our sleep consultants take the time to understand your family, your baby's temperament, and what feels right for you. They offer gentle, evidence-based approaches to help everyone get more rest. Your coordinator matches you with a specialist whose philosophy aligns with yours.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    features: [
      "Evidence-based, gentle approaches",
      "Matched to your parenting philosophy",
      "In-home and virtual consultations",
      "Follow-up support included",
    ],
    whoItsFor:
      "Families struggling with sleep who want compassionate, expert guidance — not judgment.",
    category: "specialist",
  },
  {
    slug: "lactation",
    title: "Lactation Support",
    tagline: "Expert feeding support, without the pressure",
    description:
      "Qualified lactation consultants who help with breastfeeding, bottle-feeding, or a combination — whatever works for your family.",
    details:
      "Feeding challenges are one of the most common and most stressful parts of early parenthood. Our IBCLCs and lactation consultants offer practical, non-judgmental support whether you're breastfeeding, expressing, bottle-feeding, or doing a mix. They come to your home and work with you in your own environment.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2l.01 4A2 2 0 0 0 8 8h.01"/><path d="M18 2l-.01 4A2 2 0 0 1 16 8h-.01"/><path d="M12 8v13"/><path d="M5 22h14"/><circle cx="12" cy="5" r="3"/></svg>`,
    features: [
      "IBCLCs and qualified consultants",
      "In-home visits",
      "All feeding methods supported",
      "Practical, non-judgmental approach",
    ],
    whoItsFor:
      "Any parent navigating feeding — whether it's going smoothly or feels like a struggle.",
    category: "specialist",
  },
  {
    slug: "counselling",
    title: "Emotional Support",
    tagline: "Someone to talk to who truly understands",
    description:
      "Perinatal psychologists and counsellors who specialise in the emotional landscape of new parenthood.",
    details:
      "The transition to parenthood can bring up feelings no one warns you about — grief, anxiety, identity shifts, relationship strain. Our perinatal mental health professionals understand this territory deeply. Your coordinator can arrange sessions quickly, without the usual months-long waitlists.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    features: [
      "Perinatal-specialised psychologists",
      "Faster access than typical waitlists",
      "In-person and telehealth available",
      "Support for both parents",
    ],
    whoItsFor:
      "Parents who are struggling emotionally — or who simply want a safe space to process the transition.",
    category: "emotional",
  },
  {
    slug: "cleaning",
    title: "Household Help",
    tagline: "A clean home without lifting a finger",
    description:
      "Reliable cleaning and household support so your home stays manageable while you focus on what matters.",
    details:
      "When a new baby arrives, housework is one of the first things that falls apart — and one of the biggest sources of stress. Our household helpers handle cleaning, laundry, tidying, and light organisation. Regular or one-off sessions, scheduled around your family's rhythm.",
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
      "Help with the endless admin that piles up — appointments, paperwork, calls, and coordination.",
    details:
      "New parenthood comes with a mountain of invisible work: centrelink forms, medical appointments, birth registration, insurance claims. Our life admin support takes these tasks off your plate so you don't have to do them while sleep-deprived and holding a baby.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/></svg>`,
    features: [
      "Appointment booking and coordination",
      "Paperwork and forms assistance",
      "Phone calls on your behalf",
      "Flexible scope — whatever you need handled",
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
      "Connections to local parent groups, playgroups, and community support — curated to your area and interests.",
    details:
      "Isolation is one of the hardest parts of new parenthood. We help connect you to local community resources — mothers' groups, dad meet-ups, playgroups, and peer support networks. Your coordinator knows what's available in your area and matches you to groups where you'll feel welcome.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    features: [
      "Local mothers' and parents' groups",
      "Matched to your area and interests",
      "Dad-specific groups available",
      "Ongoing community integration",
    ],
    whoItsFor:
      "Parents who feel isolated and want to connect with others going through the same experience.",
    category: "community",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "I didn't realise how much I needed help until someone actually organised it for me. Having meals just arrive — I cried the first time. It was such a relief.",
    attribution: "New mum, Fitzroy",
  },
  {
    quote:
      "Our coordinator just got it. She listened, didn't rush us, and within days we had a sleep consultant and a cleaner booked. I finally felt like I could breathe.",
    attribution: "First-time parents, Richmond",
  },
  {
    quote:
      "I'm the kind of person who researches everything. But I was too exhausted to even Google. Having someone say 'I've got this' — that changed everything for us.",
    attribution: "New mum, Brunswick",
  },
  {
    quote:
      "As a dad, I felt like I was supposed to just hold it together. The Village helped me see that getting support isn't weakness — it's what our family needed.",
    attribution: "New dad, Carlton",
  },
  {
    quote:
      "The concept of a village raising a child used to feel like a cliche. Now it feels like the most obvious truth. We just needed someone to build ours.",
    attribution: "Parents of twins, South Yarra",
  },
];

export const stats: Stat[] = [
  {
    label: "Response time",
    value: "< 4 hrs",
    description: "Our target response to every enquiry",
  },
  {
    label: "Your contact",
    value: "1 coordinator",
    description: "A single person who knows your story",
  },
  {
    label: "Provider standard",
    value: "Every one vetted",
    description: "Background-checked and personally reviewed",
  },
  {
    label: "Starting in",
    value: "Inner Melbourne",
    description: "Growing outward from where we are",
  },
];

export const highlightedServices = ["food", "postpartum-carers", "sleep", "counselling"];
