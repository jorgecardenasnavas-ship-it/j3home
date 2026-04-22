export interface AcademyProgram {
  id: string;
  name: string;
  tag: string;
  image: string;
  anchor: string;
}

export const ACADEMY_PROGRAMS: AcademyProgram[] = [
  {
    id: "kinder",
    name: "Kinder",
    tag: "4 \u2013 10 a\u00F1os",
    image: "/images/academy/kinder.jpeg",
    anchor: "juniors",
  },
  {
    id: "kids",
    name: "Kids",
    tag: "10+",
    image: "/images/academy/kids.jpeg",
    anchor: "juniors",
  },
  {
    id: "junior",
    name: "Junior",
    tag: "14+ \u00B7 Competici\u00F3n",
    image: "/images/academy/nextgen.jpeg",
    anchor: "juniors",
  },
  {
    id: "nextgen",
    name: "Next Gen",
    tag: "16+ \u00B7 Circuito",
    image: "/images/academy/nextgen-pro.jpeg",
    anchor: "juniors",
  },
  {
    id: "amateur",
    name: "Amateur",
    tag: "Adultos",
    image: "/images/academy/amateur.jpeg",
    anchor: "adultos",
  },
  {
    id: "pro",
    name: "Pro",
    tag: "Avanzado \u00B7 Adultos",
    image: "/images/academy/pro.jpeg",
    anchor: "adultos",
  },
];
