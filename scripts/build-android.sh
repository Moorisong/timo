#!/bin/bash
# Android Release Bundle (AAB) 로컬 빌드 스크립트

# 에러 발생 시 즉시 스크립트 중단
set -e

echo "🚀 Android Release Bundle (AAB) 빌드를 준비합니다..."

# 1. Expo Prebuild 수행 (android 폴더 생성 및 설정 적용)
echo "📦 Expo Prebuild 실행 중..."
npx expo prebuild --platform android --clean

# 2. android 폴더 존재 여부 확인
if [ -d "android" ]; then
  echo "✅ android 폴더 생성이 완료되었습니다."
else
  echo "❌ android 폴더를 생성하지 못했습니다."
  exit 1
fi

# 3. 아이콘 배경 XML 패치 (ic_launcher_background.xml)
# prebuild가 ic_launcher_background.xml을 splash 이미지 포함 구조로 덮어쓰기 때문에 수정
echo "🎨 앱 아이콘 배경 XML 패치 중..."
ICON_BG_XML="android/app/src/main/res/drawable/ic_launcher_background.xml"
cat > "$ICON_BG_XML" << 'EOF'
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:drawable="@color/iconBackground"/>
</layer-list>
EOF
echo "✅ 아이콘 배경 XML 패치 완료"

# 4. styles.xml 패치 (android:windowSplashScreenBehavior 제거)
# 해당 속성은 Android 12+ 전용이며 일부 기기에서 스플래시 동작 불안정 야기
echo "🎨 styles.xml 패치 중..."
STYLES_XML="android/app/src/main/res/values/styles.xml"
cat > "$STYLES_XML" << 'EOF'
<resources xmlns:tools="http://schemas.android.com/tools">
  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <item name="android:enforceNavigationBarContrast" tools:targetApi="29">true</item>
    <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="android:statusBarColor">#208AEF</item>
  </style>
  <style name="Theme.App.SplashScreen" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">@color/splashscreen_background</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/splashscreen_logo</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
  </style>
</resources>
EOF
echo "✅ styles.xml 패치 완료"


# 5. Gradle 빌드 시작
echo "⚙️ Gradle release bundle 빌드 시작..."
cd android
./gradlew bundleRelease

echo "🎉 빌드가 성공적으로 완료되었습니다!"
echo "📍 생성된 AAB 파일 경로:"
echo "👉 android/app/build/outputs/bundle/release/app-release.aab"
