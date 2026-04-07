/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Plus, ChevronRight, X, Pin, PinOff, Trash2, Download, User as UserIcon } from 'lucide-react';

// --- Types ---
interface Verse {
  id: string;
  text: string;
  reference: string;
  background: string;
  category: string;
  pinned?: boolean;
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
  createdAt: number;
}

// --- Constants ---

const Categories = ["믿음", "사랑", "소망", "기도", "능력", "평화"];

const Fonts = [
  { name: '기본', value: 'font-sans' },
  { name: '세리프', value: 'font-serif' },
  { name: '모노', value: 'font-mono' },
];

const FontSizes = [
  { name: '매우 작게', value: 'text-xs' },
  { name: '작게', value: 'text-sm' },
  { name: '중간', value: 'text-base' },
  { name: '크게', value: 'text-lg' },
  { name: '매우 크게', value: 'text-xl' },
  { name: '거대하게', value: 'text-2xl' },
  { name: '웅장하게', value: 'text-3xl' },
];

const TextAligns = [
  { name: '왼쪽', value: 'left' },
  { name: '가운데', value: 'center' },
  { name: '오른쪽', value: 'right' },
];

const VerticalAligns = [
  { name: '상단', value: 'top' },
  { name: '중앙', value: 'center' },
  { name: '하단', value: 'bottom' },
];

const Blurs = [
  { name: '없음', value: 'blur-none' },
  { name: '약하게', value: 'blur-sm' },
  { name: '중간', value: 'blur-md' },
  { name: '강하게', value: 'blur-lg' },
];

const Brightness = [
  { name: '밝게', value: 'brightness-125' },
  { name: '기본', value: 'brightness-100' },
  { name: '약간 어둡게', value: 'brightness-90' },
  { name: '어둡게', value: 'brightness-75' },
  { name: '매우 어둡게', value: 'brightness-50' },
];

const LetterSpacings = [
  { name: '좁게', value: 'tracking-tighter' },
  { name: '기본', value: 'tracking-normal' },
  { name: '넓게', value: 'tracking-wider' },
  { name: '매우 넓게', value: 'tracking-widest' },
];

const LineHeights = [
  { name: '좁게', value: 'leading-tight' },
  { name: '기본', value: 'leading-normal' },
  { name: '넓게', value: 'leading-relaxed' },
  { name: '매우 넓게', value: 'leading-loose' },
];

const BorderRadii = [
  { name: '직각', value: 'rounded-none' },
  { name: '약간 둥글게', value: 'rounded-lg' },
  { name: '둥글게', value: 'rounded-2xl' },
  { name: '매우 둥글게', value: 'rounded-3xl' },
];

const FontWeights = [
  { name: '얇게', value: 'font-light' },
  { name: '보통', value: 'font-normal' },
  { name: '중간', value: 'font-medium' },
  { name: '굵게', value: 'font-bold' },
  { name: '매우 굵게', value: 'font-black' },
];

const Colors = [
  { name: '흰색', value: '#FFFFFF' },
  { name: '검정', value: '#000000' },
  { name: '선교회 블루', value: '#004098' },
  { name: '하늘색', value: '#00A0E9' },
  { name: '그린', value: '#34D399' },
];

const Backgrounds = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000', // Mountains
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1000', // Nature
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000', // Forest
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000', // Foggy hills
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1000', // Path in woods
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=1000', // Waterfall
];

export default function App() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLockScreenOpen, setIsLockScreenOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // New Verse Form State
  const [newVerseText, setNewVerseText] = useState('');
  const [newVerseRef, setNewVerseRef] = useState('');
  const [newVerseCategory, setNewVerseCategory] = useState(Categories[0]);
  const [newVerseBg, setNewVerseBg] = useState(Backgrounds[0]);
  const [newVerseFont, setNewVerseFont] = useState(Fonts[0].value);
  const [newVerseSize, setNewVerseSize] = useState(FontSizes[1].value);
  const [newVerseColor, setNewVerseColor] = useState(Colors[0].value);
  const [newVerseBgColor, setNewVerseBgColor] = useState('rgba(0, 0, 0, 0.4)');
  const [newVerseIsPinned, setNewVerseIsPinned] = useState(true);
  const [newVerseTextAlign, setNewVerseTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [newVerseVerticalAlign, setNewVerseVerticalAlign] = useState<'top' | 'center' | 'bottom'>('center');
  const [newVerseBlur, setNewVerseBlur] = useState(Blurs[0].value);
  const [newVerseBrightness, setNewVerseBrightness] = useState(Brightness[1].value);
  const [newVerseLetterSpacing, setNewVerseLetterSpacing] = useState(LetterSpacings[1].value);
  const [newVerseLineHeight, setNewVerseLineHeight] = useState(LineHeights[2].value);
  const [newVerseBorderRadius, setNewVerseBorderRadius] = useState(BorderRadii[2].value);
  const [newVersePadding, setNewVersePadding] = useState('p-12');
  const [newVerseFontWeight, setNewVerseFontWeight] = useState(FontWeights[2].value);
  const [newVerseBorderColor, setNewVerseBorderColor] = useState('transparent');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedVerses = localStorage.getItem('jbch_verses');
    if (savedVerses) {
      try {
        setVerses(JSON.parse(savedVerses));
      } catch (e) {
        console.error('Failed to load verses:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jbch_verses', JSON.stringify(verses));
  }, [verses]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  const handleTogglePin = (verseId: string) => {
    if (navigator.vibrate) navigator.vibrate(10); // Haptic feedback
    setVerses(prev => prev.map(v => v.id === verseId ? { ...v, pinned: !v.pinned } : v));
  };

  const handleSaveVerse = () => {
    if (!newVerseText || !newVerseRef || isSaving) return;
    if (navigator.vibrate) navigator.vibrate([20, 10, 20]); // Success vibration
    setIsSaving(true);
    
    const finalCategory = showCustomCategory ? customCategory || '기타' : newVerseCategory;
    
    const newVerse: Verse = {
      id: Date.now().toString(),
      text: newVerseText,
      reference: newVerseRef,
      background: newVerseBg,
      category: finalCategory,
      pinned: newVerseIsPinned,
      fontFamily: newVerseFont,
      fontSize: newVerseSize,
      bgColor: newVerseBgColor,
      textColor: newVerseColor,
      textAlign: newVerseTextAlign,
      verticalAlign: newVerseVerticalAlign,
      bgBlur: newVerseBlur,
      bgBrightness: newVerseBrightness,
      letterSpacing: newVerseLetterSpacing,
      lineHeight: newVerseLineHeight,
      borderRadius: newVerseBorderRadius,
      padding: newVersePadding,
      fontWeight: newVerseFontWeight,
      borderColor: newVerseBorderColor,
      createdAt: Date.now(),
    };

    setVerses(prev => [newVerse, ...prev]);
    
    // Reset form
    setNewVerseText('');
    setNewVerseRef('');
    setNewVerseCategory(Categories[0]);
    setNewVerseBg(Backgrounds[0]);
    setNewVerseFont(Fonts[0].value);
    setNewVerseSize(FontSizes[2].value);
    setNewVerseColor(Colors[0].value);
    setNewVerseBgColor('rgba(0, 0, 0, 0.4)');
    setNewVerseIsPinned(true);
    setNewVerseTextAlign('center');
    setNewVerseVerticalAlign('center');
    setNewVerseBlur(Blurs[0].value);
    setNewVerseBrightness(Brightness[1].value);
    setNewVerseLetterSpacing(LetterSpacings[1].value);
    setNewVerseLineHeight(LineHeights[2].value);
    setNewVerseBorderRadius(BorderRadii[2].value);
    setNewVersePadding('p-12');
    setNewVerseFontWeight(FontWeights[2].value);
    setNewVerseBorderColor('transparent');
    setShowCustomCategory(false);
    setShowAdvancedOptions(false);
    setCustomCategory('');
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-2xl mx-auto pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#004098] rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#004098]">생명의 말씀</span>
          </div>
          <div className="flex items-center gap-3">
            {showInstallBtn && (
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#004098]/10 text-[#004098] rounded-full text-[10px] font-bold hover:bg-[#004098]/20 transition-all"
              >
                <Download className="w-3 h-3" />
                앱 설치
              </button>
            )}
            <button
              onClick={() => setIsLockScreenOpen(true)}
              className="p-2 text-slate-500 hover:text-[#004098] transition-colors"
              title="잠금화면"
            >
              <Lock className="w-6 h-6" />
            </button>
          </div>
        </header>

          {/* Add Verse Form */}
          <div className="px-6 mt-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-4 text-[#004098]">새 말씀 묵상</h2>
              <div className="space-y-4">
                <textarea
                  value={newVerseText}
                  onChange={(e) => setNewVerseText(e.target.value)}
                  placeholder="오늘의 묵상 말씀을 입력하세요..."
                  className="w-full min-h-[100px] p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#004098] transition-all resize-none text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newVerseRef}
                    onChange={(e) => setNewVerseRef(e.target.value)}
                    placeholder="예: 요한복음 3:16"
                    className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#004098] transition-all text-sm"
                  />
                  <div className="relative">
                    {!showCustomCategory ? (
                      <select
                        value={newVerseCategory}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setShowCustomCategory(true);
                          } else {
                            setNewVerseCategory(e.target.value);
                          }
                        }}
                        className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#004098] transition-all text-sm appearance-none"
                      >
                        {Categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        <option value="custom">+ 분류 추가</option>
                      </select>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="새 분류 입력"
                          className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#004098] transition-all text-sm pr-10"
                          autoFocus
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">글꼴</label>
                    <select
                      value={newVerseFont}
                      onChange={(e) => setNewVerseFont(e.target.value)}
                      className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#004098] transition-all text-sm appearance-none"
                    >
                      {Fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">크기</label>
                    <select
                      value={newVerseSize}
                      onChange={(e) => setNewVerseSize(e.target.value)}
                      className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#004098] transition-all text-sm appearance-none"
                    >
                      {FontSizes.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">글자 색상</label>
                    <div className="flex gap-2 p-2 bg-slate-50 rounded-xl">
                      {Colors.map(c => (
                        <button
                          key={c.value}
                          onClick={() => setNewVerseColor(c.value)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${newVerseColor === c.value ? 'border-[#004098] scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">배경 투명도</label>
                    <select
                      value={newVerseBgColor}
                      onChange={(e) => setNewVerseBgColor(e.target.value)}
                      className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#004098] transition-all text-sm appearance-none"
                    >
                      <option value="rgba(255, 255, 255, 0.1)">매우 투명</option>
                      <option value="rgba(255, 255, 255, 0.2)">투명</option>
                      <option value="rgba(0, 64, 152, 0.4)">선교회 블루 (투명)</option>
                      <option value="rgba(0, 0, 0, 0.5)">매우 어둡게</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">배경 이미지</label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {Backgrounds.map((bg) => (
                      <button
                        key={bg}
                        onClick={() => setNewVerseBg(bg)}
                        className={`relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                          newVerseBg === bg ? 'border-[#004098] scale-105 z-10' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={bg} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="BG" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Options Toggle */}
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="w-full py-3 flex items-center justify-between px-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Plus className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-45' : ''}`} />
                    상세 스타일 설정
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-90' : ''}`} />
                </button>

                {showAdvancedOptions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">가로 정렬</label>
                        <select
                          value={newVerseTextAlign}
                          onChange={(e) => setNewVerseTextAlign(e.target.value as any)}
                          className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm appearance-none"
                        >
                          {TextAligns.map(a => <option key={a.value} value={a.value}>{a.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">세로 정렬</label>
                        <select
                          value={newVerseVerticalAlign}
                          onChange={(e) => setNewVerseVerticalAlign(e.target.value as any)}
                          className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm appearance-none"
                        >
                          {VerticalAligns.map(a => <option key={a.value} value={a.value}>{a.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">배경 흐림(Blur)</label>
                        <select
                          value={newVerseBlur}
                          onChange={(e) => setNewVerseBlur(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm appearance-none"
                        >
                          {Blurs.map(b => <option key={b.value} value={b.value}>{b.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">배경 밝기</label>
                        <select
                          value={newVerseBrightness}
                          onChange={(e) => setNewVerseBrightness(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm appearance-none"
                        >
                          {Brightness.map(b => <option key={b.value} value={b.value}>{b.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">자간(Spacing)</label>
                        <select
                          value={newVerseLetterSpacing}
                          onChange={(e) => setNewVerseLetterSpacing(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm appearance-none"
                        >
                          {LetterSpacings.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">행간(Height)</label>
                        <select
                          value={newVerseLineHeight}
                          onChange={(e) => setNewVerseLineHeight(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm appearance-none"
                        >
                          {LineHeights.map(h => <option key={h.value} value={h.value}>{h.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">모서리 곡률</label>
                        <select
                          value={newVerseBorderRadius}
                          onChange={(e) => setNewVerseBorderRadius(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm appearance-none"
                        >
                          {BorderRadii.map(r => <option key={r.value} value={r.value}>{r.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">여백(Padding)</label>
                        <select
                          value={newVersePadding}
                          onChange={(e) => setNewVersePadding(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm appearance-none"
                        >
                          <option value="p-4">좁게</option>
                          <option value="p-8">보통</option>
                          <option value="p-12">넓게</option>
                          <option value="p-16">매우 넓게</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">글자 두께</label>
                        <select
                          value={newVerseFontWeight}
                          onChange={(e) => setNewVerseFontWeight(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm appearance-none"
                        >
                          {FontWeights.map(w => <option key={w.value} value={w.value}>{w.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">테두리 색상</label>
                        <div className="flex gap-2 p-2 bg-slate-50 rounded-xl overflow-x-auto no-scrollbar">
                          <button
                            onClick={() => setNewVerseBorderColor('transparent')}
                            className={`w-6 h-6 rounded-full border-2 transition-all shrink-0 ${newVerseBorderColor === 'transparent' ? 'border-[#004098] scale-110' : 'border-slate-300'}`}
                            title="없음"
                          >
                            <X className="w-3 h-3 mx-auto text-slate-400" />
                          </button>
                          {Colors.map(c => (
                            <button
                              key={c.value}
                              onClick={() => setNewVerseBorderColor(c.value)}
                              className={`w-6 h-6 rounded-full border-2 transition-all shrink-0 ${newVerseBorderColor === c.value ? 'border-[#004098] scale-110' : 'border-transparent'}`}
                              style={{ backgroundColor: c.value }}
                            />
                          ))}
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
                      <p className="text-sm font-bold">잠금화면에 표시</p>
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
                  onClick={handleSaveVerse}
                  disabled={!newVerseText || !newVerseRef || isSaving}
                  className="w-full py-4 bg-[#004098] text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-[#003380] transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Lock className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      말씀 등록하기
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Feed */}
          <main className="px-6 space-y-8 mt-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">말씀 피드</h3>
            {verses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-400">등록된 말씀이 없습니다.</p>
              </div>
            ) : (
              verses.map((verse) => (
                <div key={verse.id}>
                  <VerseCard
                    verse={verse}
                    onShowLockScreen={() => setIsLockScreenOpen(true)}
                    onTogglePin={() => handleTogglePin(verse.id)}
                    isAuthor={true}
                  />
                </div>
              ))
            )}
          </main>

          {/* Modals */}
          <AnimatePresence>
            {isLockScreenOpen && (
              <LockScreen
                verses={verses.filter(v => v.pinned).slice(0, 20)}
                onClose={() => setIsLockScreenOpen(false)}
                onDeleteVerse={(id) => {
                  setVerses(prev => prev.filter(v => v.id !== id));
                }}
              />
            )}
          </AnimatePresence>

          {/* Footer with Church Info */}
          <footer className="mt-12 mb-8 flex flex-col items-center justify-center gap-2 opacity-40">
            <div className="flex items-center gap-2">
              <img 
                src="https://www.jbch.org/images/common/logo.png" 
                className="w-4 h-4 object-contain grayscale" 
                alt="선교회 로고"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-medium tracking-tight">대한예수교침례회 대구달서교회</span>
            </div>
          </footer>
        </div>
    </div>
  );
}

// --- Sub-components ---

function VerseCard({ verse, onShowLockScreen, onTogglePin, isAuthor }: { 
  verse: Verse; 
  onShowLockScreen: () => void;
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
        onClick={onShowLockScreen}
      >
        <img
          src={verse.background}
          className={`absolute inset-0 w-full h-full object-cover ${verse.bgBlur || 'blur-none'} ${verse.bgBrightness || 'brightness-100'}`}
          referrerPolicy="no-referrer"
          alt="말씀 배경"
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
            <p className={`text-sm font-bold tracking-widest uppercase opacity-80 ${verse.textAlign === 'left' ? 'text-left' : verse.textAlign === 'right' ? 'text-right' : 'text-center'}`}>
              — {verse.reference}
            </p>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          {isAuthor && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 transition-all ${
                verse.pinned ? 'bg-[#004098] text-white' : 'bg-white/20 text-white hover:bg-white/40'
              }`}
              title={verse.pinned ? "잠금화면에서 제거" : "잠금화면에 추가"}
            >
              {verse.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-bold">{verse.pinned ? "잠금화면 해제" : "잠금화면 고정"}</span>
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


function LockScreen({ verses, onClose, onDeleteVerse }: { 
  verses: Verse[]; 
  onClose: () => void;
  onDeleteVerse: (id: string) => void;
}) {
  const [time, setTime] = useState(new Date());
  const mainBackground = verses[0]?.background || Backgrounds[0];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black"
    >
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={mainBackground}
          className="absolute inset-0 w-full h-full object-cover blur-[2px] opacity-60"
          referrerPolicy="no-referrer"
          alt="잠금화면 배경"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col pt-20 pb-10 px-6 text-white">
          {/* Clock & Date */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-7xl font-light tracking-tight"
            >
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </motion.h2>
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-medium opacity-90"
            >
              {time.toLocaleDateString('ko-KR', { weekday: 'long', month: 'long', day: 'numeric' })}
            </motion.p>
          </div>

          {/* Scrollable Verse List (To-do list style) */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-24">
            <AnimatePresence mode="popLayout">
              {verses.map((v, idx) => (
                  <motion.div
                    key={v.id}
                    layout
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    drag="x"
                    dragConstraints={{ left: -100, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) {
                        if (navigator.vibrate) navigator.vibrate(20);
                        onDeleteVerse(v.id);
                      }
                    }}
                    transition={{ delay: idx * 0.05 }}
                    className={`relative overflow-hidden border-2 ${v.borderRadius || 'rounded-2xl'} flex items-start gap-4 shadow-lg group cursor-grab active:cursor-grabbing`}
                    style={{ 
                      backgroundColor: v.bgColor || 'rgba(255, 255, 255, 0.1)',
                      color: v.textColor || 'white',
                      borderColor: v.borderColor || 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <div className="absolute inset-0 backdrop-blur-md -z-10" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="w-1.5 h-full bg-[#004098] absolute left-0 top-0" />
                    <div className={`flex-1 ${v.padding || 'p-4'} pr-10 ${
                      v.textAlign === 'left' ? 'text-left' :
                      v.textAlign === 'right' ? 'text-right' : 'text-center'
                    }`}>
                      <p className={`italic ${v.fontFamily || 'font-sans'} ${v.fontSize || 'text-lg'} ${v.fontWeight || 'font-medium'} ${v.letterSpacing || 'tracking-normal'} ${v.lineHeight || 'leading-relaxed'}`}>
                        "{v.text}"
                      </p>
                      <div className={`flex items-center mt-2 ${
                        v.textAlign === 'left' ? 'justify-start' :
                        v.textAlign === 'right' ? 'justify-end' : 'justify-between'
                      }`}>
                        <p className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                          — {v.reference}
                        </p>
                        {v.textAlign === 'center' && (
                          <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#004098] rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
              ))}
            </AnimatePresence>
            {verses.length === 0 && (
              <div className="text-center py-20">
                <p className="text-white/40 italic">잠금화면에 고정된 말씀이 없습니다.</p>
                <p className="text-white/20 text-xs mt-2">메인 화면에서 말씀을 고정해보세요.</p>
              </div>
            )}
          </div>

          {/* Swipe up to unlock */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={onClose}
            className="absolute bottom-12 inset-x-0 flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all">
              <ChevronRight className="w-5 h-5 -rotate-90" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">위로 밀어서 잠금 해제</span>
          </motion.button>

          {/* Church Info on Lockscreen */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 opacity-30">
            <img 
              src="https://www.jbch.org/images/common/logo.png" 
              className="w-3 h-3 object-contain brightness-0 invert" 
              alt="선교회 로고"
              referrerPolicy="no-referrer"
            />
            <span className="text-[9px] font-medium tracking-tight">대한예수교침례회 대구달서교회</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
