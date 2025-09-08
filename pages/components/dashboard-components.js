// Dashboard Components JavaScript
class DashboardComponents {
  constructor() {
    this.init();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   INIT                                     */
  /* -------------------------------------------------------------------------- */

  init() {
    this.setupMobileMenu();
    this.setupUserDropdown();
    this.setupNotifications();
    this.loadUserData();
    this.setupScrollEffect();
    this.setActiveNavFromURL(); // Highlight nav item that matches URL
  }

  /* -------------------------------------------------------------------------- */
  /*                               MOBILE  NAV                                   */
  /* -------------------------------------------------------------------------- */

  setupMobileMenu() {
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (mobileToggle && mobileNav) {
      mobileToggle.addEventListener("click", () => {
        mobileToggle.classList.toggle("active");
        mobileNav.classList.toggle("show");
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!mobileToggle.contains(e.target) && !mobileNav.contains(e.target)) {
          mobileToggle.classList.remove("active");
          mobileNav.classList.remove("show");
        }
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              USER  DROPDOWN                                */
  /* -------------------------------------------------------------------------- */

  setupUserDropdown() {
    const userProfile = document.querySelector(".dashboard-user-profile");
    const dropdown = document.querySelector(".account-menu-panel");
    const overlay = document.querySelector(".account-menu-overlay");

    if (userProfile && dropdown && overlay) {
      // Toggle panel & overlay
      userProfile.addEventListener("click", (e) => {
        e.stopPropagation();
        userProfile.classList.toggle("active");
        dropdown.classList.toggle("show");
        overlay.classList.toggle("active");
      });

      // Clicking overlay closes panel
      overlay.addEventListener("click", () => {
        userProfile.classList.remove("active");
        dropdown.classList.remove("show");
        overlay.classList.remove("active");
      });

      // Close when clicking anywhere else
      document.addEventListener("click", () => {
        userProfile.classList.remove("active");
        dropdown.classList.remove("show");
        overlay.classList.remove("active");
      });

      // Prevent clicks inside dropdown from closing it
      dropdown.addEventListener("click", (e) => e.stopPropagation());
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              NOTIFICATIONS                                 */
  /* -------------------------------------------------------------------------- */

  setupNotifications() {
    const bell = document.querySelector(".notification-bell");
    if (bell) {
      bell.addEventListener("click", () => this.showNotifications());
    }
  }

  showNotifications() {
    // Stub – hook your notification drawer here
    console.log("Show notifications panel");
  }

  /* -------------------------------------------------------------------------- */
  /*                              LOAD USER DATA                                */
  /* -------------------------------------------------------------------------- */

  async loadUserData() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.warn("[Dashboard] No auth token found.");

      const res = await fetch("http://localhost:3100/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("[Dashboard] Failed profile fetch:", await res.text());
        return;
      }

      const { user } = await res.json();

      // Inject into UI
      const nameEl = document.querySelector(".user-name");
      const roleEl = document.querySelector(".user-role");
      const avatarEl = document.querySelector(".user-avatar");

      if (nameEl) nameEl.textContent = user.name;
      if (roleEl) roleEl.textContent = user.isAdmin ? "Administrator" : "Trader";
      if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();

      // Cache for other pages
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("[Dashboard] Error loading user data:", err);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                            HEADER  SCROLL EFFECT                           */
  /* -------------------------------------------------------------------------- */

  setupScrollEffect() {
    const header = document.querySelector(".dashboard-header");
    if (!header) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        header.style.background = "rgba(10, 10, 15, 0.98)";
        header.style.boxShadow = "0 4px 20px rgba(0,0,0,.3)";
      } else {
        header.style.background = "rgba(10, 10, 15, 0.95)";
        header.style.boxShadow = "none";
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                         NAV – SET ACTIVE LINK                              */
  /* -------------------------------------------------------------------------- */

  setActiveNavFromURL() {
    const page = (window.location.pathname.split("/").pop() || "dashboard").replace(".html", "");
    this.setActiveNav(page);
  }

  setActiveNav(page) {
    document.querySelectorAll(".dashboard-nav-links a, .mobile-nav-links a").forEach((link) => link.classList.remove("active"));
    document.querySelectorAll(`[data-page="${page}"]`).forEach((link) => link.classList.add("active"));
    this.currentPage = page;
  }

  setActive(page) {
    this.setActiveNav(page);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LOGOUT                                    */
  /* -------------------------------------------------------------------------- */

  logout() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "../index.html";
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                              INITIALISE CLASS                               */
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  window.dashboardComponents = new DashboardComponents();
});

/* -------------------------------------------------------------------------- */
/*                          GLOBAL NOTIFICATION HELPER                         */
/* -------------------------------------------------------------------------- */

function showNotification(message, type = "success") {
  const el = document.createElement("div");
  el.className = `notification ${type}`;
  el.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    z-index: 3000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
    background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#f59e0b"};
  `;
  el.textContent = message;
  document.body.appendChild(el);

  requestAnimationFrame(() => (el.style.transform = "translateX(0)"));
  setTimeout(() => {
    el.style.transform = "translateX(400px)";
    setTimeout(() => el.remove(), 300);
  }, 4000);
}
