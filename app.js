let userPts = 150;
let myDiary = [];
let purchasedPasses = [];

function nav(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('nav button').forEach(btn => btn.classList.replace('nav-active', 'text-gray-400'));
    if(document.getElementById('n-'+id)) document.getElementById('n-'+id).classList.replace('text-gray-400', 'nav-active');
    
    if(id !== 'camera') stopCamera();
    renderPage(id);
}

function renderPage(id) {
    const container = document.getElementById(id);
    if(id === 'home') {
        container.innerHTML = `<div class="bg-yellow-400 p-6 rounded-[40px] text-white shadow-lg mb-6"><h2 class="text-2xl font-black italic uppercase">Bari Hunter</h2><p class="text-xs font-bold opacity-80">Trova gli obiettivi e guadagna premi!</p></div>
        <h3 class="font-black uppercase text-xs mb-4">Sfide Suggerite</h3>` + 
        DB.locations.map(loc => `<div class="bg-white p-4 rounded-3xl shadow-sm mb-3 flex justify-between"><div><p class="font-black text-[10px] uppercase text-yellow-500">${loc.cat}</p><p class="font-black text-sm">${loc.n}</p></div><p class="font-black text-xs">+${loc.pts} PT</p></div>`).join('');
    }
    if(id === 'bus-page') {
        container.innerHTML = `<h2 class="text-xl font-black italic uppercase text-blue-600 mb-4">Trasporti</h2>
        <input type="text" id="bus-in" placeholder="Dove vuoi andare?" class="w-full p-4 bg-white rounded-2xl shadow-sm text-xs mb-2 outline-none">
        <button onclick="findBus()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase mb-4">Trova Percorso Migliore</button>
        <div id="bus-res"></div>`;
    }
    if(id === 'profile') {
        let next = DB.rewards.find(r => r.threshold > userPts) || {gift: "Massimo Livello!"};
        container.innerHTML = `<h2 class="text-xl font-black italic uppercase mb-4">Mio Diario</h2>
        <div class="bg-white p-5 rounded-[35px] shadow-sm mb-6"><p class="text-[9px] font-black text-gray-400 uppercase">Prossimo Premio: ${next.gift}</p>
        <div class="w-full bg-gray-100 h-2 rounded-full mt-2"><div class="bg-yellow-400 h-2 rounded-full" style="width:${(userPts/300)*100}%"></div></div></div>
        <div class="grid grid-cols-2 gap-2" id="diary-grid"></div>`;
        document.getElementById('diary-grid').innerHTML = myDiary.map(img => `<img src="${img}" class="w-full h-32 object-cover rounded-2xl shadow-sm">`).join('');
    }
    if(id === 'pass-shop') {
        container.innerHTML = `<h2 class="text-xl font-black italic uppercase mb-4">Shop & Bici</h2>` + 
        DB.passes.map(p => `<div class="bg-white p-6 rounded-[35px] shadow-sm mb-4"><h3 class="font-black italic text-lg uppercase">${p.n} - €${p.price}</h3><p class="text-[10px] text-gray-400 my-2">${p.desc}</p><button onclick="buy('${p.id}')" class="w-full bg-yellow-400 text-white py-3 rounded-2xl font-black text-xs uppercase">Prenota</button></div>`).join('');
    }
}

function findBus() {
    const val = document.getElementById('bus-in').value.toLowerCase();
    const res = document.getElementById('bus-res');
    let found = DB.transport[val] || "Nessun bus diretto trovato. Prova 'Stazione' o 'San Nicola'.";
    res.innerHTML = `<div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-xs font-bold text-blue-700 uppercase">${found}</div>`;
}

function buy(id) {
    purchasedPasses.push(DB.passes.find(p => p.id === id));
    alert("Acquisto completato! Lo trovi in 'I Miei Pass'");
}

// CAMERA LOGIC
let stream = null;
async function startCamera() {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    document.getElementById('video').srcObject = stream;
}
function stopCamera() { if(stream) stream.getTracks().forEach(t => t.stop()); }
function takePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 480;
    canvas.getContext('2d').drawImage(document.getElementById('video'), 0, 0);
    myDiary.push(canvas.toDataURL('image/png'));
    userPts += 10;
    document.getElementById('user-points').innerText = userPts;
    alert("Foto Salvata! +10 Punti Hunter!");
}

function toggleMenu() {
    document.getElementById('side-menu').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

// Avvio
nav('home');
