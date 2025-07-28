const startBtn = document.querySelector('.start');
const pauseBtn = document.querySelector('.pause');
const resetBtn = document.querySelector('.reset');
const timerDisplay = document.getElementById('timer');
const sessionType = document.getElementById('session-type');
const completedSpan = document.getElementById('completed');

// === Session Durations in seconds ===
const DURATIONS = {
  Pomodoro: 600,       // 10 minutes
  'Short Break': 300,  // 5 minutes
  'Long Break': 900    // 15 minutes
};

let interval;
let session = 'Pomodoro';
let seconds = DURATIONS[session];
let pomodoroCount = parseInt(localStorage.getItem('pomodoros')) || 0;
let isRunning = false;

completedSpan.textContent = pomodoroCount;
sessionType.textContent = session;

function updateDisplay() {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${m}:${s}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  interval = setInterval(() => {
    seconds--;
    updateDisplay();

    if (seconds <= 0) {
      clearInterval(interval);
      isRunning = false;

      notify(`${session} done!`);

      if (session === 'Pomodoro') {
        pomodoroCount++;
        localStorage.setItem('pomodoros', pomodoroCount);
        completedSpan.textContent = pomodoroCount;
        session = (pomodoroCount % 4 === 0) ? 'Long Break' : 'Short Break';
      } else {
        session = 'Pomodoro';
      }

      seconds = DURATIONS[session];
      sessionType.textContent = session;
      updateDisplay();
      startTimer(); // auto-start next session
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  session = 'Pomodoro';
  seconds = DURATIONS[session];
  sessionType.textContent = session;
  updateDisplay();
}

function notify(msg) {
  if (Notification.permission === 'granted') {
    new Notification('Pomodoro Timer', { body: msg });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay(); // Initialize timer display
