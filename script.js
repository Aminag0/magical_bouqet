// =========================================
// SUPABASE & SHARED LINK (view full bouquet by ?share=id)
// =========================================
let supabaseClient = null;
try {
    if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY &&
        !window.SUPABASE_URL.includes('YOUR_') && !window.SUPABASE_ANON_KEY.includes('YOUR_') &&
        typeof window.supabase !== 'undefined') {
        supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn('Supabase init skipped:', e.message);
}

// When a friend opens a shared link, load the saved bouquet and show the ending page.
async function loadSharedBouquet(shareId) {
    if (!supabaseClient) return false;
    const { data, error } = await supabaseClient.from('shares').select('*').eq('id', shareId).single();
    if (error || !data) return false;

    const themeColor = data.theme_color || '#ffb6c1';
    document.documentElement.style.setProperty('--theme-color', themeColor);

    const finalBouquetContainer = document.getElementById('finalBouquet');
    const finalCardTextElem = document.getElementById('finalCardText');
    const finalCardDrawingElem = document.getElementById('finalCardDrawing');
    const finalTouchedImageElem = document.getElementById('finalTouchedImage');
    const coverPattern = document.querySelector('.book-cover .cover-pattern');

    finalBouquetContainer.innerHTML = '';
    const bouquet = data.bouquet_data || [];
    bouquet.forEach(function (f) {
        const wrapper = document.createElement('div');
        wrapper.className = 'planted-wrapper';
        wrapper.style.left = f.left + 'px';
        wrapper.style.top = f.top + 'px';
        const flowerImg = document.createElement('img');
        flowerImg.src = f.flower_src;
        flowerImg.style.width = '60px';
        flowerImg.style.position = 'relative';
        flowerImg.style.zIndex = '2';
        flowerImg.style.filter = 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))';
        const stem = document.createElement('div');
        stem.className = 'stem';
        stem.style.height = (f.stem_height || 0) + 'px';
        stem.style.transform = 'rotate(' + (f.stem_angle || 0) + 'deg)';
        wrapper.appendChild(stem);
        wrapper.appendChild(flowerImg);
        finalBouquetContainer.appendChild(wrapper);
    });

    finalCardTextElem.innerText = data.card_text || '';
    if (data.drawing_url) {
        finalCardDrawingElem.src = data.drawing_url;
        finalCardDrawingElem.classList.remove('hidden');
    } else {
        finalCardDrawingElem.classList.add('hidden');
    }
    if (data.special_image_url) {
        finalTouchedImageElem.src = data.special_image_url;
        finalTouchedImageElem.classList.remove('hidden');
    } else {
        finalTouchedImageElem.classList.add('hidden');
    }
    if (data.pattern && coverPattern) {
        coverPattern.className = 'cover-pattern ' + data.pattern;
    }

    document.body.className = 'ending-bg';
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('workshopPage').classList.add('hidden');
    document.getElementById('endingPage').classList.remove('hidden');
    return true;
}

// Check on load: if ?share=xxx, show the shared bouquet (ending page only).
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    if (shareId) {
        const loaded = await loadSharedBouquet(shareId);
        if (!loaded) {
            document.body.classList.add('picnic-bg');
            alert('This link may have expired or is invalid. ✨');
        }
        return;
    }
    // Old URL params (optional fallback)
    const sharedColor = urlParams.get('color');
    if (sharedColor) {
        document.documentElement.style.setProperty('--theme-color', sharedColor);
        document.getElementById('colorPicker').value = sharedColor;
        const sharedText = urlParams.get('text');
        const sharedPattern = urlParams.get('pattern');
        if (sharedText) document.getElementById('cardTextInput').value = sharedText;
        if (sharedPattern) selectedPattern = sharedPattern;
    }
});

// --- STAGE 1: LANDING PAGE ---
const enterButton = document.getElementById('enterButton');
const colorPicker = document.getElementById('colorPicker');
const landingPage = document.getElementById('landingPage');
const workshopPage = document.getElementById('workshopPage');

// FIXED: Fast loading sounds
const magicSound = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3');
const finalMagicSound = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3');
enterButton.addEventListener('click', () => {
    magicSound.play();
    document.documentElement.style.setProperty('--theme-color', colorPicker.value);
    document.body.className = 'picnic-bg';
    setTimeout(() => {
        landingPage.classList.add('hidden');
        workshopPage.classList.remove('hidden');
    }, 400); 
});

// --- STAGE 2: DRAG & DROP FLOWERS WITH STEMS ---
const flowers = document.querySelectorAll('.draggable-flower');
const vase = document.getElementById('vase');
const vaseText = document.getElementById('vaseText');
// FIXED: Reliable drop pop sound
const dropSound = new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg'); 

flowers.forEach(flower => {
    flower.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', flower.src);
    });
});

vase.addEventListener('dragover', (e) => { e.preventDefault(); });

vase.addEventListener('drop', (e) => {
    e.preventDefault();
    dropSound.currentTime = 0;
    dropSound.play();
    
    if (vaseText) vaseText.remove();
    
    const imgSrc = e.dataTransfer.getData('text/plain');
    
    const rect = vase.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;
    
    const targetX = rect.width / 2;
    const targetY = rect.height - 30; 
    
    const dx = targetX - dropX;
    const dy = targetY - dropY;
    const length = Math.sqrt(dx*dx + dy*dy);
    const angle = -Math.atan2(dx, dy) * (180 / Math.PI); 

    const wrapper = document.createElement('div');
    wrapper.className = 'planted-wrapper';
    wrapper.style.left = `${dropX - 30}px`; 
    wrapper.style.top = `${dropY - 30}px`;

    const flowerImg = document.createElement('img');
    flowerImg.src = imgSrc;
    flowerImg.style.width = '60px';
    flowerImg.style.position = 'relative';
    flowerImg.style.zIndex = '2';
    flowerImg.style.filter = 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))';

    const stem = document.createElement('div');
    stem.className = 'stem';
    stem.style.height = `${length}px`;
    stem.style.transform = `rotate(${angle}deg)`;

    wrapper.appendChild(stem);
    wrapper.appendChild(flowerImg);
    vase.appendChild(wrapper);
});

// --- STAGE 3: THE OPEN BOOK MODAL & CANVAS ---
const patternBtns = document.querySelectorAll('.pattern-btn');
const cardModal = document.getElementById('cardModal');
const modalCardBg = document.getElementById('modalCardBg');
const doneCardBtn = document.getElementById('doneCardBtn');
const toggleDrawBtn = document.getElementById('toggleDrawBtn');
const tableTop = document.getElementById('tableTop');
const modalContentArea = document.querySelector('.modal-content');

let selectedPattern = '';

patternBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        cardModal.classList.remove('hidden');
        selectedPattern = btn.getAttribute('data-pattern');
        modalCardBg.className = 'card-edit-area ' + selectedPattern;
    });
});

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let drawMode = false;

toggleDrawBtn.addEventListener('click', () => {
    drawMode = !drawMode;
    if (drawMode) {
        modalContentArea.classList.add('draw-mode');
        toggleDrawBtn.innerText = '⌨️ Type Instead';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
    } else {
        modalContentArea.classList.remove('draw-mode');
        toggleDrawBtn.innerText = '✏️ Draw Instead';
    }
});

canvas.addEventListener('mousedown', (e) => { isDrawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
canvas.addEventListener('mousemove', (e) => { if(isDrawing) { ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); }});
canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('mouseleave', () => { isDrawing = false; });

doneCardBtn.addEventListener('click', () => {
    magicSound.currentTime = 0; 
    magicSound.play(); 
    
    cardModal.classList.add('hidden');
    
    const oldCard = document.querySelector('.finished-card');
    if (oldCard) oldCard.remove();

    const miniCard = document.createElement('div');
    miniCard.className = 'finished-card ' + selectedPattern;
    
    const leftPage = document.createElement('div');
    leftPage.className = 'book-page card-page-left';
    leftPage.style.backgroundColor = '#fffaf0'; 
    const textContent = document.getElementById('cardTextInput').value;
    const textElem = document.createElement('p');
    textElem.className = 'mini-card-text';
    textElem.innerText = textContent;
    leftPage.appendChild(textElem);

    const rightPage = document.createElement('div');
    rightPage.className = 'book-page card-page-right';
    rightPage.style.backgroundColor = '#fffaf0';
    const imgElem = document.createElement('img');
    imgElem.className = 'mini-card-drawing';
    imgElem.src = canvas.toDataURL(); 
    rightPage.appendChild(imgElem);
    
    miniCard.appendChild(leftPage);
    miniCard.appendChild(rightPage);
    
    tableTop.appendChild(miniCard);
});

// =========================================
// STAGE 4: ENDING PAGE INTERACTION
// =========================================
const specialTouchBtn = document.getElementById('specialTouchBtn');
const imageInput = document.getElementById('imageInput');
const doneFinalBtn = document.getElementById('doneFinalBtn');
const endingPage = document.getElementById('endingPage');
const finalBouquetContainer = document.getElementById('finalBouquet');
const finalCardTextElem = document.getElementById('finalCardText');
const finalCardDrawingElem = document.getElementById('finalCardDrawing');
const finalTouchedImageElem = document.getElementById('finalTouchedImage');

let specialImageUrl = null;

// 1. Handle "Special Touch" (Image Upload)
specialTouchBtn.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const maxSizeBytes = 2 * 1024 * 1024; // 2MB Limit

    if (file && file.size > maxSizeBytes) {
        alert("Oops! That image is a bit too big. Please choose one under 2MB ✨");
        imageInput.value = ''; 
        return;
    }

    if (file) {
        specialTouchBtn.innerText = `🎁 ${file.name.substring(0, 10)}... Added!`;
        specialTouchBtn.style.backgroundColor = 'white';
        
        const reader = new FileReader();
        reader.onload = (event) => {
            specialImageUrl = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// 2. Handle "All Done" (Completion)
doneFinalBtn.addEventListener('click', () => {
    // FIXED: Removed the alert() that was blocking the music!
    finalMagicSound.currentTime = 0;
    finalMagicSound.play();

 // B. Transfer the Bouquet and KEEP your original arrangement!
    const plantedWrappers = vase.querySelectorAll('.planted-wrapper');
    plantedWrappers.forEach((wrapper) => {
        const clone = wrapper.cloneNode(true);
        // We removed the random math! Now they stay exactly where you dropped them in the vase.
        finalBouquetContainer.appendChild(clone);
    });
    finalCardTextElem.innerText = document.getElementById('cardTextInput').value;
    finalCardDrawingElem.src = canvas.toDataURL(); 

    if (specialImageUrl) {
        finalTouchedImageElem.src = specialImageUrl;
        finalTouchedImageElem.classList.remove('hidden');
    }

    const coverPattern = document.querySelector('.book-cover .cover-pattern');
    if (selectedPattern) {
        coverPattern.className = 'cover-pattern ' + selectedPattern;
    }

    document.body.className = 'ending-bg'; 
    setTimeout(() => {
        workshopPage.classList.add('hidden');
        endingPage.classList.remove('hidden');
    }, 400); 
});

// 3. Handle the Secure Shareable Link (save to Supabase so friends see full bouquet + card + drawing + image)
const shareBtn = document.getElementById('shareBtn');
const shareMsg = document.getElementById('shareMsg');

shareBtn.addEventListener('click', async () => {
    if (!supabaseClient) {
        alert('Share is not set up yet. Add your Supabase URL and key in supabase-config.js (see SUPABASE_SETUP.md). ✨');
        return;
    }

    const originalText = shareBtn.innerText;
    shareBtn.disabled = true;
    shareBtn.innerText = '⏳ Saving...';

    try {
        const shareId = crypto.randomUUID();
        const themeColor = document.documentElement.style.getPropertyValue('--theme-color').trim() || '#ffb6c1';
        const cardText = document.getElementById('cardTextInput').value;
        const bucket = 'share-assets';

        // Bouquet data from current vase
        const plantedWrappers = vase.querySelectorAll('.planted-wrapper');
        const bouquetData = [];
        plantedWrappers.forEach(function (wrapper) {
            const img = wrapper.querySelector('img');
            const stem = wrapper.querySelector('.stem');
            if (!img) return;
            const left = parseFloat(wrapper.style.left) || 0;
            const top = parseFloat(wrapper.style.top) || 0;
            const stemHeight = stem ? parseFloat(stem.style.height) || 0 : 0;
            const stemAngle = stem && stem.style.transform ? parseFloat(String(stem.style.transform).replace(/[^0-9.-]/g, '')) || 0 : 0;
            bouquetData.push({
                flower_src: img.src,
                left: left,
                top: top,
                stem_height: stemHeight,
                stem_angle: stemAngle
            });
        });

        // Upload drawing (canvas) to Storage
        let drawingUrl = null;
        const drawingDataUrl = canvas.toDataURL('image/png');
        if (drawingDataUrl && drawingDataUrl.length > 100) {
            const drawingBlob = await (await fetch(drawingDataUrl)).blob();
            const drawingPath = shareId + '/drawing.png';
            await supabaseClient.storage.from(bucket).upload(drawingPath, drawingBlob, { contentType: 'image/png', upsert: true });
            const { data: d } = supabaseClient.storage.from(bucket).getPublicUrl(drawingPath);
            drawingUrl = d.publicUrl;
        }

        // Upload special image if present
        let specialImageUrlStored = null;
        if (specialImageUrl) {
            const imageBlob = await (await fetch(specialImageUrl)).blob();
            const ext = (specialImageUrl.indexOf('image/jpeg') !== -1 || specialImageUrl.indexOf('image/jpg') !== -1) ? 'jpg' : 'png';
            const imagePath = shareId + '/image.' + ext;
            await supabaseClient.storage.from(bucket).upload(imagePath, imageBlob, { contentType: imageBlob.type, upsert: true });
            const { data: i } = supabaseClient.storage.from(bucket).getPublicUrl(imagePath);
            specialImageUrlStored = i.publicUrl;
        }

        await supabaseClient.from('shares').insert({
            id: shareId,
            theme_color: themeColor,
            pattern: selectedPattern || '',
            card_text: cardText,
            drawing_url: drawingUrl,
            special_image_url: specialImageUrlStored,
            bouquet_data: bouquetData
        });

        const baseUrl = window.location.href.split('?')[0];
        const shareUrl = baseUrl + '?share=' + shareId;
        await navigator.clipboard.writeText(shareUrl);
        shareMsg.classList.remove('hidden');
        setTimeout(function () { shareMsg.classList.add('hidden'); }, 4000);
    } catch (err) {
        console.error(err);
        alert('Could not create share link. Check the console and Supabase setup. ✨');
    } finally {
        shareBtn.disabled = false;
        shareBtn.innerText = originalText;
    }
});