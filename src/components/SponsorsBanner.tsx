"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/context";

export function SponsorsBanner() {
  const { t } = useI18n();

  return (
    <div
      id="partners"
      className="bg-white w-full py-10 max-[960px]:py-6 px-14 max-[960px]:px-6 flex flex-col items-center justify-center border-t border-black/[.06] overflow-hidden z-10"
    >
      {/* Gold line */}
      <div
        className="h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent mb-8 max-[960px]:mb-5"
        style={{ width: "100%", maxWidth: "400px" }}
      />

      <div className="inline-flex items-center flex-nowrap gap-[72px] max-[960px]:gap-10">
        {t.sponsors.items.map((s) => (
          <div key={s.alt}>
            <Image
              src={s.src}
              alt={s.alt}
              width={s.w}
              height={s.h}
              className="h-[52px] max-[960px]:h-9 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
