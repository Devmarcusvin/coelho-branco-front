"use client"
import { useRef } from "react"
 
interface Usuario {
  nome: string
  foto_perfil_url?: string
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
        const newLocal = isDown = true;
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
 
interface Avaliacao {
  id: number
  usuario_id: number
  nota: number
  comentario?: string
  usuario?: Usuario
}
 
interface CarrosselAvaliacoesProps {
  avaliacoes: Avaliacao[]
  usuarioLogadoId: number | null
  onEditarAvaliacao: () => void
}
 
export default function CarrosselAvaliacoes({
  avaliacoes,
  usuarioLogadoId,
  onEditarAvaliacao,
}: CarrosselAvaliacoesProps) {
  const avaliacoesRef = useRef<HTMLDivElement>(null)
  
  return (
    <div className="relative flex flex-row gap-[10px]">
      <div className="flex flex-col gap-[20px] w-full">
        <h1 className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[41px] font-[400]">Avaliações</h1>
        <div ref={avaliacoesRef} className="flex flex-row overflow-x-auto gap-[30px] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <ScrollContainer>
          {avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="min-w-[930px] h-[205px] bg-[#FFFFFF] rounded-[20px] flex items-center">
              <img
                src={avaliacao.usuario?.foto_perfil_url || "/avatar-padrao.png"}
                className="cursor-pointer rounded-full h-[154px] w-[154px] ml-6"
              />
              <div className="flex flex-col h-full py-[40px] flex-1 px-[20px]">
                <div className="flex flex-row justify-between items-center relative">
                  <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[29px] font-[400]">
                    {avaliacao.usuario?.nome}
                  </p>
                  {/*Estrelas */}
                  <div className="flex flex-row">
                    {Array.from({ length: avaliacao.nota }).map((_, i) => (
                      <img key={i} src="/Star 1.png" className="w-[34px] h-[34px]" />
                    ))}
                    <div className="px-[20px] self-center">
                      {avaliacao.usuario_id === usuarioLogadoId && (
                        <img
                          src="/editar.png"
                          onClick={onEditarAvaliacao}
                          className="cursor-pointer w-[27px] h-[27px]"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[25px] font-[200]">
                  {avaliacao.comentario}
                </p>
              </div>
            </div>
          ))}</ScrollContainer>
 
        </div>
      </div>
 
    </div>
  )
}