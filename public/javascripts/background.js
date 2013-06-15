chrome.app.runtime.onLaunched.addListener(function() {
  var theWindow = chrome.app.window.create('window.html', {
    //state: 'fullscreen'
    //state: 'maximized'
  });
});
