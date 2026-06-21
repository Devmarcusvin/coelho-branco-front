"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { api } from "@/lib/api"

type Usuario = {
  id: number
  nome: string
  email: string
  foto_perfil_url?: string
}

type AuthContextType = {
  usuario: Usuario | null
  carregandoUsuario: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function getIdFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregandoUsuario, setCarregandoUsuario] = useState(true)

  // Restaura o usuário ao recarregar a página, a partir do token salvo
  useEffect(() => {
    async function restaurar() {
      const token = localStorage.getItem("token")
      if (!token) {
        setCarregandoUsuario(false)
        return
      }

      const id = getIdFromToken(token)
      if (!id) {
        setCarregandoUsuario(false)
        return
      }

      try {
        const { data } = await api.get(`/users/${id}`)
        setUsuario(data)
      } catch (e) {
        console.error("Erro ao restaurar usuário a partir do token:", e)
        localStorage.removeItem("token")
      } finally {
        setCarregandoUsuario(false)
      }
    }

    restaurar()
  }, [])

  async function login(email: string, senha: string) {
    const { data } = await api.post("/login", { email, senha })
    localStorage.setItem("token", data.access_token)

    const id = getIdFromToken(data.access_token)
    if (id) {
      const { data: dadosUsuario } = await api.get(`/users/${id}`)
      setUsuario(dadosUsuario)
    }
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ usuario, carregandoUsuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}