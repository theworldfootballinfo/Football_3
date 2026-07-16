// ═══════════════════════════════════════════════════════════════════════════════
// worker.js — النسخة النهائية الكاملة (جلب أسبوعي + تردد ذكي + 11 لغة)
// ═══════════════════════════════════════════════════════════════════════════════

const ESPN_ALL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard';
const ESPN_LEAGUE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── اللغات المدعومة (11 لغة) ────────────────────────────────────────────────
const LANGUAGES = {
    ar: { name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
    en: { name: 'English', dir: 'ltr', flag: '🇬🇧' },
    fr: { name: 'Français', dir: 'ltr', flag: '🇫🇷' },
    es: { name: 'Español', dir: 'ltr', flag: '🇪🇸' },
    de: { name: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
    it: { name: 'Italiano', dir: 'ltr', flag: '🇮🇹' },
    pt: { name: 'Português', dir: 'ltr', flag: '🇵🇹' },
    tr: { name: 'Türkçe', dir: 'ltr', flag: '🇹🇷' },
    nl: { name: 'Nederlands', dir: 'ltr', flag: '🇳🇱' },
    sv: { name: 'Svenska', dir: 'ltr', flag: '🇸🇪' },
    ru: { name: 'Русский', dir: 'ltr', flag: '🇷🇺' }
};

// ─── الترجمة ──────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
    app_name: { ar: 'Scorio - مباريات كرة القدم', en: 'Scorio - Football Matches', fr: 'Scorio - Matchs de Football', es: 'Scorio - Partidos de Fútbol', de: 'Scorio - Fußballspiele', it: 'Scorio - Partite di Calcio', pt: 'Scorio - Jogos de Futebol', tr: 'Scorio - Futbol Maçları', nl: 'Scorio - Voetbalwedstrijden', sv: 'Scorio - Fotbollsmatcher', ru: 'Scorio - Футбольные матчи' },
    matches: { ar: 'المباريات', en: 'Matches', fr: 'Matchs', es: 'Partidos', de: 'Spiele', it: 'Partite', pt: 'Jogos', tr: 'Maçlar', nl: 'Wedstrijden', sv: 'Matcher', ru: 'Матчи' },
    standings: { ar: 'الترتيب', en: 'Standings', fr: 'Classement', es: 'Clasificación', de: 'Tabelle', it: 'Classifica', pt: 'Classificação', tr: 'Puan Durumu', nl: 'Stand', sv: 'Tabell', ru: 'Турнирная таблица' },
    scorers: { ar: 'الهدافون', en: 'Scorers', fr: 'Buteurs', es: 'Goleadores', de: 'Torschützen', it: 'Marcatori', pt: 'Artilheiros', tr: 'Gol Kralları', nl: 'Doelpuntenmakers', sv: 'Skyttar', ru: 'Бомбардиры' },
    live: { ar: 'مباشر', en: 'Live', fr: 'En direct', es: 'En vivo', de: 'Live', it: 'In diretta', pt: 'Ao vivo', tr: 'Canlı', nl: 'Live', sv: 'Live', ru: 'В прямом эфире' },
    finished: { ar: 'انتهت', en: 'Finished', fr: 'Terminé', es: 'Finalizado', de: 'Beendet', it: 'Finito', pt: 'Finalizado', tr: 'Bitti', nl: 'Afgelopen', sv: 'Slut', ru: 'Завершен' },
    upcoming: { ar: 'قادمة', en: 'Upcoming', fr: 'À venir', es: 'Próximo', de: 'Bevorstehend', it: 'Prossimo', pt: 'Próximo', tr: 'Gelecek', nl: 'Aankomend', sv: 'Kommande', ru: 'Предстоящий' },
    halftime: { ar: 'استراحة', en: 'Halftime', fr: 'Mi-temps', es: 'Descanso', de: 'Halbzeit', it: 'Intervallo', pt: 'Intervalo', tr: 'Devre Arası', nl: 'Rust', sv: 'Halvlek', ru: 'Перерыв' },
    all: { ar: 'الكل', en: 'All', fr: 'Tous', es: 'Todos', de: 'Alle', it: 'Tutti', pt: 'Todos', tr: 'Tümü', nl: 'Alle', sv: 'Alla', ru: 'Все' },
    no_matches: { ar: 'لا توجد مباريات', en: 'No matches', fr: 'Aucun match', es: 'No hay partidos', de: 'Keine Spiele', it: 'Nessuna partita', pt: 'Sem jogos', tr: 'Maç yok', nl: 'Geen wedstrijden', sv: 'Inga matcher', ru: 'Нет матчей' },
    loading: { ar: 'جارٍ التحميل...', en: 'Loading...', fr: 'Chargement...', es: 'Cargando...', de: 'Laden...', it: 'Caricamento...', pt: 'Carregando...', tr: 'Yükleniyor...', nl: 'Laden...', sv: 'Laddar...', ru: 'Загрузка...' },
    error: { ar: 'حدث خطأ', en: 'Error occurred', fr: 'Erreur', es: 'Error', de: 'Fehler', it: 'Errore', pt: 'Erro', tr: 'Hata', nl: 'Fout', sv: 'Fel', ru: 'Ошибка' },
    today: { ar: 'اليوم', en: 'Today', fr: "Aujourd'hui", es: 'Hoy', de: 'Heute', it: 'Oggi', pt: 'Hoje', tr: 'Bugün', nl: 'Vandaag', sv: 'Idag', ru: 'Сегодня' },
    yesterday: { ar: 'أمس', en: 'Yesterday', fr: 'Hier', es: 'Ayer', de: 'Gestern', it: 'Ieri', pt: 'Ontem', tr: 'Dün', nl: 'Gisteren', sv: 'Igår', ru: 'Вчера' },
    tomorrow: { ar: 'غداً', en: 'Tomorrow', fr: 'Demain', es: 'Mañana', de: 'Morgen', it: 'Domani', pt: 'Amanhã', tr: 'Yarın', nl: 'Morgen', sv: 'Imorgon', ru: 'Завтра' },
    search: { ar: 'بحث', en: 'Search', fr: 'Rechercher', es: 'Buscar', de: 'Suchen', it: 'Cerca', pt: 'Buscar', tr: 'Ara', nl: 'Zoeken', sv: 'Sök', ru: 'Поиск' }
};

// ─── أسماء الدوريات بـ 11 لغة ────────────────────────────────────────────────
const LEAGUE_NAMES = {
    'eng.1': { ar: 'الدوري الإنجليزي الممتاز', en: 'Premier League', fr: 'Premier League', es: 'Premier League', de: 'Premier League', it: 'Premier League', pt: 'Premier League', tr: 'Premier Lig', nl: 'Premier League', sv: 'Premier League', ru: 'Премьер-лига' },
    'esp.1': { ar: 'الليغا الإسبانية', en: 'La Liga', fr: 'La Liga', es: 'La Liga', de: 'La Liga', it: 'La Liga', pt: 'La Liga', tr: 'La Liga', nl: 'La Liga', sv: 'La Liga', ru: 'Ла Лига' },
    'ger.1': { ar: 'الدوري الألماني', en: 'Bundesliga', fr: 'Bundesliga', es: 'Bundesliga', de: 'Bundesliga', it: 'Bundesliga', pt: 'Bundesliga', tr: 'Bundesliga', nl: 'Bundesliga', sv: 'Bundesliga', ru: 'Бундеслига' },
    'ita.1': { ar: 'الدوري الإيطالي', en: 'Serie A', fr: 'Serie A', es: 'Serie A', de: 'Serie A', it: 'Serie A', pt: 'Serie A', tr: 'Serie A', nl: 'Serie A', sv: 'Serie A', ru: 'Серия А' },
    'fra.1': { ar: 'الدوري الفرنسي', en: 'Ligue 1', fr: 'Ligue 1', es: 'Ligue 1', de: 'Ligue 1', it: 'Ligue 1', pt: 'Ligue 1', tr: 'Ligue 1', nl: 'Ligue 1', sv: 'Ligue 1', ru: 'Лига 1' },
    'sau.1': { ar: 'الدوري السعودي', en: 'Saudi League', fr: 'Ligue Saoudienne', es: 'Liga Saudí', de: 'Saudi Liga', it: 'Lega Saudita', pt: 'Liga Saudita', tr: 'Suudi Ligi', nl: 'Saudi League', sv: 'Saudi League', ru: 'Саудовская лига' },
    'egy.1': { ar: 'الدوري المصري', en: 'Egyptian League', fr: 'Ligue Égyptienne', es: 'Liga Egipcia', de: 'Ägyptische Liga', it: 'Lega Egiziana', pt: 'Liga Egípcia', tr: 'Mısır Ligi', nl: 'Egyptische League', sv: 'Egyptiska Ligan', ru: 'Египетская лига' },
    'mar.1': { ar: 'الدوري المغربي', en: 'Moroccan League', fr: 'Ligue Marocaine', es: 'Liga Marroquí', de: 'Marokkanische Liga', it: 'Lega Marocchina', pt: 'Liga Marroquina', tr: 'Fas Ligi', nl: 'Marokkaanse League', sv: 'Marockanska Ligan', ru: 'Марокканская лига' },
    'uefa.champions': { ar: 'دوري أبطال أوروبا', en: 'Champions League', fr: 'Ligue des Champions', es: 'Champions League', de: 'Champions League', it: 'Champions League', pt: 'Champions League', tr: 'Şampiyonlar Ligi', nl: 'Champions League', sv: 'Champions League', ru: 'Лига чемпионов' },
    'fifa.world': { ar: 'كأس العالم', en: 'World Cup', fr: 'Coupe du Monde', es: 'Copa Mundial', de: 'Weltmeisterschaft', it: 'Coppa del Mondo', pt: 'Copa do Mundo', tr: 'Dünya Kupası', nl: 'Wereldkampioenschap', sv: 'Världsmästerskap', ru: 'Чемпионат мира' }
};

// ─── أسماء الفرق المشهورة ────────────────────────────────────────────────────
const TEAM_NAMES = {
    'ليفربول': { ar: 'ليفربول', en: 'Liverpool', fr: 'Liverpool', es: 'Liverpool', de: 'Liverpool', it: 'Liverpool', pt: 'Liverpool', tr: 'Liverpool', nl: 'Liverpool', sv: 'Liverpool', ru: 'Ливерпуль' },
    'مانشستر سيتي': { ar: 'مانشستر سيتي', en: 'Manchester City', fr: 'Manchester City', es: 'Manchester City', de: 'Manchester City', it: 'Manchester City', pt: 'Manchester City', tr: 'Manchester City', nl: 'Manchester City', sv: 'Manchester City', ru: 'Манчестер Сити' },
    'مانشستر يونايتد': { ar: 'مانشستر يونايتد', en: 'Manchester United', fr: 'Manchester United', es: 'Manchester United', de: 'Manchester United', it: 'Manchester United', pt: 'Manchester United', tr: 'Manchester United', nl: 'Manchester United', sv: 'Manchester United', ru: 'Манчестер Юнайтед' },
    'أرسنال': { ar: 'أرسنال', en: 'Arsenal', fr: 'Arsenal', es: 'Arsenal', de: 'Arsenal', it: 'Arsenal', pt: 'Arsenal', tr: 'Arsenal', nl: 'Arsenal', sv: 'Arsenal', ru: 'Арсенал' },
    'تشيلسي': { ar: 'تشيلسي', en: 'Chelsea', fr: 'Chelsea', es: 'Chelsea', de: 'Chelsea', it: 'Chelsea', pt: 'Chelsea', tr: 'Chelsea', nl: 'Chelsea', sv: 'Chelsea', ru: 'Челси' },
    'برشلونة': { ar: 'برشلونة', en: 'Barcelona', fr: 'Barcelone', es: 'Barcelona', de: 'Barcelona', it: 'Barcellona', pt: 'Barcelona', tr: 'Barcelona', nl: 'Barcelona', sv: 'Barcelona', ru: 'Барселона' },
    'ريال مدريد': { ar: 'ريال مدريد', en: 'Real Madrid', fr: 'Real Madrid', es: 'Real Madrid', de: 'Real Madrid', it: 'Real Madrid', pt: 'Real Madrid', tr: 'Real Madrid', nl: 'Real Madrid', sv: 'Real Madrid', ru: 'Реал Мадрид' },
    'بايرن ميونخ': { ar: 'بايرن ميونخ', en: 'Bayern Munich', fr: 'Bayern Munich', es: 'Bayern Munich', de: 'Bayern München', it: 'Bayern Monaco', pt: 'Bayern de Munique', tr: 'Bayern Münih', nl: 'Bayern München', sv: 'Bayern München', ru: 'Бавария' },
    'باريس سان جيرمان': { ar: 'باريس سان جيرمان', en: 'Paris SG', fr: 'Paris SG', es: 'Paris SG', de: 'Paris SG', it: 'Paris SG', pt: 'Paris SG', tr: 'Paris SG', nl: 'Paris SG', sv: 'Paris SG', ru: 'ПСЖ' },
    'الهلال': { ar: 'الهلال', en: 'Al-Hilal', fr: 'Al-Hilal', es: 'Al-Hilal', de: 'Al-Hilal', it: 'Al-Hilal', pt: 'Al-Hilal', tr: 'Al-Hilal', nl: 'Al-Hilal', sv: 'Al-Hilal', ru: 'Аль-Хиляль' },
    'النصر': { ar: 'النصر', en: 'Al-Nassr', fr: 'Al-Nassr', es: 'Al-Nassr', de: 'Al-Nassr', it: 'Al-Nassr', pt: 'Al-Nassr', tr: 'Al-Nassr', nl: 'Al-Nassr', sv: 'Al-Nassr', ru: 'Аль-Наср' },
    'الأهلي': { ar: 'الأهلي', en: 'Al-Ahly', fr: 'Al-Ahly', es: 'Al-Ahly', de: 'Al-Ahly', it: 'Al-Ahly', pt: 'Al-Ahly', tr: 'Al-Ahly', nl: 'Al-Ahly', sv: 'Al-Ahly', ru: 'Аль-Ахли' }
};

// ─── ثوابت التخزين المؤقت والتوقيت ───────────────────────────────────────────
const TTL_LIVE = 60;
const TTL_MATCHES = 300;
const TTL_SUMMARY = 600;
const TTL_FINISHED = 3600;
const TTL_STANDINGS = 21600;
const TTL_SCORERS = 21600;
const TTL_ARCHIVE = 31536000; // سنة كاملة

// ─── التوقيت الذكي ────────────────────────────────────────────────────────────
const REFRESH_LIVE_MIN = 2 * 60;        // دقيقتين
const REFRESH_LIVE_MAX = 3.5 * 60;      // 3.5 دقيقة
const REFRESH_QUIET_MIN = 5 * 60 * 60;  // 5 ساعات
const REFRESH_QUIET_MAX = 5 * 60 * 60 + 10 * 60; // 5 ساعات و10 دقائق

const START_YEAR = 2020;
const ARCHIVE_FLAG = 'ARCHIVE_COMPLETE_WEEKLY';

// ─── حالة المباريات والأرشيف ──────────────────────────────────────────────────
const matchState = new Map();
let isArchiving = false;

// ─── دوال مساعدة ──────────────────────────────────────────────────────────────
function getFlag(name = '') {
    const n = name.toLowerCase();
    if (n.includes('fifa world cup')) return '🌍';
    if (n.includes('champions league')) return '🏆';
    if (n.includes('premier league')) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
    if (n.includes('laliga') || n.includes('la liga')) return '🇪🇸';
    if (n.includes('bundesliga')) return '🇩🇪';
    if (n.includes('serie a')) return '🇮🇹';
    if (n.includes('ligue 1')) return '🇫🇷';
    if (n.includes('saudi')) return '🇸🇦';
    if (n.includes('egyptian')) return '🇪🇬';
    if (n.includes('morocc')) return '🇲🇦';
    if (n.includes('brasileiro')) return '🇧🇷';
    if (n.includes('argentin')) return '🇦🇷';
    if (n.includes('libertadores')) return '🏆';
    return '⚽';
}

function todayStr() {
    return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

async function kvGet(env, key) {
    try { return await env?.FOOTBALL_KV?.get(key, 'json'); } catch (_) { return null; }
}

async function kvPut(env, key, value, ttl) {
    try { await env?.FOOTBALL_KV?.put(key, JSON.stringify(value), { expirationTtl: ttl }); } catch (_) { }
}

function detectLanguage(request) {
    const url = new URL(request.url);
    const langParam = url.searchParams.get('lang');
    if (langParam && LANGUAGES[langParam]) return langParam;
    const acceptLang = request.headers.get('Accept-Language') || '';
    const preferred = acceptLang.split(',')[0]?.split('-')[0]?.toLowerCase() || '';
    if (preferred && LANGUAGES[preferred]) return preferred;
    return 'ar';
}

function t(key, lang) {
    return TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.['ar'] || key;
}

function getLeagueName(leagueCode, lang) {
    return LEAGUE_NAMES[leagueCode]?.[lang] || leagueCode || '';
}

function getTeamName(teamName, lang) {
    return TEAM_NAMES[teamName]?.[lang] || teamName || '';
}

function generateKeywords(match, lang) {
    const home = match.homeTeam || '';
    const away = match.awayTeam || '';
    const league = match.leagueName || match.league || '';
    const state = match.status || 'pre';
    const homeName = getTeamName(home, lang);
    const awayName = getTeamName(away, lang);
    const leagueName = getLeagueName(league, lang) || league;
    const vs = lang === 'ar' ? 'ضد' : lang === 'fr' ? 'contre' : lang === 'es' ? 'contra' : lang === 'de' ? 'gegen' : lang === 'it' ? 'contro' : 'vs';
    const matchWord = lang === 'ar' ? 'مباراة' : 'match';
    const today = lang === 'ar' ? 'اليوم' : 'today';
    const live = lang === 'ar' ? 'مباشر' : 'live';

    const keywords = [
        `${homeName} ${vs} ${awayName}`,
        `${matchWord} ${homeName} ${vs} ${awayName}`,
        `${homeName} ${awayName}`,
        `${homeName} ${vs} ${awayName} ${leagueName}`,
        `${leagueName} ${homeName} ${awayName}`,
        `${homeName} ${vs} ${awayName} ${today}`,
    ];

    if (state === 'in') {
        keywords.push(`${live} ${homeName} ${vs} ${awayName}`);
        keywords.push(`${homeName} ${vs} ${awayName} ${live}`);
    }

    return [...new Set(keywords)];
}

// ─── جدول ID_TO_CODE (مستند من الملف القديم) ──────────────────────────────────
const ID_TO_CODE = {
    "1":"sco.1","2":"uefa.champions","3":"uefa.europa","4":"tur.1","5":"bel.1","6":"gre.1","7":"ned.1",
    "9":"fra.1","10":"ger.1","11":"ger.2","12":"ger.dfb_pokal","13":"ita.1","14":"ita.2",
    "15":"esp.1","16":"esp.2","17":"esp.copa_del_rey","18":"ita.coppa_italia","19":"ned.1",
    "21":"usa.1","22":"arg.1","23":"eng.1","24":"eng.2","25":"eng.3","26":"eng.4","27":"eng.5",
    "28":"eng.league_cup","29":"eng.fa","30":"eng.community_shield","33":"aus.1","34":"aut.1",
    "40":"conmebol.libertadores","44":"sco.1","45":"nir.1","46":"wal.1","48":"caf.nations",
    "49":"caf.nations_qual","67":"gre.1","71":"tur.1","73":"uefa.euro","74":"uefa.euroq",
    "80":"arg.1","81":"conmebol.sudamericana","82":"conmebol.libertadores","83":"conmebol.copa",
    "84":"afc.asian.cup","85":"fifa.worldq","86":"concacaf.gold","93":"ksa.1","98":"usa.1","102":"fra.2",
    "105":"por.1","106":"por.2","107":"lva.1","108":"rou.1","109":"ltu.1","110":"est.1",
    "111":"fra.coupe_de_france","112":"rus.1","113":"irl.1","114":"bel.1","115":"isl.1",
    "116":"swe.1","117":"nor.1","118":"fin.1","119":"den.1","120":"cze.1","121":"pol.1",
    "122":"sui.1","123":"srb.1","124":"cro.1","125":"bul.1","126":"hun.1","127":"ukr.1",
    "128":"svn.1","129":"svk.1","131":"mex.1","135":"bra.1","137":"chi.1","141":"col.1",
    "143":"bol.1","147":"ecu.1","150":"par.1","153":"per.1","156":"uru.1","159":"ven.1",
    "163":"jpn.1","165":"fra.2","166":"ind.1","167":"kor.1","171":"chn.1","174":"mex.1","178":"tha.1",
    "179":"mas.1","180":"idn.1","181":"sau.1","182":"vie.1","186":"uae.1","190":"qat.1",
    "194":"bhr.1","198":"omn.1","202":"syr.1","206":"jor.1","210":"irq.1","214":"lbn.1",
    "218":"kwt.1","221":"can.1","222":"crc.1","223":"pan.1","224":"jam.1","225":"hon.1",
    "226":"slv.1","231":"mar.1","232":"tun.1","233":"alg.1","234":"egy.1","235":"rsa.1",
    "236":"nga.1","237":"ken.1","238":"gha.1","239":"tza.1","240":"uga.1","332":"bhr.1",
    "333":"jor.1","334":"kwt.1","335":"omn.1","336":"lbn.1","337":"ple.1","338":"syr.1",
    "341":"irn.1","343":"irq.1","606":"fifa.world","1118":"alg.1","1121":"mar.1","1122":"mrt.1",
    "1123":"egy.1","1124":"lby.1","1125":"qat.1","1127":"sud.1","1133":"tun.1","1134":"ye.1",
    "1227":"uae.1","1975":"caf.champions","1976":"caf.confed","2003":"conmebol.copa",
    "2006":"uefa.euro","2007":"fifa.confed","2010":"fifa.world","2018":"caf.nations",
    "2199":"afc.champions","2200":"afc.cup","2201":"concacaf.champions","2202":"concacaf.league",
    "2305":"uefa.nations","2310":"uefa.conference","2311":"uefa.super_cup","18318":"afc.champions",
    "19159":"caf.champions","19234":"rsf.1",
    "3904":"arg.2","3930":"irl.1","4003":"arg.3","4007":"bra.2",
    "8312":"chi.cup","8376":"chn.1","11088":"bra.3","23286":"can.1",
    "2329":"concacaf.nations","2350":"afc.champions.elite","2000":"conmebol.copa"
};

// ─── CONTINENTAL_RULES (ألوان الترتيب) ────────────────────────────────────────
const CONTINENTAL_RULES = {
    "uefa.euro": { 1:{color:"#81D6AC",desc:"تأهل لدور الـ 16"}, 2:{color:"#81D6AC",desc:"تأهل لدور الـ 16"}, 3:{color:"#B2BFD0",desc:"أفضل ثوالث"} },
    "fifa.world": { 1:{color:"#81D6AC",desc:"تأهل لدور الـ 16"}, 2:{color:"#81D6AC",desc:"تأهل لدور الـ 16"}, 3:{color:"#B2BFD0",desc:"أفضل ثوالث"} },
    "caf.nations": { 1:{color:"#81D6AC",desc:"تأهل لدور الـ 16"}, 2:{color:"#81D6AC",desc:"تأهل لدور الـ 16"}, 3:{color:"#B2BFD0",desc:"أفضل ثوالث"} },
    "fifa.worldq.uefa": { 1:{color:"#81D6AC",desc:"تأهل لكأس العالم"}, 2:{color:"#B2BFD0",desc:"تأهل للملحق"} },
    "uefa.euroq": { 1:{color:"#81D6AC",desc:"تأهل لليورو"}, 2:{color:"#81D6AC",desc:"تأهل لليورو"}, 3:{color:"#B2BFD0",desc:"تأهل للملحق"} },
    "caf.nations_qual": { 1:{color:"#81D6AC",desc:"تأهل لأمم أفريقيا"}, 2:{color:"#81D6AC",desc:"تأهل لأمم أفريقيا"} },
    "eng.1": { 1:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 2:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 3:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 4:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 5:{color:"#6CABDD",desc:"الدوري الأوروبي"}, 6:{color:"#B2BFD0",desc:"دوري المؤتمر"}, "-3":{color:"#FF7F84",desc:"هبوط"}, "-2":{color:"#FF7F84",desc:"هبوط"}, "-1":{color:"#FF7F84",desc:"هبوط"} },
    "esp.1": { 1:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 2:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 3:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 4:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 5:{color:"#6CABDD",desc:"الدوري الأوروبي"}, 6:{color:"#B2BFD0",desc:"دوري المؤتمر"}, "-3":{color:"#FF7F84",desc:"هبوط"}, "-2":{color:"#FF7F84",desc:"هبوط"}, "-1":{color:"#FF7F84",desc:"هبوط"} },
    "fra.1": { 1:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 2:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 3:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 4:{color:"#6CABDD",desc:"دوري أبطال أوروبا (تصفيات)"}, 5:{color:"#6CABDD",desc:"الدوري الأوروبي"}, 6:{color:"#B2BFD0",desc:"دوري المؤتمر"}, "-3":{color:"#FF7F84",desc:"ملحق الهبوط"}, "-2":{color:"#FF7F84",desc:"هبوط"}, "-1":{color:"#FF7F84",desc:"هبوط"} },
    "ger.1": { 1:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 2:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 3:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 4:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 5:{color:"#6CABDD",desc:"الدوري الأوروبي"}, 6:{color:"#B2BFD0",desc:"دوري المؤتمر"}, "-3":{color:"#FF7F84",desc:"ملحق الهبوط"}, "-2":{color:"#FF7F84",desc:"هبوط"}, "-1":{color:"#FF7F84",desc:"هبوط"} },
    "ita.1": { 1:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 2:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 3:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 4:{color:"#81D6AC",desc:"دوري أبطال أوروبا"}, 5:{color:"#6CABDD",desc:"الدوري الأوروبي"}, 6:{color:"#B2BFD0",desc:"دوري المؤتمر"}, "-3":{color:"#FF7F84",desc:"هبوط"}, "-2":{color:"#FF7F84",desc:"هبوط"}, "-1":{color:"#FF7F84",desc:"هبوط"} },
    "sau.1": { 1:{color:"#81D6AC",desc:"دوري أبطال آسيا للنخبة"}, 2:{color:"#81D6AC",desc:"دوري أبطال آسيا للنخبة"}, 3:{color:"#6CABDD",desc:"دوري أبطال آسيا 2"}, "-3":{color:"#FF7F84",desc:"هبوط"}, "-2":{color:"#FF7F84",desc:"هبوط"}, "-1":{color:"#FF7F84",desc:"هبوط"} }
};

function resolveLeagueFromName(name) {
    if (!name) return '';
    const n = name.toLowerCase();
    if (n.includes('premier league') || n.includes('english premier')) return 'eng.1';
    if (n.includes('la liga') || n.includes('laliga') || n.includes('spain')) return 'esp.1';
    if (n.includes('bundesliga') && !n.includes('2.') && !n.includes('austria')) return 'ger.1';
    if (n.includes('serie a') && n.includes('ita')) return 'ita.1';
    if (n.includes('ligue 1') && n.includes('fr')) return 'fra.1';
    if (n.includes('saudi') || n.includes('roshn')) return 'sau.1';
    if (n.includes('egyptian premier') || n.includes('egypt premier')) return 'egy.1';
    if (n.includes('botola') || n.includes('moroccan')) return 'mar.1';
    if (n.includes('world cup') || n.includes('fifa world')) return 'fifa.world';
    if (n.includes('champions league') || n.includes('ucl')) return 'uefa.champions';
    if (n.includes('europa league')) return 'uefa.europa';
    if (n.includes('conference league')) return 'uefa.conference';
    return '';
}

function applyFallbackColors(leagueCode, position, totalTeams) {
    const rules = CONTINENTAL_RULES[leagueCode];
    if (rules) {
        if (rules[position]) return rules[position];
        const offset = position - totalTeams - 1;
        if (rules[offset]) return rules[offset];
    }
    return { color: "", desc: "" };
}

// ─── جلب الأسبوع (7 أيام) دفعة واحدة ──────────────────────────────────────────
async function fetchWeekMatches(year, month, day, env) {
    const startDate = new Date(year, month, day);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    const startStr = startDate.toISOString().slice(0, 10).replace(/-/g, '');
    const endStr = endDate.toISOString().slice(0, 10).replace(/-/g, '');
    const weekKey = `week_${startStr}_${endStr}`;
    
    const existing = await kvGet(env, weekKey);
    if (existing) {
        console.log(`📅 الأسبوع ${startStr} موجود مسبقاً، تخطي`);
        return existing;
    }
    
    console.log(`📅 جلب الأسبوع: ${startStr} → ${endStr}`);
    
    const allMatches = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
        try {
            const url = `${ESPN_ALL}?dates=${dateStr}&limit=500`;
            const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (res.ok) {
                const data = await res.json();
                const matches = (data.events || []).map(parseEvent);
                if (matches.length > 0) {
                    allMatches.push({ date: dateStr, matches: matches });
                }
            }
            await new Promise(r => setTimeout(r, 100));
        } catch (e) {
            console.error(`❌ خطأ في جلب يوم ${dateStr}:`, e.message);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (allMatches.length > 0) {
        const weekData = {
            startDate: startStr,
            endDate: endStr,
            days: allMatches,
            totalMatches: allMatches.reduce((sum, d) => sum + d.matches.length, 0),
            fetchedAt: new Date().toISOString()
        };
        await kvPut(env, weekKey, weekData, TTL_ARCHIVE);
        for (const day of allMatches) {
            await kvPut(env, `matches_${day.date}`, {
                date: day.date,
                count: day.matches.length,
                matches: day.matches
            }, TTL_ARCHIVE);
        }
    }
    return allMatches;
}

// ─── جلب الأرشيف بالكامل (أسبوعياً من 2020) ──────────────────────────────────
async function fetchFullArchive(env) {
    const archiveStatus = await kvGet(env, 'archive_status');
    if (archiveStatus === ARCHIVE_FLAG) {
        console.log('✅ الأرشيف موجود مسبقاً، تخطي');
        return;
    }
    
    console.log('🚀 بدء جلب الأرشيف أسبوعياً (2020 → اليوم)...');
    const today = new Date();
    let currentDate = new Date(START_YEAR, 0, 1);
    let totalWeeks = 0;
    let totalMatches = 0;
    
    while (currentDate <= today) {
        const weekData = await fetchWeekMatches(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), env);
        totalWeeks++;
        if (weekData && weekData.days) {
            totalMatches += weekData.days.reduce((sum, d) => sum + d.matches.length, 0);
        }
        if (totalWeeks % 10 === 0) {
            console.log(`📊 تقدم: ${totalWeeks} أسبوع, ${totalMatches} مباراة`);
        }
        currentDate.setDate(currentDate.getDate() + 7);
        await new Promise(r => setTimeout(r, 200));
    }
    
    await kvPut(env, 'archive_status', ARCHIVE_FLAG, TTL_ARCHIVE);
    await kvPut(env, 'archive_stats', {
        fetchedAt: new Date().toISOString(),
        startDate: `${START_YEAR}-01-01`,
        endDate: today.toISOString().slice(0, 10),
        totalWeeks: totalWeeks,
        totalMatches: totalMatches
    }, TTL_ARCHIVE);
    
    console.log(`✅ اكتمل الأرشيف: ${totalWeeks} أسبوع, ${totalMatches} مباراة`);
}

// ─── حساب التردد الذكي ─────────────────────────────────────────────────────────
function calculateRefreshRate(liveCount) {
    if (liveCount === 0) {
        const base = REFRESH_QUIET_MIN;
        const extra = Math.random() * (REFRESH_QUIET_MAX - REFRESH_QUIET_MIN);
        return Math.round(base + extra);
    } else {
        return Math.round(Math.random() * (REFRESH_LIVE_MAX - REFRESH_LIVE_MIN) + REFRESH_LIVE_MIN);
    }
}

// ─── parseEvent (جلب الأهداف والبطاقات من Scoreboard) ──────────────────────────
function parseEvent(ev) {
    const comp = ev.competitions?.[0] || {};
    const home = comp.competitors?.find(c => c.homeAway === 'home') || {};
    const away = comp.competitors?.find(c => c.homeAway === 'away') || {};
    const status = ev.status?.type || {};
    const leagueId = (ev.uid || '').match(/~l:(\d+)~/)?.[1] || '';
    const leagueCode = ID_TO_CODE[leagueId] || resolveLeagueFromName(ev.leagues?.[0]?.name || comp.altGameNote?.split(',')?.[0] || '') || leagueId || '';
    const altNote = comp.altGameNote || '';
    const parts = altNote.split(',').map(s => s.trim());
    const leagueNameOnly = parts[0] || '';
    const leagueStage = parts.slice(1).join(', ') || '';
    const leagueFlag = getFlag(leagueNameOnly);
    const leagueName = leagueNameOnly ? `${leagueFlag} ${leagueNameOnly}${leagueStage ? ' - ' + leagueStage : ''}` : '';
    const statusState = status.state || 'pre';
    const statusText = status.shortDetail || '';
    const isHalfTime = statusState === 'in' && (statusText.toLowerCase().includes('half') || statusText.toLowerCase().includes('ht'));
    
    // جلب الأهداف من details
    const goals = [];
    for (const detail of (comp.details || [])) {
        if (detail.scoringPlay) {
            goals.push({
                minute: detail.clock?.displayValue || '??',
                player: detail.participants?.[0]?.athlete?.displayName || '',
                team: detail.team?.displayName || '',
                type: detail.penaltyKick ? 'penalty' : detail.ownGoal ? 'own_goal' : 'normal'
            });
        }
    }
    
    // جلب البطاقات من notes
    const cards = [];
    for (const note of (comp.notes || [])) {
        const noteType = note.type?.id || '';
        if (['yellowCard', 'redCard', 'yellowRedCard'].includes(noteType)) {
            cards.push({
                minute: note.clock?.displayValue || '??',
                player: note.participants?.[0]?.athlete?.displayName || '',
                team: note.team?.displayName || '',
                type: noteType.replace('Card', '').toLowerCase()
            });
        }
    }
    
    return {
        id: ev.id, leagueId, league: leagueCode, leagueName, leagueNameOnly, leagueFlag, leagueStage,
        leagueYear: ev.season?.year ? String(ev.season.year) : '',
        date: ev.date,
        homeTeam: home.team?.displayName || '', homeLogo: home.team?.logo || '', homeScore: home.score ?? '',
        awayTeam: away.team?.displayName || '', awayLogo: away.team?.logo || '', awayScore: away.score ?? '',
        status: statusState, statusText, isHalfTime, minute: ev.status?.displayClock || '',
        venue: comp.venue?.fullName || '',
        goals: goals,
        cards: cards
    };
}

// ─── /api/matches (مع البحث في الأرشيف الأسبوعي) ──────────────────────────────
async function handleMatches(url, env) {
    const date = url.searchParams.get('date') || todayStr();
    const lang = url.searchParams.get('lang') || 'ar';
    const kvKey = `matches_${date}`;
    
    // 1️⃣ محاولة من الكاش اليومي
    const cached = await kvGet(env, kvKey);
    if (cached) {
        return new Response(
            JSON.stringify({ ...cached, fromCache: true }),
            { headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    }
    
    // 2️⃣ محاولة البحث في الأسبوع
    const dateObj = new Date(date.slice(0,4), parseInt(date.slice(4,6))-1, parseInt(date.slice(6,8)));
    const weekStart = new Date(dateObj);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().slice(0,10).replace(/-/g, '');
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekEndStr = weekEnd.toISOString().slice(0,10).replace(/-/g, '');
    const weekKey = `week_${weekStartStr}_${weekEndStr}`;
    
    const weekData = await kvGet(env, weekKey);
    if (weekData && weekData.days) {
        const dayMatch = weekData.days.find(d => d.date === date);
        if (dayMatch && dayMatch.matches.length > 0) {
            const result = {
                success: true,
                date: date,
                count: dayMatch.matches.length,
                matches: dayMatch.matches.map(m => ({
                    ...m,
                    keywords: generateKeywords(m, lang),
                    leagueNameTranslated: getLeagueName(m.league, lang) || m.leagueName
                })),
                fromWeek: true
            };
            await kvPut(env, kvKey, result, TTL_MATCHES);
            return new Response(
                JSON.stringify(result),
                { headers: { ...CORS, 'Content-Type': 'application/json' } }
            );
        }
    }
    
    // 3️⃣ جلب من ESPN مباشرة
    try {
        const res = await fetch(`${ESPN_ALL}?dates=${date}&limit=500`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const data = await res.json();
        const matches = (data.events || []).map(parseEvent);
        const hasLive = matches.some(m => m.status === 'in');
        const result = {
            success: true,
            date: date,
            count: matches.length,
            matches: matches.map(m => ({
                ...m,
                keywords: generateKeywords(m, lang),
                leagueNameTranslated: getLeagueName(m.league, lang) || m.leagueName
            }))
        };
        const ttl = hasLive ? TTL_LIVE : TTL_MATCHES;
        await kvPut(env, kvKey, result, ttl);
        return new Response(
            JSON.stringify(result),
            { headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ success: false, error: e.message }),
            { headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    }
}

// ─── /api/summary ──────────────────────────────────────────────────────────────
async function handleSummary(url, env) {
    const matchId = url.searchParams.get('matchId');
    let league = url.searchParams.get('league');
    const lang = url.searchParams.get('lang') || 'ar';
    
    if (league && !isNaN(league) && ID_TO_CODE[league]) league = ID_TO_CODE[league];
    if (!matchId) return new Response(JSON.stringify({ error: 'matchId required' }), { status: 400, headers: CORS });
    
    const kvKey = `summary_${matchId}`;
    const cached = await kvGet(env, kvKey);
    if (cached) return new Response(JSON.stringify({ ...cached, fromCache: true }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
    
    const leaguesToTry = league ? [league, 'fifa.world', 'eng.1', 'esp.1', 'ger.1', 'ita.1', 'fra.1', 'bra.1', 'arg.1', 'ned.1', 'por.1'] : ['fifa.world', 'eng.1', 'esp.1', 'ger.1', 'ita.1', 'fra.1', 'bra.1', 'arg.1', 'ned.1', 'por.1'];
    let data = null, usedLeague = '';
    
    for (const lg of leaguesToTry) {
        try {
            const res = await fetch(`${ESPN_LEAGUE}/${lg}/summary?event=${matchId}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (!res.ok) continue;
            const d = await res.json();
            if (d.header?.competitions?.[0]?.competitors?.length) {
                data = d;
                const uid = d.header?.competitions?.[0]?.uid || d.header?.uid || '';
                const uidMatch = uid.match(/~l:(\d+)~/);
                const espnId = uidMatch ? uidMatch[1] : String(d.header?.league?.id || '');
                usedLeague = ID_TO_CODE[espnId] || resolveLeagueFromName(d.header?.league?.name || '') || league || lg;
                break;
            }
        } catch (_) { continue; }
    }
    
    if (!data) return new Response(JSON.stringify({ error: 'لم يتم العثور على المباراة' }), { status: 404, headers: CORS });
    
    try {
        const hdr = data.header || {}, comp = hdr.competitions?.[0] || {};
        const homeComp = comp.competitors?.find(c => c.homeAway === 'home') || {};
        const awayComp = comp.competitors?.find(c => c.homeAway === 'away') || {};
        const st = comp.status?.type || {};
        const homeTeamName = homeComp.team?.displayName || '';
        const awayTeamName = awayComp.team?.displayName || '';
        const statusState = st.state || 'post';
        const statusText = st.shortDetail || '';
        const isHalfTime = statusState === 'in' && (statusText.toLowerCase().includes('half') || statusText.toLowerCase().includes('ht'));
        const gi = data.gameInfo?.venue || {}, addr = gi.address || {};
        const venue = [gi.fullName, addr.city, addr.country].filter(Boolean).join('، ');
        const altNote = comp.altGameNote || '';
        const altParts = altNote.split(',').map(s => s.trim());
        const leagueNameOnly = altParts[0] || hdr.league?.name || usedLeague || '';
        const leagueStage = altParts.slice(1).join(', ') || '';
        const leagueName = leagueNameOnly ? `${getFlag(leagueNameOnly)} ${leagueNameOnly}${leagueStage ? ' - ' + leagueStage : ''}` : hdr.league?.name || usedLeague || '';
        const advancesNote = (comp.notes || []).find(n => n.text?.includes('advances'))?.text || '';
        const homeRoster = data.rosters?.find(r => r.homeAway === 'home');
        const awayRoster = data.rosters?.find(r => r.homeAway === 'away');
        
        const mapLineup = (rosterObj) => (rosterObj?.roster || []).map(p => ({
            name: p.athlete?.displayName || '',
            shortName: p.athlete?.shortName || '',
            jersey: p.jersey || '',
            position: p.position?.abbreviation || '',
            starter: p.starter ?? false,
            subbedIn: p.subbedIn ?? false,
            subbedOut: p.subbedOut ?? false
        }));
        
        const result = {
            success: true, id: matchId, league: usedLeague, leagueName, leagueStage, leagueGroup: comp.groups?.name || '',
            advancesNote, venue, date: comp.date,
            homeTeam: homeTeamName, homeLogo: homeComp.team?.logos?.[0]?.href || homeComp.team?.logo || '', homeScore: homeComp.score || '0', homeShootout: homeComp.shootoutScore ?? null,
            awayTeam: awayTeamName, awayLogo: awayComp.team?.logos?.[0]?.href || awayComp.team?.logo || '', awayScore: awayComp.score || '0', awayShootout: awayComp.shootoutScore ?? null,
            homeWinner: homeComp.winner ?? false, awayWinner: awayComp.winner ?? false,
            status: statusState, statusText, isHalfTime, minute: comp.status?.displayClock || '',
            homeFormation: homeRoster?.formation || '', awayFormation: awayRoster?.formation || '',
            goals: [], cards: [], subs: [], homeSubs: [], awaySubs: [],
            homeLineup: mapLineup(homeRoster), awayLineup: mapLineup(awayRoster),
            homeStats: (data.boxscore?.teams?.[0]?.statistics || []).map(s => ({ name: s.label, value: s.displayValue })),
            awayStats: (data.boxscore?.teams?.[1]?.statistics || []).map(s => ({ name: s.label, value: s.displayValue })),
            leagueNameTranslated: getLeagueName(usedLeague, lang) || leagueName
        };
        
        await kvPut(env, kvKey, result, statusState === 'in' ? TTL_SUMMARY : TTL_FINISHED);
        return new Response(JSON.stringify(result), { headers: { ...CORS, 'Content-Type': 'application/json' } });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
    }
}

// ─── /api/standings ────────────────────────────────────────────────────────────
async function handleStandings(url, env) {
    let league = url.searchParams.get('league') || 'eng.1';
    let season = url.searchParams.get('season') || new Date().getFullYear();
    const lang = url.searchParams.get('lang') || 'ar';
    
    if (!isNaN(league) && ID_TO_CODE[league]) league = ID_TO_CODE[league];
    const kvKey = `standings_v3_${league}_${season}`;
    const cached = await kvGet(env, kvKey);
    if (cached) return new Response(JSON.stringify({ ...cached, fromCache: true }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
    
    try {
        const res = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${league}/standings?season=${season}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`ESPN ${res.status}`);
        const data = await res.json();
        
        const groups = [];
        for (const child of (data.children || [])) {
            const groupName = data.children.length > 1 ? (child.name || child.abbreviation || '') : '';
            const entries = child.standings?.entries || [];
            const teams = entries.map((e, idx) => {
                const team = e.team || {};
                const stats = {};
                for (const s of (e.stats || [])) stats[s.name] = s.displayValue ?? s.value ?? 0;
                const rank = parseInt(stats.rank) || (idx + 1);
                const fallback = applyFallbackColors(league, rank, entries.length);
                let colorClass = '';
                if (fallback.color === '#81D6AC') colorClass = 'promo';
                else if (fallback.color === '#6CABDD') colorClass = 'ucl';
                else if (fallback.color === '#B2BFD0') colorClass = 'playoff';
                else if (fallback.color === '#FF7F84') colorClass = 'rel';
                return {
                    rank, name: team.displayName || team.name || '', logo: team.logos?.[0]?.href || team.logo || '',
                    played: stats.gamesPlayed ?? '', wins: stats.wins ?? '', draws: stats.ties ?? stats.draws ?? '',
                    losses: stats.losses ?? '', gd: stats.pointDifferential ?? '', points: stats.points ?? '',
                    note_color: fallback.color || '', note_description: fallback.desc || '', color_class: colorClass
                };
            });
            teams.sort((a, b) => (parseInt(a.rank)||99) - (parseInt(b.rank)||99));
            groups.push({ name: groupName, teams });
        }
        
        const result = { success: true, league, season: parseInt(season), leagueName: getLeagueName(league, lang) || league, groups };
        await kvPut(env, kvKey, result, TTL_STANDINGS);
        return new Response(JSON.stringify(result), { headers: { ...CORS, 'Content-Type': 'application/json' } });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } });
    }
}

// ─── /api/scorers ──────────────────────────────────────────────────────────────
async function handleScorers(url, env) {
    let league = url.searchParams.get('league') || 'eng.1';
    let season = url.searchParams.get('season') || new Date().getFullYear();
    const lang = url.searchParams.get('lang') || 'ar';
    
    if (!isNaN(league) && ID_TO_CODE[league]) league = ID_TO_CODE[league];
    const kvKey = `scorers_v2_${league}_${season}`;
    const cached = await kvGet(env, kvKey);
    if (cached) return new Response(JSON.stringify({ ...cached, fromCache: true }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
    
    try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/leaders?season=${season}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`ESPN ${res.status}`);
        const data = await res.json();
        const categories = data.categories || [];
        const goalsCat = categories.find(c => (c.name || '').toLowerCase().includes('goal') || (c.displayName || '').toLowerCase().includes('goal')) || categories[0];
        const scorers = (goalsCat?.leaders || []).map((l, i) => ({
            rank: i + 1, name: l.athlete?.displayName || l.displayName || '', photo: l.athlete?.headshot?.href || '',
            team: l.team?.displayName || l.team?.name || '', teamLogo: l.team?.logos?.[0]?.href || l.team?.logo || '',
            goals: parseInt(l.value) || 0,
        }));
        const result = { success: true, league, season: parseInt(season), leagueName: getLeagueName(league, lang) || league, scorers };
        await kvPut(env, kvKey, result, TTL_SCORERS);
        return new Response(JSON.stringify(result), { headers: { ...CORS, 'Content-Type': 'application/json' } });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } });
    }
}

// ─── /api/languages ────────────────────────────────────────────────────────────
async function handleLanguages(url, env) {
    const lang = url.searchParams.get('lang') || 'ar';
    const translations = {};
    for (const [key, value] of Object.entries(TRANSLATIONS)) {
        translations[key] = value[lang] || value['ar'] || key;
    }
    return new Response(
        JSON.stringify({
            success: true,
            currentLang: lang,
            languages: LANGUAGES,
            translations: translations
        }),
        { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
}

// ─── /api/archive-status ───────────────────────────────────────────────────────
async function handleArchiveStatus(url, env) {
    const status = await kvGet(env, 'archive_status');
    const stats = await kvGet(env, 'archive_stats');
    return new Response(
        JSON.stringify({
            complete: status === ARCHIVE_FLAG,
            stats: stats || null
        }),
        { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
}

// ─── /api/start-archive ────────────────────────────────────────────────────────
async function handleStartArchive(url, env) {
    if (!isArchiving) {
        isArchiving = true;
        await fetchFullArchive(env);
        isArchiving = false;
    }
    return new Response(
        JSON.stringify({
            success: true,
            message: isArchiving ? 'جاري جلب الأرشيف...' : 'انتهى جلب الأرشيف'
        }),
        { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
}

// ─── Router ────────────────────────────────────────────────────────────────────
export default {
    async fetch(request, env) {
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: CORS });
        }

        const url = new URL(request.url);
        const path = url.pathname;
        const lang = detectLanguage(request);

        // ── تشغيل جلب الأرشيف تلقائياً (مرة واحدة) ──────────────────────
        const archiveStatus = await kvGet(env, 'archive_status');
        if (!archiveStatus && !isArchiving) {
            console.log('🚀 بدء جلب الأرشيف التلقائي...');
            isArchiving = true;
            await fetchFullArchive(env);
            isArchiving = false;
        }

        // ── المسارات ──────────────────────────────────────────────────────
        if (path === '/ping') {
            return new Response('pong', { headers: CORS });
        }

        if (path === '/api/matches') {
            return await handleMatches(url, env);
        }

        if (path === '/api/summary') {
            return await handleSummary(url, env);
        }

        if (path === '/api/standings') {
            return await handleStandings(url, env);
        }

        if (path === '/api/scorers') {
            return await handleScorers(url, env);
        }

        if (path === '/api/languages') {
            return await handleLanguages(url, env);
        }

        if (path === '/api/archive-status') {
            return await handleArchiveStatus(url, env);
        }

        if (path === '/api/start-archive') {
            return await handleStartArchive(url, env);
        }

        return new Response('Not Found', { status: 404 });
    }
};
