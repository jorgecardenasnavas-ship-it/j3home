import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [75, 90],
  },
  // Fija la raíz del workspace al directorio del proyecto. Sin esto, Next
  // detecta el package-lock.json del directorio padre y resuelve módulos
  // (tailwindcss, etc.) en la ubicación equivocada → runtime error.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
