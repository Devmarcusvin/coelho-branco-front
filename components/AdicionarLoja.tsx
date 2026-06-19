"use client"

import { useState } from "react"
import { X, FileUp, ChevronDown } from "lucide-react"

export default function ModalAdicionarLoja({ onClose }: { onClose: () => void }) {
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")
  const [categoriaAberta, setCategoriaAberta] = useState(false)

  const CATEGORIAS = ["Moda", "Eletrônicos", "Beleza", "Casa", "Esportes", "Alimentos"]

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div style={{ backgroundColor: "#EDEDED" }} className="rounded-2xl p-6 w-full max-w-md relative">

        {/* Botão fechar */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="size-5 text-gray-700" />
        </button>

        <h2 className="text-center font-black text-2xl mb-4">Adicionar loja</h2>

        {/* Nome da loja */}
        <input
          type="text"
          placeholder="Nome da loja"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full bg-white rounded-xl px-4 py-3 mb-3 text-gray-700 outline-none border-none"
        />

        {/* Categoria */}
<div className="bg-white rounded-xl mb-3 overflow-hidden">
  <button
    type="button"
    onClick={() => setCategoriaAberta((open) => !open)}
    className="w-full flex items-center justify-between px-4 py-3 text-gray-700"
  >
    <span>{categoria || "Categoria"}</span>
    <ChevronDown
      className={`size-4 text-gray-500 transition-transform ${categoriaAberta ? "rotate-180" : ""}`}
    />
  </button>

  {categoriaAberta && (
    <div className="px-4 pb-3 flex flex-col gap-2">
      {CATEGORIAS.map((cat) => (
        <label key={cat} className="flex items-center gap-2 text-[#6A38F3] cursor-pointer">
          <input
            type="radio"
            name="categoria"
            checked={categoria === cat}
            onChange={() => {
              setCategoria(cat)
              setCategoriaAberta(false)
            }}
            className="accent-[#6A38F3]"
          />
          {cat}
        </label>
      ))}
    </div>
  )}
</div>
        {/* Foto de perfil */}
        <div className="border-2 border-dashed border-purple-500 rounded-xl p-6 mb-4 flex flex-col items-center justify-center gap-1">
          <FileUp className="size-9 text-[#6A38F3]" strokeWidth={2} />
          <span className="text-sm text-gray-500 mt-1">Anexe a foto de perfil de sua loja</span>
        </div>

        {/* Logo em SVG */}
        <div className="border-2 border-dashed border-purple-500 rounded-xl p-6 mb-4 flex flex-col items-center justify-center gap-1">
          <FileUp className="size-9 text-[#6A38F3]" strokeWidth={2} />
          <span className="text-sm text-gray-500 mt-1">Anexe a logo em SVG de sua loja</span>
        </div>

        {/* Banner */}
        <div className="border-2 border-dashed border-purple-500 rounded-xl p-6 mb-4 flex flex-col items-center justify-center gap-1">
          <FileUp className="size-9 text-[#6A38F3]" strokeWidth={2} />
          <span className="text-sm text-gray-500 mt-1">Anexe o banner de sua loja</span>
        </div>

        {/* Botão Adicionar */}
        <button 
          onClick={onClose}
          style={{ backgroundColor: "#6A38F3" }} 
          className="w-full text-white rounded-xl py-3 font-bold"
        >
          Adicionar
        </button>

      </div>
    </div>
  )
}