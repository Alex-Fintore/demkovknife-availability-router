# Design QA — channel manager chips

- Source visual truth: `outputs/design-qa/source-manager-chip-reference.jpg` (user-provided reference, kept out of the public repository)
- Implementation full view: `outputs/design-qa/channel-chips-desktop.png`
- Implementation focused view: `outputs/design-qa/channel-chips-desktop-focused.png`
- Mobile evidence: `outputs/design-qa/channel-chips-mobile.png`, `outputs/design-qa/channel-chips-mobile-rules.png`
- Viewports: desktop `1440 × 1000`; mobile `390 × 844`
- State: Telegram selected; Паничкина, Попков, and Шубина-Турчина selected as recipients
- Scope: the source screenshot is a component-pattern reference for dense selectable chips, not a full-page clone. The existing CRM shell and typography remain the product source of truth.

## Full-view comparison evidence

The new routing panel sits inside the existing CRM hierarchy without changing the queue, manager table, or assignment history. The panel uses the source pattern's compact group labels, wrapped pills, strong selected states, and inline availability labels. It remains clearly separate from the operational queue above it.

## Focused comparison evidence

The source and focused implementation were opened together for comparison. A separate crop was not needed because both chip labels and status pills are legible in the provided source and the focused desktop capture.

## Findings

- No actionable P0, P1, or P2 issues found.
- Fonts and typography: the implementation intentionally keeps the current CRM's Geist hierarchy. Chip names, group labels, counts, and status pills remain readable and preserve the reference's compact density.
- Spacing and layout rhythm: channel chips and manager chips wrap predictably; section dividers, labels, and note spacing match the existing panel system. Mobile has no horizontal overflow.
- Colors and visual tokens: the selected channel uses the app's dark navigation tone; selected managers use the reference's green treatment; lunch, break, offline, and free states retain semantic labels in addition to color.
- Image quality and asset fidelity: the target pattern contains no required photographic or branded image assets. No image placeholders or replacement illustrations were introduced.
- Copy and content: channel names, real project manager names, selected count, and the round-robin/availability behavior are stated directly.
- Accessibility: channel chips expose tab state, manager chips expose pressed state, keyboard focus is visible, and status is conveyed by text rather than color alone.

## Primary interactions tested

- Switched channel tabs.
- Removed manager chips from Telegram until one recipient remained.
- Confirmed the final selected manager cannot be removed.
- Assigned a Telegram lead and confirmed it went to the sole selected manager.
- Confirmed the next WhatsApp lead resolves to its configured manager.
- Checked browser console errors: none.

## Comparison history

- Pass 1: the first complete chip implementation had no actionable P0/P1/P2 visual differences within the agreed component-pattern scope. No visual correction loop was required.

## Follow-up polish

- P3: when the real manager list becomes much larger, add search and department filters above the chip group, following the supplied reference.

final result: passed
