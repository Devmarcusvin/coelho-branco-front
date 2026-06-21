import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface Categoria {
  id: number;
  label: string;
  icon: string;
}

export interface ProdutoFeed {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  disponivel: boolean;
  img?: string;
  logo?: string;
  lojaId: number;
}

export interface LojaFeed {
  id: number;
  nome: string;
  categoria: string;
  img?: string;
}

interface CategoriaApi {
  id: number;
  nome: string;
  categoria_pai_id: number | null;
}

interface ProdutoApi {
  id: number;
  nome: string;
  preco: string | number;
  estoque: number;
  categoria_id: number;
  imagens?: { url_imagem: string }[];
  loja?: { logo_url?: string };
}

interface LojaApi {
  id: number;
  nome: string;
  logo_url?: string;
}

export function useFeedData() {
  const [categorias, setCategorias] = useState<CategoriaApi[]>([]);
  const [lojas, setLojas] = useState<LojaFeed[]>([]);
  const [produtosAvaliados, setProdutosAvaliados] = useState<ProdutoFeed[]>([]);
  const [produtosBaratos, setProdutosBaratos] = useState<ProdutoFeed[]>([]);
  const [produtosRecentes, setProdutosRecentes] = useState<ProdutoFeed[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function fetchTudo() {
      try {
     
        const [{ data: todasLojas }, { data: todasCategorias }] = await Promise.all([
          api.get<LojaApi[]>("/lojas"),
          api.get<CategoriaApi[]>("/categorias"),
        ]);

        if (!ativo) return;

        const categoriasPorId = new Map<number, CategoriaApi>(
          todasCategorias.map((categoria) => [categoria.id, categoria])
        );

        function categoriaDeTopo(categoriaId?: number): string {
          if (!categoriaId) return "Sem categoria";
          const categoria = categoriasPorId.get(categoriaId);
          if (!categoria) return "Sem categoria";
          if (!categoria.categoria_pai_id) return categoria.nome;
          const categoriaPai = categoriasPorId.get(categoria.categoria_pai_id);
          return categoriaPai?.nome ?? categoria.nome;
        }

        setCategorias(todasCategorias);

        const resultados = await Promise.all(
          todasLojas.map((loja) =>
            api
              .get<ProdutoApi[]>(`/lojas/${loja.id}/produtos`)
              .then((res) => ({ loja, produtos: res.data }))
              .catch(() => ({ loja, produtos: [] as ProdutoApi[] }))
          )
        );

        if (!ativo) return;

        const lojasComCategoria: LojaFeed[] = resultados.map(({ loja, produtos }) => {
          const primeiroProduto = produtos[0];
          return {
            id: loja.id,
            nome: loja.nome,
            img: loja.logo_url,
            categoria: categoriaDeTopo(primeiroProduto?.categoria_id),
          };
        });

        const todosProdutos: ProdutoFeed[] = resultados.flatMap(({ loja, produtos }) =>
          produtos.map((produto) => ({
            id: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco),
            estoque: produto.estoque,
            disponivel: produto.estoque > 0,
            img: produto.imagens?.[0]?.url_imagem,
            logo: produto.loja?.logo_url ?? loja.logo_url,
            lojaId: loja.id,
          }))
        );

        setLojas(lojasComCategoria);
        setProdutosBaratos([...todosProdutos].sort((a, b) => a.preco - b.preco).slice(0, 12));
        setProdutosRecentes([...todosProdutos].sort((a, b) => b.id - a.id).slice(0, 12));
        setProdutosAvaliados(todosProdutos.slice(0, 12));
      } catch (err) {
        console.error("Erro ao buscar dados do feed:", err);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    fetchTudo();
    return () => {
      ativo = false;
    };
  }, []);

  return { categorias, lojas, produtosAvaliados, produtosBaratos, produtosRecentes, loading };
}