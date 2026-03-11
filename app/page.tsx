'use client';
import { useEffect } from 'react';
import './home.css';

export default function Home() {
  useEffect(() => {
    /* CURSOR */
    const cur = document.getElementById('sk-cur')!;
    const ring = document.getElementById('sk-ring')!;
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    };
    document.addEventListener('mousemove', onMove);
    let raf: number;
    const animRing = () => {
      rx += (mx - rx) * .1; ry += (my - ry) * .1;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      raf = requestAnimationFrame(animRing);
    };
    animRing();
    const hoverEls = document.querySelectorAll('a,button');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => { cur.classList.add('big'); ring.classList.add('big'); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('big'); ring.classList.remove('big'); });
    });

    /* STARS */
    const cv = document.getElementById('sk-star-canvas') as HTMLCanvasElement;
    const ctx = cv.getContext('2d')!;
    const resize = () => { const r = cv.parentElement!.getBoundingClientRect(); cv.width = r.width; cv.height = r.height; };
    resize();
    window.addEventListener('resize', resize);
    const STARS = Array.from({ length: 200 }, () => ({ x: Math.random(), y: Math.random(), r: .2 + Math.random() * 1.3, a: .15 + Math.random() * .6, sp: .007 + Math.random() * .013, ph: Math.random() * Math.PI * 2 }));
    const shoots: { x: number; y: number; len: number; sp: number; t: number; a: number; ang: number }[] = [];
    const addShoot = () => shoots.push({ x: Math.random() * .7 + .05, y: Math.random() * .4, len: 70 + Math.random() * 110, sp: .003 + Math.random() * .003, t: 0, a: .6 + Math.random() * .4, ang: Math.PI * .18 });
    const st1 = setTimeout(() => { addShoot(); }, 2000);
    const iv1 = setInterval(addShoot, 3400);
    const drawStars = () => {
      const W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      const nb = ctx.createRadialGradient(W * .55, H * .38, 0, W * .55, H * .38, W * .5);
      nb.addColorStop(0, 'rgba(28,58,165,.12)'); nb.addColorStop(1, 'rgba(5,14,42,0)');
      ctx.fillStyle = nb; ctx.fillRect(0, 0, W, H);
      STARS.forEach(s => {
        s.ph += s.sp;
        const a = s.a * (.55 + .45 * Math.sin(s.ph));
        ctx.fillStyle = `rgba(215,230,255,${a})`; ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill();
        if (s.r > 1.1) { ctx.strokeStyle = `rgba(200,220,255,${a * .35})`; ctx.lineWidth = .5; const sz = s.r * 3.5, px = s.x * W, py = s.y * H; ctx.beginPath(); ctx.moveTo(px - sz, py); ctx.lineTo(px + sz, py); ctx.stroke(); ctx.beginPath(); ctx.moveTo(px, py - sz); ctx.lineTo(px, py + sz); ctx.stroke(); }
      });
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i]; s.t += s.sp;
        if (s.t > 1) { shoots.splice(i, 1); continue; }
        const ease = s.t < .2 ? s.t / .2 : s.t > .8 ? (1 - s.t) / .2 : 1;
        const px = (s.x + Math.cos(s.ang) * s.t * .55) * W, py = (s.y + Math.sin(s.ang) * s.t * .55) * H;
        const tx = px - Math.cos(s.ang) * s.len * ease, ty = py - Math.sin(s.ang) * s.len * ease;
        const g = ctx.createLinearGradient(tx, ty, px, py);
        g.addColorStop(0, 'rgba(200,225,255,0)'); g.addColorStop(1, `rgba(235,245,255,${s.a * ease})`);
        ctx.strokeStyle = g; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(px, py); ctx.stroke();
        const hg = ctx.createRadialGradient(px, py, 0, px, py, 3.5);
        hg.addColorStop(0, `rgba(255,255,255,${s.a * ease})`); hg.addColorStop(1, 'rgba(200,225,255,0)');
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(drawStars);
    };
    drawStars();

    /* H1 CHAR ANIMATION */
    const h1el = document.getElementById('sk-h1')!;
    const parts = [
      { text: '生きる', cls: '' },
      { text: '仕掛け', cls: 'sk-blu' },
      { text: 'を、', cls: '' },
      { text: '\n', cls: 'br' },
      { text: '社会へ。', cls: '' },
    ];
    parts.forEach(p => {
      if (p.cls === 'br') { h1el.appendChild(document.createElement('br')); return; }
      const wrap = p.cls ? Object.assign(document.createElement('span'), { className: p.cls }) : null;
      p.text.split('').forEach((ch, i) => {
        const s = document.createElement('span');
        s.className = 'ch'; s.style.animationDelay = (0.55 + i * .05) + 's';
        s.textContent = ch === ' ' ? '\u00a0' : ch;
        if (wrap) wrap.appendChild(s); else h1el.appendChild(s);
      });
      if (wrap) h1el.appendChild(wrap);
    });
    const t2 = setTimeout(() => {
      const blu = h1el.querySelector('.sk-blu') as HTMLElement;
      if (blu) { blu.classList.add('glitch'); blu.setAttribute('data-text', blu.textContent || ''); }
    }, 1800);

    /* INTRO */
    const intro = document.getElementById('sk-intro')!;
    intro.classList.add('hide');
    intro.addEventListener('animationend', () => { intro.style.display = 'none'; });

    /* MAGNETIC BUTTON */
    document.querySelectorAll<HTMLElement>('.sk-btn-p').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .28}px,${(e.clientY - r.top - r.height / 2) * .28}px)`;
        btn.classList.add('mag-hover');
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; btn.classList.remove('mag-hover'); });
    });

    /* LETTER ANIMATION */
    const msgs = [
      { to: '田中ご遺族様へ', lines: ['葬儀に参列できず、', '申し訳ございません。', '', 'お父様のご冥福を', '心よりお祈りしております。', '', 'いつでも連絡ください。'], from: '大阪より　山田 花子', amt: '¥10,000 送金完了' },
      { to: '佐藤ご遺族様へ', lines: ['遠くにいても、', 'ずっと一緒にいます。', '', 'おじさんには', 'たくさんお世話になりました。', '', 'ありがとうございました。'], from: '東京より　鈴木 一郎', amt: '¥30,000 送金完了' },
      { to: '高橋ご遺族様へ', lines: ['急なことで、', '言葉が見つかりません。', '', 'でも、あなたの笑顔は', '絶対に忘れません。', '', '心よりご冥福をお祈りします。'], from: '北海道より　伊藤 美咲', amt: '¥5,000 送金完了' },
    ];
    let mi = 0, ci = 0, dt = '', ft = '';
    const lto = document.getElementById('sk-lto')!;
    const lb = document.getElementById('sk-lbody')!;
    const lf = document.getElementById('sk-lfrom')!;
    const p1 = document.getElementById('sk-p1')!;
    const p1t = document.getElementById('sk-p1t')!;
    const p2 = document.getElementById('sk-p2')!;
    const lcur = document.createElement('span'); lcur.className = 'sk-lcursor';
    const buildFull = () => msgs[mi % msgs.length].lines.join('\n');
    const type = () => {
      if (ci < ft.length) {
        dt += ft[ci++]; lb.textContent = dt; lb.appendChild(lcur);
        const c = ft[ci - 1];
        setTimeout(type, c === '\n' ? 230 : (c === '。' || c === '、') ? 130 : 46 + Math.random() * 26);
      } else {
        lf.textContent = msgs[mi % msgs.length].from;
        p1t.textContent = msgs[mi % msgs.length].amt;
        setTimeout(() => p1.classList.add('on'), 400);
        setTimeout(() => p2.classList.add('on'), 1100);
        setTimeout(next, 4400);
      }
    };
    const next = () => {
      p1.classList.remove('on'); p2.classList.remove('on');
      [lto, lb, lf].forEach(e => { e.style.transition = 'opacity .48s'; e.style.opacity = '0'; });
      setTimeout(() => {
        mi++; dt = ''; ci = 0; ft = buildFull();
        lto.textContent = msgs[mi % msgs.length].to;
        lb.textContent = ''; lb.appendChild(lcur); lf.textContent = '';
        [lto, lb, lf].forEach(e => e.style.opacity = '1');
        setTimeout(type, 480);
      }, 580);
    };
    lto.textContent = msgs[0].to; ft = buildFull(); lb.appendChild(lcur);
    const t3 = setTimeout(type, 1000);

    /* NAV SCROLL */
    const onScroll = () => {
      document.getElementById('sk-nav')!.classList.toggle('sc', window.scrollY > 10);
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      const prog = document.getElementById('sk-prog')!;
      prog.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* HAMBURGER */
    const hbg = document.getElementById('sk-hbg')!;
    const mob = document.getElementById('sk-mob')!;
    hbg.addEventListener('click', () => { hbg.classList.toggle('open'); mob.classList.toggle('open'); });
    document.querySelectorAll('.sk-ml').forEach(a => a.addEventListener('click', () => { hbg.classList.remove('open'); mob.classList.remove('open'); }));

    /* CEO LINE HIGHLIGHT */
    const ceoEl = document.getElementById('sk-ceo-body')!;
    if (ceoEl) {
      const raw = ceoEl.innerText;
      const sentences = raw.split(/(?<=。)\s*/g).filter(s => s.trim());
      ceoEl.innerHTML = sentences.map(s => `<span class="sk-ceo-line">${s.trim()}</span>`).join('');
      const lines = ceoEl.querySelectorAll<HTMLElement>('.sk-ceo-line');
      const updateLines = () => {
        const mid = window.innerHeight * .52;
        lines.forEach(ln => {
          const r = ln.getBoundingClientRect();
          ln.classList.toggle('lit', Math.abs((r.top + r.bottom) / 2 - mid) < window.innerHeight * .28);
        });
      };
      window.addEventListener('scroll', updateLines, { passive: true });
      updateLines();
    }

    /* REVEAL */
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }), { threshold: .08 });
    document.querySelectorAll('.rv,.rvl,.rvr,.rvs').forEach(e => io.observe(e));

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(st1); clearTimeout(t2); clearTimeout(t3);
      clearInterval(iv1);
      io.disconnect();
    };
  }, []);

  return (
    <>
      {/* INTRO */}
      <div className="sk-intro" id="sk-intro"><span className="sk-intro-logo">SHIKAKERU</span></div>
      <div className="sk-prog" id="sk-prog"></div>
      <div className="sk-cursor" id="sk-cur"></div>
      <div className="sk-cursor-ring" id="sk-ring"></div>

      {/* NAV */}
      <nav className="sk-nav" id="sk-nav">
        <a className="sk-logo" href="#">SHIKAKERU</a>
        <div className="sk-nav-r">
          <ul className="sk-nav-links">
            <li><a href="#vision">Vision</a></li>
            <li><a href="#services">事業</a></li>
            <li><a href="#company">会社概要</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="#contact" className="sk-nav-cta">お問い合わせ</a>
          <button className="sk-hbg" id="sk-hbg"><span></span><span></span><span></span></button>
        </div>
      </nav>
      <div className="sk-mob" id="sk-mob">
        <a href="#vision" className="sk-ml">Vision</a>
        <a href="#services" className="sk-ml">事業</a>
        <a href="#company" className="sk-ml">会社概要</a>
        <a href="#contact" className="sk-ml">Contact</a>
        <a href="#contact" className="mc sk-ml">お問い合わせ</a>
      </div>

      {/* HERO */}
      <section className="sk-hero">
        <div className="sk-hl">
          <div className="sk-eyebrow">
            <span className="sk-eyebrow-dot"></span>
            <span className="sk-eyebrow-txt">FUKUI, JAPAN — EST. 2025</span>
          </div>
          <h1 className="sk-h1" id="sk-h1"></h1>
          <p className="sk-h-en">Make Life Alive.</p>
          <div className="sk-h-bar"></div>
          <p className="sk-h-desc">人生が動く瞬間は、たいてい偶然のように訪れる。<br />でもその多くは、誰かが仕掛けたものかもしれない。<br />SHIKAKERUは、見えない縁を見える様にする。</p>
          <div className="sk-btns">
            <a href="#services" className="sk-btn-p"><span>事業を見る</span></a>
            <a href="#contact" className="sk-btn-s">お問い合わせ</a>
          </div>
        </div>
        <div className="sk-hr">
          <canvas id="sk-star-canvas" className="sk-star-canvas"></canvas>
          <div className="sk-lw">
            <div className="sk-ls"></div><div className="sk-ls"></div>
            <div className="sk-lc">
              <div className="sk-lstamp"><span className="sk-lstamp-s">香典</span><span className="sk-lstamp-c">礼</span></div>
              <div className="sk-lto" id="sk-lto"></div>
              <div className="sk-lbody" id="sk-lbody"></div>
              <div className="sk-lfrom" id="sk-lfrom"></div>
            </div>
            <div className="sk-pill sk-p1" id="sk-p1"><span className="sk-pill-dot"></span><span id="sk-p1t"></span></div>
            <div className="sk-pill sk-p2" id="sk-p2"><span className="sk-pill-dot"></span>メッセージが届きました</div>
          </div>
          <div className="sk-sh"><div className="sk-sh-line"></div><span className="sk-sh-txt">SCROLL</span></div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="sk-mq"><div className="sk-mq-track">
        <span className="sk-mi lit">Make Life Alive.</span><span className="sk-mi">生きる仕掛けを。</span>
        <span className="sk-mi lit">Spark Life.</span><span className="sk-mi">見えない縁を、見える様に。</span>
        <span className="sk-mi lit">Start Before You&apos;re Ready.</span><span className="sk-mi">定数を変数に変える。</span>
        <span className="sk-mi lit">Choose the Bold Path.</span><span className="sk-mi">業界を変える。</span>
        <span className="sk-mi lit">Make Life Alive.</span><span className="sk-mi">生きる仕掛けを。</span>
        <span className="sk-mi lit">Spark Life.</span><span className="sk-mi">見えない縁を、見える様に。</span>
        <span className="sk-mi lit">Start Before You&apos;re Ready.</span><span className="sk-mi">定数を変数に変える。</span>
        <span className="sk-mi lit">Choose the Bold Path.</span><span className="sk-mi">業界を変える。</span>
      </div></div>

      {/* VALUES */}
      <section className="sk-sec" id="vision" style={{ background: 'var(--white)' }}>
        <div className="sk-inn">
          <div className="rv">
            <div className="sk-ey"><span className="sk-ey-line"></span><span className="sk-ey-text">VALUES</span></div>
            <h2 className="sk-bsh">私たちの<br /><span className="acc">価値観。</span></h2>
            <div className="sk-bsh-bar"></div>
            <p className="sk-bsh-sub">SHIKAKERUが大切にする、5つの行動指針。</p>
          </div>
          <div className="sk-val-grid">
            {[
              { n: '01', en: "Start Before You're Ready", ja: '完璧を待たず、\nまず仕掛ける。', desc: '完璧を待たず、まず仕掛ける。', body: 'アイデアは動き始めた瞬間に磨かれる。準備が整うのを待っていては、何も始まらない。', d: 'd1' },
              { n: '02', en: 'Move Hearts', ja: '人の心が動くかを、\n判断基準にする。', desc: '人の心が動くかどうかを、すべての判断基準にする。', body: '数字より先に、人の心が動くかどうかを問う。それがSHIKAKERUの羅針盤。', d: 'd2' },
              { n: '03', en: 'Create the Chance', ja: '人生が動く\nきっかけをつくる。', desc: '人生が動くきっかけをつくり続ける。', body: '偶然に見えるきっかけは、誰かが意図的に仕掛けたもの。その仕掛け人であり続ける。', d: 'd3' },
              { n: '04', en: 'Build with Co-Conspirators', ja: '共犯者と\n未来をつくる。', desc: '共犯者と未来をつくる。', body: '仲間ではなく共犯者。同じ未来を信じ、共にリスクを取れる人たちと走る。', d: 'd4' },
              { n: '05', en: 'Choose the Bold Path', ja: '安全より\n挑戦を選ぶ。', desc: '安全より挑戦を選ぶ。', body: '正解のない道を選ぶ勇気が、誰も見たことのない景色を見せてくれる。', d: 'd5' },
            ].map(v => (
              <div className={`sk-vi rv ${v.d}`} key={v.n}>
                <div className="sk-vi-inner">
                  <div className="sk-vi-front">
                    <p className="sk-vn">VALUE {v.n}</p>
                    <h3>{v.en}</h3>
                    <p>{v.desc}</p>
                    <span className="sk-vn-big">{v.n}</span>
                  </div>
                  <div className="sk-vi-back">
                    <p className="vb-num">VALUE {v.n}</p>
                    <p className="vb-en">{v.en}</p>
                    <p className="vb-ja">{v.ja.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</p>
                    <p className="vb-body">{v.body}</p>
                    <span className="vb-hint">HOVER</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="sk-vi" style={{ background: 'var(--off)' }}><div className="sk-vi-inner"><div className="sk-vi-front" style={{ background: 'var(--off)' }}></div></div></div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="sk-mission">
        <div className="sk-mission-inner rv">
          <p className="sk-m-label">MISSION</p>
          <h2 className="sk-bsh" style={{ color: 'var(--navy)' }}>Spark <span className="acc" style={{ color: 'var(--blue)' }}>Life.</span></h2>
          <div className="sk-bsh-bar"></div>
          <p className="sk-bsh-sub">人の心に火をつけ、人生が動き出すきっかけをつくる。</p>
          <p className="sk-bsh-sub" style={{ marginTop: '1.4em' }}>私たちは事業を通じて、一人ひとりの人生に「仕掛け」を届け続ける。それが、SHIKAKERUの存在理由です。</p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="sk-sec" id="services" style={{ background: 'var(--off)' }}>
        <div className="sk-inn">
          <div className="rv">
            <div className="sk-ey"><span className="sk-ey-line"></span><span className="sk-ey-text">SERVICES</span></div>
            <h2 className="sk-bsh">事業<span className="acc">紹介。</span></h2>
            <div className="sk-bsh-bar"></div>
            <p className="sk-bsh-sub">葬儀業界を起点に、見えない縁を見える様にするテクノロジーを届けています。</p>
          </div>
          <div className="sk-svc-grid">
            <div className="sk-sc rvl d2">
              <div className="sk-sc-num">01</div>
              <div className="sk-sc-num-bar"></div>
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
              <a href="https://www.smartkenpai.com/rei-lp.html" className="sk-sc-link">サービス詳細を見る</a>
            </div>
            <div className="sk-sc c2 rvr d3">
              <div className="sk-sc-num" style={{ color: 'var(--blue)' }}>02</div>
              <div className="sk-sc-num-bar"></div>
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
        <div className="sk-phil-inner">
          <div className="sk-ey wt rv" style={{ marginBottom: '28px' }}><span className="sk-ey-line"></span><span className="sk-ey-text">OUR PHILOSOPHY</span></div>
          <div className="sk-phil-kv rv d1">
            <div className="sk-phil-kv-left">
              <h2 className="sk-phil-big">見えない縁を、<span className="ac">見える様に。</span></h2>
            </div>
            <div className="sk-phil-kv-right">
              <p>距離があっても、時間が経っていても、人と人のつながりは消えない。</p>
              <p style={{ marginTop: '1.4em' }}>SHIKAKERUは、テクノロジーの力でそのつながりを可視化し、「定数」だと思われていたことを「変数」に変えていく。葬儀業界から始まり、すべての人生が動き出す社会へ。</p>
            </div>
          </div>
          <div className="sk-phil-pillars rv d2">
            {[
              { n: '01', title: '見えない縁を可視化する', body: '距離や時間を超えた人と人のつながりを、テクノロジーで見える形にする。' },
              { n: '02', title: '定数を変数に変える', body: '「参列できない」「届けられない」という当たり前を、仕組みで変えていく。' },
              { n: '03', title: '人生が動き出す仕掛けを', body: '葬儀業界を起点に、すべての人の人生が動き出すきっかけを社会に仕掛け続ける。' },
            ].map(p => (
              <div className="sk-phil-pillar" key={p.n}>
                <p className="sk-pp-num">{p.n}</p>
                <h3 className="sk-pp-title">{p.title}</h3>
                <p className="sk-pp-body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIG TICKER */}
      <div className="sk-bticker"><div className="sk-bticker-track">
        <span className="sk-bti l">生きる仕掛けを。</span><span className="sk-bti">Make Life Alive.</span>
        <span className="sk-bti l">見えない縁を、見える様に。</span><span className="sk-bti">Spark Life.</span>
        <span className="sk-bti l">定数を変数に変える。</span><span className="sk-bti">Choose the Bold Path.</span>
        <span className="sk-bti l">生きる仕掛けを。</span><span className="sk-bti">Make Life Alive.</span>
        <span className="sk-bti l">見えない縁を、見える様に。</span><span className="sk-bti">Spark Life.</span>
        <span className="sk-bti l">定数を変数に変える。</span><span className="sk-bti">Choose the Bold Path.</span>
      </div></div>

      {/* CEO */}
      <section className="sk-ceo-sec">
        <div className="sk-ceo-inner rv">
          <div className="sk-ey"><span className="sk-ey-line"></span><span className="sk-ey-text">MESSAGE</span></div>
          <blockquote className="sk-ceo-quote">葬儀は、人が最も「生きている」と感じる瞬間に<br />隣り合っている場所だと思っています。</blockquote>
          <p className="sk-ceo-body" id="sk-ceo-body">日本では今、多くの人が「行きたくても行けない葬儀」に直面しています。遠方に住んでいる。仕事が休めない。それでも、誰かの死に向き合いたい気持ちは、距離では消えません。SHIKAKERUは、その「届けられなかった気持ち」を届けられる仕組みをつくっています。テクノロジーは、人の温かさに取って代わるものではなく、人の温かさが届く距離を伸ばすものだと信じているからです。葬儀業界から始まりますが、私たちのゴールはもっと先にあります。見えない縁を見える様にし、人の人生が動き出すきっかけを、社会に仕掛け続けること。それが、SHIKAKERUの存在理由です。</p>
          <div className="sk-ceo-sig">
            <div className="sk-ceo-badge"><span>礼</span></div>
            <div><p className="sk-ceo-name">中川 航輝</p><p className="sk-ceo-role">Representative Director / CEO</p></div>
          </div>
        </div>
      </section>

      {/* COMPANY */}
      <section className="sk-sec" id="company" style={{ background: 'var(--white)' }}>
        <div className="sk-inn-sm">
          <div className="rv">
            <div className="sk-ey"><span className="sk-ey-line"></span><span className="sk-ey-text">COMPANY</span></div>
            <h2 className="sk-bsh">会社<span className="acc">概要。</span></h2>
            <div className="sk-bsh-bar"></div>
          </div>
          <div className="sk-co-table rv d2">
            <div className="sk-co-row"><div className="sk-co-cell"><span className="sk-co-key">会社名</span><span className="sk-co-val">株式会社SHIKAKERU</span></div><div className="sk-co-cell"><span className="sk-co-key">設立</span><span className="sk-co-val">2025年12月</span></div></div>
            <div className="sk-co-row"><div className="sk-co-cell"><span className="sk-co-key">資本金</span><span className="sk-co-val">300万円</span></div><div className="sk-co-cell"><span className="sk-co-key">代表取締役</span><span className="sk-co-val">中川 航輝</span></div></div>
            <div className="sk-co-row"><div className="sk-co-cell"><span className="sk-co-key">所在地</span><span className="sk-co-val">福井県福井市文京2-26-2</span></div><div className="sk-co-cell"><span className="sk-co-key">取引銀行</span><span className="sk-co-val">福井銀行</span></div></div>
            <div className="sk-co-row full"><div className="sk-co-cell"><span className="sk-co-key">事業内容</span><span className="sk-co-val">遠隔献杯システム「礼（Rei）」の開発・運営　／　公式LINE × AIカスタムシステムの開発</span></div></div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="sk-sec" id="contact" style={{ background: 'var(--off)', borderTop: '1px solid var(--bdr)' }}>
        <div className="sk-ct-inner">
          <div className="rv">
            <div className="sk-ey" style={{ justifyContent: 'center' }}><span className="sk-ey-line"></span><span className="sk-ey-text">CONTACT</span></div>
            <h2 className="sk-bsh" style={{ textAlign: 'center' }}>お問い<span className="acc">合わせ。</span></h2>
            <div className="sk-bsh-bar" style={{ margin: '0 auto 22px' }}></div>
            <p className="sk-ct-desc">葬儀社様のご導入相談、投資家様のお問い合わせ、<br />採用・開発依頼など、お気軽にご連絡ください。</p>
          </div>
          <div className="sk-ct-btns rv d2">
            <a href="mailto:team.shikakeru@gmail.com" className="sk-ct-btn mail">メールで問い合わせる</a>
            <a href="https://lin.ee/tM9hty4" target="_blank" rel="noopener noreferrer" className="sk-ct-btn line">LINEで問い合わせる</a>
            <a href="https://x.com/end_of_office" target="_blank" rel="noopener noreferrer" className="sk-ct-btn xbtn">X をフォローする</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sk-footer">
        <div><div className="sk-f-logo" style={{ marginBottom: '10px' }}>SHIKAKERU</div><div className="sk-f-links"><a href="/terms">プライバシーポリシー</a><a href="/terms">利用規約</a></div></div>
        <span className="sk-f-copy">© 2025 株式会社SHIKAKERU. All rights reserved.</span>
      </footer>
    </>
  );
}