let countdownInterval;

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (!startBtn || !resetBtn) {
    console.error("Buttons not found in DOM");
    return;
  }

  startBtn.addEventListener("click", () => startCountdown());
  resetBtn.addEventListener("click", resetCountdown);

  const savedStart = localStorage.getItem("startTime");
  if (savedStart) {
    startCountdown(savedStart);
  }
});

function startCountdown(timeValue = null) {
  clearInterval(countdownInterval);

  const input = timeValue || document.getElementById("startTime").value;
  const note = document.getElementById("note");

  if (!input) {
    alert("Please enter a valid start time.");
    return;
  }

  localStorage.setItem("startTime", input);

  const [hours, minutes] = input.split(":").map(Number);
  const startTime = new Date();
  startTime.setHours(hours, minutes, 0, 0);

  const targetTime = new Date(startTime.getTime() + 9 * 60 * 60 * 1000);

  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const timeDiff = currentTime - targetTime;

    // AFTER 9 HOURS (OVERTIME)
    if (timeDiff >= 0) {
      const extraHrs = Math.floor(timeDiff / (1000 * 60 * 60));
      const extraMins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const extraSecs = Math.floor((timeDiff % (1000 * 60)) / 1000);

      displayTime(extraHrs, extraMins, extraSecs);

      document.querySelector(".countdown").classList.add("overtime");
      document.querySelector(".countdown").classList.remove("warning");
      note.textContent = `⚠️ Overtime running since ${formatTime(targetTime)}`;
      return;
    }

    // BEFORE COMPLETION
    const timeLeft = targetTime - currentTime;
    const hrs = Math.floor(timeLeft / (1000 * 60 * 60));
    const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

    displayTime(hrs, mins, secs);
    note.textContent = `⏰ Ends at: ${formatTime(targetTime)}`;

    const countdownEl = document.querySelector(".countdown");

    // Blink when less than 60 seconds remain
    if (timeLeft <= 60 * 1000) {
      countdownEl.classList.add("warning");
    } else {
      countdownEl.classList.remove("warning");
    }
  }, 1000);
}

function resetCountdown() {
  clearInterval(countdownInterval);
  localStorage.removeItem("startTime");
  document.getElementById("startTime").value = "";
  displayTime("--", "--", "--");
  document.getElementById("note").textContent = "";
  document.querySelector(".countdown").classList.remove("overtime", "warning");
}

function displayTime(hrs, mins, secs) {
  document.getElementById("hours").textContent = padZero(hrs);
  document.getElementById("minutes").textContent = padZero(mins);
  document.getElementById("seconds").textContent = padZero(secs);
}

function padZero(num) {
  return num.toString().padStart(2, "0");
}

function formatTime(date) {
  return date.toTimeString().split(" ")[0].slice(0, 5);
}
