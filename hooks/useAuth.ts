import { useEffect, useState } from "react";

export function useAuth() {
  const [isLogado, setIsLogado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogado(!!token);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    setIsLogado(false);
  }

  return { isLogado, logout };
}
