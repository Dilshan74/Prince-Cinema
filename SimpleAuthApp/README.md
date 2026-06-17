# SimpleAuthApp

Simple Android Studio app with:

- Sign up: name, email, phone number, password
- Sign in: name, password
- Home page: `Hi, <user name>`

## Project Structure

```text
SimpleAuthApp/
├── build.gradle
├── gradle.properties
├── settings.gradle
└── app/
    ├── build.gradle
    ├── proguard-rules.pro
    └── src/
        └── main/
            ├── AndroidManifest.xml
            ├── java/com/example/simpleauthapp/
            │   ├── AuthManager.kt
            │   ├── HomeActivity.kt
            │   ├── SignInActivity.kt
            │   └── SignUpActivity.kt
            └── res/
                ├── layout/
                │   ├── activity_home.xml
                │   ├── activity_sign_in.xml
                │   └── activity_sign_up.xml
                └── values/
                    ├── colors.xml
                    ├── strings.xml
                    └── themes.xml
```

## How to Use

1. Open `SimpleAuthApp` in Android Studio.
2. Let Android Studio sync Gradle.
3. Run the app on an emulator or Android device.
4. Create an account in Sign Up.
5. Log in with the same name and password in Sign In.

## Storage

This sample stores one user locally with `SharedPreferences`. It is good for learning and simple demos.
