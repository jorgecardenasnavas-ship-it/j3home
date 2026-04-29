"use client";

import { ReactNode } from "react";

interface ChapterFrameProps {
  index: number;
  total: number;
  children: ReactNode;
  bgImage?: string;
  className?: string;
}

/**
 * Wrapper común para los capítulos del microsite Tecnifibre.
 * Garantiza altura completa, posicionamiento y soporte de imagen de fondo.
 */
export function ChapterFrame({
  index,
  total,
  children,
  bgImage,
  className = "",
}: ChapterFrameProps) {
  return (
    <section
      className={`relative min-h-[100dvh] w-full flex flex-col text-[#F8F5EF] overflow-hidden ${className}`}
      data-chapter={index}
      data-total={total}
    >
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden
        />
      )}
      <div className="relative z-10 flex flex-col flex-1 px-6 py-8 sm:px-12 sm:py-12 lg:px-20 lg:py-16">
        {children}
      </div>
    </section>
  );
}
