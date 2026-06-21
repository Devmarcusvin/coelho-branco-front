"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Navbar from "@/components/navbar/navbar";

interface Produto {
  id?: string | number;
  nome: string;
  preco: string | number;
  disponivel: boolean;
  imagens?: { url_imagem: string }[];
  logo?: string;
  loja_id?: string | number;
}

interface Loja {
  id?: string | number;
  nome: string;
  img: string;
  categoria: string;
}

const CATEGORIA_PAI = "eletronicos"; // usado nas chamadas de API
const ORDENAR_OPCOES = ["Padrão", "Preço", "Avaliação", "Mais Recente"];
const ITENS_POR_PAGINA = 15;

function CardProduto({ produto }: { produto: Produto }) {
  const router = useRouter();
  const precoFormatado = typeof produto.preco === "number" 
    ? produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : produto.preco;

  return (
    <div 
      onClick={() => produto.id && router.push(`/produto/${produto.id}?lojaId=${produto.loja_id || ""}`)}
      className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[160px]"
    >
      <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
        <img
          src={produto.imagens?.[0]?.url_imagem || "/placeholder.png"}
          alt={produto.nome}
          className="w-full h-full object-contain"
        />
        {produto.logo && (
          <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain" />
        )}
      </div>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1 line-clamp-2 min-h-[38px]">
        {produto.nome}
      </p>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
        {precoFormatado}
      </p>
      <p className={`text-[13px] font-bold mt-1 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
        {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
      </p>
    </div>
  );
}

export default function CategoriaEletronicos() {
  const router = useRouter();
  const [logado, setLogado] = useState(true);
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [principaisLojas, setPrincipaisLojas] = useState<Loja[]>([]);
  const [maisPopulares, setMaisPopulares] = useState<Produto[]>([]);
  const [recemAdicionados, setRecemAdicionados] = useState<Produto[]>([]);
  
  const [subcategorias, setSubcategorias] = useState<string[]>([]);
  const [subcategoria, setSubcategoria] = useState<string | null>(null);
  const [ordenarAberto, setOrdenarAberto] = useState(false);
  const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState<string[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(true);

  // Busca dados estáticos das seções secundárias uma única vez
  useEffect(() => {
    async function buscarDadosIniciais() {
      try {
        const [lojasRes, popularesRes, recentesRes, subcategoriasRes] = await Promise.all([
          api.get("/lojas?categoria=eletronicos"),
          api.get("/produtos/populares"),
          api.get("/produtos/recentes"),
          api.get(`/produtos/${CATEGORIA_PAI}/subcategorias`)
        ]);

        setPrincipaisLojas(lojasRes.data);
        setMaisPopulares(popularesRes.data);
        setRecemAdicionados(recentesRes.data);
        setSubcategorias(subcategoriasRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados secundários:", error);
      }
    }

    buscarDadosIniciais();
  }, []);

  // Busca os produtos principais baseando-se na paginação, ordenação E subcategoria filtrada
  useEffect(() => {
    async function buscarProdutos() {
      setCarregando(true);
      try {
        const params = new URLSearchParams({
          page: paginaAtual.toString(),
          limit: ITENS_POR_PAGINA.toString(),
        });

        // Tratamento da subcategoria para o padrão de API (URL amigável / lowercase)
        if (subcategoria) {
          const subcategoriaFormatada = subcategoria
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // Remove acentos e espaços se houver
          
          params.append("subcategoria", subcategoriaFormatada);
        }

        if (ordenacaoSelecionada.length > 0) {
          params.append("ordenarPor", ordenacaoSelecionada.join(","));
        }

        const resposta = await api.get(`/produtos/${CATEGORIA_PAI}?${params.toString()}`);
        
        // Garante a compatibilidade caso a API retorne paginação pura ou array direto
        if (resposta.data.items) {
          setProdutos(resposta.data.items);
          setTotalPaginas(resposta.data.totalPaginas || 1);
        } else {
          setProdutos(resposta.data);
          setTotalPaginas(1);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProdutos([]);
      } finally {
        setCarregando(false);
      }
    }

    buscarProdutos();
  }, [paginaAtual, subcategoria, ordenacaoSelecionada]);

  const lidarMudancaSubcategoria = (cat: string) => {
    // Altera o estado da subcategoria e joga a paginação para a primeira página
    setSubcategoria(subcategoria === cat ? null : cat);
    setPaginaAtual(1);
  };

  return (
    <div className="flex min-h-screen bg-[#F6F3E4]">
      <div className="flex flex-col flex-1 overflow-x-hidden">

        {/* ÁREA PRETA: NAVBAR + BANNER */}
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

        {/* ÁREA BEGE */}
        <main className="w-full flex flex-col items-center px-10 pt-10 pb-20">
          <div className="w-full max-w-[1218px]">

            {/* BARRA DE FILTROS + ORDENAR */}
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
                    <p className="text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[18px] font-bold mb-3">ordenar</p>
                    {ORDENAR_OPCOES.map((opcao) => (
                      <label key={opcao} className="flex items-center gap-3 py-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ordenacaoSelecionada.includes(opcao)}
                          onChange={() => {
                            setPaginaAtual(1);
                            setOrdenacaoSelecionada(prev =>
                              prev.includes(opcao) ? prev.filter(o => o !== opcao) : [...prev, opcao]
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

            {/* GRID DE PRODUTOS / LOADING */}
            {carregando ? (
              <div className="w-full flex justify-center py-20 text-[#6A38F3] font-bold">
                Carregando produtos...
              </div>
            ) : produtos.length === 0 ? (
              <div className="w-full flex justify-center py-20 text-gray-500 font-bold">
                Nenhum produto encontrado nesta subcategoria.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {produtos.map((produto, i) => (
                  <CardProduto key={produto.id || i} produto={produto} />
                ))}
              </div>
            )}

            {/* PAGINAÇÃO DINÂMICA */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 mb-16">
                <button
                  onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
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
                  onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="text-[#171918] text-[22px] font-bold disabled:opacity-30 cursor-pointer bg-transparent border-none"
                >
                  {">"}
                </button>
              </div>
            )}
          </div>

          {/* SEÇÕES SECUNDÁRIAS (LOJAS, POPULARES, RECENTES) */}
          <div className="w-full bg-[#000000] py-10 px-10 rounded-2xl my-8">
            <div className="w-full max-w-[1218px] mx-auto">
              <h2 className="text-white font-[family-name:var(--font-league-spartan)] text-[22px] font-bold mb-8">
                Principais Lojas
              </h2>
              <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
                {principaisLojas.map((loja, i) => (
                  <div key={loja.id || i} className="flex flex-col items-center gap-3 cursor-pointer min-w-[100px]">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img src={loja.img} alt={loja.nome} className="w-14 h-14 object-contain" />
                    </div>
                    <p className="text-white font-[family-name:var(--font-league-spartan)] text-[14px] font-bold text-center">
                      {loja.nome}
                    </p>
                    <p className="text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[12px] text-center">
                      {loja.categoria}
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
              {maisPopulares.map((produto, i) => (
                <div key={produto.id || i} className="min-w-[180px] max-w-[180px]">
                  <CardProduto produto={produto} />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-[1218px] mt-14">
            <h2 className="font-[family-name:var(--font-league-spartan)] text-[22px] font-bold text-[#171918] mb-6">
              Recém adicionados
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
              {recemAdicionados.map((produto, i) => (
                <div key={produto.id || i} className="min-w-[180px] max-w-[180px] flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
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