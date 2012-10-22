const widgets = require("widget");
const tabs = require("tabs");
const self = require("self");

function parse_hostname (url) {
  var host = url.match(/^[A-Za-z]+:\/\/([-A-Za-z0-9]+\.)*([-A-Za-z0-9]*\.[-A-Za-z0-9]+)/);
  if (!(2 in host)) {
    console.log("Error parsing url");
    return null;
  }
  return host[2];
}

var master_panel = require("panel").Panel({
  contentURL: self.data.url("popup.html"),
  contentScriptFile: [self.data.url("2.5.3-crypto-sha1-hmac-pbkdf2.js"),
                      self.data.url("2.5.3-crypto-md5.js"),
                      self.data.url("2.5.3-crypto-sha256.js"),
                      self.data.url("jquery-1.8.2.js"),
                      self.data.url("doh.js"),
                      self.data.url("insecure.js"),
                      self.data.url("doh_ui.js"),
                      self.data.url("domain_specs.js"),
                      self.data.url("popup.js")]
});

var widget = widgets.Widget({
  id: "doh",
  label: "DOH password generator",
  contentURL: self.data.url("doh-19.png"),
  panel: master_panel
});
tabs.on("ready",function (tab) {
  var worker = tab.attach({
    contentScriptWhen: "end",
    contentScriptFile: [self.data.url("jquery-1.8.2.js"),
      self.data.url("jquery-ui-1.9.0.custom.js"), 
      self.data.url("spin.min.js"),
      self.data.url("content.js")]
  });
  worker.port.on("requestPassword", function (id) {
    // Ask the DOH_UI that lives in the popup.
    console.log("Add-on requesting from panel");
    master_panel.port.emit("requestPassword",parse_hostname(tab.url),tab.index,id);
  });
});

master_panel.port.on("getPassword", function(host,tab_index,pwd,input_id) {
  console.log("add-on send password to tab");
  var mytab = tabs[tab_index];
  // Make sure the tabs didn't flip around on us
  if (parse_hostname(mytab.url) == host) {
    mytab.port.emit("getPassword", input_id, pwd);
  } // TODO: write error message on else
});

console.log("The add-on is running.");
