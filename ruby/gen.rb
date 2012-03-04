#!/usr/bin/env ruby

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

