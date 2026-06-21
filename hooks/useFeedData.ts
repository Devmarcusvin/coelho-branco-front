import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface Categoria {
  id: number;
  label: string;
  icon: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  unidade?: string;
  disponivel: boolean;
  img: string;
  logo?: string;
}

interface Loja {
  id: number;
  nome: string;
  categoria: string;
  img: string;
}

export function useFeedData() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [produtosAvaliados, setProdutosAvaliados] = useState<Produto[]>([]);
  const [produtosBaratos, setProdutosBaratos] = useState<Produto[]>([]);
  const [produtosRecentes, setProdutosRecentes] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTudo() {
      try {
        // Busca lojas e categorias ao mesmo tempo
        const [resLojas, resCategorias] = await Promise.all([
          api.get("/lojas"),
          api.get("/categorias") 
        ]);

        const todasLojas = resLojas.data;
        setLojas(todasLojas);
        setCategorias(resCategorias.data);

        // Busca os produtos de todas as lojas
        const resultados = await Promise.all(
          todasLojas.map((loja: Loja) =>
            api.get(`/lojas/${loja.id}/produtos`).then(r => r.data)
          )
        );

        const todosProdutos: Produto[] = resultados.flat();

        const baratos = [...todosProdutos].sort((a, b) => a.preco - b.preco).slice(0, 10);
        const recentes = [...todosProdutos].sort((a, b) => b.id - a.id).slice(0, 10);
        const avaliados = todosProdutos.slice(0, 5);

        setProdutosBaratos(baratos);
        setProdutosRecentes(recentes);
        setProdutosAvaliados(avaliados);
      } catch (err) {
        console.error("Erro ao buscar dados do feed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTudo();
  }, []);

  return { categorias, lojas, produtosAvaliados, produtosBaratos, produtosRecentes, loading };
}