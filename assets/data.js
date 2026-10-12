/* HRZZ English Fun — curated learning library (works fully offline, no AI needed) */
(function (root) {
  const L = {};

  /* ---------- SKILLS / STAGES ---------- */
  L.SKILLS = {
    conversation: { label: 'Everyday Conversation', icon: '💬', color: 'brand' },
    speaking: { label: 'Public Speaking', icon: '🎤', color: 'accent' },
    professional: { label: 'Professional English', icon: '💼', color: 'sky' },
  };
  L.STAGES = {
    foundation: { label: 'Foundation', desc: 'Understand examples and build basic sentences.' },
    growth: { label: 'Growth', desc: 'Express your own ideas with less help.' },
    challenge: { label: 'Challenge', desc: 'Speak independently in realistic situations.' },
  };
  L.INTERESTS = ['music', 'games', 'movies', 'gym', 'food', 'travel', 'football', 'coding', 'photography', 'family', 'books', 'anime'];
  L.GOALS = {
    conversation: 'Everyday conversation',
    speaking: 'Public speaking & expressing ideas',
    professional: 'Job interviews & workplace English',
  };

  /* ---------- LESSONS ---------- */
  L.LESSONS = [
    {
      id: 'routine-usually', title: 'My daily routine', subtitle: 'Pattern: I usually + verb',
      skill: 'conversation', stage: 'foundation', topics: ['daily life', 'gym', 'music'], minutes: 15, targets: ['short-answer', 'missing-the'],
      pattern: { en: 'I usually + kata kerja dasar + informasi tambahan', id: 'Gunakan "I usually" untuk kebiasaan. Setelah "usually" pakai kata kerja bentuk dasar (tanpa -s, tanpa -ing). Tambahkan waktu atau tempat agar kalimat lebih hidup.' },
      dialogue: [
        { who: 'coach', en: 'What do you usually do after waking up?', id: 'Apa yang biasanya kamu lakukan setelah bangun tidur?' },
        { who: 'me', en: 'I usually take a shower and have breakfast.', id: 'Biasanya aku mandi lalu sarapan.' },
        { who: 'coach', en: 'Nice. And after that?', id: 'Bagus. Lalu setelah itu?' },
        { who: 'me', en: 'After that, I usually check my phone and go to work.', id: 'Setelah itu, biasanya aku cek HP dan berangkat kerja.' },
      ],
      examples: ['I usually listen to music in the morning.', 'I usually play games at night.', 'I usually go to the gym after work.', 'After dinner, I usually watch YouTube.'],
      expressions: [{ en: 'take a shower', id: 'mandi' }, { en: 'have breakfast', id: 'sarapan' }, { en: 'after that', id: 'setelah itu' }, { en: 'go to the gym', id: 'pergi ke gym' }, { en: 'check my phone', id: 'cek HP' }],
      exercises: [
        { type: 'fill', text: 'I usually ___ to music while I study.', answers: ['listen'], hint: 'mendengarkan' },
        { type: 'choose', text: 'Which sentence is correct?', options: ['I usually goes to the gym.', 'I usually go to the gym.', 'I usually going to the gym.'], correct: 1, explain: 'Setelah "I usually" pakai kata kerja dasar: go, bukan goes/going.' },
        { type: 'arrange', words: ['I', 'usually', 'have', 'breakfast', 'at', 'seven'], answer: 'I usually have breakfast at seven' },
        { type: 'complete', starter: 'After work, I usually', minWords: 5, must: '^after work,? i usually \\w+', hint: 'Contoh: After work, I usually cook dinner and relax.' },
        { type: 'combine', a: 'I usually play games.', b: 'I play games at night.', answers: ['i usually play games at night'], hint: 'Gabungkan: I usually play games at night.' },
        { type: 'keywords', keywords: ['morning', 'coffee', 'usually'], minWords: 5, must: 'usually', hint: 'Contoh: In the morning, I usually drink coffee.' },
      ],
      guided: { question: { en: 'What do you usually do after work or class?', id: 'Apa yang biasanya kamu lakukan setelah kerja atau kuliah?' }, hints: ['I usually...', 'After work, I...', 'Then I... because...'], minWords: 8, must: 'usually|after' },
      independent: { question: { en: 'Describe your typical morning in at least three sentences.', id: 'Ceritakan pagi harimu yang biasa, minimal tiga kalimat.' }, minWords: 15, must: 'usually|then|after' },
      milestone: { title: 'Build five routine sentences', explain: 'Use "I usually + verb" to describe your own day, then speak about your morning without help.', outcome: 'Five correct pattern sentences and a 3-sentence independent description.', condition: { built: 5, guidedWords: 8, independentWords: 15 }, xp: 60 },
    },
    {
      id: 'likes-because', title: 'What I like and why', subtitle: 'Pattern: I like ... because ...',
      skill: 'conversation', stage: 'foundation', topics: ['music', 'games', 'movies', 'food'], minutes: 15, targets: ['short-answer', 'very-like'],
      pattern: { en: 'I like / I love + noun/verb-ing + because + alasan', id: 'Setelah "like/love" pakai kata benda atau kata kerja + ing. "because" menjelaskan alasan. Hindari "I very like" — gunakan "I really like".' },
      dialogue: [
        { who: 'coach', en: 'What kind of music do you like?', id: 'Musik apa yang kamu suka?' },
        { who: 'me', en: 'I really like pop music because it makes me happy.', id: 'Aku sangat suka musik pop karena membuatku senang.' },
        { who: 'coach', en: 'Who is your favorite artist?', id: 'Siapa artis favoritmu?' },
        { who: 'me', en: 'My favorite artist is Bruno Mars because his songs are fun to sing.', id: 'Artis favoritku Bruno Mars karena lagunya asyik dinyanyikan.' },
      ],
      examples: ['I like playing games because it helps me relax.', 'I love action movies because they are exciting.', 'I really like nasi goreng because it is simple and delicious.'],
      expressions: [{ en: 'it makes me happy', id: 'itu membuatku senang' }, { en: 'it helps me relax', id: 'itu membantuku santai' }, { en: 'my favorite ... is', id: '... favoritku adalah' }, { en: 'I really like', id: 'aku sangat suka' }],
      exercises: [
        { type: 'choose', text: 'Which sentence is natural?', options: ['I very like this song.', 'I really like this song.', 'I like very this song.'], correct: 1, explain: '"Very" tidak bisa langsung di depan kata kerja. Gunakan "really like".' },
        { type: 'fill', text: 'I like playing football ___ it keeps me healthy.', answers: ['because'], hint: 'karena' },
        { type: 'arrange', words: ['I', 'love', 'anime', 'because', 'the', 'stories', 'are', 'exciting'], answer: 'I love anime because the stories are exciting' },
        { type: 'complete', starter: 'My favorite movie is', minWords: 7, must: 'because', hint: 'Sebutkan filmnya, lalu tambahkan "because ...".' },
        { type: 'combine', a: 'I like the gym.', b: 'It makes me strong.', answers: ['i like the gym because it makes me strong'], hint: 'Gunakan "because" untuk menggabungkan.' },
        { type: 'keywords', keywords: ['food', 'favorite', 'because'], minWords: 6, must: 'because', hint: 'Contoh: My favorite food is sate because it is delicious.' },
      ],
      guided: { question: { en: 'What do you like doing in your free time, and why?', id: 'Apa yang kamu suka lakukan di waktu luang, dan kenapa?' }, hints: ['I like ... because ...', 'My favorite ... is ...', 'For example, ...'], minWords: 8, must: 'because' },
      independent: { question: { en: 'Tell me about your favorite artist, game, or movie. Say what it is, why you like it, and give one example.', id: 'Ceritakan artis, game, atau film favoritmu: apa, kenapa, dan satu contoh.' }, minWords: 15, must: 'because' },
      milestone: { title: 'Explain what you like with a reason', explain: 'Move from one-word answers to "I like X because Y" with an example.', outcome: 'Five correct sentences with "because" and a 15+ word opinion about something you love.', condition: { built: 5, guidedWords: 8, independentWords: 15 }, xp: 60 },
    },
    {
      id: 'plans-going-to', title: 'Making plans', subtitle: 'Pattern: I\'m going to + verb',
      skill: 'conversation', stage: 'foundation', topics: ['weekend', 'travel', 'family'], minutes: 12, targets: ['want-to-ing'],
      pattern: { en: "I'm going to + kata kerja dasar + waktu", id: 'Untuk rencana, gunakan "I\'m going to" + kata kerja dasar. Jangan tambah -ing setelah "to": going to visit, bukan going to visiting.' },
      dialogue: [
        { who: 'coach', en: 'What are you going to do this weekend?', id: 'Apa rencanamu akhir pekan ini?' },
        { who: 'me', en: "I'm going to visit my grandmother on Saturday.", id: 'Aku akan mengunjungi nenek hari Sabtu.' },
        { who: 'coach', en: 'Sounds nice! And on Sunday?', id: 'Asyik! Kalau hari Minggu?' },
        { who: 'me', en: "On Sunday, I'm probably going to stay home and rest.", id: 'Hari Minggu, mungkin aku di rumah saja dan istirahat.' },
      ],
      examples: ["I'm going to watch a movie tonight.", "We're going to have dinner together.", "I'm going to start learning English every day."],
      expressions: [{ en: 'this weekend', id: 'akhir pekan ini' }, { en: 'probably', id: 'mungkin' }, { en: 'stay home', id: 'di rumah saja' }, { en: 'sounds nice', id: 'kedengarannya asyik' }],
      exercises: [
        { type: 'choose', text: 'Pick the correct plan.', options: ["I'm going to visiting Bali.", "I'm going to visit Bali.", 'I going to visit Bali.'], correct: 1, explain: 'Setelah "going to" pakai kata kerja dasar: visit.' },
        { type: 'fill', text: "Tonight I'm going to ___ a movie with my friends.", answers: ['watch', 'see'], hint: 'menonton' },
        { type: 'arrange', words: ["I'm", 'going', 'to', 'cook', 'dinner', 'tonight'], answer: "I'm going to cook dinner tonight" },
        { type: 'complete', starter: "This weekend, I'm going to", minWords: 6, must: "going to \\w+", hint: 'Tambahkan kegiatan dan dengan siapa.' },
        { type: 'combine', a: "I'm going to the gym.", b: 'I will go tomorrow morning.', answers: ["i'm going to the gym tomorrow morning", 'i am going to the gym tomorrow morning'], hint: 'Gabungkan tempat dan waktu.' },
      ],
      guided: { question: { en: 'What are you going to do after this lesson?', id: 'Apa yang akan kamu lakukan setelah pelajaran ini?' }, hints: ["I'm going to...", 'After that, I...', '...because...'], minWords: 7, must: 'going to' },
      independent: { question: { en: 'Describe your plans for next weekend in three sentences.', id: 'Ceritakan rencanamu akhir pekan depan dalam tiga kalimat.' }, minWords: 15, must: 'going to|will' },
      milestone: { title: 'Talk about your weekend plans', explain: 'Use "I\'m going to" to describe future plans naturally.', outcome: 'Four correct plan sentences and a three-sentence weekend plan.', condition: { built: 4, guidedWords: 7, independentWords: 15 }, xp: 50 },
    },
    {
      id: 'past-weekend', title: 'What I did last weekend', subtitle: 'Pattern: Last weekend, I + past verb',
      skill: 'conversation', stage: 'growth', topics: ['weekend', 'travel', 'food', 'family'], minutes: 15, targets: ['past-tense'],
      pattern: { en: 'Last weekend, I + kata kerja lampau (went, ate, watched, played) + detail', id: 'Untuk cerita masa lalu, kata kerja berubah: go→went, eat→ate, watch→watched, play→played, have→had, meet→met. Tambahkan "then", "after that", "finally" agar cerita mengalir.' },
      dialogue: [
        { who: 'coach', en: 'How was your weekend?', id: 'Bagaimana akhir pekanmu?' },
        { who: 'me', en: 'It was great. I went to the beach with my friends.', id: 'Seru. Aku pergi ke pantai bersama teman-teman.' },
        { who: 'coach', en: 'What did you do there?', id: 'Apa yang kalian lakukan di sana?' },
        { who: 'me', en: 'We swam, ate seafood, and then we watched the sunset.', id: 'Kami berenang, makan seafood, lalu menonton matahari terbenam.' },
      ],
      examples: ['Yesterday I played games until midnight.', 'Last week I met my old friend at a café.', 'On Sunday I stayed home and cooked for my family.'],
      expressions: [{ en: 'It was great', id: 'Seru / menyenangkan' }, { en: 'after that', id: 'setelah itu' }, { en: 'finally', id: 'akhirnya' }, { en: 'I had a good time', id: 'Aku bersenang-senang' }],
      exercises: [
        { type: 'choose', text: 'Which sentence is in the past?', options: ['Yesterday I go to the mall.', 'Yesterday I went to the mall.', 'Yesterday I going to the mall.'], correct: 1, explain: 'go → went untuk masa lalu.' },
        { type: 'fill', text: 'Last night I ___ a movie and then I slept.', answers: ['watched', 'saw'], hint: 'watch → ?' },
        { type: 'fill', text: 'Last Saturday we ___ nasi padang together.', answers: ['ate', 'had'], hint: 'eat → ?' },
        { type: 'arrange', words: ['Last', 'weekend', 'I', 'met', 'my', 'cousin', 'at', 'the', 'mall'], answer: 'Last weekend I met my cousin at the mall' },
        { type: 'complete', starter: 'Yesterday I', minWords: 6, must: '^yesterday i (went|ate|had|watched|played|met|visited|stayed|cooked|worked|studied|took|saw|bought|made|did|slept|woke|got|talked|listened|read|wrote|called|cleaned|walked|ran|drove|came|left|finished|started|learned|tried|helped|spent)\\b', hint: 'Pakai kata kerja lampau: went, ate, watched, played, met...' },
        { type: 'combine', a: 'I went to the gym.', b: 'Then I ate dinner.', answers: ['i went to the gym and then i ate dinner', 'i went to the gym, and then i ate dinner', 'i went to the gym then i ate dinner'], hint: 'Gabungkan dengan "and then".' },
      ],
      guided: { question: { en: 'What did you do last weekend?', id: 'Apa yang kamu lakukan akhir pekan lalu?' }, hints: ['Last weekend, I went...', 'Then I...', 'It was ... because...'], minWords: 10, must: '\\b(went|ate|had|watched|played|met|visited|stayed|cooked|worked|studied|took|saw|bought|was|were|did)\\b' },
      independent: { question: { en: 'Tell me about a trip or a fun day you remember. What happened first, next, and at the end?', id: 'Ceritakan perjalanan atau hari seru yang kamu ingat: awal, tengah, dan akhir.' }, minWords: 25, must: '\\b(went|ate|had|watched|played|met|visited|stayed|cooked|worked|studied|took|saw|bought|was|were|did)\\b' },
      milestone: { title: 'Retell a past experience', explain: 'Use past-tense verbs to tell a short connected story.', outcome: 'Five correct past-tense sentences and a 25+ word story with a beginning, middle and end.', condition: { built: 5, guidedWords: 10, independentWords: 25 }, xp: 70 },
    },
    {
      id: 'opinion-reason-example', title: 'Give an opinion like a pro', subtitle: 'Pattern: I think ... because ... For example ...',
      skill: 'speaking', stage: 'growth', topics: ['games', 'movies', 'music', 'daily life'], minutes: 15, targets: ['short-answer', 'i-am-agree'],
      pattern: { en: 'I think + opini. + because + alasan. + For example, + contoh.', id: 'Struktur 3 langkah: pendapat → alasan → contoh. Ini membuat jawabanmu lebih panjang dan meyakinkan. "I agree" (bukan "I am agree").' },
      dialogue: [
        { who: 'coach', en: 'Do you think video games are a waste of time?', id: 'Menurutmu apakah video game membuang waktu?' },
        { who: 'me', en: "I don't think so. I think games can be useful because they teach problem solving. For example, I learned a lot of English words from games.", id: 'Menurutku tidak. Game bisa berguna karena melatih pemecahan masalah. Contohnya, aku belajar banyak kosakata Inggris dari game.' },
      ],
      examples: ['I think working from home is good because I save time. For example, I don\'t need to drive for an hour.', 'In my opinion, breakfast is important because it gives me energy.'],
      expressions: [{ en: 'In my opinion', id: 'Menurut pendapatku' }, { en: 'I agree / I disagree', id: 'Aku setuju / tidak setuju' }, { en: 'For example', id: 'Contohnya' }, { en: 'That\'s why', id: 'Itulah sebabnya' }],
      exercises: [
        { type: 'choose', text: 'Which is correct?', options: ['I am agree with you.', 'I agree with you.', 'I am agreeing you.'], correct: 1, explain: '"Agree" adalah kata kerja, jadi tidak perlu "am".' },
        { type: 'fill', text: 'I think learning English is important ___ it opens many opportunities.', answers: ['because'], hint: 'karena' },
        { type: 'arrange', words: ['For', 'example,', 'I', 'got', 'a', 'job', 'because', 'of', 'my', 'English'], answer: 'For example, I got a job because of my English' },
        { type: 'complete', starter: 'I think social media is', minWords: 10, must: 'because', hint: 'Opini + because + alasan.' },
        { type: 'keywords', keywords: ['think', 'because', 'for example'], minWords: 12, must: 'for example', hint: 'Tulis satu opini lengkap dengan ketiga bagian.' },
      ],
      guided: { question: { en: 'Is it better to study alone or with friends? Why?', id: 'Lebih baik belajar sendiri atau dengan teman? Kenapa?' }, hints: ['I think ... is better because ...', 'For example, when I ...', 'That\'s why I ...'], minWords: 15, must: 'because' },
      independent: { question: { en: 'Should people learn English online or in a classroom? Give your opinion, a reason, and an example.', id: 'Belajar bahasa Inggris online atau di kelas? Beri pendapat, alasan, dan contoh.' }, minWords: 25, must: 'because' },
      milestone: { title: 'Opinion + reason + example', explain: 'Stop giving one-line answers: support every opinion with a reason and an example.', outcome: 'Four correct sentences and a 25+ word opinion with all three parts.', condition: { built: 4, guidedWords: 15, independentWords: 25 }, xp: 70 },
    },
    {
      id: 'intro-at-work', title: 'Introduce yourself at work', subtitle: 'Pattern: My name is... I work as... I\'m responsible for...',
      skill: 'professional', stage: 'foundation', topics: ['work'], minutes: 12, targets: ['short-answer', 'im-verb'],
      pattern: { en: "Hi, I'm + nama. I work as + pekerjaan at + perusahaan. I'm responsible for + tugas.", id: 'Perkenalan profesional punya 3 bagian: nama, peran, tanggung jawab. Gunakan "I work as a ..." atau "I\'m a ...". Jangan "I\'m work".' },
      dialogue: [
        { who: 'coach', en: "Hi, I don't think we've met. I'm Rina from marketing.", id: 'Hai, sepertinya kita belum kenal. Aku Rina dari marketing.' },
        { who: 'me', en: "Nice to meet you, Rina. I'm Dani. I work as a customer support agent, so I'm responsible for answering customer questions.", id: 'Senang bertemu, Rina. Aku Dani, bekerja sebagai customer support, jadi aku bertanggung jawab menjawab pertanyaan pelanggan.' },
      ],
      examples: ["I'm a graphic designer at a small agency.", 'I work in the finance team, and I handle monthly reports.', "I'm new here, so I'm still learning the system."],
      expressions: [{ en: 'Nice to meet you', id: 'Senang bertemu denganmu' }, { en: "I'm responsible for", id: 'Aku bertanggung jawab atas' }, { en: 'I work as', id: 'Aku bekerja sebagai' }, { en: 'I handle', id: 'Aku menangani' }],
      exercises: [
        { type: 'choose', text: 'Which is correct?', options: ["I'm work as a teacher.", 'I work as a teacher.', 'I working as a teacher.'], correct: 1, explain: 'Pakai "I work as" atau "I\'m a teacher", jangan "I\'m work".' },
        { type: 'fill', text: "I'm responsible ___ managing the schedule.", answers: ['for'], hint: 'responsible + ?' },
        { type: 'arrange', words: ['I', 'work', 'as', 'a', 'cashier', 'at', 'a', 'supermarket'], answer: 'I work as a cashier at a supermarket' },
        { type: 'complete', starter: "Hi, I'm", minWords: 10, must: '(work as|i\'m a|i am a|student|responsible)', hint: 'Nama + peran + tanggung jawab.' },
        { type: 'combine', a: 'I am a nurse.', b: 'I take care of patients.', answers: ['i am a nurse and i take care of patients', "i'm a nurse and i take care of patients", 'i am a nurse, and i take care of patients', 'i am a nurse so i take care of patients'], hint: 'Gabungkan dengan "and".' },
      ],
      guided: { question: { en: 'Introduce yourself to a new coworker.', id: 'Perkenalkan dirimu ke rekan kerja baru.' }, hints: ["Hi, I'm ...", 'I work as ... / I\'m a student at ...', "I'm responsible for ..."], minWords: 12, must: "(i'm|i am|my name)" },
      independent: { question: { en: 'Give a 30-second introduction for your first day at a new job (name, role, one thing you are good at, one thing you want to learn).', id: 'Perkenalan 30 detik di hari pertama kerja: nama, peran, satu keahlian, satu hal yang ingin dipelajari.' }, minWords: 25, must: "(i'm|i am|my name)" },
      milestone: { title: 'Deliver a professional self-introduction', explain: 'Introduce yourself with your role and responsibilities, clearly and confidently.', outcome: 'Four correct sentences and a 25+ word self-introduction.', condition: { built: 4, guidedWords: 12, independentWords: 25 }, xp: 60 },
    },
    {
      id: 'interview-about-yourself', title: 'Interview: Tell me about yourself', subtitle: 'Structure: Present → Past → Future',
      skill: 'professional', stage: 'growth', topics: ['work'], minutes: 18, targets: ['past-tense', 'short-answer'],
      pattern: { en: 'Currently, I ... (sekarang). Before that, I ... (dulu). I\'m looking for ... (tujuan).', id: 'Jawaban "tell me about yourself" yang kuat punya 3 bagian: posisi sekarang, pengalaman sebelumnya, dan tujuan ke depan. Maksimal 60 detik.' },
      dialogue: [
        { who: 'coach', en: 'So, tell me about yourself.', id: 'Jadi, ceritakan tentang dirimu.' },
        { who: 'me', en: "Sure. Currently, I work as a sales assistant at a phone store. Before that, I studied business at a vocational school. Now I'm looking for a role where I can grow my communication skills.", id: 'Tentu. Saat ini saya sales assistant di toko HP. Sebelumnya saya belajar bisnis di SMK. Sekarang saya mencari peran yang bisa mengembangkan kemampuan komunikasi saya.' },
      ],
      examples: ["Currently, I'm a final-year student majoring in IT.", 'Before that, I worked part-time as a barista for two years.', "I'm looking for a position where I can learn from a strong team."],
      expressions: [{ en: 'Currently', id: 'Saat ini' }, { en: 'Before that', id: 'Sebelum itu' }, { en: "I'm looking for", id: 'Saya mencari' }, { en: 'I have experience in', id: 'Saya punya pengalaman di' }],
      exercises: [
        { type: 'fill', text: '___, I work as a cashier at a café.', answers: ['currently', 'now', 'at the moment'], hint: 'Saat ini' },
        { type: 'choose', text: 'Which sentence is correct?', options: ['Before that, I work in a restaurant.', 'Before that, I worked in a restaurant.', 'Before that, I working in a restaurant.'], correct: 1, explain: '"Before that" = masa lalu → worked.' },
        { type: 'arrange', words: ["I'm", 'looking', 'for', 'a', 'role', 'where', 'I', 'can', 'grow'], answer: "I'm looking for a role where I can grow" },
        { type: 'complete', starter: 'Before that, I', minWords: 7, must: '^before that,? i (worked|studied|was|had|did|learned|helped|managed|joined|graduated|started|finished|spent|lived)\\b', hint: 'Kata kerja lampau: worked, studied, was.' },
        { type: 'keywords', keywords: ['currently', 'before that', 'looking for'], minWords: 20, must: 'looking for', hint: 'Satu paragraf dengan ketiga bagian.' },
      ],
      guided: { question: { en: 'Tell me about yourself.', id: 'Ceritakan tentang dirimu.' }, hints: ['Currently, I ...', 'Before that, I ...', "I'm looking for ..."], minWords: 20, must: '(currently|before|looking for|now)' },
      independent: { question: { en: 'Answer this interviewer: "Why should we hire you?" Mention one skill, one experience, and one goal.', id: 'Jawab: "Kenapa kami harus merekrut Anda?" Sebutkan satu keahlian, satu pengalaman, satu tujuan.' }, minWords: 30, must: '(i can|i have|i am|i\'m|experience)' },
      milestone: { title: 'Answer "Tell me about yourself"', explain: 'Give a structured 60-second interview answer: present, past, future.', outcome: 'Four correct sentences and a 30+ word structured answer.', condition: { built: 4, guidedWords: 20, independentWords: 30 }, xp: 80 },
    },
    {
      id: 'speak-60-artist', title: 'Speak for 60 seconds about a favorite', subtitle: 'Structure: What → Why → Example → Feeling',
      skill: 'speaking', stage: 'growth', topics: ['music', 'games', 'movies', 'football', 'anime'], minutes: 15, targets: ['short-answer', 'third-person-s'],
      pattern: { en: 'My favorite ... is ... (apa). I like him/her/it because ... (kenapa). For example, ... (contoh). It makes me feel ... (perasaan).', id: 'Empat kalimat sederhana sudah cukup untuk bicara 60 detik. Ingat: he/she/it + kata kerja + s (he sings, she plays, it makes).' },
      dialogue: [
        { who: 'coach', en: 'Tell me about your favorite artist.', id: 'Ceritakan artis favoritmu.' },
        { who: 'me', en: 'My favorite artist is Tulus. I like him because his lyrics are honest and simple. For example, the song "Hati-Hati di Jalan" tells a real story about losing someone. His music makes me feel calm.', id: 'Artis favoritku Tulus. Aku suka karena liriknya jujur dan sederhana. Contohnya lagu "Hati-Hati di Jalan" bercerita tentang kehilangan. Musiknya membuatku tenang.' },
      ],
      examples: ['My favorite game is Mobile Legends. I like it because I can play with my friends.', 'She sings in a very unique way, and her concerts are amazing.'],
      expressions: [{ en: 'his/her lyrics', id: 'liriknya' }, { en: 'it makes me feel', id: 'itu membuatku merasa' }, { en: 'what I love most is', id: 'yang paling kusuka adalah' }, { en: 'honestly', id: 'jujur saja' }],
      exercises: [
        { type: 'choose', text: 'Pick the correct sentence.', options: ['He sing very well.', 'He sings very well.', 'He singing very well.'], correct: 1, explain: 'he/she/it + kata kerja + s.' },
        { type: 'fill', text: 'Her music ___ me feel relaxed after work.', answers: ['makes'], hint: 'make + s' },
        { type: 'arrange', words: ['My', 'favorite', 'player', 'is', 'Messi', 'because', 'he', 'plays', 'smart'], answer: 'My favorite player is Messi because he plays smart' },
        { type: 'complete', starter: 'My favorite', minWords: 10, must: 'because', hint: 'Sebutkan favoritmu dan alasannya.' },
        { type: 'keywords', keywords: ['favorite', 'because', 'for example', 'feel'], minWords: 25, must: 'for example', hint: 'Tulis 4 kalimat: apa, kenapa, contoh, perasaan.' },
      ],
      guided: { question: { en: 'Talk about your favorite artist, game, or team for 60 seconds.', id: 'Bicara 60 detik tentang artis, game, atau tim favoritmu.' }, hints: ['My favorite ... is ...', 'I like ... because ...', 'For example, ...', 'It makes me feel ...'], minWords: 25, must: 'because' },
      independent: { question: { en: 'Recommend something you love (a song, a show, a place) to a friend who has never tried it. Speak for about 60 seconds.', id: 'Rekomendasikan sesuatu yang kamu suka ke teman yang belum pernah mencobanya. Sekitar 60 detik.' }, minWords: 35, must: '(because|you should|you will|you\'ll)' },
      milestone: { title: 'Speak about a favorite for 60 seconds', explain: 'Use the four-part structure to speak for a full minute without stopping.', outcome: 'Four correct sentences and a 35+ word recommendation.', condition: { built: 4, guidedWords: 25, independentWords: 35 }, xp: 80 },
    },
    {
      id: 'work-problem-solution', title: 'Explain a problem and a solution', subtitle: 'Structure: Situation → Problem → Action → Result',
      skill: 'professional', stage: 'challenge', topics: ['work'], minutes: 18, targets: ['past-tense', 'discuss-about'],
      pattern: { en: 'Last month, we had a problem with ... So I ... As a result, ...', id: 'Di wawancara dan meeting, struktur ini (sering disebut STAR) membuat cerita kerja jelas. Pakai kata kerja lampau untuk situasi dan tindakan. "discuss the issue" (tanpa "about").' },
      dialogue: [
        { who: 'coach', en: 'Tell me about a time you solved a problem at work.', id: 'Ceritakan saat kamu menyelesaikan masalah di tempat kerja.' },
        { who: 'me', en: 'Last month, a customer was angry because her order arrived late. So I apologized, checked the delivery status, and offered a discount. As a result, she stayed with us and left a positive review.', id: 'Bulan lalu, ada pelanggan marah karena pesanannya telat. Saya minta maaf, cek status pengiriman, dan beri diskon. Hasilnya, dia tetap jadi pelanggan dan memberi ulasan positif.' },
      ],
      examples: ['The system crashed during a busy day, so I switched to manual notes and called IT.', 'As a result, we finished the report on time.'],
      expressions: [{ en: 'the main issue was', id: 'masalah utamanya adalah' }, { en: 'so I decided to', id: 'jadi saya memutuskan untuk' }, { en: 'as a result', id: 'hasilnya' }, { en: 'I discussed the issue with', id: 'saya membahas masalah itu dengan' }],
      exercises: [
        { type: 'choose', text: 'Which is natural?', options: ['I discussed about the problem with my manager.', 'I discussed the problem with my manager.', 'I discuss about problem with manager.'], correct: 1, explain: '"discuss" langsung diikuti objek, tanpa "about".' },
        { type: 'fill', text: 'The printer broke, ___ I asked a colleague to share hers.', answers: ['so'], hint: 'jadi' },
        { type: 'arrange', words: ['As', 'a', 'result,', 'the', 'customer', 'was', 'happy'], answer: 'As a result, the customer was happy' },
        { type: 'complete', starter: 'Last week, the main issue was', minWords: 8, must: '(was|were|had|didn\'t|couldn\'t)', hint: 'Jelaskan masalahnya dengan kata kerja lampau.' },
        { type: 'keywords', keywords: ['problem', 'so I', 'as a result'], minWords: 25, must: 'as a result', hint: 'Cerita lengkap: situasi → masalah → tindakan → hasil.' },
      ],
      guided: { question: { en: 'Describe a problem you solved (at work, school, or home).', id: 'Ceritakan masalah yang pernah kamu selesaikan.' }, hints: ['Last ..., there was a problem with ...', 'So I ...', 'As a result, ...'], minWords: 25, must: '(so i|as a result|then)' },
      independent: { question: { en: 'Your manager asks: "What would you do if a client complained about a late delivery?" Explain your steps.', id: 'Manajer bertanya: "Apa yang akan kamu lakukan jika klien komplain pengiriman telat?" Jelaskan langkahmu.' }, minWords: 35, must: '(would|first|then|finally)' },
      milestone: { title: 'Tell a workplace problem-solving story', explain: 'Explain a situation, problem, action and result like a confident professional.', outcome: 'Four correct sentences and a 35+ word structured answer.', condition: { built: 4, guidedWords: 25, independentWords: 35 }, xp: 90 },
    },
    {
      id: 'mini-presentation', title: 'Two-minute mini-presentation', subtitle: 'Structure: Opening → 3 points → Closing',
      skill: 'speaking', stage: 'challenge', topics: ['daily life', 'coding', 'travel', 'gym'], minutes: 20, targets: ['short-answer', 'me-and'],
      pattern: { en: "Today I'd like to talk about ... There are three reasons. First, ... Second, ... Finally, ... To sum up, ...", id: 'Kerangka presentasi: pembuka, tiga poin dengan penanda (First/Second/Finally), penutup. Penanda ini membantu pendengar dan membantumu tidak "blank".' },
      dialogue: [
        { who: 'me', en: "Good morning, everyone. Today I'd like to talk about why everyone should try the gym. There are three reasons. First, it improves your energy. Second, it reduces stress. Finally, you meet new people. To sum up, the gym is good for your body and your mind. Thank you.", id: 'Selamat pagi semuanya. Hari ini saya ingin membahas kenapa semua orang harus mencoba gym. Ada tiga alasan. Pertama, meningkatkan energi. Kedua, mengurangi stres. Terakhir, bertemu orang baru. Kesimpulannya, gym baik untuk tubuh dan pikiran. Terima kasih.' },
      ],
      examples: ["Today I'd like to share three tips for learning English.", 'My friend and I started a small photography project last year.', 'To sum up, consistency matters more than talent.'],
      expressions: [{ en: "I'd like to talk about", id: 'Saya ingin membahas' }, { en: 'There are three reasons', id: 'Ada tiga alasan' }, { en: 'To sum up', id: 'Kesimpulannya' }, { en: 'Thank you for listening', id: 'Terima kasih sudah mendengarkan' }],
      exercises: [
        { type: 'choose', text: 'Which opening is correct?', options: ['Me and my friend will talk about music.', 'My friend and I will talk about music.', 'Me and friend will talks about music.'], correct: 1, explain: 'Gunakan "My friend and I" sebagai subjek.' },
        { type: 'fill', text: "Today I'd like to talk ___ my hometown.", answers: ['about'], hint: 'tentang' },
        { type: 'arrange', words: ['There', 'are', 'three', 'reasons', 'why', 'I', 'love', 'coding'], answer: 'There are three reasons why I love coding' },
        { type: 'complete', starter: 'To sum up,', minWords: 7, must: '^to sum up,? \\w+', hint: 'Ringkas pesan utamamu dalam satu kalimat.' },
        { type: 'keywords', keywords: ['first', 'second', 'finally'], minWords: 25, must: 'finally', hint: 'Tiga poin dengan penanda urutan.' },
      ],
      guided: { question: { en: 'Give a one-minute talk: "Three things I love about my city."', id: 'Bicara satu menit: "Tiga hal yang kusuka dari kotaku."' }, hints: ["Today I'd like to talk about ...", 'First, ... Second, ... Finally, ...', 'To sum up, ...'], minWords: 40, must: '(first|second|finally)' },
      independent: { question: { en: 'Deliver a two-minute mini-presentation on any topic you choose. Use an opening, three points, and a closing.', id: 'Presentasi dua menit tentang topik pilihanmu: pembuka, tiga poin, penutup.' }, minWords: 70, must: '(first|second|finally|to sum up)' },
      milestone: { title: 'Deliver a two-minute mini-presentation', explain: 'Structure a short talk so you never go blank in front of people.', outcome: 'Four correct sentences and a 70+ word presentation with an opening, three points, and a closing.', condition: { built: 4, guidedWords: 40, independentWords: 70 }, xp: 100 },
    },
  ];

  /* ---------- RULE-BASED ERROR DETECTORS ---------- */
  // Each: key, label, regex (on lowercased text), fix(fn), explain {en,id}, advice (lesson id to recommend)
  L.DETECTORS = [
    { key: 'i-am-agree', label: '"I am agree" → "I agree"', re: /\bi(?:'m| am) (agree|disagree)\b/g, fix: (s) => s.replace(/\bI(?:'m| am) (agree|disagree)\b/gi, 'I $1'), explain: { en: '"Agree" is a verb, so it does not need "am".', id: '"Agree" adalah kata kerja, jadi tidak perlu "am".' }, lesson: 'opinion-reason-example' },
    { key: 'very-like', label: '"very like" → "really like"', re: /\b(i|we|they|you) very (like|love|enjoy|want|need)\b/g, fix: (s) => s.replace(/\b(I|we|they|you) very (like|love|enjoy|want|need)\b/gi, '$1 really $2'), explain: { en: '"Very" cannot sit directly before a verb. Use "really".', id: '"Very" tidak bisa langsung di depan kata kerja. Pakai "really".' }, lesson: 'likes-because' },
    { key: 'im-verb', label: '"I\'m work" → "I work"', re: /\bi(?:'m| am) (work|study|live|like|play|go|eat|watch|want|need)\b/g, fix: (s) => s.replace(/\bI(?:'m| am) (work|study|live|like|play|go|eat|watch|want|need)\b/gi, 'I $1'), explain: { en: 'Use "I work" (simple present) or "I\'m working" (right now), never "I\'m work".', id: 'Gunakan "I work" (kebiasaan) atau "I\'m working" (sedang), bukan "I\'m work".' }, lesson: 'intro-at-work' },
    { key: 'third-person-s', label: 'he/she/it + verb needs -s', re: /\b(he|she|it|my (?:mother|father|friend|brother|sister|boss|teacher)) (go|play|like|work|watch|eat|want|need|live|make|sing|study|have|do)\b(?! not)/g, fix: (s) => s.replace(/\b(he|she|it|my (?:mother|father|friend|brother|sister|boss|teacher)) (go|play|like|work|watch|eat|want|need|live|make|sing|study|have|do)\b(?! not)/gi, (m, a, v) => a + ' ' + ({ have: 'has', do: 'does', go: 'goes', watch: 'watches', study: 'studies' }[v.toLowerCase()] || v + 's')), explain: { en: 'With he/she/it, add -s to the verb: he plays, she has, it makes.', id: 'Dengan he/she/it, tambah -s: he plays, she has, it makes.' }, lesson: 'speak-60-artist' },
    { key: 'past-tense', label: 'Past story needs past verbs', re: /\b(yesterday|last (?:week|weekend|night|month|year|saturday|sunday)|ago|when i was)\b[^.!?]*\b(i|we|they) (go|eat|watch|play|have|meet|take|visit|buy|see|make|do|get|come|stay|cook|work|study)\b/g, fix: (s) => s.replace(/\b(i|we|they) (go|eat|watch|play|have|meet|take|visit|buy|see|make|do|get|come|stay|cook|work|study)\b/gi, (m, a, v) => a + ' ' + ({ go: 'went', eat: 'ate', watch: 'watched', play: 'played', have: 'had', meet: 'met', take: 'took', visit: 'visited', buy: 'bought', see: 'saw', make: 'made', do: 'did', get: 'got', come: 'came', stay: 'stayed', cook: 'cooked', work: 'worked', study: 'studied' }[v.toLowerCase()] || v)), explain: { en: 'For things that already happened, use past verbs: go → went, eat → ate.', id: 'Untuk yang sudah terjadi, pakai bentuk lampau: go → went, eat → ate.' }, lesson: 'past-weekend' },
    { key: 'missing-the', label: '"go to gym" → "go to the gym"', re: /\b(go|went|going) to (gym|mall|beach|office|cinema|market|park)\b/g, fix: (s) => s.replace(/\b(go|went|going) to (gym|mall|beach|office|cinema|market|park)\b/gi, '$1 to the $2'), explain: { en: 'These places usually take "the": the gym, the mall, the office.', id: 'Tempat-tempat ini biasanya pakai "the": the gym, the mall, the office.' }, lesson: 'routine-usually' },
    { key: 'want-to-ing', label: '"want to going" → "want to go"', re: /\b(want|need|going|plan|like|have) to (\w+)ing\b/g, fix: (s) => s.replace(/\b(want|need|going|plan|like|have) to (\w+?)(?:y)?ing\b/gi, (m, a, v) => a + ' to ' + (({ go: 'go', studying: 'study' })[v] || v)), explain: { en: 'After "to", use the base verb: want to go, going to visit.', id: 'Setelah "to", pakai kata kerja dasar: want to go, going to visit.' }, lesson: 'plans-going-to' },
    { key: 'discuss-about', label: '"discuss about" → "discuss"', re: /\b(discuss|explain)(ed|es|s)? about\b/g, fix: (s) => s.replace(/\b(discuss|explain)(ed|es|s)? about\b/gi, '$1$2'), explain: { en: '"Discuss" and "explain" take the object directly, no "about".', id: '"Discuss" dan "explain" langsung diikuti objek, tanpa "about".' }, lesson: 'work-problem-solution' },
    { key: 'me-and', label: '"Me and my friend" → "My friend and I"', re: /\bme and (my \w+|\w+)\b/g, fix: (s) => s.replace(/\bme and (my \w+|\w+)\b/gi, '$1 and I'), explain: { en: 'As the subject, say "My friend and I".', id: 'Sebagai subjek, katakan "My friend and I".' }, lesson: 'mini-presentation' },
    { key: 'more-better', label: '"more better" → "better"', re: /\bmore (better|worse|easier|harder|bigger|smaller|faster|cheaper)\b/g, fix: (s) => s.replace(/\bmore (better|worse|easier|harder|bigger|smaller|faster|cheaper)\b/gi, '$1'), explain: { en: '"Better" is already comparative, so drop "more".', id: '"Better" sudah bentuk perbandingan, jadi tidak perlu "more".' }, lesson: 'opinion-reason-example' },
    { key: 'because-of-i', label: '"because of I" → "because I"', re: /\bbecause of (i|we|they|he|she|you) \w+/g, fix: (s) => s.replace(/\bbecause of (i|we|they|he|she|you)\b/gi, 'because $1'), explain: { en: 'Use "because + clause" and "because of + noun".', id: '"because" + kalimat, "because of" + kata benda.' }, lesson: 'likes-because' },
    { key: 'lowercase-i', label: 'Capital "I"', re: /(^|\s)i(\s|'m|'ll|'ve)/g, fix: (s) => s.replace(/(^|\s)i(\s|'m|'ll|'ve)/g, '$1I$2'), explain: { en: 'The pronoun "I" is always a capital letter.', id: 'Kata ganti "I" selalu huruf kapital.' }, lesson: null, minor: true },
  ];

  /* ---------- SPEAKING STUDIO ---------- */
  L.FREE_TALK = {
    music: { opener: 'So, what kind of music have you been listening to lately?', followups: { artist: ['Who is your favorite artist, and why?', 'Have you ever seen them live?'], song: ['What is the song about?', 'When do you usually listen to it?'], concert: ['How was the concert? Tell me more.'], _: ['Why do you like that kind of music?', 'When do you usually listen to music?', 'Do your friends like the same music?', 'What was the last song you played on repeat?'] } },
    games: { opener: 'Do you play any games? Which one is your favorite right now?', followups: { mobile: ['Do you play with friends or solo?'], rank: ['How did you get to that rank? That sounds hard.'], _: ['What do you like most about it?', 'How long do you usually play in a day?', 'Have you ever rage-quit a game?', 'Which game would you recommend to a beginner?'] } },
    movies: { opener: "What's the last movie or series you watched?", followups: { horror: ["Oh, you're brave. Do you watch horror alone?"], anime: ['Which anime got you into it?'], _: ['Was it good? Why?', 'Who was your favorite character?', 'Do you prefer the cinema or watching at home?', 'What kind of movies do you usually avoid?'] } },
    gym: { opener: 'Do you work out? What does your routine look like?', followups: { morning: ['Wow, morning workouts. How do you wake up so early?'], _: ['Why did you start?', "What's the hardest part about staying consistent?", 'What do you listen to while you train?', "What's your goal for this year?"] } },
    food: { opener: "What's your go-to meal when you're really hungry?", followups: { cook: ['Nice! What do you cook most often?'], spicy: ['How spicy is too spicy for you?'], _: ['Where is the best place to get it?', 'Can you cook it yourself?', 'What food do you really dislike?', 'What did you eat today?'] } },
    weekend: { opener: 'How was your weekend? Did you do anything fun?', followups: { home: ['Sounds relaxing. What did you do at home?'], friend: ['What did you and your friends do?'], _: ['What was the best part?', 'What are you planning for next weekend?', 'Did anything unexpected happen?'] } },
    work: { opener: 'What do you do during the day, work or study?', followups: { _: ['What is the most interesting part of it?', 'What is the most stressful part?', 'What would you change if you could?', 'What do you want to be doing in two years?'] } },
  };

  L.SCENARIOS = {
    'job-interview': {
      title: 'Job interview', icon: '💼', skill: 'professional', minutes: 12, intro: 'You are interviewing for a job you want. Answer each question. Hints appear based on your support level.',
      expressions: ['I have experience in...', 'One of my strengths is...', 'I am still improving my...', 'In my previous role, I...', 'I would be happy to...'],
      turns: [
        { q: 'Good morning. Thanks for coming in. Could you tell me a little about yourself?', hints: ['Currently, I ...', 'Before that, I ...', "I'm looking for ..."], model: "Currently I work as a sales assistant. Before that, I studied business. I'm looking for a role where I can grow.", minWords: 15 },
        { q: 'Why are you interested in this position?', hints: ["I'm interested because ...", 'I think I can contribute ...'], model: "I'm interested because this role matches my experience with customers, and I think I can contribute right away.", minWords: 12 },
        { q: 'What is one of your strengths?', hints: ['One of my strengths is ...', 'For example, ...'], model: 'One of my strengths is communication. For example, I handled angry customers calmly in my last job.', minWords: 12 },
        { q: 'Tell me about a time you faced a problem at work or school.', hints: ['Last ..., there was a problem with ...', 'So I ...', 'As a result, ...'], model: 'Last year, a customer\'s order was late, so I apologized and offered a discount. As a result, she stayed with us.', minWords: 20 },
        { q: 'Where do you see yourself in two years?', hints: ['In two years, I hope to ...', 'I want to improve ...'], model: 'In two years, I hope to be a team leader, and I want to improve my English for international clients.', minWords: 12 },
        { q: 'Do you have any questions for us?', hints: ['Could you tell me about ...?', 'What does a typical day look like?'], model: 'Yes, could you tell me what a typical day looks like in this role?', minWords: 8 },
      ],
    },
    'self-intro': {
      title: 'Introducing yourself', icon: '👋', skill: 'conversation', minutes: 6, intro: 'You just joined a new class or team. People want to know who you are.',
      expressions: ['Nice to meet you', "I'm from...", 'In my free time, I...', 'I\'m really into...', 'Feel free to ask me about...'],
      turns: [
        { q: "Hi! I don't think we've met. What's your name and where are you from?", hints: ["Hi, I'm ...", "I'm from ..."], model: "Hi, I'm Dani, and I'm from Bandung.", minWords: 6 },
        { q: 'Nice to meet you! What do you do?', hints: ['I work as ... / I study ...'], model: 'I work as a graphic designer at a small studio.', minWords: 6 },
        { q: 'Cool. What do you like to do in your free time?', hints: ['In my free time, I ...', "I'm really into ..."], model: "In my free time, I'm really into football and photography.", minWords: 8 },
        { q: 'Why did you decide to learn English?', hints: ['I want to ... because ...'], model: 'I want to speak English because I want a better job and I want to talk to people from other countries.', minWords: 10 },
      ],
    },
    'meeting-smalltalk': {
      title: 'Small talk before a meeting', icon: '☕', skill: 'professional', minutes: 6, intro: 'You arrive early to a meeting. A colleague starts chatting with you.',
      expressions: ['How\'s it going?', 'Pretty busy, actually.', 'How about you?', 'That sounds great.', 'Anyway, shall we get started?'],
      turns: [
        { q: "Hey! How's it going? Busy week?", hints: ['Pretty busy, actually. I ...', 'Not bad. How about you?'], model: 'Pretty busy, actually. I finished two reports this week. How about you?', minWords: 8 },
        { q: "Same here. Did you do anything nice last weekend?", hints: ['Last weekend, I ...'], model: 'Last weekend I went hiking with my cousin. It was tiring but fun.', minWords: 8 },
        { q: 'Nice! By the way, have you seen the new project plan?', hints: ["Yes, I think ...", "Not yet, but I'll ..."], model: "Yes, I read it yesterday. I think the timeline is a bit tight, but it looks good.", minWords: 8 },
        { q: 'Agreed. Okay, I think everyone is here. Shall we start?', hints: ['Sure, let\'s ...'], model: "Sure, let's get started.", minWords: 3 },
      ],
    },
    'presentation': {
      title: 'Mini-presentation', icon: '🎤', skill: 'speaking', minutes: 10, intro: 'Present a short talk to your team. Use an opening, three points, and a closing.',
      expressions: ["Today I'd like to talk about...", 'First... Second... Finally...', 'To sum up...', 'Thank you for listening.', 'Any questions?'],
      turns: [
        { q: 'The floor is yours. Please start your presentation with an opening and your topic.', hints: ["Good morning everyone. Today I'd like to talk about ...", 'There are three reasons why ...'], model: "Good morning everyone. Today I'd like to talk about why we should start a daily English club. There are three reasons.", minWords: 15 },
        { q: 'Great. Now give your three points.', hints: ['First, ...', 'Second, ...', 'Finally, ...'], model: 'First, it builds confidence. Second, it helps us with international clients. Finally, it is fun and brings the team together.', minWords: 25 },
        { q: 'And your closing?', hints: ['To sum up, ...', 'Thank you for listening. Any questions?'], model: 'To sum up, an English club is cheap, fun, and useful. Thank you for listening. Any questions?', minWords: 10 },
        { q: 'Question from the audience: "How much time would this take every week?"', hints: ['Good question. I think ...'], model: 'Good question. I think thirty minutes twice a week is enough to start.', minWords: 8 },
      ],
    },
    'unexpected': {
      title: 'Unexpected questions', icon: '🎲', skill: 'speaking', minutes: 6, intro: 'Random questions, no preparation. Practice not going blank: pause, use a starter, then answer.',
      expressions: ["That's a good question.", 'Let me think...', 'Honestly, ...', 'I would say ...', 'It depends, but ...'],
      turns: [
        { q: 'If you could live in any city in the world, where would you live and why?', hints: ["That's a good question. I would say ... because ..."], model: "That's a good question. I would say Tokyo, because it is clean, safe and full of things to do.", minWords: 10 },
        { q: 'What is something you learned recently?', hints: ['Recently, I learned ...'], model: 'Recently I learned how to make a simple website, and it was easier than I expected.', minWords: 8 },
        { q: 'Would you rather be very rich or very famous?', hints: ['It depends, but I would rather ... because ...'], model: 'I would rather be rich, because famous people do not have privacy.', minWords: 8 },
        { q: 'What advice would you give to your younger self?', hints: ['I would tell myself to ...'], model: 'I would tell myself to start learning English earlier and not be afraid of mistakes.', minWords: 10 },
      ],
    },
  };

  /* ---------- ACTIVITY FORMATS ---------- */
  L.FORMATS = {
    quickwin: { title: 'Quick Wins', icon: '⚡', desc: '1–5 minute sentence challenges.', minutes: 3, skill: 'conversation' },
    builder: { title: 'Sentence Builder', icon: '🧱', desc: 'Build sentences from words, phrases and patterns.', minutes: 10, skill: 'conversation' },
    speak30: { title: 'Speak for 30 Seconds', icon: '⏱️', desc: 'Describe a topic with a simple structure.', minutes: 4, skill: 'speaking' },
    story: { title: 'Story Mode', icon: '📖', desc: 'Tell a story with a beginning, middle and end.', minutes: 8, skill: 'speaking' },
    opinion: { title: 'Opinion Challenge', icon: '💡', desc: 'Opinion + reason + example.', minutes: 6, skill: 'speaking' },
    roleplay: { title: 'Roleplay', icon: '🎭', desc: 'Act out realistic interactions.', minutes: 8, skill: 'professional' },
    shadowing: { title: 'Shadowing', icon: '🔁', desc: 'Listen and repeat natural sentences.', minutes: 5, skill: 'conversation' },
    repair: { title: 'Repair the Sentence', icon: '🔧', desc: 'Find and fix a real mistake.', minutes: 4, skill: 'conversation' },
    vocab: { title: 'Vocabulary in Context', icon: '🧩', desc: 'Learn expressions inside real situations.', minutes: 6, skill: 'conversation' },
    surprise: { title: 'Surprise Mission', icon: '🎁', desc: 'An unexpected challenge based on your level.', minutes: 5, skill: 'speaking' },
    boss: { title: 'Weekly Boss Challenge', icon: '👑', desc: 'A longer challenge combining this week\'s skills.', minutes: 15, skill: 'professional' },
    realworld: { title: 'Real-World Mission', icon: '🌍', desc: 'Use English outside the app. Private, no upload.', minutes: 10, skill: 'conversation' },
  };

  L.QUICKWINS = [
    { id: 'qw-1', title: 'Morning habits', items: [{ type: 'fill', text: 'I usually ___ up at six.', answers: ['wake', 'get'], hint: 'bangun' }, { type: 'choose', text: 'Natural?', options: ['I very like coffee.', 'I really like coffee.'], correct: 1, explain: '"really like", bukan "very like".' }, { type: 'complete', starter: 'Every morning I', minWords: 5, must: '^every morning i \\w+', hint: 'Sebutkan satu kebiasaan pagi.' }] },
    { id: 'qw-2', title: 'Small talk starters', items: [{ type: 'fill', text: "How's it ___? Busy week?", answers: ['going'], hint: 'apa kabar' }, { type: 'arrange', words: ['Not', 'bad.', 'How', 'about', 'you?'], answer: 'Not bad. How about you?' }, { type: 'complete', starter: 'Pretty busy, actually. I', minWords: 6, must: '^pretty busy,? actually\\.? i \\w+', hint: 'Ceritakan satu hal yang membuatmu sibuk.' }] },
    { id: 'qw-3', title: 'Agreeing and disagreeing', items: [{ type: 'choose', text: 'Correct?', options: ['I am agree.', 'I agree.'], correct: 1, explain: '"Agree" sudah kata kerja.' }, { type: 'fill', text: "I see your point, ___ I think online classes are better.", answers: ['but'], hint: 'tapi' }, { type: 'complete', starter: 'I disagree because', minWords: 6, must: '^i disagree because \\w+', hint: 'Beri satu alasan.' }] },
    { id: 'qw-4', title: 'Past tense quick drill', items: [{ type: 'fill', text: 'Yesterday I ___ (go) to the market.', answers: ['went'], hint: 'go → ?' }, { type: 'fill', text: 'Last night we ___ (eat) pizza.', answers: ['ate'], hint: 'eat → ?' }, { type: 'complete', starter: 'Last weekend I', minWords: 6, must: '^last weekend i (went|ate|had|watched|played|met|visited|stayed|cooked|worked|studied|took|saw|bought|was|did|slept)\\b', hint: 'Pakai kata kerja lampau.' }] },
    { id: 'qw-5', title: 'Plans tonight', items: [{ type: 'choose', text: 'Correct?', options: ["I'm going to watching TV.", "I'm going to watch TV."], correct: 1, explain: 'Setelah "to" pakai kata kerja dasar.' }, { type: 'arrange', words: ["I'm", 'going', 'to', 'sleep', 'early', 'tonight'], answer: "I'm going to sleep early tonight" }, { type: 'complete', starter: 'Tonight I\'m going to', minWords: 5, must: 'going to \\w+', hint: 'Satu rencana malam ini.' }] },
  ];

  L.REPAIRS = [
    { id: 'rp-1', wrong: 'I am agree with my friend.', answers: ['i agree with my friend', 'i agree with my friend.'], key: 'i-am-agree' },
    { id: 'rp-2', wrong: 'Yesterday I go to the mall with my sister.', answers: ['yesterday i went to the mall with my sister', 'yesterday i went to the mall with my sister.'], key: 'past-tense' },
    { id: 'rp-3', wrong: 'She play games every night.', answers: ['she plays games every night', 'she plays games every night.'], key: 'third-person-s' },
    { id: 'rp-4', wrong: 'I very like this song.', answers: ['i really like this song', 'i really like this song.', 'i like this song very much', 'i like this song very much.'], key: 'very-like' },
    { id: 'rp-5', wrong: "I'm work as a cashier.", answers: ['i work as a cashier', 'i work as a cashier.', "i'm a cashier", "i'm a cashier."], key: 'im-verb' },
    { id: 'rp-6', wrong: 'We discussed about the plan.', answers: ['we discussed the plan', 'we discussed the plan.'], key: 'discuss-about' },
    { id: 'rp-7', wrong: 'Me and my friend went to the beach.', answers: ['my friend and i went to the beach', 'my friend and i went to the beach.'], key: 'me-and' },
    { id: 'rp-8', wrong: 'I want to going home now.', answers: ['i want to go home now', 'i want to go home now.'], key: 'want-to-ing' },
    { id: 'rp-9', wrong: 'After work I usually go to gym.', answers: ['after work i usually go to the gym', 'after work i usually go to the gym.'], key: 'missing-the' },
    { id: 'rp-10', wrong: 'This phone is more better than mine.', answers: ['this phone is better than mine', 'this phone is better than mine.'], key: 'more-better' },
  ];

  L.VOCAB = [
    { id: 'vc-1', situation: 'At a café with a coworker', expressions: [{ en: 'What are you having?', id: 'Kamu pesan apa?' }, { en: "I'll have the usual.", id: 'Seperti biasa.' }, { en: 'My treat.', id: 'Aku yang traktir.' }, { en: "Let's grab a table.", id: 'Cari meja, yuk.' }], prompt: 'Write a short exchange at a café using at least two of these expressions.' },
    { id: 'vc-2', situation: 'Asking for help at work', expressions: [{ en: 'Do you have a minute?', id: 'Punya waktu sebentar?' }, { en: "I'm stuck on something.", id: 'Aku macet di sesuatu.' }, { en: 'Could you walk me through it?', id: 'Bisa jelaskan langkahnya?' }, { en: 'That makes sense, thanks.', id: 'Masuk akal, terima kasih.' }], prompt: 'Ask a colleague for help with a task using at least two of these expressions.' },
    { id: 'vc-3', situation: 'Talking about a game night', expressions: [{ en: "I'm hooked on", id: 'Aku ketagihan' }, { en: 'We got crushed.', id: 'Kami kalah telak.' }, { en: 'carry the team', id: 'membawa tim (jadi andalan)' }, { en: 'one more round', id: 'satu ronde lagi' }], prompt: 'Tell a friend about your last game night using at least two of these expressions.' },
    { id: 'vc-4', situation: 'Giving directions', expressions: [{ en: 'Go straight ahead', id: 'Lurus terus' }, { en: 'Turn left at the lights', id: 'Belok kiri di lampu merah' }, { en: "It's on your right", id: 'Ada di sebelah kananmu' }, { en: "You can't miss it", id: 'Pasti ketemu' }], prompt: 'Explain how to get from your house to the nearest minimarket.' },
  ];

  L.SPEAK30 = [
    { topic: 'Your favorite place in your city', structure: ['Where it is', 'What you do there', 'Why you love it'] },
    { topic: 'A typical day at work or school', structure: ['Morning', 'Afternoon', 'Evening'] },
    { topic: 'A hobby you would recommend', structure: ['What it is', 'Why it is fun', 'How to start'] },
    { topic: 'Your phone', structure: ['What phone you have', 'What you use most', 'One thing you would change'] },
    { topic: 'Your favorite food', structure: ['What it is', 'Where you eat it', 'Why it is special'] },
    { topic: 'The last thing that made you laugh', structure: ['What happened', 'Who was there', 'Why it was funny'] },
  ];
  L.STORIES = [
    { prompt: 'A time you were late for something important.', beats: ['Beginning: where were you going?', 'Middle: what went wrong?', 'End: how did it finish?'] },
    { prompt: 'The best day of last year.', beats: ['Beginning: what was the plan?', 'Middle: what happened?', 'End: how did you feel?'] },
    { prompt: 'A time you helped someone.', beats: ['Beginning: who needed help?', 'Middle: what did you do?', 'End: what was the result?'] },
    { prompt: 'Your first day at a new job or school.', beats: ['Beginning: how did you feel in the morning?', 'Middle: what surprised you?', 'End: what did you learn?'] },
  ];
  L.OPINIONS = ['Is it better to work from home or in an office?', 'Should everyone learn to cook?', 'Are mobile games a waste of time?', 'Is it important to wake up early?', 'Should companies allow a four-day work week?', 'Is social media good for friendships?'];
  L.REALWORLD = [
    { title: 'Narrate your morning out loud', desc: 'While getting ready, describe what you are doing in English: "Now I\'m brushing my teeth…"', minutes: 5 },
    { title: 'Practice your introduction in the mirror', desc: 'Say your name, your job or study, and one hobby. Three times, a little faster each time.', minutes: 5 },
    { title: 'Order something in English (in your head)', desc: 'Next time you buy food, silently rehearse the full order in English before you speak.', minutes: 3 },
    { title: 'Record a 60-second voice note to yourself', desc: 'Talk about your day. Listen back once. Note one sentence you would improve.', minutes: 5 },
    { title: 'Teach a friend one expression', desc: 'Pick one expression from today and explain it to someone in Indonesian, then say it in English.', minutes: 5 },
    { title: 'Describe three objects around you', desc: 'Pick three things in the room and say two sentences about each one.', minutes: 5 },
  ];
  L.BOSSES = [
    { id: 'boss-interview', title: 'Mock interview marathon', desc: 'Complete the full job-interview simulation with every answer at least 15 words.', scenario: 'job-interview', minWords: 15, xp: 150 },
    { id: 'boss-story', title: 'Storytelling challenge', desc: 'Tell a complete past-tense story of at least 80 words with a beginning, middle and end.', format: 'story', minWords: 80, xp: 150 },
    { id: 'boss-presentation', title: 'Mini-presentation finale', desc: 'Deliver the full presentation simulation, every part at least 15 words.', scenario: 'presentation', minWords: 15, xp: 150 },
    { id: 'boss-smalltalk', title: 'Small-talk master', desc: 'Complete the self-introduction and meeting small-talk simulations in one sitting.', scenario: 'meeting-smalltalk', minWords: 8, xp: 150 },
  ];
  L.SURPRISES = [
    'Describe your dream vacation in exactly five sentences.', 'Explain how to make your favorite drink, step by step.', 'Convince me to watch your favorite movie in 30 seconds.', 'Describe the person sitting next to you (or imagine one) without saying their name.', 'What would you do with one free day and unlimited money? Three sentences.', 'Tell me about your week like you are a sports commentator.',
  ];

  /* ---------- ACHIEVEMENTS ---------- */
  L.BADGES = [
    { id: 'first-mission', em: '🚀', title: 'First mission', desc: 'Complete your first daily milestone.' },
    { id: 'five-sentences', em: '🧱', title: 'Builder', desc: 'Build 25 correct sentences.' },
    { id: 'streak-3', em: '🔥', title: '3-day streak', desc: 'Learn three days in a row.' },
    { id: 'streak-7', em: '🌟', title: 'Week warrior', desc: 'Learn seven days in a row.' },
    { id: 'xp-250', em: '💎', title: 'Level 3', desc: 'Earn 250 XP.' },
    { id: 'xp-1000', em: '🏆', title: 'Level 6', desc: 'Earn 1000 XP.' },
    { id: 'first-speak', em: '🎙️', title: 'Found your voice', desc: 'Finish a Speaking Studio session.' },
    { id: 'first-sim', em: '💼', title: 'Simulator', desc: 'Complete a real-world simulation.' },
    { id: 'boss-1', em: '👑', title: 'Boss slayer', desc: 'Beat a weekly boss challenge.' },
    { id: 'hour-day', em: '⏰', title: 'Full hour', desc: 'Log 60 active minutes in one day.' },
    { id: 'vocab-20', em: '📚', title: 'Word collector', desc: 'Save 20 expressions.' },
    { id: 'fixer', em: '🔧', title: 'Fixer', desc: 'Repair 10 sentences correctly.' },
  ];

  root.HRZZ_DATA = L;
})(typeof window !== 'undefined' ? window : globalThis);
