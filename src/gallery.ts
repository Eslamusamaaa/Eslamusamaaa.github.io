export type Shot = { src: string; alt: string; caption: string; width: number; height: number };
export type GalleryGroup = { title: string; note?: string; shots: Shot[] };

const s = (dir: string, file: string, width: number, height: number, caption: string, alt = caption): Shot => ({
  src: `img/projects/${dir}/${file}.webp`,
  alt,
  caption,
  width,
  height,
});

/** Screenshots and analysis figures, keyed by project slug (or repository slug for the smaller repos). */
export const galleries: Record<string, GalleryGroup[]> = {
  "arabic-medical-llm": [
    {
      title: "Chat interface",
      shots: [
        s("arabic-medical-llm", "chat-ui", 1200, 800, "Shifa, the Arabic chat front end served by the FastAPI backend, with suggested questions and an educational-use disclaimer."),
        s("arabic-medical-llm", "chat-example-mock", 1200, 860, "Example layout of an exchange. The image itself is labelled an illustrative mock, not actual model output.", "Mock-up of an example question and answer in the chat interface"),
      ],
    },
  ],

  "elara-ecosystem": [
    {
      title: "Student KPIs web app",
      note: "The classifier behind the app turns learning KPIs into one of five performance levels.",
      shots: [
        s("student-kpis", "app-form", 1000, 1000, "Input form for the learning KPIs, with buttons that fill a beginner or proficient example."),
        s("student-kpis", "app-beginner", 1000, 1091, "Level 1: Beginner, with per-level confidence and suggested in-app support."),
        s("student-kpis", "app-proficient", 1000, 1007, "Level 4: Proficient, with the confidence spread across neighbouring levels."),
      ],
    },
    {
      title: "Data exploration",
      shots: [
        s("student-kpis", "eda-level-distribution", 910, 520, "The 300 real records are balanced across the five levels, 60 each."),
        s("student-kpis", "eda-boxplots", 1600, 1035, "KPI distributions per performance level."),
        s("student-kpis", "eda-correlation", 1300, 1040, "Correlation between the KPIs."),
        s("student-kpis", "eda-real-vs-augmented", 1600, 427, "Real (300) against augmented feature densities for accuracy, hint usage and hard-question accuracy."),
      ],
    },
    {
      title: "Model evaluation",
      note: "Measured on data that includes synthetic augmentation, so read these as pipeline checks rather than real-world accuracy.",
      shots: [
        s("student-kpis", "confusion-matrix", 975, 780, "Confusion matrix on unseen real students over 5 repeated hold-outs."),
        s("student-kpis", "feature-importance", 975, 650, "Random Forest feature importance."),
      ],
    },
  ],

  "building-energy-digital-twin": [
    {
      title: "Digital twin dashboard",
      note: "React dashboard over the Flask API, running on the synthetic dataset.",
      shots: [
        s("building-energy-twin", "dashboard-live", 1400, 1700, "Live sensor status."),
        s("building-energy-twin", "dashboard-predictions", 1400, 1700, "Predictions from the HVAC, lighting and plug sub-models and the meta-learner."),
        s("building-energy-twin", "dashboard-simulation", 1400, 1700, "Scenario simulation, for example a heatwave, against the baseline."),
        s("building-energy-twin", "dashboard-optimization", 1400, 1700, "Optimization engine comparing consumption before and after."),
        s("building-energy-twin", "dashboard-analytics", 1400, 1700, "Historical trends and analytics."),
      ],
    },
    {
      title: "Data exploration",
      shots: [
        s("building-energy-twin", "eda-overview", 1600, 1029, "Monthly and hourly load, consumption by end use, weekday against weekend."),
        s("building-energy-twin", "eda-drivers", 1600, 571, "Outdoor temperature against HVAC energy, and occupancy against total energy."),
        s("building-energy-twin", "eda-correlation", 1600, 1257, "Correlation matrix across the raw and engineered features."),
      ],
    },
  ],

  "topic-classification-ag-news": [
    {
      title: "Web app",
      shots: [
        s("topic-classification", "app-home", 900, 800, "Flask app: enter a news headline or description."),
        s("topic-classification", "app-business", 900, 800, "A business headline classified with its confidence score."),
        s("topic-classification", "app-sports", 900, 800, "A sports headline classified with its confidence score."),
        s("topic-classification", "app-scitech", 900, 800, "A science and technology headline classified with its confidence score."),
      ],
    },
    {
      title: "Analysis and evaluation",
      shots: [
        s("topic-classification", "eda-overview", 1600, 448, "Balanced topic counts, and description and title length distributions."),
        s("topic-classification", "ngram-comparison", 1600, 514, "Unigram, bigram and trigram language models: held-out log probability and perplexity on 2,000 unseen sentences."),
        s("topic-classification", "model-comparison", 910, 455, "Validation accuracy for each vectorizer and classifier pairing."),
        s("topic-classification", "confusion-matrix", 845, 715, "Confusion matrix on the external test set of 7,600 articles."),
      ],
    },
  ],

  "equipment-failure-prediction": [
    {
      title: "Web app",
      note: "The same form returns a status, a stability confidence and a recommended action.",
      shots: [
        s("equipment-failure-prediction", "1-form", 1100, 921, "Input form: product type, tool wear, temperatures, rotational speed and torque."),
        s("equipment-failure-prediction", "2-no-failure", 1100, 1381, "Result: no failure, routine maintenance."),
        s("equipment-failure-prediction", "3-heat-dissipation", 1100, 1381, "Result: heat dissipation failure, check cooling."),
        s("equipment-failure-prediction", "4-tool-wear-alert", 1100, 1405, "Result: tool wear failure, replace the tool."),
      ],
    },
  ],

  "sleep-quality-consultant": [
    {
      title: "Web app",
      shots: [
        s("sleep-quality-prediction", "app-form", 1200, 2500, "Personal, work, sleep and health-metric inputs."),
        s("sleep-quality-prediction", "app-good-sleeper", 1200, 2500, "Result for a profile with a high sleep-quality score."),
        s("sleep-quality-prediction", "app-poor-sleeper", 1200, 2500, "Result for a profile with a low score: analysis, what-if changes and an optimization plan."),
      ],
    },
    {
      title: "Data exploration",
      shots: [
        s("sleep-quality-prediction", "eda-quality-distribution", 1040, 650, "Sleep-quality levels, with real records (few) against the synthetic ones that make up most rows."),
        s("sleep-quality-prediction", "eda-sleep-disorder", 1040, 650, "Sleep disorder (none, sleep apnea, insomnia) by sleep-quality level."),
        s("sleep-quality-prediction", "eda-boxplots", 1600, 800, "Key features against sleep quality."),
        s("sleep-quality-prediction", "eda-mean-features", 1430, 780, "Average feature values per sleep-quality level."),
        s("sleep-quality-prediction", "eda-correlation-heatmap", 1170, 910, "Correlation heatmap."),
        s("sleep-quality-prediction", "eda-real-vs-synthetic", 1560, 585, "Real and synthetic records for sleep duration and caffeine intake against quality."),
      ],
    },
    {
      title: "Model evaluation",
      shots: [
        s("sleep-quality-prediction", "confusion-matrix", 910, 715, "Confusion matrix on unseen real rows over 5 repeated hold-outs."),
        s("sleep-quality-prediction", "feature-importance", 910, 585, "Feature importance of the final model."),
      ],
    },
  ],
};
