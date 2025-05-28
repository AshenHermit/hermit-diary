"use client";

import dynamic from "next/dynamic";

export const RichContentEditor = dynamic(
  () => import("./rich-content-editor"),
  {
    ssr: false,
  },
);
