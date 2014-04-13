var bg = chrome.extension.getBackgroundPage();

// Load back in values from background page
$(document).ready(function () {
  $("#DOHsalt").val(bg.DOH_UI.getSalt());
  $("#DOHseq").val(bg.DOH_UI.getSequence());
  if (bg.DOH_UI.isSetMaster()) {
    $("#DOHmaster")[0].placeholder = "<unchanged>";
  }
  $("input:radio[name=hasher][value=" + bg.DOH_UI.getHasher() + "]").attr('checked', true);
});

function setInfo() {
  // Match top-level domain
  var h = $('input:radio[name=hasher]:checked').val();
  bg.DOH_UI.setHasher(h);
  bg.DOH_UI.setSalt($('#DOHsalt').val());
  bg.DOH_UI.setSequence($('#DOHseq').val());
  bg.DOH_UI.setMaster($('#DOHmaster').val());
};

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("DOHmaster").addEventListener('keyup',setInfo);
  document.getElementById("DOHsalt").addEventListener('keyup',setInfo);
  document.getElementById("DOHseq").addEventListener('keyup',setInfo);
  document.getElementById("DOHsha1").addEventListener('change',setInfo);
  document.getElementById("DOHsha256").addEventListener('change',setInfo);
  document.getElementById("INSECUREmd5hash").addEventListener('change',setInfo);
  document.getElementById("INSECUREangel").addEventListener('change',setInfo);
});
