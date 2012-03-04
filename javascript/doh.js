
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




// loadScript function thanks to http://stackoverflow.com/questions/950087/include-javascript-file-inside-javascript-file
function loadScript(url, callback)
{
   // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}


var lower   = "abcdefghijklmnopqrstuvwxyz";
var upper   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var num     = "0123456789";
var special = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

function char_set(use,exclude) {
  var use_vals = use.split(',').sort();
  var even_split = Math.floor(64/use_vals.length);
  var left = 64;
  var pos  = 0;
  var final_set = "";
  var size = 0;
  
  for (var i=0; i<use_vals.length; i++) {
    switch (use_vals[i]) {
      case "c":
        size = even_split;
        if (size > upper.length) {
          size = upper.length;
        }
        final_set += upper.substring(0,size);
        left -= size;
        break;
      case "l":
        size = even_split;
        if (size > lower.length) {
          size = lower.length;
        }
        final_set += lower.substring(0,size);
        left -= size;
        break;
      case "n":
        size = even_split;
        if (size > num.length) {
          size = num.length;
        }
        final_set += num.substring(0,size);
        left -= size;
        break;
      case "x":
        size = left;
        if (size > special.length) {
          size = special.length;
        }
        final_set += special.substring(0,size);
        left -= size;
        break;
      default:
        alert("Bad use string " + use);
    }
  }
  return final_set;
}

function trans_chars(str,from,to) {
  var translate_re = new RegExp ("[" + from + "]", 'g');
  return (str.replace(translate_re, function(match) {
    return to.substr(translate_re.source.indexOf(match)-1,1); })
  );
}

function gen_password(password,len) {
    len=Math.ceil(len*6/8); 
    var foo =  Crypto.PBKDF2(password,"salt",len, {iterations: 2000, 
            asBytes: true,
            hasher: Crypto.SHA512});
    foo =  Crypto.util.bytesToBase64(foo);
    var set = char_set("x,l,n,c"," ");
    var result = trans_chars(foo,upper+lower+num+"+/", set);
    return result;
}

function afterLoad() {

  // Done Loading reqs!

}

loadScript("http://crypto-js.googlecode.com/files/2.5.3-crypto-sha1-hmac-pbkdf2.js", afterLoad);
