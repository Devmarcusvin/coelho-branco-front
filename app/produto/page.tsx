"use client"
import Sidebar from "../../components/marcuscomp/Sidebar"
import CarrosselAvaliacoes from "../../components/avaliacoes/comentarioAvaliacoes"
import CarrosselProdutos from "../../components/produtosCarrossel/produtosCar"
import { useState } from "react"

//são as imagens definidas do produto, quando integrar com o back retire
const imagens = ["/p1.png", "/p2.png", "/p3.png", "/p4.png"]

//Isso aqui é só pra trocar o que aparece na página dependendo de situações como: logado, deslogado e dono do comentário
type Status = "deslogado" | "logado" | "comentou"

export default function Home() {
  // duas variaveis de teste, retire quando integrar com o back
  const [imagemSelecionada, setImagemSelecionada] = useState("/p1.png")
  const [status, setStatus] = useState<Status>("comentou")

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-[#F6F3E4] overflow-auto">
        <div className="flex flex-col gap-[60px] p-[60px] px-[100px] max-w-[1400px] mx-auto w-full overflow-hidden">

          {/* Grupo produto */}
          <div className="flex flex-row gap-[20px] h-[552px]">
            <img src="/Vector 112.png" alt="botão de retornar" className="cursor-pointer self-start py-[20px]" />

            <div className="flex flex-row gap-[10px] w-[704px] h-[552px]">
              <div className="flex flex-col gap-[8px]">
                {imagens.map((img) => (
                  <img key={img} src={img} onClick={() => setImagemSelecionada(img)}
                    className={`min-w-[132px] w-[132px] h-[132px] rounded-[20px] object-cover cursor-pointer flex-shrink-0 transition-all duration-200
                ${imagemSelecionada === img ? "ring-2 ring-[#6A38F3]" : "opacity-70 hover:opacity-100"}`}/>
                ))}
              </div>
              <div className="relative flex-1 bg-white rounded-[30px]">
                <img src={imagemSelecionada} className="w-full h-full rounded-[30px] object-cover" />
                <img src="/logoCJR.png" className="cursor-pointer absolute left-120 top-4 h-[72px] w-[72px] rounded-full object-cover" />
              </div>
            </div>

                {/*Infos do produto */}
<div className="flex-1 h-full gap-[10px]">
  <div className="relative flex flex-row items-center gap-[8px]">
    <h1 className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[41px] font-[400]">Brownie Meio Amargo</h1>

    {/* Ícones sempre colados à direita do container, independente do nome */}
    <div className="absolute right-0 flex flex-row gap-[2px]">
      {status !== "deslogado" && (
        <img src="verificado.png" className="w-[27px] h-[27px]" />
      )}
      {status !== "deslogado" && (
        <img src="comentado.png" className="w-[27px] h-[27px]" />
      )}
    </div>
  </div>

              <div className="flex flex-row gap-[30px]">
                <div className="flex">
                  <img src="/Star 1.png" className="self-start w-[17px] h-[17px]" />
                  <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[19px] text-center cursor-pointer font-[400]">4.5 | 15 reviews</p>
                </div>
                <p className="text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[19px] text-center cursor-pointer font-[400]">mercado</p>
                <p className="text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[19px] text-center font-[400]">3 disponíveis</p>
              </div>
              <h1 className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[40px] font-[400]">R$4.70</h1>
              <div className="flex p-1 bg-[#C7C7C7] rounded w-10"></div>
              <p className="text-[#000000] py-[10px] font-[family-name:var(--font-league-spartan)] text-[13px] font-[300]">BROWNIE MEIO AMARGO 80g<br></br>Recheado com uma ganache de chocolate meio amargo bem cremosa, esse brownie conquistou o coração de muita gente!<br></br>
                Ingredientes: <br></br> Achocolatado em pó, farinha de trigo enriquecida com ferro e ácido fólico, chocolate meio amargo, açúcar cristal, manteiga, água ,creme de leite, ovo em pó, glucose em pó, emulsificante: lecitina de soja, conservantes:
                sorbato de potássio, propionato de cálcio e conservante para doces (sal refinado sem iodo, açúcar refinado, conservantes INS 202 e INS 211 e acidulante INS 330) e antioxidante: sal não iodado, amido de milho, antioxidantes INS 321 e INS 31
                CONTÉM GLÚTEN.<br></br>CONTÉM LACTOSE.<br></br>ALÉRGICOS: CONTÉM OVO E DERIVADOS DE LEITE, TRIGO E SOJA.</p>
            </div>
          </div>

          {/* Avaliações */}
          <div className="flex flex-col relative gap-[20px]">
            <CarrosselAvaliacoes />

            <h1 className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[41px] font-[400]">Da mesma loja</h1>
            <CarrosselProdutos />
          </div>

        </div>
      </div>
    </div>
  )
}