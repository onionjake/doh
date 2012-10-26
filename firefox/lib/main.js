const widgets = require("widget");
const tabs = require("tabs");
const self = require("self");
const utils = require("utils");

require("2.5.3-crypto-sha1-hmac-pbkdf2.js");
require("2.5.3-crypto-md5.js");
require("2.5.3-crypto-sha256.js");
require("doh.js");
require("insecure.js");
require("doh_ui.js");
require("domain_specs.js");

var imports = {};
utils.import("blahh blah", imports);


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
    console.log("Add-on requesting from panel");
    master_panel.port.emit("requestPassword",parse_hostname(tab.url),tab.index,id);
  });
});

master_panel.port.on("getPassword", function(host,tab_index,pwd,input_id) {
  console.log("add-on send password to tab");
  console.log("tab index " + tab_index);
  var mytab = tabs[tab_index];
  // Make sure the tabs didn't flip around on us
  if (parse_hostname(mytab.url) == host) {
    var worker = find_worker(mytab);
    if (worker != null) {
      worker.port.emit("getPassword", input_id, pwd);
    }
    else {
      console.error("Couldn't find worker thread. On " + host);
    }
  } // TODO: write error message on else
  else {
    console.error("Couldn't find tab " + host);
  }
});

console.log("The add-on is running.");
