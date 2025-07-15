chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('openUrlAlarm-')) {
    const index = parseInt(alarm.name.split('-')[1]);
    chrome.storage.sync.get(['schedules'], (result) => {
      if (result.schedules && result.schedules[index] && result.schedules[index].url) {
        chrome.tabs.create({ url: result.schedules[index].url });
      }
    });
  }
});