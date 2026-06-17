package com.example.simpleauthapp

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class SignUpActivity : AppCompatActivity() {

    private lateinit var nameEditText: EditText
    private lateinit var emailEditText: EditText
    private lateinit var phoneEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var authManager: AuthManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_up)

        authManager = AuthManager(this)

        nameEditText = findViewById(R.id.etName)
        emailEditText = findViewById(R.id.etEmail)
        phoneEditText = findViewById(R.id.etPhone)
        passwordEditText = findViewById(R.id.etPassword)

        val signUpButton: Button = findViewById(R.id.btnSignUp)
        val signInTextView: TextView = findViewById(R.id.tvGoToSignIn)

        signUpButton.setOnClickListener {
            signUpUser()
        }

        signInTextView.setOnClickListener {
            startActivity(Intent(this, SignInActivity::class.java))
            finish()
        }
    }

    private fun signUpUser() {
        val name = nameEditText.text.toString().trim()
        val email = emailEditText.text.toString().trim()
        val phone = phoneEditText.text.toString().trim()
        val password = passwordEditText.text.toString().trim()

        when {
            name.isEmpty() -> {
                nameEditText.error = "Enter your name"
                nameEditText.requestFocus()
            }

            email.isEmpty() || !Patterns.EMAIL_ADDRESS.matcher(email).matches() -> {
                emailEditText.error = "Enter a valid email"
                emailEditText.requestFocus()
            }

            phone.length < 10 -> {
                phoneEditText.error = "Enter a valid phone number"
                phoneEditText.requestFocus()
            }

            password.length < 4 -> {
                passwordEditText.error = "Password must be at least 4 characters"
                passwordEditText.requestFocus()
            }

            else -> {
                authManager.saveUser(name, email, phone, password)
                Toast.makeText(this, "Sign up successful", Toast.LENGTH_SHORT).show()

                val intent = Intent(this, SignInActivity::class.java)
                intent.putExtra("user_name", name)
                startActivity(intent)
                finish()
            }
        }
    }
}
