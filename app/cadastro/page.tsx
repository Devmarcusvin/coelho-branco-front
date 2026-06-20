"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setErro("");

    if (form.password !== form.confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      await axios.post("http://localhost:3333/users", {
        name: form.name,
        username: form.username,
        email: form.email,
        senha: form.password,
      });

      setSucesso(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao cadastrar. Tente novamente.";
      setErro(msg);
    }
  }

  return (
    <div className="bg-[#F6F3E4] min-h-screen flex overflow-hidden h-screen">
      <div className="bg-[#171918] w-[654px] rounded-t-[48px] flex justify-center items-start py-20 mt-[111px] ml-40">
        <div className="w-[504px] flex flex-col items-center gap-[29px]">
          <h1 className="text-[#F6F3E4] font-[family-name:var(--font-league-spartan)] text-[44px] font-extrabold m-0 mb-[27px] text-center">
            CRIE SUA CONTA
          </h1>

          <input name="name" type="text" placeholder="Nome Completo" value={form.name} onChange={handleChange}
            className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:outline-2 focus:outline-[#6A38F3]"
          />

          <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange}
            className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:outline-2 focus:outline-[#6A38F3]"
          />

          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:outline-2 focus:outline-[#6A38F3]"
          />

          <div className="relative">
            <input name="password" type={showSenha ? "text" : "password"} placeholder="Senha" value={form.password} onChange={handleChange}
              className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:outline-2 focus:outline-[#6A38F3]"
            />
            <img src="/iconamoon_eye-thin.svg" alt="mostrar senha" onClick={() => setShowSenha(!showSenha)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
            />
          </div>

          <div className="relative">
            <input name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Confirmar Senha" value={form.confirmPassword} onChange={handleChange}
              className="bg-[#F6F3E4] h-[46px] w-[504px] text-[#171918] placeholder:text-[#858585] font-[family-name:var(--font-league-spartan)] rounded-[72px] pl-7 placeholder:text-[25px] text-[25px] placeholder:font-[300] focus:outline-2 focus:outline-[#6A38F3]"
            />
            <img src="/iconamoon_eye-thin.svg" alt="mostrar senha" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
            />
          </div>

          {erro && <p className="text-red-500 text-[18px]">{erro}</p>}
          {sucesso && <p className="text-green-400 text-[18px]">Cadastro realizado! Redirecionando...</p>}

          <button onClick={handleSubmit}
            className="bg-[#6A38F3] h-[50px] w-[504px] rounded-[72px] text-[25px] font-semibold font-[family-name:var(--font-league-spartan)] text-white hover:bg-[#5028C4] transition-all duration-300 cursor-pointer">
            CADASTRAR
          </button>

          <div className="flex flex-row justify-start w-full gap-2">
            <p className="font-[family-name:var(--font-league-spartan)] text-[25px] font-[300] text-[#FFFFFF]">Já possui uma conta?</p>
            <p onClick={() => router.push("/login")} className="font-[family-name:var(--font-league-spartan)] text-[25px] font-[400] text-[#6A38F3] cursor-pointer hover:underline">Login</p>
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
  );
}