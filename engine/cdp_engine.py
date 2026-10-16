"""
CDP (Chrome DevTools Protocol) & Cloud Browser Session Infrastructure
Manages cloud browsing sessions, event telemetry, DOM mutation hooks,
and real-time CDP command dispatch.
"""

import time
import uuid
import threading
from typing import Dict, List, Any, Optional

class CDPSession:
    """
    Represents an isolated cloud browser session connected via Chrome DevTools Protocol.
    """
    def __init__(self, session_id: str, target_url: str):
        self.session_id = session_id
        self.target_url = target_url
        self.created_at = time.time()
        self.status = "CONNECTED"
        self.active_domains = ["Page", "DOM", "Network", "Runtime", "Overlay", "Storage"]
        self.events: List[Dict[str, Any]] = []
        self.dom_nodes_inspected = 0
        self.deceptions_neutralized = 0
        self.is_active = True
        self._init_session()

    def _init_session(self):
        self.emit_event("Target.attachedToTarget", {
            "targetInfo": {
                "targetId": f"target-{self.session_id[:8]}",
                "type": "page",
                "title": f"TinyFish Cloud Sandbox: {self.target_url}",
                "url": self.target_url,
                "attached": True,
                "browserContextId": f"ctx-{self.session_id[:6]}"
            }
        })
        self.emit_event("Page.lifecycleEvent", {
            "name": "DOMContentLoaded",
            "timestamp": time.time(),
            "frameId": f"main-frame-{self.session_id[:6]}"
        })
        self.emit_event("Network.enable", {"status": "ACTIVE"})
        self.emit_event("DOM.enable", {"status": "ACTIVE"})

    def emit_event(self, method: str, params: Dict[str, Any]):
        event = {
            "id": str(uuid.uuid4())[:8],
            "method": method,
            "params": params,
            "timestamp": round(time.time(), 3),
            "session_id": self.session_id
        }
        self.events.append(event)
        if len(self.events) > 200:
            self.events = self.events[-200:]
        return event

    def dispatch_cdp_command(self, method: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Executes a CDP protocol method inside the sandbox.
        """
        params = params or {}
        cmd_id = str(uuid.uuid4())[:8]

        if method == "Page.navigate":
            self.target_url = params.get("url", self.target_url)
            self.emit_event("Page.frameNavigated", {"url": self.target_url})
            return {"id": cmd_id, "result": {"frameId": "main-frame", "url": self.target_url}}

        elif method == "DOM.getDocument":
            return {
                "id": cmd_id,
                "result": {
                    "root": {
                        "nodeId": 1,
                        "backendNodeId": 1,
                        "nodeType": 9,
                        "nodeName": "#document",
                        "childNodeCount": 2,
                        "children": [{"nodeId": 2, "nodeName": "HTML"}]
                    }
                }
            }

        elif method == "Runtime.evaluate":
            expr = params.get("expression", "")
            self.emit_event("Runtime.evaluateExecuted", {"expression": expr[:50]})
            return {
                "id": cmd_id,
                "result": {"type": "string", "value": f"Evaluated safely: {expr[:30]}"}
            }

        elif method == "Overlay.highlightNode":
            selector = params.get("selector", "")
            self.deceptions_neutralized += 1
            self.emit_event("Overlay.nodeHighlightRequested", {
                "selector": selector,
                "color": {"r": 255, "g": 40, "b": 100, "a": 0.8},
                "label": "TINYFISH_DARK_PATTERN_SHIELD"
            })
            return {"id": cmd_id, "result": {"success": True}}

        elif method == "Page.captureScreenshot":
            return {
                "id": cmd_id,
                "result": {"data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="}
            }

        return {"id": cmd_id, "result": {"status": "executed", "method": method}}


class CDPEngine:
    """
    Coordinator of all cloud browser instances and live DevTools connections.
    """
    def __init__(self):
        self.sessions: Dict[str, CDPSession] = {}
        self.lock = threading.Lock()
        # Seed an initial demo session
        self.create_session("https://store.hyperfastsneakers.com/checkout")

    def create_session(self, url: str) -> CDPSession:
        with self.lock:
            session_id = f"sess_{uuid.uuid4().hex[:10]}"
            session = CDPSession(session_id, url)
            self.sessions[session_id] = session
            return session

    def get_session(self, session_id: str) -> Optional[CDPSession]:
        return self.sessions.get(session_id)

    def list_sessions(self) -> List[Dict[str, Any]]:
        with self.lock:
            return [{
                "session_id": s.session_id,
                "target_url": s.target_url,
                "status": s.status,
                "events_count": len(s.events),
                "deceptions_flagged": s.deceptions_neutralized,
                "uptime_seconds": round(time.time() - s.created_at, 1)
            } for s in self.sessions.values()]

    def inject_pattern_telemetry(self, session_id: str, pattern_type: str, details: Dict[str, Any]):
        session = self.get_session(session_id)
        if session:
            session.emit_event("TinyFish.DarkPatternDetected", {
                "pattern": pattern_type,
                "details": details,
                "action": "SHIELD_OVERLAY_INJECTED"
            })
            session.dispatch_cdp_command("Overlay.highlightNode", {"selector": details.get("selector", "")})
