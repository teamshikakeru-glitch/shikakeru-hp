'use client'

import { useEffect, useRef, useState } from 'react'
import './home.css'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ltoRef = useRef<HTMLDivElement>(null)
  const lbodyRef = useRef<HTMLDivElement>(null)
  const lfromRef = useRef<HTMLDivElement>(null)
  const p1Ref = useRef<HTMLDivElement>(null)
  const p1tRef = useRef<HTMLSpanElement>(null)
  const p2Ref = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const hbgRef = useRef<HTMLButtonElement>(null)
  const mobRef = useRef<HTMLDivElement>(null)
  const [mobOpen, setMobOpen] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [hbgOpen, setHbgOpen] = useState(false)

  // Star canvas
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const cx = cv.getContext('2d')!

    function resize() {
      const r = cv!.parentElement!.getBoundingClientRect()
      cv!.width = r.width; cv!.height = r.height
    }
    resize()
    window.addEventListener('resize', resize)

    const STARS = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random(),
      r: .2 + Math.random() * 1.3,
      a: .15 + Math.random() * .6,
      sp: .007 + Math.random() * .013,
      ph: Math.random() * Math.PI * 2,
    }))
    const shoots: { x:number;y:number;len:number;sp:number;t:number;a:number;ang:number }[] = []

    function addShoot() {
      shoots.push({ x: Math.random()*.7+.05, y: Math.random()*.4, len: 70+Math.random()*110, sp: .003+Math.random()*.003, t: 0, a: .6+Math.random()*.4, ang: Math.PI*.18 })
    }
    const t1 = setTimeout(() => { addShoot(); }, 2000)
    const t2 = setInterval(addShoot, 3400)

    let raf: number
    function draw() {
      const W = cv!.width, H = cv!.height
      cx.clearRect(0, 0, W, H)
      const nb = cx.createRadialGradient(W*.55,H*.38,0,W*.55,H*.38,W*.5)
      nb.addColorStop(0,'rgba(28,58,165,.12)'); nb.addColorStop(1,'rgba(5,14,42,0)')
      cx.fillStyle = nb; cx.fillRect(0,0,W,H)
      const nb2 = cx.createRadialGradient(W*.18,H*.72,0,W*.18,H*.72,W*.32)
      nb2.addColorStop(0,'rgba(55,18,110,.07)'); nb2.addColorStop(1,'rgba(5,14,42,0)')
      cx.fillStyle = nb2; cx.fillRect(0,0,W,H)
      STARS.forEach(s => {
        s.ph += s.sp
        const a = s.a * (.55 + .45*Math.sin(s.ph))
        cx.fillStyle = `rgba(215,230,255,${a})`
        cx.beginPath(); cx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2); cx.fill()
        if (s.r > 1.1) {
          cx.strokeStyle = `rgba(200,220,255,${a*.35})`; cx.lineWidth = .5
          const sz=s.r*3.5, px=s.x*W, py=s.y*H
          cx.beginPath(); cx.moveTo(px-sz,py); cx.lineTo(px+sz,py); cx.stroke()
          cx.beginPath(); cx.moveTo(px,py-sz); cx.lineTo(px,py+sz); cx.stroke()
        }
      })
      for (let i = shoots.length-1; i >= 0; i--) {
        const s = shoots[i]; s.t += s.sp
        if (s.t > 1) { shoots.splice(i,1); continue }
        const ease = s.t<.2 ? s.t/.2 : s.t>.8 ? (1-s.t)/.2 : 1
        const px=(s.x+Math.cos(s.ang)*s.t*.55)*W
        const py=(s.y+Math.sin(s.ang)*s.t*.55)*H
        const tx=px-Math.cos(s.ang)*s.len*ease
        const ty=py-Math.sin(s.ang)*s.len*ease
        const g=cx.createLinearGradient(tx,ty,px,py)
        g.addColorStop(0,'rgba(200,225,255,0)'); g.addColorStop(1,`rgba(235,245,255,${s.a*ease})`)
        cx.strokeStyle=g; cx.lineWidth=1.1
        cx.beginPath(); cx.moveTo(tx,ty); cx.lineTo(px,py); cx.stroke()
        const hg=cx.createRadialGradient(px,py,0,px,py,3.5)
        hg.addColorStop(0,`rgba(255,255,255,${s.a*ease})`); hg.addColorStop(1,'rgba(200,225,255,0)')
        cx.fillStyle=hg; cx.beginPath(); cx.arc(px,py,3.5,0,Math.PI*2); cx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearInterval(t2); window.removeEventListener('resize', resize) }
  }, [])

  // Letter animation
  useEffect(() => {
    const msgs = [
      { to:'田中ご遺族様へ', lines:['葬儀に参列できず、','申し訳ございません。','','お父様のご冥福を','心よりお祈りしております。','','いつでも連絡ください。'], from:'大阪より　山田 花子', amt:'¥10,000 送金完了' },
      { to:'佐藤ご遺族様へ', lines:['遠くにいても、','ずっと一緒にいます。','','おじさんには','たくさんお世話になりました。','','ありがとうございました。'], from:'東京より　鈴木 一郎', amt:'¥30,000 送金完了' },
      { to:'高橋ご遺族様へ', lines:['急なことで、','言葉が見つかりません。','','でも、あなたの笑顔は','絶対に忘れません。','','心よりご冥福をお祈りします。'], from:'北海道より　伊藤 美咲', amt:'¥5,000 送金完了' },
    ]
    let mi = 0, ci = 0, dt = '', ft = ''
    const lto = ltoRef.current!, lb = lbodyRef.current!, lf = lfromRef.current!
    const p1 = p1Ref.current!, p1t = p1tRef.current!, p2 = p2Ref.current!
    const cur = document.createElement('span'); cur.className = 'sk-l-cursor'
    const timers: ReturnType<typeof setTimeout>[] = []

    function buildFull() { return msgs[mi % msgs.length].lines.join('\n') }

    function type() {
      if (ci < ft.length) {
        dt += ft[ci++]; lb.textContent = dt; lb.appendChild(cur)
        const c = ft[ci-1]
        const delay = c==='\n' ? 230 : (c==='。'||c==='、') ? 130 : 46+Math.random()*26
        timers.push(setTimeout(type, delay))
      } else {
        lf.textContent = msgs[mi%msgs.length].from
        p1t.textContent = msgs[mi%msgs.length].amt
        timers.push(setTimeout(() => p1.classList.add('on'), 400))
        timers.push(setTimeout(() => p2.classList.add('on'), 1100))
        timers.push(setTimeout(next, 4400))
      }
    }

    function next() {
      p1.classList.remove('on'); p2.classList.remove('on')
      ;[lto, lb, lf].forEach(e => { e.style.transition='opacity .48s'; e.style.opacity='0' })
      timers.push(setTimeout(() => {
        mi++; dt=''; ci=0; ft=buildFull()
        lto.textContent = msgs[mi%msgs.length].to
        lb.textContent=''; lb.appendChild(cur); lf.textContent=''
        ;[lto, lb, lf].forEach(e => e.style.opacity='1')
        timers.push(setTimeout(type, 480))
      }, 580))
    }

    lto.textContent = msgs[0].to; ft = buildFull(); lb.appendChild(cur)
    timers.push(setTimeout(type, 1000))
    return () => timers.forEach(clearTimeout)
  }, [])

  // Nav scroll
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') })
    }, { threshold: .1 })
    document.querySelectorAll('.rv').forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [])

  const closeMob = () => { setMobOpen(false); setHbgOpen(false) }

  return (
    <>
      {/* NAV */}
      <nav ref={navRef} className={`sk-nav${navScrolled ? ' scrolled' : ''}`}>
        <a className="sk-logo" href="#">SHIKAKERU</a>
        <div className="sk-nav-right">
          <ul className="sk-nav-links">
            <li><a href="#vision">Vision</a></li>
            <li><a href="#services">事業</a></li>
            <li><a href="#company">会社概要</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="#contact" className="sk-nav-cta">お問い合わせ</a>
          <button ref={hbgRef} className={`sk-hbg${hbgOpen ? ' open' : ''}`} onClick={() => { setHbgOpen(v=>!v); setMobOpen(v=>!v) }}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>
      <div ref={mobRef} className={`sk-mob${mobOpen ? ' open' : ''}`}>
        <a href="#vision" onClick={closeMob}>Vision</a>
        <a href="#services" onClick={closeMob}>事業</a>
        <a href="#company" onClick={closeMob}>会社概要</a>
        <a href="#contact" onClick={closeMob}>Contact</a>
        <a href="#contact" className="sk-mob-cta" onClick={closeMob}>お問い合わせ</a>
      </div>

      {/* HERO */}
      <section id="hero" className="sk-hero">
        <div className="sk-hero-left">
          <div className="sk-eyebrow">
            <span className="sk-eyebrow-dot"/>
            <span className="sk-eyebrow-txt">FUKUI, JAPAN — EST. 2025</span>
          </div>
          <h1 className="sk-h1">生きる<span className="sk-h1-blu">仕掛け</span>を、<br/>社会へ。</h1>
          <p className="sk-h-en">Make Life Alive.</p>
          <p className="sk-h-desc">
            人生が動く瞬間は、たいてい偶然のように訪れる。<br/>
            でもその多くは、誰かが仕掛けたものかもしれない。<br/>
            SHIKAKERUは、見えない縁を見える様にする。
          </p>
          <div className="sk-h-btns">
            <a href="#services" className="sk-btn-dark">事業を見る</a>
            <a href="#contact" className="sk-btn-bdr">お問い合わせ</a>
          </div>
        </div>
        <div className="sk-hero-right">
          <canvas ref={canvasRef} className="sk-star-canvas"/>
          <div className="sk-l-wrap">
            <div className="sk-l-shadow"/>
            <div className="sk-l-shadow"/>
            <div className="sk-l-card">
              <div className="sk-l-stamp">
                <span className="sk-l-stamp-sm">香典</span>
                <span className="sk-l-stamp-ch">礼</span>
              </div>
              <div className="sk-l-to" ref={ltoRef}/>
              <div className="sk-l-body" ref={lbodyRef}/>
              <div className="sk-l-from" ref={lfromRef}/>
            </div>
            <div className="sk-pill sk-pill-top" ref={p1Ref}>
              <span className="sk-pill-dot"/><span ref={p1tRef}/>
            </div>
            <div className="sk-pill sk-pill-bot" ref={p2Ref}>
              <span className="sk-pill-dot"/>メッセージが届きました
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="sk-marquee">
        <div className="sk-marquee-track">
          {[...Array(2)].map((_,i) => (
            <span key={i} style={{display:'contents'}}>
              <span className="sk-mi lit">Make Life Alive.</span><span className="sk-mi">生きる仕掛けを。</span>
              <span className="sk-mi lit">Spark Life.</span><span className="sk-mi">見えない縁を、見える様に。</span>
              <span className="sk-mi lit">Start Before You&apos;re Ready.</span><span className="sk-mi">定数を変数に変える。</span>
              <span className="sk-mi lit">Choose the Bold Path.</span><span className="sk-mi">業界を変える。</span>
            </span>
          ))}
        </div>
      </div>

      {/* VALUES */}
      <section className="sk-sec" id="vision" style={{background:'var(--white)'}}>
        <div className="sk-inner">
          <div className="rv">
            <div className="sk-ey"><span className="sk-ey-line"/><span className="sk-ey-text">VALUES</span></div>
            <h2 className="sk-sh">私たちの価値観</h2>
            <p className="sk-sd">SHIKAKERUが大切にする、5つの行動指針。</p>
          </div>
          <div className="sk-val-grid">
            <div className="sk-vi rv d1"><p className="sk-vn">VALUE 01</p><h3>Start Before You&apos;re Ready</h3><p>完璧を待たず、まず仕掛ける。</p></div>
            <div className="sk-vi rv d2"><p className="sk-vn">VALUE 02</p><h3>Move Hearts</h3><p>人の心が動くかどうかを、すべての判断基準にする。</p></div>
            <div className="sk-vi rv d3"><p className="sk-vn">VALUE 03</p><h3>Create the Chance</h3><p>人生が動くきっかけをつくり続ける。</p></div>
            <div className="sk-vi rv d4"><p className="sk-vn">VALUE 04</p><h3>Build with Co-Conspirators</h3><p>共犯者と未来をつくる。</p></div>
            <div className="sk-vi rv d5"><p className="sk-vn">VALUE 05</p><h3>Choose the Bold Path</h3><p>安全より挑戦を選ぶ。</p></div>
            <div className="sk-vi" style={{background:'var(--off)'}}/>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="sk-mission">
        <div className="sk-mission-inner rv">
          <p className="sk-mission-label">MISSION</p>
          <h2 className="sk-mission-title">Spark <span className="ac">Life.</span></h2>
          <p className="sk-mission-body">
            人の心に火をつけ、人生が動き出すきっかけをつくる。<br/><br/>
            私たちは事業を通じて、一人ひとりの人生に「仕掛け」を届け続ける。<br/>
            それが、SHIKAKERUの存在理由です。
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="sk-sec" id="services" style={{background:'var(--off)'}}>
        <div className="sk-inner">
          <div className="rv">
            <div className="sk-ey"><span className="sk-ey-line"/><span className="sk-ey-text">SERVICES</span></div>
            <h2 className="sk-sh">事業紹介</h2>
            <p className="sk-sd">葬儀業界を起点に、見えない縁を見える様にするテクノロジーを届けています。</p>
          </div>
          <div className="sk-svc-grid">
            <div className="sk-sc rv d2">
              <div className="sk-sc-bar"/>
              <span className="sk-sc-tag">Remote Condolence System</span>
              <h3 className="sk-sc-name">礼</h3>
              <p className="sk-sc-en">REI</p>
              <p className="sk-sc-desc">葬儀に参列できない方が、スマートフォンからオンラインで香典・お悔やみの気持ちを届けられる遠隔献杯システム。遠方からの香典送付を仕組み化し、葬儀社の新たな価値提供を実現します。</p>
              <ul className="sk-sc-list">
                <li>スマートフォンからオンライン香典を送金</li>
                <li>お悔やみメッセージの送信</li>
                <li>Stripe決済による安全な処理</li>
                <li>遺族向けダッシュボードで一括管理</li>
              </ul>
              <a href="https://www.smartkenpai.com/rei-lp.html" target="_blank" rel="noopener noreferrer" className="sk-sc-link">サービス詳細を見る</a>
            </div>
            <div className="sk-sc c2 rv d3">
              <div className="sk-sc-bar"/>
              <span className="sk-sc-tag">LINE × AI Custom Development</span>
              <h3 className="sk-sc-name">LINE × AI</h3>
              <p className="sk-sc-en">CUSTOM BUILD</p>
              <p className="sk-sc-desc">公式LINEとAIを組み合わせた、御社だけのシステムをゼロから開発します。業務効率化・顧客対応の自動化・独自ツールの構築まで、0→1のプロダクト開発を伴走します。</p>
              <ul className="sk-sc-list">
                <li>公式LINE × AI の完全カスタム開発</li>
                <li>業務フローに合わせたゼロベース設計</li>
                <li>チャットボット・自動応答・CRM連携</li>
                <li>導入後の運用・改善サポート</li>
              </ul>
              <a href="#contact" className="sk-sc-link">開発について相談する</a>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="sk-phil">
        <div className="sk-phil-inner rv">
          <div className="sk-ey wt" style={{justifyContent:'center',marginBottom:'18px'}}>
            <span className="sk-ey-line"/><span className="sk-ey-text">OUR PHILOSOPHY</span>
          </div>
          <h2 className="sk-phil-title">見えない縁を、<br/><span className="hl">見える様に。</span></h2>
          <p className="sk-phil-body">
            距離があっても、時間が経っていても、人と人のつながりは消えない。<br/><br/>
            SHIKAKERUは、テクノロジーの力でそのつながりを可視化し、<br/>
            「定数」だと思われていたことを「変数」に変えていく。<br/><br/>
            葬儀業界から始まり、すべての人生が動き出す社会へ。
          </p>
        </div>
      </section>

      {/* BIG TICKER */}
      <div className="sk-bticker">
        <div className="sk-bticker-track">
          {[...Array(2)].map((_,i) => (
            <span key={i} style={{display:'contents'}}>
              <span className="sk-bti l">生きる仕掛けを。</span><span className="sk-bti">Make Life Alive.</span>
              <span className="sk-bti l">見えない縁を、見える様に。</span><span className="sk-bti">Spark Life.</span>
              <span className="sk-bti l">定数を変数に変える。</span><span className="sk-bti">Choose the Bold Path.</span>
            </span>
          ))}
        </div>
      </div>

      {/* CEO MESSAGE */}
      <section className="sk-ceo-sec">
        <div className="sk-ceo-inner rv">
          <div className="sk-ey"><span className="sk-ey-line"/><span className="sk-ey-text">MESSAGE</span></div>
          <blockquote className="sk-ceo-quote">
            葬儀は、人が最も「生きている」と感じる瞬間に<br/>
            隣り合っている場所だと思っています。
          </blockquote>
          <p className="sk-ceo-body">
            日本では今、多くの人が「行きたくても行けない葬儀」に直面しています。遠方に住んでいる。仕事が休めない。それでも、誰かの死に向き合いたい気持ちは、距離では消えません。<br/><br/>
            SHIKAKERUは、その「届けられなかった気持ち」を届けられる仕組みをつくっています。テクノロジーは、人の温かさに取って代わるものではなく、人の温かさが届く距離を伸ばすものだと信じているからです。<br/><br/>
            葬儀業界から始まりますが、私たちのゴールはもっと先にあります。見えない縁を見える様にし、人の人生が動き出すきっかけを、社会に仕掛け続けること。それが、SHIKAKERUの存在理由です。
          </p>
          <div className="sk-ceo-sig">
            <div className="sk-ceo-badge"><span>礼</span></div>
            <div>
              <p className="sk-ceo-name">中川 航輝</p>
              <p className="sk-ceo-role">Representative Director / CEO</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY */}
      <section className="sk-sec" id="company" style={{background:'var(--white)'}}>
        <div className="sk-inner-sm">
          <div className="rv">
            <div className="sk-ey"><span className="sk-ey-line"/><span className="sk-ey-text">COMPANY</span></div>
            <h2 className="sk-sh">会社概要</h2>
          </div>
          <div className="sk-co-table rv d2">
            <div className="sk-co-row">
              <div className="sk-co-cell"><span className="sk-co-key">会社名</span><span className="sk-co-val">株式会社SHIKAKERU</span></div>
              <div className="sk-co-cell"><span className="sk-co-key">設立</span><span className="sk-co-val">2025年12月</span></div>
            </div>
            <div className="sk-co-row">
              <div className="sk-co-cell"><span className="sk-co-key">資本金</span><span className="sk-co-val">300万円</span></div>
              <div className="sk-co-cell"><span className="sk-co-key">代表取締役</span><span className="sk-co-val">中川 航輝</span></div>
            </div>
            <div className="sk-co-row">
              <div className="sk-co-cell"><span className="sk-co-key">所在地</span><span className="sk-co-val">福井県福井市文京2-26-2</span></div>
              <div className="sk-co-cell"><span className="sk-co-key">取引銀行</span><span className="sk-co-val">福井銀行</span></div>
            </div>
            <div className="sk-co-row full">
              <div className="sk-co-cell"><span className="sk-co-key">事業内容</span><span className="sk-co-val">遠隔献杯システム「礼（Rei）」の開発・運営　／　公式LINE × AIカスタムシステムの開発</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="sk-sec" id="contact" style={{background:'var(--off)',borderTop:'1px solid var(--bdr)'}}>
        <div className="sk-ct-inner">
          <div className="rv">
            <div className="sk-ey" style={{justifyContent:'center'}}><span className="sk-ey-line"/><span className="sk-ey-text">CONTACT</span></div>
            <h2 className="sk-sh">お問い合わせ</h2>
            <p className="sk-ct-desc">葬儀社様のご導入相談、投資家様のお問い合わせ、<br/>採用・開発依頼など、お気軽にご連絡ください。</p>
          </div>
          <div className="sk-ct-btns rv d2">
            <a href="mailto:team.shikakeru@gmail.com" className="sk-ct-btn mail">メールで問い合わせる</a>
            <a href="https://lin.ee/tM9hty4" target="_blank" rel="noopener noreferrer" className="sk-ct-btn line">LINEで問い合わせる</a>
            <a href="https://x.com/end_of_office" target="_blank" rel="noopener noreferrer" className="sk-ct-btn x-btn">X をフォローする</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sk-footer">
        <div>
          <div className="sk-f-logo" style={{marginBottom:'10px'}}>SHIKAKERU</div>
          <div className="sk-f-links">
            <a href="/terms">プライバシーポリシー</a>
            <a href="/terms">利用規約</a>
          </div>
        </div>
        <span className="sk-f-copy">© 2025 株式会社SHIKAKERU. All rights reserved.</span>
      </footer>
    </>
  )
}