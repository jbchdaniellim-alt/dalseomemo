package com.bluewhale.lockscreentest.service

import android.app.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.bluewhale.lockscreentest.LockScreenActivity
import com.bluewhale.lockscreentest.MainActivity
import com.bluewhale.lockscreentest.R

class LockScreenService : Service() {
    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent != null) {
                when (intent.action) {
                    Intent.ACTION_SCREEN_OFF -> {
                        val newIntent = Intent(context, LockScreenActivity::class.java)
                        newIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        newIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
                        startActivity(newIntent)
                    }
                }
            }
        }
    }

    override fun onBind(p0: Intent?): IBinder? {
        return null
    }

    private val CHANNEL_ID = "com.bluewhale.lockscreentest.lockscreen"

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        
        val pendingIntent = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
            .setContentTitle("말씀 잠금화면 서비스")
            .setContentText("잠금화면 말씀 기능이 동작 중입니다.")
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        startForeground(1, notification)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val channel = NotificationChannel(
                CHANNEL_ID,
                "잠금화면 서비스",
                NotificationManager.IMPORTANCE_LOW
            )
            nm.createNotificationChannel(channel)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val filter = IntentFilter()
        filter.addAction(Intent.ACTION_SCREEN_OFF)
        registerReceiver(receiver, filter)
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(receiver)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
