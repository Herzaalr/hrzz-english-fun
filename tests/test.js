const fs = require('fs'); const vm = require('vm');
const ctx = { console, crypto: require('crypto'), localStorage: { _: {}, getItem(k) { return this._[k] ?? null; }, setItem(k, v) { this._[k] = v; }, removeItem(k) { delete this._[k]; } }, setInterval, setTimeout, document: { addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; } }, fetch: undefined, Date, Math, JSON, Object, Array, Number, String, RegExp, Promise, Set, Map, Error, isSecureContext: true };
ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
for (const f of ['data.js', 'i18n.js', 'core.js']) vm.runInContext(fs.readFileSync('/workspace/drive/HRZZ English Fun/assets/' + f, 'utf8'), ctx, { filename: f });
const { U, DB, E } = ctx.HRZZ; const D = ctx.HRZZ_DATA;
// in-memory DB mock
const mem = {}; const KEYS = { profile: 'id', settings: 'id', days: 'date', activities: 'id', sessions: 'id', milestones: 'date', errors: 'key', vocab: 'id', xpEvents: 'key', achievements: 'id', lessonProgress: 'lessonId' };
DB.open = async () => true; DB.get = async (s, k) => (mem[s] || {})[k] ? JSON.parse(JSON.stringify(mem[s][k])) : undefined; DB.all = async (s) => Object.values(mem[s] || {}).map((x) => JSON.parse(JSON.stringify(x))); DB.put = async (s, o) => { (mem[s] = mem[s] || {})[o[KEYS[s]]] = JSON.parse(JSON.stringify(o)); return o; }; DB.del = async (s, k) => { delete (mem[s] || {})[k]; }; DB.clearStore = async (s) => { mem[s] = {}; };
ctx.HRZZ.UI.toast = (m) => console.log('  toast:', m);
let pass = 0, fail = 0; const t = (name, cond) => { if (cond) pass++; else { fail++; console.log('FAIL:', name); } };
(async () => {
  // detectors
  const a1 = E.analyze('I am agree with you and i very like it');
  t('detects i-am-agree', a1.issues.some((i) => i.key === 'i-am-agree'));
  t('detects very-like', a1.issues.some((i) => i.key === 'very-like'));
  t('natural fix', /I agree with you and I really like it\./.test(a1.natural)); if (!/I agree with you and I really like it\./.test(a1.natural)) console.log('  got:', a1.natural);
  const a2 = E.analyze('Yesterday I go to the mall and she play games');
  t('past-tense', a2.issues.some((i) => i.key === 'past-tense')); t('third-person', a2.issues.some((i) => i.key === 'third-person-s')); console.log('  natural:', a2.natural);
  t('short-answer', E.analyze('I like games').issues.some((i) => i.key === 'short-answer'));
  t('clean sentence no issues', E.analyze('I usually go to the gym after work because it helps me relax.').issues.filter((i) => !i.minor).length === 0);
  t('missing-the', E.analyze('After work I usually go to gym').issues.some((i) => i.key === 'missing-the'));
  t('want-to-ing', /want to go home/.test(E.analyze('I want to going home').natural));
  t('me-and', /My friend and I/.test(E.analyze('Me and my friend went to the beach').natural));
  // exercises
  const L = D.LESSONS[0];
  t('fill ok', E.checkExercise(L.exercises[0], 'Listen').ok); t('fill wrong', !E.checkExercise(L.exercises[0], 'listens').ok);
  t('choose ok', E.checkExercise(L.exercises[1], 1).ok); t('arrange ok', E.checkExercise(L.exercises[2], 'I usually have breakfast at seven.').ok);
  t('complete ok', E.checkExercise(L.exercises[3], 'cook dinner and watch a movie').ok); t('complete short', !E.checkExercise(L.exercises[3], 'go').ok && U.words('After work, I usually go')===5);
  t('combine ok', E.checkExercise(L.exercises[4], 'I usually play games at night').ok);
  t('keywords ok', E.checkExercise(L.exercises[5], 'In the morning I usually drink coffee').ok);
  // all lessons: arrange answers consistent with words, regexes compile
  for (const l of D.LESSONS) { for (const ex of l.exercises) { if (ex.type === 'arrange') t(`arrange words match ${l.id}`, U.norm(ex.words.join(' ')) === U.norm(ex.answer)); if (ex.must) new RegExp(ex.must, 'i'); } new RegExp(l.guided.must, 'i'); new RegExp(l.independent.must, 'i'); }
  for (const q of D.QUICKWINS) for (const ex of q.items) if (ex.type === 'arrange') t('qw arrange ' + q.id, U.norm(ex.words.join(' ')) === U.norm(ex.answer));
  // repairs resolve with detectors
  for (const r of D.REPAIRS) { t('repair detects ' + r.id, E.analyze(r.wrong).issues.some((i) => i.key === r.key)); t('repair answer clean ' + r.id, !E.analyze(r.answers[0]).issues.some((i) => i.key === r.key)); }
  // levels
  t('level 1', E.levelInfo(0).level === 1); t('level 3', E.levelInfo(250).level === 3); t('level 2 pct', E.levelInfo(175).pct === 50);
  // profile + milestone
  await DB.put('profile', { id: 'me', name: 'Dani', goals: ['conversation', 'professional'], interests: ['music'], stage: 'foundation', support: 'high' });
  const ms = await E.milestoneFor(U.today()); t('milestone foundation', ms.stage === 'foundation'); t('milestone goal skill', ['conversation', 'professional'].includes(ms.skill)); console.log('  milestone:', ms.title, '|', ms.why.join(', '));
  const ms2 = await E.milestoneFor(U.today()); t('milestone stable same day', ms2.lessonId === ms.lessonId);
  // XP dedupe
  const x1 = await E.awardXP('k1', 40); const x2 = await E.awardXP('k1', 40); t('xp once', x1 === 40 && x2 === 0); t('total xp', (await E.totalXP()) === 40);
  // milestone completion gating
  await E.updateMilestoneProgress(ms.lessonId, { built: ms.condition.built, guidedWords: 2 }); let r = await E.completeMilestone(await DB.get('milestones', U.today()), {}); t('not met', r.notMet === true);
  await E.updateMilestoneProgress(ms.lessonId, { guidedWords: 20, independentWords: 40 }); r = await E.completeMilestone(await DB.get('milestones', U.today()), {}); t('met xp', r.xp === ms.xp); r = await E.completeMilestone(await DB.get('milestones', U.today()), {}); t('no double', r.xp === 0);
  // next day differs
  const ms3 = await E.milestoneFor(U.addDays(U.today(),1)); t('next day different lesson', ms3.lessonId !== ms.lessonId); console.log('  next:', ms3.title);
  // activities + streak
  await E.recordActivity({ type: 'lesson', title: 'x', skill: 'conversation', score: 90, xp: 40, xpKey: 'lesson:x' });
  await DB.put('days', { date: U.addDays(U.today(), -1), activities: 1, activeSec: 600, xp: 0 }); await DB.put('days', { date: U.addDays(U.today(), -2), activities: 1, activeSec: 600, xp: 0 });
  const st = await E.streak(); t('streak 3', st.current === 3 && st.best === 3);
  // recurring errors
  for (let i = 0; i < 3; i++) await E.recordObservations(E.analyze('I am agree'), 'test'); t('recurring after 3', (await E.recurringErrors()).some((e) => e.key === 'i-am-agree'));
  const recs = await E.recommendations(); t('rec mentions error', recs.some((r) => /agree/.test(r.why))); console.log('  recs:', recs.map((r) => r.title).join(' | '));
  const plan = await E.plan(60, await E.recurringErrors()); t('plan 5 slots', plan.length === 5 && plan[1].done === true); t('plan 10 one slot', (await E.plan(10)).length === 1);
  // export/import validation
  const ex = await DB.export(); t('validate ok', DB.validateImport(ex) === null); t('validate bad', DB.validateImport({ app: 'x' }) !== null); t('validate missing key', DB.validateImport({ app: 'hrzz-english-fun', data: { days: [{ x: 1 }] } }) !== null);
  // sim scenarios sanity
  for (const [k, s] of Object.entries(D.SCENARIOS)) t('scenario turns ' + k, s.turns.length >= 3 && s.turns.every((x) => x.q && x.minWords));
  console.log(`\n${pass} passed, ${fail} failed`);
})().catch((e) => { console.error(e); process.exit(1); });
