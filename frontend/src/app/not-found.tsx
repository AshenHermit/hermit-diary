"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <div className="grid min-h-[100vh] grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="flex flex-col items-center justify-center">
        <div className="text-[10rem] font-extrabold opacity-50">404</div>
        <div className="text-4xl font-extrabold">Not Found</div>
      </div>
      <Footer />
    </div>
  );
}
