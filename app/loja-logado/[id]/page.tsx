"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const NOTA_MEDIA = 4.75;

function Estrelas({ valor, tamanho = 22 }: { valor: number; tamanho?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
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

const AVALIACOES = [
  { id: 1, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo1.png", estrelas: 5, perfil: "/perfil/sofia-figueiredo", texto: "Adorei o produto. Funcionou muito na minha pele. Estou muito contente e com toda certeza irei comprar mais produtos da marca. Que orgulhoooooooo! Arrasaram"},
  { id: 2, nome: "Selena Gomez", foto: "/selena-gomez.png", estrelas: 5, perfil: "/perfil/selena-gomez", texto: "Não é por nada não, mas essa garota arrasa" },
  { id: 3, nome: "Pedro Freitas", foto: "/pedro-freitas1.jpg", estrelas: 5, perfil: null, texto: "Não consigo descrever a sensação de passar uma base que realmente orna com sua pele... Sensacional!" },
  { id: 4, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo2.jpg", estrelas: 4.5, perfil: null, texto: "Eu gostei bastante! Mas acho que errei no tom" },
  { id: 5, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo3.jpg", estrelas: 5, perfil: null, texto: "Esses produtos realmente transformaram minha rotina de beleza e elevaram minha confiança a novos patamares!!! O rímel não só dá volume e comprimento incríveis aos meus cílios, como também os levanta e curva, abrindo meu olhar e me fazendo sentir [...]" },
  { id: 6, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo4.jpg", estrelas: 4, perfil: null, texto: "Recebi recentemente meu pedido da Rare Beauty e não poderia estar mais encantada! Os produtos são absolutamente incríveis." },
];

const produtosPaginaA = [
  "/produto4.png",
  "/produto2.png",
  "/produto3.png",
];

const produtosPaginaB = [
  "/produto1.png",
  "/produto5.png",
  "/produto6.png",
];

export default function LojaPage() {
  const router = useRouter();
  const [pagina, setPagina] = useState(1);
  const totalPaginas = 5;

  const produtosDaPagina =
  pagina % 2 === 0 ? produtosPaginaB : produtosPaginaA;

  return (
    <div style={{ minHeight: "100vh", background: "#000", fontFamily: "League Spartan, sans-serif" }}>

      {/* NAVBAR LOGADA */}
      <nav className="w-full bg-[#000000] flex items-center justify-between px-8 py-4">
        <img src="/LOGOStock.io.png" alt="Stock.io" style={{ width: 160, objectFit: "contain", marginLeft: 20 }} className="h-12 w-auto object-contain" />
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push("/perfil")}
            className="text-white hover:text-[#6d35ff] transition-colors bg-transparent border-none cursor-pointer"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-white hover:text-[#ff1717] transition-colors bg-transparent border-none cursor-pointer"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", width: "100%", height: 480, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/fundo-rare-beauty.webp')",
          backgroundSize: "cover", backgroundPosition: "50% 45%", filter: "brightness(0.45)"
        }} />
        <div style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 12, zIndex: 5 }}>
          <button style={{ width: 48, height: 48, borderRadius: "50%", background: "#6A38F3", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button style={{ width: 48, height: 48, borderRadius: "50%", background: "#6A38F3", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28 }}>+</button>
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, padding: "0 60px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <img src="/rare-beauty-titulo.png" alt="Rare Beauty" style={{ height: "clamp(48px, 7vw, 86px)", objectFit: "contain" }} />
          <div style={{ position: "relative", width: "100%", marginTop: 4 }}>
            <p style={{ color: "#ddd", fontSize: 25, margin: 0, letterSpacing: 1, position: "absolute", left: 0, bottom: -10, fontWeight: 300 }}>beleza</p>
            <img src="/estrelas.png" alt="estrelas" style={{ height: 28, objectFit: "contain", position: "absolute", right: 20, bottom: -28 }} />
          </div>
        </div>
      </div>
        <div style={{ position: "absolute", bottom: 20, right: 28, color: "#ddd", fontSize: 14, zIndex: 4 }}>
          by <span style={{ textDecoration: "underline", cursor: "pointer" }}>Selena Gomez</span>
        </div>
      </div>

      {/* PRODUTOS MELHOR AVALIADOS */}
      <div style={{ background: "#F5F2E8", padding: "40px 60px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111", margin: "0 0 24px" }}>
          Produtos <span style={{ fontWeight: 400, fontSize: 18 }}>melhor avaliados</span>
        </h2>

  <div
  ref={(el) => {
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    el.onmousedown = (e) => {
      isDown = true;
      el.style.cursor = "grabbing";
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    el.onmouseleave = () => { isDown = false; el.style.cursor = "grab"; };
    el.onmouseup = () => { isDown = false; el.style.cursor = "grab"; };
    el.onmousemove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeft - walk;
    };
  }}
  style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 8 }}>
    <img src="/bronzer.png" alt="Bronzer" style={{ flexShrink: 0, borderRadius: 16, objectFit: "cover", height: 300 }} />
    <img src="/blush.png" alt="Blush" style={{ flexShrink: 0, borderRadius: 16, objectFit: "cover", height: 300 }} />
    <img src="/perfume.png" alt="Perfume" style={{ flexShrink: 0, borderRadius: 16, objectFit: "cover", height: 300 }} />
    <img src="/iluminador.png" alt="Iluminador" style={{ flexShrink: 0, borderRadius: 16, objectFit: "cover", height: 300 }} />
    <img src="/mini-blush.png" alt="Mini Blush" style={{ flexShrink: 0, borderRadius: 16, objectFit: "cover", height: 300 }} />
    <img src="/lapis.png" alt="Lápis" style={{ flexShrink: 0, borderRadius: 16, objectFit: "cover", height: 300 }} />
    <img src="/primer.png" alt="Primer" style={{ flexShrink: 0, borderRadius: 16, objectFit: "cover", height: 300 }} />
  </div>
</div>

      {/* REVIEWS */}
      <div style={{ background: "#000", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 32px" }}>
        <h2 style={{ color: "#fff", fontSize: 50, fontWeight: 390, margin: "0 0 8px" }}>Reviews e Comentários</h2>
        <p style={{ color: "#fff", fontSize: 64, fontWeight: 400, margin: "0 0 8px", lineHeight: 1.1 }}>{NOTA_MEDIA.toFixed(2)}</p>
        <Estrelas valor={NOTA_MEDIA} tamanho={44} />

        {/* ver mais → vai pra tela de avaliações */}
        <div style={{ width: "100%", maxWidth: 1050, display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <span
            onClick={() => router.push("/loja-logado/rare-beauty/avaliacoes-logado")}
            style={{ color: "#6A38F3", fontSize: 20, cursor: "pointer", fontWeight: 400 }}
          >
            ver mais
          </span>
        </div>

      {/* cards horizontal */}
      <div style={{ width: "100%", paddingLeft: 100, paddingRight: 100, boxSizing: "border-box" }}>
      <div
  ref={(el) => {
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    el.onmousedown = (e) => {
      isDown = true;
      el.style.cursor = "grabbing";
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    el.onmouseleave = () => { isDown = false; el.style.cursor = "grab"; };
    el.onmouseup = () => { isDown = false; el.style.cursor = "grab"; };
    el.onmousemove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeft - walk;
    };
  }}
  style={{ display: "flex", gap: 20, width: "100%", overflowX: "auto", paddingBottom: 8, cursor: "grab", userSelect: "none"}}
>
          {AVALIACOES.map((av) => (
            <div key={av.id} style={{ background: "#F5F2E8", borderRadius: 30, padding: "24px 24px", display: "flex", gap: 16, alignItems: "flex-start", minWidth: 500, maxWidth: 850, flexShrink: 0, height: 180}}>
              <span
                onClick={() => av.perfil && router.push(av.perfil)}
                style={{ cursor: av.perfil ? "pointer" : "default" }}
              >
                <img src={av.foto} alt={av.nome} style={{ width: 135, height: 135, borderRadius: "50%", objectFit: "cover", display: "block" }} />
              </span>
              <div style={{ flex: 1, flexDirection: "column", justifyContent: "center", display: "flex" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 16 }}>
                  <span
                    onClick={() => av.id === 1 && router.push("/perfil/sofia-figueiredo")}
                    style={{ fontWeight: 400, fontSize: 28, color: "#111", cursor: av.id === 1 ? "pointer" : "default" }}
                  >
                    {av.nome}
                  </span>
                  <Estrelas valor={av.estrelas} tamanho={30} />
                </div>
                <p style={{ fontSize: 23, color: "#333", margin: 0, lineHeight: 1, fontWeight: 300, alignItems: "center"}}>{av.texto}</p>
                <span
                  onClick={() => router.push("/loja-logado/rare-beauty/avaliacoes-logado")}
                  style={{ color: "#6A38F3", fontSize: 16, fontWeight: 300, cursor: "pointer", marginTop: -4, display: "block", textAlign: "right" }}
                >
                  ver mais
                </span>
              </div>
            </div>
          ))}
        </div>
       </div> 

   {/* PRODUTOS DE RARE BEAUTY COM PAGINAÇÃO */}
      <div style={{ background: "#F5F2E8", padding: "40px 60px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111", margin: "0 0 24px" }}>
          Produtos <span style={{ fontWeight: 400, fontSize: 18 }}>de rare beauty</span>
        </h2>
       
      <div
      style={{
         display: "flex",
        flexDirection: "column",
        gap: 24,
        marginBottom: 32,
      }}
>
  {produtosDaPagina.map((img, index) => (
    <img
      key={index}
      src={img}
      alt={`Produto ${index + 1}`}
      style={{
        width: "100%",
        borderRadius: 16,
        display: "block",
      }}
    />
  ))}
</div>

{/* PAGINAÇÃO */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    marginTop: 32,
  }}
>
  <span
    onClick={() => setPagina((p) => Math.max(1, p - 1))}
    style={{
      cursor: "pointer",
      fontSize: 65,
      fontWeight: 400,
    }}
  >
    ‹
  </span>

  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
    <span
      key={n}
      onClick={() => setPagina(n)}
      style={{
        cursor: "pointer",
        fontSize: 38,
        fontWeight: n === pagina ? 600 : 200,
      }}
    >
      {n}
    </span>
  ))}

  <span
    onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
    style={{
      cursor: "pointer",
      fontSize: 65,
      fontWeight: 400,
    }}
  >
    ›
  </span>
</div>

</div>

</div>
</div>


);
}