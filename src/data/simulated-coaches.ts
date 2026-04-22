/**
 * Simulated coaches for visualization purposes.
 *
 * 100 fake entries distributed across ~40 cities in Europe + a couple of
 * outliers, split by status:
 *
 *   - 20 Verified (mentorActive + certifiedAt + certificationActive)
 *   - 30 Qualified (certifiedAt + certificationActive, no mentor)
 *   - 20 Plus active (plusActive, no certification yet)
 *   - 30 Basic (none of the above — invisible on the map per filter logic)
 *
 * Naming is generated deterministically from index + city to keep data
 * stable across renders. Coordinates get a small sin/cos jitter so pins
 * in the same city don't stack on top of each other.
 */

import type { Coach } from "@/data/coaches";

type Status = "verified" | "qualified" | "plus" | "basic";

interface CityBlock {
  city: string;
  country: string;
  coords: [number, number];
  /** [verified, qualified, plus, basic] */
  counts: [number, number, number, number];
}

const CITY_BLOCKS: CityBlock[] = [
  // ── Spain · Andalucía ──
  { city: "Málaga", country: "España", coords: [36.72, -4.42], counts: [2, 1, 1, 1] },
  { city: "Marbella", country: "España", coords: [36.51, -4.89], counts: [1, 1, 0, 1] },
  { city: "Torremolinos", country: "España", coords: [36.62, -4.50], counts: [0, 1, 1, 0] },
  { city: "Fuengirola", country: "España", coords: [36.54, -4.62], counts: [0, 1, 0, 1] },
  { city: "Estepona", country: "España", coords: [36.43, -5.15], counts: [0, 1, 0, 1] },
  { city: "Sevilla", country: "España", coords: [37.39, -5.98], counts: [0, 1, 1, 1] },
  { city: "Cádiz", country: "España", coords: [36.53, -6.29], counts: [0, 1, 0, 1] },
  { city: "Granada", country: "España", coords: [37.18, -3.60], counts: [1, 0, 0, 1] },

  // ── Spain · Centro ──
  { city: "Madrid", country: "España", coords: [40.42, -3.70], counts: [2, 2, 1, 2] },
  { city: "Alcobendas", country: "España", coords: [40.54, -3.64], counts: [0, 1, 1, 1] },
  { city: "Boadilla del Monte", country: "España", coords: [40.40, -3.87], counts: [0, 1, 1, 0] },
  { city: "Pozuelo de Alarcón", country: "España", coords: [40.43, -3.81], counts: [1, 0, 1, 0] },

  // ── Spain · Cataluña + Valencia ──
  { city: "Barcelona", country: "España", coords: [41.38, 2.17], counts: [1, 1, 1, 1] },
  { city: "Sabadell", country: "España", coords: [41.54, 2.10], counts: [0, 0, 1, 0] },
  { city: "Valencia", country: "España", coords: [39.46, -0.37], counts: [1, 1, 1, 1] },

  // ── Spain · Norte ──
  { city: "Bilbao", country: "España", coords: [43.26, -2.93], counts: [1, 0, 1, 0] },
  { city: "San Sebastián", country: "España", coords: [43.31, -1.98], counts: [0, 0, 0, 1] },

  // ── Spain · Islas ──
  { city: "Palma", country: "España", coords: [39.57, 2.65], counts: [1, 1, 0, 1] },
  { city: "Ibiza", country: "España", coords: [38.90, 1.42], counts: [0, 1, 0, 1] },
  { city: "Las Palmas", country: "España", coords: [28.12, -15.43], counts: [0, 1, 0, 1] },
  { city: "Tenerife", country: "España", coords: [28.46, -16.25], counts: [0, 1, 0, 1] },

  // ── Portugal ──
  { city: "Lisboa", country: "Portugal", coords: [38.72, -9.14], counts: [1, 1, 0, 1] },
  { city: "Cascais", country: "Portugal", coords: [38.70, -9.42], counts: [0, 0, 1, 1] },
  { city: "Porto", country: "Portugal", coords: [41.16, -8.63], counts: [0, 1, 0, 1] },
  { city: "Faro", country: "Portugal", coords: [37.02, -7.93], counts: [0, 0, 1, 0] },

  // ── France ──
  { city: "Paris", country: "Francia", coords: [48.86, 2.35], counts: [1, 1, 1, 1] },
  { city: "Nice", country: "Francia", coords: [43.71, 7.26], counts: [0, 1, 0, 1] },
  { city: "Marseille", country: "Francia", coords: [43.30, 5.37], counts: [0, 0, 1, 0] },
  { city: "Monaco", country: "Mónaco", coords: [43.74, 7.42], counts: [1, 1, 0, 0] },

  // ── Italy ──
  { city: "Milano", country: "Italia", coords: [45.46, 9.19], counts: [1, 1, 0, 1] },
  { city: "Roma", country: "Italia", coords: [41.90, 12.50], counts: [0, 1, 1, 1] },
  { city: "Napoli", country: "Italia", coords: [40.85, 14.27], counts: [0, 0, 1, 0] },

  // ── UK ──
  { city: "London", country: "Reino Unido", coords: [51.51, -0.13], counts: [1, 1, 1, 1] },
  { city: "Manchester", country: "Reino Unido", coords: [53.48, -2.24], counts: [0, 1, 0, 1] },

  // ── Germany ──
  { city: "Berlin", country: "Alemania", coords: [52.52, 13.40], counts: [1, 1, 0, 1] },
  { city: "München", country: "Alemania", coords: [48.14, 11.58], counts: [0, 1, 0, 0] },

  // ── Benelux ──
  { city: "Amsterdam", country: "Países Bajos", coords: [52.37, 4.90], counts: [0, 1, 0, 1] },
  { city: "Brussels", country: "Bélgica", coords: [50.85, 4.35], counts: [0, 0, 1, 1] },

  // ── Switzerland ──
  { city: "Zürich", country: "Suiza", coords: [47.38, 8.54], counts: [1, 0, 0, 0] },

  // ── Scandinavia ──
  { city: "Stockholm", country: "Suecia", coords: [59.33, 18.07], counts: [0, 1, 0, 1] },
  { city: "Copenhagen", country: "Dinamarca", coords: [55.68, 12.57], counts: [0, 0, 1, 0] },

  // ── Outliers ──
  { city: "Dubai", country: "EAU", coords: [25.20, 55.27], counts: [1, 0, 0, 0] },
  { city: "Miami", country: "EEUU", coords: [25.76, -80.19], counts: [1, 0, 0, 0] },
];

const FIRST_NAMES = [
  "Alex", "Carlos", "María", "Javier", "Laura", "Pedro", "Isabel", "Luis",
  "Sofía", "David", "Elena", "Marco", "Anna", "Diego", "Clara", "Pablo",
  "Eva", "Raúl", "Lucía", "Jorge", "Sara", "Víctor", "Nuria", "Álvaro",
  "Inés", "Martín", "Paula", "Rubén", "Irene", "Héctor",
];

const LAST_NAMES = [
  "García", "Ruiz", "Martín", "Fernández", "Gómez", "Moreno", "López",
  "Díaz", "Pérez", "Sánchez", "Navarro", "Torres", "Vega", "Romero",
  "Ortiz", "Castro", "Molina", "Soler", "Reyes", "Serrano",
];

/** Deterministic jitter so two pins in the same city don't overlap exactly. */
function jitter(idx: number, seed: number): number {
  return Math.sin(idx * 1.618 + seed * 2.414) * 0.12;
}

function slugify(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeCoach(
  block: CityBlock,
  status: Status,
  idx: number,
): Coach {
  const firstName = FIRST_NAMES[idx % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(idx * 7) % LAST_NAMES.length];
  const slug = `sim-${slugify(block.city)}-${idx}`;
  const coords: [number, number] = [
    block.coords[0] + jitter(idx, 1),
    block.coords[1] + jitter(idx, 2),
  ];

  const base: Coach = {
    slug,
    name: `${firstName} ${lastName}`,
    location: {
      city: block.city,
      country: block.country,
      coordinates: coords,
    },
    tier: "coach",
    type: "coach",
    joinedAt: "2024-01-15",
  };

  if (status === "verified") {
    return {
      ...base,
      certifiedAt: "2024-06-10",
      certificationActive: true,
      mentorActive: true,
      joinedAt: "2023-09-01",
    };
  }
  if (status === "qualified") {
    return {
      ...base,
      certifiedAt: "2024-10-15",
      certificationActive: true,
    };
  }
  if (status === "plus") {
    return {
      ...base,
      plusActive: true,
      joinedAt: "2025-02-01",
    };
  }
  // basic — just the base. Doesn't render on the map.
  return base;
}

const coaches: Coach[] = [];
let globalIdx = 1000; // high offset to avoid clashes with real coach indices

CITY_BLOCKS.forEach((block) => {
  const [nVer, nQual, nPlus, nBasic] = block.counts;
  for (let i = 0; i < nVer; i++) {
    coaches.push(makeCoach(block, "verified", globalIdx++));
  }
  for (let i = 0; i < nQual; i++) {
    coaches.push(makeCoach(block, "qualified", globalIdx++));
  }
  for (let i = 0; i < nPlus; i++) {
    coaches.push(makeCoach(block, "plus", globalIdx++));
  }
  for (let i = 0; i < nBasic; i++) {
    coaches.push(makeCoach(block, "basic", globalIdx++));
  }
});

export const SIMULATED_COACHES: readonly Coach[] = coaches;
