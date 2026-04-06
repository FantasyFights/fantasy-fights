        // ============ AUTH ============
        function showAuthScreen() {
            document.getElementById('authContainer').classList.add('active');
        }

        function goToSignup() {
            showAuthScreen();
            setTimeout(() => switchAuthMode('signup'), 60);
        }

        function hideAuthScreen() {
            document.getElementById('authContainer').classList.remove('active');
        }

        // ── Loading screen ──
        function showLoadingScreen() { document.getElementById('loadingScreen').classList.add('active'); }
        function hideLoadingScreen() { document.getElementById('loadingScreen').classList.remove('active'); }

        // ── Email verification screen ──
        function showVerifyEmailScreen(email) {
            document.getElementById('verifyEmailAddress').textContent = email;
            document.getElementById('verifyMessage').textContent = '';
            document.getElementById('verifyMessage').className = 'verify-message';
            document.getElementById('verifyScreen').classList.add('active');
        }
        function hideVerifyEmailScreen() {
            document.getElementById('verifyScreen').classList.remove('active');
        }

        async function checkEmailVerification() {
            const msgEl = document.getElementById('verifyMessage');
            msgEl.className = 'verify-message';
            msgEl.textContent = 'Checking...';
            try {
                await firebase.auth().currentUser.reload();
                const user = firebase.auth().currentUser;
                if (user && user.emailVerified) {
                    msgEl.className = 'verify-message success';
                    msgEl.textContent = '✓ Verified! Taking you in...';
                    currentUser = user;
                    try { await loadUserData(); } catch(e) {}
                    setTimeout(() => {
                        hideVerifyEmailScreen();
                        if (!userData || !userData.profileComplete) {
                            showProfileSetupScreen();
                        } else {
                            enterApp();
                        }
                    }, 900);
                } else {
                    msgEl.className = 'verify-message error';
                    msgEl.textContent = 'Not verified yet — check your inbox and try again.';
                }
            } catch(e) {
                msgEl.className = 'verify-message error';
                msgEl.textContent = 'Something went wrong. Please try again.';
            }
        }

        async function resendVerificationEmail() {
            const msgEl = document.getElementById('verifyMessage');
            try {
                await firebase.auth().currentUser.sendEmailVerification();
                msgEl.className = 'verify-message success';
                msgEl.textContent = '✓ Verification email resent.';
            } catch(e) {
                msgEl.className = 'verify-message error';
                msgEl.textContent = 'Could not resend — try again in a minute.';
            }
        }

        // ── Profile setup screen ──
        function showProfileSetupScreen() {
            document.getElementById('profileSetupScreen').classList.add('active');
            setTimeout(() => document.getElementById('displayNameInput').focus(), 200);
        }
        function hideProfileSetupScreen() {
            document.getElementById('profileSetupScreen').classList.remove('active');
        }
        function clearProfileError() {
            document.getElementById('profileSetupError').textContent = '';
        }

        async function saveDisplayName() {
            const input = document.getElementById('displayNameInput');
            const errorEl = document.getElementById('profileSetupError');
            const btn = document.getElementById('profileSetupBtn');
            const name = input.value.trim();

            errorEl.textContent = '';
            if (!name || name.length < 2) { errorEl.textContent = 'Please enter at least 2 characters.'; return; }
            if (name.length > 30) { errorEl.textContent = 'Name must be 30 characters or less.'; return; }

            btn.disabled = true;
            btn.textContent = 'Saving...';
            try {
                const db = firebase.firestore();
                await db.collection('users').doc(currentUser.uid).update({
                    displayName: name,
                    profileComplete: true,
                });
                if (!userData) userData = {};
                userData.displayName = name;
                userData.profileComplete = true;
                hideProfileSetupScreen();
                enterApp();
            } catch(e) {
                errorEl.textContent = 'Could not save. Please try again.';
                btn.disabled = false;
                btn.textContent = 'Enter the League →';
            }
        }

        // ── Forgot password panel ──
        function showForgotPassword() {
            document.getElementById('authMainPanel').style.display = 'none';
            document.getElementById('forgotPasswordPanel').classList.add('active');
            document.getElementById('forgotError').classList.remove('show');
            document.getElementById('forgotSuccess').classList.remove('show');
            document.getElementById('forgotEmail').value = '';
        }
        function hideForgotPassword() {
            document.getElementById('authMainPanel').style.display = '';
            document.getElementById('forgotPasswordPanel').classList.remove('active');
        }
        async function sendPasswordReset() {
            const email = document.getElementById('forgotEmail').value.trim();
            const errorDiv = document.getElementById('forgotError');
            const successDiv = document.getElementById('forgotSuccess');
            const btn = document.getElementById('forgotSubmitBtn');
            errorDiv.classList.remove('show'); successDiv.classList.remove('show');
            if (!email) { errorDiv.textContent = 'Please enter your email address.'; errorDiv.classList.add('show'); return; }
            btn.disabled = true; btn.textContent = 'Sending...';
            try {
                await firebase.auth().sendPasswordResetEmail(email);
                successDiv.classList.add('show');
            } catch(e) {
                errorDiv.textContent = e.message; errorDiv.classList.add('show');
            } finally {
                btn.disabled = false; btn.textContent = 'Send Reset Email';
            }
        }

        // ── App entry points ──
        function showPublicSite() {
            // Show header + content with limited nav (no league pages)
            document.getElementById('mainHeader').classList.add('active');
            document.getElementById('mainContent').classList.add('active');
            document.getElementById('leagueBtn').style.display = 'none';
            document.getElementById('draftDropdown').style.display = 'none';
            document.getElementById('leagueSubnav').classList.remove('active');
            document.getElementById('headerAuthBtns').classList.add('active');
            document.getElementById('userMenu').style.display = 'none';
            showPage('about');
        }

        function enterApp() {
            // Restore full nav and enter the league
            document.getElementById('leagueBtn').style.display = '';
            document.getElementById('draftDropdown').style.display = '';
            document.getElementById('headerAuthBtns').classList.remove('active');
            document.getElementById('userMenu').style.display = '';
            showMainApp();
            updateNavigation();
            updateUserMenu();
            showPage('about');
            startSheetsAutoRefresh();
        }

        function switchAuthMode(mode) {
            const toggleBtns = document.querySelectorAll('.auth-toggle button');
            const confirmGroup = document.getElementById('confirmPasswordGroup');
            const submitBtn = document.getElementById('authSubmitBtn');
            const forgotLink = document.getElementById('forgotPasswordLink');

            toggleBtns.forEach(btn => btn.classList.remove('active'));

            if (mode === 'signup') {
                document.querySelector('.auth-toggle button:nth-child(2)').classList.add('active');
                confirmGroup.style.display = 'flex';
                submitBtn.textContent = 'Create Account';
                document.getElementById('authForm').dataset.mode = 'signup';
                if (forgotLink) forgotLink.style.display = 'none';
            } else {
                document.querySelector('.auth-toggle button:nth-child(1)').classList.add('active');
                confirmGroup.style.display = 'none';
                submitBtn.textContent = 'Sign In';
                document.getElementById('authForm').dataset.mode = 'signin';
                if (forgotLink) forgotLink.style.display = 'block';
            }
        }

        async function handleAuth(event) {
            event.preventDefault();

            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            const mode = document.getElementById('authForm').dataset.mode || 'signin';
            const errorDiv = document.getElementById('authError');

            errorDiv.classList.remove('show');
            errorDiv.textContent = '';

            try {
                if (mode === 'signup') {
                    const confirmPassword = document.getElementById('authConfirmPassword').value;
                    if (password !== confirmPassword) {
                        throw new Error('Passwords do not match.');
                    }

                    const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
                    const uid = result.user.uid;

                    const db = firebase.firestore();
                    const userCount = (await db.collection('users').get()).size;
                    const role = userCount === 0 ? 'commissioner' : 'owner';

                    await db.collection('users').doc(uid).set({
                        email: email,
                        role: role,
                        teamId: null,
                        displayName: null,
                        profileComplete: false,
                        createdAt: new Date().toISOString(),
                    });

                    if (role === 'commissioner') {
                        await db.collection('league').doc('config').set(leagueData);
                        await db.collection('league').doc('draftState').set(draftState);
                        await db.collection('league').doc('rosters').set({});
                    }

                    // Send verification email
                    await result.user.sendEmailVerification();
                    currentUser = result.user;
                    hideAuthScreen();
                    showVerifyEmailScreen(email);
                    return;

                } else {
                    const result = await firebase.auth().signInWithEmailAndPassword(email, password);
                    currentUser = result.user;

                    if (!currentUser.emailVerified) {
                        hideAuthScreen();
                        showVerifyEmailScreen(email);
                        return;
                    }
                }

                await loadUserData();
                hideAuthScreen();
                if (!userData || !userData.profileComplete) {
                    showProfileSetupScreen();
                } else {
                    enterApp();
                }
            } catch (error) {
                errorDiv.classList.add('show');
                errorDiv.textContent = error.message;
            }
        }

        async function loadUserData() {
            const db = firebase.firestore();
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                userData = userDoc.data();
                userRole = userData.role;
                userTeamId = userData.teamId;
            }
        }

        async function handleSignOut() {
            try {
                await firebase.auth().signOut();
                currentUser = null;
                userRole = null;
                userTeamId = null;
                userData = null;
                // Hide any intermediate screens
                document.getElementById('verifyScreen').classList.remove('active');
                document.getElementById('profileSetupScreen').classList.remove('active');
                document.getElementById('authContainer').classList.remove('active');
                // Clear auth form
                document.getElementById('authEmail').value = '';
                document.getElementById('authPassword').value = '';
                document.getElementById('authConfirmPassword').value = '';
                document.getElementById('authError').classList.remove('show');
                hideForgotPassword();
                showPublicSite();
            } catch (error) {
                console.error('Sign out error:', error);
            }
        }