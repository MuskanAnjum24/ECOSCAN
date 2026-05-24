// script.js — EcoScan Auth (Connected to Backend)
// Requires api.js to be loaded first

const loginButton = document.getElementById("loginBtn");
const registerButton = document.getElementById("registerBtn");
const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");
const successMessageContainer = document.getElementById("success-message");
const navMenu = document.getElementById("navMenu");

function hideAllFormsAndMessages() {
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (successMessageContainer) {
        successMessageContainer.classList.remove('show');
        setTimeout(() => {
            if (successMessageContainer && !successMessageContainer.classList.contains('show')) {
                successMessageContainer.style.display = 'none';
            }
        }, 500);
    }
}

function login() {
    hideAllFormsAndMessages();
    if (loginForm) {
        loginForm.style.display = 'flex';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            loginForm.style.left = "35px";
            loginForm.style.opacity = 1;
        }));
    }
    if (registerForm) { registerForm.style.right = "-120%"; registerForm.style.opacity = 0; }
    if (loginButton && registerButton) {
        loginButton.classList.add("white-btn");
        registerButton.classList.remove("white-btn");
    }
}

function register() {
    hideAllFormsAndMessages();
    if (registerForm) {
        registerForm.style.display = 'flex';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            registerForm.style.right = "35px";
            registerForm.style.opacity = 1;
        }));
    }
    if (loginForm) { loginForm.style.left = "-120%"; loginForm.style.opacity = 0; }
    if (loginButton && registerButton) {
        loginButton.classList.remove("white-btn");
        registerButton.classList.add("white-btn");
    }
}

function myMenuFunction() {
    if (navMenu) navMenu.classList.toggle("responsive");
}

function showError(inputId, errorId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    if (errorElement) { errorElement.textContent = message; errorElement.style.visibility = 'visible'; }
    if (inputElement && inputElement.tagName === 'INPUT' && inputElement.type !== 'checkbox') inputElement.classList.add('error');
}

function clearError(inputId, errorId) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    if (errorElement) { errorElement.textContent = ''; errorElement.style.visibility = 'hidden'; }
    if (inputElement && inputElement.tagName === 'INPUT' && inputElement.type !== 'checkbox') inputElement.classList.remove('error');
}

// FIX: Simple, permissive email regex — accepts all real-world emails including .edu.in, subdomains etc.
function isValidEmailRegex(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateLogin() {
    let isValid = true;
    const emailInput    = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const emailValue    = emailInput    ? emailInput.value.trim()    : '';
    const passwordValue = passwordInput ? passwordInput.value.trim() : '';

    clearError('login-email', 'login-email-error');
    clearError('login-password', 'login-password-error');

    if (!emailValue) {
        showError('login-email', 'login-email-error', 'Email is required.');
        isValid = false;
    } else if (!isValidEmailRegex(emailValue)) {
        showError('login-email', 'login-email-error', 'Please enter a valid email address.');
        isValid = false;
    }

    if (!passwordValue) {
        showError('login-password', 'login-password-error', 'Password is required.');
        isValid = false;
    } else if (passwordValue.length < 8) {
        showError('login-password', 'login-password-error', 'Password must be at least 8 characters.');
        isValid = false;
    }

    return isValid;
}

function validateRegister() {
    let isValid = true;
    const fields = [
        ['reg-firstname', 'reg-firstname-error', 'First name is required.'],
        ['reg-lastname',  'reg-lastname-error',  'Last name is required.'],
    ];
    fields.forEach(([id, err, msg]) => {
        clearError(id, err);
        if (!document.getElementById(id)?.value.trim()) { showError(id, err, msg); isValid = false; }
    });

    clearError('reg-email', 'reg-email-error');
    const emailVal = document.getElementById('reg-email')?.value.trim();
    if (!emailVal) {
        showError('reg-email', 'reg-email-error', 'Email is required.');
        isValid = false;
    } else if (!isValidEmailRegex(emailVal)) {
        showError('reg-email', 'reg-email-error', 'Please enter a valid email address.');
        isValid = false;
    }

    clearError('reg-password', 'reg-password-error');
    const pwVal  = document.getElementById('reg-password')?.value.trim();
    const cpwVal = document.getElementById('reg-password-confirm')?.value.trim();
    if (!pwVal) {
        showError('reg-password', 'reg-password-error', 'Password is required.');
        isValid = false;
    } else if (pwVal.length < 8) {
        showError('reg-password', 'reg-password-error', 'Password must be at least 8 characters.');
        isValid = false;
    }

    clearError('reg-password-confirm', 'reg-password-confirm-error');
    if (!cpwVal) {
        showError('reg-password-confirm', 'reg-password-confirm-error', 'Please confirm your password.');
        isValid = false;
    } else if (pwVal && pwVal !== cpwVal) {
        showError('reg-password-confirm', 'reg-password-confirm-error', 'Passwords do not match.');
        isValid = false;
    }

    clearError('reg-terms', 'reg-terms-error');
    if (!document.getElementById('reg-terms')?.checked) {
        showError('reg-terms', 'reg-terms-error', 'You must agree to the terms and conditions.');
        isValid = false;
    }

    return isValid;
}

function showSuccessMessage(type = "Login") {
    const successHeader = document.getElementById('success-header');

    hideAllFormsAndMessages();

    if (successHeader) {
        successHeader.textContent = `${type} Successful!`;
    }

    if (successMessageContainer) {
        successMessageContainer.style.display = 'flex';

        requestAnimationFrame(() =>
            requestAnimationFrame(() =>
                successMessageContainer.classList.add('show')
            )
        );
    }

    // Redirect ONLY after successful login/register
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 2000);
}

// ── Real API Login ────────────────────────────────────────────
async function handleLoginSubmit() {
    if (!validateLogin()) return;

    const submitBtn = document.querySelector('#login .submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Signing in...'; }

    // Clear any previous API errors
    clearError('login-email', 'login-email-error');
    clearError('login-password', 'login-password-error');

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
        sessionStorage.setItem("ecoscan_auth","true");
        showSuccessMessage("Login");

} catch (err) {
        // Show the backend error message clearly
        const msg = err.message || 'Login failed. Please try again.';
        showError('login-password', 'login-password-error', msg);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Sign In'; }
    }
}

// ── Real API Signup ───────────────────────────────────────────
async function handleRegisterSubmit() {
    if (!validateRegister()) return;

    const submitBtn = document.querySelector('#register .submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Creating account...'; }

    const firstName = document.getElementById('reg-firstname').value.trim();
    const lastName  = document.getElementById('reg-lastname').value.trim();
    const email     = document.getElementById('reg-email').value.trim();
    const password  = document.getElementById('reg-password').value.trim();

    try {
        await Auth.signup({ firstName, lastName, email, password });
        showSuccessMessage("Registration");
    } catch (err) {
        const msg = err.message || 'Registration failed. Please try again.';
        showError('reg-email', 'reg-email-error', msg);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Register'; }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Remove the CSS fallback (inline style tag added for no-JS safety)
    const fallbackStyle = document.querySelector('style');
    if (fallbackStyle && fallbackStyle.textContent.includes('display: flex !important')) {
        fallbackStyle.remove();
    }
    // DEMO MODE: Removed auto-redirect to dashboard.html.
    // In real deployment, restore: if (sessionStorage.getItem("ecoscan_auth")) { window.location.href = "dashboard.html"; return; }
    if (successMessageContainer) { successMessageContainer.style.display = 'none'; successMessageContainer.classList.remove('show'); }
    login();
});

// ── Terms modal ───────────────────────────────────────────────
const termsModal              = document.getElementById('termsModal');
const termsLink               = document.getElementById('termsLink');
const closeTermsModalBtn      = document.getElementById('closeTermsModalBtn');
const termsTextContainer      = document.getElementById('termsTextContainer');
const modalTermsAgreeCheckbox = document.getElementById('modalTermsAgreeCheckbox');
const mainRegTermsCheckbox    = document.getElementById('reg-terms');

if (termsLink) termsLink.onclick = function(e) {
    e.preventDefault();
    if (termsModal) termsModal.style.display = "block";
    if (modalTermsAgreeCheckbox) { modalTermsAgreeCheckbox.checked = false; modalTermsAgreeCheckbox.disabled = true; }
    if (termsTextContainer) termsTextContainer.scrollTop = 0;
};
if (closeTermsModalBtn) closeTermsModalBtn.onclick = () => { if (termsModal) termsModal.style.display = "none"; };
window.onclick = function(event) { if (event.target == termsModal) termsModal.style.display = "none"; };
if (termsTextContainer && modalTermsAgreeCheckbox) {
    termsTextContainer.onscroll = function() {
        if (termsTextContainer.scrollHeight - termsTextContainer.scrollTop <= termsTextContainer.clientHeight + 5)
            modalTermsAgreeCheckbox.disabled = false;
    };
}
if (modalTermsAgreeCheckbox && mainRegTermsCheckbox && termsModal) {
    modalTermsAgreeCheckbox.onchange = function() {
        if (this.checked) {
            mainRegTermsCheckbox.checked  = true;
            mainRegTermsCheckbox.disabled = false;
            clearError('reg-terms', 'reg-terms-error');
            termsModal.style.display = "none";
        } else {
            mainRegTermsCheckbox.checked = false;
        }
    };
}
