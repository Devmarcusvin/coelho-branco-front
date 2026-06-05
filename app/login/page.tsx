'use client';
import { useState } from "react"

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-[#F6F3E4] min-h-screen flex overflow-hidden h-screen">
      <div className="w-1/2 flex flex-col justify-center items-center">
        <img src="/logo.svg" alt="Logo Stock.io" />
        <div className="h-screen overflow-hidden ">
          <img src="/Stockles - Mascote da Stock.io.png" alt="Mascote da Stock.io" />
        </div>
      </div>

      <div className="bg-[#171918] w-[654px] rounded-t-[48px] w-1/2 flex justify-center items-start py-20 mt-[111px]">
        <div className="w-[504px] flex flex-col items-center gap-[29px]">

          <h1 className="text-[#F6F3E4] font-[family-name:var(--font-league-spartan)] text-[44px] font-extrabold m-0 mb-[27px] text-center">BEM VINDO DE VOLTA!</h1>

          <input type="text" placeholder="Email"
            className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 
        placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:border-[#6A38F3] focus:outline-2 focus:outline-[#6A38F3]"></input>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 
    placeholder:text-[25px] placeholder:font-[300] text-[25px] focus:border-[#6A38F3] focus:outline-2 focus:outline-[#6A38F3]"
            />
            {showPassword ? (
              <img src="/icon_ocultar.png" onClick={() => setShowPassword(false)} alt="Ocultar senha" className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 
              cursor-pointer opacity-40"/>
          ) : (
              <img src="/iconamoon_eye-thin.svg" onClick={() => setShowPassword(true)} alt="Mostrar senha" className="absolute right-4 top-1/2 -translate-y-1/2 w-6 
              h-6 cursor-pointer"/>
            )}
          </div>

          <p className="text-[#FFFFFF] font-[family-name:var(--font-league-spartan)] text-[20px] underline text-center cursor-pointer font-[300]">Esqueceu sua senha?</p>

          <button className="bg-[#6A38F3] h-[50px] w-[504px] rounded-[72px] text-[25px] font-semibold font-[family-name:var(--font-league-spartan)] hover:bg-[#5028C4] 
        transition-all duration-300 cursor-pointer">ENTRAR</button>

          <div className="flex flex-row justify-start w-full gap-2">
            <p className="font-[family-name:var(--font-league-spartan)] text-[25px] font-[300] text-[#FFFFFF]">Não possui uma conta? </p>

            <p className="font-[family-name:var(--font-league-spartan)] text-[25px] font-[400] text-[#6A38F3] cursor-pointer hover:underline"> Cadastre-se</p>
          </div>
        </div>
      </div>
    </div>


  );
}