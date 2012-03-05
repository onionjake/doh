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

var fields = $("input[type=password]");
if (fields.size() > 0) {
  // Ask background page for password
  chrome.extension.sendRequest({"command": "getPassword"}, function(response) {
    fields.each(function(i,e) {
      $(e).val(response.password);
    });
  });
}
