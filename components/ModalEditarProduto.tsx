"use client"

import { useState, useRef } from "react"
import { X, Plus, Minus } from "lucide-react"

type ProdutoEdit = {
  nome?: string
  preco?: string
  img?: string
}

export default function ModalEditarProduto({
  onClose,
  produto,
}: {
  onClose: () => void
  produto?: ProdutoEdit
}) {
  const [quantidade, setQuantidade] = useState(3)
  const [nome, setNome] = useState(produto?.nome || "")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState(produto?.preco || "")
  const [fotos, setFotos] = useState<string[]>(produto?.img ? [produto.img] : [])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        setFotos((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const CameraIcon = ({ size = 52 }: { size?: number }) => (
    <div className="relative flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="#6A38F3">
        <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/>
        <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
      </svg>
      <span className="absolute bottom-0 right-0 bg-white rounded-full text-[#6A38F3] font-bold text-sm leading-none w-5 h-5 flex items-center justify-center">+</span>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div style={{ backgroundColor: "#EDEDED" }} className="rounded-2xl p-6 w-full max-w-md relative">

        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="size-5 text-gray-700" />
        </button>

        <h2 className="text-center font-black text-2xl mb-4">Editar Produto</h2>

        {/* Upload principal */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />

        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-purple-500 rounded-xl p-6 mb-2 flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <CameraIcon size={52} />
          <span className="text-sm text-gray-500 mt-1">Anexe as fotos do seu produto</span>
        </div>

        {/* Miniaturas */}
        <div className="flex gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              onClick={() => inputRef.current?.click()}
              className="flex-1 h-24 border-2 border-dashed border-purple-500 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
              style={{ backgroundColor: "#EDEDED" }}
            >
              {fotos[i] ? (
                <img src={fotos[i]} alt={`foto ${i + 1}`} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <CameraIcon size={36} />
              )}
            </div>
          ))}
        </div>

        {/* Nome */}
        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full bg-white rounded-xl px-4 py-3 mb-3 text-gray-700 outline-none border-none"
        />

        {/* Categoria */}
        <select className="w-full bg-white rounded-xl px-4 py-3 mb-3 text-gray-700 outline-none border-none">
          <option>Doce</option>
          <option>Salgado</option>
        </select>

        {/* Descrição */}
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full bg-white rounded-xl px-4 py-3 mb-3 text-gray-700 resize-none h-24 outline-none border-none"
        />

        {/* Preço */}
        <input
          type="text"
          placeholder="R$0,00"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="w-full bg-white rounded-xl px-4 py-3 mb-4 text-gray-700 outline-none border-none"
        />

        {/* Botão Deletar */}
        <button className="w-full bg-red-500 text-white rounded-xl py-3 mb-4 font-bold tracking-widest">
          DELETAR
        </button>

        {/* Contador */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <button
            onClick={() => setQuantidade((q) => Math.max(0, q - 1))}
            className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center"
          >
            <Minus className="size-4" />
          </button>
          <span className="text-xl font-bold">{quantidade}</span>
          <button
            onClick={() => setQuantidade((q) => q + 1)}
            className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {/* Botão Salvar */}
        <button style={{ backgroundColor: "#6A38F3" }} className="w-full text-white rounded-xl py-3 font-bold">
          Salvar
        </button>

      </div>
    </div>
  )
}