"use client"
import Sidebar from "../../../components/navbar/navbar"
import CarrosselAvaliacoes from "../../../components/avaliacoes/comentarioAvaliacoes"
import CarrosselProdutos from "../../../components/produtosCarrossel/produtosCar"
import ModalEditarProduto from "../../../components/ModalEditarProduto"
import ModalAdicionarProduto from "@/components/ModalAdicionarProduto"
import { useState, useEffect } from "react"
import { useSearchParams, useParams } from "next/navigation"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

function getUserIdFromToken(): number | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("token")
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub ?? null
  } catch {
    return null
  }
}

export default function Home() {
  const router = useRouter();
  const [logado, setLogado] = useState(false)
  const [modalEditarAberto, setModalEditarAberto] = useState(false)

  const searchParams = useSearchParams()

  const [usuarioId, setUsuarioId] = useState<number | null>(null)
  useEffect(() => {
    const id = getUserIdFromToken()
    setUsuarioId(id)
    setLogado(id !== null)
  }, [])

  const params = useParams()
  const produtoId = params.id
  const lojaId = searchParams.get("lojaId")

  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imagemSelecionada, setImagemSelecionada] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!lojaId || !produtoId) return

    async function fetchProduto() {
      try {
        const { data } = await api.get(`/lojas/${lojaId}/produtos/${produtoId}`)
        setProduto(data)
        if (data.imagens?.length > 0) {
          setImagemSelecionada(data.imagens[0].url_imagem)
        }
      } catch (err) {
        console.error("Erro ao buscar produto:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduto()
  }, [lojaId, produtoId])

  const [produtosDaLoja, setProdutosDaLoja] = useState<any[]>([])

  useEffect(() => {
    if (!lojaId) return

    async function fetchProdutosDaLoja() {
      try {
        const { data } = await api.get(`/lojas/${lojaId}/produtos`)
        setProdutosDaLoja(data.filter((p: any) => p.id !== Number(produtoId)))
      } catch (err) {
        console.error("Erro ao buscar produtos da loja:", err)
      }
    }

    fetchProdutosDaLoja()
  }, [lojaId, produtoId])


  /*média das avaliações */
  const notas = produto?.avaliacoes?.map((a: any) => a.nota) || []
  const media = notas.length ? (notas.reduce((a: number, b: number) => a + b, 0) / notas.length).toFixed(1) : "0.0"

  const avaliacaoPropria = produto?.avaliacoes?.find(
    (a: any) => a.usuario_id === usuarioId
  )
  const ehDonoDaLoja = produto?.loja?.usuario_id === usuarioId

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar logado={logado} onLogout={() => setLogado(false)} onLogin={() => setLogado(true)} />
      <div className="flex-1 bg-[#F6F3E4] overflow-auto">
        <div className="flex flex-col gap-[60px] p-[60px] px-[100px] max-w-[1400px] mx-auto w-full overflow-hidden">

          {/* Grupo produto */}
          <div className="flex flex-row gap-[20px] h-[552px]">
            <img src="/Vector 112.png" alt="botão de retornar" className="cursor-pointer self-start py-[20px]" onClick={() => router.push('/')}/>

            <div className="flex flex-row gap-[10px] w-[704px] h-[552px]">
              <div className="flex flex-col gap-[8px]">
                {(produto?.imagens || []).map((img: any) => (
                  <img key={img.id} src={img.url_imagem} onClick={() => setImagemSelecionada(img.url_imagem)}
                    className={`min-w-[132px] w-[132px] h-[132px] rounded-[20px] object-cover cursor-pointer flex-shrink-0 transition-all duration-200
                    ${imagemSelecionada === img.url_imagem ? "ring-2 ring-[#6A38F3]" : "opacity-70 hover:opacity-100"}`} />
                ))}
              </div>
              <div className="relative flex-1 bg-white rounded-[30px] overflow-hidden">
                <img src={imagemSelecionada} className="w-full h-full rounded-[30px] object-contain" />
                <img src={produto?.loja?.logo_url} className="cursor-pointer absolute left-120 top-4 h-[72px] w-[72px] rounded-full object-cover" />
              </div>
            </div>

            {/*Infos do produto */}
            <div className="flex-1 h-full gap-[10px]">
              <div className="relative flex flex-row items-center gap-[8px]">
                <h1 className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[41px] font-[400]">{produto?.nome}</h1>

                {/* Ícones sempre colados à direita do container, independente do nome */}
                <div className="absolute right-0 flex flex-row gap-[2px]">
                  {logado && ehDonoDaLoja && (
                    <img
                      src="/comentado.png"
                      onClick={() => setModalEditarAberto(true)}
                      className="w-[27px] h-[27px] cursor-pointer"
                    />
                  )}
                  {logado && (
                    <img src="/verificado.png" className="w-[27px] h-[27px]" />
                  )}
                </div>
              </div>

              <div className="flex flex-row gap-[30px]">
                <div className="flex">
                  <img src="/Star 1.png" className="self-start w-[17px] h-[17px]" />
                  <p className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[19px] text-center font-[400]">{media} | {notas.length} reviews</p>
                </div>
                <p className="text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[19px] text-center cursor-pointer font-[400]">{produto?.categoria?.nome}</p>
                <p className="text-[#6A38F3] font-[family-name:var(--font-league-spartan)] text-[19px] text-center font-[400]">{produto?.estoque} disponíveis</p>
              </div>
              <h1 className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[40px] font-[400]">R${Number(produto?.preco).toFixed(2)}</h1>
              <div className="flex p-1 bg-[#C7C7C7] rounded w-10"></div>
              <p className="text-[#000000] py-[10px] font-[family-name:var(--font-league-spartan)] text-[13px] font-[300]">{produto?.descricao}</p>
            </div>
          </div>

          {/* Avaliações */}
          <div className="flex flex-col relative gap-[20px]">
            <CarrosselAvaliacoes
              avaliacoes={produto?.avaliacoes || []}
              usuarioLogadoId={usuarioId}
              onEditarAvaliacao={() => setModalEditarAberto(true)}
            />

            <h1 className="text-[#000000] font-[family-name:var(--font-league-spartan)] text-[41px] font-[400]">Da mesma loja</h1>
            <CarrosselProdutos produtos={produtosDaLoja} lojaId={lojaId} />
          </div>

        </div>
      </div>

      {modalEditarAberto && ehDonoDaLoja && (
        <ModalEditarProduto
          onClose={() => setModalEditarAberto(false)}
          produto={{
            nome: produto?.nome,
            preco: String(produto?.preco),
            img: produto?.imagens?.[0]?.url_imagem,
          }}
        />
      )}
    </div>
  )
}