import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';

const ease = [.25,.46,.45,.94];
const stagger = { show:{ transition:{ staggerChildren:.09 } } };
const fadeUp = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:.5,ease}} };

/* ══ SVG Icons — no emojis ══ */
const icons = {
  home:     'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  user:     'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
  inbox:    'M22 12h-6l-2 3H10l-2-3H2 M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z',
  team:     'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  finance:  'M12 2v20 M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6',
  org:      'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 108 0 4 4 0 00-8 0 M23 21v-2a4 4 0 00-3-3.87',
  engage:   'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  helpdesk: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
  bell:     'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  search:   'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  hire:     'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M19 8l2 2 4-4',
  briefcase:'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  chart:    'M18 20V10 M12 20V4 M6 20v-6',
  message:  'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  clipboard:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2',
  globe:    'M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  star:     'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  apps:     'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
  cog2:     'M10.3 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v5.7 M18 14v4h4 M18 22a4 4 0 100-8 4 4 0 000 8z',
};

const SvgIcon = ({ name, size=18, color='currentColor', strokeWidth=2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {(icons[name]||'').split(' M').map((d,i)=>
      <path key={i} d={i===0?d:`M${d}`}/>
    )}
  </svg>
);

/* ── Nav items ── */
const NAV = [
  { id:'home',     icon:'home',     label:'Home',   badge:null },
  { id:'me',       icon:'user',     label:'Me',      badge:null },
  { id:'inbox',    icon:'inbox',    label:'Inbox',   badge:2    },
  { id:'myteam',   icon:'team',     label:'My Team', badge:null },
  { id:'finances', icon:'finance',  label:'Finance', badge:null },
  { id:'org',      icon:'org',      label:'Org',     badge:null },
  { id:'engage',   icon:'engage',   label:'Engage',  badge:null },
  { id:'hire',     icon:'hire',     label:'Hire',    badge:null },
  { id:'helpdesk', icon:'helpdesk', label:'Help',    badge:null },
];

/* ── Nav color per item — matches TSI palette ── */
const navColors = {
  home:'#0EA5E9', me:'#F97316', inbox:'#EF4444',
  myteam:'#0EA5E9', finances:'#F59E0B',
  org:'#22C55E', engage:'#8B5CF6', hire:'#EC4899', helpdesk:'#F97316',
};

/* ── Sidebar ── */
function Sidebar({ active, onChange }) {
  const [hireOpen, setHireOpen] = useState(false);

  const handleClick = (id) => {
    if (id === 'hire') {
      setHireOpen(o => !o);
    } else {
      setHireOpen(false);
      onChange(id);
    }
  };

  const handleHireItem = (id) => {
    setHireOpen(false);
    onChange('hire');
  };

  return (
    <motion.div className="sidebar"
      initial={{ x:-82, opacity:0 }} animate={{ x:0, opacity:1 }}
      transition={{ duration:.55, ease }}
      style={{ position:'relative' }}
    >
      <div className="s-logo-wrap">
        <motion.div className="s-logo"
          whileHover={{ scale:1.08, rotate:-6 }} whileTap={{ scale:.94 }}
        >T</motion.div>
      </div>
      <div className="s-nav">
        {NAV.map((n,i)=>(
          <motion.div key={n.id}
            className={`s-item ${active===n.id?'active':''}`}
            onClick={()=>handleClick(n.id)}
            initial={{ opacity:0, x:-20 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay:.07+i*.05, duration:.4 }}
            whileHover={{ x:3 }}
            whileTap={{ scale:.94 }}
            title={n.label}
          >
            <div className="s-icon">
              <SvgIcon name={n.icon} size={17}
                color={active===n.id ? navColors[n.id] : n.id==='hire' && hireOpen ? '#EC4899' : '#94A3B8'}
                strokeWidth={active===n.id ? 2.2 : 1.8}
              />
            </div>
            <span className="s-label" style={n.id==='hire'&&hireOpen?{color:'#EC4899'}:{}}>{n.label}</span>
            {n.badge && <div className="s-badge">{n.badge}</div>}
          </motion.div>
        ))}
      </div>
      <div className="s-bottom">
        <motion.div className="s-avatar" title="Sandhika"
          whileHover={{ scale:1.1 }}
        >S</motion.div>
      </div>

      {/* Hire flyout */}
      <AnimatePresence>
        {hireOpen && (
          <motion.div
            initial={{ opacity:0, x:-10, scale:.97 }}
            animate={{ opacity:1, x:0, scale:1 }}
            exit={{ opacity:0, x:-10, scale:.97 }}
            transition={{ duration:.22, ease:[.25,.46,.45,.94] }}
            style={{
              position:'absolute',
              left:'82px',
              top: (() => {
                const hireIdx = NAV.findIndex(n=>n.id==='hire');
                return `${56 + hireIdx * 55}px`;
              })(),
              zIndex:1000,
              background:'#1E293B',
              borderRadius:12,
              boxShadow:'0 8px 32px rgba(0,0,0,.25), 0 2px 8px rgba(0,0,0,.15)',
              padding:'8px 0',
              minWidth:180,
              border:'1px solid rgba(255,255,255,.08)',
            }}
          >
            {/* Arrow */}
            <div style={{
              position:'absolute', left:-7, top:20,
              width:14, height:14, background:'#1E293B',
              transform:'rotate(45deg)', borderRadius:2,
              borderLeft:'1px solid rgba(255,255,255,.08)',
              borderBottom:'1px solid rgba(255,255,255,.08)',
            }}/>
            {/* Header */}
            <div style={{ padding:'10px 16px 6px', borderBottom:'1px solid rgba(255,255,255,.08)', marginBottom:4 }}>
              <div style={{ fontSize:'.65rem', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase', color:'#EC4899' }}>HIRE</div>
            </div>
            {HIRE_ITEMS.map((item, i)=>(
              <motion.div key={item.id}
                initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:i*.03 }}
                onClick={()=>{ handleHireItem(item.id); onChange('hire'); }}
                style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'9px 16px', cursor:'pointer',
                  transition:'background .15s',
                }}
                whileHover={{ backgroundColor:'rgba(236,72,153,.12)' }}
              >
                <div style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,.06)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <SvgIcon name={item.icon} size={14} color={'rgba(255,255,255,.7)'} strokeWidth={1.8}/>
                </div>
                <span style={{ fontSize:'.85rem', fontWeight:600, color:'rgba(255,255,255,.85)' }}>{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── TopBar ── */
function TopBar() {
  return (
    <motion.div className="topbar"
      initial={{ y:-56, opacity:0 }} animate={{ y:0, opacity:1 }}
      transition={{ duration:.55, ease }}
    >
      <div className="tb-brand">TPF Software &nbsp;<em>TSI HRMS</em></div>
      <div className="tb-search">
        <span className="tb-search-icon"><SvgIcon name="search" size={14} color="#94A3B8"/></span>
        <input placeholder="Search employees or actions  (Ex: Apply Leave)"/>
        <span className="tb-kbd">Alt + K</span>
      </div>
      <div className="tb-sp"/>
      <div className="tb-actions">
        <motion.div className="tb-btn" title="Notifications" whileTap={{ scale:.9 }}>
          <SvgIcon name="bell" size={16} color="#64748B"/>
          <div className="tb-notif">5</div>
        </motion.div>
        <motion.div className="tb-btn" title="Settings" whileTap={{ scale:.9 }}>
          <SvgIcon name="settings" size={16} color="#64748B"/>
        </motion.div>
        <motion.div className="tb-av" title="Sandhika" whileHover={{ scale:1.06 }}>S</motion.div>
      </div>
    </motion.div>
  );
}

/* ── Tab Bar ── */
function TabBar({ active, onChange }) {
  return (
    <div className="tabbar">
      {[{id:'dashboard',l:'DASHBOARD'},{id:'welcome',l:'WELCOME',dot:true}].map(t=>(
        <div key={t.id} className={`tab ${active===t.id?'active':''}`} onClick={()=>onChange(t.id)}>
          {t.l}{t.dot&&<span className="tab-dot"/>}
        </div>
      ))}
    </div>
  );
}

/* ── Stat card ── */
function QSCard({ colorClass, iconName, iconColor, val, lbl, badge, badgeType }) {
  return (
    <motion.div className={`qs-card ${colorClass}`} variants={fadeUp}
      whileHover={{ y:-6, transition:{ duration:.18 } }}
    >
      <div className={`qs-icon ${colorClass}`}>
        <SvgIcon name={iconName} size={20} color={iconColor} strokeWidth={2}/>
      </div>
      <div style={{ flex:1 }}>
        <div className={`qs-val ${colorClass}`}>{val}</div>
        <div className="qs-lbl">{lbl}</div>
      </div>
      {badge && <div className={`qs-badge ${badgeType}`}>{badge}</div>}
    </motion.div>
  );
}

/* ── Holiday ── */
function HolidayCard() {
  const list = [
    { name:'Bakrid',       date:'Thu, 28 May, 2026'  },
    { name:'Independence', date:'Sat, 15 Aug, 2026'   },
    { name:'Diwali',       date:'Wed, 20 Oct, 2026'   },
  ];
  const [idx, setIdx] = useState(0);
  return (
    <div className="holiday">
      <div className="holiday-top">
        <span className="holiday-tag">Holidays</span>
        <span className="holiday-link">View All</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity:0, x:18 }} animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x:-18 }} transition={{ duration:.28 }}
        >
          <div className="holiday-name">{list[idx].name}</div>
          <div className="holiday-date">{list[idx].date}</div>
        </motion.div>
      </AnimatePresence>
      
      <div className="holiday-nav">
        <button className="h-btn" onClick={()=>setIdx(x=>(x-1+list.length)%list.length)}>‹</button>
        <button className="h-btn" onClick={()=>setIdx(x=>(x+1)%list.length)}>›</button>
      </div>
    </div>
  );
}

/* ── Right Panel ── */
function RightPanel() {
  const [org,  setOrg]  = useState('org');
  const [post, setPost] = useState('post');
  const [evt,  setEvt]  = useState('bday');
  return (
    <div className="r-panel">
      <motion.div className="card"
        initial={{ opacity:0, x:28 }} animate={{ opacity:1, x:0 }}
        transition={{ delay:.46, duration:.5, ease }}
      >
        <div className="org-tabs">
          {[{id:'org',l:'Organization'},{id:'tsi',l:'TSI Group'}].map(t=>(
            <div key={t.id} className={`org-tab ${org===t.id?'active':''}`} onClick={()=>setOrg(t.id)}>{t.l}</div>
          ))}
        </div>
        <div className="post-tabs">
          {[{id:'post',l:'✏️ Post'},{id:'praise',l:'🏆 Praise'}].map(t=>(
            <div key={t.id} className={`pt ${post===t.id?'active':''}`} onClick={()=>setPost(t.id)}>{t.l}</div>
          ))}
        </div>
        <textarea className="post-box" placeholder="Write your post here and mention your peers" rows={3}/>
      </motion.div>

      <motion.div className="card"
        initial={{ opacity:0, x:28 }} animate={{ opacity:1, x:0 }}
        transition={{ delay:.58, duration:.5, ease }}
      >
        <div className="ann-row">
          <span className="ann-empty">No announcements</span>
          <motion.button className="btn-plus" whileTap={{ scale:.9 }}>+</motion.button>
        </div>
      </motion.div>

      <motion.div className="card"
        initial={{ opacity:0, x:28 }} animate={{ opacity:1, x:0 }}
        transition={{ delay:.70, duration:.5, ease }}
      >
        <div className="evt-tabs">
          {[
            {id:'bday', l:'Birthdays',       c:0},
            {id:'anni', l:'Work Anniversary', c:1},
            {id:'new',  l:'New Joinees',      c:0},
          ].map(t=>(
            <div key={t.id} className={`et ${evt===t.id?'active':''}`} onClick={()=>setEvt(t.id)}>
              {t.l}<span className="et-count">{t.c}</span>
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={evt}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0 }} transition={{ duration:.2 }}
          >
            {evt==='bday' && <div className="evt-empty">No birthdays today</div>}
            {evt==='anni' && <div className="evt-empty">1 work anniversary today 🎊</div>}
            {evt==='new'  && <div className="evt-empty">No new joinees today</div>}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ── Dashboard Home ── */
function DashboardHome() {
  return (
    <div className="dash-content">
      {/* Welcome banner */}
      <motion.div className="wb"
        initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:.28, duration:.6, ease }}
      >
        <div className="wb-dot-bg"/>
        <div className="wb-glow1"/><div className="wb-glow2"/>
        <div className="wb-content">
          <div className="wb-name">Welcome Sandhika! 👋</div>
          <div className="wb-sub">Thursday, 08 May 2026 · Have a great day at work</div>
        </div>
      </motion.div>

      {/* Quick stats */}
      <motion.div className="qs-row" variants={stagger} initial="hidden" animate="show">
        <QSCard colorClass="c1" iconName="team"    iconColor="#0284C7" val="1,248" lbl="Active Employees"  badge="↑ 4.2%"  badgeType="up"/>
        <QSCard colorClass="c3" iconName="finance" iconColor="#C2410C" val="₹2.4M" lbl="Payroll Processed" badge="On time" badgeType="nu"/>
        <QSCard colorClass="c4" iconName="inbox"   iconColor="#B91C1C" val="23"    lbl="Pending Approvals" badge="↑ 3"     badgeType="dn"/>
        <QSCard colorClass="gr" iconName="org"     iconColor="#15803D" val="96.4%" lbl="Attendance Rate"   badge="↑ High"  badgeType="up"/>
      </motion.div>

      {/* Main grid */}
      <div className="dash-grid">
        <div>
          <motion.div className="card"
            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:.42, duration:.5, ease }}
          >
            <div className="card-title">Quick Access <span className="card-link">View all →</span></div>
            <div className="inbox-row">
              <div className="inbox-img">📬</div>
              <div>
                <div className="inbox-title">Good job!</div>
                <div className="inbox-sub">You have no pending actions</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:.52, duration:.5, ease }}
          >
            <HolidayCard/>
          </motion.div>

          <motion.div className="card"
            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:.62, duration:.5, ease }}
            style={{ marginTop:14 }}
          >
            <div className="card-title">On Leave Today</div>
            <div className="leave-empty">No one is on leave today 🎉</div>
          </motion.div>
        </div>
        <RightPanel/>
      </div>
    </div>
  );
}

/* ── Placeholder ── */
const PAGES = {
  me:       { icon:'👤', title:'My Profile',    desc:'Your personal HR profile' },
  inbox:    { icon:'📥', title:'Inbox',          desc:'Pending actions & notifications' },
  myteam:   { icon:'👥', title:'My Team',        desc:'View and manage your team' },
  finances: { icon:'💰', title:'My Finances',    desc:'Payslips and reimbursements' },
  org:      { icon:'🏢', title:'Organisation',   desc:'Company structure & directory' },
  engage:   { icon:'💬', title:'Engage',         desc:'Posts, polls and engagement' },
  helpdesk: { icon:'🎧', title:'Helpdesk',       desc:'Raise and track support tickets' },
  hire:     { icon:'💼', title:'Hire',             desc:'Talent acquisition & recruitment' },
};
function PlaceholderPage({ id }) {
  const p = PAGES[id] || PAGES.me;
  return (
    <div className="ph-page">
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, damping:14 }}>
        <div className="ph-icon">{p.icon}</div>
      </motion.div>
      <motion.div className="ph-badge" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}>🚧 Coming Soon</motion.div>
      <motion.div className="ph-title" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}>{p.title}</motion.div>
      <motion.div className="ph-desc"  initial={{ opacity:0 }}      animate={{ opacity:1 }}        transition={{ delay:.35 }}>{p.desc}</motion.div>
    </div>
  );
}


/* ══════════════════════════════════════
   HIRE FLYOUT MENU
══════════════════════════════════════ */
const HIRE_ITEMS = [
  { id:'home',        icon:'home',       label:'Home'        },
  { id:'jobs',        icon:'briefcase',  label:'Jobs'        },
  { id:'candidates',  icon:'hire',       label:'Candidates'  },
  { id:'messages',    icon:'message',    label:'Messages'    },
  { id:'preboarding', icon:'clipboard',  label:'Preboarding' },
  { id:'reports',     icon:'chart',      label:'Reports'     },
  { id:'careersite',  icon:'globe',      label:'Career site' },
  { id:'apps',        icon:'apps',       label:'Apps'        },
  { id:'settings',    icon:'settings',   label:'Settings'    },
];

function HireSubPage({ id }) {
  const info = {
    jobs:       { title:'Jobs',             desc:'Manage all open positions and postings'   },
    candidates: { title:'Candidates',       desc:'Track all applicants in your pipeline'    },
    messages:   { title:'Messages',         desc:'Communicate with candidates and team'     },
    preboarding:{ title:'Preboarding',      desc:'Onboard new hires before their first day' },
    reports:    { title:'Reports',          desc:'Hiring analytics and performance insights'},
    careersite: { title:'Career Site',      desc:'Manage your public career page'           },
    apps:       { title:'Apps',             desc:'Integrations and third-party apps'        },
    settings:   { title:'Settings',         desc:'Configure hiring workflows'               },
  };
  const p = info[id];
  const col = { jobs:'#0EA5E9',candidates:'#F97316',messages:'#8B5CF6',preboarding:'#10B981',reports:'#F59E0B',careersite:'#0EA5E9',apps:'#EC4899',settings:'#94A3B8' };
  const icn = HIRE_ITEMS.find(n=>n.id===id)?.icon||'briefcase';
  return (
    <motion.div key={id}
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      exit={{ opacity:0 }} transition={{ duration:.3 }}
      style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:14, textAlign:'center', padding:40 }}
    >
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, damping:14 }}
        style={{ width:64, height:64, borderRadius:18, background:`linear-gradient(135deg,${col[id]||'#EC4899'},${col[id]||'#EC4899'}99)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 24px ${col[id]||'#EC4899'}33` }}
      >
        <SvgIcon name={icn} size={28} color="#fff" strokeWidth={1.8}/>
      </motion.div>
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
        style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:800, color:'var(--ink)' }}
      >{p.title}</motion.div>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.35 }}
        style={{ fontSize:'.88rem', color:'var(--slate)', maxWidth:300, lineHeight:1.6, fontWeight:500 }}
      >{p.desc}</motion.div>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.45 }}
        style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px', borderRadius:50, background:'#FCE7F3', border:'1px solid #FBCFE8', fontSize:'.72rem', fontWeight:700, color:'#BE185D' }}
      >🚧 Coming Soon</motion.div>
    </motion.div>
  );
}

/* ── Hire Home Dashboard ── */
function HireHome() {
  const [offersTab, setOffersTab] = useState('pending');
  const depts = [
    { name:'Services',    jobs:1,  hired:0, total:5,  pct:0   },
    { name:'Bench - PS',  jobs:1,  hired:0, total:1,  pct:0   },
    { name:'AirNZ',       jobs:2,  hired:2, total:3,  pct:66  },
    { name:'Amex',        jobs:12, hired:2, total:16, pct:12  },
    { name:'Mgmt',        jobs:1,  hired:0, total:1,  pct:0   },
    { name:'Product BAU', jobs:1,  hired:0, total:1,  pct:0   },
  ];
  const offerTabs = [
    { id:'pending',  l:'Pending Offers',   count:2  },
    { id:'accepted', l:'Accepted Offers',  count:0  },
    { id:'rejected', l:'Rejected Offers',  count:0  },
    { id:'new',      l:'New Hires',         count:0  },
  ];
  const pendingOffers = [
    { name:'GNANAPRIYA ILANGOVAN', role:'TPFQA · Functional, Performance…', date:'released on 04 May 2026', overdue:'2 days overdue', color:'#0EA5E9', init:'GI' },
    { name:'SIVAGNAANA SANKAR N',  role:'Senior Sales Executive',           date:'released on 21 Jan 2026', overdue:'102 days overdue', color:'#F97316', init:'SN' },
  ];
  const recruiters = [
    { name:'Magesh Ramani', hired:2, time:'57 days', jobs:15 },
  ];

  const statCards = [
    { label:'Offer acceptance rate', val:'85.71%', sub:'Last 3 months',  color:'#0EA5E9' },
    { label:'Positions overdue',      val:'15',     sub:'',               color:'#EF4444' },
    { label:'Source to hire %',       val:'0.39%',  sub:'Last 6 months',  color:'#F97316' },
    { label:'Time to hire',           val:'54 days',sub:'Last 6 months',  color:'#10B981' },
    { label:'Pending review',         val:'2087',   sub:'Last 3 months',  color:'#F59E0B', badge:'New' },
  ];

  return (
    <div style={{ flex:1, overflow:'auto', padding:'18px 24px', display:'flex', flexDirection:'column', gap:16 }}>

      {/* Page title */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}>
        <div style={{ fontSize:'1rem', fontWeight:800, color:'var(--ink)', fontFamily:'var(--fd)', marginBottom:4 }}>
          Explore, evaluate, and elevate your team with Hire
        </div>
        {/* Sub tabs */}
        <div style={{ display:'flex', gap:0, borderBottom:'1px solid var(--border)', marginTop:10 }}>
          {['Dashboard','Insights','Interviews','Product Updates'].map((t,i)=>(
            <div key={t} style={{
              padding:'8px 18px', fontSize:'.78rem', fontWeight:700,
              color: i===0 ? '#EC4899' : 'var(--muted)',
              borderBottom: i===0 ? '2.5px solid #EC4899' : '2.5px solid transparent',
              cursor:'pointer', letterSpacing:'.3px'
            }}>{t}</div>
          ))}
          <div style={{ marginLeft:'auto', marginBottom:4 }}>
            <motion.button whileTap={{ scale:.95 }}
              style={{ padding:'7px 18px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#EC4899,#F97316)', color:'#fff', fontFamily:'var(--fd)', fontWeight:700, fontSize:'.82rem', cursor:'pointer', boxShadow:'0 3px 10px rgba(236,72,153,.3)' }}
            >+ New</motion.button>
          </div>
        </div>
      </motion.div>

      {/* Hiring health */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
        style={{ background:'var(--white)', borderRadius:14, border:'1px solid var(--border)', padding:'14px 20px', boxShadow:'0 2px 8px rgba(0,0,0,.05)' }}
      >
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div>
            <div style={{ fontFamily:'var(--fd)', fontWeight:800, fontSize:'.92rem', color:'var(--ink)' }}>Hiring health</div>
            <div style={{ fontSize:'.76rem', color:'#EC4899', fontWeight:600, marginTop:2 }}>18 positions to be hired</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.75rem', color:'var(--muted)', fontWeight:500 }}>
            <div style={{ width:32, height:6, borderRadius:3, background:'#FEE2E2', overflow:'hidden' }}>
              <div style={{ width:'10%', height:'100%', background:'#EF4444', borderRadius:3 }}/>
            </div>
            2 of 20 Hired in last 12 months
          </div>
        </div>
        {/* 5 stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
          {statCards.map((s,i)=>(
            <motion.div key={s.label}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15+i*.08 }}
              style={{ padding:'12px 14px', border:'1px solid var(--border)', borderRadius:12, background:'var(--bg)', position:'relative' }}
            >
              {s.badge && (
                <span style={{ position:'absolute', top:10, right:10, background:'#EC4899', color:'#fff', fontSize:'.55rem', fontWeight:800, padding:'2px 6px', borderRadius:10 }}>{s.badge}</span>
              )}
              <div style={{ fontSize:'.72rem', color:'var(--muted)', fontWeight:600, marginBottom:6 }}>{s.label}</div>
              <div style={{ fontFamily:'var(--fd)', fontSize:'1.4rem', fontWeight:800, color:s.color, letterSpacing:'-.5px' }}>{s.val}</div>
              {s.sub && <div style={{ fontSize:'.68rem', color:'var(--muted)', marginTop:3, fontWeight:500 }}>{s.sub}</div>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Two column grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

        {/* LEFT — Departments */}
        <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.25 }}
          style={{ background:'var(--white)', borderRadius:14, border:'1px solid var(--border)', padding:'16px 20px', boxShadow:'0 2px 8px rgba(0,0,0,.05)' }}
        >
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontFamily:'var(--fd)', fontWeight:800, fontSize:'.9rem', color:'var(--ink)' }}>Departments</div>
          </div>
          {/* Table header */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 60px 1fr', gap:8, fontSize:'.68rem', fontWeight:700, color:'var(--muted)', letterSpacing:'.8px', textTransform:'uppercase', marginBottom:8, paddingBottom:8, borderBottom:'1px solid var(--border)' }}>
            <div>Name</div><div>Jobs</div><div>Positions Hired</div>
          </div>
          {depts.map((d,i)=>(
            <motion.div key={d.name}
              initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:.3+i*.06 }}
              style={{ display:'grid', gridTemplateColumns:'1fr 60px 1fr', gap:8, alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--bg)' }}
              whileHover={{ background:'var(--bg)' }}
            >
              <div style={{ fontSize:'.84rem', fontWeight:600, color:'var(--c1d,#0284C7)', cursor:'pointer' }}>{d.name}</div>
              <div style={{ fontSize:'.84rem', fontWeight:600, color:'var(--ink)' }}>{d.jobs}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ flex:1, height:6, borderRadius:3, background:'var(--border)', overflow:'hidden' }}>
                  <motion.div
                    initial={{ width:0 }} animate={{ width:`${d.pct}%` }}
                    transition={{ delay:.4+i*.06, duration:.7 }}
                    style={{ height:'100%', borderRadius:3, background: d.pct>50?'#10B981':d.pct>0?'#EF4444':'var(--border)' }}
                  />
                </div>
                <div style={{ fontSize:'.76rem', color:'var(--muted)', fontWeight:500, whiteSpace:'nowrap' }}>{d.hired} of {d.total}</div>
              </div>
            </motion.div>
          ))}
          <div style={{ textAlign:'center', marginTop:12 }}>
            <span style={{ fontSize:'.78rem', fontWeight:700, color:'var(--c1d,#0284C7)', cursor:'pointer' }}>View more</span>
          </div>
        </motion.div>

        {/* RIGHT — Offers + Recruitment */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Offer tabs */}
          <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.25 }}
            style={{ background:'var(--white)', borderRadius:14, border:'1px solid var(--border)', padding:'16px 20px', boxShadow:'0 2px 8px rgba(0,0,0,.05)' }}
          >
            <div style={{ display:'flex', gap:0, borderBottom:'1px solid var(--border)', marginBottom:12 }}>
              {offerTabs.map(t=>(
                <div key={t.id}
                  onClick={()=>setOffersTab(t.id)}
                  style={{
                    padding:'6px 12px', fontSize:'.75rem', fontWeight:700,
                    color: offersTab===t.id ? '#EC4899' : 'var(--muted)',
                    borderBottom: offersTab===t.id ? '2px solid #EC4899' : '2px solid transparent',
                    cursor:'pointer', whiteSpace:'nowrap',
                  }}
                >{t.l} ({t.count})</div>
              ))}
            </div>
            {offersTab==='pending' && pendingOffers.map((o,i)=>(
              <motion.div key={o.name}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.1 }}
                style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'10px 0', borderBottom: i<pendingOffers.length-1 ? '1px solid var(--bg)' : 'none' }}
              >
                <div style={{ width:36, height:36, borderRadius:50, background:o.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--fd)', fontWeight:800, fontSize:'.8rem', color:'#fff', flexShrink:0 }}>{o.init}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'.84rem', fontWeight:700, color:'var(--ink)' }}>{o.name}</div>
                  <div style={{ fontSize:'.74rem', color:'var(--muted)', marginTop:2 }}>{o.role}</div>
                  <div style={{ fontSize:'.72rem', color:'var(--muted)', marginTop:2 }}>{o.date}</div>
                </div>
                <div style={{ fontSize:'.7rem', fontWeight:700, color:'#EF4444', background:'#FEE2E2', padding:'3px 8px', borderRadius:20 }}>{o.overdue}</div>
              </motion.div>
            ))}
            {offersTab!=='pending' && (
              <div style={{ fontSize:'.82rem', color:'var(--muted)', textAlign:'center', padding:'16px 0', fontStyle:'italic' }}>No {offersTab} offers</div>
            )}
          </motion.div>

          {/* Recruiter performance */}
          <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.35 }}
            style={{ background:'var(--white)', borderRadius:14, border:'1px solid var(--border)', padding:'16px 20px', boxShadow:'0 2px 8px rgba(0,0,0,.05)' }}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ fontFamily:'var(--fd)', fontWeight:800, fontSize:'.9rem', color:'var(--ink)' }}>Recruiter performance</div>
              <div style={{ fontSize:'.72rem', fontWeight:600, color:'var(--muted)', background:'var(--bg)', padding:'4px 10px', borderRadius:20, border:'1px solid var(--border)' }}>Last 6 months ▾</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 120px 100px 60px', gap:8, fontSize:'.68rem', fontWeight:700, color:'var(--muted)', letterSpacing:'.8px', textTransform:'uppercase', marginBottom:8, paddingBottom:8, borderBottom:'1px solid var(--border)' }}>
              <div>Name</div><div>Positions Hired</div><div>Time to Hire</div><div>Jobs</div>
            </div>
            {recruiters.map((r,i)=>(
              <div key={r.name} style={{ display:'grid', gridTemplateColumns:'1fr 120px 100px 60px', gap:8, alignItems:'center', padding:'8px 0' }}>
                <div style={{ fontSize:'.84rem', fontWeight:600, color:'#0284C7', cursor:'pointer' }}>{r.name}</div>
                <div style={{ fontSize:'.84rem', fontWeight:700, color:'var(--ink)' }}>{r.hired}</div>
                <div style={{ fontSize:'.84rem', fontWeight:600, color:'var(--ink)' }}>{r.time}</div>
                <div style={{ fontSize:'.84rem', fontWeight:700, color:'var(--ink)' }}>{r.jobs}</div>
              </div>
            ))}
            <div style={{ fontSize:'.72rem', color:'var(--muted)', marginTop:8, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:'.9rem' }}>🔄</span> Data last synced 9 hours ago
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function HirePage() {
  const [hireSub, setHireSub] = useState('home');
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'var(--bg)' }}>
      <AnimatePresence mode="wait">
        {hireSub==='home'
          ? <motion.div key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:.25 }} style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}><HireHome/></motion.div>
          : <HireSubPage key={hireSub} id={hireSub}/>
        }
      </AnimatePresence>
    </div>
  );
}


/* ══ DASHBOARD ══ */
export default function Dashboard({ onLogout }) {
  const [nav, setNav] = useState('home');
  const [tab, setTab] = useState('dashboard');
  return (
    <div className="dash-shell">
      <Sidebar active={nav} onChange={setNav}/>
      <div className="dash-main">
        <TopBar/>
        {nav==='home' && <TabBar active={tab} onChange={setTab}/>}
        <AnimatePresence mode="wait">
          <motion.div key={nav}
            style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}
            initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-16 }} transition={{ duration:.25, ease }}
          >
            {nav==='home' ? <DashboardHome/> : nav==='hire' ? <HirePage/> : <PlaceholderPage id={nav}/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}