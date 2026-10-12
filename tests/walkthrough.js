// Simulates exactly the engine calls page-mission.js makes during one full daily mission.
const fs = require('fs'); const vm = require('vm');
const ctx = { console, crypto: require('crypto'), setInterval, setTimeout, document: { addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; } }, Date, Math, JSON, Object, Array, Number, String, RegExp, Promise, Set, Map, Error, isSecureContext: true };
ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
for (const f of ['data.js', 'i18n.js', 'core.js']) vm.runInContext(fs.readFileSync('/workspace/drive/HRZZ English Fun/assets/' + f, 'utf8'), ctx, { filename: f });
const { U, DB, E } = ctx.HRZZ; const D = ctx.HRZZ_DATA; DB.useMemory(); ctx.HRZZ.UI.toast = (m) => console.log('   🔔', m);
const log = (...a) => console.log(...a); const problems = [];
(async () => {
  await DB.put('profile', { id: 'me', name: 'Dani', goals: ['conversation', 'speaking', 'professional'], interests: ['music', 'games'], stage: 'foundation', support: 'high' });
  const ms = await E.milestoneFor(); const L = E.lesson(ms.lessonId);
  log('1. HOME  milestone:', ms.title, '| lesson:', L.title, '| cond:', JSON.stringify(ms.condition));
  const prog = { lessonId: L.id, step: 0, built: 0, builtTotal: 0, attempts: 0, hints: 0, correctIdx: [], guided: null, independent: null, repeated: [], startedAt: Date.now(), completedAt: null };
  // Step 1-3
  await E.addVocab(L.expressions, L.title); log('2. STEP1 vocab saved:', (await DB.all('vocab')).length); prog.repeated = [0, 1, 2]; await DB.put('lessonProgress', prog); log('3. STEP2-3 pattern/listen ok');
  // Step 4: a learner answering like a beginner (some wrong first)
  const answersFor = (ex) => { if (ex.type === 'fill') return ['wrong', ex.answers[0]]; if (ex.type === 'choose') return [(ex.correct + 1) % ex.options.length, ex.correct]; if (ex.type === 'arrange') return [ex.answer.split(' ').reverse().join(' '), ex.answer]; if (ex.type === 'complete') return ['ok', { 'routine-usually': 'cook dinner and watch a movie', 'likes-because': 'Spider-Man because the action is amazing', 'plans-going-to': 'visit my cousin with my family', 'past-weekend': 'went to the beach with my friends', 'opinion-reason-example': 'useful because I can learn new things from people', 'intro-at-work': 'Dani and I work as a cashier at a small store', 'interview-about-yourself': 'worked as a barista for two years', 'speak-60-artist': 'game is Mobile Legends because I can play with my friends', 'work-problem-solution': 'that the printer was broken and nobody could print', 'mini-presentation': 'English is important for your future career' }[L.id] || 'something very interesting because I like it']; if (ex.type === 'combine') return ['I like', ex.answers[0]]; if (ex.type === 'keywords') return ['hi', { 'routine-usually': 'In the morning I usually drink coffee', 'likes-because': 'My favorite food is sate because it is delicious', 'opinion-reason-example': 'I think games are good because they are fun. For example, I learned English from games', 'interview-about-yourself': 'Currently I work as a cashier. Before that I studied business. I am looking for a role where I can grow my skills', 'speak-60-artist': 'My favorite artist is Tulus because his songs are honest. For example, Hati-Hati di Jalan. It makes me feel calm', 'work-problem-solution': 'Last week there was a problem with the printer so I called IT and as a result we finished the report on time', 'mini-presentation': 'First, it is fun. Second, it is cheap. Finally, you meet people' }[L.id] || 'I think it is good because it is fun. For example, I like it']; return ['x']; };
  for (let i = 0; i < L.exercises.length; i++) { const ex = L.exercises[i]; const [bad, good] = answersFor(ex); const r1 = E.checkExercise(ex, bad); const r2 = E.checkExercise(ex, good); prog.attempts += 2; if (r1.ok) problems.push(`exercise ${i} (${ex.type}) accepted a wrong answer: "${bad}"`); if (!r2.ok) problems.push(`exercise ${i} (${ex.type}) REJECTED a correct answer: "${good}" → ${r2.reason || r2.expected}`); else { prog.correctIdx.push(i); prog.built = prog.correctIdx.length; if (r2.analysis) await E.recordObservations(r2.analysis, 'build'); await E.updateMilestoneProgress(L.id, { built: prog.built }); } }
  log('4. STEP4 built', prog.built, '/', L.exercises.length, '→ milestone needs', ms.condition.built);
  // Step 5: guided — transcript as a mic would give it (lowercase, no punctuation)
  const gText = { 'routine-usually': 'after work i usually go to the gym and then i cook dinner because i like healthy food', 'likes-because': 'i like playing games in my free time because it helps me relax and for example i play mobile legends with my friends' }[L.id] || 'honestly i usually think it is good because it helps me a lot and for example last week i went to the gym and currently i work as a cashier so i am looking for a role where i can grow first second finally';
  const g = E.checkFreeResponse(L.guided, gText); await E.recordObservations(g.analysis, 'guided'); prog.guided = { text: gText, words: g.words, ok: g.ok }; await E.updateMilestoneProgress(L.id, { guidedWords: g.ok ? g.words : 0 });
  log('5. STEP5 guided ok:', g.ok, '| words', g.words, '| natural:', g.analysis.natural); if (!g.ok) problems.push('guided answer rejected: ' + g.reason);
  // Step 6: independent — includes two classic mistakes
  const iText = 'i usually wake up at six and then i go to gym after that i am agree that breakfast is important so i eat rice and egg then i go to work by motorcycle and i very like my morning because it is quiet and first i check my phone second i take a shower finally i leave currently i work as a cashier before that i worked in a cafe and i am looking for a better job because i want to grow for example i want to learn english';
  const ind = E.checkFreeResponse(L.independent, iText); await E.recordObservations(ind.analysis, 'independent'); prog.independent = { text: iText, words: ind.words, ok: ind.ok }; await E.updateMilestoneProgress(L.id, { independentWords: ind.ok ? ind.words : 0 });
  log('6. STEP6 independent ok:', ind.ok, '| words', ind.words, '| issues:', ind.analysis.issues.map((x) => x.key).join(', ')); if (!ind.ok) problems.push('independent answer rejected: ' + ind.reason);
  log('   natural:', ind.analysis.natural);
  // Step 7: review
  const score = Math.round((Math.min(1, prog.built / ms.condition.built) * 50) + (g.ok ? 25 : 10) + (ind.ok ? 25 : 10));
  const act = await E.recordActivity({ type: 'lesson', title: L.title, lessonId: L.id, skill: L.skill, score, built: prog.built, words: ind.words, issues: [], slot: 'lesson', xp: 40, xpKey: `lesson:${L.id}:${U.today()}` }); prog.completedAt = Date.now(); await DB.put('lessonProgress', prog);
  const fresh = await DB.get('milestones', U.today()); const res = await E.completeMilestone(fresh, {}); log('7. REVIEW score', score, '| lesson XP', act.xpGranted, '| milestone complete:', res.ms.completed, '| milestone XP', res.xp, res.notMet ? '(NOT MET)' : '');
  if (!res.ms.completed) problems.push('milestone not completed after a full valid run: ' + JSON.stringify(res.ms.progress));
  const again = await E.completeMilestone(await DB.get('milestones', U.today()), {}); if (again.xp) problems.push('milestone XP awarded twice');
  const act2 = await E.recordActivity({ type: 'lesson', title: L.title, lessonId: L.id, skill: L.skill, score, xp: 40, xpKey: `lesson:${L.id}:${U.today()}` }); if (act2.xpGranted) problems.push('lesson XP duplicated on refresh');
  const retry = await E.awardXP(`retry:${L.id}:${U.today()}`, 10); const retry2 = await E.awardXP(`retry:${L.id}:${U.today()}`, 10); if (retry2) problems.push('retry XP duplicated');
  log('8. SAVED  total XP', await E.totalXP(), '| level', E.levelInfo(await E.totalXP()).level, '| streak', JSON.stringify(await E.streak()), '| day', JSON.stringify(await E.day()));
  log('   errors observed:', (await DB.all('errors')).map((e) => `${e.key}×${e.count}`).join(', '));
  log('   stage adapt:', await E.adaptStage() || 'unchanged (needs 3+ lessons)');
  const plan = await E.plan(60, await E.recurringErrors()); log('   plan lesson slot done:', plan[1].done);
  const tomorrow = await E.milestoneFor(U.addDays(U.today(), 1)); log('9. TOMORROW milestone:', tomorrow.title, '(different lesson:', tomorrow.lessonId !== L.id, ')'); if (tomorrow.lessonId === L.id) problems.push('same milestone two days in a row');
  // export/import round trip
  const ex = await DB.export(); await DB.import(ex); log('10. BACKUP round-trip ok, xp after import:', await E.totalXP());
  log('\nPROBLEMS:', problems.length ? '\n - ' + problems.join('\n - ') : 'none');
})().catch((e) => { console.error('CRASH', e); process.exit(1); });
