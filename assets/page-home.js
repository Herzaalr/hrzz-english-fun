/* HOME — Daily Command Center */
(function () {
  const { U, DB, E, UI } = window.HRZZ; const D = window.HRZZ_DATA; const T = window.T; const ID = window.HRZZ_I18N.lang === 'id';
  window.HRZZ_PAGES.home = async function (main, profile) {
    const settings = await E.settings(); const today = U.today(); const day = await E.day(today);
    const ms = await E.milestoneFor(today); const lesson = E.lesson(ms.lessonId); const xp = await E.totalXP(); const lv = E.levelInfo(xp); const streak = await E.streak();
    const recurring = await E.recurringErrors(); const plan = await E.plan(settings.sessionLength, recurring); const boss = await E.weekBoss(); const recs = await E.recommendations();
    const lp = await DB.get('lessonProgress', ms.lessonId); const unfinished = (await DB.all('lessonProgress')).filter((p) => !p.completedAt && p.step > 0 && E.lesson(p.lessonId)).sort((a, b) => b.updatedAt - a.updatedAt)[0];
    const acts = (await DB.all('activities')).sort((a, b) => b.ts - a.ts); const last = acts[0];
    const pct = E.milestonePct(ms); const targetSec = settings.dailyTargetMin * 60; const timePct = Math.min(100, Math.round((day.activeSec / targetSec) * 100));
    const started = lp && lp.step > 0 && !lp.completedAt; const cta = ms.completed ? { label: T('Milestone complete · Explore more'), href: '/explore/' } : started ? { label: T('Continue Learning'), href: '/mission/' } : { label: T("Start Today's Mission"), href: '/mission/' };
    const missed = streak.current === 0 && acts.length > 0 && !streak.todayDone;
    const insight = (() => { if (!last) return T('No learning activity recorded yet. Your first mission will give me real evidence to work with.'); const r = recurring[0]; if (r) return ID ? `Di ${r.count} jawaban kamu menulis "${r.examples[0]?.text}". Pelajaran hari ini tempat yang pas untuk melatih "${r.label}".` : `Across ${r.count} answers you wrote "${r.examples[0]?.text}". Today's lesson is a good place to practice "${r.label}".`; const best = acts.filter((a) => a.words).sort((a, b) => b.words - a.words)[0]; if (best) return ID ? `Jawaban terpanjangmu sejauh ini ${best.words} kata (${U.fmtDate(best.ts)}). Yuk dorong sedikit lagi hari ini.` : `Your longest answer so far is ${best.words} words (${U.fmtDate(best.ts)}). Let's push it a little further today.`; return ID ? `Aktivitas terakhir: ${last.title || last.type} pada ${U.fmtDate(last.ts)}. Jaga rantainya tetap nyambung.` : `Last activity: ${last.title || last.type} on ${U.fmtDate(last.ts)}. Keep the chain going.`; })();
    const c = ms.condition, p = ms.progress;
    main.innerHTML = `
      <section class="fade-in" style="margin-top:24px;display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap">
        <div><div class="eyebrow">${U.greeting()}</div><h1 style="font-size:30px;margin-top:4px">${ID ? 'Hai' : 'Hey'} ${U.esc(profile.name)}, ${T('ready to speak?')}</h1>
        <p class="muted" style="margin-top:6px;font-size:15px">${T("Today's objective:")} <b style="color:var(--text)">${U.esc(ms.title)}</b></p></div>
        <div style="display:flex;gap:8px;align-items:center"><span class="muted" style="font-size:13px;font-weight:600">${T('Session length')}</span><select id="len" class="select" style="width:auto;padding:7px 10px;font-size:13px">${[10, 20, 30, 60].map((m) => `<option value="${m}" ${settings.sessionLength === m ? 'selected' : ''}>${m} min</option>`).join('')}</select></div>
      </section>
      ${missed ? `<div class="banner info fade-in" style="margin-top:16px">👋 Welcome back! Streaks reset, but your progress didn't. A 10-minute session today restarts the chain. No guilt, just one small win.</div>` : ''}
      <section class="grid-cards" style="margin-top:20px;grid-template-columns:1fr">
        <div class="card card-pad fade-in" style="display:grid;gap:18px;grid-template-columns:1fr;align-items:center">
          <div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap">
            <div style="flex:1;min-width:240px">
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">${UI.skillChip(ms.skill)}${UI.stageChip(ms.stage)}<span class="chip">⏱ ${ms.minutes} ${T('min')}</span>${ms.completed ? '<span class="chip chip-mint">✓ Completed</span>' : ''}</div>
              <h2 style="font-size:24px;line-height:1.2">${T("Today's milestone:")} ${U.esc(ms.title)}</h2>
              <p class="muted" style="margin-top:8px">${U.esc(ms.explain)}</p>
              <p style="margin-top:8px;font-size:13.5px"><b>${T('Target outcome:')}</b> <span class="muted">${U.esc(ms.outcome)}</span></p>
              ${ms.why?.length ? `<p class="faint" style="margin-top:6px;font-size:12.5px">${T('Why this today:')} ${U.esc(ms.why.join(', '))}.</p>` : ''}
            </div>
            ${UI.ring(pct, pct + '%', 'milestone', ms.completed ? 'var(--mint)' : '')}
          </div>
          <div style="display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
            ${[[T('Sentences built'), p.built, c.built], [T('Guided answer words'), p.guidedWords, c.guidedWords], [T('Independent words'), p.independentWords, c.independentWords]].map(([l, v, t]) => `<div class="card-soft" style="padding:10px 12px"><div style="font-size:12px;font-weight:700;color:var(--muted)">${l}</div><div style="font-family:var(--font-head);font-weight:700;font-size:18px;margin:2px 0 6px">${Math.min(v, t)} <span class="faint" style="font-size:13px">/ ${t}</span></div><div class="progress ${v >= t ? 'mint' : ''}"><i style="width:${Math.min(100, (v / t) * 100)}%"></i></div></div>`).join('')}
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><a class="btn btn-primary btn-lg" href="${cta.href}">${cta.label} →</a><span class="muted" style="font-size:13px">${T('Lesson:')} ${U.esc(lesson.title)} · ${U.esc(lesson.subtitle)}</span></div>
        </div>
      </section>
      <section class="grid-cards cols-3" style="margin-top:14px">
        <div class="card card-pad fade-in" style="display:flex;align-items:center;gap:16px">${UI.ring(timePct, U.fmtMin(day.activeSec).replace(' min', 'm'), 'of ' + settings.dailyTargetMin + 'm', 'var(--accent)')}<div><div class="stat"><b>${Math.floor(day.activeSec / 60)} min</b><span>${T('Active learning today')}</span></div><p class="faint" style="font-size:12px;margin-top:8px">${T('Counts only while you are active on a learning page. Idle time is not counted.')}</p></div></div>
        <div class="card card-pad fade-in"><div style="display:flex;justify-content:space-between;align-items:baseline"><div class="stat"><b>Level ${lv.level}</b><span>${xp} ${T('XP total')}</span></div><span class="chip chip-brand">${lv.next - xp} ${T('XP to Lv')} ${lv.level + 1}</span></div><div class="progress" style="margin-top:12px"><i style="width:${lv.pct}%"></i></div><p class="faint" style="font-size:12px;margin-top:8px">${T('XP comes from completed activities and milestones, never from time alone.')}</p></div>
        <div class="card card-pad fade-in"><div class="stat"><b>🔥 ${streak.current} ${ID ? 'hari' : streak.current === 1 ? 'day' : 'days'}</b><span>${T('Current streak · best')} ${streak.best}</span></div><div style="display:flex;gap:4px;margin-top:12px">${[6, 5, 4, 3, 2, 1, 0].map((i) => { const d = U.addDays(today, -i); return `<div style="flex:1;text-align:center"><div style="height:28px;border-radius:8px;background:${d === today ? 'var(--accent-soft)' : 'var(--surface-2)'};display:grid;place-items:center;font-size:12px" data-day="${d}">·</div><div class="faint" style="font-size:10px;margin-top:3px">${U.dayName(d)}</div></div>`; }).join('')}</div></div>
      </section>
      <section class="grid-cards" style="margin-top:14px">
        <div class="card card-pad fade-in">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="font-size:18px">${T("Today's missions")}</h3><span class="chip">${plan.filter((x) => x.done).length}/${plan.length} ${T('done')} · ${plan.reduce((s, x) => s + x.min, 0)} ${T('min plan')}</span></div>
          <div style="display:grid;gap:8px">${plan.map((s) => `<a class="list-item clickable ${s.done ? 'done' : ''}" href="${s.href}" style="text-decoration:none"><span class="check ${s.done ? 'on' : ''}">${s.done ? '✓' : ''}</span><span class="icon-box" style="background:var(--surface);width:36px;height:36px;font-size:16px">${s.icon}</span><span style="flex:1;font-weight:600;font-size:14.5px">${U.esc(s.title)}</span><span class="faint" style="font-size:12px;font-weight:700">${s.min} ${T('min')}</span></a>`).join('')}</div>
          <p class="faint" style="font-size:12px;margin-top:10px">${T('Short on time? Pick a shorter session above: the daily milestone stays, the optional full-day target shrinks.')}</p>
        </div>
        <div style="display:grid;gap:14px">
          ${unfinished ? `<div class="card card-pad fade-in" style="border-color:var(--brand)"><div class="eyebrow">${T('Continue where you left off')}</div><h3 style="font-size:17px;margin:4px 0">${U.esc(E.lesson(unfinished.lessonId)?.title || unfinished.lessonId)}</h3><p class="muted" style="font-size:13.5px">${T('Step')} ${unfinished.step + 1} ${T('of 7')} · ${T('last touched')} ${U.fmtDate(unfinished.updatedAt)}</p><a class="btn btn-soft btn-sm" style="margin-top:10px" href="/mission/?lesson=${unfinished.lessonId}">${T('Resume →')}</a></div>` : ''}
          <div class="card card-pad fade-in"><div class="eyebrow">${T('Coach insight')}</div><p style="margin-top:6px;font-size:14.5px;line-height:1.55">${U.esc(insight)}</p></div>
          <div class="card card-pad fade-in hero-grad" style="border:none"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div><div class="eyebrow">${T('Weekly boss challenge')}</div><h3 style="font-size:18px;margin:4px 0">👑 ${U.esc(boss.title)}</h3><p class="muted" style="font-size:13.5px">${U.esc(boss.desc)}</p></div>${boss.done ? `<span class="chip chip-mint">${T('Beaten ✓')}</span>` : ''}</div><a class="btn btn-soft btn-sm" style="margin-top:12px" href="${boss.scenario ? `/speak/?mode=sim&scenario=${boss.scenario}&boss=1` : `/play/?type=${boss.format}&boss=1`}">${boss.done ? T('Replay') : T('Preview the boss')} →</a><p class="faint" style="font-size:11.5px;margin-top:8px">+${boss.xp} XP · worth doing after a few daily missions this week.</p></div>
        </div>
      </section>
      ${recs.length ? `<section class="card card-pad fade-in" style="margin-top:14px"><h3 style="font-size:18px;margin-bottom:10px">${T('Recommended next')}</h3><div class="grid-cards">${recs.map((r) => `<a class="list-item clickable" href="${r.href}" style="text-decoration:none;align-items:flex-start"><div style="flex:1"><div style="display:flex;gap:8px;align-items:center"><b style="font-size:14.5px">${U.esc(r.title)}</b><span class="chip chip-sky" style="font-size:11px">${U.esc(r.tag)}</span></div><p class="muted" style="font-size:13px;margin-top:4px">${U.esc(r.why)}</p></div><span>→</span></a>`).join('')}</div></section>` : ''}`;
    UI.$('#len').addEventListener('change', async (e) => { await E.saveSettings({ sessionLength: Number(e.target.value) }); location.reload(); });
    const days = await DB.all('days'); days.forEach((d) => { const el = main.querySelector(`[data-day="${d.date}"]`); if (el && (d.activities > 0 || d.milestoneDone)) { el.textContent = d.milestoneDone ? '★' : '✓'; el.style.background = d.milestoneDone ? 'var(--brand)' : 'var(--mint-soft)'; el.style.color = d.milestoneDone ? '#fff' : 'var(--mint)'; } });
  };
})();
