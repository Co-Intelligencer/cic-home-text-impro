(() => {
  'use strict';
  const q = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const landing = q('.landing-mode');
  const page = q('.lv3');

  // Desktop navigation shares the original dropdown geometry.
  const nav = q('.mnav');
  const panel = q('.mnav-panel');
  const navLinks = all('[data-menu]');
  const panelBodies = all(':scope > div', panel);
  let openMenu = -1;
  let closeTimer;
  function closeMenu() {
    openMenu = -1;
    panel.dataset.open = 'false';
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    navLinks.forEach(link => link.setAttribute('aria-expanded', 'false'));
  }
  function showMenu(index) {
    clearTimeout(closeTimer);
    openMenu = index;
    const target = navLinks[index].getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    panel.style.left = `${Math.min(target.left - navRect.left - 12, navRect.width - 340)}px`;
    panel.style.width = '330px';
    panel.style.height = `${panelBodies[index].scrollHeight}px`;
    panel.dataset.open = 'true';
    panel.setAttribute('aria-hidden', 'false');
    panel.inert = false;
    panelBodies.forEach((body, i) => {
      body.dataset.open = String(i === index);
      body.inert = i !== index;
    });
    navLinks.forEach((link, i) => link.setAttribute('aria-expanded', String(i === index)));
  }
  navLinks.forEach((link, index) => {
    link.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') showMenu(index); });
    link.addEventListener('focus', () => showMenu(index));
    link.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); showMenu(index); q('a', panelBodies[index]).focus(); }
    });
    link.addEventListener('click', closeMenu);
  });
  nav.addEventListener('pointerleave', () => { closeTimer = setTimeout(closeMenu, 140); });
  panel.addEventListener('pointerenter', () => clearTimeout(closeTimer));
  nav.addEventListener('focusout', event => { if (!nav.contains(event.relatedTarget)) closeMenu(); });
  panel.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  closeMenu();

  const menuButton = q('button[aria-controls="mmenu"]');
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'mmenu';
  mobileMenu.className = 'mobile-menu';
  mobileMenu.hidden = true;
  [...navLinks, q('.mnav-start'), q('.flinks a[href$="/join"]'), q('.mnav-icon')].forEach(link => {
    const clone = link.cloneNode(true);
    clone.className = '';
    clone.removeAttribute('data-menu');
    clone.removeAttribute('aria-expanded');
    if (clone.getAttribute('aria-label') === 'Log in') clone.textContent = 'Log in';
    mobileMenu.append(clone);
  });
  nav.append(mobileMenu);
  function closeMobile() {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }
  menuButton.addEventListener('click', () => {
    const opening = mobileMenu.hidden;
    mobileMenu.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  });
  mobileMenu.addEventListener('click', event => { if (event.target.closest('a')) closeMobile(); });
  document.addEventListener('click', event => { if (!nav.contains(event.target)) { closeMenu(); closeMobile(); } });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!mobileMenu.hidden) { closeMobile(); menuButton.focus(); }
      if (openMenu >= 0) { const index = openMenu; closeMenu(); navLinks[index].focus(); closeMenu(); }
    }
  });

  const heroViews = all('.hs-face');
  const heroDots = all('.hs-dot');
  heroDots.forEach((dot, index) => dot.addEventListener('click', () => {
    heroViews.forEach((view, i) => { view.classList.toggle('is-on', i === index); view.inert = i !== index; });
    heroDots.forEach((button, i) => { button.classList.toggle('is-on', i === index); button.setAttribute('aria-pressed', String(i === index)); });
  }));

  // A local, visual talking-stick demonstration, with all media left as placeholders.
  const room = q('.product-room');
  const originalPeople = all('.product-person', room);
  const milo = originalPeople[0].cloneNode(true);
  q('.seat-name', milo).textContent = 'Milo';
  q('.media-placeholder', milo).setAttribute('aria-label', 'Milo image placeholder');
  q('.media-placeholder > span', milo).textContent = 'Milo';
  milo.classList.remove('is-speaking');
  milo.classList.add('milo-person');
  room.append(milo);
  let invited = true;
  let speaking = 0;
  let flow = 'Sunwise';
  const flowButtons = all('.demo-flow button');
  const pass = q('.demo-pass');
  const hand = q('.seat-hand');
  const miloButton = document.createElement('button');
  miloButton.type = 'button';
  miloButton.className = 'demo-milo ai-detail';
  const audio = document.createElement('span');
  audio.className = 'audio-placeholder ai-detail';
  audio.textContent = 'Audio placeholder';
  q('.demo-flow').before(audio, miloButton);
  const aiSetting = document.createElement('div');
  aiSetting.className = 'ai-detail';
  aiSetting.innerHTML = '<span>AI · Milo</span><strong>In the circle</strong>';
  q('.product-settings > div').after(aiSetting);
  function people() { return invited && landing.dataset.mode === 'milo' ? [...originalPeople, milo] : originalPeople; }
  function nextIndex() { const count = people().length; return (speaking + (flow === 'Earthwise' ? -1 : 1) + count) % count; }
  function positionPeople() {
    const seats = people();
    const width = room.clientWidth;
    const height = room.clientHeight;
    const tile = Math.min(width < 420 ? 68 : 110, width * .18);
    const radius = Math.min((width - tile - 45) / 2, (height - tile - 100) / 2);
    room.style.setProperty('--tile', `${tile}px`);
    const orbit = q('.product-orbit-line');
    orbit.style.width = `${radius * 2}px`;
    orbit.style.height = `${radius * 2}px`;
    seats.forEach((seat, index) => {
      const angle = (-90 + index * 360 / seats.length) * Math.PI / 180;
      seat.style.left = `${width / 2 + Math.cos(angle) * radius}px`;
      seat.style.top = `${height / 2 + Math.sin(angle) * radius}px`;
    });
    hand.style.left = seats[nextIndex()].style.left;
    hand.style.top = seats[nextIndex()].style.top;
  }
  function renderRoom() {
    const seats = people();
    if (speaking >= seats.length) speaking = 0;
    milo.hidden = !seats.includes(milo);
    seats.forEach((seat, i) => {
      const name = q('.seat-name', seat).textContent;
      const active = i === speaking;
      const eligible = !active && (flow === 'Open round' || i === nextIndex());
      seat.disabled = !eligible;
      seat.classList.toggle('is-speaking', active);
      seat.classList.toggle('is-next', eligible);
      seat.setAttribute('aria-pressed', String(active));
      seat.setAttribute('aria-label', active ? `${name} holds the stick` : eligible ? `Pass the stick to ${name}` : `${name}, waiting for their turn`);
    });
    q('.demo-stick-card strong').textContent = `${q('.seat-name', seats[speaking]).textContent} · 02:47`;
    q('.product-room-meta > span').textContent = `Demo circle · ${seats.length} people`;
    q('.product-room-meta > span:last-child').textContent = flow;
    q('.product-settings > div strong').textContent = flow === 'Sunwise' ? 'Sunwise · clockwise' : flow === 'Earthwise' ? 'Earthwise · counterclockwise' : 'Open round · choose a voice';
    q('strong', aiSetting).textContent = invited ? 'In the circle' : 'By invitation';
    q('.product-room-title div > span').textContent = `#530129 · ${landing.dataset.mode === 'milo' ? 'AI invited' : 'Human Mode'}`;
    flowButtons.forEach(button => { const active = button.textContent === flow; button.classList.toggle('is-on', active); button.setAttribute('aria-pressed', String(active)); });
    const nextName = q('.seat-name', seats[nextIndex()]).textContent;
    hand.setAttribute('aria-label', `Pass the stick to ${nextName}`);
    hand.title = `Pass the stick to ${nextName}`;
    hand.hidden = flow === 'Open round';
    pass.textContent = flow === 'Open round' ? 'Pass to next voice' : 'Pass the stick';
    miloButton.textContent = invited ? 'Milo leaves' : 'Invite Milo';
    miloButton.setAttribute('aria-pressed', String(invited));
    positionPeople();
  }
  function passStick(index = nextIndex()) {
    speaking = index;
    renderRoom();
    q('.demo-hint').textContent = `${q('.seat-name', people()[speaking]).textContent} has the stick. ${flow === 'Open round' ? 'Choose the next person when this turn is complete.' : 'Pass it on when this turn is complete.'}`;
  }
  [...originalPeople, milo].forEach(seat => seat.addEventListener('click', () => { if (!seat.disabled) passStick(people().indexOf(seat)); }));
  pass.addEventListener('click', () => passStick());
  hand.addEventListener('click', () => passStick());
  flowButtons.forEach(button => button.addEventListener('click', () => { flow = button.textContent; renderRoom(); q('.demo-hint').textContent = flow === 'Open round' ? 'Choose any person to take the next turn.' : `The stick now moves ${flow === 'Sunwise' ? 'clockwise' : 'counterclockwise'}.`; }));
  miloButton.addEventListener('click', () => { invited = !invited; renderRoom(); });
  new ResizeObserver(positionPeople).observe(room);

  function setMode(mode) {
    const ai = mode === 'milo';
    landing.dataset.mode = ai ? 'milo' : 'human';
    page.dataset.variant = landing.dataset.mode;
    all('.landing-mode-dock button').forEach(button => {
      const active = button.dataset.setMode === landing.dataset.mode;
      button.classList.toggle('is-active', active);
      button.classList.toggle('is-ai', button.dataset.setMode === 'milo');
      button.setAttribute('aria-pressed', String(active));
      button.disabled = active;
    });
    q('[data-toggle-mode]').textContent = ai ? 'Hide the AI features' : 'Show the AI features';
    if (openMenu >= 0) showMenu(openMenu);
    renderRoom();
  }
  all('[data-set-mode]').forEach(button => button.addEventListener('click', () => {
    setMode(button.dataset.setMode);
    if (button.closest('.compare-col')) q('#room').scrollIntoView({ behavior: 'smooth' });
  }));
  q('[data-toggle-mode]').addEventListener('click', () => setMode(landing.dataset.mode === 'milo' ? 'human' : 'milo'));
  setMode('milo');

  all('.rail-handle').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.price-card');
    const open = card.dataset.open !== 'true';
    card.dataset.open = String(open);
    button.setAttribute('aria-expanded', String(open));
  }));
  all('.info-dot').forEach((button, index) => {
    const tooltip = button.nextElementSibling;
    tooltip.id = `plan-detail-${index}`;
    button.setAttribute('aria-controls', tooltip.id);
    button.setAttribute('aria-describedby', tooltip.id);
    function toggle(open) {
      button.dataset.open = String(open);
      button.setAttribute('aria-expanded', String(open));
      tooltip.dataset.open = String(open);
      tooltip.setAttribute('aria-hidden', String(!open));
    }
    toggle(false);
    button.addEventListener('click', () => toggle(button.dataset.open !== 'true'));
    button.addEventListener('pointerenter', () => toggle(true));
    button.addEventListener('pointerleave', () => toggle(false));
    button.addEventListener('focus', () => toggle(true));
    button.addEventListener('blur', () => toggle(false));
    button.addEventListener('keydown', event => { if (event.key === 'Escape') { event.stopPropagation(); toggle(false); } });
  });
  q('.join-form').addEventListener('submit', event => {
    event.preventDefault();
    const note = q('.signup-note');
    note.replaceChildren();
    const link = document.createElement('a');
    link.href = 'https://www.co-intelligence.online/#join';
    link.textContent = 'Continue on Co-Intelligence Circle to finish signing up.';
    note.append(link);
    link.focus();
  });
})();
