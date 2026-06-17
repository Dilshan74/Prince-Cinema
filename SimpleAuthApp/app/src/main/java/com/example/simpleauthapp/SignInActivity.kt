package com.example.simpleauthapp

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class SignInActivity : AppCompatActivity() {

    private lateinit var nameEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var authManager: AuthManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_in)

        authManager = AuthManager(this)

        nameEditText = findViewById(R.id.etSignInName)
        passwordEditText = findViewById(R.id.etSignInPassword)

        val signInButton: Button = findViewById(R.id.btnSignIn)
        val signUpTextView: TextView = findViewById(R.id.tvGoToSignUp)
        val receivedName = intent.getStringExtra("user_name").orEmpty()

        if (receivedName.isNotEmpty()) {
            nameEditText.setText(receivedName)
        }

        signInButton.setOnClickListener {
            signInUser()
        }

        signUpTextView.setOnClickListener {
            startActivity(Intent(this, SignUpActivity::class.java))
        }
    }

    private fun signInUser() {
        val name = nameEditText.text.toString().trim()
        val password = passwordEditText.text.toString().trim()

        when {
            !authManager.hasRegisteredUser() -> {
                Toast.makeText(this, "Please sign up first", Toast.LENGTH_SHORT).show()
            }

            name.isEmpty() -> {
                nameEditText.error = "Enter your name"
                nameEditText.requestFocus()
            }

            password.isEmpty() -> {
                passwordEditText.error = "Enter your password"
                passwordEditText.requestFocus()
            }

            authManager.validateLogin(name, password) -> {
                val intent = Intent(this, HomeActivity::class.java)
                intent.putExtra("user_name", name)
                startActivity(intent)
                finish()
            }

            else -> {
                Toast.makeText(this, "Invalid name or password", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
