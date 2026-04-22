import { notFound } from "next/navigation";
import { COACHES, type Coach } from "@/data/coaches";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CoachProfile } from "@/components/CoachProfile";

interface Params {
  slug: string;
}

export function generateStaticParams() {
  return COACHES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const coach = COACHES.find((c) => c.slug === slug);
  if (!coach) return { title: "Coach no encontrado · J3Pádel" };
  return {
    title: `${coach.name} · Coach J3Pádel`,
    description: `Coach ${coach.name} en ${coach.location.city}, ${coach.location.country}.`,
  };
}

export default async function CoachPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const coach: Coach | undefined = COACHES.find((c) => c.slug === slug);

  if (!coach) notFound();

  // Find related coaches: same city first, then same country (up to 3)
  const related = COACHES.filter(
    (c) =>
      c.slug !== coach.slug &&
      (c.certifiedAt || c.mentorActive) &&
      c.certificationActive !== false,
  );
  const sameCity = related.filter(
    (c) => c.location.city === coach.location.city,
  );
  const sameCountry = related.filter(
    (c) =>
      c.location.country === coach.location.country &&
      c.location.city !== coach.location.city,
  );
  const relatedCoaches = [...sameCity, ...sameCountry].slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <CoachProfile coach={coach} relatedCoaches={relatedCoaches} />
      </main>
      <Footer />
    </>
  );
}
