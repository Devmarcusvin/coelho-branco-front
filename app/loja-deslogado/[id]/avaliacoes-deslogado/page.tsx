"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/coelho-branco-front/components/marcuscomp/Sidebar";

interface Avaliacao {
  id: number;
  nome: string;
  foto: string;
  estrelas: number;
  texto: string;
}

const AVALIACOES: Avaliacao[] = [
  { id: 1, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo1.png", estrelas: 5, texto: "Adorei o produto. Funcionou muito na minha pele. Estou muito contente e com toda certeza irei comprar mais produtos da marca. Que orgulhoooooooo! Arrasaram" },
  { id: 2, nome: "Selena Gomez", foto: "/selena-gomez.png", estrelas: 5, texto: "Não é por nada não, mas essa garota arrasa" },
  { id: 3, nome: "Pedro Freitas", foto: "/pedro-freitas1.jpg", estrelas: 5, texto: "Não consigo descrever a sensação de passar uma base que realmente orna com sua pele... Sensacional! Parabéns aos envolvidos" },
  { id: 4, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo2.jpg", estrelas: 4, texto: "Eu gostei bastante! Mas acho que errei no tom" },
  { id: 5, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo3.jpg", estrelas: 5, texto: "Esses produtos realmente transformaram minha rotina de beleza e elevaram minha confiança a novos patamares!!! O rímel não só dá volume e comprimento incríveis aos meus cílios, como também os levanta e curva, abrindo meu olhar e me fazendo sentir incrível todos os dias." },
  { id: 6, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo4.jpg", estrelas: 5, texto: "Recebi recentemente meu pedido da Rare Beauty e não poderia estar mais encantada! Os produtos são absolutamente incríveis." },
];

const NOTA_MEDIA = 4.75;

function Estrelas({ valor, tamanho = 22 }: { valor: number; tamanho?: number }) {
  return (
    <div className="flex gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => {
        const preenchida = i <= Math.floor(valor);
        const meia = !preenchida && i === Math.ceil(valor) && valor % 1 >= 0.5;
        return (
          <svg key={i} width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
            {meia ? (
              <>
                <defs>
                  <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#ccc" />
                  </linearGradient>
                </defs>
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={`url(#half-${i})`} stroke="#FFD700" strokeWidth="0.5" />
              </>
            ) : (
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={preenchida ? "#FFD700" : "#ccc"} stroke={preenchida ? "#FFD700" : "#ccc"} strokeWidth="0.5" />
            )}
          </svg>
        );
      })}
    </div>
  );
}

function CardAvaliacao({ avaliacao }: { avaliacao: Avaliacao }) {
  const [expandido, setExpandido] = useState(false);
  const limite = 120;
  const longo = avaliacao.texto.length > limite;
  const textoExibido = expandido || !longo ? avaliacao.texto : avaliacao.texto.slice(0, limite) + " [...]";

  return (
    <div style={{ background: "#F5F2E8", borderRadius: "20px", padding: "24px 28px", display: "flex", gap: "20px", alignItems: "flex-start", width: "100%", maxWidth: "740px", boxSizing: "border-box" }}>
      <img src={avaliacao.foto} alt={avaliacao.nome} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>{avaliacao.nome}</span>
          <Estrelas valor={avaliacao.estrelas} tamanho={20} />
        </div>
        <p style={{ fontSize: 15, color: "#333", margin: 0, lineHeight: 1.55, textAlign: "justify" }}>{textoExibido}</p>
        <button
          onClick={() => longo && setExpandido(!expandido)}
          style={{ background: "none", border: "none", color: "#6A38F3", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginTop: 8, display: "block", marginLeft: "auto" }}
        >
          {expandido ? "ver menos" : "ver mais"}
        </button>
      </div>
    </div>
  );
}

export default function AvaliacoesLoja() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#000", fontFamily: "League Spartan, sans-serif" }}>

     {/* NAVBAR */}
        <nav className="w-full bg-[#000000] flex items-center justify-between px-8 py-4">
          <img src="/LOGOStock.io.png" alt="Stock.io" style={{ width: 160, objectFit: "contain", marginLeft: 20 }} className="h-12 w-auto object-contain" />
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
        </nav>

      {/* HERO */}
      <div style={{ position: "relative", width: "100%", height: 480, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/fundo-rare-beauty.webp')", backgroundSize: "cover", backgroundPosition: "50% 45%", filter: "brightness(0.45)" }} />
        <div style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 12, zIndex: 5 }}>
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 3, padding: "0 60px" }}>
          <img src="/rare-beauty-titulo.png" alt="Rare Beauty" style={{ height: "clamp(48px, 7vw, 86px)", objectFit: "contain" }} />
          <div style={{ position: "relative", width: "100%", marginTop: 4 }}>
            <p style={{ color: "#ddd", fontSize: 30, margin: 0, letterSpacing: 1, position: "absolute", left: "32.3%", bottom: -18, fontWeight: 300, transform: "translateX(-50%)" }}>beleza</p>
         </div>
        </div>
        <div style={{ position: "absolute", bottom: 20, right: 28, color: "#ddd", fontSize: 14, zIndex: 4 }}>
          by <span style={{ textDecoration: "underline", cursor: "pointer" }}>Selena Gomez</span>
        </div>
      </div>

      {/* REVIEWS */}
      <div style={{ background: "#000", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 24px" }}>
        <h2 style={{ color: "#fff", fontSize: 45, fontWeight: 400, margin: "0 0 8px", textAlign: "center" }}>Reviews e Comentários</h2>
        <p style={{ color: "#fff", fontSize: 65, fontWeight: 400, margin: "0 0 8px", lineHeight: 1.1 }}>{NOTA_MEDIA.toFixed(2)}</p>
        <Estrelas valor={NOTA_MEDIA} tamanho={40} />
      </div>

      {/* CARDS */}
      <div style={{ background: "#000", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "24px 24px 64px" }}>
        {AVALIACOES.map((av) => <CardAvaliacao key={av.id} avaliacao={av} />)}
      </div>

    </div>
  );
}