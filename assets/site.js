/* Pasajika: Sırlı Raf · Site betiği
   - "Adresi kopyala" düğmesi (TR/EN)
   - Kaydırdıkça beliren bölümler ve üst menü gölgesi
   Çerez, analiz ya da dış kaynak yok. Betik çalışmazsa bütün içerik olduğu gibi görünür. */
(function () {
  "use strict";

  var root = document.documentElement;
  var isEnglish = (root.getAttribute("lang") || "").toLowerCase().indexOf("en") === 0;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var text = isEnglish ? {
    copied: "Copied ✓",
    copiedStatus: "Address copied. Paste it into your mail app or into Gmail, Outlook and so on.",
    failedStatus: "Couldn't copy. Select the address above and copy it by hand."
  } : {
    copied: "Kopyalandı ✓",
    copiedStatus: "Adres panoya kopyalandı. E-posta uygulamana ya da Gmail, Outlook gibi hesabına yapıştırabilirsin.",
    failedStatus: "Kopyalanamadı. Adresi yukarıdan seçip elle kopyalayabilirsin."
  };

  // MARK: - Kopyalama

  function copyWithSelection(value) {
    var field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    document.body.removeChild(field);
    return copied;
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value).then(
        function () { return true; },
        function () { return copyWithSelection(value); }
      );
    }
    return Promise.resolve(copyWithSelection(value));
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    var label = button.textContent;
    var status = document.getElementById(button.getAttribute("aria-describedby"));
    var timer = null;
    button.hidden = false;
    button.addEventListener("click", function () {
      copyText(button.getAttribute("data-copy")).then(function (copied) {
        button.textContent = copied ? text.copied : label;
        if (status) {
          status.textContent = copied ? text.copiedStatus : text.failedStatus;
          status.classList.toggle("is-success", copied);
        }
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { button.textContent = label; }, 2500);
      });
    });
  });

  // MARK: - Üst menü gölgesi

  var header = document.querySelector(".site-header");
  if (header) {
    var ticking = false;
    var update = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  // MARK: - Kaydırdıkça belirme

  if (reduceMotion || !("IntersectionObserver" in window)) { return; }

  var selectors = [
    ".section-head", ".steps .card", ".features .card", ".values .card", ".split > div",
    ".tablet-row figure", ".gallery", ".contact-card", ".faq details", ".doc h2", ".summary", ".toc"
  ];
  var targets = document.querySelectorAll(selectors.join(","));
  var viewportBottom = window.innerHeight;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  targets.forEach(function (element) {
    // İlk ekranda zaten görünenler gizlenmez (titreme olmasın); sayfa açılış animasyonu yeterli.
    if (element.getBoundingClientRect().top < viewportBottom * 0.92) { return; }
    var siblings = element.parentElement ? Array.prototype.indexOf.call(element.parentElement.children, element) : 0;
    element.style.setProperty("--reveal-delay", Math.min(siblings, 5) * 70 + "ms");
    element.classList.add("reveal");
    observer.observe(element);
  });
})();
