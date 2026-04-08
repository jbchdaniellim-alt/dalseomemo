package com.bluewhale.lockscreentest.service

import android.app.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import com.bluewhale.lockscreentest.LockScreenActivity
import com.bluewhale.lockscreentest.MainActivity
import com.bluewhale.lockscreentest.R

class LockScreenService : Service() {
    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent != null && intent.action == Intent.ACTION_SCREEN_OFF) {
                val newIntent = Intent(context, LockScreenActivity::class.java)
                newIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                newIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
                context?.startActivity(newIntent)
            }
        }
    }

    override fun onBind(p0: Intent?): IBinder? = null

    private val CHANNEL_ID = "com.bluewhale.lockscreentest.lockscreen"

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        
        val pendingIntent = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
        )

        val notification = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("생명의 말씀 서비스")
                .setContentText("잠금화면 말씀 오버레이 동작 중")
                .setContentIntent(pendingIntent)
                .build()
        } else {
            Notification.Builder(this)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("생명의 말씀 서비스")
                .setContentText("잠금화면 말씀 오버레이 동작 중")
                .setContentIntent(pendingIntent)
                .build()
        }

        startForeground(1, notification)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val channel = NotificationChannel(CHANNEL_ID, "잠금화면 서비스", NotificationManager.IMPORTANCE_LOW)
            nm.createNotificationChannel(channel)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val filter = IntentFilter(Intent.ACTION_SCREEN_OFF)
        registerReceiver(receiver, filter)
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(receiver)
    }
}
