"""
Terms of Service (ToS) & Fine Print Deception Analyzer
Inspects legal fine print, identifies anti-consumer clauses, sneaky billing terms,
forced arbitration, and undisclosed data monetization.
"""

import re
from typing import List, Dict, Any

class ToSAnalyzer:
    """
    Automated NLP & rule-based legal fine print inspector.
    """

    RULES = [
        {
            "id": "STEALTH_AUTO_RENEWAL",
            "name": "Stealth Auto-Renewal & Negative Option Billing",
            "severity": "CRITICAL",
            "weight": 28,
            "patterns": [
                r"automatically\s+renew(s|ed|ing)?\s+unless\s+(cancelled|notified)",
                r"billed\s+on\s+a\s+recurring\s+basis\s+without\s+further\s+authorization",
                r"subscription\s+will\s+continue\s+indefinitely",
                r"failure\s+to\s+cancel\s+prior\s+to\s+the\s+conclusion\s+of\s+the\s+trial",
                r"pre-authorized\s+charge\s+on\s+each\s+anniversary"
            ],
            "plain_english": "Your card will be charged automatically indefinitely without asking you again.",
            "risk_warning": "High risk of unexpected recurring charges after promotional or trial periods."
        },
        {
            "id": "UNILATERAL_PRICE_CHANGE",
            "name": "Unilateral Price & Terms Alteration",
            "severity": "HIGH",
            "weight": 22,
            "patterns": [
                r"reserve\s+the\s+right\s+to\s+(modify|change|increase)\s+fees\s+at\s+any\s+time",
                r"without\s+prior\s+notice,\s+modify\s+the\s+terms",
                r"continued\s+use\s+constitutes\s+acceptance\s+of\s+any\s+price\s+changes",
                r"prices\s+subject\s+to\s+change\s+without\s+notice"
            ],
            "plain_english": "The company can raise your subscription price or change terms at any moment without needing your approval.",
            "risk_warning": "Your subscription cost can double without an explicit opt-in confirmation."
        },
        {
            "id": "BINDING_ARBITRATION_CLASS_WAIVER",
            "name": "Mandatory Arbitration & Class Action Waiver",
            "severity": "HIGH",
            "weight": 20,
            "patterns": [
                r"binding\s+arbitration",
                r"waive\s+(any\s+right\s+to\s+participate\s+in\s+a\s+class\s+action|the\s+right\s+to\s+a\s+jury\s+trial)",
                r"arbitration\s+on\s+an\s+individual\s+basis",
                r"disputes\s+must\s+be\s+resolved\s+in\s+private\s+arbitration"
            ],
            "plain_english": "You forfeit your right to take this company to court or join a class action lawsuit if they defraud you.",
            "risk_warning": "Severely limits your legal remedies in the event of unauthorized charges or data breaches."
        },
        {
            "id": "DATA_MONETIZATION_BROKERAGE",
            "name": "Undisclosed Third-Party Data Sale & Telemetry Tracking",
            "severity": "CRITICAL",
            "weight": 25,
            "patterns": [
                r"share\s+or\s+sell\s+your\s+(information|data|browsing\s+habits)",
                r"marketing\s+partners\s+and\s+commercial\s+affiliates\s+may\s+access",
                r"irrevocable,\s+perpetual,\s+royalty-free\s+license\s+to\s+use",
                r"aggregate\s+and\s+de-identified\s+data\s+may\s+be\s+commercialized"
            ],
            "plain_english": "They reserve the right to monetize, share, or sell your personal and browsing behavior to ad brokers.",
            "risk_warning": "Your purchase history and contact info will likely be disseminated to marketing spammers."
        },
        {
            "id": "PUNITIVE_CANCELLATION_FRICTION",
            "name": "Punitive Cancellation Fees & Narrow Exit Windows",
            "severity": "CRITICAL",
            "weight": 30,
            "patterns": [
                r"early\s+termination\s+fee",
                r"cancellation\s+must\s+be\s+received\s+at\s+least\s+\d+\s+days\s+prior",
                r"restocking\s+fee\s+of\s+\d+%",
                r"cancel\s+only\s+by\s+calling\s+our\s+toll-free\s+number",
                r"non-refundable\s+administrative\s+fee"
            ],
            "plain_english": "They charge high exit penalties or demand phone calls during narrow hours to cancel your subscription.",
            "risk_warning": "Typical 'Roach Motel' tactic designed to make quitting harder than signing up."
        },
        {
            "id": "DISCLAIMER_OF_CORE_SERVICE",
            "name": "Complete Liability Shield & Warranty Erasure",
            "severity": "MEDIUM",
            "weight": 14,
            "patterns": [
                r"provided\s+strictly\s+[\"']as\s+is[\"']\s+and\s+[\"']as\s+available[\"']",
                r"no\s+warranty\s+of\s+merchantability\s+or\s+fitness\s+for\s+a\s+particular\s+purpose",
                r"total\s+liability\s+shall\s+not\s+exceed\s+(\$\d+|fifty\s+dollars)"
            ],
            "plain_english": "If their service crashes, loses your data, or fails to deliver, they owe you zero compensation.",
            "risk_warning": "The vendor absolves themselves of any duty of quality or performance."
        }
    ]

    def analyze_terms(self, text: str) -> Dict[str, Any]:
        """
        Inspects terms and fine print text to extract predatory traps.
        """
        if not text or len(text.strip()) < 10:
            return {
                "score": 0,
                "status": "NO_CONTENT",
                "clauses_flagged": 0,
                "findings": [],
                "tldr": "No fine print text provided to analyze."
            }

        findings = []
        clean_text = text.replace('\r', ' ')

        for rule in self.RULES:
            matched_snippets = []
            for pattern in rule["patterns"]:
                for match in re.finditer(pattern, clean_text, re.IGNORECASE):
                    start = max(0, match.start() - 60)
                    end = min(len(clean_text), match.end() + 60)
                    snippet = clean_text[start:end].replace('\n', ' ').strip()
                    matched_snippets.append({
                        "phrase": match.group(0),
                        "context": f"...{snippet}..."
                    })

            if matched_snippets:
                findings.append({
                    "rule_id": rule["id"],
                    "name": rule["name"],
                    "severity": rule["severity"],
                    "weight": rule["weight"],
                    "plain_english": rule["plain_english"],
                    "risk_warning": rule["risk_warning"],
                    "occurrences": len(matched_snippets),
                    "evidence": matched_snippets[:3]  # top 3 instances
                })

        # Calculate Fine Print Hazard Score (0 to 100)
        total_weight = sum(f["weight"] for f in findings)
        hazard_score = min(100, total_weight)

        tldr_points = [f["plain_english"] for f in findings]
        tldr_summary = " • ".join(tldr_points) if tldr_points else "No predatory or deceptive legal clauses identified in this text snippet."

        return {
            "hazard_score": hazard_score,
            "status": "COMPLETED",
            "clauses_flagged": len(findings),
            "findings": findings,
            "tldr": tldr_summary,
            "recommendation": (
                "DO NOT AGREE without reviewing recurring billing dates."
                if hazard_score >= 50 else
                "Review highlighted clauses before confirming agreement."
                if hazard_score > 0 else
                "Standard legal terms with low predatory friction."
            )
        }
