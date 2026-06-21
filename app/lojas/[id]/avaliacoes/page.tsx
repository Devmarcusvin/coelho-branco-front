"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { RatingModal } from "@/components/RatingModal";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Navbar from "@/components/navbar/navbar";

type Loja = {
  id: number;
  nome: string;
  banner_url?: string;
  logo_url?: string;
  usuario?: { nome: string };
};

type Avaliacao = {
  id: number;
  usuario_id: number;
  nota: number;
  comentario?: string;
  usuario?: { nome: string; foto_perfil_url?: string };
};

function Estrelas({ valor, tamanho = 22 }: { valor: number; tamanho?: number }) {
  return (
    <div className="flex gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => {
        const preenchida = i <= Math.floor(valor);
        const meia = !preenchida && i === Math.ceil(valor) && valor % 1 >= 0.5;
        return (
          <svg key={i} width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
            {meia ? (
              <>
                <defs>
                  <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#ccc" />
                  </linearGradient>
                </defs>
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={`url(#half-${i})`} stroke="#FFD700" strokeWidth="0.5" />
              </>
            ) : (
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={preenchida ? "#FFD700" : "#ccc"} stroke={preenchida ? "#FFD700" : "#ccc"} strokeWidth="0.5" />
            )}
          </svg>
        );
      })}
    </div>
  );
}

function CardAvaliacao({ avaliacao, onEditar }: { avaliacao: Avaliacao; onEditar?: () => void }) {
  const [expandido, setExpandido] = useState(false);
  const limite = 120;
  const texto = avaliacao.comentario ?? "";
  const longo = texto.length > limite;
  const textoExibido = expandido || !longo ? texto : texto.slice(0, limite) + " [...]";
  const router = useRouter();

  return (
    <div className="bg-[#F5F2E8] rounded-[20px] w-[930px] min-h-[205px] flex gap-8 items-start px-8 py-6 box-border flex-shrink-0">
      <img
        src={avaliacao.usuario?.foto_perfil_url || "/avatar-padrao.png"}
        alt={avaliacao.usuario?.nome}
        className="w-[154px] h-[154px] rounded-full object-cover flex-shrink-0 cursor-pointer"
        onClick={() => router.push(`/perfil/${avaliacao.usuario_id}`)}
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1.5 gap-4">
          <span className="font-bold text-[28px] text-[#111] font-[family-name:var(--font-league-spartan)]">
            {avaliacao.usuario?.nome}
          </span>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Estrelas valor={avaliacao.nota} tamanho={35} />
            {onEditar && (
              <button
                onClick={onEditar}
                className="text-[#6A38F3] text-base font-semibold cursor-pointer bg-transparent border-none font-[family-name:var(--font-league-spartan)]"
              >
                <img src="/editar.png" alt="editar" />
              </button>
            )}
          </div>
        </div>
        {texto && (
          <>
            <p className="text-2xl text-[#333] m-0 leading-[1.55] text-justify font-[family-name:var(--font-league-spartan)] cursor-pointer"onClick={() => router.push(`/abrir-avaliacao/${avaliacao.id}`)}>
              {textoExibido}</p>
            {longo && (
              <button
                onClick={() => setExpandido(!expandido)}
                className="bg-none border-none text-[#6A38F3] text-base font-semibold cursor-pointer p-0 mt-2 block ml-auto font-[family-name:var(--font-league-spartan)] hover:underline"
              >
                {expandido ? "ver menos" : "ver mais"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AvaliacoesLoja() {
  const router = useRouter();
  const params = useParams();
  const lojaId = Number(params?.lojaId ?? params?.id);
  const { usuario } = useAuth();

  const [loja, setLoja] = useState<Loja | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    if (!lojaId) return;

    async function carregar() {
      setCarregando(true);
      try {
        const [lojaRes, avaliacoesRes] = await Promise.all([
          api.get(`/lojas/${lojaId}`),
          api.get(`/lojas/${lojaId}/avaliacoes`),
        ]);

        setLoja(lojaRes.data);
        setAvaliacoes(avaliacoesRes.data);
      } catch (e) {
        console.error("Erro ao carregar avaliações da loja:", e);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [lojaId]);

  const notaMedia = avaliacoes.length
    ? avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length
    : 0;

  const minhaAvaliacao = avaliacoes.find((av) => av.usuario_id === usuario?.id);

  function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function handleSubmitAvaliacao(rating: number, comment: string) {
    if (!usuario) {
      router.push("/login");
      return;
    }

    try {
      if (minhaAvaliacao) {
        const { data } = await api.patch(
          `/lojas/${lojaId}/avaliacoes/${minhaAvaliacao.id}`,
          { nota: rating, comentario: comment },
          { headers: getAuthHeaders() }
        );
        setAvaliacoes((prev) => prev.map((av) => (av.id === data.id ? { ...av, ...data } : av)));
      } else {
        const { data } = await api.post(
          `/lojas/${lojaId}/avaliacoes`,
          { usuario_id: usuario.id, nota: rating, comentario: comment },
          { headers: getAuthHeaders() }
        );
        setAvaliacoes((prev) => [{ ...data, usuario: { nome: usuario.nome, foto_perfil_url: usuario.foto_perfil_url } }, ...prev]);
      }
    } catch (e) {
      console.error("Erro ao salvar avaliação:", e);
    }
  }

  async function handleDeletarAvaliacao() {
    if (!minhaAvaliacao) return;

    try {
      await api.delete(`/lojas/${lojaId}/avaliacoes/${minhaAvaliacao.id}`, {
        headers: getAuthHeaders(),
      });
      setAvaliacoes((prev) => prev.filter((av) => av.id !== minhaAvaliacao.id));
      setModalAberto(false);
    } catch (e) {
      console.error("Erro ao deletar avaliação:", e);
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-2xl font-[family-name:var(--font-league-spartan)]">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-[family-name:var(--font-league-spartan)]">

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

        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-15 text-center">
          {loja?.logo_url ? (
            <img src={loja.logo_url} alt={loja.nome} className="w-24 h-24 object-contain rounded-full" />
          ) : (
            <h1 className="text-white m-0 text-[clamp(32px,5vw,64px)] font-[family-name:var(--font-league-spartan)]">
              {loja?.nome}
            </h1>
          )}

          {loja?.logo_url && (
            <h1 className="text-white m-0 text-[clamp(24px,3.5vw,40px)] font-[family-name:var(--font-league-spartan)]">
              {loja.nome}
            </h1>
          )}
        </div>

        {loja?.usuario?.nome && (
          <div className="absolute bottom-5 right-7 text-[#ddd] text-sm z-40 font-[family-name:var(--font-league-spartan)]">
            by{" "}
            <span className="underline cursor-pointer" onClick={() => router.push(`/perfil`)}>
              {loja.usuario.nome}
            </span>
          </div>
        )}
      </div>

      {/* REVIEWS - cabeçalho com média */}
      <div className="bg-black flex flex-col items-center py-12 px-6">
        <h2 className="text-white text-[45px] font-normal m-0 mb-2 text-center font-[family-name:var(--font-league-spartan)]">
          Reviews e Comentários
        </h2>

        {avaliacoes.length > 0 ? (
          <>
            <p className="text-white text-[65px] font-normal m-0 mb-2 leading-[1.1] font-[family-name:var(--font-league-spartan)]">
              {notaMedia.toFixed(2)}
            </p>
            <Estrelas valor={notaMedia} tamanho={40} />
          </>
        ) : (
          <p className="text-[#888] text-lg m-2 font-[family-name:var(--font-league-spartan)]">
            Ainda não há avaliações para esta loja.
          </p>
        )}

        <button
          onClick={() => setModalAberto(true)}
          onMouseOver={(e) => (e.currentTarget.style.background = "#5228d4")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#6A38F3")}
          className="mt-8 w-full max-w-[930px] py-[2px] bg-[#6A38F3] border-none rounded-full text-white text-[40px] cursor-pointer font-[family-name:var(--font-league-spartan)]"
        >
          Adicionar Review
        </button>
      </div>

      {/* CARDS */}
      <div className="bg-black flex flex-col items-center gap-5 py-6 px-6 pb-16">
        {avaliacoes.map((av) => (
          <CardAvaliacao
            key={av.id}
            avaliacao={av}
            onEditar={av.usuario_id === usuario?.id ? () => setModalAberto(true) : undefined}
          />
        ))}
      </div>

      <RatingModal
        storeName={loja?.nome ?? ""}
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSubmit={handleSubmitAvaliacao}
        onDelete={minhaAvaliacao ? handleDeletarAvaliacao : undefined}
        initialRating={minhaAvaliacao?.nota ?? 0}
        initialComment={minhaAvaliacao?.comentario ?? ""}
      />
    </div>
  );
}