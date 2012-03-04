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



# CADE machines install is broken
# Add the following paths to $LOAD_PATH
$:.unshift "/usr/local/stow/ruby/i386_linux22/ruby-1.8.7-p72/lib/ruby/1.8"
$:.unshift "/usr/local/stow/ruby/i386_linux22/ruby-1.8.7-p72/lib/ruby/1.8/i686-linux"

require 'digest/sha2'
require 'pbkdf2'
require 'base64'
require 'yaml'
require 'pp' #TODO remove!

class PasswordGen
  def initialize config_file
    @special = 32.upto(126).map {|v| v.chr}.find_all { |v| v.match /[^a-zA-Z0-9]/ }.join
    @base64  = 32.upto(126).map {|v| v.chr}.find_all { |v| v.match /[a-zA-Z0-9]/ }.join + "+/"
    @config = parse config_file

    #puts ('a'..'z').to_a.join
    #puts ('a'..'z').to_a.join.upcase
    #puts ('0'..'1').to_a.join
    #puts @special
  end

  def parse file
    begin
      YAML.load(File.open(file))
    rescue ArgumentError => e
      $stderr.puts "Could not parse YAML: #{e.message}"
      exit
    end
  end

  def gen s, sec, d, seq
#    foo = Digest::SHA512.digest(s.to_s+sec.to_s+d.to_s+seq.to_s) 
#    Base64.encode64(foo).delete "\n"
    p = PBKDF2.new do |p|
      p.password = sec
      p.salt = s.to_s + d.to_s + seq.to_s
      p.iterations = 5000
      p.key_length = 100
      p.hash_function = "sha512"
    end.bin_string
    Base64.encode64(p).delete "\n"
  end

  def mangle hash,domain
    unless @config.has_key? domain
      $stderr.puts "#{domain} was not found in configuration.  Output is unmangled"
      return hash
    end

    obj = @config[domain]

    #pp obj
    _mangle hash, obj['max_length'].to_i, obj['use'],obj['require'], obj['exclude']
  end

  def _mangle hash,len,use,req,exclude
    len = hash.size if len > hash.size
    even_split_amount = 64/use.split(',').size
    left = 64
    pos  = 0
    translate = ""
    use.split(',').sort.each do |type|
      used_chars = even_split_amount
      case type
      when /c|l/
        chars = ('a'..'z').to_a.join
        chars.delete! exclude
        used_chars = chars.size-1 if used_chars > chars.size-1
        chars.upcase! if type == "c"
        left -= used_chars
        translate += chars[0..used_chars]
      when "n"
        chars = ('0'..'9').to_a.join
        chars.delete! exclude
        used_chars = chars.size-1 if used_chars > chars.size-1
        translate += chars[0..used_chars]
        left -= used_chars
      when "x"
        used_chars = left
        special = @special.delete exclude
        used_chars = special.size-1 if used_chars > special.size-1
        translate += special[0..used_chars]
      else
        $stderr.puts "#{__LINE__} Bad Requirement #{type} in string #{use}"
        exit
      end
    end
    translate += translate until translate.size >= 64
    #puts "Chars:\t" + translate
    hash.tr!(@base64,translate)
    #puts "Hash:\t" + hash
    result = ""
    0.upto(hash.size-len) do |i|
      s = hash[i..i+len-1]
      good = true
      req.split(",").each do |r|
        type = r[0].chr
        reg = case type
              when "c" then "[A-Z]"
              when "l" then "[a-z]"
              when "n" then "[0-9]"
              when "x" then @special
              else
                $stderr.puts "Bad Requirement string #{req}"
                exit
              end
        good = false if s =~ /#{Regexp.escape(reg)}/
      end
      result = s
      break if good
    end

    puts "Result size: #{result.size}"

    puts "Approx. Entrophy: #{Math.log(translate[0..63].split(//).uniq.size*1.0)/Math.log(2)*result.size} bits"
    return result
  end
end
