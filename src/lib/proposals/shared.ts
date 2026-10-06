// Client-safe shared types, validation and pure calculation logic.
import { z } from "zod";

export const BUSINESS_NAME = "Pulso";

export const pedidoInputSchema = z.object({
  nome: z.string().trim().min(1, "Indique o seu nome.").max(120, "O nome é demasiado longo."),
  email: z.string().trim().min(1, "Indique o seu email.").max(200, "O email é demasiado longo.").email("Indique um email válido."),
  pedido: z.string().trim().min(10, "Descreva o pedido com pelo menos 10 caracteres.").max(3000, "O pedido não pode ter mais de 3000 caracteres."),
});

export const submitSchema = pedidoInputSchema.extend({
  idempotencyKey: z.string().regex(/^[a-zA-Z0-9_-]{16,64}$/),
  website: z.string().max(200).optional().default(""), // honeypot
  elapsedMs: z.number().int().min(0).max(86_400_000),
});

export type Unidade = "unidade" | "hora" | "pacote";

export type CatalogoItem = {
  id: string;
  nome: string;
  descricao: string;
  unidade: Unidade;
  precoUnitarioCentimos: number;
  moeda: "EUR";
  ativo: boolean;
  condicoes: string;
  demonstracao: boolean;
};

export const catalogoItemSchema = z.object({
  id: z.string().trim().regex(/^[a-z0-9-]{3,60}$/, "Use letras minúsculas, números e hífenes."),
  nome: z.string().trim().min(1).max(120),
  descricao: z.string().trim().max(600),
  unidade: z.enum(["unidade", "hora", "pacote"]),
  precoUnitarioCentimos: z.number().int().min(0).max(100_000_000),
  ativo: z.boolean(),
  condicoes: z.string().trim().max(600),
  demonstracao: z.boolean(),
});

export const itemSelecionadoSchema = z.object({
  catalogoId: z.string().min(1).max(60),
  quantidade: z.number().int().min(1).max(1000),
});

export type EstadoPedido = "recebido" | "em_analise" | "necessita_revisao" | "proposta_criada" | "erro";
export type EstadoNotificacao = "por_enviar" | "a_enviar" | "aceite" | "falhou" | "nao_configurado";

export const ESTADO_PEDIDO_LABEL: Record<EstadoPedido, string> = {
  recebido: "Recebido",
  em_analise: "Em análise",
  necessita_revisao: "Necessita de revisão",
  proposta_criada: "Proposta criada",
  erro: "Erro",
};

export const ESTADO_NOTIFICACAO_LABEL: Record<EstadoNotificacao, string> = {
  por_enviar: "Por enviar",
  a_enviar: "A enviar",
  aceite: "Aceite pelo serviço",
  falhou: "Falhou",
  nao_configurado: "Não configurado",
};

export type LinhaProposta = {
  catalogoId: string;
  nome: string;
  descricao: string;
  unidade: Unidade;
  condicoes: string;
  quantidade: number;
  precoUnitarioCentimos: number;
  subtotalCentimos: number;
  demonstracao: boolean;
};

export type CalculoResultado =
  | { ok: true; linhas: LinhaProposta[]; totalCentimos: number; demonstracao: boolean }
  | { ok: false; motivo: string };

/** The AI never prices: prices always come from the catalogue, totals from this code. */
export function calcularProposta(
  itens: { catalogoId: string; quantidade: number | null }[],
  catalogo: CatalogoItem[],
): CalculoResultado {
  if (itens.length === 0) return { ok: false, motivo: "Nenhum item do catálogo identificado." };
  const vistos = new Set<string>();
  const linhas: LinhaProposta[] = [];
  for (const item of itens) {
    const c = catalogo.find((x) => x.id === item.catalogoId);
    if (!c) return { ok: false, motivo: `Item inexistente no catálogo: ${item.catalogoId}.` };
    if (!c.ativo) return { ok: false, motivo: `Item inativo: ${c.nome}.` };
    if (vistos.has(c.id)) return { ok: false, motivo: `Item repetido: ${c.nome}.` };
    vistos.add(c.id);
    const q = item.quantidade;
    if (q === null || !Number.isInteger(q) || q < 1 || q > 1000) {
      return { ok: false, motivo: `Quantidade em falta ou inválida para ${c.nome}.` };
    }
    if (!Number.isInteger(c.precoUnitarioCentimos) || c.precoUnitarioCentimos < 0) {
      return { ok: false, motivo: `Preço inválido no catálogo para ${c.nome}.` };
    }
    linhas.push({
      catalogoId: c.id,
      nome: c.nome,
      descricao: c.descricao,
      unidade: c.unidade,
      condicoes: c.condicoes,
      quantidade: q,
      precoUnitarioCentimos: c.precoUnitarioCentimos,
      subtotalCentimos: Math.round(q * c.precoUnitarioCentimos),
      demonstracao: c.demonstracao,
    });
  }
  const totalCentimos = linhas.reduce((s, l) => s + l.subtotalCentimos, 0);
  return { ok: true, linhas, totalCentimos, demonstracao: linhas.some((l) => l.demonstracao) };
}

const eur = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });
export const formatEur = (centimos: number) => eur.format(centimos / 100);
export const formatData = (iso: string) =>
  new Intl.DateTimeFormat("pt-PT", { dateStyle: "long", timeZone: "Europe/Lisbon" }).format(new Date(iso));
export const formatDataHora = (iso: string) =>
  new Intl.DateTimeFormat("pt-PT", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Lisbon" }).format(new Date(iso));

export const UNIDADE_LABEL: Record<Unidade, string> = { unidade: "unidade", hora: "hora", pacote: "pacote" };

export const CATALOGO_DEMO: Omit<CatalogoItem, "moeda">[] = [
  { id: "playlist-evento", nome: "Playlist editorial para evento", descricao: "Seleção musical curada pela redação Pulso para um evento (até 4 horas de música).", unidade: "pacote", precoUnitarioCentimos: 15000, ativo: true, condicoes: "Inclui uma ronda de ajustes. Preço fictício de demonstração.", demonstracao: true },
  { id: "curadoria-espaco", nome: "Consultoria de curadoria musical", descricao: "Sessão de consultoria para definir a identidade sonora de um espaço comercial.", unidade: "hora", precoUnitarioCentimos: 6000, ativo: true, condicoes: "Mínimo de 1 hora. Preço fictício de demonstração.", demonstracao: true },
  { id: "destaque-lancamento", nome: "Destaque de lançamento", descricao: "Destaque editorial de um lançamento nas Novidades do Pulso durante 7 dias.", unidade: "pacote", precoUnitarioCentimos: 25000, ativo: true, condicoes: "Sujeito a aprovação editorial. Preço fictício de demonstração.", demonstracao: true },
  { id: "artigo-editorial", nome: "Artigo editorial sobre artista", descricao: "Artigo de fundo escrito pela redação sobre um artista ou projeto musical.", unidade: "unidade", precoUnitarioCentimos: 18000, ativo: true, condicoes: "Até 1200 palavras. Preço fictício de demonstração.", demonstracao: true },
  { id: "sessao-pulso24", nome: "Sessão ao vivo na Pulso 24", descricao: "Hora de emissão dedicada na rádio Pulso 24 com conversa e estreias.", unidade: "hora", precoUnitarioCentimos: 9000, ativo: true, condicoes: "Agendamento conforme disponibilidade. Preço fictício de demonstração.", demonstracao: true },
];
