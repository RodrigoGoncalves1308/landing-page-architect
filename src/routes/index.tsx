import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  AudioLines,
  ChevronDown,
  Disc3,
  Headphones,
  Heart,
  ListMusic,
  MapPin,
  Menu,
  Music2,
  Play,
  Radio,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/music-hero.jpg";
import cover1 from "@/assets/covers/cover-1.jpg";
import cover2 from "@/assets/covers/cover-2.jpg";
import cover3 from "@/assets/covers/cover-3.jpg";
import cover4 from "@/assets/covers/cover-4.jpg";
import cover5 from "@/assets/covers/cover-5.jpg";
import cover6 from "@/assets/covers/cover-6.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulso — A música certa, antes de toda a gente" },
      { name: "description", content: "Descobre lançamentos, tendências e artistas portugueses numa seleção editorial feita para o teu momento." },
      { property: "og:title", content: "Pulso — Descobre o que vem a seguir" },
      { property: "og:description", content: "A música nova que merece o teu tempo, selecionada todos os dias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const releases = [
  { title: "Entrelinhas", artist: "Mara", image: cover1, label: "Novo álbum" },
  { title: "Sons de Lisboa", artist: "Seleção Pulso", image: cover2, label: "Lista atualizada" },
  { title: "Sem Atalhos", artist: "Duarte", image: cover3, label: "Novo single" },
  { title: "Maré Cheia", artist: "Luz", image: cover4, label: "Em destaque" },
  { title: "Depois da Meia-Noite", artist: "Circuito", image: cover5, label: "Nova playlist" },
  { title: "Perto do Fogo", artist: "Íris", image: cover6, label: "Novo álbum" },
];

const features = [
  { icon: Sparkles, title: "Descoberta sem esforço", text: "Chega à música que interessa sem perder horas a procurar." },
  { icon: MapPin, title: "Portugal em primeiro plano", text: "O melhor da cena nacional ao lado dos grandes lançamentos globais." },
  { icon: TrendingUp, title: "O pulso do momento", text: "Sabe o que está a crescer antes de chegar a toda a gente." },
  { icon: AudioLines, title: "Som que se sente", text: "Seleções pensadas para experiências de áudio mais ricas e imersivas." },
];

const personas = [
  { icon: Headphones, role: "O explorador incansável", pain: "As recomendações repetem sempre o mesmo.", outcome: "Encontrar uma nova obsessão todos os dias." },
  { icon: Music2, role: "A voz da cultura", pain: "É difícil acompanhar tudo o que está a acontecer.", outcome: "Estar dentro da conversa, sem ruído." },
  { icon: Radio, role: "O ouvinte sem tempo", pain: "Escolher música tornou-se mais uma tarefa.", outcome: "Carregar no play e acertar à primeira." },
];

const faqs = [
  ["O que é o Pulso?", "Uma experiência editorial de descoberta musical que reúne lançamentos, tendências e seleções portuguesas num só lugar."],
  ["Preciso de criar conta para explorar?", "Não. Podes navegar pelas novidades livremente; a conta serve para guardar e personalizar a tua experiência."],
  ["Com que frequência chegam novidades?", "A seleção é revista todos os dias, com atualizações especiais às sextas-feiras de lançamentos."],
  ["Há música portuguesa?", "Sim. A cena nacional é parte central do Pulso, do pop ao rap, da eletrónica à música alternativa."],
  ["Como são escolhidas as recomendações?", "Combinamos curadoria editorial, sinais culturais e o teu gosto — sem transformar a descoberta numa lista previsível."],
  ["Posso ouvir no telemóvel e no computador?", "Sim. A experiência adapta-se ao ecrã e acompanha-te no navegador, no telemóvel ou no computador."],
  ["O Pulso funciona em Android?", "Sim. Não precisas de um dispositivo específico para descobrir e ouvir."],
  ["Consigo guardar músicas e listas?", "Sim. Ao iniciar sessão, podes guardar favoritos e regressar às tuas seleções."],
  ["O que são os tops por cidade?", "São retratos diários do que está a ser mais ouvido em cidades como Lisboa, Porto, Londres ou Nova Iorque."],
  ["Há entrevistas e conteúdos exclusivos?", "Sim. Encontras conversas com artistas, sessões especiais e histórias por trás dos lançamentos."],
  ["Posso cancelar quando quiser?", "Sim. Não existem compromissos longos; tens controlo sobre a tua subscrição a qualquer momento."],
];

function Logo() {
  return <a href="#top" className="flex items-center gap-2 font-display text-xl font-bold" aria-label="Pulso — início"><span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground"><AudioLines className="size-4" /></span>PULSO</a>;
}

function SectionHeading({ eyebrow, title, link }: { eyebrow: string; title: string; link?: string }) {
  return <div className="mb-7 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p><h2 className="font-display text-3xl font-bold md:text-5xl">{title}</h2></div>{link && <a className="hidden items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:flex" href="#novidades">{link}<ArrowRight className="size-4" /></a>}</div>;
}

function Index() {
  return (
    <main id="top" className="overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex" aria-label="Navegação principal">
            <a href="#novidades" className="hover:text-foreground">Novidades</a><a href="#para-ti" className="hover:text-foreground">Para ti</a><a href="#beneficios" className="hover:text-foreground">Porque Pulso</a><a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Pesquisar"><Search /></Button><Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu"><Menu /></Button><Button size="sm" className="hidden sm:inline-flex">Começar agora</Button></div>
        </div>
      </header>

      <section className="relative flex min-h-[92svh] items-end pt-24">
        <img src={heroImage} alt="Artista a atuar sob luzes vermelhas e azuis" width={1600} height={1000} className="absolute inset-0 size-full object-cover object-[68%_center]" />
        <div className="hero-scrim absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 lg:grid-cols-[1fr_.55fr] lg:px-8 lg:pb-24">
          <div className="max-w-3xl animate-reveal">
            <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-hero-muted"><span className="h-px w-8 bg-primary" /> Seleção atualizada hoje</div>
            <h1 className="font-display text-5xl font-bold leading-[.95] text-hero-foreground sm:text-7xl lg:text-8xl">A música certa,<br /><span className="text-primary">antes de toda a gente.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-hero-muted sm:text-lg">Descobre o que vem a seguir — escolhido por quem vive a música, atualizado todos os dias.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button variant="hero" size="hero"><Play className="fill-current" />Ouvir agora</Button><Button variant="heroOutline" size="hero" onClick={() => document.querySelector("#novidades")?.scrollIntoView({ behavior: "smooth" })}>Ver novidades<ArrowRight /></Button></div>
          </div>
          <div className="hidden self-end border-l border-hero-foreground/20 pl-6 text-hero-foreground lg:block"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Em destaque</p><p className="mt-3 font-display text-2xl font-bold">Perto do Fogo</p><p className="mt-1 text-sm text-hero-muted">Íris transforma vulnerabilidade em pop luminoso.</p></div>
        </div>
      </section>

      <section id="novidades" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <SectionHeading eyebrow="Acabado de chegar" title="Novidades da semana" link="Ver tudo" />
        <div className="no-scrollbar grid grid-flow-col auto-cols-[72%] gap-4 overflow-x-auto pb-4 sm:auto-cols-[38%] lg:grid-flow-row lg:grid-cols-6 lg:overflow-visible">
          {releases.map((item, index) => <article key={item.title} className="group min-w-0"><div className="relative aspect-square overflow-hidden rounded-md bg-card"><img src={item.image} alt={`Capa de ${item.title}`} loading="lazy" width={700} height={700} className="size-full object-cover transition duration-500 group-hover:scale-105" /><Button variant="hero" size="icon" aria-label={`Ouvir ${item.title}`} className="absolute bottom-3 right-3 translate-y-2 rounded-full opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"><Play className="fill-current" /></Button>{index < 2 && <span className="absolute left-3 top-3 rounded-sm bg-overlay px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-overlay-foreground">Novo</span>}</div><p className="mt-3 truncate font-semibold">{item.title}</p><p className="truncate text-sm text-muted-foreground">{item.artist}</p></article>)}
        </div>
      </section>

      <section className="border-y border-border bg-surface py-20 lg:py-28" id="para-ti">
        <div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionHeading eyebrow="Sem ruído. Só música." title="Feito para a forma como ouves" />
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">{personas.map(({ icon: Icon, role, pain, outcome }) => <article key={role} className="bg-surface p-7 lg:p-9"><div className="mb-10 grid size-11 place-items-center rounded-full bg-accent text-primary"><Icon className="size-5" /></div><h3 className="font-display text-2xl font-bold">{role}</h3><p className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Chega de</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{pain}</p><p className="mt-5 text-sm font-semibold uppercase tracking-wide text-primary">Quero</p><p className="mt-1 leading-6">{outcome}</p></article>)}</div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><SectionHeading eyebrow="A diferença está na seleção" title="Menos procura. Mais descoberta." />
        <div className="grid gap-5 sm:grid-cols-2">{features.map(({ icon: Icon, title, text }, i) => <article key={title} className="feature-panel group relative min-h-64 overflow-hidden rounded-md border border-border p-7 lg:p-9"><span className="absolute right-5 top-3 font-display text-7xl font-bold text-foreground/[.04]">0{i + 1}</span><Icon className="size-7 text-primary" /><h3 className="mt-16 font-display text-2xl font-bold">{title}</h3><p className="mt-3 max-w-md leading-7 text-muted-foreground">{text}</p></article>)}</div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground lg:py-20"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-center lg:px-8"><div><p className="text-xs font-bold uppercase tracking-widest opacity-70">O teu próximo som está aqui</p><h2 className="mt-3 max-w-2xl font-display text-4xl font-bold md:text-5xl">Carrega no play. Nós tratamos do resto.</h2></div><Button variant="secondary" size="hero" className="shrink-0">Começar a ouvir<ArrowRight /></Button></div></section>

      <section id="faq" className="mx-auto max-w-4xl px-5 py-20 lg:py-28"><SectionHeading eyebrow="Perguntas frequentes" title="Tudo o que precisas de saber" />
        <div className="divide-y divide-border border-y border-border">{faqs.map(([q, a], i) => <details key={q} className="faq-item group" open={i === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 font-semibold"><span>{q}</span><ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pb-6 leading-7 text-muted-foreground">{a}</p></details>)}</div>
      </section>

      <footer className="border-t border-border"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8"><Logo /><div className="flex flex-wrap gap-5 text-sm text-muted-foreground"><a href="#novidades">Novidades</a><a href="#beneficios">Porque Pulso</a><a href="#faq">FAQ</a></div><p className="text-xs text-muted-foreground">© 2026 Pulso</p></div></footer>
    </main>
  );
}