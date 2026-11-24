# The possibility board

A responsive, Pinterest-inspired portfolio built with plain HTML, CSS, and JavaScript. Open `index.html` in a modern browser; no dependencies or build step are required. Optional Google Fonts fall back to system fonts.

## Design & recruiter journey

- Warm cream provides a quiet canvas for cobalt, coral, lilac, and lime. Expressive display typography and serif accents add personality without making body text harder to scan.
- A compact editorial introduction gives Audrey's name, Full-Stack Developer title, and mission. About, Work, and Contact stay in the header, and the intro links directly to the featured case study.
- The opening pins mix a profile, a case study, and an illustrated design note. Distinct card treatments make the board feel collected rather than like a grid of identical project tiles.
- The masonry board combines projects, a categorized toolkit, a compact timeline, principles, recruiter FAQs, and contact information. Each card is placed in the shortest column in source order; reading and keyboard order follow the HTML.
- The portfolio website itself is the documented built project. Four additional cards are explicitly labeled case-study templates, with discipline-specific storytelling outlines. Abstract CSS artwork is illustrative, not evidence of other products.
- Project stories explain the problem, contribution, decisions, evidence, limitations, and learning. No employment, sole authorship, AI results, or impact metrics are invented.

## Interactions

Category filters apply to project cards only. Hover a card with a mouse to flip it to a short preview without shifting the board. Click or tap the card, or activate its details button with the keyboard, to open a native modal with card-specific details. Escape, the close button, or an outside-backdrop click dismisses it and returns focus to its trigger. Existing links and disclosures remain available on the card front without hover and in the relevant details dialogs.

Each project preview and details dialog includes a project link. It opens `https://example.com/` in a new tab until you add a `url` to that project's `stories` entry in `script.js`.

The three-column masonry grid adapts to two columns and then one. JavaScript recalculates placement after content resizing and font loading. Filtering animates newly visible and repositioned pins without delaying the results. Reduced-motion preferences disable animated scrolling, transitions, filter animation, and hover movement.

There is no AI service or disconnected chat preview. Recruiter FAQs provide factual answers locally, without collecting or submitting information.

## Before publishing

1. Verify the role statement and add a concise specialty or target role grounded in actual experience.
2. Replace template projects with real names, contribution, dates, technologies, screenshots, demo/source links, and supported outcomes. Update the corresponding `stories` entry in `script.js`, the card copy, `data-search`, and `data-category` in `index.html`. Only the portfolio case study currently links to source.
3. Add AI work with a task, baseline, evaluation method, actual results, failure cases, and limitations. Do not treat the experiment template as completed work.
4. Replace the journey placeholder with verified roles, organizations, dates, scope, and achievements. Add only substantiated skills, ideally linked to project evidence.
5. Add a real email and LinkedIn link to the contact card, then make email the primary action if desired. Until then, the primary action opens Audrey's GitHub profile. A resume link should be added only when the document exists.
6. Update the built/template labels and counts in `index.html` and `updateProjects()` in `script.js` when converting templates into real projects.
7. Use real screenshots where appropriate, with meaningful alt text and lazy loading for off-screen images.

## Browser checks

Check desktop and narrow mobile widths for overflow and overlapping cards. Hover and open each card, then repeat opening with keyboard and touch. Check that the popup matches the card, links and disclosures still work, filters still apply, and Escape/backdrop dismissal returns focus. With reduced motion enabled, the hover preview should swap instantly rather than rotate. No automated test runner is configured.
