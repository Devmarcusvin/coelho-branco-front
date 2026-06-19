import { useState } from "react";

interface ModalAlterarSenhaProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onSave?: (dados: { senhaAntiga: string; novaSenha: string }) => void;
}

export default function ModalAlterarSenha({
  isOpen,
  onClose,
  onBack,
  onSave,
}: ModalAlterarSenhaProps) {
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setErro("");
    onSave?.({ senhaAntiga, novaSenha });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* Botão voltar */}
        <button style={styles.backBtn} onClick={onBack} aria-label="Voltar">
          ‹
        </button>

        {/* Botão fechar */}
        <button style={styles.closeBtn} onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        {/* Ícone chave */}
        <div style={styles.iconWrapper}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="22" r="14" stroke="#7c3aed" strokeWidth="5" fill="none"/>
            <line x1="31" y1="31" x2="54" y2="54" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round"/>
            <line x1="44" y1="44" x2="44" y2="54" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round"/>
            <line x1="50" y1="50" x2="54" y2="50" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Campos */}
        <div style={styles.fields}>
          <input
            style={styles.input}
            placeholder="Senha Antiga"
            type="password"
            value={senhaAntiga}
            onChange={(e) => setSenhaAntiga(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Nova Senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Confirmar Senha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          {erro && <p style={styles.erro}>{erro}</p>}
        </div>

        {/* Botão salvar */}
        <button style={styles.btnSave} onClick={handleSave}>
          Salvar Senha
        </button>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 1100,
  },
  modal: {
    position: "relative",
    background: "#f0eff4",
    borderRadius: 24,
    padding: "48px 40px 40px",
    width: 340,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 20,
    background: "none",
    border: "none",
    fontSize: 28,
    cursor: "pointer",
    color: "#333",
    lineHeight: 1,
    padding: 0,
    fontWeight: 300,
  },
  closeBtn: {
    position: "absolute",
    top: 18,
    right: 22,
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#333",
    lineHeight: 1,
    padding: 0,
  },
  iconWrapper: {
    marginTop: 8,
  },
  fields: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: "none",
    fontSize: 15,
    color: "#374151",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  erro: {
    color: "#f43f5e",
    fontSize: 13,
    margin: 0,
    textAlign: "center",
  },
  btnSave: {
    width: "100%",
    padding: "14px 0",
    borderRadius: 24,
    border: "none",
    background: "linear-gradient(90deg, #a855f7, #7c3aed)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: 0.3,
    boxShadow: "0 2px 12px rgba(168,85,247,0.35)",
    transition: "opacity 0.2s",
  },
};