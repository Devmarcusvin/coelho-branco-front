"use client"

import { useState, useRef } from "react"
import { X, FileUp, ChevronDown } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

const CATEGORIAS = ["Moda", "Eletrônicos", "Beleza", "Casa", "Esportes", "Alimentos"]

// TODO: substituir por upload real para seu storage (Supabase, S3, etc.)
// Essa função deve receber o File e retornar a URL pública da imagem
async function uploadImagem(file: File): Promise<string> {
  // Placeholder — retorna um object URL local só pra não quebrar o fluxo
  return URL.createObjectURL(file)
}

export default function ModalAdicionarLoja({ onClose, usuarioId }: { onClose: () => void; usuarioId: number }) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [categoria, setCategoria] = useState("")
  const [categoriaAberta, setCategoriaAberta] = useState(false)

  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null)
  const [logo, setLogo] = useState<File | null>(null)
  const [banner, setBanner] = useState<File | null>(null)

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const fotoPerfilRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const bannerRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    setErro(null)

    if (!nome.trim()) {
      setErro("Nome da loja é obrigatório.")
      return
    }

    try {
      setCarregando(true)

      // Faz upload das imagens em paralelo (só as que foram selecionadas)
      const [logo_url, banner_url, sticker_url] = await Promise.all([
        logo ? uploadImagem(logo) : Promise.resolve(undefined),
        banner ? uploadImagem(banner) : Promise.resolve(undefined),
        fotoPerfil ? uploadImagem(fotoPerfil) : Promise.resolve(undefined),
      ])

      const response = await fetch(`${API_URL}/lojas/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioId,
          nome: nome.trim(),
          descricao: descricao.trim() || undefined,
          logo_url,
          banner_url,
          sticker_url,
        }),
      })

      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || "Erro ao criar loja.")
      }

      onClose()
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro inesperado.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div style={{ backgroundColor: "#EDEDED" }} className="rounded-2xl p-6 w-full max-w-md relative">

        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="size-5 text-gray-700" />
        </button>

        <h2 className="text-center font-black text-2xl mb-4">Adicionar loja</h2>

        {/* Nome */}
        <input
          type="text"
          placeholder="Nome da loja"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full bg-white rounded-xl px-4 py-3 mb-3 text-gray-700 outline-none border-none"
        />

        {/* Descrição */}
        <textarea
          placeholder="Descrição (opcional)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={2}
          className="w-full bg-white rounded-xl px-4 py-3 mb-3 text-gray-700 outline-none border-none resize-none"
        />

        {/* Categoria */}
        <div className="bg-white rounded-xl mb-3 overflow-hidden">
          <button
            type="button"
            onClick={() => setCategoriaAberta((open) => !open)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-700"
          >
            <span>{categoria || "Categoria"}</span>
            <ChevronDown className={`size-4 text-gray-500 transition-transform ${categoriaAberta ? "rotate-180" : ""}`} />
          </button>
          {categoriaAberta && (
            <div className="px-4 pb-3 flex flex-col gap-2">
              {CATEGORIAS.map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-[#6A38F3] cursor-pointer">
                  <input
                    type="radio"
                    name="categoria"
                    checked={categoria === cat}
                    onChange={() => { setCategoria(cat); setCategoriaAberta(false) }}
                    className="accent-[#6A38F3]"
                  />
                  {cat}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Foto de perfil (sticker_url) */}
        <UploadArea
          label="Anexe a foto de perfil de sua loja"
          arquivo={fotoPerfil}
          inputRef={fotoPerfilRef}
          accept="image/*"
          onChange={setFotoPerfil}
        />

        {/* Logo (logo_url) */}
        <UploadArea
          label="Anexe a logo em SVG de sua loja"
          arquivo={logo}
          inputRef={logoRef}
          accept=".svg,image/svg+xml"
          onChange={setLogo}
        />

        {/* Banner (banner_url) */}
        <UploadArea
          label="Anexe o banner de sua loja"
          arquivo={banner}
          inputRef={bannerRef}
          accept="image/*"
          onChange={setBanner}
        />

        {erro && <p className="text-red-500 text-sm mb-3 text-center">{erro}</p>}

        <button
          onClick={handleSubmit}
          disabled={carregando}
          style={{ backgroundColor: carregando ? "#a78bfa" : "#6A38F3" }}
          className="w-full text-white rounded-xl py-3 font-bold transition-colors disabled:cursor-not-allowed"
        >
          {carregando ? "Criando..." : "Adicionar"}
        </button>
      </div>
    </div>
  )
}

function UploadArea({
  label,
  arquivo,
  inputRef,
  accept,
  onChange,
}: {
  label: string
  arquivo: File | null
  inputRef: React.RefObject<HTMLInputElement>
  accept: string
  onChange: (file: File) => void
}) {
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed border-purple-500 rounded-xl p-6 mb-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-purple-50 transition-colors"
    >
      <FileUp className="size-9 text-[#6A38F3]" strokeWidth={2} />
      <span className="text-sm text-gray-500 mt-1">
        {arquivo ? arquivo.name : label}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f) }}
      />
    </div>
  )
}