/* HRZZ English Fun — core services: db, engine, speech, ai, ui */
(function (root) {
  const D = root.HRZZ_DATA; const I18N = root.HRZZ_I18N; const T = (s) => (I18N ? I18N.t(s) : s);
  const APP = { version: 1 };

  /* ================= UTIL ================= */
  const LS = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* blocked */ } }, del(k) { try { localStorage.removeItem(k); } catch (e) { /* blocked */ } } };
  const U = {
    uid: () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)),
    today: (d = new Date()) => { const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; },
    addDays: (dateStr, n) => { const [y, m, d] = dateStr.split('-').map(Number); return U.today(new Date(y, m - 1, d + n)); },
    weekKey: (dateStr) => { const [y, m, d] = dateStr.split('-').map(Number); const dt = new Date(y, m - 1, d); const day = (dt.getDay() + 6) % 7; dt.setDate(dt.getDate() - day); return U.today(dt); },
    words: (s) => (s || '').trim().split(/\s+/).filter(Boolean).length,
    norm: (s) => String(s ?? '').toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?;:]+$/g, '').replace(/\s+/g, ' ').trim(),
    esc: (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
    cap: (s) => s.replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase()),
    seed: (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h += 0x6D2B79F5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; },
    shuffle: (arr, rnd = Math.random) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    fmtMin: (sec) => { const m = Math.floor(sec / 60); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`; },
    param: (k) => new URLSearchParams(location.search).get(k),
    greeting: () => { const h = new Date().getHours(); return T(h < 11 ? T('Good morning') : h < 15 ? T('Good afternoon') : h < 19 ? T('Good evening') : T('Good night')); },
    dayName: (dateStr) => { const [y, m, d] = dateStr.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' }); },
    fmtDate: (ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  };

  /* ================= DB (IndexedDB) ================= */
  const STORES = ['profile', 'settings', 'days', 'activities', 'sessions', 'milestones', 'errors', 'vocab', 'xpEvents', 'achievements', 'lessonProgress'];
  const KEYS = { profile: 'id', settings: 'id', days: 'date', activities: 'id', sessions: 'id', milestones: 'date', errors: 'key', vocab: 'id', xpEvents: 'key', achievements: 'id', lessonProgress: 'lessonId' };
  /* Sanitize any value so IndexedDB's structured-clone never throws.
     Drops functions, DOM nodes, IDBRequest/DB handles and other exotic
     objects; keeps plain data, Dates, RegExps and Blobs intact. */
  const sanitizeForIDB = (v, seen) => {
    seen = seen || new WeakSet();
    if (v === null || v === undefined) return v;
    const t = typeof v;
    if (t === 'string' || t === 'number' || t === 'boolean' || t === 'bigint') return v;
    if (t === 'function' || t === 'symbol') return undefined;
    if (seen.has(v)) return undefined; // circular refs can't be cloned
    if (v instanceof Date || v instanceof RegExp || v instanceof Blob || (typeof File !== 'undefined' && v instanceof File)) return v;
    if (typeof ArrayBuffer !== 'undefined' && (v instanceof ArrayBuffer || ArrayBuffer.isView(v))) return v;
    if (typeof IDBRequest !== 'undefined' && v instanceof IDBRequest) return undefined;
    if (typeof Node !== 'undefined' && v instanceof Node) return undefined;
    seen.add(v);
    if (Array.isArray(v)) return v.map((x) => { const s = sanitizeForIDB(x, seen); return s === undefined ? null : s; });
    const o = {};
    for (const k of Object.keys(v)) { const sv = sanitizeForIDB(v[k], seen); if (sv !== undefined) o[k] = sv; }
    return o;
  };

  const DB = {
    _db: null, memory: false, _mem: {},
    useMemory() { this.memory = true; const m = this._mem; this.get = async (s, k) => (k !== undefined && k !== null && (m[s] || {})[k]) ? JSON.parse(JSON.stringify(m[s][k])) : undefined; this.all = async (s) => Object.values(m[s] || {}).map((x) => JSON.parse(JSON.stringify(x))); this.put = async (s, o) => { (m[s] = m[s] || {})[o[KEYS[s]]] = JSON.parse(JSON.stringify(o)); return o; }; this.del = async (s, k) => { delete (m[s] || {})[k]; }; this.clearStore = async (s) => { m[s] = {}; }; },
    open() {
      if (this._db || this.memory) return Promise.resolve(this._db);
      return new Promise((res, rej) => {
        let idb = null; try { idb = root.indexedDB; } catch (e) { idb = null; }
        if (!idb) return rej(new Error('IndexedDB unavailable'));
        const req = indexedDB.open('hrzz-english-os', 1);
        req.onupgradeneeded = (e) => { const db = e.target.result; STORES.forEach((s) => { if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: KEYS[s] }); }); };
        req.onsuccess = () => { this._db = req.result; res(this._db); };
        req.onerror = () => rej(req.error || new Error('IndexedDB blocked'));
        req.onblocked = () => rej(new Error('IndexedDB blocked'));
      });
    },
    _tx(store, mode, fn) { return this.open().then((db) => new Promise((res, rej) => { const tx = db.transaction(store, mode); const r = fn(tx.objectStore(store)); tx.oncomplete = () => res(r && r.result !== undefined ? r.result : r); tx.onerror = () => rej(tx.error); })); },
    get(store, key) { if (key === undefined || key === null) return Promise.resolve(undefined); return this._tx(store, 'readonly', (s) => s.get(key)); },
    all(store) { return this._tx(store, 'readonly', (s) => s.getAll()); },
    put(store, obj) {
      const attempt = (o) => this._tx(store, 'readwrite', (s) => s.put(o)).then(() => obj);
      return attempt(obj).catch((e) => {
        if (e && e.name === 'DataCloneError') { // e.g. a function/DOM node/IDBRequest slipped into the data
          console.warn('[HRZZ] put(' + store + '): uncloneable value sanitized and retried.', e);
          return attempt(sanitizeForIDB(obj));
        }
        throw e;
      });
    },
    del(store, key) { if (key === undefined || key === null) return Promise.resolve(); return this._tx(store, 'readwrite', (s) => s.delete(key)); },
    clearStore(store) { return this._tx(store, 'readwrite', (s) => s.clear()); },
    async wipe() { for (const s of STORES) await this.clearStore(s); LS.del('hrzz-theme'); },
    async export() { const out = { app: 'hrzz-english-fun', version: APP.version, exportedAt: new Date().toISOString(), data: {} }; for (const s of STORES) out.data[s] = await this.all(s); return out; },
    validateImport(obj) {
      if (!obj || typeof obj !== 'object') return 'File is not a JSON object.';
      if (obj.app !== 'hrzz-english-fun') return 'This file was not exported by HRZZ English Fun.';
      if (!obj.data || typeof obj.data !== 'object') return 'Missing data section.';
      for (const s of STORES) { if (obj.data[s] !== undefined && !Array.isArray(obj.data[s])) return `Store "${s}" is not a list.`; for (const row of obj.data[s] || []) { if (!row || row[KEYS[s]] === undefined) return `A record in "${s}" has no "${KEYS[s]}" key.`; } }
      return null;
    },
    async import(obj) { const err = this.validateImport(obj); if (err) throw new Error(err); await this.wipe(); for (const s of STORES) for (const row of obj.data[s] || []) await this.put(s, row); },
  };

  /* ================= ENGINE ================= */
  const LEVELS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];
  const E = {
    lesson: (id) => D.LESSONS.find((l) => l.id === id),
    levelInfo(xp) { let lvl = 1; for (let i = 1; i < LEVELS.length; i++) if (xp >= LEVELS[i]) lvl = i + 1; const base = LEVELS[lvl - 1] ?? LEVELS[LEVELS.length - 1]; const next = LEVELS[lvl] ?? base + 800; return { level: lvl, base, next, pct: Math.min(100, Math.round(((xp - base) / (next - base)) * 100)) }; },

    async profile() { return (await DB.get('profile', 'me')) || null; },
    async settings() { return Object.assign({ id: 'settings', dailyTargetMin: 60, sessionLength: 30, feedbackTiming: 'end', ttsRate: 0.9, ttsVoice: '', aiProxyUrl: '', aiTested: false, autoListen: false }, (await DB.get('settings', 'settings')) || {}); },
    async saveSettings(patch) { const s = await this.settings(); return DB.put('settings', Object.assign(s, patch, { id: 'settings' })); },
    async day(date = U.today()) { return (await DB.get('days', date)) || { date, activeSec: 0, xp: 0, activities: 0, milestoneDone: false }; },

    async totalXP() { const ev = await DB.all('xpEvents'); return ev.reduce((a, e) => a + e.xp, 0); },
    /** Award XP once per unique key. Returns xp actually granted (0 if duplicate). */
    async awardXP(key, xp, label) {
      const existing = await DB.get('xpEvents', key); if (existing) return 0;
      await DB.put('xpEvents', { key, xp, label, ts: Date.now(), date: U.today() });
      const d = await this.day(); d.xp += xp; await DB.put('days', d);
      return xp;
    },
    /** Record a completed learning activity (actual evidence). */
    async recordActivity(a) {
      const act = Object.assign({ id: U.uid(), ts: Date.now(), date: U.today() }, a);
      await DB.put('activities', act);
      const d = await this.day(); d.activities = (d.activities || 0) + 1; await DB.put('days', d);
      let granted = 0; if (a.xp && a.xpKey) granted = await this.awardXP(a.xpKey, a.xp, a.title || a.type);
      act.xpGranted = granted;
      await this.checkAchievements();
      return act;
    },
    async addActiveTime(sec) { const d = await this.day(); d.activeSec = (d.activeSec || 0) + sec; await DB.put('days', d); await this.checkAchievements(); return d; },

    async streak() {
      const days = (await DB.all('days')).filter((d) => d.activities > 0 || d.milestoneDone).map((d) => d.date).sort();
      const set = new Set(days); if (!set.size) return { current: 0, best: 0, todayDone: false };
      const today = U.today(); let cur = 0; let cursor = set.has(today) ? today : U.addDays(today, -1);
      while (set.has(cursor)) { cur++; cursor = U.addDays(cursor, -1); }
      let best = 0, run = 0, prev = null; for (const d of days) { run = prev && U.addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; }
      return { current: cur, best, todayDone: set.has(today) };
    },

    /* ----- text analysis (rule-based, honest) ----- */
    analyze(text) {
      const raw = (text || '').trim(); const low = raw.toLowerCase(); const issues = []; let fixed = raw;
      for (const det of D.DETECTORS) { det.re.lastIndex = 0; const m = low.match(det.re); if (m) { issues.push({ key: det.key, label: det.label, explain: det.explain, example: m[0], minor: !!det.minor, lesson: det.lesson }); fixed = det.fix(fixed); } }
      const wc = U.words(raw); if (wc > 0 && wc < 6) issues.push({ key: 'short-answer', label: T('Short answer'), explain: { en: 'Add a reason, an example, or one more detail to make your answer fuller.', id: 'Tambahkan alasan, contoh, atau satu detail lagi agar jawabanmu lebih lengkap.' }, example: raw, soft: true, lesson: 'opinion-reason-example' });
      fixed = U.cap(fixed.replace(/\s+/g, ' ').trim()); if (fixed && !/[.!?]$/.test(fixed)) fixed += '.';
      return { text: raw, words: wc, issues, natural: fixed, changed: U.norm(fixed) !== U.norm(raw) };
    },
    async recordObservations(analysis, context) {
      for (const is of analysis.issues) { if (is.minor) continue; const row = (await DB.get('errors', is.key)) || { key: is.key, label: is.label, count: 0, examples: [], lesson: is.lesson }; row.count++; row.lastTs = Date.now(); if (row.examples.length < 3) row.examples.push({ text: is.example, context, ts: Date.now() }); await DB.put('errors', row); }
    },
    async recurringErrors() { return (await DB.all('errors')).filter((e) => e.count >= 3).sort((a, b) => b.count - a.count); },
    async addVocab(items, source) { const all = await DB.all('vocab'); const have = new Set(all.map((v) => v.en.toLowerCase())); for (const it of items) { if (have.has(it.en.toLowerCase())) continue; await DB.put('vocab', { id: U.uid(), en: it.en, id_: it.id || '', source, ts: Date.now() }); } },

    /* ----- checking exercise answers ----- */
    checkExercise(ex, input, extra) {
      const n = U.norm(input);
      if (ex.type === 'fill') return { ok: ex.answers.some((a) => U.norm(a) === n), expected: ex.answers[0] };
      if (ex.type === 'choose') return { ok: Number(input) === ex.correct, expected: ex.options[ex.correct] };
      if (ex.type === 'arrange') return { ok: U.norm(ex.answer) === n, expected: ex.answer };
      if (ex.type === 'combine') return { ok: ex.answers.some((a) => U.norm(a) === n) || (new RegExp(ex.must || 'because|and|so', 'i').test(n) && U.words(n) >= 5 && ex.answers.some((a) => n.split(' ').filter((w) => a.includes(w)).length >= a.split(' ').length - 2)), expected: ex.answers[0] };
      if (ex.type === 'complete' || ex.type === 'keywords') {
        const full = ex.type === 'complete' ? `${ex.starter} ${input}` : input; const wc = U.words(full); const ok = wc >= (ex.minWords || 5) && new RegExp(ex.must, 'i').test(full.toLowerCase()) && (ex.type !== 'keywords' || ex.keywords.filter((k) => full.toLowerCase().includes(k)).length >= Math.min(2, ex.keywords.length));
        const an = this.analyze(full); return { ok: ok && !an.issues.some((i) => !i.minor && !i.soft), analysis: an, expected: ex.hint, reason: wc < (ex.minWords || 5) ? (I18N && I18N.lang === 'id' ? `Butuh minimal ${ex.minWords || 5} kata (kamu menulis ${wc}).` : `Needs at least ${ex.minWords || 5} words (you wrote ${wc}).`) : !new RegExp(ex.must, 'i').test(full.toLowerCase()) ? T('Use the target pattern.') : an.issues.filter((i) => !i.minor && !i.soft).map((i) => i.label).join(', ') };
      }
      return { ok: false };
    },
    checkFreeResponse(spec, text) { const an = this.analyze(text); const wc = an.words; const okPattern = spec.must ? new RegExp(spec.must, 'i').test(text.toLowerCase()) : true; return { ok: wc >= spec.minWords && okPattern, words: wc, okPattern, analysis: an, reason: wc < spec.minWords ? (I18N && I18N.lang === 'id' ? `Targetkan minimal ${spec.minWords} kata (sekarang ${wc}).` : `Aim for at least ${spec.minWords} words (you have ${wc}).`) : !okPattern ? T('Try to use the target pattern from this lesson.') : '' }; },

    /* ----- milestone engine ----- */
    async milestoneFor(date = U.today()) {
      const existing = await DB.get('milestones', date); if (existing && existing.lessonId && this.lesson(existing.lessonId) && existing.condition && existing.progress) return existing;
      if (existing) await DB.del('milestones', date); // corrupt record from an older build: regenerate
      const profile = (await this.profile()) || { stage: 'foundation', goals: Object.keys(D.GOALS), interests: [] };
      const progress = await DB.all('lessonProgress'); const recurring = await this.recurringErrors(); const acts = await DB.all('activities');
      const recentMs = (await DB.all('milestones')).filter((m) => m.date !== date && m.date >= U.addDays(date, -2)).map((m) => m.lessonId);
      const doneMap = {}; progress.forEach((p) => { if (p.completedAt) doneMap[p.lessonId] = p.completedAt; });
      const skillCount = {}; acts.forEach((a) => { if (a.skill) skillCount[a.skill] = (skillCount[a.skill] || 0) + 1; });
      const goals = profile.goals && profile.goals.length ? profile.goals : Object.keys(D.GOALS);
      const leastSkill = goals.slice().sort((a, b) => (skillCount[a] || 0) - (skillCount[b] || 0))[0];
      const order = ['foundation', 'growth', 'challenge']; const si = order.indexOf(profile.stage || 'foundation'); const rnd = U.seed(date + 'ms');
      const scored = D.LESSONS.map((l) => {
        let s = 0; const why = [];
        const li = order.indexOf(l.stage); if (li === si) { s += 3; why.push(`matches your ${l.stage} stage`); } else if (Math.abs(li - si) === 1) s += 1; else s -= 3;
        if (l.targets.some((t) => recurring.find((r) => r.key === t))) { s += 3; why.push('targets a recurring mistake'); }
        const hit = (profile.interests || []).filter((i) => l.topics.includes(i)); if (hit.length) { s += 1; why.push(`fits your interest in ${hit[0]}`); }
        if (l.skill === leastSkill) { s += 2; why.push(`balances your ${D.SKILLS[l.skill].label.toLowerCase()} goal`); }
        if (!goals.includes(l.skill)) s -= 2;
        if (doneMap[l.id]) { const daysAgo = (Date.now() - doneMap[l.id]) / 864e5; s -= daysAgo < 3 ? 6 : 2; }
        if (recentMs.includes(l.id)) s -= 5;
        return { l, s: s + rnd(), why };
      }).sort((a, b) => b.s - a.s);
      const pick = scored[0]; const l = pick.l; const nextL = scored[1]?.l;
      const ms = { date, lessonId: l.id, title: l.milestone.title, explain: l.milestone.explain, skill: l.skill, stage: l.stage, outcome: l.milestone.outcome, minutes: l.minutes, condition: l.milestone.condition, xp: l.milestone.xp, why: pick.why, steps: ['See an example', 'Understand the pattern', 'Listen and repeat', 'Build sentences', 'Guided speaking', 'Independent speaking', 'Review'], progress: { built: 0, guidedWords: 0, independentWords: 0 }, completed: false, nextLessonId: nextL ? nextL.id : null, createdAt: Date.now() };
      await DB.put('milestones', ms); return ms;
    },
    milestonePct(ms) { const c = ms.condition, p = ms.progress; const parts = [Math.min(1, p.built / c.built), Math.min(1, p.guidedWords / c.guidedWords), Math.min(1, p.independentWords / c.independentWords)]; return Math.round((parts.reduce((a, b) => a + b, 0) / 3) * 100); },
    milestoneMet(ms) { const c = ms.condition, p = ms.progress; return p.built >= c.built && p.guidedWords >= c.guidedWords && p.independentWords >= c.independentWords; },
    async updateMilestoneProgress(lessonId, patch) { const ms = await DB.get('milestones', U.today()); if (!ms || ms.lessonId !== lessonId) return null; Object.assign(ms.progress, patch); await DB.put('milestones', ms); return ms; },
    async completeMilestone(ms, evidence) {
      if (ms.completed) return { ms, xp: 0 }; if (!this.milestoneMet(ms)) return { ms, xp: 0, notMet: true };
      ms.completed = true; ms.completedAt = Date.now(); ms.evidence = evidence; await DB.put('milestones', ms);
      const d = await this.day(ms.date); d.milestoneDone = true; await DB.put('days', d);
      const xp = await this.awardXP(`milestone:${ms.date}`, ms.xp, 'Daily milestone: ' + ms.title);
      await this.checkAchievements(); return { ms, xp };
    },
    async adaptStage() { // adjust stage based on evidence: last 5 lesson results
      const p = await this.profile(); if (!p) return; const acts = (await DB.all('activities')).filter((a) => a.type === 'lesson').sort((a, b) => b.ts - a.ts).slice(0, 5); if (acts.length < 3) return;
      const avg = acts.reduce((s, a) => s + (a.score || 0), 0) / acts.length; const order = ['foundation', 'growth', 'challenge']; let i = order.indexOf(p.stage);
      if (avg >= 85 && i < 2 && acts.length >= 4) i++; else if (avg < 50 && i > 0) i--; if (order[i] !== p.stage) { p.stage = order[i]; p.support = { foundation: 'high', growth: 'medium', challenge: 'low' }[order[i]]; p.stageChangedAt = Date.now(); await DB.put('profile', p); return order[i]; }
    },

    /* ----- daily plan ----- */
    async plan(minutes, recurring) {
      const slots = [
        { slot: 'warmup', title: T('Warm-up: Quick Wins'), min: 5, href: '/play/?type=quickwin&slot=warmup', icon: '⚡' },
        { slot: 'lesson', title: T("Guided practice: today's mission"), min: 10, href: '/mission/', icon: '🎯' },
        { slot: 'conversation', title: T('Conversation: Free Talk'), min: 15, href: '/speak/?mode=free&slot=conversation', icon: '💬' },
        { slot: 'focus', title: recurring && recurring[0] ? `${T('Focused skill: fix')} "${recurring[0].label}"` : T('Focused skill: Speak for 30 seconds'), min: 15, href: recurring && recurring[0] ? '/play/?type=repair&slot=focus' : '/play/?type=speak30&slot=focus', icon: '🔧' },
        { slot: 'realworld', title: T('Real-world mission'), min: 15, href: '/play/?type=realworld&slot=realworld', icon: '🌍' },
      ];
      const pick = minutes >= 60 ? slots : minutes >= 30 ? [slots[0], slots[1], slots[2]] : minutes >= 20 ? [slots[0], slots[1]] : [slots[1]];
      if (minutes === 20) pick[1] = Object.assign({}, pick[1], { min: 15 }); if (minutes === 30) { pick[1] = Object.assign({}, pick[1], { min: 15 }); pick[2] = Object.assign({}, pick[2], { min: 10 }); }
      const acts = (await DB.all('activities')).filter((a) => a.date === U.today());
      return pick.map((s) => Object.assign({}, s, { done: acts.some((a) => a.slot === s.slot || (s.slot === 'lesson' && a.type === 'lesson')) }));
    },

    async recommendations() {
      const rec = []; const recurring = await this.recurringErrors(); const p = await this.profile(); const acts = await DB.all('activities'); const sessions = await DB.all('sessions');
      for (const r of recurring.slice(0, 2)) { const l = r.lesson ? this.lesson(r.lesson) : null; rec.push({ title: l ? `${T('Lesson:')} ${l.title}` : T('Repair the Sentence'), why: I18N && I18N.lang === 'id' ? `Kamu sudah ${r.count} kali menulis "${r.label}". Bukti: "${r.examples[0]?.text}".` : `You've made "${r.label}" ${r.count} times. Evidence: "${r.examples[0]?.text}".`, href: l ? `/mission/?lesson=${l.id}` : '/play/?type=repair', tag: T('Fix a pattern') }); }
      const shortCount = acts.filter((a) => (a.issues || []).includes('short-answer')).length; if (shortCount >= 3) rec.push({ title: T('Opinion Challenge'), why: I18N && I18N.lang === 'id' ? `${shortCount} jawabanmu kurang dari 6 kata. Latih menambahkan alasan dan contoh.` : `${shortCount} of your answers were under 6 words. Practice adding a reason and an example.`, href: '/play/?type=opinion', tag: T('Expand answers') });
      if (!sessions.length) rec.push({ title: T('Try the Speaking Studio'), why: T('You have not done a speaking session yet. Start with Free Talk about something you enjoy.'), href: '/speak/?mode=free', tag: T('New') });
      const goals = p?.goals || []; if (goals.includes('professional') && !sessions.some((s) => s.scenario === 'job-interview')) rec.push({ title: T('Job interview simulation'), why: T('Your goal includes workplace English, and you have not tried the interview simulation.'), href: '/speak/?mode=sim&scenario=job-interview', tag: T('Goal') });
      if (rec.length < 3) { const lp = await DB.all('lessonProgress'); const done = new Set(lp.filter((x) => x.completedAt).map((x) => x.lessonId)); const next = D.LESSONS.find((l) => !done.has(l.id) && l.stage === (p?.stage || 'foundation')); if (next) rec.push({ title: `${T('Lesson:')} ${next.title}`, why: I18N && I18N.lang === 'id' ? `Pelajaran tahap ${T(D.STAGES[next.stage].label).toLowerCase()} yang belum kamu selesaikan.` : `A ${next.stage}-stage lesson you have not completed yet.`, href: `/mission/?lesson=${next.id}`, tag: T('Next up') }); }
      const seen = new Set(); return rec.filter((r) => (seen.has(r.href) ? false : seen.add(r.href))).slice(0, 4);
    },

    async skillSnapshot() {
      const acts = (await DB.all('activities')).filter((a) => a.skill && typeof a.score === 'number'); const out = {};
      for (const k of Object.keys(D.SKILLS)) { const rows = acts.filter((a) => a.skill === k).sort((a, b) => b.ts - a.ts).slice(0, 8); out[k] = rows.length ? { score: Math.round(rows.reduce((s, a) => s + a.score, 0) / rows.length), n: rows.length } : { score: null, n: 0 }; }
      return out;
    },
    async weekBoss() { const wk = U.weekKey(U.today()); const idx = Math.abs([...wk].reduce((h, c) => h + c.charCodeAt(0), 0)) % D.BOSSES.length; const boss = D.BOSSES[idx]; const done = !!(await DB.get('xpEvents', `boss:${wk}`)); return Object.assign({ week: wk, done }, boss); },

    async checkAchievements() {
      const have = new Set((await DB.all('achievements')).map((a) => a.id)); const grant = async (id) => { if (have.has(id)) return; await DB.put('achievements', { id, ts: Date.now() }); have.add(id); UI.toast(`${T('Badge unlocked:')} ${D.BADGES.find((b) => b.id === id).title}`, 'success'); };
      const acts = await DB.all('activities'); const days = await DB.all('days'); const xp = await this.totalXP(); const st = await this.streak(); const sessions = await DB.all('sessions'); const vocab = await DB.all('vocab');
      if (days.some((d) => d.milestoneDone)) await grant('first-mission');
      if (acts.reduce((s, a) => s + (a.built || 0), 0) >= 25) await grant('five-sentences');
      if (st.best >= 3) await grant('streak-3'); if (st.best >= 7) await grant('streak-7');
      if (xp >= 250) await grant('xp-250'); if (xp >= 1000) await grant('xp-1000');
      if (sessions.length) await grant('first-speak'); if (sessions.some((s) => s.mode === 'sim')) await grant('first-sim');
      if ((await DB.all('xpEvents')).some((e) => e.key.startsWith('boss:'))) await grant('boss-1');
      if (days.some((d) => d.activeSec >= 3600)) await grant('hour-day'); if (vocab.length >= 20) await grant('vocab-20');
      if (acts.filter((a) => a.type === 'repair' && a.score === 100).length >= 10) await grant('fixer');
    },
  };

  /* ================= ACTIVE-TIME TRACKER ================= */
  const Timer = {
    running: false, sec: 0, _last: 0, _unflushed: 0, _iv: null, idleMs: 120000, onTick: null, paused: false,
    start() { if (this._iv) return; this._last = Date.now(); this._iv = setInterval(() => this._tick(), 1000); ['keydown', 'pointerdown', 'input', 'touchstart'].forEach((ev) => document.addEventListener(ev, () => { this._last = Date.now(); }, { passive: true })); window.addEventListener('beforeunload', () => this.flush()); document.addEventListener('visibilitychange', () => { if (document.hidden) this.flush(); }); },
    _tick() { const active = !document.hidden && !this.paused && Date.now() - this._last < this.idleMs; this.running = active; if (active) { this.sec++; this._unflushed++; if (this._unflushed >= 15) this.flush(); } if (this.onTick) this.onTick(this); },
    async flush() { if (!this._unflushed) return; const n = this._unflushed; this._unflushed = 0; try { await E.addActiveTime(n); } catch (e) { this._unflushed += n; } },
    isIdle() { return Date.now() - this._last >= this.idleMs; },
  };

  /* ================= SPEECH ================= */
  const Speech = {
    ttsSupported: 'speechSynthesis' in root && 'SpeechSynthesisUtterance' in root,
    sttSupported: !!(root.SpeechRecognition || root.webkitSpeechRecognition),
    _voices: [], _rec: null,
    voices() { if (!this.ttsSupported) return []; this._voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)); return this._voices; },
    async speak(text, opts = {}) {
      if (!this.ttsSupported) return false; speechSynthesis.cancel(); const s = await E.settings(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = opts.rate ?? s.ttsRate ?? 0.9;
      const vs = this.voices(); const pick = vs.find((v) => v.name === s.ttsVoice) || vs.find((v) => /en-US/i.test(v.lang)) || vs[0]; if (pick) u.voice = pick;
      return new Promise((res) => { u.onend = () => res(true); u.onerror = () => res(false); speechSynthesis.speak(u); });
    },
    stop() { if (this.ttsSupported) speechSynthesis.cancel(); },
    listen({ onResult, onEnd, onError, interim }) {
      if (!this.sttSupported) { onError && onError({ error: 'unsupported', message: T('Speech recognition is not supported in this browser. Chrome or Edge on desktop/Android support it. You can type your answer instead.') }); return null; }
      if (!root.isSecureContext) { onError && onError({ error: 'insecure', message: T('Voice input needs a secure (https) connection.') }); return null; }
      this.stop();
      const R = root.SpeechRecognition || root.webkitSpeechRecognition; const rec = new R(); rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = !/Android|iPhone|iPad/i.test(navigator.userAgent); /* Android/iOS duplicate finals in continuous mode */ rec.maxAlternatives = 1;
      let finalText = '';
      rec.onresult = (e) => { let inter = ''; for (let i = e.resultIndex; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) finalText += (finalText ? ' ' : '') + t.trim(); else inter += t; } interim && interim(finalText + (inter ? ' ' + inter : '')); };
      rec.onerror = (e) => { const map = { 'not-allowed': T('Microphone permission was denied. Allow the microphone in your browser settings, or type instead.'), 'no-speech': T('No speech was detected. Try again and speak a little louder.'), network: T('Speech recognition needs an internet connection (the browser sends audio to its speech service).'), 'audio-capture': T('No microphone was found.'), aborted: T('Listening was stopped.') }; onError && onError({ error: e.error, message: map[e.error] || `Speech error: ${e.error}` }); };
      rec.onend = () => { this._rec = null; onResult && onResult(finalText.trim()); onEnd && onEnd(); };
      try { rec.start(); this._rec = rec; } catch (err) { onError && onError({ error: 'start', message: T('Could not start the microphone.') }); return null; }
      return rec;
    },
    stopListening() { if (this._rec) { try { this._rec.stop(); } catch (e) { /* ignore */ } } },
  };

  /* ================= AI PROVIDER ADAPTER ================= */
  // Honest adapter: the app talks ONLY to a user-configured proxy URL. No secret keys live in the browser.
  // Expected contract: POST {messages:[{role,content}], mode} → {reply:string}. The proxy must hold the key and authenticate the caller.
  const AI = {
    _status: null,
    async config() { const s = await E.settings(); return { url: (s.aiProxyUrl || '').trim(), tested: !!s.aiTested }; },
    async available() { const c = await this.config(); return !!c.url && c.tested; },
    async test(url) { try { const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'Reply with the single word OK.' }], mode: 'test' }) }); if (!r.ok) return { ok: false, message: `Proxy responded ${r.status}.` }; const j = await r.json(); if (typeof j.reply !== 'string') return { ok: false, message: T('Proxy response has no "reply" string.') }; return { ok: true, message: 'Connected. Reply: ' + j.reply.slice(0, 40) }; } catch (e) { return { ok: false, message: 'Could not reach the proxy: ' + e.message }; } },
    async chat(messages, mode) { const c = await this.config(); if (!c.url) throw new Error('No AI provider configured'); const r = await fetch(c.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages, mode }) }); if (!r.ok) throw new Error('AI proxy error ' + r.status); const j = await r.json(); if (typeof j.reply !== 'string') throw new Error('Bad proxy reply'); return j.reply; },
  };

  /* ================= UI ================= */
  const NAV = [
    { id: 'home', label: T('Home'), href: '/', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z"/></svg>' },
    { id: 'speak', label: T('Speak'), href: '/speak/', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/></svg>' },
    { id: 'explore', label: T('Explore'), href: '/explore/', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8l-2.5 6.5L7 17l2.5-6.5z"/></svg>' },
    { id: 'progress', label: T('Progress'), href: '/progress/', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>' },
    { id: 'coach', label: T('My Coach'), href: '/coach/', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>' },
    { id: 'settings', label: T('Settings'), href: '/settings/', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>' },
  ];
  const UI = {
    $: (sel, el = document) => el.querySelector(sel), $$: (sel, el = document) => [...el.querySelectorAll(sel)],
    theme() { return LS.get('hrzz-theme') || 'dark'; },
    applyTheme(t) { document.documentElement.setAttribute('data-theme', t); LS.set('hrzz-theme', t); },
    toast(msg, kind = '') { let w = UI.$('.toast-wrap'); if (!w) { w = document.createElement('div'); w.className = 'toast-wrap'; document.body.appendChild(w); } const t = document.createElement('div'); t.className = 'toast ' + kind; t.textContent = msg; w.appendChild(t); setTimeout(() => { t.style.transition = '.3s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2800); },
    modal(html, { closable = true } = {}) { const bg = document.createElement('div'); bg.className = 'modal-bg'; bg.innerHTML = `<div class="modal fade-in" role="dialog" aria-modal="true">${html}</div>`; if (closable) bg.addEventListener('click', (e) => { if (e.target === bg) bg.remove(); }); document.body.appendChild(bg); return bg; },
    confetti() { const c = document.createElement('div'); c.className = 'confetti'; const colors = ['#5b4bff', '#ff7a45', '#15b78b', '#ffc531', '#ef4a6e', '#2f8cff']; for (let i = 0; i < 70; i++) { const p = document.createElement('i'); p.style.left = Math.random() * 100 + 'vw'; p.style.background = colors[i % colors.length]; p.style.animationDelay = Math.random() * 0.6 + 's'; p.style.animationDuration = 1.4 + Math.random() + 's'; c.appendChild(p); } document.body.appendChild(c); setTimeout(() => c.remove(), 2800); },
    ring(pct, label, sub, color) { const r = 40, c = 2 * Math.PI * r; return `<div class="ring"><svg width="96" height="96" viewBox="0 0 96 96"><circle class="track" cx="48" cy="48" r="${r}" fill="none" stroke-width="9"/><circle class="bar" cx="48" cy="48" r="${r}" fill="none" stroke-width="9" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.min(1, pct / 100))}" ${color ? `style="stroke:${color}"` : ''}/></svg><div class="ring-label"><div><div style="font-size:20px">${label}</div>${sub ? `<div style="font-size:10px;font-weight:600;color:var(--muted)">${sub}</div>` : ''}</div></div></div>`; },
    skillChip(k) { const s = D.SKILLS[k]; return s ? `<span class="chip chip-${s.color}">${s.icon} ${T(s.label)}</span>` : ''; },
    stageChip(k) { return `<span class="chip">${T(D.STAGES[k]?.label || k)}</span>`; },
    renderShell(active) {
      document.documentElement.setAttribute('data-theme', UI.theme());
      const top = document.createElement('header'); top.className = 'topbar'; top.innerHTML = `<div class="topbar-inner"><a class="logo" href="/"><span class="logo-mark">H</span><span>HRZZ <span style="color:var(--brand)">English Fun</span></span></a><nav class="nav-desktop">${NAV.map((n) => `<a class="nav-link ${n.id === active ? 'active' : ''}" href="${n.href}">${T(n.label)}</a>`).join('')}</nav><div style="margin-left:auto;display:flex;gap:8px;align-items:center"><span id="hdr-xp" class="chip chip-brand" title="Total XP">… XP</span><span id="hdr-streak" class="chip chip-accent" title="Current streak">🔥 …</span><button id="lang-toggle" class="btn btn-ghost btn-sm" title="English / Bahasa Indonesia">${I18N && I18N.lang === 'id' ? 'EN' : 'ID'}</button><button id="theme-toggle" class="btn btn-ghost btn-sm" aria-label="Toggle theme" title="Toggle theme">◐</button></div></div>`;
      document.body.prepend(top);
      const bot = document.createElement('nav'); bot.className = 'nav-mobile'; bot.innerHTML = NAV.map((n) => `<a href="${n.href}" class="${n.id === active ? 'active' : ''}">${n.icon}<span>${T(n.label)}</span></a>`).join(''); document.body.appendChild(bot);
      UI.$('#theme-toggle').addEventListener('click', () => UI.applyTheme(UI.theme() === 'dark' ? 'light' : 'dark'));
      UI.$('#lang-toggle').addEventListener('click', () => { I18N.set(I18N.lang === 'id' ? 'en' : 'id'); location.reload(); }); document.documentElement.lang = I18N ? I18N.lang : 'en';
      UI.refreshHeader();
    },
    async refreshHeader() { try { const xp = await E.totalXP(); const st = await E.streak(); const x = UI.$('#hdr-xp'); if (x) x.textContent = `${xp} XP · Lv ${E.levelInfo(xp).level}`; const s = UI.$('#hdr-streak'); if (s) s.textContent = `🔥 ${st.current}`; } catch (e) { /* db unavailable */ } },
    speakBtn(text, extra = '') { return `<button class="btn btn-ghost btn-sm tts-btn" data-say="${U.esc(text)}" ${Speech.ttsSupported ? '' : 'disabled title="Text-to-speech is not supported in this browser"'} ${extra}>🔊 ${T('Listen')}</button>`; },
    bindTTS(scope = document) { UI.$$('.tts-btn', scope).forEach((b) => { if (b._bound) return; b._bound = true; b.addEventListener('click', () => Speech.speak(b.dataset.say, { rate: b.dataset.rate ? Number(b.dataset.rate) : undefined })); }); },
    /** Mic + textarea response widget. Returns {el, getText, setText}. */
    responseBox({ placeholder = T('Type your answer, or use the microphone…'), rows = 3 } = {}) {
      const el = document.createElement('div'); el.innerHTML = `<textarea class="textarea" rows="${rows}" placeholder="${U.esc(placeholder)}"></textarea><div style="display:flex;align-items:center;gap:12px;margin-top:10px;flex-wrap:wrap"><button class="mic-btn" type="button" ${Speech.sttSupported ? '' : 'disabled'} aria-label="Record"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/></svg></button><div class="mic-status muted" style="font-size:13px;flex:1">${Speech.sttSupported ? T('Tap the mic and speak in English. Tap again to stop.') : 'Voice input is not supported in this browser (works in Chrome/Edge). Typing works everywhere.'}</div></div>`;
      const ta = el.querySelector('textarea'), mic = el.querySelector('.mic-btn'), status = el.querySelector('.mic-status'); let listening = false, base = '', discard = false;
      const stop = () => { if (!listening) return; discard = true; Speech.stopListening(); listening = false; mic.classList.remove('listening'); };
      mic.addEventListener('click', () => { if (listening) { Speech.stopListening(); return; } base = ta.value.trim(); listening = true; discard = false; mic.classList.add('listening'); status.textContent = T('Listening… speak now. Tap the mic again to stop.'); Speech.listen({ interim: (t) => { if (!discard) ta.value = (base ? base + ' ' : '') + t; }, onResult: (t) => { if (discard) return; if (t) ta.value = (base ? base + ' ' : '') + t; }, onEnd: () => { const wasDiscard = discard; listening = false; discard = false; mic.classList.remove('listening'); if (wasDiscard) return; status.textContent = ta.value.trim() ? T('Transcript captured. Edit it if needed, then submit.') : T('Nothing captured. Try again or type.'); ta.dispatchEvent(new Event('input')); }, onError: (e) => { listening = false; mic.classList.remove('listening'); if (e.error === 'aborted') return; status.innerHTML = `<span style="color:var(--rose)">${U.esc(e.message)}</span>`; } }); });
      // getText() stops an in-progress recording first, so a late transcript never overwrites a cleared box.
      return { el, getText: () => { stop(); return ta.value.trim(); }, setText: (v) => { ta.value = v; }, textarea: ta, focus: () => ta.focus(), stop, isListening: () => listening };
    },
    exerciseWidget(ex, onCheck) {
      const el = document.createElement('div'); el.className = 'fade-in';
      const hintBtn = `<button class="btn btn-ghost btn-sm hint-btn" type="button">💡 ${T('Hint')}</button>`;
      let getAnswer;
      if (ex.type === 'fill') { el.innerHTML = `<p style="font-size:18px;font-weight:600;line-height:1.6;margin-bottom:14px">${U.esc(ex.text).replace('___', '<span class="chip chip-brand" style="font-size:16px">____</span>')}</p><input class="input" placeholder="Type the missing word" autocomplete="off"/>`; const inp = el.querySelector('input'); getAnswer = () => inp.value; inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') el.querySelector('.check-btn').click(); }); }
      else if (ex.type === 'choose') { el.innerHTML = `<p style="font-size:17px;font-weight:600;margin-bottom:14px">${U.esc(ex.text)}</p><div style="display:grid;gap:8px">${ex.options.map((o, i) => `<button class="option" data-i="${i}" type="button">${U.esc(o)}</button>`).join('')}</div>`; let sel = null; el.querySelectorAll('.option').forEach((b) => b.addEventListener('click', () => { sel = Number(b.dataset.i); el.querySelectorAll('.option').forEach((x) => x.classList.remove('correct', 'wrong')); el.querySelector('.check-btn').click(); })); getAnswer = () => sel; }
      else if (ex.type === 'arrange') { const rnd = U.seed(ex.answer); const words = U.shuffle(ex.words, rnd); el.innerHTML = `<p class="muted" style="margin-bottom:10px;font-weight:600">${T('Arrange the words into a correct sentence.')}</p><div class="answer-zone" aria-label="Your sentence"></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:12px">${words.map((w, i) => `<span class="word-tile" data-i="${i}" tabindex="0">${U.esc(w)}</span>`).join('')}</div><div style="margin-top:10px"><input class="input" placeholder="…or type the sentence yourself" autocomplete="off"/></div>`; const zone = el.querySelector('.answer-zone'); const typed = el.querySelector('input'); const chosen = []; el.querySelectorAll('.word-tile').forEach((t) => { const go = () => { t.classList.add('used'); chosen.push(t.textContent); const z = document.createElement('span'); z.className = 'word-tile pop'; z.textContent = t.textContent; z.addEventListener('click', () => { chosen.splice(chosen.indexOf(z.textContent), 1); z.remove(); t.classList.remove('used'); }); zone.appendChild(z); }; t.addEventListener('click', go); t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); }); getAnswer = () => typed.value.trim() || chosen.join(' '); }
      else if (ex.type === 'complete') { el.innerHTML = `<p class="muted" style="margin-bottom:10px;font-weight:600">${I18N && I18N.lang === 'id' ? `Lengkapi kalimatnya dengan kata-katamu sendiri (minimal ${ex.minWords} kata total).` : `Complete the sentence in your own words (at least ${ex.minWords} words total).`}</p><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="chip chip-brand" style="font-size:16px;padding:9px 13px">${U.esc(ex.starter)}</span><input class="input" style="flex:1;min-width:200px" placeholder="…" autocomplete="off"/></div>`; const inp = el.querySelector('input'); getAnswer = () => inp.value; inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') el.querySelector('.check-btn').click(); }); }
      else if (ex.type === 'combine') { el.innerHTML = `<p class="muted" style="margin-bottom:10px;font-weight:600">${T('Combine these two sentences into one.')}</p><div class="card-soft" style="padding:12px 14px;margin-bottom:10px;font-weight:600">1. ${U.esc(ex.a)}<br/>2. ${U.esc(ex.b)}</div><input class="input" placeholder="Write one combined sentence" autocomplete="off"/>`; const inp = el.querySelector('input'); getAnswer = () => inp.value; inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') el.querySelector('.check-btn').click(); }); }
      else if (ex.type === 'keywords') { el.innerHTML = `<p class="muted" style="margin-bottom:10px;font-weight:600">${I18N && I18N.lang === 'id' ? `Tulis kalimatmu sendiri dengan kata kunci ini (minimal ${ex.minWords} kata).` : `Write your own sentence(s) using these keywords (at least ${ex.minWords} words).`}</p><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">${ex.keywords.map((k) => `<span class="chip chip-sun">${U.esc(k)}</span>`).join('')}</div><textarea class="textarea" rows="3" placeholder="Your sentence…"></textarea>`; const ta = el.querySelector('textarea'); getAnswer = () => ta.value; }
      const bar = document.createElement('div'); bar.style.cssText = 'display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;align-items:center'; bar.innerHTML = `<button class="btn btn-primary check-btn" type="button">${T('Check')}</button>${hintBtn}<span class="fb" style="font-size:14px;font-weight:600;flex:1"></span>`; el.appendChild(bar);
      const fb = bar.querySelector('.fb');
      bar.querySelector('.hint-btn').addEventListener('click', () => { fb.innerHTML = `<span style="color:var(--sky)">💡 ${U.esc(ex.hint || ex.explain || (T('Expected:') + ' ' + (ex.answer || ex.answers?.[0] || ex.options?.[ex.correct])))}</span>`; el.dataset.hintUsed = '1'; });
      bar.querySelector('.check-btn').addEventListener('click', () => { const a = getAnswer(); if (a === null || a === undefined || a === '') { fb.textContent = T('Write or choose an answer first.'); return; } const r = E.checkExercise(ex, a); if (ex.type === 'choose') { el.querySelectorAll('.option').forEach((b) => { if (Number(b.dataset.i) === Number(a)) b.classList.add(r.ok ? 'correct' : 'wrong'); if (!r.ok && Number(b.dataset.i) === ex.correct) b.classList.add('correct'); }); } if (r.ok) { fb.innerHTML = `<span style="color:var(--mint)">✓ ${T('Correct!')}${ex.explain ? ' ' + U.esc(ex.explain) : ''}</span>`; } else { fb.innerHTML = `<span style="color:var(--rose)">✗ ${T('Not yet.')}</span> <span class="muted">${U.esc(r.reason || ex.explain || ex.hint || '')}</span>`; } onCheck(r, a, !!el.dataset.hintUsed); });
      return el;
    },
  };

  /* ================= ONBOARDING ================= */
  async function ensureProfile() {
    let p = await E.profile(); if (p) return p;
    return new Promise((resolve) => {
      const bg = UI.modal(`<div class="eyebrow">${T('Welcome to HRZZ English Fun')}</div><h2 style="font-size:26px;margin:6px 0 4px">${T("Let's set up your coach")}</h2><p class="muted" style="margin-bottom:18px">${T('Learn English. Speak Freely. Have Fun. This takes 30 seconds and you can change everything later in My Coach.')}</p>
      <label class="label">${T('What should I call you?')}</label><input id="ob-name" class="input" placeholder="${T('Your name')}" maxlength="30"/>
      <label class="label" style="margin-top:14px">${T('Your goals (pick all that apply)')}</label><div id="ob-goals" style="display:flex;gap:8px;flex-wrap:wrap">${Object.entries(D.GOALS).map(([k, v]) => `<span class="chip selectable on" data-k="${k}">${D.SKILLS[k].icon} ${T(v)}</span>`).join('')}</div>
      <label class="label" style="margin-top:14px">${T('Things you enjoy (helps me pick topics)')}</label><div id="ob-int" style="display:flex;gap:8px;flex-wrap:wrap">${D.INTERESTS.map((i) => `<span class="chip selectable" data-k="${i}">${i}</span>`).join('')}</div>
      <label class="label" style="margin-top:14px">${T('How do you feel about speaking English right now?')}</label><select id="ob-stage" class="select"><option value="foundation">${T('I often go blank. I need examples and patterns first.')}</option><option value="growth">${T('I can make basic sentences but I want to say more.')}</option><option value="challenge">${T('I can talk, but I want to sound natural and confident.')}</option></select>
      <label class="label" style="margin-top:14px">${T('Daily learning target')}</label><select id="ob-target" class="select"><option value="20">${T('20 minutes')}</option><option value="30">${T('30 minutes')}</option><option value="60" selected>${T('60 minutes (recommended plan)')}</option></select>
      <button id="ob-go" class="btn btn-primary btn-lg btn-block" style="margin-top:20px">${T('Start my English OS')}</button>`, { closable: false });
      bg.querySelectorAll('.chip.selectable').forEach((c) => c.addEventListener('click', () => c.classList.toggle('on')));
      bg.querySelector('#ob-go').addEventListener('click', async () => {
        const name = bg.querySelector('#ob-name').value.trim() || 'friend'; const goals = [...bg.querySelectorAll('#ob-goals .on')].map((c) => c.dataset.k); const interests = [...bg.querySelectorAll('#ob-int .on')].map((c) => c.dataset.k);
        p = { id: 'me', name, goals: goals.length ? goals : Object.keys(D.GOALS), interests, stage: bg.querySelector('#ob-stage').value, support: { foundation: 'high', growth: 'medium', challenge: 'low' }[bg.querySelector('#ob-stage').value], createdAt: Date.now(), notes: '' };
        await DB.put('profile', p); await E.saveSettings({ dailyTargetMin: Number(bg.querySelector('#ob-target').value) }); bg.remove(); UI.toast(I18N && I18N.lang === 'id' ? `Selamat datang, ${name}! Misi pertamamu sudah siap.` : `Welcome, ${name}! Your first mission is ready.`, 'success'); resolve(p);
      });
    });
  }

  root.HRZZ = { U, DB, E, Timer, Speech, AI, UI, ensureProfile, APP };
})(typeof window !== 'undefined' ? window : globalThis);
