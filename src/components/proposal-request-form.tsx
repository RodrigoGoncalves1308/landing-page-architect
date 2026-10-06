import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitPedido } from "@/lib/proposals/proposals.functions";
import { pedidoInputSchema } from "@/lib/proposals/shared";

const newKey = () => crypto.randomUUID().replace(/-/g, "");

export function ProposalRequestForm() {
  const submit = useServerFn(submitPedido);
  const [values, setValues] = useState({ nome: "", email: "", pedido: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const key = useRef(newKey());
  const honeypot = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setFormError(null);
    const parsed = pedidoInputSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await submit({ data: { ...parsed.data, idempotencyKey: key.current, website: honeypot.current?.value ?? "", elapsedMs: Date.now() - startedAt.current } });
      if (res.ok) {
        setStatus("done");
        key.current = newKey();
      } else {
        setFormError(res.error);
        setStatus("idle");
      }
    } catch {
      setFormError("Não foi possível enviar o pedido. Verifique a ligação e tente novamente.");
      setStatus("idle");
    }
  };

  const field = (name: keyof typeof values) => ({
    id: `proposta-${name}`,
    value: values[name],
    onChange: (e: { target: { value: string } }) => setValues((v) => ({ ...v, [name]: e.target.value })),
    "aria-invalid": !!errors[name],
    disabled: status === "sending",
  });

  return (
    <section id="pedido-proposta" className="radio-band flex-col items-stretch">
      <div>
        <p className="section-kicker">Para marcas, espaços e artistas</p>
        <h2 className="mt-2 font-display text-3xl font-bold">Pedido de proposta</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Conte-nos o que precisa — playlists para eventos, curadoria musical, destaques editoriais ou sessões na Pulso 24.</p>
      </div>
      {status === "done" ? (
        <div className="flex items-start gap-3 rounded-md border border-border bg-card p-5" role="status">
          <CheckCircle2 className="mt-0.5 size-5 text-primary" />
          <div><p className="font-semibold">O seu pedido foi recebido com sucesso.</p><button type="button" className="mt-2 text-xs text-muted-foreground underline" onClick={() => { setValues({ nome: "", email: "", pedido: "" }); setStatus("idle"); startedAt.current = Date.now(); }}>Fazer outro pedido</button></div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="grid w-full max-w-2xl gap-4">
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5"><Label htmlFor="proposta-nome">Nome</Label><Input {...field("nome")} maxLength={120} autoComplete="name" required />{errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}</div>
            <div className="grid gap-1.5"><Label htmlFor="proposta-email">Email</Label><Input {...field("email")} type="email" maxLength={200} autoComplete="email" required />{errors.email && <p className="text-xs text-destructive">{errors.email}</p>}</div>
          </div>
          <div className="grid gap-1.5"><Label htmlFor="proposta-pedido">Pedido</Label><Textarea {...field("pedido")} rows={5} maxLength={3000} required placeholder="Ex.: Preciso de uma playlist editorial para o lançamento da nossa loja em Lisboa e de 2 horas de consultoria de curadoria musical." />{errors.pedido && <p className="text-xs text-destructive">{errors.pedido}</p>}</div>
          {formError && <p className="text-sm text-destructive" role="alert">{formError}</p>}
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" disabled={status === "sending"}><Send />{status === "sending" ? "A enviar…" : "Pedir proposta"}</Button>
            <p className="max-w-sm text-[11px] leading-4 text-muted-foreground">Os dados que indicar são usados apenas para analisar e responder ao seu pedido.</p>
          </div>
        </form>
      )}
    </section>
  );
}
