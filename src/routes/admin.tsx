import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AudioLines, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  adminAprovar, adminGuardarCatalogo, adminNotificar, adminOverview, adminPreview, adminReprocessar,
} from "@/lib/proposals/proposals.functions";
import {
  ESTADO_NOTIFICACAO_LABEL, ESTADO_PEDIDO_LABEL, formatDataHora, formatEur, UNIDADE_LABEL,
  type CatalogoItem, type EstadoPedido, type Unidade,
} from "@/lib/proposals/shared";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — Pulso" },
      { name: "description", content: "Área privada de pedidos e propostas Pulso." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Administração — Pulso" },
      { property: "og:description", content: "Área privada de pedidos e propostas Pulso." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Overview = Awaited<ReturnType<typeof adminOverview>>;
type PedidoRow = Overview["pedidos"][number];

function AdminPage() {
  const overviewFn = useServerFn(adminOverview);
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pedidos" | "catalogo">("pedidos");

  const token = useCallback(async () => "", []);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await overviewFn({ data: {} }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [overviewFn]);

  useEffect(() => { void load(); }, [load]);

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground md:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3 font-display text-xl font-bold"><span className="brand-mark"><AudioLines className="size-4" /></span>PULSO · Admin</Link>
        <Button variant="ghost" size="sm" onClick={load}><RefreshCw />Atualizar</Button>
      </header>
      <p className="mb-6 rounded-md border border-border bg-card px-4 py-3 text-sm">Modo de aula: as notificações são enviadas apenas para o email do aluno. Os clientes não recebem emails.</p>
      {error && <p className="mb-4 text-sm text-destructive" role="alert">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">A carregar…</p>}
      {data && (
        <>
          {data.emFalta.length > 0 && <p className="mb-4 rounded-md border border-destructive/50 px-4 py-3 text-sm">Configuração em falta para a notificação ao aluno: {data.emFalta.join(", ")}.</p>}
          <div className="mb-5 flex gap-2"><Button variant={tab === "pedidos" ? "default" : "ghost"} size="sm" onClick={() => setTab("pedidos")}>Pedidos</Button><Button variant={tab === "catalogo" ? "default" : "ghost"} size="sm" onClick={() => setTab("catalogo")}>Catálogo</Button></div>
          {tab === "pedidos" ? <Pedidos data={data} token={token} reload={load} /> : <Catalogo itens={data.catalogo} token={token} reload={load} />}
        </>
      )}
    </div>
  );
}

function Pedidos({ data, token, reload }: { data: Overview; token: () => Promise<string>; reload: () => Promise<void> }) {
  const [filtro, setFiltro] = useState<EstadoPedido | "todos">("todos");
  const [sel, setSel] = useState<string | null>(null);
  const propostas = useMemo(() => new Map(data.propostas.map((p) => [p.id, p])), [data.propostas]);
  const lista = data.pedidos.filter((p) => filtro === "todos" || p.estado === filtro);
  const atual = data.pedidos.find((p) => p.id === sel) ?? null;
  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <div>
        <select className="mb-3 rounded-md border border-border bg-card px-3 py-2 text-sm" value={filtro} onChange={(e) => setFiltro(e.target.value as EstadoPedido | "todos")} aria-label="Filtrar por estado">
          <option value="todos">Todos os estados</option>
          {Object.entries(ESTADO_PEDIDO_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="bg-card uppercase text-muted-foreground"><tr><th className="p-2">Data</th><th className="p-2">Nome</th><th className="p-2">Email do cliente</th><th className="p-2">Resumo</th><th className="p-2">Estado</th><th className="p-2">Valor</th><th className="p-2">Notificação ao aluno</th><th className="p-2">Proposta</th></tr></thead>
            <tbody className="divide-y divide-border">
              {lista.map((p) => {
                const prop = p.propostaId ? propostas.get(p.propostaId) : undefined;
                return (
                  <tr key={p.id} onClick={() => setSel(p.id)} className={`cursor-pointer hover:bg-accent ${sel === p.id ? "bg-accent" : ""}`}>
                    <td className="p-2 whitespace-nowrap">{formatDataHora(p.criadoEm)}</td><td className="p-2">{p.nome}</td><td className="p-2">{p.email}</td>
                    <td className="max-w-[220px] truncate p-2">{p.interpretacao?.resumo ?? p.pedido}</td><td className="p-2">{ESTADO_PEDIDO_LABEL[p.estado]}</td>
                    <td className="p-2">{prop ? formatEur(prop.totalCentimos) : "—"}</td><td className="p-2">{prop ? ESTADO_NOTIFICACAO_LABEL[prop.notificacao.estado] : "—"}</td>
                    <td className="p-2">{prop && <a href={`/proposta/${prop.token}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-primary">Abrir<ExternalLink className="size-3" /></a>}</td>
                  </tr>
                );
              })}
              {lista.length === 0 && <tr><td colSpan={8} className="p-4 text-center text-muted-foreground">Sem pedidos.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {atual && <Detalhe key={atual.id} pedido={atual} proposta={atual.propostaId ? propostas.get(atual.propostaId) : undefined} catalogo={data.catalogo} token={token} reload={reload} />}
    </div>
  );
}

function Detalhe({ pedido, proposta, catalogo, token, reload }: { pedido: PedidoRow; proposta?: Overview["propostas"][number] | undefined; catalogo: CatalogoItem[]; token: () => Promise<string>; reload: () => Promise<void> }) {
  const reprocess = useServerFn(adminReprocessar);
  const preview = useServerFn(adminPreview);
  const aprovar = useServerFn(adminAprovar);
  const notificar = useServerFn(adminNotificar);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [itens, setItens] = useState<{ catalogoId: string; quantidade: number }[]>(
    (pedido.interpretacao?.itens ?? []).filter((i) => catalogo.some((c) => c.id === i.catalogoId)).map((i) => ({ catalogoId: i.catalogoId, quantidade: i.quantidade ?? 1 })),
  );
  const [resumo, setResumo] = useState(pedido.interpretacao?.resumo ?? "");
  const [calc, setCalc] = useState<Awaited<ReturnType<typeof adminPreview>> | null>(null);

  const run = async (fn: () => Promise<unknown>, ok?: string) => {
    setBusy(true); setMsg(null);
    try { const r = await fn(); if (ok) setMsg(ok); if (r && typeof r === "object" && "erro" in r && r.erro) setMsg(String(r.erro)); await reload(); }
    catch (e) { setMsg(e instanceof Error ? e.message : "Erro."); }
    finally { setBusy(false); }
  };

  return (
    <aside className="space-y-4 rounded-md border border-border bg-card p-5 text-sm">
      <div><p className="section-kicker">{ESTADO_PEDIDO_LABEL[pedido.estado]}</p><h3 className="font-display text-lg font-bold">{pedido.nome}</h3><p className="text-muted-foreground">{pedido.email} · {formatDataHora(pedido.criadoEm)}</p></div>
      <div><p className="mb-1 font-semibold">Pedido original</p><p className="whitespace-pre-wrap rounded bg-muted p-3">{pedido.pedido}</p></div>
      {pedido.erro && <p className="text-destructive">Erro: {pedido.erro}</p>}
      {pedido.motivoRevisao && <p><span className="font-semibold">Motivo de revisão:</span> {pedido.motivoRevisao}</p>}
      {pedido.informacaoEmFalta?.length > 0 && <div><p className="font-semibold">Informação em falta</p><ul className="list-disc pl-5">{pedido.informacaoEmFalta.map((i) => <li key={i}>{i}</li>)}</ul></div>}
      {pedido.interpretacao && <details><summary className="cursor-pointer font-semibold">Interpretação estruturada da IA</summary><pre className="mt-2 max-h-72 overflow-auto rounded bg-muted p-3 text-[11px]">{JSON.stringify(pedido.interpretacao, null, 2)}</pre></details>}
      {(pedido.estado === "erro" || pedido.estado === "recebido" || pedido.estado === "em_analise") && <Button size="sm" disabled={busy} onClick={() => run(async () => reprocess({ data: { idToken: await token(), pedidoId: pedido.id } }), "Processamento repetido.")}><RefreshCw />Repetir processamento</Button>}

      {proposta ? (
        <div className="space-y-2 border-t border-border pt-4">
          <p className="font-semibold">Proposta {proposta.numero} · {formatEur(proposta.totalCentimos)} (sem IVA)</p>
          <p>Notificação ao aluno: <strong>{ESTADO_NOTIFICACAO_LABEL[proposta.notificacao.estado]}</strong>{proposta.notificacao.emailId && ` · ID ${proposta.notificacao.emailId}`}</p>
          {proposta.notificacao.erro && <p className="text-destructive">{proposta.notificacao.erro}</p>}
          {!proposta.link && <p className="text-muted-foreground">Falta configurar APP_BASE_URL para gerar o link público.</p>}
          <div className="flex flex-wrap gap-2">
            <a href={`/proposta/${proposta.token}`} target="_blank" rel="noreferrer"><Button size="sm" variant="pill"><ExternalLink />Abrir proposta</Button></a>
            {proposta.notificacao.estado !== "aceite" && <Button size="sm" disabled={busy} onClick={() => run(async () => notificar({ data: { idToken: await token(), propostaId: proposta.id } }))}>Reenviar notificação ao aluno</Button>}
          </div>
        </div>
      ) : (pedido.estado === "necessita_revisao" || pedido.estado === "erro") && (
        <div className="space-y-3 border-t border-border pt-4">
          <p className="font-semibold">Resolver revisão</p>
          <Textarea value={resumo} onChange={(e) => setResumo(e.target.value)} rows={2} placeholder="Resumo do âmbito" />
          {itens.map((it, i) => (
            <div key={i} className="flex gap-2">
              <select className="flex-1 rounded-md border border-border bg-background px-2 text-xs" value={it.catalogoId} onChange={(e) => setItens(itens.map((x, j) => j === i ? { ...x, catalogoId: e.target.value } : x))}>
                {catalogo.filter((c) => c.ativo).map((c) => <option key={c.id} value={c.id}>{c.nome} ({formatEur(c.precoUnitarioCentimos)}/{UNIDADE_LABEL[c.unidade]})</option>)}
              </select>
              <Input type="number" min={1} max={1000} className="w-20" value={it.quantidade} onChange={(e) => setItens(itens.map((x, j) => j === i ? { ...x, quantidade: Math.max(1, Math.floor(Number(e.target.value) || 1)) } : x))} />
              <Button size="sm" variant="ghost" onClick={() => setItens(itens.filter((_, j) => j !== i))}>Remover</Button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" onClick={() => { const c = catalogo.find((x) => x.ativo); if (c) setItens([...itens, { catalogoId: c.id, quantidade: 1 }]); }}>Adicionar item</Button>
            <Button size="sm" variant="pill" disabled={busy || !itens.length} onClick={async () => { setBusy(true); try { setCalc(await preview({ data: { idToken: await token(), pedidoId: pedido.id, itens } })); } catch (e) { setMsg(e instanceof Error ? e.message : "Erro."); } finally { setBusy(false); } }}>Recalcular</Button>
          </div>
          {calc && (calc.ok ? (
            <div className="rounded bg-muted p-3">
              {calc.linhas.map((l) => <p key={l.catalogoId}>{l.quantidade} × {l.nome} = {formatEur(l.subtotalCentimos)}</p>)}
              <p className="mt-1 font-semibold">Total sem IVA: {formatEur(calc.totalCentimos)}</p>
              <Button size="sm" className="mt-2" disabled={busy || !resumo.trim()} onClick={() => run(async () => aprovar({ data: { idToken: await token(), pedidoId: pedido.id, itens, resumo } }), "Proposta aprovada.")}>Aprovar proposta e notificar aluno</Button>
            </div>
          ) : <p className="text-destructive">{calc.motivo}</p>)}
        </div>
      )}
      {msg && <p className="text-muted-foreground" role="status">{msg}</p>}
    </aside>
  );
}

const vazio = { id: "", nome: "", descricao: "", unidade: "unidade" as Unidade, precoEuros: "0", ativo: true, condicoes: "", demonstracao: false };

function Catalogo({ itens, token, reload }: { itens: CatalogoItem[]; token: () => Promise<string>; reload: () => Promise<void> }) {
  const guardar = useServerFn(adminGuardarCatalogo);
  const [form, setForm] = useState(vazio);
  const [novo, setNovo] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const save = async (item = form, isNew = novo) => {
    setMsg(null);
    const cents = Math.round(Number(String(item.precoEuros).replace(",", ".")) * 100);
    if (!Number.isFinite(cents) || cents < 0) { setMsg("Preço inválido."); return; }
    try {
      const { precoEuros: _p, ...rest } = item;
      await guardar({ data: { idToken: await token(), novo: isNew, item: { ...rest, precoUnitarioCentimos: cents } } });
      setForm(vazio); setNovo(true); setMsg("Catálogo guardado."); await reload();
    } catch (e) { setMsg(e instanceof Error ? e.message : "Erro ao guardar."); }
  };
  const toForm = (c: CatalogoItem) => ({ ...c, precoEuros: (c.precoUnitarioCentimos / 100).toFixed(2) });
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="divide-y divide-border rounded-md border border-border">
        {itens.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
            <div><p className="font-semibold">{c.nome} {!c.ativo && <span className="text-xs text-muted-foreground">(inativo)</span>} {c.demonstracao && <span className="text-xs text-primary">· fictício</span>}</p><p className="text-xs text-muted-foreground">{c.id} · {formatEur(c.precoUnitarioCentimos)} / {UNIDADE_LABEL[c.unidade]}</p></div>
            <div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => { setForm(toForm(c)); setNovo(false); }}>Editar</Button><Button size="sm" variant="pill" onClick={() => save({ ...toForm(c), ativo: !c.ativo }, false)}>{c.ativo ? "Desativar" : "Ativar"}</Button></div>
          </div>
        ))}
      </div>
      <form className="space-y-2 rounded-md border border-border bg-card p-4 text-sm" onSubmit={(e) => { e.preventDefault(); void save(); }}>
        <p className="font-semibold">{novo ? "Novo item" : `Editar ${form.id}`}</p>
        <Input placeholder="identificador-unico" value={form.id} disabled={!novo} onChange={(e) => setForm({ ...form, id: e.target.value })} />
        <Input placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <Textarea placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        <div className="flex gap-2">
          <select className="rounded-md border border-border bg-background px-2" value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value as Unidade })}><option value="unidade">Unidade</option><option value="hora">Hora</option><option value="pacote">Pacote</option></select>
          <Input placeholder="Preço (€)" value={form.precoEuros} onChange={(e) => setForm({ ...form, precoEuros: e.target.value })} />
        </div>
        <Textarea placeholder="Condições e limitações" value={form.condicoes} onChange={(e) => setForm({ ...form, condicoes: e.target.value })} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} />Ativo</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.demonstracao} onChange={(e) => setForm({ ...form, demonstracao: e.target.checked })} />Preço fictício (demonstração)</label>
        <div className="flex gap-2"><Button type="submit" size="sm">Guardar</Button>{!novo && <Button type="button" size="sm" variant="ghost" onClick={() => { setForm(vazio); setNovo(true); }}>Cancelar</Button>}</div>
        {msg && <p className="text-muted-foreground">{msg}</p>}
      </form>
    </div>
  );
}
