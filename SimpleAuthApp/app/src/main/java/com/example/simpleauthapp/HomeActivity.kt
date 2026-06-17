package com.example.simpleauthapp

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class HomeActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        val welcomeTextView: TextView = findViewById(R.id.tvWelcome)
        val logoutButton: Button = findViewById(R.id.btnLogout)
        val userName = intent.getStringExtra("user_name").orEmpty()
        val savedUserName = AuthManager(this).getSavedName()
        val displayName = userName.ifEmpty { savedUserName }

        welcomeTextView.text = if (displayName.isNotEmpty()) {
            "Hi, $displayName"
        } else {
            "Hi"
        }

        logoutButton.setOnClickListener {
            val intent = Intent(this, SignInActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }
    }
}
