const nodemailer = require('nodemailer');

const BRAND_NAME = String(process.env.APP_NAME || 'Bitcovex').trim();
const BRAND_ACCENT = '#F68F15';
const BRAND_DARK = '#181a20';
let providerConfigLogged = false;

const SOCIAL_ICONS = {
  playstore: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABAQAAAQEBn5eVwwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQYSURBVFiFtZZtTJtlFIbv8xYopQMKOMWJTgkfkihEt6FxCGSJ0ejMhsbslyhLlH8uKB9GZRKzhI8fy1CDsKGykalLVGpkAZVIW7CO0hDGZtTKYHw4QLZSi23f1vIef0CzDktbaHv+vMlz7vu5rzx5nryHAGBXG0cr4+vfSFAYagC4QPxJFFOjukRtQYSLAODeluWjAqSj6dtr9bFR04+v9cxM3GRbSmrWlHWIkQIQ1igOMgTZlcVjex2uzP61XjIxNWxTWUzPdB18ta6uTogYAIC41Q8JEzdqi23iA1ovzd0EtBnzRg3Pfl2yL9wABAD3tSz/BiDbu5GW3KxJlBuLfXj6wFTZ/VzXxYgCAMBdqpNalWKgyIdPIsJXMka1ukR9NWIAqxDtWpVCW+jRrisHMb0vI27Y6osJCAAAqQnndCnK7gLcvDPry8zETVKM60TP0z3OzQAEdbPnrYcK562Hfgbg3kCSTEwNMqfctF99oBTs87R8VlAn4KkUZa8+NeFsPoCoANJhANXdJWpNoD039bZv2J56bN5aNgrAFUC6B0D/S988+RlrY3LCBrAKsW/3n0vlYwAc/nQqwXW9LXFwF0CXWRdzhnVxd4YFAAAsYsHuGfPrJgZsvvopgvhXe2K/RU7uLAACmF4Er4yzNraBLyAhZAAAsDofyps2V14B07L3eirZr32s0opykjLWWeIAroFTbmJd7MshAwDAP8683Enz27MMMgNAmmCbbU3SQQbpHj+2O8D8qQci5B+M3ZWdM2V+ZzEjyjbaohqIloF3BGVk6ZWwAABAxpwb77VaCX9HbXq/kAEevn7p107Na9sFkfPsH+Y42RwzF2T0yZABChYMYx2aijRiTgYArFCaveV+lhZjZ/zYFkBURkXi6ZAAiuf0F1sG30on4vhbGhLtcLRly6U5xfg6ix2gRsidWVQodngWtwSwf+p74wf62iwCb/MpkHC741SmSppVmgBIIO6ETJZJReKb9Cis3tJNA7ww+a2x3tiYC0DhX0m3OTrTR0D8IBW6SqnAfs2XKtBP5ZYq/eNLfdXYR3sARAeQDjMJ1fG9Bg16/QuDBjj8++c/VVxufySAZxqEWmWfoZMADmbfoAAqLp0aOGz6Yi/8DCRgNCnl5hPUM76pgSQgQN3Ice3zk+c3GslcALX+u+J8N0kzuqWRzC/AMWOT9sDUdxsOpYJbqFZoLlzdSnBAgONDdZonZgeK/9+hPghSlfKH4dFQgjcEIGZuH6jW5S+OrA//hQg1yr6h8+EI9pTnUtnXwqUzuiPa/MUR72OfIaJyZfLOPGWfIazhgOcECF0ySco992O5PtsyUby2tgQJjUoprpk0GhEYCnf2TYCdC9vqj0xWubMtE5UAFgCcdosxDarBwaWIpHrVf5pBmHKycXKHAAAAAElFTkSuQmCC',
  appstore: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM2SURBVFiFxZffSxxXFMc/986uu+s2NdBSjbq4aK2RpFKQNiEkoY8FxVby0kdfpX0RA6W1pRgiitgaCiWEBvoPFBSJICEvrYFCK5aSFmOqW2xD1VbTyq6uP3bm5OFunKTurjMrMV8YuD/OzPncH+fMvUpEeCT1HY1YdCK8DrwGhNlPi2v7mqAAS6cIWPNoq0daQuO7XSKCAsVtuoA+T079AvwfJhwco7W0XcDRAFnnn/l2XowESO+0cWNjxPB8K41opot27ncGHkkBkXCrxqKzaOcHkQCO3aezG+7ZKGPXacxu96XqELS/AGENZUG43Big+aj2D2A7zykmH4tDDypRMNMMtWH4IQlxWSeiHGwUsVs2qYw/Bt/YNhALmfIbRyCiHAAshG3H79eKARD4enlv+9ymdTgAAB8vQMp+rEEp3p3yOfcHAagsgVLLrU+saO6lfG2lgwFcqXVfzKDpmN7hvbg6HIALL8KbZW59KCGcOqroP654u9w/hC+AsIahuFuf+BcGf7MZaDSOLx9XhH0OyZd5dxXEs0k7I9CVgIoQvBw1bTUReN/nUngGqCyBD6vd+peLcDcN9zfhqwV3A16sUxwLPQWAgThEszt/NQO9f7h9/fPCyrYpl1rQ2+B9FnKm4ooSGIxDU9Rta4qaPyjAfxlY2DLlKnudjp8dyoPClRPGQoBfku67vyaFT2aF5S2PAH018FHM2wiSySRrtqbmVobJM5pXj+S2G0oIl+7tzRU5l2AqZUbhVWWWw6cNAT6YyZ2LBfgpz7klkKtxZBVemYKT0Vy9T6rZNmNIbAi3H8DokvBOhVmKLQc67wjTa0JiwwcAwNwm1EegIWLqaQeuLe21G1188h/QMyu89ZLJByEN9VH4ZjH/AApGwfV6GK41T8xjaP2Zhi9+dxewI1Y4IgoC/JUNrTvr0H/fGwDA5wlhbt2UlzYL2yomJU2eQ2l5EM6VweiqyXw5ledU/HwA2soVN/8R/t7O6x3FpHwPnC7MWUDFHssBAjqlUfxY/BcOqIA1r7G5CuyzUk9BCtBWj5bzzAA9hw4QDo5JS2jcRMFZhoFuDmMmFBAxl1PI3o53+57B9fwh5c0KBaF9zTQAAAAASUVORK5CYII=',
  telegram: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQqSURBVFiFtZZdbFRFFMd/M3N3t7u0pS205atAST8SYiwVNYFETUkkhMoLmviFkkWIkpr4oqIxaYiaCD6AMTEBNGAIVRNUfCgSTajRQMA2xqpRkmpa0g/btKlsS7fd7t6548N2y7bb7d6W9v927zlz/v+ZM3POEbjFucFcNRapBbaBqQKxHkRe3GhCYG4iRCsOTVp5L/JC4W03YUVGj1PdFQpxCMFTQMCl3FHgc62do7xU8vf8BBzr8ls56h2DeQWwXBJPDx8TmA9sK1pPsDTiXsCJrnKpxNcCcc/8iFNwXTux3by4vjejAM8nPdWO4TugcIHIE+hWOLXRAyW/pxdwoqtcKXl1EcgnRWjL8wDBor7EDzlpOtORJaU8v4jkAGuUHWvkWJc/RYBl+94VgqpFJE9gs5Ut30h8xFNwqrtCCfEn877tc8aItjzlBIv6JIBCHFpo8k3LPNy33JPOnK1sux5ATFS4XtwXmbQo8EmeKfMTrAhQtcxD25DNxvP96dzDWnpXWhPldd7kUsCWYi97ygI8W+YnYN15WD1hPdvSJcqJ7rSAbfMhXpet2FsRYG9FgHXZCoC/QjYt/VH2VsT30zIQyxDFbLMmGosrUp8S7FqbxXPlfnaUZKEmlsUcw/E/wrQOxjj9SN6kf/NANENEca8FojQT8cY8iz3lAYKVAQqz5BTblb4oB6+EqFnl41xNPjJpL5lPgA0WkDuTxSsFwcoA+ysDVM9wmwfHHV7/eZizbaMc3pzDW9U5U+w9YZ3pDgAsTfv0Hl3j4/iWXLwyNT0N/4zx6vUhbkUdTj6Ux77K1DvsYvdA/O0PA8unGy52Rig820fNKh9PbPCza62PwXHDy1dDfN89jk8JGmryebzUnxoVN/kHYMgC0wEiRQBA2DY0dkZo7IzgUwIBRLShwCf5ZnsBW4u9aSO7PIF2iRCtbjzHtSGiDQAfbl06K7lj4Bc3J2DMbxKHJjcCkrF6iZrVfiNkMxwzmQNJLksd8zQC4bkIyPcKbAf2/xTi5I3UpS3u8h/W495LkrqiEeCLuQgIeCRPN/3Hp22j1F0d4snLtwhFnSQBLvIv+Iy6ohEJoLVzFIS7dwPsvDTIhZt3ZsyvOsa4/8IAzf1RHAM/9o5nChHV0joS1zEB6+Oe9w285lbETFAi3iPab89egAQcsQ+sfhOSJiLbitYD1+9GgDZkJAeu2WOjh5PEJOFM/wplx5qBkrsRMgv+1bbzIAdLehI/pnaWYFGfwnkM6F4E8i7lODuSySFdHz7dW6i08yXw8AKRX9OWZ3fyOJ6AnMmbfSsH9NjodmF4mznWiGmICmPe02OjNTORg5tJ5Ez/ivgAaZ4HlrgkDoNp0MpzlH3F7bM5uhuFAD7qz1beWC3G1CDlJowpBRLjTwghOjD8inF+0DHvtxMFLiP+B8NvdwKhEpDqAAAAAElFTkSuQmCC',
  facebook: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFcSURBVFiF7ZWxSwJRHMc/7/EGCQUXCw8q2nIQPFwaXdyaw/+i5bClsUVwauhPyKElp1b3oLIIGsvhHFxCEUoevpYcujyp07u3+B1/8HufD+/3e3fCGMPOyb2jUU0BFQN5YoyAvoGOQnu9huuL7fqdo1EPQC5O8JwMFLokNappAQ6Q06imFFCxAAdAQEXGPfNFMZCXtuCzqFUdJATUylmqhTRFJ8Vm5ufRu6cv8QlsZRTnRw4Hexv/7l16BEIQGb4SgVo5Gxm+EoFqIb1U/9I7UHRSc+vHVz43zyM+tYlXILjts1x3h3/qt/4dWAuIfP1x8ZYE8na2Hwn05H9wePH6q57YDVzevs+tJyIwnkxph7yKRATa3SHjydSeQNj1Q4QlDCZsKcN+v8FYf4ZrgbWAfQEBfVtwAX1poGNLwEBHKrQHDCzwBwrtyV7D9RW6BLSSGMc3o6XQpV7D9b8ATZ9dSzfdFHUAAAAASUVORK5CYII=',
  twitter: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAABiAAAAYgH4krHQAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABEJJREFUWIW1l09MFGcYxn8DZHdYtlqNoNgLbYKRYGkbEq1/iGnVhFAT3UNDeyEBDsaDHiThQiQtBmqMFyWS1lYTo8Gb8dKGU5uNUpBAulEMETQLNET5o4HILssUeXpYlizrwsxU+iRvsjPzvN/zfPu93zfvGDjHBuAr4EvgE6AAeH/p2TQwDISA34Ffgdcuxl4TO4BrQASQw4gAvwCF7yKcDVwE/nEhnBoWcAEw3YoXAo/eQTg1uoB8p+KfARPrKJ6Iv4ESJzP/P8STTWxLFjSSfptAN/EKx+v1UlVVhWEkU6Czs5PHjx/bTYTc3FwCgUA6fh9QBsyl5lxMdXz58mVJUigUUm9vr0ZHRzU0NKScnJw1Z2qapjo7O9Xd3a3s7Ox0nO9TxXeQptpN01R/f7/Onj0rQHl5eXrx4oXa2tpWFTcMQ7du3VI4HNbWrVtX470mZSmurTZgaWmpotGo9uzZI0DHjh3T4uKiKioq0vJbWlo0MzOjXbt22dVDW0J8AzaHTFNTk54+fSq/3y9A169f19jYmDZv3ryCV11dLcuydPjwYScFOQu8B/CtHTkrK0s9PT3Lf31OTo4GBwfV3t6+zDl48KDm5+d14sQJN7uiEuBnJ+SioiJFo1EdPXpUgPbt26eFhQVVVlaqqKhIr1690rlz59xuy58Aepwm1NXV6fnz59qyZYsANTc36+XLlwqHw2pvb5dhGG4NdAFMOk3IyMhQMBjUnTt3BMjj8aivr08TExMyTdOtuIBxgHk3SQUFBZqZmVFNTY0A7dy5U5FIxO3aJyLm2gCg2tpazc7OqrCwUIBOnTq14tqtAcdLkIiTJ09Kku7fv6/MzEwZhqGOjg7du3dPmZmZrpfAcRECKi8vl2VZOnPmjCYnJ9XQ0CBA27dv19TUlOrr610X4VWnCcXFxZqenlZjY6MAHT9+XJZlaffu3QIUCAQUi8VUUlLi1MCPAN84Iefn52tkZES3b99esd1u3rypgYEB+Xw+Abpx44ZCoZA8Ho8TA18D+Ikfi6sSfT6fHjx4oGAwKK/Xu+LZxo0bNTIyotbWVgHy+/0aGhpSc3OznfjskjYQbyDTEjMyMnT37l0NDAxo06ZNaTmHDh3Smzdvll9Q+/fvl2VZKisrW8vAVZJQSLyBfIt46dIlTU1N2W6x1tZWjY+PKy8vT4DOnz+vZ8+eLb/AUmIe+IgUXEglnj59WnNzc9q7d6/tevp8Pj158kTDw8Pq7e3Vw4cPJUlXrlxJx/8hIZqVZKCReKv0OYDH4yESiXDkyBG6urpSzb6FaDRKIBDgwIEDK+5LwjRNYrFY4lYX8N1q42wDRu1m+w4xBnxgN5kS4t3reouPAh/biSeQCwTXUfxPUnpAJ/AS717XPCNsYh5oWRrrP2Mb8QbSjZFZ4t3OW1stFYYdIQl+4p/nXwCfAh+y8vM8DPwF/AH8tmTCFv8CRyf96qhlN3YAAAAASUVORK5CYII=',
  youtube: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGsSURBVFiF7dbPahNRFMfxzwzB4p9UowtdWWPoQoVCH6ArcREQ+gYFu+yTdNsHcOMr9CkEuxDELEpNFnWh2JamJmCsHBeTtCkoZCZDs2i/cOAyc+89v+H8Bn5cc9VJJtkU3MUt3Bx7fAO3h+seBmPv+ugndCcWEDzGGzxDHQu4M9akKN2hwC9o4zPeJXw92xG8CrpBXFIdBy8hCaro4P6UX5qXA9RTrM6gOTzAaoqlGTQfsZTi+QwFvEjxKNeRRoP1ddK0DAEPBZ1cDl5ejoiI2NmJWFmZ9m/oCA4KCRixvR1RrxcVcCjoTSUgIqLfj9jcjKhW8wroCU6nFjBifz9ibS0iSSa973cpTjpjbo5aLY9Bk3JGMBhEbG1FzM/nHcHPckzYaBQ14Q9Bu5CAViui2SzaeFR7gg+5Di0uRmxsRFQq0zaP4H0F33IZbXc3q3L4nqJV1m0FaKX4OEMBn5LI8l4btUtufownIGgGJyWYatLqBa+5GEoXnIfSp7KQek+WfqfhDw5lIbQj89zbhL0LAv5HnMfv0Ygqshz5L05wOlwfyaL5r6LKr7ka/AXL2d7/fwgUogAAAABJRU5ErkJggg==',
  instagram: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAboSURBVFiFtZdtjB1VGcd/z5kzt3df2u72ZdstLW1h29IqFg0FQhTbUDH1hYRaLG3QFhKJRIkmKEqpBmOD9gPBmJjoBxAtaRAkGqwNaVIjQUX4YEuV7dIq3b5tW8tu9+3u3r0zcx4/nLlz79y7fNDESSZ35rz9//N//s9zzhXqLr17fXvkCl9QF3zCabjKabgwcXaWU2udWvwdUnu2OGdJGtvyY8vO2cEE26tqD9rJlmc/fPSu4SqmZOBbb7uDhOec2vlVkMQ1LdYEkB/TPDZJSda1/dtpeN8tb2w5mBHQL234JFN6gIpaYvyk5ol54NyY6Ul68Gnnx7GYz976+udfEX1g42wk+ReRziVSiEBj/GJNXxfWFs6BTwNcbXsfgonaSxNF02Np434imevjAKgiqpg4BiPIyjXYG9bB4qXQ0QGFIiBoNYIqKJK2Ca40hStVqJwdYvzN05SOnAcnqdiSwRhkQcuk7LCEsgmVFLxqCJBlPQQPPALXrOB/uVqBjntuZerkJQb2HKTcP4qmFEyVjOFO0V0bzxCxhEihohApLOqBR56C1jaYKKHHjuDefRc3PIorTaFqUA1wGqAxJJMxTiy0tKEEBN1dhCsW07JuJVIMceNT9H9lP+X+sUY/DFgKMg80VUBABHY+7MFP/AOe/C46OIKqzW6XmitpNlfuXTo76XpiB4VrF7Bo1yb6v7wfXH0CSqchkAJWIBQIgevWwrJVkMTw9A9hbAgjcd2dYCRBpmmrvrd/+ibmPXYPQVvI5R+8CArFVQtpW9udGyvEWEIJagYE1qzzBM+cgMEBTwwwUZIZTQAjgA29alGcxV7aWpj90BYQb9T39vyKqb6zzFi9hPYblzL51rmaEUWwhKn0VQN2Lfa/p/u8ItXQqCJxjGltI/jMVuRj65HuRQC48xeovPo65d8eJp4oEfWdIrxuOZW/9WEkIfrnADNWL6FwdSciMYJgEEQEi/WLe1oCszr98/gQvi/lqyDdVxN8ey90deccb67qprh9M4UNH2Xs8R8x8s29aKGdZCLGiCXuv+DHtRUw4pVEfXZawroUVIXA+lXLo5n8KFBsg0f3wvxuGDiLe/6XuN4+HBZdfT3htm2YRd3MfPzrjDz0PZKJcYz4tdyVEQCC9iJG4poHyRSgBmRSUFeuKaDApq0e/Mp7sPtBZHQC1IJa9E+DTB09RvHHT2G6u2i5ayMT+w9kniGe8phWUgJptiEY734hywRjUobqPRDi+26+3be//AuYGkdMks+K8StEL/wagML6W5C6TJGUAODHk7ZLjMXWGQ1qBExSUyCwMDeN+6neWmZUEuo2VLTvbd++aCEm1Cw7JI4yiY3EqQW8EW0tzmkxqq5npOaBpM5xllxoTJRKiuCkNtAQgxgvc1jFd6kykpZjMNg6+UMhK1WhqYXGJDDknUzPB/OhSeMqEhOsXuVxzg9gXKVWqKof4lxzUct5wAqZIwPjv7baf+wPvv1TX4TZs1LSKZEAzKxWgru3e8Fe+2MORAo+rKIujX+tGtpcsUnjBMCMggeuhubNl+CG26GzGx7+Cfz+59B3DCLg2uuRzfdDxxy4OIAeeCnLd0UwhSALQVYHsog2FBtcapjWmeRStDIB+3fDtj0w/yrYuZum6+J59IlHMeVxVGy69VIjEEe1OgCoSmMhAipXUgKd+UKkwMg5+NmDcNNm+NAGmL/EK3TpLPz1MBx4ERktIRKQiu5N2DXHL3NlOKsDimCMSHMhKp33z10rvQe0oT+ahNeeg8P7wAU+BOXInyVihVD8xpWdgsAsW+qnDwz4LEBSgqjxRqrLhKFjvmv+apjZmbqdfKZkRSsBE+fNWpcZRmLMgrkE624EwB090riFi8FKyS+QLjLSC8MnISjAx3dBx8LaWWE6IvVniQYiZuEC7GPfh8Di+o6jx//edHYQfetz7xDpyuw4Fim0LId1eyBsg6QCl/vg0jtQGoaJMZic9MUpwcsea/quYGZA+1xYvgbW3gxBAGOjxN/5Fsnpc/nTM+EF0be37CPSezPwKpGWZfCBr0JHT7Pb/5vrZC/60ydx/WemOd6HhywFOQTcm8sEgIl++Ms3oH0FzPsItC+BwmywLbWtu35O9S5PwsgQDJyGo2/AiePIlMOkZTl/qpKXRU/tLFIZ7yXS5UTkVWh8jmh4b+xXqPC+fZoE9X9qLhYnO3qMLH+2TGi+RijOm4xmt2eGqzNr4x6SvVPbJxr66rbwSExynxzaVzIAcs0LvyM02whl2E/4/xExklxGkzuLvzn4CtQXZUBPb++kVNlBzG1EyTymmEOsc4goEukMKto6vfxNoZmkomUiLVPRISIdJNZBKryKjZ6RZ/48VsX8D5388wZ7lLs0AAAAAElFTkSuQmCC',
  linkedin: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAPzAAAD8wF1XGupAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAANJQTFRF////AG22AIC/AHW1AHq4AH27AHq5AHq5AHq6AHq5AHq5AHq5AHq5AHq5AHq5AHq5AHq5AHq5BHy6CH67CX+7C4C8DIC8DYG8D4K9E4O9Goe/HonAIYrBIovBLJDENZTGPJjHP5rIR53KTKDLUaLMWabOYKrQa6/SbbDTcLLTdrXVd7XVhr3ZiL7Zib7Zl8XdmMbdmcbdo8vfpczgps3grtHisdLjs9Pjt9XkuNblvdjmw9vn1OPr1eTr2Obs3Ojt4uru5uzv6e7w7PDx8PLy8fLygYYNQgAAABF0Uk5TAAcIGBktSYSXmMHI2uPy8/XVqDFbAAABIUlEQVQ4y4VT6ULCMAzuBvQYY1sU8Va8L2Qq3k48+/6vZGy7iWSj348czdc2TRPGKgRcRXGaxpHiAaNoywQqJLI9Fw5FBv+QiXA23uoCQbf1F+/0oAa9TrW/No4Md0Zoz19ZorfYPIRxxp9vR4QhzPtM/lvfWr8SQvb7WmnMwYfWDzQNifVz9dm7GW9TQhIwDgvBmbJGP8/zc1hHeTo4nrxc7ziCYpE11rTWz7CJ8vEJhf46tOsRi+cJDtO+WY9ZSgi3w7N3VPtmPaWE6TLACPWJI5Ar7tE7QD1yV5Ak79Abor50SarFBFUWqonAy1I3ELDU7rMaCLL67tWiKCawgfIKvV3UF+V3u4aphZhtuRq4lvM2rb/t/YPjHz3/8DaP/w/O0lQZAu+37AAAAABJRU5ErkJggg==',
};

function firstNonEmptyEnv(...values) {
  for (const value of values) {
    const normalized = String(value || '').trim();
    if (normalized) {
      return normalized;
    }
  }
  return '';
}

function escapeHtml(input) {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailShell({ title, subtitle, bodyHtml }) {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#111;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;">
      <tr>
        <td align="center">
          <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:${BRAND_DARK};padding:20px 28px;">
                <div style="font-size:32px;font-weight:800;letter-spacing:0.5px;color:${BRAND_ACCENT};">${BRAND_NAME}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 10px;font-size:34px;line-height:1.1;color:#111;">${escapeHtml(title)}</h1>
                <p style="margin:0 0 22px;font-size:16px;line-height:1.5;color:#374151;">${escapeHtml(subtitle)}</p>
                ${bodyHtml}
                <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#4b5563;"><em>This is an automated message, please do not reply.</em></p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;border-top:1px solid #e5e7eb;">
                <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#4b5563;">
                  Keep your account secure. Never share verification codes with anyone.
                </p>
                <p style="margin:0;font-size:12px;line-height:1.5;color:#6b7280;">
                  © ${new Date().getUTCFullYear()} ${BRAND_NAME}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

function resolveTransportConfig() {
  const resendApiKey = firstNonEmptyEnv(process.env.RESEND_API_KEY, process.env.RESEND);
  const resendFromEmail = firstNonEmptyEnv(
    process.env.RESEND_FROM_EMAIL,
    process.env.MAIL_FROM,
    process.env.SMTP_FROM_EMAIL
  );
  const smtpHost = firstNonEmptyEnv(process.env.SMTP_HOST);
  const smtpPortRaw = String(process.env.SMTP_PORT || '').trim();
  const smtpUser = firstNonEmptyEnv(process.env.SMTP_USER);
  const smtpPass = firstNonEmptyEnv(process.env.SMTP_PASS);
  const smtpFromEmail = firstNonEmptyEnv(process.env.SMTP_FROM_EMAIL, process.env.MAIL_FROM);
  const smtpSecureRaw = String(process.env.SMTP_SECURE || '')
    .trim()
    .toLowerCase();
  const gmailUser = firstNonEmptyEnv(process.env.GMAIL_USER);
  const gmailAppPassword = firstNonEmptyEnv(process.env.GMAIL_APP_PASSWORD);

  if (!providerConfigLogged) {
    providerConfigLogged = true;
    console.log('[auth-email] runtime provider env detection', {
      hasResendApiKey: Boolean(resendApiKey),
      hasResendFromEmail: Boolean(resendFromEmail),
      hasResendAliasKey: Boolean(String(process.env.RESEND || '').trim()),
      hasMailFromAlias: Boolean(String(process.env.MAIL_FROM || '').trim()),
      hasSmtpHost: Boolean(smtpHost),
      hasSmtpUser: Boolean(smtpUser),
      hasSmtpPass: Boolean(smtpPass),
      hasSmtpFromEmail: Boolean(smtpFromEmail),
      hasGmailUser: Boolean(gmailUser),
      hasGmailAppPassword: Boolean(gmailAppPassword),
      nodeEnv: String(process.env.NODE_ENV || 'development')
    });
  }

  if (resendApiKey && resendFromEmail) {
    return {
      provider: 'resend',
      resendApiKey,
      fromEmail: resendFromEmail
    };
  }

  if (smtpHost && smtpUser && smtpPass) {
    const parsedPort = Number.parseInt(smtpPortRaw || '587', 10);
    const smtpPort = Number.isFinite(parsedPort) ? parsedPort : 587;
    const secure = smtpSecureRaw ? smtpSecureRaw === 'true' : smtpPort === 465;
    return {
      provider: 'smtp',
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      }),
      fromEmail: smtpFromEmail || smtpUser
    };
  }

  if (gmailUser && gmailAppPassword) {
    return {
      provider: 'gmail',
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword
        }
      }),
      fromEmail: gmailUser
    };
  }

  return { provider: 'none', fromEmail: '' };
}

async function sendViaProvider({ to, subject, text, html }) {
  const cfg = resolveTransportConfig();
  if (cfg.provider === 'none' || !cfg.fromEmail) {
    return { delivered: false, reason: 'missing_email_provider_config' };
  }

  if (cfg.provider === 'resend') {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: cfg.fromEmail,
          to: [to],
          subject,
          html,
          text
        })
      });

      if (response.ok) {
        return { delivered: true, reason: 'sent_via_resend' };
      }
      const errorText = await response.text();
      return { delivered: false, reason: `resend_error:${errorText}` };
    } catch (error) {
      return { delivered: false, reason: `resend_error:${error.message}` };
    }
  }

  try {
    await cfg.transporter.sendMail({
      from: cfg.fromEmail,
      to,
      subject,
      text,
      html
    });
    return { delivered: true, reason: `sent_via_${cfg.provider}` };
  } catch (error) {
    return { delivered: false, reason: `smtp_error:${error.message}` };
  }
}

const BRAND_LOGO_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAaVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////2jxWAgIBbNQff398hIB5AQECfn59gYGC/v797SAsQDw7v7+9wcHDPz8+QkJBQUFCvr68wMDCPj4+1aQ9+a1RQMaPeAAAADHRSTlMA3yCZEO9luYBQz0A9u/KtAAAEGklEQVR42u3d247jKBCAYTA+p6rd4MNgO4feff+HXGluUDQ7gXSIcNXyv8EnMHYcI4SnsqtVIyUkrOob1Z5K8XwOoSQcJqm6n2FOTQVHS3VPD0ZbwSGTdUGb4ZKtCK2WcOhkLUIqGjh8TSG81RUQqPINSqmASEo8quiBTH3xwCGBULLwOAhLnIO2xDlYSHogWF/+4VDgicgqXAPRanFXUQHRquIO0gDZGs/Eojm5JBBOupWrBdK1nlshmarSXSE8hkQC8Srxuw7Id/I8nNC6l5RAv6p8ZmZ9fn/8ve9PSFn3xMz69fG4X5AwFb5m2Q9fBtIlwy+RTw8j8ZCU4sQD0omWB6QWigdEiYYHpBE9D4gUFRcI8IBAhmRIhmRIhmRIhmRIhmRIhmRIhmRIhmRIhmRIhmRIhvyPIYYLBL65QOw3cYjLfD7snymor2Eebwkh/gZ8ov273YhDXHq6EIe41mkkDnHpmTzEUchDHIU4xKUNcYhr4AJBbYhDXBsXCH5xgeBimUBQG+oQJ6EOcRImENwtEwheuUBw4ALBmQtkNUwguHCB4MYFshomEFy4QHDkAlm4QHDkAlm4QHBMBNkwcksiyIixs2kgsGDkhkQQO6WYW89DzNfy9yYDAGBGT5fhumJ45h2Q2xrpMe+yYGjbOyAaH7daCM3o+HNLxFuTtvj3nPUNkDnuL+1xxZBuh4fALUiyHR8CFwxoIgCBM/rbKUCsRm8rAUjY5LIUILCiN0MCMqC3kQTEoLcLAUjQ3JppQK5cIBMXyMAGwuViPzNZfuHKBbIzubNb9AYkIDP1x/jwN3oLCYhBb2cSkAm9XVJAznGukPRvURZ4KqOP+l5rtfBEdkd/1yQQHGI7cE4DWc0T8yrZ23gb85OxbcWQdngDBM6xPuOzs8awtrdAYNDoz7cfxMxfK4Zm4kJc5r8b74n6QYf/V3dbMX5zAggYjbHTkAICt7QDAuKwX3BoSASxSQcExFE/fNCQDHKOOyBMPgXcgQnEMIEMwAOigQdkNUwgM/CADMADcgUekN3m7Xt5Q2VEiHOwgOwWWEAmABaQAVhA9AivJORBIIuFV6oOAlk3eK1eNEeAnC28WCNUesgywsspUSeARGO4WtElgERjuE6iTLjHah0sRKoUQibaY6XPY9Qj0pJc7XraDMRMxT2gcvZultH7dN5G+5ZjBMsK6Fd6jmumdSb4CcjXid9VQDzJ4MRmd4w2g8tdFtwO0RalBMJJNgfNczz6XxQVEK0qxF018YnlUnQfTu4reyBYL/6skCRvhR4JTYeTUHc4CXGHk/RApv7eQXYVVqV4XF0BgapaeCsaOHxNIUKqJRw6WYvQ2gNTqrYU4RW1JM5wdep4iuYkflLZKQmHSaquFD+vPLWq6aukAtmo2ov4FyDASiGoxnN6AAAAAElFTkSuQmCC';

function buildBitegitHeader() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#181a20;border-radius:4px;overflow:hidden;"><tr><td style="padding:24px 28px 20px;text-align:center;background:#000;"><table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="padding-right:10px;vertical-align:middle;"><img src="data:image/png;base64,${BRAND_LOGO_B64}" width="40" height="40" alt="${BRAND_NAME}" style="display:block;border-radius:4px;"/></td><td style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:1px;vertical-align:middle;">${BRAND_NAME}</td></tr></table></td></tr>`;
}

function buildBitegitFooter() {
  const year = new Date().getFullYear();
  return `<tr><td style="padding:24px 28px 28px;border-top:1px solid #2a2d35;background:#181a20;">
<p style="margin:0 0 4px;font-size:13px;color:#aaa;">Any question or in need of help?</p>
<p style="margin:0 0 4px;font-size:13px;color:#aaa;">You can refer to <a href="https://bitcovex.com/support" style="color:${BRAND_ACCENT};text-decoration:none;">Help center</a> or send email <a href="mailto:support@bitcovex.com" style="color:${BRAND_ACCENT};text-decoration:none;">support@bitcovex.com</a> to contact us</p>
<p style="margin:0 0 14px;font-size:13px;color:#aaa;">Follow our <a href="https://twitter.com/bitcovex" style="color:${BRAND_ACCENT};text-decoration:none;">X(Twitter)</a> for more ${BRAND_NAME} updates.</p>
<p style="margin:0 0 18px;font-size:12px;color:#666;">* This email is sent automatically and you do not need to reply.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr><td style="border-left:3px solid ${BRAND_ACCENT};padding-left:12px;"><span style="font-size:13px;color:#aaa;font-weight:600;">Security Reminder: ${BRAND_NAME} official staff will never ask for your verification code.</span></td></tr></table>
<p style="margin:0 0 14px;font-size:15px;color:#fff;font-weight:700;text-align:center;">Download the <strong>${BRAND_NAME}</strong> App now<br/><span style="font-weight:400;font-size:14px;color:#aaa;">Stay updated on the go!</span></p>
<table cellpadding="0" cellspacing="0" style="margin:0 auto 22px auto;"><tr>
  <td style="padding-right:10px;">
    <a href="#" style="display:inline-block;background:#000;border-radius:10px;padding:10px 20px;text-decoration:none;border:1px solid #333;min-width:140px;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="padding-right:8px;vertical-align:middle;"><img src="${SOCIAL_ICONS.playstore}" width="28" height="28" alt="Google Play" style="display:block;border:0;"/></td>
        <td style="vertical-align:middle;">
          <span style="display:block;font-size:9px;color:#ccc;letter-spacing:0.5px;line-height:1.4;">GET IT ON</span>
          <span style="display:block;font-size:16px;color:#fff;font-weight:700;font-family:Arial,sans-serif;line-height:1.3;">Google Play</span>
        </td>
      </tr></table>
    </a>
  </td>
  <td>
    <a href="#" style="display:inline-block;background:#000;border-radius:10px;padding:10px 20px;text-decoration:none;border:1px solid #333;min-width:140px;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="padding-right:8px;vertical-align:middle;"><img src="${SOCIAL_ICONS.appstore}" width="28" height="28" alt="App Store" style="display:block;border:0;"/></td>
        <td style="vertical-align:middle;">
          <span style="display:block;font-size:9px;color:#ccc;letter-spacing:0.5px;line-height:1.4;">Download on the</span>
          <span style="display:block;font-size:16px;color:#fff;font-weight:700;font-family:Arial,sans-serif;line-height:1.3;">App Store</span>
        </td>
      </tr></table>
    </a>
  </td>
</tr></table>
<table cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;"><tr>
  <td style="padding-right:8px;"><a href="https://bitegit.com" style="display:inline-block;width:36px;height:36px;background:#00b8d4;border-radius:50%;text-align:center;text-decoration:none;line-height:36px;font-size:13px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">B</a></td>
  <td style="padding-right:8px;"><a href="#" style="display:inline-block;width:36px;height:36px;text-decoration:none;"><img src="${SOCIAL_ICONS.telegram}" width="36" height="36" alt="Telegram" style="display:block;border:0;border-radius:50%;"/></a></td>
  <td style="padding-right:8px;"><a href="#" style="display:inline-block;width:36px;height:36px;text-decoration:none;"><img src="${SOCIAL_ICONS.facebook}" width="36" height="36" alt="Facebook" style="display:block;border:0;border-radius:50%;"/></a></td>
  <td style="padding-right:8px;"><a href="#" style="display:inline-block;width:36px;height:36px;background:#000;border-radius:50%;text-align:center;text-decoration:none;line-height:36px;font-size:14px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">𝕏</a></td>
  <td style="padding-right:8px;"><a href="#" style="display:inline-block;width:36px;height:36px;text-decoration:none;"><img src="${SOCIAL_ICONS.youtube}" width="36" height="36" alt="YouTube" style="display:block;border:0;border-radius:50%;"/></a></td>
  <td style="padding-right:8px;"><a href="#" style="display:inline-block;width:36px;height:36px;text-decoration:none;"><img src="${SOCIAL_ICONS.instagram}" width="36" height="36" alt="Instagram" style="display:block;border:0;border-radius:50%;"/></a></td>
  <td><a href="#" style="display:inline-block;width:36px;height:36px;text-decoration:none;"><img src="${SOCIAL_ICONS.linkedin}" width="36" height="36" alt="LinkedIn" style="display:block;border:0;border-radius:50%;"/></a></td>
</tr></table>
<p style="margin:0 0 8px;font-size:12px;color:#888;line-height:1.6;">Note: Online support and staff of ${BRAND_NAME} will never require your account's private information in any mail or communication and social tools, so please do not reveal your account information to anyone.</p>
<p style="margin:0;font-size:12px;color:#888;">@2018-${year} ${BRAND_NAME}.com reserves all rights.</p>
</td></tr></table></td></tr></table></body></html>`;
}

function createOtpTemplate({ title, code, expiresInMinutes, note, maskedEmail = '' }) {
  return buildBitegitHeader() + `
<tr><td style="padding:28px 28px 20px;background:#1a1a1a;">
  <p style="margin:0 0 16px;font-size:14px;color:#ccc;">Dear ${BRAND_NAME} user:</p>
  <p style="margin:0 0 16px;font-size:14px;color:#ccc;line-height:1.7;">You are performing an account verification. Please use the following verification code to complete the process: ${escapeHtml(String(code))}</p>
  <p style="margin:0 0 20px;font-size:14px;color:#ccc;line-height:1.7;">This code is valid for ${Number(expiresInMinutes)} minutes. Please complete the verification as soon as possible.</p>
  <div style="display:inline-block;background:${BRAND_ACCENT};border-radius:4px;padding:6px 16px;margin-bottom:20px;">
    <span style="font-size:20px;font-weight:800;color:#000;letter-spacing:3px;">${escapeHtml(String(code))}</span>
  </div>
  <p style="margin:0 0 12px;font-size:13px;color:#aaa;line-height:1.7;">Security Reminder: Do not disclose your verification code to anyone. ${BRAND_NAME} official staff will never ask for your verification code. Please ensure you are visiting the official ${BRAND_NAME} website.</p>
  <p style="margin:0 0 20px;font-size:13px;color:#aaa;">Please add this email to your contacts to ensure delivery.</p>
  <p style="margin:0 0 8px;font-size:13px;color:#aaa;font-weight:600;">Security Reminder:</p>
  <p style="margin:0 0 6px;font-size:13px;color:#aaa;">Do not disclose your verification code to anyone.</p>
  <p style="margin:0 0 6px;font-size:13px;color:#aaa;">${BRAND_NAME} official staff will never ask for your verification code.</p>
  <p style="margin:0 0 6px;font-size:13px;color:#aaa;">Please ensure you are visiting the official ${BRAND_NAME} website.</p>
  <p style="margin:0 0 20px;font-size:13px;font-weight:700;color:#ccc;">Please add this email to your contacts to ensure delivery.</p>
  <p style="margin:0 0 6px;font-size:13px;color:#aaa;">Thank you for your support and trust in ${BRAND_NAME}.</p>
  <p style="margin:0 0 16px;font-size:13px;color:#aaa;">${BRAND_NAME} TEAM</p>
  <p style="margin:0 0 0;font-size:12px;color:#666;">The message was sent automatically by the system. Please do not reply to this message.</p>
</td></tr>
` + buildBitegitFooter();
}

function createNewDeviceTemplate({ email, loginTimeUtc, ipAddress, userAgent, location }) {
  const maskedEmail = String(email).replace(/^(.{4}).*(@.*)$/, '$1****$2');
  return buildBitegitHeader() + `
<tr><td style="padding:28px 28px 0;background:#181a20;">
  <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
    <span style="font-size:20px;margin-right:8px;">⚠️</span>
    <span style="font-size:14px;font-weight:700;color:#856404;">New Device or Location Login Detected</span>
  </div>
  <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;">New Device Login Alert</h1>
  <p style="margin:0 0 18px;font-size:14px;color:#aaa;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 16px;font-size:14px;color:#ccc;line-height:1.7;">We detected a login to your account from a new device or IP address. If this was you, no action is needed. If not, <strong style="color:#e53935;">reset your password immediately.</strong></p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr><td style="background:#f8f8f8;border-radius:6px;padding:18px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:6px 0;font-size:14px;color:#333;width:130px;vertical-align:top;">Login time:</td><td style="padding:6px 0;font-size:14px;color:'#F68F15';font-weight:500;">${escapeHtml(loginTimeUtc)}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">IP Address:</td><td style="padding:6px 0;font-size:14px;color:'#F68F15';font-weight:500;">${escapeHtml(ipAddress)}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">Device:</td><td style="padding:6px 0;font-size:14px;color:'#F68F15';font-weight:500;word-break:break-all;">${escapeHtml(userAgent)}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">Location:</td><td style="padding:6px 0;font-size:14px;color:'#F68F15';font-weight:500;">${escapeHtml(location)}</td></tr>
      </table>
    </td></tr>
  </table>
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;font-weight:600;">Secure my account</a></p>
  <p style="margin:0 0 28px;font-size:13px;color:#888;">* This email is sent automatically and you do not need to reply.</p>
</td></tr>
` + buildBitegitFooter();
}

function createAuthEmailService() {
  async function sendSignupOtpEmail(email, code, { expiresInMinutes = 10 } = {}) {
    const subject = `[${BRAND_NAME}] Signup Verification - ${new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)')}`;
    const text = `Your ${BRAND_NAME} signup verification code is ${code}. It is valid for ${expiresInMinutes} minutes.`;
    const html = createOtpTemplate({
      title: 'Signup Verification',
      code,
      expiresInMinutes,
      note: 'Do not share this code with anyone.'
    });
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendForgotPasswordOtpEmail(email, code, { expiresInMinutes = 10 } = {}) {
    const subject = `[${BRAND_NAME}] Password Reset Verification - ${new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)')}`;
    const text = `Your ${BRAND_NAME} password reset code is ${code}. It is valid for ${expiresInMinutes} minutes.`;
    const html = createOtpTemplate({
      title: 'Password Reset Verification',
      code,
      expiresInMinutes,
      note: 'If you did not request this, secure your account immediately.'
    });
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendLoginOtpEmail(email, code, { expiresInMinutes = 10 } = {}) {
    const subject = `[${BRAND_NAME}] Login Verification - ${new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)')}`;
    const text = `Your ${BRAND_NAME} login verification code is ${code}. It is valid for ${expiresInMinutes} minutes.`;
    const html = createOtpTemplate({
      title: 'Login Verification',
      code,
      expiresInMinutes,
      note: 'Never share this code with anyone, including support.'
    });
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendNewDeviceLoginAlert(email, metadata = {}) {
    const loginTimeUtc = metadata.loginTimeUtc || new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)');
    const ipAddress = metadata.ipAddress || 'Unknown';
    const userAgent = metadata.userAgent || 'Unknown';
    const location = metadata.location || 'Unknown';
    const subject = `[${BRAND_NAME}] New Device or IP Login Alert - ${new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)')}`;
    const text = `New login detected.\nEmail: ${email}\nTime: ${loginTimeUtc}\nIP: ${ipAddress}\nDevice: ${userAgent}\nLocation: ${location}`;
    const html = createNewDeviceTemplate({
      email,
      loginTimeUtc,
      ipAddress,
      userAgent,
      location
    });
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendDepositSuccessEmail(email, summary = {}) {
    const amount = Number(summary.amount || 0);
    const asset = String(summary.asset || 'USDT').toUpperCase();
    const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
    const depositTime = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const subject = `[${BRAND_NAME}] ${asset} Deposit Successful`;
    const text = `${asset} Deposit Successful. Amount: ${amount} ${asset}.`;
    const html = buildBitegitHeader() + `
<tr><td style="padding:28px 28px 0;background:#181a20;">
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#fff;">Deposit successful</h1>
  <p style="margin:0 0 18px;font-size:14px;color:#aaa;">Hi ${escapeHtml(maskedEmail)},</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr><td style="background:#f8f8f8;border-radius:6px;padding:18px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:7px 0;font-size:14px;color:#333;white-space:nowrap;width:155px;vertical-align:top;">Transaction time:</td><td style="padding:7px 0;font-size:14px;color:'#F68F15';font-weight:500;">${escapeHtml(depositTime)}</td></tr>
        <tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Crypto received:</td><td style="padding:7px 0;font-size:14px;color:'#F68F15';font-weight:500;">${amount.toLocaleString(undefined,{maximumFractionDigits:8})} ${escapeHtml(asset)}</td></tr>
      </table>
    </td></tr>
  </table>
  <p style="margin:0 0 28px;font-size:14px;color:#444;">Go to your assets to check for details.</p>
</td></tr>
` + buildBitegitFooter();
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendWithdrawalSuccessEmail(email, summary = {}) {
    const amount = Number(summary.amount || 0);
    const asset = String(summary.asset || 'USDT').toUpperCase();
    const address = String(summary.address || 'N/A');
    const txId = String(summary.transactionId || 'N/A');
    const fee = Number(summary.fee || 0);
    const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
    const withdrawalTime = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const subject = `[${BRAND_NAME}] ${asset} Withdrawal Successful`;
    const text = `${asset} Withdrawal Successful. Amount: ${amount} ${asset}. Address: ${address}. TxId: ${txId}`;
    const html = buildBitegitHeader() + `
<tr><td style="padding:28px 28px 0;background:#181a20;">
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#fff;">Withdrawal successful</h1>
  <p style="margin:0 0 18px;font-size:14px;color:#aaa;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:15px;color:#333;line-height:1.6;">Withdrawal has been successful. Check the details below:</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr><td style="background:#f8f8f8;border-radius:6px;padding:18px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:7px 0;font-size:14px;color:#333;white-space:nowrap;width:155px;vertical-align:top;">Withdrawal time:</td><td style="padding:7px 0;font-size:14px;color:'#F68F15';font-weight:500;">${escapeHtml(withdrawalTime)}</td></tr>
        <tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Amount:</td><td style="padding:7px 0;font-size:14px;color:'#F68F15';font-weight:500;">${amount.toLocaleString(undefined,{maximumFractionDigits:8})} ${escapeHtml(asset)}</td></tr>
        <tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Withdrawal address:</td><td style="padding:7px 0;font-size:14px;color:'#F68F15';font-weight:500;word-break:break-all;">${escapeHtml(address)}</td></tr>
        <tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">TxID:</td><td style="padding:7px 0;font-size:14px;color:'#F68F15';font-weight:500;word-break:break-all;">${escapeHtml(txId)}</td></tr>
        ${fee > 0 ? `<tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Transaction fees:</td><td style="padding:7px 0;font-size:14px;color:'#F68F15';font-weight:500;">${fee} ${escapeHtml(asset)}</td></tr>` : ''}
      </table>
    </td></tr>
  </table>
  <p style="margin:0 0 28px;font-size:13px;color:#888;">*This is an automated email notification.</p>
</td></tr>
` + buildBitegitFooter();
    return sendViaProvider({ to: email, subject, text, html });
  }

  return {
    sendSignupOtpEmail,
    sendForgotPasswordOtpEmail,
    sendLoginOtpEmail,
    sendNewDeviceLoginAlert,
    sendDepositSuccessEmail,
    sendWithdrawalSuccessEmail
  };
}

module.exports = {
  createAuthEmailService
};
