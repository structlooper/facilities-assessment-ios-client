define _run_ios_dev
	$(call _setup_hosts,$1)
	$(call _create_config,dev)
	react-native run-ios --simulator="iPhone 6 Plus"
endef

define _run_ios
	$(call _create_config,$1)
	react-native run-ios --simulator=$2
endef

define _switch_ios_to_mode
#	cat ios/FacilitiesAssessment/AppDelegate.m.template|sed 's/JS_CODE_LOCATION/$2/' > ios/FacilitiesAssessment/AppDelegate.m
endef

open-simulator:
	open -a simulator

run-app-ios-nhsrc-default:
	$(call _run_ios,nhsrc,"iPhone 8 Plus")

run-app-ios-nhsrc:
	$(call _run_ios,nhsrc,"$(iphone)")

run-app-ios-nhsrc-release:
	$(call _run_ios,nhsrc)

run-app-ios-nhsrc-dev:
	$(call _run_ios_dev,nhsrc.dev)

create-nhsrc-config:
	$(call _create_config,nhsrc)

replace-syntax-errors:
	sed -i -e 's/NSArray<id<RCTBridgeModule>>/NSArray<Class>/g' node_modules/react-native/React/Base/RCTBridge.h
	sed -i -e 's/NSArray<id<RCTBridgeModule>>/NSArray<Class>/g' node_modules/react-native/React/Base/RCTBridgeDelegate.h
	sed -i -e 's/NSArray<id<RCTBridgeModule>>/NSArray<Class>/g' node_modules/react-native/React/CxxBridge/RCTCxxBridge.mm
	sed -i -e 's/*bsg_kscrashsentry_generateReportContext()/*bsg_kscrashsentry_generateReportContext(void)/g' node_modules/bugsnag-react-native/cocoa/vendor/bugsnag-cocoa/Source/KSCrash/Source/KSCrash/Recording/Sentry/BSG_KSCrashSentry_User.c

prepare-ipa-nhsrc: create-nhsrc-config
	react-native bundle --entry-file index.ios.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios

release-ios-nhsrc: create-nhsrc-config
	react-native run-ios --configuration Release

xcode-project-open:
	open ios/FacilitiesAssessment.xcodeproj/
