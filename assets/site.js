/* Pasajika: Sırlı Raf · Site betiği
   Yalnızca "Adresi kopyala" düğmesi için. Çerez, analiz ya da dış kaynak yok.
   Betik çalışmazsa düğme gizli kalır; adres sayfada düz metin olarak görünür. */
(function () {
  "use strict";

  function copyWithSelection(text) {
    var field = document.createElement("textarea");
    field.value = text;
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

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return copyWithSelection(text); }
      );
    }
    return Promise.resolve(copyWithSelection(text));
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    var label = button.textContent;
    var status = document.getElementById(button.getAttribute("aria-describedby"));
    var timer = null;
    button.hidden = false;

    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy");
      copyText(text).then(function (copied) {
        button.textContent = copied ? "Kopyalandı ✓" : label;
        if (status) {
          status.textContent = copied
            ? "Adres panoya kopyalandı. E-posta uygulamana ya da Gmail, Outlook gibi hesabına yapıştırabilirsin."
            : "Kopyalanamadı. Adresi yukarıdan seçip elle kopyalayabilirsin.";
          status.classList.toggle("is-success", copied);
        }
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { button.textContent = label; }, 2500);
      });
    });
  });
})();
