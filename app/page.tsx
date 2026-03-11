'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CreditCard, Share2, ChevronRight, Lock, X, Camera, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zen_Old_Mincho, Noto_Sans_JP } from 'next/font/google';
import { supabase } from '../lib/supabaseClient'; // データベース接続

// --- フォント設定 ---
const zenOldMincho = Zen_Old_Mincho({ weight: ['400', '700', '900'], subsets: ['latin'] });
const notoSansJP = Noto_Sans_JP({ weight: ['400', '500', '700'], subsets: ['latin'] });

// --- 金額フォーマッター ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
};

export default function MemorialPage() {
  const [currentStep, setCurrentStep] = useState<'home' | 'payment' | 'success'>('home');
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1516589174184-c685266e48df?q=80&w=2000");
  
  // 入力データ
  const [amount, setAmount] = useState(10000);
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState(''); // メッセージの状態を追加
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // データベースから取得したプロジェクト情報
  const [projectId, setProjectId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初回読み込み時に「佐藤家」のデータを取得する
  useEffect(() => {
    const fetchProject = async () => {
      // SQLで作った 'sato-demo' というIDの案件を探しに行く
      const { data, error } = await supabase
        .from('projects')
        .select('id, family_name')
        .eq('slug', 'sato-demo')
        .single();
      
      if (data) {
        setProjectId(data.id);
        console.log("接続成功: 佐藤家データを取得しました", data);
      } else {
        console.error("データ取得エラー:", error);
      }
    };
    fetchProject();
  }, []);

  // 画像アップロード処理（今回はプレビューのみ）
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setHeroImage(URL.createObjectURL(file));
  };

  // 決済＆データ保存実行
  const handlePayment = async () => {
    if (!projectId) {
      alert("システムエラー: 案件データが見つかりません");
      return;
    }

    setIsSubmitting(true);

    // 1. Supabaseの「transactions」テーブルにデータを保存
    const { error } = await supabase.from('transactions').insert({
      project_id: projectId,
      sender_name: senderName,
      amount: amount,
      message: message,
      net_amount: Math.floor(amount * 0.9), // 仮の手数料計算（10%引き）
      payment_method: 'credit_card'
    });

    if (error) {
      console.error("保存エラー:", error);
      alert("エラーが発生しました。もう一度お試しください。");
      setIsSubmitting(false);
    } else {
      // 2. 成功したら画面を切り替え
      // 少し待機してUXを整える
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentStep('success');
      }, 1000);
    }
  };

  return (
    <div className={`min-h-screen bg-[#FDFCF8] relative overflow-hidden text-stone-800 ${notoSansJP.className}`}>
      
      {/* ノイズテクスチャ */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply z-0"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <AnimatePresence mode="wait">
        
        {/* === STEP 1: ホーム画面 === */}
        {currentStep === 'home' && (
          <motion.main 
            key="home"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-[480px] mx-auto min-h-screen flex flex-col bg-white/50 sm:min-h-[90vh] sm:my-8 sm:rounded-[40px] sm:shadow-2xl sm:overflow-hidden sm:border sm:border-white/60"
          >
            {/* ヒーロー画像 */}
            <div className="relative h-[45vh] overflow-hidden">
              <motion.img 
                initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 10 }}
                src={heroImage} className="w-full h-full object-cover" alt="Memorial"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#FDFCF8]" />
              <button onClick={() => fileInputRef.current?.click()} className="absolute top-6 right-6 bg-white/20 backdrop-blur-xl text-white p-3 rounded-full border border-white/40 shadow-lg active:scale-90 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>

            {/* 情報エリア */}
            <div className="flex-1 px-8 -mt-24 relative z-20 flex flex-col">
              <div className="text-center mb-10">
                <p className="text-stone-500 text-[10px] tracking-[0.4em] uppercase mb-4 drop-shadow-sm text-white/90 font-medium">In Loving Memory</p>
                <h1 className={`${zenOldMincho.className} text-4xl text-stone-900 mb-3 tracking-wide drop-shadow-sm`}>
                  佐藤 太郎 <span className="text-xl font-normal opacity-60 ml-1">様</span>
                </h1>
                <p className={`${zenOldMincho.className} text-stone-500 text-sm tracking-[0.2em] opacity-80`}>
                  1950.04.15 — 2026.01.11
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.05)] border border-white/80 mb-8 flex-1">
                <p className={`${zenOldMincho.className} text-stone-700 text-[16px] leading-[2.4] text-justify tracking-wide`}>
                  生前のご厚情に深く感謝申し上げます。<br/>
                  皆様からの温かいお気持ちは、故人への最後の手向けとして、ご遺族が大切に使わせていただきます。
                </p>
                <div className="mt-8 flex justify-end items-center gap-3 opacity-60">
                  <span className="h-[1px] w-12 bg-stone-400"></span>
                  <p className="text-xs text-stone-500 tracking-widest">喪主：佐藤 一郎</p>
                </div>
              </div>

              <div className="pb-8 space-y-4">
                <button 
                  onClick={() => setCurrentStep('payment')}
                  className="group relative w-full bg-[#222] text-white py-5 rounded-2xl shadow-xl shadow-stone-900/20 overflow-hidden active:scale-[0.98] transition-all"
                >
                  <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-1000" />
                  <div className="relative flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-6 h-6 text-orange-100" />
                      <div className="text-left">
                        <span className="block text-[10px] text-stone-400 mb-0.5 tracking-wider">お気持ちを届ける</span>
                        <span className={`${zenOldMincho.className} block text-xl font-bold tracking-widest`}>献杯・支援金</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </motion.main>
        )}

        {/* === STEP 2: 決済入力画面 === */}
        {currentStep === 'payment' && (
          <motion.div 
            key="payment"
            initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-[#FDFCF8] flex flex-col sm:max-w-[480px] sm:mx-auto sm:my-8 sm:rounded-[40px] sm:border sm:border-stone-200 sm:shadow-2xl sm:overflow-hidden"
          >
            <div className="px-6 py-5 flex items-center justify-between border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <button onClick={() => setCurrentStep('home')} className="p-2 -ml-2 text-stone-400 hover:text-stone-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h2 className={`${zenOldMincho.className} text-lg font-bold text-stone-800`}>献杯の入力</h2>
              <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
              <div className="mb-10">
                <label className="block text-stone-400 text-[10px] tracking-[0.2em] uppercase mb-4 font-bold">Select Amount</label>
                <div className="grid grid-cols-2 gap-3">
                  {[3000, 5000, 10000, 30000, 50000, 100000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`relative py-5 rounded-2xl border transition-all duration-200 ${
                        amount === val 
                          ? 'border-stone-800 bg-stone-800 text-white shadow-lg scale-[1.02]' 
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      <span className={`${zenOldMincho.className} text-lg font-bold`}>{val.toLocaleString()}</span>
                      <span className="text-xs ml-1 opacity-60">円</span>
                      {amount === val && (
                        <motion.div layoutId="check" className="absolute top-2 right-2 bg-white/20 rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="group">
                  <label className="block text-stone-400 text-[10px] tracking-[0.2em] uppercase mb-2 font-bold group-focus-within:text-orange-900 transition-colors">Your Name</label>
                  <input 
                    type="text" 
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="山田 太郎"
                    className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-5 text-lg outline-none focus:ring-2 focus:ring-stone-800/10 focus:border-stone-800 transition-all placeholder:text-stone-300"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-stone-400 text-[10px] tracking-[0.2em] uppercase mb-2 font-bold group-focus-within:text-orange-900 transition-colors">Message</label>
                  <textarea 
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="心よりお悔やみ申し上げます。"
                    className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-5 text-base outline-none focus:ring-2 focus:ring-stone-800/10 focus:border-stone-800 transition-all placeholder:text-stone-300 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-stone-100 pb-8 sm:pb-6">
              <button 
                onClick={handlePayment}
                disabled={isSubmitting || !senderName}
                className="w-full bg-[#222] text-white py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.97] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 text-orange-100" />
                    <span className="text-lg font-bold tracking-widest">
                      {formatCurrency(amount)} を送る
                    </span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
                <Lock className="w-3 h-3 text-stone-500" />
                <p className="text-[10px] text-stone-500 font-medium">SSL Encrypted Secure Payment</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* === STEP 3: 完了画面 === */}
        {currentStep === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] bg-[#222] flex flex-col items-center justify-center text-white sm:max-w-[480px] sm:mx-auto sm:my-8 sm:rounded-[40px] sm:overflow-hidden"
          >
            <motion.div 
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: 0.2 }} 
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              className="absolute w-[300px] h-[300px] bg-orange-100 rounded-full blur-[100px]" 
            />

            <div className="relative z-10 text-center px-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20 backdrop-blur-md"
              >
                <Heart className="w-10 h-10 text-orange-100 fill-orange-100/20" />
              </motion.div>
              
              <motion.h2 className={`${zenOldMincho.className} text-3xl font-bold mb-4`}>献杯いたしました</motion.h2>
              <motion.p className="text-white/60 text-sm leading-relaxed mb-12">
                {senderName} 様の温かいお気持ちは、<br/>確実に記録されました。<br/>ありがとうございました。
              </motion.p>

              <motion.button 
                onClick={() => setCurrentStep('home')}
                className="bg-white text-stone-900 px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-stone-200 transition-colors"
              >
                ページに戻る
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}