"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/navbar/navbar";
import ModalAdicionarLoja from "@/components/AdicionarLoja";
import ModalEditarPerfil from "@/components/ModalEditarPerfil";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

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

const AVALIACOES = [
  {
    id: 1, // troca pelo id real da Selena, se existir no banco
    nome: "Selena Gomez",
    foto: "/foto-perfil.png",
    comentario: "Não é por nada não, mas essa garota arrasa",
    estrelas: 5,
  },
];

function Estrelas({ quantidade }: { quantidade: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill={i < quantidade ? "#f5bc00" : "#e0e0e0"} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function PerfilLoja() {
  const router = useRouter();
  const { usuario: usuarioLogado, logout, recarregarUsuario } = useAuth();
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditarPerfil, setModalEditarPerfil] = useState(false);
  const [lojas, setLojas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);

  const usuario = {
    nome: usuarioLogado?.nome || "",
    username: usuarioLogado?.username || "",
    email: usuarioLogado?.email || "",
    foto: usuarioLogado?.foto_perfil_url || "/fotoperfil1.png",
  };

  const logado = !!usuarioLogado;

  const buscarDados = useCallback(async () => {
    if (!usuarioLogado) return;
    try {
      const { data: todasLojas } = await api.get("/lojas");
      const lojasDoUsuario = todasLojas.filter(
        (loja: any) => loja.usuario_id === usuarioLogado.id
      );
      setLojas(lojasDoUsuario);

      const todosProdutos = await Promise.all(
        lojasDoUsuario.map((loja: any) =>
          api.get(`/lojas/${loja.id}/produtos`).then((r) => r.data)
        )
      );
      setProdutos(todosProdutos.flat());
    } catch (e) {
      console.error("Erro ao buscar dados do perfil:", e);
    }
  }, [usuarioLogado]);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  return (
    <div className="flex min-h-screen bg-[#F6F3E4]">
      <div className="flex flex-col flex-1 overflow-x-hidden">

        <div className="bg-[#000000] w-full">
          <Sidebar
            logado={logado}
            onLogout={() => {
              logout();
              router.push("/login");
            }}
            onLogin={() => router.push("/login")}
          />

          <div className="relative w-full" style={{ height: "357px" }}>
            <div className="absolute left-16 bottom-0 translate-y-1/2 z-10">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-[#F6F3E4] bg-white">
                <img src={usuario.foto} alt={usuario.nome} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <main className="w-full flex flex-col px-16 pb-20" style={{ paddingTop: "100px" }}>
          <div className="w-full">

            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[32px] mb-1">
                  {usuario.nome}
                </h1>
                <p className="text-[#555] text-[25px] flex items-center gap-2 mb-1">
                  <span>@</span> {usuario.username}
                </p>
                <p className="text-[#555] text-[25px] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  {usuario.email}
                </p>
              </div>

              {logado && (
                <button
                  className="px-6 py-2 bg-[#6A38F3] text-white rounded-full font-[family-name:var(--font-league-spartan)] text-[16px] font-bold hover:bg-[#5228d4] transition-colors cursor-pointer"
                  onClick={() => setModalEditarPerfil(true)}
                >
                  Editar Perfil
                </button>
              )}
            </div>

            <ModalEditarPerfil
              isOpen={modalEditarPerfil}
              onClose={() => setModalEditarPerfil(false)}
              initialData={{
                nome: usuario.nome,
                username: usuario.username,
                email: usuario.email,
                avatarUrl: usuario.foto,
              }}
              onSave={async () => {
                await recarregarUsuario();
                setModalEditarPerfil(false);
              }}
            />

            <h2 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[28px] mb-8">
              Produtos
            </h2>
            {produtos.length === 0 ? (
              <p className="text-[#555]">Nenhum produto encontrado.</p>
            ) : (
              <ScrollContainer>
                {produtos.map((produto: any, i: number) => (
                  <div key={i} className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                    <img
                      src={produto.imagens?.[0]?.url_imagem || "/placeholder.png"}
                      alt={produto.nome}
                      className="h-[300px] w-auto object-contain rounded-xl"
                    />
                    <p className="text-[#171918] font-bold mt-2">{produto.nome}</p>
                    <p className="text-[#555]">R${produto.preco}</p>
                  </div>
                ))}
              </ScrollContainer>
            )}

            <div className="flex items-center justify-between mt-16 mb-6">
              <h2 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[28px]">
                Lojas
              </h2>
              <button
                onClick={() => setModalAberto(true)}
                className="w-[40px] h-[40px] rounded-full bg-[#6A38F3] text-white text-[24px] flex items-center justify-center hover:bg-[#5228d4] transition-colors flex-shrink-0"
              >
                +
              </button>
            </div>

            <ScrollContainer>
              {lojas.map((loja: any, i: number) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow flex-shrink-0 w-[400px]"
                  onClick={() => router.push(`/loja-logado/${loja.id}`)}
                >
                  <div>
                    <p className="font-[family-name:var(--font-league-spartan)] text-[#171918] text-[35px]">
                      {loja.nome}
                    </p>
                    <p className="text-[#7B2FE0] text-[30px]">
                      {loja.categoria}
                    </p>
                  </div>
                  <div className="w-[100px] h-[100px] rounded-full bg-[#F5E6DC] flex items-center justify-center overflow-hidden">
                    <img src={loja.logo_url || loja.sticker_url || "/placeholder.png"} alt={loja.nome} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </ScrollContainer>

            {modalAberto && (
              <ModalAdicionarLoja
                onClose={() => {
                  setModalAberto(false);
                  buscarDados();
                }}
                usuarioId={usuarioLogado!.id}
              />
            )}

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