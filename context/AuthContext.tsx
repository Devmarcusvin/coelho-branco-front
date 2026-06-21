"use client"
 
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
 
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
 
type Usuario = {
  id: number
  nome: string
  email: string
  foto_perfil_url?: string
}
 
type AuthContextType = {
  usuario: Usuario | null
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
}
 
const AuthContext = createContext<AuthContextType | null>(null)
 
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
 
  // Recupera usuário salvo ao recarregar a página
  useEffect(() => {
    const salvo = localStorage.getItem("usuario")
    if (salvo) setUsuario(JSON.parse(salvo))
  }, [])
 
  async function login(email: string, senha: string) {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    })
 
    if (!res.ok) throw new Error("Credenciais inválidas")
 
    const dados: Usuario = await res.json()
    setUsuario(dados)
    localStorage.setItem("usuario", JSON.stringify(dados))
  }
 
  function logout() {
    setUsuario(null)
    localStorage.removeItem("usuario")
  }
 
  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
 
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}