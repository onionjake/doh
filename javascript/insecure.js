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

var INSECURE = new function() {
  this.md5hash = function(opts) {
    //Original algorithm:
    //#!/bin/bash
    //salt=`echo -n $1 | base64 | md5sum | cut -c 1-8`
    //salthash=`openssl passwd -1 -salt $salt`
    //echo ${salthash:12}
    // Openssl implementation from:
    //http://www.freebsd.org/cgi/cvsweb.cgi/~checkout~/src/lib/libcrypt/crypt.c?rev=1.2
    var salt = Crypto.MD5(btoa(opts['domain']) + '\n').substring(0,8);
    var len = opts['password'].length;
    if (len > 16) {
      len = 16;
    }
    var tmp = Crypto.MD5(opts['password'] + opts['salt'] + opts['password'], {asBytes:true});
    var str = opts['password'] + "$1$" + opts['salt'] + tmp.slice(0,len);

    var i = opts['password'].length;
    while (i) {
      if (i&1) {
        str += tmp.slice(0,1);
      }
      else {
        str += opts['password'].substring(0,1);
      }
      i = i >> 1;
    }
    var last = Crypto.MD5(str, {asBytes:true});

    for (i=0;i<1000;i++) {
      var next = "";
      if (i&1) {
        next += opts['password'];
      }
      else {
        next += last.slice(0,16);
      }
      if (i % 3) {
        next += opts['salt'];
      }
      if (i % 7) {
        next += opts['password'];
      }
      if (i & 1) {
        next += last;
      }
      else {
        next += opts['password'];
      }
      last = Crypto.MD5(next, {asBytes:true});
    }
//    return Crypto.util.bytesToBase64(last);
    return salt;
  };
};
