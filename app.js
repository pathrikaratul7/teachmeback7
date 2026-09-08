const API_BASE_URL = "https://teachmewallapi.runasp.net/api";

function ensureFeedbackUi() {
    if (!document.getElementById("toastStack")) {
        const toastStack = document.createElement("div");
        toastStack.id = "toastStack";
        toastStack.className = "toast-stack";
        toastStack.setAttribute("aria-live", "polite");
        toastStack.setAttribute("aria-atomic", "true");
        document.body.appendChild(toastStack);
    }
}

function showToast(message, type = "info") {
    if (!message) return;
    ensureFeedbackUi();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.getElementById("toastStack").appendChild(toast);
    window.setTimeout(() => toast.remove(), 4200);
}

function getToken() {
    return localStorage.getItem("teachwallToken") || "";
}

function getRoleFromToken(token = getToken()) {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        return decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
    } catch {
        return "";
    }
}

function getCurrentUser() {
    try {
        const user = JSON.parse(localStorage.getItem("teachwallUser")) || null;
        if (!user) return null;
        return { ...user, role: user.role || getRoleFromToken() };
    } catch {
        return null;
    }
}

function setSession(data) {
    if (data.token) localStorage.setItem("teachwallToken", data.token);
    localStorage.setItem("teachwallUser", JSON.stringify({ ...data, role: data.role || getRoleFromToken(data.token) }));
}

function clearSession() {
    localStorage.removeItem("teachwallToken");
    localStorage.removeItem("teachwallUser");
}

async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("accept", "text/plain");
    if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = text; }
    if (!response.ok) {
        throw new Error(data?.message || data?.title || `Request failed (HTTP ${response.status}).`);
    }
    return data;
}

function requireAuth() {
    if (!getToken()) {
        window.location.href = "auth.html";
        return false;
    }
    enforceAccountAccess();
    return true;
}

let accountAccessCheck;
let accountAccessRedirecting = false;

function enforceAccountAccess() {
    if (accountAccessCheck) return accountAccessCheck;

    accountAccessCheck = Promise.all([
        apiFetch("/users/profile"),
        apiFetch("/users/subscription-status")
    ]).then(([profile, subscription]) => {
        const hasTokens = Number(profile?.remainingTokens) > 0;
        const hasActiveSubscription = subscription?.isSubscriptionActive === true;
        if (hasTokens && hasActiveSubscription) return true;

        if (!accountAccessRedirecting) {
            accountAccessRedirecting = true;
            showToast("Account subscription is inactive.", "error");
            window.setTimeout(() => { window.location.href = "payment.html"; }, 1500);
        }
        return false;
    }).catch(() => true);

    return accountAccessCheck;
}

function renderHeader(activePage) {
    const user = getCurrentUser();
    const header = document.querySelector("[data-site-header]");
    if (!header) return;
    header.innerHTML = `
        <div class="brand"><a href="index.html">TeachWall</a><span>Learn by explaining</span></div>
        <nav aria-label="Main navigation">
            <a class="${activePage === "posts" ? "active" : ""}" href="posts.html">Posts</a>
            <a class="${activePage === "answers" ? "active" : ""}" href="answers.html">Answers</a>
            <a class="${activePage === "teachback" ? "active" : ""}" href="teachback.html">Teach Me Back</a>
            <a class="${activePage === "profile" ? "active" : ""}" href="profile.html">Profile</a>
            <a class="${activePage === "payment" ? "active" : ""}" href="payment.html">Get tokens</a>
            ${["Admin", "SuperAdmin"].includes(user?.role) ? `<a class="${activePage === "admin" ? "active" : ""}" href="admin.html">Admin</a>` : ""}
        </nav>
        <div class="account">${user ? `<span>${user.username || user.email}</span><button class="link-button" data-logout>Log out</button>` : `<a href="auth.html">Log in</a>`}</div>`;
    header.querySelector("[data-logout]")?.addEventListener("click", () => { clearSession(); window.location.href = "auth.html"; });
}

function showMessage(element, message, type = "") {
    element.className = `message ${type}`.trim();
    element.textContent = message;
    showToast(message, type === "error" ? "error" : type === "success" ? "success" : "info");
}

document.addEventListener("DOMContentLoaded", ensureFeedbackUi);
