"use client";
import React from "react";
import { useRouter } from "next/navigation";

const PRODUTOS_ELETRONICOS = [
  // Página 1 - Linha 1
  { nome: "Comp. Lenovo", preco: "R$3.899,99", disponivel: false, img: "/lenovo.png", logo: "/repiit.png" },
  { nome: "Comp. Samsung", preco: "R$8.549,99", disponivel: false, img: "/samsung.png", logo: "/repiit.png" },
  { nome: "Iphone 15", preco: "R$4.769,10", disponivel: true, img: "/iphone15.png", logo: "/ibersay.png" },
  { nome: "Smart Tv Philips", preco: "R$1.229,00", disponivel: false, img: "/smarttvphilips.png", logo: "/repiit.png" },
  { nome: "Xbox Series X", preco: "R$3.599,99", disponivel: false, img: "/xboxseriesx.png", logo: "/hobby.png" },
  // Página 1 - Linha 2
  { nome: "Macbook Air", preco: "R$15.899,99", disponivel: false, img: "/macbook.png", logo: "/repiit.png" },
  { nome: "Iphone 16", preco: "R$4.598,99", disponivel: false, img: "/iphone16.png", logo: "/ibersay.png" },
  { nome: "S25 Ultra", preco: "R$5.769,10", disponivel: false, img: "/s25ultra.png", logo: "/ibersay.png" },
  { nome: "Ipad", preco: "R$7.859,00", disponivel: false, img: "/ipad.png", logo: "/repiit.png" },
  { nome: "Headset Gamer", preco: "R$899,99", disponivel: false, img: "/headsetgamer.png", logo: "/hobby.png" },
  // Página 1 - Linha 3
  { nome: "Comp. Lenovo", preco: "R$649,99", disponivel: false, img: "/lenovo2.png", logo: "/ibersay.png" },
  { nome: "Nintendo S. 2", preco: "R$4.799,99", disponivel: false, img: "/nintendo.png", logo: "/hobby.png" },
  { nome: "Iphone 15", preco: "R$4.089,10", disponivel: true, img: "/iphone15.png", logo: "/ibersay.png" },
  { nome: "JBL", preco: "R$1.399,00", disponivel: true, img: "/jbl.png", logo: "/ibersay.png" },
  { nome: "Xbox Series S", preco: "R$1.499,99", disponivel: true, img: "/xboxseriess.png", logo: "/hobby.png" },

  // Página 2 - Linha 1
  { nome: "Cabo USB", preco: "R$86,90", disponivel: true, img: "/cabousb.png", logo: "/repiit.png" },
  { nome: "Micro SD", preco: "R$179,90", disponivel: true, img: "/microsd.png", logo: "/repiit.png" },
  { nome: "Iphone 4", preco: "R$469,99", disponivel: true, img: "/iphone4.png", logo: "/ibersay.png" },
  { nome: "Playstation 5", preco: "R$4.992,98", disponivel: false, img: "/ps5.png", logo: "/hobby.png" },
  { nome: "Galaxy Z Fold", preco: "R$13.999,99", disponivel: true, img: "/galaxyzfold.png", logo: "/ibersay.png" },
  // Página 2 - Linha 2
  { nome: "Nintendo 3DS", preco: "R$2.089,99", disponivel: false, img: "/nintendo3ds.png", logo: "/repiit.png" },
  { nome: "Galaxy A06", preco: "R$988,00", disponivel: true, img: "/galaxya06.png", logo: "/ibersay.png" },
  { nome: "Monitor", preco: "R$988,00", disponivel: true, img: "/monitor.png", logo: "/repiit.png" },
  { nome: "Teclado e mouse", preco: "R$395,00", disponivel: true, img: "/tecladomouse.png", logo: "/repiit.png" },
  { nome: "Mouse", preco: "R$381,00", disponivel: true, img: "/mouse.png", logo: "/repiit.png" },
  // Página 2 - Linha 3
  { nome: "Smart TV Neo", preco: "R$2.999,00", disponivel: false, img: "/smarttvneo.png", logo: "/repiit.png" },
  { nome: "Soundbar", preco: "R$1.044,28", disponivel: true, img: "/soundbar.png", logo: "/repiit.png" },
  { nome: "Vitrola", preco: "R$509,99", disponivel: true, img: "/vitrola.png", logo: "/repiit.png" },
  { nome: "Monitor", preco: "R$1.199,00", disponivel: true, img: "/monitor2.png", logo: "/repiit.png" },
  { nome: "Smart TV", preco: "R$1.649,99", disponivel: true, img: "/smarttv.png", logo: "/repiit.png" },

  // Página 3 (= Página 1) - Linha 1
  { nome: "Comp. Lenovo", preco: "R$3.899,99", disponivel: false, img: "/lenovo.png", logo: "/repiit.png" },
  { nome: "Comp. Samsung", preco: "R$8.549,99", disponivel: false, img: "/samsung.png", logo: "/repiit.png" },
  { nome: "Iphone 15", preco: "R$4.769,10", disponivel: true, img: "/iphone15.png", logo: "/ibersay.png" },
  { nome: "Smart Tv Philips", preco: "R$1.229,00", disponivel: false, img: "/smarttvphilips.png", logo: "/repiit.png" },
  { nome: "Xbox Series X", preco: "R$3.599,99", disponivel: false, img: "/xboxseriesx.png", logo: "/hobby.png" },
  // Página 3 (= Página 1) - Linha 2
  { nome: "Macbook Air", preco: "R$15.899,99", disponivel: false, img: "/macbook.png", logo: "/repiit.png" },
  { nome: "Iphone 16", preco: "R$4.598,99", disponivel: false, img: "/iphone16.png", logo: "/ibersay.png" },
  { nome: "S25 Ultra", preco: "R$5.769,10", disponivel: false, img: "/s25ultra.png", logo: "/ibersay.png" },
  { nome: "Ipad", preco: "R$7.859,00", disponivel: false, img: "/ipad.png", logo: "/repiit.png" },
  { nome: "Headset Gamer", preco: "R$899,99", disponivel: false, img: "/headsetgamer.png", logo: "/hobby.png" },
  // Página 3 (= Página 1) - Linha 3
  { nome: "Comp. Lenovo", preco: "R$649,99", disponivel: false, img: "/lenovo2.png", logo: "/ibersay.png" },
  { nome: "Nintendo S. 2", preco: "R$4.799,99", disponivel: false, img: "/nintendo.png", logo: "/hobby.png" },
  { nome: "Iphone 15", preco: "R$4.089,10", disponivel: true, img: "/iphone15.png", logo: "/ibersay.png" },
  { nome: "JBL", preco: "R$1.399,00", disponivel: true, img: "/jbl.png", logo: "/ibersay.png" },
  { nome: "Xbox Series S", preco: "R$1.499,99", disponivel: true, img: "/xboxseriess.png", logo: "/hobby.png" },

  // Página 4 (= Página 2) - Linha 1
  { nome: "Cabo USB", preco: "R$86,90", disponivel: true, img: "/cabousb.png", logo: "/repiit.png" },
  { nome: "Micro SD", preco: "R$179,90", disponivel: true, img: "/microsd.png", logo: "/repiit.png" },
  { nome: "Iphone 4", preco: "R$469,99", disponivel: true, img: "/iphone4.png", logo: "/ibersay.png" },
  { nome: "Playstation 5", preco: "R$4.992,98", disponivel: false, img: "/ps5.png", logo: "/hobby.png" },
  { nome: "Galaxy Z Fold", preco: "R$13.999,99", disponivel: true, img: "/galaxyzfold.png", logo: "/ibersay.png" },
  // Página 4 (= Página 2) - Linha 2
  { nome: "Nintendo 3DS", preco: "R$2.089,99", disponivel: false, img: "/nintendo3ds.png", logo: "/repiit.png" },
  { nome: "Galaxy A06", preco: "R$988,00", disponivel: true, img: "/galaxya06.png", logo: "/ibersay.png" },
  { nome: "Monitor", preco: "R$988,00", disponivel: true, img: "/monitor.png", logo: "/repiit.png" },
  { nome: "Teclado e mouse", preco: "R$395,00", disponivel: true, img: "/tecladomouse.png", logo: "/repiit.png" },
  { nome: "Mouse", preco: "R$381,00", disponivel: true, img: "/mouse.png", logo: "/repiit.png" },
  // Página 4 (= Página 2) - Linha 3
  { nome: "Smart TV Neo", preco: "R$2.999,00", disponivel: false, img: "/smarttvneo.png", logo: "/repiit.png" },
  { nome: "Soundbar", preco: "R$1.044,28", disponivel: true, img: "/soundbar.png", logo: "/repiit.png" },
  { nome: "Vitrola", preco: "R$509,99", disponivel: true, img: "/vitrola.png", logo: "/repiit.png" },
  { nome: "Monitor", preco: "R$1.199,00", disponivel: true, img: "/monitor2.png", logo: "/repiit.png" },
  { nome: "Smart TV", preco: "R$1.649,99", disponivel: true, img: "/smarttv.png", logo: "/repiit.png" },

  // Página 5 (= Página 1) - Linha 1
  { nome: "Comp. Lenovo", preco: "R$3.899,99", disponivel: false, img: "/lenovo.png", logo: "/repiit.png" },
  { nome: "Comp. Samsung", preco: "R$8.549,99", disponivel: false, img: "/samsung.png", logo: "/repiit.png" },
  { nome: "Iphone 15", preco: "R$4.769,10", disponivel: true, img: "/iphone15.png", logo: "/ibersay.png" },
  { nome: "Smart Tv Philips", preco: "R$1.229,00", disponivel: false, img: "/smarttvphilips.png", logo: "/repiit.png" },
  { nome: "Xbox Series X", preco: "R$3.599,99", disponivel: false, img: "/xboxseriesx.png", logo: "/hobby.png" },
  // Página 5 (= Página 1) - Linha 2
  { nome: "Macbook Air", preco: "R$15.899,99", disponivel: false, img: "/macbook.png", logo: "/repiit.png" },
  { nome: "Iphone 16", preco: "R$4.598,99", disponivel: false, img: "/iphone16.png", logo: "/ibersay.png" },
  { nome: "S25 Ultra", preco: "R$5.769,10", disponivel: false, img: "/s25ultra.png", logo: "/ibersay.png" },
  { nome: "Ipad", preco: "R$7.859,00", disponivel: false, img: "/ipad.png", logo: "/repiit.png" },
  { nome: "Headset Gamer", preco: "R$899,99", disponivel: false, img: "/headsetgamer.png", logo: "/hobby.png" },
  // Página 5 (= Página 1) - Linha 3
  { nome: "Comp. Lenovo", preco: "R$649,99", disponivel: false, img: "/lenovo2.png", logo: "/ibersay.png" },
  { nome: "Nintendo S. 2", preco: "R$4.799,99", disponivel: false, img: "/nintendo.png", logo: "/hobby.png" },
  { nome: "Iphone 15", preco: "R$4.089,10", disponivel: true, img: "/iphone15.png", logo: "/ibersay.png" },
  { nome: "JBL", preco: "R$1.399,00", disponivel: true, img: "/jbl.png", logo: "/ibersay.png" },
  { nome: "Xbox Series S", preco: "R$1.499,99", disponivel: true, img: "/xboxseriess.png", logo: "/hobby.png" },
];

const PRINCIPAIS_LOJAS = [
  { nome: "abtec", img: "/abtec.png", categoria: "eletrônicos" },
  { nome: "Repiit", img: "/repiit.png", categoria: "eletrônicos" },
  { nome: "Bersay", img: "/ibersay.png", categoria: "eletrônicos" },
  { nome: "electree", img: "/electree.png", categoria: "eletrônicos" },
  { nome: "Speed X", img: "/speedx.png", categoria: "eletrônicos" },
  { nome: "Next Computer", img: "/nextcomputer.png", categoria: "eletrônicos" },
  { nome: "Oh my!", img: "/ohmy.png", categoria: "eletrônicos" },
  { nome: "Lexut", img: "/lexut.png", categoria: "eletrônicos" },
];

const MAIS_POPULARES = [
  { nome: "Comp. Lenovo", preco: "R$3.899,99", disponivel: true, img: "/lenovo.png", logo: "/repiit.png" },
  { nome: "Comp. Samsung", preco: "R$8.549,99", disponivel: false, img: "/samsung.png", logo: "/repiit.png" },
  { nome: "Smart Tv Philips", preco: "R$1.229,00", disponivel: true, img: "/smarttvphilips.png", logo: "/repiit.png" },
  { nome: "Xbox Series X", preco: "R$3.599,99", disponivel: false, img: "/xboxseriesx.png", logo: "/hobby.png" },
  { nome: "Headset Gamer", preco: "R$899,99", disponivel: false, img: "/headsetgamer.png", logo: "/hobby.png" },
];

const RECEM_ADICIONADOS = [
  { nome: "Micro SD", preco: "R$179,90", disponivel: true, img: "/microsd.png", logo: "/repiit.png" },
  { nome: "Playstation 5", preco: "R$4.992,98", disponivel: false, img: "/ps5.png", logo: "/hobby.png" },
  { nome: "Iphone 15", preco: "R$4.769,10", disponivel: true, img: "/iphone15.png", logo: "/ibersay.png" },
  { nome: "Iphone 4", preco: "R$469,99", disponivel: true, img: "/iphone4.png", logo: "/ibersay.png" },
  { nome: "Nintendo 3DS", preco: "R$2.089,99", disponivel: false, img: "/nintendo3ds.png", logo: "/repiit.png" },
  { nome: "Galaxy Z Fold", preco: "R$13.999,99", disponivel: true, img: "/galaxyzfold.png", logo: "/ibersay.png" },
];

const SUBCATEGORIAS = ["Celulares", "Notebooks", "TVs", "Acessórios", "Outros"];
const ORDENAR_OPCOES = ["Padrão", "Preço", "Avaliação", "Mais Recente"];
const ITENS_POR_PAGINA = 15;

function CardProduto({ produto }: { produto: typeof MAIS_POPULARES[0] }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[160px]">
      <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
        <img src={produto.img} alt={produto.nome} className="w-full h-full object-contain" />
        {produto.logo && (
          <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-10 h-10 rounded-full object-contain" />
        )}
      </div>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[16px] leading-tight mb-1">
        {produto.nome}
      </p>
      <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[18px]">
        {produto.preco}
      </p>
      <p className={`text-[13px] font-bold mt-1 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
        {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
      </p>
    </div>
  );
}

export default function CategoriaEletronicos() {
  const router = useRouter();
  const [subcategoria, setSubcategoria] = React.useState<string | null>(null);
  const [ordenarAberto, setOrdenarAberto] = React.useState(false);
  const [ordenacaoSelecionada, setOrdenacaoSelecionada] = React.useState<string[]>([]);
  const [paginaAtual, setPaginaAtual] = React.useState(1);

  const totalPaginas = Math.ceil(PRODUTOS_ELETRONICOS.length / ITENS_POR_PAGINA);
  const produtosPagina = PRODUTOS_ELETRONICOS.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  return (
    <div className="bg-[#F6F3E4] min-h-screen flex flex-col overflow-x-hidden">

      {/* ÁREA PRETA */}
      <div className="bg-[#000000] w-full">

        {/* NAVBAR */}
        <nav className="w-full bg-[#000000] flex items-center justify-between px-8 py-4">
          <img src="/LOGOStock.io.png" alt="Stock.io" className="h-12 w-auto object-contain" />
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
        />
      </div>

      {/* ÁREA BEGE */}
      <main className="w-full flex flex-col items-center px-10 pt-10 pb-20">
        <div className="w-full max-w-[1218px]">

          {/* BARRA DE FILTROS + ORDENAR */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div className="flex gap-3 flex-wrap">
              {SUBCATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSubcategoria(subcategoria === cat ? null : cat)}
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

          {/* GRID DE PRODUTOS */}
          <div className="grid grid-cols-5 gap-6">
            {produtosPagina.map((produto, i) => (
              <CardProduto key={i} produto={produto} />
            ))}
          </div>

          {/* PAGINAÇÃO */}
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
        </div>

        {/* PRINCIPAIS LOJAS - FUNDO PRETO */}
        <div className="w-full bg-[#000000] py-10 px-10">
          <div className="w-full max-w-[1218px] mx-auto">
            <h2 className="text-white font-[family-name:var(--font-league-spartan)] text-[22px] font-bold mb-8">
              Principais Lojas
            </h2>
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
              {PRINCIPAIS_LOJAS.map((loja, i) => (
                <div key={i} className="flex flex-col items-center gap-3 cursor-pointer min-w-[100px]">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img src={loja.img} alt={loja.nome} className="w-14 h-14 object-contain" />
                  </div>
                  <p className="text-white font-[family-name:var(--font-league-spartan)] text-[14px] font-bold text-center">
                    {loja.nome}
                  </p>
                  <p className="text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[12px] text-center">
                    eletrônicos
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIS POPULARES */}
        <div className="w-full max-w-[1218px] mt-14">
          <h2 className="font-[family-name:var(--font-league-spartan)] text-[22px] font-bold text-[#171918] mb-6">
            Mais populares
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {MAIS_POPULARES.map((produto, i) => (
              <div key={i} className="min-w-[180px] max-w-[180px]">
                <CardProduto produto={produto} />
              </div>
            ))}
          </div>
        </div>

       {/* RECÉM ADICIONADOS */}
<div className="w-full max-w-[1218px] mt-14">
  <h2 className="font-[family-name:var(--font-league-spartan)] text-[22px] font-bold text-[#171918] mb-6">
    Recém adicionados
  </h2>
  <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
    {RECEM_ADICIONADOS.map((produto, i) => (
      <div
        key={i}
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
  );
}