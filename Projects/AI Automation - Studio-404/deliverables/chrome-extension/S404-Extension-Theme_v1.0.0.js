// Applies the saved dark / light choice before the popup paints, so there is no flash.
try { const t = localStorage.getItem('ics-theme'); if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; } catch (e) {}
