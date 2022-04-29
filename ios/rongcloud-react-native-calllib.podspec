require "json"

package = JSON.parse(File.read(File.join(__dir__, "../package.json")))

Pod::Spec.new do |s|
  s.name         = "rongcloud-react-native-calllib"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/rongcloud/rongcloud-react-native-calllib.git", :tag => "#{s.version}" }

  s.source_files = "src/*.{h,m,mm}"
  s.requires_arc = true

  s.vendored_frameworks = 'Frameworks/*.framework'
  s.resources = "Resources/*.bundle"

  s.dependency "React"
  s.dependency "React-Core"
  s.dependency 'RongCloudIM/IMLib', '5.1.3.5'
  s.dependency "RongCloudRTC/RongCallLib", "5.1.15"
  s.dependency 'RongCloudRTC/RongFaceBeautifier', '5.1.15'
end
