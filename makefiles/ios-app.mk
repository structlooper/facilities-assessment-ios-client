define _run_ios
	$(call _set_env,$1)
	ENVFILE=.env react-native run-ios
endef

define _switch_ios_to_mode
	cat ios/FacilitiesAssessment/AppDelegate.m.template|sed 's/JS_CODE_LOCATION/$2/' > ios/FacilitiesAssessment/AppDelegate.m
endef

switch-ios-to-debug-mode:
	$(call _switch_ios_to_mode,true,[[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];)

switch-ios-to-release-mode:
	$(call _switch_ios_to_mode,false,[[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];)

run-app-ios: switch-ios-to-debug-mode
	$(call _run_ios,dev)

run_app_ios_nhsrc: switch-ios-to-debug-mode
	$(call _run_ios,.env.nhsrc)

run_app_ios_nhsrc_release: switch-ios-to-release-mode
	$(call _run_ios,.env.nhsrc)

run_app_ios_nhsrc_dev: switch-ios-to-debug-mode
	$(call _run_ios,.env.nhsrc.dev)

prepare-ipa-nhsrc: switch-ios-to-release-mode
	$(call _set_env,.env.nhsrc)
	react-native bundle --entry-file index.ios.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios

prepare-ipa-nhsrc-fail: switch-ios-to-release-mode
	$(call _set_env,.env.nhsrc)

release-ios-nhsrc: switch-ios-to-release-mode
	$(call _set_env,.env.nhsrc)
	ENVFILE=.env react-native run-ios --configuration Release