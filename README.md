# Eslam Usama · AI Engineer Portfolio

Live site: **https://eslamusamaaa.github.io/#/**

A static, responsive portfolio for Eslam Usama, an AI Engineer working across machine learning, deep learning, computer vision, NLP, generative AI, RAG and AI agents.

## What's on the site

- **Hero** with a short introduction, calls to action and a profile photo that links to a personal WhatsApp chat.
- **Professional work** as case studies: Rashihli (Salla shopping-quiz widget, with a project explanation video), the Zikola AI Meeting Assistant, AI voice calling (Tele Confirm and the Voice Assistant) and WhatsApp commerce bots.
- **WhatsApp bots**: a compact list of direct-chat links (`wa.me`).
- **Research and personal projects**: Elara-TTS, LUNA16 nodule detection, an Arabic medical LLM, the Elara ecosystem and other repositories.
- **Experience, education and skills**, plus contact details and a downloadable CV.

Private source code, credentials and customer data are not published. Case studies are written from project documentation and repository history, and make no unverified claims.

## Tech stack

React 18, TypeScript, Vite 5, React Router (hash routing, so it works on any GitHub Pages path). Plain CSS with a small design system (light palette, one accent colour, shared motion tokens). No animation or UI libraries.

## Project structure

```
src/
  App.tsx        Layout, sections, routing, project pages
  data.ts        All content: profile, projects, skills, bots, experience
  styles.css     Design tokens, layout (wide container, responsive grids), motion
public/
  img/           Profile photo and Rashihli logo
  cv/            Downloadable CV (PDF)
.github/workflows/deploy.yml   Builds and deploys to GitHub Pages on push to main
```

## Run locally

```bash
npm install
npm run dev
```

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

## Updating the content

All text and links live in `src/data.ts`.

- **Profile and contact:** edit the `profile` object (name, email, phone, WhatsApp link, CV path).
- **CV:** replace `public/cv/Eslam-Osama-CV.pdf` with a new file of the same name, or change `profile.cvUrl`.
- **Add a project:** add an entry to the `projects` array (`group: "professional"` for the featured grid, `"personal"` for the research grid). Each case study page is generated from its fields; set `video` to show a "Watch Project Explanation" button.
- **WhatsApp bots:** edit `whatsappBots`. Numbers are Saudi mobile numbers (9 digits starting with 5); the link is built as `https://wa.me/966` plus the digits.
- **Skills, experience, education:** edit `skills`, `zikolaWork`, `education` and `training`.

## Deployment

Pushing to `main` runs the GitHub Actions workflow, which builds the site and publishes it with GitHub Pages. In the repository settings, Pages must use **Source: GitHub Actions**.
