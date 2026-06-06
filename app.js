// ── LOGIN ────────────────────────────────────────
function doLogin() {
  const user = document.getElementById('l-user').value.trim().toLowerCase();
  const pass = document.getElementById('l-pass').value;
  const err  = document.getElementById('login-error');

  if (USERS[user] && USERS[user] === pass) {
    sessionStorage.setItem('sp_auth', user);
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').style.display   = 'block';
    renderDash();
  } else {
    err.textContent = 'Usuario o contraseña incorrectos';
    document.getElementById('l-pass').value = '';
    setTimeout(() => { err.textContent = ''; }, 3000);
  }
}

function doLogout() {
  sessionStorage.removeItem('sp_auth');
  document.getElementById('app-screen').style.display   = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('l-user').value = '';
  document.getElementById('l-pass').value = '';
}

// Enter key en login
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('login-screen').style.display !== 'none') {
    doLogin();
  }
});

// Auto-login si ya estaba autenticado
window.addEventListener('load', () => {
  if (sessionStorage.getItem('sp_auth')) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').style.display   = 'block';
    renderDash();
  }
});

// ── STATE ────────────────────────────────────────
let bets = [];
try { bets = JSON.parse(localStorage.getItem('sp_bets') || '[]'); } catch(e) {}
let curSport  = null;
let curLeague = null;
let showForm  = false;

// ── HELPERS ──────────────────────────────────────
function getAllMatch(id) {
  for (const [lid, ms] of Object.entries(MATCHES)) {
    const m = ms.find(x => x.id === id);
    if (m) return { ...m, lid };
  }
  return null;
}

function getLeagueName(lid) {
  for (const s of SPORTS) {
    const l = s.leagues.find(x => x.id === lid);
    if (l) return l.name;
  }
  return lid;
}

function getSportClass(lid) {
  return 'sport-' + (LEAGUE_SPORT[lid] || 'soccer');
}

function getChipClass(lid) {
  return LEAGUE_SPORT[lid] || 'soccer';
}

function confLabel(conf) {
  const map = { high:'Alta', medium:'Media', low:'Baja' };
  return map[conf] || '';
}

function saveBets() {
  try { localStorage.setItem('sp_bets', JSON.stringify(bets)); } catch(e) {}
}

// ── NAVIGATION ───────────────────────────────────
function go(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('s-' + screen).classList.add('active');
  const nb = document.getElementById('nb-' + screen);
  if (nb) nb.classList.add('active');
  const fab = document.getElementById('fab');
  fab.style.display = screen === 'bets' ? 'flex' : 'none';
  if (screen === 'dash')   renderDash();
  if (screen === 'sports') renderSports();
  if (screen === 'bets')   renderBets();
}

// ── DASHBOARD ────────────────────────────────────
function renderDash() {
  const settled = bets.filter(b => b.result !== 'pending');
  const wins    = settled.filter(b => b.result === 'win').length;
  const wr      = settled.length ? Math.round(wins / settled.length * 100) : 0;
  const pl      = settled.reduce((s, b) => s + b.pl, 0);
  const hots    = HOT_IDS.map(getAllMatch).filter(Boolean);

  document.getElementById('s-dash').innerHTML = `
    <div class="stats-grid">
      <div class="stat-tile t-roi">
        <div class="stat-num ${pl >= 0 ? 'g' : 'r'}">${pl >= 0 ? '+' : '-'}$${Math.abs(pl).toFixed(0)}</div>
        <div class="stat-lbl">ROI Total</div>
      </div>
      <div class="stat-tile t-wr">
        <div class="stat-num a">${wr}%</div>
        <div class="stat-lbl">Aciertos</div>
      </div>
      <div class="stat-tile t-tot">
        <div class="stat-num b">${bets.length}</div>
        <div class="stat-lbl">Apuestas</div>
      </div>
      <div class="stat-tile t-win">
        <div class="stat-num g">${wins}</div>
        <div class="stat-lbl">Ganadas</div>
      </div>
    </div>
    <div class="sec-title">⚡ Picks Destacados</div>
    ${hots.map(pickCard).join('')}
  `;
}

// ── PICK CARD ────────────────────────────────────
function pickCard(m) {
  const sport  = LEAGUE_SPORT[m.lid] || 'soccer';
  const topH   = m.hp >= m.ap;
  const topA   = m.ap > m.hp;
  const topD   = !topH && !topA;
  const league = getLeagueName(m.lid);

  // color de probabilidades
  const hClass = topH ? 'g' : '';
  const aClass = topA ? (sport === 'basketball' ? 'b' : 'g') : '';
  const dClass = topD ? 'a' : '';

  return `
  <div class="pick-card sport-${sport}">
    <div class="pick-top">
      <span class="chip ${getChipClass(m.lid)}">${league}</span>
      ${m.note ? `<span class="chip note">${m.note}</span>` : ''}
      ${m.series ? `<span class="chip series">${m.series}</span>` : ''}
      ${m.conf ? `<span class="conf-badge ${m.conf}">${confLabel(m.conf)}</span>` : ''}
    </div>
    <div class="pick-match">
      <div class="pick-team">${m.home}</div>
      <div class="pick-vs ${m.score ? 'score' : ''}">${m.score || 'vs'}</div>
      <div class="pick-team right">${m.away}</div>
    </div>
    <div class="prob-row">
      <div class="prob-cell ${topH ? 'best' : ''}">
        <div class="pv ${hClass}">${m.hp}%</div>
        <div class="prob-bar-wrap"><div class="prob-bar home" style="width:${m.hp}%"></div></div>
        <div class="plb">Local</div>
      </div>
      ${m.dp > 0 ? `
      <div class="prob-cell ${topD ? 'best' : ''}">
        <div class="pv ${dClass}">${m.dp}%</div>
        <div class="prob-bar-wrap"><div class="prob-bar draw" style="width:${m.dp}%"></div></div>
        <div class="plb">Empate</div>
      </div>` : ''}
      <div class="prob-cell ${topA ? 'best' : ''}">
        <div class="pv ${aClass}">${m.ap}%</div>
        <div class="prob-bar-wrap"><div class="prob-bar away" style="width:${m.ap}%"></div></div>
        <div class="plb">Visit.</div>
      </div>
    </div>
    <div class="pick-foot">
      <div class="rec-txt">▶ <strong>${m.rec}</strong></div>
      <button class="analyze-btn" onclick="analyze(${m.id})">Analizar ↗</button>
    </div>
  </div>`;
}

// ── SPORTS ───────────────────────────────────────
function renderSports() {
  document.getElementById('s-sports').innerHTML = `
    <div class="sec-title">Deportes</div>
    <div class="sports-grid">
      ${SPORTS.map(s => `
        <div class="sport-card sc-${s.sport}" onclick="openLeagues('${s.id}')">
          <span class="sp-emoji">${s.emoji}</span>
          <div class="sp-name">${s.name}</div>
          <div class="sp-count">${s.leagues.length} liga${s.leagues.length > 1 ? 's' : ''}</div>
        </div>`).join('')}
    </div>`;
}

// ── LEAGUES ──────────────────────────────────────
function openLeagues(sid) {
  curSport = SPORTS.find(s => s.id === sid);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  document.getElementById('s-leagues').innerHTML = `
    <button class="back-btn" onclick="go('sports')">
      <span class="back-arrow">←</span> ${curSport.name}
    </button>
    ${curSport.leagues.map(l => {
      const ms      = MATCHES[l.id] || [];
      const upcoming = ms.filter(m => m.status === 's').length;
      return `
      <div class="league-row" onclick="openMatches('${l.id}')">
        <div class="league-info">
          <div class="lf">${l.flag}</div>
          <div>
            <div class="l-name">${l.name}</div>
            <div class="l-sub">${upcoming} próximo${upcoming !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <div class="l-arrow">›</div>
      </div>`;
    }).join('')}`;

  document.getElementById('s-leagues').classList.add('active');
}

// ── MATCHES ──────────────────────────────────────
function openMatches(lid) {
  curLeague = curSport.leagues.find(l => l.id === lid);
  const ms       = MATCHES[lid] || [];
  const upcoming = ms.filter(m => m.status === 's');
  const finals   = ms.filter(m => m.status === 'f');
  const sport    = LEAGUE_SPORT[lid] || 'soccer';

  let html = `
    <button class="back-btn" onclick="openLeagues('${curSport.id}')">
      <span class="back-arrow">←</span> ${curLeague.flag} ${curLeague.name}
    </button>`;

  if (upcoming.length) html += `<div class="sec-title">Próximos</div>` + upcoming.map(m => matchRow(m, sport)).join('');
  if (finals.length)   html += `<div class="sec-title">Resultados recientes</div>` + finals.map(m => matchRow(m, sport)).join('');
  if (!ms.length)      html += `<div class="empty"><div class="empty-icon">📭</div><div>Sin partidos disponibles</div></div>`;

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('s-matches').innerHTML = html;
  document.getElementById('s-matches').classList.add('active');
}

function matchRow(m, sport = 'soccer') {
  const isFinal = m.status === 'f';
  const topH    = !isFinal && m.hp >= m.ap;
  const topA    = !isFinal && m.ap > m.hp;
  const topD    = !isFinal && !topH && !topA;

  return `
  <div class="match-row sport-${sport} ${isFinal ? 'final-row' : ''}">
    <div class="mr-top">
      ${isFinal ? '<span class="chip final">Final</span>' : ''}
      ${m.series ? `<span class="chip series">${m.series}</span>` : ''}
      ${m.note   ? `<span class="chip note">${m.note}</span>` : ''}
      ${(!isFinal && m.conf) ? `<span class="conf-badge ${m.conf}">${confLabel(m.conf)}</span>` : ''}
      <div class="mr-time">${m.date}</div>
    </div>
    <div class="mr-match">
      <div class="mr-team">${m.home}</div>
      <div class="mr-vs ${isFinal ? 'score' : ''}">${isFinal ? m.score : 'vs'}</div>
      <div class="mr-team r">${m.away}</div>
    </div>
    ${!isFinal ? `
    <div class="mr-probs">
      <div class="mr-pc ${topH ? 'top' : ''}">
        <div class="mr-pv ${topH ? 'g' : ''}">${m.hp}%</div>
        <div class="mr-pl2">Local</div>
      </div>
      ${m.dp > 0 ? `
      <div class="mr-pc ${topD ? 'top' : ''}">
        <div class="mr-pv ${topD ? 'a' : ''}">${m.dp}%</div>
        <div class="mr-pl2">Empate</div>
      </div>` : ''}
      <div class="mr-pc ${topA ? 'top' : ''}">
        <div class="mr-pv ${topA ? 'g' : ''}">${m.ap}%</div>
        <div class="mr-pl2">Visit.</div>
      </div>
    </div>
    <div class="mr-foot">
      <div class="mr-rec">▶ <strong>${m.rec}</strong></div>
      <button class="mr-btn" onclick="analyze(${m.id})">Analizar ↗</button>
    </div>` : ''}
  </div>`;
}

// ── BETS ─────────────────────────────────────────
function toggleForm() {
  showForm = !showForm;
  document.getElementById('fab').textContent = showForm ? '✕' : '+';
  renderBets();
}

function renderBets() {
  let html = '';

  if (showForm) html += `
    <div class="add-form">
      <div class="af-title">Nueva apuesta</div>
      <div class="field">
        <label>Partido</label>
        <input id="f-m" type="text" placeholder="Ej: Arsenal vs Burnley">
      </div>
      <div class="field">
        <label>Pick</label>
        <input id="f-p" type="text" placeholder="Ej: Local, Ambas marcan">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Cuota</label>
          <input id="f-o" type="number" step="0.01" placeholder="1.85">
        </div>
        <div class="field">
          <label>Stake $</label>
          <input id="f-s" type="number" placeholder="100">
        </div>
      </div>
      <div class="field">
        <label>Liga</label>
        <select id="f-l">
          <option>Premier League</option><option>La Liga</option>
          <option>Champions League</option><option>Liga MX</option>
          <option>NBA Playoffs</option><option>NHL</option>
          <option>NFL</option><option>MLS</option>
        </select>
      </div>
      <button class="sub-btn" onclick="addBet()">Guardar apuesta</button>
    </div>`;

  if (bets.length) {
    html += `<div class="sec-title" style="padding-top:${showForm ? '6' : '18'}px">Historial</div>`;
    html += bets.map(b => `
      <div class="bet-item">
        <div class="bi-top">
          <div class="bi-match">${b.match}</div>
          <div class="bi-pl ${b.pl > 0 ? 'pos' : b.pl < 0 ? 'neg' : ''}">
            ${b.pl > 0 ? '+' : b.pl < 0 ? '-' : ''}$${Math.abs(b.pl).toFixed(0)}
          </div>
        </div>
        <div class="bi-meta">
          <span>${b.pick}</span><span>·</span>
          <span>${b.league}</span><span>·</span>
          <span>@${b.odds}</span><span>·</span>
          <span>$${b.stake}</span>
          <div class="bi-res">
            ${b.result === 'pending'
              ? `<button class="rb g" onclick="setRes(${b.id},'win')">Ganada</button>
                 <button class="rb l" onclick="setRes(${b.id},'loss')">Perdida</button>`
              : `<span class="badge ${b.result === 'win' ? 'win' : 'loss'}">
                   ${b.result === 'win' ? 'Ganada' : 'Perdida'}
                 </span>`}
          </div>
        </div>
      </div>`).join('');
  } else {
    html += `<div class="empty"><div class="empty-icon">📋</div><div>Sin apuestas registradas</div></div>`;
  }

  document.getElementById('s-bets').innerHTML = html;
}

function addBet() {
  const match  = document.getElementById('f-m').value.trim();
  const pick   = document.getElementById('f-p').value.trim();
  const odds   = parseFloat(document.getElementById('f-o').value);
  const stake  = parseFloat(document.getElementById('f-s').value);
  const league = document.getElementById('f-l').value;
  if (!match || !pick || !odds || !stake) return;
  bets.unshift({ id: Date.now(), match, pick, league, odds, stake, result: 'pending', pl: 0 });
  saveBets();
  showForm = false;
  document.getElementById('fab').textContent = '+';
  renderBets();
}

function setRes(id, result) {
  const b = bets.find(x => x.id === id);
  if (!b) return;
  b.result = result;
  b.pl = result === 'win'
    ? parseFloat(((b.odds - 1) * b.stake).toFixed(2))
    : -b.stake;
  saveBets();
  renderBets();
  renderDash();
}

// ── ANALYZE (via chat) ───────────────────────────
function analyze(id) {
  const m = getAllMatch(id);
  if (!m) return;
  const liga   = getLeagueName(m.lid);
  const series = m.series ? `\nSerie: ${m.series}` : '';
  const note   = m.note   ? `\nNota: ${m.note}`   : '';
  alert(`Análisis disponible en el chat de Claude.\n\n${m.home} vs ${m.away} — ${liga}${series}${note}\nLocal: ${m.hp}% | Empate: ${m.dp || 'N/A'}% | Visit.: ${m.ap}%`);
}
