        // ============ FIGHTERS DATABASE ============
        let fdRollingData = [];
        let fdHistoryData = [];
        let fdDivFilter   = 'All';
        let fdSortKey     = 'totalPts';
        let fdSortAsc     = false;
        let fdLoaded      = false;

        const FD_DIV_STYLES = {
            'Lights':  { bg:'#fefce8', c:'#713f12' },
            'Welters': { bg:'#eff6ff', c:'#1e3a8a' },
            'Smalls':  { bg:'#f0fdf4', c:'#14532d' },
            'Middles': { bg:'#fff7ed', c:'#7c2d12' },
            'Heavies': { bg:'#fdf2f8', c:'#831843' }
        };
        const FD_MEDALS = { 1:'🥇', 2:'🥈', 3:'🥉' };
        const FD_TEAM_COLORS_LOWER = {
            'dom':     '#e63333', 'tom':     '#16a34a', 'elyse':   '#ec4899',
            'pat':     '#f97316', 'mort':    '#eab308', 'ash':     '#0ea5e9',
            'brad':    '#1d4ed8', 'kieran':  '#b45309', 'rejects': '#6b7280',
            'gus':     '#a855f7', 'josh':    '#0d9488', 'nick':    '#64748b'
        };

        function fdTeamColor(teamRaw) {
            return FD_TEAM_COLORS_LOWER[teamRaw.toLowerCase()] || '#999';
        }
        function fdTeamDisplay(teamRaw) {
            return teamRaw.charAt(0).toUpperCase() + teamRaw.slice(1).toLowerCase();
        }
        function fdEsc(s) {
            const d = document.createElement('div');
            d.textContent = String(s || '');
            return d.innerHTML;
        }

        async function fdFetchSheet(sheetName) {
            const url = `https://docs.google.com/spreadsheets/d/${GS_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
            const resp = await fetch(url, { cache: 'no-store' });
            if (!resp.ok) throw new Error('Sheet fetch failed: ' + resp.status);
            const text = await resp.text();
            const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/);
            if (!match) throw new Error('Unexpected sheet response format');
            return JSON.parse(match[1]);
        }
        function fdCell(row, col) {
            const c = row.c?.[col];
            if (!c || c.v === null || c.v === undefined) return '';
            return String(c.v).trim();
        }
        function fdNum(row, col) {
            const c = row.c?.[col];
            if (!c || c.v === null || c.v === undefined) return 0;
            return Number(c.v) || 0;
        }

        async function fdLoad() {
            if (fdLoaded) { fdRenderDivFilters(); fdRender(); return; }
            document.getElementById('fdLoad').style.display = 'block';
            document.getElementById('fdMain').style.display = 'none';
            document.getElementById('fdErr').style.display  = 'none';
            try {
                const [rollingRes, histRes] = await Promise.all([
                    fdFetchSheet('Rolling total'),
                    fdFetchSheet('total points 2021-2025')
                ]);

                // Rolling total columns: Name(0), yrs picked(1), Fights(2), Wins(3),
                // KO's(4), Losses(5), KO'd(6), Belts(7), Stars(8), H2H(9), Total Points(10)
                fdRollingData = (rollingRes.table?.rows || [])
                    .filter(r => r.c?.[0]?.v && !/grand total|total/i.test(String(r.c[0].v).trim()))
                    .map(r => ({
                        name:      fdCell(r, 0),
                        yrsPicked: fdNum(r, 1),
                        fights:    fdNum(r, 2),
                        wins:      fdNum(r, 3),
                        kos:       fdNum(r, 4),
                        losses:    fdNum(r, 5),
                        kod:       Math.abs(fdNum(r, 6)),
                        belts:     fdNum(r, 7),
                        stars:     fdNum(r, 8),
                        h2h:       fdNum(r, 9),
                        totalPts:  fdNum(r, 10),
                        division:  ''
                    }));

                // History columns: year(0), DraftedRd(1), Team(2), Name(3), Division(4),
                // #REF!(5), F(6), W(7), KO(8), L(9), KO'd(10), D(11), B(12), S(13), H2H(14), total pts(15)
                fdHistoryData = (histRes.table?.rows || [])
                    .filter(r => r.c?.[0]?.v && r.c?.[3]?.v)
                    .map(r => ({
                        year:     fdNum(r, 0),
                        team:     fdCell(r, 2),
                        name:     fdCell(r, 3),
                        division: fdCell(r, 4),
                        fights:   fdNum(r, 6),
                        wins:     fdNum(r, 7),
                        kos:      fdNum(r, 8),
                        losses:   fdNum(r, 9),
                        kod:      Math.abs(fdNum(r, 10)),
                        draws:    fdNum(r, 11),
                        belts:    fdNum(r, 12),
                        stars:    fdNum(r, 13),
                        h2h:      fdNum(r, 14),
                        pts:      fdNum(r, 15)
                    }));

                // Build division lookup from history (more complete data source)
                const divMap = {};
                fdHistoryData.forEach(h => { if (h.name && h.division) divMap[h.name] = h.division; });
                fdRollingData.forEach(f => { if (!f.division) f.division = divMap[f.name] || ''; });

                // Update hero pills with live counts
                const pillF = document.getElementById('fdHeroPillFighters');
                const pillS = document.getElementById('fdHeroPillSeasons');
                if (pillF) pillF.textContent = fdRollingData.length;
                if (pillS) pillS.textContent = fdHistoryData.length;

                fdLoaded = true;
                document.getElementById('fdLoad').style.display = 'none';
                document.getElementById('fdMain').style.display = 'block';
                fdRenderDivFilters();
                fdRender();

            } catch (e) {
                console.error('[FighterDB]', e);
                document.getElementById('fdLoad').style.display = 'none';
                document.getElementById('fdErr').style.display  = 'block';
            }
        }

        function fdRenderDivFilters() {
            const divs = ['All', 'Heavies', 'Middles', 'Welters', 'Lights', 'Smalls'];
            document.getElementById('fdDivFilters').innerHTML = divs.map(d =>
                `<button class="fd-div-btn ${d === fdDivFilter ? 'active' : ''}" onclick="fdSetDiv('${d}')">${d}</button>`
            ).join('');
        }

        function fdSetDiv(div) { fdDivFilter = div; fdRenderDivFilters(); fdRender(); }

        function fdSort(key) {
            if (fdSortKey === key) { fdSortAsc = !fdSortAsc; }
            else { fdSortKey = key; fdSortAsc = (key === 'name'); }
            fdRender();
        }

        function fdRender() {
            if (!fdLoaded) return;
            const q = (document.getElementById('fdSearch')?.value || '').toLowerCase().trim();
            let data = [...fdRollingData];
            if (fdDivFilter !== 'All') data = data.filter(f => f.division === fdDivFilter);
            if (q) data = data.filter(f => f.name.toLowerCase().includes(q));

            data.sort((a, b) => {
                let av = a[fdSortKey], bv = b[fdSortKey];
                if (typeof av === 'string') { const c = av.localeCompare(bv); return fdSortAsc ? c : -c; }
                if (av !== bv) return fdSortAsc ? av - bv : bv - av;
                return b.totalPts - a.totalPts || a.name.localeCompare(b.name);
            });

            const countEl = document.getElementById('fdCount');
            if (countEl) countEl.textContent = `${data.length} fighter${data.length !== 1 ? 's' : ''}`;

            // Update sort indicators
            document.querySelectorAll('.fd-table thead th[onclick]').forEach(th => {
                const m = th.getAttribute('onclick').match(/fdSort\('(\w+)'\)/);
                if (!m) return;
                th.classList.remove('fd-sorted', 'fd-asc');
                if (m[1] === fdSortKey) {
                    th.classList.add('fd-sorted');
                    if (fdSortAsc) th.classList.add('fd-asc');
                }
            });

            document.getElementById('fdBody').innerHTML = data.map((f, i) => {
                const rank  = i + 1;
                const rkCls = rank <= 3 ? `fd-rk${rank}` : '';
                const rankHtml = FD_MEDALS[rank]
                    ? `<span style="font-size:18px;line-height:1">${FD_MEDALS[rank]}</span>`
                    : `<span style="font-size:12px;font-weight:700;color:#ccc">${rank}</span>`;
                const ds = FD_DIV_STYLES[f.division] || { bg:'#f5f5f5', c:'#888' };
                const divHtml = f.division
                    ? `<span class="fd-div-badge" style="background:${ds.bg};color:${ds.c}">${fdEsc(f.division)}</span>`
                    : `<span style="color:#ddd;font-size:12px;">—</span>`;
                const yearDots = Array.from({ length: f.yrsPicked }, () =>
                    `<span class="fd-yr-dot"></span>`).join('');
                const sn = (v, col) => v
                    ? `<span class="fd-stat-num" style="text-align:center;${col?'color:'+col:''}">${v}</span>`
                    : `<span class="fd-stat-num fd-stat-none" style="text-align:center;">—</span>`;
                const safeName = f.name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
                return `<tr class="${rkCls}" onclick="fdOpenModal('${safeName}')" title="View ${fdEsc(f.name)}'s season history">
                    <td class="fd-rank-cell">${rankHtml}</td>
                    <td>
                        <div class="fd-fighter-name">${fdEsc(f.name)}</div>
                        <div class="fd-fighter-meta">${yearDots}&nbsp;${f.yrsPicked} season${f.yrsPicked !== 1 ? 's' : ''}</div>
                    </td>
                    <td>${divHtml}</td>
                    <td style="text-align:center;">${sn(f.yrsPicked)}</td>
                    <td style="text-align:center;">${sn(f.fights)}</td>
                    <td style="text-align:center;">${sn(f.wins,   f.wins   ? '#16a34a' : null)}</td>
                    <td style="text-align:center;">${sn(f.kos,    f.kos    ? '#7c3aed' : null)}</td>
                    <td style="text-align:center;">${sn(f.losses, f.losses ? '#dc2626' : null)}</td>
                    <td style="text-align:center;">${sn(f.kod)}</td>
                    <td style="text-align:center;">${sn(f.belts,  f.belts  ? '#f59e0b' : null)}</td>
                    <td style="text-align:center;">${sn(f.stars,  f.stars  ? '#0ea5e9' : null)}</td>
                    <td style="text-align:center;">${sn(f.h2h,   f.h2h    ? '#ec4899' : null)}</td>
                    <td class="fd-pts-cell">
                        <span class="fd-pts-num ${!f.totalPts ? 'fd-pts-zero' : ''}">${f.totalPts || 0}</span>
                    </td>
                </tr>`;
            }).join('') || `<tr><td colspan="13" style="text-align:center;padding:40px;color:#bbb;font-size:14px;">No fighters found.</td></tr>`;
        }

        function fdOpenModal(name) {
            const fighter = fdRollingData.find(f => f.name === name);
            if (!fighter) return;

            document.getElementById('fdModalName').textContent = name;

            // Division badge in meta
            const ds = FD_DIV_STYLES[fighter.division] || null;
            const metaEl = document.getElementById('fdModalMeta');
            metaEl.innerHTML = ds && fighter.division
                ? `<span class="fd-div-badge" style="background:${ds.bg};color:${ds.c};margin-bottom:4px;">${fdEsc(fighter.division)}</span>`
                : '';

            // Totals bar
            const statsConfig = [
                { num: fighter.totalPts, label: 'Total Pts', color: '#e63333' },
                { num: fighter.yrsPicked, label: 'Seasons',  color: '#667eea' },
                { num: fighter.fights,   label: 'Fights',   color: '#555'    },
                { num: fighter.wins,     label: 'Wins',     color: '#16a34a' },
                { num: fighter.kos,      label: 'KOs',      color: '#7c3aed' },
                { num: fighter.losses,   label: 'Losses',   color: '#dc2626' },
                { num: fighter.belts,    label: 'Belts',    color: '#f59e0b' },
                { num: fighter.stars,    label: 'Stars',    color: '#0ea5e9' },
                { num: fighter.h2h,      label: 'H2H',      color: '#ec4899' },
            ];
            document.getElementById('fdModalTotals').innerHTML = statsConfig.map(s =>
                `<div class="fd-modal-stat">
                    <span class="fd-modal-stat-num" style="color:${s.color}">${s.num || 0}</span>
                    <span class="fd-modal-stat-label">${s.label}</span>
                </div>`
            ).join('');

            // Season history cards (newest first)
            const seasons = fdHistoryData
                .filter(h => h.name === name)
                .sort((a, b) => b.year - a.year);

            if (!seasons.length) {
                document.getElementById('fdModalSeasons').innerHTML =
                    '<div class="fd-modal-empty">No season history available.</div>';
            } else {
                document.getElementById('fdModalSeasons').innerHTML = seasons.map(s => {
                    const teamColor   = fdTeamColor(s.team);
                    const teamDisplay = fdTeamDisplay(s.team);
                    const statItems = [
                        s.fights  ? `<div class="fd-ss-item"><span class="fd-ss-num">${s.fights}</span><span class="fd-ss-label">Fights</span></div>` : '',
                        s.wins    ? `<div class="fd-ss-item"><span class="fd-ss-num" style="color:#16a34a">${s.wins}</span><span class="fd-ss-label">Wins</span></div>` : '',
                        s.kos     ? `<div class="fd-ss-item"><span class="fd-ss-num" style="color:#7c3aed">${s.kos}</span><span class="fd-ss-label">KOs</span></div>` : '',
                        s.losses  ? `<div class="fd-ss-item"><span class="fd-ss-num" style="color:#dc2626">${s.losses}</span><span class="fd-ss-label">Losses</span></div>` : '',
                        s.kod     ? `<div class="fd-ss-item"><span class="fd-ss-num">${s.kod}</span><span class="fd-ss-label">KO'd</span></div>` : '',
                        s.draws   ? `<div class="fd-ss-item"><span class="fd-ss-num">${s.draws}</span><span class="fd-ss-label">Draws</span></div>` : '',
                        s.belts   ? `<div class="fd-ss-item"><span class="fd-ss-num" style="color:#f59e0b">${s.belts}</span><span class="fd-ss-label">Belts</span></div>` : '',
                        s.stars   ? `<div class="fd-ss-item"><span class="fd-ss-num" style="color:#0ea5e9">${s.stars}</span><span class="fd-ss-label">Stars</span></div>` : '',
                        s.h2h     ? `<div class="fd-ss-item"><span class="fd-ss-num" style="color:#ec4899">${s.h2h}</span><span class="fd-ss-label">H2H</span></div>` : '',
                    ].filter(Boolean).join('');
                    return `<div class="fd-season-card">
                        <div class="fd-season-top">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span class="fd-season-year-badge">${s.year}</span>
                                <div class="fd-season-team-pill">
                                    <span class="fd-season-team-dot" style="background:${teamColor}"></span>
                                    ${fdEsc(teamDisplay)}
                                </div>
                            </div>
                            <div class="fd-season-pts">${s.pts} <span style="font-size:13px;font-weight:600;color:#e0a0a0">pts</span></div>
                        </div>
                        ${statItems ? `<div class="fd-season-stats">${statItems}</div>` : ''}
                    </div>`;
                }).join('');
            }

            document.getElementById('fdModalOverlay').classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function fdCloseModal() {
            document.getElementById('fdModalOverlay').classList.remove('open');
            document.body.style.overflow = '';
        }

        // Close modal on Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') fdCloseModal();
        });

        async function rpLoad() {
            const btn=document.getElementById('rpRefreshBtn');
            if(btn)btn.disabled=true;
            // Always refresh recent results when this page loads
            loadRecentResultsFromSheets();
            try {
                const res=await fetch(RP_SHEET_URL+'&_cb='+Date.now());
                if(!res.ok)throw new Error('HTTP '+res.status);
                const text=await res.text();
                if(text.trim().startsWith('<'))throw new Error('Sheet not public');
                rpFighters=rpParseCSV(text);
                rpRenderGrid(rpStandings(rpFighters));
                rpRenderFilters();
                rpRenderTable();
                const el=document.getElementById('rpUpdated');
                if(el)el.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
                document.getElementById('rpLoad').style.display='none';
                document.getElementById('rpErr').style.display='none';
                document.getElementById('rpMain').style.display='block';
                rpLoaded=true;
                if(!rpTimer)rpTimer=setInterval(rpLoad,RP_REFRESH_MS);
            } catch(e) {
                console.error('[Results]',e);
                document.getElementById('rpLoad').style.display='none';
                document.getElementById('rpMain').style.display='none';
                document.getElementById('rpErr').style.display='block';
            } finally {
                if(btn)btn.disabled=false;
            }
        }
    