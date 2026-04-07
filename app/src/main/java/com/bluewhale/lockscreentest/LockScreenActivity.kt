package com.bluewhale.lockscreentest

import android.app.KeyguardManager
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.floatingactionbutton.FloatingActionButton
import java.text.SimpleDateFormat
import java.util.*

class LockScreenActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 설정: 잠금화면 위에 띄우기
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            keyguardManager.requestDismissKeyguard(this, null)
        } else {
            window.addFlags(
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }

        setContentView(R.layout.activity_lock_screen)

        // 시간 표시 예시
        val timeText = findViewById<TextView>(R.id.timeText)
        val dateText = findViewById<TextView>(R.id.dateText)
        
        val sdfTime = SimpleDateFormat("HH:mm", Locale.KOREA)
        val sdfDate = SimpleDateFormat("MM월 dd일 (E)", Locale.KOREA)
        
        timeText.text = sdfTime.format(Date())
        dateText.text = sdfDate.format(Date())

        // 닫기 버튼 (잠금 해제 역할)
        findViewById<FloatingActionButton>(R.id.fab_close).setOnClickListener {
            finish()
        }
    }
}
