#!/usr/bin/env ruby

def get_version(filename)
  buffer = File.open(filename, "r") {|f| f.read()}
  if buffer =~ /(\"?version\"?)(\s*[:=]\s*)\"(.*?)\"/ 
    return $3
  end
end

def replace_version(filename, string)
  buffer = File.open(filename, "r") {|f| f.read()}
  buffer.gsub!(/(\"?version\"?)(\s*[:=]\s*)\"(.*?)\"/, "\\1\\2\"#{string}\"")
  File.open(filename, "w") {|f| f.write(buffer)}
end

################################################################

if ARGV.length <= 0
  old_version = get_version "app/package.json"

  print <<-"EOS"
  usage: version [new_version]

  updates version of "package.json" & "es6/namenote.es6".
  curent version is "#{old_version}".
  EOS

  exit

else
  new_version = ARGV[0]
  replace_version "app/package.json", new_version
  replace_version "app/es6/namenote.es6", new_version
end




