import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Plus, ChevronRight, X, Pin, PinOff, Trash2, Download, User as UserIcon, GripVertical, ArrowUp, ArrowDown, Info } from 'lucide-react';

// --- Types ---
interface Verse {
  id: string;
  text: string;
  reference: string;
  category: string;
  background: string;
  pinned: boolean;
  createdAt: number;
  fontFamily?: string;
  fontSize?: string;
  bgColor?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'center' | 'bottom';
  bgBlur?: string;
  bgBrightness?: string;
  letterSpacing?: string;
  lineHeight?: string;
  borderRadius?: string;
  padding?: string;
  fontWeight?: string;
  borderColor?: string;
  refFontSize?: string;
  refColor?: string;
  refTextAlign?: 'left' | 'center' | 'right';
}

// --- Constants ---
const Categories = ['믿음', '사랑', '소망', '위로', '지혜', '감사'];
const Fonts = [
  { name: '기본 산세리프', value: 'font-sans' },
  { name: '세리프 (명조)', value: 'font-serif' },
  { name: '모노 (고딕)', value: 'font-mono' },
];
const FontSizes = [
  { name: '작게', value: 'text-sm' },
  { name: '보통', value: 'text-base' },
  { name: '크게', value: 'text-lg' },
  { name: '매우 크게', value: 'text-xl' },
  { name: '웅장하게', value: 'text-2xl' },
];

export default function App() {
  const [verses, setVerses] = useState<Verse[]>(() => {
    const saved = localStorage.getItem('verses');
    return saved ? JSON.parse(saved) : [];
  });
  const [newVerseText, setNewVerseText] = useState('');
  const [newVerseReference, setNewVerseReference] = useState('');
  const [newVerseCategory, setNewVerseCategory] = useState(Categories[0]);
  const [newVerseBackground, setNewVerseBackground] = useState('#004098');
  const [newVerseIsPinned, setNewVerseIsPinned] = useState(true);
  
  const [newVerseFontFamily, setNewVerseFontFamily] = useState(Fonts[0].value);
  const [newVerseFontSize, setNewVerseFontSize] = useState(FontSizes[2].value);
  const [newVerseBgColor, setNewVerseBgColor] = useState('rgba(0, 64, 152, 0.8)');
  const [newVerseTextColor, setNewVerseTextColor] = useState('#ffffff');
  const [newVerseTextAlign, setNewVerseTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [newVerseVerticalAlign, setNewVerseVerticalAlign] = useState<'top' | 'center' | 'bottom'>('center');
  const [newVerseBgBlur, setNewVerseBgBlur] = useState('blur-sm');
  const [newVerseBgBrightness, setNewVerseBgBrightness] = useState('brightness-100');
  const [newVerseLetterSpacing, setNewVerseLetterSpacing] = useState('tracking-normal');
  const [newVerseLineHeight, setNewVerseLineHeight] = useState('leading-relaxed');
  const [newVerseBorderRadius, setNewVerseBorderRadius] = useState('rounded-[2rem]');
  const [newVersePadding, setNewVersePadding] = useState('p-8');
  const [newVerseFontWeight, setNewVerseFontWeight] = useState('font-medium');
  const [newVerseBorderColor, setNewVerseBorderColor] = useState('transparent');
  const [newVerseRefFontSize, setNewVerseRefFontSize] = useState('text-sm');
  const [newVerseRefColor, setNewVerseRefColor] = useState('#ffffff');
  const [newVerseRefTextAlign, setNewVerseRefTextAlign] = useState<'left' | 'center' | 'right'>('center');

  const [isLockScreenOpen, setIsLockScreenOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [showVerseOnLockScreen, setShowVerseOnLockScreen] = useState(true);
  const [wakeLock, setWakeLock] = useState<any>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    localStorage.setItem('verses', JSON.stringify(verses));
  }, [verses]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        const lock = await (navigator as any).wakeLock.request('screen');
        setWakeLock(lock);
        lock.addEventListener('release', () => {
          setWakeLock(null);
        });
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }
  };

  const generateVerseImage = (verse: Verse): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = verse.bgColor || '#004098';
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.fillStyle = verse.textColor || '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const words = verse.text.split(' ');
    let line = '';
    const lines = [];
    ctx.font = 'bold 60px sans-serif';
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 800 && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const startY = 512 - (lines.length * 40);
    lines.forEach((l, i) => {
      ctx.fillText(l.trim(), 512, startY + (i * 80));
    });

    ctx.font = '30px sans-serif';
    ctx.fillText(verse.reference, 512, startY + (lines.length * 80) + 60);

    return canvas.toDataURL('image/png');
  };

  const updateMediaSession = (verse: Verse) => {
    if ('mediaSession' in navigator) {
      const artworkUrl = generateVerseImage(verse);
      (navigator as any).mediaSession.metadata = new (window as any).MediaMetadata({
        title: verse.text,
        artist: verse.reference,
        album: '생명의 말씀',
        artwork: [
          { src: artworkUrl, sizes: '1024x1024', type: 'image/png' }
        ]
      });

      const actionHandlers: any = [
        ['play', () => audioElement?.play()],
        ['pause', () => audioElement?.pause()],
        ['previoustrack', () => {
          const currentIndex = verses.findIndex(v => v.id === verse.id);
          const prevVerse = verses[currentIndex - 1] || verses[verses.length - 1];
          if (prevVerse) updateMediaSession(prevVerse);
        }],
        ['nexttrack', () => {
          const currentIndex = verses.findIndex(v => v.id === verse.id);
          const nextVerse = verses[currentIndex + 1] || verses[0];
          if (nextVerse) updateMediaSession(nextVerse);
        }],
      ];

      for (const [action, handler] of actionHandlers) {
        try {
          (navigator as any).mediaSession.setActionHandler(action, handler);
        } catch (error) {
          console.log(`The media session action "${action}" is not supported yet.`);
        }
      }
    }
  };

  const startLockScreenMode = async (verse?: Verse) => {
    setIsLockScreenOpen(true);
    await requestWakeLock();
    
    if (!audioElement) {
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
      audio.loop = true;
      setAudioElement(audio);
      audio.play().catch(e => console.error("Audio play failed", e));
    } else {
      audioElement.play().catch(e => console.error("Audio play failed", e));
    }

    const displayVerse = verse || verses.find(v => v.pinned) || verses[0];
    if (displayVerse) {
      updateMediaSession(displayVerse);
    }
    
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const handleCloseLockScreen = () => {
    setIsLockScreenOpen(false);
    releaseWakeLock();
    if (audioElement) {
      audioElement.pause();
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  const handleAddVerse = () => {
    if (!newVerseText || !newVerseReference) return;
    const newVerse: Verse = {
      id: Date.now().toString(),
      text: newVerseText,
      reference: newVerseReference,
      category: newVerseCategory,
      background: newVerseBackground,
      pinned: newVerseIsPinned,
      fontFamily: newVerseFontFamily,
      fontSize: newVerseFontSize,
      bgColor: newVerseBgColor,
      textColor: newVerseTextColor,
      textAlign: newVerseTextAlign,
      verticalAlign: newVerseVerticalAlign,
      bgBlur: newVerseBgBlur,
      bgBrightness: newVerseBgBrightness,
      letterSpacing: newVerseLetterSpacing,
      lineHeight: newVerseLineHeight,
      borderRadius: newVerseBorderRadius,
      padding: newVersePadding,
      fontWeight: newVerseFontWeight,
      borderColor: newVerseBorderColor,
      refFontSize: newVerseRefFontSize,
      refColor: newVerseRefColor,
      refTextAlign: newVerseRefTextAlign,
      createdAt: Date.now(),
    };
    setVerses([newVerse, ...verses]);
    setNewVerseText('');
    setNewVerseReference('');
  };

  const handleTogglePin = (id: string) => {
    setVerses(verses.map(v => v.id === id ? { ...v, pinned: !v.pinned } : v));
  };

  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [categories, setCategories] = useState(Categories);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#004098] rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#004098]">생명의 말씀 선교회</span>
          </div>
          <div className="flex items-center gap-3">
            {showInstallBtn && (
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#004098]/10 text-[#004098] rounded-full text-xs font-bold hover:bg-[#004098]/20 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                앱 설치
              </button>
            )}
          </div>
        </header>

          {/* Add Verse Form */}
          <div className="px-6 mt-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-6 bg-[#004098] rounded-full" />
                <h2 className="font-bold text-lg">오늘의 묵상 기록</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">말씀 구절</label>
                  <textarea
                    placeholder="마음에 와닿은 말씀을 적어보세요..."
                    value={newVerseText}
                    onChange={(e) => setNewVerseText(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#004098] transition-all text-sm min-h-[100px] resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">장절 정보</label>
                    <input
                      type="text"
                      placeholder="예: 요한복음 3:16"
                      value={newVerseReference}
                      onChange={(e) => setNewVerseReference(e.target.value)}
                      className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#004098] transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">분류</label>
                    {!showCustomCategory ? (
                      <div className="flex gap-2">
                        <select
                          value={newVerseCategory}
                          onChange={(e) => {
                            if (e.target.value === 'custom') {
                              setShowCustomCategory(true);
                            } else {
                              setNewVerseCategory(e.target.value);
                            }
                          }}
                          className="flex-1 p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#004098] transition-all text-sm appearance-none"
                        >
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          <option value="custom">+ 분류 추가</option>
                        </select>
                        <button 
                          onClick={() => setIsCategoryManagerOpen(true)}
                          className="p-3.5 bg-slate-50 text-slate-400 hover:text-[#004098] rounded-xl transition-colors"
                          title="분류 관리"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          autoFocus
                          placeholder="새 분류 입력"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && customCategory.trim()) {
                              setCategories([...categories, customCategory.trim()]);
                              setNewVerseCategory(customCategory.trim());
                              setCustomCategory('');
                              setShowCustomCategory(false);
                            }
                          }}
                          className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#004098] transition-all text-sm pr-10"
                        />
                        <button 
                          onClick={() => setShowCustomCategory(false)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">배경 스타일</label>
                  <div className="flex flex-wrap gap-2">
                    {['#004098', '#1e293b', '#475569', '#0f172a', '#1e1b4b', '#312e81'].map(color => (
                      <button
                        key={color}
                        onClick={() => setNewVerseBackground(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${newVerseBackground === color ? 'border-[#004098] scale-110 shadow-md' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <button
                      onClick={() => setShowStyleEditor(!showStyleEditor)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${showStyleEditor ? 'bg-[#004098] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      <Plus className="w-3 h-3" />
                      상세 스타일
                    </button>
                  </div>
                </div>

                {showStyleEditor && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-slate-50 rounded-2xl space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">글꼴</label>
                        <select 
                          value={newVerseFontFamily} 
                          onChange={(e) => setNewVerseFontFamily(e.target.value)}
                          className="w-full p-2 bg-white rounded-lg text-xs border-none"
                        >
                          {Fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">크기</label>
                        <select 
                          value={newVerseFontSize} 
                          onChange={(e) => setNewVerseFontSize(e.target.value)}
                          className="w-full p-2 bg-white rounded-lg text-xs border-none"
                        >
                          {FontSizes.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">정렬</label>
                        <div className="flex bg-white rounded-lg p-1">
                          {(['left', 'center', 'right'] as const).map(align => (
                            <button
                              key={align}
                              onClick={() => setNewVerseTextAlign(align)}
                              className={`flex-1 py-1 text-[10px] rounded ${newVerseTextAlign === align ? 'bg-[#004098] text-white' : 'text-slate-400'}`}
                            >
                              {align === 'left' ? '좌' : align === 'center' ? '중' : '우'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">수직 정렬</label>
                        <div className="flex bg-white rounded-lg p-1">
                          {(['top', 'center', 'bottom'] as const).map(align => (
                            <button
                              key={align}
                              onClick={() => setNewVerseVerticalAlign(align)}
                              className={`flex-1 py-1 text-[10px] rounded ${newVerseVerticalAlign === align ? 'bg-[#004098] text-white' : 'text-slate-400'}`}
                            >
                              {align === 'top' ? '상' : align === 'center' ? '중' : '하'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">배경색 & 투명도</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={newVerseBgColor.startsWith('rgba') ? '#004098' : newVerseBgColor} 
                            onChange={(e) => setNewVerseBgColor(e.target.value)}
                            className="w-6 h-6 rounded-full border-none p-0 cursor-pointer shrink-0"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">글자색</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={newVerseTextColor} 
                            onChange={(e) => setNewVerseTextColor(e.target.value)}
                            className="w-6 h-6 rounded-full border-none p-0 cursor-pointer shrink-0"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">장절 색상</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={newVerseRefColor} 
                            onChange={(e) => setNewVerseRefColor(e.target.value)}
                            className="w-6 h-6 rounded-full border-none p-0 cursor-pointer shrink-0"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${newVerseIsPinned ? 'bg-[#004098]/10 text-[#004098]' : 'bg-slate-200 text-slate-400'}`}>
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">잠금화면 목록에 추가</p>
                      <p className="text-[10px] text-slate-400">등록 후 바로 잠금화면 목록에 추가합니다.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNewVerseIsPinned(!newVerseIsPinned)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${newVerseIsPinned ? 'bg-[#004098]' : 'bg-slate-300'}`}
                  >
                    <motion.div
                      animate={{ x: newVerseIsPinned ? 26 : 2 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <button
                  onClick={handleAddVerse}
                  disabled={!newVerseText || !newVerseReference}
                  className="w-full py-4 bg-[#004098] text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-[#003380] transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  말씀 등록하기
                </button>
              </div>
            </div>
          </div>

          {/* Verses List */}
          <main className="px-6 mt-10 space-y-8 pb-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-slate-200 rounded-full" />
                <h2 className="font-bold text-lg">나의 말씀 저장소</h2>
              </div>
              <button 
                onClick={() => setIsCategoryManagerOpen(true)}
                className="text-xs font-bold text-[#004098] bg-[#004098]/5 px-4 py-2 rounded-full hover:bg-[#004098]/10 transition-all"
              >
                분류 관리하기
              </button>
            </div>

            {verses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-slate-400">등록된 말씀이 없습니다.</p>
              </div>
            ) : (
              verses.map((verse) => (
                <div key={verse.id}>
                  <VerseCard
                    verse={verse}
                    onShowLockScreen={startLockScreenMode}
                    onTogglePin={() => handleTogglePin(verse.id)}
                    isAuthor={true}
                  />
                </div>
              ))
            )}
          </main>

        {/* Category Manager Modal */}
        <AnimatePresence>
          {isCategoryManagerOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCategoryManagerOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold">분류 관리</h2>
                  <button 
                    onClick={() => setIsCategoryManagerOpen(false)}
                    className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {categories.map((cat, idx) => (
                    <div key={cat} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#004098] font-bold">
                          {idx + 1}
                        </div>
                        <span className="font-bold text-slate-700">{cat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            const newCats = [...categories];
                            if (idx > 0) {
                              [newCats[idx], newCats[idx-1]] = [newCats[idx-1], newCats[idx]];
                              setCategories(newCats);
                            }
                          }}
                          className="p-2.5 text-slate-400 hover:text-[#004098] hover:bg-white rounded-xl transition-all"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            const newCats = [...categories];
                            if (idx < categories.length - 1) {
                              [newCats[idx], newCats[idx+1]] = [newCats[idx+1], newCats[idx]];
                              setCategories(newCats);
                            }
                          }}
                          className="p-2.5 text-slate-400 hover:text-[#004098] hover:bg-white rounded-xl transition-all"
                        >
                          <ArrowDown className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (categories.length > 1) {
                              setCategories(categories.filter(c => c !== cat));
                            }
                          }}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="새로운 분류를 입력하세요..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customCategory.trim() && !categories.includes(customCategory.trim())) {
                          setCategories([...categories, customCategory.trim()]);
                          setCustomCategory('');
                        }
                      }}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#004098] transition-all text-sm pr-12"
                    />
                    <button 
                      onClick={() => {
                        if (customCategory.trim() && !categories.includes(customCategory.trim())) {
                          setCategories([...categories, customCategory.trim()]);
                          setCustomCategory('');
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#004098] text-white rounded-xl shadow-md hover:bg-[#003380] transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Lock Screen Overlay */}
        <AnimatePresence>
            {isLockScreenOpen && (
              <LockScreen
                verses={verses.filter(v => v.pinned).slice(0, 20)}
                showVerse={showVerseOnLockScreen}
                onToggleVerse={() => setShowVerseOnLockScreen(!showVerseOnLockScreen)}
                onClose={handleCloseLockScreen}
                onDeleteVerse={(id) => {
                  setVerses(prev => prev.filter(v => v.id !== id));
                }}
              />
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function VerseCard({ verse, onShowLockScreen, onTogglePin, isAuthor }: { 
  verse: Verse; 
  onShowLockScreen: (verse: Verse) => void;
  onTogglePin: () => void;
  isAuthor: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100"
    >
      {/* Background Preview */}
      <div
        className="h-80 relative group cursor-pointer"
        onClick={() => onShowLockScreen(verse)}
      >
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{ backgroundColor: verse.background }}
        />
        <div 
          className={`absolute inset-0 flex flex-col p-6 ${
            verse.verticalAlign === 'top' ? 'justify-start' : 
            verse.verticalAlign === 'bottom' ? 'justify-end' : 'justify-center'
          } ${
            verse.textAlign === 'left' ? 'items-start' :
            verse.textAlign === 'right' ? 'items-end' : 'items-center'
          } text-center`}
          style={{ color: verse.textColor || 'white' }}
        >
          <div 
            className={`absolute inset-0 m-4 ${verse.borderRadius || 'rounded-[2rem]'} backdrop-blur-sm border-2`}
            style={{ 
              backgroundColor: verse.bgColor || 'rgba(0,0,0,0.3)',
              borderColor: verse.borderColor || 'transparent'
            }}
          />
          <div className={`relative z-10 w-full ${verse.padding || 'p-8'}`}>
            <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 border border-white/20 inline-block">
              {verse.category}
            </span>
            <p className={`drop-shadow-md italic mb-2 ${verse.fontFamily || 'font-sans'} ${verse.fontSize || 'text-lg'} ${verse.fontWeight || 'font-medium'} ${verse.textAlign === 'left' ? 'text-left' : verse.textAlign === 'right' ? 'text-right' : 'text-center'} ${verse.letterSpacing || 'tracking-normal'} ${verse.lineHeight || 'leading-relaxed'}`}>
              "{verse.text}"
            </p>
            <p 
              className={`font-bold tracking-widest uppercase opacity-80 ${verse.refFontSize || 'text-sm'} ${
                verse.refTextAlign === 'left' ? 'text-left' : 
                verse.refTextAlign === 'right' ? 'text-right' : 
                (verse.textAlign === 'left' ? 'text-left' : verse.textAlign === 'right' ? 'text-right' : 'text-center')
              }`}
              style={{ color: verse.refColor || verse.textColor || 'white' }}
            >
              — {verse.reference}
            </p>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowLockScreen(verse);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 bg-[#004098] text-white hover:bg-[#003380] transition-all shadow-lg"
                title="잠금화면 오버레이 시작"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">잠금화면에 표시</span>
              </button>
              {isAuthor && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin();
                  }}
                  className={`p-1.5 rounded-full backdrop-blur-md border border-white/30 transition-all ${
                    verse.pinned ? 'bg-white text-[#004098]' : 'bg-white/20 text-white hover:bg-white/40'
                  }`}
                  title={verse.pinned ? "잠금화면에서 제거" : "잠금화면에 추가"}
                >
                  {verse.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                </button>
              )}
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Lock className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">나의 묵상</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                {new Date(verse.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LockScreen({ verses, showVerse, onToggleVerse, onClose, onDeleteVerse }: { 
  verses: Verse[]; 
  showVerse: boolean;
  onToggleVerse: () => void;
  onClose: () => void;
  onDeleteVerse: (id: string) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVerse = verses[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black"
    >
      {currentVerse && (
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 w-full h-full" 
            style={{ backgroundColor: currentVerse.background }}
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVerse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-8 font-bold">
                  {currentVerse.category}
                </p>
                <h1 className="text-white text-3xl font-serif italic leading-relaxed mb-6 drop-shadow-2xl">
                  "{currentVerse.text}"
                </h1>
                <p className="text-white/80 text-sm tracking-widest font-bold uppercase">
                  — {currentVerse.reference}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-12 left-0 right-0 px-8 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : verses.length - 1))}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev < verses.length - 1 ? prev + 1 : 0))}
            className="w-12 h-12 rounded-full bg-[#004098] flex items-center justify-center text-white shadow-lg shadow-blue-900/50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
