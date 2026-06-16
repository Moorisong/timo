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

# 3. Gradle 빌드 시작
echo "⚙️ Gradle release bundle 빌드 시작..."
cd android
./gradlew bundleRelease

echo "🎉 빌드가 성공적으로 완료되었습니다!"
echo "📍 생성된 AAB 파일 경로:"
echo "👉 android/app/build/outputs/bundle/release/app-release.aab"
