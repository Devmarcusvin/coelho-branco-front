"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ModalEditarLoja from "@/components/EditarLoja";
import ModalAdicionarProduto from "@/components/ModalAdicionarProduto";

const NOTA_MEDIA = 4.75;

type Produto = {
  id: number;
  nome: string;
  preco: string;
  unidade?: string;
  disponivel: boolean;
  img: string;
  logo?: string;
};

function Estrelas({ valor, tamanho }: { valor: number; tamanho: number }) {
  const estrelasCheias = Math.floor(valor);
  const temMeia = valor - estrelasCheias >= 0.5;
  const estrelasVazias = 5 - estrelasCheias - (temMeia ? 1 : 0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: estrelasCheias }).map((_, i) => (
        <svg key={`cheia-${i}`} width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="#FFD700">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
      {temMeia && (
        <svg key="meia" width={tamanho} height={tamanho} viewBox="0 0 24 24">
          <defs>
            <linearGradient id="meia-estrela">
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#ccc" />
            </linearGradient>
          </defs>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="url(#meia-estrela)" />
        </svg>
      )}
      {Array.from({ length: estrelasVazias }).map((_, i) => (
        <svg key={`vazia-${i}`} width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="#ccc">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function ProdutoCardAvaliados({ produto, onClick }: { produto: Produto; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-3 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-square mb-3 flex items-center justify-center">
        <img src={produto.img} alt={produto.nome} className="w-full h-full object-contain" />
        {produto.logo && (
          <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-6 h-6 rounded-full object-contain" />
        )}
      </div>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[13px] leading-tight mb-0.5 truncate">
        {produto.nome}
      </p>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[14px]">
        {produto.preco}
        {produto.unidade && <span className="text-[10px] font-normal text-[#888] ml-1">{produto.unidade}</span>}
      </p>
      <p className={`text-[10px] font-bold mt-0.5 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
        {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
      </p>
    </div>
  );
}

function ProdutoCardPaginacao({ produto, onClick }: { produto: Produto; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
        <img src={produto.img} alt={produto.nome} className="w-full h-full object-contain" />
        {produto.logo && (
          <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain" />
        )}
      </div>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1 truncate">
        {produto.nome}
      </p>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
        {produto.preco}
        {produto.unidade && <span className="text-[13px] font-normal text-[#888] ml-1">{produto.unidade}</span>}
      </p>
      <p className={`text-[13px] font-bold mt-1 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
        {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
      </p>
    </div>
  );
}

const AVALIACOES = [
  { id: 1, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo1.png", estrelas: 5, perfil: "/perfil/sofia-figueiredo", texto: "Adorei o produto. Funcionou muito na minha pele. Estou muito contente e com toda certeza irei comprar mais produtos da marca. Que orgulhoooooooo! Arrasaram" },
  { id: 2, nome: "Selena Gomez", foto: "/selena-gomez.png", estrelas: 5, perfil: "/perfil/selena-gomez", texto: "Não é por nada não, mas essa garota arrasa" },
  { id: 3, nome: "Pedro Freitas", foto: "/pedro-freitas1.jpg", estrelas: 5, perfil: null, texto: "Não consigo descrever a sensação de passar uma base que realmente orna com sua pele... Sensacional!" },
  { id: 4, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo2.jpg", estrelas: 4.5, perfil: null, texto: "Eu gostei bastante! Mas acho que errei no tom" },
  { id: 5, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo3.jpg", estrelas: 5, perfil: null, texto: "Esses produtos realmente transformaram minha rotina de beleza e elevaram minha confiança a novos patamares!!! O rímel não só dá volume e comprimento incríveis aos meus cílios, como também os levanta e curva, abrindo meu olhar e me fazendo sentir [...]" },
  { id: 6, nome: "Sofia Figueiredo", foto: "/sofia-figueiredo4.jpg", estrelas: 4, perfil: null, texto: "Recebi recentemente meu pedido da Rare Beauty e não poderia estar mais encantada! Os produtos são absolutamente incríveis." },
];

const produtosMelhorAvaliados: Produto[] = [
  { id: 101, nome: "Contorno", preco: "R$159,90", disponivel: true, img: "/contorno_rare.png", logo: "/rarebeauty.png" },
  { id: 102, nome: "Blush", preco: "R$199,99", disponivel: true, img: "/blusg.png", logo: "/rarebeauty.png" },
  { id: 103, nome: "Perfume", preco: "R$349,90", disponivel: false, img: "/perfume_beauty.png", logo: "/rarebeauty.png" },
  { id: 104, nome: "Iluminador", preco: "R$249,90", disponivel: true, img: "/iluminador_beauty.png", logo: "/rarebeauty.png" },
  { id: 105, nome: "Mini Blush", preco: "R$89,90", disponivel: true, img: "/miniblush_beauty.png", logo: "/rarebeauty.png" },
  { id: 106, nome: "Lápis", preco: "R$59,90", disponivel: true, img: "/lapis_labial.png", logo: "/rarebeauty.png" },
  { id: 107, nome: "Primer", preco: "R$139,90", disponivel: false, img: "/primer_beauty.png", logo: "/rarebeauty.png" },
];

const IMAGENS_PLACEHOLDER = [
  "/lapis_labial.png", "/batom_rare.png", "/contorno_rare.png", "/iluminador_beauty.png",
  "/primer_beauty.png", "/rimel_beauty.png", "/miniblush_beauty.png", "/po_beauty.png",
  "/perfume_beauty.png", "/bruma_beauty.png", "/deliniador.png", "/sombra.png",
];

const PRODUTOS_POR_PAGINA = 12;
const TOTAL_PAGINAS = 5;

function gerarProdutosPorPagina(): { [pagina: number]: Produto[] } {
  const resultado: { [pagina: number]: Produto[] } = {};
  let idAtual = 1;

  for (let pagina = 1; pagina <= TOTAL_PAGINAS; pagina++) {
    resultado[pagina] = Array.from({ length: PRODUTOS_POR_PAGINA }, () => {
      const precoFake = (29.9 + ((idAtual * 17) % 220)).toFixed(2).replace(".", ",");
      const produto: Produto = {
        id: idAtual,
        nome: `Produto ${idAtual}`,
        preco: `R$${precoFake}`,
        disponivel: idAtual % 5 !== 0,
        img: IMAGENS_PLACEHOLDER[(idAtual - 1) % IMAGENS_PLACEHOLDER.length],
        logo: "/rarebeauty.png",
      };
      idAtual++;
      return produto;
    });
  }

  return resultado;
}

const produtosPorPagina = gerarProdutosPorPagina();

export default function LojaPage() {
  const router = useRouter();
  const [pagina, setPagina] = useState(1);
  const totalPaginas = TOTAL_PAGINAS;
  const [modalAberto, setModalAberto] = useState(false);
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
  const produtosDaPagina = produtosPorPagina[pagina] ?? [];

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
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/fundo-rare-beauty.webp')",
          backgroundSize: "cover", backgroundPosition: "50% 45%", filter: "brightness(0.45)"
        }} />
        <div style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 12, zIndex: 5 }}>
          <button onClick={() => setModalAberto(true)}
            style={{ width: 48, height: 48, borderRadius: "50%", background: "#6A38F3", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => setModalProdutoAberto(true)}
            style={{ width: 48, height: 48, borderRadius: "50%", background: "#6A38F3", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28 }}
          >
            +
          </button>
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
          by <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => router.push("/perfil")}
          >
            Selena Gomez
          </span>
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
            el.onmousedown = (e) => { isDown = true; el.style.cursor = "grabbing"; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
            el.onmouseleave = () => { isDown = false; el.style.cursor = "grab"; };
            el.onmouseup = () => { isDown = false; el.style.cursor = "grab"; };
            el.onmousemove = (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - el.offsetLeft; el.scrollLeft = scrollLeft - (x - startX) * 2; };
          }}
          style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 8 }}
        >
          {produtosMelhorAvaliados.map((produto) => (
            <div key={produto.id} style={{ minWidth: 180, maxWidth: 180, flexShrink: 0 }}>
              <ProdutoCardAvaliados produto={produto} onClick={() => router.push(`/produto/${produto.id}`)} />
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div style={{ background: "#000", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 32px" }}>
        <h2 style={{ color: "#fff", fontSize: 50, fontWeight: 390, margin: "0 0 8px" }}>Reviews e Comentários</h2>
        <p style={{ color: "#fff", fontSize: 64, fontWeight: 400, margin: "0 0 8px", lineHeight: 1.1 }}>{NOTA_MEDIA.toFixed(2)}</p>
        <Estrelas valor={NOTA_MEDIA} tamanho={44} />

        <div style={{ width: "100%", maxWidth: 1050, display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <span
            onClick={() => router.push("/loja-logado/rare-beauty/avaliacoes-logado")}
            style={{ color: "#6A38F3", fontSize: 20, cursor: "pointer", fontWeight: 400 }}
          >
            ver mais
          </span>
        </div>

        <div style={{ width: "100%", paddingLeft: 100, paddingRight: 100, boxSizing: "border-box" }}>
          <div
            ref={(el) => {
              if (!el) return;
              let isDown = false;
              let startX = 0;
              let scrollLeft = 0;
              el.onmousedown = (e) => { isDown = true; el.style.cursor = "grabbing"; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
              el.onmouseleave = () => { isDown = false; el.style.cursor = "grab"; };
              el.onmouseup = () => { isDown = false; el.style.cursor = "grab"; };
              el.onmousemove = (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - el.offsetLeft; el.scrollLeft = scrollLeft - (x - startX) * 2; };
            }}
            style={{ display: "flex", gap: 20, width: "100%", overflowX: "auto", paddingBottom: 8, cursor: "grab", userSelect: "none" }}
          >
            {AVALIACOES.map((av) => (
              <div key={av.id} style={{ background: "#F5F2E8", borderRadius: 30, padding: "24px 24px", display: "flex", gap: 16, alignItems: "flex-start", minWidth: 500, maxWidth: 850, flexShrink: 0, height: 180 }}>
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
                  <p style={{ fontSize: 23, color: "#333", margin: 0, lineHeight: 1, fontWeight: 300, alignItems: "center" }}>{av.texto}</p>
                  <span
                    onClick={() => router.push("/loja-deslogado/rare-beauty/avaliacoes-deslogado")}
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
        <div style={{ background: "#F5F2E8", padding: "40px 60px", width: "100%", boxSizing: "border-box" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111", margin: "0 0 24px" }}>
            Produtos <span style={{ fontWeight: 400, fontSize: 18 }}>de rare beauty</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 18, marginBottom: 32 }}>
            {produtosDaPagina.map((produto) => (
              <ProdutoCardPaginacao key={produto.id} produto={produto} onClick={() => router.push(`/produto/${produto.id}`)} />
            ))}
          </div>

          {/* PAGINAÇÃO */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40, marginTop: 32 }}>
            <span onClick={() => setPagina((p) => Math.max(1, p - 1))} style={{ cursor: "pointer", fontSize: 65, fontWeight: 400 }}>‹</span>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <span key={n} onClick={() => setPagina(n)} style={{ cursor: "pointer", fontSize: 38, fontWeight: n === pagina ? 600 : 200 }}>
                {n}
              </span>
            ))}
            <span onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} style={{ cursor: "pointer", fontSize: 65, fontWeight: 400 }}>›</span>
          </div>
        </div>

        {modalAberto && <ModalEditarLoja onClose={() => setModalAberto(false)} />}
        {modalProdutoAberto && <ModalAdicionarProduto onClose={() => setModalProdutoAberto(false)} />}
      </div>
    </div>
  );
}