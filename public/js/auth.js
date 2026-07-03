// Wire Bitbase's OWN login/register UI to the Bitcovex backend.
// Reuses the page's native input/button components (no custom UI):
// clones the email field to make a matching password field, then wires the
// existing submit button to /api/p2p/login (Mongo auth, auto-registers).
(function () {
  const emailInput = () => document.querySelector('input[placeholder*="Email" i], input[placeholder*="email" i]');

  function fieldGroup(input) {
    let el = input;
    for (let i = 0; i < 7 && el.parentElement; i++) {
      el = el.parentElement;
      if (/flex-col/.test(el.className || '') && el.querySelectorAll('input').length === 1) return el;
    }
    return input.closest('div') || input.parentElement;
  }

  function submitButton() {
    return [...document.querySelectorAll('button, [data-slot="button"], [type="button"]')]
      .find((b) => /^(Next Step|Log ?in|Login|Sign ?up|Continue|Register|Create)/i.test((b.textContent || '').trim()) && b.querySelectorAll('input').length === 0);
  }

  async function post(path, body) {
    const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    return { r, d };
  }

  function build() {
    const ei = emailInput();
    if (!ei) return false;
    if (document.getElementById('cvxPass')) return true;

    const grp = fieldGroup(ei);
    // clone the whole field group to get an identical, Bitbase-styled password field
    const pgrp = grp.cloneNode(true);
    const pin = pgrp.querySelector('input');
    if (!pin) return false;
    pin.type = 'password';
    pin.placeholder = 'Password';
    pin.value = '';
    pin.id = 'cvxPass';
    pin.removeAttribute('autofocus');
    pin.removeAttribute('value');
    // relabel any "Email/Phone" text inside the cloned group to "Password"
    pgrp.querySelectorAll('*').forEach((n) => {
      if (n.children.length === 0 && /Email|Phone/i.test(n.textContent)) n.textContent = 'Password';
    });
    grp.parentElement.insertBefore(pgrp, grp.nextSibling);

    // message line (uses page text styling)
    let msg = document.getElementById('cvxMsg');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'cvxMsg';
      msg.style.cssText = 'font-size:13px;min-height:18px;margin-top:6px;line-height:1.4';
      pgrp.parentElement.insertBefore(msg, pgrp.nextSibling);
    }
    const setMsg = (t, ok) => { msg.textContent = t; msg.style.color = ok ? '#2ebd85' : '#f6465d'; };

    // enable + wire the page's own submit button
    const btn = submitButton();
    if (!btn) return false;
    btn.disabled = false;
    btn.removeAttribute('disabled');
    btn.classList.remove('disabled:bg-bg_disable');

    async function go(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const email = (ei.value || '').trim().toLowerCase();
      const password = (pin.value || '').trim();
      if (!/.+@.+\..+/.test(email) && !/^\d{6,}$/.test(email)) return setMsg('Enter a valid email');
      if (password.length < 6) return setMsg('Password must be 6+ characters');
      setMsg('Please wait...', true);
      try {
        const { r, d } = await post('/api/p2p/login', { email, password });
        if (!r.ok) return setMsg(d.message || 'Login failed. Try again.');
        const tok = d.accessToken || d.token;
        if (tok) localStorage.setItem('bitcovex_token', tok);
        if (d.refreshToken) localStorage.setItem('bitcovex_refresh_token', d.refreshToken);
        if (d.user) localStorage.setItem('bitcovex_user', JSON.stringify(d.user));
        setMsg('Success! Redirecting...', true);
        setTimeout(() => { location.href = 'index.html'; }, 700);
      } catch (err) { setMsg('Network error. Try again.'); }
    }
    btn.addEventListener('click', go, true);
    pin.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(e); });
    ei.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); pin.focus(); } });
    return true;
  }

  let n = 0;
  const iv = setInterval(() => { if (build() || ++n > 60) clearInterval(iv); }, 250);
  if (document.readyState !== 'loading') build();
})();
