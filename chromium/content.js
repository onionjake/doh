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

var FillKey = 90; // alt + z
window.addEventListener('keyup',keyboardNavigation, false);

$(document).on('click', 'span.doh_fill' function() { 
    $(this).prev('input').val('foo foo');
    });
function keyboardNavigation(e) {
  switch(e.which) {
    case FillKey:
      if (e.altKey) {
        var fields = $("input[type=password]");
        fields.before('<span class="doh_field">').after("<span class='doh_fill'>DOH it!</span></span>");
        if (fields.size() > 0) {
          // Ask background page for password
          chrome.extension.sendRequest({"command": "getPassword"}, function(response) {
            fields.each(function(i,e) {
              $(e).val(response.password);
            });
          });
        }
      }
      break;
  }
}

