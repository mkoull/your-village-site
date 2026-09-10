export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  need: string;
  tone: "sage" | "rose" | "lilac" | "gold";
  tagline: string;
  description: string;
  details: string;
  icon: string;
  features: string[];
  whoItsFor: string;
  category: "practical" | "specialist" | "emotional" | "community";
}

// The legacy postpartum-carers URL is retained so existing links still work.
export const services: Service[] = [
  {
    slug: "food",
    shortTitle: "Meals",
    need: "A proper meal",
    tone: "gold",
    title: "Meals & food support",
    tagline: "One less thing on your plate",
    description:
      "Nourishing meals, ready when you are. Meal delivery and food support can take dinner off your list, whether it's a busy week or a new chapter.",
    details:
      "Different providers offer different menus, delivery areas and schedules. Consider your household size, dietary needs and the amount of preparation that works for you.",
    features: [
      "Prepared meals and family dinners",
      "Options for dietary needs",
      "Regular deliveries or occasional help",
      "Support through busy weeks and life changes",
    ],
    whoItsFor:
      "Mothers, parents and households who could use help getting good food on the table.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18c0 5-3.5 9-9 9s-9-4-9-9Z"/><path d="M8 4c-2 2 2 2 0 4M12 3c-2 2 2 2 0 4M16 4c-2 2 2 2 0 4M8 22h8"/></svg>',
    category: "practical",
  },
  {
    slug: "postpartum-carers",
    shortTitle: "Care",
    need: "An extra pair of hands",
    tone: "rose",
    title: "Nannies & family care",
    tagline: "An extra pair of caring hands",
    description:
      "From newborn care to a nanny who fits your family, an extra pair of hands can give you time to rest, work, or simply catch your breath.",
    details:
      "Look for care that fits your children's ages, your schedule and your preferences. Services may include daytime care, after-school help or specialist newborn support, depending on the provider.",
    features: [
      "Nannies and daytime childcare",
      "Help with school-day routines",
      "Newborn and postpartum care",
      "Occasional or regular support",
    ],
    whoItsFor:
      "Families with babies or older children, and parents who need time to rest, work or look after themselves.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    category: "practical",
  },
  {
    slug: "sleep",
    shortTitle: "Sleep",
    need: "A little more rest",
    tone: "lilac",
    title: "Sleep support",
    tagline: "Space for more rest",
    description:
      "Make sense of sleep with guidance that considers your child, your routines and what feels right for your family.",
    details:
      "A qualified professional can discuss age-appropriate routines, your child's needs and your preferences. Ask about their qualifications, approach and what follow-up is included.",
    features: [
      "Baby and child sleep guidance",
      "Discussion of your family's routines",
      "Questions to help choose an approach",
      "In-person or remote options, where offered",
    ],
    whoItsFor:
      "Parents looking for guidance with their child's sleep and their family's routines.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    category: "specialist",
  },
  {
    slug: "lactation",
    shortTitle: "Feeding",
    need: "Feeding reassurance",
    tone: "gold",
    title: "Feeding support",
    tagline: "Find what works for you and your baby",
    description:
      "Breastfeeding, bottle-feeding or a bit of both. Find qualified feeding support to help you understand your options and feel more confident.",
    details:
      "Feeding support can help you ask questions and understand your options. Confirm a provider's credentials and scope of practice, including IBCLC certification where relevant.",
    features: [
      "Lactation consultations",
      "Support with different feeding methods",
      "Practical questions and guidance",
      "Provider qualifications explained",
    ],
    whoItsFor:
      "Expecting parents and families with babies who want support with feeding.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/></svg>',
    category: "specialist",
  },
  {
    slug: "counselling",
    shortTitle: "Wellbeing",
    need: "Someone to talk to",
    tone: "rose",
    title: "Mental health & wellbeing",
    tagline: "Support for you, as a person",
    description:
      "Room to talk about how you're really doing. Counselling and psychological support for parenting, change, and everything else life brings.",
    details:
      "Your needs matter beyond your role in a family. Consider a professional's qualifications, areas of practice, appointment options and fees when finding support. Clinical assessment and treatment come from the relevant qualified professional.",
    features: [
      "Counselling and psychological support",
      "Parenting and life transitions",
      "Perinatal support where relevant",
      "In-person or telehealth, where offered",
    ],
    whoItsFor:
      "Mothers, parents and individuals who want professional emotional or mental health support.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    category: "emotional",
  },
  {
    slug: "cleaning",
    shortTitle: "Home",
    need: "A lighter load at home",
    tone: "sage",
    title: "Household help",
    tagline: "A little less on the to-do list",
    description:
      "The washing, the floors, the things that keep piling up. Practical help at home gives you a little room to breathe.",
    details:
      "Choose the tasks that would make the biggest difference. Providers may offer a one-off visit or a regular arrangement, with the scope and cost agreed before you book.",
    features: [
      "Cleaning and tidying",
      "Laundry and household tasks",
      "One-off or regular help",
      "Support around your household's routine",
    ],
    whoItsFor:
      "Anyone who could use an extra hand at home, at any stage of family life.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    category: "practical",
  },
  {
    slug: "life-admin",
    shortTitle: "Life admin",
    need: "A clearer head",
    tone: "gold",
    title: "Life admin",
    tagline: "Make room in your head, too",
    description:
      "Appointments, forms and the family calendar. Get help with the everyday details that take up more headspace than anyone sees.",
    details:
      "Decide what you would like help with and what access is needed. Any personal information or action taken on your behalf should be agreed with you first.",
    features: [
      "Appointments and scheduling",
      "Practical help with forms",
      "Household organisation",
      "Everyday logistics",
    ],
    whoItsFor:
      "People carrying a full mental load who want help with the practical details.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/></svg>',
    category: "practical",
  },
  {
    slug: "community",
    shortTitle: "Connection",
    need: "A sense of connection",
    tone: "sage",
    title: "Community & connection",
    tagline: "Find people who get it",
    description:
      "A familiar face. A shared experience. A reason to get out of the house. Local groups and activities can be the beginning of your village.",
    details:
      "A village includes belonging as well as practical help. Look for parent groups, playgroups, community activities and peer connections that fit your interests and stage of life.",
    features: [
      "Parent and family groups",
      "Local activities and playgroups",
      "Peer connection",
      "Community support networks",
    ],
    whoItsFor:
      "Anyone seeking company, shared experience or a stronger sense of connection nearby.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    category: "community",
  },
];

export const highlightedServices = [
  "food",
  "postpartum-carers",
  "counselling",
  "cleaning",
];
