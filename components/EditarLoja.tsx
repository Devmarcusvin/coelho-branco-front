"use client"

import { useState } from "react"
import { X, FileUp, ChevronDown } from "lucide-react"

interface ModalEditarLojaProps {
  onClose: () => void
  lojaInicial?: {
    nome: string
    categoria: string
  }
}

const CATEGORIAS = ["Mercado", "Farmácia", "Beleza", "Moda", "Eletrônico", "Jogos", "Brinquedos", "Casa"]

export default function ModalEditarLoja({ onClose, lojaInicial }: ModalEditarLojaProps) {
  const [nome, setNome] = useState(lojaInicial?.nome || "")
  const [categoria, setCategoria] = useState(lojaInicial?.categoria || "")
  const [categoriaAberta, setCategoriaAberta] = useState(false)

  const FileIcon = () => (
    <FileUp className="size-9 text-[#6A38F3]" strokeWidth={2} />
  )

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div style={{ backgroundColor: "#EDEDED" }} className="rounded-2xl p-6 w-full max-w-md relative">

        {/* Botão fechar */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="size-5 text-gray-700" />
        </button>

        <h2 className="text-center font-black text-2xl mb-4">Editar loja</h2>

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
          <FileIcon />
          <span className="text-sm text-gray-500 mt-1">Anexe a foto de perfil de sua loja</span>
        </div>

        {/* Logo em SVG */}
        <div className="border-2 border-dashed border-purple-500 rounded-xl p-6 mb-4 flex flex-col items-center justify-center gap-1">
          <FileIcon />
          <span className="text-sm text-gray-500 mt-1">Anexe a logo em SVG de sua loja</span>
        </div>

        {/* Banner */}
        <div className="border-2 border-dashed border-purple-500 rounded-xl p-6 mb-4 flex flex-col items-center justify-center gap-1">
          <FileIcon />
          <span className="text-sm text-gray-500 mt-1">Anexe o banner de sua loja</span>
        </div>

        {/* Botão Deletar */}
        <button className="w-full bg-red-500 text-white rounded-xl py-3 mb-4 font-bold tracking-widest">
          DELETAR
        </button>

        {/* Botão Salvar */}
        <button
          onClick={onClose}
          style={{ backgroundColor: "#6A38F3" }}
          className="w-full text-white rounded-xl py-3 font-bold"
        >
          Salvar
        </button>

      </div>
    </div>
  )
}