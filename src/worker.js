// ═══════════════════════════════════════════════════════════════════════════════
// worker.js — النسخة النهائية الكاملة (جلب أسبوعي + تخزين دائم + لغات)
// ═══════════════════════════════════════════════════════════════════════════════

const ESPN_ALL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard';
const ESPN_LEAGUE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── اللغات المدعومة ──────────────────────────────────────────────────────────
const LANGUAGES = {
    ar: { name: 'العربية', dir: 'rtl', code: 'ar' },
    en: { name: 'English', dir: 'ltr', code: 'en' },
    fr: { name: 'Français', dir: 'ltr', code: 'fr' },
    es: { name: 'Español', dir: 'ltr', code: 'es' },
    de: { name: 'Deutsch', dir: 'ltr', code: 'de' },
    it: { name: 'Italiano', dir: 'ltr', code: 'it' },
    pt: { name: 'Português', dir: 'ltr', code: 'pt' },
    tr: { name: 'Türkçe', dir: 'ltr', code: 'tr' },
    nl: { name: 'Nederlands', dir: 'ltr', code: 'nl' },
    sv: { name: 'Svenska', dir: 'ltr', code: 'sv' },
    ru: { name: 'Русский', dir: 'ltr', code: 'ru' }
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
    tomorrow: { ar: 'غداً', en: 'Tomorrow', fr: 'Demain', es: 'Mañana', de: 'Morgen', it: 'Domani', pt: 'Amanhã', tr: 'Yarın', nl: 'Morgen', sv: 'Imorgon', ru: 'Завтра' }
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

// ─── أسماء الفرق الشهيرة ──────────────────────────────────────────────────────
const TEAM_NAMES = {
    'ليفربول': { ar: 'ليفربول', en: 'Liverpool', fr: 'Liverpool', es: 'Liverpool', de: 'Liverpool', it: 'Liverpool', pt: 'Liverpool', tr: 'Liverpool', nl: 'Liverpool', sv: 'Liverpool', ru: 'Ливерпуль' },
    'مانشستر سيتي': { ar: 'مانشستر سيتي', en: 'Manchester City', fr: 'Manchester City', es: 'Manchester City', de: 'Manchester City', it: 'Manchester City', pt: 'Manchester City', tr: 'Manchester City', nl: 'Manchester City', sv: 'Manchester City', ru: 'Манчестер Сити' },
    'مانشستر يونايتد': { ar: 'مانشستر يونايتد', en: 'Manchester United', fr: 'Manchester United', es: 'Manchester United', de: 'Manchester United', it: 'Manchester United', pt: 'Manchester United', tr: 'Manchester United', nl: 'Manchester United', sv: 'Manchester United', ru: 'Манчестер Юнайтед' },
    'أرسنال': { ar: 'أرسنال', en: 'Arsenal', fr: 'Arsenal', es: 'Arsenal', de: 'Arsenal', it: 'Arsenal', pt: 'Arsenal', tr: 'Arsenal', nl: 'Arsenal', sv: 'Arsenal', ru: 'Арсенал' },
    'تشيلسي': { ar: 'تشيلسي', en: 'Chelsea', fr: 'Chelsea', es: 'Chelsea', de: 'Chelsea', it: 'Chelsea', pt: 'Chelsea', tr: 'Chelsea', nl: 'Chelsea', sv: 'Chelsea', ru: 'Челси' },
    'ريال مدريد': { ar: 'ريال مدريد', en: 'Real Madrid', fr: 'Real Madrid', es: 'Real Madrid', de: 'Real Madrid', it: 'Real Madrid', pt: 'Real Madrid', tr: 'Real Madrid', nl: 'Real Madrid', sv: 'Real Madrid', ru: 'Реал Мадрид' },
    'برشلونة': { ar: 'برشلونة', en: 'Barcelona', fr: 'Barcelone', es: 'Barcelona', de: 'Barcelona', it: 'Barcellona', pt: 'Barcelona', tr: 'Barcelona', nl: 'Barcelona', sv: 'Barcelona', ru: 'Барселона' },
    'بايرن ميونخ': { ar: 'بايرن ميونخ', en: 'Bayern Munich', fr: 'Bayern Munich', es: 'Bayern Munich', de: 'Bayern München', it: 'Bayern Monaco', pt: 'Bayern de Munique', tr: 'Bayern Münih', nl: 'Bayern München', sv: 'Bayern München', ru: 'Бавария' },
    'باريس سان جيرمان': { ar: 'باريس سان جيرمان', en: 'Paris SG', fr: 'Paris SG', es: 'Paris SG', de: 'Paris SG', it: 'Paris SG', pt: 'Paris SG', tr: 'Paris SG', nl: 'Paris SG', sv: 'Paris SG', ru: 'ПСЖ' },
    'الهلال': { ar: 'الهلال', en: 'Al-Hilal', fr: 'Al-Hilal', es: 'Al-Hilal', de: 'Al-Hilal', it: 'Al-Hilal', pt: 'Al-Hilal', tr: 'Al-Hilal', nl: 'Al-Hilal', sv: 'Al-Hilal', ru: 'Аль-Хиляль' },
    'النصر': { ar: 'النصر', en: 'Al-Nassr', fr: 'Al-Nassr', es: 'Al-Nassr', de: 'Al-Nassr', it: 'Al-Nassr', pt: 'Al-Nassr', tr: 'Al-Nassr', nl: 'Al-Nassr', sv: 'Al-Nassr', ru: 'Аль-Наср' },
    'الأهلي': { ar: 'الأهلي', en: 'Al-Ahly', fr: 'Al-Ahly', es: 'Al-Ahly', de: 'Al-Ahly', it: 'Al-Ahly', pt: 'Al-Ahly', tr: 'Al-Ahly', nl: 'Al-Ahly', sv: 'Al-Ahly', ru: 'Аль-Ахли' },
    'الزمالك': { ar: 'الزمالك', en: 'Zamalek', fr: 'Zamalek', es: 'Zamalek', de: 'Zamalek', it: 'Zamalek', pt: 'Zamalek', tr: 'Zamalek', nl: 'Zamalek', sv: 'Zamalek', ru: 'Замалек' }
};

// ─── ثوابت التخزين المؤقت ──────────────────────────────────────────────────
const TTL_LIVE = 60;
const TTL_MATCHES = 300;
const TTL_SUMMARY = 600;
const TTL_FINISHED = 3600;
const TTL_STANDINGS = 21600;
const TTL_SCORERS = 21600;
const TTL_LINEUPS = 86400;
const TTL_ARCHIVE = 31536000; // سنة كاملة

const START_YEAR = 2020;
const ARCHIVE_FLAG = 'ARCHIVE_COMPLETE_WEEKLY';

// ─── حالة المباريات والأرشيف ──────────────────────────────────────────────
const matchState = new Map();
let isArchiving = false;

// ─── دوال مساعدة ────────────────────────────────────────────────────────────
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

// ─── دالة parseEvent المحسنة (تجلب الأهداف والبطاقات من Scoreboard) ──────
function parseEvent(ev) {
    const comp = ev.competitions?.[0] || {};
    const home = comp.competitors?.find(c => c.homeAway === 'home') || {};
    const away = comp.competitors?.find(c => c.homeAway === 'away') || {};
    const status = ev.status?.type || {};
    const leagueId = (ev.uid || '').match(/~l:(\d+)~/)?.[1] || '';
    const altNote = comp.altGameNote || '';
    const parts = altNote.split(',').map(s => s.trim());
    const leagueNameOnly = parts[0] || '';
    const leagueStage = parts.slice(1).join(', ') || '';
    const leagueFlag = getFlag(leagueNameOnly);
    const leagueName = leagueNameOnly
        ? `${leagueFlag} ${leagueNameOnly}${leagueStage ? ' - ' + leagueStage : ''}`
        : '';

    const statusState = status.state || 'pre';
    const statusText = status.shortDetail || '';
    const isHalfTime = statusState === 'in' && (
        statusText.toLowerCase().includes('half') || statusText.toLowerCase().includes('ht')
    );

    // ✅ جلب الأهداف من details
    const goals = [];
    for (const detail of (comp.details || [])) {
        if (detail.scoringPlay) {
            const minute = detail.clock?.displayValue || '??';
            const player = detail.participants?.[0]?.athlete?.displayName || '';
            const team = detail.team?.displayName || '';
            const type = detail.penaltyKick ? 'penalty' : detail.ownGoal ? 'own_goal' : 'normal';
            goals.push({ minute, player, team, type });
        }
    }

    // ✅ جلب البطاقات من notes
    const cards = [];
    for (const note of (comp.notes || [])) {
        const noteType = note.type?.id || '';
        if (['yellowCard', 'redCard', 'yellowRedCard'].includes(noteType)) {
            const minute = note.clock?.displayValue || '??';
            const player = note.participants?.[0]?.athlete?.displayName || '';
            const team = note.team?.displayName || '';
            const type = noteType.replace('Card', '').toLowerCase();
            cards.push({ minute, player, team, type });
        }
    }

    return {
        id: ev.id,
        leagueId,
        league: leagueId,
        leagueName,
        leagueNameOnly,
        leagueFlag,
        leagueStage,
        leagueYear: ev.season?.year ? String(ev.season.year) : '',
        date: ev.date,
        homeTeam: home.team?.displayName || '',
        homeLogo: home.team?.logo || '',
        homeScore: home.score ?? '',
        awayTeam: away.team?.displayName || '',
        awayLogo: away.team?.logo || '',
        awayScore: away.score ?? '',
        status: statusState,
        statusText,
        isHalfTime,
        minute: ev.status?.displayClock || '',
        venue: comp.venue?.fullName || '',
        goals: goals,
        cards: cards
    };
}

// ─── 1️⃣ جلب الأسبوع (7 أيام) دفعة واحدة ──────────────────────────────────
async function fetchWeekMatches(year, month, day, env) {
    const startDate = new Date(year, month, day);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    const startStr = startDate.toISOString().slice(0, 10).replace(/-/g, '');
    const endStr = endDate.toISOString().slice(0, 10).replace(/-/g, '');
    const weekKey = `week_${startStr}_${endStr}`;
    
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
                    allMatches.push({
                        date: dateStr,
                        matches: matches
                    });
                }
            }
            
            await new Promise(r => setTimeout(r, 100));
        } catch (e) {
            console.error(`❌ خطأ في جلب يوم ${dateStr}:`, e.message);
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (allMatches.length > 0) {
        await kvPut(env, weekKey, {
            startDate: startStr,
            endDate: endStr,
            days: allMatches,
            totalMatches: allMatches.reduce((sum, d) => sum + d.matches.length, 0)
        }, TTL_ARCHIVE);
        
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

// ─── 2️⃣ جلب الأرشيف بالكامل (أسبوعاً بأسبوع) ──────────────────────────────
async function fetchFullArchiveWeekly(env) {
    const archiveStatus = await kvGet(env, 'archive_status');
    if (archiveStatus === ARCHIVE_FLAG) {
        console.log('✅ الأرشيف الأسبوعي موجود مسبقاً، تخطي الجلب');
        return;
    }

    console.log('🚀 بدء جلب الأرشيف أسبوعاً بأسبوع (2020 → اليوم)...');
    
    const today = new Date();
    let totalWeeks = 0;
    let totalMatches = 0;
    
    let currentDate = new Date(START_YEAR, 0, 1);
    
    while (currentDate <= today) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        
        const weekMatches = await fetchWeekMatches(year, month, day, env);
        totalWeeks++;
        totalMatches += weekMatches.reduce((sum, d) => sum + d.matches.length, 0);
        
        if (totalWeeks % 10 === 0) {
            console.log(`📊 تقدم: ${totalWeeks} أسبوع, ${totalMatches} مباراة`);
        }
        
        currentDate.setDate(currentDate.getDate() + 7);
        await new Promise(r => setTimeout(r, 200));
    }
    
    console.log(`✅ تم جلب ${totalWeeks} أسبوع, ${totalMatches} مباراة`);
    
    // ── جلب الترتيب والهدافين لكل موسم ──────────────────────────────────
    console.log('🏆 جلب الترتيب والهدافين لكل موسم (2020 → 2026)...');
    
    const allLeagues = Object.keys(LEAGUE_NAMES);
    let totalStandings = 0;
    let totalScorers = 0;
    
    for (const league of allLeagues) {
        for (let year = START_YEAR; year <= today.getFullYear() + 1; year++) {
            try {
                const standingsUrl = `https://site.api.espn.com/apis/v2/sports/soccer/${league}/standings?season=${year}`;
                const standingsRes = await fetch(standingsUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                
                if (standingsRes.ok) {
                    const standingsData = await standingsRes.json();
                    await kvPut(env, `standings_${league}_${year}`, {
                        league: league,
                        season: year,
                        standings: standingsData
                    }, TTL_ARCHIVE);
                    totalStandings++;
                }
                
                const scorersUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/leaders?season=${year}`;
                const scorersRes = await fetch(scorersUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                
                if (scorersRes.ok) {
                    const scorersData = await scorersRes.json();
                    await kvPut(env, `scorers_${league}_${year}`, {
                        league: league,
                        season: year,
                        scorers: scorersData
                    }, TTL_ARCHIVE);
                    totalScorers++;
                }
                
                await new Promise(r => setTimeout(r, 200));
            } catch (e) {
                console.error(`❌ خطأ في ${league} ${year}:`, e.message);
            }
        }
        console.log(`✅ اكتمل ${league}`);
    }
    
    await kvPut(env, 'archive_status', ARCHIVE_FLAG, TTL_ARCHIVE);
    await kvPut(env, 'archive_stats', {
        fetchedAt: new Date().toISOString(),
        startDate: '2020-01-01',
        endDate: today.toISOString().slice(0, 10),
        totalWeeks: totalWeeks,
        totalMatches: totalMatches,
        totalStandings: totalStandings,
        totalScorers: totalScorers,
        leagues: allLeagues.length
    }, TTL_ARCHIVE);
    
    console.log(`✅ اكتمل الأرشيف بالكامل!`);
    console.log(`📊 إحصائيات: ${totalWeeks} أسبوع, ${totalMatches} مباراة, ${totalStandings} ترتيب, ${totalScorers} هدافون`);
}

// ─── 3️⃣ /api/matches ──────────────────────────────────────────────────────
async function handleMatches(url, env) {
    const date = url.searchParams.get('date') || todayStr();
    const lang = url.searchParams.get('lang') || 'ar';
    const kvKey = `matches_${date}`;

    const cached = await kvGet(env, kvKey);
    if (cached) {
        return new Response(
            JSON.stringify({ ...cached, fromCache: true }),
            { headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    }

    try {
        const res = await fetch(`${ESPN_ALL}?dates=${date}&limit=500`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await res.json();
        const matches = (data.events || []).map(parseEvent);
        const hasLive = matches.some(m => m.status === 'in');

        const matchesWithKeywords = matches.map(m => ({
            ...m,
            keywords: generateKeywords(m, lang),
            leagueNameTranslated: getLeagueName(m.league, lang) || m.leagueName
        }));

        const result = { success: true, date, count: matches.length, matches: matchesWithKeywords };

        const isToday = date === todayStr();
        const isPast = new Date(date) < new Date();
        const ttl = hasLive ? TTL_LIVE : isToday ? TTL_MATCHES : isPast ? TTL_ARCHIVE : TTL_FINISHED;
        
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

// ─── 4️⃣ /api/summary ──────────────────────────────────────────────────────
async function handleSummary(url, env) {
    const matchId = url.searchParams.get('matchId');
    const league = url.searchParams.get('league');
    const lang = url.searchParams.get('lang') || 'ar';

    if (!matchId) {
        return new Response(JSON.stringify({ error: 'matchId required' }), { status: 400, headers: CORS });
    }

    const kvKey = `summary_${matchId}`;
    const cached = await kvGet(env, kvKey);
    if (cached) {
        return new Response(
            JSON.stringify({ ...cached, fromCache: true }),
            { headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    }

    const leaguesToTry = league
        ? [league, 'fifa.world', 'eng.1', 'esp.1', 'ger.1', 'ita.1', 'fra.1', 'bra.1', 'arg.1', 'ned.1', 'por.1']
        : ['fifa.world', 'eng.1', 'esp.1', 'ger.1', 'ita.1', 'fra.1', 'bra.1', 'arg.1', 'ned.1', 'por.1'];

    let data = null;
    let usedLeague = '';
    for (const lg of leaguesToTry) {
        try {
            const res = await fetch(`${ESPN_LEAGUE}/${lg}/summary?event=${matchId}`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            if (!res.ok) continue;
            const d = await res.json();
            if (d.header?.competitions?.[0]?.competitors?.length) {
                data = d;
                usedLeague = lg;
                break;
            }
        } catch (_) { continue; }
    }

    if (!data) {
        return new Response(
            JSON.stringify({ error: 'لم يتم العثور على المباراة' }),
            { status: 404, headers: CORS }
        );
    }

    try {
        const result = extractSummaryData(data, usedLeague, lang);
        await kvPut(env, kvKey, result, TTL_SUMMARY);
        return new Response(
            JSON.stringify(result),
            { headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ error: e.message }),
            { status: 500, headers: CORS }
        );
    }
}

function extractSummaryData(data, league, lang) {
    const hdr = data.header || {};
    const comp = hdr.competitions?.[0] || {};
    const homeComp = comp.competitors?.find(c => c.homeAway === 'home') || {};
    const awayComp = comp.competitors?.find(c => c.homeAway === 'away') || {};
    const st = comp.status?.type || {};

    const substitutions = [];
    for (const ev of (data.keyEvents || [])) {
        const evText = ev.type?.text || '';
        if (!evText.toLowerCase().includes('substitution')) continue;
        const participants = ev.participants || [];
        const minute = ev.clock?.displayValue || '??';
        const playerIn = participants[0]?.athlete?.displayName || '';
        const playerOut = participants[1]?.athlete?.displayName || '';
        const team = ev.team?.displayName || '';
        substitutions.push({ minute, playerIn, playerOut, team });
    }

    const statistics = {};
    for (const teamData of (data.boxscore?.teams || [])) {
        const side = teamData.homeAway || 'home';
        for (const s of (teamData.statistics || [])) {
            const name = s.label || s.name || '';
            if (!statistics[name]) statistics[name] = { name, home: '', away: '' };
            if (side === 'home') statistics[name].home = s.displayValue || s.value || '';
            else statistics[name].away = s.displayValue || s.value || '';
        }
    }

    const lineups = {};
    for (const roster of (data.rosters || [])) {
        const side = roster.homeAway || 'home';
        const formation = roster.formation || '';
        const players = (roster.roster || []).map(p => ({
            name: p.athlete?.displayName || '',
            shortName: p.athlete?.shortName || '',
            jersey: p.jersey || '',
            position: p.position?.abbreviation || '',
            positionFull: p.position?.displayName || '',
            starter: p.starter || false,
            subbedIn: p.subbedIn || false,
            subbedOut: p.subbedOut || false
        }));
        lineups[side] = { formation, players };
    }

    return {
        success: true,
        league,
        leagueName: getLeagueName(league, lang) || hdr.league?.name || league,
        homeTeam: {
            name: homeComp.team?.displayName || '',
            logo: homeComp.team?.logos?.[0]?.href || '',
            score: homeComp.score || '0'
        },
        awayTeam: {
            name: awayComp.team?.displayName || '',
            logo: awayComp.team?.logos?.[0]?.href || '',
            score: awayComp.score || '0'
        },
        status: st.state || 'pre',
        statusText: st.shortDetail || '',
        isHalfTime: st.state === 'in' && (st.shortDetail || '').toLowerCase().includes('half'),
        minute: comp.status?.displayClock || '',
        venue: comp.venue?.fullName || '',
        substitutions: substitutions,
        statistics: statistics,
        lineups: lineups,
        leagueNameTranslated: getLeagueName(league, lang) || league
    };
}

// ─── 5️⃣ /api/standings ────────────────────────────────────────────────────
async function handleStandings(url, env) {
    const league = url.searchParams.get('league') || 'eng.1';
    const season = url.searchParams.get('season') || new Date().getFullYear();
    const lang = url.searchParams.get('lang') || 'ar';
    
    const kvKey = `standings_${league}_${season}`;

    const cached = await kvGet(env, kvKey);
    if (cached) {
        return new Response(
            JSON.stringify({ ...cached, fromCache: true }),
            { headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    }

    try {
        const res = await fetch(
            `https://site.api.espn.com/apis/v2/sports/soccer/${league}/standings?season=${season}`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );
        if (!res.ok) throw new Error(`ESPN ${res.status}`);
        const data = await res.json();

        const result = {
            success: true,
            league,
            season: parseInt(season),
            leagueName: getLeagueName(league, lang) || league,
            standings: data
        };

        await kvPut(env, kvKey, result, TTL_ARCHIVE);

        return new Response(
            JSON.stringify(result),
            { headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ success: false, error: e.message }),
            { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    }
}

// ─── 6️⃣ /api/scorers ──────────────────────────────────────────────────────
async function handleScorers(url, env) {
    const league = url.searchParams.get('league') || 'eng.1';
    const season = url.searchParams.get('season') || new Date().getFullYear();
    const lang = url.searchParams.get('lang') || 'ar';
    
    const kvKey = `scorers_${league}_${season}`;

    const cached = await kvGet(env, kvKey);
    if (cached) {
        return new Response(
            JSON.stringify({ ...cached, fromCache: true }),
            { headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    }

    try {
        const res = await fetch(
            `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/leaders?season=${season}`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );
        if (!res.ok) throw new Error(`ESPN ${res.status}`);
        const data = await res.json();

        const result = {
            success: true,
            league,
            season: parseInt(season),
            leagueName: getLeagueName(league, lang) || league,
            scorers: data
        };

        await kvPut(env, kvKey, result, TTL_ARCHIVE);

        return new Response(
            JSON.stringify(result),
            { headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ success: false, error: e.message }),
            { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
    }
}

// ─── 7️⃣ /api/languages ────────────────────────────────────────────────────
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

// ─── 8️⃣ نقاط التحكم في الأرشيف ──────────────────────────────────────────
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

async function handleStartArchive(url, env) {
    if (!isArchiving) {
        isArchiving = true;
        // تشغيل في الخلفية
        await fetchFullArchiveWeekly(env);
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

// ─── Router ───────────────────────────────────────────────────────────────────
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
            // تشغيل في الخلفية دون انتظار
            await fetchFullArchiveWeekly(env);
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
