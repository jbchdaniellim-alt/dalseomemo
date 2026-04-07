# 생명의 말씀 안드로이드 네이티브 프로젝트

이 프로젝트는 안드로이드 시스템 잠금화면 위에 성경 말씀을 항상 띄워주는 네이티브 앱입니다.

## 주요 기능
- **SYSTEM_ALERT_WINDOW**: 다른 앱 위에 그리기 권한을 사용하여 잠금화면 위에 말씀을 오버레이합니다.
- **Foreground Service**: 앱이 종료되어도 잠금화면 감지 서비스가 계속 동작합니다.
- **Boot Receiver**: 휴대폰을 껐다 켜도 서비스가 자동으로 시작됩니다.

## 시작하기 (Android Studio)
1. AI Studio 상단 설정 메뉴에서 **'ZIP으로 다운로드'**를 선택합니다.
2. 다운로드한 압축을 풉니다.
3. **Android Studio**를 실행하고 `Open`을 눌러 해당 폴더를 선택합니다.
4. Gradle 빌드가 완료될 때까지 기다립니다.
5. 실제 안드로이드 기기 또는 에뮬레이터에 설치합니다.

## 권한 설정
앱 실행 시 **'다른 앱 위에 그리기'** 권한 허용 창이 뜨면 반드시 허용해 주어야 잠금화면 기능이 작동합니다.

## 기술 스택
- Language: Kotlin
- UI: XML Layouts
- Build System: Gradle
- Minimum SDK: 26 (Android 8.0)
- Target SDK: 33 (Android 13)
