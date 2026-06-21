"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"

interface ImagemProduto {
    url_imagem: string
}

interface Produto {
    id: number
    nome: string
    preco: string | number
    estoque: number
    imagens?: ImagemProduto[]
    loja?: { logo_url: string }
}

interface CarrosselProdutosProps {
    produtos: Produto[]
    lojaId: string | null
}

export default function CarrosselProdutos({ produtos, lojaId }: CarrosselProdutosProps) {
    const ref = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const scrollEsquerda = () => ref.current?.scrollBy({ left: -280, behavior: "smooth" })
    const scrollDireita = () => ref.current?.scrollBy({ left: 280, behavior: "smooth" })

    return (
        <div className="relative">
            {/* Botão esquerdo */}
            <button
                onClick={scrollEsquerda}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center hover:bg-[#6A38F3] transition-all duration-300 ease-in-out cursor-pointer"
            />
            <div
                ref={ref}
                className="flex flex-row gap-[50px] overflow-x-auto scroll-smooth pb-2 px-12"
                style={{ scrollbarWidth: "none" }}
            >
                {produtos.map((p) => {
                    const disponivel = p.estoque > 0
                    const imagem = p.imagens?.[0]?.url_imagem

                    return (
                        <div
                            key={p.id}
                            onClick={() => router.push(`/produto/${p.id}?lojaId=${lojaId}`)}
                            className="flex flex-col bg-[#FFFFFF] min-w-[230px] w-[230px] h-[310px] rounded-[35px] items-center px-[25px] py-[20px] flex-shrink-0 cursor-pointer"
                        >
                            <div className="rounded-[20px] w-[190px] h-[190px] flex items-center justify-center relative">
                                <img src={imagem} className="object-contain w-[143px] h-[143px]" />
                                <img
                                    src={p.loja?.logo_url}
                                    className="absolute top-0 right-0 w-[68px] h-[68px] rounded-full object-cover"
                                />
                            </div>
                            <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[26px] font-[500] self-start leading-tight hover:underline">
                                {p.nome}
                            </p>
                            <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[23px] font-[500] self-start leading-tight">
                                R${Number(p.preco).toFixed(2)}
                            </p>
                            <p className={`font-[family-name:var(--font-league-spartan)] text-[14px] font-[500] self-start leading-tight ${disponivel ? "text-[#C6E700]" : "text-[#AF052A]"}`}>
                                {disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Botão direito */}
            <button
                onClick={scrollDireita}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center hover:bg-[#6A38F3] transition-all duration-300 ease-in-out cursor-pointer"
            />
        </div>
    )
}