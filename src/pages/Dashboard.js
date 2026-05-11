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
  { id:'helpdesk', icon:'helpdesk', label:'Help',    badge:null },
];

/* ── Nav color per item — matches TSI palette ── */
const navColors = {
  home:'#0EA5E9', me:'#F97316', inbox:'#EF4444',
  myteam:'#0EA5E9', finances:'#F59E0B',
  org:'#22C55E', engage:'#8B5CF6', helpdesk:'#F97316',
};

/* ── Sidebar ── */
function Sidebar({ active, onChange }) {
  return (
    <motion.div className="sidebar"
      initial={{ x:-82, opacity:0 }} animate={{ x:0, opacity:1 }}
      transition={{ duration:.55, ease }}
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
            onClick={()=>onChange(n.id)}
            initial={{ opacity:0, x:-20 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay:.07+i*.05, duration:.4 }}
            whileHover={{ x:3 }}
            whileTap={{ scale:.94 }}
            title={n.label}
          >
            <div className="s-icon">
              <SvgIcon name={n.icon} size={17}
                color={active===n.id ? navColors[n.id] : '#94A3B8'}
                strokeWidth={active===n.id ? 2.2 : 1.8}
              />
            </div>
            <span className="s-label">{n.label}</span>
            {n.badge && <div className="s-badge">{n.badge}</div>}
          </motion.div>
        ))}
      </div>
      <div className="s-bottom">
        <motion.div className="s-avatar" title="Sandhika"
          whileHover={{ scale:1.1 }}
        >S</motion.div>
      </div>
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
            {nav==='home' ? <DashboardHome/> : <PlaceholderPage id={nav}/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}