import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { createDoc, getDoc, getServiceAccount, listDocs, updateDoc, FirestoreNotConfigured } from "./firestore.server";
import {
  baseUrl,
  configEmailEmFalta,
  criarProposta,
  getCatalogo,
  notificarAluno,
  nowIso,
  processarPedido,
  type Pedido,
  type Proposta,
} from "./pipeline.server";
import { calcularProposta, catalogoItemSchema, itemSelecionadoSchema, submitSchema } from "./shared";

/* ---------- public: submit ---------- */
const hits = new Map<string, number[]>(); // basic per-instance rate limit

export const submitPedido = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submitSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.website || data.elapsedMs < 2500) return { ok: false as const, error: "Não foi possível validar o envio. Tente novamente." };
    const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for")?.split(",")[0] ?? "anon";
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
    if (recent.length >= 5) return { ok: false as const, error: "Demasiados pedidos. Aguarde alguns minutos e tente novamente." };
    recent.push(now);
    hits.set(ip, recent);
    try {
      const ts = nowIso();
      const created = await createDoc("pedidos", data.idempotencyKey, {
        nome: data.nome, email: data.email, pedido: data.pedido, criadoEm: ts, atualizadoEm: ts,
        estado: "recebido", interpretacao: null, informacaoEmFalta: [], motivoRevisao: null, propostaId: null, erro: null,
      });
      if (created) await processarPedido(data.idempotencyKey); // saved first, then external services
      return { ok: true as const };
    } catch (e) {
      if (e instanceof FirestoreNotConfigured) return { ok: false as const, error: "O serviço de pedidos ainda não está configurado." };
      return { ok: false as const, error: "Não foi possível guardar o pedido. Tente novamente." };
    }
  });

/* ---------- public: proposal by token ---------- */
export const getPropostaPublica = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ token: z.string().regex(/^[A-Za-z0-9_-]{30,64}$/) }).parse(d))
  .handler(async ({ data }) => {
    const [p] = await listDocs<Proposta>("propostas", { where: ["token", data.token], limit: 1 });
    if (!p || Date.parse(p.validoAte) < Date.now()) return null;
    return {
      numero: p.numero, criadoEm: p.criadoEm, validoAte: p.validoAte, resumo: p.resumo, demonstracao: p.demonstracao,
      linhas: p.linhas.map((l) => ({ nome: l.nome, descricao: l.descricao, unidade: l.unidade, quantidade: l.quantidade, precoUnitarioCentimos: l.precoUnitarioCentimos, subtotalCentimos: l.subtotalCentimos })),
      totalCentimos: p.totalCentimos, condicoes: p.condicoes,
    };
  });

export const getFirebaseWebConfig = createServerFn({ method: "GET" }).handler(async () => {
  const sa = getServiceAccount();
  const apiKey = process.env["FIREBASE_WEB_API_KEY"];
  if (!sa || !apiKey) return null;
  return { apiKey, authDomain: `${sa.project_id}.firebaseapp.com`, projectId: sa.project_id };
});

/* ---------- admin (open access by owner's choice; reads/writes use the service account) ---------- */
async function requireAdmin(_idToken?: string) {
  if (!getServiceAccount()) throw new Error("FIREBASE_SERVICE_ACCOUNT não configurado.");
}

const auth = z.object({ idToken: z.string().max(5000).optional() });

export const adminOverview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => auth.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin(data.idToken);
    const [pedidos, propostas, catalogo] = await Promise.all([
      listDocs<Pedido>("pedidos", { orderBy: "criadoEm", limit: 200 }),
      listDocs<Proposta>("propostas", { limit: 300 }),
      getCatalogo(),
    ]);
    return { pedidos, propostas, catalogo, emFalta: configEmailEmFalta(), baseUrl: baseUrl() };
  });

export const adminReprocessar = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => auth.extend({ pedidoId: z.string().min(1).max(64) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin(data.idToken);
    await processarPedido(data.pedidoId);
    return { ok: true };
  });

const itensInput = auth.extend({ pedidoId: z.string().min(1).max(64), itens: z.array(itemSelecionadoSchema).min(1).max(20) });

export const adminPreview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => itensInput.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin(data.idToken);
    return calcularProposta(data.itens, await getCatalogo());
  });

export const adminAprovar = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => itensInput.extend({ resumo: z.string().trim().min(1).max(1000) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin(data.idToken);
    const pedido = await getDoc<Pedido>("pedidos", data.pedidoId);
    if (!pedido) throw new Error("Pedido não encontrado.");
    const calc = calcularProposta(data.itens, await getCatalogo());
    if (!calc.ok) throw new Error(calc.motivo);
    const prop = await criarProposta(pedido, calc.linhas, calc.totalCentimos, calc.demonstracao, data.resumo);
    return notificarAluno(prop.id);
  });

export const adminNotificar = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => auth.extend({ propostaId: z.string().min(1).max(64) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin(data.idToken);
    return notificarAluno(data.propostaId);
  });

export const adminGuardarCatalogo = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => auth.extend({ item: catalogoItemSchema, novo: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin(data.idToken);
    const { id, ...rest } = data.item;
    if (data.novo) {
      if (!(await createDoc("catalogo", id, { ...rest, moeda: "EUR" }))) throw new Error("Já existe um item com esse identificador.");
    } else {
      await updateDoc("catalogo", id, { ...rest, moeda: "EUR" });
    }
    return { ok: true };
  });
