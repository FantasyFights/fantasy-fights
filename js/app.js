        // ============ GLOBAL STATE ============
        let currentUser = null;
        let userRole = null;
        let userTeamId = null;
        let userData = null; // Firestore user document data
        let firebaseConfig = {
            apiKey: "AIzaSyClPopj3tJA5pufvH5nVPRNlhSJ03XMBIw",
            authDomain: "fantasy-fights-c8248.firebaseapp.com",
            projectId: "fantasy-fights-c8248",
            storageBucket: "fantasy-fights-c8248.firebasestorage.app",
            messagingSenderId: "12190623373",
            appId: "1:12190623373:web:fc8673acafdab575a364c4"
        };
        let firebaseInitialized = false;
        let firebaseConnected = false;

        let leagueData = {
            leagueName: 'Fantasy Fights League',
            pickTimer: 60,
            rosterSize: 10,
        };

        let draftState = {
            draftActive: false,
            draftOrder: [],
            currentPickIndex: 0,
            picks: [],
        };

        let fightResults = [];
        let rosters = {};
        let users = {};

        // ============ INITIALIZATION ============
        async function initApp() {
            try {
                await initializeFirebase();
                // setupAuthListener handles all auth state via Firebase onAuthStateChanged
            } catch (error) {
                console.error('Failed to initialize Firebase:', error);
                // Show app even if Firebase fails
                showMainApp();
                showPage('about');
            }
        }

        async function initializeFirebase() {
            if (firebaseInitialized) return;

            try {
                firebase.initializeApp(firebaseConfig);
                firebaseInitialized = true;
                firebaseConnected = true;
                setupFirestoreListeners();
                setupAuthListener();
            } catch (error) {
                console.error('Firebase initialization error:', error);
                firebaseConnected = false;
                throw error;
            }
        }

        function setupFirestoreListeners() {
            const db = firebase.firestore();

            db.collection('league').doc('config').onSnapshot(
                (doc) => {
                    if (doc.exists) leagueData = doc.data();
                    firebaseConnected = true;
                    updateReconnectingBanner();
                },
                (error) => {
                    console.error('Firestore listener error:', error);
                    firebaseConnected = false;
                    updateReconnectingBanner();
                }
            );

            db.collection('league').doc('draftState').onSnapshot(
                (doc) => {
                    if (doc.exists) {
                        draftState = doc.data();
                        updateDraftUI();
                    }
                    firebaseConnected = true;
                    updateReconnectingBanner();
                },
                (error) => {
                    console.error('Draft listener error:', error);
                    firebaseConnected = false;
                    updateReconnectingBanner();
                }
            );

            db.collection('league').doc('rosters').onSnapshot(
                (doc) => {
                    if (doc.exists) rosters = doc.data() || {};
                    firebaseConnected = true;
                    updateReconnectingBanner();
                },
                (error) => {
                    console.error('Rosters listener error:', error);
                    firebaseConnected = false;
                    updateReconnectingBanner();
                }
            );

            db.collection('users').onSnapshot(
                (snapshot) => {
                    users = {};
                    snapshot.forEach((doc) => {
                        users[doc.id] = doc.data();
                    });
                    firebaseConnected = true;
                    updateReconnectingBanner();
                    updateTeamOwnerUI();
                },
                (error) => {
                    console.error('Users listener error:', error);
                    firebaseConnected = false;
                    updateReconnectingBanner();
                }
            );

            db.collection('fightResults').orderBy('timestamp', 'desc').onSnapshot(
                (snapshot) => {
                    fightResults = [];
                    snapshot.forEach((doc) => {
                        fightResults.push(doc.data());
                    });
                    firebaseConnected = true;
                    updateReconnectingBanner();
                    updateResultsUI();
                },
                (error) => {
                    console.error('Results listener error:', error);
                    firebaseConnected = false;
                    updateReconnectingBanner();
                }
            );
        }

        function updateReconnectingBanner() {
            const banner = document.getElementById('reconnectingBanner');
            if (firebaseConnected) {
                banner.classList.remove('show');
            } else {
                banner.classList.add('show');
            }
        }


        // ============ UI STATES ============
        function showMainApp() {
            document.getElementById('mainHeader').classList.add('active');
            document.getElementById('mainContent').classList.add('active');
        }

        function hideMainApp() {
            document.getElementById('mainHeader').classList.remove('active');
            document.getElementById('mainContent').classList.remove('active');
        }

        // ============ NAVIGATION ============
        function toggleNavDropdown(name) {
            const menu = document.getElementById(name + 'Menu');
            const isOpen = menu.classList.contains('open');
            closeNavDropdowns();
            if (!isOpen) menu.classList.add('open');
        }

        function closeNavDropdowns() {
            document.querySelectorAll('.nav-dropdown-menu').forEach(m => m.classList.remove('open'));
        }

        // Close dropdown when clicking outside nav
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-dropdown')) closeNavDropdowns();
        });

        function updateNavigation() {
            const navSetup = document.querySelector('.nav-setup');
            if (navSetup) {
                if (userRole === 'commissioner') navSetup.classList.remove('hidden');
                else navSetup.classList.add('hidden');
            }
        }

        function toggleUserMenu() {
            const dropdown = document.getElementById('userMenuDropdown');
            dropdown.classList.toggle('active');
        }

        function updateUserMenu() {
            const displayName = (userData && userData.displayName) || (currentUser && currentUser.email ? currentUser.email.split('@')[0] : '—');
            document.getElementById('userMenuName').textContent = displayName;
            document.getElementById('userMenuEmail').textContent = currentUser ? currentUser.email : '';
            const badgeEl = document.getElementById('userMenuBadge');
            badgeEl.textContent = userRole === 'commissioner' ? 'Commissioner' : 'Team Owner';

            if (userRole === 'owner' && userTeamId) {
                const team = teams.find(t => t.id === userTeamId);
                if (team) {
                    const teamEl = document.querySelector('.user-menu-item.info:nth-child(2)');
                    if (teamEl) {
                        teamEl.innerHTML = `<span style="display:flex;align-items:center;gap:8px;"><span class="team-dot" style="background:${team.color}"></span>Your Team: ${team.name}</span>`;
                    }
                }
            }
        }

        function showPage(pageName) {
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.querySelectorAll('nav a, .nav-dropdown-btn, .subnav-link').forEach(link => link.classList.remove('active'));
            closeNavDropdowns();

            document.getElementById(pageName + 'Page').classList.add('active');
            const navLink = document.querySelector('.nav-' + pageName);
            if (navLink) navLink.classList.add('active');

            // Highlight parent button and show/hide persistent sub-nav
            const leaguePages = ['home','upcoming','ladder','teams','results'];
            const draftPages  = ['draft','setup'];
            const leagueSubnav = document.getElementById('leagueSubnav');
            if (leaguePages.includes(pageName)) {
                document.getElementById('leagueBtn').classList.add('active');
                leagueSubnav.classList.add('active');
            } else {
                leagueSubnav.classList.remove('active');
                if (draftPages.includes(pageName)) {
                    document.getElementById('draftBtn').classList.add('active');
                }
            }

            switch (pageName) {
                case 'home': renderHome(); break;
                case 'upcoming': renderUpcoming(); break;
                case 'ladder': renderLadder(); break;
                case 'teams':
                    renderTeams();
                    // Silently pre-load live stats if not yet fetched so pts/dates populate
                    if (!rpLoaded) {
                        rpLoad().then(() => {
                            if (document.querySelector('#teamsPage.active')) renderTeams();
                        }).catch(() => {});
                    }
                    break;
                case 'draft': renderDraft(); break;
                case 'results': rpLoad(); break;
                case 'setup':
                    if (userRole === 'commissioner') renderSetup();
                    else showPage('home');
                    break;
                case 'about': break;
                case 'fighters': fdLoad(); break;
            }
        }

        // ============ AUTH STATE LISTENER ============
        function setupAuthListener() {
            showLoadingScreen();
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    // Refresh to get latest email verification status
                    try { await user.reload(); } catch(e) {}
                    const freshUser = firebase.auth().currentUser;

                    if (!freshUser.emailVerified) {
                        currentUser = freshUser;
                        hideLoadingScreen();
                        showVerifyEmailScreen(freshUser.email);
                        return;
                    }

                    currentUser = freshUser;
                    try { await loadUserData(); } catch(e) { console.error('loadUserData:', e); }

                    hideLoadingScreen();
                    if (!userData || !userData.profileComplete) {
                        showProfileSetupScreen();
                    } else {
                        enterApp();
                    }
                } else {
                    currentUser = null;
                    userRole = null;
                    userTeamId = null;
                    userData = null;
                    hideLoadingScreen();
                    showPublicSite();
                }
            });
        }
