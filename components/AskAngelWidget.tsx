const widgetStyles = String.raw`
  #ask-angel-btn {
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fde8c0, #f5c878);
    box-shadow: 0 4px 20px rgba(220,160,60,0.5), 0 0 0 6px rgba(245,200,120,0.2);
    border: none;
    cursor: pointer;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: angel-pulse 2.8s ease-in-out infinite;
    transition: transform 0.2s ease;
  }
  #ask-angel-btn:hover { transform: scale(1.08); }
  #ask-angel-btn:active { transform: scale(0.96); }
  @keyframes angel-pulse {
    0%,100% { box-shadow: 0 4px 20px rgba(220,160,60,0.5), 0 0 0 6px rgba(245,200,120,0.2); }
    50% { box-shadow: 0 4px 30px rgba(220,160,60,0.75), 0 0 0 14px rgba(245,200,120,0.12); }
  }
  #ask-angel-btn::after {
    content: 'Ask Angel';
    position: absolute;
    bottom: 78px;
    right: 0;
    background: #5a3e2b;
    color: #f5ddb8;
    font-size: 0.72rem;
    padding: 5px 12px;
    border-radius: 20px;
    white-space: nowrap;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;
  }
  #ask-angel-btn:hover::after { opacity: 1; transform: translateY(0); }
  #ask-angel-panel {
    position: fixed;
    bottom: 112px;
    right: 28px;
    width: 340px;
    max-height: 520px;
    background: white;
    border-radius: 22px;
    box-shadow: 0 12px 48px rgba(80,40,10,0.22);
    border: 1.5px solid #f0e0cc;
    display: flex;
    flex-direction: column;
    z-index: 9998;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    pointer-events: none;
    transition: opacity 0.28s ease, transform 0.28s ease;
    font-family: inherit;
  }
  #ask-angel-panel.open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: all;
  }
  .angel-header {
    background: linear-gradient(135deg, #e8a855, #c47830);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .angel-header-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: rgba(255,255,255,0.22);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .angel-header-avatar svg { width: 28px; height: 28px; }
  .angel-header-text { flex: 1; }
  .angel-header-text h3 { color: white; font-size: 0.95rem; font-weight: 600; line-height: 1.2; margin: 0; }
  .angel-header-text p { color: rgba(255,255,255,0.82); font-size: 0.68rem; margin: 2px 0 0; }
  .angel-close-btn {
    background: rgba(255,255,255,0.18);
    border: none; color: white;
    width: 28px; height: 28px;
    border-radius: 50%; font-size: 18px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.2s;
  }
  .angel-close-btn:hover { background: rgba(255,255,255,0.3); }
  .angel-messages {
    flex: 1; overflow-y: auto;
    padding: 16px 14px;
    display: flex; flex-direction: column; gap: 10px;
    background: #fdf8f3; scroll-behavior: smooth;
  }
  .angel-messages::-webkit-scrollbar { width: 4px; }
  .angel-messages::-webkit-scrollbar-thumb { background: #e0c8a8; border-radius: 4px; }
  .angel-msg-row { display: flex; gap: 7px; align-items: flex-end; }
  .angel-msg-row.user { flex-direction: row-reverse; }
  .angel-msg-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, #fde8c0, #f5c878);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .angel-msg-avatar svg { width: 18px; height: 18px; }
  .angel-bubble {
    max-width: 78%; padding: 9px 13px;
    border-radius: 16px; font-size: 0.78rem;
    line-height: 1.55; word-wrap: break-word;
  }
  .angel-bubble.bot {
    background: white; color: #4a3020;
    border: 1px solid #f0e0cc;
    border-bottom-left-radius: 5px;
    box-shadow: 0 2px 8px rgba(100,60,20,0.07);
  }
  .angel-bubble.user {
    background: linear-gradient(135deg, #e8a855, #c47830);
    color: white; border-bottom-right-radius: 5px;
  }
  .angel-bubble a { color: #c47830; font-weight: 700; }
  .angel-bubble.user a { color: white; }
  .angel-typing { display: flex; gap: 7px; align-items: flex-end; }
  .angel-typing-bubble {
    background: white; border: 1px solid #f0e0cc;
    border-radius: 16px; border-bottom-left-radius: 5px;
    padding: 10px 14px; display: flex; gap: 5px; align-items: center;
    box-shadow: 0 2px 8px rgba(100,60,20,0.07);
  }
  .angel-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #c47830;
    animation: angel-tdot 1.3s ease-in-out infinite; opacity: 0.6;
  }
  .angel-dot:nth-child(2) { animation-delay: 0.18s; }
  .angel-dot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes angel-tdot {
    0%,60%,100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-5px); opacity: 1; }
  }
  .angel-input-area {
    padding: 12px 14px; border-top: 1.5px solid #f0e0cc;
    display: flex; gap: 8px; align-items: center;
    background: white; flex-shrink: 0;
  }
  .angel-input {
    flex: 1; border: 1.5px solid #e8d5c0;
    border-radius: 22px; padding: 9px 14px;
    font-size: 0.76rem; font-family: inherit;
    color: #4a3020; background: #fdf8f3;
    outline: none; transition: border-color 0.2s;
  }
  .angel-input:focus { border-color: #c47830; }
  .angel-input::placeholder { color: #c0a080; }
  .angel-input:disabled { opacity: 0.6; }
  .angel-send {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #e8a855, #c47830);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: transform 0.15s;
    box-shadow: 0 2px 8px rgba(196,120,48,0.35);
  }
  .angel-send:hover { transform: scale(1.08); }
  .angel-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .angel-send svg { width: 16px; height: 16px; fill: white; }
  .angel-powered {
    text-align: center; font-size: 0.58rem;
    color: #c0a888; padding: 5px 0 8px;
    background: white; flex-shrink: 0;
  }
  @media (max-width: 640px) {
    #ask-angel-panel {
      width: calc(100vw - 24px);
      right: 12px;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 88px);
      max-height: min(520px, calc(100vh - 154px));
    }
    #ask-angel-btn {
      right: 16px;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 18px);
      width: 58px;
      height: 58px;
    }
  }
`;

const angelIcon = String.raw`
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="18" rx="18" ry="5" fill="none" stroke="#e8a030" stroke-width="3.5" opacity="0.9"/>
    <ellipse cx="22" cy="58" rx="18" ry="11" fill="#fff8e8" stroke="#f0c870" stroke-width="2" transform="rotate(-20 22 58)"/>
    <ellipse cx="20" cy="62" rx="12" ry="7" fill="#fdecc0" stroke="#f0c870" stroke-width="1.5" transform="rotate(-30 20 62)"/>
    <ellipse cx="78" cy="58" rx="18" ry="11" fill="#fff8e8" stroke="#f0c870" stroke-width="2" transform="rotate(20 78 58)"/>
    <ellipse cx="80" cy="62" rx="12" ry="7" fill="#fdecc0" stroke="#f0c870" stroke-width="1.5" transform="rotate(30 80 62)"/>
    <ellipse cx="50" cy="75" rx="18" ry="14" fill="#fff0d0" stroke="#f0c880" stroke-width="1.5"/>
    <circle cx="50" cy="46" r="22" fill="#fde8c8" stroke="#f0c090" stroke-width="1.5"/>
    <circle cx="43" cy="44" r="3.5" fill="#5a3010"/>
    <circle cx="57" cy="44" r="3.5" fill="#5a3010"/>
    <circle cx="44.2" cy="42.8" r="1.2" fill="white"/>
    <circle cx="58.2" cy="42.8" r="1.2" fill="white"/>
    <path d="M43 52 Q50 58 57 52" stroke="#c07040" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="39" cy="50" r="5" fill="#f0a080" opacity="0.35"/>
    <circle cx="61" cy="50" r="5" fill="#f0a080" opacity="0.35"/>
    <circle cx="50" cy="49" r="2" fill="#e09070" opacity="0.5"/>
    <path d="M30 40 Q32 26 50 24 Q68 26 70 40" fill="#f0c878" stroke="#e0a840" stroke-width="1"/>
  </svg>
`;

const widgetMarkup = String.raw`
  <button id="ask-angel-btn" aria-label="Ask Angel - Find your book">
    ${angelIcon}
  </button>

  <div id="ask-angel-panel" role="dialog" aria-label="Ask Angel chat">
    <div class="angel-header">
      <div class="angel-header-avatar">${angelIcon}</div>
      <div class="angel-header-text">
        <h3>Ask Angel &#10022;</h3>
        <p>Find the perfect Bible story book</p>
      </div>
      <button class="angel-close-btn" id="angel-close-btn" aria-label="Close">&times;</button>
    </div>
    <div class="angel-messages" id="angel-messages">
      <div class="angel-msg-row">
        <div class="angel-msg-avatar">${angelIcon}</div>
        <div class="angel-bubble bot">
          Hello! I am Angel, your guide to <em>Bible Stories for Little Hearts</em>.<br><br>
          Need a bedtime book? Open <strong>Tonight</strong>. Teaching Sunday school? Open <strong>Churches</strong>.<br><br>
          Tell me about your child, a Bible story, a theme, or something on the website, and I will help.
        </div>
      </div>
    </div>
    <div class="angel-input-area" id="angel-input-area">
      <input class="angel-input" id="angel-input" type="text"
        placeholder="e.g. my 5 year old loves animals..."
        autocomplete="off" maxlength="300"/>
      <button class="angel-send" id="angel-send-btn" aria-label="Send">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div class="angel-powered">&#10022; Bible Stories for Little Hearts &#10022;</div>
  </div>
`;

const widgetScript = String.raw`
(function () {
  if (window.__askAngelInitialized) return;
  window.__askAngelInitialized = true;

  const WORKER_URL = 'https://ask-angel.ruhezhao.workers.dev';
  const SITE_URL = 'https://www.faithfulheartsbooks.com';

  let booksCache = null;
  let isOpen = false;
  let isLoading = false;
  let history = [];
  let typingEl = null;

  let panelEl;
  let messagesEl;
  let inputEl;
  let sendEl;
  let closeEl;
  let btnEl;

  function refreshElements() {
    panelEl = document.getElementById('ask-angel-panel');
    messagesEl = document.getElementById('angel-messages');
    inputEl = document.getElementById('angel-input');
    sendEl = document.getElementById('angel-send-btn');
    closeEl = document.getElementById('angel-close-btn');
    btnEl = document.getElementById('ask-angel-btn');

    return !!(panelEl && messagesEl && inputEl && sendEl && closeEl && btnEl);
  }

  refreshElements();

  document.addEventListener('click', async function (event) {
    const target = event.target;
    if (!target || !target.closest) return;

    if (target.closest('#ask-angel-btn')) {
      event.preventDefault();
      if (!refreshElements()) return;
      isOpen = !panelEl.classList.contains('open');
      panelEl.classList.toggle('open', isOpen);
      if (isOpen) {
        inputEl.focus();
        if (!booksCache) await loadBooks();
      }
      return;
    }

    if (target.closest('#angel-close-btn')) {
      event.preventDefault();
      if (!refreshElements()) return;
      isOpen = false;
      panelEl.classList.remove('open');
      return;
    }

    if (target.closest('#angel-send-btn')) {
      event.preventDefault();
      if (!refreshElements()) return;
      sendMessage();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!event.target || event.target.id !== 'angel-input') return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!refreshElements()) return;
      sendMessage();
    }
  });

  window.addEventListener('pageshow', function () {
    refreshElements();
    isOpen = !!(panelEl && panelEl.classList.contains('open'));
  });

  async function loadBooks() {
    refreshElements();
    try {
      if (inputEl) inputEl.placeholder = 'Loading all books...';
      const response = await fetch(window.location.origin + '/api/ask-angel-books', {
        credentials: 'same-origin'
      });

      if (response.ok) {
        const data = await response.json();
        booksCache = normalizeBooks(data.books || []);
        if (booksCache.length > 0) return;
      }
    } catch (error) {
      console.warn('Ask Angel could not load the book data endpoint.', error);
    } finally {
      if (inputEl) inputEl.placeholder = 'e.g. my 5 year old loves animals...';
    }

    booksCache = normalizeBooks(getBuiltInBooks());
  }

  function normalizeBooks(books) {
    const byTitle = new Map();

    books.forEach(function (book) {
      if (!book || !book.title || /^coming soon$/i.test(book.title)) return;

      const key = normalizeTitle(book.title);
      if (!key) return;

      const existing = byTitle.get(key) || {};
      const bookHasAmazon = isAmazonUrl(book.amazonUrl);
      const existingHasAmazon = isAmazonUrl(existing.amazonUrl);

      byTitle.set(key, {
        number: existing.number || book.number || '',
        numberValue: Number(existing.numberValue || book.numberValue || parseBookNumberValue(book)),
        slug: existing.slug || book.slug || '',
        title: existing.title || book.title,
        subtitle: existing.subtitle || book.subtitle || '',
        ageRange: existing.ageRange || book.ageRange || '',
        theme: existing.theme || book.theme || '',
        desc: longerText(existing.desc, book.desc),
        scriptureReference: existing.scriptureReference || book.scriptureReference || '',
        biblicalOrder: existing.biblicalOrder ?? book.biblicalOrder ?? null,
        songTitle: existing.songTitle || book.songTitle || book.song?.title || '',
        songArtist: existing.songArtist || book.songArtist || book.song?.artist || '',
        songEmbedId: existing.songEmbedId || book.songEmbedId || book.song?.embedId || '',
        songYoutubeUrl: existing.songYoutubeUrl || book.songYoutubeUrl || (
          (book.songEmbedId || book.song?.embedId) ? 'https://www.youtube.com/watch?v=' + (book.songEmbedId || book.song.embedId) : ''
        ),
        songEmbedUrl: existing.songEmbedUrl || book.songEmbedUrl || (
          (book.songEmbedId || book.song?.embedId) ? 'https://www.youtube.com/embed/' + (book.songEmbedId || book.song.embedId) : ''
        ),
        bookUrl: existing.bookUrl || book.bookUrl || (book.slug ? SITE_URL + '/book/' + book.slug : ''),
        amazonUrl: bookHasAmazon && !existingHasAmazon
          ? book.amazonUrl
          : existing.amazonUrl || book.amazonUrl || ''
      });
    });

    return Array.from(byTitle.values()).sort(function (a, b) {
      return parseBookNumberValue(a) - parseBookNumberValue(b);
    });
  }

  function parseBookNumberValue(book) {
    return Number(book.numberValue || String(book.number || '').replace(/\D/g, '')) || 0;
  }

  function getNewestBook(books) {
    return books.slice().sort(function (a, b) {
      return parseBookNumberValue(b) - parseBookNumberValue(a);
    })[0];
  }

  function buildSeriesMapSummary(books) {
    return books
      .filter(function (book) {
        return book.scriptureReference || typeof book.biblicalOrder === 'number';
      })
      .sort(function (a, b) {
        const byBibleOrder = (Number(a.biblicalOrder) || 9999) - (Number(b.biblicalOrder) || 9999);
        return byBibleOrder || parseBookNumberValue(a) - parseBookNumberValue(b);
      })
      .map(function (book) {
        return (book.number || 'Book') + ': ' + book.title + (book.scriptureReference ? ' - ' + book.scriptureReference : '');
      })
      .join('\n');
  }

  function buildWebsiteKnowledge(books, newestBook) {
    const seriesMap = buildSeriesMapSummary(books);

    return [
      'WEBSITE KNOWLEDGE:',
      '- Website: faithfulheartsbooks.com, home of Bible Stories for Little Hearts by Faith Rivers.',
      '- Homepage: storybook collection, theme filters, Book Order/A-Z sorting, pagination, a Series Map pill, and newsletter signup.',
      '- Series Map: shows books in biblical timeline order, grouped into Old Testament and New Testament. It uses cover thumbnails, book numbers, titles, and scripture references. It is different from publication order.',
      '- Newest available book: ' + (newestBook ? (newestBook.number + ' "' + newestBook.title + '"') : 'the available book with the highest book number in live book data') + '.',
      '- Always calculate newest/latest/new book from the highest available book number in the live book data. Do not rely on a manually written newest-book sentence.',
      '- Free Resources page: /free-resources. It includes printable resources such as coloring pages, memory verse posters, lesson packs, 5-day devotionals, bookmarks, and certificates when available.',
      '- Play page: /play. It is the Daily Story Puzzle for kids. Each local calendar day has three Bible story puzzle activities from the books. Children solve picture puzzles, earn color sticker rewards, collect them in a sticker album saved on that device, and can play practice puzzles after finishing the daily set. Practice gives stars, not new stickers or streak progress. The page is free and uses no accounts.',
      '- Tonight page: /tonight. A new Bible picture book is featured every night after midnight in the visitor\'s local time. Families can read a 4-page bedtime peek, then buy the paperback on Amazon. If tonight\'s book is not the right mood, they can pick brave, cozy, curious, or needs a hug and get three matching books with sample pages. There is a Copy caption button for posting. Send bedtime / what-should-we-read-tonight questions here.',
      '- Churches page: /churches. A weekly Sunday school and homeschool kit. Three picture books for this week\'s theme. The kit changes every Sunday. Teachers and families should order the paperbacks on Amazon, not by email. There is a Copy caption for sharing the kit. Send Sunday school, church, classroom, and homeschool questions here.',
      '- About page: /about. It introduces Faith Rivers and the heart behind the series.',
      '- Contact page: /contact. Families can reach the site there or use info@faithfulheartsbooks.com.',
      '- Newsletter signup: on the homepage for updates about new books and free printables.',
      '',
      'SERIES MAP ORDER FROM LIVE BOOK DATA:',
      seriesMap || 'Use scriptureReference and biblicalOrder fields from live book data.'
    ].join('\n');
  }

  function buildSystemPrompt() {
    const books = normalizeBooks(booksCache || getBuiltInBooks());
    const newestBook = getNewestBook(books);
    const websiteKnowledge = buildWebsiteKnowledge(books, newestBook);
    const bookList = books.map(function (book) {
      return [
        (book.number || 'Book') + ': "' + book.title + '"',
        book.subtitle ? 'Subtitle: ' + book.subtitle : '',
        book.theme ? 'Theme: ' + book.theme : '',
        book.scriptureReference ? 'Scripture: ' + book.scriptureReference : '',
        book.songTitle ? 'Sing Along video: "' + book.songTitle + '"' + (book.songArtist ? ' by ' + book.songArtist : '') : '',
        book.songYoutubeUrl ? 'YouTube: ' + book.songYoutubeUrl : '',
        book.songEmbedUrl ? 'YouTube embed: ' + book.songEmbedUrl : '',
        book.desc || '',
        book.bookUrl ? 'Book page: ' + book.bookUrl : '',
        book.amazonUrl ? 'Amazon: ' + book.amazonUrl : ''
      ].filter(Boolean).join(' | ');
    }).join('\n');

    return [
      'You are Angel, the warm and friendly assistant inside the Ask Angel chat for Bible Stories for Little Hearts, a Christian children book series by Faith Rivers for ages 3-8.',
      '',
      'You help parents, grandparents, teachers, and caregivers in three ways:',
      '1. Find the perfect book from this series.',
      '2. Explain website sections and where to find things.',
      '3. Share Bible verse references and brief encouragement related to the stories and themes in this series.',
      '',
      websiteKnowledge,
      '',
      'BOOKS CURRENTLY AVAILABLE (' + books.length + ' books):',
      bookList,
      '',
      'GUIDELINES:',
      '- Be warm, gentle, and encouraging. Match the tone of a faith-based children book brand.',
      '- When introducing yourself, say "I am Angel" rather than "I am Ask Angel".',
      '- Recommend 1-2 books maximum per response.',
      '- Always include the Amazon link when recommending a book if one exists; otherwise include the book page link.',
      '- Keep responses short and friendly because parents are busy.',
      '- Do not use Markdown heading syntax such as "#", "##", or "###". If you need a title, write it as plain text or bold text.',
      '- Answer questions about website navigation, Series Map, Tonight, Churches, Free Resources, Play, About, Contact, newsletter, and available books using WEBSITE KNOWLEDGE.',
      '- If a parent asks what to read tonight, at bedtime, or for a nightly story, send them to /tonight. Mention they can read a few sample pages, then buy the paperback on Amazon.',
      '- If a teacher, church, Sunday school, or homeschool asks for a lesson or kit, send them to /churches and tell them to order the paperbacks on Amazon. Do not tell them to email for bulk orders.',
      '- Each book page may include a Sing Along YouTube video. If asked about songs, music, sing-along videos, or YouTube videos, answer from the Sing Along video fields in the live book list.',
      '- If a user asks for a book video, include the YouTube link when it exists and mention that the video is also embedded on that book page.',
      '- If asked about the Series Map, explain that it is biblical chronological order and mention Old Testament/New Testament grouping.',
      '- If asked for the newest/latest/new book, answer using this live value: ' + (newestBook ? newestBook.number + ' "' + newestBook.title + '"' : 'highest available book number') + '.',
      '- If asked how many books are available, answer exactly: "There are ' + books.length + ' books currently available in the series."',
      '- Ignore Coming Soon placeholder cards when counting available books or naming the newest available book.',
      '- Never invent books not in the live book list above.',
      '- If asked anything unrelated to the books, website, or Bible encouragement, kindly say: "I am here to help you find the perfect Bible story, understand the website, or share an encouraging verse. What are you looking for?"'
    ].join('\n');
  }

  function localFallbackReply(question) {
    const books = normalizeBooks(booksCache || getBuiltInBooks());
    const newestBook = getNewestBook(books);
    const q = cleanText(question).toLowerCase();

    if (/series map|timeline|biblical order|chronological/.test(q)) {
      return 'The **Series Map** shows the books in biblical timeline order, grouped into Old Testament and New Testament. It uses each book reference, so new books can slot into the right Bible-story position automatically.';
    }

    if (/free resources|printable|coloring|lesson|devotional|bookmark|certificate/.test(q)) {
      return 'The **Free Resources** page has printable resources like coloring pages, memory verse posters, lesson packs, 5-day devotionals, bookmarks, and certificates when available. You can visit **/free-resources**.';
    }

    if (/tonight|bedtime|bed time|what to read|nightly story/.test(q)) {
      return "**Tonight's story** is a new picture book every night. Open **/tonight**, read a few sample pages together, then buy the paperback on Amazon. After midnight a new book takes a turn.";
    }

    if (/church|sunday school|homeschool|home school|lesson kit|this week's kit/.test(q)) {
      return "**Churches** has this week's Sunday school kit: three picture books for one theme. Open **/churches** and order the paperbacks on Amazon.";
    }

    if (/play|game|puzzle|sticker|album|practice|star|daily story/.test(q)) {
      return '**The Daily Story Puzzle** is the free Play page at **/play**. Each day has three Bible story puzzles from the books. Kids solve the picture, earn color stickers for their album, and after the daily three are finished they can play practice puzzles for stars. Stickers are saved on that device, with no account needed.';
    }

    if (/how many|count|total|number of books/.test(q)) {
      return 'There are **' + books.length + ' books** currently available in the series.';
    }

    if (/new|newest|latest|recent/.test(q) && newestBook) {
      return 'The newest book is **' + newestBook.title + '**' + (newestBook.desc ? '. ' + newestBook.desc : '') + ' [Find it on Amazon](' + (newestBook.amazonUrl || newestBook.bookUrl) + ')';
    }

    if (/song|sing along|youtube|video|music/.test(q)) {
      const songMatch = findBestBookMatch(books, q);
      if (songMatch && songMatch.songTitle) {
        return '**' + songMatch.title + '** has a Sing Along video: **' + songMatch.songTitle + '**' + (songMatch.songArtist ? ' by ' + songMatch.songArtist : '') + '.' + (songMatch.songYoutubeUrl ? ' [Watch on YouTube](' + songMatch.songYoutubeUrl + ')' : ' You can also find it embedded on the book page.');
      }
      return 'Many book pages include a **Sing Along** YouTube video. Tell me which book you mean, and I can help find the song for that story.';
    }

    const themeMatch = findBestBookMatch(books, q);

    if (themeMatch) {
      return 'I think **' + themeMatch.title + '** could be a lovely fit.' + (themeMatch.desc ? ' ' + themeMatch.desc : '') + ' [Find it on Amazon](' + (themeMatch.amazonUrl || themeMatch.bookUrl) + ')';
    }

    return 'I can see **' + books.length + ' books** in the series. Ask me about a theme, bedtime on **/tonight**, Sunday school on **/churches**, the newest book, the Series Map, Free Resources, or Play.';
  }

  function avatarSVG() {
    const icon = document.querySelector('#ask-angel-btn svg');
    return icon ? icon.outerHTML : '';
  }

  function appendMessage(text, role) {
    if (!refreshElements()) return;
    const row = document.createElement('div');
    row.className = 'angel-msg-row' + (role === 'user' ? ' user' : '');

    if (role === 'assistant') {
      const avatar = document.createElement('div');
      avatar.className = 'angel-msg-avatar';
      avatar.innerHTML = avatarSVG();
      row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'angel-bubble ' + (role === 'user' ? 'user' : 'bot');
    bubble.innerHTML = text
      .replace(/(^|\n)#{1,6}\s+/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1 &rarr;</a>')
      .replace(/(^|[\s>])(https?:\/\/[^\s<]+)/g, function (match, prefix, url) {
        return prefix + buildLink(url, url);
      })
      .replace(/(^|[\s>])((?:www\.)?faithfulheartsbooks\.com(?:\/[^\s<]*)?)/gi, function (match, prefix, url) {
        const href = url.startsWith('www.') ? 'https://' + url : 'https://www.' + url;
        return prefix + buildLink(href, url);
      })
      .replace(/(^|[\s>])(\/(?:play|tonight|churches|about|contact|free-resources|book\/[a-z0-9-]+|newsletter\/thank-you)(?:[^\s<]*)?)/gi, function (match, prefix, path) {
        return prefix + buildLink(SITE_URL + path, path);
      })
      .replace(/\n/g, '<br>');

    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function buildLink(href, label) {
    const trailing = (label.match(/[.,!?)]$/) || [''])[0];
    const cleanLabel = trailing ? label.slice(0, -1) : label;
    const cleanHref = trailing ? href.slice(0, -1) : href;
    return '<a href="' + cleanHref + '" target="_blank" rel="noopener">' + cleanLabel + ' &rarr;</a>' + trailing;
  }

  function showTyping() {
    if (!refreshElements()) return;
    typingEl = document.createElement('div');
    typingEl.className = 'angel-typing';
    const avatar = document.createElement('div');
    avatar.className = 'angel-msg-avatar';
    avatar.innerHTML = avatarSVG();
    const bubble = document.createElement('div');
    bubble.className = 'angel-typing-bubble';
    bubble.innerHTML = '<div class="angel-dot"></div><div class="angel-dot"></div><div class="angel-dot"></div>';
    typingEl.appendChild(avatar);
    typingEl.appendChild(bubble);
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    if (typingEl) {
      typingEl.remove();
      typingEl = null;
    }
  }

  function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  async function fetchWorkerWithRetry(payload) {
    let lastError;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Ask Angel worker failed with status ' + response.status);
        return response;
      } catch (error) {
        lastError = error;
        if (attempt === 0) await delay(1500);
      }
    }

    throw lastError;
  }

  async function sendMessage() {
    if (!refreshElements()) return;
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    inputEl.value = '';
    isLoading = true;
    sendEl.disabled = true;

    appendMessage(text, 'user');
    history.push({ role: 'user', content: text });
    showTyping();

    try {
      if (!booksCache) await loadBooks();
      const response = await fetchWorkerWithRetry({
        messages: history,
        system: buildSystemPrompt()
      });

      const data = await response.json();
      hideTyping();

      const reply = data.content && data.content[0] && data.content[0].text
        ? data.content[0].text
        : localFallbackReply(text);

      history.push({ role: 'assistant', content: reply });
      appendMessage(reply, 'assistant');
    } catch (error) {
      console.warn('Ask Angel worker request failed.', error);
      hideTyping();
      const reply = localFallbackReply(text);
      history.push({ role: 'assistant', content: reply });
      appendMessage(reply, 'assistant');
    } finally {
      isLoading = false;
      sendEl.disabled = false;
      inputEl.focus();
    }
  }

  function isAmazonUrl(url) {
    return /amazon\.com|amzn\.to/.test(url || '');
  }

  function longerText(first, second) {
    const a = first || '';
    const b = second || '';
    return b.length > a.length ? b : a;
  }

  function cleanText(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function normalizeTitle(title) {
    return cleanText(title).toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  function findBestBookMatch(books, question) {
    const numberMatch = question.match(/\bbook\s*0?(\d{1,3})\b/i);
    if (numberMatch) {
      const requestedNumber = Number(numberMatch[1]);
      const byNumber = books.find(function (book) {
        return parseBookNumberValue(book) === requestedNumber;
      });
      if (byNumber) return byNumber;
    }

    const ignoredWords = new Set([
      'book',
      'song',
      'sing',
      'along',
      'youtube',
      'video',
      'music',
      'what',
      'which',
      'about',
      'does',
      'have',
      'tell',
      'show'
    ]);

    return books.find(function (book) {
      const haystack = (
        book.number + ' ' +
        book.title + ' ' +
        book.subtitle + ' ' +
        book.theme + ' ' +
        book.desc + ' ' +
        book.scriptureReference + ' ' +
        book.songTitle + ' ' +
        book.songArtist
      ).toLowerCase();

      return question.split(/\s+/).some(function (word) {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]+/g, '');
        return cleanWord.length > 3 && !ignoredWords.has(cleanWord) && haystack.includes(cleanWord);
      });
    });
  }

  function getBuiltInBooks() {
    return [
      { number: 'Book 01', title: "Noah and God's Big Promise", theme: 'Trust', desc: "When the rains came, Noah trusted God's plan.", scriptureReference: 'Genesis 6-9', biblicalOrder: 20, amazonUrl: 'https://www.amazon.com/dp/B0GYHZ8P9S' },
      { number: 'Book 02', title: 'David and the Giant', theme: 'Courage', desc: 'A young shepherd boy discovers that God is bigger than every giant.', scriptureReference: '1 Samuel 17', biblicalOrder: 70, amazonUrl: 'https://www.amazon.com/dp/B0GYNRCKQD' },
      { number: 'Book 03', title: 'Moses and the Red Sea', theme: 'Faith', desc: "Moses trusts God's plan as God makes a way through the sea.", scriptureReference: 'Exodus 14', biblicalOrder: 50, amazonUrl: 'https://www.amazon.com/dp/B0GZ43TKCK' },
      { number: 'Book 04', title: 'Jonah and the Big Fish', theme: 'Obedience', desc: 'A playful story about obedience and second chances.', scriptureReference: 'Book of Jonah', biblicalOrder: 120, amazonUrl: 'https://www.amazon.com/dp/B0GZDKNN5L' },
      { number: 'Book 05', title: 'Daniel and the Lions', theme: 'Prayer', desc: 'A brave story about faith, prayer, and trusting God.', scriptureReference: 'Daniel 6', biblicalOrder: 110, amazonUrl: 'https://www.amazon.com/dp/B0GZGFJTSL' },
      { number: 'Book 06', title: 'Esther the Brave Queen', theme: 'Bravery', desc: 'A beautiful story about courage, purpose, and faith.', scriptureReference: 'Book of Esther', biblicalOrder: 100, amazonUrl: 'https://www.amazon.com/dp/B0GZK239VN' },
      { number: 'Book 07', title: 'The Christmas Story', theme: 'Love', desc: 'A tender retelling of the night Jesus was born.', scriptureReference: 'Luke 2', biblicalOrder: 130, amazonUrl: 'https://www.amazon.com/dp/B0GZNQZQGX' },
      { number: 'Book 08', title: "Joseph's Colorful Coat", theme: 'Forgiveness', desc: 'A story about hard days, surprising turns, and brave forgiveness.', scriptureReference: 'Genesis 37-50', biblicalOrder: 30, amazonUrl: 'https://www.amazon.com/dp/B0GZL3YG8L' },
      { number: 'Book 09', title: 'The Easter Story', theme: 'Hope', desc: "A joyful retelling of Jesus' death and resurrection.", scriptureReference: 'Matthew 28', biblicalOrder: 150, amazonUrl: 'https://www.amazon.com/dp/B0GZPY9RL1' },
      { number: 'Book 10', title: 'Ruth and Naomi', theme: 'Loyal Love', desc: 'A warm story of faithful love through hard times.', scriptureReference: 'Book of Ruth', biblicalOrder: 60, amazonUrl: 'https://www.amazon.com/dp/B0GZQX7D3N' },
      { number: 'Book 11', title: 'The Birth of Moses', theme: 'Protection', desc: 'A story of a tiny basket, a brave sister, and God protecting His children.', scriptureReference: 'Exodus 1-2', biblicalOrder: 40, amazonUrl: 'https://www.amazon.com/dp/B0H15BN3RD' },
      { number: 'Book 12', title: 'Solomon and Wisdom', theme: 'Wisdom', desc: 'A thoughtful story about asking God for wisdom.', scriptureReference: '1 Kings 3', biblicalOrder: 80, amazonUrl: 'https://www.amazon.com/dp/B0H184LKSF' },
      { number: 'Book 13', title: 'Elijah and the Still Small Voice', theme: 'Listening', desc: "A comforting story about hearing God's gentle voice.", scriptureReference: '1 Kings 19', biblicalOrder: 90, amazonUrl: 'https://www.amazon.com/dp/B0H18JDFCW' },
      { number: 'Book 14', title: 'Jesus Calms the Storm', theme: 'Peace', desc: 'A comforting story that reminds little hearts Jesus is near in every storm.', scriptureReference: 'Mark 4', biblicalOrder: 140, amazonUrl: 'https://www.amazon.com/dp/B0H18WDG5P' },
      { number: 'Book 15', title: 'The Creation Story', theme: 'Wonder', desc: "A joyful retelling of Genesis 1 and the beauty of God's world.", scriptureReference: 'Genesis 1', biblicalOrder: 10, amazonUrl: 'https://www.amazon.com/dp/B0H18HQKWT' },
      { number: 'Book 16', title: 'The Armor of God', theme: 'Faith', desc: 'A joyful story from Ephesians 6 about being dressed for God adventure.', scriptureReference: 'Ephesians 6:10-18', biblicalOrder: 160, amazonUrl: 'https://www.amazon.com/dp/B0H1BQX3LP' },
      { number: 'Book 17', title: 'Zacchaeus', theme: 'Love', desc: 'A joyful retelling that Jesus sees every heart.', scriptureReference: 'Luke 19:1-10', biblicalOrder: 148, amazonUrl: 'https://www.amazon.com/dp/B0H1CG1P1X' },
      { number: 'Book 18', title: 'The Good Samaritan', theme: 'Love', desc: 'A story of compassion, courage, and care.', scriptureReference: 'Luke 10:25-37', biblicalOrder: 145, amazonUrl: 'https://www.amazon.com/dp/B0H1CPYC6T' },
      { number: 'Book 19', title: 'The Lost Sheep', theme: 'Love', desc: 'A tender story that Jesus knows each child by name.', scriptureReference: 'Luke 15:3-7; Matthew 18:12-14', biblicalOrder: 147, amazonUrl: 'https://www.amazon.com/dp/B0H1CTPVMV' },
      { number: 'Book 20', title: 'The Feeding of the 5,000', theme: 'Faith', desc: 'A miracle story about a small lunch and Jesus making more than enough.', scriptureReference: 'Mark 6:30-44; John 6:1-14', biblicalOrder: 142, amazonUrl: 'https://www.amazon.com/dp/B0H1D867ZJ' },
      { number: 'Book 21', title: 'Adam and Eve in the Garden', theme: 'Wonder', desc: "A gentle garden story about God's beautiful beginning.", scriptureReference: 'Genesis 2-3', biblicalOrder: 15, amazonUrl: 'https://www.amazon.com/dp/B0H1JDBH3V' },
      { number: 'Book 22', title: 'Joshua and Jericho', theme: 'Faith', desc: "A joyful story about Joshua, Jericho, and trusting God's instructions.", scriptureReference: 'Joshua 6', biblicalOrder: 55, amazonUrl: 'https://www.amazon.com/dp/B0H25YF2J6' },
      { number: 'Book 23', title: 'The Fiery Furnace', theme: 'Courage', desc: 'A brave story about trusting God in the fire.', scriptureReference: 'Daniel 3', biblicalOrder: 112, amazonUrl: 'https://www.amazon.com/dp/B0H25KF241' },
      { number: 'Book 24', title: 'The Prodigal Son', theme: 'Forgiveness', desc: 'A tender parable about coming home and being welcomed with love.', scriptureReference: 'Luke 15:11-32', biblicalOrder: 146, amazonUrl: 'https://www.amazon.com/dp/B0H25RMCJY' },
      { number: 'Book 25', title: 'Jesus Welcomes Children', theme: 'Love', desc: 'A warm Gospel story reminding little hearts that Jesus welcomes children.', scriptureReference: 'Mark 10:13-16', biblicalOrder: 143, amazonUrl: 'https://www.amazon.com/dp/B0H25YPF38' },
      { number: 'Book 26', title: 'The Wedding at Cana', theme: 'Wonder', desc: 'A joyful first-miracle story where Jesus fills empty jars with the very best.', scriptureReference: 'John 2:1-11', biblicalOrder: 135, amazonUrl: 'https://www.amazon.com/dp/B0H26G965M' },
      { number: 'Book 27', title: "Hannah's Prayer and Young Samuel", theme: 'Prayer', desc: 'A tender story of honest prayer and young Samuel learning to listen when God calls.', scriptureReference: '1 Samuel 1:1-28; 2:1-11; 3:1-10', biblicalOrder: 65, amazonUrl: 'https://www.amazon.com/dp/B0H26QR9MJ' },
      { number: 'Book 28', title: 'Saul Becomes Paul', theme: 'Forgiveness', desc: 'A bright Damascus-road story showing that Jesus can change anyone.', scriptureReference: 'Acts 9:1-19; 22:6-16; 26:12-18', biblicalOrder: 155, amazonUrl: 'https://www.amazon.com/dp/B0H26XYBCM' },
      { number: 'Book 29', title: 'Paul and Silas in Prison', theme: 'Courage', desc: 'An exciting Acts story about choosing joy in hard places and singing at midnight.', scriptureReference: 'Acts 16:16-40', biblicalOrder: 156, amazonUrl: 'https://www.amazon.com/dp/B0H274YJR4' },
      { number: 'Book 30', title: 'Pentecost: The Holy Spirit Comes', theme: 'Faith', desc: 'A joyful Pentecost story showing that Jesus sent the Holy Spirit, our Helper.', scriptureReference: 'Acts 1:4-8; 2:1-41', biblicalOrder: 152, amazonUrl: 'https://www.amazon.com/dp/B0H2F78SY9' },
      { number: 'Book 31', title: "Elisha and the Widow's Oil", theme: 'Trust', desc: "A warm story of God's provision, showing little hearts that when we bring what we have and trust Him, He can fill every empty place.", scriptureReference: '2 Kings 4:1-7', biblicalOrder: 92, amazonUrl: 'https://www.amazon.com/dp/B0H2Z7SP3B' },
      { number: 'Book 32', title: 'Tower of Babel', theme: 'Trust', desc: 'A thoughtful Genesis story reminding little hearts that God knows best, even when we do not understand.', scriptureReference: 'Genesis 11:1-9', biblicalOrder: 25, amazonUrl: 'https://www.amazon.com/dp/B0H344KNV1' },
      { number: 'Book 33', title: "Gideon's Tiny Army", theme: 'Courage', desc: 'A brave Judges story showing that God can use the small and weak to do mighty things.', scriptureReference: 'Judges 6-7', biblicalOrder: 58, amazonUrl: 'https://www.amazon.com/dp/B0H373C86F' },
      { number: 'Book 34', title: 'Nehemiah Builds the Wall', theme: 'Faith', desc: 'A steady story about praying first, planning carefully, working with courage, and trusting God to help us finish.', scriptureReference: 'Nehemiah 1-6', biblicalOrder: 125, amazonUrl: 'https://www.amazon.com/dp/B0H3F92CBF' },
      { number: 'Book 35', title: 'Jesus Walks on Water', theme: 'Faith', desc: 'A faith-filled Gospel story reminding little hearts that Jesus reaches out His hand when we feel like we are sinking.', scriptureReference: 'Matthew 14:22-33', biblicalOrder: 142.5, amazonUrl: 'https://www.amazon.com/dp/B0H3FNVRM5' },
      { number: 'Book 36', title: 'Lazarus Comes Out', theme: 'Hope', desc: 'A tender John 11 story showing that Jesus cares about our tears and that with Him, there is always hope.', scriptureReference: 'John 11:1-44', biblicalOrder: 149, amazonUrl: 'https://www.amazon.com/dp/B0H3FKBSMF' }
    ];
  }
})();
`;

export default function AskAngelWidget() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: widgetStyles }} />
      <div dangerouslySetInnerHTML={{ __html: widgetMarkup }} />
      <script id="ask-angel-widget" dangerouslySetInnerHTML={{ __html: widgetScript }} />
    </>
  );
}
