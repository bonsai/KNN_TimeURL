document.addEventListener('DOMContentLoaded', () => {
  const entriesContainer = document.getElementById('entries');
  const saveButton = document.getElementById('save');

  // Create 10 input fields
  for (let i = 0; i < 10; i++) {
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.innerHTML = `
      <label for="url-${i}">URL ${i + 1}:</label>
      <input type="url" id="url-${i}" placeholder="https://example.com">
      <label for="time-${i}">Time ${i + 1}:</label>
      <input type="time" id="time-${i}">
    `;
    entriesContainer.appendChild(entry);
  }

  // Load saved settings
  chrome.storage.sync.get(['schedules'], (result) => {
    if (result.schedules) {
      result.schedules.forEach((schedule, i) => {
        if (schedule.url) document.getElementById(`url-${i}`).value = schedule.url;
        if (schedule.time) document.getElementById(`time-${i}`).value = schedule.time;
      });
    }
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const schedules = [];
    for (let i = 0; i < 10; i++) {
      const url = document.getElementById(`url-${i}`).value;
      const time = document.getElementById(`time-${i}`).value;
      if (url && time) {
        schedules.push({ url, time });
      } else {
        schedules.push({ url: '', time: ''});
      }
    }

    chrome.storage.sync.set({ schedules }, () => {
      console.log('Schedules saved.');
      chrome.alarms.clearAll(() => {
        schedules.forEach((schedule, i) => {
          if (schedule.url && schedule.time) {
            const [hours, minutes] = schedule.time.split(':');
            const now = new Date();
            const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

            if (alarmTime < now) {
              alarmTime.setDate(alarmTime.getDate() + 1);
            }
            
            chrome.alarms.create(`openUrlAlarm-${i}`, {
              when: alarmTime.getTime(),
              periodInMinutes: 1440
            });
          }
        });
        window.close();
      });
    });
  });
});