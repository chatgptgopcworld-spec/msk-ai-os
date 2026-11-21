"""InvoMirror license module - OFFICE / NON-COMMERCIAL EDITION.

This is an internal build for the author's own office. It replaces the paid
licensing module with a permanently-unlocked, offline stand-in:

- Always allowed, unlimited phones, never expires.
- No network calls (never contacts invomirror.invotic.com).
- No upsell / buy flow, no update nag, no announcements.

It keeps the exact same public surface the rest of the app relies on
(License(data_dir, version); .st, .phones, .allowed(), .phone_limit(),
 .seconds_left(), .check(), .public(), .request(), .dismiss(), .loop()),
so app.py continues to work unchanged.
"""
from __future__ import annotations
import hashlib
import os
import socket
import threading
import time
import uuid

SITE = "#"
DOWNLOAD = "#"
WHATSAPP_DEFAULT = "923030449680"
EMAIL_DEFAULT = "errorstudio4004@gmail.com"

# ~100 years; large enough that "left" never runs out and the UI shows a date.
_FOREVER = 100 * 365 * 24 * 3600


def _machine_id() -> str:
    """Stable, cosmetic machine id for the UI (no hardware probing / no powershell)."""
    try:
        raw = "%s|%s" % (socket.gethostname(), uuid.getnode())
    except Exception:
        raw = "office"
    h = hashlib.sha256(raw.encode("utf-8", "ignore")).hexdigest().upper()
    return "IVM-%s-%s-%s-%s" % (h[0:4], h[4:8], h[8:12], h[12:16])


class License:
    def __init__(self, data_dir, version):
        self.file = os.path.join(data_dir, "license.dat")
        self.version = version
        self.lock = threading.Lock()
        self.phones = lambda: 0          # app overwrites this with a real counter
        self.mono = time.monotonic()
        mid = _machine_id()
        self.st = {
            "status": "active",
            "reason": "",
            "expires": int(time.time()) + _FOREVER,
            "mid": mid,
            "max_phones": 0,             # 0 = unlimited
            "online": True,
            "server_now": int(time.time()),
            "mono": self.mono,
            "latest": version,
            "notes": "",
            "force": 0,
            "announcements": [],
            "whatsapp": WHATSAPP_DEFAULT,
            "email": "errorstudio4004@gmail.com",
            "price": 0,
            "prices": {},
            "methods": [],
            "error": "",
        }

    # ---- time / gating -------------------------------------------------
    def now(self):
        return int(time.time())

    def seconds_left(self):
        return _FOREVER

    def allowed(self):
        return True

    def phone_limit(self):
        return 0                         # 0 = no limit

    # ---- lifecycle -----------------------------------------------------
    def _load(self):
        return self.st

    def _save(self):
        return None

    def check(self):
        """No server. Just refresh the clock and return the public view."""
        with self.lock:
            self.st["server_now"] = int(time.time())
            self.st["expires"] = int(time.time()) + _FOREVER
        return self.public()

    def update(self):
        return None                      # never advertises an update

    def dismiss(self, ann_id=None):
        return self.public()

    def request(self, form=None):
        return {
            "ok": True,
            "message": "This is the office edition - no license required.",
            "mid": self.st["mid"],
        }

    def public(self):
        s = self.st
        return {
            "dismissed": [],
            "status": "active",
            "reason": "",
            "mid": s["mid"],
            "allowed": True,
            "left": _FOREVER,
            "expires": s["expires"],
            "limit": 0,
            "online": True,
            "error": "",
            "update": "",
            "notes": "",
            "force": 0,
            "download": DOWNLOAD,
            "site": SITE,
            "whatsapp": s["whatsapp"],
            "email": s["email"],
            "price": 0,
            "prices": {},
            "methods": [],
            "announcements": [],
            "version": self.version,
        }

    def this_pc(self):
        return {"mid": self.st["mid"]}

    def loop(self):
        """Background thread: nothing to poll. Keep the clock fresh and idle."""
        while True:
            try:
                with self.lock:
                    self.st["server_now"] = int(time.time())
                    self.st["expires"] = int(time.time()) + _FOREVER
            except Exception:
                pass
            time.sleep(1800)
