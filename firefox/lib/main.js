const widgets = require("widget");
const tabs = require("tabs");
const self = require("self");

var widget = widgets.Widget({
  id: "doh",
  label: "DOH password generator",
  contentURL: self.data.url("doh-19.png"),
  panel: entry
});

var entry = require("panel").Panel({
  contentURL: self.data.url("popup.html")
});

entry.on("show", function() {
  entry.port.emit("show");
});


console.log("The add-on is running.");
