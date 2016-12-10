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
require "open3"
require 'io/console'
require "yaml"

require_relative "./doh"

file = __FILE__
file = File.readlink(file) if File.symlink? file

SCRIPT_DIR = File.dirname(file)

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
  puts "Usage: #{$0} <salt>"
  abort red("Error: no salt given")
end

$specs = YAML.load(File.open(SCRIPT_DIR + "/domain_specs.yaml"))

print "Password: "
pass = $stdin.noecho(&:gets).strip
puts

iterations = 10000

digest = OpenSSL::Digest::SHA256.new
ss = Digest::SHA256.digest(salt + pass)
id = Digest::SHA256.hexdigest(salt + pass)[-4..-1]
puts "Your master password id is #{red(id)}"

print "Pin: "
pin = $stdin.noecho(&:gets).strip
puts
puts

$pin_attempts = 0


while true
  print "Domain: "
  domain = $stdin.gets
  unless domain
    puts red("Error: no domain given")
  end

  if $specs.has_key? domain
    myspec = $specs[domain]
  else
    myspec = $specs["defaults"]
  end
  print "Sequence: "
  seq = $stdin.gets
  seq = "" unless seq

  print "Pin: "
  check_pin = $stdin.noecho(&:gets).strip
  puts

  if pin.strip != check_pin.strip
    $pin_attempts += 1
    if $pin_attempts >= 3
      abort red("Too many pin attempts!")
    end
    puts yellow("Incorrect pin!")
    puts
    next
  end
  $pin_attempts = 0

  pwd = doh(myspec, ss, seq, domain, salt, iterations, myspec['length'], digest)

  puts yellow("Generated Password:")
  puts yellow("#{' '*pwd.index(' ')}/---- Note: don't forget to include the space") if pwd =~ / /
  puts pwd

  Open3.popen2("xclip -i -selection clipboard") do |i,o,t|
    i.print pwd
    i.flush
    i.close
    t.value
  end

  puts
end

