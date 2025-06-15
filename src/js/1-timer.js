import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('button[data-start]');
  const dataDays = document.querySelector('span[data-days]');
  const dataHours = document.querySelector('span[data-hours]');
  const dataMinutes = document.querySelector('span[data-minutes]');
  const dataSeconds = document.querySelector('span[data-seconds]');
  const dateInput = document.querySelector('#datetime-picker');

  let countdownInterval = null;
  let selectedFutureDate = null;

  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      selectedFutureDate = selectedDates[0];
      checkSelectedDate();
    },
  };

  flatpickr('#datetime-picker', options);
  startBtn.disabled = true;

  function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  startBtn.addEventListener('click', onStartBtnClick);

  function onStartBtnClick() {
    if (!selectedFutureDate || selectedFutureDate.getTime() <= Date.now()) {
      iziToast.error({
        title: 'Помилка',
        message: 'Будь ласка, оберіть майбутню дату та час!',
        position: 'topRight',
      });
      return;
    }

    dateInput.disabled = true;
    startBtn.disabled = true;

    startCountdown(selectedFutureDate.getTime());
  }

  function checkSelectedDate() {
    const currentTime = Date.now();
    if (selectedFutureDate && selectedFutureDate.getTime() <= currentTime) {
      iziToast.error({
        title: 'Помилка',
        message: 'Будь ласка, оберіть дату та час у майбутньому!',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  }

  function startCountdown(targetDateMs) {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
      const deltaMs = targetDateMs - Date.now();

      if (deltaMs <= 0) {
        clearInterval(countdownInterval);
        updateClockFace({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        });
        iziToast.success({
          title: 'Готово',
          message: 'Відлік часу завершено!',
          position: 'topRight',
        });
        dateInput.disabled = false;
        startBtn.disabled = true;
        return;
      }

      const timeRemaining = convertMs(deltaMs);
      updateClockFace(timeRemaining);
    }, 1000);
  }

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = addLeadingZero(Math.floor(ms / day));
    const hours = addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
    const seconds = addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  function updateClockFace({ days, hours, minutes, seconds }) {
    dataDays.textContent = days;
    dataHours.textContent = hours;
    dataMinutes.textContent = minutes;
    dataSeconds.textContent = seconds;
  }

  checkSelectedDate();
});
