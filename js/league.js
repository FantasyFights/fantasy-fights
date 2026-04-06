        // ============ BELT EMOJI HELPER ============
        function getBeltImages(str) {
            const s = (str || '').toLowerCase();
            // Exclude interim titles, eliminators and exhibition events
            if (s.includes('interim') || s.includes('eliminator') || s.includes('exhibition')) return '';
            const orgs = ['wba', 'wbc', 'wbo', 'ibf'];
            let count = orgs.filter(org => s.includes(org)).length;
            // "undisputed" = all 4 belts when no org is explicitly listed
            if (s.includes('undisputed') && count === 0) count = 4;
            if (!count) return '';
            return `<span class="fight-belts" title="${count} belt${count > 1 ? 's' : ''}">${'🏆'.repeat(count)}</span>`;
        }

        // ============ FIGHTER IMAGE LOADING — local folder ============
        // Images live in FF2026Figthers/<Name>.png (exact fighter name)
        const _LOCAL_IMG_OVERRIDES = {
            'Willy Hutchinson': 'Willy hutchinson',
        };

        function getLocalFighterImg(name) {
            const filename = _LOCAL_IMG_OVERRIDES[name] || name;
            // Encode each path segment but keep the slash
            return 'FF2026Figthers/' + encodeURIComponent(filename) + '.png';
        }

        function loadFighterImages(root) {
            const scope = root || document;
            scope.querySelectorAll('img[data-fighter]').forEach(img => {
                const name = img.dataset.fighter;
                if (!name || img.dataset.loaded) return;
                img.dataset.loaded = '1';
                const fallback = img.nextElementSibling;
                img.src = getLocalFighterImg(name);
                img.onload = () => {
                    img.style.display = 'block';
                    img.classList.add('loaded');
                    if (fallback) fallback.style.display = 'none';
                };
                img.onerror = () => {
                    img.style.display = 'none';
                    if (fallback) fallback.style.display = '';
                };
            });
        }

        // ── Legacy stubs (no longer needed but kept so nothing breaks) ──
        const _fighterImgCache = {};
        const _fighterImgInflight = {};

        // (WIKI_NAME_MAP no longer used — images served locally)
        const WIKI_NAME_MAP = {
            "Chocolatito":           "Román González (boxer)",
            "Andy Ruiz":             "Andy Ruiz Jr.",
            "Canelo Alvarez":        "Canelo Álvarez",
            "Arnold Barboza Jr":     "Arnold Barboza Jr.",
            "Brian Norman Jr":       "Brian Norman Jr.",
            "Richard Torrez Jr":     "Richard Torrez Jr.",
            "Lester Martínez":       "Lester Martínez (boxer)",
            "Juan Francisco Estrada":"Juan Francisco Estrada (boxer)",
            "Jesus Alejandro Ramos": "Jesús Alejandro Ramos",
            "Srisaket Sor Rungvisai":"Srisaket Sor Rungvisai",
            "Murodjon Akhmadaliev":  "Murodjon Akhmadaliev",
            "Junto Nakatani":        "Junto Nakatani",
            "Tenshin Nasukawa":      "Tenshin Nasukawa",
            "Yoshiki Takei":         "Yoshiki Takei (boxer)",
            "Ryosuke Nishida":       "Ryosuke Nishida (boxer)",
            "Seiya Tsutsumi":        "Seiya Tsutsumi",
            "Kenshiro Teraji":       "Kenshiro Teraji",
            "Takuma Inoue":          "Takuma Inoue (boxer)",
            "Bektemir Melikuziev":   "Bektemir Melikuziev",
            "Shakhram Giyasov":      "Shakhram Giyasov",
            "Arslanbek Makhmudov":   "Arslanbek Makhmudov",
            "Bakhodir Jalolov":      "Bakhodir Jalolov",
            "Zhanibek Alimkhanuly":  "Zhanibek Alimkhanuly",
            "Israil Madrimov":       "Israil Madrimov",
            "Bakhram Murtazaliev":   "Bakhram Murtazaliev",
            "O'Shaquie Foster":      "O'Shaquie Foster",
            "Galal Yafai":           "Galal Yafai",
            "Skye Nicholson":        "Skye Nicholson (boxer)",
            "Sam Goodman":           "Sam Goodman (boxer)",
            "Justis Huni":           "Justis Huni",
            "Paulo Aokuso":          "Paulo Aokuso",
            "Jason Moloney":         "Jason Moloney",
            "Andrew Moloney":        "Andrew Moloney",
            "Jai Opetaia":           "Jai Opetaia",
            "Tim Tszyu":             "Tim Tszyu",
            "Nikita Tszyu":          "Nikita Tszyu",
            "Conor Wallace":         "Conor Wallace (boxer)",
            "Teremoana Teremoana":   "Teremoana Junior",
            "Chris Eubank Jr":       "Chris Eubank Jr.",
            "David Morrell":         "David Morrell Jr.",
            "Erislandy Lara":        "Erislandy Lara",
            "Martin Bakole":         "Martin Bakole",
            "Abass Baraou":          "Abass Baraou",
            "Conah Walker":          "Conah Walker",
            "Hamzah Sheeraz":        "Hamzah Sheeraz",
            "Adam Azim":             "Adam Azim",
            "Dalton Smith":          "Dalton Smith (boxer)",
            "Lewis Crocker":         "Lewis Crocker",
            "Paddy Donovan":         "Paddy Donovan (boxer)",
            "Jack Catterall":        "Jack Catterall",
            "Callum Walsh":          "Callum Walsh (boxer)",
            "Aaron McKenna":         "Aaron McKenna (boxer)",
            "Floyd Schofield":       "Floyd Schofield (boxer)",
            "Ernesto Mercado":       "Ernesto Mercado (boxer)",
            "Jadier Herrera":        "Jadier Herrera",
            "Yoenli Hernandez":      "Yoenli Hernandez",
            "Osleys Iglesias":       "Osleys Iglesias",
            "Ammo Williams":         "Ammo Williams (boxer)",
            "Willy Hutchinson":      "Willy Hutchinson (boxer)",
            "Liam Paro":             "Liam Paro",
            "Liam Wilson":           "Liam Wilson (boxer)",
            "Nick Ball":             "Nick Ball (boxer)",
            "Jazza Dickens":         "Jazza Dickens",
            "Anthony Cacace":        "Anthony Cacace",
            "Leigh Wood":            "Leigh Wood (boxer)",
            "Andy Cruz":             "Andy Cruz (boxer)",
            "Robeisy Ramirez":       "Robeisy Ramírez",
            "Oscar Collazo":         "Oscar Collazo (boxer)",
            "Alan Picasso":          "Alan Picasso",
            "Sebastian Reyes":       "Sebastián Reyes (boxer)",
            "Christian Medina":      "Christian Medina (boxer)",
            "Emiliano Vargas":       "Emiliano Vargas (boxer)",
            "Rafael Espinoza":       "Rafael Espinoza (boxer)",
            "Ricardo Rafael Sandoval":"Ricardo Rafael Sandoval",
            "Isaac Cruz":            "Isaac Cruz (boxer)",
            "Luis Nery":             "Luis Nery (boxer)",
            "Armando Resendiz":      "Armando Resendiz",
            "Raul Curiel":           "Raul Curiel",
            "Jorge Garcia Perez":    "Jorge García Pérez (boxer)",
            "Alberto Ramirez":       "Albert Ramirez (boxer)",
            "Najee Lopez":           "Najee Lopez",
            "Alexis Rocha":          "Alexis Rocha (boxer)",
            "Rohan Polanco":         "Rohan Polanco",
            "Charles Conwell":       "Charles Conwell",
            "Delante Johnson":       "Delante Johnson (boxer)",
            "Troy Isley":            "Troy Isley",
            "Frank Sanchez":         "Frank Sánchez (boxer)",
            "Guido Vianello":        "Guido Vianello",
            "Lenier Pero":           "Lenier Pero",
            "Murat Gassiev":         "Murat Gassiev",
            "Richard Riakporhe":     "Richard Riakporhe",
            "David Nyika":           "David Nyika",
            "Serhii Bohachuk":       "Serhii Bohachuk",
            "Oleksandr Gvozdyk":     "Oleksandr Gvozdyk",
            "Ben Whittaker":         "Ben Whittaker (boxer)",
            "Bakary Samake":         "Bakary Samake",
            "Abdullah Mason":        "Abdullah Mason (boxer)",
            "Keyshawn Davis":        "Keyshawn Davis (boxer)",
            "Bruce Carrington":      "Bruce Carrington (boxer)",
            "Anthony Olascuaga":     "Anthony Olascuaga",
            "Brandon Figueroa":      "Brandon Figueroa (boxer)",
            "Angelo Leo":            "Angelo Leo (boxer)",
            "Stephen Fulton":        "Stephen Fulton Jr.",
            "Gabriela Fundora":      "Gabriela Fundora",
        };

        // fetchFighterImg no longer used — replaced by getLocalFighterImg above
        async function fetchFighterImg(name) {
            return getLocalFighterImg(name);
            if (_fighterImgCache[name] !== undefined) return _fighterImgCache[name];
            if (_fighterImgInflight[name]) return _fighterImgInflight[name];

            // TheSportsDB — boxing-specific database, fewer false matches
            const sportsdb = async (query) => {
                try {
                    const enc = encodeURIComponent(query);
                    const r = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${enc}`, { cache: 'force-cache' });
                    if (!r.ok) return null;
                    const d = await r.json();
                    const players = d?.player;
                    if (!players?.length) return null;
                    // Prefer boxing matches; fall back to any match with an image
                    const nameLower = query.toLowerCase();
                    const boxers = players.filter(p =>
                        (p.strSport || '').toLowerCase().includes('box') ||
                        (p.strPosition || '').toLowerCase().includes('box')
                    );
                    const pool = boxers.length ? boxers : players;
                    // Pick the one whose name best matches
                    const scored = pool
                        .filter(p => p.strThumb || p.strCutout)
                        .map(p => {
                            const n = (p.strPlayer || '').toLowerCase();
                            const score = nameLower.split(' ').filter(w => n.includes(w)).length;
                            return { score, url: p.strThumb || p.strCutout };
                        })
                        .sort((a, b) => b.score - a.score);
                    return scored[0]?.url || null;
                } catch { return null; }
            };

            // REST summary — fastest Wikipedia path, works for main articles
            const wikiSummary = async (query) => {
                try {
                    const enc = encodeURIComponent(query.trim().replace(/ /g, '_'));
                    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${enc}`, { cache: 'force-cache' });
                    if (!r.ok) return null;
                    const d = await r.json();
                    // Reject if the article title is wildly different (wrong-fighter guard)
                    const title = (d?.title || '').toLowerCase();
                    const nameParts = name.toLowerCase().split(' ');
                    const matchCount = nameParts.filter(w => w.length > 2 && title.includes(w)).length;
                    if (matchCount === 0 && nameParts.length > 1) return null; // likely wrong article
                    return d?.thumbnail?.source || null;
                } catch { return null; }
            };

            // Search API — broader, with name-relevance filter to avoid wrong fighters
            const wikiSearch = async (query) => {
                try {
                    const enc = encodeURIComponent(query);
                    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${enc}&gsrlimit=5&prop=pageimages|info&pithumbsize=400&format=json&origin=*`;
                    const r = await fetch(url, { cache: 'force-cache' });
                    if (!r.ok) return null;
                    const d = await r.json();
                    const pages = Object.values(d?.query?.pages || {});
                    const nameLower = name.toLowerCase();
                    // Only accept results whose title contains at least one meaningful word from the fighter's name
                    const relevant = pages.filter(p => {
                        const title = (p.title || '').toLowerCase();
                        return name.toLowerCase().split(' ').some(w => w.length > 2 && title.includes(w));
                    });
                    const hit = relevant.find(p => p.thumbnail?.source);
                    return hit?.thumbnail?.source || null;
                } catch { return null; }
            };

            const promise = (async () => {
                let url = null;
                const wikiName = WIKI_NAME_MAP[name] || name;

                // 1. TheSportsDB (sports-specific, avoids Wikipedia false matches)
                url = await sportsdb(name);
                // 2. Exact Wikipedia article (using corrected name if mapped)
                if (!url) url = await wikiSummary(wikiName);
                // 3. "(boxer)" disambiguation
                if (!url && !WIKI_NAME_MAP[name]) url = await wikiSummary(name + ' (boxer)');
                // 4. "(professional boxer)" — common for women fighters
                if (!url && !WIKI_NAME_MAP[name]) url = await wikiSummary(name + ' (professional boxer)');
                // 5. Wikipedia full-text search with name-relevance filter
                if (!url) url = await wikiSearch(name + ' boxer');
                _fighterImgCache[name] = url;
                return url;
            })();

            _fighterImgInflight[name] = promise;
            return promise;
        }

        // Parse "Fighter A vs Fighter B, weight class" → [nameA, nameB]
        function parseFightNames(fightStr) {
            if (!fightStr) return ['', ''];
            const m = fightStr.match(/^(.+?)\s+vs\.?\s+(.+?)(?:,|$)/i);
            return m ? [m[1].trim(), m[2].trim()] : ['', ''];
        }

        // ============ PAGE RENDERERS ============
        function renderHome() {
            // Show loading spinner while fetching live H2H data
            const upcomingDiv = document.getElementById('upcomingFights');
            if (upcomingDiv) {
                upcomingDiv.innerHTML = '<div style="text-align:center;padding:24px;color:#999;"><div style="display:inline-block;width:22px;height:22px;border:3px solid #ddd;border-top-color:#e63333;border-radius:50%;animation:spin 0.8s linear infinite;"></div><p style="margin-top:10px;font-size:13px;">Loading schedule…</p></div>';
            }
            loadUpcomingFromSheets();

            // Fetch live news
            app.fetchBoxingNews();
        }

        function renderUpcoming() {
            loadFullScheduleFromSheets();
        }

        function renderLadder() {
            loadLadderFromSheets();
        }

        function renderTeams() {
            const grid = document.getElementById('teamsGrid');

            const FLAG = {
                'USA':'🇺🇸','United Kingdom':'🇬🇧','Australia':'🇦🇺','Mexico':'🇲🇽',
                'Japan':'🇯🇵','Tokyo, Japan':'🇯🇵','Canada':'🇨🇦','Cuba':'🇨🇺',
                'France':'🇫🇷','Germany':'🇩🇪','Russia':'🇷🇺','Ukraine':'🇺🇦',
                'Puerto Rico':'🇵🇷','Philippines':'🇵🇭','Ireland':'🇮🇪','Uzbekistan':'🇺🇿',
                'Kazakhstan':'🇰🇿','Croatia':'🇭🇷','Venezuela':'🇻🇪','Nigeria':'🇳🇬',
                'New Zealand':'🇳🇿','Nicaragua':'🇳🇮','Sweden':'🇸🇪','Thailand':'🇹🇭',
                'Italy':'🇮🇹','China':'🇨🇳','Congo':'🇨🇩','Dominican Republic':'🇩🇴',
                'Guatemala':'🇬🇹'
            };

            const DIV_ORDER = ['Heavies','Middles','Welters','Lights','Smalls'];
            const DIV_LABEL = {
                'Heavies':'Heavies','Middles':'Middles',
                'Welters':'Welters','Lights':'Lights','Smalls':'Smalls'
            };

            const ROSTER = [
                // ── DOM ──────────────────────────────────────────────
                {team:'Dom',rd:1, name:'Oleksandr Usyk',       div:'Heavies', country:'Ukraine'},
                {team:'Dom',rd:5, name:'Daniel Dubois',         div:'Heavies', country:'United Kingdom'},
                {team:'Dom',rd:10,name:'Tyson Fury',            div:'Heavies', country:'United Kingdom'},
                {team:'Dom',rd:19,name:'Derek Chisora',         div:'Heavies', country:'United Kingdom'},
                {team:'Dom',rd:3, name:'Artur Beterbiev',       div:'Middles', country:'Canada'},
                {team:'Dom',rd:12,name:'Osleys Iglesias',       div:'Middles', country:'Cuba'},
                {team:'Dom',rd:14,name:'Armando Resendiz',      div:'Middles', country:'Mexico'},
                {team:'Dom',rd:18,name:'Anthony Yarde',         div:'Middles', country:'United Kingdom'},
                {team:'Dom',rd:7, name:'Bakhram Murtazaliev',   div:'Welters', country:'Russia'},
                {team:'Dom',rd:9, name:'Israil Madrimov',       div:'Welters', country:'Uzbekistan'},
                {team:'Dom',rd:16,name:'Errol Spence',          div:'Welters', country:'USA'},
                {team:'Dom',rd:20,name:'Serhii Bohachuk',       div:'Welters', country:'Ukraine'},
                {team:'Dom',rd:4, name:'Keyshawn Davis',        div:'Lights',  country:'USA'},
                {team:'Dom',rd:8, name:'Ryan Garcia',           div:'Lights',  country:'USA'},
                {team:'Dom',rd:11,name:'Gary Antuanne Russell', div:'Lights',  country:'USA'},
                {team:'Dom',rd:15,name:'Eduardo Nunez',         div:'Lights',  country:'Mexico'},
                {team:'Dom',rd:2, name:'Jesse Rodriguez',       div:'Smalls',  country:'USA'},
                {team:'Dom',rd:6, name:'Rafael Espinoza',       div:'Smalls',  country:'Mexico'},
                {team:'Dom',rd:13,name:'Luis Nery',             div:'Smalls',  country:'Mexico'},
                {team:'Dom',rd:17,name:'Christian Medina',      div:'Smalls',  country:'Mexico'},
                // ── TOM ──────────────────────────────────────────────
                {team:'Tom',rd:20,name:'Arslanbek Makhmudov',  div:'Heavies', country:'Canada'},
                {team:'Tom',rd:7, name:'Gilberto Ramirez',     div:'Heavies', country:'Mexico'},
                {team:'Tom',rd:10,name:'Jared Anderson',       div:'Heavies', country:'USA'},
                {team:'Tom',rd:15,name:'David Nyika',          div:'Heavies', country:'New Zealand'},
                {team:'Tom',rd:3, name:'Canelo Alvarez',       div:'Middles', country:'Mexico'},
                {team:'Tom',rd:4, name:'Diego Pacheco',        div:'Middles', country:'USA'},
                {team:'Tom',rd:9, name:'Carlos Adames',        div:'Middles', country:'Dominican Republic'},
                {team:'Tom',rd:11,name:'Lester Martínez',      div:'Middles', country:'Guatemala'},
                {team:'Tom',rd:1, name:'Jaron Ennis',          div:'Welters', country:'USA'},
                {team:'Tom',rd:2, name:'Sebastian Fundora',    div:'Welters', country:'USA'},
                {team:'Tom',rd:14,name:'Rohan Polanco',        div:'Welters', country:'Dominican Republic'},
                {team:'Tom',rd:17,name:'Callum Walsh',         div:'Welters', country:'Ireland'},
                {team:'Tom',rd:5, name:'Emanuel Navarrete',    div:'Lights',  country:'Mexico'},
                {team:'Tom',rd:8, name:'Delante Johnson',      div:'Lights',  country:'USA'},
                {team:'Tom',rd:12,name:"O'Shaquie Foster",     div:'Lights',  country:'USA'},
                {team:'Tom',rd:18,name:'Jazza Dickens',        div:'Lights',  country:'United Kingdom'},
                {team:'Tom',rd:6, name:'Skye Nicholson',       div:'Smalls',  country:'Australia'},
                {team:'Tom',rd:13,name:'Angelo Leo',           div:'Smalls',  country:'USA'},
                {team:'Tom',rd:16,name:'Ryosuke Nishida',      div:'Smalls',  country:'Japan'},
                {team:'Tom',rd:19,name:'Anthony Olascuaga',    div:'Smalls',  country:'USA'},
                // ── ELYSE ─────────────────────────────────────────────
                {team:'Elyse',rd:3, name:'Claressa Shields',        div:'Heavies', country:'USA'},
                {team:'Elyse',rd:7, name:'Bakhodir Jalolov',        div:'Heavies', country:'Uzbekistan'},
                {team:'Elyse',rd:12,name:'Martin Bakole',           div:'Heavies', country:'Congo'},
                {team:'Elyse',rd:16,name:'Tony Yoka',               div:'Heavies', country:'France'},
                {team:'Elyse',rd:2, name:'Hamzah Sheeraz',          div:'Middles', country:'United Kingdom'},
                {team:'Elyse',rd:8, name:'Najee Lopez',             div:'Middles', country:'USA'},
                {team:'Elyse',rd:13,name:'Ammo Williams',           div:'Middles', country:'USA'},
                {team:'Elyse',rd:17,name:'Albert Ramirez',          div:'Middles', country:'Venezuela'},
                {team:'Elyse',rd:4, name:'Jesus Alejandro Ramos',   div:'Welters', country:'Mexico'},
                {team:'Elyse',rd:7, name:'Tim Tszyu',               div:'Welters', country:'Australia'},
                {team:'Elyse',rd:9, name:'Jorge Garcia Perez',      div:'Welters', country:'Mexico'},
                {team:'Elyse',rd:18,name:'Paddy Donovan',           div:'Welters', country:'Ireland'},
                {team:'Elyse',rd:5, name:'Alycia Baumgardner',      div:'Lights',  country:'USA'},
                {team:'Elyse',rd:10,name:'Anthony Cacace',          div:'Lights',  country:'United Kingdom'},
                {team:'Elyse',rd:14,name:'Arnold Barboza Jr',       div:'Lights',  country:'USA'},
                {team:'Elyse',rd:19,name:'Luis Alberto Lopez',      div:'Lights',  country:'Mexico'},
                {team:'Elyse',rd:1, name:'Naoya Inoue',             div:'Smalls',  country:'Japan'},
                {team:'Elyse',rd:11,name:'Murodjon Akhmadaliev',    div:'Smalls',  country:'Uzbekistan'},
                {team:'Elyse',rd:15,name:'Tenshin Nasukawa',        div:'Smalls',  country:'Japan'},
                {team:'Elyse',rd:20,name:'Robeisy Ramirez',         div:'Smalls',  country:'Cuba'},
                // ── PAT ───────────────────────────────────────────────
                {team:'Pat',rd:1, name:'David Benavidez',      div:'Heavies', country:'Mexico'},
                {team:'Pat',rd:6, name:'Filip Hrgovic',         div:'Heavies', country:'Croatia'},
                {team:'Pat',rd:15,name:'Efe Ajagba',            div:'Heavies', country:'Nigeria'},
                {team:'Pat',rd:18,name:'Richard Riakporhe',     div:'Heavies', country:'United Kingdom'},
                {team:'Pat',rd:4, name:'Christian Mbilli',      div:'Middles', country:'France'},
                {team:'Pat',rd:7, name:'Jaime Munguia',         div:'Middles', country:'Mexico'},
                {team:'Pat',rd:13,name:'Jermall Charlo',        div:'Middles', country:'USA'},
                {team:'Pat',rd:20,name:'Paulo Aokuso',          div:'Middles', country:'Australia'},
                {team:'Pat',rd:2, name:'Vergil Ortiz Jr',       div:'Welters', country:'USA'},
                {team:'Pat',rd:8, name:'Brian Norman Jr',       div:'Welters', country:'USA'},
                {team:'Pat',rd:12,name:'Raul Curiel',           div:'Welters', country:'Mexico'},
                {team:'Pat',rd:19,name:'Charles Conwell',       div:'Welters', country:'USA'},
                {team:'Pat',rd:3, name:'Katie Taylor',          div:'Lights',  country:'Ireland'},
                {team:'Pat',rd:5, name:'Dalton Smith',          div:'Lights',  country:'United Kingdom'},
                {team:'Pat',rd:10,name:'Caroline Dubois',       div:'Lights',  country:'United Kingdom'},
                {team:'Pat',rd:17,name:'Raymond Ford',          div:'Lights',  country:'USA'},
                {team:'Pat',rd:9, name:'Kenshiro Teraji',       div:'Smalls',  country:'Japan'},
                {team:'Pat',rd:11,name:'Oscar Collazo',         div:'Smalls',  country:'Puerto Rico'},
                {team:'Pat',rd:14,name:'Takuma Inoue',          div:'Smalls',  country:'Japan'},
                {team:'Pat',rd:16,name:'Alan Picasso',          div:'Smalls',  country:'Mexico'},
                // ── MORT ──────────────────────────────────────────────
                {team:'Mort',rd:2, name:'Fabio Wardley',        div:'Heavies', country:'United Kingdom'},
                {team:'Mort',rd:5, name:'Teremoana Teremoana',  div:'Heavies', country:'Australia'},
                {team:'Mort',rd:6, name:'Joseph Parker',        div:'Heavies', country:'New Zealand'},
                {team:'Mort',rd:15,name:'Anthony Joshua',       div:'Heavies', country:'United Kingdom'},
                {team:'Mort',rd:4, name:'Callum Smith',         div:'Middles', country:'United Kingdom'},
                {team:'Mort',rd:11,name:'Michael Zerafa',       div:'Middles', country:'Australia'},
                {team:'Mort',rd:12,name:'Edgar Berlanga',       div:'Middles', country:'Puerto Rico'},
                {team:'Mort',rd:20,name:'Troy Isley',           div:'Middles', country:'USA'},
                {team:'Mort',rd:3, name:'Conor Benn',           div:'Welters', country:'United Kingdom'},
                {team:'Mort',rd:10,name:'Nikita Tszyu',         div:'Welters', country:'Australia'},
                {team:'Mort',rd:13,name:'Alexis Rocha',         div:'Welters', country:'USA'},
                {team:'Mort',rd:14,name:'Mario Barrios',        div:'Welters', country:'USA'},
                {team:'Mort',rd:1, name:'Shakur Stevenson',     div:'Lights',  country:'USA'},
                {team:'Mort',rd:16,name:'Emiliano Vargas',      div:'Lights',  country:'USA'},
                {team:'Mort',rd:17,name:'Liam Wilson',          div:'Lights',  country:'Australia'},
                {team:'Mort',rd:18,name:'Frank Martin',         div:'Lights',  country:'USA'},
                {team:'Mort',rd:7, name:'Stephen Fulton',       div:'Smalls',  country:'USA'},
                {team:'Mort',rd:8, name:'Bruce Carrington',     div:'Smalls',  country:'USA'},
                {team:'Mort',rd:9, name:'Brandon Figueroa',     div:'Smalls',  country:'USA'},
                {team:'Mort',rd:19,name:'Yoshiki Takei',        div:'Smalls',  country:'Japan'},
                // ── ASH ───────────────────────────────────────────────
                {team:'Ash',rd:4, name:'Agit Kabayel',          div:'Heavies', country:'Germany'},
                {team:'Ash',rd:6, name:'Richard Torrez Jr',     div:'Heavies', country:'USA'},
                {team:'Ash',rd:14,name:'Lenier Pero',           div:'Heavies', country:'Cuba'},
                {team:'Ash',rd:17,name:'Guido Vianello',        div:'Heavies', country:'Italy'},
                {team:'Ash',rd:2, name:'Dmitry Bivol',          div:'Middles', country:'Russia'},
                {team:'Ash',rd:7, name:'David Morrell',         div:'Middles', country:'Cuba'},
                {team:'Ash',rd:16,name:'Willy Hutchinson',      div:'Middles', country:'United Kingdom'},
                {team:'Ash',rd:20,name:'Yoenli Hernandez',      div:'Middles', country:'Cuba'},
                {team:'Ash',rd:1, name:'Devin Haney',           div:'Welters', country:'USA'},
                {team:'Ash',rd:11,name:'Lauren Price',          div:'Welters', country:'United Kingdom'},
                {team:'Ash',rd:15,name:'Mikaela Mayer',         div:'Welters', country:'USA'},
                {team:'Ash',rd:19,name:'Conah Walker',          div:'Welters', country:'United Kingdom'},
                {team:'Ash',rd:5, name:'Abdullah Mason',        div:'Lights',  country:'USA'},
                {team:'Ash',rd:8, name:'Adam Azim',             div:'Lights',  country:'United Kingdom'},
                {team:'Ash',rd:10,name:'Isaac Cruz',            div:'Lights',  country:'Mexico'},
                {team:'Ash',rd:18,name:'Ernesto Mercado',       div:'Lights',  country:'USA'},
                {team:'Ash',rd:3, name:'Gabriela Fundora',      div:'Smalls',  country:'USA'},
                {team:'Ash',rd:9, name:'Ellie Scotney',         div:'Smalls',  country:'United Kingdom'},
                {team:'Ash',rd:12,name:'Amanda Serrano',        div:'Smalls',  country:'Puerto Rico'},
                {team:'Ash',rd:13,name:'Seiya Tsutsumi',        div:'Smalls',  country:'Japan'},
                // ── BRAD ──────────────────────────────────────────────
                {team:'Brad',rd:1, name:'Jai Opetaia',              div:'Heavies', country:'Australia'},
                {team:'Brad',rd:6, name:'Murat Gassiev',            div:'Heavies', country:'Russia'},
                {team:'Brad',rd:9, name:'Jarrell Miller',           div:'Heavies', country:'USA'},
                {team:'Brad',rd:10,name:'David Allen',              div:'Heavies', country:'United Kingdom'},
                {team:'Brad',rd:11,name:'Zhanibek Alimkhanuly',     div:'Middles', country:'Kazakhstan'},
                {team:'Brad',rd:16,name:'Erislandy Lara',           div:'Middles', country:'Cuba'},
                {team:'Brad',rd:17,name:'Aaron McKenna',            div:'Middles', country:'Ireland'},
                {team:'Brad',rd:18,name:'Lyndon Arthur',            div:'Middles', country:'United Kingdom'},
                {team:'Brad',rd:2, name:'Rolando Romero',           div:'Welters', country:'USA'},
                {team:'Brad',rd:5, name:'Lewis Crocker',            div:'Welters', country:'United Kingdom'},
                {team:'Brad',rd:19,name:'Jack Catterall',           div:'Welters', country:'United Kingdom'},
                {team:'Brad',rd:20,name:'Liam Smith',               div:'Welters', country:'United Kingdom'},
                {team:'Brad',rd:4, name:'Teofimo Lopez',            div:'Lights',  country:'USA'},
                {team:'Brad',rd:7, name:'Richardson Hitchins',      div:'Lights',  country:'USA'},
                {team:'Brad',rd:8, name:'Lamont Roach',             div:'Lights',  country:'USA'},
                {team:'Brad',rd:14,name:'Liam Paro',                div:'Lights',  country:'Australia'},
                {team:'Brad',rd:3, name:'Nick Ball',                div:'Smalls',  country:'United Kingdom'},
                {team:'Brad',rd:12,name:'Galal Yafai',              div:'Smalls',  country:'United Kingdom'},
                {team:'Brad',rd:13,name:'Leigh Wood',               div:'Smalls',  country:'United Kingdom'},
                {team:'Brad',rd:15,name:'Jason Moloney',            div:'Smalls',  country:'Australia'},
                // ── KIERAN ────────────────────────────────────────────
                {team:'Kieran',rd:2, name:'Moses Itauma',           div:'Heavies', country:'United Kingdom'},
                {team:'Kieran',rd:7, name:'Justis Huni',            div:'Heavies', country:'Australia'},
                {team:'Kieran',rd:11,name:'Frank Sanchez',          div:'Heavies', country:'Cuba'},
                {team:'Kieran',rd:15,name:'Lawrence Okolie',        div:'Heavies', country:'United Kingdom'},
                {team:'Kieran',rd:3, name:'Ben Whittaker',          div:'Middles', country:'United Kingdom'},
                {team:'Kieran',rd:6, name:'Joshua Buatsi',          div:'Middles', country:'United Kingdom'},
                {team:'Kieran',rd:12,name:'Chris Eubank Jr',        div:'Middles', country:'United Kingdom'},
                {team:'Kieran',rd:18,name:'Conor Wallace',          div:'Middles', country:'Australia'},
                {team:'Kieran',rd:4, name:'Xander Zayas',           div:'Welters', country:'Puerto Rico'},
                {team:'Kieran',rd:8, name:'Bakary Samake',          div:'Welters', country:'France'},
                {team:'Kieran',rd:10,name:'Shakhram Giyasov',       div:'Welters', country:'Uzbekistan'},
                {team:'Kieran',rd:19,name:'Abass Baraou',           div:'Welters', country:'Germany'},
                {team:'Kieran',rd:1, name:'Andy Cruz',              div:'Lights',  country:'Cuba'},
                {team:'Kieran',rd:13,name:'Raymond Muratalla',      div:'Lights',  country:'USA'},
                {team:'Kieran',rd:16,name:'Jadier Herrera',         div:'Lights',  country:'Cuba'},
                {team:'Kieran',rd:17,name:'Floyd Schofield',        div:'Lights',  country:'USA'},
                {team:'Kieran',rd:5, name:'Junto Nakatani',         div:'Smalls',  country:'Japan'},
                {team:'Kieran',rd:9, name:'Ricardo Rafael Sandoval',div:'Smalls',  country:'USA'},
                {team:'Kieran',rd:14,name:'Sam Goodman',            div:'Smalls',  country:'Australia'},
                {team:'Kieran',rd:20,name:'Sebastian Reyes',        div:'Smalls',  country:'Mexico'},
                // ── REJECTS ───────────────────────────────────────────
                {team:'Rejects',rd:4, name:'Deontay Wilder',            div:'Heavies', country:'USA'},
                {team:'Rejects',rd:8, name:'Andy Ruiz',                 div:'Heavies', country:'Mexico'},
                {team:'Rejects',rd:10,name:'Zhilei Zhang',              div:'Heavies', country:'China'},
                {team:'Rejects',rd:19,name:'Otto Wallin',               div:'Heavies', country:'Sweden'},
                {team:'Rejects',rd:2, name:'Terence Crawford',          div:'Middles', country:'USA'},
                {team:'Rejects',rd:7, name:'Caleb Plant',               div:'Middles', country:'USA'},
                {team:'Rejects',rd:15,name:'Oleksandr Gvozdyk',         div:'Middles', country:'Ukraine'},
                {team:'Rejects',rd:20,name:'Bektemir Melikuziev',       div:'Middles', country:'Uzbekistan'},
                {team:'Rejects',rd:1, name:'Manny Pacquiao',            div:'Welters', country:'Philippines'},
                {team:'Rejects',rd:5, name:'Jermell Charlo',            div:'Welters', country:'USA'},
                {team:'Rejects',rd:6, name:'Keith Thurman',             div:'Welters', country:'USA'},
                {team:'Rejects',rd:13,name:'Erickson Lubin',            div:'Welters', country:'USA'},
                {team:'Rejects',rd:3, name:'Gervonta Davis',            div:'Lights',  country:'USA'},
                {team:'Rejects',rd:12,name:'Subriel Matias',            div:'Lights',  country:'Puerto Rico'},
                {team:'Rejects',rd:14,name:'William Zepeda',            div:'Lights',  country:'Mexico'},
                {team:'Rejects',rd:16,name:'Oscar Valdez',              div:'Lights',  country:'Mexico'},
                {team:'Rejects',rd:9, name:'Chocolatito',               div:'Smalls',  country:'Nicaragua'},
                {team:'Rejects',rd:11,name:'Juan Francisco Estrada',    div:'Smalls',  country:'Mexico'},
                {team:'Rejects',rd:17,name:'Srisaket Sor Rungvisai',    div:'Smalls',  country:'Thailand'},
                {team:'Rejects',rd:18,name:'Andrew Moloney',            div:'Smalls',  country:'Australia'},
            ];

            const TEAM_ORDER = ['Dom','Tom','Elyse','Pat','Mort','Ash','Brad','Kieran','Rejects'];

            // Build a name → {pts, upcoming} lookup from live sheet data (if loaded)
            const statsMap = {};
            rpFighters.forEach(f => { statsMap[f.name.toLowerCase()] = {pts: f.pts, upcoming: f.upcoming}; });

            grid.innerHTML = TEAM_ORDER.map(teamName => {
                const color = TEAM_COLOR_MAP[teamName] || '#999';
                const squad = ROSTER.filter(f => f.team === teamName);

                const bodyHTML = DIV_ORDER.map(div => {
                    const rows = squad.filter(f => f.div === div).sort((a,b) => a.rd - b.rd);
                    if (!rows.length) return '';
                    return `<div class="div-section">
                        <div class="div-label">${DIV_LABEL[div]}</div>
                        ${rows.map(f => {
                            const stats = statsMap[f.name.toLowerCase()] || {pts: 0, upcoming: ''};
                            const ptsHtml = stats.pts > 0
                                ? `<span class="f-pts-badge has-pts">${stats.pts}pts</span>`
                                : `<span class="f-pts-badge"></span>`;
                            const dateHtml = stats.upcoming
                                ? `<span class="f-date-badge">📅 ${stats.upcoming}</span>`
                                : `<span class="f-date-badge empty"></span>`;
                            return `
                        <div class="fighter-row">
                            <div class="fighter-avatar-wrap" style="border-color:${color}40">
                                <img data-fighter="${f.name}" alt="${f.name}" style="display:none">
                                <span class="avatar-fallback">👤</span>
                            </div>
                            <span class="f-flag">${FLAG[f.country] || '🌍'}</span>
                            <div class="f-info">
                                <div class="f-name">${f.name}</div>
                                <div class="f-meta">
                                    <span class="rd-badge">Rd ${f.rd}</span>
                                    ${ptsHtml}
                                    ${dateHtml}
                                </div>
                            </div>
                        </div>`;
                        }).join('')}
                    </div>`;
                }).join('');

                return `<div class="squad-card">
                    <div class="squad-header" style="border-top:4px solid ${color}">
                        <span class="squad-name" style="color:${color}">${teamName}</span>
                        <span class="squad-count">${squad.length} fighters</span>
                    </div>
                    <div class="squad-body">${bodyHTML}</div>
                </div>`;
            }).join('');
            loadFighterImages(grid);
        }

        function renderDraft() {
            const grid = document.getElementById('fightersGrid');
            const statusDiv = document.getElementById('draftStatusValue');
            const currentPickDiv = document.getElementById('currentPickValue');
            const countDiv = document.getElementById('picksCountValue');
            const recentDiv = document.getElementById('recentPicksList');
            const startBtn = document.getElementById('startDraftBtn');
            const resetBtn = document.getElementById('resetDraftBtn');

            statusDiv.textContent = draftState.draftActive ? 'Active' : 'Not Started';
            countDiv.textContent = draftState.picks.length;

            if (draftState.draftActive && draftState.draftOrder.length > 0) {
                const currentTeamId = draftState.draftOrder[draftState.currentPickIndex % draftState.draftOrder.length];
                const currentTeam = teams.find(t => t.id === currentTeamId);
                currentPickDiv.textContent = currentTeam?.name || '—';
            } else {
                currentPickDiv.textContent = '—';
            }

            startBtn.disabled = draftState.draftActive;
            resetBtn.disabled = draftState.picks.length === 0;

            if (userRole !== 'commissioner') {
                startBtn.style.display = 'none';
                resetBtn.style.display = 'none';
            }

            grid.innerHTML = fighters.map(fighter => {
                const isDrafted = draftState.picks.some(p => p.fighterId === fighter.id);
                const isUsersTurn = draftState.draftActive && userTeamId &&
                    draftState.draftOrder[draftState.currentPickIndex % draftState.draftOrder.length] === userTeamId;

                return `
                    <div class="fighter-card ${isDrafted ? 'drafted' : ''} ${isUsersTurn ? 'your-turn' : ''}"
                        onclick="selectFighter('${fighter.id}')" style="${isDrafted ? '' : 'cursor: pointer;'}">
                        <div class="fighter-name-draft">${fighter.name}</div>
                        <div class="fighter-division">${fighter.division}</div>
                        <div class="fighter-flag-draft">${fighter.flag}</div>
                        ${fighter.beltCount > 0 ? `<div class="fighter-belt-badge">${fighter.beltCount}🏆</div>` : ''}
                    </div>
                `;
            }).join('');

            recentDiv.innerHTML = draftState.picks.slice(-5).reverse().map(pick => {
                const team = teams.find(t => t.id === pick.teamId);
                const fighter = fighters.find(f => f.id === pick.fighterId);
                return `
                    <div class="draft-pick-item">
                        <div class="draft-pick-team">${team?.name}</div>
                        <div class="draft-pick-fighter">${fighter?.name}</div>
                    </div>
                `;
            }).join('');
        }

        function updateDraftUI() {
            if (document.getElementById('draftPage').classList.contains('active')) {
                renderDraft();
            }
        }

        function selectFighter(fighterId) {
            if (!draftState.draftActive || userRole !== 'owner') return;

            const currentTeamId = draftState.draftOrder[draftState.currentPickIndex % draftState.draftOrder.length];
            if (currentTeamId !== userTeamId) {
                alert('It\'s not your team\'s turn!');
                return;
            }

            const isDrafted = draftState.picks.some(p => p.fighterId === fighterId);
            if (isDrafted) {
                alert('This fighter has already been drafted!');
                return;
            }

            const db = firebase.firestore();
            const newPicks = [...draftState.picks, {
                teamId: userTeamId,
                fighterId: fighterId,
                timestamp: new Date(),
            }];

            const newIndex = (draftState.currentPickIndex + 1) % draftState.draftOrder.length;

            db.collection('league').doc('draftState').update({
                picks: newPicks,
                currentPickIndex: newIndex,
            }).catch(error => console.error('Draft error:', error));

            if (!rosters[userTeamId]) {
                rosters[userTeamId] = [];
            }
            rosters[userTeamId].push(fighterId);

            db.collection('league').doc('rosters').update({
                [userTeamId]: rosters[userTeamId],
            }).catch(error => console.error('Roster update error:', error));
        }

        function startDraft() {
            if (userRole !== 'commissioner') return;

            const db = firebase.firestore();
            const draftOrder = teams.map(t => t.id);

            db.collection('league').doc('draftState').update({
                draftActive: true,
                draftOrder: draftOrder,
                currentPickIndex: 0,
                picks: [],
            }).catch(error => console.error('Start draft error:', error));
        }

        function resetDraft() {
            if (userRole !== 'commissioner') return;

            const db = firebase.firestore();
            db.collection('league').doc('draftState').update({
                draftActive: false,
                draftOrder: [],
                currentPickIndex: 0,
                picks: [],
            }).catch(error => console.error('Reset draft error:', error));

            db.collection('league').doc('rosters').set({}).catch(error => console.error('Reset rosters error:', error));
        }

        function renderResults() {
            renderResultsForm();
            updateResultsUI();
        }

        function renderResultsForm() {
            const fighterASelect = document.getElementById('fighterA');
            if (!fighterASelect) return;
            const fighterBSelect = document.getElementById('fighterB');
            const winnerSelect = document.getElementById('fightWinner');

            [fighterASelect, fighterBSelect, winnerSelect].forEach(select => {
                select.innerHTML = '<option value="">Select Fighter</option>';
                fighters.forEach(f => {
                    const option = document.createElement('option');
                    option.value = f.id;
                    option.textContent = `${f.name} (${f.division})`;
                    select.appendChild(option);
                });
            });
        }

        function updateResultsUI() {
            const historyDiv = document.getElementById('resultsHistoryList');
            if (!historyDiv) return;
            historyDiv.innerHTML = fightResults.slice(0, 10).map(result => `
                <div class="result-item">
                    <div class="result-matchup">
                        <span>${result.fighterA} vs ${result.fighterB}</span>
                        <span class="result-winner">${result.winner} wins</span>
                    </div>
                    <div class="result-details">
                        <div class="result-detail-item">
                            <div class="result-detail-label">Method</div>
                            <div class="result-detail-value">${result.method}</div>
                        </div>
                        <div class="result-detail-item">
                            <div class="result-detail-label">Stars</div>
                            <div class="result-detail-value">${result.stars}/5</div>
                        </div>
                        <div class="result-detail-item">
                            <div class="result-detail-label">Points</div>
                            <div class="result-detail-value">${result.points}</div>
                        </div>
                        ${result.belts ? `<div class="result-detail-item">
                            <div class="result-detail-label">Belts</div>
                            <div class="result-detail-value">${result.belts}</div>
                        </div>` : ''}
                    </div>
                </div>
            `).join('');

            if (fightResults.length === 0) {
                historyDiv.innerHTML = '<div style="color: #999; font-style: italic; padding: 20px; text-align: center;">No results recorded yet</div>';
            }
        }

        async function submitFightResult(event) {
            event.preventDefault();

            const fighterAId = document.getElementById('fighterA').value;
            const fighterBId = document.getElementById('fighterB').value;
            const winnerId = document.getElementById('fightWinner').value;
            const method = document.getElementById('fightMethod').value;
            const stars = parseInt(document.getElementById('fightStars').value);
            const points = parseInt(document.getElementById('fightPoints').value);
            const belts = parseInt(document.getElementById('fightBelts').value) || 0;

            const fighterA = fighters.find(f => f.id === fighterAId);
            const fighterB = fighters.find(f => f.id === fighterBId);
            const winner = fighters.find(f => f.id === winnerId);

            const result = {
                fighterA: fighterA.name,
                fighterB: fighterB.name,
                winner: winner.name,
                method: method,
                stars: stars,
                points: points,
                belts: belts,
                timestamp: new Date(),
            };

            try {
                const db = firebase.firestore();
                await db.collection('fightResults').add(result);
                document.getElementById('resultsForm').reset();
                alert('Fight result recorded!');
            } catch (error) {
                alert('Error recording result: ' + error.message);
                console.error(error);
            }
        }

        function renderSetup() {
            if (userRole !== 'commissioner') return;

            document.getElementById('leagueName').value = leagueData.leagueName;
            document.getElementById('pickTimer').value = leagueData.pickTimer;
            document.getElementById('rosterSize').value = leagueData.rosterSize;

            renderTeamsAssignment();
        }

        function renderTeamsAssignment() {
            const container = document.getElementById('teamsAssignmentContainer');
            container.innerHTML = teams.map(team => {
                const owner = Object.values(users).find(u => u.teamId === team.id);
                return `
                    <div class="team-assignment-row">
                        <div class="team-assignment-name">
                            <span class="team-assignment-color" style="background:${team.color}"></span>
                            ${team.name}
                        </div>
                        <input type="email" class="team-assignment-input" id="owner_${team.id}"
                            placeholder="owner@example.com" value="${owner?.email || ''}">
                        <button class="team-assignment-button" onclick="assignTeamOwner('${team.id}')">Assign</button>
                    </div>
                `;
            }).join('');
        }

        async function assignTeamOwner(teamId) {
            const email = document.getElementById('owner_' + teamId).value.trim();
            if (!email) return;

            try {
                const db = firebase.firestore();
                const userSnapshot = await db.collection('users').where('email', '==', email).get();

                if (userSnapshot.empty) {
                    alert('User not found');
                    return;
                }

                const uid = userSnapshot.docs[0].id;

                await db.collection('users').doc(uid).update({
                    teamId: teamId,
                });

                alert('Team assigned!');
            } catch (error) {
                alert('Error assigning team: ' + error.message);
                console.error(error);
            }
        }

        async function saveLeagueSettings() {
            const name = document.getElementById('leagueName').value;
            const timer = parseInt(document.getElementById('pickTimer').value);
            const roster = parseInt(document.getElementById('rosterSize').value);

            try {
                const db = firebase.firestore();
                await db.collection('league').doc('config').update({
                    leagueName: name,
                    pickTimer: timer,
                    rosterSize: roster,
                });

                alert('League settings saved!');
            } catch (error) {
                alert('Error saving settings: ' + error.message);
                console.error(error);
            }
        }

        function updateTeamOwnerUI() {
            renderTeamsAssignment();
        }

        // ============ LIVE BOXING NEWS FEED ============
        const app = {
            async fetchBoxingNews() {
                const container = document.getElementById('newsItems');
                if (!container) return;
                container.innerHTML = '<div style="text-align:center;padding:30px;color:#999;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #ddd;border-top-color:#e63333;border-radius:50%;animation:spin 0.8s linear infinite;"></div><p style="margin-top:8px;font-size:13px;">Loading boxing news...</p></div>';

                const feeds = [
                    'https://feeds.bbci.co.uk/sport/boxing/rss.xml',
                    'https://www.skysports.com/rss/12040',
                    'https://www.boxingscene.com/feed',
                    'https://www.boxingnews24.com/feed',
                ];
                const proxies = [
                    url => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=12`,
                    url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
                ];

                for (const feed of feeds) {
                    for (const makeUrl of proxies) {
                        try {
                            const url = makeUrl(feed);
                            const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
                            if (!resp.ok) continue;

                            if (url.includes('rss2json')) {
                                const data = await resp.json();
                                if (data.status === 'ok' && data.items?.length > 0) {
                                    this._renderNewsJSON(container, data.items.slice(0, 12));
                                    return;
                                }
                            } else {
                                let xmlText;
                                const raw = await resp.text();
                                try { const j = JSON.parse(raw); xmlText = j.contents || raw; } catch { xmlText = raw; }
                                const parser = new DOMParser();
                                const xml = parser.parseFromString(xmlText, 'text/xml');
                                const items = xml.querySelectorAll('item');
                                if (items.length > 0) {
                                    this._renderNewsXML(container, items);
                                    return;
                                }
                            }
                        } catch (e) {
                            console.warn('News proxy failed:', e.message);
                            continue;
                        }
                    }
                }
                container.innerHTML = '<div style="text-align:center;padding:24px;color:#888;"><p style="font-size:14px;font-weight:600;">Could not load news</p><p style="font-size:12px;margin-top:4px;">Try clicking Refresh, or visit <a href="https://www.boxingscene.com" target="_blank" style="color:#e63333;">BoxingScene.com</a> directly.</p></div>';
            },

            _renderNewsJSON(container, items) {
                const sorted = [...items].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
                container.innerHTML = sorted.map(item => {
                    const date = new Date(item.pubDate);
                    const ago = this._timeAgo(date);
                    const snippet = (item.description || '').replace(/<[^>]*>/g, '').slice(0, 100);
                    return `<div class="news-item">
                        <a href="${item.link}" target="_blank" rel="noopener">
                            <h4>${this._esc(item.title)}</h4>
                            <div class="news-date">${ago}${item.author ? ' · ' + this._esc(item.author) : ''}</div>
                            ${snippet ? `<div class="news-snippet">${this._esc(snippet)}</div>` : ''}
                        </a>
                    </div>`;
                }).join('');
            },

            _renderNewsXML(container, items) {
                const arr = Array.from(items).map(item => ({
                    title:   item.querySelector('title')?.textContent || '',
                    link:    item.querySelector('link')?.textContent || '#',
                    pubDate: item.querySelector('pubDate')?.textContent || '',
                    desc:    (item.querySelector('description')?.textContent || '').replace(/<[^>]*>/g, '').slice(0, 100),
                }));
                arr.sort((a, b) => {
                    const da = a.pubDate ? new Date(a.pubDate) : new Date(0);
                    const db = b.pubDate ? new Date(b.pubDate) : new Date(0);
                    return db - da;
                });
                container.innerHTML = arr.slice(0, 12).map(item => {
                    const ago = item.pubDate ? this._timeAgo(new Date(item.pubDate)) : '';
                    return `<div class="news-item">
                        <a href="${item.link}" target="_blank" rel="noopener">
                            <h4>${this._esc(item.title)}</h4>
                            <div class="news-date">${ago}</div>
                            ${item.desc ? `<div class="news-snippet">${this._esc(item.desc)}</div>` : ''}
                        </a>
                    </div>`;
                }).join('');
            },

            _timeAgo(date) {
                const diff = Math.floor((new Date() - date) / 1000);
                if (diff < 0) return 'upcoming';
                if (diff < 60) return 'just now';
                if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
                if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
                if (diff < 604800) return `${Math.floor(diff/86400)}d ago`;
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            },

            _esc(str) {
                const d = document.createElement('div');
                d.textContent = str;
                return d.innerHTML;
            }
        };

        // Initialize on load — with Firebase availability check
        // ============ FULL SCHEDULE (UPCOMING PAGE) ============

        function getTeamColor(name) {
            if (!name) return '#555';
            // normalise REJECT → Rejects
            const n = name.toLowerCase() === 'reject' ? 'Rejects' : name;
            const key = Object.keys(TEAM_COLOR_MAP).find(k => k.toLowerCase() === n.toLowerCase());
            return key ? TEAM_COLOR_MAP[key] : '#555';
        }

        function renderStars(n) {
            const count = parseInt(n) || 0;
            if (!count) return '';
            return '⭐️'.repeat(count);
        }

        function escHtml(s) {
            const d = document.createElement('div');
            d.textContent = String(s == null ? '' : s);
            return d.innerHTML;
        }

        function parseScheduleRow(date, desc, stars, preview) {
            const d = (desc || '').trim();
            if (!d) return null;
            const starCount  = parseInt(stars) || 0;
            const previewTxt = (preview || '').trim();
            const isH2H = /^H2H\s*-/i.test(d);
            if (isH2H) {
                const body = d.replace(/^H2H\s*-\s*/i, '');
                const firstDash = body.indexOf(' - ');
                const matchup = firstDash > -1 ? body.substring(0, firstDash).trim() : body;
                const fight   = firstDash > -1 ? body.substring(firstDash + 3).trim() : '';
                const vMatch  = matchup.match(/^(.+?)\s+[Vv]\s+(.+)$/);
                const team1   = vMatch ? vMatch[1].trim().toUpperCase() : matchup.toUpperCase();
                const team2   = vMatch ? vMatch[2].trim().toUpperCase() : '';
                return { type: 'h2h', date, team1, team2, fight, stars: starCount, preview: previewTxt };
            } else {
                const dashIdx = d.indexOf(' - ');
                if (dashIdx === -1) return { type: 'regular', date, team: d.toUpperCase(), fight: '', stars: starCount, preview: previewTxt };
                const team  = d.substring(0, dashIdx).trim().toUpperCase();
                const fight = d.substring(dashIdx + 3).trim();
                return { type: 'regular', date, team, fight, stars: starCount, preview: previewTxt };
            }
        }

        function renderH2HCard(f) {
            const c1 = getTeamColor(f.team1);
            const c2 = getTeamColor(f.team2);
            const belts = getBeltImages(f.fight);
            const vsIdx = f.fight.search(/ vs\.? /i);
            let fightName = f.fight, fightDetail = '';
            if (vsIdx > -1) {
                // Split on first comma after the fighter names
                const commaIdx = f.fight.indexOf(',', vsIdx);
                if (commaIdx > -1) {
                    fightName   = f.fight.substring(0, commaIdx).trim();
                    fightDetail = f.fight.substring(commaIdx + 1).trim();
                }
            }
            const [nameA, nameB] = parseFightNames(fightName || f.fight);
            const starsHtml = f.stars ? `<div class="h2h-stars">${renderStars(f.stars)}</div>` : '';
            const previewTitle   = escHtml(fightName || f.fight);
            const previewContent = escHtml(f.preview || '');
            const previewFooter = f.preview ? `<div class="card-preview-footer"><button class="ff-preview-btn" onclick="ffOpenPreview(this)" data-title="${previewTitle}" data-preview="${previewContent}">💬 Fight Preview</button></div>` : '';
            return `
            <div class="h2h-card">
                <div class="h2h-top-bar" style="background:linear-gradient(to right,${c1} 50%,${c2} 50%)"></div>
                <div class="h2h-inner">
                    <div class="h2h-team-col">
                        ${nameA ? `
                        <div class="h2h-fighter-photo-wrap" style="border-color:${c1}">
                            <img data-fighter="${nameA}" alt="${nameA}" style="display:none">
                            <span class="photo-fallback">🥊</span>
                        </div>` : ''}
                        <div class="h2h-team-name" style="background:${c1}">${f.team1}</div>
                    </div>
                    <div class="h2h-centre">
                        <div style="display:flex;justify-content:center;">
                            <div class="h2h-matchup-label">⚔️ Head-to-Head</div>
                        </div>
                        <div class="h2h-vs-divider">— VS —</div>
                        <div class="h2h-fight-name">${fightName || f.fight}</div>
                        ${fightDetail ? `<div class="h2h-fight-detail">${fightDetail}</div>` : ''}
                        ${belts ? `<div class="h2h-belt-row">${belts}</div>` : ''}
                        ${starsHtml}
                    </div>
                    <div class="h2h-team-col">
                        ${nameB ? `
                        <div class="h2h-fighter-photo-wrap" style="border-color:${c2}">
                            <img data-fighter="${nameB}" alt="${nameB}" style="display:none">
                            <span class="photo-fallback">🥊</span>
                        </div>` : ''}
                        <div class="h2h-team-name" style="background:${c2}">${f.team2}</div>
                    </div>
                    <div class="h2h-vs-mobile">— VS —</div>
                </div>
                ${previewFooter}
            </div>`;
        }

        function renderFightRow(f) {
            const color = getTeamColor(f.team);
            const belts = getBeltImages(f.fight);
            const commaIdx = f.fight ? f.fight.indexOf(',') : -1;
            const fightName   = commaIdx > -1 ? f.fight.substring(0, commaIdx).trim() : f.fight;
            const fightDetail = commaIdx > -1 ? f.fight.substring(commaIdx + 1).trim() : '';
            const starsHtml = f.stars ? `<div class="fight-row-stars">${renderStars(f.stars)}</div>` : '';
            const previewFooter = f.preview ? `<div class="card-preview-footer"><button class="ff-preview-btn" onclick="ffOpenPreview(this)" data-title="${escHtml(fightName || f.fight)}" data-preview="${escHtml(f.preview)}">💬 Fight Preview</button></div>` : '';
            return `
            <div class="fight-row${f.preview ? ' fight-row--has-preview' : ''}">
                <div class="fight-row-main">
                    <div class="fight-row-team" style="background:${color}">${f.team}</div>
                    <div class="fight-row-info">
                        <div class="fight-row-name">${fightName || '—'}</div>
                        ${fightDetail ? `<div class="fight-row-detail">${fightDetail}</div>` : ''}
                    </div>
                    ${(belts || starsHtml) ? `<div class="fight-row-right">${belts ? `<div class="fight-row-belts">${belts}</div>` : ''}${starsHtml}</div>` : ''}
                </div>
                ${previewFooter}
            </div>`;
        }

        async function loadFullScheduleFromSheets() {
            const container = document.getElementById('scheduleContainer');
            if (!container) return;
            try {
                const data = await fetchGviz(GS_SCHEDULE_GID);
                const rows = data.table?.rows || [];

                let lastDate = '';
                const parsed = [];
                rows.forEach(row => {
                    if (!row.c) return;
                    const dc = String(gvizCell(row, 0) || '').trim();
                    const fc = String(gvizCell(row, 1) || '').trim();
                    const sc = String(gvizCell(row, 2) || '').trim();
                    const pc = String(gvizCell(row, 3) || '').trim(); // column D — fight preview
                    if (dc) lastDate = dc;
                    if (!fc || !lastDate) return;
                    const item = parseScheduleRow(lastDate, fc, sc, pc);
                    if (item) parsed.push(item);
                });

                // Group by date preserving order
                const dateOrder = [];
                const byDate = {};
                parsed.forEach(f => {
                    if (!byDate[f.date]) { byDate[f.date] = []; dateOrder.push(f.date); }
                    byDate[f.date].push(f);
                });

                if (!dateOrder.length) {
                    container.innerHTML = '<div style="color:#999;padding:20px;text-align:center;">No upcoming fights scheduled.</div>';
                    return;
                }

                container.innerHTML = dateOrder.map(date => {
                    const fights = byDate[date];
                    const h2hCount = fights.filter(f => f.type === 'h2h').length;
                    const tag = h2hCount ? `${h2hCount} H2H · ${fights.length} fights` : `${fights.length} fight${fights.length !== 1 ? 's' : ''}`;
                    return `
                    <div class="schedule-week">
                        <div class="schedule-date-header">
                            <div class="schedule-date-pill">${date} 2026</div>
                            <div class="schedule-date-line"></div>
                            <div class="schedule-fight-count">${tag}</div>
                        </div>
                        ${fights.map(f => f.type === 'h2h' ? renderH2HCard(f) : renderFightRow(f)).join('')}
                    </div>`;
                }).join('');
                loadFighterImages(container);

            } catch (err) {
                console.warn('Schedule load error:', err);
                container.innerHTML = '<div style="color:#999;padding:20px;text-align:center;">Could not load schedule — check sheet sharing settings.</div>';
            }
        }

        // ============ GOOGLE SHEETS LIVE INTEGRATION ============
        const GS_SHEET_ID = '1oEg0M9nHUc3Us6RWMyqOg5YO78ASBqQ8WpSxcpA3YEc';
        const GS_LADDER_GID  = '779860156';
        const GS_RESULTS_GID = '1081462908';
        const GS_SCHEDULE_GID = '961931973';
        const GS_H2H_SCHEDULE_GID = '1949894692';

        const TEAM_COLOR_MAP = {
            'Dom':     '#e63333',  // Red
            'Tom':     '#16a34a',  // Green
            'Elyse':   '#ec4899',  // Pink
            'Pat':     '#f97316',  // Orange
            'Mort':    '#eab308',  // Yellow
            'Ash':     '#0ea5e9',  // Light Blue
            'Brad':    '#1d4ed8',  // Dark Blue
            'Kieran':  '#b45309',  // Light Brown
            'Rejects': '#6b7280',  // Grey
        };

        async function fetchGviz(gid) {
            const url = `https://docs.google.com/spreadsheets/d/${GS_SHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}`;
            const resp = await fetch(url, { cache: 'no-store' });
            if (!resp.ok) throw new Error('Sheet fetch failed: ' + resp.status);
            const text = await resp.text();
            const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/);
            if (!match) throw new Error('Unexpected sheet response format');
            return JSON.parse(match[1]);
        }

        function gvizCell(row, col) {
            const c = row.c?.[col];
            if (!c || c.v === null || c.v === undefined) return '';
            return c.f || c.v; // prefer formatted value if available
        }

        function gvizNum(row, col) {
            const c = row.c?.[col];
            if (!c || c.v === null || c.v === undefined) return 0;
            return Number(c.v) || 0;
        }

        async function loadLadderFromSheets() {
            const tbody = document.getElementById('ladderBody');
            const status = document.getElementById('ladderLastUpdated');
            if (!tbody) return;

            try {
                const data = await fetchGviz(GS_LADDER_GID);
                const rows = data.table?.rows || [];
                // All expected teams — ensure every one appears even if sheet is missing them
                const ALL_TEAMS = ['Dom','Tom','Elyse','Pat','Mort','Ash','Brad','Kieran','Rejects'];
                // Filter to only known teams (handles gviz returning header rows or blank rows)
                const teamRows = rows
                    .filter(r => r.c && ALL_TEAMS.includes(gvizCell(r, 1)))
                    .sort((a, b) => gvizNum(b, 10) - gvizNum(a, 10)); // sort by points descending

                tbody.innerHTML = '';

                // Build a map of teams already in the sheet
                const sheetTeams = new Set(teamRows.map(r => gvizCell(r, 1)));
                const missingTeams = ALL_TEAMS.filter(t => !sheetTeams.has(t));

                // Render sheet rows first (ranked), then missing teams at bottom with dashes
                const renderRow = (teamName, pts, fights, w, l, d, kos, belts, stars, h2h, rank, missing) => {
                    const color = TEAM_COLOR_MAP[teamName] || '#999';
                    const tr = document.createElement('tr');
                    if (missing) tr.style.opacity = '0.45';
                    tr.innerHTML = `
                        <td style="font-weight:700;color:#aaa;font-size:13px;">${missing ? '—' : rank}</td>
                        <td class="team-name">
                            <span class="team-color-dot" style="background:${color}"></span>
                            ${teamName}
                        </td>
                        <td class="ladder-pts">${pts}</td>
                        <td class="stat-number">${fights}</td>
                        <td class="stat-number">${w}</td>
                        <td class="stat-number">${l}</td>
                        <td class="stat-number">${d}</td>
                        <td class="stat-number">${kos}</td>
                        <td class="stat-number">${belts}</td>
                        <td class="stat-number">${stars}</td>
                        <td class="stat-number">${h2h}</td>
                    `;
                    tbody.appendChild(tr);
                };

                teamRows.forEach((row, i) => {
                    // Columns: A=rank, B=Team, C=Fights, D=W, E=L, F=D, G=KOs, H=Belts, I=⭐️, J=H2H, K=Points
                    renderRow(
                        gvizCell(row, 1), gvizNum(row, 10), gvizNum(row, 2),
                        gvizNum(row, 3), gvizNum(row, 4), gvizNum(row, 5),
                        gvizNum(row, 6), gvizNum(row, 7), gvizNum(row, 8),
                        gvizNum(row, 9), i + 1, false
                    );
                });

                // Append any teams not yet in the sheet (greyed out, zeroes)
                missingTeams.forEach(name => renderRow(name, 0, 0, 0, 0, 0, 0, 0, 0, 0, null, true));

                if (status) status.textContent = '🟢 Live · Updated ' + new Date().toLocaleTimeString();
            } catch (err) {
                console.warn('Google Sheets ladder error:', err);
                if (tbody.innerHTML.includes('Loading')) {
                    tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;padding:20px;color:#999;">Could not load live standings — check sheet is set to "Anyone with link can view"</td></tr>';
                }
                if (status) status.textContent = '⚠️ Could not load';
            }
        }

        async function loadUpcomingFromSheets() {
            const div = document.getElementById('upcomingFights');
            if (!div) return;
            try {
                const data = await fetchGviz(GS_SCHEDULE_GID);
                const rows = data.table?.rows || [];
                const today = new Date();
                today.setHours(0,0,0,0);

                // Collect upcoming H2H fights from full schedule tab
                const upcoming = [];
                let lastDate = '';
                rows.forEach(row => {
                    if (!row.c) return;
                    const dateCell    = gvizCell(row, 0);
                    const descCell    = gvizCell(row, 1);
                    const starsCell   = gvizCell(row, 2);
                    const previewCell = gvizCell(row, 3); // column D — fight preview
                    if (dateCell) lastDate = String(dateCell).trim();
                    if (!descCell || !lastDate) return;
                    if (!String(descCell).includes('H2H')) return;

                    // Parse date — formats like "12 Apr", "3 May, Sun", "10 Apr, Fri"
                    const dateStr = lastDate.replace(/,.*$/, '').trim(); // strip ", Sun" etc.
                    const parsed = new Date(dateStr + ' 2026');
                    if (isNaN(parsed)) return;
                    parsed.setHours(0,0,0,0);
                    if (parsed < today) return; // skip past fights
                    upcoming.push({ date: parsed, dateStr: lastDate.replace(/,.*$/, '').trim(), desc: String(descCell).trim(), stars: parseInt(starsCell) || 0, preview: String(previewCell || '').trim() });
                });

                upcoming.sort((a, b) => a.date - b.date);
                const next = upcoming.slice(0, 6);

                if (next.length === 0) {
                    div.innerHTML = '<div style="color:#999;padding:16px;">No upcoming H2H fights scheduled yet.</div>';
                    return;
                }

                div.innerHTML = next.map(f => {
                    // Parse "H2H - DOM V TOM - Fighter A vs Fighter B, ..."
                    const parts = f.desc.replace(/^H2H\s*-\s*/, '').split(' - ');
                    const matchup = parts[0] || '';
                    const fight = parts.slice(1).join(' - ');
                    const [t1, t2] = matchup.split(/ V /i).map(s => s.trim());
                    const c1 = getTeamColor(t1);
                    const c2 = getTeamColor(t2);
                    const beltImgs = getBeltImages(fight);
                    const [nameA, nameB] = parseFightNames(fight);
                    const starsHtml = f.stars ? `<div class="home-fight-stars">${renderStars(f.stars)}</div>` : '';
                    const previewLabel = escHtml(nameA && nameB ? nameA + ' vs ' + nameB : fight);
                    const previewBtn   = f.preview ? `<button class="ff-preview-btn" onclick="ffOpenPreview(this)" data-title="${previewLabel}" data-preview="${escHtml(f.preview)}" style="margin-top:8px;width:100%;justify-content:center;">💬 Fight Preview</button>` : '';
                    return `
                        <div class="home-fight-card">
                            <div class="home-fight-header">
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <span style="background:${c1};color:white;padding:2px 9px;border-radius:5px;font-size:11.5px;font-weight:800;">${t1 || '?'}</span>
                                    <span style="font-weight:900;color:#e63333;font-size:11px;">VS</span>
                                    <span style="background:${c2};color:white;padding:2px 9px;border-radius:5px;font-size:11.5px;font-weight:800;">${t2 || '?'}</span>
                                </div>
                                <span style="font-size:11.5px;font-weight:700;color:#e63333;background:#fff0f0;padding:3px 9px;border-radius:20px;">${f.dateStr}</span>
                            </div>
                            <div class="home-fight-poster">
                                <div class="home-fight-fighter">
                                    <div class="home-fight-portrait" style="border-color:${c1}">
                                        ${nameA ? `<img data-fighter="${nameA}" alt="${nameA}" style="display:none">` : ''}
                                        <span class="portrait-fallback">🥊</span>
                                    </div>
                                    <div class="home-fight-fighter-name">${nameA || '—'}</div>
                                </div>
                                <div class="home-fight-vs-col">
                                    <div class="home-fight-vs-bubble">VS</div>
                                </div>
                                <div class="home-fight-fighter">
                                    <div class="home-fight-portrait" style="border-color:${c2}">
                                        ${nameB ? `<img data-fighter="${nameB}" alt="${nameB}" style="display:none">` : ''}
                                        <span class="portrait-fallback">🥊</span>
                                    </div>
                                    <div class="home-fight-fighter-name">${nameB || '—'}</div>
                                </div>
                            </div>
                            <div class="home-fight-footer">
                                <div class="home-fight-detail">${fight}</div>
                                ${beltImgs ? `<div style="margin-top:6px;text-align:center;">${beltImgs}</div>` : ''}
                                ${starsHtml}
                                ${previewBtn}
                            </div>
                        </div>`;
                }).join('');
                loadFighterImages(div);
            } catch (err) {
                console.warn('Google Sheets schedule error:', err);
            }
        }

        // Auto-refresh every 90 seconds when tab is visible
        let gsRefreshTimer = null;
        function startSheetsAutoRefresh() {
            if (gsRefreshTimer) clearInterval(gsRefreshTimer);
            gsRefreshTimer = setInterval(() => {
                const ladderPage = document.getElementById('ladderPage');
                if (ladderPage?.classList.contains('active')) loadLadderFromSheets();
                const homePage = document.getElementById('homePage');
                if (homePage?.classList.contains('active')) loadUpcomingFromSheets();
            }, 90000);
        }
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                const ladderPage = document.getElementById('ladderPage');
                if (ladderPage?.classList.contains('active')) loadLadderFromSheets();
            }
        });

        // ══════════════ PREVIEW / REVIEW MODAL ══════════════
        (function() {
            const overlay = document.createElement('div');
            overlay.id = 'ffModal';
            overlay.className = 'ff-modal-overlay';
            overlay.innerHTML = `
                <div class="ff-modal" id="ffModalBox">
                    <button class="ff-modal-close" id="ffModalClose" aria-label="Close">✕</button>
                    <div class="ff-modal-eyebrow" id="ffModalEyebrow">⚡ Fight Preview</div>
                    <div class="ff-modal-title"  id="ffModalTitle"></div>
                    <div class="ff-modal-body"   id="ffModalBody"></div>
                </div>`;
            document.body.appendChild(overlay);
            overlay.addEventListener('click', e => { if (e.target === overlay) ffCloseModal(); });
            document.getElementById('ffModalClose').addEventListener('click', ffCloseModal);
            document.addEventListener('keydown', e => { if (e.key === 'Escape') ffCloseModal(); });
        })();

        function ffOpenModal(eyebrow, title, body) {
            document.getElementById('ffModalEyebrow').textContent = eyebrow;
            document.getElementById('ffModalTitle').textContent   = title;
            document.getElementById('ffModalBody').textContent    = body;
            document.getElementById('ffModal').classList.add('open');
        }
        function ffCloseModal() {
            document.getElementById('ffModal').classList.remove('open');
        }
        // Called via data-attributes from inline onclick
        function ffOpenPreview(btn) {
            ffOpenModal('⚡ Fight Preview', btn.dataset.title, btn.dataset.preview);
        }
        function ffOpenReview(btn) {
            ffOpenModal('🗣️ Performance Review', btn.dataset.title, btn.dataset.review);
        }

        window.addEventListener('load', () => {
            if (typeof firebase === 'undefined') {
                // Firebase SDK didn't load (file:// protocol or no internet)
                console.warn('Firebase SDK not available.');
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Inter,sans-serif;background:#f5f5f5;">' +
                    '<div style="background:white;border-radius:16px;padding:40px;max-width:500px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.1);">' +
                    '<h1 style="font-size:24px;margin-bottom:12px;">Fantasy Fights</h1>' +
                    '<p style="color:#666;margin-bottom:20px;">This app needs to be accessed via its hosted URL to work properly.</p>' +
                    '<p style="color:#888;font-size:14px;">If you\'re the commissioner, deploy this file to GitHub Pages and share the URL with your league.</p>' +
                    '</div></div>';
                return;
            }
            initApp();
        });

        // ════════════════════════════════════════════════════
        // RECENT RESULTS — pulled from 'RECENT RESULTS' sheet tab
        // Expected columns: A=Fighter, B=Team, C=H2H (yes/H2H/blank),
        //                   D=Result text, E=Points, F=Performance Review
        // ════════════════════════════════════════════════════
        async function loadRecentResultsFromSheets() {
            const container = document.getElementById('rrContainer');
            if (!container) return;
            try {
                const url = `https://docs.google.com/spreadsheets/d/${GS_SHEET_ID}/gviz/tq?tqx=out:json&sheet=RECENT%20RESULTS&_cb=${Date.now()}`;
                const resp = await fetch(url, { cache: 'no-store' });
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                const text = await resp.text();
                const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/);
                if (!match) throw new Error('Unexpected format');
                const data = JSON.parse(match[1]);
                const rows = (data.table?.rows || []).filter(r => r.c && gvizCell(r, 0));

                if (!rows.length) {
                    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;color:#aaa;font-size:13px;">No recent results yet.</div>';
                    return;
                }

                container.innerHTML = rows.map(row => {
                    // Sheet columns: A=Team, B=H2H flag, C=Fighter name, D=Result, E=Pts, F=Review
                    const team   = String(gvizCell(row, 0) || '').trim();
                    const h2hRaw = String(gvizCell(row, 1) || '').toLowerCase();
                    const name   = String(gvizCell(row, 2) || '').trim();
                    const result = String(gvizCell(row, 3) || '').trim();
                    const pts    = String(gvizCell(row, 4) || '').trim();
                    const review = String(gvizCell(row, 5) || '').trim();

                    // Case-insensitive team colour lookup (sheet uses DOM, ASH, REJECT etc.)
                    const teamKey = Object.keys(TEAM_COLOR_MAP).find(k => k.toLowerCase() === team.toLowerCase())
                                 || Object.keys(TEAM_COLOR_MAP).find(k => team.toLowerCase().startsWith(k.toLowerCase()))
                                 || Object.keys(TEAM_COLOR_MAP).find(k => k.toLowerCase().startsWith(team.toLowerCase()));
                    const color  = teamKey ? TEAM_COLOR_MAP[teamKey] : '#6b7280';
                    const isH2H  = h2hRaw === 'yes' || h2hRaw === 'h2h' || h2hRaw === 'true' || h2hRaw === 'y';
                    // Determine win/loss/draw from the result string
                    const resultLower = result.toLowerCase();
                    const isWin  = /^\+|^w\b|^win|^won/i.test(result) || resultLower.startsWith('w ');
                    const isLoss = /^l\b|^loss|^lost/i.test(result) || resultLower.startsWith('l ');
                    const rCls   = isWin ? 'win' : isLoss ? 'loss' : 'draw';
                    const ptsNum = pts.replace(/^\+/, '');
                    const ptsStr = ptsNum ? `+${ptsNum}` : '';

                    const h2hBadge   = isH2H ? `<div class="rr-h2h-badge">⚔️ H2H</div>` : '';
                    const reviewBtn  = review
                        ? `<button class="rr-review-btn" onclick="ffOpenReview(this)" data-title="${rpEsc(name)}" data-review="${rpEsc(review)}" title="Performance Review">🗣️</button>`
                        : '';

                    return `<div class="rr-card" style="--tc:${color}">
                        <div class="rr-portrait">
                            <img data-fighter="${rpEsc(name)}" alt="${rpEsc(name)}" style="display:none">
                            <span class="rr-fallback">🥊</span>
                        </div>
                        <div class="rr-fighter-name">${rpEsc(name)}</div>
                        <div class="rr-team-lbl">${rpEsc(team)}</div>
                        ${h2hBadge}
                        <div class="rr-result ${rCls}">${rpEsc(result)}</div>
                        ${ptsStr ? `<div class="rr-pts">${rpEsc(ptsStr)} pts</div>` : ''}
                        ${reviewBtn}
                    </div>`;
                }).join('');

                loadFighterImages(container);
            } catch(err) {
                console.warn('[Recent Results]', err);
                container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:16px;color:#bbb;font-size:12px;">Could not load recent results — check sheet is public.</div>';
            }
        }

        // ============ 2026 RESULTS — GOOGLE SHEETS STANDINGS ============
        const RP_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1oEg0M9nHUc3Us6RWMyqOg5YO78ASBqQ8WpSxcpA3YEc/export?format=csv&gid=1081462908';
        const RP_REFRESH_MS = 5 * 60 * 1000;
        let rpFighters = [], rpFilter = 'All', rpSortKey = 'pts', rpSortAsc = false, rpLoaded = false, rpTimer = null;

        const RP_TEAM_COLORS = {
            'Dom':     '#e63333',
            'Tom':     '#16a34a',
            'Elyse':   '#ec4899',
            'Pat':     '#f97316',
            'Mort':    '#eab308',
            'Ash':     '#0ea5e9',
            'Brad':    '#1d4ed8',
            'Kieran':  '#b45309',
            'Rejects': '#6b7280',
        };
        const RP_DIV_STYLES = {
            'Lights': {bg:'#fefce8',c:'#713f12'},'Welters':{bg:'#eff6ff',c:'#1e3a8a'},
            'Smalls': {bg:'#f0fdf4',c:'#14532d'},'Middles':{bg:'#fff7ed',c:'#7c2d12'},
            'Heavies':{bg:'#fdf2f8',c:'#831843'}
        };
        const RP_FLAGS = {
            'Mexico':'🇲🇽','United Kingdom':'🇬🇧','USA':'🇺🇸','Dominican Republic':'🇩🇴',
            'Puerto Rico':'🇵🇷','Australia':'🇦🇺','Cuba':'🇨🇺','Germany':'🇩🇪',
            'Ireland':'🇮🇪','Japan':'🇯🇵','Croatia':'🇭🇷','Ukraine':'🇺🇦',
            'Russia':'🇷🇺','New Zealand':'🇳🇿','Philippines':'🇵🇭','Uzbekistan':'🇺🇿',
            'France':'🇫🇷','Canada':'🇨🇦','Nigeria':'🇳🇬','Guatemala':'🇬🇹','Congo':'🇨🇩'
        };
        const RP_MEDALS = {1:'🥇',2:'🥈',3:'🥉'};

        function rpParseLine(line) {
            const cols=[]; let cur='',inQ=false;
            for(const ch of line){
                if(ch==='"'){inQ=!inQ;}
                else if(ch===','&&!inQ){cols.push(cur.trim());cur='';}
                else{cur+=ch;}
            }
            cols.push(cur.trim()); return cols;
        }
        function rpParseCSV(text) {
            return text.trim().split(/\r?\n/).slice(1).map(rpParseLine).filter(c=>c[1]&&c[2]).map(c=>({
                draftRd: parseInt(c[0])||0, team:c[1].trim(), name:c[2].trim(),
                division:c[3].trim(), country:c[4].trim(), upcoming:c[5].trim(),
                f:parseInt(c[6])||0, w:parseInt(c[7])||0, ko:parseInt(c[8])||0,
                l:parseInt(c[9])||0, kod:Math.abs(parseInt(c[10])||0), d:parseInt(c[11])||0,
                b:parseInt(c[12])||0, s:parseInt(c[13])||0, h2h:parseInt(c[14])||0,
                pts:parseInt(c[15])||0
            }));
        }
        function rpStandings(fighters) {
            const m={};
            fighters.forEach(f=>{
                if(!m[f.team])m[f.team]={name:f.team,pts:0,w:0,ko:0,l:0,f:0,roster:0};
                const t=m[f.team]; t.pts+=f.pts;t.w+=f.w;t.ko+=f.ko;t.l+=f.l;t.f+=f.f;t.roster++;
            });
            return Object.values(m).sort((a,b)=>b.pts-a.pts||a.name.localeCompare(b.name));
        }
        function rpEsc(s){const d=document.createElement('div');d.textContent=String(s);return d.innerHTML;}

        function rpRenderGrid(standings) {
            const rpGridEl = document.getElementById('rpGrid');
            if (!rpGridEl) return;
            rpGridEl.innerHTML = standings.map((t,i)=>{
                const rank=i+1, color=RP_TEAM_COLORS[t.name]||'#6b7280';
                const rkCls=rank<=3?`rk${rank}`:'';
                const rankHtml=RP_MEDALS[rank]?`<span class="rp-medal">${RP_MEDALS[rank]}</span>`:`<span class="rp-ranknum">${rank}</span>`;
                return `<div class="rp-card ${rkCls}" style="--tc:${color}">
                    <div class="rp-card-top">
                        <div><div class="rp-teamlbl">${rpEsc(t.name)}</div>
                        <div class="rp-pts">${t.pts}</div>
                        <div class="rp-ptslbl">Points</div></div>
                        ${rankHtml}
                    </div>
                    <div class="rp-divider"></div>
                    <div class="rp-stats">
                        <div class="rp-stat"><div class="rp-sv" style="color:#16a34a">${t.w}</div><div class="rp-sl">Wins</div></div>
                        <div class="rp-stat"><div class="rp-sv" style="color:#7c3aed">${t.ko}</div><div class="rp-sl">KOs</div></div>
                        <div class="rp-stat"><div class="rp-sv" style="color:#dc2626">${t.l}</div><div class="rp-sl">Losses</div></div>
                        <div class="rp-stat"><div class="rp-sv" style="color:#555">${t.f}</div><div class="rp-sl">Fights</div></div>
                        <div class="rp-stat"><div class="rp-sv" style="color:#aaa">${t.roster}</div><div class="rp-sl">Roster</div></div>
                    </div></div>`;
            }).join('');
        }
        function rpRenderFilters() {
            const teams=['All',...Object.keys(RP_TEAM_COLORS)];
            document.getElementById('rpFilters').innerHTML=teams.map(t=>{
                const c=RP_TEAM_COLORS[t]||'#e63333', on=t===rpFilter?'on':'';
                return `<button class="rp-fbtn ${on}" style="--tc:${c}" onclick="rpSetFilter('${t}')">${rpEsc(t)}</button>`;
            }).join('');
        }
        function rpRenderTable() {
            const base=rpFilter==='All'?rpFighters:rpFighters.filter(f=>f.team===rpFilter);
            const sorted=[...base].sort((a,b)=>{
                let av=a[rpSortKey],bv=b[rpSortKey];
                if(typeof av==='string'){const c=av.localeCompare(bv);return rpSortAsc?c:-c;}
                if(av!==bv)return rpSortAsc?av-bv:bv-av;
                return b.pts-a.pts||a.name.localeCompare(b.name);
            });
            document.getElementById('rpCount').textContent=`${sorted.length} fighters`;
            let rank=1,prevPts=null;
            sorted.forEach((f,i)=>{if(rpSortKey==='pts'&&f.pts!==prevPts){rank=i+1;prevPts=f.pts;}f._r=rpSortKey==='pts'?rank:i+1;});
            document.querySelectorAll('.rp-table thead th[data-key]').forEach(th=>{
                th.classList.remove('rp-sorted','rp-asc');
                if(th.dataset.key===rpSortKey){th.classList.add('rp-sorted');if(rpSortAsc)th.classList.add('rp-asc');}
            });
            const sn=(v,cls)=>v?`<span class="rp-snum ${cls}">${v}</span>`:`<span class="rp-snum rp-snone">—</span>`;
            document.getElementById('rpBody').innerHTML=sorted.map(f=>{
                const c=RP_TEAM_COLORS[f.team]||'#6b7280';
                const ds=RP_DIV_STYLES[f.division]||{bg:'#f5f5f5',c:'#666'};
                const flag=RP_FLAGS[f.country]||'🌐';
                const medal=RP_MEDALS[f._r];
                const rankHtml=medal?`<span style="font-size:18px">${medal}</span>`:`<span style="font-size:13px;font-weight:700;color:#ccc">${f._r}</span>`;
                const upHtml=f.upcoming?`<span class="rp-uptag">📅 ${rpEsc(f.upcoming)}</span>`:'';
                return `<tr>
                    <td class="rp-tc">${rankHtml}</td>
                    <td><div class="rp-fname">${rpEsc(f.name)}</div>
                        <div class="rp-fmeta"><span class="rp-draftag">Rd ${f.draftRd}</span>${upHtml}</div></td>
                    <td><span class="rp-pill" style="background:${c}">${rpEsc(f.team)}</span></td>
                    <td><span class="rp-dbadge" style="background:${ds.bg};color:${ds.c}">${rpEsc(f.division)}</span></td>
                    <td style="font-size:13px;color:#555;white-space:nowrap">${flag} ${rpEsc(f.country)}</td>
                    <td>${sn(f.f,'rp-snone'||'')}</td>
                    <td>${sn(f.w,'rp-swin')}</td>
                    <td>${sn(f.ko,'rp-sko')}</td>
                    <td>${sn(f.l,'rp-sloss')}</td>
                    <td>${sn(f.kod,'rp-sloss')}</td>
                    <td>${sn(f.d,'rp-sdraw')}</td>
                    <td>${sn(f.b,'rp-sbelt')}</td>
                    <td>${sn(f.s,'rp-sstar')}</td>
                    <td>${sn(f.h2h,'rp-sh2h')}</td>
                    <td class="rp-tr"><span class="${f.pts?'rp-pnum':'rp-pzero'}">${f.pts||'0'}</span></td>
                </tr>`;
            }).join('');
        }
        function rpSetFilter(team){rpFilter=team;rpRenderFilters();rpRenderTable();}
        function rpSort(key){
            if(rpSortKey===key){rpSortAsc=!rpSortAsc;}
            else{rpSortKey=key;rpSortAsc=(key==='name'||key==='team'||key==='division'||key==='country');}
            rpRenderTable();
        }