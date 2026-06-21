"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Navbar from "@/components/navbar/navbar";

interface Produto {
  id: number;
  nome: string;
  preco: string | number;
  estoque: number;
  createdAt: string;
  imagens?: { url_imagem: string }[];
  loja?: { nome: string; logo_url?: string };
  categoria?: { nome: string };
  loja_id: number;
}

interface Loja {
  id: number;
  nome: string;
  logo_url?: string;
}

const ORDENAR_OPCOES = ["Preço", "Mais Recente"];
const ITENS_POR_PAGINA = 15;

function CardProduto({ produto }: { produto: Produto }) {
  const router = useRouter();
  const disponivel = produto.estoque > 0;
  const precoNum = Number(produto.preco);
  const precoFormatado = precoNum.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div
      onClick={() => router.push(`/produto/${produto.id}?lojaId=${produto.loja_id}`)}
      className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[160px]"
    >
      <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
        <img
          src={produto.imagens?.[0]?.url_imagem || "/placeholder.png"}
          alt={produto.nome}
          className="w-full h-full object-contain"
        />
        {produto.loja?.logo_url && (
          <img
            src={produto.loja.logo_url}
            alt="marca"
            className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain"
          />
        )}
      </div>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1 line-clamp-2 min-h-[38px]">
        {produto.nome}
      </p>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
        {precoFormatado}
      </p>
      <p className={`text-[13px] font-bold mt-1 ${disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
        {disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
      </p>
    </div>
  );
}

function ProdutoEspecificoConteudo() {
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [subcategoria, setSubcategoria] = useState<string | null>(null);
  const [ordenarAberto, setOrdenarAberto] = useState(false);
  const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState<string[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);

  const searchParams = useSearchParams();
  const categoriaUrl = searchParams.get("categoria");

  useEffect(() => {
    async function buscarDados() {
      setCarregando(true);
      setSubcategoria(null);
      setPaginaAtual(1);
      try {
        const params = categoriaUrl ? `?categoria=${encodeURIComponent(categoriaUrl)}` : "";
        const [produtosRes, lojasRes] = await Promise.all([
          api.get(`/produtos${params}`),
          api.get("/lojas"),
        ]);
        setTodosProdutos(produtosRes.data);
        setLojas(lojasRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setCarregando(false);
      }
    }
    buscarDados();
  }, [categoriaUrl]);

  const subcategorias = Array.from(
    new Set(todosProdutos.map((p) => p.categoria?.nome).filter(Boolean))
  ) as string[];

  let produtosFiltrados = subcategoria
    ? todosProdutos.filter((p) => p.categoria?.nome === subcategoria)
    : todosProdutos;

  if (ordenacaoSelecionada.includes("Preço")) {
    produtosFiltrados = [...produtosFiltrados].sort(
      (a, b) => Number(a.preco) - Number(b.preco)
    );
  }
  if (ordenacaoSelecionada.includes("Mais Recente")) {
    produtosFiltrados = [...produtosFiltrados].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const totalPaginas = Math.max(1, Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA));
  const produtosPagina = produtosFiltrados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const maisPopulares = todosProdutos.slice(0, 6);
  const recemAdicionados = [...todosProdutos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const lidarMudancaSubcategoria = (cat: string) => {
    setSubcategoria(subcategoria === cat ? null : cat);
    setPaginaAtual(1);
  };

  return (
    <div className="flex min-h-screen bg-[#F6F3E4]">
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <div className="bg-[#000000] w-full">
          <Navbar />
          <section
            className="w-full relative"
            style={{
              backgroundImage: "url('/frase2.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "65%",
              backgroundPosition: "center top",
              height: "25vw",
              minHeight: "180px",
            }}
          />
        </div>

        <main className="w-full flex flex-col items-center px-10 pt-10 pb-20">
          <div className="w-full max-w-[1218px]">

            {categoriaUrl && (
              <h1 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[32px] font-bold mb-6">
                {categoriaUrl}
              </h1>
            )}

            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <div className="flex gap-3 flex-wrap">
                {subcategorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => lidarMudancaSubcategoria(cat)}
                    className={`px-5 py-2 rounded-full border font-[family-name:var(--font-league-spartan)] text-[15px] transition-all cursor-pointer ${
                      subcategoria === cat
                        ? "bg-[#6A38F3] text-white border-[#6A38F3]"
                        : "bg-white text-[#6A38F3] border-[#ddd] hover:border-[#6A38F3]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <button
                  onClick={() => setOrdenarAberto(!ordenarAberto)}
                  className="h-[46px] w-[220px] rounded-full border border-[#ddd] bg-white px-6 text-[#6A38F3] text-[16px] font-[family-name:var(--font-league-spartan)] flex items-center justify-between cursor-pointer focus:outline-none"
                >
                  ordenar por
                  <span className="text-[#6A38F3]">{ordenarAberto ? "∧" : "∨"}</span>
                </button>
                {ordenarAberto && (
                  <div className="absolute right-0 top-[52px] w-[240px] bg-white rounded-2xl shadow-lg border border-[#eee] p-4 z-50">
                    <p className="text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[18px] font-bold mb-3">
                      ordenar
                    </p>
                    {ORDENAR_OPCOES.map((opcao) => (
                      <label key={opcao} className="flex items-center gap-3 py-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ordenacaoSelecionada.includes(opcao)}
                          onChange={() => {
                            setPaginaAtual(1);
                            setOrdenacaoSelecionada((prev) =>
                              prev.includes(opcao)
                                ? prev.filter((o) => o !== opcao)
                                : [...prev, opcao]
                            );
                          }}
                          className="w-5 h-5 border-[#6A38F3] accent-[#6A38F3] cursor-pointer"
                        />
                        <span className="text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[16px]">
                          {opcao}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {carregando ? (
              <div className="w-full flex justify-center py-20 text-[#6A38F3] font-bold">
                Carregando produtos...
              </div>
            ) : produtosPagina.length === 0 ? (
              <div className="w-full flex justify-center py-20 text-gray-500 font-bold">
                Nenhum produto encontrado.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {produtosPagina.map((produto) => (
                  <CardProduto key={produto.id} produto={produto} />
                ))}
              </div>
            )}

            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 mb-16">
                <button
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="text-[#171918] text-[22px] font-bold disabled:opacity-30 cursor-pointer bg-transparent border-none"
                >
                  {"<"}
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPaginaAtual(num)}
                    className={`text-[22px] font-bold cursor-pointer bg-transparent border-none transition-all ${
                      paginaAtual === num ? "text-[#171918]" : "text-[#aaa] hover:text-[#171918]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="text-[#171918] text-[22px] font-bold disabled:opacity-30 cursor-pointer bg-transparent border-none"
                >
                  {">"}
                </button>
              </div>
            )}
          </div>

          <div className="w-full bg-[#000000] py-10 px-10 rounded-2xl my-8">
            <div className="w-full max-w-[1218px] mx-auto">
              <h2 className="text-white font-[family-name:var(--font-league-spartan)] text-[22px] font-bold mb-8">
                Principais Lojas
              </h2>
              <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
                {lojas.map((loja) => (
                  <div key={loja.id} className="flex flex-col items-center gap-3 cursor-pointer min-w-[100px]">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src={loja.logo_url || "/placeholder.png"}
                        alt={loja.nome}
                        className="w-14 h-14 object-contain"
                      />
                    </div>
                    <p className="text-white font-[family-name:var(--font-league-spartan)] text-[14px] font-bold text-center">
                      {loja.nome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-[1218px] mt-14">
            <h2 className="font-[family-name:var(--font-league-spartan)] text-[22px] font-bold text-[#171918] mb-6">
              Mais populares
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {maisPopulares.map((produto) => (
                <div key={produto.id} className="min-w-[180px] max-w-[180px]">
                  <CardProduto produto={produto} />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-[1218px] mt-14">
            <h2 className="font-[family-name:var(--font-league-spartan)] text-[22px] font-bold text-[#171918] mb-6">
              Recém adicionados
            </h2>
            <div
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {recemAdicionados.map((produto) => (
                <div
                  key={produto.id}
                  className="min-w-[180px] max-w-[180px] flex-shrink-0"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <CardProduto produto={produto} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ✅ Export default com Suspense obrigatório para useSearchParams no App Router
export default function ProdutoEspecifico() {
  return (
    <Suspense fallback={
      <div className="bg-[#F6F3E4] min-h-screen flex items-center justify-center text-[#6A38F3] font-bold">
        Carregando...
      </div>
    }>
      <ProdutoEspecificoConteudo />
    </Suspense>
  );
}