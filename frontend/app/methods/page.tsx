import * as React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { atlasUiFont } from "@/lib/fonts";
import { staticTaxonomy } from "@/lib/staticTaxonomy";
import { TaxonomyView } from "./TaxonomyView";

export default function MethodsPage() {
  return (
    <div className={`${atlasUiFont.className} min-h-screen bg-[#F8F7F2] text-[#111111] tracking-normal`}>
      <Navbar />
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 pb-20">

        <nav className="flex items-center gap-2 text-[13px] text-[#8B8B8B] mb-6">
          <Link href="/" className="hover:text-[#FF5A1F] transition-colors no-underline">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#555555] font-medium">Methods</span>
        </nav>

        <TaxonomyView initialTaxonomy={staticTaxonomy} />
      </div>
    </div>
  );
}
