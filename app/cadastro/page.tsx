'use client';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-[#F6F3E4] min-h-screen flex overflow-hidden h-screen"> 

      <div className="bg-[#171918] w-[654px] rounded-t-[48px] flex justify-center items-start py-20 mt-[111px] ml-40">
        <div className="w-[504px] flex flex-col items-center gap-[29px]">
          
          <h1 className="text-[#F6F3E4] font-[family-name:var(--font-league-spartan)] text-[44px] font-extrabold m-0 mb-[27px] text-center">
            CRIE SUA CONTA
          </h1>
          
          <input 
            type="text" 
            placeholder="Nome Completo" 
            className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:border-[#6A38F3] focus:outline-2 focus:outline-[#6A38F3]"
          />
          
          <input 
            type="text" 
            placeholder="Username" 
            className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:border-[#6A38F3] focus:outline-2 focus:outline-[#6A38F3]"
          />
          
          <input 
            type="email" 
            placeholder="Email" 
            className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:border-[#6A38F3] focus:outline-2 focus:outline-[#6A38F3]"
          />
          
          <div className="relative">
            <input 
              type="password" 
              placeholder="Senha" 
              className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:border-[#6A38F3] focus:outline-2 focus:outline-[#6A38F3]"
            />
            <img 
              src="/iconamoon_eye-thin.svg" 
              alt="icone de olho" 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
            />
          </div>

          {/* COMENTÁRIO CORRIGIDO ABAIXO */}
          <div className="relative">
            <input 
              type="password" 
              placeholder="Confirmar Senha" 
              className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:border-[#6A38F3] focus:outline-2 focus:outline-[#6A38F3]"
            />
            <img 
              src="/iconamoon_eye-thin.svg" 
              alt="icone de olho" 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
            />
          </div>
          
          <button className="bg-[#6A38F3] h-[50px] w-[504px] rounded-[72px] text-[25px] font-semibold font-[family-name:var(--font-league-spartan)] text-white hover:bg-[#5028C4] transition-all duration-300 cursor-pointer">
            CRIAR CONTA
          </button>

          <div className="flex flex-row justify-start w-full gap-2">
            <p className="font-[family-name:var(--font-league-spartan)] text-[25px] font-[300] text-[#FFFFFF]">
              Já possui uma conta? 
            </p>
            <p onClick={() => router.push('/login')} className="font-[family-name:var(--font-league-spartan)] text-[25px] font-[400] text-[#6A38F3] cursor-pointer hover:underline">
              Login
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center relative right-[-20px]">
        <img src="/logo.svg" alt="Logo Stock.io" />
        <div className="h-screen overflow-hidden">
          <img src="/mascote.png" alt="Mascote da Stock.io" />
        </div>
      </div>

    </div>
  )
}