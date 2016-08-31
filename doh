#!/usr/bin/env ruby
# Copyright (c) 2016 Jake Willoughby
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

require 'openssl'
require "base64"
require 'io/console'
require "yaml"

require_relative "./doh"

def red(s)
  "\e[31m#{s}\e[0m"
end
def yellow(s)
  "\e[33m#{s}\e[0m"
end
def green(s)
  "\e[32m#{s}\e[0m"
end

salt = ARGV.shift
unless salt
  puts "Usage: #{$0} <salt> <domain> [seq]"
  abort red("Error: no domain given")
end
domain = ARGV.shift
unless domain
  puts "Usage: #{$0} <salt> <domain> [seq]"
  abort red("Error: no domain given")
end

seq = ARGV.shift
seq = "" unless seq

$specs = YAML.load(File.open("domain_specs.yaml"))

if $specs.has_key? domain
  myspec = $specs[domain]
else
  myspec = $specs["defaults"]
end

print "Password: "
pass = $stdin.noecho(&:gets).strip
puts

iterations = 10000

digest = OpenSSL::Digest::SHA256.new
ss = Digest::SHA256.digest(salt + pass)
id = Digest::SHA256.hexdigest(salt + pass)[-4..-1]
puts "Your master password id is #{red(id)}"

pwd = doh(myspec, ss, seq, domain, salt, iterations, myspec['length'], digest)

puts yellow("Generated Password:")
puts yellow("#{' '*pwd.index(' ')}/---- Note: don't forget to include the space") if pwd =~ / /
puts pwd
