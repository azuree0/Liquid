class CountDownTimer extends HTMLElement {
  constructor() {
    super();

    console.log("CountdownTimer created");
    // Grab required elements
    this.countDownText = this.querySelector('.countdown-text');
    this.daysContainer = this.querySelector('.days');
    this.hoursContainer = this.querySelector('.hours');
    this.minutesContainer = this.querySelector('.minutes');
    this.secondsContainer = this.querySelector('.seconds');

    console.log("Elements", {
      countDownText: this.countDownText, 
      daysContainer: this.daysContainer,
      hoursContainer: this.hoursContainer,
      minutesContainer: this.minutesContainer,
      secondsContainer: this.secondsContainer,
    });

    // Set Date
    this.timerContainer = this.querySelector(".countdown-timer");
    this.endDateString = this.timerContainer.dataset.endDate;
    this.endDate = new Date(this.endDateString).getTime();

    // Start timer using a bound function to preserve "this"
    this.interval = setInterval(this.handleTick.bind(this), 1000);
  }

  handleTick() {
    // Logic and update elements
    const now = new Date().getTime();
    const timeleft = this.endDate - now;

    if (timeleft < 0) {
      this.countDownText.innerHTML = 'This sale ended!';
      clearInterval(this.interval);
      return;
    }

    const msInDay = 1000 * 60 * 60 * 24;
    const msInHour = 1000 * 60 * 60;
    const msInMinute = 1000 * 60;

    const days = Math.floor(timeleft / msInDay);
    const hours = Math.floor((timeleft % msInDay) / msInHour);
    const minutes = Math.floor((timeleft % msInHour) / msInMinute);
    const seconds = Math.floor((timeleft % msInMinute) / 1000);

    this.daysContainer.innerHTML = days + 'd ';
    this.hoursContainer.innerHTML = hours + 'h ';
    this.minutesContainer.innerHTML = minutes + 'm ';
    this.secondsContainer.innerHTML = seconds + 's';
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }
}

customElements.define("countdown-timer", CountDownTimer);