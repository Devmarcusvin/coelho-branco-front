import { useState, useRef, useEffect } from "react";
import ModalAlterarSenha from "./ModalAlterarSenha";

interface ModalEditarPerfilProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    nome?: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
  };
  onSave?: (data: { nome: string; username: string; email: string; avatarUrl: string }) => void;
  onDeleteAccount?: () => void;
}

export default function ModalEditarPerfil({
  isOpen,
  onClose,
  initialData = {},
  onSave,
  onDeleteAccount,
}: ModalEditarPerfilProps) {
  const [nome, setNome] = useState(initialData.nome ?? "");
  const [username, setUsername] = useState(initialData.username ?? "");
  const [email, setEmail] = useState(initialData.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNome(initialData.nome ?? "");
      setUsername(initialData.username ?? "");
      setEmail(initialData.email ?? "");
      setAvatarUrl(initialData.avatarUrl ?? "");
      setAvatarFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = async () => {
    setSalvando(true);
    let fotoFinal = avatarUrl;

    try {
      const token = localStorage.getItem("token");
      const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
      const usuarioId = payload?.sub ?? null;

      if (avatarFile && usuarioId) {
        // Converte a foto para base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(avatarFile);
        });

        const response = await fetch(`http://localhost:3333/users/${usuarioId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ foto_perfil_url: base64 }),
        });

        if (!response.ok) throw new Error("Falha ao salvar foto");

        const data = await response.json();
        fotoFinal = data.foto_perfil_url;
      }

      onSave?.({ nome, username, email, avatarUrl: fotoFinal });
    } catch (err) {
      console.error("ERRO:", err);
      alert("Não foi possível salvar a foto. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            ✕
          </button>

          <div style={styles.avatarWrapper}>
            <div style={styles.avatarCircle}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarPlaceholder} />
              )}
            </div>
            <button
              style={styles.cameraBtn}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Alterar foto"
            >
              📷
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>

          <div style={styles.fields}>
            <input
              style={styles.input}
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.actions}>
            <button style={styles.btnOutlineRed} onClick={onDeleteAccount}>
              Deletar conta
            </button>
            <button style={styles.btnOutlinePurple} onClick={() => setModalSenha(true)}>
              Alterar senha
            </button>
            <button style={styles.btnSave} onClick={handleSave} disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>

      <ModalAlterarSenha
        isOpen={modalSenha}
        onClose={onClose}
        onBack={() => setModalSenha(false)}
        onSave={() => {
          setModalSenha(false);
          onClose();
        }}
      />
    </>
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
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    background: "#fff",
    borderRadius: 24,
    border: "2.5px solid #c084fc",
    padding: "56px 56px 44px",
    width: 560,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
    boxShadow: "0 8px 32px rgba(160,90,220,0.18)",
  },
  closeBtn: {
    position: "absolute",
    top: 18,
    right: 22,
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    color: "#555",
    lineHeight: 1,
    padding: 0,
  },
  avatarWrapper: {
    position: "relative",
    width: 120,
    height: 120,
    marginTop: 4,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    overflow: "hidden",
    border: "2px solid #e9d5ff",
    background: "#f3e8ff",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #d8b4fe, #a78bfa)",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: -4,
    background: "#fff",
    border: "1.5px solid #d8b4fe",
    borderRadius: "50%",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    cursor: "pointer",
    padding: 0,
  },
  fields: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 14,
    border: "1.5px solid #e5e7eb",
    fontSize: 16,
    color: "#374151",
    outline: "none",
    background: "#fafafa",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  actions: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  btnOutlineRed: {
    width: "100%",
    padding: "13px 0",
    borderRadius: 24,
    border: "1.5px solid #f43f5e",
    background: "transparent",
    color: "#f43f5e",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  btnOutlinePurple: {
    width: "100%",
    padding: "13px 0",
    borderRadius: 24,
    border: "1.5px solid #a855f7",
    background: "transparent",
    color: "#a855f7",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
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