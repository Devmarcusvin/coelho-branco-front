'use client';
import { useState } from "react";
import axios from "axios";
import api from "../services/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function Login(){
    setErro(null);
    if(!email || !senha){
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      const {data} = await api.post('/login', {
        email,
        senha,
      });

      localStorage.setItem('token', data.acess_token); //salva só o token
      router.push('/'); //colocar aqui para onde o usuario é redirecionado após login
    } catch(error) {
      if(axios.isAxiosError(error)){
        setErro("Email ou senha incorretos.");
      }else {
        setErro("Erro inesperado");
      }
  }
  }

  return (
    <div className="bg-[#F6F3E4] min-h-screen flex overflow-hidden h-screen">
      <div className="w-1/2 flex flex-col justify-center items-center">
        <img src="/logo.svg" alt="Logo Stock.io" />
        <div className="h-screen overflow-hidden">
          <img src="/Stockles - Mascote da Stock.io.png" alt="Mascote da Stock.io" />
        </div>
      </div>

      <div className="bg-[#171918] w-[654px] rounded-t-[48px] w-1/2 flex justify-center items-start py-20 mt-[111px]">
        <div className="w-[504px] flex flex-col items-center gap-[29px]">

          <h1 className="text-[#F6F3E4] font-[family-name:var(--font-league-spartan)] text-[44px] font-extrabold m-0 mb-[27px] text-center">
            BEM VINDO DE VOLTA!
          </h1>

          <input
            type="text" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && Login()}
            className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 
              placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:border-[#6A38F3] focus:outline-2 focus:outline-[#6A38F3]"
          />

          <div className="relative">
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && Login()}
              className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 
                placeholder:text-[25px] placeholder:font-[300] text-[25px] focus:border-[#6A38F3] focus:outline-2 focus:outline-[#6A38F3]"
            />
            {mostrarSenha ? (
              <img src="/icon_ocultar.png" onClick={() => setMostrarSenha(false)} alt="Ocultar senha"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer opacity-40" />
            ) : (
              <img src="/iconamoon_eye-thin.svg" onClick={() => setMostrarSenha(true)} alt="Mostrar senha"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer" />
            )}
          </div>

          {erro && (
            <p className="text-red-400 font-[family-name:var(--font-league-spartan)] text-[18px] text-center w-full">
              {erro} </p>
          )}

          <p className="text-[#FFFFFF] font-[family-name:var(--font-league-spartan)] text-[20px] underline text-center cursor-pointer font-[300]">
            Esqueceu sua senha?</p>

          <button
            onClick={Login}
            className="bg-[#6A38F3] h-[50px] w-[504px] rounded-[72px] text-[25px] font-semibold font-[family-name:var(--font-league-spartan)] hover:bg-[#5028C4] 
              transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">ENTRAR</button>

          <div className="flex flex-row justify-start w-full gap-2">
            <p className="font-[family-name:var(--font-league-spartan)] text-[25px] font-[300] text-[#FFFFFF]">Não possui uma conta?</p>
            <p onClick={() => router.push('/cadastro')} className="font-[family-name:var(--font-league-spartan)] text-[25px] font-[400] text-[#6A38F3] cursor-pointer hover:underline">
              Cadastre-se </p>
          </div>

        </div>
      </div>
    </div>
  );
}