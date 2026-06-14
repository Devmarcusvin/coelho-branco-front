"use client"

import Link from "next/link"
import { FlaskConical, Home, ImageIcon, LogOut, UserRound } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

const navItems = [
  {
    href: "/",
    label: "Inicio",
    icon: Home,
  },
  {
    href: "/teste",
    label: "Teste",
    icon: FlaskConical,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isLogado, logout } = useAuth()

  function handleLogout(){
    logout();
    router.push('/login');
  }

  return (
    <aside className="flex min-h-dvh w-72 shrink-0 flex-col bg-black px-6 py-5 text-[#fffdf2] sticky top-0 h-screen">
      <Link href="/" className="mb-10 flex items-center gap-2" aria-label="Stock.io">
        <span className="text-4xl font-black leading-none tracking-normal text-[#fffdf2]">
          STOCK.IO
        </span>
        <span className="flex size-8 items-center justify-center rounded-md bg-[#d8f21f] text-black">
          <ImageIcon className="size-5 stroke-[3]" aria-hidden="true" />
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-3" aria-label="Rotas principais">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "h-12 justify-start gap-3 rounded-md px-4 text-base font-bold text-[#fffdf2] hover:bg-[#6d35ff] hover:text-white",
                isActive && "bg-[#6d35ff] text-white"
              )}
            >
              <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                <Icon className="size-5" aria-hidden="true" />
                {item.label}
              </Link>
            </Button>
          )
        })}
      </nav>

      <div className="flex items-center justify-between border-t border-white/15 pt-5">
        {isLogado ? (
          <>
            <Button
              asChild
              variant="ghost"
              size="icon-lg"
              className={cn(
                "text-[#6d35ff] hover:bg-white/10",
                pathname === '/perfil' && "bg-white/10"  // ativo na página de perfil
              )}
              aria-label="Perfil"
            >
              <Link href="/perfil">
                <UserRound className="size-7 fill-current stroke-[2.5]" />
              </Link>
            </Button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon-lg"
              className="text-[#ff1717] hover:bg-white/10"
              aria-label="Sair"
            >
              <LogOut className="size-7 stroke-[2.5]" />
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" className="text-[#fffdf2] hover:text-[#B3D101] font-[family-name:var(--font-league-spartan)] text-[17px] font-[600] text-[#FFFFFF]">
              <Link href="/login">LOGIN</Link>
            </Button>
            <Button asChild className="w-[140px] h-[30px] bg-[#6d35ff] hover:bg-[#5028C4] font-[family-name:var(--font-league-spartan)] text-[17px] font-[600] text-[#FFFFFF] rounded-[50px]">
              <Link href="/cadastro">CADASTRE-SE</Link>
            </Button>
          </>
        )}
      </div>
    </aside>
  )
}
