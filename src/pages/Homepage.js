import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useInView, AnimatePresence } from 'framer-motion';
import './Homepage.css';

const ease = [.25,.46,.45,.94];
const spring = { type:'spring', stiffness:120, damping:14 };
const stagger = { show:{ transition:{ staggerChildren:.12 } } };
const fadeUp   = { hidden:{opacity:0,y:44}, show:{opacity:1,y:0,transition:{duration:.7,ease}} };
const fadeLeft = { hidden:{opacity:0,x:-52},show:{opacity:1,x:0,transition:{duration:.7,ease}} };

/* ── Animated Counter ── */
function Counter({ target, suffix='', duration=2000 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-60px' });
  useEffect(()=>{
    if(!inView) return;
    const steps=72, inc=target/steps; let cur=0;
    const t=setInterval(()=>{ cur+=inc; if(cur>=target){setN(target);clearInterval(t);}else setN(Math.floor(cur)); }, duration/steps);
    return ()=>clearInterval(t);
  },[inView,target,duration]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* ── Hero Floating Card ── */
function HCard({ icon, label, value, valClass, sub, trend, trendType, delay }) {
  return (
    <motion.div className="hcard"
      initial={{ opacity:0, y:40, scale:.9 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ delay, duration:.8, ease }}
      whileHover={{ y:-8, transition:{ duration:.2 } }}
    >
      <motion.div
        animate={{ y:[0,-12,0] }}
        transition={{ duration:4+delay, repeat:Infinity, ease:'easeInOut' }}
      >
        <div className="hcard-icon">{icon}</div>
        <div className="hcard-lbl">{label}</div>
        <div className={`hcard-val ${valClass}`}>{value}</div>
        <div className="hcard-sub">{sub}</div>
        {trend && <div className={`hcard-trend ${trendType}`}>{trend}</div>}
      </motion.div>
    </motion.div>
  );
}

/* ── Feature Card ── */
function FeatCard({ icon, color, title, desc, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-40px' });
  return (
    <motion.div ref={ref} className={`feat-card ${color}`}
      initial={{ opacity:0, y:50, scale:.97 }}
      animate={inView ? { opacity:1, y:0, scale:1 } : {}}
      transition={{ duration:.65, delay:index*.09, ease }}
      whileHover={{ y:-8, transition:{ duration:.22 } }}
    >
      <div className={`feat-top ${color}`} />
      <div className={`feat-icon ${color}`}>{icon}</div>
      <div className="feat-title">{title}</div>
      <div className="feat-desc">{desc}</div>
    </motion.div>
  );
}

/* ── Testimonial Card ── */
function TestiCard({ stars, text, name, role, letter, bg, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-40px' });
  return (
    <motion.div ref={ref} className="testi-card"
      initial={{ opacity:0, y:44, rotateX:8 }}
      animate={inView ? { opacity:1, y:0, rotateX:0 } : {}}
      transition={{ duration:.65, delay:index*.13, ease }}
      whileHover={{ y:-6, transition:{ duration:.2 } }}
    >
      <div className="tcard-quote">"</div>
      <div className="tcard-stars">{'★'.repeat(stars)}</div>
      <div className="tcard-text">{text}</div>
      <div className="tcard-author">
        <div className="tcard-av" style={{ background:bg }}>{letter}</div>
        <div>
          <div className="tcard-name">{name}</div>
          <div className="tcard-role">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Word reveal animation ── */
function WordReveal({ children, delay=0 }) {
  return (
    <motion.span
      initial={{ opacity:0, y:20, filter:'blur(8px)' }}
      animate={{ opacity:1, y:0, filter:'blur(0px)' }}
      transition={{ duration:.7, delay, ease }}
      style={{ display:'inline-block' }}
    >{children}</motion.span>
  );
}

/* ══════════════════════════════════
   HOMEPAGE
══════════════════════════════════ */
export default function Homepage({ onLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness:100, damping:30 });

  useEffect(()=>{
    const fn = ()=>setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return ()=>window.removeEventListener('scroll', fn);
  },[]);

  const features = [
    { icon:'💳', color:'c1', title:'Smart Payroll Engine',          desc:'Zero-error salary processing, automated TDS, PF, ESI filings and instant digital payslips in one click.' },
    { icon:'🕐', color:'c3', title:'Workforce Time Intelligence',    desc:'Real-time attendance with geo-fencing, biometrics, smart shift scheduling and AI-powered leave insights.' },
    { icon:'🎯', color:'c4', title:'Growth & Performance Hub',       desc:'Structured OKRs, 360° reviews, continuous feedback loops and personalised talent development roadmaps.' },
    { icon:'📋', color:'c2', title:'Talent Acquisition Suite',       desc:'End-to-end hiring, automated offer letters, digital e-signatures and seamless new joiner onboarding.' },
    { icon:'💬', color:'gr', title:'Culture & Connect',              desc:'Pulse surveys, peer recognition programs, team announcements and engagement trend analytics.' },
    { icon:'📈', color:'pu', title:'People Intelligence Dashboard',   desc:'Live workforce analytics — headcount trends, attrition forecasts, productivity and strategic planning.' },
  ];

  const testimonials = [
    { stars:5, text:"TSI HRMS reduced our payroll cycle from 4 days to 4 hours. The compliance automation alone saves us 30+ hours every month. Game changing.", name:"Priya Rajan",  role:"HR Director, TechNova",   letter:"P", bg:"linear-gradient(135deg,#0EA5E9,#F59E0B)" },
    { stars:5, text:"The real-time attendance dashboard gives our managers instant visibility. We've reduced absenteeism by 23% since going live on TSI HRMS.", name:"Arun Mehta",   role:"CEO, GrowthFirst",         letter:"A", bg:"linear-gradient(135deg,#F97316,#EF4444)" },
    { stars:5, text:"Onboarding used to take 3 weeks. Now it's 3 days. The performance module has genuinely changed how our managers give and receive feedback.", name:"Sneha Iyer",   role:"People Ops, ScaleUp Inc", letter:"S", bg:"linear-gradient(135deg,#EF4444,#F97316)" },
  ];

  const howSteps = [
    { num:'1', color:'c1', icon:'🚀', title:'Set Up in Hours',       desc:'Connect your team, import existing data and configure HR workflows — no IT team needed. Live in under 48 hours.' },
    { num:'2', color:'c3', icon:'⚙️', title:'Automate Everything',   desc:'Payroll, attendance, leaves, appraisals — TSI HRMS automates your entire HR lifecycle intelligently.' },
    { num:'3', color:'c4', icon:'📊', title:'Grow with Insights',    desc:'Use real-time people data to make smarter decisions, reduce attrition and build a high-performance culture.' },
  ];

  return (
    <div className="homepage">
      {/* Scroll progress */}
      <motion.div className="prog" style={{ scaleX, position:'fixed', top:0, left:0, right:0, height:4, zIndex:9999, transformOrigin:'left' }} />

      {/* ══ NAVBAR ══ */}
      <motion.nav className={`nav ${scrolled?'stuck':''}`}
        initial={{ y:-80, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        transition={{ duration:.9, ease }}
      >
        <motion.div className="logo"
          onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          whileHover={{ scale:1.03 }}
        >
          <div className="logo-icon">T</div>
          <div className="logo-text">TSI <em>HRMS</em></div>
        </motion.div>

        <div className="nav-links">
          {['Platform','How It Works','Why TSI','Pricing','About'].map((l,i)=>(
            <motion.a key={l} href="#"
              initial={{ opacity:0, y:-16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:.15+i*.08, duration:.5 }}
            >{l}</motion.a>
          ))}
          <motion.button className="btn-nav" onClick={onLogin}
            initial={{ opacity:0, scale:.85 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:.6, type:'spring', stiffness:200 }}
            whileTap={{ scale:.95 }}
          >Login →</motion.button>
        </div>
      </motion.nav>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-bar" />
        <div className="hero-mesh" />
        <div className="hero-dots" />
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        <div className="hero-inner">
          <div className="hero-left">

            {/* Badge */}
            <motion.div className="hero-badge"
              initial={{ opacity:0, scale:.8, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              transition={{ duration:.6, delay:.3, ...spring }}
            >
              <div className="badge-ring" />
              <span className="bdot" />
              India's Intelligent HR Platform
            </motion.div>

            {/* Headline — word by word */}
            <h1 className="hero-h1">
              <WordReveal delay={.42}>Your </WordReveal>
              <WordReveal delay={.54}><span className="w-tsi">People.</span></WordReveal>
              {' '}
              <WordReveal delay={.66}><span className="w-people">Your</span></WordReveal>
              {' '}
              <WordReveal delay={.78}><span className="w-first">Future.</span></WordReveal>
            </h1>

            {/* Subheading */}
            <motion.div className="hero-h2"
              initial={{ opacity:0, y:28 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:.7, delay:.95 }}
            >
              TSI HRMS powers your entire HR ecosystem —{' '}
              <strong>automated payroll</strong>, intelligent attendance,{' '}
              performance-driven culture — all in one platform your{' '}
              people will actually love.
            </motion.div>

            {/* CTAs */}
            <motion.div className="hero-btns"
              initial={{ opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:.65, delay:1.1 }}
            >
              <motion.button className="btn-primary" onClick={onLogin}
                whileTap={{ scale:.96 }}
                whileHover={{ scale:1.02 }}
              >🚀 Start Free Trial</motion.button>
              <motion.button className="btn-secondary"
                whileTap={{ scale:.96 }}
                whileHover={{ scale:1.02 }}
              >▶ Watch 2-min Demo</motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div className="proof"
              initial={{ opacity:0, x:-20 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:1.3, duration:.6 }}
            >
              <div className="proof-avs">
                {['P','R','A','M'].map((l,i)=>(
                  <motion.span key={l}
                    initial={{ opacity:0, x:-10 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay:1.35+i*.07 }}
                  >{l}</motion.span>
                ))}
              </div>
              <div className="proof-txt">
                Powering HR for <strong>500+ growing businesses</strong> across India
              </div>
            </motion.div>
          </div>

          {/* Floating cards */}
          <div className="hero-right">
            <HCard icon="💰" label="Payroll Processed"  value="₹2.4M"  valClass="c3" sub="This month"       trend="↑ On time"   trendType="up"   delay={.7} />
            <HCard icon="👥" label="Active Employees"   value="1,248"  valClass="c1" sub="Across depts."    trend="↑ 4.2%"     trendType="up"   delay={.95}/>
            <HCard icon="📊" label="Attendance Rate"    value="96.4%"  valClass="gr" sub="This week"        trend="↑ vs last"   trendType="up"   delay={1.2}/>
            <HCard icon="⭐" label="Avg. Performance"   value="4.8★"   valClass="c2" sub="Employee rating"  trend="⚠ 2 pending" trendType="warn" delay={1.45}/>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="stats-sec">
        <motion.div className="stats-grid"
          variants={stagger} initial="hidden"
          whileInView="show" viewport={{ once:true, margin:'-60px' }}
        >
          {[
            { n:500,   s:'+', l:'Businesses Powered'    },
            { n:50000, s:'+', l:'Employees on Platform' },
            { n:99,    s:'%', l:'Payroll Accuracy Rate' },
            { n:48,    s:'h', l:'Fastest Go-Live Time'  },
          ].map(({ n,s,l })=>(
            <motion.div className="stat-card" key={l} variants={fadeUp}
              whileHover={{ y:-7, transition:{ duration:.2 } }}
            >
              <div className="stat-num"><Counter target={n} suffix={s} /></div>
              <div className="stat-lbl">{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="feat-sec">
        <motion.div className="sec-head"
          variants={stagger} initial="hidden"
          whileInView="show" viewport={{ once:true, margin:'-60px' }}
        >
          <motion.div className="sec-eyebrow" variants={fadeUp}>
            <span className="sec-eyebrow-bar"/>Platform Capabilities
          </motion.div>
          <motion.h2 className="sec-title" variants={fadeUp}>
            Six modules. <span className="t-c1">One platform.</span><br/>
            <span className="t-c3">Zero compromise.</span>
          </motion.h2>
        </motion.div>
        <div className="feat-grid">
          {features.map((f,i)=><FeatCard key={f.title} {...f} index={i}/>)}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="how-sec">
        <motion.div className="sec-head" style={{ maxWidth:1100, margin:'0 auto 0' }}
          variants={stagger} initial="hidden"
          whileInView="show" viewport={{ once:true, margin:'-60px' }}
        >
          <motion.div className="sec-eyebrow" variants={fadeUp}>
            <span className="sec-eyebrow-bar"/>How It Works
          </motion.div>
          <motion.h2 className="sec-title" variants={fadeUp}>
            Live in <span className="t-c1">3 simple steps</span>
          </motion.h2>
        </motion.div>
        <div className="how-steps">
          <motion.div className="how-connector"
            initial={{ scaleX:0 }} whileInView={{ scaleX:1 }}
            viewport={{ once:true }} transition={{ duration:.8, delay:.6 }}
            style={{ transformOrigin:'left' }}
          />
          <motion.div className="how-connector2"
            initial={{ scaleX:0 }} whileInView={{ scaleX:1 }}
            viewport={{ once:true }} transition={{ duration:.8, delay:.9 }}
            style={{ transformOrigin:'left' }}
          />
          {howSteps.map((s,i)=>(
            <motion.div className="how-step" key={s.num}
              initial={{ opacity:0, y:50 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-40px' }}
              transition={{ duration:.65, delay:i*.18, ease }}
              whileHover={{ y:-6, transition:{ duration:.2 } }}
            >
              <div className={`how-num ${s.color}`}>{s.num}</div>
              <div className="how-step-icon">{s.icon}</div>
              <div className="how-step-title">{s.title}</div>
              <div className="how-step-desc">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ WHY TSI ══ */}
      <section className="why-sec">
        <div className="why-grid">
          <motion.div className="why-left"
            variants={fadeLeft} initial="hidden"
            whileInView="show" viewport={{ once:true, margin:'-60px' }}
          >
            <div className="sec-eyebrow">
              <span className="sec-eyebrow-bar" style={{ background:'linear-gradient(90deg,#0EA5E9,#F59E0B)' }}/>
              Why TSI HRMS
            </div>
            <h2 className="sec-title">
              Engineered for<br/><span className="t-c1">people-first</span> companies
            </h2>
            <p>
              TSI HRMS isn't just software — it's your strategic HR partner.
              We combine enterprise-grade reliability with a consumer-grade experience
              your teams will genuinely love using every single day.
            </p>
            <div className="why-checks">
              {[
                'Deployed in 48 hours — no IT team required',
                'Mobile-first — full HR on any device, anywhere',
                'Dedicated success manager from day one',
                'ISO 27001 & SOC 2 compliant data security',
                'Open API — integrates with your entire tech stack',
              ].map(t=>(
                <motion.div className="why-check" key={t}
                  initial={{ opacity:0, x:-20 }}
                  whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true }}
                  transition={{ duration:.5, ease }}
                >
                  <div className="why-check-ico">✓</div>{t}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="why-cards"
            variants={stagger} initial="hidden"
            whileInView="show" viewport={{ once:true, margin:'-60px' }}
          >
            {[
              { n:'48h',   c:'c1', l:'Fastest deployment in class' },
              { n:'500+',  c:'c3', l:'Businesses trust TSI HRMS'   },
              { n:'99.9%', c:'c4', l:'Uptime SLA guaranteed'       },
              { n:'24/7',  c:'c2', l:'Human support — always on'   },
            ].map(({ n,c,l })=>(
              <motion.div className="why-card" key={l} variants={fadeUp}
                whileHover={{ y:-6, transition:{ duration:.2 } }}
              >
                <div className={`why-num ${c}`}>{n}</div>
                <div className="why-lbl">{l}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="testi-sec">
        <motion.div className="testi-head"
          variants={stagger} initial="hidden"
          whileInView="show" viewport={{ once:true, margin:'-60px' }}
        >
          <motion.div className="sec-eyebrow" variants={fadeUp} style={{ justifyContent:'center' }}>
            <span className="sec-eyebrow-bar"/>Customer Stories
          </motion.div>
          <motion.h2 className="sec-title" variants={fadeUp} style={{ textAlign:'center' }}>
            Real results from <span className="t-c1">real teams</span>
          </motion.h2>
        </motion.div>
        <div className="testi-grid">
          {testimonials.map((t,i)=><TestiCard key={t.name} {...t} index={i}/>)}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="cta-sec">
        <motion.div className="cta-box"
          initial={{ opacity:0, scale:.94, y:48 }}
          whileInView={{ opacity:1, scale:1, y:0 }}
          viewport={{ once:true, margin:'-60px' }}
          transition={{ duration:.85, ease }}
        >
          <div className="cta-stripe" />
          <motion.h2 className="cta-title"
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ delay:.2, duration:.6 }}
          >
            Ready to build a<br/><span className="t-c3">people-first company?</span>
          </motion.h2>
          <motion.p className="cta-desc"
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ delay:.35 }}
          >
            Be part of India's fastest-growing HR ecosystem. Start free — no credit card needed.
          </motion.p>
          <motion.div className="cta-btns"
            initial={{ opacity:0, y:16 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ delay:.5 }}
          >
            <motion.button className="btn-cta" onClick={onLogin} whileTap={{ scale:.96 }}>
              🚀 Get Started Free
            </motion.button>
            <motion.button className="btn-cta-ghost" whileTap={{ scale:.96 }}>
              📞 Talk to an Expert
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">T</div>
              <div className="logo-text" style={{ color:'#fff' }}>TSI <em style={{ color:'#F97316', fontStyle:'normal' }}>HRMS</em></div>
            </div>
            <p>India's intelligent HR platform. Built for people-first companies that move fast.</p>
          </div>
          {[
            { h:'Platform',  ls:['Smart Payroll','Time Intelligence','Performance Hub','Talent Suite']  },
            { h:'Company',   ls:['About TSI','Careers','Blog','Press']                                   },
            { h:'Resources', ls:['Help Centre','API Docs','System Status','Privacy Policy']              },
          ].map(({ h,ls })=>(
            <div className="footer-col" key={h}>
              <h4>{h}</h4>
              {ls.map(l=><a href="#" key={l}>{l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div>© 2026 <em>TSI HRMS</em> · Transport Sustainability Intelligence · All rights reserved.</div>
          <div>v2.0.0</div>
        </div>
      </footer>
    </div>
  );
}