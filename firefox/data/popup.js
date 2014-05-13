$('#DOHmaster').keyup(setInfo);

function getInfo () {
  console.log("requesting info");
  self.port.emit("getInfo");
}

self.port.on("getInfo", function (info) {
    $("#DOHsalt").val(info.salt);
    });


// Load back in values from internal state
$(document).ready(function () {
  getInfo();
//    $("#DOHseq").val(getSequence());
//    if (isSetMaster()) {
//    $("#DOHmaster")[0].placeholder = "<unchanged>";
//    }
//    $("input:radio[name=hasher][value=" + getHasher() + "]").attr('checked', true);
    });

function setInfo() {
  console.log("setInfo");
  // Match top-level domain
  var h = $('input:radio[name=hasher]:checked').val();
  var s = $('#DOHsalt').val();
  var seq = $('#DOHseq').val();
  var m = $('#DOHmaster').val();

  self.port.emit("setInfo", {
    hasher: h,
    salt: s,
    sequence: seq,
    master: m
    });

};
