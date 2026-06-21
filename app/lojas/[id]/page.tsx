"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ModalEditarLoja from "@/components/EditarLoja";
import ModalAdicionarProduto from "@/components/ModalAdicionarProduto";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Navbar from "@/components/navbar/navbar";
import CarrosselAvaliacoes from "@/components/avaliacoes/comentarioAvaliacoes";


type Loja = {
  id: number;
  nome: string;
  descricao?: string;
  logo_url?: string;
  banner_url?: string;
  sticker_url?: string;
  usuario_id: number;
  usuario?: { nome: string };
  notaMedia?: number;
  totalAvaliacoes?: number;
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

// Card produtoss
function ProdutoCard({ produto, onClick }: { produto: Produto; onClick: () => void }) {
  const imagem = produto.imagens?.[0]?.url_imagem;
  const disponivel = produto.estoque > 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[180px] max-w-[180px] flex-shrink-0"
    >
      <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
        {imagem && <img src={imagem} alt={produto.nome} className="w-full h-full object-contain" />}
        {produto.loja?.logo_url && (
          <img src={produto.loja.logo_url} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-cover" />
        )}
      </div>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1 line-clamp-2 min-h-[38px]">
        {produto.nome}
      </p>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
        R${Number(produto.preco).toFixed(2)}
      </p>
      <p className={`text-[13px] font-bold mt-1 ${disponivel ? "text-[#C6E700]" : "text-[#AF052A]"}`}>
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
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);

  const dragScroll = useDragScroll();

  const isDono = !!usuario && !!loja && usuario.id === loja.usuario_id;

  useEffect(() => {
    if (!lojaId) return;

    async function carregar() {
      setCarregando(true);
      try {
        const [lojaRes, produtosRes, avaliacoesRes] = await Promise.all([
          api.get(`/lojas/${lojaId}`),
          api.get(`/lojas/${lojaId}/produtos`),
          api.get(`/lojas/${lojaId}/avaliacoes`),
        ]);

        setLoja(lojaRes.data);
        setProdutos(produtosRes.data);
        setAvaliacoes(avaliacoesRes.data);
      } catch (e) {
        console.error("Erro ao carregar dados da loja:", e);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [lojaId]);

  const notaMedia =
    loja?.notaMedia ??
    (avaliacoes.length
      ? avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length
      : 0);

  const totalAvaliacoes = loja?.totalAvaliacoes ?? avaliacoes.length;

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
      <Navbar />

      {/* HERO */}
      <div className="relative w-full h-[480px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-[50%_45%] brightness-[0.45]"
          style={
            loja?.banner_url
              ? { backgroundImage: `url('${loja.banner_url}')` }
              : { backgroundColor: "#1a1a1a" }
          }
        />

        {isDono && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
            <button
              onClick={() => setModalAberto(true)}
              className="w-12 h-12 rounded-full bg-[#6A38F3] flex items-center justify-center text-white cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={() => setModalProdutoAberto(true)}
              className="w-12 h-12 rounded-full bg-[#6A38F3] flex items-center justify-center text-white text-[28px] cursor-pointer"
            >
              +
            </button>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-15 text-center">
          {loja?.logo_url ? (
            <img src={loja.logo_url} alt={loja.nome} className="w-24 h-24 object-contain rounded-full" />
          ) : (
            <h1 className="text-white m-0" style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
              {loja?.nome}
            </h1>
          )}

          {loja?.logo_url && (
            <h1 className="text-white m-0" style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}>
              {loja.nome}
            </h1>
          )}

          {totalAvaliacoes > 0 && (
            <div className="flex items-center gap-2.5 mt-3">
              <Estrelas valor={notaMedia} tamanho={34} />
              <span className="text-white text-lg font-normal">
                {notaMedia.toFixed(1)} ({totalAvaliacoes})
              </span>
            </div>
          )}

          {loja?.descricao && (
            <p className="text-[#ddd] text-xl mt-2 font-light">{loja.descricao}</p>
          )}
        </div>

        {loja?.usuario?.nome && (
          <div className="absolute bottom-5 right-7 text-[#ddd] text-sm z-40">
            by{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => router.push("/perfil")}
            >
              {loja.usuario.nome}
            </span>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col items-center">

        {/* PRODUTOS MELHOR AVALIADOS */}
        {produtosMelhorAvaliados.length > 0 && (
          <div className="bg-[#F5F2E8] w-full flex justify-center px-10 py-10">
            <div className="w-full max-w-[1218px]">
              <h2 className="text-[28px] font-bold text-[#111] mb-6">
                Produtos <span className="font-normal text-lg">melhor avaliados</span>
              </h2>
              <div ref={dragScroll} className="flex gap-5 overflow-x-auto pb-2 cursor-grab scrollbar-hide">
                {produtosMelhorAvaliados.map((produto) => (
                  <ProdutoCard key={produto.id} produto={produto} onClick={() => router.push(`/produto/${produto.id}?lojaId=${lojaId}`)} />
                ))}
              </div>
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

              <div style={{ width: "100%", maxWidth: 1218, display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <span onClick={() => router.push(`/lojas/${lojaId}/avaliacoes`)} style={{ color: "#6A38F3", fontSize: 20, cursor: "pointer", fontWeight: 400 }}>
                  ver mais
                </span>
              </div>

              <div style={{ width: "100%", maxWidth: 1218 }}>
                <CarrosselAvaliacoes
                  avaliacoes={avaliacoes}
                  usuarioLogadoId={usuario?.id ?? null}
                  onEditarAvaliacao={() => setModalAvaliacaoAberto(true)}
                />
              </div>
            </>
          ) : (
            <p style={{ color: "#888", fontSize: 20, margin: "16px 0" }}>Nenhuma avaliação ainda.</p>
          )}
        </div>

        {/* paginação */}
        {produtos.length > 0 && (
          <div className="bg-[#F5F2E8] w-full flex justify-center px-10 py-10 mt-8">
            <div className="w-full max-w-[1218px]">
              <h2 className="text-[28px] font-bold text-[#111] mb-6">
                Produtos <span className="font-normal text-lg">de {loja?.nome?.toLowerCase()}</span>
              </h2>
              <div className="flex flex-wrap gap-5 mb-8">
                {produtosDaPagina.map((produto) => (
                  <ProdutoCard key={produto.id} produto={produto} onClick={() => router.push(`/produto/${produto.id}?lojaId=${lojaId}`)} />
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-10 mt-8">
                  <span onClick={() => setPagina((p) => Math.max(1, p - 1))} className="cursor-pointer text-[65px] font-normal">‹</span>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                    <span
                      key={n}
                      onClick={() => setPagina(n)}
                      className={`cursor-pointer text-[38px] ${n === pagina ? "font-semibold" : "font-extralight"}`}
                    >
                      {n}
                    </span>
                  ))}
                  <span onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} className="cursor-pointer text-[65px] font-normal">›</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {modalAberto && <ModalEditarLoja onClose={() => setModalAberto(false)} />}
      {modalProdutoAberto && <ModalAdicionarProduto onClose={() => setModalProdutoAberto(false)} />}
    </div>
  );
}