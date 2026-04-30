import { HeroChapter } from "./_components/HeroChapter";
import { BridgeAnimation } from "./_components/BridgeAnimation";
import { LeversSection } from "./_components/LeversSection";
import { ProposalChapter } from "./_components/ProposalChapter";
import { HablamosChapter } from "./_components/HablamosChapter";

export default function TecnifibrePage() {
  return (
    <main className="bg-[var(--bk)]">
      <HeroChapter />
      <BridgeAnimation />
      <LeversSection />
      <ProposalChapter />
      <HablamosChapter />
    </main>
  );
}
