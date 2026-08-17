// P2P Email Service
const nodemailer = require('nodemailer');

const SOCIAL_ICONS = {
  playstore: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABAQAAAQEBn5eVwwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQYSURBVFiFtZZtTJtlFIbv8xYopQMKOMWJTgkfkihEt6FxCGSJ0ejMhsbslyhLlH8uKB9GZRKzhI8fy1CDsKGykalLVGpkAZVIW7CO0hDGZtTKYHw4QLZSi23f1vIef0CzDktbaHv+vMlz7vu5rzx5nryHAGBXG0cr4+vfSFAYagC4QPxJFFOjukRtQYSLAODeluWjAqSj6dtr9bFR04+v9cxM3GRbSmrWlHWIkQIQ1igOMgTZlcVjex2uzP61XjIxNWxTWUzPdB18ta6uTogYAIC41Q8JEzdqi23iA1ovzd0EtBnzRg3Pfl2yL9wABAD3tSz/BiDbu5GW3KxJlBuLfXj6wFTZ/VzXxYgCAMBdqpNalWKgyIdPIsJXMka1ukR9NWIAqxDtWpVCW+jRrisHMb0vI27Y6osJCAAAqQnndCnK7gLcvDPry8zETVKM60TP0z3OzQAEdbPnrYcK562Hfgbg3kCSTEwNMqfctF99oBTs87R8VlAn4KkUZa8+NeFsPoCoANJhANXdJWpNoD039bZv2J56bN5aNgrAFUC6B0D/S988+RlrY3LCBrAKsW/3n0vlYwAc/nQqwXW9LXFwF0CXWRdzhnVxd4YFAAAsYsHuGfPrJgZsvvopgvhXe2K/RU7uLAACmF4Er4yzNraBLyAhZAAAsDofyps2V14B07L3eirZr32s0opykjLWWeIAroFTbmJd7MshAwDAP8683Enz27MMMgNAmmCbbU3SQQbpHj+2O8D8qQci5B+M3ZWdM2V+ZzEjyjbaohqIloF3BGVk6ZWwAABAxpwb77VaCX9HbXq/kAEevn7p107Na9sFkfPsH+Y42RwzF2T0yZABChYMYx2aijRiTgYArFCaveV+lhZjZ/zYFkBURkXi6ZAAiuf0F1sG30on4vhbGhLtcLRly6U5xfg6ix2gRsidWVQodngWtwSwf+p74wf62iwCb/MpkHC741SmSppVmgBIIO6ETJZJReKb9Cis3tJNA7ww+a2x3tiYC0DhX0m3OTrTR0D8IBW6SqnAfs2XKtBP5ZYq/eNLfdXYR3sARAeQDjMJ1fG9Bg16/QuDBjj8++c/VVxufySAZxqEWmWfoZMADmbfoAAqLp0aOGz6Yi/8DCRgNCnl5hPUM76pgSQgQN3Ice3zk+c3GslcALX+u+J8N0kzuqWRzC/AMWOT9sDUdxsOpYJbqFZoLlzdSnBAgONDdZonZgeK/9+hPghSlfKH4dFQgjcEIGZuH6jW5S+OrA//hQg1yr6h8+EI9pTnUtnXwqUzuiPa/MUR72OfIaJyZfLOPGWfIazhgOcECF0ySco992O5PtsyUby2tgQJjUoprpk0GhEYCnf2TYCdC9vqj0xWubMtE5UAFgCcdosxDarBwaWIpHrVf5pBmHKycXKHAAAAAElFTkSuQmCC',
  appstore: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM2SURBVFiFxZffSxxXFMc/986uu+s2NdBSjbq4aK2RpFKQNiEkoY8FxVby0kdfpX0RA6W1pRgiitgaCiWEBvoPFBSJICEvrYFCK5aSFmOqW2xD1VbTyq6uP3bm5OFunKTurjMrMV8YuD/OzPncH+fMvUpEeCT1HY1YdCK8DrwGhNlPi2v7mqAAS6cIWPNoq0daQuO7XSKCAsVtuoA+T079AvwfJhwco7W0XcDRAFnnn/l2XowESO+0cWNjxPB8K41opot27ncGHkkBkXCrxqKzaOcHkQCO3aezG+7ZKGPXacxu96XqELS/AGENZUG43Big+aj2D2A7zykmH4tDDypRMNMMtWH4IQlxWSeiHGwUsVs2qYw/Bt/YNhALmfIbRyCiHAAshG3H79eKARD4enlv+9ymdTgAAB8vQMp+rEEp3p3yOfcHAagsgVLLrU+saO6lfG2lgwFcqXVfzKDpmN7hvbg6HIALL8KbZW59KCGcOqroP654u9w/hC+AsIahuFuf+BcGf7MZaDSOLx9XhH0OyZd5dxXEs0k7I9CVgIoQvBw1bTUReN/nUngGqCyBD6vd+peLcDcN9zfhqwV3A16sUxwLPQWAgThEszt/NQO9f7h9/fPCyrYpl1rQ2+B9FnKm4ooSGIxDU9Rta4qaPyjAfxlY2DLlKnudjp8dyoPClRPGQoBfku67vyaFT2aF5S2PAH018FHM2wiSySRrtqbmVobJM5pXj+S2G0oIl+7tzRU5l2AqZUbhVWWWw6cNAT6YyZ2LBfgpz7klkKtxZBVemYKT0Vy9T6rZNmNIbAi3H8DokvBOhVmKLQc67wjTa0JiwwcAwNwm1EegIWLqaQeuLe21G1188h/QMyu89ZLJByEN9VH4ZjH/AApGwfV6GK41T8xjaP2Zhi9+dxewI1Y4IgoC/JUNrTvr0H/fGwDA5wlhbt2UlzYL2yomJU2eQ2l5EM6VweiqyXw5ledU/HwA2soVN/8R/t7O6x3FpHwPnC7MWUDFHssBAjqlUfxY/BcOqIA1r7G5CuyzUk9BCtBWj5bzzAA9hw4QDo5JS2jcRMFZhoFuDmMmFBAxl1PI3o53+57B9fwh5c0KBaF9zTQAAAAASUVORK5CYII=',
  telegram: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQqSURBVFiFtZZdbFRFFMd/M3N3t7u0pS205atAST8SYiwVNYFETUkkhMoLmviFkkWIkpr4oqIxaYiaCD6AMTEBNGAIVRNUfCgSTajRQMA2xqpRkmpa0g/btKlsS7fd7t6548N2y7bb7d6W9v927zlz/v+ZM3POEbjFucFcNRapBbaBqQKxHkRe3GhCYG4iRCsOTVp5L/JC4W03YUVGj1PdFQpxCMFTQMCl3FHgc62do7xU8vf8BBzr8ls56h2DeQWwXBJPDx8TmA9sK1pPsDTiXsCJrnKpxNcCcc/8iFNwXTux3by4vjejAM8nPdWO4TugcIHIE+hWOLXRAyW/pxdwoqtcKXl1EcgnRWjL8wDBor7EDzlpOtORJaU8v4jkAGuUHWvkWJc/RYBl+94VgqpFJE9gs5Ut30h8xFNwqrtCCfEn877tc8aItjzlBIv6JIBCHFpo8k3LPNy33JPOnK1sux5ATFS4XtwXmbQo8EmeKfMTrAhQtcxD25DNxvP96dzDWnpXWhPldd7kUsCWYi97ygI8W+YnYN15WD1hPdvSJcqJ7rSAbfMhXpet2FsRYG9FgHXZCoC/QjYt/VH2VsT30zIQyxDFbLMmGosrUp8S7FqbxXPlfnaUZKEmlsUcw/E/wrQOxjj9SN6kf/NANENEca8FojQT8cY8iz3lAYKVAQqz5BTblb4oB6+EqFnl41xNPjJpL5lPgA0WkDuTxSsFwcoA+ysDVM9wmwfHHV7/eZizbaMc3pzDW9U5U+w9YZ3pDgAsTfv0Hl3j4/iWXLwyNT0N/4zx6vUhbkUdTj6Ux77K1DvsYvdA/O0PA8unGy52Rig820fNKh9PbPCza62PwXHDy1dDfN89jk8JGmryebzUnxoVN/kHYMgC0wEiRQBA2DY0dkZo7IzgUwIBRLShwCf5ZnsBW4u9aSO7PIF2iRCtbjzHtSGiDQAfbl06K7lj4Bc3J2DMbxKHJjcCkrF6iZrVfiNkMxwzmQNJLksd8zQC4bkIyPcKbAf2/xTi5I3UpS3u8h/W495LkrqiEeCLuQgIeCRPN/3Hp22j1F0d4snLtwhFnSQBLvIv+Iy6ohEJoLVzFIS7dwPsvDTIhZt3ZsyvOsa4/8IAzf1RHAM/9o5nChHV0joS1zEB6+Oe9w285lbETFAi3iPab89egAQcsQ+sfhOSJiLbitYD1+9GgDZkJAeu2WOjh5PEJOFM/wplx5qBkrsRMgv+1bbzIAdLehI/pnaWYFGfwnkM6F4E8i7lODuSySFdHz7dW6i08yXw8AKRX9OWZ3fyOJ6AnMmbfSsH9NjodmF4mznWiGmICmPe02OjNTORg5tJ5Ez/ivgAaZ4HlrgkDoNp0MpzlH3F7bM5uhuFAD7qz1beWC3G1CDlJowpBRLjTwghOjD8inF+0DHvtxMFLiP+B8NvdwKhEpDqAAAAAElFTkSuQmCC',
  facebook: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFcSURBVFiF7ZWxSwJRHMc/7/EGCQUXCw8q2nIQPFwaXdyaw/+i5bClsUVwauhPyKElp1b3oLIIGsvhHFxCEUoevpYcujyp07u3+B1/8HufD+/3e3fCGMPOyb2jUU0BFQN5YoyAvoGOQnu9huuL7fqdo1EPQC5O8JwMFLokNappAQ6Q06imFFCxAAdAQEXGPfNFMZCXtuCzqFUdJATUylmqhTRFJ8Vm5ufRu6cv8QlsZRTnRw4Hexv/7l16BEIQGb4SgVo5Gxm+EoFqIb1U/9I7UHRSc+vHVz43zyM+tYlXILjts1x3h3/qt/4dWAuIfP1x8ZYE8na2Hwn05H9wePH6q57YDVzevs+tJyIwnkxph7yKRATa3SHjydSeQNj1Q4QlDCZsKcN+v8FYf4ZrgbWAfQEBfVtwAX1poGNLwEBHKrQHDCzwBwrtyV7D9RW6BLSSGMc3o6XQpV7D9b8ATZ9dSzfdFHUAAAAASUVORK5CYII=',
  twitter: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAABiAAAAYgH4krHQAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABEJJREFUWIW1l09MFGcYxn8DZHdYtlqNoNgLbYKRYGkbEq1/iGnVhFAT3UNDeyEBDsaDHiThQiQtBmqMFyWS1lYTo8Gb8dKGU5uNUpBAulEMETQLNET5o4HILssUeXpYlizrwsxU+iRvsjPzvN/zfPu93zfvGDjHBuAr4EvgE6AAeH/p2TQwDISA34Ffgdcuxl4TO4BrQASQw4gAvwCF7yKcDVwE/nEhnBoWcAEw3YoXAo/eQTg1uoB8p+KfARPrKJ6Iv4ESJzP/P8STTWxLFjSSfptAN/EKx+v1UlVVhWEkU6Czs5PHjx/bTYTc3FwCgUA6fh9QBsyl5lxMdXz58mVJUigUUm9vr0ZHRzU0NKScnJw1Z2qapjo7O9Xd3a3s7Ox0nO9TxXeQptpN01R/f7/Onj0rQHl5eXrx4oXa2tpWFTcMQ7du3VI4HNbWrVtX470mZSmurTZgaWmpotGo9uzZI0DHjh3T4uKiKioq0vJbWlo0MzOjXbt22dVDW0J8AzaHTFNTk54+fSq/3y9A169f19jYmDZv3ryCV11dLcuydPjwYScFOQu8B/CtHTkrK0s9PT3Lf31OTo4GBwfV3t6+zDl48KDm5+d14sQJN7uiEuBnJ+SioiJFo1EdPXpUgPbt26eFhQVVVlaqqKhIr1690rlz59xuy58Aepwm1NXV6fnz59qyZYsANTc36+XLlwqHw2pvb5dhGG4NdAFMOk3IyMhQMBjUnTt3BMjj8aivr08TExMyTdOtuIBxgHk3SQUFBZqZmVFNTY0A7dy5U5FIxO3aJyLm2gCg2tpazc7OqrCwUIBOnTq14tqtAcdLkIiTJ09Kku7fv6/MzEwZhqGOjg7du3dPmZmZrpfAcRECKi8vl2VZOnPmjCYnJ9XQ0CBA27dv19TUlOrr610X4VWnCcXFxZqenlZjY6MAHT9+XJZlaffu3QIUCAQUi8VUUlLi1MCPAN84Iefn52tkZES3b99esd1u3rypgYEB+Xw+Abpx44ZCoZA8Ho8TA18D+Ikfi6sSfT6fHjx4oGAwKK/Xu+LZxo0bNTIyotbWVgHy+/0aGhpSc3OznfjskjYQbyDTEjMyMnT37l0NDAxo06ZNaTmHDh3Smzdvll9Q+/fvl2VZKisrW8vAVZJQSLyBfIt46dIlTU1N2W6x1tZWjY+PKy8vT4DOnz+vZ8+eLb/AUmIe+IgUXEglnj59WnNzc9q7d6/tevp8Pj158kTDw8Pq7e3Vw4cPJUlXrlxJx/8hIZqVZKCReKv0OYDH4yESiXDkyBG6urpSzb6FaDRKIBDgwIEDK+5LwjRNYrFY4lYX8N1q42wDRu1m+w4xBnxgN5kS4t3reouPAh/biSeQCwTXUfxPUnpAJ/AS717XPCNsYh5oWRrrP2Mb8QbSjZFZ4t3OW1stFYYdIQl+4p/nXwCfAh+y8vM8DPwF/AH8tmTCFv8CRyf96qhlN3YAAAAASUVORK5CYII=',
  youtube: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGsSURBVFiF7dbPahNRFMfxzwzB4p9UowtdWWPoQoVCH6ArcREQ+gYFu+yTdNsHcOMr9CkEuxDELEpNFnWh2JamJmCsHBeTtCkoZCZDs2i/cOAyc+89v+H8Bn5cc9VJJtkU3MUt3Bx7fAO3h+seBmPv+ugndCcWEDzGGzxDHQu4M9akKN2hwC9o4zPeJXw92xG8CrpBXFIdBy8hCaro4P6UX5qXA9RTrM6gOTzAaoqlGTQfsZTi+QwFvEjxKNeRRoP1ddK0DAEPBZ1cDl5ejoiI2NmJWFmZ9m/oCA4KCRixvR1RrxcVcCjoTSUgIqLfj9jcjKhW8wroCU6nFjBifz9ibS0iSSa973cpTjpjbo5aLY9Bk3JGMBhEbG1FzM/nHcHPckzYaBQ14Q9Bu5CAViui2SzaeFR7gg+5Di0uRmxsRFQq0zaP4H0F33IZbXc3q3L4nqJV1m0FaKX4OEMBn5LI8l4btUtufownIGgGJyWYatLqBa+5GEoXnIfSp7KQek+WfqfhDw5lIbQj89zbhL0LAv5HnMfv0Ygqshz5L05wOlwfyaL5r6LKr7ka/AXL2d7/fwgUogAAAABJRU5ErkJggg==',
  instagram: 'data:image/png;base64,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',
  linkedin: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAPzAAAD8wF1XGupAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAANJQTFRF////AG22AIC/AHW1AHq4AH27AHq5AHq5AHq6AHq5AHq5AHq5AHq5AHq5AHq5AHq5AHq5AHq5BHy6CH67CX+7C4C8DIC8DYG8D4K9E4O9Goe/HonAIYrBIovBLJDENZTGPJjHP5rIR53KTKDLUaLMWabOYKrQa6/SbbDTcLLTdrXVd7XVhr3ZiL7Zib7Zl8XdmMbdmcbdo8vfpczgps3grtHisdLjs9Pjt9XkuNblvdjmw9vn1OPr1eTr2Obs3Ojt4uru5uzv6e7w7PDx8PLy8fLygYYNQgAAABF0Uk5TAAcIGBktSYSXmMHI2uPy8/XVqDFbAAABIUlEQVQ4y4VT6ULCMAzuBvQYY1sU8Va8L2Qq3k48+/6vZGy7iWSj348czdc2TRPGKgRcRXGaxpHiAaNoywQqJLI9Fw5FBv+QiXA23uoCQbf1F+/0oAa9TrW/No4Md0Zoz19ZorfYPIRxxp9vR4QhzPtM/lvfWr8SQvb7WmnMwYfWDzQNifVz9dm7GW9TQhIwDgvBmbJGP8/zc1hHeTo4nrxc7ziCYpE11rTWz7CJ8vEJhf46tOsRi+cJDtO+WY9ZSgi3w7N3VPtmPaWE6TLACPWJI5Ar7tE7QD1yV5Ak79Abor50SarFBFUWqonAy1I3ELDU7rMaCLL67tWiKCawgfIKvV3UF+V3u4aphZhtuRq4lvM2rb/t/YPjHz3/8DaP/w/O0lQZAu+37AAAAABJRU5ErkJggg==',
};

let _cfg = null;

function firstNonEmpty(...vals) {
  for (const v of vals) {
    const s = String(v || '').trim();
    if (s) return s;
  }
  return '';
}

function getEmailConfig() {
  if (_cfg) return _cfg;
  const resendApiKey = firstNonEmpty(process.env.RESEND_API_KEY, process.env.RESEND);
  const resendFrom   = firstNonEmpty(process.env.RESEND_FROM_EMAIL, process.env.FROM_EMAIL, `noreply@bitcovex.com`);
  const smtpHost     = firstNonEmpty(process.env.SMTP_HOST);
  const smtpUser     = firstNonEmpty(process.env.SMTP_USER);
  const smtpPass     = firstNonEmpty(process.env.SMTP_PASS);
  const smtpFrom     = firstNonEmpty(process.env.SMTP_FROM, process.env.FROM_EMAIL, smtpUser);

  if (resendApiKey) {
    _cfg = { provider: 'resend', resendApiKey, fromEmail: resendFrom };
  } else if (smtpHost && smtpUser && smtpPass) {
    _cfg = {
      provider: 'smtp',
      fromEmail: smtpFrom,
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass }
      })
    };
  } else {
    _cfg = { provider: 'none' };
  }
  return _cfg;
}

async function sendEmail({ to, subject, text, html }) {
  const cfg = getEmailConfig();
  if (cfg.provider === 'resend') {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.resendApiKey}` },
        body: JSON.stringify({ from: cfg.fromEmail, to, subject, text, html })
      });
      if (!res.ok) {
        const err = await res.text().catch(() => res.statusText);
        return { delivered: false, reason: `resend_error:${err}` };
      }
      return { delivered: true, reason: 'sent_via_resend' };
    } catch (e) {
      return { delivered: false, reason: `resend_error:${e.message}` };
    }
  }
  if (cfg.provider === 'smtp') {
    try {
      await cfg.transporter.sendMail({ from: cfg.fromEmail, to, subject, text, html });
      return { delivered: true, reason: 'sent_via_smtp' };
    } catch (e) {
      return { delivered: false, reason: `smtp_error:${e.message}` };
    }
  }
  return { delivered: false, reason: 'not_configured' };
}

function createP2PEmailService() {
  const BRAND_NAME = String(process.env.APP_NAME || 'BITCOVEX').trim().toUpperCase();
  const BRAND_DOMAIN = String(process.env.APP_DOMAIN || 'bitcovex.com').trim().toLowerCase();
  const BRAND_ACCENT = '#f0b90b';
  const BRAND_BG = '#0b0b0d';
  const BRAND_CARD = '#1a1a1d';
  const BRAND_BORDER = '#2a2a2e';
  const BRAND_TEXT = '#e8e8ea';
  const BRAND_MUTED = '#9a9aa0';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Footer: no SVG — uses hosted PNG images or plain text fallbacks ──────────
  function buildFooter() {
    const year = new Date().getFullYear();
    return `
<tr><td style="padding:24px 28px 28px;border-top:1px solid ${BRAND_BORDER};">
  <p style="margin:0 0 14px;font-size:15px;color:#ffffff !important;font-weight:700;">Contact Us</p>
  <p style="margin:0 0 4px;font-size:13px;color:${BRAND_MUTED} !important;">24*7 customer service or email <a href="mailto:support@${BRAND_DOMAIN}" style="color:${BRAND_ACCENT} !important;text-decoration:none;">support@${BRAND_DOMAIN}</a></p>
  <p style="margin:0 0 18px;font-size:12px;color:${BRAND_MUTED} !important;">* This email is sent automatically and you do not need to reply.</p>

  <table cellpadding="0" cellspacing="0" style="margin:0 0 22px 0;"><tr><td>
    <a href="https://${BRAND_DOMAIN}/support" style="display:inline-block;border:1px solid ${BRAND_ACCENT};border-radius:20px;padding:8px 22px;text-decoration:none;font-size:13px;font-weight:700;color:${BRAND_ACCENT} !important;">Consult</a>
  </td></tr></table>

  <table cellpadding="0" cellspacing="0" style="margin:0 0 22px 0;">
    <tr>
      <td style="padding-right:10px;">
        <a href="#" style="display:inline-block;background:#1a1a1d !important;border-radius:10px;padding:10px 20px;text-decoration:none;border:1px solid #444 !important;min-width:140px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:8px;vertical-align:middle;"><img src="https://${BRAND_DOMAIN}/icons/playstore.png" width="24" height="24" alt="Google Play" style="display:block;border:0;"/></td>
            <td style="vertical-align:middle;">
              <span style="display:block;font-size:9px;color:#ccc !important;letter-spacing:0.5px;line-height:1.4;">GET IT ON</span>
              <span style="display:block;font-size:16px;color:#fff !important;font-weight:700;font-family:Arial,sans-serif;line-height:1.3;">Google Play</span>
            </td>
          </tr></table>
        </a>
      </td>
      <td>
        <a href="#" style="display:inline-block;background:#1a1a1d !important;border-radius:10px;padding:10px 20px;text-decoration:none;border:1px solid #444 !important;min-width:140px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:8px;vertical-align:middle;"><img src="https://${BRAND_DOMAIN}/icons/appstore.png" width="24" height="24" alt="App Store" style="display:block;border:0;"/></td>
            <td style="vertical-align:middle;">
              <span style="display:block;font-size:9px;color:#ccc !important;letter-spacing:0.5px;line-height:1.4;">Download on the</span>
              <span style="display:block;font-size:16px;color:#fff !important;font-weight:700;font-family:Arial,sans-serif;line-height:1.3;">App Store</span>
            </td>
          </tr></table>
        </a>
      </td>
    </tr>
  </table>

  <p style="margin:0 0 10px;font-size:12px;color:${BRAND_MUTED} !important;line-height:1.6;">Risk warning: Cryptocurrency trading involves high risk with significant price volatility and potential for substantial losses. Please trade with caution.</p>
  <p style="margin:0 0 18px;font-size:12px;color:${BRAND_MUTED} !important;line-height:1.6;">Kindly note: Please be aware of phishing sites and confirm you are visiting the official <a href="https://${BRAND_DOMAIN}" style="color:${BRAND_ACCENT} !important;text-decoration:none;">${BRAND_DOMAIN}</a> website before entering sensitive data.</p>
  <div style="height:1px;background:${BRAND_BORDER} !important;margin-bottom:16px;"></div>
  <p style="margin:0;font-size:12px;color:${BRAND_MUTED} !important;">&copy; 2025-${year} <a href="https://${BRAND_DOMAIN}" style="color:${BRAND_ACCENT} !important;text-decoration:none;">${BRAND_DOMAIN}</a> All Rights Reserved.</p>
</td></tr>`;
  }

  function buildHeader() {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>P2P Order</title><meta name="color-scheme" content="dark"/><meta name="supported-color-schemes" content="dark"/><style>:root{color-scheme:dark;supported-color-schemes:dark;}body,table,td{background-color:${BRAND_BG} !important;}body[data-ogsc],table[data-ogsc],td[data-ogsc],[data-ogsc] body,[data-ogsc] table,[data-ogsc] td,[data-ogsb]{background-color:${BRAND_BG} !important;}u+.body div[style],u+.body table,u+.body td{background:${BRAND_BG} !important;}@media (prefers-color-scheme: light){body,table,td{background-color:${BRAND_BG} !important;color:${BRAND_TEXT} !important;}}@media (prefers-color-scheme: dark){body,table,td{background-color:${BRAND_BG} !important;}}</style></head><body bgcolor="${BRAND_BG}" style="margin:0;padding:0;background:${BRAND_BG} !important;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" bgcolor="${BRAND_BG}" style="padding:20px 12px;background:${BRAND_BG} !important;"><tr><td align="center" bgcolor="${BRAND_BG}" style="background:${BRAND_BG} !important;"><table width="600" cellpadding="0" cellspacing="0" bgcolor="${BRAND_BG}" style="max-width:600px;width:100%;background:${BRAND_BG} !important;border-radius:8px;overflow:hidden;border:1px solid ${BRAND_BORDER};">
<tr><td style="padding:22px 28px;text-align:center;background:#000000 !important;" bgcolor="#000000">
  <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
    <td style="padding-right:2px;vertical-align:middle;">
      <img src="https://${BRAND_DOMAIN}/cdn/brand/logo.png" width="22" height="22" alt="${BRAND_NAME}" style="display:block;border:0;border-radius:5px;"/>
    </td>
    <td style="font-size:19px;font-weight:700;color:#ffffff !important;letter-spacing:0.2px;vertical-align:middle;">${BRAND_NAME.charAt(0) + BRAND_NAME.slice(1).toLowerCase()}</td>
  </tr></table>
</td></tr>
<tr><td style="height:1px;background:${BRAND_BORDER} !important;line-height:1px;font-size:0;">&nbsp;</td></tr>`;
  }

  function buildDetailsBox(order) {
    const creationTime = order.createdAt
      ? new Date(order.createdAt).toISOString().replace('T', ' ').slice(0, 19) + ' (UTC)'
      : new Date().toISOString().replace('T', ' ').slice(0, 19) + ' (UTC)';
    return `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
  <tr><td style="background:${BRAND_CARD} !important;border:1px solid ${BRAND_BORDER};border-radius:6px;padding:18px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:6px 0;font-size:14px;color:${BRAND_TEXT} !important;width:160px;vertical-align:top;">Order ID:</td><td style="padding:6px 0;font-size:14px;color:${BRAND_ACCENT} !important;font-weight:500;">${escapeHtml(String(order.id || 'N/A'))}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:${BRAND_TEXT} !important;vertical-align:top;">Trade amount:</td><td style="padding:6px 0;font-size:14px;color:${BRAND_ACCENT} !important;font-weight:500;">${escapeHtml(String(order.cryptoAmount || '0'))} ${escapeHtml(String(order.asset || 'USDT'))}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:${BRAND_TEXT} !important;vertical-align:top;">Transaction amount:</td><td style="padding:6px 0;font-size:14px;color:${BRAND_ACCENT} !important;font-weight:500;">${escapeHtml(String(order.fiatAmount || '0'))} ${escapeHtml(String(order.fiatCurrency || 'INR'))}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:${BRAND_TEXT} !important;vertical-align:top;">Creation time:</td><td style="padding:6px 0;font-size:14px;color:${BRAND_ACCENT} !important;font-weight:500;">${escapeHtml(creationTime)}</td></tr>
    </table>
  </td></tr>
</table>`;
  }

  function closeHtml() {
    return `</table></td></tr></table></body></html>`;
  }

  // ── Buyer: order placed ───────────────────────────────────────────────────────
  async function sendOrderConfirmation(email, order) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const subject = `[${BRAND_NAME}] [P2P] New Order Confirmation`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;background:${BRAND_BG} !important;" bgcolor="${BRAND_BG}">
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#ffffff !important;">[P2P] New Order Confirmation</h1>
  <p style="margin:0 0 14px;font-size:14px;color:${BRAND_TEXT} !important;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:${BRAND_TEXT} !important;line-height:1.7;">Your buy order <strong style="color:${BRAND_ACCENT} !important;">${escapeHtml(String(order.id || ''))}</strong> has been created and the seller's funds have been locked. Please complete the order promptly as it will be automatically cancelled after <strong>15 minutes</strong>.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://${BRAND_DOMAIN}/p2p" style="color:${BRAND_ACCENT} !important;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 28px;font-size:13px;color:${BRAND_TEXT} !important;">If you do not recognize this activity, please <a href="https://${BRAND_DOMAIN}/support" style="color:${BRAND_ACCENT} !important;text-decoration:none;">contact support</a>.</p>
  <p style="margin:0 0 4px;font-size:13px;color:${BRAND_TEXT} !important;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:${BRAND_MUTED} !important;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
${closeHtml()}`;
      return sendEmail({ to: email, subject, text: `[P2P] Order ${order.id} confirmed.`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Seller: new order / payment sent ─────────────────────────────────────────
  async function sendOrderUpdate(email, order, status) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      let subject, bodyContent;

      if (status === 'new_order_seller') {
        subject = `[${BRAND_NAME}] [P2P] New Order Received`;
        bodyContent = `
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#ffffff !important;">[P2P] New Order Received</h1>
  <p style="margin:0 0 14px;font-size:14px;color:${BRAND_TEXT} !important;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:${BRAND_TEXT} !important;line-height:1.7;">A buyer has placed order <strong style="color:${BRAND_ACCENT} !important;">${escapeHtml(String(order.id || ''))}</strong>. Your funds have been locked in escrow. Please wait for the buyer to complete payment — once they confirm, you will receive another email to release the crypto.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://${BRAND_DOMAIN}/p2p" style="color:${BRAND_ACCENT} !important;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:${BRAND_TEXT} !important;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:${BRAND_MUTED} !important;">Please do not reply to this email</p>`;
      } else if (status === 'payment_sent_seller') {
        subject = `[${BRAND_NAME}] [P2P] Action Required — Release Crypto`;
        bodyContent = `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr><td style="background:#2a2410 !important;border:1px solid ${BRAND_ACCENT};border-radius:8px;padding:14px 18px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:${BRAND_ACCENT} !important;">&#9888; Action Required — Buyer has sent payment!</p>
    </td></tr>
  </table>
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#ffffff !important;">[P2P] Release Crypto</h1>
  <p style="margin:0 0 14px;font-size:14px;color:${BRAND_TEXT} !important;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:${BRAND_TEXT} !important;line-height:1.7;">The buyer has confirmed payment for order <strong style="color:${BRAND_ACCENT} !important;">${escapeHtml(String(order.id || ''))}</strong>. Please verify payment in your bank/UPI account and <strong>release the crypto</strong> to complete the trade.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://${BRAND_DOMAIN}/p2p" style="color:${BRAND_ACCENT} !important;text-decoration:none;font-weight:600;">Go to Order &rarr; Release Crypto</a></p>
  <p style="margin:0 0 28px;font-size:13px;color:${BRAND_MUTED} !important;">Do NOT release crypto until you have verified payment in your account.</p>
  <p style="margin:0 0 4px;font-size:13px;color:${BRAND_TEXT} !important;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:${BRAND_MUTED} !important;">Please do not reply to this email</p>`;
      } else {
        subject = `[${BRAND_NAME}] [P2P] Order Update`;
        bodyContent = `
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#ffffff !important;">[P2P] Order Update</h1>
  <p style="margin:0 0 14px;font-size:14px;color:${BRAND_TEXT} !important;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:${BRAND_TEXT} !important;line-height:1.7;">Your P2P order <strong style="color:${BRAND_ACCENT} !important;">${escapeHtml(String(order.id || ''))}</strong> status has been updated to: <strong style="color:${BRAND_ACCENT} !important;">${escapeHtml(String(status || ''))}</strong>.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://${BRAND_DOMAIN}/p2p" style="color:${BRAND_ACCENT} !important;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:${BRAND_TEXT} !important;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:${BRAND_MUTED} !important;">Please do not reply to this email</p>`;
      }

      const html = buildHeader() + `<tr><td style="padding:28px 28px 0;background:${BRAND_BG} !important;" bgcolor="${BRAND_BG}">${bodyContent}</td></tr>` + buildFooter() + closeHtml();
      return sendEmail({ to: email, subject, text: `[P2P] Order ${order.id} update: ${status}`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Buyer: 5-min reminder ─────────────────────────────────────────────────────
  async function sendPaymentReminderEmail(email, order) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const subject = `[${BRAND_NAME}] [P2P] Confirm Payment — 5 Minutes Left!`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;background:${BRAND_BG} !important;" bgcolor="${BRAND_BG}">
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr><td style="background:#2a2410 !important;border:1px solid ${BRAND_ACCENT};border-radius:8px;padding:14px 18px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:${BRAND_ACCENT} !important;">&#9888; Action Required — Only 5 Minutes Remaining!</p>
    </td></tr>
  </table>
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#ffffff !important;">[P2P] Confirm Payment</h1>
  <p style="margin:0 0 14px;font-size:14px;color:${BRAND_TEXT} !important;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:${BRAND_TEXT} !important;line-height:1.7;">You have a P2P order <strong style="color:${BRAND_ACCENT} !important;">${escapeHtml(String(order.id || ''))}</strong> that needs payment confirmation within the next <strong style="color:#e53935 !important;">5 minutes</strong>, otherwise the order will be cancelled.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://${BRAND_DOMAIN}/p2p" style="color:${BRAND_ACCENT} !important;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:${BRAND_TEXT} !important;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:${BRAND_MUTED} !important;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
${closeHtml()}`;
      return sendEmail({ to: email, subject, text: `[P2P] 5 minutes left to confirm payment for order ${order.id}.`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Buyer: crypto released ────────────────────────────────────────────────────
  async function sendOrderReleased(email, order) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const cryptoAmount = Number(order.cryptoAmount || 0);
      const asset = String(order.asset || 'USDT').toUpperCase();
      const sellerName = String(
        (order.participants || []).find(p => p.role === 'seller')?.username ||
        order.sellerUsername || 'The seller'
      );
      const subject = `[${BRAND_NAME}] [P2P] Crypto Released — Funds Deposited`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;background:${BRAND_BG} !important;" bgcolor="${BRAND_BG}">
  <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:#ffffff !important;">P2P Trading Update</h1>
  <p style="margin:0 0 18px;font-size:15px;color:${BRAND_TEXT} !important;line-height:1.8;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:15px;color:${BRAND_TEXT} !important;line-height:1.8;">
    <strong>${escapeHtml(sellerName)}</strong> has released the crypto and
    <strong style="color:${BRAND_ACCENT} !important;">${cryptoAmount.toLocaleString(undefined,{maximumFractionDigits:8})} ${escapeHtml(asset)}</strong>
    have been deposited into your account.<br/>
    Order no. <strong>${escapeHtml(String(order.id || 'N/A'))}</strong>
  </p>
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://${BRAND_DOMAIN}/p2p" style="color:${BRAND_ACCENT} !important;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:${BRAND_TEXT} !important;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:${BRAND_MUTED} !important;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
${closeHtml()}`;
      return sendEmail({ to: email, subject, text: `[P2P] ${cryptoAmount} ${asset} deposited. Order ${order.id}`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Seller: buyer marked payment ──────────────────────────────────────────────
  async function sendOrderPaid(email, order) {
    try {
      const emailOrder = {
        id: order.id, cryptoAmount: order.cryptoAmount,
        asset: order.asset || 'USDT', fiatAmount: order.fiatAmount,
        fiatCurrency: order.fiatCurrency || 'INR', createdAt: order.createdAt
      };
      return sendOrderUpdate(email, emailOrder, 'payment_sent_seller');
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Both parties: order cancelled ────────────────────────────────────────────
  async function sendOrderCancelled(email, order) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const subject = `[${BRAND_NAME}] [P2P] Order Cancelled`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;background:${BRAND_BG} !important;" bgcolor="${BRAND_BG}">
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#ffffff !important;">[P2P] Order Cancelled</h1>
  <p style="margin:0 0 14px;font-size:14px;color:${BRAND_TEXT} !important;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:${BRAND_TEXT} !important;line-height:1.7;">Your P2P order <strong style="color:${BRAND_ACCENT} !important;">${escapeHtml(String(order.id || 'N/A'))}</strong> has been cancelled. Any locked funds have been returned to your account.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://${BRAND_DOMAIN}/p2p" style="color:${BRAND_ACCENT} !important;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:${BRAND_TEXT} !important;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:${BRAND_MUTED} !important;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
${closeHtml()}`;
      return sendEmail({ to: email, subject, text: `[P2P] Order ${order.id} has been cancelled.`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Admin + parties: dispute raised ──────────────────────────────────────────
  async function sendDisputeRaised(email, order, raisedBy) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const subject = `[${BRAND_NAME}] [P2P] Dispute Raised — Order ${escapeHtml(String(order.id || ''))}`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;background:${BRAND_BG} !important;" bgcolor="${BRAND_BG}">
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr><td style="background:#2a1414 !important;border:1px solid #ff6b6b;border-radius:8px;padding:14px 18px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#ff6b6b !important;">&#9888; A dispute has been raised on this order.</p>
    </td></tr>
  </table>
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#ffffff !important;">[P2P] Dispute Raised</h1>
  <p style="margin:0 0 14px;font-size:14px;color:${BRAND_TEXT} !important;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:${BRAND_TEXT} !important;line-height:1.7;">A dispute has been raised by <strong>${escapeHtml(String(raisedBy || 'a participant'))}</strong> on order <strong style="color:${BRAND_ACCENT} !important;">${escapeHtml(String(order.id || 'N/A'))}</strong>. Our support team will review and resolve it shortly.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://${BRAND_DOMAIN}/p2p" style="color:${BRAND_ACCENT} !important;text-decoration:none;font-weight:600;">View Order</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:${BRAND_TEXT} !important;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:${BRAND_MUTED} !important;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
${closeHtml()}`;
      return sendEmail({ to: email, subject, text: `[P2P] Dispute raised on order ${order.id} by ${raisedBy}.`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  return {
    sendOrderConfirmation,
    sendOrderUpdate,
    sendPaymentReminderEmail,
    sendOrderReleased,
    sendOrderPaid,
    sendOrderCancelled,
    sendDisputeRaised
  };
}

module.exports = { createP2PEmailService };
