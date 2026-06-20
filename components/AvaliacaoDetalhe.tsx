'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Comentario {
  id: string;
  autorNome: string;
  autorFotoUrl?: string;
  texto: string;
  criadoEm: string;
  isDonoDaLoja: boolean;
}

interface AvaliacaoLoja {
  id: string;
  autorNome: string;
  autorFotoUrl?: string;
  nota: number;
  texto: string;
  criadoEm: string;
  comentarios: Comentario[];
}

interface AvaliacaoDetalheProps {
  lojaId: string;
  avaliacaoId: string;
  isLoggedIn: boolean;
}

function tempoRelativo(dataIso: string): string {
  const diffMs = Date.now() - new Date(dataIso).getTime();
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHoras < 1) return 'agora';
  if (diffHoras < 24) return `${diffHoras}h`;

  const diffDias = Math.floor(diffHoras / 24);
  return `${diffDias}d`;
}

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < nota ? 'text-yellow-400' : 'text-zinc-600'}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function IconeVoltar({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconeLapis({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function IconeEnviar({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default function AvaliacaoDetalhe({
  lojaId,
  avaliacaoId,
  isLoggedIn,
}: AvaliacaoDetalheProps) {
  const router = useRouter();

  const [avaliacao, setAvaliacao] = useState<AvaliacaoLoja | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [novoComentario, setNovoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function buscarAvaliacao() {
      try {
        setLoading(true);
        const response = await api.get(`/lojas/${lojaId}/avaliacoes/${avaliacaoId}`);
        setAvaliacao(response.data);
        setErro(null);
      } catch (err) {
        console.error('Erro ao buscar avaliação:', err);
        setErro('Não foi possível carregar essa avaliação.');
      } finally {
        setLoading(false);
      }
    }

    buscarAvaliacao();
  }, [lojaId, avaliacaoId]);

  async function handleEnviarComentario() {
    if (!novoComentario.trim() || !avaliacao) return;

    try {
      setEnviando(true);
      const token = localStorage.getItem('token');
      const response = await api.post(
        `/avaliacoes-loja/${avaliacaoId}/comentarios`,
        { texto: novoComentario },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setAvaliacao({
        ...avaliacao,
        comentarios: [...avaliacao.comentarios, response.data],
      });
      setNovoComentario('');
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
    } finally {
      setEnviando(false);
    }
  }

  function handleEditarRespostaLoja(comentarioId: string) {
    console.log('Editar comentário da loja:', comentarioId);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e3]">
        <p className="text-zinc-500">Carregando avaliação...</p>
      </div>
    );
  }

  if (erro || !avaliacao) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e3]">
        <p className="text-red-500">{erro ?? 'Avaliação não encontrada.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e3]">
      {/* Aqui entra seu <Navbar isLoggedIn={isLoggedIn} /> já existente */}

      <div className="bg-black px-6 py-8 md:px-16">
        <button
          onClick={() => router.back()}
          className="mb-6 text-white/80 transition hover:text-white"
          aria-label="Voltar"
        >
          <IconeVoltar size={24} />
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {avaliacao.autorFotoUrl ? (
              <img
                src={avaliacao.autorFotoUrl}
                alt={avaliacao.autorNome}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-zinc-700" />
            )}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {avaliacao.autorNome}
              </span>
              <span className="text-sm text-white/50">
                {tempoRelativo(avaliacao.criadoEm)}
              </span>
            </div>
          </div>

          <Estrelas nota={avaliacao.nota} />
        </div>

        <p className="mt-4 max-w-2xl text-white/90">{avaliacao.texto}</p>
      </div>

      <div className="px-6 py-8 md:px-16">
        <div className="flex flex-col gap-6 border-l-2 border-zinc-300 pl-6">
          {avaliacao.comentarios.map((comentario) => (
            <div key={comentario.id} className="flex items-start gap-3">
              {comentario.autorFotoUrl ? (
                <img
                  src={comentario.autorFotoUrl}
                  alt={comentario.autorNome}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-zinc-300" />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-900">
                    {comentario.autorNome}
                  </span>
                  <span className="text-sm text-zinc-400">
                    {tempoRelativo(comentario.criadoEm)}
                  </span>
                </div>

                {comentario.isDonoDaLoja && (
                  <span className="text-xs font-medium text-purple-600">
                    dona da loja
                  </span>
                )}

                <p className="mt-1 text-zinc-700">{comentario.texto}</p>
              </div>

              {comentario.isDonoDaLoja && (
                <button
                  onClick={() => handleEditarRespostaLoja(comentario.id)}
                  className="text-zinc-400 transition hover:text-zinc-700"
                  aria-label="Editar resposta"
                >
                  <IconeLapis size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {isLoggedIn && (
          <div className="mt-8 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm">
            <input
              type="text"
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEnviarComentario();
              }}
              placeholder="Adicionar comentário"
              className="flex-1 bg-transparent text-zinc-700 outline-none placeholder:text-zinc-400"
            />
            <button
              onClick={handleEnviarComentario}
              disabled={enviando || !novoComentario.trim()}
              className="text-zinc-500 transition hover:text-purple-600 disabled:opacity-40"
              aria-label="Enviar comentário"
            >
              <IconeEnviar size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}