const widgets = require("widget");
const tabs = require("tabs");
const self = require("self");

var master_panel = require("panel").Panel({
  contentURL: self.data.url("popup.html")
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
    var host = tab.url.match(/^[A-Za-z]+:\/\/([-A-Za-z0-9]+\.)*([-A-Za-z0-9]*\.[-A-Za-z0-9]+)/);
    if (!(2 in host)) {
      console.log("Error parsing url");
    }
    else {
      // Ask the DOH_UI that lives in the popup.
      console.log("Add-on requesting from panel");
      master_panel.port.emit("requestPassword",host[2],id);
    }
  });
});

master_panel.port.on("getPassword", function(pwd,id) {
  console.log("add-on send password to tab");
  tab.port.emit("getPassword", id, pwd);
});

console.log("The add-on is running.");
