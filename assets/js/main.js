/* =========================================================
   Пчеличка — main.js
   Анимации (GSAP + ScrollTrigger), пчелички, интеракции
   ========================================================= */
(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------
     Данни: витрината
     --------------------------------------------------------- */
  const MENU = {
    cafe: [
      { photo: "cake-slice", icon: "slice", name: "Медена торта „Пчеличка“", desc: "Тънки медени блатове и лек сметанов крем. Нашата запазена марка.", price: "4,00 €", unit: "парче", tag: "фирмена" },
      { icon: "cookie", name: "Меденки и медени бисквити", desc: "С канела, джинджифил и мед от кошерите ни. Хрупкави отвън, меки отвътре.", price: "3,00 €", unit: "100 г" },
      { icon: "baklava", name: "Баклава и сладки с мед", desc: "Сиропът е мед, не захар. Орехи, масло и много търпение.", price: "2,50 €", unit: "парче" },
      { icon: "cake", name: "Еклери, тарталети, макарони", desc: "Малки сладки неща с медена глазура — за кафе или за из път.", price: "2,50–3,50 €", unit: "бр." },
      { icon: "cup", name: "Кафе", desc: "Еспресо, капучино, лате. Ако искаш — с лъжичка мед вместо захар.", price: "1,80–3,00 €", unit: "чаша" },
      { icon: "leaf", name: "Билков чай „Пчелна поляна“", desc: "Мента, маточина, мащерка и липа от поляната до пчелина.", price: "2,20 €", unit: "чаша", tag: "наши билки" }
    ],
    cakes: [
      { photo: "cake-whole", icon: "cake", name: "Цяла торта по поръчка", desc: "Избираш вкус и размер, ние я правим за деня ти. 8–12 парчета.", price: "38–65 €", unit: "торта" },
      { icon: "slice", name: "Торта с персонален дизайн", desc: "Скица, цветове, надпис — с дегустация, преди да решиш.", price: "по оферта", unit: "", tag: "дегустация" },
      { icon: "rings", name: "Сватбена торта", desc: "Етажи, живи цветя и медени нотки. Довършваме я на място.", price: "3,50–5,00 €", unit: "порция" },
      { icon: "balloon", name: "Детски рожден ден", desc: "Торта, сладки и украса в един пакет. Ти носиш само свещичките.", price: "250–450 €", unit: "пакет" }
    ],
    gifts: [
      { photo: "honey-bowl", icon: "jar", name: "Пчелен мед 400 г", desc: "Полифлорен мед от нашия пчелин, с партиден номер и произход.", price: "7,50 €", unit: "буркан" },
      { icon: "jar", name: "Пчелен мед 700 г", desc: "Голямият буркан — за вкъщи или за баба.", price: "12,00 €", unit: "буркан", tag: "изгодно" },
      { icon: "leaf", name: "Билков чай, кутия 40 г", desc: "Сушен внимателно и смесен по наша рецепта.", price: "5,50 €", unit: "кутия" },
      { icon: "gift", name: "Подаръчен комплект", desc: "Мед, меденки и чай в кутия, която не искаш да изхвърлиш.", price: "20–45 €", unit: "комплект" },
      { icon: "case", name: "Корпоративни подаръци", desc: "За клиенти и колеги — с вашето лого и картичка.", price: "по оферта", unit: "" },
      { icon: "flower", name: "Кутийки за гости", desc: "Малък сладък подарък за всеки гост на сватбата или кръщенето.", price: "2–4 €", unit: "бр." }
    ]
  };

  /* ---------------------------------------------------------
     Витрина: табове + карти
     --------------------------------------------------------- */
  function renderMenu(key, animate) {
    const feat = $("[data-feature]"), list = $("[data-menu-list]");
    if (!feat || !list) return;
    const [top, ...rest] = MENU[key];
    feat.innerHTML = `
      <img class="feature__img" src="assets/img/${top.photo}-600.jpg" srcset="assets/img/${top.photo}-600.jpg 600w, assets/img/${top.photo}-1100.jpg 1100w" sizes="(max-width: 960px) 92vw, 520px" alt="${top.name}" decoding="async">
      <span class="feature__label">${top.tag || "препоръчваме"}</span>
      <h3 class="feature__name">${top.name}</h3>
      <p class="feature__desc">${top.desc}</p>
      <div class="feature__price"><strong>${top.price}</strong><span>${top.unit}</span></div>`;
    list.innerHTML = rest.map((p) => `
      <li class="mitem">
        <span class="mitem__icon"><svg><use href="#i-${p.icon}"/></svg></span>
        <div class="mitem__top"><span class="mitem__name">${p.name}${p.tag ? `<span class="mitem__tag">${p.tag}</span>` : ""}</span><span class="mitem__dots"></span><span class="mitem__price">${p.price}</span></div>
        <div class="mitem__desc"><span>${p.desc}</span>${p.unit ? `<span class="mitem__unit">${p.unit}</span>` : ""}</div>
      </li>`).join("");
    if (animate && hasGSAP && !reduced) {
      gsap.fromTo($$(":scope > :not(img)", feat), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: "expo.out" });
      gsap.fromTo($(".feature__img", feat), { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "expo.out", clearProps: "transform" });
      gsap.fromTo($$(".mitem", list), { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "expo.out" });
    }
  }

  function preloadMenuPhotos() {
    Object.values(MENU).forEach((arr) => { if (arr[0].photo) { const im = new Image(); im.decoding = "async"; im.srcset = `assets/img/${arr[0].photo}-600.jpg 600w, assets/img/${arr[0].photo}-1100.jpg 1100w`; im.sizes = "520px"; im.src = `assets/img/${arr[0].photo}-600.jpg`; } });
  }

  function initTabs() {
    const tabs = $("[data-tabs]");
    if (!tabs) return;
    const pill = $(".tabs__pill", tabs);
    const btns = $$("button", tabs);
    const move = (b) => { pill.style.width = b.offsetWidth + "px"; pill.style.transform = `translateX(${b.offsetLeft}px)`; };
    btns.forEach((b) => b.addEventListener("click", () => {
      if (b.getAttribute("aria-selected") === "true") return;
      btns.forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      move(b);
      renderMenu(b.dataset.tab, true);
    }));
    renderMenu("cafe", false);
    requestAnimationFrame(() => move(btns[0]));
    window.addEventListener("resize", () => move(btns.find((x) => x.getAttribute("aria-selected") === "true")));
    if (document.fonts) document.fonts.ready.then(() => move(btns.find((x) => x.getAttribute("aria-selected") === "true")));
  }

  /* ---------------------------------------------------------
     3D tilt
     --------------------------------------------------------- */
  function bindTilt(els, max = 8) {
    if (!finePointer || reduced) return;
    els.forEach((el) => {
      let raf = 0;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateZ(0)`;
          el.style.setProperty("--mx", px * 100 + "%");
          el.style.setProperty("--my", py * 100 + "%");
        });
      });
      el.addEventListener("pointerleave", () => {
        cancelAnimationFrame(raf);
        el.style.transition = "transform .7s cubic-bezier(.22,1,.36,1), box-shadow .5s, border-color .5s";
        el.style.transform = "";
        setTimeout(() => { el.style.transition = ""; }, 700);
      });
    });
  }

  /* ---------------------------------------------------------
     Схема на залата — точки
     --------------------------------------------------------- */
  function initFloor() {
    const floor = $("[data-floor]");
    if (!floor) return;
    const tip = $("[data-floor-tip]", floor);
    const def = tip.textContent;
    $$(".hotspot", floor).forEach((h) => {
      const show = () => {
        $$(".hotspot", floor).forEach((x) => x.classList.toggle("is-active", x === h));
        tip.textContent = h.dataset.tip;
        if (hasGSAP && !reduced) gsap.fromTo(tip, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
      };
      h.addEventListener("mouseenter", show);
      h.addEventListener("focus", show);
      h.addEventListener("click", show);
    });
    floor.addEventListener("mouseleave", () => { $$(".hotspot", floor).forEach((x) => x.classList.remove("is-active")); tip.textContent = def; });
  }

  /* ---------------------------------------------------------
     Форма
     --------------------------------------------------------- */
  function initForm() {
    const form = $("[data-form]");
    if (!form) return;
    const ok = $("[data-form-ok]", form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      $$("[required]", form).forEach((inp) => {
        const bad = !inp.value.trim();
        inp.closest(".field").classList.toggle("is-invalid", bad);
        if (bad) valid = false;
      });
      if (!valid) {
        ok.textContent = "Попълни име и телефон, за да ти се обадим.";
        if (hasGSAP) gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, .3)" });
        return;
      }
      const name = form.name.value.trim().split(" ")[0];
      ok.textContent = `Благодарим, ${name}! Ще ти върнем оферта до 48 часа.`;
      form.reset();
      burst(form.querySelector("button[type=submit]"));
    });
    $$("[required]", form).forEach((inp) => inp.addEventListener("input", () => inp.closest(".field").classList.remove("is-invalid")));
  }

  // малки шестоъгълници „пръскат“ от бутона
  function burst(el) {
    if (!hasGSAP || reduced || !el) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 18; i++) {
      const d = document.createElement("span");
      d.style.cssText = `position:fixed;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;width:14px;height:16px;z-index:999;pointer-events:none;clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);background:${i % 2 ? "#f2a516" : "#ffe29a"}`;
      document.body.appendChild(d);
      const a = Math.random() * Math.PI * 2, dist = 80 + Math.random() * 120;
      gsap.to(d, { x: Math.cos(a) * dist, y: Math.sin(a) * dist - 40, rotation: Math.random() * 360, scale: 0.3, opacity: 0, duration: 1 + Math.random() * 0.5, ease: "power3.out", onComplete: () => d.remove() });
    }
  }

  /* ---------------------------------------------------------
     Курсор, пчела, магнитни бутони
     --------------------------------------------------------- */
  function initApiary() {
    const v = $("[data-apiary-video]");
    if (!v) return;
    if (reduced) { v.removeAttribute("autoplay"); v.pause(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.1 });
    io.observe(v);
  }

  /* ---------------------------------------------------------
     Пчелички, които летят из страницата
     --------------------------------------------------------- */
  const BEE_SVG = `
    <svg viewBox="0 0 64 64">
      <path d="M29 15c-2-6-7-8-9-6M35 15c2-6 7-8 9-6" fill="none" stroke="#1b1209" stroke-width="2" stroke-linecap="round"/>
      <path d="M32 54v6" stroke="#1b1209" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="32" cy="38" rx="13" ry="17" fill="#f2a516" stroke="#1b1209" stroke-width="2.4"/>
      <path d="M20 33h24M19.5 41h25M23 49h18" stroke="#1b1209" stroke-width="4" stroke-linecap="round"/>
      <circle cx="32" cy="20" r="7.5" fill="#1b1209"/>
      <circle cx="29" cy="18.5" r="1.6" fill="#fff" opacity=".8"/><circle cx="35" cy="18.5" r="1.6" fill="#fff" opacity=".8"/>
      <g transform="rotate(-28 21 26)"><ellipse class="sbee__wing sbee__wing--l" cx="21" cy="26" rx="9.5" ry="15" fill="#fff" fill-opacity=".72" stroke="#1b1209" stroke-width="1.8"/></g>
      <g transform="rotate(28 43 26)"><ellipse class="sbee__wing sbee__wing--r" cx="43" cy="26" rx="9.5" ry="15" fill="#fff" fill-opacity=".72" stroke="#1b1209" stroke-width="1.8"/></g>
    </svg>`;

  function initSwarm() {
    const root = $("[data-swarm]");
    if (!root) return;
    if (reduced) { root.remove(); return; }
    let W = innerWidth, H = innerHeight;
    addEventListener("resize", () => { W = innerWidth; H = innerHeight; });

    const count = W < 640 ? 3 : 4;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const newTarget = (b) => {
      b.tx = rnd(40, W - 40);
      b.ty = rnd(110, H - 60);
      b.maxV = rnd(70, 150);
    };
    const bees = Array.from({ length: count }, () => {
      const el = document.createElement("div");
      el.className = "sbee";
      el.innerHTML = BEE_SVG;
      const size = rnd(30, 40);
      el.style.width = el.style.height = size + "px";
      root.appendChild(el);
      const b = { el, size, x: rnd(0, W), y: rnd(120, H), vx: rnd(-40, 40), vy: rnd(-40, 40), ang: 0, wob: rnd(0, 10), hover: 0, dotT: 0 };
      newTarget(b);
      return b;
    });

    let px = -999, py = -999;
    addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
    document.addEventListener("pointerleave", () => { px = py = -999; });

    let last = performance.now(), running = true;
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) { last = performance.now(); requestAnimationFrame(loop); }
    });

    function loop(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      for (const b of bees) {
        b.wob += dt;
        const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy) || 1;

        if (b.hover > 0) {
          // кръжи на място, преди да тръгне нанякъде
          b.hover -= dt;
          b.vx = lerp(b.vx, Math.cos(b.wob * 5) * 45, 0.08);
          b.vy = lerp(b.vy, Math.sin(b.wob * 7) * 30, 0.08);
          if (b.hover <= 0) newTarget(b);
        } else {
          const sp = Math.min(b.maxV, d * 1.4);
          b.vx = lerp(b.vx, (dx / d) * sp, 2.2 * dt);
          b.vy = lerp(b.vy, (dy / d) * sp, 2.2 * dt);
          if (d < 30) Math.random() < 0.55 ? (b.hover = rnd(0.8, 2.2)) : newTarget(b);
        }

        // зигзаг напред-назад, нагоре-надолу
        const px2 = -b.vy / (Math.hypot(b.vx, b.vy) || 1), py2 = b.vx / (Math.hypot(b.vx, b.vy) || 1);
        const zig = Math.sin(b.wob * 6) * 38;

        // бяга леко от мишката
        const mx = b.x - px, my = b.y - py, md = Math.hypot(mx, my);
        if (md < 130) {
          const f = (1 - md / 130) * 900 * dt;
          b.vx += (mx / (md || 1)) * f;
          b.vy += (my / (md || 1)) * f;
        }

        b.x += (b.vx + px2 * zig) * dt;
        b.y += (b.vy + py2 * zig + Math.sin(b.wob * 11) * 8) * dt;
        b.x = clamp(b.x, -20, W + 20);
        b.y = clamp(b.y, 60, H + 20);

        const target = Math.atan2(b.vy, b.vx) * 180 / Math.PI + 90;
        let diff = ((target - b.ang + 540) % 360) - 180;
        b.ang += diff * Math.min(1, 6 * dt);
        b.el.style.transform = `translate3d(${b.x - b.size / 2}px, ${b.y - b.size / 2}px, 0) rotate(${b.ang}deg)`;

      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ---------------------------------------------------------
     Карусели на телефон (точки + подсказка за плъзгане)
     --------------------------------------------------------- */
  function initCarousels() {
    const phone = window.matchMedia("(max-width: 640px)");
    $$("[data-carousel]").forEach((track) => {
      const items = [...track.children].filter((c) => getComputedStyle(c).position !== "absolute" && !c.classList.contains("journey__line"));
      if (items.length < 2) return;
      const dark = !!track.closest(".office, .honey, .contact");
      const dots = document.createElement("div");
      dots.className = "dots" + (dark ? " dots--light" : "");
      dots.setAttribute("aria-hidden", "true");
      items.forEach(() => {
        const d = document.createElement("button");
        d.type = "button"; d.tabIndex = -1;
        dots.appendChild(d);
      });
      track.after(dots);

      const scrollToItem = (it, smooth) => {
        const center = it.classList.contains("plan");
        const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        const left = center ? it.offsetLeft - (track.clientWidth - it.offsetWidth) / 2 : it.offsetLeft - pad;
        track.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
      };
      [...dots.children].forEach((d, i) => d.onclick = () => scrollToItem(items[i], true));

      let raf = 0;
      const update = () => {
        raf = 0;
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0, bd = Infinity;
        items.forEach((it, i) => { const c = it.offsetLeft + it.offsetWidth / 2; const d = Math.abs(c - mid); if (d < bd) { bd = d; best = i; } });
        if (track.scrollLeft < 8) best = 0;
        if (track.scrollLeft + track.clientWidth > track.scrollWidth - 8) best = items.length - 1;
        [...dots.children].forEach((d, i) => d.classList.toggle("is-active", i === best));
      };
      track.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });

      const setup = () => {
        if (!phone.matches) return;
        const start = +track.dataset.start || 0;
        if (start) scrollToItem(items[start], false);
        update();
      };
      setup();
      phone.addEventListener("change", setup);
      addEventListener("load", setup);

      // подсказка: леко „побутване“ първия път, когато се види
      if (!reduced) {
        const io = new IntersectionObserver(([e]) => {
          if (!e.isIntersecting || !phone.matches) return;
          io.disconnect();
          if (track.dataset.start) return;
          setTimeout(() => {
            track.scrollTo({ left: 56, behavior: "smooth" });
            setTimeout(() => track.scrollTo({ left: 0, behavior: "smooth" }), 520);
          }, 450);
        }, { threshold: 0.6 });
        io.observe(track);
      }
    });
  }

  function initMagnetic() {
    if (!finePointer || reduced) return;
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------
     Навигация и мобилно меню
     --------------------------------------------------------- */
  function initNav() {
    const nav = $("[data-nav]");
    const burger = $("[data-burger]"), menu = $("[data-mobile-menu]");
    let lastY = scrollY;
    addEventListener("scroll", () => {
      const y = scrollY;
      nav.classList.toggle("is-scrolled", y > 40);
      nav.classList.toggle("is-hidden", y > lastY && y > 600 && !menu.classList.contains("is-open"));
      lastY = y;
    }, { passive: true });

    const toggle = (open) => {
      menu.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle(!menu.classList.contains("is-open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => toggle(false)));

    // активна секция
    const links = $$(".nav__links a");
    links.forEach((a) => {
      const sec = $(a.getAttribute("href"));
      if (!sec || !hasGSAP) return;
      ScrollTrigger.create({ trigger: sec, start: "top 50%", end: "bottom 50%", onToggle: (s) => a.classList.toggle("is-active", s.isActive) });
    });
  }

  /* ---------------------------------------------------------
     Текст: разделяне на думи
     --------------------------------------------------------- */
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");
    return $$(".w > span", el);
  }

  /* ---------------------------------------------------------
     GSAP анимации
     --------------------------------------------------------- */
  function initAnimations() {
    if (!hasGSAP) { $$("[data-reveal]").forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; }); return; }

    // прогрес лента
    gsap.to(".progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

    if (reduced) {
      gsap.set("[data-reveal]", { opacity: 1, y: 0 });
      return;
    }

    // заглавия по думи
    $$("[data-split]").forEach((h) => {
      const w = splitWords(h);
      gsap.from(w, { yPercent: 115, rotate: 6, duration: 0.8, stagger: 0.04, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 95%" } });
    });

    // общо появяване
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 96%",
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "expo.out", overwrite: true })
    });

    // hero — скрол паралакс
    gsap.to(".hero__media", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__inner", { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // story — медената линия се пълни, стъпките се появяват
    gsap.to("[data-journey-fill]", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-journey]", start: "top 60%", end: "bottom 70%", scrub: true } });
    $$(".jstep__node").forEach((n) => ScrollTrigger.create({ trigger: n, start: "top 62%", onEnter: () => n.classList.add("is-on"), onLeaveBack: () => n.classList.remove("is-on") }));
    $$(".jstep").forEach((st) => {
      const media = $(".jstep__media", st), body = $(".jstep__body", st);
      const fromX = st.classList.contains("jstep--rev") ? 40 : -40;
      gsap.from(media, { x: fromX, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: st, start: "top 95%" } });
      gsap.from(body.children, { y: 24, opacity: 0, duration: 0.7, stagger: 0.05, ease: "expo.out", scrollTrigger: { trigger: st, start: "top 90%" } });
    });
    gsap.from(".journey__card", { y: 50, opacity: 0, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".journey__card", start: "top 94%" } });

    // пчелинът — видеото се отваря до цял екран
    gsap.fromTo("[data-apiary-frame]", { clipPath: "inset(5% 4% 5% 4% round 40px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1, ease: "expo.out", clearProps: "clipPath", scrollTrigger: { trigger: ".apiary", start: "top 70%" } });

    // снимки — паралакс
    gsap.from(".open-day", { y: 40, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".open-day", start: "top 98%" } });
    gsap.from(".open-day__media", { clipPath: "inset(0 30% 0 0)", duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".open-day", start: "top 98%" } });

    // витрина — карти
    gsap.from(".feature", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".menu__layout", start: "top 94%" } });
    gsap.from(".menu__list .mitem", { x: 40, opacity: 0, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".menu__list", start: "top 94%" } });
    gsap.from(".tabs", { y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".tabs", start: "top 90%" } });

    // мед — сцена
    gsap.from(".honey__photo", { clipPath: "inset(30% 0 0 0 round 40px)", duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".honey__photo", start: "top 98%" } });
    gsap.from(".herbs span", { y: 20, opacity: 0, stagger: 0.05, duration: 0.6, ease: "back.out(2)", scrollTrigger: { trigger: ".herbs", start: "top 92%" } });


    // абонаменти
    gsap.from(".plan", { y: 120, rotateY: (i) => (i - 1) * -25, opacity: 0, duration: 1.3, stagger: 0.12, ease: "expo.out", transformPerspective: 1200, clearProps: "transform", scrollTrigger: { trigger: ".plans", start: "top 94%" } });

    // числа
    $$("[data-counter]").forEach((el) => {
      const end = +el.dataset.counter, suf = el.dataset.suffix || "";
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 2.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString("bg-BG") + suf; } });
    });
    gsap.from(".num", { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".numbers", start: "top 94%" } });

    // схема на залата
    gsap.from(".floor", { opacity: 0, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: ".floor", start: "top 94%" } });
    gsap.from(".floor__svg rect:not(.f-floor):not(.f-bar), .floor__svg circle", { scale: 0, transformOrigin: "50% 50%", opacity: 0, stagger: { each: 0.025, from: "random" }, duration: 0.6, ease: "back.out(2)", scrollTrigger: { trigger: ".floor", start: "top 94%" } });
    gsap.from(".hotspot", { scale: 0, opacity: 0, stagger: 0.08, duration: 0.6, ease: "back.out(3)", delay: 0.6, scrollTrigger: { trigger: ".floor", start: "top 94%" } });

    // контакт
    gsap.from(".form", { y: 80, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".form", start: "top 94%" } });
    gsap.from(".form > *", { y: 24, opacity: 0, stagger: 0.06, duration: 0.8, ease: "expo.out", delay: 0.2, scrollTrigger: { trigger: ".form", start: "top 94%" } });

    // footer
    gsap.from(".footer__big", { yPercent: 40, opacity: 0, letterSpacing: "0.1em", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".footer", start: "top 94%" } });

    // drip — леко „тече“ при скрол
  }

  function heroIntro() {
    if (!hasGSAP || reduced) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".hero__media img", { scale: 1.25, opacity: 0, duration: 2.2, ease: "power3.out", clearProps: "transform,opacity" }, 0)
      .from(".hero__title .word", { yPercent: 120, rotate: 8, duration: 1.4, stagger: 0.08 }, 0.15)
      .from(".hero__eyebrow", { y: 20, opacity: 0, duration: 1 }, 0.1)
      .from(".hero__lead", { y: 30, opacity: 0, duration: 1.2 }, 0.6)
      .from(".hero__actions", { y: 30, opacity: 0, duration: 1 }, 0.75)
      .from(".hero__chips .chip", { y: 30, opacity: 0, scale: 0.9, duration: 1, stagger: 0.08 }, 0.9)
      .from(".nav__inner", { y: -30, opacity: 0, duration: 1 }, 0.3)
      .from(".scroll-cue", { opacity: 0, y: 20, duration: 1 }, 1.3);
  }

  /* ---------------------------------------------------------
     Старт
     --------------------------------------------------------- */
  function init() {
    $("[data-year]").textContent = new Date().getFullYear() < 2027 ? "2027" : String(new Date().getFullYear());

    initNav();
    initTabs();
    preloadMenuPhotos();
    initFloor();
    initForm();
    initSwarm();
    initCarousels();
    const hero = $(".hero");
    if (hero) new IntersectionObserver(([e]) => hero.classList.toggle("is-off", !e.isIntersecting)).observe(hero);
    initApiary();
    initMagnetic();
    bindTilt($$("[data-tilt]"), 6);
    initAnimations();

    heroIntro();
    addEventListener("load", () => { if (hasGSAP && window.ScrollTrigger) ScrollTrigger.refresh(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
