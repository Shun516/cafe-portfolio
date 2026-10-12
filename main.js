// Café Lumière - main.js
(function () {
  "use strict";

  const header = document.querySelector(".header");
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("globalNav");
  const closeBtn = document.getElementById("navClose");
  const navLinks = nav.querySelectorAll(".nav__link");

  // ---------- ハンバーガーメニュー ----------
  function isNavOpen() {
    return nav.classList.contains("is-open");
  }

  function setNavOpen(isOpen) {
    toggle.setAttribute("aria-expanded", String(isOpen));
    nav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("is-nav-open", isOpen);
  }

  // ☰ で開く → 閉じるボタンにフォーカス
  toggle.addEventListener("click", function () {
    setNavOpen(true);
    closeBtn.focus({ preventScroll: true });
  });

  // × で閉じる → ☰ にフォーカスを戻す
  closeBtn.addEventListener("click", function () {
    setNavOpen(false);
    toggle.focus({ preventScroll: true });
  });

  // メニュー内のリンクを押したら閉じる（移動はリンク本来の動作で行う）
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setNavOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!isNavOpen()) return;

    // Esc キーで閉じる
    if (e.key === "Escape") {
      setNavOpen(false);
      toggle.focus({ preventScroll: true });
      return;
    }

    // Tab キーのフォーカスをメニュー内で循環させる
    if (e.key === "Tab") {
      const focusables = nav.querySelectorAll("a[href], button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // PC 幅に広げたときはメニュー状態をリセット
  window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) {
    if (e.matches) setNavOpen(false);
  });

  // ---------- ダミーリンク（SNS）はページ移動させない ----------
  document.querySelectorAll("[data-dummy-link]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
    });
  });

  // ---------- スクロール連動 ----------
  const pageTop = document.getElementById("pageTop");
  const sections = Array.prototype.map.call(navLinks, function (link) {
    return document.querySelector(link.getAttribute("href"));
  });

  // 表示中のセクションに対応するナビを強調
  function updateCurrentNav() {
    const line = window.scrollY + header.offsetHeight + window.innerHeight / 3;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let current = -1;

    sections.forEach(function (section, i) {
      if (section && section.offsetTop <= line) current = i;
    });
    if (atBottom) current = sections.length - 1;

    navLinks.forEach(function (link, i) {
      const isCurrent = i === current;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
    pageTop.classList.toggle("is-visible", window.scrollY > window.innerHeight / 2);
    updateCurrentNav();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
