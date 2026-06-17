"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const PRODUTOS_LOJA = [
  { nome: "Bronzer", preco: "R$264,99", disponivel: true, img: "/bronzer.png", logo: "/rarebeauty.png" },
  { nome: "Blush", preco: "R$199,99", disponivel: true, img: "/blush.png", logo: "/rarebeauty.png" },
  { nome: "Perfume Rare", preco: "R$599,90", disponivel: true, img: "/perfume.png", logo: "/rarebeauty.png" },
  { nome: "Iluminador", preco: "R$249,90", disponivel: true, img: "/iluminador.png", logo: "/rarebeauty.png" },
  { nome: "Mini Blush", preco: "R$99,90", disponivel: false, img: "/miniblush.png", logo: "/rarebeauty.png" },
  { nome: "Lápis Labial", preco: "R$139,90", disponivel: true, img: "/lapislabial.png", logo: "/rarebeauty.png" },
  { nome: "Primer", preco: "R$259,90", disponivel: true, img: "/primer.png", logo: "/rarebeauty.png" },
];

const LOJAS = [
  { nome: "Rare Beauty", categoria: "beleza", logo: "/rarebeauty.png" },
];

const AVALIACOES = [
  {
    nome: "Selena Gomez",
    foto: "/fotoperfil.png",
    comentario: "Não é por nada não, mas essa garota arrasa",
    estrelas: 5,
  },
];

function Estrelas({ quantidade }: { quantidade: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill={i < quantidade ? "#CCFF00" : "#e0e0e0"} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function PerfilLoja() {
  const router = useRouter();
  const [isLogado, setIsLogado] = useState(false);
  const [usuario, setUsuario] = useState({
    nome: "",
    username: "",
    email: "",
    foto: "/fotoperfil.png",
  });

  useEffect(() => {
    const dados = localStorage.getItem("usuario");
    if (dados) {
      const user = JSON.parse(dados);
      setIsLogado(true);
      setUsuario({
        nome: user.nome,
        username: user.username,
        email: user.email,
        foto: user.foto_perfil_url || "/fotoperfil.png",
      });
    }
  }, []);

  function handleSair() {
    localStorage.removeItem("usuario");
    setIsLogado(false);
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F6F3E4]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-col flex-1 overflow-x-hidden">

        {/* BANNER / FOTO DE PERFIL */}
        <div className="bg-[#000000] w-full">
          <div className="relative w-full" style={{ height: "357px" }}>
            <div className="absolute left-16 bottom-0 translate-y-1/2 z-10">
              <div className="w-[160px] h-[160px] rounded-full overflow-hidden border-4 border-[#F6F3E4] bg-white">
                <img src={usuario.foto} alt={usuario.nome} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA BEGE */}
        <main className="w-full flex flex-col px-16 pb-20" style={{ paddingTop: "100px" }}>
          <div className="w-full">

            {/* INFORMAÇÕES DO USUÁRIO */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[32px] mb-1">
                  {usuario.nome}
                </h1>
                <p className="text-[#555] text-[16px] flex items-center gap-2 mb-1">
                  <span>@</span> {usuario.username}
                </p>
                <p className="text-[#555] text-[16px] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  {usuario.email}
                </p>
              </div>

              {isLogado && (
                <button className="px-6 py-2 bg-[#6A38F3] text-white rounded-full font-[family-name:var(--font-league-spartan)] text-[16px] font-bold hover:bg-[#5228d4] transition-colors cursor-pointer">
                  Editar Perfil
                </button>
              )}
            </div>

            {/* PRODUTOS */}
            <h2 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[28px] mb-8">
              Produtos
            </h2>
            <ScrollContainer>
              {PRODUTOS_LOJA.map((produto, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 flex flex-col cursor-pointer hover:shadow-md transition-shadow min-w-[100px] max-w-[100px]">
                  <div className="relative w-full h-[80px] mb-2 flex items-center justify-center">
                    <img src={produto.img} alt={produto.nome} className="w-full h-full object-contain" />
                    {produto.logo && (
                      <img src={produto.logo} alt="marca" className="absolute top-1 right-1 w-6 h-6 rounded-full object-contain" />
                    )}
                  </div>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[13px] leading-tight mb-1">
                    {produto.nome}
                  </p>
                  <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[13px]">
                    {produto.preco}
                  </p>
                  <p className={`text-[11px] font-bold mt-1 ${produto.disponivel ? "text-[#4CAF50]" : "text-[#E53935]"}`}>
                    {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                  </p>
                </div>
              ))}
            </ScrollContainer>

            {/* LOJAS */}
            <h2 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[28px] mt-16 mb-6">
              Lojas
            </h2>
            <div className="flex flex-col gap-4">
              {LOJAS.map((loja, i) => (
                <div key={i} className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow max-w-[480px]">
                  <div>
                    <p className="font-[family-name:var(--font-league-spartan)] text-[#171918] text-[20px]">
                      {loja.nome}
                    </p>
                    <p className="text-[#7B2FE0] text-[16px]">
                      {loja.categoria}
                    </p>
                  </div>
                  <div className="w-[70px] h-[70px] rounded-full bg-[#F5E6DC] flex items-center justify-center overflow-hidden">
                    <img src={loja.logo} alt={loja.nome} className="w-12 h-12 object-contain" />
                  </div>
                </div>
              ))}
            </div>

            {/* AVALIAÇÕES */}
            <h2 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[28px] mt-16 mb-6">
              Avaliações
            </h2>
            <div className="flex flex-col gap-4">
              {AVALIACOES.map((av, i) => (
                <div key={i} className="bg-white rounded-2xl px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-[80px] h-[80px] rounded-full overflow-hidden flex-shrink-0">
                        <img src={av.foto} alt={av.nome} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[20px]">
                          {av.nome}
                        </p>
                        <p className="text-[#555] text-[16px] mt-1">
                          {av.comentario}
                        </p>
                      </div>
                    </div>
                    <Estrelas quantidade={av.estrelas} />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button className="text-[#7B2FE0] text-[16px] hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer">
                      ver mais
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}