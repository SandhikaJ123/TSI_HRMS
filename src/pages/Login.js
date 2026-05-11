import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Login.css';

const ease = [.25,.46,.45,.94];

/* ══════════════════════════════════════
   CANVAS — Clean geometric TSI animation
══════════════════════════════════════ */
function AnimatedCanvas() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    canvas.addEventListener('mousemove', onMouse);

    const C = { blue:'#0EA5E9', amber:'#F59E0B', orange:'#F97316', red:'#EF4444' };
    const COLS = Object.values(C);

    /* ── Hexagon grid background ── */
    const drawHexGrid = () => {
      const size = 32, cols2 = Math.ceil(canvas.width / (size * 1.73)) + 2;
      const rows2 = Math.ceil(canvas.height / (size * 1.5)) + 2;
      for (let r = -1; r < rows2; r++) {
        for (let c = -1; c < cols2; c++) {
          const x = c * size * 1.73 + (r % 2) * size * 0.866;
          const y = r * size * 1.5;
          ctx.save();
          ctx.globalAlpha = 0.04;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i * 60 - 30) * Math.PI / 180;
            const px = x + size * Math.cos(a);
            const py = y + size * Math.sin(a);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = '#0EA5E9';
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }
      }
    };

    /* ── Stat cards floating ── */
    class StatCard {
      constructor(label, val, color, x, y) {
        this.label = label; this.val = val; this.color = color;
        this.x = x; this.y = y; this.oy = y;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.012 + Math.random() * 0.008;
        this.w = 130; this.h = 56;
      }
      update(t) { this.y = this.oy + Math.sin(t * this.speed + this.phase) * 10; }
      draw() {
        const x = this.x - this.w/2, y = this.y - this.h/2;
        /* shadow */
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(x+4, y+6, this.w, this.h, 12);
        ctx.fill();
        ctx.restore();
        /* card */
        ctx.save();
        ctx.globalAlpha = 0.96;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(x, y, this.w, this.h, 12);
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, y, this.w, this.h, 12);
        ctx.stroke();
        ctx.restore();
        /* top color bar */
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, this.w, 3, [12, 12, 0, 0]);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
        /* icon dot */
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + 18, y + 22, 6, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.15;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x + 18, y + 22, 4, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
        /* label */
        ctx.save();
        ctx.fillStyle = '#94A3B8';
        ctx.font = '500 9px Inter, sans-serif';
        ctx.fillText(this.label.toUpperCase(), x + 30, y + 19);
        ctx.fillStyle = '#0F172A';
        ctx.font = '700 17px "Bricolage Grotesque", Segoe UI, sans-serif';
        ctx.fillText(this.val, x + 30, y + 38);
        ctx.restore();
      }
    }

    /* ── Animated ring/circle decoration ── */
    class Ring {
      constructor(x, y, r, color, speed) {
        this.x=x; this.y=y; this.r=r; this.color=color;
        this.angle=0; this.speed=speed; this.dotCount=6;
      }
      update() { this.angle += this.speed; }
      draw() {
        /* ring */
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 8]);
        ctx.stroke();
        ctx.restore();
        /* dots on ring */
        for (let i = 0; i < this.dotCount; i++) {
          const a = this.angle + (i / this.dotCount) * Math.PI * 2;
          const dx = this.x + this.r * Math.cos(a);
          const dy = this.y + this.r * Math.sin(a);
          ctx.save();
          ctx.globalAlpha = i % 2 === 0 ? 0.8 : 0.35;
          ctx.beginPath();
          ctx.arc(dx, dy, i % 2 === 0 ? 4 : 2.5, 0, Math.PI*2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.restore();
        }
      }
    }

    /* ── Center TSI badge ── */
    const drawBadge = (t) => {
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.45;
      const pulse = Math.sin(t * 0.02) * 4;

      /* outer glow */
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120 + pulse);
      g.addColorStop(0, 'rgba(14,165,233,.12)');
      g.addColorStop(0.5, 'rgba(249,115,22,.06)');
      g.addColorStop(1, 'transparent');
      ctx.save();
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, 140 + pulse, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();

      /* hexagon badge */
      const s = 72 + pulse * 0.3;
      ctx.save();
      ctx.globalAlpha = 0.97;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * 60 - 30) * Math.PI / 180;
        const px = cx + s * Math.cos(a);
        const py = cy + s * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(14,165,233,.2)';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.restore();

      /* hex border gradient */
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * 60 - 30) * Math.PI / 180;
        const px = cx + s * Math.cos(a);
        const py = cy + s * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = C.blue;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      /* TSI text */
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `800 28px 'Bricolage Grotesque', Segoe UI, sans-serif`;
      ctx.fillStyle = '#0F172A';
      ctx.fillText('TSI', cx - 22, cy - 4);
      ctx.fillStyle = C.orange;
      ctx.fillText('HRMS', cx + 30, cy - 4);
      ctx.font = `500 10px Inter, sans-serif`;
      ctx.fillStyle = '#94A3B8';
      ctx.letterSpacing = '2px';
      ctx.fillText('HR MANAGEMENT PLATFORM', cx, cy + 20);
      ctx.restore();
    };

    /* ── Mouse spotlight ── */
    const drawSpotlight = () => {
      const { x, y } = mouseRef.current;
      if (!x && !y) return;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 200);
      g.addColorStop(0, 'rgba(14,165,233,.06)');
      g.addColorStop(1, 'transparent');
      ctx.save();
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    /* ── Particle stream ── */
    class Spark {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.vy = -(1 + Math.random() * 1.5);
        this.vx = (Math.random() - .5) * 0.5;
        this.r  = 1.5 + Math.random() * 2.5;
        this.color = COLS[Math.floor(Math.random() * COLS.length)];
        this.alpha = 0.4 + Math.random() * 0.4;
        this.life = 1; this.decay = 0.004 + Math.random() * 0.004;
      }
      update() { this.x+=this.vx; this.y+=this.vy; this.life-=this.decay; if(this.life<=0) this.reset(); }
      draw() {
        ctx.save(); ctx.globalAlpha = this.alpha * this.life;
        ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle = this.color; ctx.fill(); ctx.restore();
      }
    }

    /* Init */
    const cx = () => canvas.width * 0.5;
    const cy = () => canvas.height * 0.45;

    const cards = [
      new StatCard('Employees', '1,248',  C.blue,   () => cx()-160, () => cy()-110),
      new StatCard('Payroll',   '₹2.4M',  C.orange, () => cx()+170, () => cy()-90),
      new StatCard('Attendance','96.4%',  C.amber,  () => cx()-170, () => cy()+120),
      new StatCard('Reviews',   '4.8 ★',  C.red,    () => cx()+165, () => cy()+110),
    ];

    const rings = [
      new Ring(() => cx(), () => cy(), 100, C.blue,   0.009),
      new Ring(() => cx(), () => cy(), 155, C.orange, -0.006),
      new Ring(() => cx(), () => cy(), 210, C.amber,  0.004),
    ];

    const sparks = Array.from({length:40}, () => new Spark());
    let t = 0;

    const drawBg = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      /* base */
      ctx.fillStyle = '#EEF5FF';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      /* top right blue */
      const g1 = ctx.createRadialGradient(canvas.width*.9, 0, 0, canvas.width*.9, 0, canvas.width*.7);
      g1.addColorStop(0,'rgba(14,165,233,.14)'); g1.addColorStop(1,'transparent');
      ctx.fillStyle = g1; ctx.fillRect(0,0,canvas.width,canvas.height);
      /* bottom left orange */
      const g2 = ctx.createRadialGradient(0,canvas.height,0,0,canvas.height,canvas.width*.6);
      g2.addColorStop(0,'rgba(249,115,22,.1)'); g2.addColorStop(1,'transparent');
      ctx.fillStyle = g2; ctx.fillRect(0,0,canvas.width,canvas.height);
    };

    const loop = () => {
      t++;
      drawBg();
      drawHexGrid();
      drawSpotlight();
      sparks.forEach(s => { s.update(); s.draw(); });

      /* update positions for cards/rings to stay centered on resize */
      cards.forEach(c => { c.x = c.x instanceof Function ? c.x() : c.x; c.y = c.y instanceof Function ? c.y() : c.y; });

      rings.forEach(r => {
        if (r.x instanceof Function) { r.ox=r.x(); r.oy_=r.y(); r.x=r.ox; r.y=r.oy_; }
        r.update(); r.draw();
      });

      drawBadge(t);

      cards.forEach(c => {
        if (c.x instanceof Function) c.x = c.x();
        if (c.y instanceof Function) c.y = c.y();
        c.oy = c.y; c.update(t); c.draw();
      });

      animRef.current = requestAnimationFrame(loop);
    };

    /* Fix: resolve function positions on first render */
    cards.forEach(c => {
      c.x = c.x instanceof Function ? c.x() : c.x;
      c.y = c.y instanceof Function ? c.y() : c.y;
      c.oy = c.y;
    });
    rings.forEach(r => {
      r.x = r.x instanceof Function ? r.x() : r.x;
      r.y = r.y instanceof Function ? r.y() : r.y;
    });

    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="lp-canvas" style={{ width:'100%', height:'100%', display:'block' }}/>;
}

/* ══ LOGIN PAGE ══ */
export default function Login({ onBack, onLogin }) {
  const [email,   setEmail]   = useState('');
  const [pw,      setPw]      = useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [rem,     setRem]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [eErr,    setEErr]    = useState('');
  const [pErr,    setPErr]    = useState('');
  const emailRef = useRef(null);

  useEffect(() => { setTimeout(() => emailRef.current?.focus(), 500); }, []);

  const valid = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const login = () => {
    let ok = true;
    if (!email)           { setEErr('Please enter your email');       ok=false; }
    else if (!valid(email)){ setEErr('Enter a valid email address');  ok=false; }
    if (!pw)              { setPErr('Please enter your password');    ok=false; }
    else if (pw.length<4) { setPErr('Password is too short');         ok=false; }
    if (!ok) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(() => onLogin?.(), 2600); }, 1800);
  };

  const onKey = e => { if (e.key === 'Enter') login(); };

  return (
    <div className="login-page">

      {/* LEFT */}
      <div className="lp-left">
        <AnimatedCanvas />
        <motion.div className="lp-logo"
          initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:.65, ease }} onClick={onBack}
        >
          <div className="lp-logo-icon">T</div>
          <div className="lp-logo-text">TSI <em>HRMS</em></div>
        </motion.div>
        <motion.div className="lp-tagline"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:.8, duration:.6 }}
        >
          <h2><span className="t1">Smart.</span> <span className="t3">Powerful.</span> Human HR.</h2>
          <p>Payroll · Attendance · Performance · People Intelligence</p>
        </motion.div>
      </div>

      {/* RIGHT */}
      <div className="lp-right">
        <div className="lr-dot-bg"/>
        <div className="lr-glow"/>
        <div className="lr-glow2"/>
        <motion.div className="lf-wrap"
          initial={{ opacity:0, x:36 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:.75, delay:.2, ease }}
        >
          <motion.button className="back-btn" onClick={onBack} whileHover={{ x:-3 }} whileTap={{ scale:.96 }}>
            ← Back to home
          </motion.button>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div key="form"
                initial={{ opacity:0, x:28 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-28 }} transition={{ duration:.38, ease }}
              >
                <div className="fh-tag"><span className="fh-dot"/> Sign In</div>
                <h1 className="fh-title">Welcome to <span>TSI</span></h1>
                <p className="fh-sub">Enter your credentials to continue</p>

                <div className="fg">
                  <label>Work Email</label>
                  <div className="fi-wrap">
                    <span className="fi-icon">✉️</span>
                    <input ref={emailRef} className={`fi ${eErr?'err':''}`}
                      type="email" placeholder="you@company.com" value={email}
                      onChange={e=>{ setEmail(e.target.value); setEErr(''); }} onKeyDown={onKey}
                    />
                  </div>
                  <AnimatePresence>
                    {eErr && <motion.div className="fi-err" initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.2}}>{eErr}</motion.div>}
                  </AnimatePresence>
                </div>

                <div className="fg">
                  <label>Password</label>
                  <div className="fi-wrap">
                    <span className="fi-icon">🔒</span>
                    <input className={`fi ${pErr?'err':''}`}
                      type={showPw?'text':'password'} placeholder="Enter your password" value={pw}
                      onChange={e=>{ setPw(e.target.value); setPErr(''); }} onKeyDown={onKey}
                    />
                    <button className="pw-eye" type="button" onClick={()=>setShowPw(!showPw)}>{showPw?'🙈':'👁️'}</button>
                  </div>
                  <AnimatePresence>
                    {pErr && <motion.div className="fi-err" initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.2}}>{pErr}</motion.div>}
                  </AnimatePresence>
                </div>

                <div className="f-row">
                  <div className="cb-wrap" onClick={()=>setRem(!rem)}>
                    <motion.div className={`cb ${rem?'on':''}`} animate={rem?{scale:[1,1.2,1]}:{}} transition={{duration:.18}}/>
                    <span className="cb-lbl">Remember me</span>
                  </div>
                  <button className="forgot">Forgot password?</button>
                </div>

                <motion.button className={`btn-go ${loading?'busy':''}`} onClick={login} whileTap={{scale:.97}} whileHover={{scale:1.01}}>
                  {loading ? <><div className="spinner"/> Signing you in…</> : <>🚀 Sign In to Dashboard</>}
                </motion.button>
                <div className="f-foot">New to TSI HRMS? <a>Request a free demo</a></div>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{duration:.5,ease}}>
                <div className="success">
                  <motion.div className="success-ring"
                    initial={{scale:0,rotate:-90}} animate={{scale:1,rotate:0}}
                    transition={{type:'spring',stiffness:200,damping:12,delay:.2}}
                  >✅</motion.div>
                  <motion.h2 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.45}}>You're in!</motion.h2>
                  <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.6}}>
                    Welcome back. Loading your<br/>TSI HRMS dashboard…
                  </motion.p>
                  <motion.div
                    initial={{width:0}} animate={{width:'100%'}}
                    transition={{delay:.85,duration:2.2,ease:'linear'}}
                    style={{height:4,borderRadius:4,background:'linear-gradient(90deg,#0EA5E9,#F59E0B,#F97316,#EF4444)',marginTop:8}}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}