// ✉️ Resignation AI | by DisMonkey
// Final Version — Works on Mobile + PC + GitHub Pages (Offline Ready)

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

  // 🧮 Format date and capitalize helper
  const cap = (s) => (s && s.trim() ? s.trim().charAt(0).toUpperCase() + s.trim().slice(1) : "");
  const fmtDate = (iso, lang) => {
    if (!iso) return "";
    try {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString(lang, { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return iso;
    }
  };

  // 🗓️ Update calculated last day based on notice
  function setNotice(days) {
    const out = $("lastDay");
    if (!out) return;
    if (!days || days <= 0) {
      out.value = "";
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + days);
    out.value = d.toISOString().split("T")[0];
  }

  // ✍️ Letter tone templates (English + Spanish)
  const TONES = {
    en: {
      polite: {
        greet: (m) => (m ? `Hi ${m},` : `Hello,`),
        open: (j, c, d) =>
          `I’m writing to let you know I’m resigning from my role as ${j} at ${c}${d ? `, effective ${d}` : ""}.`,
        reason: (r) => (r ? `This wasn’t easy, but I’m leaving because ${r}.` : ""),
        thanks: (c) => `Thank you for the chance to grow at ${c}.`,
        extra: `I’ll help ensure a smooth hand-off.`,
        close: `Best regards,`,
      },
      formal: {
        greet: (m) => (m ? `Dear ${m},` : `To whom it may concern,`),
        open: (j, c, d) =>
          `Please accept this letter as formal notice of my resignation from my position as ${j} at ${c}${
            d ? `, effective ${d}` : ""
          }.`,
        reason: (r) => (r ? `After careful consideration, I have decided to step down due to ${r}.` : ""),
        thanks: (c) => `I am grateful for the opportunities and experience I have gained at ${c}.`,
        extra: `I will do everything I can to ensure a smooth transition.`,
        close: `Sincerely,`,
      },
      honest: {
        greet: (m) => (m ? `Dear ${m},` : `Hello,`),
        open: (j, c, d) =>
          `I’m submitting my resignation from my position as ${j} at ${c}${d ? `, with my last day on ${d}` : ""}.`,
        reason: (r) => (r ? `To be transparent, my decision is based on ${r}.` : ""),
        thanks: (c) => `I appreciate the experiences and relationships I’ve built at ${c}.`,
        extra: `I’ll document my responsibilities to make the transition easier.`,
        close: `Respectfully,`,
      },
      simple: {
        greet: (m) => (m ? `Hi ${m},` : `Hi,`),
        open: (j, c, d) =>
          `I’m resigning from my job as ${j} at ${c}${d ? `, and my last day will be ${d}` : ""}.`,
        reason: (r) => (r ? `I’m leaving because ${r}.` : ""),
        thanks: (c) => `Thanks for everything at ${c}.`,
        extra: `I’ll help with the handover.`,
        close: `Thanks,`,
      },
      grateful: {
        greet: (m) => (m ? `Dear ${m},` : `Dear Team,`),
        open: (j, c, d) =>
          `Please accept this as my resignation from ${j} at ${c}${d ? `, effective ${d}` : ""}.`,
        reason: (r) => (r ? `I’ve decided to move on because ${r}.` : ""),
        thanks: (c) => `I’m truly grateful for the trust and opportunities at ${c}.`,
        extra: `I’ll do my best to make this an easy transition for everyone.`,
        close: `With appreciation,`,
      },
      light: {
        greet: (m) => (m ? `Hey ${m},` : `Hey there,`),
        open: (j, c, d) =>
          `I’m letting you know I’ll be resigning from my role as ${j} at ${c}${d ? `, with ${d} as my last day` : ""}.`,
        reason: (r) => (r ? `The short version: I’m moving on because ${r}.` : ""),
        thanks: (c) => `I’ve learned a lot and I’m thankful for my time at ${c}.`,
        extra: `I’ll leave things tidy and share notes for a smooth handover.`,
        close: `All the best,`,
      },
    },
    es: {
      polite: {
        greet: (m) => (m ? `Hola ${m},` : `Hola,`),
        open: (j, c, d) =>
          `Le escribo para informarle que presento mi renuncia al puesto de ${j} en ${c}${
            d ? `, con fecha efectiva ${d}` : ""
          }.`,
        reason: (r) => (r ? `No fue una decisión fácil, pero me voy porque ${r}.` : ""),
        thanks: (c) => `Agradezco la oportunidad de haber crecido en ${c}.`,
        extra: `Apoyaré para que el traspaso sea lo más sencillo posible.`,
        close: `Saludos cordiales,`,
      },
    },
  };

  // 📝 Generate the resignation letter
  function buildLetter(data) {
    const lang = data.lang === "es" ? "es" : "en";
    const tone = TONES[lang][data.tone] ? data.tone : "polite";
    const t = TONES[lang][tone];
    const date = data.last ? fmtDate(data.last, lang === "es" ? "es-ES" : "en-US") : "";

    return [
      t.greet(data.manager),
      t.open(data.job, data.company, date),
      data.reason ? t.reason(cap(data.reason)) : "",
      t.thanks(data.company),
      data.extra ? cap(data.extra) : t.extra,
      `${t.close}\n${data.name || ""}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  // 🧾 Get form data
  function getData() {
    return {
      name: $("name")?.value.trim(),
      manager: $("manager")?.value.trim(),
      job: $("jobTitle")?.value.trim() || "Employee",
      company: $("company")?.value.trim() || "the company",
      last: $("lastDay")?.value,
      reason: $("reason")?.value.trim(),
      extra: $("extra")?.value.trim(),
      tone: $("tone")?.value || "polite",
      lang: $("language")?.value || "en",
    };
  }

  // 🖱️ Event Listeners
  on($("notice"), "change", () => setNotice(parseInt($("notice").value, 10) || 0));
  setNotice(14); // default 2 weeks

  on($("generateBtn"), "click", () => {
    const d = getData();
    if (!d.name) return alert("Please enter your full name.");
    if (!d.job) return alert("Please enter your job title.");
    if (!d.company) return alert("Please enter your company.");
    $("output").value = buildLetter(d);
  });

  on($("copyBtn"), "click", async () => {
    const txt = $("output").value;
    if (!txt.trim()) return;
    try {
      await navigator.clipboard.writeText(txt);
      alert("Copied to clipboard!");
    } catch {
      alert("Copy failed — please copy manually.");
    }
  });

  on($("downloadBtn"), "click", () => {
    const txt = $("output").value;
    if (!txt.trim()) return;
    const name = ($("name").value.trim() || "resignation").replace(/\s+/g, "_");
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name}_letter.txt`;
    a.click();
  });

  on($("emailBtn"), "click", () => {
    const txt = $("output").value;
    if (!txt.trim()) return;
    const subject = encodeURIComponent("Resignation Letter");
    const body = encodeURIComponent(txt);
    location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  on($("clearBtn"), "click", () => {
    ["name", "manager", "jobTitle", "company", "lastDay", "reason", "extra"].forEach((id) => {
      const el = $(id);
      if (el) el.value = "";
    });
    $("output").value = "";
    setNotice(14);
  });
});
