// Copyright (c) 2012 Jake Willoughby
// 
// This file is part of DOH.
// 
// DOH is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// 
// DOH is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with DOH.  See gpl3.txt. If not, see <http://www.gnu.org/licenses/>.
//

$(document).on('click', 'div.doh_fill', function() { 
  var pwd = $(this).prev('input');
  var text = $(this);
  text.text('');
  var opts = {
    lines: 7, // The number of lines to draw
    length: 1, // The length of each line
    width: 3, // The line thickness
    radius: 2, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    color: '#000', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 64, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '1', // Top position relative to parent in px
    left: '30' // Left position relative to parent in px
  };
  var spinner = new Spinner(opts).spin();
  text.next().append(spinner.el);
  text.next().position({
    my:  "left",
    at:  "right top",
    of:  pwd,
    offset: "-10 10",
    collision: "none"
  });
  if ($.browser.webkit) {
    // Chrome/chromium
    chrome.extension.sendRequest({"command": "getPassword"}, function(response) {
      pwd.val(response.password);
      spinner.stop();
      text.text('Done!');
    });
  }
  else {
    // Firefox
    console.log("Message to add-on");
    self.port.emit("requestPassword", pwd.attr("id"));
  }
});
if (!$.browser.webkit) {
  console.log("Setup-firefox");
  self.port.on("getPassword", function(id,password) {
    console.log("Message from add-on");
    $('#'+id).val(password);
  });
}

function add_doh_wrap () {
  add_doh_text($(this), 1.0);
}

var doh_i = 0;
function add_doh_text (pwd_input,fade) {
  pwd_input.after("<div id='doh_text" + doh_i + "' " + " class='doh_fill'>DOH it!</div><div class='doh_spinner" + doh_i + "'></div>");
  var doh_text = $('#doh_text' + doh_i );
  doh_text.css({
    display: "inline",
    opacity: fade,
    cursor:  'pointer' ,
    font:    'bold 1em sans-serif',
    color:   '#38468F'  
  }).hover( function () {
    $(this).css({
      color: '#f52'
    });
  }, function() {
    $(this).css({
      color:   '#38468F'  
    });
  });
  doh_text.position({
    my:  "right top",
    at:  "right top",
    of:  pwd_input,
    offset: "-3 3",
    collision: "none"
  });
  doh_i = doh_i + 1;
} 
$("input[type=password]").each(add_doh_wrap);
$(document).on('mouseover focus', 'input[type=password]', function () {
  if ($(this).next().attr('class') != "doh_fill") {
    add_doh_text($(this), 0.0);
    $(this).next().stop().fadeTo(300,1);
  }
});
