"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useFeedData, ProdutoFeed, LojaFeed } from "@/hooks/useFeedData";
import Navbar from "@/components/navbar/navbar";

function ScrollContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  return (
    <div
      ref={ref}
      className={`flex gap-6 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none ${className}`}
      onMouseDown={(e) => {
        isDown = true;
        startX = e.pageX - (ref.current?.offsetLeft || 0);
        scrollLeft = ref.current?.scrollLeft || 0;
      }}
      onMouseLeave={() => { isDown = false; }}
      onMouseUp={() => { isDown = false; }}
      onMouseMove={(e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - (ref.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (ref.current) ref.current.scrollLeft = scrollLeft - walk;
      }}
    >
      {children}
    </div>
  );
}

function formatarPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function filtrarPorNome<T extends { nome: string }>(itens: T[], busca: string): T[] {
  const alvo = normalizar(busca);
  if (!alvo) return itens;
  return itens.filter((item) => normalizar(item.nome).includes(alvo));
}

const FILTROS_OPCOES = [
  { label: "Mercado", icon: "🛒" },
  { label: "Farmácia", icon: "💊" },
  { label: "Beleza", icon: "✏️" },
  { label: "Moda", icon: "👗" },
  { label: "Eletrônicos", icon: "💻" },
  { label: "Jogos", icon: "🎮" },
  { label: "Brinquedos", icon: "🧸" },
  { label: "Casa", icon: "🏠" },
];

/* Produtos */

function ProdutoCard({ produto }: { produto: ProdutoFeed }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/produto/${produto.id}?lojaId=${produto.lojaId}`)}
      className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[220px]"
    >
      <div className="relative w-[190px] h-[190px] mb-4 flex items-center justify-center shrink-0">
        {produto.img && (
          <img
            src={produto.img}
            alt={produto.nome}
            className="w-full h-full object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
          />
        )}
        {produto.logo && (
          <img
            src={produto.logo}
            alt="marca"
            className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
          />
        )}
      </div>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1">{produto.nome}</p>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
        {formatarPreco(produto.preco)}
      </p>
      <p className={`text-[13px] font-bold mt-1 ${produto.disponivel ? "text-[#C6E700]" : "text-[#AF052A]"}`}>
        {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
      </p>
    </div>
  );
}

function ProdutosCarrossel({ titulo, destaque, produtos }: { titulo: string; destaque: string; produtos: ProdutoFeed[] }) {
  return (
    <div className="w-full max-w-[1218px] mt-12 mb-20">
      <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold mb-8">
        {titulo} <span className="text-[16px] font-normal text-[#6A38F3] ml-2 italic underline">{destaque}</span>
      </h2>
      {produtos.length > 0 ? (
        <ScrollContainer>
          {produtos.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </ScrollContainer>
      ) : (
        <p className="text-[#888] font-[family-name:var(--font-league-spartan)]">Nenhum produto encontrado.</p>
      )}
    </div>
  );
}

/* Categorias */

const categorias = [
  { nome: "Mercado", icon: "/healthicons_vegetables-outline.png" },
  { nome: "Farmácia", icon: "/Group.png" },
  { nome: "Beleza", icon: "/beleza.png" },
  { nome: "Moda", icon: "/moda.png" },
  { nome: "Eletrônicos", icon: "/tech.png" },
  { nome: "Jogos", icon: "/jogos.png" },
  { nome: "Brinquedos", icon: "/boneca.png" },
  { nome: "Casa", icon: "/house.png" },
];

function CategoriasSecao() {
  const router = useRouter();
  return (
    <div className="w-full max-w-[1218px]">
      <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold mb-6">Categoria</h2>
      <ScrollContainer className="gap-[49px]">
        {categorias.map((categoria) => (
          <div
            key={categoria.nome}
            onClick={() => router.push(`/produtoespecifico?categoria=${encodeURIComponent(categoria.nome.toLowerCase())}`)}
            className="flex bg-[#FFFFFF] w-[115px] h-[115px] shrink-0 rounded-[35px] items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center justify-center">
              <img src={categoria.icon} alt={categoria.nome} />
              <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[18px] font-[400]">{categoria.nome}</p>
            </div>
          </div>
        ))}
      </ScrollContainer>
    </div>
  );
}

/* Banner e busca */

function Banner({ busca, setBusca }: { busca: string; setBusca: (valor: string) => void }) {
  return (
    <section
      className="w-full relative"
      style={{
        backgroundImage: "url('/frase.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "65%",
        backgroundPosition: "center top",
        height: "25vw",
        minHeight: "180px",
      }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[145%] z-10 w-full max-w-[650px] px-6">
        <div className="relative">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Procurar por..."
            className="w-full h-[54px] bg-white rounded-full pl-8 pr-12 text-[18px] font-[family-name:var(--font-league-spartan)] shadow-md focus:outline-none focus:ring-2 focus:ring-[#6A38F3] text-[#171918]"
          />
          {busca ? (
            <button
              type="button"
              onClick={() => setBusca("")}
              aria-label="Limpar busca"
              className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#888] hover:text-[#171918]"
            >
              ✕
            </button>
          ) : (
            <img src="/iconamoon_search.png" alt="Buscar" className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40"/>
          )}
        </div>
      </div>
    </section>
  );
}

/* Lojas */

function LojaCard({ loja }: { loja: LojaFeed }) {
  const router = useRouter();
  return (
    <div
      className="flex flex-col items-center cursor-pointer min-w-[140px]"
      onClick={() => router.push(`/lojas/${loja.id}`)}
    >
      <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-3 bg-white flex items-center justify-center border border-[#eee]">
        {loja.img && (
          <img
            src={loja.img}
            alt={loja.nome}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
          />
        )}
      </div>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[15px] text-center">{loja.nome}</p>
      <p className="text-[#6A38F3] text-[13px] text-center">{loja.categoria}</p>
    </div>
  );
}

function LojasSecao({ lojas }: { lojas: LojaFeed[] }) {
  const [filtroAberto, setFiltroAberto] = React.useState(false);
  const [filtrosSelecionados, setFiltrosSelecionados] = React.useState<string[]>([]);

  const lojasFiltradas =
    filtrosSelecionados.length === 0
      ? lojas
      : lojas.filter((loja) =>
          filtrosSelecionados.some((f) => normalizar(f) === normalizar(loja.categoria))
        );

  return (
    <div className="w-full max-w-[1218px] mt-12 mb-20">
      <div className="flex items-center justify-between mb-8 relative">
        <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold">Lojas</h2>
        <div className="relative">
          <button
            onClick={() => setFiltroAberto(!filtroAberto)}
            className="h-[46px] w-[220px] rounded-full border border-[#ddd] bg-white px-6 text-[#6A38F3] text-[16px] font-[family-name:var(--font-league-spartan)] flex items-center justify-between cursor-pointer focus:outline-none"
          >
            filtros
            <span className="text-[#6A38F3]">{filtroAberto ? "∧" : "∨"}</span>
          </button>
          {filtroAberto && (
            <div className="absolute right-0 top-[52px] w-[280px] bg-white rounded-2xl shadow-lg border border-[#eee] p-4 z-50">
              {FILTROS_OPCOES.map((item, i) => (
                <label key={i} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtrosSelecionados.includes(item.label)}
                    onChange={() => {
                      setFiltrosSelecionados((prev) =>
                        prev.includes(item.label) ? prev.filter((f) => f !== item.label) : [...prev, item.label]
                      );
                    }}
                    className="w-5 h-5 rounded border-[#6A38F3] accent-[#6A38F3] cursor-pointer"
                  />
                  <span className="text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[16px]">
                    {item.label} {item.icon}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      {lojasFiltradas.length > 0 ? (
        <ScrollContainer>
          {lojasFiltradas.map((loja) => (
            <LojaCard key={loja.id} loja={loja} />
          ))}
        </ScrollContainer>
      ) : (
        <p className="text-[#888] font-[family-name:var(--font-league-spartan)]">Nenhuma loja encontrada.</p>
      )}
    </div>
  );
}

/* Tela principal */

export default function Home() {
  const [telaAtiva, setTelaAtiva] = React.useState("feed");
  const [busca, setBusca] = React.useState("");
  const { lojas, produtosAvaliados, produtosBaratos, produtosRecentes, loading } = useFeedData();
  const handleLogout = () => { localStorage.removeItem("token"); setTelaAtiva("outra"); };

  if (loading) return <div className="bg-[#F6F3E4] min-h-screen flex items-center justify-center">Carregando...</div>;

  if (telaAtiva === "outra") {
    return (
      <TelaDeslogada
        aoFazerLogin={() => setTelaAtiva("feed")}
        lojas={lojas}
        produtosAvaliados={produtosAvaliados}
        produtosBaratos={produtosBaratos}
        produtosRecentes={produtosRecentes}
      />
    );
  }

  return (
    <div className="bg-[#F6F3E4] min-h-screen flex flex-col overflow-x-hidden">
      <div className="bg-[#000000] w-full">
        <Navbar />
        <Banner busca={busca} setBusca={setBusca} />
      </div>

      <main className="w-full flex flex-col items-center px-10" style={{ paddingTop: "calc(2rem + 54px)" }}>
        {busca && (
          <p className="w-full max-w-[1218px] text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[16px] mb-2">
            Resultados para "{busca}"
          </p>
        )}

        <CategoriasSecao />

        <ProdutosCarrossel titulo="Produtos" destaque="melhores avaliados" produtos={filtrarPorNome(produtosAvaliados, busca)} />
        <ProdutosCarrossel titulo="Produtos" destaque="mais baratos" produtos={filtrarPorNome(produtosBaratos, busca)} />
        <ProdutosCarrossel titulo="Produtos" destaque="recém adicionados" produtos={filtrarPorNome(produtosRecentes, busca)} />

        <LojasSecao lojas={filtrarPorNome(lojas, busca)} />
      </main>
    </div>
  );
}

/* Tela deslogada */

interface TelaDeslogadaProps {
  aoFazerLogin: () => void;
  lojas: LojaFeed[];
  produtosAvaliados: ProdutoFeed[];
  produtosBaratos: ProdutoFeed[];
  produtosRecentes: ProdutoFeed[];
}

function TelaDeslogada({ aoFazerLogin, lojas, produtosAvaliados, produtosBaratos, produtosRecentes }: TelaDeslogadaProps) {
  const [busca, setBusca] = React.useState("");

  return (
    <div className="bg-[#F6F3E4] min-h-screen flex flex-col overflow-x-hidden">
      <div className="bg-[#000000] w-full">
        <Navbar />
        <Banner busca={busca} setBusca={setBusca} />
      </div>

      <main className="w-full flex flex-col items-center px-10" style={{ paddingTop: "calc(2rem + 54px)" }}>
        {busca && (
          <p className="w-full max-w-[1218px] text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[16px] mb-2">
            Resultados para "{busca}"
          </p>
        )}

        <CategoriasSecao />

        <ProdutosCarrossel titulo="Produtos" destaque="melhores avaliados" produtos={filtrarPorNome(produtosAvaliados, busca)} />
        <ProdutosCarrossel titulo="Produtos" destaque="mais baratos" produtos={filtrarPorNome(produtosBaratos, busca)} />
        <ProdutosCarrossel titulo="Produtos" destaque="recém adicionados" produtos={filtrarPorNome(produtosRecentes, busca)} />

        <LojasSecao lojas={filtrarPorNome(lojas, busca)} />
      </main>
    </div>
  );
}