"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"

//produtos pré definidos (tirar dps) - id e lojaId mockados, trocar pelos reais quando cadastrar no banco
const produtos = [
    { id: 1, lojaId: 1, img: "brownie azul.png", nome: "Brownie Trad.", preco: "R$3.80", disponivel: false },
    { id: 2, lojaId: 1, img: "brownie doce leite.png", nome: "Brownie Doce L.", preco: "R$4,70", disponivel: true },
    { id: 3, lojaId: 1, img: "brownie nozes.png", nome: "Brownie Nozes", preco: "R$4.70", disponivel: true },
    { id: 4, lojaId: 1, img: "brownie cookie.png", nome: "Brownie Cookie", preco: "R$4.70", disponivel: false },
    { id: 5, lojaId: 1, img: "brownie m&ms.png", nome: "Brownie M&M's", preco: "R$4.70", disponivel: true },
    { id: 6, lojaId: 2, img: "Redbull Zero.png", nome: "Redbull Zero", preco: "R$5,41", disponivel: true },
    { id: 7, lojaId: 2, img: "Redbull Melanc..png", nome: "Redbull Melanc.", preco: "R$5,41", disponivel: false },
    { id: 8, lojaId: 2, img: "Redbull.png", nome: "Redbull", preco: "R$5,41", disponivel: true },
]

export default function CarrosselProdutos() {
    const ref = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const scrollEsquerda = () => ref.current?.scrollBy({ left: -280, behavior: "smooth" })
    const scrollDireita = () => ref.current?.scrollBy({ left: 280, behavior: "smooth" })

    const abrirProduto = (id: number, lojaId: number) => {
        router.push(`/produto/${id}?lojaId=${lojaId}`)
    }

    return (
        <div className="relative">
            {/* Botão esquerdo */}
            <button onClick={(scrollEsquerda)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center hover:bg-[#6A38F3] transition-all duration-300 ease-in-out cursor-pointer" />
            <div ref={ref} className="flex flex-row gap-[50px] overflow-x-auto scroll-smooth pb-2 px-12" style={{ scrollbarWidth: "none" }}>
                {produtos.map((p, i) => (
                    <div
                        key={i}
                        onClick={() => abrirProduto(p.id, p.lojaId)}
                        className="flex flex-col bg-[#FFFFFF] min-w-[230px] w-[230px] h-[310px] rounded-[35px] items-center px-[25px] py-[20px] flex-shrink-0 cursor-pointer"
                    >
                        <div className="rounded-[20px] w-[190px] h-[190px] flex items-center justify-center cursor-pointer relative">
                            <img src={p.img} className="object-contain w-[143px] h-[143px]" />
                            <img src="logoCJR.png" className="absolute top-0 right-0 w-[68px] h-[68px] rounded-full object-cover" />
                        </div>
                        <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[26px] font-[500] self-start leading-tight hover:underline">
                            {p.nome}</p>
                        <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[23px] font-[500] self-start leading-tight">
                            {p.preco}</p>
                        <p className={`font-[family-name:var(--font-league-spartan)] text-[14px] font-[500] self-start leading-tight ${p.disponivel ? "text-[#C6E700]" : "text-[#AF052A]"}`}>
                            {p.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                        </p>
                    </div>
                ))}
            </div>

            {/* Botão direito */}
            <button onClick={(scrollDireita)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center 
      hover:bg-[#6A38F3] transition-all duration-300 ease-in-out cursor-pointer"/>
        </div>
    )
}