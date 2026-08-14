(function () {

    // ---------- Elements ----------
    const form = document.getElementById("loginForm");

    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");

    const fieldEmail = document.getElementById("fieldEmail");
    const fieldPassword = document.getElementById("fieldPassword");

    const toggleVis = document.getElementById("toggleVis");
    const submitBtn = document.getElementById("submitBtn");

    const loginStatus = document.getElementById("loginStatus");

    const tabSignin = document.getElementById("tabSignin");
    const tabSSO = document.getElementById("tabSSO");

    const forgotLink = document.getElementById("forgotLink");

    const googleLoginBtn = document.querySelector(".login-google");
    const inviteLink = document.querySelector(".login-signup a");


    // ---------- Safety Check ----------
    if (!form || !emailInput || !passwordInput) {
        console.error("Login form elements were not found.");
        return;
    }


    // ---------- Email Validation ----------
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // ---------- Password Visibility ----------
    if (toggleVis) {

        toggleVis.addEventListener("click", function () {

            const isPassword =
                passwordInput.type === "password";

            passwordInput.type =
                isPassword ? "text" : "password";

            toggleVis.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );

            toggleVis.classList.toggle(
                "is-visible",
                isPassword
            );

        });

    }


    // ---------- Validate Email ----------
    function validateEmail() {

        const value = emailInput.value.trim();

        const isValid = EMAIL_RE.test(value);

        if (fieldEmail) {
            fieldEmail.classList.toggle(
                "invalid",
                !isValid
            );
        }

        return isValid;
    }


    // ---------- Validate Password ----------
    function validatePassword() {

        const isValid =
            passwordInput.value.length >= 8;

        if (fieldPassword) {
            fieldPassword.classList.toggle(
                "invalid",
                !isValid
            );
        }

        return isValid;
    }


    // ---------- Email Events ----------
    emailInput.addEventListener(
        "blur",
        validateEmail
    );

    emailInput.addEventListener(
        "input",
        function () {

            if (
                fieldEmail &&
                fieldEmail.classList.contains("invalid")
            ) {
                validateEmail();
            }

        }
    );


    // ---------- Password Events ----------
    passwordInput.addEventListener(
        "blur",
        validatePassword
    );

    passwordInput.addEventListener(
        "input",
        function () {

            if (
                fieldPassword &&
                fieldPassword.classList.contains("invalid")
            ) {
                validatePassword();
            }

        }
    );


    // ---------- Login Submit ----------
    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const emailOk = validateEmail();
            const passwordOk = validatePassword();


            if (loginStatus) {
                loginStatus.textContent = "";
                loginStatus.className = "login-status";
            }


            // ---------- Validation Failed ----------
            if (!emailOk || !passwordOk) {

                if (loginStatus) {

                    loginStatus.textContent =
                        "Please fix the highlighted fields.";

                    loginStatus.classList.add("err");
                }


                if (!emailOk) {

                    emailInput.focus();

                } else {

                    passwordInput.focus();

                }

                return;
            }


            // ---------- Start Loading ----------
            if (submitBtn) {

                submitBtn.classList.add("is-loading");
                submitBtn.disabled = true;

            }


            // ---------- Mock Authentication ----------
            setTimeout(function () {

                if (loginStatus) {

                    loginStatus.textContent =
                        "Signed in — redirecting to your dashboard…";

                    loginStatus.classList.add("ok");

                }


                // ---------- Redirect to Dashboard ----------
                setTimeout(function () {

                    window.location.href =
                        "dashboard.html";

                }, 700);


            }, 1100);

        }
    );


    // ---------- Sign In Tab ----------
    if (tabSignin && tabSSO) {

        tabSignin.addEventListener(
            "click",
            function () {

                tabSignin.classList.add("active");

                tabSignin.setAttribute(
                    "aria-selected",
                    "true"
                );


                tabSSO.classList.remove("active");

                tabSSO.setAttribute(
                    "aria-selected",
                    "false"
                );


                if (loginStatus) {

                    loginStatus.textContent = "";

                    loginStatus.className =
                        "login-status";

                }

            }
        );


        // ---------- Company SSO Tab ----------
        tabSSO.addEventListener(
            "click",
            function () {

                tabSSO.classList.add("active");

                tabSSO.setAttribute(
                    "aria-selected",
                    "true"
                );


                tabSignin.classList.remove("active");

                tabSignin.setAttribute(
                    "aria-selected",
                    "false"
                );


                if (loginStatus) {

                    loginStatus.className =
                        "login-status ok";

                    loginStatus.textContent =
                        "Company SSO isn't wired up in this prototype.";

                }

            }
        );

    }


    // ---------- Forgot Password ----------
    if (forgotLink) {

        forgotLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (loginStatus) {

                    loginStatus.className =
                        "login-status ok";

                    loginStatus.textContent =
                        "Password reset isn't wired up in this prototype.";

                }

            }
        );

    }


    // ---------- Google Login ----------
    if (googleLoginBtn) {

        googleLoginBtn.addEventListener(
            "click",
            function () {

                if (loginStatus) {

                    loginStatus.className =
                        "login-status ok";

                    loginStatus.textContent =
                        "Google sign-in isn't wired up in this prototype.";

                }

            }
        );

    }


    // ---------- Invite Link ----------
    if (inviteLink) {

        inviteLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (loginStatus) {

                    loginStatus.className =
                        "login-status ok";

                    loginStatus.textContent =
                        "Ask your workspace admin for an invitation.";

                }

            }
        );

    }


})();
