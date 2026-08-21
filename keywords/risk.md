---
description: |
    A declared risk with likelihood, impact, and mitigation stated by its owner.
    Example:
        # risk Delayed approval
        Likelihood: medium. Impact: launch delay. Mitigation: weekly review.
synonyms:
    - hazard
    - threat
    - risk-item
---

<identified_risk name="{name}" id="{id}" {attrs} source="{source}">

{body}

{children}

</identified_risk>
