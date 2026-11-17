// DeepLine web — entry point
import { loadState, flushSave, get } from './state.js';
import { initSfx, unlockAudio } from './lib.js';
import { persistRequest } from './lib.js';
import { initRouter, mount } from './core.js';
import './home.js';
import './chat.js';
import './forms.js';
import { syncAutoPost } from './logic.js';

async function boot() {
  await loadState();
  initRouter();
  mount();
  syncAutoPost();
  persistRequest();
  initSfx();
  fetch('/api/announcement').then(r=>r.json()).then(d=>{const t=d.announcement&&d.announcement.text;if(t){const n=document.createElement('div');n.textContent='公告：'+t;n.style.cssText='position:fixed;z-index:80;top:calc(env(safe-area-inset-top,0px) + 8px);left:50%;transform:translateX(-50%);max-width:90vw;padding:10px 16px;border-radius:18px;background:rgba(255,255,255,.94);color:#d9367b;box-shadow:0 5px 24px #d9367b33;font-size:13px;text-align:center';document.body.append(n);setTimeout(()=>n.remove(),10000);}}).catch(()=>{});
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('pagehide', () => { flushSave(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushSave(); });
}
boot().catch((e) => { document.body.textContent = '启动失败：' + (e && e.message); console.error(e); });
