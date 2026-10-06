import { createFileRoute, Link } from "@tanstack/react-router";
import { AudioLines } from "lucide-react";
import { getPropostaPublica } from "@/lib/proposals/proposals.functions";
import { formatData, formatEur, UNIDADE_LABEL } from "@/lib/proposals/shared";

export const Route = createFileRoute("/proposta/$token")({
  head: () => ({
    meta: [
      { title: "Proposta — Pulso" },
      { name: "description", content: "Proposta comercial Pulso." },
      { name: "robots", content: "noindex, nofollow" },
      { name: "referrer", content: "no-referrer" },
      { property: "og:title", content: "Proposta — Pulso" },
      { property: "og:description", content: "Proposta comercial Pulso." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ params }) => {
    if (!/^[A-Za-z0-9_-]{30,64}$/.test(params.token)) return null;
    try {
      return await getPropostaPublica({ data: { token: params.token } });
    } catch {
      return null;
    }
  },
  component: PropostaPage,
});

function PropostaPage() {
  const p = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background px-5 py-10 text-foreground md:px-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-10 flex items-center gap-3 font-display text-xl font-bold"><span className="brand-mark"><AudioLines className="size-4" /></span>PULSO</Link>
        {!p ? (
          <div className="rounded-md border border-border bg-card p-8"><h1 className="font-display text-2xl font-bold">Proposta indisponível</h1><p className="mt-2 text-sm text-muted-foreground">O link é inválido ou a proposta expirou.</p></div>
        ) : (
          <article className="space-y-8">
            {p.demonstracao && <p className="rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-sm">Proposta de demonstração: os preços apresentados são fictícios.</p>}
            <header>
              <p className="section-kicker">Proposta {p.numero}</p>
              <h1 className="mt-2 font-display text-3xl font-bold">A sua proposta Pulso</h1>
              <p className="mt-2 text-sm text-muted-foreground">Emitida a {formatData(p.criadoEm)} · Válida até {formatData(p.validoAte)}</p>
            </header>
            <section><h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Âmbito</h2><p className="leading-7">{p.resumo}</p></section>
            <section className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-card text-left text-xs uppercase text-muted-foreground"><tr><th className="p-3">Serviço</th><th className="p-3 text-right">Qtd.</th><th className="p-3 text-right">Preço unit.</th><th className="p-3 text-right">Subtotal</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {p.linhas.map((l) => (
                    <tr key={l.nome}><td className="p-3"><p className="font-semibold">{l.nome}</p><p className="text-xs text-muted-foreground">{l.descricao}</p></td><td className="p-3 text-right">{l.quantidade} {UNIDADE_LABEL[l.unidade]}{l.quantidade > 1 ? "s" : ""}</td><td className="p-3 text-right">{formatEur(l.precoUnitarioCentimos)}</td><td className="p-3 text-right">{formatEur(l.subtotalCentimos)}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between border-t border-border bg-card p-4"><span className="font-semibold">Total sem IVA</span><span className="font-display text-2xl font-bold text-primary">{formatEur(p.totalCentimos)}</span></div>
            </section>
            <section><h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Condições</h2><ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">{p.condicoes.map((c) => <li key={c}>{c}</li>)}</ul></section>
            <footer className="border-t border-border pt-6 text-sm text-muted-foreground">Pulso · Descoberta musical. Para esclarecimentos, use a opção “Agendar reunião” no site.</footer>
          </article>
        )}
      </div>
    </div>
  );
}
