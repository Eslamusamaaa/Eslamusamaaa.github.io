// Content is sourced from the CV, public repository READMEs, and local copies of the Zikola
// project documentation. No private source code, credentials, client data or screenshots with
// customer data are published here. Edit this file to update the site.

export const profile = {
  name: "Eslam Usama",
  shortName: "Eslam Usama",
  title: "AI Engineer",
  location: "Egypt",
  email: "eslamosamamahmoud3@gmail.com",
  phone: "+201095178021", // from the CV
  phoneDisplay: "+20 109 517 8021",
  whatsapp: "https://wa.me/201095178021", // personal number, separate from the bot lines
  github: "https://github.com/Eslamusamaaa",
  linkedin: "https://www.linkedin.com/in/eslam-usamaaa",
  cvUrl: "cv/Eslam-Usama-CV.pdf" as string | null, // file lives in /public/cv
  cvLabel: "Download CV",
};

// Saudi mobile numbers are 9 digits starting with 5; wa.me needs country code + digits only.
const wa = (local: string) => `https://wa.me/966${local.replace(/\D/g, "")}`;

export const whatsappBots = [
  {
    id: "line-1",
    title: "Commerce bot · Line 1",
    number: "54 478 2562",
    href: wa("54 478 2562"),
    blurb: "Guided product picker: budget, style, then product cards.",
  },
  {
    id: "line-2",
    title: "Commerce bot · Line 2",
    number: "58 018 3680",
    href: wa("58 018 3680"),
    blurb: "Button-driven shopping flow plus free-text catalog questions.",
  },
  {
    id: "line-3",
    title: "Commerce bot · Line 3",
    number: "53 394 7699",
    href: wa("53 394 7699"),
    blurb: "Catalog-grounded sales assistant: prices and links come from data.",
  },
];

export type Link = { label: string; href: string };
export type Step = { title: string; note: string };

export type Project = {
  slug: string;
  title: string;
  kind: string;
  group: "professional" | "personal";
  status: string;
  summary: string;
  tags: string[];
  image?: { src: string; alt: string };
  video?: { url: string; id: string; title: string };
  /** Further explanation videos, shown on the case-study page after the main one. */
  moreVideos?: { url: string; id: string; title: string }[];
  samples?: { src: string; text: string; note: string }[];
  proof?: { src: string; alt: string; caption: string };
  diagram?: { src: string; alt: string; caption: string; width: number; height: number };
  overview: string;
  problem: string;
  flowTitle: string;
  flowCaveat?: string;
  flow: Step[];
  implementation: { heading: string; body: string }[];
  stack: { name: string; role: string }[];
  challenges: { challenge: string; solution: string }[];
  results: string[];
  limitations: string[];
  next: string[];
  links: Link[];
  contribution: string;
  role?: string;
  outcome?: string;
  /** Filter categories used by the work section. */
  cats: string[];
  /** Small visual motif drawn on cards. */
  motif: "wave" | "scan" | "tokens" | "chat" | "grid" | "graph";
  /** One true sentence shown on the collapsed card. */
  oneLine: string;
};

export const projects: Project[] = [
  {
    slug: "rashihli-salla-widget",
    title: "Rashihli: AI shopping quiz for Salla stores",
    kind: "Zikola · multi-tenant SaaS · Salla app",
    group: "professional",
    status: "Working product, verified on demo stores · private repository",
    summary:
      "A widget that interviews each shopper with questions generated from that store's own products, then returns ranked recommendations with a written reason for each.",
    tags: ["TypeScript", "PostgreSQL", "Salla API", "LLM", "Multi-tenant"],
    image: { src: "img/rashihli-logo.png", alt: "Rashihli logo: a purple tile with a check mark" },
    video: { url: "https://www.youtube.com/watch?v=EIuLRemSntw", id: "EIuLRemSntw", title: "رشّحلي — مساعد تسوّق ذكي لمتاجر سلة" },
    moreVideos: [{ url: "https://www.youtube.com/watch?v=mbIfK9MzrwE", id: "mbIfK9MzrwE", title: "رشّحلي | كويز ذكي يرشّح لعملائك المنتج المناسب — لمتاجر سلة" }],
    overview:
      "Rashihli lets a Salla merchant install an app, have their catalog imported automatically, and show a short adaptive quiz on their storefront. The questions, the options and the wording are generated from that store's products, in the store's own language, with nothing hardcoded per merchant. One backend serves many stores.",
    problem:
      "A shopping assistant is only useful if it knows what the store sells. A hardcoded product list works for one merchant and cannot be sold to a second, and a generic LLM will happily recommend products that do not exist. The hard part is making every recommendation relevant to the store's real catalog.",
    flowTitle: "From install to recommendation",
    flow: [
      { title: "Merchant installs", note: "Salla OAuth with a single-use state, tokens stored per store" },
      { title: "Catalog sync", note: "Paginated, rate-limited, proactive token refresh, webhooks" },
      { title: "Adapter", note: "Salla product → neutral CatalogProduct (prices, SKUs, options)" },
      { title: "Enrichment", note: "Model infers attributes and writes question wording, once per store" },
      { title: "Adaptive quiz", note: "Server scores candidate questions by how well they split the remaining pool" },
      { title: "Results", note: "Explicit answers filter, preferences rank; each pick gets a reason" },
    ],
    cats: ["Agents", "Commerce"],
    motif: "grid",
    oneLine: "A working multi-tenant Salla app, verified on demo stores with pricing, adaptation and branching test suites.",
    implementation: [
      {
        heading: "Questions come from the store, not from a template",
        body: "Seven structured generators (category, brand, style, type, budget, rating, priority) offer questions only when the data supports them. Budget bands are quartiles of the store's own price distribution. Where merchants left tags empty, the model reads names and descriptions and assigns products to attribute values; it never invents options, and any option that references missing products is discarded.",
      },
      {
        heading: "Recommendations stay correct",
        body: "Answers split into explicit ones (category, brand, inferred attributes) that filter, and preferences (budget, priority, rating) that rank. This fixed a real failure where a wrong-category item could outrank a correct one on discount alone. Filtering is per SKU, so red and XL is only satisfied by a variant that is actually both. When filters leave too little, they are relaxed one at a time and the widget says so.",
      },
      {
        heading: "Price and catalog correctness",
        body: "Salla prices are tax-inclusive or not, ranges, floors or open amounts. The adapter resolves VAT, per-SKU spreads, option surcharges and live sale windows, and an unresolvable price is never quoted, banded or ranked as cheap. A catalog that hits the import ceiling throws instead of silently truncating.",
      },
      {
        heading: "Merchant and operator tooling",
        body: "A bilingual (Arabic/English) merchant settings panel with free-text guidance and a preview before saving, quiz analytics (sessions and product click-through), an operator dashboard, rate limiting and token auth on settings and admin routes.",
      },
      {
        heading: "Model use is bounded and optional",
        body: "Model calls happen on install, once per answer path (cached) and for merchant guidance, so cost tracks the variety of paths rather than visitor count. Without the model the quiz falls back to structured questions and built-in wording.",
      },
    ],
    stack: [
      { name: "TypeScript / Node.js, Express", role: "Backend, quiz engine and Salla adapter" },
      { name: "PostgreSQL", role: "Multi-tenant storage; schema, sessions, analytics" },
      { name: "Salla OAuth, Admin API, webhooks", role: "Install flow, catalog sync, live updates" },
      { name: "LLM via OpenRouter", role: "Attribute inference, wording, ordering, per-product reasons" },
      { name: "Browser widget (shadow DOM)", role: "Storefront UI in Arabic and English" },
      { name: "React", role: "Merchant settings panel" },
      { name: "Docker", role: "Packaging and deployment" },
    ],
    challenges: [
      { challenge: "Merchants leave tags and attributes empty", solution: "Model-inferred attributes, constrained to assign real products to values rather than invent options." },
      { challenge: "Wrong-category products out-ranking right ones", solution: "Separate filtering (explicit answers) from ranking (preferences)." },
      { challenge: "Variant combinations that do not exist", solution: "Joint filtering against actual SKUs." },
      { challenge: "Trusting the pricing logic", solution: "A 151-assertion pricing suite and a 47-assertion end-to-end store simulation; the simulation found and fixed a real stock bug." },
    ],
    results: [
      "Verification suites cover pricing, module boundaries, a full simulated store, adaptation across 5 catalogs and branching across 4 follow-up paths; the README records the last two passing on a real Postgres 16.",
    ],
    limitations: [
      "The mapping was validated against Salla's documented schema and a handful of demo stores (clothing, food, skincare), not a wide sample of live shops.",
      "No purchase-conversion attribution yet; analytics stop at sessions and product click-through. The browser widget has no automated tests.",
      "A generic adapter for platforms beyond Salla is planned, not built. No sales or usage figures are claimed here.",
    ],
    next: ["Purchase-conversion attribution via order webhooks.", "Generic adapter (JSON-LD / product feed)."],
    links: [],
    contribution:
      "I am the main committer and built the backend, catalog adapter, quiz engine and merchant tooling described above.",
    role: "Main developer: backend, catalog adapter, quiz engine and merchant tooling.",
    outcome: "Working multi-tenant product, verified on demo stores with pricing, adaptation and branching test suites.",
  },
  {
    slug: "zikola-meeting-assistant",
    title: "Zikola AI Meeting Assistant",
    kind: "Zikola · browser extension + dashboard + API",
    group: "professional",
    status: "Deployed on Vercel · private repository",
    summary:
      "A Chrome extension that records Google Meet audio, a FastAPI backend that transcribes and analyzes it in Arabic and English, and a dashboard that turns meetings into reviewed reports.",
    tags: ["Chrome MV3", "FastAPI", "Deepgram", "Gemini", "WebAuthn"],
    overview:
      "The system captures a meeting, attributes speech to the right attendees, produces a transcript, summary, action items and sentiment, and exports PDF and Word reports. It is multi-tenant across several Zikola brands, with passwordless authentication and an admin console.",
    problem:
      "Meeting platforms mix everyone's audio into one stream, and Arabic meetings are full of colloquial speech. Useful output needs the right names on the right words, structured results, and access control that fits an organization.",
    flowTitle: "From meeting to report",
    flow: [
      { title: "Extension", note: "Captures tab audio and microphone, scrapes participant names from the Meet DOM" },
      { title: "Upload", note: "Chunked audio and speaker timeline to the FastAPI backend" },
      { title: "Speech-to-text", note: "Deepgram transcription with diarization, Arabic and English" },
      { title: "Alignment", note: "Custom word-alignment maps speaker tags to attendee names" },
      { title: "LLM analysis", note: "Gemini 2.5 Flash via OpenRouter: summary, action items, sentiment" },
      { title: "Reports", note: "PDF for users, Word for admins; stored in PostgreSQL" },
    ],
    cats: ["Voice", "Agents"],
    motif: "wave",
    oneLine: "Working end to end: browser capture, Arabic and English transcription, reviewed reports in PDF and Word.",
    implementation: [
      {
        heading: "Dual-channel audio capture",
        body: "A Manifest V3 extension records the tab and the local microphone as separate streams, calibrates gain, and mixes them into fragmented WebM chunks. Participant names come from the active tiles in the Meet page.",
      },
      {
        heading: "Names on the right words",
        body: "A custom Python word-alignment algorithm (±1.5 s) combined with DOM metadata filters audio bleed and maps diarization tags to attendees; a fuzzy name-deduplication step merges variants of the same person.",
      },
      {
        heading: "Async analysis pipeline",
        body: "A parallel asyncio pipeline splits multi-hour transcripts into dynamic chunks. A state-machine auto-repair parser guarantees valid JSON for summaries, action items and sentiment, and the backend computes speaking share and participation per attendee.",
      },
      {
        heading: "Serverless constraints",
        body: "Vercel's 4.5 MB payload limit is handled with 3 MB chunked streaming and a direct-transcription path for long recordings; hybrid analytics are persisted via SQLAlchemy for dashboard re-analysis.",
      },
      {
        heading: "Security and administration",
        body: "OTP onboarding with WebAuthn passkeys, refresh-token rotation, multi-tenant role-based access, automated offboarding, JWT invalidation and an immutable audit log. A React dashboard offers meeting folders, review status and notes, and report download.",
      },
    ],
    stack: [
      { name: "Chrome Extension (MV3, TypeScript)", role: "Audio capture and participant metadata" },
      { name: "FastAPI, SQLAlchemy, PostgreSQL", role: "API, persistence, multi-tenancy" },
      { name: "Deepgram", role: "Speech-to-text with diarization" },
      { name: "Gemini 2.5 Flash via OpenRouter", role: "Meeting analysis and speaker-name resolution" },
      { name: "ReportLab, python-docx", role: "PDF and Word report generation" },
      { name: "React + Tailwind, Vercel", role: "Dashboard and hosting" },
    ],
    challenges: [
      { challenge: "Audio bleed between tab and mic", solution: "Dual-stream capture plus time-windowed word alignment against DOM speaker metadata." },
      { challenge: "Model output that must be valid JSON", solution: "Dynamic chunking and a state-machine repair parser." },
      { challenge: "Platform payload limits", solution: "Chunked streaming and a direct-transcription path." },
    ],
    results: ["Working end to end: extension, backend, dashboard, reports and admin console, with simulation scripts that exercise the full flow."],
    limitations: [
      "Meeting data, recordings and the admin screenshots contain employee information and are intentionally not shown.",
      "No accuracy or usage figures are published here.",
    ],
    next: [],
    links: [],
    contribution:
      "I am the main committer and built the extension, alignment, analysis pipeline, security model and reports described above.",
    role: "Main developer: extension, alignment, analysis pipeline, security and reports.",
    outcome: "Working end to end: extension, backend, dashboard, reports and admin console.",
  },
  {
    slug: "ai-voice-calling",
    title: "AI voice calling: Tele Confirm and the Voice Assistant",
    kind: "Zikola · voice AI · two related systems",
    group: "professional",
    status: "Tele Confirm: test environment, real calls switched off · private repositories",
    summary:
      "Tele Confirm places AI phone calls for Salla merchants, starting with cash-on-delivery order confirmation. A separate RAG voice assistant answers customer questions in Saudi Arabic.",
    tags: ["LangGraph", "Vapi", "Saudi Arabic", "RAG", "Qdrant"],
    overview:
      "Two distinct projects share the voice theme. Tele Confirm listens to a store's order events, decides when a call is worth making, calls the customer in Saudi Arabic and writes the result back to the order. The Zikola Voice Assistant is a streaming speech-in, speech-out RAG assistant built on a LangGraph workflow.",
    problem:
      "A cash-on-delivery order refused at the door costs the merchant shipping both ways and ties up stock; a one-minute call confirming items, total and address prevents much of that. A voice agent must also never say, promise or change something it should not.",
    flowTitle: "Tele Confirm: an order event becomes a call",
    flow: [
      { title: "Salla order event", note: "Webhook intake, one run per feature and subject" },
      { title: "Run graph", note: "LangGraph, checkpointed after every step; waits are interrupts" },
      { title: "Pre-dial gate", note: "Store, quota, consent and calling hours re-checked before each attempt" },
      { title: "Call", note: "Vapi voice adapter, Saudi Arabic, tools the model may call mid-call" },
      { title: "Write-back", note: "Outcome to the Salla order note and status, plus merchant tasks" },
    ],
    cats: ["Voice", "Agents", "Commerce"],
    motif: "wave",
    oneLine: "Tested live on a Salla test store; calls to real customers are switched off.",
    implementation: [
      {
        heading: "Engine separated from runtime",
        body: "The call engine (domain, playbooks, tools, orchestration) has no server, database driver or voice platform in it, and talks to the outside through ports. The voice platform, storefront and database are replaceable; what a call is stays fixed.",
      },
      {
        heading: "Call playbooks",
        body: "One file per feature across confirmation, payments, fulfilment, post-delivery and merchant operations, from COD confirmation and address checks to unpaid-order follow-up and satisfaction surveys. Marketing features stay off until a merchant confirms consent per feature.",
      },
      {
        heading: "Safety as code",
        body: "Rules are enforced in the engine rather than the prompt: tools are the only way a call changes anything, no payment feature marks an order paid or reads bank details aloud, an oversell call never dials without merchant approval, and a single opt-out ends further calls.",
      },
      {
        heading: "Zikola Voice Assistant",
        body: "A LangGraph workflow runs STT, query understanding, RAG retrieval, context validation, LLM response and TTS. Documents (PDF, DOCX, TXT) are chunked 1000/200 into a Qdrant collection; Deepgram handles speech recognition, an OpenRouter-hosted model generates answers and ElevenLabs produces speech, with session memory and a Saudi Arabic personality.",
      },
    ],
    stack: [
      { name: "TypeScript, LangGraph", role: "Tele Confirm run graph and call engine" },
      { name: "Vapi, Azure Saudi voices", role: "Telephony and voice platform" },
      { name: "Salla OAuth, webhooks", role: "Order events and write-back" },
      { name: "SQLite", role: "Test-environment storage (Postgres planned for production)" },
      { name: "FastAPI, LangGraph, Qdrant", role: "Voice Assistant backend and vector store" },
      { name: "Deepgram, ElevenLabs", role: "Voice Assistant STT and TTS" },
    ],
    challenges: [
      { challenge: "Calls must never exceed what the merchant allowed", solution: "A pre-dial gate re-checked on every attempt, plus per-feature consent and quotas." },
      { challenge: "Long waits and restarts", solution: "Runs checkpointed after every step; scheduled calls survive restarts." },
    ],
    results: ["Tele Confirm's README records its call features as built and tested live on a Salla test store."],
    limitations: [
      "Tele Confirm is a test environment: dialing real customers is off, and a Saudi outbound number, production database and panel login are still missing per its README.",
      "No latency, call-volume or success-rate figures are claimed. The Voice Assistant is an MVP.",
    ],
    next: ["Persistent checkpointer on Postgres, panel login, production number."],
    links: [],
    contribution:
      "Tele Confirm's history shows my commits only; the Voice Assistant has no commit history in the copy I reviewed, so its authorship is described by my CV and role at Zikola.",
    role: "Tele Confirm engine and integrations; voice assistant described via CV.",
    outcome: "Tele Confirm tested live on a Salla test store; real customer calls are switched off.",
  },
  {
    slug: "ai-fragrance-concierge",
    title: "AI Fragrance Concierge: Arabic voice and chat assistant",
    kind: "Zikola · conversational AI · RAG · voice",
    group: "professional",
    status: "Working prototype · private repository",
    summary:
      "A real-time Arabic assistant for a fragrance retailer: it answers product questions by voice, recommends from the catalog, and places automated calls to confirm cash-on-delivery orders.",
    tags: ["Deepgram", "ElevenLabs", "RAG", "Vapi", "TypeScript"],
    overview:
      "Two voice surfaces share one retrieval and catalog engine. A browser voice assistant handles pre-purchase advice and recommendations over a WebSocket, and an outbound call path built on Vapi confirms or cancels cash-on-delivery orders after checkout.",
    problem:
      "A fragrance shopper needs advice, not a search box, and a refused cash-on-delivery order costs the merchant shipping both ways. The assistant has to sound natural in spoken Saudi Arabic, respond fast enough to interrupt, and only recommend products that exist.",
    flowTitle: "A spoken turn in the browser assistant",
    flow: [
      { title: "Microphone", note: "AudioWorklet frames streamed to the server over WebSocket" },
      { title: "Speech-to-text", note: "Deepgram nova-3, Arabic, streaming" },
      { title: "Retrieval", note: "RAG over the fragrance knowledge base plus catalog context" },
      { title: "Language model", note: "OpenRouter (Gemini 2.5 Flash), streaming with tool calling" },
      { title: "Text-to-speech", note: "ElevenLabs streaming, sentence by sentence" },
      { title: "Playback", note: "Barge-in cancels generation and speech immediately" },
    ],
    cats: ["Voice", "Agents", "Commerce"],
    motif: "wave",
    oneLine: "A working prototype: spoken product advice plus order-confirmation calls.",
    implementation: [
      {
        heading: "Latency by design",
        body: "Recognition, generation and synthesis all stream. A sentence splitter hands each complete Arabic sentence to speech synthesis as soon as it is ready, so time to first audio depends on the first sentence rather than the whole reply. The speech recognizer connects lazily on the first audio chunk.",
      },
      {
        heading: "Barge-in and turn-taking",
        body: "A state machine moves between listening, thinking and speaking. Interrupting the assistant aborts the model request, destroys the synthesis socket and resets the splitter together, because cancelling only part of that leaves audio playing over the user. A turn ends on whichever comes first: client voice-activity detection, a server silence timer or the recognizer's utterance-end event.",
      },
      {
        heading: "Spoken-Arabic persona",
        body: "Prompts constrain the assistant to a direct contemporary Saudi register and forbid emoji, markdown and filler greetings, since every word is spoken. Beginner and enthusiast conversation journeys, budget matching and a human handoff when it cannot help sit on top of the retrieval engine.",
      },
      {
        heading: "Order confirmation calls",
        body: "Cash-on-delivery checkout creates an order awaiting confirmation. A delayed job places a Vapi call with per-order details, and the call agent exposes confirm and cancel as tools and can transfer to a person. An end-of-call webhook reconciles the order and writes a call log.",
      },
      {
        heading: "Accounts and storage",
        body: "Signup and login with hashed passwords and JWT sessions, phone numbers validated to E.164, and SQLite for orders and call logs.",
      },
    ],
    stack: [
      { name: "Node.js, TypeScript, Express, ws", role: "Server and WebSocket voice transport" },
      { name: "Deepgram nova-3", role: "Streaming Arabic speech recognition" },
      { name: "ElevenLabs", role: "Streaming speech synthesis" },
      { name: "OpenRouter (Gemini 2.5 Flash)", role: "Streaming responses and tool calling" },
      { name: "RAG engine (LangChain core + custom)", role: "Catalog and knowledge-base retrieval" },
      { name: "Vapi", role: "Outbound order-confirmation calls" },
      { name: "SQLite", role: "Orders, users and call logs" },
    ],
    challenges: [
      { challenge: "Perceived latency in a spoken conversation", solution: "End-to-end streaming and sentence-level hand-off to speech synthesis." },
      { challenge: "Users interrupting mid-sentence", solution: "Barge-in that cancels model, synthesis and splitter together." },
      { challenge: "Text that sounds wrong when read aloud", solution: "Prompt rules for spoken output and a dialect-specific persona." },
    ],
    results: ["The browser assistant and the order-confirmation call path are both implemented in the repository."],
    limitations: [
      "A prototype: the repository's own roadmap lists configuration hardening, a persistent call queue and a storefront widget as remaining phases.",
      "No latency, call-volume or conversion figures are claimed.",
    ],
    next: ["Persist the call queue, harden webhooks and configuration, and ship a storefront voice widget."],
    links: [],
    contribution:
      "Repository history shows my commits only; I built the voice pipeline, retrieval, ordering and call-confirmation flow described above.",
    role: "Voice pipeline, retrieval engine, ordering and call-confirmation flow.",
    outcome: "Browser voice assistant and outbound confirmation calls implemented; still a prototype.",
  },
  {
    slug: "whatsapp-commerce-bots",
    title: "WhatsApp commerce bots",
    kind: "Zikola · conversational commerce",
    group: "professional",
    status: "Catalog bot with recorded verification; platform is a team repository",
    summary:
      "Catalog-grounded WhatsApp sales assistants: a guided button flow for the answers that must be exact, and an LLM only for open questions.",
    tags: ["WhatsApp Cloud API", "LangGraph", "FastAPI", "Chroma", "PostgreSQL"],
    overview:
      "Two pieces of work: a multi-tenant WhatsApp commerce platform at Zikola, and a standalone WhatsApp sales bot I built for a Salla chandelier store. Both follow one rule: the database decides what is true and the model decides what to do.",
    problem:
      "Early free-text versions confidently sent the wrong product image, quoted a non-customer-facing price and fabricated product URLs. Prompt instructions did not stop it, so the architecture had to change.",
    flowTitle: "Message path in the catalog bot",
    flow: [
      { title: "WhatsApp", note: "Customer message or button tap via the Meta Cloud API" },
      { title: "FastAPI webhook", note: "Verified, deduplicated and rate limited" },
      { title: "LangGraph", note: "Routes to the button workflow or the LLM agent" },
      { title: "Tools", note: "Prices, stock, links and images read from SQLite, not typed by the model" },
      { title: "Reply", note: "Interactive buttons, product cards and photos" },
    ],
    cats: ["Agents", "Commerce"],
    motif: "chat",
    oneLine: "The catalog bot captured 63 of 63 store products with complete fields in its last recorded run.",
    implementation: [
      {
        heading: "Workflow first, free text second",
        body: "A button-driven flow (price tier, style, shape, paginated results, product detail) arrives as exact machine ids, so it cannot mis-identify a product. The LLM, Gemini via OpenRouter, handles open questions through tools that emit URLs, prices and images from the source of truth.",
      },
      {
        heading: "Scrape, index, serve",
        body: "A Playwright scraper reads the store's live catalog on a schedule into SQLite; product text is embedded into a persistent Chroma index; the bot never touches the live site. Verification scripts check the scraped data across several mapping layers.",
      },
      {
        heading: "Zikola's multi-tenant platform",
        body: "FastAPI, PostgreSQL with forced row-level security, Redis, a durable worker for webhooks and outbound messages, encrypted tenant credentials, and a React admin console. A client is onboarded from a storefront URL alone, and the LLM reaches the catalog only through a fixed tool registry. This is a team repository owned by another account, so I describe its design, not my share of it.",
      },
    ],
    stack: [
      { name: "WhatsApp Cloud API", role: "Messaging channel" },
      { name: "FastAPI, LangGraph", role: "Webhook server and agent graph" },
      { name: "Playwright, SQLite, Chroma", role: "Scraping, structured catalog, semantic search" },
      { name: "OpenRouter (Gemini 2.5 Pro)", role: "Open-question answers in the catalog bot" },
      { name: "PostgreSQL, Redis, React", role: "Platform storage, state and admin console" },
    ],
    challenges: [
      { challenge: "Wrong images and invented URLs", solution: "Deterministic tools for everything exact; the model never types a URL, price or image link." },
      { challenge: "Page-wide scraping picked up other products' images", solution: "Gallery-scoped extraction covering both of the store's image path shapes." },
    ],
    results: ["63 of 63 catalog products captured with complete fields in the last recorded run."],
    limitations: [
      "The catalog bot advises and links; checkout happens on the website. Style and shape facets still derive partly from product names.",
      "Which merchant each demo line below belongs to is not stated on this page.",
    ],
    next: [],
    links: [],
    contribution:
      "I authored the catalog bot. My role on the Zikola platform is documented only by my CV, which lists integrating WhatsApp APIs into the conversational agent.",
    role: "Authored the catalog bot; WhatsApp API integration on the Zikola platform.",
    outcome: "Catalog bot captured 63 of 63 store products with complete fields in its last recorded run.",
  },
  {
    slug: "elara-tts-egyptian-arabic",
    title: "Elara-TTS: Egyptian Arabic speech synthesis",
    kind: "Elara · speech AI",
    group: "personal",
    status: "Public repository",
    summary:
      "Spark-TTS (0.5B) adapted to Egyptian Arabic with a 14-hour curated dataset, a number, currency and time normalization engine, and discrete audio tokens.",
    tags: ["Spark-TTS", "Unsloth", "Wav2Vec2", "BiCodec", "faster-whisper"],
    overview:
      "The text-to-speech engine for the Elara educational platform. It teaches a general TTS model to speak Egyptian Arabic, a non-standardized dialect, with a pipeline focused on data quality, linguistic normalization and memory-efficient fine-tuning.",
    problem:
      "A TTS model reads exactly what it is given. Egyptian Arabic text is full of digits, symbols and currencies that are spoken differently than written, and there is no clean standardized corpus to train on.",
    flowTitle: "Training pipeline",
    flow: [
      { title: "Raw audio", note: "Standardized to 16 kHz mono WAV" },
      { title: "Segment", note: "faster-whisper large-v3 + VAD, 1.5–15 s chunks" },
      { title: "Normalize", note: "Egyptian numbers, currency, time" },
      { title: "Tokenize", note: "Wav2Vec2 features → BiCodec semantic + global tokens" },
      { title: "Fine-tune", note: "Spark-TTS 0.5B via Unsloth, bf16" },
    ],
    samples: [
      { src: "audio/elara-sample-1.mp3", text: "من بين كل عشرين شخصة حواليك هتلاقي شخص منهم مصاب", note: "Sample 1 · input text as shown in the notebook" },
      { src: "audio/elara-sample-2.mp3", text: "وبتلاقوا صعوبة في اتخاذ القرارات اللي تخص الاستثمارات بتاعتكم", note: "Sample 2 · input text as shown in the notebook" },
    ],
    proof: {
      src: "img/elara-notebook-proof.jpg",
      alt: "Colab notebook TEST_ELARA running generate_elara_speech on an Arabic input text, logging 32 global tokens and 186 semantic tokens, with an audio player",
      caption: "Frame from a screen recording of my test notebook: Arabic text goes in, the model generates global and semantic tokens, and the notebook detokenizes them into audio.",
    },
    cats: ["Voice"],
    motif: "wave",
    oneLine: "About 18,900 Egyptian Arabic samples; generated audio is on the page.",
    implementation: [
      {
        heading: "Dataset",
        body: "A curated 14-hour Egyptian speech dataset (about 18,900 samples). Audio was transcribed and sliced with faster-whisper large-v3; a VAD filter (500 ms minimum silence) trimmed dead air, and chunks were limited to 1.5–15 seconds for stable attention. Metadata uses a pipe-separated CSV to avoid clashes with Arabic punctuation.",
      },
      {
        heading: "Egyptian normalization engine",
        body: "Digits are expanded into their Egyptian spoken forms, currencies (EGP, USD, EUR) get correct singular, dual and plural forms depending on the preceding number, and clock times become natural conversational phrases.",
      },
      {
        heading: "Discrete audio tokens",
        body: "Hidden states from Wav2Vec2 layers 11, 14 and 16 feed BiCodec tokenization, producing semantic tokens (content and pronunciation) and global tokens (speaker timbre and prosody). Audio is upsampled to 24 kHz to match the tokenizer.",
      },
      {
        heading: "Fine-tuning strategy",
        body: "Full fine-tuning was chosen over LoRA to change the model's phonetic representations rather than overlay an accent. Unsloth's FastModel cuts VRAM use, bf16 is used where hardware allows to counter NaN losses, and the SFT prompt combines normalized text with global and semantic tokens inside control tags.",
      },
    ],
    stack: [
      { name: "Spark-TTS (0.5B)", role: "Base text-to-speech model" },
      { name: "Unsloth", role: "Memory-efficient fine-tuning" },
      { name: "Wav2Vec2 + BiCodec", role: "Acoustic features and discrete tokenization" },
      { name: "faster-whisper", role: "Transcription and segmentation with VAD" },
    ],
    challenges: [
      { challenge: "Dialect text is spoken differently than written", solution: "A custom normalization engine for numbers, currency pluralization and time formats." },
      { challenge: "Silence and long clips destabilize training", solution: "VAD trimming plus strict 1.5–15 s duration filtering." },
      { challenge: "NaN losses and limited GPU memory", solution: "bf16 precision where supported and Unsloth optimizations." },
    ],
    results: ["Dataset of roughly 18,900 samples built from 14 hours of Egyptian speech, used as the speech engine of the Elara platform per the repository."],
    limitations: ["The repository does not publish objective or listening-test scores (e.g. MOS), so no quality figure is claimed here."],
    next: [],
    links: [
      { label: "View source code", href: "https://github.com/Eslamusamaaa/Elara-TTS-Egyptian" },
      {
        label: "LinkedIn write-up",
        href: "https://www.linkedin.com/posts/eslam-osama-b30a4631b_machinelearning-nlp-texttospeech-ugcPost-7439014881602871296-RpCg",
      },
    ],
    contribution: "Dataset curation, normalization engine and fine-tuning pipeline, as listed on my CV and documented in the repository owned by my GitHub account.",
  },
  {
    slug: "luna16-lung-nodule-detection",
    title: "LUNA16 3D pulmonary nodule detection",
    kind: "Computer vision · medical imaging",
    group: "personal",
    status: "Public repository, false-positive reduction in progress",
    summary:
      "A three-stage 3D pipeline on 888 CT scans: classical lung segmentation, a high-recall DenseNet-121 candidate detector, and a second DenseNet-121 for false-positive reduction.",
    tags: ["PyTorch", "DenseNet-121", "3D CT", "NumPy / SciPy"],
    overview:
      "An end-to-end pipeline for detecting pulmonary nodules in 3D CT scans from the public LUNA16 benchmark, from raw volumes through lung masks, patch extraction, two trained classifiers and full-scan sliding-window inference.",
    problem:
      "Nodules are small and rare inside a huge volume. A detector tuned for recall produces many false positives, so a second stage is needed to separate true nodules from look-alikes without losing sensitivity.",
    flowTitle: "Detection pipeline",
    flow: [
      { title: "CT volume", note: "888 scans, converted to Hounsfield Units" },
      { title: "Lung mask", note: "7-step classical morphology (NumPy / SciPy)" },
      { title: "Sliding window", note: "64×64×64 voxel patches" },
      { title: "Stage 1", note: "DenseNet-121, low threshold for high recall" },
      { title: "Stage 2", note: "DenseNet-121 false-positive reduction" },
    ],
    diagram: {
      src: "img/luna16-pipeline.jpg",
      alt: "Pipeline diagram in three panels: Stage 0 data acquisition and preprocessing with Stage 1 DenseNet-121 detector training on 64x64x64 patches; Stage 1 full-scan inference with a lung mask, sliding window and a very low threshold producing many candidates; Stage 2 false-positive reduction training with a second DenseNet-121 producing final predictions",
      caption: "The full pipeline: data acquisition and Stage 1 detector training, full-scan inference with a sliding window inside the lung mask, and Stage 2 false-positive reduction.",
      width: 1233,
      height: 848,
    },
    cats: ["Vision"],
    motif: "scan",
    oneLine: "The full detection pipeline is implemented; no final FROC score is claimed.",
    implementation: [
      {
        heading: "Lung segmentation without deep learning",
        body: "HU thresholding at -400, 3D morphological closing, 26-connected component labelling, border-component removal, keeping the two largest lobes, slice-wise hole filling and a 2-voxel dilation so subpleural nodules are not cut off.",
      },
      {
        heading: "DenseNet-121 written from scratch",
        body: "A custom PyTorch implementation (bottleneck layers, dense blocks, transition layers) instead of a pretrained backbone, used for both stages.",
      },
      {
        heading: "Stage 1: candidate detector",
        body: "Trained on 64³ patches with class-weighted binary cross-entropy and a deliberately low decision threshold (0.1–0.3) to maximize recall at the cost of precision.",
      },
      {
        heading: "Stage 2: false-positive reduction",
        body: "Hard negatives mined from Stage 1 false positives train a second DenseNet-121 that learns to reject them.",
      },
    ],
    stack: [
      { name: "PyTorch", role: "Custom DenseNet-121 and training loops" },
      { name: "NumPy / SciPy", role: "Lung segmentation and volume handling" },
      { name: "LUNA16 (LIDC-IDRI)", role: "Public benchmark dataset" },
    ],
    challenges: [
      { challenge: "Extreme class imbalance", solution: "Class-weighted loss and hard-negative mining." },
      { challenge: "Nodules near the pleura get masked out", solution: "Outward dilation of the lung mask." },
    ],
    results: ["The complete pipeline from volumes to full-scan predictions is implemented in the repository."],
    limitations: [
      "The README sets a FROC target (average sensitivity ≥ 0.85) and lists false-positive-reduction improvements as next steps; no final FROC score is published, so none is claimed.",
      "A research project on a public benchmark, not a clinical tool.",
    ],
    next: ["Enhance the false-positive reduction stage and evaluate with FROC at 0.125–8 false positives per scan."],
    links: [{ label: "View source code", href: "https://github.com/Eslamusamaaa/LUNA16-Lung-Nodule-Detection" }],
    contribution: "Repository owned by my GitHub account; listed on my CV as a project I built.",
  },
  {
    slug: "arabic-medical-llm",
    title: "Arabic medical LLM fine-tuning and serving",
    kind: "Generative AI · LLM fine-tuning",
    group: "personal",
    status: "Public repository",
    summary:
      "Qwen2.5-1.5B fine-tuned with LoRA on merged Arabic medical Q&A data, served through an async FastAPI backend with a chat UI.",
    tags: ["Qwen2.5", "LoRA", "Unsloth", "FastAPI"],
    overview:
      "An Arabic medical question-answering assistant built to give cautious, general medical information in Arabic. It is explicitly designed not to diagnose or prescribe.",
    problem:
      "General LLMs are weak at Arabic medical question answering, and medical settings demand conservative behaviour and clear disclaimers.",
    flowTitle: "Request path",
    flow: [
      { title: "Chat UI", note: "Static front end" },
      { title: "POST /api/chat", note: "message, max_tokens, temperature (default 0.2)" },
      { title: "FastAPI", note: "Async backend" },
      { title: "Qwen2.5-1.5B + LoRA", note: "CUDA inference via PyTorch" },
      { title: "Response", note: "Text, elapsed seconds, device" },
    ],
    cats: ["LLM"],
    motif: "tokens",
    oneLine: "Fine-tuned model served through FastAPI with a chat UI; no benchmark scores are claimed.",
    implementation: [
      {
        heading: "Data",
        body: "A merged Arabic medical QA dataset with EDA and preprocessing: missing-value handling, Arabic text normalization and instruction/output length analysis to set tokenization limits.",
      },
      {
        heading: "Fine-tuning",
        body: "LoRA fine-tuning with Unsloth and the Hugging Face stack (Transformers, PEFT, TRL) on Lightning AI Studios.",
      },
      {
        heading: "Serving",
        body: "A FastAPI backend that loads the model with automatic device placement and returns the answer plus latency and device metadata.",
      },
    ],
    stack: [
      { name: "Qwen2.5-1.5B", role: "Base model" },
      { name: "Unsloth, PEFT, TRL", role: "LoRA fine-tuning" },
      { name: "FastAPI", role: "Inference API" },
      { name: "PyTorch / CUDA", role: "Model execution" },
    ],
    challenges: [
      { challenge: "Safety in a medical domain", solution: "Low default temperature, informational-only framing and an explicit disclaimer; no diagnosis or prescriptions." },
    ],
    results: ["The full FastAPI backend and chat front end are in the repository."],
    limitations: ["No benchmark scores are published in the repository. Informational and educational use only."],
    next: [],
    links: [{ label: "View source code", href: "https://github.com/Eslamusamaaa/Medical-LLM-Finetuning" }],
    contribution: "Repository owned by my GitHub account; listed on my CV.",
  },
  {
    slug: "elara-ecosystem",
    title: "Elara: AI-powered educational ecosystem",
    kind: "Multi-module system · LLM, RAG, speech, ML",
    group: "personal",
    status: "One public repository; other modules not publicly visible",
    summary:
      "An educational platform with several AI modules: Egyptian Arabic TTS, an LLM cognitive evaluation engine, a RAG learning assistant and student-performance analytics.",
    tags: ["QLoRA", "vLLM", "FAISS", "Random Forest"],
    overview:
      "Elara combines several AI components around one learning product. Elara-TTS has its own page; this page covers the remaining modules.",
    problem: "Instructors need to understand where students struggle, and students need answers grounded in their course material.",
    flowTitle: "Module map",
    flowCaveat: "Modules listed on my CV and, for Student KPIs, its public README.",
    flow: [
      { title: "Elara-TTS", note: "Egyptian Arabic speech" },
      { title: "Cognitive evaluation", note: "Fine-tuned Qwen2.5-14B reports" },
      { title: "RAG assistant", note: "Cited, course-grounded answers" },
      { title: "Student KPIs", note: "Performance level classifier" },
    ],
    cats: ["LLM", "Voice"],
    motif: "graph",
    oneLine: "Four modules around one learning product; module details come from my CV.",
    implementation: [
      {
        heading: "LLM cognitive evaluation engine",
        body: "Qwen2.5-14B fine-tuned with QLoRA (4-bit NF4) on 3,946 sessions, deployed on Modal with vLLM and guided JSON decoding to produce schema-validated reports on student misconceptions. Source: my CV; repository not publicly visible.",
      },
      {
        heading: "RAG learning assistant",
        body: "An ingestion pipeline with recursive chunking and FAISS vector retrieval so LLM answers are grounded in course materials with source citations. Source: my CV; repository not publicly visible.",
      },
      {
        heading: "Student KPIs classifier",
        body: "A Random Forest classifier maps 11 learning KPIs (accuracy, hint usage, time per question, learning velocity and others) to five performance levels, enabling adaptive hints. It started from 300 records from app logs and was augmented to roughly 90–100k records with noise and about 12% contradictory edge cases.",
      },
    ],
    stack: [
      { name: "Qwen2.5-14B, QLoRA", role: "Cognitive evaluation model" },
      { name: "Modal + vLLM", role: "Serving with guided JSON decoding" },
      { name: "FAISS", role: "Vector retrieval for RAG" },
      { name: "scikit-learn", role: "Student KPI classifier" },
    ],
    challenges: [{ challenge: "Reliable structured output from an LLM", solution: "Guided JSON decoding in vLLM so reports validate against a schema." }],
    results: ["The Student KPIs README reports 95% accuracy on its test data."],
    limitations: ["That 95% is measured on data that includes synthetic augmentation of a 300-record seed set, so it should not be read as real-world accuracy."],
    next: [],
    links: [
      { label: "Student KPIs source code", href: "https://github.com/Eslamusamaaa/Student-KPIs-" },
      { label: "Elara-TTS case study", href: "#/projects/elara-tts-egyptian-arabic" },
    ],
    contribution: "Modules as listed on my CV; the Student KPIs and Elara-TTS repositories are owned by my GitHub account.",
  },
  {
    slug: "building-energy-digital-twin",
    title: "Building energy digital twin",
    kind: "Machine learning · forecasting · full-stack dashboard",
    group: "personal",
    status: "Public repository",
    summary:
      "XGBoost models predict hourly HVAC, lighting and plug-load energy for a smart building, served by a Flask API to a React dashboard with what-if scenarios and an efficiency optimizer.",
    tags: ["XGBoost", "Flask", "React", "Time series"],
    overview:
      "A digital twin of a smart building. It predicts hourly energy use per sub-system, simulates scenarios such as a heatwave, remote work or an energy crisis, and ranks efficiency strategies by energy and cost saved. Everything is explorable in a five-tab dashboard.",
    problem:
      "Facility managers want to know what a change in weather, occupancy or tariff will do to consumption and cost before it happens, and which efficiency measure is worth doing first.",
    flowTitle: "How the twin works",
    flowCaveat: "Total energy in the data is exactly HVAC + lighting + plug + other, so the total is a sum of the three model outputs plus the base load; no extra model is needed.",
    flow: [
      { title: "Inputs", note: "Weather, occupancy, tariff and calendar features" },
      { title: "Three XGBoost models", note: "One each for HVAC, lighting and plug loads" },
      { title: "Total energy", note: "Sum of the three predictions plus the base load, in Wh" },
      { title: "Scenarios and optimizer", note: "Cost, what-if simulation and ranked efficiency strategies" },
      { title: "Flask API", note: "Predict, simulate, compare, optimize, history, health" },
      { title: "React dashboard", note: "Live sensors, predictions, simulation, optimization, analytics" },
    ],
    cats: ["ML"],
    motif: "grid",
    oneLine: "Per-system energy forecasts with scenarios and an optimizer; trained on synthetic data.",
    implementation: [
      {
        heading: "Data",
        body: "A seeded synthetic hourly dataset for 2022 to 2025 with calendar, weather, occupancy, thermal, lighting and plug-load columns. Because the generator is seeded, the same file is produced every run.",
      },
      {
        heading: "Models and evaluation",
        body: "Three XGBoost regressors, one per sub-system. The split is chronological, not random: train 2022 to 2023, validation 2024 for early stopping and test 2025, which is the honest choice for a time series.",
      },
      {
        heading: "One definition of the physics",
        body: "A single recompute_physics() function defines the derived columns (temperature deviation, HVAC load estimate, occupancy interaction, ratios) for the dataset, the simulator and the optimizer, so training and serving agree and a scenario updates every dependent feature.",
      },
      {
        heading: "API and dashboard",
        body: "A Flask API exposes sensor, predict, simulate, comparison, optimize and historical endpoints with nine scenarios (baseline, heatwave, cold snap, high occupancy, remote work, energy crisis, green mode, solar peak, peak demand). A React and Recharts dashboard reads it.",
      },
      {
        heading: "Optimizer",
        body: "Efficiency strategies act on model inputs (set-points, load estimates, usage factors); the LED upgrade is a lighting multiplier applied after prediction. Each is scored on annual energy and cost.",
      },
    ],
    stack: [
      { name: "XGBoost, scikit-learn", role: "Per-system regression models" },
      { name: "pandas", role: "Data generation and feature engineering" },
      { name: "Flask, Flask-CORS", role: "Prediction and simulation API" },
      { name: "React, Vite, Recharts", role: "Dashboard" },
    ],
    challenges: [
      { challenge: "Training and serving drifting apart", solution: "One shared feature definition used by training, the API, the simulator and the optimizer." },
      { challenge: "Leaking the future in a time series", solution: "A chronological train, validation and test split instead of a random one." },
    ],
    results: [
      "On the held-out year 2025: HVAC R² 0.998, lighting 0.665, plug loads 0.801, and total energy R² 0.9965 with a mean absolute error of about 13,774 Wh.",
      "Lighting and plug loads are noisier in the generator (35% multiplicative noise on lighting), which caps their R².",
    ],
    limitations: [
      "The data is synthetic, so these numbers show how well the models recover the generator, not accuracy on a real building.",
      "In this data HVAC energy does not depend on the indoor set-point, so the HVAC set-point strategy shows about 0% saving. That is a property of the generator.",
    ],
    next: ["Validate against real building meter data.", "Add uncertainty intervals to the predictions."],
    links: [{ label: "View source code", href: "https://github.com/Eslamusamaaa/Building-Energy-Consumption-Twin-" }],
    contribution: "Repository owned by my GitHub account: data generator, models, API and dashboard.",
  },
  {
    slug: "topic-classification-ag-news",
    title: "News topic classification (AG News)",
    kind: "NLP · classical machine learning · Flask app",
    group: "personal",
    status: "Public repository",
    summary:
      "A four-topic news classifier built end to end: text cleaning, hand-built n-gram language models, a vectorizer and classifier comparison, and a Flask app with calibrated confidence.",
    tags: ["NLP", "TF-IDF", "Linear SVC", "Flask"],
    overview:
      "An NLP project that classifies news into World, Sports, Business and Sci/Tech. It covers preprocessing, manually implemented unigram, bigram and trigram language models, a systematic model comparison and a web app for live predictions.",
    problem:
      "News needs to be routed to topics automatically, and a good project here has to evaluate honestly, without letting sentences of the same article leak between training and validation.",
    flowTitle: "Pipeline",
    flow: [
      { title: "AG News", note: "120,000 training articles and 7,600 test articles, balanced across topics" },
      { title: "Cleaning", note: "Lowercase, strip URLs, emails and numbers, tokenize, remove stop words, lemmatize" },
      { title: "Vectorize", note: "Binary, count and TF-IDF features compared" },
      { title: "Classify", note: "Linear SVC, logistic regression and Naive Bayes compared" },
      { title: "Calibrate", note: "Linear SVC wrapped so the app shows a real probability" },
      { title: "Flask app", note: "Paste a headline, get a topic and confidence" },
    ],
    cats: ["NLP"],
    motif: "tokens",
    oneLine: "TF-IDF with Linear SVC reaches 91.0% on the external test set; evaluated at article level.",
    implementation: [
      {
        heading: "Preprocessing",
        body: "One clean_text() function is used by both training and the app. Descriptions are split into sentences first, and training works on sentences.",
      },
      {
        heading: "Honest evaluation",
        body: "All sentences of one article stay on the same side of the split (GroupShuffleSplit), so validation is independent of training articles. The best vectorizer and classifier pair is chosen on validation data only, and the external test file is used once at the end.",
      },
      {
        heading: "Model comparison",
        body: "Three vectorizers against three classifiers. TF-IDF with Linear SVC was best on validation. The final model is refit on all training sentences and wrapped in CalibratedClassifierCV, so the confidence in the app is a calibrated probability, not a softmax of raw scores.",
      },
      {
        heading: "Manual n-gram language models",
        body: "Unigram, bigram and trigram counts built by hand with Laplace smoothing and scored in log space, since raw probability products underflow on long sentences.",
      },
    ],
    stack: [
      { name: "scikit-learn", role: "Vectorizers, classifiers, calibration" },
      { name: "NLTK", role: "Tokenization, stop words, lemmatization" },
      { name: "NumPy, pandas", role: "Data handling and n-gram models" },
      { name: "Flask", role: "Web app" },
    ],
    challenges: [
      { challenge: "Sentence-level training can leak across the split", solution: "Group by article so no article appears on both sides." },
      { challenge: "Linear SVC has no probabilities", solution: "Calibrated with CalibratedClassifierCV so the displayed confidence is meaningful." },
    ],
    results: [
      "Best model on validation (TF-IDF with Linear SVC): 88.3%. On the external test set of 7,600 unseen articles: 91.0%.",
      "Business and Sci/Tech are the hardest pair to separate (about 87 to 89% F1); Sports is the easiest (about 96%).",
      "Perplexity on 2,000 unseen sentences: unigram 5,423, bigram 13,963, trigram 33,198.",
    ],
    limitations: [
      "Higher-order n-gram models score worse here: with a vocabulary of about 73,000 words, add-one smoothing gives huge probability mass to unseen n-grams. Kneser-Ney or backoff smoothing would reverse the order.",
      "The classifier only knows the four AG News topics and its vocabulary is bag-of-words.",
    ],
    next: ["Better smoothing for the language models.", "Compare against a fine-tuned transformer."],
    links: [{ label: "View source code", href: "https://github.com/Eslamusamaaa/Topic-Classification-" }],
    contribution: "Repository owned by my GitHub account: preprocessing, n-gram models, training, evaluation and the Flask app.",
  },
  {
    slug: "equipment-failure-prediction",
    title: "Equipment failure prediction",
    kind: "Predictive maintenance · imbalanced classification · Flask app",
    group: "personal",
    status: "Public repository",
    summary:
      "A Flask app that predicts the type of machine failure from sensor readings on the AI4I 2020 dataset, with the work focused on the rare failure classes.",
    tags: ["Imbalanced data", "Ensembles", "Feature engineering", "Flask"],
    overview:
      "A predictive-maintenance system that takes product type, temperatures, rotational speed, torque and tool wear, and returns a failure type or No Failure, with a stability confidence and a recommended action.",
    problem:
      "In this dataset 96.5% of rows are No Failure, so accuracy is high from the start and says nothing about the failures that matter. The goal is to do well on the rare classes and measure with macro-F1.",
    flowTitle: "Approach",
    flow: [
      { title: "Sensor inputs", note: "Product type, air and process temperature, speed, torque, tool wear" },
      { title: "Feature engineering", note: "Power, wear times torque, overstrain margin, heat-dissipation condition" },
      { title: "Ensemble", note: "RandomForest, ExtraTrees and HistGradientBoosting with oversampling" },
      { title: "Class weights", note: "Per-class probability weights tuned on out-of-fold predictions" },
      { title: "Tool Wear rule", note: "Alert when the model says no failure but wear is 198 minutes or more" },
      { title: "Recommendation", note: "Status, confidence and a maintenance action in the Flask app" },
    ],
    cats: ["ML"],
    motif: "grid",
    oneLine: "Macro-F1 0.81 on five learnable classes; the Tool Wear alert trades precision for recall.",
    implementation: [
      {
        heading: "Imbalance",
        body: "Resampling strategies were compared (random oversampling, SMOTE, undersampling, SMOTE plus undersampling, noise-based augmentation), applied to the train split only so the test split stays untouched.",
      },
      {
        heading: "Physics-based features",
        body: "Failure modes follow physical rules, for example overstrain is wear times torque above a per-type limit. Giving the model those quantities directly lifts Heat Dissipation, Overstrain and Power failure detection.",
      },
      {
        heading: "Ensemble and tuning",
        body: "An ensemble of three tree models with oversampling and per-class probability weights tuned on cross-validation out-of-fold predictions, never on the test set.",
      },
      {
        heading: "One feature definition",
        body: "The app loads the final model and uses the same feature code as training, so serving matches what was evaluated.",
      },
    ],
    stack: [
      { name: "scikit-learn", role: "RandomForest, ExtraTrees, HistGradientBoosting" },
      { name: "Resampling", role: "Oversampling and SMOTE comparison" },
      { name: "pandas", role: "Feature engineering" },
      { name: "Flask", role: "Web form and prediction" },
    ],
    challenges: [
      { challenge: "96.5% of rows are No Failure", solution: "Judge by macro-F1 and per-class F1, and resample only the training split." },
      { challenge: "Tool Wear is not separable from normal operation by sensors alone", solution: "A transparent alert rule on tool wear that trades precision for recall." },
    ],
    results: [
      "Baseline (6 classes) macro-F1 0.61. Final model on 5 classes: macro-F1 0.81 with accuracy 0.984.",
      "Per class F1: Heat Dissipation 1.00, Power 1.00, Overstrain 0.97, No Failure 0.99.",
      "With the Tool Wear alert the app catches 8 of 9 Tool Wear failures (recall 0.89), at about 157 false alarms on the test set and macro-F1 about 0.80.",
    ],
    limitations: [
      "Random Failures (18 rows) are random by construction in this dataset and cannot be predicted, so they are excluded; on all 6 classes the best result is about 0.66.",
      "Tool Wear has only 9 test samples, so its metrics move by a few points if the split changes.",
    ],
    next: ["Evaluate on a different predictive-maintenance dataset.", "Make the alert threshold adjustable in the interface."],
    links: [{ label: "View source code", href: "https://github.com/Eslamusamaaa/equipment_failure_Prediction" }],
    contribution: "Repository owned by my GitHub account: resampling study, features, model and Flask app.",
  },
  {
    slug: "sleep-quality-consultant",
    title: "Personalized sleep quality consultant",
    kind: "Machine learning · what-if simulation · Flask app",
    group: "personal",
    status: "Public repository",
    summary:
      "A Random Forest sleep-quality predictor with a smooth score, a what-if simulation of lifestyle changes and a personalised action plan, behind a custom web interface.",
    tags: ["Random Forest", "Synthetic data", "Flask", "What-if analysis"],
    overview:
      "A web app that analyses daily habits and returns a predicted sleep-quality score from 1 to 9, a breakdown of the habits, a simulation of which single change helps most, and an action plan tailored to the numbers and occupation.",
    problem:
      "People get raw health numbers from wearables but no clear answer to what to change tonight. The app turns the inputs into a score and ranked, concrete changes.",
    flowTitle: "How a consultation is produced",
    flow: [
      { title: "Habits form", note: "Personal, work, sleep and health metrics" },
      { title: "Random Forest", note: "Probability for each quality class from 1 to 9" },
      { title: "Smooth score", note: "Probability-weighted average of the classes" },
      { title: "What-if", note: "Each change scored alone: sleep +1 h, stress -2, caffeine -100 mg, screen time -2 h" },
      { title: "Action plan", note: "Rule-based advice from the numbers and occupation" },
    ],
    cats: ["ML"],
    motif: "graph",
    oneLine: "88.0% accuracy on unseen real rows; about 98% of the training rows are synthetic.",
    implementation: [
      {
        heading: "The score",
        body: "The model is a classifier, but the number shown is the probability-weighted average of all classes. Quality classes are ordered, and a smooth score lets the what-if simulation show the effect of a small change even when the most likely class does not move.",
      },
      {
        heading: "Data",
        body: "The original dataset has 374 rows, only 132 unique, with scores 4 to 9. Three behavioural columns were added (caffeine intake, daily work hours, screen time) and about 24,300 records were generated to cover scores 1 to 3 and balance all nine classes. Every row has an Is Synthetic flag and generation is seeded.",
      },
      {
        heading: "Evaluation on real rows",
        body: "Because most rows are synthetic, a random split mostly measures how well the model relearns the generator (93.8%). So the model is also tested on real rows it never saw, over 5 repeated hold-outs, with the real rows given a higher sample weight in training.",
      },
      {
        heading: "Advice and simulation",
        body: "A predictor module validates input and runs the what-if simulation; an advice module produces the analysis and action plan text from rules.",
      },
    ],
    stack: [
      { name: "scikit-learn", role: "Random Forest, 200 trees, depth 15" },
      { name: "pandas, NumPy", role: "Data preparation and generation" },
      { name: "Flask", role: "Serving the UI and /predict" },
      { name: "HTML, CSS, JavaScript", role: "Custom front end" },
    ],
    challenges: [
      { challenge: "Almost all training data is synthetic", solution: "Flag synthetic rows, weight real rows higher and evaluate separately on held-out real rows." },
      { challenge: "A class label does not respond to small habit changes", solution: "Use the probability-weighted score so the what-if effects are visible." },
    ],
    results: [
      "On unseen real rows, the model trained on synthetic plus weighted real rows reaches 88.0% accuracy, 96.5% within one point and a mean absolute error of 0.16, against 26.5% for synthetic rows only.",
      "A random split of all data gives 93.8%, reported for reference only.",
    ],
    limitations: [
      "The synthetic rows are rule-generated, so the model reflects those rules, not clinical sleep science.",
      "Scores 1 to 3 exist only in synthetic data and cannot be validated on real people. Hold-out sets are small, about 40 rows each.",
      "Not a medical device and does not diagnose sleep disorders; the advice texts are generic rules.",
    ],
    next: ["Collect more real sleep records.", "Connect to wearable data sources."],
    links: [{ label: "View source code", href: "https://github.com/Eslamusamaaa/Sleeping-Quality-Prediction-Optimization" }],
    contribution: "Repository owned by my GitHub account: data generation, model, evaluation, advice engine, API and interface.",
  },
];

export const zikolaWork: { title: string; body: string; short: string; slug?: string }[] = [
  { title: "Arabic voice and chat concierge", short: "Real-time Arabic voice assistant with RAG recommendations and order-confirmation calls.", slug: "ai-fragrance-concierge", body: "A real-time voice assistant with RAG recommendations, barge-in, and Vapi-based order-confirmation calls for a retailer." },
  { title: "WhatsApp commerce chatbots", short: "Catalog-grounded WhatsApp sales assistants: guided buttons plus an LLM agent.", slug: "whatsapp-commerce-bots", body: "Catalog-grounded WhatsApp sales assistants on the Meta Cloud API: a button-driven guided flow for exact answers and an LLM agent (LangGraph, tool calling) for open questions, backed by a scraped catalog and a vector index." },
  { title: "Multi-tenant messaging platform", short: "WhatsApp integration on Zikola's multi-tenant commerce messaging platform.", slug: "whatsapp-commerce-bots", body: "WhatsApp integration work on Zikola's multi-tenant commerce messaging platform, where a client is onboarded from a storefront URL and the LLM reaches the catalog only through a fixed tool registry." },
  { title: "Multi-modal conversational agent", short: "Stateful LangGraph agents with RAG and speech, over WhatsApp and the web.", slug: "ai-voice-calling", body: "Stateful agentic workflows with LangGraph and LangChain integrating LLMs, a tailored RAG pipeline and STT/TTS engines, reachable through WhatsApp APIs and web platforms." },
  { title: "Real-time meeting intelligence", short: "Chrome extension audio capture with word alignment to attendee names.", slug: "zikola-meeting-assistant", body: "Dual-channel audio capture in a Chrome MV3 extension and a custom word-alignment algorithm that maps diarization tags to attendee names." },
  { title: "Async LLM pipeline", short: "Parallel transcript processing that always returns valid JSON.", slug: "zikola-meeting-assistant", body: "Parallel asyncio processing of multi-hour transcripts with a state-machine auto-repair parser guaranteeing valid JSON." },
  { title: "Security and RBAC", short: "Passkeys, OTPs, multi-tenant roles, offboarding and audit logs.", slug: "zikola-meeting-assistant", body: "WebAuthn passkeys, SHA-256 OTPs, multi-tenant RBAC, automated offboarding, JWT invalidation and immutable audit logging." },
  { title: "Media-buying analytics ETL", short: "Ad-platform CSVs turned into ROAS, CPA, CTR and CPC for n8n agent workflows.", body: "Meta, TikTok and Snapchat CSVs processed into ROAS, CPA, CTR and CPC and fed into n8n AI-agent workflows." },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Machine Learning",
    items: [
      "Scikit-learn", "XGBoost", "TensorFlow / Keras", "Pandas, NumPy",
      "Supervised classification and regression", "Feature engineering", "Model evaluation and validation",
      "Exploratory data analysis", "Data preprocessing and augmentation", "Ensemble methods",
    ],
  },
  {
    group: "Deep Learning",
    items: [
      "PyTorch", "Convolutional networks (DenseNet-121 from scratch)", "Transformer fine-tuning", "Transfer learning",
      "Class-imbalance handling", "Mixed-precision (bf16) training", "GPU memory optimisation", "Training loops and checkpointing",
    ],
  },
  {
    group: "Computer Vision",
    items: [
      "OpenCV", "Image classification", "Object detection", "Keypoint and pose estimation", "Action recognition in video",
      "Image segmentation", "3D medical image processing", "Candidate detection and false-positive reduction",
      "Patch extraction and sliding-window inference", "Image preprocessing and normalisation", "Dataset annotation and augmentation",
    ],
  },
  {
    group: "NLP and Speech",
    items: [
      "Hugging Face Transformers", "NLTK", "Text classification (TF-IDF, n-grams)", "Arabic text normalisation",
      "Embeddings and semantic search", "Speech-to-text and diarization (faster-whisper, Deepgram)",
      "Text-to-speech and voice synthesis (Spark-TTS, ElevenLabs)", "Voice activity detection",
    ],
  },
  {
    group: "Generative AI and Agents",
    items: [
      "LLM fine-tuning (LoRA, QLoRA, Unsloth, PEFT / TRL)", "Prompt engineering", "Retrieval-augmented generation (FAISS, Qdrant, Chroma)",
      "Chunking and retrieval tuning", "Tool and function calling", "Stateful agents (LangGraph, LangChain)",
      "Structured and schema-validated output", "Streaming LLM responses", "LLM serving (vLLM)",
    ],
  },
  {
    group: "Tools and Infrastructure",
    items: [
      "Python, TypeScript, JavaScript", "FastAPI, Flask, Node.js, Express", "REST APIs, WebSockets and webhooks",
      "Async and concurrent programming", "PostgreSQL, SQLite, SQLAlchemy, Redis", "OAuth, JWT, passkeys and role-based access",
      "Docker, Vercel, Modal", "CI/CD with GitHub Actions", "n8n workflow automation and AI-agent workflows", "Salla and WhatsApp Cloud API integrations", "Git",
    ],
  },
];

export const education = {
  degree: "Bachelor of Computer Science",
  school: "Faculty of Computers and Information, Mansoura University, Egypt",
  years: "2022 – 2026",
  status: "Graduated",
};

export const training = [
  { title: "Machine Learning Diploma, CSkilled Academy", when: "Sep 2026" },
  { title: "Data Science & Web Development, MCIT", when: "Jul–Aug 2025 · 120 hrs" },
  { title: "Data Analysis & Freelancing, ITIDA & NTI", when: "Aug–Sep 2024 · 120 hrs" },
];

export const hero = {
  kicker: "AI Engineer · Egypt",
  title: "I design and build AI systems that solve real-world problems.",
  lede:
    "From LLM agents and retrieval-augmented generation to speech models, computer vision and classic machine learning, I take AI from prototype to working product. Currently an AI Engineer at Zikola.",
};

export const about = [
  "I'm Eslam Usama, an AI Engineer focused on building intelligent systems that turn complex problems into practical AI-powered solutions. My interests span Machine Learning, Deep Learning, Computer Vision, Natural Language Processing and Generative AI.",
  "I studied Computer Science at the Faculty of Computers and Information, Mansoura University (2022 to 2026), and I have worked as an AI Engineer at Zikola since April 2026.",
  "Much of my recent work is in Arabic: Saudi Arabic voice agents and assistants for online stores, and an Egyptian Arabic text-to-speech model.",
];

/** Skills mapped to projects by matching keywords against each project's tags, stack and kind. */
export const skillMap: { skill: string; keys: string[] }[] = [
  { skill: "Machine learning", keys: ["scikit", "xgboost", "random forest", "classifier", "regression"] },
  { skill: "Deep learning", keys: ["pytorch", "densenet", "keras", "neural", "fine-tun"] },
  { skill: "Computer vision", keys: ["densenet", "3d ct", "vision", "segmentation"] },
  { skill: "NLP", keys: ["nlp", "arabic", "text", "token"] },
  { skill: "LLM agents", keys: ["langgraph", "agent", "tool calling", "llm"] },
  { skill: "RAG", keys: ["rag", "retrieval", "faiss", "qdrant", "chroma"] },
  { skill: "Vector databases", keys: ["faiss", "qdrant", "chroma"] },
  { skill: "Prompt engineering", keys: ["prompt", "wording", "persona"] },
  { skill: "LLM fine-tuning", keys: ["lora", "qlora", "unsloth", "fine-tun"] },
  { skill: "Speech-to-text", keys: ["deepgram", "whisper", "speech recognition"] },
  { skill: "Text-to-speech", keys: ["tts", "elevenlabs", "spark-tts", "speech synthesis", "voices"] },
  { skill: "Model serving", keys: ["fastapi", "vllm", "modal", "serving", "inference"] },
  { skill: "Data pipelines", keys: ["scrap", "sync", "ingestion", "pipeline", "etl"] },
  { skill: "Evaluation and testing", keys: ["verif", "assertion", "checks", "evaluat"] },
  { skill: "Python", keys: ["python", "fastapi", "pytorch", "flask"] },
  { skill: "PyTorch", keys: ["pytorch"] },
  { skill: "FastAPI", keys: ["fastapi"] },
  { skill: "TypeScript and Node.js", keys: ["typescript", "node.js"] },
  { skill: "PostgreSQL", keys: ["postgres"] },
  { skill: "Docker", keys: ["docker"] },
  { skill: "WhatsApp API", keys: ["whatsapp"] },
  { skill: "Salla API", keys: ["salla"] },
  { skill: "Telephony (Vapi)", keys: ["vapi"] },
];
