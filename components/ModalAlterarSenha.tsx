import { useState } from "react";

interface ModalAlterarSenhaProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onSave?: (dados: { email: string; novaSenha: string }) => void;
}

export default function ModalAlterarSenha({
  isOpen,
  onClose,
  onBack,
  onSave,
}: ModalAlterarSenhaProps) {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  if (!isOpen) return null;

  function resetar() {
    setEmail("");
    setNovaSenha("");
    setConfirmarSenha("");
    setErro("");
  }

  function fechar() {
    resetar();
    onClose();
  }

  async function handleSalvar() {
    if (!email) {
      setErro("Digite seu email.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    setErro("");
    setCarregando(true);
    try {
      await onSave?.({ email, novaSenha });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/35 z-[1100]">
      <div className="relative bg-[#f0eff4] rounded-3xl px-10 pt-12 pb-10 w-[340px] flex flex-col items-center gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">

        {/* Botão voltar */}
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="absolute top-4 left-5 text-[28px] font-light text-[#333] leading-none cursor-pointer"
        >
          ‹
        </button>

        {/* Botão fechar */}
        <button
          onClick={fechar}
          aria-label="Fechar"
          className="absolute top-[18px] right-[22px] text-[18px] text-[#333] leading-none cursor-pointer"
        >
          ✕
        </button>

        {/* Ícone chave */}
        <div className="mt-2">
          <img src="/chave.png" alt="Chave" className="w-16 h-16 object-contain" />
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            className="w-full px-[18px] py-[14px] rounded-xl border-none text-[15px] text-gray-700 outline-none bg-white box-border shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            placeholder="Email cadastrado"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-[18px] py-[14px] rounded-xl border-none text-[15px] text-gray-700 outline-none bg-white box-border shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            placeholder="Nova Senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <input
            className="w-full px-[18px] py-[14px] rounded-xl border-none text-[15px] text-gray-700 outline-none bg-white box-border shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            placeholder="Confirmar Senha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          {erro && <p className="text-[#f43f5e] text-[13px] m-0 text-center">{erro}</p>}
        </div>

        <button
          onClick={handleSalvar}
          disabled={carregando}
          className="w-full py-[14px] rounded-3xl border-none  text-white text-[18px] hover:bg-[#5028C4] cursor-pointer bg-[#6A38F3] font-[family-name:var(--font-league-spartan)]"
        >
          {carregando ? "Salvando..." : "Salvar Senha"}
        </button>

      </div>
    </div>
  );
}