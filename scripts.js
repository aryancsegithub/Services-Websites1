/* Shared JS: call sheet, toasts, attach handlers, localized lastUpdated */
(function(){
  const PHONE = '+917587183033';
  function showToast(msg, ttl=1600){
    let t = document.getElementById('pageToast');
    if (!t){ t = document.createElement('div'); t.id='pageToast'; t.style.position='fixed'; t.style.left='50%'; t.style.transform='translateX(-50%)'; t.style.bottom='22px'; t.style.background='rgba(15,23,36,0.9)'; t.style.color='#fff'; t.style.padding='10px 14px'; t.style.borderRadius='10px'; t.style.boxShadow='0 8px 24px rgba(2,6,23,0.2)'; t.style.zIndex='11000'; t.style.fontWeight='600'; t.style.opacity='0'; t.style.transition='opacity .24s ease'; document.body.appendChild(t); }
    t.textContent = msg; requestAnimationFrame(()=> t.style.opacity='1'); setTimeout(()=> t.style.opacity='0', ttl);
  }

  function createCallSheet(){
    let s = document.getElementById('callSheet');
    if (s) return s;
    s = document.createElement('div'); s.id='callSheet'; s.className='call-sheet';
    s.innerHTML = `
      <div class="sheet-content">
        <h3 class="sheet-title">Call or Request Callback</h3>
        <p class="sheet-desc">Tap <strong>Call</strong> to open your phone app or choose <strong>Request Callback</strong>.</p>
        <div class="sheet-actions">
          <button class="btn btn-call" id="sheetCall">Call</button>
          <button class="btn btn-cancel" id="sheetRequest">Request Callback</button>
        </div>
      </div>`;
    document.body.appendChild(s);

    document.getElementById('sheetCall').addEventListener('click', ()=>{
      window.location.href = 'tel:' + PHONE;
      hideSheet();
    });
    document.getElementById('sheetRequest').addEventListener('click', ()=>{
      showToast('Callback request received. We will call you shortly.');
      hideSheet();
    });

    return s;
  }
  function showSheet(){ const s=createCallSheet(); requestAnimationFrame(()=> s.classList.add('show')); }
  function hideSheet(){ const s=document.getElementById('callSheet'); if (s) s.classList.remove('show'); }

  window.contactUs = function(ev, service, localeTitle){
    // open sheet; annotate with service if needed
    createCallSheet(); showSheet();
    const title = document.querySelector('#callSheet .sheet-title'); if (title){ title.textContent = (localeTitle || 'Call or Request Callback') + '\n\n' + service; }
  };

  // Attach handlers with the same deferred guard used before
  function attachHandlers(){
    const buttons = Array.from(document.querySelectorAll('button[data-service]'));
    buttons.forEach(btn => {
      btn.addEventListener('click', function(ev){
        const svc = btn.getAttribute('data-service');
        const locale = document.body.getAttribute('data-locale') || 'en-US';
        const title = (locale.startsWith('hi')) ? 'कॉल या बैक कॉल का अनुरोध' : 'Call or Request Callback';
        window.contactUs(ev, svc, title);
      });
    });
  }
  window.addEventListener('pointermove', attachHandlers, { once: true, passive: true });
  window.addEventListener('keydown', attachHandlers, { once: true });
  setTimeout(attachHandlers, 700);

  // lastUpdated fill
  function setLastUpdated(){ const el = document.getElementById('lastUpdated'); if (!el) return; const now = new Date(); const locale = document.body.getAttribute('data-locale') || undefined; const s = now.toLocaleString(locale, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); el.textContent = ((locale && locale.startsWith('hi')) ? 'अंतिम अपडेट: ' : 'Last updated: ') + s; }
  setLastUpdated();

})();
