"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Navbar from "@/components/navbar/navbar";

function formatarPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

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
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const logado = !!usuarioLogado;
  const temProdutosOuLojas = produtos.length > 0 || lojas.length > 0;

  const buscarDados = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);

      const { data: usuarioData } = await api.get(`/users/${id}`);
      setUsuario(usuarioData);

      const { data: todasLojas } = await api.get("/lojas");
      const lojasDoUsuario = todasLojas.filter(
        (loja: any) => loja.usuario_id === Number(id)
      );
      setLojas(lojasDoUsuario);

      const todosProdutos = await Promise.all(
        lojasDoUsuario.map((loja: any) =>
          api.get(`/lojas/${loja.id}/produtos`).then((r) => r.data)
        )
      );
      setProdutos(todosProdutos.flat());

      // Comentários: percorre todas as lojas e produtos buscando avaliações
      // e filtra só as do usuário do perfil. Sem rota nova no backend.
      const avaliacoesLojaPorLoja = await Promise.all(
        todasLojas.map((loja: any) =>
          api.get(`/lojas/${loja.id}/avaliacoes`).then((r) =>
            r.data.map((av: any) => ({ ...av, tipo: "loja", lojaId: loja.id }))
          )
        )
      );

      const { data: todosProdutosGeral } = await api.get("/produtos");
      const avaliacoesProdutoPorProduto = await Promise.all(
        todosProdutosGeral.map((produto: any) =>
          api.get(`/produtos/${produto.id}/avaliacoes`).then((r) =>
            r.data.map((av: any) => ({
              ...av,
              tipo: "produto",
              produtoId: produto.id,
              lojaId: produto.loja_id,
            }))
          )
        )
      );

      const todosComentarios = [
        ...avaliacoesLojaPorLoja.flat(),
        ...avaliacoesProdutoPorProduto.flat(),
      ].filter((c: any) => c.usuario_id === Number(id));

      todosComentarios.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setComentarios(todosComentarios);
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
          <Navbar />

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

            {temProdutosOuLojas && (
              <>
                <h2 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[28px] mb-8">
                  Produtos
                </h2>
                {produtos.length === 0 ? (
                  <p className="text-[#555] mb-16">Nenhum produto encontrado.</p>
                ) : (
                  <div className="flex flex-row gap-[50px] overflow-x-auto scroll-smooth mb-16" style={{ scrollbarWidth: "none" }}>
                    <ScrollContainer>
                      {produtos.map((p: any) => {
                        const disponivel = p.estoque > 0;
                        const imagem = p.imagens?.[0]?.url_imagem;
                        return (
                          <div
                            key={p.id}
                            onClick={() => router.push(`/produto/${p.id}?lojaId=${p.loja_id}`)}
                            className="flex flex-col bg-[#FFFFFF] min-w-[230px] w-[230px] h-[310px] rounded-[35px] items-center px-[25px] py-[20px] flex-shrink-0"
                          >
                            <div className="rounded-[20px] w-[190px] h-[190px] flex items-center justify-center cursor-pointer relative">
                              <img src={imagem} className="object-contain w-[143px] h-[143px]" />
                              <img src={p.loja?.logo_url} className="absolute top-0 right-0 w-[68px] h-[68px] rounded-full object-cover" />
                            </div>
                            <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[18px] font-[500] self-start leading-tight cursor-pointer hover:underline">
                              {p.nome}
                            </p>
                            <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[23px] font-[500] self-start leading-tight">
                              {formatarPreco(p.preco)}
                            </p>
                            <p className={`font-[family-name:var(--font-league-spartan)] text-[14px] font-[500] self-start leading-tight ${disponivel ? "text-[#C6E700]" : "text-[#AF052A]"}`}>
                              {disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                            </p>
                          </div>
                        );
                      })}
                    </ScrollContainer>
                  </div>
                )}

                <h2 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[28px] mb-6">
                  Lojas
                </h2>
                <ScrollContainer>
                  {lojas.map((loja: any, i: number) => (
                    <div
                      key={i}
                      className="min-w-[930px] h-[205px] bg-white rounded-[20px] flex items-center justify-between px-10 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/lojas/${loja.id}`)}
                    >
                      <div>
                        <p className="font-[family-name:var(--font-league-spartan)] text-[#171918] text-[35px]">
                          {loja.nome}
                        </p>
                        <p className="text-[#7B2FE0] text-[30px]">
                          {loja.categoria}
                        </p>
                      </div>
                      <div className="w-[120px] h-[120px] rounded-full bg-[#F5E6DC] flex items-center justify-center overflow-hidden">
                        <img src={loja.logo_url || loja.sticker_url || "/placeholder.png"} alt={loja.nome} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ))}
                </ScrollContainer>
              </>
            )}

            <h2 className="font-[family-name:var(--font-league-spartan)] font-bold text-[#171918] text-[28px] mt-16 mb-6">
              Comentários
            </h2>
            {comentarios.length === 0 ? (
              <p className="text-[#555]">Nenhum comentário ainda.</p>
            ) : (
              <ScrollContainer>
                {comentarios.map((c: any, i: number) => (
                  <div
                    key={`${c.tipo}-${c.id}-${i}`}
                    onClick={() =>
                      c.tipo === "produto"
                        ? router.push(`/produto/${c.produtoId}?lojaId=${c.lojaId}`)
                        : router.push(`/lojas/${c.lojaId}`)
                    }
                    className="min-w-[930px] h-[205px] bg-[#FFFFFF] rounded-[20px] flex items-center cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <img
                      src={usuario.foto_perfil_url || "/avatar-padrao.png"}
                      className="rounded-full h-[154px] w-[154px] ml-6 object-cover"
                    />
                    <div className="flex flex-col h-full py-[40px] flex-1 px-[20px]">
                      <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row">
                          {Array.from({ length: c.nota }).map((_, j) => (
                            <img key={j} src="/Star 1.png" className="w-[28px] h-[28px]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[25px] font-[200] mt-2">
                        {c.comentario}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollContainer>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}