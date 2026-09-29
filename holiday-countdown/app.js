/**
 * Holiday Countdown Web Application
 * Target: 23 November 2026
 */

// --- Default Configuration & State ---
const STORAGE_KEYS = {
  SETTINGS: 'holiday_countdown_settings',
  PACKING: 'holiday_countdown_packing_v1',
  MILESTONES: 'holiday_countdown_milestones_v1',
  BUDGET: 'holiday_countdown_budget_v1',
  NOTES: 'holiday_countdown_notes_v1',
  THEME: 'holiday_countdown_theme_v1'
};

const DEFAULT_SETTINGS = {
  tripTitle: 'Holiday Countdown',
  destination: 'Tropical Getaway',
  departureDate: '2026-11-23',
  departureTime: '09:00',
  startDate: '2026-09-29',
  ambience: 'ocean'
};

const DEFAULT_PACKING_ITEMS = [
  { id: '1', name: 'Passport & Visa documentation', category: 'Documents', done: true },
  { id: '2', name: 'Flight tickets & Boarding passes', category: 'Documents', done: false },
  { id: '3', name: 'Hotel & Resort reservations', category: 'Documents', done: true },
  { id: '4', name: 'Travel insurance card / policy', category: 'Documents', done: false },
  { id: '5', name: 'Credit cards & foreign currency', category: 'Documents', done: false },
  { id: '6', name: 'Holiday outfits & swimwear', category: 'Clothing', done: false },
  { id: '7', name: 'Comfortable walking sneakers', category: 'Clothing', done: false },
  { id: '8', name: 'Sunglasses & sun hat', category: 'Clothing', done: true },
  { id: '9', name: 'Light jacket / evening layer', category: 'Clothing', done: false },
  { id: '10', name: 'Sunscreen SPF 50+ & Aloe', category: 'Toiletries', done: false },
  { id: '11', name: 'Toothbrush & travel toiletries', category: 'Toiletries', done: false },
  { id: '12', name: 'Personal medications & mini first aid', category: 'Toiletries', done: false },
  { id: '13', name: 'Phone charger & charging cable', category: 'Electronics', done: true },
  { id: '14', name: 'Universal international plug adapter', category: 'Electronics', done: false },
  { id: '15', name: 'High-capacity power bank', category: 'Electronics', done: false },
  { id: '16', name: 'Noise-cancelling travel headphones', category: 'Electronics', done: false },
  { id: '17', name: 'Reusable water bottle', category: 'Misc', done: false },
  { id: '18', name: 'Airplane memory foam neck pillow', category: 'Misc', done: false },
  { id: '19', name: 'Day backpack for excursions', category: 'Misc', done: false }
];

const DEFAULT_MILESTONES = [
  { id: 'm1', title: 'Verify passport validity (6+ months)', daysBefore: 60, targetDate: '2026-09-24', done: true },
  { id: 'm2', title: 'Book excursions & restaurant reservations', daysBefore: 45, targetDate: '2026-10-09', done: false },
  { id: 'm3', title: 'Confirm pet care & out-of-office dates', daysBefore: 30, targetDate: '2026-10-24', done: false },
  { id: 'm4', title: 'Exchange foreign currency & check baggage allowance', daysBefore: 14, targetDate: '2026-11-09', done: false },
  { id: 'm5', title: 'Begin packing suitcase & gather travel adapters', daysBefore: 7, targetDate: '2026-11-16', done: false },
  { id: 'm6', title: 'Online flight check-in & offline maps download', daysBefore: 1, targetDate: '2026-11-22', done: false },
  { id: 'm7', title: 'DEPARTURE DAY: Final check & head to airport!', daysBefore: 0, targetDate: '2026-11-23', done: false }
];

const TRAVEL_QUOTES = [
  '"The journey of a thousand miles begins with a single step." — Lao Tzu',
  '"To travel is to live." — Hans Christian Andersen',
  '"Adventure is worthwhile in itself." — Amelia Earhart',
  '"Traveling – it leaves you speechless, then turns you into a storyteller." — Ibn Battuta',
  '"Jobs fill your pocket, but adventures fill your soul." — Jaime Lyn Beatty',
  '"Collect moments, not things."'
];

// --- Application State ---
let settings = loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
let packingItems = loadFromStorage(STORAGE_KEYS.PACKING, DEFAULT_PACKING_ITEMS);
let milestones = loadFromStorage(STORAGE_KEYS.MILESTONES, DEFAULT_MILESTONES);
let budget = loadFromStorage(STORAGE_KEYS.BUDGET, { goal: 3500, saved: 1800 });
let notes = loadFromStorage(STORAGE_KEYS.NOTES, 'Flight details:\n- Departure: Nov 23, 2026 @ 09:00 AM\n\nBucket List:\n1. Relax on the beach with fresh coconut\n2. Sunset boat tour\n3. Local food market tasting tour');
let activeTheme = loadFromStorage(STORAGE_KEYS.THEME, 'tropical');

// --- Helper Functions ---
function loadFromStorage(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage:`, e);
  }
}

function formatTwoDigits(num) {
  return String(num).padStart(2, '0');
}

function formatThreeDigits(num) {
  return String(num).padStart(3, '0');
}

function getTargetTimestamp() {
  const [year, month, day] = settings.departureDate.split('-').map(Number);
  const [hours, minutes] = settings.departureTime.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0).getTime();
}

function getStartTimestamp() {
  const [year, month, day] = settings.startDate.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0).getTime();
}

function calculateWorkingDays(startDate, endDate) {
  let count = 0;
  let cur = new Date(startDate.getTime());
  while (cur < endDate) {
    const dayOfWeek = cur.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

// --- DOM Element References ---
const elUnitDays = document.getElementById('unit-days');
const elUnitHours = document.getElementById('unit-hours');
const elUnitMinutes = document.getElementById('unit-minutes');
const elUnitSeconds = document.getElementById('unit-seconds');
const elSubDays = document.getElementById('sub-days');
const elProgressFill = document.getElementById('progress-fill');
const elProgressPercentage = document.getElementById('progress-percentage-label');
const elProgressStartLabel = document.getElementById('progress-start-label');
const elProgressTargetLabel = document.getElementById('progress-target-label');
const elSleepsBadge = document.getElementById('sleeps-badge');
const elWorkdaysBadge = document.getElementById('workdays-badge');

const elStatTotalWeeks = document.getElementById('stat-total-weeks');
const elStatTotalHours = document.getElementById('stat-total-hours');
const elStatTotalMinutes = document.getElementById('stat-total-minutes');
const elStatTotalSeconds = document.getElementById('stat-total-seconds');

const elDisplayTitle = document.getElementById('display-title');
const elDestinationText = document.getElementById('destination-text');
const elDepartureBadge = document.getElementById('departure-badge');
const elRandomQuote = document.getElementById('random-quote');
const elCountdownStatus = document.getElementById('countdown-status-text');

const elThemeSelect = document.getElementById('theme-select');
const elAudioToggleBtn = document.getElementById('audio-toggle-btn');
const elAudioIcon = document.getElementById('audio-icon');

// Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Packing elements
const elPackingContainer = document.getElementById('packing-categories-container');
const elPackingCounter = document.getElementById('packing-badge-counter');
const elPackingPercentage = document.getElementById('packing-percentage');
const elAddPackingForm = document.getElementById('add-packing-form');
const elPackingCategoryInput = document.getElementById('packing-category-input');
const elPackingItemName = document.getElementById('packing-item-name');

// Milestones
const elMilestonesContainer = document.getElementById('milestones-timeline-container');
const elAddMilestoneBtn = document.getElementById('add-milestone-btn');

// Budget
const elBudgetGoalInput = document.getElementById('budget-goal-input');
const elBudgetSavedInput = document.getElementById('budget-saved-input');
const elBudgetRemaining = document.getElementById('budget-remaining');
const elBudgetWeeklyPace = document.getElementById('budget-weekly-pace');
const elBudgetProgressFill = document.getElementById('budget-progress-fill');
const elBudgetPercentText = document.getElementById('budget-percent-text');
const elBudgetWeeksText = document.getElementById('budget-weeks-remaining-text');

// Clocks & Notes
const elHomeClockTime = document.getElementById('home-clock-time');
const elHomeClockDate = document.getElementById('home-clock-date');
const elDestClockTime = document.getElementById('dest-clock-time');
const elDestClockDate = document.getElementById('dest-clock-date');
const elDestTimezoneSelect = document.getElementById('destination-timezone-select');
const elTripNotesArea = document.getElementById('trip-notes-area');
const elNotesSaveStatus = document.getElementById('notes-save-status');

// Actions
const elCelebrateBtn = document.getElementById('celebrate-preview-btn');
const elShareBtn = document.getElementById('share-countdown-btn');

// Dialog
const elSettingsDialog = document.getElementById('settings-dialog');
const elOpenSettingsBtn = document.getElementById('open-settings-btn');
const elCloseSettingsBtn = document.getElementById('close-settings-btn');
const elSettingsForm = document.getElementById('settings-form');
const elSettingTripTitle = document.getElementById('setting-trip-title');
const elSettingDestination = document.getElementById('setting-destination');
const elSettingDepartureDate = document.getElementById('setting-departure-date');
const elSettingDepartureTime = document.getElementById('setting-departure-time');
const elSettingStartDate = document.getElementById('setting-start-date');
const elSettingAmbience = document.getElementById('setting-ambience');
const elResetDefaultsBtn = document.getElementById('reset-defaults-btn');

// --- Countdown Engine ---
let hasCelebrated = false;

function updateCountdown() {
  const now = new Date();
  const nowMs = now.getTime();
  const targetMs = getTargetTimestamp();
  const startMs = getStartTimestamp();
  const diffMs = targetMs - nowMs;

  if (diffMs <= 0) {
    // Departure reached!
    elUnitDays.textContent = '000';
    elUnitHours.textContent = '00';
    elUnitMinutes.textContent = '00';
    elUnitSeconds.textContent = '00';
    elSubDays.textContent = 'Vacation Started!';
    elProgressFill.style.width = '100%';
    elProgressPercentage.textContent = '100% (Departed!)';
    elSleepsBadge.innerHTML = '🎉 <strong>Have an incredible holiday!</strong>';
    elWorkdaysBadge.innerHTML = '✈️ <strong>Bon Voyage!</strong>';
    elCountdownStatus.textContent = '🌴 Pack is unpacked! You are on holiday!';

    if (!hasCelebrated) {
      triggerConfetti();
      playCelebrationFanfare();
      hasCelebrated = true;
    }
    return;
  }

  // Calculate time components
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);

  const displayHours = totalHours % 24;
  const displayMinutes = totalMinutes % 60;
  const displaySeconds = totalSeconds % 60;

  // Render digits
  elUnitDays.textContent = formatThreeDigits(totalDays);
  elUnitHours.textContent = formatTwoDigits(displayHours);
  elUnitMinutes.textContent = formatTwoDigits(displayMinutes);
  elUnitSeconds.textContent = formatTwoDigits(displaySeconds);
  elSubDays.textContent = `${totalDays} full days`;

  // Quick stats strip
  elStatTotalWeeks.textContent = totalWeeks.toLocaleString();
  elStatTotalHours.textContent = totalHours.toLocaleString();
  elStatTotalMinutes.textContent = totalMinutes.toLocaleString();
  elStatTotalSeconds.textContent = totalSeconds.toLocaleString();

  // Progress Bar
  const totalSpan = targetMs - startMs;
  let elapsed = nowMs - startMs;
  let pct = 0;
  if (totalSpan > 0) {
    pct = Math.min(100, Math.max(0, (elapsed / totalSpan) * 100));
  }
  elProgressFill.style.width = `${pct.toFixed(1)}%`;
  elProgressPercentage.textContent = `${pct.toFixed(1)}% Elapsed`;

  // Sleeps and working days
  elSleepsBadge.innerHTML = `🛏️ Only <strong>${totalDays}</strong> sleeps left!`;
  const targetDateObj = new Date(targetMs);
  const workdays = calculateWorkingDays(now, targetDateObj);
  elWorkdaysBadge.innerHTML = `💼 <strong>${workdays}</strong> working days to wrap up`;

  // Update budget weekly pace
  updateBudgetCalculation(totalWeeks, totalDays);
}

// --- Budget Calculations ---
function updateBudgetCalculation(weeksLeft = 8, daysLeft = 55) {
  const goal = parseFloat(elBudgetGoalInput.value) || 0;
  const saved = parseFloat(elBudgetSavedInput.value) || 0;
  const remaining = Math.max(0, goal - saved);
  const percent = goal > 0 ? Math.min(100, (saved / goal) * 100) : 0;

  elBudgetRemaining.textContent = `$${remaining.toLocaleString()}`;
  elBudgetProgressFill.style.width = `${percent.toFixed(1)}%`;
  elBudgetPercentText.textContent = `${percent.toFixed(1)}% Saved ($${saved.toLocaleString()} of $${goal.toLocaleString()})`;

  const effectiveWeeks = Math.max(1, weeksLeft);
  const weeklyNeeded = remaining / effectiveWeeks;
  elBudgetWeeklyPace.textContent = remaining <= 0 
    ? '🎉 Fully funded! You hit your goal!' 
    : `~$${weeklyNeeded.toFixed(2)} / week needed`;
  elBudgetWeeksText.textContent = `${weeksLeft} weeks (${daysLeft} days) remaining`;

  // Save budget state
  budget.goal = goal;
  budget.saved = saved;
  saveToStorage(STORAGE_KEYS.BUDGET, budget);
}

// --- Packing List Manager ---
function renderPackingList() {
  elPackingContainer.innerHTML = '';

  // Group by category
  const categories = ['Documents', 'Clothing', 'Toiletries', 'Electronics', 'Misc'];
  const grouped = {};
  categories.forEach(c => (grouped[c] = []));

  packingItems.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  let totalItems = packingItems.length;
  let doneItems = packingItems.filter(i => i.done).length;

  categories.forEach(cat => {
    const items = grouped[cat] || [];
    if (items.length === 0) return;

    const catCard = document.createElement('div');
    catCard.className = 'packing-category-card';

    const catHeader = document.createElement('div');
    catHeader.className = 'category-card-header';
    const catDone = items.filter(i => i.done).length;
    catHeader.innerHTML = `
      <span class="category-name">${getCategoryEmoji(cat)} ${cat}</span>
      <span class="category-badge">${catDone}/${items.length} packed</span>
    `;
    catCard.appendChild(catHeader);

    const list = document.createElement('ul');
    list.className = 'packing-items-list';

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = `packing-item ${item.done ? 'completed' : ''}`;
      li.innerHTML = `
        <label class="item-left">
          <input type="checkbox" class="item-checkbox" ${item.done ? 'checked' : ''} data-id="${item.id}">
          <span class="item-title">${escapeHtml(item.name)}</span>
        </label>
        <button class="item-delete-btn" data-id="${item.id}" title="Remove item">✕</button>
      `;
      list.appendChild(li);
    });

    catCard.appendChild(list);
    elPackingContainer.appendChild(catCard);
  });

  // Update counters
  elPackingCounter.textContent = `${doneItems}/${totalItems}`;
  const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;
  elPackingPercentage.textContent = `${pct}%`;

  saveToStorage(STORAGE_KEYS.PACKING, packingItems);
}

function getCategoryEmoji(cat) {
  switch (cat) {
    case 'Documents': return '📄';
    case 'Clothing': return '👕';
    case 'Toiletries': return '🧴';
    case 'Electronics': return '🔌';
    case 'Misc': return '🎒';
    default: return '📦';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Add item handler
elAddPackingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = elPackingItemName.value.trim();
  const category = elPackingCategoryInput.value;
  if (!name) return;

  packingItems.push({
    id: Date.now().toString(),
    name,
    category,
    done: false
  });

  elPackingItemName.value = '';
  renderPackingList();
});

// Checkbox and delete delegations
elPackingContainer.addEventListener('change', (e) => {
  if (e.target.classList.contains('item-checkbox')) {
    const id = e.target.getAttribute('data-id');
    const item = packingItems.find(i => i.id === id);
    if (item) {
      item.done = e.target.checked;
      renderPackingList();
    }
  }
});

elPackingContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('item-delete-btn')) {
    const id = e.target.getAttribute('data-id');
    packingItems = packingItems.filter(i => i.id !== id);
    renderPackingList();
  }
});

// --- Pre-Trip Milestones ---
function renderMilestones() {
  elMilestonesContainer.innerHTML = '';
  milestones.sort((a, b) => b.daysBefore - a.daysBefore);

  milestones.forEach(m => {
    const div = document.createElement('div');
    div.className = `milestone-item ${m.done ? 'done' : ''}`;
    div.innerHTML = `
      <div class="milestone-marker"></div>
      <div class="milestone-info">
        <h4>${escapeHtml(m.title)}</h4>
        <p>Target Date: <strong>${m.targetDate}</strong> (${m.daysBefore === 0 ? 'Departure!' : `${m.daysBefore} days before`})</p>
      </div>
      <div>
        <button class="pill-btn ${m.done ? 'primary' : 'secondary'} milestone-toggle-btn" data-id="${m.id}" style="padding: 6px 14px; font-size: 0.8rem;">
          ${m.done ? '✓ Done' : 'Mark Done'}
        </button>
      </div>
    `;
    elMilestonesContainer.appendChild(div);
  });

  saveToStorage(STORAGE_KEYS.MILESTONES, milestones);
}

elMilestonesContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('.milestone-toggle-btn');
  if (btn) {
    const id = btn.getAttribute('data-id');
    const m = milestones.find(item => item.id === id);
    if (m) {
      m.done = !m.done;
      renderMilestones();
    }
  }
});

elAddMilestoneBtn.addEventListener('click', () => {
  const title = prompt('Enter checkpoint milestone title (e.g. "Buy foreign SIM card"):');
  if (!title) return;
  const days = prompt('How many days before departure should this be completed? (e.g. 10):', '10');
  const daysNum = parseInt(days, 10) || 7;

  const targetDateObj = new Date(getTargetTimestamp());
  targetDateObj.setDate(targetDateObj.getDate() - daysNum);
  const dateStr = targetDateObj.toISOString().split('T')[0];

  milestones.push({
    id: 'm_' + Date.now(),
    title,
    daysBefore: daysNum,
    targetDate: dateStr,
    done: false
  });
  renderMilestones();
});

// --- World Clocks & Notes ---
function updateClocks() {
  const now = new Date();

  // Local Clock
  elHomeClockTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  elHomeClockDate.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  // Destination Clock
  const destTz = elDestTimezoneSelect.value;
  try {
    const destTimeStr = now.toLocaleTimeString([], { timeZone: destTz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const destDateStr = now.toLocaleDateString([], { timeZone: destTz, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    elDestClockTime.textContent = destTimeStr;
    elDestClockDate.textContent = destDateStr;
  } catch (err) {
    elDestClockTime.textContent = '--:--:--';
  }
}

// Notes auto-save
elTripNotesArea.value = notes;
let notesDebounce = null;
elTripNotesArea.addEventListener('input', () => {
  elNotesSaveStatus.textContent = 'Saving...';
  clearTimeout(notesDebounce);
  notesDebounce = setTimeout(() => {
    notes = elTripNotesArea.value;
    saveToStorage(STORAGE_KEYS.NOTES, notes);
    elNotesSaveStatus.textContent = 'Auto-saved to browser';
  }, 500);
});

// --- Tabs Controller ---
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');

    tabButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanes.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const pane = document.getElementById(`pane-${targetTab}`);
    if (pane) pane.classList.add('active');
  });
});

// --- Settings Dialog & Form ---
function applySettings() {
  elDisplayTitle.textContent = settings.tripTitle;
  elDestinationText.textContent = settings.destination;
  elDepartureBadge.textContent = settings.departureDate;
  elProgressStartLabel.textContent = `Start: ${settings.startDate}`;
  elProgressTargetLabel.textContent = `Departure: ${settings.departureDate} @ ${settings.departureTime}`;

  // Form inputs
  elSettingTripTitle.value = settings.tripTitle;
  elSettingDestination.value = settings.destination;
  elSettingDepartureDate.value = settings.departureDate;
  elSettingDepartureTime.value = settings.departureTime;
  elSettingStartDate.value = settings.startDate;
  elSettingAmbience.value = settings.ambience;

  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  hasCelebrated = false;
  updateCountdown();
}

elOpenSettingsBtn.addEventListener('click', () => {
  elSettingsDialog.showModal();
});

elCloseSettingsBtn.addEventListener('click', () => {
  elSettingsDialog.close();
});

elSettingsDialog.addEventListener('click', (e) => {
  if (e.target === elSettingsDialog) {
    elSettingsDialog.close();
  }
});

elSettingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  settings.tripTitle = elSettingTripTitle.value.trim() || 'Holiday Countdown';
  settings.destination = elSettingDestination.value.trim() || 'Vacation';
  settings.departureDate = elSettingDepartureDate.value;
  settings.departureTime = elSettingDepartureTime.value || '00:00';
  settings.startDate = elSettingStartDate.value || '2026-09-29';
  settings.ambience = elSettingAmbience.value;

  applySettings();
  elSettingsDialog.close();
});

elResetDefaultsBtn.addEventListener('click', () => {
  if (confirm('Reset countdown settings back to default (23 Nov 2026)?')) {
    settings = { ...DEFAULT_SETTINGS };
    applySettings();
    elSettingsDialog.close();
  }
});

// --- Theme Selector ---
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  elThemeSelect.value = theme;
  activeTheme = theme;
  saveToStorage(STORAGE_KEYS.THEME, theme);
}

elThemeSelect.addEventListener('change', (e) => {
  applyTheme(e.target.value);
});

// --- Confetti Engine (HTML5 Canvas) ---
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiAnimationId = null;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 6;
    this.speedX = Math.random() * 8 - 4;
    this.speedY = Math.random() * -12 - 5;
    this.gravity = 0.28;
    this.rotation = Math.random() * 360;
    this.rotSpeed = Math.random() * 10 - 5;
    const colors = ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#f43f5e'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = 1;
    this.decay = Math.random() * 0.006 + 0.004;
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;
    this.opacity -= this.decay;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.rotation * Math.PI) / 180);
    context.globalAlpha = Math.max(0, this.opacity);
    context.fillStyle = this.color;
    context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    context.restore();
  }
}

function triggerConfetti() {
  confettiParticles = [];
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight * 0.65;

  for (let i = 0; i < 180; i++) {
    confettiParticles.push(new ConfettiParticle(startX + (Math.random() * 200 - 100), startY));
  }

  if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < confettiCanvas.height + 20);

  confettiParticles.forEach(p => {
    p.update();
    p.draw(ctx);
  });

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

elCelebrateBtn.addEventListener('click', () => {
  triggerConfetti();
  playCelebrationFanfare();
});

// --- Web Audio API (Ambient Sound & Chime Synthesis) ---
let audioCtx = null;
let ambientGainNode = null;
let isAudioPlaying = false;
let ambientNodes = [];

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playCelebrationFanfare() {
  initAudio();
  if (!audioCtx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);

    gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.12);
    gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + idx * 0.12 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + idx * 0.12);
    osc.stop(audioCtx.currentTime + idx * 0.12 + 0.65);
  });
}

function startAmbientSound() {
  initAudio();
  stopAmbientSound();

  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  // Pink/Brown noise generator
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.11;
    b6 = white * 0.115926;
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  // Filter for deep ocean waves or cabin air
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, audioCtx.currentTime);

  // LFO for wave swelling
  const lfo = audioCtx.createOscillator();
  lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // Wave period ~8 seconds
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.setValueAtTime(250, audioCtx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  ambientGainNode = audioCtx.createGain();
  ambientGainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
  ambientGainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 1.5);

  whiteNoise.connect(filter);
  filter.connect(ambientGainNode);
  ambientGainNode.connect(audioCtx.destination);

  whiteNoise.start();
  lfo.start();

  ambientNodes = [whiteNoise, lfo, filter, ambientGainNode];
  isAudioPlaying = true;
  elAudioIcon.textContent = '🔊';
  elAudioToggleBtn.classList.add('primary');
}

function stopAmbientSound() {
  if (ambientGainNode && audioCtx) {
    ambientGainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
  }
  setTimeout(() => {
    ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    ambientNodes = [];
    isAudioPlaying = false;
    elAudioIcon.textContent = '🔇';
    elAudioToggleBtn.classList.remove('primary');
  }, 500);
}

elAudioToggleBtn.addEventListener('click', () => {
  if (isAudioPlaying) {
    stopAmbientSound();
  } else {
    startAmbientSound();
  }
});

// --- Share Countdown ---
elShareBtn.addEventListener('click', async () => {
  const targetDateFormatted = '23 November 2026';
  const days = elUnitDays.textContent;
  const shareText = `🌴 Counting down to my holiday on ${targetDateFormatted}! Only ${days} days to go! ✈️`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: settings.tripTitle,
        text: shareText,
        url: window.location.href
      });
      return;
    } catch (err) {
      // Ignore user cancellation
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(shareText);
    const orig = elShareBtn.innerHTML;
    elShareBtn.innerHTML = '✓ Copied to Clipboard!';
    setTimeout(() => {
      elShareBtn.innerHTML = orig;
    }, 2500);
  } catch (e) {
    prompt('Copy your countdown status:', shareText);
  }
});

// --- Budget Listeners ---
elBudgetGoalInput.addEventListener('input', () => updateBudgetCalculation());
elBudgetSavedInput.addEventListener('input', () => updateBudgetCalculation());

// --- Clock Timezone Listener ---
elDestTimezoneSelect.addEventListener('change', updateClocks);

// --- Quote Rotation ---
let quoteIndex = 0;
function rotateQuote() {
  quoteIndex = (quoteIndex + 1) % TRAVEL_QUOTES.length;
  elRandomQuote.style.opacity = '0';
  setTimeout(() => {
    elRandomQuote.textContent = TRAVEL_QUOTES[quoteIndex];
    elRandomQuote.style.opacity = '1';
  }, 300);
}
setInterval(rotateQuote, 12000);

// --- Initialization ---
function initApp() {
  applyTheme(activeTheme);
  applySettings();
  renderPackingList();
  renderMilestones();
  updateCountdown();
  updateClocks();

  // Tickers
  setInterval(updateCountdown, 1000);
  setInterval(updateClocks, 1000);

  // Set initial budget
  elBudgetGoalInput.value = budget.goal || 3500;
  elBudgetSavedInput.value = budget.saved || 1800;
  updateBudgetCalculation();
}

window.addEventListener('DOMContentLoaded', initApp);
