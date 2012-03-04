#!/usr/bin/env ruby

# Copyright (c) 2012 Jake Willoughby
# 
# This file is part of DOH.
# 
# DOH is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
# 
# DOH is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with DOH.  See gpl3.txt. If not, see <http://www.gnu.org/licenses/>.
require 'doh'

CONFIG_FILE = "../domain_specs.yaml"

unless ARGV.size > 0
  $stderr.puts "Please enter domain token"
  exit
end

p = PasswordGen.new CONFIG_FILE

seq = 1
seq = ARGV[1] unless ARGV.size < 2


print "Enter Salt:"
salt = $stdin.gets
puts ""

print "Enter Password:"
system "stty -echo"
pwd = $stdin.gets
system "stty echo"
puts ""

#TODO clean up interface with single function call
h = p.gen salt,pwd, ARGV[0], seq
r = p.mangle h,ARGV[0]

#puts "***** Password ***** \n"
#puts ""
#puts ""
puts r
#puts ""

