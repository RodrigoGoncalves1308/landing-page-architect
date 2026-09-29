import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import {
  AudioLines,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Compass,
  Heart,
  Home,
  ListMusic,
  Menu,
  MoreHorizontal,
  Pause,
  Play,
  Radio,
  Search,
  SkipBack,
  SkipForward,
  Sparkles,
  UserRound,
  Volume2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PulsoChat } from "@/components/pulso-chat";

const cover1 = "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7a/02/38/7a0238c7-5888-46aa-72c7-8f4236a890de/196871619080.jpg/1000x1000bb.jpg";
const cover2 = "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1e/39/c2/1e39c29d-9129-991a-0b32-8fede26df26f/24UMGIM10342.rgb.jpg/1000x1000bb.jpg";
const cover3 = "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/93/47/f1/9347f1dc-484a-8c58-0d8e-0df401e2c78b/196589584373.jpg/1000x1000bb.jpg";
const cover4 = "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c2/f7/6d/c2f76d94-b187-65d9-65bf-9b12178853f5/196589909015.jpg/1000x1000bb.jpg";
const cover5 = "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b3/eb/fa/b3ebfa2e-8c04-f793-d4a1-53d385b8c197/886449544158.jpg/1000x1000bb.jpg";
const cover6 = "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/17/48/02/17480291-f01b-7201-5351-92d6f8425f75/196871830508.jpg/1000x1000bb.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulso — Novidades e descoberta musical" },
      { name: "description", content: "Descobre lançamentos, tendências e artistas portugueses numa seleção editorial atualizada todos os dias." },
      { property: "og:title", content: "Pulso — O que vais ouvir a seguir" },
      { property: "og:description", content: "Música nova, histórias e seleções portuguesas num só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tracks = [
  { title: 'Tata', artist: 'Slow J', image: cover1 },
  { title: 'Chamadas', artist: 'Ivandro', image: cover2 },
  { title: 'Andorinhas', artist: 'Ana Moura', image: cover3 },
  { title: 'hortelã', artist: 'MARO', image: cover4 },
  { title: 'Esquinas', artist: 'Dino D Santiago', image: cover5 },
  { title: 'Alô', artist: 'Dillaz', image: cover6 },
  { title: 'Sem Ti', artist: 'Slow J', image: cover1 },
  { title: 'Lua', artist: 'Ivandro', image: cover2 },
];

const releases = [
  { title: 'Afro Fado', artist: 'Slow J', image: cover1, tag: 'Novo álbum' },
  { title: 'Trovador', artist: 'Ivandro', image: cover2, tag: 'Álbum de estreia' },
  { title: 'Casa Guilhermina', artist: 'Ana Moura', image: cover3, tag: 'Novo álbum' },
  { title: 'hortelã', artist: 'MARO', image: cover4, tag: 'Novo álbum' },
  { title: 'BADIU', artist: 'Dino D Santiago', image: cover5, tag: 'Destaque' },
  { title: 'O Próprio', artist: 'Dillaz', image: cover6, tag: 'Novo álbum' },
];

const faqs = [
  ["O que é o Pulso?", "Uma experiência editorial que reúne lançamentos, tendências e música portuguesa num só lugar."],
  ["Preciso de criar conta?", "Não. Podes explorar livremente; a conta permite guardar favoritos e personalizar a experiência."],
  ["Com que frequência há novidades?", "A seleção é revista diariamente, com uma edição especial todas as sextas-feiras."],
  ["Há música portuguesa?", "Sim. A cena nacional está no centro do Pulso, do pop ao rap e da eletrónica à alternativa."],
];

const CalEmbed = lazy(() => import("@calcom/embed-react"));

function ScheduleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-200 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Agendar reunião"
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-overlay backdrop-blur-md" onClick={onClose} />
      <div className={`relative flex h-[min(44rem,calc(100dvh-4rem))] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-transform duration-200 ${open ? "scale-100" : "scale-95"}`}>
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <p className="flex items-center gap-2 font-display text-sm font-bold"><CalendarDays className="size-4 text-primary" />Agendar reunião</p>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Fechar"><X /></Button>
        </div>
        <div className="min-h-0 flex-1">
          {open && (
            <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">A carregar o calendário…</div>}>
              <CalEmbed
                calLink="rodrigo-goncalves-ust63q"
                config={{ theme: "dark" }}
                style={{ width: "100%", height: "100%", overflow: "auto" }}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <a href="#inicio" className="flex items-center gap-3 font-display text-xl font-bold" aria-label="Pulso — início">
      <span className="brand-mark"><AudioLines className="size-4" /></span>
      PULSO
    </a>
  );
}

function Sidebar() {
  const links = [
    { href: "#inicio", label: "Início", icon: Home },
    { href: "#novidades", label: "Novidades", icon: Sparkles, active: true },
    { href: "#para-ti", label: "Para ti", icon: Compass },
    { href: "#radio", label: "Rádio", icon: Radio },
  ];
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="px-7 py-8"><Brand /></div>
      <nav className="flex-1 space-y-1 px-4" aria-label="Navegação principal">
        {links.map(({ href, label, icon: Icon, active }) => (
          <a key={label} href={href} className={`nav-item ${active ? "nav-item-active" : ""}`}>
            <Icon className="size-[18px]" /><span>{label}</span>
          </a>
        ))}
        <p className="px-3 pb-2 pt-8 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">A tua música</p>
        <a href="#favoritos" className="nav-item"><Heart className="size-[18px]" /><span>Favoritos</span></a>
        <a href="#listas" className="nav-item"><ListMusic className="size-[18px]" /><span>Listas</span></a>
      </nav>
      <div className="border-t border-border p-4">
        <Button className="w-full">Iniciar sessão</Button>
        <p className="mt-3 text-center text-[10px] leading-4 text-muted-foreground">Guarda música e recebe seleções feitas para ti.</p>
      </div>
    </aside>
  );
}

function FeatureCard({ image, eyebrow, title, copy, large = false }: { image: string; eyebrow: string; title: string; copy: string; large?: boolean }) {
  return (
    <article className={`feature-card group ${large ? "md:col-span-2" : ""}`}>
      <img src={image} alt="" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      <div className="editorial-scrim absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.15em] text-primary">{eyebrow}</p>
        <h2 className="max-w-2xl font-display text-xl font-bold leading-tight md:text-2xl">{title}</h2>
        <p className="mt-2 hidden max-w-xl text-xs text-hero-muted sm:block">{copy}</p>
      </div>
    </article>
  );
}

function TrackGrid({ onPlay }: { onPlay: (title: string) => void }) {
  return (
    <div className="grid gap-x-7 lg:grid-cols-2 xl:grid-cols-4">
      {tracks.map((track) => (
        <article key={track.title} className="track-row group">
          <button className="relative size-11 shrink-0 overflow-hidden rounded-sm" onClick={() => onPlay(track.title)} aria-label={`Ouvir ${track.title}`}>
            <img src={track.image} alt="" className="size-full object-cover" />
            <span className="absolute inset-0 grid place-items-center bg-overlay opacity-0 transition-opacity group-hover:opacity-100"><Play className="size-4 fill-current text-overlay-foreground" /></span>
          </button>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{track.title}</p><p className="truncate text-xs text-muted-foreground">{track.artist}</p></div>
          <Button variant="ghost" size="icon" className="size-8 opacity-60 lg:opacity-0 lg:group-hover:opacity-100" aria-label={`Mais opções para ${track.title}`}><MoreHorizontal /></Button>
        </article>
      ))}
    </div>
  );
}

function Player({ playing, setPlaying, title }: { playing: boolean; setPlaying: (value: boolean) => void; title: string }) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 h-20 border-t border-border bg-player/95 backdrop-blur-xl lg:left-60">
      <div className="grid h-full grid-cols-[1fr_auto] items-center gap-4 px-4 md:grid-cols-[1fr_1.2fr_1fr] md:px-8">
        <div className="flex min-w-0 items-center gap-3"><img src={cover1} alt="Capa de Afro Fado" className="size-12 rounded-sm object-cover" /><div className="min-w-0"><p className="truncate text-sm font-semibold">{title}</p><p className="truncate text-xs text-muted-foreground">Slow J · Afro Fado</p></div></div>
        <div className="flex items-center justify-end gap-2 md:flex-col md:justify-center md:gap-1">
          <div className="flex items-center gap-2"><Button variant="ghost" size="icon" className="hidden size-8 md:inline-flex" aria-label="Faixa anterior"><SkipBack /></Button><Button size="icon" className="rounded-full" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pausar" : "Reproduzir"}>{playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}</Button><Button variant="ghost" size="icon" className="hidden size-8 md:inline-flex" aria-label="Faixa seguinte"><SkipForward /></Button></div>
          <div className="hidden w-full max-w-sm items-center gap-2 text-[9px] text-muted-foreground md:flex"><span>1:24</span><div className="h-1 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/5 bg-primary" /></div><span>3:38</span></div>
        </div>
        <div className="hidden items-center justify-end gap-3 text-muted-foreground md:flex"><ListMusic className="size-4" /><Volume2 className="size-4" /><div className="h-1 w-20 rounded-full bg-muted"><div className="h-full w-2/3 rounded-full bg-muted-foreground" /></div></div>
      </div>
    </footer>
  );
}

function Index() {
  const [playing, setPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState("Tata");
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const playTrack = (title: string) => { setNowPlaying(title); setPlaying(true); };

  return (
    <div id="inicio" className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="pb-24 lg:ml-60">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-xl md:px-8 lg:px-10">
          <div className="flex items-center gap-4 lg:block"><div className="lg:hidden"><Brand /></div><h1 className="hidden font-display text-3xl font-bold lg:block">Novidades</h1></div>
          <div className="flex items-center gap-2"><Button variant="pill" size="sm" className="hidden sm:inline-flex" onClick={() => setSchedulingOpen(true)}><CalendarDays />Agendar reunião</Button><Button variant="ghost" size="icon" aria-label="Pesquisar"><Search /></Button><Button variant="ghost" size="icon" aria-label="Perfil"><UserRound /></Button><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu"><Menu /></Button></div>
        </header>

        <div className="space-y-14 px-5 py-7 md:px-8 lg:px-10">
          <section id="novidades" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard large image={cover1} eyebrow="Sessão Pulso" title="Slow J: A revolução do Afro Fado" copy="O artista que está a redefinir a sonoridade urbana portuguesa regressa com um álbum visual e sonoro impactante." />
            <FeatureCard image={cover2} eyebrow="História de capa" title="Ivandro: Do R&B à Pop" copy="O percurso do Trovador que conquistou Portugal e o mundo lusófono com a sua voz única." />
            <FeatureCard image={cover3} eyebrow="Seleção atualizada" title="Fado sem fronteiras" copy="Ana Moura lidera uma nova geração que mistura a tradição do fado com eletrónica contemporânea." />
          </section>

          <section id="para-ti">
            <div className="section-title"><h2>As melhores músicas novas</h2><a href="#lancamentos">Ver tudo <ChevronRight /></a></div>
            <TrackGrid onPlay={playTrack} />
          </section>

          <section id="lancamentos">
            <div className="section-title"><div><p className="section-kicker">Escolhas da redação</p><h2>Lançamentos da semana</h2></div><a href="#listas">Explorar <ChevronRight /></a></div>
            <div className="release-grid">
              {releases.map((item) => <article key={item.title} className="group min-w-0"><button className="relative aspect-square w-full overflow-hidden rounded-md text-left" onClick={() => playTrack(item.title)} aria-label={`Ouvir ${item.title}`}><img src={item.image} alt={`Capa de ${item.title}`} className="size-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100"><Play className="size-4 fill-current" /></span></button><p className="mt-3 truncate text-sm font-semibold">{item.title}</p><p className="truncate text-xs text-muted-foreground">{item.artist} · {item.tag}</p></article>)}
            </div>
          </section>

          <section id="radio" className="radio-band">
            <div><p className="section-kicker">Em direto · Lisboa</p><h2 className="mt-2 font-display text-3xl font-bold">Pulso 24</h2><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Conversas, estreias e música escolhida por pessoas que vivem a cultura todos os dias.</p></div>
            <Button size="lg" onClick={() => { setNowPlaying("Pulso 24 — Em direto"); setPlaying(true); }}><Radio />Ouvir em direto</Button>
          </section>

          <section id="faq" className="mx-auto max-w-4xl pb-8">
            <div className="section-title"><h2>Sobre o Pulso</h2></div>
            <div className="divide-y divide-border border-y border-border">{faqs.map(([question, answer], index) => <details key={question} open={index === 0} className="group"><summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-semibold"><span>{question}</span><ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pb-5 text-sm leading-6 text-muted-foreground">{answer}</p></details>)}</div>
          </section>
        </div>
      </main>
      <Player playing={playing} setPlaying={setPlaying} title={nowPlaying} />
      <PulsoChat />
      <ScheduleModal open={schedulingOpen} onClose={() => setSchedulingOpen(false)} />
    </div>
  );
}