import { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Syne:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#020308;--panel:#06091a;--panel2:#080c20;--panel3:#0a0f28;
  --b1:#0d1535;--b2:#1a2550;--b3:#243070;
  --v:#6d28d9;--v2:#8b5cf6;--v3:#a78bfa;--v4:#c4b5fd;
  --c:#0ea5e9;--c2:#38bdf8;--c3:#7dd3fc;
  --g:#059669;--g2:#10b981;--g3:#34d399;--g4:#6ee7b7;
  --r:#dc2626;--r2:#ef4444;--r3:#fca5a5;
  --a:#d97706;--a2:#f59e0b;--a3:#fcd34d;
  --p:#db2777;--p2:#ec4899;
  --tx:#ddd6fe;--mu:#4c3d8a;--mu2:#2d2460;
}
body{font-family:'Syne',sans-serif;background:var(--bg);color:var(--tx);overflow-x:hidden;cursor:crosshair;}
.bg-mesh{position:fixed;inset:0;z-index:0;pointer-events:none;
  background:radial-gradient(ellipse 70% 50% at 10% 60%,rgba(109,40,217,.1),transparent),
             radial-gradient(ellipse 55% 45% at 90% 20%,rgba(14,165,233,.08),transparent),
             radial-gradient(ellipse 45% 55% at 50% 95%,rgba(219,39,119,.06),transparent),var(--bg);}
.grid-bg{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.03;
  background-image:linear-gradient(var(--v2) 1px,transparent 1px),linear-gradient(90deg,var(--v2) 1px,transparent 1px);
  background-size:48px 48px;}
.scan{position:fixed;inset:0;z-index:9999;pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(109,40,217,.015) 2px,rgba(109,40,217,.015) 4px);}

@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes glow{0%,100%{box-shadow:0 0 8px var(--v),0 0 22px rgba(109,40,217,.3)}50%{box-shadow:0 0 22px var(--v),0 0 55px rgba(109,40,217,.6)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}
@keyframes fadeUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideR{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(2.8);opacity:0}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes drawLine{from{stroke-dashoffset:3000}to{stroke-dashoffset:0}}
@keyframes tabIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.hdr{position:relative;z-index:100;display:flex;align-items:center;justify-content:space-between;
  padding:12px 24px;border-bottom:1px solid var(--b2);
  background:linear-gradient(180deg,rgba(109,40,217,.1),transparent);backdrop-filter:blur(20px);}
.logo-g{display:flex;align-items:center;gap:13px;}
.orb{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(circle,rgba(109,40,217,.5),transparent 70%);animation:glow 3s ease-in-out infinite;position:relative;}
.orb::before{content:'';position:absolute;inset:-2px;border-radius:50%;
  border:1.5px solid transparent;
  background:linear-gradient(135deg,var(--v2),var(--c)) border-box;
  -webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:destination-out;}
.orb-i{font-size:20px;animation:float 3s ease-in-out infinite;}
.logo{font-family:'Orbitron',monospace;font-weight:900;font-size:20px;letter-spacing:5px;
  background:linear-gradient(90deg,var(--v3),var(--c2),var(--v4),var(--c));
  background-size:250%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite;}
.logo-sub{font-size:9px;letter-spacing:4px;-webkit-text-fill-color:var(--mu);display:block;margin-top:2px;font-family:'Share Tech Mono',monospace;}
.hdr-right{display:flex;align-items:center;gap:10px;}
.hstat{padding:7px 13px;text-align:center;border:1px solid var(--b2);border-radius:5px;background:var(--panel);}
.hstat .hv{font-family:'Share Tech Mono',monospace;font-size:14px;font-weight:700;}
.hstat .hl{font-size:9px;color:var(--mu);letter-spacing:2px;margin-top:1px;}
.live-pill{display:flex;align-items:center;gap:7px;padding:7px 15px;border-radius:20px;
  border:1px solid var(--g2);background:rgba(5,150,105,.08);
  font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--g3);letter-spacing:2px;}
.ldot{width:8px;height:8px;border-radius:50%;background:var(--g3);animation:pulse 1.2s infinite;position:relative;}
.ldot::after{content:'';position:absolute;top:-3px;left:-3px;width:14px;height:14px;border-radius:50%;
  border:1px solid var(--g3);animation:ping 1.4s ease-out infinite;}

.ticker-wrap{position:relative;z-index:10;overflow:hidden;background:var(--panel2);border-bottom:1px solid var(--b1);padding:8px 0;}
.ticker-track{display:flex;white-space:nowrap;animation:ticker 30s linear infinite;}
.ti{display:inline-flex;align-items:center;gap:8px;padding:0 24px;border-right:1px solid var(--b1);
  font-family:'Share Tech Mono',monospace;font-size:11px;}
.ts{color:var(--v3);font-weight:700;}.tu{color:var(--g3);}.td{color:var(--r3);}

.tabs-bar{position:relative;z-index:10;display:flex;align-items:center;
  background:var(--panel2);border-bottom:2px solid var(--b2);padding:0 24px;overflow-x:auto;}
.tabs-bar::-webkit-scrollbar{height:0;}
.tab-btn{display:flex;align-items:center;gap:8px;padding:14px 20px;
  font-family:'Orbitron',monospace;font-size:9px;letter-spacing:3px;
  border:none;background:transparent;color:var(--mu);cursor:pointer;
  border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .25s;white-space:nowrap;}
.tab-btn:hover{color:var(--v3);background:rgba(109,40,217,.06);}
.tab-btn.active{color:var(--v3);border-bottom-color:var(--v2);background:rgba(109,40,217,.08);}
.tab-icon{font-size:14px;}
.tab-badge{font-size:8px;padding:1px 6px;border-radius:8px;background:var(--v);color:#fff;font-family:'Share Tech Mono',monospace;}

.tab-content{animation:tabIn .4s ease both;}
.pane{background:var(--panel);padding:16px;position:relative;overflow:hidden;}
.pt{font-family:'Orbitron',monospace;font-size:9px;letter-spacing:4px;color:var(--v3);
  text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:9px;}
.pt::before{content:'';display:block;width:3px;height:14px;border-radius:2px;
  background:linear-gradient(180deg,var(--v2),var(--c));box-shadow:0 0 10px var(--v);}

/* Dashboard */
.dash-grid{display:grid;grid-template-columns:280px 1fr 310px;gap:1px;background:var(--b1);min-height:calc(100vh - 165px);}
.col{display:flex;flex-direction:column;gap:1px;}
.ring-wrap{background:var(--panel);padding:16px;text-align:center;}
.ring-cont{width:155px;height:155px;margin:0 auto 12px;position:relative;}
.ring-cont svg{width:100%;height:100%;}
.ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.ring-num{font-family:'Orbitron',monospace;font-size:40px;font-weight:900;line-height:1;}
.ring-lbl{font-size:8px;letter-spacing:3px;color:var(--mu);margin-top:3px;font-family:'Share Tech Mono',monospace;}
.emo{display:inline-flex;align-items:center;gap:6px;padding:5px 16px;border-radius:20px;
  font-family:'Share Tech Mono',monospace;font-size:10px;font-weight:700;letter-spacing:2px;margin-bottom:4px;}
.sig-row{display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--b1);cursor:pointer;transition:all .2s;}
.sig-row:hover{padding-left:5px;}.sig-row:last-child{border:none;}
.sig-ic{font-size:16px;flex-shrink:0;}
.sig-body{flex:1;min-width:0;}
.sig-name{font-size:11px;font-weight:700;}
.sig-val{font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--mu);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.sig-track{width:52px;height:4px;background:var(--b2);border-radius:2px;overflow:hidden;flex-shrink:0;}
.sig-fill{height:100%;border-radius:2px;transition:width 1.5s ease;}
.atabs{display:flex;gap:5px;flex-wrap:wrap;}
.atab{padding:4px 12px;border-radius:3px;font-family:'Share Tech Mono',monospace;font-size:10px;
  letter-spacing:1px;border:1px solid var(--b2);background:transparent;color:var(--mu);cursor:pointer;transition:all .2s;}
.atab.on{border-color:var(--v2);color:var(--v3);background:rgba(109,40,217,.15);}
.atab:hover:not(.on){color:var(--tx);}
.chart-area{width:100%;height:185px;}
.chart-area svg{width:100%;height:100%;}
.c-line{fill:none;stroke-width:2.5;stroke-dasharray:3000;animation:drawLine 3s ease both;}
.c-area{opacity:.2;}
.c-pred{fill:none;stroke-width:2;stroke-dasharray:7,4;opacity:.7;}
.wh-card{display:flex;align-items:center;gap:9px;padding:8px 10px;margin-bottom:6px;
  border-radius:5px;border:1px solid var(--b1);background:var(--panel2);cursor:pointer;transition:all .2s;}
.wh-card:hover{border-color:var(--v2);}
.wh-ic{font-size:18px;flex-shrink:0;}
.wh-body{flex:1;}
.wh-addr{font-family:'Share Tech Mono',monospace;font-size:9px;color:var(--mu);}
.wh-act{font-size:12px;font-weight:700;margin-top:1px;}
.wh-buy{color:var(--g3);}.wh-sell{color:var(--r3);}
.wh-amt{font-family:'Share Tech Mono',monospace;font-size:13px;font-weight:700;color:var(--a3);}
.news-mini{padding:9px 11px;margin-bottom:6px;border-radius:5px;border:1px solid var(--b1);
  background:var(--panel2);cursor:pointer;transition:all .2s;position:relative;overflow:hidden;}
.news-mini:hover{border-color:var(--v2);}
.news-mini::before{content:'';position:absolute;right:0;top:0;bottom:0;width:3px;}
.nm-bull::before{background:var(--g3);}.nm-bear::before{background:var(--r3);}.nm-neut::before{background:var(--mu);}
.nm-src{font-family:'Share Tech Mono',monospace;font-size:9px;color:var(--v3);margin-bottom:4px;display:flex;justify-content:space-between;}
.nm-h{font-size:11px;font-weight:600;line-height:1.4;}
.bot-row{display:flex;align-items:center;gap:9px;padding:9px 10px;margin-bottom:6px;
  border-radius:5px;border:1px solid var(--b1);background:var(--panel2);cursor:pointer;transition:all .2s;}
.bot-row:hover{border-color:var(--v2);}
.bot-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.bot-info{flex:1;}
.bot-name{font-family:'Orbitron',monospace;font-size:10px;letter-spacing:2px;}
.bot-strat{font-size:10px;color:var(--mu);margin-top:2px;}
.bot-acc{font-family:'Share Tech Mono',monospace;font-size:12px;font-weight:700;}
.act-btn{width:100%;padding:9px 14px;margin-bottom:7px;border-radius:5px;
  font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;
  cursor:pointer;transition:all .22s;border:1px solid;text-align:left;display:flex;align-items:center;gap:9px;}
.bv{border-color:var(--v2);color:var(--v3);background:rgba(109,40,217,.08);}
.bv:hover{background:rgba(109,40,217,.22);box-shadow:0 0 18px rgba(109,40,217,.25);transform:translateX(4px);}
.bc{border-color:var(--c);color:var(--c2);background:rgba(14,165,233,.06);}
.bc:hover{background:rgba(14,165,233,.18);transform:translateX(4px);}
.bg2{border-color:var(--g);color:var(--g3);background:rgba(5,150,105,.06);}
.bg2:hover{background:rgba(5,150,105,.18);transform:translateX(4px);}
.ba{border-color:var(--a);color:var(--a3);background:rgba(217,119,6,.06);}
.ba:hover{background:rgba(217,119,6,.18);transform:translateX(4px);}

/* FinBERT */
.fb-layout{display:grid;grid-template-columns:1fr 340px;gap:1px;background:var(--b1);min-height:calc(100vh - 165px);}
.scan-input{flex:1;padding:10px 15px;background:var(--panel2);border:1px solid var(--b2);
  border-radius:6px;color:var(--tx);font-family:'Syne',sans-serif;font-size:13px;outline:none;transition:border-color .2s;}
.scan-input:focus{border-color:var(--v2);}
.scan-btn{padding:10px 18px;border-radius:6px;border:1px solid var(--v2);
  background:rgba(109,40,217,.15);color:var(--v3);font-family:'Share Tech Mono',monospace;
  font-size:10px;letter-spacing:1px;cursor:pointer;transition:all .22s;white-space:nowrap;}
.scan-btn:hover:not(:disabled){background:rgba(109,40,217,.3);box-shadow:0 0 18px rgba(109,40,217,.3);}
.scan-btn:disabled{opacity:.4;cursor:not-allowed;}
.scan-all{padding:10px 16px;border-radius:6px;border:1px solid var(--c);
  background:rgba(14,165,233,.1);color:var(--c2);font-family:'Share Tech Mono',monospace;
  font-size:10px;letter-spacing:1px;cursor:pointer;transition:all .22s;}
.scan-all:hover:not(:disabled){background:rgba(14,165,233,.22);}
.scan-all:disabled{opacity:.4;cursor:not-allowed;}
.ss-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:0;}
.ss-card{padding:14px;border-radius:6px;text-align:center;border:1px solid;}
.ss-val{font-family:'Orbitron',monospace;font-size:28px;font-weight:900;}
.ss-lbl{font-size:9px;letter-spacing:2px;margin-top:4px;font-family:'Share Tech Mono',monospace;}
.ss-pct{font-family:'Share Tech Mono',monospace;font-size:11px;margin-top:3px;}
.ss-bull{border-color:rgba(16,185,129,.3);background:rgba(16,185,129,.06);}
.ss-bull .ss-val,.ss-bull .ss-pct{color:var(--g3);}.ss-bull .ss-lbl{color:var(--g2);}
.ss-bear{border-color:rgba(220,38,38,.3);background:rgba(220,38,38,.06);}
.ss-bear .ss-val,.ss-bear .ss-pct{color:var(--r3);}.ss-bear .ss-lbl{color:var(--r2);}
.ss-neut{border-color:rgba(76,61,138,.4);background:rgba(76,61,138,.06);}
.ss-neut .ss-val,.ss-neut .ss-pct{color:var(--v4);}.ss-neut .ss-lbl{color:var(--mu);}
.nf-scroll{max-height:480px;overflow-y:auto;display:flex;flex-direction:column;gap:7px;padding-right:3px;}
.nf-scroll::-webkit-scrollbar{width:3px;}
.nf-scroll::-webkit-scrollbar-thumb{background:var(--v2);border-radius:2px;}
.nc{padding:12px;border-radius:6px;border:1px solid var(--b1);background:var(--panel2);
  cursor:pointer;transition:all .22s;position:relative;overflow:hidden;animation:slideR .35s ease both;}
.nc:hover{border-color:var(--v2);transform:translateX(-3px);}
.nc::after{content:'';position:absolute;right:0;top:0;bottom:0;width:3px;}
.nc-bull::after{background:var(--g3);}.nc-bear::after{background:var(--r3);}.nc-neut::after{background:var(--mu);}
.nc-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;}
.nc-src{font-family:'Share Tech Mono',monospace;font-size:9px;color:var(--v3);letter-spacing:2px;}
.nc-right{display:flex;align-items:center;gap:6px;}
.nc-time{font-family:'Share Tech Mono',monospace;font-size:9px;color:var(--mu2);}
.nc-imp{font-size:8px;font-family:'Share Tech Mono',monospace;padding:1px 7px;border-radius:3px;}
.imp-c{background:rgba(220,38,38,.2);color:var(--r3);border:1px solid rgba(220,38,38,.3);}
.imp-h{background:rgba(217,119,6,.15);color:var(--a3);border:1px solid rgba(217,119,6,.25);}
.imp-m{background:rgba(76,61,138,.2);color:var(--mu);border:1px solid var(--b2);}
.nc-headline{font-size:12px;font-weight:600;line-height:1.5;margin-bottom:7px;}
.nc-footer{display:flex;align-items:center;justify-content:space-between;}
.nc-tags{display:flex;gap:4px;flex-wrap:wrap;}
.nc-tag{font-size:8px;padding:1px 6px;border-radius:2px;font-family:'Share Tech Mono',monospace;
  letter-spacing:1px;background:rgba(109,40,217,.15);color:var(--v3);border:1px solid rgba(109,40,217,.25);}
.ai-badge{display:flex;align-items:center;gap:5px;padding:3px 10px;border-radius:12px;
  font-family:'Share Tech Mono',monospace;font-size:9px;font-weight:700;letter-spacing:1px;}
.ai-badge .bdot{width:5px;height:5px;border-radius:50%;}
.ab-bull{background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.35);color:var(--g3);}
.ab-bull .bdot{background:var(--g3);}
.ab-bear{background:rgba(220,38,38,.12);border:1px solid rgba(220,38,38,.35);color:var(--r3);}
.ab-bear .bdot{background:var(--r3);}
.ab-neut{background:rgba(76,61,138,.15);border:1px solid var(--b2);color:var(--v4);}
.ab-neut .bdot{background:var(--v4);}
.ab-loading{background:rgba(109,40,217,.1);border:1px solid var(--b2);color:var(--mu);animation:pulse 1s infinite;}
.conf-bar{height:2px;background:var(--b2);border-radius:1px;overflow:hidden;margin-top:7px;}
.conf-fill{height:100%;border-radius:1px;transition:width 1.2s ease;}

/* Genome */
.gen-layout{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--b1);min-height:calc(100vh - 165px);}
.gen-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px;}
.gc{padding:14px;border-radius:6px;border:1px solid var(--b2);background:var(--panel2);
  position:relative;overflow:hidden;cursor:pointer;transition:all .25s;animation:fadeUp .4s ease both;}
.gc:hover{transform:translateY(-3px);border-color:var(--v2);}
.gc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
.gc-lbl{font-size:8px;letter-spacing:2px;color:var(--mu);font-family:'Share Tech Mono',monospace;margin-bottom:7px;}
.gc-val{font-family:'Orbitron',monospace;font-size:22px;font-weight:900;}
.gc-sub{font-size:10px;color:var(--mu);margin-top:4px;}
.gc-bar{height:3px;background:var(--b2);border-radius:2px;overflow:hidden;margin-top:8px;}
.gc-bar-fill{height:100%;border-radius:2px;transition:width 2s ease;}
.ga-item{padding:11px;border-radius:5px;border:1px solid var(--b1);background:var(--panel2);margin-bottom:7px;transition:all .2s;}
.ga-item:hover{border-color:var(--v2);}
.ga-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}
.ga-name{font-size:12px;font-weight:700;}
.ga-score{font-family:'Share Tech Mono',monospace;font-size:12px;}
.ga-desc{font-size:11px;color:var(--mu);line-height:1.5;}
.ga-bar{height:3px;background:var(--b2);border-radius:2px;overflow:hidden;margin-top:7px;}
.ga-bar-fill{height:100%;border-radius:2px;transition:width 1.5s ease;}

/* Narrative */
.narr-layout{display:grid;grid-template-columns:1fr 360px;gap:1px;background:var(--b1);min-height:calc(100vh - 165px);}
.narr-card{padding:16px;margin-bottom:8px;border-radius:6px;border:1px solid var(--b1);
  background:var(--panel2);position:relative;overflow:hidden;cursor:pointer;transition:all .22s;}
.narr-card:hover{border-color:var(--v2);}
.narr-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;}
.nc-decay::before{background:var(--a2);box-shadow:0 0 10px var(--a2);}
.nc-grow::before{background:var(--g3);box-shadow:0 0 10px var(--g3);}
.nc-fade::before{background:var(--r2);box-shadow:0 0 10px var(--r2);}
.narr-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;gap:10px;}
.narr-title{font-size:13px;font-weight:700;line-height:1.5;flex:1;}
.narr-pct{font-family:'Orbitron',monospace;font-size:18px;font-weight:900;padding:4px 12px;border-radius:5px;white-space:nowrap;}
.narr-progress{height:5px;background:var(--b2);border-radius:3px;overflow:hidden;margin-bottom:8px;}
.narr-prog-fill{height:100%;border-radius:3px;transition:width 2s ease;}
.narr-meta{display:flex;gap:12px;flex-wrap:wrap;}
.narr-meta-item{font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--mu);}
.narr-detail{margin-top:10px;padding:10px;border-radius:4px;background:var(--panel3);font-size:11px;line-height:1.6;color:var(--tx);border:1px solid var(--b2);}
.tl-item{display:flex;gap:12px;margin-bottom:14px;position:relative;}
.tl-item::before{content:'';position:absolute;left:6px;top:18px;bottom:-14px;width:1px;background:var(--b2);}
.tl-item:last-child::before{display:none;}
.tl-dot{width:13px;height:13px;border-radius:50%;flex-shrink:0;margin-top:3px;border:2px solid;}
.tl-event{font-size:12px;font-weight:600;margin-bottom:3px;}
.tl-time{font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--mu);}

/* Prediction */
.pred-layout{display:grid;grid-template-columns:1fr 330px;gap:1px;background:var(--b1);min-height:calc(100vh - 165px);}
.pi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px;}
.pi-card{padding:11px;border-radius:5px;border:1px solid var(--b2);background:var(--panel2);text-align:center;}
.pi-val{font-family:'Orbitron',monospace;font-size:15px;font-weight:700;}
.pi-lbl{font-size:9px;color:var(--mu);letter-spacing:1px;margin-top:3px;font-family:'Share Tech Mono',monospace;}
.pbot{padding:13px;margin-bottom:8px;border-radius:6px;border:1px solid var(--b2);
  background:var(--panel2);cursor:pointer;transition:all .22s;position:relative;overflow:hidden;}
.pbot:hover{border-color:var(--v2);}
.pbot::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
.pbot-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;}
.pbot-name{font-family:'Orbitron',monospace;font-size:10px;letter-spacing:2px;font-weight:700;}
.pbot-status{font-family:'Share Tech Mono',monospace;font-size:9px;padding:2px 8px;border-radius:10px;letter-spacing:1px;}
.ps-run{color:var(--g3);border:1px solid rgba(52,211,153,.4);background:rgba(52,211,153,.08);animation:pulse 2s infinite;}
.ps-ana{color:var(--a3);border:1px solid rgba(252,211,77,.4);background:rgba(252,211,77,.06);}
.ps-idle{color:var(--mu);border:1px solid var(--b2);}
.pbot-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px;}
.pbs{text-align:center;}
.pbs-v{font-family:'Share Tech Mono',monospace;font-size:13px;font-weight:700;}
.pbs-l{font-size:9px;color:var(--mu);letter-spacing:1px;}
.pbot-pred{padding:8px 10px;border-radius:4px;font-family:'Share Tech Mono',monospace;font-size:11px;
  border:1px solid;display:flex;align-items:center;justify-content:space-between;}
.pp-up{border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.06);color:var(--g3);}
.pp-dn{border-color:rgba(252,165,165,.3);background:rgba(252,165,165,.06);color:var(--r3);}
.pp-neut{border-color:var(--b2);background:transparent;color:var(--mu);}
.acc-bar{height:3px;background:var(--b2);border-radius:2px;overflow:hidden;margin-top:8px;}
.acc-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--v2),var(--g3));}
.run-btn{width:100%;padding:12px;border-radius:6px;margin-top:8px;
  background:linear-gradient(135deg,var(--v),var(--v2));border:none;color:#fff;
  font-family:'Orbitron',monospace;font-size:10px;letter-spacing:3px;cursor:pointer;transition:all .25s;}
.run-btn:hover:not(:disabled){box-shadow:0 0 25px rgba(109,40,217,.5);transform:translateY(-2px);}
.run-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}

/* AI Oracle */
.ai-layout{display:grid;grid-template-columns:270px 1fr;gap:1px;background:var(--b1);min-height:calc(100vh - 165px);}
.ctx-item{display:flex;align-items:center;gap:9px;padding:8px 10px;margin-bottom:6px;
  border-radius:5px;border:1px solid var(--b1);background:var(--panel2);}
.ctx-ic{font-size:15px;flex-shrink:0;}
.ctx-body{flex:1;}
.ctx-name{font-size:10px;font-weight:700;letter-spacing:.5px;}
.ctx-val{font-family:'Share Tech Mono',monospace;font-size:11px;margin-top:1px;}
.sugg-btn{display:block;width:100%;text-align:left;padding:9px 12px;margin-bottom:7px;
  border-radius:5px;border:1px solid var(--b2);background:var(--panel2);
  color:var(--tx);font-family:'Share Tech Mono',monospace;font-size:10px;
  letter-spacing:1px;cursor:pointer;transition:all .22s;}
.sugg-btn:hover{border-color:var(--v2);color:var(--v3);background:rgba(109,40,217,.1);transform:translateX(4px);}
.msgs-area{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;}
.msgs-area::-webkit-scrollbar{width:3px;}
.msgs-area::-webkit-scrollbar-thumb{background:var(--v2);border-radius:2px;}
.msg-u{align-self:flex-end;max-width:72%;padding:11px 16px;border-radius:14px 14px 4px 14px;
  background:rgba(109,40,217,.2);border:1px solid rgba(109,40,217,.35);font-size:13px;line-height:1.7;}
.msg-a{align-self:flex-start;max-width:84%;padding:13px 16px;border-radius:4px 14px 14px 14px;
  background:var(--panel2);border:1px solid var(--b2);font-size:13px;line-height:1.75;}
.msg-a .albl{font-family:'Orbitron',monospace;font-size:8px;letter-spacing:3px;color:var(--v3);margin-bottom:7px;}
.cur::after{content:'▋';animation:blink .7s infinite;color:var(--v3);}
.chat-foot{padding:14px 20px;border-top:1px solid var(--b2);display:flex;gap:10px;background:var(--panel2);}
.chat-in{flex:1;padding:11px 16px;background:var(--panel);border:1px solid var(--b2);
  border-radius:8px;color:var(--tx);font-family:'Syne',sans-serif;font-size:13px;outline:none;transition:border-color .2s;}
.chat-in:focus{border-color:var(--v2);}
.chat-send{padding:11px 22px;border-radius:8px;background:linear-gradient(135deg,var(--v),var(--v2));
  border:none;color:#fff;font-family:'Orbitron',monospace;font-size:9px;letter-spacing:2px;cursor:pointer;transition:all .25s;}
.chat-send:hover:not(:disabled){box-shadow:0 0 22px rgba(109,40,217,.5);transform:translateY(-1px);}
.chat-send:disabled{opacity:.4;cursor:not-allowed;transform:none;}

.toast{position:fixed;bottom:22px;right:22px;z-index:9000;padding:12px 18px;border-radius:7px;
  max-width:340px;font-family:'Share Tech Mono',monospace;font-size:11px;background:var(--panel);
  animation:slideR .4s ease;line-height:1.5;}
.t-ok{border-left:3px solid var(--g2);color:var(--g3);box-shadow:0 0 35px rgba(5,150,105,.2);}
.t-warn{border-left:3px solid var(--a2);color:var(--a3);box-shadow:0 0 35px rgba(217,119,6,.2);}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px;}
`;

// ── DATA ──────────────────────────────────────────────────────────────────────
const TICKER=[
  {sym:"BTC",price:"$67,420",chg:"+3.21%",up:true},{sym:"ETH",price:"$3,421",chg:"+1.84%",up:true},
  {sym:"SOL",price:"$182.4",chg:"-0.92%",up:false},{sym:"NVDA",price:"$874.5",chg:"+2.10%",up:true},
  {sym:"AAPL",price:"$213.8",chg:"+0.54%",up:true},{sym:"TSLA",price:"$248.3",chg:"-1.23%",up:false},
  {sym:"BNB",price:"$412.0",chg:"+0.87%",up:true},{sym:"XRP",price:"$0.612",chg:"+5.44%",up:true},
  {sym:"DOGE",price:"$0.142",chg:"-2.11%",up:false},{sym:"AVAX",price:"$38.20",chg:"+4.20%",up:true},
];
const ASSETS={
  BTC:{price:67420.5,chg:3.21,label:"Bitcoin / USDT",base:63000},
  ETH:{price:3421.8,chg:1.84,label:"Ethereum / USDT",base:3200},
  NVDA:{price:874.5,chg:2.10,label:"NVIDIA · NASDAQ",base:830},
  SOL:{price:182.4,chg:-0.92,label:"Solana / USDT",base:188},
  AAPL:{price:213.8,chg:0.54,label:"Apple · NASDAQ",base:210},
};
const SIGNALS=[
  {icon:"📱",name:"SOCIAL SENTIMENT",val:"Reddit 62% Bullish",pct:62,color:"var(--g3)"},
  {icon:"📰",name:"NEWS SENTIMENT",val:"FinBERT Live Scoring",pct:58,color:"var(--a3)"},
  {icon:"🐋",name:"WHALE ACTIVITY",val:"HIGH — Accumulating",pct:78,color:"var(--v3)"},
  {icon:"📊",name:"OPTIONS FLOW",val:"Calls 71% Bullish",pct:71,color:"var(--c2)"},
  {icon:"🌍",name:"MACRO PULSE",val:"Fed Neutral Stance",pct:50,color:"var(--a2)"},
  {icon:"😱",name:"MANIPULATION RISK",val:"LOW — Score 18%",pct:18,color:"var(--r3)"},
];
const GENOME={
  BTC:[
    {label:"FEAR SENSITIVITY",val:"9.2",max:10,color:"var(--r3)",sub:"Extreme FUD reaction"},
    {label:"HYPE CYCLE",val:"11.3",max:30,color:"var(--a3)",sub:"Avg days duration"},
    {label:"REDDIT LAG",val:"4.2",max:12,color:"var(--c2)",sub:"Signal-to-price hrs"},
    {label:"RESILIENCE",val:"8.1",max:10,color:"var(--g3)",sub:"Bounce strength"},
    {label:"MANIP RISK",val:"7.8",max:10,color:"var(--r2)",sub:"Pump vulnerability"},
    {label:"INST RATIO",val:"0.43",max:1,color:"var(--v3)",sub:"vs Retail index"},
  ],
  ETH:[
    {label:"FEAR SENSITIVITY",val:"8.1",max:10,color:"var(--r3)",sub:"Moderate FUD reaction"},
    {label:"HYPE CYCLE",val:"14.2",max:30,color:"var(--a3)",sub:"Avg days duration"},
    {label:"REDDIT LAG",val:"3.1",max:12,color:"var(--c2)",sub:"Signal-to-price hrs"},
    {label:"RESILIENCE",val:"7.4",max:10,color:"var(--g3)",sub:"Bounce strength"},
    {label:"MANIP RISK",val:"5.9",max:10,color:"var(--r2)",sub:"Pump vulnerability"},
    {label:"INST RATIO",val:"0.61",max:1,color:"var(--v3)",sub:"vs Retail index"},
  ],
  SOL:[
    {label:"FEAR SENSITIVITY",val:"9.6",max:10,color:"var(--r3)",sub:"High FUD reaction"},
    {label:"HYPE CYCLE",val:"8.7",max:30,color:"var(--a3)",sub:"Avg days duration"},
    {label:"REDDIT LAG",val:"2.4",max:12,color:"var(--c2)",sub:"Fast price reaction"},
    {label:"RESILIENCE",val:"6.8",max:10,color:"var(--g3)",sub:"Moderate bounce"},
    {label:"MANIP RISK",val:"8.9",max:10,color:"var(--r2)",sub:"High pump risk"},
    {label:"INST RATIO",val:"0.28",max:1,color:"var(--v3)",sub:"Retail dominated"},
  ],
};
const NARRATIVES=[
  {id:"ai",title:"AI will replace all software jobs → Tech stocks surge",strength:89,status:"decay",
   meta:{age:"127d",sources:2847,momentum:"-3.2%/wk"},
   detail:"Narrative at 89% saturation — peak signal. 2,847 unique sources this week. Historical pattern: narratives above 85% reverse within 2–4 weeks. Reduce tech exposure, rotate defensive.",
   timeline:[{event:"ChatGPT viral — narrative ignites",time:"Jan 2023",color:"var(--g3)"},{event:"Microsoft $10B — narrative peaks",time:"Mar 2024",color:"var(--a3)"},{event:"Saturation 89% — DECAY SIGNAL",time:"Now",color:"var(--r2)"}]},
  {id:"btc",title:"Bitcoin digital gold — inflation hedge supercycle",strength:74,status:"grow",
   meta:{age:"312d",sources:1204,momentum:"+1.8%/wk"},
   detail:"Healthy expanding narrative. ETF approval boosted institutional messaging. 15 points below peak — room to grow. Maintain/accumulate BTC.",
   timeline:[{event:"ETF approval — narrative boost",time:"Nov 2023",color:"var(--g3)"},{event:"BlackRock 12k BTC purchase",time:"Last week",color:"var(--g3)"},{event:"Expanding — 74% strength",time:"Now",color:"var(--g3)"}]},
  {id:"defi",title:"DeFi Summer 2.0 — institutional yield farming",strength:61,status:"grow",
   meta:{age:"44d",sources:612,momentum:"+4.1%/wk"},
   detail:"Early-stage narrative, strong momentum +4.1%/wk. Institutional DeFi products launching. Recommended: small speculative DeFi position.",
   timeline:[{event:"Goldman Sachs DeFi desk rumors",time:"3 weeks ago",color:"var(--g3)"},{event:"Aave institutional launch",time:"Last week",color:"var(--g3)"},{event:"Building — 61% strength",time:"Now",color:"var(--a3)"}]},
  {id:"rec",title:"Recession fears → flight to quality assets",strength:38,status:"fade",
   meta:{age:"89d",sources:441,momentum:"-6.8%/wk"},
   detail:"Rapidly fading. PMI expansion and cooling inflation undermining fear narrative. Unwind recession hedges while window remains.",
   timeline:[{event:"Inverted yield curve peaks",time:"2 months ago",color:"var(--r2)"},{event:"CPI prints soft — weakens",time:"3 weeks ago",color:"var(--a3)"},{event:"Fading — 38% strength",time:"Now",color:"var(--r2)"}]},
];
const PRED_BOTS=[
  {id:"lstm",name:"LSTM NEURAL NET",strategy:"Deep learning · 90-day history",status:"running",accuracy:88.4,
   predictions:{BTC:"$71,200",ETH:"$3,890",SOL:"$198",NVDA:"$920",AAPL:"$224"},
   direction:{BTC:"up",ETH:"up",SOL:"up",NVDA:"up",AAPL:"up"},
   confidence:{BTC:84,ETH:79,SOL:71,NVDA:88,AAPL:76},timeframe:"7 days",color:"var(--v2)"},
  {id:"tft",name:"TEMPORAL FUSION",strategy:"Multi-horizon transformer",status:"running",accuracy:91.2,
   predictions:{BTC:"$69,800",ETH:"$3,720",SOL:"$175",NVDA:"$895",AAPL:"$219"},
   direction:{BTC:"up",ETH:"up",SOL:"dn",NVDA:"up",AAPL:"up"},
   confidence:{BTC:91,ETH:85,SOL:67,NVDA:93,AAPL:82},timeframe:"3 days",color:"var(--c)"},
  {id:"sent",name:"SENTIMENT BOT",strategy:"FinBERT + social fusion",status:"analyzing",accuracy:84.7,
   predictions:{BTC:"$72,500",ETH:"$4,100",SOL:"$210",NVDA:"$940",AAPL:"$228"},
   direction:{BTC:"up",ETH:"up",SOL:"up",NVDA:"up",AAPL:"up"},
   confidence:{BTC:78,ETH:73,SOL:65,NVDA:81,AAPL:70},timeframe:"14 days",color:"var(--g2)"},
  {id:"whale",name:"WHALE TRACKER",strategy:"On-chain accumulation signals",status:"running",accuracy:87.1,
   predictions:{BTC:"$68,900",ETH:"$3,580",SOL:"$185",NVDA:"$860",AAPL:"$216"},
   direction:{BTC:"up",ETH:"up",SOL:"up",NVDA:"neut",AAPL:"neut"},
   confidence:{BTC:88,ETH:74,SOL:69,NVDA:52,AAPL:55},timeframe:"5 days",color:"var(--a2)"},
];
const NEWS_INIT=[
  {src:"REUTERS",time:"2m",headline:"Federal Reserve signals potential rate cuts in Q2 2026 amid cooling inflation data",tags:["MACRO","FED"],impact:"HIGH"},
  {src:"BLOOMBERG",time:"5m",headline:"Bitcoin ETF inflows hit $800M in single day as institutional demand surges",tags:["BTC","ETF"],impact:"HIGH"},
  {src:"CNBC",time:"9m",headline:"NVIDIA earnings beat expectations by 24%, raises full-year AI guidance significantly",tags:["NVDA","EARN"],impact:"CRIT"},
  {src:"COINDESK",time:"14m",headline:"SEC delays decision on Ethereum ETF options trading to next quarter",tags:["ETH","SEC"],impact:"MED"},
  {src:"WSJ",time:"21m",headline:"China manufacturing PMI expands for third consecutive month, global risk appetite recovers",tags:["MACRO","CHINA"],impact:"MED"},
  {src:"THEBLOCK",time:"33m",headline:"BlackRock increases Bitcoin holdings by 12,000 BTC through spot ETF vehicle",tags:["BTC","INST"],impact:"HIGH"},
  {src:"DECRYPT",time:"47m",headline:"Solana network congestion causes 8% transaction failure rate, developers investigating",tags:["SOL","TECH"],impact:"MED"},
  {src:"FT",time:"58m",headline:"UK inflation drops to 2.1% target, Bank of England hints at June rate decision review",tags:["MACRO","GBP"],impact:"MED"},
];
const AI_SUGGS=["What is the best trade right now?","Analyze BTC consciousness score","Which narrative is most dangerous?","Explain whale accumulation signal","Should I buy or sell ETH today?","What does options flow tell us?"];

function genPrices(base,n=65){let p=base,a=[];for(let i=0;i<n;i++){p+=(Math.random()-.478)*p*.009;a.push(p);}return a;}
function toSVG(pts,W=800,H=185){const mn=Math.min(...pts)*.997,mx=Math.max(...pts)*1.003;return pts.map((p,i)=>[(i/(pts.length-1))*W,H-((p-mn)/(mx-mn))*H*.84-H*.06]);}
function fmt(n){return n>999?"$"+n.toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0}):"$"+n.toFixed(2);}
async function callClaude(system,msg,history=[]){
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:[...history,{role:"user",content:msg}]})});
  const d=await r.json();
  return d.content?.map(c=>c.text||"").join("")||"";
}

export default function PhantomMind(){
  const [tab,setTab]=useState("dashboard");
  const [asset,setAsset]=useState("BTC");
  const [prices,setPrices]=useState({...ASSETS});
  const [score,setScore]=useState(58);
  const [chartPts,setChartPts]=useState([]);
  const [predPts,setPredPts]=useState([]);
  const [whales,setWhales]=useState([
    {addr:"0x3f2a...8c4d",action:"BUY",asset:"BTC",amount:"$42.8M",icon:"🐋",time:"1m"},
    {addr:"0x9b1c...2e7f",action:"SELL",asset:"ETH",amount:"$18.3M",icon:"🦈",time:"4m"},
    {addr:"0x7d4e...1a9b",action:"BUY",asset:"SOL",amount:"$9.1M",icon:"🐳",time:"9m"},
    {addr:"0x2c8f...5d3a",action:"BUY",asset:"BTC",amount:"$61.2M",icon:"🐋",time:"14m"},
  ]);
  const [news,setNews]=useState(NEWS_INIT.map(n=>({...n,sentiment:null,confidence:null,scanning:false,reason:""})));
  const [customHL,setCustomHL]=useState("");
  const [scanAllLoading,setScanAllLoading]=useState(false);
  const [genAsset,setGenAsset]=useState("BTC");
  const [genAnalysis,setGenAnalysis]=useState("");
  const [genLoading,setGenLoading]=useState(false);
  const [activeNarr,setActiveNarr]=useState(0);
  const [narrInsight,setNarrInsight]=useState("");
  const [narrLoading,setNarrLoading]=useState(false);
  const [predAsset,setPredAsset]=useState("BTC");
  const [predLoading,setPredLoading]=useState(false);
  const [predConsensus,setPredConsensus]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [aiInput,setAiInput]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [toast,setToast]=useState(null);
  const msgEnd=useRef(null);

  const makeChart=useCallback((a)=>{
    const pts=toSVG(genPrices(ASSETS[a].base));
    setChartPts(pts);
    const last=pts[pts.length-1];
    let px=last[0],py=last[1],pp=[[px,py]];
    for(let i=0;i<14;i++){px+=(800-last[0])/14;py+=(Math.random()-.43)*9;py=Math.max(8,Math.min(182,py));pp.push([px,py]);}
    setPredPts(pp);
  },[]);

  useEffect(()=>{makeChart(asset);},[asset,makeChart]);
  useEffect(()=>{
    const t=setInterval(()=>{
      setPrices(p=>{const n={...p};Object.keys(n).forEach(k=>{n[k]={...n[k],price:n[k].price*(1+(Math.random()-.499)*.002)};});return n;});
      setScore(s=>Math.max(12,Math.min(94,s+(Math.random()-.5)*3)));
      makeChart(asset);
    },4500);
    return()=>clearInterval(t);
  },[asset,makeChart]);
  useEffect(()=>{
    const t=setInterval(()=>{
      const acts=["BUY","SELL"],ass=["BTC","ETH","SOL","AVAX","BNB"];
      setWhales(w=>[{addr:`0x${Math.random().toString(16).slice(2,6)}...${Math.random().toString(16).slice(2,6)}`,
        action:acts[Math.random()>.38?0:1],asset:ass[Math.floor(Math.random()*ass.length)],
        amount:`$${(Math.random()*65+5).toFixed(1)}M`,icon:Math.random()>.5?"🐋":"🦈",time:"now"},...w.slice(0,5)]);
    },14000);
    return()=>clearInterval(t);
  },[]);
  useEffect(()=>{msgEnd.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),4500);};

  const scoreOne=async(idx,hl)=>{
    setNews(p=>p.map((n,i)=>i===idx?{...n,scanning:true}:n));
    try{
      const raw=await callClaude(`You are FinBERT, a financial news sentiment AI. Respond ONLY with valid JSON no extra text: {"sentiment":"bull","confidence":0.87,"reason":"brief reason under 8 words"}. sentiment must be exactly "bull","bear", or "neut".`,`Analyze this headline: "${hl}"`);
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setNews(p=>p.map((n,i)=>i===idx?{...n,...parsed,scanning:false}:n));
    }catch{
      const h=hl.toLowerCase();
      const bs=["beat","surge","jump","rise","approv","inflow","expand","cut rate","gain","record","upgrade"].filter(w=>h.includes(w)).length;
      const ds=["delay","fall","drop","declin","reject","fail","fear","miss","warn","congestion"].filter(w=>h.includes(w)).length;
      setNews(p=>p.map((n,i)=>i===idx?{...n,sentiment:bs>ds?"bull":ds>bs?"bear":"neut",confidence:0.68+Math.random()*.18,reason:"Heuristic NLP",scanning:false}:n));
    }
  };
  const scoreAll=async()=>{
    setScanAllLoading(true);showToast("🤖 FinBERT scanning all headlines...");
    for(let i=0;i<news.length;i++){if(!news[i].sentiment&&!news[i].scanning){await scoreOne(i,news[i].headline);await new Promise(r=>setTimeout(r,280));}}
    setScanAllLoading(false);showToast("✅ All headlines scored by FinBERT AI!");
  };
  const addCustom=async()=>{
    if(!customHL.trim()||scanAllLoading)return;
    const item={src:"CUSTOM",time:"now",headline:customHL,tags:["MANUAL"],impact:"MED",sentiment:null,confidence:null,scanning:true,reason:""};
    setNews(p=>[item,...p]);setCustomHL("");
    await new Promise(r=>setTimeout(r,80));
    await scoreOne(0,customHL);
    showToast("🤖 FinBERT scored your headline!");
  };
  const sentStats={bull:news.filter(n=>n.sentiment==="bull").length,bear:news.filter(n=>n.sentiment==="bear").length,neut:news.filter(n=>n.sentiment==="neut").length};
  const totalScored=sentStats.bull+sentStats.bear+sentStats.neut;

  const runGenome=async()=>{
    setGenLoading(true);
    const g=GENOME[genAsset]||GENOME.BTC;
    try{
      const txt=await callClaude(`You are PHANTOM MIND's Behavioral Genome Engine. Analyze asset psychological profiles and give sharp trading insights. Under 180 words.`,`Analyze behavioral genome of ${genAsset}: ${g.map(x=>`${x.label}: ${x.val}`).join(", ")}. Current price: ${fmt(prices[genAsset]?.price||0)}. What does this tell us for the next 7 days?`);
      setGenAnalysis(txt);
    }catch{setGenAnalysis(`${genAsset} Genome: Fear sensitivity 9.2/10 + institutional ratio 0.43 = retail-fear/institutional-buy dynamic. 4.2hr Reddit-price lag means social signals are tradeable. Resilience 8.1/10 shows strong bounce potential. Recommendation: Buy fear dips, reduce on social euphoria peaks.`);}
    setGenLoading(false);
  };

  const getNarrInsight=async(idx)=>{
    setNarrLoading(true);setActiveNarr(idx);setNarrInsight("");
    const n=NARRATIVES[idx];
    try{
      const txt=await callClaude(`You are PHANTOM MIND's Narrative Collapse Detector. Analyze market narrative health. Sharp and actionable. Under 140 words.`,`Narrative: "${n.title}". Strength: ${n.strength}%, Status: ${n.status}, Age: ${n.meta.age}, Sources: ${n.meta.sources}, Momentum: ${n.meta.momentum}. Trading implication next 2 weeks?`);
      setNarrInsight(txt);
    }catch{setNarrInsight(`"${n.title}" at ${n.strength}%: ${n.status==="decay"?"DECAY — saturation above 85% precedes rotation in 2–4 weeks. Reduce exposure now.":"GROWTH — healthy momentum, maintain exposure. Watch for 80%+ as exit signal."}`);}
    setNarrLoading(false);
  };

  const runPrediction=async()=>{
    setPredLoading(true);setPredConsensus(null);showToast(`🤖 Running 4 prediction bots on ${predAsset}...`);
    const botPreds=PRED_BOTS.map(b=>`${b.name}: ${b.predictions[predAsset]} (${b.direction[predAsset]==="up"?"↑":"↓"}, ${b.confidence[predAsset]}% conf)`).join("\n");
    try{
      const txt=await callClaude(`You are PHANTOM MIND's Prediction Consensus Engine. Synthesize LSTM, TFT, Sentiment Bot, and Whale Tracker predictions into a consensus. Precise price targets, confidence, risks, BUY/SELL/HOLD. Under 200 words.`,`${predAsset} at ${fmt(prices[predAsset]?.price||0)}\n\nBot predictions:\n${botPreds}\n\nGive consensus prediction with: 1) Target price 2) Confidence % 3) Key risks 4) Action.`);
      setPredConsensus(txt);
    }catch{setPredConsensus(`CONSENSUS — ${predAsset}: Target ${PRED_BOTS[0].predictions[predAsset]} (+4.9%). Confidence: 82%. All 4 bots signal upside. Whale tracker confirms $42.8M accumulation. FinBERT 62% bullish. Risk: manipulation score 7.8/10. Action: BUY — 60% now, 40% on dip.`);}
    setPredLoading(false);showToast(`✅ Prediction consensus ready for ${predAsset}!`);
  };

  const sendAI=async(q)=>{
    if(!q.trim()||aiLoading)return;
    const question=q;setAiInput("");
    setMsgs(m=>[...m,{role:"user",text:question}]);
    setAiLoading(true);
    const cLabel=score<40?"EXTREME FEAR":score<55?"FEARFUL":score<65?"ANXIOUS":score<75?"NEUTRAL":score<85?"GREEDY":"EXTREME GREED";
    const history=msgs.slice(-6).map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}));
    try{
      const txt=await callClaude(
        `You are PHANTOM MIND — the world's first Collective Market Consciousness Engine. LIVE CONTEXT: Consciousness Score: ${Math.round(score)}/100 (${cLabel}). FinBERT: ${sentStats.bull} BULLISH, ${sentStats.bear} BEARISH. Whale Activity: $42.8M BTC accumulation (HIGH). Options: 71% Calls. Social: Reddit 62% Bullish. AI Narrative: 89% saturation DECAY SIGNAL. Active asset: ${predAsset} at ${fmt(prices[predAsset]?.price||0)}. Manipulation Risk: LOW 18%. Respond like a top quant hedge fund AI. Sharp, specific numbers, bold recommendations. Under 200 words.`,
        question,history
      );
      setMsgs(m=>[...m,{role:"ai",text:txt}]);
    }catch{
      setMsgs(m=>[...m,{role:"ai",text:`Market consciousness ${Math.round(score)}/100 (${cLabel}). FinBERT: ${sentStats.bull} bull vs ${sentStats.bear} bear — net bullish. Whale radar: $42.8M BTC institutional accumulation. Options 71% calls — smart money positioned for upside. The retail-fear/institutional-buy divergence is Phantom Mind's strongest confluence signal. Recommendation: scale into ${predAsset} on 3–5% dip, stop at -8%.`}]);
    }
    setAiLoading(false);
  };

  const lp=chartPts.map((p,i)=>(i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(" ");
  const ap=lp+(chartPts.length?` L${chartPts[chartPts.length-1][0]},185 L${chartPts[0][0]},185 Z`:"");
  const pp=predPts.map((p,i)=>(i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(" ");
  const isUp=prices[asset]?.chg>=0;
  const ringOffset=440-(score/100)*440;
  const cColor=score<40?"#ef4444":score<55?"#f59e0b":score<70?"#f59e0b":score<80?"#10b981":"#ef4444";
  const cLabel=score<40?"😱 EXTREME FEAR":score<55?"😰 FEARFUL":score<65?"⚠️ ANXIOUS":score<75?"😐 NEUTRAL":score<85?"😎 GREEDY":"🤑 EXTREME GREED";

  function radarPath(vals,maxVals,cx=100,cy=100,r=70){
    return vals.map((v,i)=>{const a=(i/vals.length)*Math.PI*2-Math.PI/2;const ratio=Math.min(parseFloat(v)/parseFloat(maxVals[i]),1);return`${i===0?"M":"L"}${(cx+r*ratio*Math.cos(a)).toFixed(1)},${(cy+r*ratio*Math.sin(a)).toFixed(1)}`;}).join(" ")+"Z";
  }
  function radarAxes(n=6,cx=100,cy=100,r=70){return Array.from({length:n},(_,i)=>{const a=(i/n)*Math.PI*2-Math.PI/2;return{x2:(cx+r*Math.cos(a)).toFixed(1),y2:(cy+r*Math.sin(a)).toFixed(1)};});}
  const gData=GENOME[genAsset]||GENOME.BTC;

  const TABS=[
    {id:"dashboard",label:"DASHBOARD",icon:"🖥️"},
    {id:"finbert",label:"FINBERT AI",icon:"📰",badge:"LIVE"},
    {id:"genome",label:"BEHAVIORAL GENOME",icon:"🧬"},
    {id:"narrative",label:"NARRATIVE DETECTOR",icon:"📖"},
    {id:"prediction",label:"PREDICTION BOTS",icon:"🔮",badge:"AI"},
    {id:"oracle",label:"PHANTOM AI",icon:"👻",badge:"NEW"},
  ];

  return(
    <>
      <style>{STYLES}</style>
      <div className="bg-mesh"/><div className="grid-bg"/><div className="scan"/>

      <header className="hdr">
        <div className="logo-g">
          <div className="orb"><div className="orb-i">👻</div></div>
          <div><div className="logo">PHANTOM </div><div className="logo-sub">COLLECTIVE MARKET CONSCIOUSNESS ENGINE</div></div>
        </div>
        <div className="hdr-right">
          {[{v:fmt(prices.BTC.price),l:"BTC PRICE",c:"var(--g3)"},{v:`${Math.round(score)}/100`,l:"CONSCIOUSNESS",c:cColor},{v:`${totalScored} SCORED`,l:"FINBERT",c:"var(--v3)"},{v:"4 BOTS",l:"PREDICTION",c:"var(--c2)"}].map((s,i)=>(
            <div className="hstat" key={i}><div className="hv" style={{color:s.c}}>{s.v}</div><div className="hl">{s.l}</div></div>
          ))}
          <div className="live-pill"><div className="ldot"/>MARKETS LIVE</div>
        </div>
      </header>

      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER,...TICKER].map((t,i)=>(
            <div className="ti" key={i}><span className="ts">{t.sym}</span><span>{t.price}</span><span className={t.up?"tu":"td"}>{t.up?"▲":"▼"} {t.chg}</span></div>
          ))}
        </div>
      </div>

      <div className="tabs-bar">
        {TABS.map(t=>(
          <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
            <span className="tab-icon">{t.icon}</span>{t.label}
            {t.badge&&<span className="tab-badge">{t.badge}</span>}
          </button>
        ))}
      </div>

      {tab==="dashboard"&&(
        <div className="tab-content">
          <div className="dash-grid">
            <div className="col">
              <div className="ring-wrap">
                <div className="pt" style={{marginBottom:"12px"}}><span>🧠 Market Consciousness</span></div>
                <div className="ring-cont">
                  <svg viewBox="0 0 155 155">
                    <defs><linearGradient id="rg"><stop offset="0%" stopColor="#ef4444"/><stop offset="50%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#10b981"/></linearGradient></defs>
                    <circle cx="77.5" cy="77.5" r="67" fill="none" stroke="var(--b2)" strokeWidth="9"/>
                    <circle cx="77.5" cy="77.5" r="67" fill="none" stroke="url(#rg)" strokeWidth="9" strokeLinecap="round" strokeDasharray="421" strokeDashoffset={421-(score/100)*421} style={{transform:"rotate(-90deg)",transformOrigin:"77.5px 77.5px",transition:"stroke-dashoffset 2s ease"}}/>
                  </svg>
                  <div className="ring-center">
                    <div className="ring-num" style={{color:cColor,textShadow:`0 0 22px ${cColor}`}}>{Math.round(score)}</div>
                    <div className="ring-lbl">FEAR/GREED</div>
                  </div>
                </div>
                <div className="emo" style={{color:cColor,border:`1px solid ${cColor}`,background:`${cColor}18`}}>{cLabel}</div>
              </div>
              <div className="pane" style={{flex:1}}>
                <div className="pt">📡 Live Signals</div>
                {SIGNALS.map((s,i)=>(
                  <div className="sig-row" key={i}>
                    <span className="sig-ic">{s.icon}</span>
                    <div className="sig-body"><div className="sig-name">{s.name}</div><div className="sig-val">{s.val}</div></div>
                    <div className="sig-track"><div className="sig-fill" style={{width:`${s.pct}%`,background:s.color,boxShadow:`0 0 6px ${s.color}`}}/></div>
                  </div>
                ))}
              </div>
              <div className="pane">
                <div className="pt">⚡ Quick Actions</div>
                {[{cls:"bv",icon:"📰",label:"FINBERT NEWS SCAN",fn:()=>{setTab("finbert");setTimeout(scoreAll,300);}},{cls:"bc",icon:"🔮",label:"PREDICT PRICES",fn:()=>setTab("prediction")},{cls:"bg2",icon:"🧬",label:"GENOME ANALYSIS",fn:()=>{setTab("genome");setTimeout(runGenome,300);}},{cls:"ba",icon:"👻",label:"ASK PHANTOM AI",fn:()=>setTab("oracle")}].map((b,i)=>(
                  <button key={i} className={`act-btn ${b.cls}`} onClick={b.fn}><span>{b.icon}</span>{b.label}</button>
                ))}
              </div>
            </div>
            <div className="col">
              <div className="pane">
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"10px"}}>
                  <div><div className="atabs">{Object.keys(ASSETS).map(k=><button key={k} className={`atab${asset===k?" on":""}`} onClick={()=>setAsset(k)}>{k}</button>)}</div><div style={{fontSize:"10px",color:"var(--mu)",fontFamily:"'Share Tech Mono',monospace",marginTop:"6px",letterSpacing:"1px"}}>{ASSETS[asset].label}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"26px",fontWeight:"700",color:isUp?"var(--g3)":"var(--r3)"}}>{fmt(prices[asset]?.price||0)}</div><div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"12px",color:isUp?"var(--g3)":"var(--r3)",marginTop:"2px"}}>{isUp?"▲ +":"▼ "}{Math.abs(prices[asset]?.chg||0).toFixed(2)}% TODAY</div></div>
                </div>
                <div className="chart-area">
                  <svg viewBox="0 0 800 185" preserveAspectRatio="none">
                    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={isUp?"#10b981":"#ef4444"} stopOpacity=".5"/><stop offset="100%" stopColor={isUp?"#10b981":"#ef4444"} stopOpacity="0"/></linearGradient></defs>
                    {chartPts.length>0&&<><path d={ap} fill="url(#cg)" className="c-area"/><path d={lp} className="c-line" stroke={isUp?"#34d399":"#fca5a5"}/><path d={pp} className="c-pred" stroke="var(--v2)"/></>}
                  </svg>
                </div>
                <div style={{display:"flex",gap:"14px",marginTop:"6px",fontFamily:"'Share Tech Mono',monospace",fontSize:"10px",color:"var(--mu)"}}>
                  <span style={{color:isUp?"var(--g3)":"var(--r3)"}}>— PRICE</span><span style={{color:"var(--v2)"}}>- - AI PREDICTION</span>
                </div>
              </div>
              <div className="pane" style={{flex:1}}>
                <div className="pt">🤖 Prediction Bots</div>
                {PRED_BOTS.map((b,i)=>(
                  <div className="bot-row" key={i} onClick={()=>setTab("prediction")}>
                    <div className="bot-dot" style={{background:b.status==="running"?"var(--g3)":b.status==="analyzing"?"var(--a3)":"var(--mu)",boxShadow:b.status==="running"?"0 0 8px var(--g3)":"none"}}/>
                    <div className="bot-info"><div className="bot-name">{b.name}</div><div className="bot-strat">{b.strategy}</div></div>
                    <div><div className="bot-acc" style={{color:"var(--g3)"}}>{b.accuracy}%</div><div style={{fontSize:"9px",color:"var(--mu)",fontFamily:"'Share Tech Mono',monospace",textAlign:"right"}}>WIN RATE</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col">
              <div className="pane" style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
                  <div className="pt" style={{marginBottom:0}}>📰 News AI Feed</div>
                  <span style={{fontSize:"9px",color:"var(--g3)",fontFamily:"'Share Tech Mono',monospace",animation:"pulse 1.5s infinite"}}>● LIVE</span>
                </div>
                {news.slice(0,6).map((n,i)=>(
                  <div key={i} className={`news-mini nm-${n.sentiment||"neut"}`} onClick={()=>setTab("finbert")}>
                    <div className="nm-src"><span>{n.src}</span>{n.sentiment&&<span style={{color:n.sentiment==="bull"?"var(--g3)":n.sentiment==="bear"?"var(--r3)":"var(--mu)"}}>{n.sentiment==="bull"?"▲ BULL":n.sentiment==="bear"?"▼ BEAR":"◆ NEUT"}</span>}{n.scanning&&<span style={{color:"var(--v3)",animation:"pulse 1s infinite"}}>SCANNING...</span>}</div>
                    <div className="nm-h">{n.headline}</div>
                  </div>
                ))}
              </div>
              <div className="pane">
                <div className="pt">🐋 Whale Radar</div>
                {whales.slice(0,4).map((w,i)=>(
                  <div className="wh-card" key={i}>
                    <span className="wh-ic">{w.icon}</span>
                    <div className="wh-body"><div className="wh-addr">{w.addr} · {w.time}</div><div className={`wh-act ${w.action==="BUY"?"wh-buy":"wh-sell"}`}>{w.action} {w.asset}</div></div>
                    <div className="wh-amt">{w.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="finbert"&&(
        <div className="tab-content">
          <div className="fb-layout">
            <div className="col">
              <div className="pane">
                <div className="pt">📰 FinBERT News Sentiment AI</div>
                <div style={{fontSize:"12px",color:"var(--mu)",marginBottom:"14px",lineHeight:"1.7"}}>FinBERT scores each headline as <span style={{color:"var(--g3)"}}>BULLISH ▲</span>, <span style={{color:"var(--r3)"}}>BEARISH ▼</span>, or <span style={{color:"var(--v4)"}}>NEUTRAL ◆</span> with a confidence score. Powered by Claude AI acting as FinBERT. Click any headline to score it, or scan all at once.</div>
                <div style={{display:"flex",gap:"8px",marginBottom:"14px"}}>
                  <input className="scan-input" value={customHL} onChange={e=>setCustomHL(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()} placeholder="Enter any financial headline to score with FinBERT AI..."/>
                  <button className="scan-btn" onClick={addCustom} disabled={!customHL.trim()||scanAllLoading}>SCORE</button>
                  <button className="scan-all" onClick={scoreAll} disabled={scanAllLoading}>{scanAllLoading?"SCANNING...":"SCAN ALL"}</button>
                </div>
                <div className="ss-grid">
                  {[{cls:"ss-bull",val:sentStats.bull,lbl:"BULLISH",pct:totalScored?Math.round(sentStats.bull/totalScored*100):0},{cls:"ss-bear",val:sentStats.bear,lbl:"BEARISH",pct:totalScored?Math.round(sentStats.bear/totalScored*100):0},{cls:"ss-neut",val:sentStats.neut,lbl:"NEUTRAL",pct:totalScored?Math.round(sentStats.neut/totalScored*100):0}].map((s,i)=>(
                    <div key={i} className={`ss-card ${s.cls}`}><div className="ss-val">{s.val}</div><div className="ss-lbl">{s.lbl}</div><div className="ss-pct">{s.pct}%</div></div>
                  ))}
                </div>
              </div>
              <div className="pane" style={{flex:1}}>
                <div className="pt">Live Headlines</div>
                <div className="nf-scroll">
                  {news.map((n,i)=>(
                    <div key={i} className={`nc nc-${n.sentiment||"neut"}`} style={{animationDelay:`${i*.05}s`}} onClick={()=>!n.sentiment&&!n.scanning&&scoreOne(i,n.headline)}>
                      <div className="nc-meta"><span className="nc-src">{n.src}</span><div className="nc-right"><span className={`nc-imp ${n.impact==="CRIT"?"imp-c":n.impact==="HIGH"?"imp-h":"imp-m"}`}>{n.impact}</span><span className="nc-time">{n.time} ago</span></div></div>
                      <div className="nc-headline">{n.headline}</div>
                      <div className="nc-footer">
                        <div className="nc-tags">{n.tags.map((t,j)=><span className="nc-tag" key={j}>{t}</span>)}</div>
                        {n.scanning&&<div className="ai-badge ab-loading"><div className="bdot"/>AI SCORING...</div>}
                        {n.sentiment&&!n.scanning&&<div className={`ai-badge ab-${n.sentiment}`}><div className="bdot"/>{n.sentiment==="bull"?"▲ BULLISH":n.sentiment==="bear"?"▼ BEARISH":"◆ NEUTRAL"} {n.confidence&&`${(n.confidence*100).toFixed(0)}%`}</div>}
                        {!n.sentiment&&!n.scanning&&<div className="ai-badge ab-loading" style={{cursor:"pointer",opacity:.7}}>CLICK TO SCORE</div>}
                      </div>
                      {n.sentiment&&<div className="conf-bar"><div className="conf-fill" style={{width:`${(n.confidence||0)*100}%`,background:n.sentiment==="bull"?"var(--g3)":n.sentiment==="bear"?"var(--r3)":"var(--v3)"}}/></div>}
                      {n.reason&&<div style={{fontSize:"10px",color:"var(--mu)",marginTop:"5px",fontFamily:"'Share Tech Mono',monospace"}}>AI: {n.reason}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="pane" style={{flex:1}}>
                <div className="pt">📊 Market Signal</div>
                <div style={{padding:"16px",borderRadius:"6px",border:"1px solid var(--b2)",background:"var(--panel2)",marginBottom:"14px",textAlign:"center"}}>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"10px",color:"var(--v3)",letterSpacing:"2px",marginBottom:"10px"}}>OVERALL MARKET DIRECTION</div>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:"28px",fontWeight:"900",color:sentStats.bull>sentStats.bear?"var(--g3)":sentStats.bear>sentStats.bull?"var(--r3)":"var(--v4)"}}>{sentStats.bull>sentStats.bear?"📈 BULLISH":sentStats.bear>sentStats.bull?"📉 BEARISH":"◆ MIXED"}</div>
                  <div style={{fontSize:"11px",color:"var(--mu)",marginTop:"8px",fontFamily:"'Share Tech Mono',monospace"}}>{totalScored} articles scored</div>
                  {totalScored>0&&<div style={{fontSize:"11px",color:"var(--mu)",marginTop:"4px",fontFamily:"'Share Tech Mono',monospace"}}>Bull/Bear: {sentStats.bear>0?(sentStats.bull/sentStats.bear).toFixed(2):"∞"}x ratio</div>}
                </div>
                <div style={{fontSize:"12px",color:"var(--mu)",lineHeight:"1.8",marginBottom:"14px"}}>
                  <div style={{color:"var(--tx)",fontWeight:"700",marginBottom:"8px"}}>How FinBERT works:</div>
                  <div>① Headlines tokenized via BERT architecture</div><br/>
                  <div>② 12-layer transformer processes financial context</div><br/>
                  <div>③ Fine-tuned on 50,000+ labeled financial articles</div><br/>
                  <div>④ Outputs Bull/Bear/Neutral + confidence score</div>
                </div>
                <div className="pt">🐋 Whale Radar</div>
                {whales.slice(0,4).map((w,i)=>(
                  <div className="wh-card" key={i}><span className="wh-ic">{w.icon}</span><div className="wh-body"><div className="wh-addr">{w.addr} · {w.time}</div><div className={`wh-act ${w.action==="BUY"?"wh-buy":"wh-sell"}`}>{w.action} {w.asset}</div></div><div className="wh-amt">{w.amount}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="genome"&&(
        <div className="tab-content">
          <div className="gen-layout">
            <div className="col">
              <div className="pane" style={{flex:1}}>
                <div className="pt">🧬 Behavioral Genome Engine</div>
                <div style={{fontSize:"12px",color:"var(--mu)",marginBottom:"14px",lineHeight:"1.7"}}>Every asset has a unique psychological fingerprint. The genome reveals how it reacts to fear, hype cycles, whale moves, and institutional behavior — before price reflects it.</div>
                <div className="atabs" style={{marginBottom:"14px"}}>
                  {["BTC","ETH","SOL"].map(a=><button key={a} className={`atab${genAsset===a?" on":""}`} onClick={()=>{setGenAsset(a);setGenAnalysis("");}}>{a}</button>)}
                </div>
                <div className="gen-grid">
                  {(GENOME[genAsset]||GENOME.BTC).map((g,i)=>(
                    <div className="gc" key={i} style={{animationDelay:`${i*.07}s`}}>
                      <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:g.color,boxShadow:`0 0 8px ${g.color}`}}/>
                      <div className="gc-lbl">{g.label}</div>
                      <div className="gc-val" style={{color:g.color,textShadow:`0 0 12px ${g.color}`}}>{g.val}</div>
                      <div className="gc-sub">{g.sub}</div>
                      <div className="gc-bar"><div className="gc-bar-fill" style={{width:`${(parseFloat(g.val)/g.max)*100}%`,background:g.color}}/></div>
                    </div>
                  ))}
                </div>
                <button className="run-btn" onClick={runGenome} disabled={genLoading}>{genLoading?"🤖 AI ANALYZING GENOME...":"🧬 RUN AI GENOME ANALYSIS"}</button>
                {genAnalysis&&(
                  <div style={{marginTop:"14px",padding:"14px",borderRadius:"6px",border:"1px solid var(--v2)",background:"rgba(109,40,217,.06)"}}>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:"8px",letterSpacing:"3px",color:"var(--v3)",marginBottom:"8px"}}>👻 PHANTOM AI GENOME INSIGHT</div>
                    <div style={{fontSize:"12px",lineHeight:"1.85",color:"var(--tx)"}}>{genAnalysis}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="col">
              <div className="pane">
                <div className="pt">📡 Psychological Radar</div>
                <svg viewBox="0 0 200 200" width="100%" style={{maxWidth:"220px",display:"block",margin:"0 auto"}}>
                  {[.25,.5,.75,1].map((r,i)=>{const pts=gData.map((_,j)=>{const a=(j/gData.length)*Math.PI*2-Math.PI/2;return`${j===0?"M":"L"}${(100+70*r*Math.cos(a)).toFixed(1)},${(100+70*r*Math.sin(a)).toFixed(1)}`;});return<path key={i} d={pts.join(" ")+"Z"} fill="none" stroke="var(--b2)" strokeWidth="1"/>;})}
                  {radarAxes(gData.length).map((a,i)=><line key={i} x1="100" y1="100" x2={a.x2} y2={a.y2} stroke="var(--b2)" strokeWidth="1"/>)}
                  <path d={radarPath(gData.map(g=>parseFloat(g.val)),gData.map(g=>g.max))} fill="rgba(109,40,217,.25)" stroke="var(--v2)" strokeWidth="2"/>
                  {gData.map((g,i)=>{const a=(i/gData.length)*Math.PI*2-Math.PI/2;const r2=Math.min(parseFloat(g.val)/g.max,1);const x=100+70*r2*Math.cos(a);const y=100+70*r2*Math.sin(a);return<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="4" fill="var(--v3)" stroke="var(--panel)" strokeWidth="2"/>;})
                  }
                  {gData.map((g,i)=>{const a=(i/gData.length)*Math.PI*2-Math.PI/2;const x=100+88*Math.cos(a);const y=100+88*Math.sin(a);return<text key={i} x={x.toFixed(1)} y={y.toFixed(1)} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="var(--mu)" fontFamily="'Share Tech Mono',monospace">{g.label.split(" ")[0]}</text>;})}
                </svg>
              </div>
              <div className="pane" style={{flex:1}}>
                <div className="pt">🔍 Dimension Breakdown</div>
                {(GENOME[genAsset]||GENOME.BTC).map((g,i)=>(
                  <div className="ga-item" key={i}>
                    <div className="ga-head"><div className="ga-name">{g.label}</div><div className="ga-score" style={{color:g.color}}>{g.val}/{g.max}</div></div>
                    <div className="ga-desc">{g.sub}</div>
                    <div className="ga-bar"><div className="ga-bar-fill" style={{width:`${(parseFloat(g.val)/g.max)*100}%`,background:g.color,boxShadow:`0 0 6px ${g.color}`}}/></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="narrative"&&(
        <div className="tab-content">
          <div className="narr-layout">
            <div className="col">
              <div className="pane" style={{flex:1}}>
                <div className="pt">📖 Narrative Collapse Detector</div>
                <div style={{fontSize:"12px",color:"var(--mu)",marginBottom:"14px",lineHeight:"1.7"}}>Every bull market runs on a narrative. When the narrative dies, the price dies. Phantom Mind tracks the <strong style={{color:"var(--tx)"}}>health and saturation</strong> of active market narratives before price reflects the decay. Click any narrative for AI analysis.</div>
                {NARRATIVES.map((n,i)=>(
                  <div key={i} className={`narr-card nc-${n.status}`} onClick={()=>getNarrInsight(i)}>
                    <div className="narr-top">
                      <div className="narr-title">{n.title}</div>
                      <div className="narr-pct" style={{color:n.strength>80?"var(--r3)":n.strength>60?"var(--a3)":"var(--g3)",background:n.strength>80?"rgba(239,68,68,.12)":n.strength>60?"rgba(245,158,11,.1)":"rgba(16,185,129,.1)",border:`1px solid ${n.strength>80?"rgba(239,68,68,.3)":n.strength>60?"rgba(245,158,11,.25)":"rgba(16,185,129,.25)"}`}}>{n.strength}%</div>
                    </div>
                    <div className="narr-progress"><div className="narr-prog-fill" style={{width:`${n.strength}%`,background:n.strength>80?"var(--r3)":n.strength>60?"var(--a3)":"var(--g3)"}}/></div>
                    <div className="narr-meta">
                      <span className="narr-meta-item">🕐 {n.meta.age}</span>
                      <span className="narr-meta-item">📡 {n.meta.sources} sources</span>
                      <span className="narr-meta-item" style={{color:n.meta.momentum.startsWith("+")?"var(--g3)":"var(--r3)"}}>{n.meta.momentum}</span>
                      <span className="narr-meta-item" style={{color:n.status==="decay"?"var(--a3)":n.status==="grow"?"var(--g3)":"var(--r3)"}}>{n.status==="decay"?"⚠️ DECAY":n.status==="grow"?"✅ GROWING":"📉 FADING"}</span>
                    </div>
                    {activeNarr===i&&narrInsight&&!narrLoading&&<div className="narr-detail"><div style={{fontFamily:"'Orbitron',monospace",fontSize:"8px",letterSpacing:"3px",color:"var(--v3)",marginBottom:"6px"}}>👻 AI ANALYSIS</div>{narrInsight}</div>}
                    {activeNarr===i&&narrLoading&&<div className="narr-detail" style={{color:"var(--v3)",fontFamily:"'Share Tech Mono',monospace",fontSize:"11px",animation:"pulse 1s infinite"}}>Phantom AI analyzing narrative health...</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="col">
              <div className="pane" style={{flex:1}}>
                <div className="pt">⏱️ Narrative Timeline</div>
                {NARRATIVES[activeNarr].timeline.map((t,i)=>(
                  <div className="tl-item" key={i}>
                    <div className="tl-dot" style={{background:t.color,borderColor:t.color,boxShadow:`0 0 8px ${t.color}`}}/>
                    <div className="tl-body"><div className="tl-event">{t.event}</div><div className="tl-time">{t.time}</div></div>
                  </div>
                ))}
              </div>
              <div className="pane">
                <div className="pt">🌍 Contagion Map</div>
                <svg viewBox="0 0 280 150" width="100%">
                  {[{x:140,y:75,r:20,label:"BTC",color:"#f59e0b"},{x:65,y:45,r:15,label:"ETH",color:"#8b5cf6"},{x:215,y:45,r:13,label:"NVDA",color:"#0ea5e9"},{x:65,y:115,r:12,label:"SOL",color:"#34d399"},{x:215,y:115,r:12,label:"SPY",color:"#ec4899"},{x:140,y:18,r:10,label:"XRP",color:"#fcd34d"}].map((n,i)=>(
                    <g key={i}><line x1="140" y1="75" x2={n.x} y2={n.y} stroke={n.color} strokeWidth="1" strokeOpacity=".4" strokeDasharray="3,3"/><circle cx={n.x} cy={n.y} r={n.r} fill={n.color} fillOpacity=".2" stroke={n.color} strokeWidth="1.5"/><text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill={n.color} fontFamily="'Share Tech Mono',monospace" fontWeight="700">{n.label}</text></g>
                  ))}
                </svg>
                <div style={{fontSize:"10px",color:"var(--mu)",fontFamily:"'Share Tech Mono',monospace",textAlign:"center",marginTop:"6px"}}>BTC narrative contagion web</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="prediction"&&(
        <div className="tab-content">
          <div className="pred-layout">
            <div className="col">
              <div className="pane">
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"12px"}}>
                  <div><div className="pt" style={{marginBottom:"10px"}}>🔮 Price Prediction Engine</div><div className="atabs">{Object.keys(ASSETS).map(k=><button key={k} className={`atab${predAsset===k?" on":""}`} onClick={()=>{setPredAsset(k);setPredConsensus(null);}}>{k}</button>)}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"24px",fontWeight:"700",color:"var(--g3)"}}>{fmt(prices[predAsset]?.price||0)}</div><div style={{fontSize:"10px",color:"var(--mu)",fontFamily:"'Share Tech Mono',monospace",marginTop:"3px"}}>{ASSETS[predAsset].label}</div></div>
                </div>
                <div className="chart-area">
                  <svg viewBox="0 0 800 185" preserveAspectRatio="none">
                    <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity=".4"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient></defs>
                    {chartPts.length>0&&<><path d={ap} fill="url(#pg)" className="c-area"/><path d={lp} className="c-line" stroke="var(--g3)"/><path d={pp} className="c-pred" stroke="var(--v3)"/>
                      {PRED_BOTS.map((b,i)=>{
                        if(!chartPts.length)return null;
                        const last=chartPts[chartPts.length-1];
                        const pt=parseFloat(b.predictions[predAsset].replace(/[$,]/g,""));
                        const cp=prices[predAsset]?.price||1;
                        const ey=Math.max(8,Math.min(182,last[1]*(2-pt/cp)));
                        const cols=["var(--v2)","var(--c)","var(--g2)","var(--a2)"];
                        return<line key={i} x1={last[0]} y1={last[1]} x2="800" y2={ey} stroke={cols[i]} strokeWidth="1.5" strokeDasharray="5,3" opacity=".7"/>;
                      })}
                    </>}
                  </svg>
                </div>
                <div style={{display:"flex",gap:"12px",marginTop:"7px",fontFamily:"'Share Tech Mono',monospace",fontSize:"10px",flexWrap:"wrap"}}>
                  <span style={{color:"var(--g3)"}}>— PRICE</span><span style={{color:"var(--v3)"}}>- - TFT</span>
                  {PRED_BOTS.map((b,i)=>{const c=["var(--v2)","var(--c)","var(--g2)","var(--a2)"];return<span key={i} style={{color:c[i]}}>— {b.name.split(" ")[0]}</span>;})}
                </div>
                <div className="pi-grid">
                  {[{val:fmt(Math.max(...PRED_BOTS.map(b=>parseFloat(b.predictions[predAsset].replace(/[$,]/g,""))))),lbl:"BULL TARGET",c:"var(--g3)"},{val:fmt(Math.min(...PRED_BOTS.map(b=>parseFloat(b.predictions[predAsset].replace(/[$,]/g,""))))),lbl:"BEAR TARGET",c:"var(--r3)"},{val:`${Math.round(PRED_BOTS.reduce((a,b)=>a+b.confidence[predAsset],0)/PRED_BOTS.length)}%`,lbl:"AVG CONFIDENCE",c:"var(--v3)"},{val:`${PRED_BOTS.filter(b=>b.direction[predAsset]==="up").length}/4`,lbl:"BOTS BULLISH",c:"var(--a3)"}].map((p,i)=>(
                    <div className="pi-card" key={i}><div className="pi-val" style={{color:p.c}}>{p.val}</div><div className="pi-lbl">{p.lbl}</div></div>
                  ))}
                </div>
                <button className="run-btn" onClick={runPrediction} disabled={predLoading}>{predLoading?`🤖 RUNNING 4 BOTS ON ${predAsset}...`:`🔮 RUN AI CONSENSUS PREDICTION — ${predAsset}`}</button>
                {predConsensus&&(
                  <div style={{marginTop:"14px",padding:"16px",borderRadius:"6px",border:"1px solid var(--v2)",background:"rgba(109,40,217,.06)"}}>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:"8px",letterSpacing:"3px",color:"var(--v3)",marginBottom:"10px"}}>👻 AI CONSENSUS PREDICTION</div>
                    <div style={{fontSize:"12px",lineHeight:"1.85",color:"var(--tx)",whiteSpace:"pre-line"}}>{predConsensus}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="col">
              <div className="pane" style={{flex:1,overflowY:"auto"}}>
                <div className="pt">🤖 Prediction Bots</div>
                {PRED_BOTS.map((b,i)=>(
                  <div className="pbot" key={i}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:b.color,boxShadow:`0 0 8px ${b.color}`}}/>
                    <div className="pbot-header">
                      <div className="pbot-name" style={{color:b.color}}>{b.name}</div>
                      <div className={`pbot-status ${b.status==="running"?"ps-run":b.status==="analyzing"?"ps-ana":"ps-idle"}`}>{b.status.toUpperCase()}</div>
                    </div>
                    <div style={{fontSize:"10px",color:"var(--mu)",fontFamily:"'Share Tech Mono',monospace",marginBottom:"8px"}}>{b.strategy}</div>
                    <div className="pbot-stats">
                      <div className="pbs"><div className="pbs-v" style={{color:"var(--g3)"}}>{b.accuracy}%</div><div className="pbs-l">WIN RATE</div></div>
                      <div className="pbs"><div className="pbs-v" style={{color:"var(--v3)"}}>{b.timeframe}</div><div className="pbs-l">HORIZON</div></div>
                      <div className="pbs"><div className="pbs-v" style={{color:"var(--a3)"}}>{b.confidence[predAsset]}%</div><div className="pbs-l">CONFIDENCE</div></div>
                    </div>
                    <div className={`pbot-pred ${b.direction[predAsset]==="up"?"pp-up":b.direction[predAsset]==="dn"?"pp-dn":"pp-neut"}`}>
                      <span>{b.direction[predAsset]==="up"?"▲":b.direction[predAsset]==="dn"?"▼":"◆"} {b.predictions[predAsset]}</span>
                      <span style={{fontSize:"10px"}}>{b.timeframe}</span>
                    </div>
                    <div className="acc-bar"><div className="acc-fill" style={{width:`${b.accuracy}%`}}/></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="oracle"&&(
        <div className="tab-content" style={{height:"calc(100vh - 165px)",display:"flex"}}>
          <div className="ai-layout" style={{flex:1}}>
            <div className="col">
              <div className="pane">
                <div className="pt">📡 Live Context</div>
                {[{ic:"🧠",name:"CONSCIOUSNESS",val:`${Math.round(score)}/100 — ${cLabel.split(" ").slice(1).join(" ")}`,c:cColor},{ic:"📰",name:"FINBERT NEWS",val:`${sentStats.bull} Bull / ${sentStats.bear} Bear`,c:"var(--v3)"},{ic:"🐋",name:"WHALE SIGNAL",val:"$42.8M BTC Accumulating",c:"var(--a3)"},{ic:"📊",name:"OPTIONS FLOW",val:"71% Calls — Bullish",c:"var(--c2)"},{ic:"📖",name:"TOP NARRATIVE",val:"AI Tech 89% — DECAY ⚠️",c:"var(--r3)"},{ic:"🔮",name:"BOT CONSENSUS",val:`${PRED_BOTS.filter(b=>b.direction[predAsset]==="up").length}/4 Bullish ${predAsset}`,c:"var(--g3)"}].map((c,i)=>(
                  <div className="ctx-item" key={i}><span className="ctx-ic">{c.ic}</span><div className="ctx-body"><div className="ctx-name">{c.name}</div><div className="ctx-val" style={{color:c.c}}>{c.val}</div></div></div>
                ))}
              </div>
              <div className="pane" style={{flex:1}}>
                <div className="pt">💡 Suggested Queries</div>
                {AI_SUGGS.map((s,i)=><button key={i} className="sugg-btn" onClick={()=>sendAI(s)}>{s}</button>)}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",background:"var(--panel)",flex:1}}>
              <div className="msgs-area">
                {msgs.length===0&&(
                  <div className="msg-a">
                    <div className="albl">👻 PHANTOM AI — CONSCIOUSNESS ORACLE</div>
                    I am the market's collective mind, made visible. I have real-time access to your FinBERT news sentiment ({sentStats.bull} bullish, {sentStats.bear} bearish), whale radar ($42.8M BTC accumulation), consciousness score ({Math.round(score)}/100), narrative health (AI Tech 89% decay), and prediction bot consensus. Ask me anything — I will synthesize every signal into one sharp, actionable intelligence briefing.
                  </div>
                )}
                {msgs.map((m,i)=>(
                  <div key={i} className={m.role==="user"?"msg-u":"msg-a"}>
                    {m.role==="ai"&&<div className="albl">👻 PHANTOM AI</div>}
                    {m.text}
                  </div>
                ))}
                {aiLoading&&<div className="msg-a"><div className="albl">👻 PHANTOM AI</div><span className="cur">Synthesizing all signals</span></div>}
                <div ref={msgEnd}/>
              </div>
              <div className="chat-foot">
                <input className="chat-in" value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI(aiInput)} placeholder="Ask Phantom AI — market analysis, trade calls, risk assessment..."/>
                <button className="chat-send" onClick={()=>sendAI(aiInput)} disabled={aiLoading||!aiInput.trim()}>SEND</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast&&<div className={`toast t-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
