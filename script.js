
const stopwatchDisplay = document.getElementById('stopwatch-display');
const unitSwitch = document.getElementById('unit-switch');
const resetBtn = document.getElementById('reset-btn');
const appEl = document.querySelector('.app');

const distanceButtons = document.querySelectorAll('.distance-btn');
const resultRows = document.querySelectorAll('.result-row');


let isRunning = false;
let activeMeters = null;
let startTime = null;
let timerInterval = null;

let currentUnit = 'meter';


const METERS_TO_YARDS = 1;


function formatTime(ms) {
  const totalCentiseconds = Math.floor(ms / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  const pad = (num, len = 2) => String(num).padStart(len, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}


function startTimerLoop() {
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    stopwatchDisplay.textContent = formatTime(elapsed);
  }, 10);
}

function stopTimerLoop() {
  clearInterval(timerInterval);
  timerInterval = null;
}


function handleDistanceClick(button) {
  const meters = button.dataset.meters;

  if (!isRunning) {
    startRun(meters, button);
  } else if (activeMeters === meters) {
    stopRun();
  } else {
    stopRun();
    startRun(meters, button);
  }
}

function startRun(meters, button) {
  isRunning = true;
  activeMeters = meters;
  startTime = Date.now();

  distanceButtons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  startTimerLoop();
}

function stopRun() {
  const elapsed = Date.now() - startTime;
  stopTimerLoop();

  recordResult(activeMeters, elapsed);

  const activeBtn = document.querySelector(`.distance-btn[data-meters="${activeMeters}"]`);
  if (activeBtn) activeBtn.classList.remove('active');

  isRunning = false;
  activeMeters = null;
  startTime = null;
}

function recordResult(meters, elapsedMs) {
  const row = document.querySelector(`.result-row[data-meters="${meters}"]`);
  if (!row) return;

  const timeEl = row.querySelector('.result-time');
  timeEl.textContent = formatTime(elapsedMs);
  timeEl.dataset.recorded = 'true';
}


function metersToYards(meters) {
  return Math.round(meters * METERS_TO_YARDS);
}

function formatDistanceNumber(num) {
  return num >= 1000
    ? num.toLocaleString('de-DE')
    : String(num);
}

function updateDistanceLabels() {
  distanceButtons.forEach(button => {
    const meters = Number(button.dataset.meters);
    const displayValue = currentUnit === 'meter' ? meters : metersToYards(meters);
    button.textContent = formatDistanceNumber(displayValue);
  });

  resultRows.forEach(row => {
  const meters = Number(row.dataset.meters);
  const displayValue = currentUnit === 'meter' ? meters : metersToYards(meters);
  const label = row.querySelector('.result-label');
  label.innerHTML = `<span class="calc-icon"><i class="fa-solid fa-calculator"></i></span>Avg ${formatDistanceNumber(displayValue)}`;
});
}

function handleUnitToggle() {
   currentUnit = currentUnit === 'meter' ? 'yard' : 'meter';
   unitSwitch.dataset.unit = currentUnit;
   unitSwitch.setAttribute('aria-pressed', currentUnit === 'yard');

   appEl.dataset.unit = currentUnit;

  updateDistanceLabels();
}


distanceButtons.forEach(button => {
  button.addEventListener('click', () => handleDistanceClick(button));
});

unitSwitch.addEventListener('click', handleUnitToggle);


updateDistanceLabels();