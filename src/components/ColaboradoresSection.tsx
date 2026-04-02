"use client";

import Image from "next/image";

export function ColaboradoresSection() {
  return (
    <div
      id="colaboradores"
      className="bg-white border-t border-black/[.06] border-b border-b-black/[.06] py-10 px-14 max-[960px]:px-6"
    >
      <div className="flex items-center justify-center gap-12 max-[960px]:flex-col max-[960px]:gap-6">
        <span className="text-[10px] font-normal tracking-[3px] uppercase text-black/40 shrink-0">
          Colaborador oficial
        </span>
        <Image
          src="/images/j3/alquilavisual.jpg"
          alt="Alquilavisual"
          width={200}
          height={56}
          className="h-14 w-auto object-contain"
        />
      </div>
    </div>
  );
}
