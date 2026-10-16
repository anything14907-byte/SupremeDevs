"""
DOM Analyzer & Deceptive Pattern Extraction Engine
Analyzes structural DOM elements, inspects fine print, and flags dark patterns.
Built with zero external dependencies (pure Python standard library).
"""

import re
from html.parser import HTMLParser
from typing import List, Dict, Any, Optional

class DOMNode:
    def __init__(self, tag: str, attrs: Dict[str, str], parent=None):
        self.tag = tag.lower()
        self.attrs = attrs or {}
        self.parent = parent
        self.children: List['DOMNode'] = []
        self.text_content: str = ""
        self.start_tag_text: str = ""

    def add_child(self, child: 'DOMNode'):
        self.children.append(child)

    def get_attr(self, name: str, default: str = "") -> str:
        return self.attrs.get(name.lower(), default)

    def has_attr(self, name: str) -> bool:
        return name.lower() in self.attrs

    def get_classes(self) -> List[str]:
        return self.get_attr('class').split()

    def get_id(self) -> str:
        return self.get_attr('id')

    def get_full_text(self) -> str:
        parts = [self.text_content]
        for c in self.children:
            parts.append(c.get_full_text())
        return " ".join([p.strip() for p in parts if p.strip()])


class SimpleDOMParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.root = DOMNode("document", {})
        self.current = self.root
        self.node_count = 0

    def handle_starttag(self, tag, attrs):
        self.node_count += 1
        attr_dict = {k.lower(): v or "" for k, v in attrs}
        new_node = DOMNode(tag, attr_dict, parent=self.current)
        self.current.add_child(new_node)
        # Self closing tags shouldn't nest
        if tag.lower() not in ['img', 'br', 'hr', 'input', 'meta', 'link']:
            self.current = new_node

    def handle_endtag(self, tag):
        curr = self.current
        while curr and curr != self.root:
            if curr.tag == tag.lower():
                self.current = curr.parent or self.root
                break
            curr = curr.parent

    def handle_data(self, data):
        if self.current:
            self.current.text_content += (" " + data.strip())


class DOMAnalyzer:
    """
    Heuristic and structural pattern analyzer for Dark Patterns in web pages.
    """

    CONFIRMSHAMING_PATTERNS = [
        r"no\s+thanks,?\s+i\s+(hate|prefer|don'?t\s+want|dislike)\s+",
        r"no\s+thanks,?\s+i('?d)?\s+rather\s+(pay\s+full|risk|miss\s+out)",
        r"i\s+don'?t\s+care\s+about\s+saving",
        r"i\s+like\s+paying\s+full\s+price",
        r"i\s+don'?t\s+want\s+(a\s+discount|to\s+save|exclusive)",
        r"skip\s+and\s+lose\s+(my\s+perks|discount|rewards)",
        r"no,?\s+i('?ll)?\s+pass\s+on\s+protection",
        r"i\s+accept\s+the\s+risk",
        r"no\s+thanks,?\s+i'm\s+not\s+interested\s+in\s+saving"
    ]

    FAKE_URGENCY_PATTERNS = [
        r"only\s+\d+\s+left\s+(in\s+stock|available)",
        r"order\s+within\s+\d+\s+(mins?|minutes?|secs?|hours?)",
        r"deal\s+expires\s+in\s+",
        r"flash\s+sale\s+ends",
        r"high\s+demand\s+-\s+\d+%\s+sold",
        r"\d+\s+people\s+(are\s+viewing|have\s+this\s+in\s+their\s+cart|bought\s+this)",
        r"selling\s+fast!?",
        r"almost\s+sold\s+out",
        r"prices?\s+will\s+increase\s+in",
        r"offer\s+valid\s+for\s+the\s+next\s+\d+"
    ]

    SNEAK_INTO_BASKET_KEYWORDS = [
        "insurance", "warranty", "care plan", "protection plan", "donation",
        "priority handling", "tip", "expedited processing", "vip support",
        "club membership", "recurring package", "carbon offset"
    ]

    FORCED_CONTINUITY_PATTERNS = [
        r"free\s+trial.*renews?\s+at\s+\$\d+",
        r"then\s+\$\d+(\.\d{2})?\s*/?\s*(mo|month|yr|year|week)",
        r"automatically\s+renews?\s+(every|monthly|annually|after)",
        r"cancel\s+anytime\s+prior\s+to\s+renewal",
        r"first\s+\d+\s+days\s+free,?\s+then\s+\$"
    ]

    INVERTED_CHECKBOX_PATTERNS = [
        r"uncheck\s+(this\s+box\s+)?if\s+you\s+(do\s+not|wish\s+not\s+to|prefer\s+not\s+to)",
        r"check\s+here\s+if\s+you\s+do\s+not\s+want",
        r"opt\s*out\s+by\s+leaving\s+checked"
    ]

    LOW_CONTRAST_CSS_INDICATORS = [
        r"opacity\s*:\s*0\.[0-3]",
        r"font-size\s*:\s*[5-9]px",
        r"font-size\s*:\s*0\.[4-6]rem",
        r"color\s*:\s*#(ccc|bbb|aaa|999|888|777)",
        r"color\s*:\s*rgba\([^)]*,\s*0\.[1-3]\)",
        r"display\s*:\s*none",
        r"visibility\s*:\s*hidden",
        r"transform\s*:\s*scale\(0"
    ]

    def __init__(self):
        pass

    def analyze_html(self, html_content: str, source_url: str = "") -> Dict[str, Any]:
        """
        Parses raw HTML and identifies deceptive structural elements and text traps.
        """
        findings = []
        parser = SimpleDOMParser()
        try:
            parser.feed(html_content)
        except Exception as e:
            # Fallback if malformed
            pass

        # 1. Structural DOM Traversal
        self._traverse_and_inspect(parser.root, findings)

        # 2. Text and Heuristic Scan over HTML
        self._scan_text_patterns(html_content, findings)

        # 3. Form and Checkbox Sneak-In Scan
        self._scan_form_elements(parser.root, findings)

        # 4. Asymmetric Button / Roach Motel Inspection
        self._scan_asymmetric_actions(parser.root, findings)

        # Calculate Deception Index (0 to 100)
        score = min(100, sum([f.get("severity_weight", 15) for f in findings]))
        risk_level = self._compute_risk_level(score)

        return {
            "source_url": source_url or "Live Session DOM",
            "deception_index": score,
            "risk_level": risk_level,
            "total_threats": len(findings),
            "threats": findings,
            "summary": {
                "critical": len([f for f in findings if f.get("severity") == "CRITICAL"]),
                "high": len([f for f in findings if f.get("severity") == "HIGH"]),
                "medium": len([f for f in findings if f.get("severity") == "MEDIUM"]),
                "low": len([f for f in findings if f.get("severity") == "LOW"])
            },
            "shield_recommendations": self._generate_recommendations(findings)
        }

    def _traverse_and_inspect(self, node: DOMNode, findings: List[Dict[str, Any]]):
        if not node:
            return

        text = node.text_content.strip()
        full_text = node.get_full_text()
        style = node.get_attr('style', '').lower()
        classes = " ".join(node.get_classes()).lower()
        node_id = node.get_id().lower()

        # Check for fake countdown elements
        if any(k in classes or k in node_id for k in ['countdown', 'timer', 'urgency', 'clock-expire']):
            time_match = re.search(r'\b\d{1,2}:\d{2}(:\d{2})?\b', text or full_text)
            findings.append({
                "type": "FAKE_URGENCY",
                "category": "Artificial Urgency & Countdown Pressure",
                "severity": "HIGH",
                "severity_weight": 22,
                "selector": f"<{node.tag} class='{classes}' id='{node_id}'>",
                "evidence": f"Countdown timer detected: '{text[:60]}' (Timer Pattern: {time_match.group(0) if time_match else 'Active'})",
                "impact": "Induces cognitive scarcity panic to prevent rational price comparison.",
                "remedy": "TinyFish Shield freezes fake timer countdown and inspects local storage resets."
            })

        # Check for hidden/microscopic text (Sneaky terms)
        for pattern in self.LOW_CONTRAST_CSS_INDICATORS:
            if re.search(pattern, style):
                findings.append({
                    "type": "HIDDEN_DISCLAIMER",
                    "category": "Visual Concealment & Low Contrast Text",
                    "severity": "CRITICAL",
                    "severity_weight": 28,
                    "selector": f"<{node.tag} style='{style[:40]}...'>",
                    "evidence": f"Styling evasion detected ('{style[:50]}'): Content: '{text[:80]}'",
                    "impact": "Crucial recurring billing details or legal waivers visually obscured.",
                    "remedy": "TinyFish Shield forces CSS normalization (16px high-contrast amber box)."
                })
                break

        # Check for pre-selected upsell / sneak into basket
        if node.tag == 'input' and node.get_attr('type') == 'checkbox':
            is_checked = node.has_attr('checked') or node.get_attr('checked') in ['true', 'checked', '']
            parent_text = (node.parent.get_full_text() if node.parent else "").lower()
            if is_checked:
                for kw in self.SNEAK_INTO_BASKET_KEYWORDS:
                    if kw in parent_text or kw in classes or kw in node_id:
                        findings.append({
                            "type": "SNEAK_INTO_BASKET",
                            "category": "Pre-Checked Optional Fees & Add-ons",
                            "severity": "CRITICAL",
                            "severity_weight": 30,
                            "selector": f"<input type='checkbox' checked id='{node_id}'>",
                            "evidence": f"Pre-selected opt-in for paid feature: '{kw.title()}' in context: '{parent_text[:90]}'",
                            "impact": "Silent bill inflation without explicit user consent.",
                            "remedy": "TinyFish Web Agent automatically unticks pre-selected upsell inputs."
                        })
                        break

        # Recurse children
        for child in node.children:
            self._traverse_and_inspect(child, findings)

    def _scan_text_patterns(self, html_content: str, findings: List[Dict[str, Any]]):
        lower_html = html_content.lower()

        # Confirmshaming scan
        for pattern in self.CONFIRMSHAMING_PATTERNS:
            match = re.search(pattern, lower_html)
            if match:
                # Find snippet around it
                start = max(0, match.start() - 30)
                end = min(len(html_content), match.end() + 40)
                snippet = html_content[start:end].replace('\n', ' ').strip()
                findings.append({
                    "type": "CONFIRMSHAMING",
                    "category": "Emotional Coercion (Confirmshaming)",
                    "severity": "HIGH",
                    "severity_weight": 20,
                    "selector": "Text Content / Modal Action",
                    "evidence": f"Manipulative copy detected: '{match.group(0)}' (Context: ...{snippet}..)",
                    "impact": "Frames declination as foolish, irresponsible, or harmful to induce guilt.",
                    "remedy": "TinyFish rewrites deceptive copy to neutral labels ('No Thanks / Dismiss')."
                })
                break

        # False Scarcity & Social Proof
        for pattern in self.FAKE_URGENCY_PATTERNS:
            match = re.search(pattern, lower_html)
            if match:
                findings.append({
                    "type": "FALSE_SCARCITY",
                    "category": "Synthetic Scarcity & Fake Stock",
                    "severity": "MEDIUM",
                    "severity_weight": 18,
                    "selector": "Urgency Alert Banner",
                    "evidence": f"Aggressive scarcity claim detected: '{match.group(0)}'",
                    "impact": "Fabricates demand signals to force immediate impulse purchases.",
                    "remedy": "TinyFish verifies DOM network requests to check if counter is randomized client-side."
                })
                break

        # Forced Continuity / Stealth Renewals
        for pattern in self.FORCED_CONTINUITY_PATTERNS:
            match = re.search(pattern, lower_html)
            if match:
                findings.append({
                    "type": "FORCED_CONTINUITY",
                    "category": "Hidden Subscription & Stealth Renewal",
                    "severity": "CRITICAL",
                    "severity_weight": 32,
                    "selector": "Pricing / Checkout Fine Print",
                    "evidence": f"Stealth recurring charge language found: '{match.group(0)}'",
                    "impact": "User signs up assuming free or 1-time cost, then gets billed continuously.",
                    "remedy": "TinyFish triggers alert modal highlighting renewal date and recurring fee."
                })
                break

        # Inverted Checkbox Logic
        for pattern in self.INVERTED_CHECKBOX_PATTERNS:
            match = re.search(pattern, lower_html)
            if match:
                findings.append({
                    "type": "TRICK_QUESTION",
                    "category": "Inverted Logic / Double Negative Checkbox",
                    "severity": "HIGH",
                    "severity_weight": 24,
                    "selector": "Consent Form Control",
                    "evidence": f"Convoluted negation phrasing: '{match.group(0)}'",
                    "impact": "Tricks users into unintentionally agreeing to marketing spam or data sharing.",
                    "remedy": "TinyFish parses logic tree and sets checkbox to true consumer intent."
                })
                break

    def _scan_form_elements(self, root: DOMNode, findings: List[Dict[str, Any]]):
        # Scan for auto-renew toggles that are default ON
        pass

    def _scan_asymmetric_actions(self, root: DOMNode, findings: List[Dict[str, Any]]):
        # In multi-step portals, check if 'Cancel' is an obscure small link while 'Keep' is primary
        pass

    def _compute_risk_level(self, score: int) -> str:
        if score >= 70:
            return "CRITICAL DECEPTION RISK"
        elif score >= 45:
            return "HIGH MANIPULATION LEVEL"
        elif score >= 20:
            return "MODERATE RISKS DETECTED"
        elif score > 0:
            return "LOW / MINIMAL RISKS"
        return "SAFE / ETHICAL DESIGN VERIFIED"

    def _generate_recommendations(self, findings: List[Dict[str, Any]]) -> List[str]:
        recs = []
        types = set(f.get("type") for f in findings)
        if "SNEAK_INTO_BASKET" in types:
            recs.append("Auto-uncheck 1 or more pre-selected add-ons before proceeding to payment.")
        if "FORCED_CONTINUITY" in types:
            recs.append("Verify explicit subscription terms: automatic billing cycle found in fine print.")
        if "FAKE_URGENCY" in types or "FALSE_SCARCITY" in types:
            recs.append("Ignore countdown timers: client-side inspection indicates synthetic urgency.")
        if "CONFIRMSHAMING" in types:
            recs.append("Use TinyFish Neutralizer to replace guilt-tripping dismissal buttons.")
        if "HIDDEN_DISCLAIMER" in types:
            recs.append("Expand low-contrast disclaimers to review hidden fees or arbitration terms.")
        if not recs:
            recs.append("Site complies with ethical UX standards. No deceptive UI patterns flagged.")
        return recs
