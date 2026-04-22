export type HomeProductAudience = "play" | "coach" | "manage";

export interface HomeProduct {
  id: string;
  nameParts: { text: string; gold: boolean }[];
  watermark: string;
  shortName: string;
  dark: boolean;
  featured: boolean;
  premiumBadge: boolean;
  href: string;
  isExternal: boolean;
  soon: boolean;
  fullWidth: boolean;
  asset: { type: "image" | "video"; src: string; poster?: string };
  audience: HomeProductAudience;
}

export const HOME_PRODUCTS: HomeProduct[] = [
  {
    id: "coach360",
    nameParts: [{ text: "Coach", gold: true }, { text: "\u00A0360", gold: false }],
    watermark: "C360",
    shortName: "Coach 360",
    dark: true,
    featured: true,
    premiumBadge: false,
    href: "https://j3padel.com/join",
    isExternal: true,
    soon: false,
    fullWidth: false,
    asset: { type: "video", src: "/videos/coach360-higueron.mp4" },
    audience: "coach",
  },
  {
    id: "training-camp",
    nameParts: [{ text: "Training", gold: true }, { text: "\u00A0Camp", gold: false }],
    watermark: "TC",
    shortName: "Training",
    dark: true,
    featured: true,
    premiumBadge: true,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/stage-group.jpeg" },
    audience: "play",
  },
  {
    id: "adults",
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Adults", gold: false }],
    watermark: "ADT",
    shortName: "Adults",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/amateur.jpeg" },
    audience: "play",
  },
  {
    id: "juniors",
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Juniors", gold: false }],
    watermark: "JNR",
    shortName: "Juniors",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/kids.jpeg" },
    audience: "play",
  },
  {
    id: "j3ptv",
    nameParts: [{ text: "J3P", gold: true }, { text: "TV", gold: false }],
    watermark: "TV",
    shortName: "J3PTV",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: false,
    asset: { type: "video", src: "/videos/jmd-higueron.mp4" },
    audience: "play",
  },
  {
    id: "business-plan",
    nameParts: [{ text: "Business", gold: true }, { text: "\u00A0Plan", gold: false }],
    watermark: "BIZ",
    shortName: "Business",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/pro.jpeg" },
    audience: "manage",
  },
  {
    id: "experience",
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Experience", gold: false }],
    watermark: "EXP",
    shortName: "Experience",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: true,
    asset: { type: "video", src: "/videos/empresas-bg.mp4" },
    audience: "manage",
  },
  {
    id: "partner",
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Partner", gold: false }],
    watermark: "PTR",
    shortName: "Partner",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: true,
    asset: { type: "image", src: "/images/j3/alquilavisual.jpg" },
    audience: "manage",
  },
];

// Orbital ring order: alternates audiences for maximum claim dynamism.
// Index 0 is the initial active. Rotation advances clockwise (next index).
export const ORBITAL_RING_ORDER: string[] = [
  "training-camp", // Play — initial active
  "coach360",      // Coach
  "adults",        // Play
  "business-plan", // Manage
  "juniors",       // Play
  "experience",    // Manage
  "j3ptv",         // Play
  "partner",       // Manage
];
