// Working login/register form wired to the Bitegit backend.
// Replaces the (JS-stripped, non-functional) Bitbase auth card with a clean
// form that calls /auth/login and /auth/register, stores the token, redirects.
(function () {
  const isRegister = /register/i.test(location.pathname);

  function mountPoint() {
    const h = [...document.querySelectorAll('h1, h2')].find((e) => /^(Login|Register|Sign\s*up)/i.test((e.textContent || '').trim()));
    if (!h) return null;
    let c = h;
    for (let i = 0; i < 5 && c.parentElement; i++) {
      if (/max-w-\[400px\]|max-w-\[400/.test(c.parentElement.className || '')) return c.parentElement;
      c = c.parentElement;
    }
    return h.parentElement;
  }

  const IN = 'width:100%;box-sizing:border-box;background:#1e2026;border:1px solid #2b3139;border-radius:10px;padding:13px 14px;color:#eaecef;font-size:15px;outline:none';
  const BTN = 'width:100%;box-sizing:border-box;background:#f0b90b;color:#1a1a1a;font-weight:700;border:none;border-radius:10px;padding:14px;font-size:15px;cursor:pointer';
  const SBTN = 'background:#2b3139;color:#eaecef;border:none;border-radius:10px;padding:0 14px;font-size:13px;cursor:pointer;white-space:nowrap';

  async function post(path, body) {
    const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    return { r, d };
  }

  function build() {
    const mount = mountPoint();
    if (!mount) return false;
    const reg = isRegister;
    mount.style.maxWidth = '400px';
    mount.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px;width:100%;font-family:inherit">
        <h1 style="font-size:30px;font-weight:700;color:#fff;margin:0 0 4px">${reg ? 'Register' : 'Login'}</h1>
        <input id="cvxEmail" type="email" placeholder="Email" autocomplete="email" style="${IN}"/>
        <input id="cvxPass" type="password" placeholder="Password (6+ chars)" style="${IN}"/>
        <button id="cvxSubmit" type="button" style="${BTN}">${reg ? 'Create account' : 'Log in'}</button>
        <div id="cvxMsg" style="font-size:13px;min-height:18px;line-height:1.4"></div>
        <div style="color:#848e9c;font-size:13px">${reg ? "Already have an account? <a href='login.html' style='color:#f0b90b;text-decoration:none'>Login</a>" : "Don't have an account? <a href='register.html' style='color:#f0b90b;text-decoration:none'>Register</a>"}</div>
      </div>`;

    const msg = document.getElementById('cvxMsg');
    const setMsg = (t, ok) => { msg.textContent = t; msg.style.color = ok ? '#2ebd85' : '#f6465d'; };
    const val = (id) => (document.getElementById(id).value || '').trim();

    document.getElementById('cvxSubmit').onclick = async () => {
      const email = val('cvxEmail').toLowerCase();
      const password = val('cvxPass');
      if (!/.+@.+\..+/.test(email)) return setMsg('Enter a valid email');
      if (password.length < 6) return setMsg('Password must be 6+ characters');
      setMsg(reg ? 'Creating account...' : 'Logging in...', true);
      // MongoDB-based P2P auth: logs in existing user, auto-creates if new
      try {
        const { r, d } = await post('/api/p2p/login', { email, password });
        if (!r.ok) return setMsg(d.message || 'Failed. Please try again.');
        const tok = d.accessToken || d.token;
        if (tok) localStorage.setItem('bitegit_token', tok);
        if (d.refreshToken) localStorage.setItem('bitegit_refresh_token', d.refreshToken);
        if (d.user) localStorage.setItem('bitegit_user', JSON.stringify(d.user));
        setMsg('Success! Redirecting...', true);
        setTimeout(() => { location.href = 'index.html'; }, 700);
      } catch (e) { setMsg('Network error. Try again.'); }
    };
    return true;
  }

  let n = 0;
  const iv = setInterval(() => { if (build() || ++n > 40) clearInterval(iv); }, 250);
  if (document.readyState !== 'loading') build();
})();
