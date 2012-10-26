const widgets = require("widget");
const tabs = require("tabs");
const self = require("self");

var DOH_UI = require("doh_ui");
var domain_specs = require("domain_specs").domain_specs;
//require("2.5.3-crypto-sha1-hmac-pbkdf2.js");
//require("2.5.3-crypto-md5.js");
//require("2.5.3-crypto-sha256.js");
//require("insecure.js");
//require("doh_ui.js");
//require("domain_specs.js");

DOH_UI.init(domain_specs);

var workers = [];
function find_worker (tab) {
  for (var i = 0; i < workers.length; i++) {
    if (workers[i].tab == tabs.activeTab) {
      return workers[i];
    }
  }
  return null;
}

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
  contentScriptFile: [self.data.url("jquery-1.8.2.js"),
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
  workers.push(worker);
  worker.on("detach", function () {
    var index = workers.indexOf(worker);
    if (index >= 0) {
      workers.splice(index,1);
    }
  });
  worker.port.on("requestPassword", function (id) {
    // Ask the DOH_UI that lives in the popup.
    console.log("Worker requested password");
    // TODO: make sure a tab cannot fake out this regex
    var host = tab.url.match(/^[A-Za-z]+:\/\/([-A-Za-z0-9]+\.)*([-A-Za-z0-9]*\.[-A-Za-z0-9]+)/);
    if (!(2 in host)) {
      console.error("DOH: Could not determine Hostname");
    }
    else {
      console.log("Sending back password");
      DOH_UI.setHost(host[2]);
      worker.port.emit("getPassword", id, DOH_UI.getPassword());
    }
  });
});

master_panel.port.on("getInfo", function() {
    console.log("sending info");
    master_panel.port.emit("getInfo", {
      salt: DOH_UI.getSalt()
      });
    });
master_panel.port.on("setInfo", function(info) {
    console.log("setting info");
    DOH_UI.setSalt(info.salt);
    });

console.log("The add-on is running.");
