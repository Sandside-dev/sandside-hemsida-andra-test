"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, CalendarDays, Clock3, Tag } from "lucide-react";

const questions = [
  { icon: Clock3, meta: "Mån 07.42", text: "När öppnar ni i dag?", className: "question-card q-one" },
  { icon: Tag, meta: "Ons 18.16", text: "Vad kostar en lektion?", className: "question-card q-two" },
  { icon: CalendarDays, meta: "Lör 10.03", text: "Hur bokar jag en tid?", className: "question-card q-three" },
];

export function QuestionsStage() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="questions-showcase" aria-labelledby="questions-title">
      <div className="container questions-stage">
        <div className="questions-heading">
          <p className="eyebrow">Frågorna slutar inte när ni blir upptagna</p>
          <h2 id="questions-title">Era kunder vill ha svar.<br /><span>Helst nu.</span></h2>
        </div>
        {questions.map((question, index) => {
          const Icon = question.icon;
          return (
            <motion.article
              key={question.text}
              className={question.className}
              initial={reduceMotion ? false : { opacity: 0, y: 38, rotate: index === 1 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : 0.08 + index * 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="question-meta"><Icon aria-hidden="true" /> {question.meta}</span>
              <strong>“{question.text}”</strong>
            </motion.article>
          );
        })}
        <motion.div
          className="question-answer-bridge"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: reduceMotion ? 0 : 0.78, delay: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <div><span className="answer-avatar">S</span><div><small>Sandside-demo</small><strong>Vi tar den.</strong></div></div>
          <p>Receptionen är öppen måndag–torsdag 08.00–17.00 och fredag 08.00–15.00.</p>
          <span className="bridge-link">Se hur det fungerar <ArrowDownRight aria-hidden="true" /></span>
        </motion.div>
      </div>
    </section>
  );
}
