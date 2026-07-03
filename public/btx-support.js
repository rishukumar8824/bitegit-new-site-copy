/**
 * btx-support.js — Bitcovex Floating Support Chat Widget
 * Drop <script src="/btx-support.js"></script> in any page.
 * Admin mode: add ?btxadmin=1 to URL once, stays active.
 */
(function () {
  if (window.__btxSupportLoaded) return;
  window.__btxSupportLoaded = true;

  /* ─── CONFIG ─────────────────────────────────────────── */
  const BRAND       = 'BITCOVEX';
  const COLOR       = '#aaff00';
  const SP_KEY      = 'btx_support_tickets';
  const SP_ACTIVE   = 'btx_support_active';
  const ADM_KEY     = 'btxadmin_mode';

  /* ─── CSS ─────────────────────────────────────────────── */
  const css = `
  #btxSupportFab{position:fixed;bottom:24px;right:20px;z-index:99990;width:52px;height:52px;border-radius:50%;background:${COLOR};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(170,255,0,.35);transition:transform .15s;}
  #btxSupportFab:hover{transform:scale(1.08);}
  #btxSupportFab svg{pointer-events:none;}
  #btxFabBadge{display:none;position:absolute;top:-3px;right:-3px;width:18px;height:18px;border-radius:50%;background:#ff4d4d;font-size:10px;font-weight:800;color:#fff;align-items:center;justify-content:center;}
  #btxSupportOverlay{display:none;position:fixed;inset:0;z-index:99991;background:rgba(0,0,0,.6);align-items:flex-end;justify-content:center;}
  #btxSupportSheet{width:100%;max-width:480px;height:90vh;background:#0a0a0a;border-radius:20px 20px 0 0;display:flex;flex-direction:column;overflow:hidden;transform:translateY(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);}
  #btxSupportSheet.btx-open{transform:translateY(0);}
  .btxHdr{display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:54px;border-bottom:1px solid #111;flex-shrink:0;}
  .btxHdrTitle{font-size:14px;font-weight:800;color:#fff;font-family:inherit;}
  .btxClose{background:none;border:none;color:#666;font-size:22px;cursor:pointer;padding:0;line-height:1;font-family:inherit;}
  .btxScroll{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;}
  /* Support home */
  .btxListCard{background:#111;border-radius:14px;overflow:hidden;border:1px solid #1e1e1e;margin:0 16px 12px;}
  .btxListRow{display:flex;align-items:center;gap:12px;padding:13px 14px;cursor:pointer;border-bottom:1px solid #1a1a1a;}
  .btxListRow:last-child{border-bottom:none;}
  .btxListRow:active{background:#161616;}
  .btxListText{flex:1;font-size:13px;color:#ddd;line-height:1.4;}
  .btxChevron{flex-shrink:0;}
  .btxGridWrap{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px 12px;}
  .btxGridCell{background:#111;border:1px solid #1e1e1e;border-radius:14px;padding:14px 12px;cursor:pointer;}
  .btxGridCell:active{background:#161616;}
  .btxGridIcon{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:8px;}
  .btxGridLabel{font-size:12px;font-weight:600;color:#ddd;line-height:1.35;}
  .btxSecHdr{display:flex;align-items:center;justify-content:space-between;padding:0 16px;margin-bottom:10px;}
  .btxSecTitle{font-size:13px;font-weight:700;color:#fff;}
  .btxSec{padding-top:16px;}
  .btxBottomBar{padding:12px 16px 20px;background:#0a0a0a;border-top:1px solid #111;flex-shrink:0;}
  .btxChatBtn{width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:14px;padding:15px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;color:#fff;font-size:14px;font-weight:700;font-family:inherit;}
  /* FAQ */
  .btxFaqItem{background:#111;border-radius:12px;margin:0 16px 8px;border:1px solid #1e1e1e;overflow:hidden;}
  .btxFaqQ{display:flex;align-items:center;justify-content:space-between;padding:13px 14px;cursor:pointer;font-size:13px;font-weight:600;color:#fff;gap:10px;font-family:inherit;background:none;border:none;width:100%;text-align:left;}
  .btxFaqA{display:none;padding:0 14px 13px;font-size:13px;color:#888;line-height:1.6;}
  .btxFaqItem.btxOpen .btxFaqA{display:block;}
  .btxFaqChev{flex-shrink:0;transition:transform .2s;}
  .btxFaqItem.btxOpen .btxFaqChev{transform:rotate(180deg);}
  /* Chat */
  .btxChatOuter{height:100%;display:flex;flex-direction:column;}
  .btxChatMsgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch;}
  .btxMsgUser{align-self:flex-end;max-width:76%;}
  .btxMsgAdmin{align-self:flex-start;max-width:76%;}
  .btxMsgUser .btxMsgText{background:${COLOR};color:#000;border-radius:18px 18px 4px 18px;padding:10px 14px;font-size:13px;font-weight:500;}
  .btxMsgAdmin .btxMsgText{background:#1e1e1e;color:#fff;border-radius:18px 18px 18px 4px;padding:10px 14px;font-size:13px;}
  .btxMsgMeta{font-size:10px;color:#555;margin-top:3px;padding:0 4px;}
  .btxMsgUser .btxMsgMeta{text-align:right;}
  .btxChipRow{display:flex;flex-wrap:wrap;gap:8px;padding:2px 0;}
  .btxChip{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:20px;padding:7px 14px;font-size:12px;color:#ccc;cursor:pointer;font-family:inherit;}
  .btxChip:active{background:#2a2a2a;}
  .btxAgentBar{display:flex;align-items:center;gap:12px;padding:12px 16px;background:#0f0f0f;border-top:1px solid #1a1a1a;flex-shrink:0;}
  .btxAgentInfo{flex:1;min-width:0;}
  .btxAgentName{font-size:13px;font-weight:700;color:#fff;}
  .btxAgentSub{font-size:11px;color:#666;}
  .btxConnectBtn{background:${COLOR};border:none;border-radius:20px;padding:8px 18px;font-size:13px;font-weight:800;color:#000;cursor:pointer;flex-shrink:0;font-family:inherit;}
  .btxInputBar{display:flex;align-items:flex-end;gap:8px;padding:10px 14px 16px;background:#0a0a0a;border-top:1px solid #111;flex-shrink:0;}
  .btxInput{flex:1;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:22px;padding:10px 16px;color:#fff;font-size:14px;resize:none;outline:none;min-height:40px;max-height:100px;font-family:inherit;line-height:1.4;}
  .btxInput:focus{border-color:${COLOR};}
  .btxSendBtn{width:40px;height:40px;border-radius:50%;background:${COLOR};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .btxTyping{align-self:flex-start;background:#1e1e1e;border-radius:18px 18px 18px 4px;padding:12px 16px;display:flex;gap:5px;align-items:center;}
  .btxTd{width:6px;height:6px;border-radius:50%;background:#555;animation:btxTda 1.2s ease-in-out infinite;}
  .btxTd:nth-child(2){animation-delay:.2s;} .btxTd:nth-child(3){animation-delay:.4s;}
  @keyframes btxTda{0%,80%,100%{transform:scale(.7);opacity:.4}40%{transform:scale(1.1);opacity:1}}
  .btxTs{text-align:center;font-size:11px;color:#444;padding:4px 0 8px;}
  /* Admin notif */
  #btxAdmNotif{display:none;position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:99995;background:#0f0f0f;border:1.5px solid ${COLOR};border-radius:14px;padding:12px 16px;min-width:240px;max-width:88vw;box-shadow:0 8px 32px rgba(0,0,0,.5);}
  .btxNotifInner{display:flex;align-items:center;gap:10px;}
  .btxNotifAv{width:36px;height:36px;border-radius:50%;background:#1a2e00;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
  .btxNotifInfo{flex:1;min-width:0;}
  .btxNotifTitle{font-size:13px;font-weight:700;color:#fff;}
  .btxNotifText{font-size:12px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .btxNotifReply{background:${COLOR};border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:800;color:#000;cursor:pointer;flex-shrink:0;font-family:inherit;}
  .btxNotifX{background:none;border:none;color:#666;font-size:18px;cursor:pointer;padding:0 0 0 4px;line-height:1;}
  /* Admin panel */
  .btxAdmTicket{padding:14px 16px;border-bottom:1px solid #111;cursor:pointer;display:flex;align-items:center;gap:12px;}
  .btxAdmTicket:active{background:#111;}
  .btxAdmAv{width:38px;height:38px;border-radius:50%;background:#1e2e00;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:${COLOR};flex-shrink:0;}
  .btxAdmInfo{flex:1;min-width:0;}
  .btxAdmName{font-size:13px;font-weight:700;color:#fff;}
  .btxAdmPrev{font-size:12px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .btxAdmBadge{font-size:10px;font-weight:700;background:${COLOR};color:#000;border-radius:6px;padding:2px 6px;}
  .btxAdmReplyBar{padding:10px 12px;border-top:1px solid #1a1a1a;display:flex;gap:8px;align-items:center;flex-shrink:0;}
  .btxAdmInput{flex:1;background:#1e1e1e;border:1.5px solid #2a2a2a;border-radius:20px;padding:10px 16px;color:#fff;font-size:14px;outline:none;font-family:inherit;}
  .btxAdmInput:focus{border-color:${COLOR};}
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ─── DATA HELPERS ────────────────────────────────────── */
  function spGet()     { try { return JSON.parse(localStorage.getItem(SP_KEY) || '[]'); } catch(e) { return []; } }
  function spSave(a)   { try { localStorage.setItem(SP_KEY, JSON.stringify(a)); } catch(e) {} }
  function spActiveId(){ return localStorage.getItem(SP_ACTIVE) || null; }
  function spSetActive(id){ id ? localStorage.setItem(SP_ACTIVE, id) : localStorage.removeItem(SP_ACTIVE); }
  function spTime(ts)  { return new Date(ts).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true}); }
  function spId()      { return 'btx_' + Date.now() + '_' + Math.random().toString(36).slice(2,6); }
  function esc(s)      { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }
  function admIsAdmin(){
    try {
      if (new URLSearchParams(window.location.search).get('btxadmin')==='1') { localStorage.setItem(ADM_KEY,'1'); return true; }
      return localStorage.getItem(ADM_KEY)==='1';
    } catch(e){ return false; }
  }

  function spEnsure() {
    let tid = spActiveId(), tickets = spGet(), t = tid ? tickets.find(x=>x.id===tid) : null;
    if (!t) {
      t = { id:spId(), userName:'Guest', userEmail:'guest', messages:[], status:'open', createdAt:Date.now(), unreadAdmin:0, agentConnected:false, agentRequested:false };
      try {
        // Try to get user info from page if available
        const u = window.btxUser || (typeof getStoredBitcovexUser==='function' ? getStoredBitcovexUser() : null);
        if (u) { t.userName = u.name || u.email || 'User'; t.userEmail = u.email || 'user'; }
      } catch(e){}
      tickets.push(t); spSave(tickets); spSetActive(t.id);
    }
    return t;
  }

  /* ─── BUILD HTML ──────────────────────────────────────── */
  const div = document.createElement('div');
  div.innerHTML = `
  <!-- FAB -->
  <button id="btxSupportFab" aria-label="Support Chat">
    <svg id="btxFabIcon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
    <div id="btxFabBadge"></div>
  </button>

  <!-- Admin notif -->
  <div id="btxAdmNotif">
    <div class="btxNotifInner">
      <div class="btxNotifAv">💬</div>
      <div class="btxNotifInfo">
        <div class="btxNotifTitle" id="btxNotifTitle">New Message</div>
        <div class="btxNotifText" id="btxNotifText">Customer sent a message</div>
      </div>
      <button class="btxNotifReply" onclick="window._btxAdmOpenNotif()">Reply</button>
      <button class="btxNotifX" onclick="document.getElementById('btxAdmNotif').style.display='none'">×</button>
    </div>
  </div>

  <!-- Main overlay -->
  <div id="btxSupportOverlay">
    <div id="btxSupportSheet">
      <!-- VIEW: Home (support center) -->
      <div id="btxViewHome" style="height:100%;display:flex;flex-direction:column;">
        <div class="btxHdr">
          <button class="btxClose" onclick="btxClose()">×</button>
          <span class="btxHdrTitle">BITCOVEX Support</span>
          <div style="width:32px;"></div>
        </div>
        <div class="btxScroll" style="padding-top:4px;padding-bottom:80px;">

          <div class="btxSec">
            <div class="btxSecHdr"><span class="btxSecTitle">📢 Announcements</span></div>
            <div class="btxListCard">
              <div class="btxListRow" onclick="btxGotoChat('P2P trading now supports BNB & XRP')">
                <div style="width:8px;height:8px;border-radius:50%;background:${COLOR};flex-shrink:0;margin-top:3px;"></div>
                <span class="btxListText">P2P trading now supports BNB &amp; XRP</span>
                <svg class="btxChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div class="btxListRow" onclick="btxGotoChat('Scheduled maintenance update')">
                <div style="width:8px;height:8px;border-radius:50%;background:#f59e0b;flex-shrink:0;margin-top:3px;"></div>
                <span class="btxListText">Scheduled maintenance on Apr 28, 02:00–04:00 UTC</span>
                <svg class="btxChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>

          <div class="btxSec">
            <div class="btxSecHdr"><span class="btxSecTitle">Top questions</span></div>
            <div class="btxListCard">
              <div class="btxListRow" onclick="btxGotoChat('I haven\'t received my crypto deposit')"><span class="btxListText">I haven't received my crypto deposit</span><svg class="btxChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>
              <div class="btxListRow" onclick="btxGotoChat('How to submit a withdrawal?')"><span class="btxListText">How to submit a withdrawal?</span><svg class="btxChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>
              <div class="btxListRow" onclick="btxGotoChat('Verification code not received on SMS')"><span class="btxListText">Verification code not received – SMS</span><svg class="btxChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>
              <div class="btxListRow" onclick="btxGotoChat('Verification code not received on email')"><span class="btxListText">Verification code not received – Email</span><svg class="btxChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>
              <div class="btxListRow" onclick="btxGotoChat('I didn\'t receive my rewards')"><span class="btxListText">I didn't receive my rewards</span><svg class="btxChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>
            </div>
          </div>

          <div class="btxSec">
            <div class="btxSecHdr"><span class="btxSecTitle">Self-service</span><span style="font-size:12px;color:#555;cursor:pointer;" onclick="btxShowView('btxViewChat')">View all ›</span></div>
            <div class="btxGridWrap">
              <div class="btxGridCell" onclick="btxGotoChat('Crypto deposit not credited')"><div class="btxGridIcon" style="background:#2a0a0a;">🚫</div><div class="btxGridLabel">Crypto deposit not credited</div></div>
              <div class="btxGridCell" onclick="btxGotoChat('P2P order dispute help')"><div class="btxGridIcon" style="background:#1a1500;">⚖️</div><div class="btxGridLabel">P2P order disputes</div></div>
              <div class="btxGridCell" onclick="btxGotoChat('KYC verification issue')"><div class="btxGridIcon" style="background:#001520;">🪪</div><div class="btxGridLabel">KYC &amp; Identity</div></div>
              <div class="btxGridCell" onclick="btxGotoChat('Account security issue')"><div class="btxGridIcon" style="background:#0a0a20;">🔐</div><div class="btxGridLabel">Account &amp; Security</div></div>
            </div>
          </div>

          <div class="btxSec" style="padding:0 0 8px;">
            <div class="btxSecHdr" style="padding-bottom:8px;"><span class="btxSecTitle">FAQ</span></div>
            <div class="btxFaqItem"><button class="btxFaqQ" onclick="btxFaqToggle(this)"><span>How do I deposit crypto?</span><svg class="btxFaqChev" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button><div class="btxFaqA">Go to Wallet → Deposit → select coin → copy address → send from external wallet. Takes 1–30 min.</div></div>
            <div class="btxFaqItem"><button class="btxFaqQ" onclick="btxFaqToggle(this)"><span>My P2P order is stuck</span><svg class="btxFaqChev" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button><div class="btxFaqA">If payment done but not released, use the Appeal button inside the order. Team reviews within 24h. Do NOT cancel after paying.</div></div>
            <div class="btxFaqItem"><button class="btxFaqQ" onclick="btxFaqToggle(this)"><span>How long does KYC take?</span><svg class="btxFaqChev" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button><div class="btxFaqA">KYC reviewed in 24–48 hours. Ensure docs are clear, valid, and name matches your account.</div></div>
            <div class="btxFaqItem"><button class="btxFaqQ" onclick="btxFaqToggle(this)"><span>How do I reset my password?</span><svg class="btxFaqChev" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button><div class="btxFaqA">Login page → Forgot Password → enter your email → click reset link (check spam too).</div></div>
            <div class="btxFaqItem"><button class="btxFaqQ" onclick="btxFaqToggle(this)"><span>P2P payment methods accepted?</span><svg class="btxFaqChev" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button><div class="btxFaqA">UPI, PhonePe, Google Pay, Paytm, IMPS, NEFT, Bank Transfer — shown on each ad card.</div></div>
          </div>
        </div>
        <div class="btxBottomBar">
          <button class="btxChatBtn" onclick="btxShowView('btxViewChat')">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="${COLOR}" stroke-width="2.5" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Chat with us
          </button>
        </div>
      </div>

      <!-- VIEW: Chat -->
      <div id="btxViewChat" style="display:none;height:100%;flex-direction:column;">
        <div class="btxHdr">
          <button class="btxClose" onclick="btxShowView('btxViewHome')" style="font-size:26px;padding-right:4px;">‹</button>
          <div style="display:flex;flex-direction:column;align-items:center;gap:1px;">
            <div style="display:flex;align-items:center;gap:6px;"><span id="btxChatAv" style="font-size:18px;">🤖</span><span style="font-size:14px;font-weight:800;color:#fff;">BITCOVEX Support</span></div>
            <div id="btxChatStatus" style="font-size:11px;color:#888;">Bot Assistant</div>
          </div>
          <button class="btxClose" onclick="btxClose()">×</button>
        </div>
        <div id="btxChatMsgs" class="btxChatMsgs"></div>
        <!-- Agent bar -->
        <div id="btxAgentBar" class="btxAgentBar">
          <div style="font-size:22px;">🎧</div>
          <div class="btxAgentInfo"><div class="btxAgentName">Talk to a Live Agent</div><div class="btxAgentSub" id="btxAgentSub">Avg. response time: ~2 min</div></div>
          <button class="btxConnectBtn" id="btxConnBtn" onclick="btxRequestAgent()">Connect</button>
        </div>
        <div class="btxInputBar">
          <textarea class="btxInput" id="btxChatInput" placeholder="Type your message..." rows="1"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();btxSendMsg();}"
            oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,100)+'px'"></textarea>
          <button class="btxSendBtn" onclick="btxSendMsg()">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      <!-- VIEW: Admin inbox -->
      <div id="btxViewAdmin" style="display:none;height:100%;flex-direction:column;">
        <div class="btxHdr">
          <div style="width:32px;"></div>
          <span class="btxHdrTitle">🎧 Support Inbox</span>
          <button class="btxClose" onclick="btxClose()">×</button>
        </div>
        <div id="btxAdmList" class="btxScroll"></div>
      </div>

      <!-- VIEW: Admin chat reply -->
      <div id="btxViewAdminChat" style="display:none;height:100%;flex-direction:column;">
        <div class="btxHdr">
          <button class="btxClose" onclick="btxShowView('btxViewAdmin')" style="font-size:26px;">‹</button>
          <div style="flex:1;text-align:center;"><div style="font-size:14px;font-weight:700;color:#fff;" id="btxAdmChatName">Customer</div><div style="font-size:11px;color:#555;" id="btxAdmChatSub"></div></div>
          <button class="btxClose" onclick="btxClose()">×</button>
        </div>
        <div id="btxAdmChatMsgs" class="btxChatMsgs"></div>
        <div class="btxAdmReplyBar">
          <input class="btxAdmInput" id="btxAdmInput" placeholder="Reply as Admin..." onkeydown="if(event.key==='Enter')btxAdmSend()">
          <button class="btxSendBtn" onclick="btxAdmSend()" style="width:36px;height:36px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>`;

  document.body.appendChild(div);

  /* ─── STATE ───────────────────────────────────────────── */
  let _pollTimer = null, _lastCount = 0, _admTid = null, _admNotifTimer = null;

  /* ─── VIEW SWITCHING ──────────────────────────────────── */
  function btxShowView(viewId) {
    ['btxViewHome','btxViewChat','btxViewAdmin','btxViewAdminChat'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = el.id === viewId ? 'flex' : 'none';
    });
    if (viewId === 'btxViewChat') btxLoadChat();
    if (viewId === 'btxViewAdmin') btxAdmRenderList();
  }
  window.btxShowView = btxShowView;

  /* ─── OPEN / CLOSE ────────────────────────────────────── */
  function btxOpen() {
    const overlay = document.getElementById('btxSupportOverlay');
    const sheet   = document.getElementById('btxSupportSheet');
    if (!overlay || !sheet) return;
    overlay.style.display = 'flex';
    requestAnimationFrame(() => sheet.classList.add('btx-open'));
    if (admIsAdmin()) { btxShowView('btxViewAdmin'); } else { btxShowView('btxViewHome'); }
  }
  function btxClose() {
    const sheet = document.getElementById('btxSupportSheet');
    if (sheet) sheet.classList.remove('btx-open');
    setTimeout(() => {
      const overlay = document.getElementById('btxSupportOverlay');
      if (overlay) overlay.style.display = 'none';
    }, 300);
    if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null; }
  }
  window.btxClose = btxClose;

  document.getElementById('btxSupportFab').addEventListener('click', btxOpen);
  document.getElementById('btxSupportOverlay').addEventListener('click', function(e) {
    if (e.target === this) btxClose();
  });

  /* ─── FAQ TOGGLE ──────────────────────────────────────── */
  function btxFaqToggle(btn) {
    const item = btn.closest('.btxFaqItem');
    if (item) item.classList.toggle('btxOpen');
  }
  window.btxFaqToggle = btxFaqToggle;

  /* ─── GO TO CHAT WITH PRE-FILLED Q ───────────────────── */
  function btxGotoChat(q) {
    btxShowView('btxViewChat');
    setTimeout(() => {
      const inp = document.getElementById('btxChatInput');
      if (inp) { inp.value = q; btxSendMsg(); }
    }, 100);
  }
  window.btxGotoChat = btxGotoChat;

  /* ─── SCROLL ──────────────────────────────────────────── */
  function btxScroll(el) {
    if (!el) return;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight + 9999; });
  }

  /* ─── RENDER MESSAGES ─────────────────────────────────── */
  function btxRenderMsgs(msgs, wrap, tName) {
    if (!wrap) return;
    wrap.innerHTML = msgs.map(m => `
      <div class="${m.from==='user'?'btxMsgUser':'btxMsgAdmin'}">
        <div class="btxMsgText">${esc(m.text)}</div>
        <div class="btxMsgMeta">${m.from==='user'?'You':(m.from==='bot'?'🤖 Bot':'🎧 Admin')} · ${spTime(m.ts)}</div>
      </div>`).join('');
    btxScroll(wrap);
  }

  /* ─── TYPING INDICATOR ────────────────────────────────── */
  function btxShowTyping(wrap) {
    const d = document.createElement('div'); d.className='btxTyping'; d.id='btxTyping';
    d.innerHTML='<div class="btxTd"></div><div class="btxTd"></div><div class="btxTd"></div>';
    wrap.appendChild(d); btxScroll(wrap);
  }
  function btxHideTyping(wrap) { const el=document.getElementById('btxTyping'); if(el)el.remove(); btxScroll(wrap); }

  /* ─── LOAD CHAT ───────────────────────────────────────── */
  function btxLoadChat() {
    const ticket = spEnsure();
    const wrap   = document.getElementById('btxChatMsgs');
    if (!wrap) return;
    if (!ticket.messages.length) {
      wrap.innerHTML = `
        <div class="btxTs">Just now</div>
        <div class="btxMsgAdmin">
          <div class="btxMsgText">👋 Hey Bitcovex user!<br>I'm Bunz Support. Select a topic or connect to a live agent.</div>
          <div class="btxMsgMeta">🤖 Bot · just now</div>
        </div>
        <div class="btxChipRow">
          <button class="btxChip" onclick="btxGotoChat('Account security issue')">Account &amp; security</button>
          <button class="btxChip" onclick="btxGotoChat('Deposit or withdrawal issue')">Deposit &amp; withdrawal</button>
          <button class="btxChip" onclick="btxGotoChat('P2P order help')">P2P</button>
          <button class="btxChip" onclick="btxGotoChat('KYC verification issue')">Identity verification</button>
          <button class="btxChip" onclick="btxGotoChat('Rewards not received')">Promotion &amp; bonus</button>
        </div>`;
    } else {
      btxRenderMsgs(ticket.messages, wrap);
    }
    btxScroll(wrap);
    btxUpdateAgentBar(ticket);
    btxUpdateTopbar(ticket);
    _lastCount = ticket.messages.length;
    btxStartPoll();
  }

  /* ─── TOPBAR UPDATE ───────────────────────────────────── */
  function btxUpdateTopbar(t) {
    const av  = document.getElementById('btxChatAv');
    const st  = document.getElementById('btxChatStatus');
    if (t && t.agentConnected) {
      if (av) av.textContent='🎧';
      if (st) { st.textContent='● Live Agent Connected'; st.style.color=COLOR; }
    } else if (t && t.agentRequested) {
      if (av) av.textContent='⏳';
      if (st) { st.textContent='Connecting to agent...'; st.style.color='#f59e0b'; }
    } else {
      if (av) av.textContent='🤖';
      if (st) { st.textContent='Bot Assistant'; st.style.color='#888'; }
    }
  }

  /* ─── AGENT BAR UPDATE ────────────────────────────────── */
  function btxUpdateAgentBar(t) {
    const btn = document.getElementById('btxConnBtn');
    const sub = document.getElementById('btxAgentSub');
    if (t && t.agentConnected) {
      if (btn) { btn.textContent='● Live'; btn.disabled=true; }
      if (sub) sub.textContent='Connected to live agent';
    } else if (t && t.agentRequested) {
      if (btn) { btn.textContent='Connecting…'; btn.disabled=true; btn.style.background='#f59e0b'; }
      if (sub) sub.textContent='Agent will join shortly';
    } else {
      if (btn) { btn.textContent='Connect'; btn.disabled=false; btn.style.background=COLOR; }
      if (sub) sub.textContent='Avg. response time: ~2 min';
    }
  }

  /* ─── REQUEST LIVE AGENT ──────────────────────────────── */
  function btxRequestAgent() {
    const ticket = spEnsure();
    ticket.agentRequested = true;
    ticket.unreadAdmin = (ticket.unreadAdmin||0)+1;
    ticket.messages.push({ from:'bot', text:'🎧 Connecting you to a live support agent... Please hold on.', ts:Date.now() });
    const tickets=spGet(), idx=tickets.findIndex(x=>x.id===ticket.id);
    if(idx>=0)tickets[idx]=ticket; else tickets.push(ticket);
    spSave(tickets);
    const wrap=document.getElementById('btxChatMsgs');
    btxRenderMsgs(ticket.messages,wrap);
    btxUpdateAgentBar(ticket); btxUpdateTopbar(ticket);
    btxAdmUpdateBadge();
    btxAdmShowNotif(ticket,'🎧 Live agent requested by '+(ticket.userName||'Guest'));
  }
  window.btxRequestAgent = btxRequestAgent;

  /* ─── SEND MESSAGE ────────────────────────────────────── */
  function btxSendMsg() {
    const inp  = document.getElementById('btxChatInput');
    if (!inp) return;
    const text = inp.value.trim(); if (!text) return;
    inp.value=''; inp.style.height='auto';
    const ticket=spEnsure();
    ticket.messages.push({from:'user',text,ts:Date.now()});
    ticket.unreadAdmin=(ticket.unreadAdmin||0)+1;
    const tickets=spGet(), idx=tickets.findIndex(x=>x.id===ticket.id);
    if(idx>=0)tickets[idx]=ticket; else tickets.push(ticket);
    spSave(tickets);
    const wrap=document.getElementById('btxChatMsgs');
    btxRenderMsgs(ticket.messages,wrap);
    btxAdmUpdateBadge();
    btxAdmShowNotif(ticket,text);
    if(!ticket.agentConnected) btxBotReply(ticket,text);
  }
  window.btxSendMsg = btxSendMsg;

  /* ─── BOT REPLY ───────────────────────────────────────── */
  function btxBotReply(ticket,txt) {
    const wrap=document.getElementById('btxChatMsgs');
    if(wrap) btxShowTyping(wrap);
    const lc=txt.toLowerCase();
    let r='';
    if(/deposit|crypto|coin|btc|usdt|eth|xrp|bnb|not received|haven.t received/.test(lc)) r='💰 For deposit issues:\n1. Go to Wallet → Deposit\n2. Select coin & network\n3. Paste address in your external wallet\n\nTakes 1–30 min. Share your TxID if it\'s been over 1 hour.';
    else if(/p2p|order stuck|not released|payment done|seller|buyer|dispute/.test(lc)) r='⚠️ For P2P issues:\nIf payment is done but USDT not released, tap Appeal inside the order. Team reviews within 24h. Never cancel after paying — your funds are in escrow.';
    else if(/kyc|verify|identity|document/.test(lc)) r='🪪 KYC tips:\n• Photo must be clear & not expired\n• Name must match your account\n• Review takes 24–48 hours\n\nStill pending? Tap "Connect" to reach a live agent.';
    else if(/password|forgot|login|can.t login|access/.test(lc)) r='🔑 Password reset:\n1. Go to Login page\n2. Tap Forgot Password\n3. Enter your registered email\n4. Click the link in your inbox (check spam too)';
    else if(/withdraw|withdrawal/.test(lc)) r='📤 Withdrawals process within 24h. Check Wallet → History for status. For large amounts, extra verification may be needed.';
    else if(/fee|charge|cost/.test(lc)) r='💸 P2P buying is 0 fee. Sellers set their own rates. Crypto withdrawals show a network fee before you confirm.';
    else if(/reward|bonus|promotion/.test(lc)) r='🎁 Rewards are credited within 24–48 hours of qualifying. Check Rewards section in your account. If missing after 48h, connect to a live agent.';
    else if(/hi|hello|hey|namaste/.test(lc)) r='👋 Hi there! How can I help you today? Use the chips below or type your question.';
    else r='🤔 I\'m not sure about that, but a live agent can help!\n\nOr try asking about:\n• P2P orders & disputes\n• Crypto deposits & withdrawals\n• KYC verification\n• Account & password issues';
    setTimeout(()=>{
      btxHideTyping(wrap);
      ticket.messages.push({from:'bot',text:r,ts:Date.now()});
      const ts2=spGet(), idx2=ts2.findIndex(x=>x.id===ticket.id);
      if(idx2>=0)ts2[idx2]=ticket; else ts2.push(ticket);
      spSave(ts2);
      if(wrap) btxRenderMsgs(ticket.messages,wrap);
    },1200+Math.random()*500);
  }

  /* ─── POLLING (same-tab refresh) ─────────────────────── */
  function btxStartPoll() {
    if(_pollTimer) clearInterval(_pollTimer);
    _pollTimer=setInterval(()=>{
      const cv=document.getElementById('btxViewChat');
      if(!cv || cv.style.display==='none') return;
      const tid=spActiveId(); if(!tid) return;
      const t=spGet().find(x=>x.id===tid); if(!t) return;
      if(t.messages.length!==_lastCount) {
        _lastCount=t.messages.length;
        btxRenderMsgs(t.messages,document.getElementById('btxChatMsgs'));
        btxUpdateTopbar(t); btxUpdateAgentBar(t);
      }
    },1500);
  }

  /* ─── CROSS-TAB STORAGE SYNC ──────────────────────────── */
  window.addEventListener('storage',function(e){
    if(e.key!==SP_KEY) return;
    // Customer side
    const cv=document.getElementById('btxViewChat');
    if(cv && cv.style.display!=='none') {
      const tid=spActiveId(); if(!tid) return;
      const t=spGet().find(x=>x.id===tid); if(!t) return;
      btxRenderMsgs(t.messages,document.getElementById('btxChatMsgs'));
      btxUpdateTopbar(t); btxUpdateAgentBar(t);
    }
    // Admin side
    if(admIsAdmin()) {
      btxAdmUpdateBadge();
      if(_admTid) { const t=spGet().find(x=>x.id===_admTid); if(t) btxAdmRenderChat(t); }
    }
  });

  /* ═══════════ ADMIN PANEL ════════════════════════════════ */
  function btxAdmUpdateBadge() {
    const fab=document.getElementById('btxSupportFab');
    if(!admIsAdmin()) return;
    // Change FAB color to indicate admin mode
    if(fab) fab.style.background='#ff4d4d';
    const total=spGet().reduce((s,t)=>s+(t.unreadAdmin||0),0);
    const badge=document.getElementById('btxFabBadge');
    if(badge){ badge.textContent=total>9?'9+':String(total); badge.style.display=total>0?'flex':'none'; }
  }

  function btxAdmShowNotif(ticket,msg) {
    if(!admIsAdmin()) return;
    const notif=document.getElementById('btxAdmNotif'); if(!notif) return;
    document.getElementById('btxNotifTitle').textContent='💬 '+(ticket.userName||'Guest');
    document.getElementById('btxNotifText').textContent=msg.length>50?msg.slice(0,50)+'…':msg;
    notif._tid=ticket.id; notif.style.display='block';
    clearTimeout(_admNotifTimer);
    _admNotifTimer=setTimeout(()=>{ notif.style.display='none'; },8000);
  }

  window._btxAdmOpenNotif=function(){
    const notif=document.getElementById('btxAdmNotif'); if(notif) notif.style.display='none';
    btxOpen();
    setTimeout(()=>{
      btxShowView('btxViewAdmin');
      if(notif&&notif._tid) setTimeout(()=>btxAdmOpenTicket(notif._tid),100);
    },350);
  };

  function btxAdmRenderList() {
    const list=document.getElementById('btxAdmList'); if(!list) return;
    const tickets=spGet();
    if(!tickets.length){list.innerHTML='<div style="padding:40px;text-align:center;color:#555;font-size:13px;">No support tickets yet</div>';return;}
    const sorted=[...tickets].sort((a,b)=>b.createdAt-a.createdAt);
    list.innerHTML=sorted.map(t=>{
      const last=t.messages[t.messages.length-1];
      const prev=last?last.text.substring(0,46)+(last.text.length>46?'…':''):'No messages';
      const ini=(t.userName||'U')[0].toUpperCase();
      const unread=t.unreadAdmin||0;
      const tag=t.agentConnected?`<span style="font-size:9px;background:${COLOR};color:#000;border-radius:4px;padding:1px 5px;font-weight:800;">LIVE</span>`:t.agentRequested?'<span style="font-size:9px;background:#f59e0b;color:#000;border-radius:4px;padding:1px 5px;font-weight:800;">REQ</span>':'';
      return `<div class="btxAdmTicket" onclick="window._btxAdmOpenTid('${t.id}')">
        <div class="btxAdmAv">${ini}</div>
        <div class="btxAdmInfo"><div class="btxAdmName" style="display:flex;align-items:center;gap:6px;">${esc(t.userName||'Guest')} ${tag}</div><div class="btxAdmPrev">${esc(prev)}</div></div>
        ${unread>0?`<div class="btxAdmBadge">${unread}</div>`:'<div style="font-size:10px;color:#444;">'+(t.status||'open')+'</div>'}
      </div>`;
    }).join('');
  }

  function btxAdmOpenTicket(tid) {
    _admTid=tid;
    const tickets=spGet(), t=tickets.find(x=>x.id===tid); if(!t) return;
    t.unreadAdmin=0; t.agentConnected=true;
    const idx=tickets.findIndex(x=>x.id===tid); if(idx>=0) tickets[idx]=t;
    spSave(tickets); btxAdmUpdateBadge();
    document.getElementById('btxAdmChatName').textContent=(t.userName||'Guest')+(t.agentRequested?' 🎧':'');
    document.getElementById('btxAdmChatSub').textContent=t.userEmail||tid;
    btxShowView('btxViewAdminChat');
    btxAdmRenderChat(t);
  }
  window._btxAdmOpenTid=btxAdmOpenTicket;

  function btxAdmRenderChat(t) {
    const wrap=document.getElementById('btxAdmChatMsgs'); if(!wrap) return;
    if(!t.messages.length){wrap.innerHTML='<div style="padding:24px;text-align:center;color:#555;font-size:13px;">No messages yet</div>';return;}
    wrap.innerHTML=t.messages.map(m=>`
      <div class="${m.from==='user'?'btxMsgUser':'btxMsgAdmin'}">
        <div class="btxMsgText">${esc(m.text)}</div>
        <div class="btxMsgMeta">${m.from==='user'?(t.userName||'User'):(m.from==='bot'?'🤖 Bot':'🎧 You')} · ${spTime(m.ts)}</div>
      </div>`).join('');
    btxScroll(wrap);
  }

  function btxAdmSend() {
    const inp=document.getElementById('btxAdmInput'); if(!inp||!_admTid) return;
    const text=inp.value.trim(); if(!text) return; inp.value='';
    const tickets=spGet(), t=tickets.find(x=>x.id===_admTid); if(!t) return;
    t.agentConnected=true;
    t.messages.push({from:'admin',text,ts:Date.now()});
    const idx=tickets.findIndex(x=>x.id===_admTid); if(idx>=0) tickets[idx]=t;
    spSave(tickets); btxAdmRenderChat(t);
  }
  window.btxAdmSend=btxAdmSend;

  /* ─── INIT ────────────────────────────────────────────── */
  if(admIsAdmin()) btxAdmUpdateBadge();

  setInterval(()=>{
    if(admIsAdmin()) {
      btxAdmUpdateBadge();
      const av=document.getElementById('btxViewAdminChat');
      if(av && av.style.display!=='none' && _admTid) {
        const t=spGet().find(x=>x.id===_admTid); if(t) btxAdmRenderChat(t);
      }
    }
  },2000);

})();
