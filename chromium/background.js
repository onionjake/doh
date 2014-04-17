
DOH_UI.init();

function onRequest(request, sender, sendResponse) {
  // Data in request may be malicious, so beware.
  var rsp = {};
  switch (request.command) {
    case "getPassword":
      // This is assuming a remote site can NEVER arbitrarily change the top-level 
      // domain in sender.tab.url otherwise passwords for other sites could be requested.

      // Match top-level domain
      var host = sender.tab.url.match(/^[A-Za-z]+:\/\/([-A-Za-z0-9]+\.)*([-A-Za-z0-9]*\.[-A-Za-z0-9]+)/);
      if (!(2 in host)) {
        sendResponse({"error": "invalid command"});
      }
      else {
        DOH_UI.setHost(host[2]);
        rsp.password = DOH_UI.getPassword();
        sendResponse(rsp);
      }

      break;
    default:
      sendResponse({"error": "invalid command"});
      break;
  }
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
