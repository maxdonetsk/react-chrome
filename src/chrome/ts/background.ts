chrome.runtime.onInstalled.addListener(function (details) {
  chrome.browserAction.setPopup({
    popup: '',
  });

  chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(Number(tab.id), {
      action: 'toggle-show-iframe',
    });
  });

  chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
      case 'show-iframe':
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
          chrome.tabs.sendMessage(Number(tabs[0].id), {
            action: command,
          });
        });
        break;

      default:
        break;
    }
  });
});

export default {};
