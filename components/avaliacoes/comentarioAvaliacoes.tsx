"use client"
import { useRef } from "react"
 
interface Usuario {
  nome: string
  foto_perfil_url?: string
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
 
  const scrollEsquerda = () => avaliacoesRef.current?.scrollBy({ left: -960, behavior: "smooth" })
  const scrollDireita = () => avaliacoesRef.current?.scrollBy({ left: 960, behavior: "smooth" })
 
  return (
    <div className="relative flex flex-row gap-[10px]">
      <button onClick={scrollEsquerda}
        className="absolute left-0 top-[60%] -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center 
    hover:bg-[#6A38F3] transition-all duration-300 ease-in-out cursor-pointer shrink-0 text-xl"/>
 
      <div className="flex flex-col gap-[20px] w-full">
        <h1 className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[41px] font-[400]">Avaliações</h1>
        <div ref={avaliacoesRef} className="flex flex-row overflow-x-auto gap-[30px] px-12 pb-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
 
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
          ))}
 
        </div>
      </div>
 
      <button onClick={scrollDireita} className="absolute right-0 top-[60%] -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center hover:bg-[#6A38F3]  
  transition-all duration-300 ease-in-out cursor-pointer shrink-0 text-xl"/>
    </div>
  )
}