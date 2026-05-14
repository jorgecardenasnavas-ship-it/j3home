"use client";

/* ──────────────────────────────────────────────
   /lab/players — Placeholder pre-lanzamiento del producto Players.

   V1: placeholder estático con copy del producto futuro + nota de
   lista de espera. Sin formulario activo todavía — eso es V1.5 cuando
   construyamos Players completo (quiz diagnóstico + suscripción +
   onboarding + email automation).
   ────────────────────────────────────────────── */

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useReveal } from "@/hooks/useReveal";

export default function LabPlayersPlaceholder() {
  const { ref, visible } = useReveal(0.1);

  return (
    <div className="font-sans w-full bg-[var(--bk)] text-[var(--wh)]">
      <Navbar />
      <section
        className="relative pt-[200px] pb-[100px] max-[960px]:pt-[160px] max-[960px]:pb-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 min-h-[80vh]"
        style={{ background: "var(--bk)" }}
      >
        <div
          ref={ref}
          className="relative max-w-[680px] mx-auto text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[4px] uppercase text-[var(--champan)] mb-6 font-bold">
            J3 Lab Players
          </div>
          <h1 className="font-bold text-[clamp(36px,5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-6">
            El método J3 aplicado a tu juego.
          </h1>
          <p className="text-[15px] max-[640px]:text-[14px] opacity-80 max-w-[560px] mx-auto leading-[1.55] mb-10">
            Estamos construyendo Players. Para jugadores amateurs que dan clases pero no entienden el juego de verdad.
            <br /><br />
            Apúntate a la lista y te avisamos cuando esté listo. Si lo lanzamos en los próximos meses tendrás acceso preferente.
          </p>
          <p className="text-[12px] italic opacity-60 mb-8">
            (Formulario de lista de espera próximamente)
          </p>
          <Link
            href="/lab"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-[11.5px] font-bold tracking-[2px] uppercase rounded-[2px] border border-[var(--champan)]/60 text-[var(--champan)] hover:border-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
          >
            ← Volver al Lab
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
