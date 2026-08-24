import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

export default function FAQ() {
  const { content } = useSiteContent();
  const [openId, setOpenId] = useState<string | null>(
    content.faq.items[0]?.id ?? null,
  );
  return (
    <section id="faq" className="mx-auto mt-24 max-w-4xl scroll-mt-24">
      <h2 className="font-heading text-center text-4xl font-black md:text-5xl">
        {content.faq.title}{" "}
        <span className="text-sky-300">{content.faq.highlight}</span>
      </h2>
      <div className="mt-12 space-y-3">
        {content.faq.items.map((item, index) => {
          const open = openId === item.id;
          const answerId = `faq-${item.id}`;
          return (
            <article
              key={item.id}
              className="premium-card overflow-hidden border border-sky-300/12 bg-[#071126]/70"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                aria-controls={answerId}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-7"
              >
                <span>
                  <span className="mr-5 text-sm font-black text-sky-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-black">{item.question}</span>
                </span>
                {open ? (
                  <Minus className="h-5 w-5 text-sky-300" />
                ) : (
                  <Plus className="h-5 w-5 text-sky-300" />
                )}
              </button>
              {open && (
                <p
                  id={answerId}
                  className="px-5 pb-6 text-sm leading-7 text-slate-300 md:px-[76px]"
                >
                  {item.answer}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
