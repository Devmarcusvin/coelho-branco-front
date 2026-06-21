"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ModalEditarLoja from "@/components/EditarLoja";
import ModalAdicionarProduto from "@/components/ModalAdicionarProduto";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ==================== TIPOS ====================

type Loja = {
  id: number;
  nome: string;
  descricao?: string;
  logo_url?: string;
  banner_url?: string;
  sticker_url?: string;
  usuario_id: number;
  usuario?: { nome: string };
};

type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  descricao?: string;
  categoria_id: number;
  imagens?: { url_imagem: string }[];
  loja?: { logo_url?: string };
};

type Avaliacao = {
  id: number;
  usuario_id: number;
  nota: number;
  comentario?: string;
  usuario?: { nome: string; foto_perfil_url?: string };
};



function Estrelas({ valor, tamanho }: { valor: number; tamanho: number }) {
  const cheias = Math.floor(valor);
  const temMeia = valor - cheias >= 0.5;
  const vazias = 5 - cheias - (temMeia ? 1 : 0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: cheias }).map((_, i) => (
        <svg key={`c-${i}`} width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="#FFD700">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
      {temMeia && (
        <svg width={tamanho} height={tamanho} viewBox="0 0 24 24">
          <defs>
            <linearGradient id="meia">
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#ccc" />
            </linearGradient>
          </defs>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="url(#meia)" />
        </svg>
      )}
      {Array.from({ length: vazias }).map((_, i) => (
        <svg key={`v-${i}`} width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="#ccc">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function ProdutoCardAvaliados({ produto, onClick }: { produto: Produto; onClick: () => void }) {
  const imagem = produto.imagens?.[0]?.url_imagem;
  const disponivel = produto.estoque > 0;

  return (
    <div onClick={onClick} className="bg-white rounded-xl p-3 flex flex-col cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-square mb-3 flex items-center justify-center">
        {imagem && <img src={imagem} alt={produto.nome} className="w-full h-full object-contain" />}
        {produto.loja?.logo_url && (
          <img src={produto.loja.logo_url} alt="marca" className="absolute top-1 right-1 w-6 h-6 rounded-full object-contain" />
        )}
      </div>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[13px] leading-tight mb-0.5 truncate">{produto.nome}</p>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[14px]">R${Number(produto.preco).toFixed(2)}</p>
      <p className={`text-[10px] font-bold mt-0.5 ${disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
        {disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
      </p>
    </div>
  );
}

function ProdutoCardPaginacao({ produto, onClick }: { produto: Produto; onClick: () => void }) {
  const imagem = produto.imagens?.[0]?.url_imagem;
  const disponivel = produto.estoque > 0;

  return (
    <div onClick={onClick} className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
        {imagem && <img src={imagem} alt={produto.nome} className="w-full h-full object-contain" />}
        {produto.loja?.logo_url && (
          <img src={produto.loja.logo_url} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain" />
        )}
      </div>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1 truncate">{produto.nome}</p>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">R${Number(produto.preco).toFixed(2)}</p>
      <p className={`text-[13px] font-bold mt-1 ${disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
        {disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
      </p>
    </div>
  );
}

function useDragScroll() {
  return (el: HTMLDivElement | null) => {
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    el.onmousedown = (e) => { isDown = true; el.style.cursor = "grabbing"; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
    el.onmouseleave = () => { isDown = false; el.style.cursor = "grab"; };
    el.onmouseup = () => { isDown = false; el.style.cursor = "grab"; };
    el.onmousemove = (e) => { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 2; };
  };
}

const PRODUTOS_POR_PAGINA = 12;

// ==================== PAGE ====================

export default function LojaPage() {
  const router = useRouter();
  const params = useParams();
  const lojaId = Number(params?.lojaId ?? params?.id);
  const { usuario } = useAuth();

  const [loja, setLoja] = useState<Loja | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [pagina, setPagina] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false);

  const dragScroll = useDragScroll();

  // true somente se o usuário logado for dono da loja
  const isDono = !!usuario && !!loja && usuario.id === loja.usuario_id;

  useEffect(() => {
    if (!lojaId) return;

    async function carregar() {
      setCarregando(true);
      try {
        const [lojaRes, produtosRes, avaliacoesRes] = await Promise.all([
          fetch(`${API_URL}/lojas/${lojaId}`),
          fetch(`${API_URL}/lojas/${lojaId}/produtos`),
          fetch(`${API_URL}/lojas/${lojaId}/avaliacoes`),
        ]);

        if (lojaRes.ok) setLoja(await lojaRes.json());
        if (produtosRes.ok) setProdutos(await produtosRes.json());
        if (avaliacoesRes.ok) setAvaliacoes(await avaliacoesRes.json());
      } catch (e) {
        console.error("Erro ao carregar dados da loja:", e);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [lojaId]);

  const notaMedia = avaliacoes.length
    ? avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length
    : 0;

  const produtosMelhorAvaliados = produtos.filter((p) => p.estoque > 0).slice(0, 7);
  const totalPaginas = Math.ceil(produtos.length / PRODUTOS_POR_PAGINA);
  const produtosDaPagina = produtos.slice((pagina - 1) * PRODUTOS_POR_PAGINA, pagina * PRODUTOS_POR_PAGINA);

  if (carregando) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#fff", fontSize: 24 }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", fontFamily: "League Spartan, sans-serif" }}>

      {/* NAVBAR */}
      <nav className="w-full bg-[#000000] flex items-center justify-between px-8 py-4">
        <img src="/LOGOStock.io.png" alt="Stock.io" style={{ width: 160, objectFit: "contain", marginLeft: 20 }} className="h-12 w-auto" />
        <div className="flex items-center gap-4">
          {usuario ? (
            <span style={{ color: "#fff", fontSize: 16 }}>Olá, {usuario.nome}</span>
          ) : (
            <>
              <button onClick={() => router.push("/login")} className="text-white font-[family-name:var(--font-league-spartan)] text-[16px] hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none">
                LOGIN
              </button>
              <button onClick={() => router.push("/cadastro")} className="px-5 py-2 bg-[#6A38F3] text-white rounded-full font-[family-name:var(--font-league-spartan)] text-[16px] font-bold hover:bg-[#5228d4] transition-colors cursor-pointer">
                CADASTRE-SE
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", width: "100%", height: 480, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: loja?.banner_url ? `url('${loja.banner_url}')` : undefined,
          background: loja?.banner_url ? undefined : "#1a1a1a",
          backgroundSize: "cover", backgroundPosition: "50% 45%", filter: "brightness(0.45)"
        }} />

        {/* Botões de edição — só aparecem para o dono */}
        {isDono && (
          <div style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 12, zIndex: 5 }}>
            <button onClick={() => setModalAberto(true)}
              style={{ width: 48, height: 48, borderRadius: "50%", background: "#6A38F3", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button onClick={() => setModalProdutoAberto(true)}
              style={{ width: 48, height: 48, borderRadius: "50%", background: "#6A38F3", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28 }}>
              +
            </button>
          </div>
        )}

        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, padding: "0 60px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {loja?.logo_url
              ? <img src={loja.logo_url} alt={loja.nome} style={{ height: "clamp(48px, 7vw, 86px)", objectFit: "contain" }} />
              : <h1 style={{ color: "#fff", fontSize: "clamp(32px, 5vw, 64px)", margin: 0 }}>{loja?.nome}</h1>
            }
            {loja?.descricao && (
              <p style={{ color: "#ddd", fontSize: 20, margin: "8px 0 0", fontWeight: 300 }}>{loja.descricao}</p>
            )}
          </div>
        </div>

        {loja?.usuario?.nome && (
          <div style={{ position: "absolute", bottom: 20, right: 28, color: "#ddd", fontSize: 14, zIndex: 4 }}>
            by <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => router.push("/perfil")}>
              {loja.usuario.nome}
            </span>
          </div>
        )}
      </div>

      {/* PRODUTOS MELHOR AVALIADOS */}
      {produtosMelhorAvaliados.length > 0 && (
        <div style={{ background: "#F5F2E8", padding: "40px 60px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111", margin: "0 0 24px" }}>
            Produtos <span style={{ fontWeight: 400, fontSize: 18 }}>melhor avaliados</span>
          </h2>
          <div ref={dragScroll} style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 8, cursor: "grab" }}>
            {produtosMelhorAvaliados.map((produto) => (
              <div key={produto.id} style={{ minWidth: 180, maxWidth: 180, flexShrink: 0 }}>
                <ProdutoCardAvaliados produto={produto} onClick={() => router.push(`/produto/${produto.id}`)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS */}
      <div style={{ background: "#000", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 32px" }}>
        <h2 style={{ color: "#fff", fontSize: 50, fontWeight: 390, margin: "0 0 8px" }}>Reviews e Comentários</h2>

        {avaliacoes.length > 0 ? (
          <>
            <p style={{ color: "#fff", fontSize: 64, fontWeight: 400, margin: "0 0 8px", lineHeight: 1.1 }}>{notaMedia.toFixed(2)}</p>
            <Estrelas valor={notaMedia} tamanho={44} />

            <div style={{ width: "100%", maxWidth: 1050, display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <span onClick={() => router.push(`/loja/${lojaId}/avaliacoes`)} style={{ color: "#6A38F3", fontSize: 20, cursor: "pointer", fontWeight: 400 }}>
                ver mais
              </span>
            </div>

            <div style={{ width: "100%", paddingLeft: 100, paddingRight: 100, boxSizing: "border-box" }}>
              <div ref={dragScroll} style={{ display: "flex", gap: 20, width: "100%", overflowX: "auto", paddingBottom: 8, cursor: "grab", userSelect: "none" }}>
                {avaliacoes.map((av) => (
                  <div key={av.id} style={{ background: "#F5F2E8", borderRadius: 30, padding: "24px", display: "flex", gap: 16, alignItems: "flex-start", minWidth: 500, maxWidth: 850, flexShrink: 0, height: 180 }}>
                    <img
                      src={av.usuario?.foto_perfil_url || "/avatar-padrao.png"}
                      alt={av.usuario?.nome}
                      style={{ width: 135, height: 135, borderRadius: "50%", objectFit: "cover", display: "block", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 16 }}>
                        <span style={{ fontWeight: 400, fontSize: 28, color: "#111" }}>{av.usuario?.nome}</span>
                        <Estrelas valor={av.nota} tamanho={30} />
                      </div>
                      <p style={{ fontSize: 23, color: "#333", margin: 0, lineHeight: 1.2, fontWeight: 300 }}>{av.comentario}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: "#888", fontSize: 20, margin: "16px 0" }}>Nenhuma avaliação ainda.</p>
        )}

        {/* TODOS OS PRODUTOS COM PAGINAÇÃO */}
        {produtos.length > 0 && (
          <div style={{ background: "#F5F2E8", padding: "40px 60px", width: "100%", boxSizing: "border-box", marginTop: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111", margin: "0 0 24px" }}>
              Produtos <span style={{ fontWeight: 400, fontSize: 18 }}>de {loja?.nome?.toLowerCase()}</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 18, marginBottom: 32 }}>
              {produtosDaPagina.map((produto) => (
                <ProdutoCardPaginacao key={produto.id} produto={produto} onClick={() => router.push(`/produto/${produto.id}`)} />
              ))}
            </div>

            {totalPaginas > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40, marginTop: 32 }}>
                <span onClick={() => setPagina((p) => Math.max(1, p - 1))} style={{ cursor: "pointer", fontSize: 65, fontWeight: 400 }}>‹</span>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                  <span key={n} onClick={() => setPagina(n)} style={{ cursor: "pointer", fontSize: 38, fontWeight: n === pagina ? 600 : 200 }}>
                    {n}
                  </span>
                ))}
                <span onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} style={{ cursor: "pointer", fontSize: 65, fontWeight: 400 }}>›</span>
              </div>
            )}
          </div>
        )}

        {modalAberto && <ModalEditarLoja onClose={() => setModalAberto(false)} />}
        {modalProdutoAberto && <ModalAdicionarProduto onClose={() => setModalProdutoAberto(false)} />}
      </div>
    </div>
  );
}
