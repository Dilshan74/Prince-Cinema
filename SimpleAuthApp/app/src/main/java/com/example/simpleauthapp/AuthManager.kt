package com.example.simpleauthapp

import android.content.Context

class AuthManager(context: Context) {

    private val preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

    fun saveUser(name: String, email: String, phone: String, password: String) {
        preferences.edit()
            .putString(KEY_NAME, name)
            .putString(KEY_EMAIL, email)
            .putString(KEY_PHONE, phone)
            .putString(KEY_PASSWORD, password)
            .apply()
    }

    fun validateLogin(name: String, password: String): Boolean {
        val savedName = preferences.getString(KEY_NAME, "")
        val savedPassword = preferences.getString(KEY_PASSWORD, "")
        return name == savedName && password == savedPassword
    }

    fun getSavedName(): String {
        return preferences.getString(KEY_NAME, "") ?: ""
    }

    fun hasRegisteredUser(): Boolean {
        return !preferences.getString(KEY_NAME, "").isNullOrBlank()
    }

    companion object {
        private const val PREF_NAME = "simple_auth_pref"
        private const val KEY_NAME = "name"
        private const val KEY_EMAIL = "email"
        private const val KEY_PHONE = "phone"
        private const val KEY_PASSWORD = "password"
    }
}
