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
  onClick: function () {
    tabs.activeTab.attach({
      contentScriptWhen: "end",
      contentScriptFile: [self.data.url("jquery-1.8.2.js"),
        self.data.url("jquery-ui-1.9.0.custom.js"), 
        self.data.url("spin.min.js"),
        self.data.url("content.js")]
    });
  },
  panel: master_panel
});

master_panel.on("show", function() {
  master_panel.port.emit("show");
});


console.log("The add-on is running.");
