class CountDownTimer extends HTMLElement {
  constructor() {
    super();
    this.interval = null;
  }

  connectedCallback() {
    this.countDownText = this.querySelector('.countdown-text');
    this.daysContainer = this.querySelector('.days');
    this.hoursContainer = this.querySelector('.hours');
    this.minutesContainer = this.querySelector('.minutes');
    this.secondsContainer = this.querySelector('.seconds');
    this.timerContainer = this.querySelector('.countdown-timer');

    if (!this.timerContainer) return;

    const endDateString = (this.timerContainer.dataset.endDate || '').trim();
    if (!endDateString) {
      if (this.countDownText) this.countDownText.innerHTML = 'Set end date in theme settings';
      return;
    }

    this.endDate = new Date(endDateString).getTime();
    if (isNaN(this.endDate)) {
      if (this.countDownText) this.countDownText.innerHTML = 'Invalid date — use format: May 25, 2026 16:37:52 EST';
      return;
    }

    this.interval = setInterval(this.handleTick.bind(this), 1000);
    this.handleTick();
  }

  handleTick() {
    const now = new Date().getTime();
    const timeleft = this.endDate - now;

    if (timeleft < 0) {
      if (this.countDownText) this.countDownText.innerHTML = 'This sale ended!';
      if (this.interval) clearInterval(this.interval);
      this.interval = null;
      return;
    }

    const msInDay = 1000 * 60 * 60 * 24;
    const msInHour = 1000 * 60 * 60;
    const msInMinute = 1000 * 60;

    const days = Math.floor(timeleft / msInDay);
    const hours = Math.floor((timeleft % msInDay) / msInHour);
    const minutes = Math.floor((timeleft % msInHour) / msInMinute);
    const seconds = Math.floor((timeleft % msInMinute) / 1000);

    if (this.daysContainer) this.daysContainer.innerHTML = days + 'd ';
    if (this.hoursContainer) this.hoursContainer.innerHTML = hours + 'h ';
    if (this.minutesContainer) this.minutesContainer.innerHTML = minutes + 'm ';
    if (this.secondsContainer) this.secondsContainer.innerHTML = seconds + 's ';
  }

  disconnectedCallback() {
    if (this.interval) clearInterval(this.interval);
  }
}

if (!customElements.get('countdown-timer')) {
  customElements.define('countdown-timer', CountDownTimer);
}