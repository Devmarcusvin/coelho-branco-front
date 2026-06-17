"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useFeedData } from "@/hooks/useFeedData";
import Sidebar from "@/components/marcuscomp/Sidebar";

function ScrollContainer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  return (
    <div
      ref={ref}
      className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
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

const PRODUTOS_AVALIADOS = [
  { nome: "Brownie Meio A.", preco: "R$4,70", unidade: "", disponivel: true, img: "/brownie1.png", logo: "/cjr.png" },
  { nome: "Brownie Trad.", preco: "R$3,80", unidade: "", disponivel: false, img: "/brownie2.png", logo: "/cjr.png" },
  { nome: "Nozes", preco: "R$29,99", unidade: "/kg", disponivel: true, img: "/nozes.png", logo: "/dcarts.png" },
  { nome: "Banana", preco: "R$3,99", unidade: "/kg", disponivel: true, img: "/banana.png", logo: "/maumar.png" },
  { nome: "Limão Siciliano", preco: "R$17,99", unidade: "/kg", disponivel: false, img: "/limao.png", logo: "/maumar.png" },
  { nome: "Leite", preco: "R$4,99", unidade: "", disponivel: true, img: "/leite.png", logo: "/dcarts.png" },
  { nome: "Manteiga", preco: "R$23,99", unidade: "", disponivel: true, img: "/manteiga.png", logo: "/dcarts.png" },
  { nome: "Leite Cond.", preco: "R$7,99", unidade: "", disponivel: true, img: "/leitecondensado.png", logo: "/dcarts.png" },
  { nome: "Coca Cola", preco: "R$3,99", unidade: "", disponivel: true, img: "/cocacola.png", logo: "/dcarts.png" },
  { nome: "Farinha de T.", preco: "R$6,99", unidade: "", disponivel: true, img: "/farinha.png", logo: "/dcarts.png" },
  { nome: "Chocolate", preco: "R$8,99", unidade: "", disponivel: true, img: "/chocolate.png", logo: "/dcarts.png" },
  { nome: "Redbull", preco: "R$5,41", unidade: "", disponivel: true, img: "/redbull.png", logo: "/cjr.png" },
];

const PRODUTOS_BARATOS = [
  { nome: "Limpador Facial", preco: "R$74,99", unidade: "", disponivel: true, img: "/limpador.png", logo: "/creamy.png" },
  { nome: "Blush", preco: "R$199,99", unidade: "", disponivel: false, img: "/blush.png", logo: "/rarebeauty.png" },
  { nome: "Sérum Facial", preco: "R$99,90", unidade: "", disponivel: true, img: "/serum.png", logo: "/creamy.png" },
  { nome: "Iluminador", preco: "R$249,90", unidade: "", disponivel: true, img: "/iluminador.png", logo: "/rarebeauty.png" },
  { nome: "Body Splash", preco: "R$179,99", unidade: "", disponivel: false, img: "/bodysplash.png", logo: "/roots.png" },
  { nome: "Óleo de cabelo", preco: "R$53,19", unidade: "", disponivel: true, img: "/oleocabelo.png", logo: "/roots.png" },
  { nome: "Protetor Solar", preco: "R$169,90", unidade: "", disponivel: true, img: "/protetorsolar.png", logo: "/roots.png" },
  { nome: "Eye Cream", preco: "R$119,90", unidade: "", disponivel: true, img: "/eyecream.png", logo: "/creamy.png" },
];
const PRODUTOS_RECENTES = [
  { nome: "Saia", preco: "R$75,99", unidade: "", disponivel: true, img: "/saia.png", logo: "/omelina.png" },
  { nome: "New Balance", preco: "R$399,99", unidade: "", disponivel: false, img: "/newbalance.png", logo: "/sneakerstore.png" },
  { nome: "Bota", preco: "R$115,90", unidade: "", disponivel: true, img: "/bota.png", logo: "/sneakerstore.png" },
  { nome: "Bolsa", preco: "R$349,90", unidade: "", disponivel: true, img: "/bolsa.png", logo: "/omelina.png" },
  { nome: "Calça Jeans", preco: "R$159,99", unidade: "", disponivel: false, img: "/calcajeans.png", logo: "/omelina.png" },
  { nome: "Vestido Verde", preco: "R$154,99", unidade: "", disponivel: true, img: "/vestidoverde.png", logo: "/omelina.png" },
  { nome: "Vestido Verde 2", preco: "R$169,90", unidade: "", disponivel: true, img: "/vestidoverde2.png", logo: "/omelina.png" },
  { nome: "Vestido Azul", preco: "R$119,90", unidade: "", disponivel: true, img: "/vestidoazul.png", logo: "/omelina.png" },
];

const LISTA_LOJAS = [
  { nome: "CJR", categoria: "mercado", img: "/cjr.png" },
  { nome: "Rare Beauty", categoria: "beleza", img: "/rarebeauty.png" },
  { nome: "The Croc Brew", categoria: "mercado", img: "/thecrocbrew.png" },
  { nome: "Mini Reno", categoria: "casa", img: "/minireno.png" },
  { nome: "amoca", categoria: "moda", img: "/amoca.png" },
  { nome: "Repiit", categoria: "eletrônicos", img: "/repiit.png" },
  { nome: "Creamy Skincare", categoria: "beleza", img: "/creamy.png" },
  { nome: "Maumar", categoria: "mercado", img: "/maumar.png" },
  { nome: "SneakerStore", categoria: "moda", img: "/sneakerstore.png" },
  { nome: "Melina Couture", categoria: "moda", img: "/omelina.png" },
  { nome: "d'carts & baskets", categoria: "mercado", img: "/dcarts.png" },
  { nome: "Fluffy House", categoria: "casa", img: "/fluffyhouse.png" },
  { nome: "electree", categoria: "eletrônicos", img: "/electree.png" },
  { nome: "Roots", categoria: "beleza", img: "/roots.png" },
];

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

export default function Home() {
  const router = useRouter();
  const [filtroAberto, setFiltroAberto] = React.useState(false);
  const [filtrosSelecionados, setFiltrosSelecionados] = React.useState<string[]>([]);
  const [telaAtiva, setTelaAtiva] = React.useState("feed");
  const { lojas, produtosAvaliados, produtosBaratos, produtosRecentes, loading } = useFeedData();

  if (loading) return <div className="bg-[#F6F3E4] min-h-screen flex items-center justify-center">Carregando...</div>;
  if (telaAtiva === "outra") {
    return <TelaDeslogada aoFazerLogin={() => setTelaAtiva("feed")} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F6F3E4]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-col flex-1 overflow-x-hidden">

        {/* AREA PRETA */}
        <div className="bg-[#000000] w-full">

          {/* BANNER */}
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
            <div className="absolute right-6 bottom-0 translate-y-[145%] z-10 w-full max-w-[650px] px-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Procurar por..." 
                  className="w-full h-[54px] bg-white rounded-full pl-8 pr-12 text-[18px] font-[family-name:var(--font-league-spartan)] shadow-md focus:outline-none focus:ring-2 focus:ring-[#6A38F3] text-[#171918]"
                />
                <img src="/iconamoon_search.png" alt="Buscar" className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40"/>
              </div>
            </div>
          </section>
        </div>

        {/* AREA BEGE */}
        <main className="w-full flex flex-col items-center px-10" style={{ paddingTop: "calc(2rem + 54px)" }}>
          
          <div className="w-full max-w-[1218px]">
            <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold mb-6">Categoria</h2>
            <div className="flex justify-start w-full">
              <img src="/categorias.png" alt="Lista de Categorias" className="h-auto cursor-pointer"/>
            </div>
          </div>

          {/* PRODUTOS - MELHORES AVALIADOS */}
          <div className="w-full max-w-[1218px] mt-12 mb-20">
            <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold mb-8">
              Produtos <span className="text-[16px] font-normal text-[#6A38F3] ml-2 italic underline">melhores avaliados</span>
            </h2>
            <ScrollContainer>
              {PRODUTOS_AVALIADOS.map((produto, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[220px]">
                  <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
                    <img src={produto.img} alt={produto.nome} className="w-full h-full object-contain"/>
                    {produto.logo && <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain"/>}
                  </div>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1">{produto.nome}</p>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
                    {produto.preco}
                    {produto.unidade && <span className="text-[13px] font-normal text-[#888] ml-1">{produto.unidade}</span>}
                  </p>
                  <p className={`text-[13px] font-bold mt-1 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
                    {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                  </p>
                </div>
              ))}
            </ScrollContainer>
          </div>

          {/* PRODUTOS - MAIS BARATOS */}
          <div className="w-full max-w-[1218px] mt-12 mb-20">
            <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold mb-8">
              Produtos <span className="text-[16px] font-normal text-[#6A38F3] ml-2 italic underline">mais baratos</span>
            </h2>
            <ScrollContainer>
              {PRODUTOS_BARATOS.map((produto, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[220px]">
                  <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
                    <img src={produto.img} alt={produto.nome} className="w-full h-full object-contain"/>
                    {produto.logo && <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain"/>}
                  </div>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1">{produto.nome}</p>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
                    {produto.preco}
                    {produto.unidade && <span className="text-[13px] font-normal text-[#888] ml-1">{produto.unidade}</span>}
                  </p>
                  <p className={`text-[13px] font-bold mt-1 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
                    {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                  </p>
                </div>
              ))}
            </ScrollContainer>
          </div>

          {/* PRODUTOS - RECÉM ADICIONADOS */}
          <div className="w-full max-w-[1218px] mt-12 mb-20">
            <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold mb-8">
              Produtos <span className="text-[16px] font-normal text-[#6A38F3] ml-2 italic underline">recém adicionados</span>
            </h2>
            <ScrollContainer>
              {PRODUTOS_RECENTES.map((produto, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[220px]">
                  <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
                    <img src={produto.img} alt={produto.nome} className="w-full h-full object-contain"/>
                    {produto.logo && <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain"/>}
                  </div>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1">{produto.nome}</p>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
                    {produto.preco}
                    {produto.unidade && <span className="text-[13px] font-normal text-[#888] ml-1">{produto.unidade}</span>}
                  </p>
                  <p className={`text-[13px] font-bold mt-1 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
                    {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                  </p>
                </div>
              ))}
            </ScrollContainer>
          </div>

          {/* SEÇÃO DE LOJAS */}
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
                            setFiltrosSelecionados(prev =>
                              prev.includes(item.label) ? prev.filter(f => f !== item.label) : [...prev, item.label]
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
            <ScrollContainer>
              {LISTA_LOJAS.map((loja, i) => (
                <div key={i} className="flex flex-col items-center cursor-pointer min-w-[140px]">
                  <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-3 bg-white flex items-center justify-center border border-[#eee]">
                    <img src={loja.img} alt={loja.nome} className="w-full h-full object-cover"/>
                  </div>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[15px] text-center">{loja.nome}</p>
                  <p className="text-[#6A38F3] text-[13px] text-center">{loja.categoria}</p>
                </div>
              ))}
            </ScrollContainer>
          </div>

        </main>
      </div>
    </div>
  );
}

//tela deslogada

function TelaDeslogada({ aoFazerLogin }: { aoFazerLogin: () => void }) {
  const router = useRouter();
  const [filtroAberto, setFiltroAberto] = React.useState(false);
  const [filtrosSelecionados, setFiltrosSelecionados] = React.useState<string[]>([]);

  return (
    <div className="flex min-h-screen bg-[#F6F3E4]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-col flex-1 overflow-x-hidden">

        {/* AREA PRETA */}
        <div className="bg-[#000000] w-full">

          {/* BANNER */}
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
            <div className="absolute right-6 bottom-0 translate-y-[145%] z-10 w-full max-w-[650px] px-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Procurar por..." 
                  className="w-full h-[54px] bg-white rounded-full pl-8 pr-12 text-[18px] font-[family-name:var(--font-league-spartan)] shadow-md focus:outline-none focus:ring-2 focus:ring-[#6A38F3] text-[#171918]"
                />
                <img src="/iconamoon_search.png" alt="Buscar" className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40"/>
              </div>
            </div>
          </section>
        </div>

        {/* AREA BEGE */}
        <main className="w-full flex flex-col items-center px-10" style={{ paddingTop: "calc(2rem + 54px)" }}>
          
          <div className="w-full max-w-[1218px]">
            <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold mb-6">Categoria</h2>
            <div className="flex justify-start w-full">
              <img src="/categorias.png" alt="Lista de Categorias" className="h-auto cursor-pointer"/>
            </div>
          </div>

          {/* PRODUTOS - MELHORES AVALIADOS */}
          <div className="w-full max-w-[1218px] mt-12 mb-20">
            <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold mb-8">
              Produtos <span className="text-[16px] font-normal text-[#6A38F3] ml-2 italic underline">melhores avaliados</span>
            </h2>
            <ScrollContainer>
              {PRODUTOS_AVALIADOS.map((produto, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[220px]">
                  <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
                    <img src={produto.img} alt={produto.nome} className="w-full h-full object-contain"/>
                    {produto.logo && <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain"/>}
                  </div>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1">{produto.nome}</p>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
                    {produto.preco}
                    {produto.unidade && <span className="text-[13px] font-normal text-[#888] ml-1">{produto.unidade}</span>}
                  </p>
                  <p className={`text-[13px] font-bold mt-1 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
                    {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                  </p>
                </div>
              ))}
            </ScrollContainer>
          </div>

          {/* PRODUTOS - MAIS BARATOS */}
          <div className="w-full max-w-[1218px] mt-12 mb-20">
            <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold mb-8">
              Produtos <span className="text-[#6A38F3] italic underline ml-2 font-normal text-[16px]">mais baratos</span>
            </h2>
            <ScrollContainer>
              {PRODUTOS_BARATOS.map((produto, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[220px]">
                  <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
                    <img src={produto.img} alt={produto.nome} className="w-full h-full object-contain"/>
                    {produto.logo && <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain"/>}
                  </div>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1">{produto.nome}</p>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
                    {produto.preco}
                    {produto.unidade && <span className="text-[13px] font-normal text-[#888] ml-1">{produto.unidade}</span>}
                  </p>
                  <p className={`text-[13px] font-bold mt-1 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
                    {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                  </p>
                </div>
              ))}
            </ScrollContainer>
          </div>

          {/* PRODUTOS - RECÉM ADICIONADOS */}
          <div className="w-full max-w-[1218px] mt-12 mb-20">
            <h2 className="text-[#171918] font-[family-name:var(--font-league-spartan)] text-[28px] font-bold mb-8">
              Produtos <span className="text-[#6A38F3] italic underline ml-2 font-normal text-[16px]">recém adicionados</span>
            </h2>
            <ScrollContainer>
              {PRODUTOS_RECENTES.map((produto, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[220px]">
                  <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
                    <img src={produto.img} alt={produto.nome} className="w-full h-full object-contain"/>
                    {produto.logo && <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain"/>}
                  </div>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1">{produto.nome}</p>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
                    {produto.preco}
                    {produto.unidade && <span className="text-[13px] font-normal text-[#888] ml-1">{produto.unidade}</span>}
                  </p>
                  <p className={`text-[13px] font-bold mt-1 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
                    {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                  </p>
                </div>
              ))}
            </ScrollContainer>
          </div>

          {/* SEÇÃO DE LOJAS */}
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
                            setFiltrosSelecionados(prev =>
                              prev.includes(item.label) ? prev.filter(f => f !== item.label) : [...prev, item.label]
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
            <ScrollContainer>
              {LISTA_LOJAS.map((loja, i) => (
                <div key={i} className="flex flex-col items-center cursor-pointer min-w-[140px]">
                  <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-3 bg-white flex items-center justify-center border border-[#eee]">
                    <img src={loja.img} alt={loja.nome} className="w-full h-full object-cover"/>
                  </div>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[15px] text-center">{loja.nome}</p>
                  <p className="text-[#6A38F3] text-[13px] text-center">{loja.categoria}</p>
                </div>
              ))}
            </ScrollContainer>
          </div>

        </main>
      </div>
    </div>
  );
}