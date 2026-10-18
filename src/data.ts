// All content here is sourced from the CV and the public repository READMEs.
// Edit this file to update the site. Set `cvUrl` once you approve publishing a CV file.

export const profile = {
  name: "Eslam Osama Mahmoud",
  shortName: "Eslam Osama",
  title: "AI Engineer",
  location: "Mansoura, Egypt",
  email: "eslamosamamahmoud3@gmail.com",
  github: "https://github.com/Eslamusamaaa",
  linkedin: "https://www.linkedin.com/in/eslam-usamaaa",
  cvUrl: null as string | null, // e.g. "cv/Eslam-Osama-CV.pdf" placed in /public
};

export type Link = { label: string; href: string };
export type Step = { title: string; note: string };

export type Project = {
  slug: string;
  title: string;
  kind: string;
  status: string;
  summary: string;
  tags: string[];
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
    slug: "zikola-conversational-agent",
    title: "Multi-modal conversational agent at Zikola",
    kind: "Professional work · case study",
    status: "Employer project — described at a high level",
    summary:
      "Stateful agentic workflows that combine LLMs, a tailored RAG pipeline and speech engines, reachable over WhatsApp and web platforms for real-time, preference-based customer recommendations.",
    tags: ["LangGraph", "LangChain", "RAG", "STT / TTS", "WhatsApp APIs"],
    overview:
      "At Zikola I build AI systems that talk to customers where they already are. The flagship piece is a multi-modal conversational agent that holds state across a conversation, retrieves grounded context through a RAG pipeline, understands and produces speech, and delivers recommendations over WhatsApp and web channels.",
    problem:
      "Customer-facing recommendations are only useful when they reflect the individual's stated preferences and arrive in the channel the customer actually uses. That means the system has to remember conversation state, ground answers in business data, and handle both text and voice.",
    flowTitle: "Conversation path (conceptual)",
    flowCaveat:
      "Illustrative flow drawn from the one-paragraph summary of this work. The source code is private and has not been inspected for this page, so component-level details are intentionally omitted.",
    flow: [
      { title: "Channel", note: "WhatsApp API or web platform" },
      { title: "Speech in", note: "STT for voice messages" },
      { title: "Agent", note: "LangGraph stateful workflow over LangChain" },
      { title: "Grounding", note: "Tailored RAG pipeline + LLM" },
      { title: "Speech out", note: "TTS where voice is needed" },
      { title: "Reply", note: "Preference-based recommendation" },
    ],
    implementation: [
      {
        heading: "Agentic workflow",
        body: "Engineered stateful agent graphs with LangGraph and LangChain, so multi-turn conversations keep their context and steps are explicit rather than hidden inside a single prompt.",
      },
      {
        heading: "Channels",
        body: "Integrated WhatsApp APIs and web platforms so the same agent serves customers in real time across both.",
      },
      {
        heading: "Speech",
        body: "Integrated STT and TTS engines to make the agent multi-modal rather than text-only.",
      },
    ],
    stack: [
      { name: "LangGraph / LangChain", role: "Stateful agent orchestration" },
      { name: "RAG pipeline", role: "Grounding answers in retrieved context" },
      { name: "LLMs", role: "Reasoning and response generation" },
      { name: "STT / TTS engines", role: "Voice input and output" },
      { name: "WhatsApp APIs", role: "Messaging channel" },
    ],
    challenges: [],
    results: [],
    limitations: [
      "No public repository or demo exists for this work, and no performance figures are published here.",
    ],
    next: [],
    links: [],
    contribution:
      "Engineered the agentic workflows and the integrations described above as AI Engineer at Zikola (April 2026 – present).",
  },
  {
    slug: "elara-tts-egyptian-arabic",
    title: "Elara-TTS: Egyptian Arabic speech synthesis",
    kind: "Elara ecosystem · speech AI",
    status: "Public repository",
    summary:
      "Spark-TTS (0.5B) adapted to Egyptian Arabic using a 14-hour curated dataset, a custom number/currency/time normalization engine and discrete audio tokens.",
    tags: ["Spark-TTS", "Unsloth", "Wav2Vec2", "BiCodec", "faster-whisper"],
    overview:
      "The text-to-speech engine for the Elara educational platform. It teaches a general TTS model to speak Egyptian Arabic, a non-standardized dialect, with a pipeline focused on data quality, linguistic normalization and memory-efficient fine-tuning.",
    problem:
      "A TTS model reads exactly what it is given. Egyptian Arabic text is full of digits, symbols and currencies that are spoken differently than they are written, and there is no clean standardized corpus to train on.",
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
        body: "Hidden states from Wav2Vec2 layers 11, 14 and 16 feed BiCodec tokenization, which produces semantic tokens (content and pronunciation) and global tokens (speaker timbre and prosody). Audio is upsampled to 24 kHz to match the tokenizer.",
      },
      {
        heading: "Fine-tuning strategy",
        body: "Full fine-tuning was chosen over LoRA to change the model's phonetic representations rather than only overlay an accent. Unsloth's FastModel cuts VRAM use, bf16 is used where hardware allows to counter NaN losses, and the SFT prompt combines normalized text with global and semantic tokens inside control tags.",
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
    results: [
      "Dataset of roughly 18,900 samples built from 14 hours of Egyptian speech.",
      "Fine-tuned model used as the speech engine of the Elara platform, per the repository.",
    ],
    limitations: [
      "The repository does not publish objective or listening-test scores (e.g. MOS), so no quality figure is claimed here.",
    ],
    next: [],
    links: [
      { label: "View source code", href: "https://github.com/Eslamusamaaa/Elara-TTS-Egyptian" },
      {
        label: "LinkedIn write-up",
        href: "https://www.linkedin.com/posts/eslam-osama-b30a4631b_machinelearning-nlp-texttospeech-ugcPost-7439014881602871296-RpCg",
      },
    ],
    contribution:
      "Dataset curation, normalization engine and fine-tuning pipeline, as listed on my CV and documented in the repository (owned by my GitHub account).",
  },
  {
    slug: "luna16-lung-nodule-detection",
    title: "LUNA16 3D pulmonary nodule detection",
    kind: "Computer vision · medical imaging",
    status: "Public repository — work in progress on false-positive reduction",
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
        heading: "Stage 1 — candidate detector",
        body: "Trained on 64³ patches with class-weighted binary cross-entropy and a deliberately low decision threshold (0.1–0.3) to maximize recall at the cost of precision.",
      },
      {
        heading: "Stage 2 — false-positive reduction",
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
    results: [
      "Complete pipeline from DICOM-derived volumes to full-scan predictions is implemented in the repository.",
    ],
    limitations: [
      "The README sets a FROC target (average sensitivity ≥ 0.85) and lists false-positive-reduction improvements as next steps; no final FROC score is published, so none is claimed here.",
      "A research project on a public benchmark — not a clinical tool.",
    ],
    next: ["Enhance the false-positive reduction stage and evaluate with FROC at 0.125–8 false positives per scan."],
    links: [{ label: "View source code", href: "https://github.com/Eslamusamaaa/LUNA16-Lung-Nodule-Detection" }],
    contribution: "Repository owned by my GitHub account; listed on my CV as a project I built.",
  },
  {
    slug: "arabic-medical-llm",
    title: "Arabic medical LLM fine-tuning & deployment",
    kind: "Generative AI · LLM fine-tuning",
    status: "Public repository + public model weights",
    summary:
      "Qwen2.5-1.5B fine-tuned with LoRA on merged Arabic medical Q&A data and served through an async FastAPI backend with a chat UI.",
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
    results: ["Model weights are published on Hugging Face and the full backend/front end are in the repository."],
    limitations: ["No benchmark scores are published in the repository. Informational and educational use only."],
    next: [],
    links: [
      { label: "View source code", href: "https://github.com/Eslamusamaaa/Medical-LLM-Finetuning" },
      { label: "View model (Hugging Face)", href: "https://huggingface.co/hagora-30/qwen2.5-1.5B-medical-arabic" },
    ],
    contribution: "Repository owned by my GitHub account; listed on my CV.",
  },
  {
    slug: "elara-ecosystem",
    title: "Elara: AI-powered educational ecosystem",
    kind: "Multi-module system · LLM, RAG, speech, ML",
    status: "Mixed — one public repository, other modules not publicly visible",
    summary:
      "An educational platform with several AI modules: Egyptian Arabic TTS, an LLM cognitive evaluation engine, a RAG learning assistant and student-performance analytics.",
    tags: ["QLoRA", "vLLM", "FAISS", "Random Forest"],
    overview:
      "Elara combines several AI components around one learning product. Elara-TTS has its own page. This page covers the remaining modules.",
    problem:
      "Instructors need to understand where students struggle, and students need answers grounded in their course material.",
    flowTitle: "Module map",
    flowCaveat: "Summary of modules listed on my CV and, for Student KPIs, its public README.",
    flow: [
      { title: "Elara-TTS", note: "Egyptian Arabic speech" },
      { title: "Cognitive evaluation", note: "Fine-tuned Qwen2.5-14B reports" },
      { title: "RAG assistant", note: "Cited, course-grounded answers" },
      { title: "Student KPIs", note: "Performance level classifier" },
    ],
    implementation: [
      {
        heading: "LLM cognitive evaluation engine",
        body: "Qwen2.5-14B fine-tuned with QLoRA (4-bit NF4) on 3,946 sessions, deployed on Modal with vLLM and guided JSON decoding to produce schema-validated reports on student misconceptions. (Source: CV; repository not publicly visible.)",
      },
      {
        heading: "RAG learning assistant",
        body: "An ingestion pipeline with recursive chunking and FAISS vector retrieval so LLM answers are grounded in course materials with source citations. (Source: CV; repository not publicly visible.)",
      },
      {
        heading: "Student KPIs classifier",
        body: "A Random Forest classifier maps 11 learning KPIs (accuracy, hint usage, time per question, learning velocity and others) to five performance levels from Beginner to Outstanding, enabling adaptive hints. It started from 300 records from app logs and was augmented to roughly 90–100k records with noise and about 12% contradictory edge cases.",
      },
    ],
    stack: [
      { name: "Qwen2.5-14B, QLoRA", role: "Cognitive evaluation model" },
      { name: "Modal + vLLM", role: "Serving with guided JSON decoding" },
      { name: "FAISS", role: "Vector retrieval for RAG" },
      { name: "scikit-learn", role: "Student KPI classifier" },
    ],
    challenges: [
      { challenge: "Reliable structured output from an LLM", solution: "Guided JSON decoding in vLLM so reports validate against a schema." },
    ],
    results: ["The Student KPIs README reports 95% accuracy on its test data."],
    limitations: [
      "That 95% is measured on data that includes synthetic augmentation of a 300-record seed set, so it should not be read as real-world accuracy.",
    ],
    next: [],
    links: [
      { label: "Student KPIs source code", href: "https://github.com/Eslamusamaaa/Student-KPIs-" },
      { label: "Elara-TTS case study", href: "#/projects/elara-tts-egyptian-arabic" },
    ],
    contribution: "Modules as listed on my CV; Student KPIs and Elara-TTS repositories are owned by my GitHub account.",
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
  {
    title: "Real-time meeting intelligence engine",
    body: "Dual-channel audio capture (tab and mic) in a Chrome MV3 extension, with a custom Python word-alignment algorithm (±1.5 s) and DOM metadata parsing that filters audio bleed and maps Deepgram Nova-3 diarization tags to attendee names.",
  },
  {
    title: "Async LLM processing pipeline",
    body: "A parallel asyncio pipeline that splits multi-hour transcripts into dynamic chunks, with a state-machine auto-repair parser that guarantees valid JSON for action items, summaries and sentiment scores.",
  },
  {
    title: "Passwordless auth and multi-tenant RBAC",
    body: "WebAuthn passkeys and SHA-256 OTPs, role-based access control, automated offboarding, JWT invalidation and immutable audit logging.",
  },
  {
    title: "Streaming and persistence",
    body: "3 MB chunked BytesIO streaming to work within Vercel's 4.5 MB payload limit; hybrid transcript analytics stored in PostgreSQL via SQLAlchemy for dashboard re-analysis.",
  },
  {
    title: "Media-buying analytics ETL",
    body: "Processes Meta, TikTok and Snapchat CSVs, auto-calculates ROAS, CPA, CTR and CPC, and feeds n8n AI-agent workflows.",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "LLMs & agents", items: ["LangGraph", "LangChain", "RAG", "FAISS", "QLoRA / LoRA", "PEFT / TRL", "vLLM", "Unsloth"] },
  { group: "Speech & NLP", items: ["Spark-TTS", "Wav2Vec2", "faster-whisper", "Deepgram", "Hugging Face Transformers", "NLTK"] },
  { group: "ML & vision", items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "XGBoost", "OpenCV"] },
  { group: "Data", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "PostgreSQL", "SQL Server", "SQLAlchemy"] },
  { group: "Backend & deployment", items: ["FastAPI", "Flask", "Streamlit", "Docker", "Modal", "Vercel Serverless", "Webhooks"] },
  { group: "Integration & web", items: ["WhatsApp APIs", "n8n", "WebAuthn", "Chrome MV3", "React", "Google Apps Script"] },
  { group: "Languages", items: ["Python", "C", "C++", "PHP", "JavaScript", "TypeScript", "Arabic (native)", "English (fluent)"] },
];

export const education = {
  degree: "Bachelor of Computer Science",
  school: "Faculty of Computers and Information, Mansoura University, Egypt",
  years: "2022 – 2026",
  status: "Graduated",
};

export const training = [
  { title: "Machine Learning Diploma — CSkilled Academy", when: "Sep 2026" },
  { title: "Data Science & Web Development — MCIT", when: "Jul–Aug 2025 · 120 hrs" },
  { title: "Data Analysis & Freelancing — ITIDA & NTI", when: "Aug–Sep 2024 · 120 hrs" },
];
