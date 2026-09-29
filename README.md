# Landing Page Architect

You are a senior product marketer and front-end developer. Your task is to create a modern, conversion-optimized landing page based on the PRD (Product Requirements Document) I provide.

## Instructions

Analyze the PRD and extract the following to build the landing page:

### 1\. HERO SECTION

- **Problem Statement**: Identify the core pain point the product solves. Write a compelling headline (max 10 words) and subheadline (max 25 words) that resonates emotionally with the target user.

### 2\. TARGET AUDIENCE SECTION

- **Who is this for?**: Create 2-3 user personas with:  

  - Role/title  

  - Key frustration  

  - Desired outcome  

- Use icons or illustrations to represent each persona.

### 3\. SOLUTION OR SERVICES

- List 3-5 core features with:  

  - Feature name  

  - One-line benefit (focus on outcome, not functionality)  

  - Simple icon representation  

  - Present as feature cards or a visual grid.

### 4\. CTA (Call-to-Action)

- Primary CTA button with action-oriented text  

- Secondary CTA (e.g., "See Demo" or "Learn More")

### 5\. FAQ

- Create a faq at least 10 Q\&A

## Design Requirements

- Modern, clean aesthetic (use Tailwind CSS or similar)  

- Mobile-responsive  

- Dark/light mode toggle (optional)  

- Smooth scroll animations  

- Professional color palette derived from product positioning

## Output Format

Generate complete, production-ready code:

- React \+ Tailwind CSS (preferred)  

- OR vanilla HTML/CSS/JS

---

## LP CONTENT INPUT:

CRO Strategist Note: The URL provided ([https://music.apple.com/pt/new](https://music.apple.com/pt/new)) is not a traditional long-form direct-response landing page (which relies on problem-agitation-solution frameworks). Instead, it is a Product-Led Growth (PLG) Web Player Interface acting as an acquisition and retention engine.

Apple relies on "visual merchandising," editorial curation, and frictionless UX copy to drive conversions (App Installs / Sign-ins) and user retention (Plays). Here is the deconstruction of how they execute this.

1. Full Content & Section Mapping

Header / Global Navigation

Raw Text: "Apple Music – leitor web | Iniciar sessão | Pesquisar | Início | Novidades | Rádio | Instale a Apple Music Obter no Google Play"

Functional Goal: Frictionless entry and acquisition.

Emotional Driver: Convenience and Accessibility (prominently offering the Google Play download for non-iOS users to remove platform objections).

Hero / Featured Carousel (The "Hook")

Raw Text:

Promo: "Apple Music Hall em Londres, o nosso novo espaço ao vivo. VER AGORA"

Feature 1: "NOVO ÁLBUM - RUA OU GLAMOUR - LEO2745 - O rapper cruza dificuldades e sonhos em versos sobre novos caminhos."

Feature 2: "LISTA DE REPRODUÇÃO ATUALIZADA - Play Portugal - Os êxitos atuais e os grandes ícones do pop e do rock nacionais."

Feature 3: "NOVO ÁLBUM - Bass Persuades - Miley Cyrus - O amor romântico e o amor-próprio inspiram o 10.º álbum da estrela pop."

Functional Goal: Command immediate attention, establish cultural authority, and drive instant engagement with a mix of local (Portuguese) and global top-tier content.

Emotional Driver: Novelty, Exclusivity, and Cultural Connection.

Discovery & Freshness Modules

Raw Text (Headings): "As melhores músicas novas", "Novidades da semana", "Lançamentos recentes", "Listas de reprodução atualizadas"

Functional Goal: Habit formation. Training the user to view this page as the ultimate, up-to-the-minute source for the music industry.

Emotional Driver: FOMO (Fear Of Missing Out) and the desire for continuous discovery.

Premium Feature Showcase

Raw Text (Heading): "Agora em áudio espacial" (Now in Spatial Audio)

Functional Goal: Product differentiation. Upselling the hardware/software ecosystem implicitly by showcasing a premium audio format competitors struggle to match.

Emotional Driver: Desire for status and premium quality.

Social Proof & Zeitgeist Modules

Raw Text (Headings): "Músicas em voga", "Toda a gente está a ouvir...", "Top 100 diário", "Tops por cidade"

Functional Goal: Leverage mass consensus to guide listening behavior and reduce decision fatigue.

Emotional Driver: Belonging, tribalism, and social validation (listening to what everyone else is listening to).

Exclusives & Anticipation (Bottom of Page)

Raw Text (Headings): "Novos episódios de rádio", "Vê entrevistas" (e.g., Miley: The Zane Lowe Interview), "Brevemente" (e.g., Grand Theft Auto VI: The Album)

Functional Goal: Deepen engagement beyond just playing tracks; build a moat of exclusive content and tease future releases to ensure return visits.

Emotional Driver: Parasocial connection (with artists) and Anticipation.

2. Copywriting Patterns & Formula

Headline Mechanics: Apple Abandons traditional "How to" formulas entirely. Their headline formula is [Status/Timeframe] + [Content Category] (e.g., "Novidades da semana" / "Listas de reprodução atualizadas"). It is strictly categorical, objective, and highly scanable.

Primary Hooks & Angle: The core Unique Value Proposition (UVP) is "Effortless Cultural Relevance." The narrative angle is editorial. Apple positions itself not as a software company, but as a high-end music magazine or curator. The promise is that by simply logging in, you are instantly plugged into the global and local (Portuguese) cultural zeitgeist.

Pacing & Formatting: The page utilizes an extreme High-Visual-to-Text Ratio. Copy is treated as metadata.

Structure: Category Heading (H2) ➝ Grid/Carousel of Images ➝ 1-3 word Titles ➝ 1 sentence of editorial micro-copy (e.g., "O amor romântico e o amor-próprio inspiram o 10.º álbum da estrela pop.").

There are no walls of text. It is designed for endless horizontal and vertical scrolling.

3. Messaging & Positioning Strategy

Brand Voice & Tone:

Authoritative & Editorial: It dictates what is "As melhores" (The best) without justifying it.

Minimalist & Premium: It speaks only when necessary.

Localized: It seamlessly blends global pop (Miley Cyrus, ROSÉ) with hyper-local Portuguese culture (LEO2745, Bispo, Agir, Ana Lua Caiano, "Sons de Lisboa", "ALTO: indie português").

Pain Points & Objections Overcome:

Pain Point: "Finding new music takes too much effort."

Solution: Heavy curation ("Play Portugal", "Novidades do dia").

Pain Point: "I don't know what's popular right now."

Solution: Granular charts ("Top 25: Nova Iorque", "Top 25: Lisboa").

Objection: "I am on an Android/PC, this is an Apple product."

Solution: The very top navigation prominently features "Obter no Google Play" (Get on Google Play) and operates perfectly as a web player.

4. Micro-Copy & Conversion Triggers

Implicit Urgency: Words like Novidades (News/New releases), Hoje (Today), and Agora (Now) are used repeatedly to create a sense that the page is constantly updating, forcing the user to act now before the curation changes.

Ultimate Social Proof Trigger: The header "Toda a gente está a ouvir..." (Everyone is listening to...). This is a massive psychological trigger. It removes the burden of choice by implying, if everyone else is doing it, it's safe for you to do it too.

Frictionless CTA Strategy: Apple doesn't use high-pressure CTAs like "Buy Now" or "Subscribe Today" on this specific interface. Instead, the triggers are micro-commitments:

"VER AGORA" (See Now) - Low friction, curiosity-driven.

"Iniciar sessão" (Sign In) - Assumes you already belong to the ecosystem.

Authority Building: Utilizing Zane Lowe and high-profile artist interviews (e.g., Miley: The Zane Lowe Interview) as micro-copy establishes Apple Music as the official "home" of the artists, not just a distributor.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/96c4d8ba-5d40-4033-84d1-d818281849b1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
