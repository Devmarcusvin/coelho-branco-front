"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  logado: boolean;
  onLogout: () => void;
  onLogin: () => void;
}

export default function Navbar({ logado, onLogout, onLogin }: NavbarProps) {
  const router = useRouter();

  return (
    <nav className="w-full bg-[#000000] flex items-center justify-between px-8 py-4">
      <img src="/LOGOStock.io.png" alt="Stock.io" className="h-12 w-auto object-contain" />

      {logado ? (
        /* NAVBAR LOGADA */
        <div className="flex items-center gap-6">
          <button
            onClick={() => console.log("ir para perfil")}
            className="text-white hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
          <button
            onClick={onLogout}
            className="text-white hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      ) : (
        /* NAVBAR DESLOGADA */
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-white font-[family-name:var(--font-league-spartan)] text-[16px] hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none"
          >
            LOGIN
          </button>
          <button
            onClick={() => router.push("/cadastro")}
            className="px-5 py-2 bg-[#6A38F3] text-white rounded-full font-[family-name:var(--font-league-spartan)] text-[16px] font-bold hover:bg-[#5228d4] transition-colors cursor-pointer"
          >
            CADASTRE-SE
          </button>
        </div>
      )}
    </nav>
  );
}