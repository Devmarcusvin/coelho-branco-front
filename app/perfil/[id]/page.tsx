"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/navbar/navbar";
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

export default function PerfilUsuario() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { usuario: usuarioLogado, logout } = useAuth();
  const [usuario, setUsuario] = useState<any>(null);
  const [lojas, setLojas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const logado = !!usuarioLogado;

  const buscarDados = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);

      const { data: usuarioData } = await api.get(`/users/${id}`);
      setUsuario(usuarioData);

      const { data: todasLojas } = await api.get("/lojas");
      const lojasDoUsuario = todasLojas.filter(
        (loja: any) => loja.usuario_id === id
      );
      setLojas(lojasDoUsuario);

      const todosProdutos = await Promise.all(
        lojasDoUsuario.map((loja: any) =>
          api.get(`/lojas/${loja.id}/produtos`).then((r) => r.data)
        )
      );
      setProdutos(todosProdutos.flat());
    } catch (e) {
      console.error("Erro ao buscar perfil do usuário:", e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F3E4]">
        <p className="text-[#555]">Carregando perfil...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F3E4]">
        <p className="text-red-500">Usuário não encontrado.</p>
      </div>
    );
  }

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
                <img
                  src={usuario.foto_perfil_url || "/fotoperfil1.png"}
                  alt={usuario.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <main className="w-full flex flex-col px-16 pb-20" style={{ paddingTop: "100px" }}>
          <div className="w-full">

            <div className="mb-8">
              <h1 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[32px] mb-1">
                {usuario.nome}
              </h1>
              <p className="text-[#555] text-[25px] flex items-center gap-2">
                <span>@</span> {usuario.username}
              </p>
            </div>

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

            <h2 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[28px] mt-16 mb-6">
              Lojas
            </h2>
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

          </div>
        </main>
      </div>
    </div>
  );
}