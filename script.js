const grid = document.querySelector('#grid');
const cards = [...grid.querySelectorAll('.card')];
const projectCards = cards.filter((card) => card.classList.contains('project-card'));
const filterButtons = [...document.querySelectorAll('.filter')];
const searchInput = document.querySelector('#project-search');
const filterStatus = document.querySelector('#filter-status');
const emptyState = document.querySelector('#empty-state');
const dialog = document.querySelector('.project-dialog');
let activeFilter = 'all';
let dialogTrigger;
let dialogDestination;
let layoutFrame;
let laidOutColumns;
const filterAnimations = new WeakMap();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const stories = {
  portfolio: {
    category: 'FEATURED / PHARMACY STOCKING',
    lead: 'An AI-powered system for managing and tracking pharmacy stock.',
    preview: 'Predictive AI supports stocking decisions. The build combines React, Next.js, Node.js, and Python.',
    sections: [
      ['Project focus', 'Track stock and use predictive AI to support pharmacy stocking decisions.'],
      ['Technology stack', 'React, Next.js, Node.js, and Python.'],
      ['Case study to expand', 'Add the forecasting approach, your role, and evidence of how the system improved stock decisions.']
    ]
  },
  one: {
    category: 'FULL-STACK / CASE-STUDY TEMPLATE',
    lead: 'A case-study outline for an emergency room intake form, focused on the flow from entering information to handing it off to staff.',
    sections: [
      ['User need', 'Name the real audience and the problem they had. Explain why the problem mattered rather than starting with the technology stack.'],
      ['My role & scope', 'Document your actual contribution, collaborators, time frame, and constraints. Separate what you built from what the team delivered.'],
      ['System & decisions', 'Show the interface-to-API-to-data flow. Explain a meaningful architecture trade-off and why the chosen approach fit the constraints.'],
      ['A difficult moment', 'Describe a specific obstacle, your diagnosis, and how the solution changed the product or implementation.'],
      ['Evidence & outcome', 'Add working source and demo links, actual technologies, and reproducible checks. Report a measured result only when you can support it.'],
      ['Reflection', 'Explain what you would change next and why. Include remaining limitations rather than implying the product is finished.']
    ]
  },
  two: {
    category: 'AI / RAG',
    lead: 'A chat-based helper for an online store. The outline covers how to document the support workflow, interface, and retrieval quality.',
    sections: [
      ['Audience & friction', 'Describe the actual task a user needed to complete and what made the existing experience difficult.'],
      ['My contribution', 'State which research, design, and implementation work you personally owned, with dates and team context.'],
      ['Interaction choices', 'Show the important states and explain navigation, hierarchy, feedback, and accessibility decisions.'],
      ['Implementation', 'List the technologies actually used. Explain one responsive, state-management, or performance trade-off.'],
      ['Validation', 'Add real screenshots and test evidence, including keyboard and mobile behavior. Distinguish observations from formal usability testing.'],
      ['Outcome & learning', 'Use a substantiated result, or clearly state that results were not measured. Explain what feedback would inform the next iteration.']
    ]
  },
  three: {
    category: 'FULL-STACK / INCIDENT ANALYSIS',
    lead: 'A dashboard for tracking customer incidents and identifying recurring patterns that matter for reliability.',
    sections: [
      ['System need', 'Explain who depended on the service, the required behavior, and relevant data or reliability constraints.'],
      ['Ownership', 'Define the components you built and the team boundaries. Include the actual time frame and technologies.'],
      ['Architecture', 'Show API contracts, data relationships, and a meaningful choice between alternative designs.'],
      ['Reliability', 'Describe real error handling, validation, testing, and access-control decisions. Avoid broad claims unsupported by the implementation.'],
      ['Evidence', 'Link the source or a shareable technical write-up. Provide reproducible tests and genuine measurements if available.'],
      ['Trade-offs & learning', 'Name remaining risks and what you would improve. Explain how the constraints influenced the result.']
    ]
  },
  four: {
    category: 'EXPERIMENTS / TOKEN CACHING',
    lead: 'A case-study outline for token caching: what can be reused, when it should be refreshed, and how to measure the trade-offs.',
    sections: [
      ['Hypothesis & baseline', 'Compare the same workflow with and without caching to measure what reuse changes.'],
      ['My contribution', 'Explain what you implemented, the actual model or service used, and the scope and dates of the experiment.'],
      ['Prototype & data', 'Describe the workflow, data provenance, and privacy constraints. Link only data and artifacts you are permitted to share.'],
      ['Evaluation', 'Document the test set, baseline, success criteria, and observed failure cases. Publish only results actually measured.'],
      ['Limits & safeguards', 'Explain uncertainty, incorrect outputs, relevant bias, latency, and cost. Describe actual checks and when a human needs to intervene.'],
      ['What I learned', 'Say whether the hypothesis held up, what evidence supports that conclusion, and which next experiment would be useful.']
    ]
  }
};

const cardDetails = {
  'identity-card': {
    category: 'ABOUT',
    preview: 'I enjoy combining creativity with technical problem-solving and learning new technologies along the way.',
    selector: '.identity-role, .identity-role + p, .about-details'
  },
  'skills-card': {
    category: 'TECHNICAL SKILLS',
    preview: 'From React and .NET to retrieval-augmented generation, testing, and production support.',
    selector: '.skill-groups'
  },
  'experience-card': {
    category: 'EXPERIENCE',
    preview: 'At Microsoft: cloud application features, AI-powered data workflows, and improvements to search and observability.',
    selector: '.timeline'
  },
  'faq-card': {
    category: 'RECRUITER FAQ',
    preview: 'How I approach engineering, what I bring to a team, and what I’d build just for fun.',
    selector: 'details'
  },
  'contact-card': {
    category: 'CONTACT',
    preview: 'Let’s talk about full-stack engineering, thoughtful digital products, or creative collaboration.',
    selector: '.contact-channels, .button'
  },
  'note-card': {
    category: 'DESIGN PRINCIPLES',
    preview: 'How I balance clarity and personality in an interface.',
    selector: 'p'
  }
};

function setUpCard(card) {
  const title = card.querySelector('h3').innerText.trim().replace(/\s+/g, ' ');
  let trigger = card.querySelector('.project-open');
  const story = trigger ? stories[trigger.dataset.project] : null;
  const details = cardDetails[Object.keys(cardDetails).find((name) => card.classList.contains(name))];
  if (!trigger) {
    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'card-open text-link';
    trigger.textContent = 'View details';
    card.append(trigger);
  }
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-label', `Open details: ${title}`);

  const front = document.createElement('div');
  front.className = 'card-front';
  front.append(...card.childNodes);
  const back = document.createElement('div');
  back.className = 'card-back';
  const label = document.createElement('p');
  label.className = 'card-back-label';
  label.textContent = 'A closer look';
  const heading = document.createElement('p');
  heading.className = 'card-back-title';
  heading.textContent = title;
  const preview = document.createElement('p');
  preview.textContent = story ? story.preview ?? story.lead : details.preview;
  const hint = document.createElement(story ? 'a' : 'p');
  hint.className = 'card-back-hint';
  if (story) {
    hint.classList.add('project-demo', 'text-link');
    hint.href = story.url ?? 'https://example.com/';
    hint.target = '_blank';
    hint.rel = 'noopener noreferrer';
    hint.textContent = story.url ? 'Visit project' : 'Visit project (placeholder)';
    hint.setAttribute('aria-label', `${hint.textContent}: ${title} (opens in a new tab)`);
    [label, heading, preview].forEach((item) => item.setAttribute('aria-hidden', 'true'));
  } else {
    back.setAttribute('aria-hidden', 'true');
    hint.textContent = 'Click for details';
  }
  back.append(label, heading, preview, hint);
  const flipper = document.createElement('div');
  flipper.className = 'card-flipper';
  flipper.append(front, back);
  card.append(flipper);
  card.classList.add('is-flippable');
  card.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') card.classList.add('is-hovered');
  });
  card.addEventListener('pointerleave', () => card.classList.remove('is-hovered'));

  card.addEventListener('click', (event) => {
    const control = event.target.closest('a, button, summary');
    if (control && control !== trigger) return;
    document.querySelector('#dialog-title').textContent = title;
    document.querySelector('#dialog-category').textContent = story?.category ?? details.category;
    document.querySelector('#dialog-lead').textContent = story?.lead ?? details.preview;
    const sections = (story?.sections ?? []).map(([heading, copy]) => {
      const section = document.createElement('section');
      const title = document.createElement('h3');
      const paragraph = document.createElement('p');
      title.textContent = heading;
      paragraph.textContent = copy;
      section.append(title, paragraph);
      return section;
    });
    document.querySelector('#dialog-grid').replaceChildren(...sections);
    const extra = [...front.querySelectorAll(details?.selector ?? '.project-links')]
      .map((item) => item.cloneNode(true));
    if (story) {
      const projectLink = hint.cloneNode(true);
      projectLink.classList.remove('card-back-hint', 'project-demo');
      extra.unshift(projectLink);
    }
    extra.forEach((item) => {
      if (item.matches('details')) item.open = true;
    });
    document.querySelector('#dialog-extra').replaceChildren(...extra);
    dialogTrigger = trigger;
    dialog.showModal();
    dialog.scrollTop = 0;
  });
}

cards.forEach(setUpCard);

function layoutCollection() {
  grid.classList.add('is-laid-out');
  const style = getComputedStyle(grid);
  const rowHeight = parseFloat(style.gridAutoRows);
  const gap = parseFloat(style.columnGap);
  const columns = Number(style.getPropertyValue('--columns'));
  if (columns !== laidOutColumns) {
    cards.forEach((card) => {
      card.style.gridColumnStart = '';
      card.style.gridRow = '';
    });
    laidOutColumns = columns;
  }
  const columnEnds = Array(columns).fill(1);
  const visible = cards.filter((card) => !card.hidden);
  const heights = visible.map((card) => card.offsetHeight);

  visible.forEach((card, index) => {
    const row = Math.min(...columnEnds);
    const column = columnEnds.indexOf(row);
    const span = Math.ceil(heights[index] / rowHeight);
    card.style.gridColumnStart = column + 1;
    card.style.gridRow = `${row} / span ${span}`;
    columnEnds[column] = row + span + Math.ceil(gap / rowHeight);
  });
}

function scheduleLayout() {
  cancelAnimationFrame(layoutFrame);
  layoutFrame = requestAnimationFrame(layoutCollection);
}

const observer = new ResizeObserver(scheduleLayout);
cards.forEach((card) => observer.observe(card));
window.addEventListener('resize', scheduleLayout);
layoutCollection();
document.fonts.ready.then(scheduleLayout);

function updateProjects(animate = true) {
  const shouldAnimate = animate && !reducedMotion.matches;
  const previous = new Map(shouldAnimate
    ? cards.filter((card) => !card.hidden).map((card) => [card, card.getBoundingClientRect()])
    : []);
  cards.forEach((card) => filterAnimations.get(card)?.cancel());
  const query = searchInput?.value.trim().toLowerCase() ?? '';
  projectCards.forEach((card) => {
    const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLowerCase();
    card.hidden = !(matchesCategory && searchableText.includes(query));
  });
  const visible = projectCards.filter((card) => !card.hidden);
  const built = visible.filter((card) => card.id === 'portfolio-project').length;
  const templates = visible.length - built;
  if (filterStatus) {
    filterStatus.textContent = `${visible.length} project ${visible.length === 1 ? 'card' : 'cards'} · ${built} built, ${templates} case-study ${templates === 1 ? 'template' : 'templates'}`;
  }
  if (emptyState) emptyState.hidden = visible.length > 0;
  layoutCollection();
  if (!shouldAnimate) return;

  cards.filter((card) => !card.hidden).forEach((card) => {
    const before = previous.get(card);
    const after = card.getBoundingClientRect();
    const x = before ? before.left - after.left : 0;
    const y = before ? before.top - after.top : 8;
    if (before && Math.abs(x) < 1 && Math.abs(y) < 1) return;
    const nearby = Math.abs(y) < 160;
    filterAnimations.set(card, card.animate(
      [
        { translate: nearby ? `${x}px ${y}px` : '0 8px', opacity: before && nearby ? 1 : .55 },
        { translate: '0 0', opacity: 1 }
      ],
      { duration: 200, easing: 'ease-out' }
    ));
  });
}

function selectFilter(value, animate = true) {
  activeFilter = value;
  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === value;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  updateProjects(animate);
}

filterButtons.forEach((button) => button.addEventListener('click', () => selectFilter(button.dataset.filter)));
searchInput?.addEventListener('input', () => updateProjects());

function resetFilters(animate = true) {
  if (searchInput) searchInput.value = '';
  selectFilter('all', animate);
}

document.querySelector('#reset-filters')?.addEventListener('click', () => {
  resetFilters();
  searchInput?.focus();
});

const featuredProject = document.querySelector('#portfolio-project');
document.querySelectorAll('a[href="#portfolio-project"]').forEach((link) => {
  link.addEventListener('click', () => {
    if (featuredProject.hidden) resetFilters(false);
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const localLink = event.target.closest('a[href^="#"]');
  if (localLink) {
    dialogDestination = localLink.hash === '#contact'
      ? document.querySelector('#contact .card-open')
      : document.querySelector('.site-header .wordmark');
    dialog.close();
    return;
  }
  const bounds = dialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (event.target === dialog && outside) dialog.close();
});
dialog.addEventListener('close', () => {
  if (dialogDestination) {
    dialogDestination.focus({ preventScroll: true });
    dialogDestination = null;
  } else {
    dialogTrigger.focus({ preventScroll: true });
  }
});
