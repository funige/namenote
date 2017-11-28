#!/usr/bin/env ruby

def get_trial(filename)
  buffer = File.open(filename, "r") {|f| f.read()}
  if buffer =~ /(namenote.trial) = (\w+)/
    if $2 == "true"
      return "true"
    end
  end
  return "false"
end

def replace_trial(filename, string)
  buffer = File.open(filename, "r") {|f| f.read()}

  buffer.gsub!(/(namenote.trial) = (\w+)/, "\\1 = #{string}")
  File.open(filename, "w") {|f| f.write(buffer)}
end

################################################################

if ARGV.length <= 0
  trial = get_trial "app/es6/namenote.es6"
  
  print <<-"EOS"
  current trial is "#{trial}"
  EOS

  exit ((trial == "true") ? 0 : 1)

else
  value = (ARGV[0].match(/true/i)) ? "true" : "false"
  replace_trial "app/es6/namenote.es6", value
end

