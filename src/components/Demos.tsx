import { useRef } from "react";
import { Link } from "react-router-dom";
import { whatsappBots } from "../data";
import { gsap, MOTION, useMotion } from "../lib";
import { WaIcon } from "./icons";

type Msg = { from: "bot" | "me"; text: string; buttons?: string[]; cards?: string[] };

/**
 * Illustrative script based on the catalog bot's documented button flow:
 * price tier, style, shape, paginated results, product detail. Generic labels only.
 */
const SCRIPT: Msg[] = [
  { from: "bot", text: "Hi! How would you like to browse?", buttons: ["By price", "Ask a question"] },
  { from: "me", text: "By price" },
  { from: "bot", text: "Pick a price tier", buttons: ["Tier 1", "Tier 2", "Tier 3"] },
  { from: "me", text: "Tier 2" },
  { from: "bot", text: "Which style?", buttons: ["Style A", "Style B"] },
  { from: "me", text: "Style B" },
  { from: "bot", text: "And the shape?", buttons: ["Shape A", "Shape B"] },
  { from: "me", text: "Shape A" },
  { from: "bot", text: "Matching products, page 1 of 2", cards: ["Product 1", "Product 2", "Product 3"], buttons: ["More results"] },
  { from: "me", text: "Product 2" },
  { from: "bot", text: "Product 2: details, price and link from the store catalog", buttons: ["Photos", "Talk to a person"] },
];

function Phone() {
  return (
    <figure className="phone" aria-label="Illustrative WhatsApp conversation with the catalog bot">
      <div className="phone-screen">
        <div className="phone-head">
          <span className="phone-avatar" aria-hidden="true">
            <WaIcon size={14} />
          </span>
          <span>
            <strong>Store assistant</strong>
            <small>Illustrative demo</small>
          </span>
        </div>
        <ol className="chat">
          {SCRIPT.map((m, i) => (
            <li key={i} className={`msg ${m.from}`}>
              <p>{m.text}</p>
              {m.cards && (
                <span className="msg-cards">
                  {m.cards.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </span>
              )}
              {m.buttons && (
                <span className="msg-buttons">
                  {m.buttons.map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </span>
              )}
            </li>
          ))}
          <li className="typing" aria-hidden="true">
            <i />
            <i />
            <i />
          </li>
        </ol>
      </div>
      <figcaption>Illustrative conversation based on the catalog bot's button flow. Generic labels, not real products or prices.</figcaption>
    </figure>
  );
}

export default function Demos() {
  const ref = useRef<HTMLElement>(null);

  // Typing, then each message, once when the phone scrolls into view.
  useMotion(ref, (mm) => {
    mm.add(MOTION, () => {
      const msgs = gsap.utils.toArray<HTMLElement>(".chat .msg");
      const typing = ref.current?.querySelector(".typing") ?? [];
      const chat = ref.current?.querySelector<HTMLElement>(".chat");
      // Unsent messages take no space, so the newest one is always at the bottom of the screen.
      gsap.set(msgs, { opacity: 0, y: 8, display: "none" });
      gsap.set(typing, { opacity: 0 });
      const tl = gsap.timeline({ paused: true });
      const toBottom = () => {
        if (chat) chat.scrollTop = chat.scrollHeight;
      };
      msgs.forEach((m) => {
        const bot = m.classList.contains("bot");
        if (bot) tl.to(typing, { opacity: 1, duration: 0.12 }).to(typing, { opacity: 0, duration: 0.1, delay: 0.35 });
        tl.set(m, { display: "" }, bot ? ">" : "+=0.2").add(toBottom).to(m, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
      });
      gsap.timeline({ scrollTrigger: { trigger: ".phone", start: "top 70%", once: true, onEnter: () => tl.play() } });
    });
  });

  return (
    <section id="demos" className="section wrap" ref={ref} aria-labelledby="demos-title">
      <div className="demos">
        <Phone />
        <div className="demos-copy">
          <h2 id="demos-title" className="mask-line">
            <span>Live demos</span>
          </h2>
          <p className="sub-lede">
            My WhatsApp commerce bots run on these numbers. Message one to try it. <Link to="/projects/whatsapp-commerce-bots">How they work</Link>.
          </p>
          <a className="btn wa" href={whatsappBots[0].href} target="_blank" rel="noopener noreferrer">
            <WaIcon /> Try it live
          </a>
          <ul className="lines" aria-label="Demo lines">
            {whatsappBots.map((b) => (
              <li key={b.id}>
                <a href={b.href} target="_blank" rel="noopener noreferrer" aria-label={`${b.title}, +966 ${b.number}, opens WhatsApp`}>
                  <span className="line-name">{b.title}</span>
                  <span className="line-num" dir="ltr">+966 {b.number}</span>
                  <span className="line-desc">{b.blurb}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="fine">Demo lines, not my personal number. Which store each line belongs to is not stated here.</p>
        </div>
      </div>
    </section>
  );
}
