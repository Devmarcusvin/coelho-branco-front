"use client"
import { useRef, useState } from "react"

//'Status' criado apenas para testar como ficaria parte de editar comentários
type Status = "deslogado" | "logado" | "comentou"

export default function CarrosselAvaliacoes() {
  const avaliacoesRef = useRef<HTMLDivElement>(null)

  const scrollEsquerda = () => avaliacoesRef.current?.scrollBy({ left: -960, behavior: "smooth" })
  const scrollDireita = () => avaliacoesRef.current?.scrollBy({ left: 960, behavior: "smooth" })

  const [status, setStatus] = useState<Status>("deslogado")

  return (
    <div className="relative flex flex-row gap-[10px]">
      <button onClick={scrollEsquerda}
        className="absolute left-0 top-[60%] -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center 
    hover:bg-[#6A38F3] transition-all duration-300 ease-in-out cursor-pointer shrink-0 text-xl"/>

      <div className="flex flex-col gap-[20px] w-full">
        <h1 className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[41px] font-[400]">Avaliações</h1>
        <div ref={avaliacoesRef} className="flex flex-row overflow-x-auto gap-[30px] px-12 pb-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">

          {/*Primeiro Usuario */}
          <div className="min-w-[930px] h-[205px] bg-[#FFFFFF] rounded-[20px] flex items-center">
            <img src="/Selena Gomez.png" className="cursor-pointer rounded-full h-[154px] w-[154px] ml-6" />
            <div className="flex flex-col h-full py-[40px] flex-1 px-[20px]">
              <div className="flex flex-row justify-between items-center relative">
                <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[29px] font-[400]">Selena Gomez</p>
                {/*Estreas */}
                <div className="flex flex-row ">
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <div className="px-[20px] self-center">
                    {status === "comentou" && (
                    <img src="editar.png" className="cursor-pointer w-[27px] h-[27px]" />
                  )}
                  </div>
                  
                </div>
              </div>
              <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[25px] font-[200]">Essa garota arrasa.</p>
            </div>
          </div>

          {/*Segundo Usuário */}
          <div className="min-w-[930px] h-[205px] bg-[#FFFFFF] rounded-[20px] flex items-center">
            <img src="/Sofia FIgueiredo.png" className="cursor-pointer rounded-full h-[154px] w-[154px] ml-6" />
            <div className="flex flex-col h-full py-[40px] flex-1 px-[20px]">
              <div className="flex flex-row justify-between items-center">
                <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[29px] font-[400]">Sofia Figueiredo</p>
                {/*Estreas */}
                <div className="flex flex-row ">
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <div className="px-[20px] self-center">
                    {status === "comentou" && (
                    <img src="editar.png" className="cursor-pointer w-[27px] h-[27px]" />
                  )}
                  </div>
                </div>
              </div>
              <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[25px] font-[200]">Adorei o produto. Funcionou muito na minha pele. Estou muito
                contente e com toda certeza irei comprar mais produtos da marca. Que orgulhoooooo! Arrasaram</p>
            </div>
          </div>

          {/*Terceiro Usuário */}
          <div className="min-w-[930px] h-[205px] bg-[#FFFFFF] rounded-[20px] flex items-center">
            <img src="/Pedro.jpg" className="cursor-pointer rounded-full h-[154px] w-[154px] ml-6" />
            <div className="flex flex-col h-full py-[40px] flex-1 px-[20px]">
              <div className="flex flex-row justify-between items-center">
                <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[29px] font-[400]">Pedro Freitas</p>
                {/*Estreas */}
                <div className="flex flex-row ">
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <img src="/Star 1.png" className="w-[34px] h-[34px]" />
                  <div className="px-[20px] self-center">
                    {status === "comentou" && (
                    <img src="editar.png" className="cursor-pointer w-[27px] h-[27px]" />
                  )}
                  </div>
                </div>
              </div>
              <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[25px] font-[200]">Não consigo descrever a sensação de passar
                uma base que realmente orna com sua pele.... Sensacional! Parabéns aos envolvidos</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={scrollDireita} className="absolute right-0 top-[60%] -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center hover:bg-[#6A38F3]  
  transition-all duration-300 ease-in-out cursor-pointer shrink-0 text-xl"/>
    </div>
  )
}