import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">안드로이드 네이티브 전환 완료</h1>
        <p className="text-slate-600 mb-6 leading-relaxed">
          요청하신 대로 <strong>안드로이드 전용 네이티브 앱(Kotlin)</strong>으로 프로젝트가 재구성되었습니다. 
          이제 실제 휴대폰 잠금화면 위에 말씀을 항상 띄워주는 기능을 사용할 수 있습니다.
        </p>
        <div className="bg-blue-50 rounded-2xl p-4 mb-8 text-left">
          <h2 className="text-sm font-bold text-blue-900 mb-2">다음 단계:</h2>
          <ul className="text-xs text-blue-800 space-y-2 list-disc pl-4">
            <li>상단 메뉴의 <strong>설정(톱니바퀴)</strong> 아이콘을 누르세요.</li>
            <li><strong>'GitHub로 내보내기'</strong> 또는 <strong>'ZIP으로 다운로드'</strong>를 선택하세요.</li>
            <li>다운로드한 파일을 <strong>Android Studio</strong>에서 열어 빌드하세요.</li>
          </ul>
        </div>
        <p className="text-[10px] text-slate-400">
          ※ 웹 브라우저 미리보기는 네이티브 코드를 실행할 수 없어 이 안내 화면만 표시됩니다.
        </p>
      </div>
    </div>
  );
}
