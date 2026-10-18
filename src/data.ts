// Content is sourced from the CV, public repository READMEs, and local copies of the Zikola
// project documentation. No private source code, credentials, client data or screenshots with
// customer data are published here. Edit this file to update the site.

export const profile = {
  name: "Eslam Osama Mahmoud",
  shortName: "Eslam Osama",
  title: "AI Engineer",
  location: "Egypt",
  email: "eslamosamamahmoud3@gmail.com",
  phone: "+201095178021", // from the CV
  phoneDisplay: "+20 109 517 8021",
  whatsapp: "https://wa.me/201095178021", // personal number, separate from the bot lines
  github: "https://github.com/Eslamusamaaa",
  linkedin: "https://www.linkedin.com/in/eslam-usamaaa",
  cvUrl: "cv/Eslam-Osama-CV.pdf" as string | null, // file lives in /public/cv
};

// Saudi mobile numbers are 9 digits starting with 5; wa.me needs country code + digits only.
const wa = (local: string) => `https://wa.me/966${local.replace(/\D/g, "")}`;

export const whatsappBots = [
  {
    id: "line-1",
    title: "Commerce bot · Line 1",
    number: "57 017 9909",
    href: wa("57 017 9909"),
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
      "Repository history shows my commits throughout; I worked on the backend, catalog adapter, quiz engine and merchant tooling described above.",
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
];

export const otherProjects: { title: string; blurb: string; tags: string[]; href: string }[] = [
  {
    title: "Building energy digital twin",
    blurb:
      "Hierarchical regression: XGBoost sub-models for HVAC, lighting and plug loads feed a Keras neural-network meta-learner, served by a Flask API with scenario simulation and a React dashboard. Trained on a synthetic dataset.",
    tags: ["XGBoost", "Keras", "Flask", "React"],
    href: "https://github.com/Eslamusamaaa/Building-Energy-Consumption-Twin-",
  },
  {
    title: "Topic classification (AG News)",
    blurb: "TF-IDF with Naive Bayes and custom n-grams classifying news into four topics, with a Flask web app.",
    tags: ["NLP", "scikit-learn", "Flask"],
    href: "https://github.com/Eslamusamaaa/Topic-Classification-",
  },
  {
    title: "Equipment failure prediction",
    blurb: "Random forest classifier with a Flask front end.",
    tags: ["scikit-learn", "Flask"],
    href: "https://github.com/Eslamusamaaa/equipment_failure_Prediction",
  },
  {
    title: "Sleep quality prediction",
    blurb: "Random forest model with a web interface for analyzing and improving sleep quality.",
    tags: ["scikit-learn", "JavaScript"],
    href: "https://github.com/Eslamusamaaa/Sleeping-Quality-Prediction-Optimization",
  },
];

export const zikolaWork = [
  { title: "Multi-modal conversational agent", body: "Stateful agentic workflows with LangGraph and LangChain integrating LLMs, a tailored RAG pipeline and STT/TTS engines, reachable through WhatsApp APIs and web platforms." },
  { title: "Real-time meeting intelligence", body: "Dual-channel audio capture in a Chrome MV3 extension and a custom word-alignment algorithm that maps diarization tags to attendee names." },
  { title: "Async LLM pipeline", body: "Parallel asyncio processing of multi-hour transcripts with a state-machine auto-repair parser guaranteeing valid JSON." },
  { title: "Security and RBAC", body: "WebAuthn passkeys, SHA-256 OTPs, multi-tenant RBAC, automated offboarding, JWT invalidation and immutable audit logging." },
  { title: "Media-buying analytics ETL", body: "Meta, TikTok and Snapchat CSVs processed into ROAS, CPA, CTR and CPC and fed into n8n AI-agent workflows." },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "LLMs and agents", items: ["LangGraph", "LangChain", "RAG", "FAISS", "Qdrant", "Chroma", "QLoRA / LoRA", "PEFT / TRL", "vLLM", "Unsloth"] },
  { group: "Speech and NLP", items: ["Deepgram", "ElevenLabs", "Vapi", "Spark-TTS", "Wav2Vec2", "faster-whisper", "Hugging Face Transformers", "NLTK"] },
  { group: "ML and vision", items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "XGBoost", "OpenCV"] },
  { group: "Backend and data", items: ["FastAPI", "Flask", "Node.js", "PostgreSQL", "SQLAlchemy", "Redis", "Docker", "Vercel"] },
  { group: "Integrations", items: ["WhatsApp Cloud API", "Salla API", "n8n", "WebAuthn", "Chrome MV3", "Webhooks", "React"] },
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "C", "C++", "PHP", "Arabic (native)", "English (fluent)"] },
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
