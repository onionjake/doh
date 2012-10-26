// domain_specs is set in domain_specs.js
DOH_UI.init(domain_specs);

self.port.on("requestPassword", function (host,tab_index,input_id,worker) {
    console.log("Panel sending password to add-on");
    console.log("worker " + worker);
    DOH_UI.setHost(host);
    console.log(DOH_UI.getSalt());
    console.log(DOH_UI.getSequence());
    console.log(DOH_UI.getHasher());
    console.log(DOH_UI.isSetMaster());
    self.port.emit("getPassword", host, tab_index, DOH_UI.getPassword(), input_id);
    });

// Load back in values from internal state
$(document).ready(function () {
    $("#DOHsalt").val(DOH_UI.getSalt());
    $("#DOHseq").val(DOH_UI.getSequence());
    if (DOH_UI.isSetMaster()) {
    $("#DOHmaster")[0].placeholder = "<unchanged>";
    }
    $("input:radio[name=hasher][value=" + DOH_UI.getHasher() + "]").attr('checked', true);
    });

function setInfo() {
  // Match top-level domain
  var h = $('input:radio[name=hasher]:checked').val();
  DOH_UI.setHasher(h);
  DOH_UI.setSalt($('#DOHsalt').val());
  DOH_UI.setSequence($('#DOHseq').val());
  DOH_UI.setMaster($('#DOHmaster').val());
};

