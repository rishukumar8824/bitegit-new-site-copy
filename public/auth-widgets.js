/* Shared widgets for login.html / signup.html / forgot-password.html:
   - full-page yellow candle-wave loading overlay
   - support chat box (headphone icon)
   - language picker (globe icon)               */
(function () {
  var css = `
    .aw-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.82); z-index: 99999; display: none; align-items: center; justify-content: center; flex-direction: column; gap: 16px; }
    .aw-overlay.show { display: flex; }
    .aw-candle { display: inline-flex; align-items: flex-end; gap: 6px; height: 40px; }
    .aw-candle span { width: 7px; background: #F68F15; border-radius: 3px; animation: awWave 0.9s ease-in-out infinite; }
    .aw-candle span:nth-child(1) { animation-delay: 0s; }
    .aw-candle span:nth-child(2) { animation-delay: .12s; }
    .aw-candle span:nth-child(3) { animation-delay: .24s; }
    .aw-candle span:nth-child(4) { animation-delay: .36s; }
    .aw-candle span:nth-child(5) { animation-delay: .48s; }
    @keyframes awWave { 0%, 100% { height: 12px; } 50% { height: 40px; } }
    .aw-overlay-text { color: #F68F15; font-size: 15px; font-weight: 600; font-family: inherit; }

    .aw-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9998; opacity: 0; pointer-events: none; transition: opacity .2s ease; }
    .aw-backdrop.show { opacity: 1; pointer-events: auto; }

    .aw-sheet { position: fixed; left: 0; right: 0; bottom: 0; margin: 0 auto; max-width: 460px; background: #0d1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px 20px 0 0; z-index: 9999; max-height: 78vh; display: flex; flex-direction: column; transform: translateY(100%); transition: transform .25s cubic-bezier(.25,.46,.45,.94); box-shadow: 0 -10px 30px rgba(0,0,0,.5); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .aw-sheet.show { transform: translateY(0); }
    .aw-sheet-hdr { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
    .aw-sheet-title { color: #eaecef; font-size: 17px; font-weight: 700; }
    .aw-sheet-close { background: none; border: none; color: #848e9c; cursor: pointer; padding: 4px; display: flex; }

    /* Chat */
    .aw-chat-body { flex: 1; overflow-y: auto; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }
    .aw-msg { max-width: 80%; padding: 10px 14px; border-radius: 14px; font-size: 14px; line-height: 1.4; }
    .aw-msg.bot { align-self: flex-start; background: #1a1f28; color: #eaecef; border-bottom-left-radius: 4px; }
    .aw-msg.me { align-self: flex-end; background: #F68F15; color: #000; border-bottom-right-radius: 4px; }
    .aw-chat-input-row { display: flex; gap: 10px; padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
    .aw-chat-input { flex: 1; background: #1a1f28; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; color: #eaecef; font-size: 14px; font-family: inherit; padding: 11px 16px; outline: none; }
    .aw-chat-send { background: #F68F15; border: none; border-radius: 50%; width: 42px; height: 42px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #000; }

    /* Language list */
    .aw-lang-body { overflow-y: auto; padding: 8px 10px 18px; }
    .aw-lang-item { width: 100%; display: flex; align-items: center; justify-content: space-between; background: none; border: none; color: #eaecef; font-size: 15px; font-family: inherit; padding: 13px 12px; border-radius: 10px; cursor: pointer; text-align: left; }
    .aw-lang-item:hover { background: rgba(255,255,255,0.06); }
    .aw-lang-item.active { color: #F68F15; }
    .aw-lang-check { color: #F68F15; display: none; }
    .aw-lang-item.active .aw-lang-check { display: block; }
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Loading overlay ──
  var overlay = document.createElement('div');
  overlay.className = 'aw-overlay';
  overlay.innerHTML = '<span class="aw-candle"><span></span><span></span><span></span><span></span><span></span></span><span class="aw-overlay-text" id="awOverlayText"></span>';
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(overlay); });

  window.awShowLoading = function (text) {
    document.getElementById('awOverlayText') && (document.getElementById('awOverlayText').textContent = text || '');
    overlay.classList.add('show');
  };
  window.awHideLoading = function () {
    overlay.classList.remove('show');
  };

  // ── Backdrop + sheet helpers ──
  var backdrop = document.createElement('div');
  backdrop.className = 'aw-backdrop';

  function closeAll() {
    backdrop.classList.remove('show');
    document.querySelectorAll('.aw-sheet.show').forEach(function (s) { s.classList.remove('show'); });
  }
  backdrop.addEventListener('click', closeAll);

  function openSheet(sheet) {
    backdrop.classList.add('show');
    sheet.classList.add('show');
  }

  // ── Chat box ──
  var CANNED_REPLY = "Thanks for reaching out! Our support team typically replies within a few hours. In the meantime, check our Help Center for common questions.";
  var chatSheet, chatBody, chatInput;

  function buildChat() {
    chatSheet = document.createElement('div');
    chatSheet.className = 'aw-sheet';
    chatSheet.innerHTML =
      '<div class="aw-sheet-hdr"><span class="aw-sheet-title">Customer Support</span>' +
      '<button class="aw-sheet-close" type="button" aria-label="Close">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>' +
      '</button></div>' +
      '<div class="aw-chat-body" id="awChatBody">' +
      '<div class="aw-msg bot">Hi! 👋 How can we help you today?</div>' +
      '</div>' +
      '<div class="aw-chat-input-row">' +
      '<input class="aw-chat-input" id="awChatInput" type="text" placeholder="Type your message…" />' +
      '<button class="aw-chat-send" id="awChatSend" type="button" aria-label="Send">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>' +
      '</button></div>';
    document.body.appendChild(chatSheet);
    chatBody = chatSheet.querySelector('#awChatBody');
    chatInput = chatSheet.querySelector('#awChatInput');

    chatSheet.querySelector('.aw-sheet-close').addEventListener('click', closeAll);

    function send() {
      var v = chatInput.value.trim();
      if (!v) return;
      var me = document.createElement('div');
      me.className = 'aw-msg me';
      me.textContent = v;
      chatBody.appendChild(me);
      chatInput.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;
      setTimeout(function () {
        var bot = document.createElement('div');
        bot.className = 'aw-msg bot';
        bot.textContent = CANNED_REPLY;
        chatBody.appendChild(bot);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 700);
    }
    chatSheet.querySelector('#awChatSend').addEventListener('click', send);
    chatInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
  }

  function openChat() {
    if (!chatSheet) buildChat();
    openSheet(chatSheet);
    setTimeout(function () { chatInput && chatInput.focus(); }, 260);
  }

  // ── Language picker ──
  var LANGUAGES = ['English', 'हिन्दी', 'Deutsch', 'Русский', '简体中文', '繁體中文', 'Español', 'Português'];
  var langSheet;

  function buildLangSheet() {
    langSheet = document.createElement('div');
    langSheet.className = 'aw-sheet';
    var saved = localStorage.getItem('cvx_lang') || 'English';
    var itemsHtml = LANGUAGES.map(function (l) {
      var active = l === saved ? ' active' : '';
      return '<button type="button" class="aw-lang-item' + active + '" data-lang="' + l + '">' +
        '<span>' + l + '</span>' +
        '<svg class="aw-lang-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20,6 9,17 4,12"/></svg>' +
        '</button>';
    }).join('');
    langSheet.innerHTML =
      '<div class="aw-sheet-hdr"><span class="aw-sheet-title">Select Language</span>' +
      '<button class="aw-sheet-close" type="button" aria-label="Close">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>' +
      '</button></div>' +
      '<div class="aw-lang-body">' + itemsHtml + '</div>';
    document.body.appendChild(langSheet);
    langSheet.querySelector('.aw-sheet-close').addEventListener('click', closeAll);
    langSheet.querySelectorAll('.aw-lang-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        localStorage.setItem('cvx_lang', btn.dataset.lang);
        langSheet.querySelectorAll('.aw-lang-item').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        setTimeout(closeAll, 180);
      });
    });
  }

  function openLangPicker() {
    if (!langSheet) buildLangSheet();
    openSheet(langSheet);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(backdrop);
    document.querySelectorAll('a[aria-label="Support"]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openChat(); });
    });
    document.querySelectorAll('a[aria-label="Language"]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openLangPicker(); });
    });
  });
})();
