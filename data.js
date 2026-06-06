// ── CREDENTIALS (cambia estas a las tuyas) ───────
const USERS = {
  'arturo': 'peecks2024',   // usuario: contraseña
  'admin':  'sp_admin',     // puedes agregar más
};

// ── SPORTS & LEAGUES ─────────────────────────────
const SPORTS = [
  { id:'soccer',     name:'Fútbol',    emoji:'⚽', sport:'soccer', leagues:[
    { id:'pl',  name:'Premier League',   flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id:'ll',  name:'La Liga',          flag:'🇪🇸' },
    { id:'ucl', name:'Champions League', flag:'🇪🇺' },
    { id:'mx',  name:'Liga MX',          flag:'🇲🇽' },
    { id:'mls', name:'MLS',              flag:'🇺🇸' },
  ]},
  { id:'basketball', name:'Basketball', emoji:'🏀', sport:'basketball', leagues:[
    { id:'nba', name:'NBA Playoffs', flag:'🇺🇸' },
  ]},
  { id:'hockey',     name:'Hockey',    emoji:'🏒', sport:'hockey', leagues:[
    { id:'nhl', name:'NHL', flag:'🇺🇸' },
  ]},
  { id:'americano',  name:'Americano', emoji:'🏈', sport:'american', leagues:[
    { id:'nfl', name:'NFL', flag:'🇺🇸' },
  ]},
];

// ── HELPER: get sport id from league id ──────────
const LEAGUE_SPORT = {
  pl:'soccer', ll:'soccer', ucl:'soccer', mx:'soccer', mls:'soccer',
  nba:'basketball', nhl:'hockey', nfl:'american',
};

// confidence: 'high' | 'medium' | 'low'
// status: 's'=scheduled | 'f'=final
const MATCHES = {

  pl: [
    { id:1,  home:'Man City',    away:'Crystal Palace', date:'Mié 13:00 CST', status:'s', hp:82, dp:12, ap:7,  rec:'Local',     conf:'high' },
    { id:2,  home:'Aston Villa', away:'Liverpool',      date:'Vie 13:00 CST', status:'s', hp:33, dp:25, ap:43, rec:'Visitante', conf:'medium' },
    { id:3,  home:'Man United',  away:'Nottm Forest',   date:'Dom 05:30 CST', status:'s', hp:60, dp:21, ap:19, rec:'Local',     conf:'medium' },
    { id:4,  home:'Brentford',   away:'Crystal Palace', date:'Dom 08:00 CST', status:'s', hp:54, dp:24, ap:22, rec:'Local',     conf:'medium' },
    { id:5,  home:'Everton',     away:'Sunderland',     date:'Dom 08:00 CST', status:'s', hp:54, dp:25, ap:21, rec:'Local',     conf:'medium' },
    { id:6,  home:'Leeds',       away:'Brighton',       date:'Dom 08:00 CST', status:'s', hp:30, dp:26, ap:44, rec:'Visitante', conf:'low' },
    { id:7,  home:'Wolves',      away:'Fulham',         date:'Dom 08:00 CST', status:'s', hp:26, dp:25, ap:49, rec:'Visitante', conf:'low' },
    { id:8,  home:'Newcastle',   away:'West Ham',       date:'Dom 10:30 CST', status:'s', hp:48, dp:24, ap:28, rec:'Local',     conf:'medium' },
    { id:9,  home:'Arsenal',     away:'Burnley',        date:'Lun 13:00 CST', status:'s', hp:89, dp:8,  ap:3,  rec:'Local',     conf:'high' },
    { id:10, home:'Liverpool',   away:'Chelsea',        date:'Sáb — Final',   status:'f', score:'1-1' },
    { id:11, home:'Man City',    away:'Brentford',      date:'Sáb — Final',   status:'f', score:'3-0' },
    { id:12, home:'West Ham',    away:'Arsenal',        date:'Dom — Final',   status:'f', score:'0-1' },
  ],

  ll: [
    { id:20, home:'RC Celta',    away:'Levante',         date:'Mar 11:00 CST', status:'s', hp:54, dp:25, ap:21, rec:'Local',     conf:'medium' },
    { id:21, home:'Real Betis',  away:'Elche',           date:'Mar 12:00 CST', status:'s', hp:60, dp:22, ap:18, rec:'Local',     conf:'medium' },
    { id:22, home:'Osasuna',     away:'Atlético Madrid', date:'Mar 13:30 CST', status:'s', hp:39, dp:27, ap:34, rec:'Local',     conf:'low' },
    { id:23, home:'Espanyol',    away:'Athletic Bilbao', date:'Mié 11:00 CST', status:'s', hp:36, dp:29, ap:35, rec:'Empate',    conf:'low' },
    { id:24, home:'Villarreal',  away:'Sevilla',         date:'Mié 11:00 CST', status:'s', hp:46, dp:28, ap:27, rec:'Local',     conf:'medium' },
    { id:25, home:'Alavés',      away:'Barcelona',       date:'Mié 13:30 CST', status:'s', hp:30, dp:25, ap:44, rec:'Visitante', conf:'medium' },
    { id:26, home:'Real Madrid', away:'Real Oviedo',     date:'Jue 13:30 CST', status:'s', hp:78, dp:14, ap:9,  rec:'Local',     conf:'high' },
    { id:27, home:'Barcelona',       away:'Real Madrid',    date:'Dom — Final', status:'f', score:'2-0' },
    { id:28, home:'Athletic Bilbao', away:'Valencia',       date:'Dom — Final', status:'f', score:'0-1' },
    { id:29, home:'Atlético Madrid', away:'RC Celta',       date:'Sáb — Final', status:'f', score:'0-1' },
  ],

  ucl: [
    { id:40, home:'PSG',     away:'Arsenal',         date:'30 May 10:00 CST', status:'s', hp:43, dp:27, ap:30, rec:'Local', conf:'low', note:'🏆 Gran Final' },
    { id:41, home:'Arsenal', away:'Atlético Madrid', date:'May 5 — Final',    status:'f', score:'Arsenal pasa' },
    { id:42, home:'Bayern',  away:'PSG',             date:'May 6 — Final',    status:'f', score:'PSG pasa' },
  ],

  nba: [
    { id:60, home:'Cleveland',    away:'Detroit',      date:'Hoy 18:00 CST', status:'s', hp:59, dp:0, ap:41, rec:'Local',     conf:'medium', series:'Serie 2-1 DET' },
    { id:61, home:'LA Lakers',    away:'OKC Thunder',  date:'Hoy 20:30 CST', status:'s', hp:16, dp:0, ap:84, rec:'Visitante', conf:'high',   series:'Serie 3-0 OKC' },
    { id:62, home:'San Antonio',  away:'Minnesota',    date:'Mar 18:00 CST', status:'s', hp:79, dp:0, ap:21, rec:'Local',     conf:'high',   series:'Serie 2-2' },
    { id:63, home:'OKC Thunder',  away:'LA Lakers',    date:'Sáb — Final',   status:'f', score:'131-108', series:'OKC gana 3-0' },
    { id:64, home:'San Antonio',  away:'Minnesota',    date:'Vie — Final',   status:'f', score:'115-108' },
  ],

  mx: [
    { id:50, home:'Club América', away:'Chivas',      date:'Próximamente', status:'s', hp:45, dp:28, ap:27, rec:'Local',  conf:'medium' },
    { id:51, home:'Cruz Azul',    away:'Tigres UANL', date:'Próximamente', status:'s', hp:40, dp:30, ap:30, rec:'Empate', conf:'low' },
  ],

  mls: [
    { id:70, home:'Inter Miami',    away:'Orlando City',     date:'Próximamente', status:'s', hp:76, dp:14, ap:11, rec:'Local', conf:'high' },
    { id:71, home:'Real Salt Lake', away:'Portland Timbers', date:'Próximamente', status:'s', hp:67, dp:18, ap:15, rec:'Local', conf:'medium' },
  ],

  nhl: [],
  nfl: [],
};

// Picks que aparecen en Dashboard
const HOT_IDS = [9, 26, 40, 61, 62];
