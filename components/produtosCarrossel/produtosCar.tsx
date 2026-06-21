"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"

interface ImagemProduto {
    url_imagem: string
}

interface Produto {
    id: number
    nome: string
    preco: number
    estoque: number
    imagens?: ImagemProduto[]
    loja?: { logo_url: string }
}

interface CarrosselProdutosProps {
    produtos: Produto[]
    lojaId: string | null
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

function formatarPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CarrosselProdutos({ produtos, lojaId }: CarrosselProdutosProps) {
    const ref = useRef<HTMLDivElement>(null)
    const router = useRouter()

    return (
        <div className="relative">
            {/* Botão esquerdo */}
            <div ref={ref} className="flex flex-row gap-[50px] overflow-x-auto scroll-smooth" style={{ scrollbarWidth: "none" }}>
                <ScrollContainer>
                {produtos.map((p) => {
                    const disponivel = p.estoque > 0
                    const imagem = p.imagens?.[0]?.url_imagem 
                    return (
                        <div
                            key={p.id}
                            onClick={() => router.push(`/produto/${p.id}?lojaId=${lojaId}`)}
                            className="flex flex-col bg-[#FFFFFF] min-w-[230px] w-[230px] h-[310px] rounded-[35px] items-center px-[25px] py-[20px] flex-shrink-0">
                            <div className="rounded-[20px] w-[190px] h-[190px] flex items-center justify-center cursor-pointer relative">
                                <img src={imagem} className="object-contain w-[143px] h-[143px]" />
                                <img src={p.loja?.logo_url} className="absolute top-0 right-0 w-[68px] h-[68px] rounded-full object-cover" />
                            </div>
                            <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[18px] font-[500] self-start leading-tight cursor-pointer hover:underline">
                                {p.nome}</p>
                            <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[23px] font-[500] self-start leading-tight">
                                R${Number(p.preco).toFixed(2)}</p>
                            <p className={`font-[family-name:var(--font-league-spartan)] text-[14px] font-[500] self-start leading-tight ${disponivel ? "text-[#C6E700]" : "text-[#AF052A]"}`}>
                                {disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                            </p>
                        </div>
                    )
                })}
                </ScrollContainer>
            </div>

            {/* Botão direito */}
        </div>
    )
}