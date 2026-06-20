"use client";

import { useSearchParams } from "next/navigation";
import AvaliacaoDetalhe from "@/components/AvaliacaoDetalhe";

export default function AbrirAvaliacao() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const lojaId = searchParams.get("lojaId");
  const isLoggedIn = true;

  if (!id || !lojaId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e3]">
        <p className="text-red-500">Avaliação não encontrada.</p>
      </div>
    );
  }

  return (
    <AvaliacaoDetalhe
      lojaId={lojaId}
      avaliacaoId={id}
      isLoggedIn={isLoggedIn}
    />
  );
}