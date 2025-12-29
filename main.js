// Main JavaScript for Thinking Routines Practice in Kindergarten
// CS50 Week 10 Final Project

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeTypewriter();
    initializeAnimations();
    initializePhotoUpload();
    initializeInteractiveElements();
    initializeCarousels();
    initializeDrawingCanvas();
    initializeReflectionJournal();
    loadCommunityPhotos();
    initializeCommunityUpload();
}

// Typewriter effect for welcome messages
function initializeTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        if (typeof Typed !== 'undefined') {
            new Typed(element, {
                strings: [text],
                typeSpeed: 50,
                showCursor: true,
                cursorChar: '|',
                autoInsertCss: true
            });
        } else {
            // Fallback if Typed.js not loaded
            element.textContent = text;
        }
    });
}

// Initialize animations using Anime.js
function initializeAnimations() {
    // Animate navigation tags on homepage
    const navTags = document.querySelectorAll('.nav-tag');
    if (navTags.length > 0 && typeof anime !== 'undefined') {
        anime({
            targets: navTags,
            scale: [0.8, 1],
            opacity: [0, 1],
            delay: anime.stagger(200),
            duration: 800,
            easing: 'easeOutElastic(1, .8)'
        });
    }

    // Animate cards on scroll
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && typeof anime !== 'undefined') {
                anime({
                    targets: entry.target,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    duration: 600,
                    easing: 'easeOutQuad'
                });
            }
        });
    });

    cards.forEach(card => observer.observe(card));
}

// Photo upload functionality
function initializePhotoUpload() {
    const uploadZones = document.querySelectorAll('.upload-zone');
    
    uploadZones.forEach(zone => {
        const input = zone.querySelector('input[type="file"]');
        const preview = zone.querySelector('.upload-preview');
        
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('click', () => input.click());
        
        input.addEventListener('change', handleFileSelect);
    });
}

// Upload modal functionality
function openUploadModal() {
    const modal = document.createElement('div');
    modal.className = 'upload-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <h3 class="font-display text-2xl mb-6 text-center">Upload Your Photos</h3>
                <div class="upload-area" id="modal-upload-area">
                    <input type="file" id="modal-file-input" multiple accept="image/*" class="hidden">
                    <div class="upload-placeholder">
                        <svg class="mx-auto h-16 w-16 mb-4 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p class="text-lg font-medium text-gray-600">Drop photos here or click to browse</p>
                        <p class="text-sm text-gray-500">Select multiple photos to upload</p>
                    </div>
                </div>
                <div class="modal-preview" id="modal-preview"></div>
                <div class="modal-buttons">
                    <button onclick="closeUploadModal()" class="modal-btn modal-btn-secondary">Back</button>
                    <button onclick="submitUpload()" class="modal-btn modal-btn-primary">Submit</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .upload-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .modal-content {
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .upload-area {
            border: 3px dashed #87CEEB;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            cursor: pointer;
            margin-bottom: 20px;
        }
        .upload-area:hover {
            border-color: #FF7F7F;
            background: rgba(255, 127, 127, 0.1);
        }
        .modal-preview {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }
        .modal-preview img {
            width: 100%;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
        }
        .modal-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        .modal-btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
        }
        .modal-btn-primary {
            background: #87CEEB;
            color: white;
        }
        .modal-btn-primary:hover {
            background: #5f9ea0;
        }
        .modal-btn-secondary {
            background: #f0f0f0;
            color: #666;
        }
        .modal-btn-secondary:hover {
            background: #ddd;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const uploadArea = document.getElementById('modal-upload-area');
    const fileInput = document.getElementById('modal-file-input');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleModalDrop);
    fileInput.addEventListener('change', handleModalFileSelect);
    
    // Animate modal appearance
    if (typeof anime !== 'undefined') {
        anime({
            targets: modal.querySelector('.modal-content'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutBack'
        });
    }
}

function closeUploadModal() {
    const modal = document.querySelector('.upload-modal');
    if (modal) {
        if (typeof anime !== 'undefined') {
            anime({
                targets: modal.querySelector('.modal-content'),
                scale: [1, 0.8],
                opacity: [1, 0],
                duration: 200,
                complete: () => modal.remove()
            });
        } else {
            modal.remove();
        }
    }
}

function handleModalDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleModalFiles(files);
}

function handleModalFileSelect(e) {
    const files = e.target.files;
    handleModalFiles(files);
}

function handleModalFiles(files) {
    const preview = document.getElementById('modal-preview');
    preview.innerHTML = '';
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
}

function submitUpload() {
    const files = document.getElementById('modal-file-input').files;
    const routine = getCurrentRoutine();
    
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const photoData = {
                        id: Date.now() + Math.random(),
                        src: e.target.result,
                        caption: '',
                        routine: routine,
                        timestamp: new Date().toISOString()
                    };
                    
                    savePhotoToStorage(photoData);
                    displayUploadedPhoto(photoData, document.querySelector(`[data-routine="${routine}"]`).closest('section').querySelector('.photo-gallery'));
                };
                reader.readAsDataURL(file);
            }
        });
        
        showNotification('Photos uploaded successfully!', 'success');
        closeUploadModal();
    } else {
        showNotification('Please select photos to upload.', 'info');
    }
}

function getCurrentRoutine() {
    // Determine current routine from URL or context
    const path = window.location.pathname;
    if (path.includes('see-think-wonder')) return 'see-think-wonder';
    if (path.includes('before-now')) return 'before-now';
    if (path.includes('color-symbol-image')) return 'color-symbol-image';
    return 'general';
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    handleFiles(files, e.currentTarget);
}

function handleFileSelect(e) {
    const files = e.target.files;
    const uploadZone = e.target.closest('.upload-zone');
    handleFiles(files, uploadZone);
}

function handleFiles(files, uploadZone) {
    const preview = uploadZone.querySelector('.upload-preview');
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoData = {
                    id: Date.now() + Math.random(),
                    src: e.target.result,
                    caption: '',
                    routine: uploadZone.dataset.routine || 'general',
                    timestamp: new Date().toISOString()
                };
                
                displayUploadedPhoto(photoData, preview);
                savePhotoToStorage(photoData);
            };
            reader.readAsDataURL(file);
        }
    });
}

function displayUploadedPhoto(photoData, container) {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'uploaded-photo';
    photoDiv.innerHTML = `
        <img src="${photoData.src}" alt="Uploaded photo">
        <div class="photo-caption">
            <input type="text" placeholder="Add a caption about this thinking routine..." 
                   value="${photoData.caption}" onchange="updatePhotoCaption('${photoData.id}', this.value)">
        </div>
        <button class="remove-btn" data-id="${photoData.id}">×</button>
    `;
    
    container.appendChild(photoDiv);
    
    // Animate the new photo
    if (typeof anime !== 'undefined') {
        anime({
            targets: photoDiv,
            scale: [0.5, 1],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutBack'
        });
    }

    // attach confirmation handler for delete
    const delBtn = photoDiv.querySelector('.remove-btn');
    if (delBtn) {
        delBtn.addEventListener('click', function() {
            const id = this.dataset.id;
            showConfirmDelete(id);
        });
    }
}

function savePhotoToStorage(photoData) {
    let photos = JSON.parse(localStorage.getItem('communityPhotos') || '[]');
    photos.push(photoData);
    localStorage.setItem('communityPhotos', JSON.stringify(photos));
}

function updatePhotoCaption(photoId, caption) {
    let photos = JSON.parse(localStorage.getItem('communityPhotos') || '[]');
    const photo = photos.find(p => p.id == photoId);
    if (photo) {
        photo.caption = caption;
        localStorage.setItem('communityPhotos', JSON.stringify(photos));
    }
}

function removePhoto(photoId) {
    let photos = JSON.parse(localStorage.getItem('communityPhotos') || '[]');
    photos = photos.filter(p => p.id != photoId);
    localStorage.setItem('communityPhotos', JSON.stringify(photos));
    // Re-render galleries to reflect deletion
    loadCommunityPhotos();
    renderCommunityGallery();
}

// Community upload integration for homepage
function initializeCommunityUpload() {
    const uploadBtn = document.getElementById('community-upload');
    if (!uploadBtn) return;

    uploadBtn.addEventListener('click', function() {
        const files = document.getElementById('community-files').files;
        const comment = document.getElementById('community-comment').value || '';
        if (!files || files.length === 0) {
            showNotification('Please choose at least one image.', 'info');
            return;
        }

        const readerPromises = Array.from(files).map(f => new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = e => res(e.target.result);
            r.onerror = rej;
            r.readAsDataURL(f);
        }));

        Promise.all(readerPromises).then(dataUrls => {
            const store = JSON.parse(localStorage.getItem('communityPhotos') || '[]');
            dataUrls.forEach(d => store.push({ id: Date.now() + Math.random(), src: d, caption: comment, routine: 'general', timestamp: new Date().toISOString() }));
            localStorage.setItem('communityPhotos', JSON.stringify(store));
            document.getElementById('community-files').value = '';
            document.getElementById('community-comment').value = '';
            loadCommunityPhotos();
            renderCommunityGallery();
            showNotification('Uploaded to community gallery.', 'success');
        }).catch(() => showNotification('Failed to read files.', 'error'));
    });
}

function renderCommunityGallery() {
    const container = document.getElementById('community-gallery');
    if (!container) return;
    container.innerHTML = '';
    const items = JSON.parse(localStorage.getItem('communityPhotos') || '[]');
    items.slice().reverse().forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-photo';
        div.innerHTML = `
            <img src="${item.src}" alt="community photo">
            <div class="photo-info">
                <p class="text-sm text-gray-700">${escapeHtml(item.caption || '')}</p>
                <p class="text-xs text-gray-500 mt-2">${new Date(item.timestamp).toLocaleString()}</p>
            </div>
            <button class="remove-btn" data-id="${item.id}">×</button>
        `;
        container.appendChild(div);
    });

    // attach delete handlers
        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                showConfirmDelete(id);
            });
        });
}

function showConfirmDelete(photoId) {
    // remove any existing confirm modal
    const existing = document.querySelector('.confirm-delete-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'confirm-delete-modal';
    modal.innerHTML = `
        <div class="confirm-overlay">
            <div class="confirm-box">
                <h3 class="font-display text-xl mb-4">Confirm delete</h3>
                <p class="text-gray-700 mb-6">Are you sure you want to delete this photo from the community gallery?</p>
                <div class="flex justify-end gap-3">
                    <button class="btn-cancel px-4 py-2 rounded">Cancel</button>
                    <button class="btn-confirm bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .confirm-delete-modal { position: fixed; inset:0; z-index:1200; display:flex; align-items:center; justify-content:center; }
        .confirm-overlay { background: rgba(0,0,0,0.5); position:absolute; inset:0; }
        .confirm-box { position:relative; background:white; padding:20px; border-radius:12px; max-width:420px; width:90%; z-index:1201; }
        .btn-cancel { background:#f0f0f0; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    modal.querySelector('.btn-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('.btn-confirm').addEventListener('click', () => {
        scheduleDelete(photoId);
        modal.remove();
    });
}

// pending delete state for undo
let pendingDelete = null;

function scheduleDelete(photoId) {
    const photos = JSON.parse(localStorage.getItem('communityPhotos') || '[]');
    const photo = photos.find(p => p.id == photoId);
    if (!photo) return;

    // remove from storage immediately but keep backup for undo
    const remaining = photos.filter(p => p.id != photoId);
    localStorage.setItem('communityPhotos', JSON.stringify(remaining));
    loadCommunityPhotos();
    renderCommunityGallery();

    // show undo toast
    if (pendingDelete && pendingDelete.timeoutId) clearTimeout(pendingDelete.timeoutId);
    pendingDelete = { photo };
    showUndoToast();

    // finalize deletion after timeout
    pendingDelete.timeoutId = setTimeout(() => {
        pendingDelete = null;
    }, 6000);
}

function showUndoToast() {
    // remove existing toast
    const existing = document.querySelector('.undo-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'undo-toast notification';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '20px';
    toast.style.zIndex = '1300';
    toast.innerHTML = `
        <span>Photo deleted</span>
        <button class="undo-btn ml-4 px-3 py-1 rounded" style="background:rgba(255,255,255,0.15);border:none;color:white;margin-left:12px;">Undo</button>
    `;

    document.body.appendChild(toast);

    const undoBtn = toast.querySelector('.undo-btn');
    undoBtn.addEventListener('click', () => {
        if (!pendingDelete) return;
        const photos = JSON.parse(localStorage.getItem('communityPhotos') || '[]');
        photos.push(pendingDelete.photo);
        localStorage.setItem('communityPhotos', JSON.stringify(photos));
        loadCommunityPhotos();
        renderCommunityGallery();
        if (pendingDelete.timeoutId) clearTimeout(pendingDelete.timeoutId);
        pendingDelete = null;
        toast.remove();
        showNotification('Deletion undone', 'success');
    });

    // auto-remove toast after timeout
    setTimeout(() => {
        const t = document.querySelector('.undo-toast');
        if (t) t.remove();
    }, 6000);
}

function escapeHtml(s){ return String(s).replace(/[&<>\"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }

function loadCommunityPhotos() {
    const photoGalleries = document.querySelectorAll('.photo-gallery');
    const photos = JSON.parse(localStorage.getItem('communityPhotos') || '[]');
    
    photoGalleries.forEach(gallery => {
        const routine = gallery.dataset.routine;
        const filteredPhotos = routine ? photos.filter(p => p.routine === routine) : photos;
        
        filteredPhotos.forEach(photoData => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'gallery-photo';
            photoDiv.innerHTML = `
                <img src="${photoData.src}" alt="Community photo">
                <div class="photo-info">
                    <p>${photoData.caption || 'No caption'}</p>
                    <small>${new Date(photoData.timestamp).toLocaleDateString()}</small>
                </div>
            `;
            gallery.appendChild(photoDiv);
        });
    });
}

// Interactive elements for thinking routines
function initializeInteractiveElements() {
    // See-Think-Wonder interactive image viewer
    const stwImages = document.querySelectorAll('.stw-interactive-image');
    stwImages.forEach(img => {
        img.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            showSTWPopup(x, y, this);
        });
    });

    // Before/After comparison sliders
    const sliders = document.querySelectorAll('.comparison-slider');
    sliders.forEach(slider => {
        initializeComparisonSlider(slider);
    });

    // Interactive checklists
    const checklists = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checklists.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveChecklistState();
            if (this.checked && typeof anime !== 'undefined') {
                anime({
                    targets: this.closest('.checklist-item'),
                    backgroundColor: ['#f0f8ff', '#e6f3ff'],
                    duration: 300
                });
            }
        });
    });

    // Load saved checklist state
    loadChecklistState();
}

function showSTWPopup(x, y, imageElement) {
    const popup = document.createElement('div');
    popup.className = 'stw-popup';
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.innerHTML = `
        <div class="stw-tabs">
            <button class="tab-btn active" onclick="showTab('see', this)">I See</button>
            <button class="tab-btn" onclick="showTab('think', this)">I Think</button>
            <button class="tab-btn" onclick="showTab('wonder', this)">I Wonder</button>
        </div>
        <div class="tab-content see-content">
            <p>What do you observe in this part of the image?</p>
            <textarea placeholder="I see..."></textarea>
        </div>
        <div class="tab-content think-content" style="display:none;">
            <p>What does this make you think?</p>
            <textarea placeholder="I think..."></textarea>
        </div>
        <div class="tab-content wonder-content" style="display:none;">
            <p>What does this make you wonder?</p>
            <textarea placeholder="I wonder..."></textarea>
        </div>
        <button onclick="closeSTWPopup()">Close</button>
    `;
    
    document.body.appendChild(popup);
    
    if (typeof anime !== 'undefined') {
        anime({
            targets: popup,
            scale: [0.5, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutBack'
        });
    }
}

function showTab(tabName, button) {
    const popup = button.closest('.stw-popup');
    const tabs = popup.querySelectorAll('.tab-content');
    const buttons = popup.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.style.display = 'none');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    popup.querySelector(`.${tabName}-content`).style.display = 'block';
    button.classList.add('active');
}

function closeSTWPopup() {
    const popup = document.querySelector('.stw-popup');
    if (popup) {
        if (typeof anime !== 'undefined') {
            anime({
                targets: popup,
                scale: 0,
                opacity: 0,
                duration: 200,
                complete: () => popup.remove()
            });
        } else {
            popup.remove();
        }
    }
}

function initializeComparisonSlider(slider) {
    const handle = slider.querySelector('.slider-handle');
    const beforeImg = slider.querySelector('.before-image');
    const afterImg = slider.querySelector('.after-image');
    
    let isDragging = false;
    
    handle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    function startDrag(e) {
        isDragging = true;
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const rect = slider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        handle.style.left = percentage + '%';
        afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    }
    
    function stopDrag() {
        isDragging = false;
    }
}

function saveChecklistState() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const state = {};
    
    checkboxes.forEach((checkbox, index) => {
        state[index] = checkbox.checked;
    });
    
    localStorage.setItem('checklistState', JSON.stringify(state));
}

function loadChecklistState() {
    const state = JSON.parse(localStorage.getItem('checklistState') || '{}');
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    Object.keys(state).forEach(index => {
        if (checkboxes[index]) {
            checkboxes[index].checked = state[index];
        }
    });
}

// Initialize carousels using Splide
function initializeCarousels() {
    const carousels = document.querySelectorAll('.splide');
    
    carousels.forEach(carousel => {
        if (typeof Splide !== 'undefined') {
            new Splide(carousel, {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                gap: '1rem',
                autoplay: true,
                interval: 4000,
                pauseOnHover: true,
                breakpoints: {
                    768: {
                        perPage: 2,
                    },
                    480: {
                        perPage: 1,
                    }
                }
            }).mount();
        }
    });
}

// Drawing canvas for Color-Symbol-Image routine
function initializeDrawingCanvas() {
    const canvases = document.querySelectorAll('.drawing-canvas');
    
    canvases.forEach(canvas => {
        if (typeof p5 !== 'undefined') {
            const sketch = function(p) {
                let isDrawing = false;
                let currentColor = '#000000';
                let brushSize = 5;
                
                p.setup = function() {
                    p.createCanvas(canvas.offsetWidth, 400);
                    p.background(255);
                };
                
                p.mousePressed = function() {
                    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                        isDrawing = true;
                    }
                };
                
                p.mouseReleased = function() {
                    isDrawing = false;
                };
                
                p.mouseDragged = function() {
                    if (isDrawing) {
                        p.stroke(currentColor);
                        p.strokeWeight(brushSize);
                        p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
                    }
                };
                
                p.windowResized = function() {
                    p.resizeCanvas(canvas.offsetWidth, 400);
                };
            };
            
            new p5(sketch, canvas);
        }
    });
}

// Reflection journal functionality
function initializeReflectionJournal() {
    const journalTextareas = document.querySelectorAll('.reflection-journal textarea');
    
    journalTextareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const journalKey = 'journal_' + textarea.dataset.routine;
            localStorage.setItem(journalKey, textarea.value);
        });
        
        // Load saved content
        const journalKey = 'journal_' + textarea.dataset.routine;
        const savedContent = localStorage.getItem(journalKey);
        if (savedContent) {
            textarea.value = savedContent;
        }
    });
}

// Navigation functionality
function navigateToRoutine(routineName) {
    const pages = {
        'see-think-wonder': 'see-think-wonder.html',
        'before-now': 'before-now.html',
        'color-symbol-image': 'color-symbol-image.html'
    };
    
    if (pages[routineName]) {
        window.location.href = pages[routineName];
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    if (typeof anime !== 'undefined') {
        anime({
            targets: notification,
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 300,
            complete: () => {
                setTimeout(() => {
                    anime({
                        targets: notification,
                        translateY: [0, -50],
                        opacity: [1, 0],
                        duration: 300,
                        complete: () => notification.remove()
                    });
                }, 3000);
            }
        });
    } else {
        setTimeout(() => notification.remove(), 3000);
    }
}

// Export functions for global access
window.navigateToRoutine = navigateToRoutine;
window.showTab = showTab;
window.closeSTWPopup = closeSTWPopup;
window.updatePhotoCaption = updatePhotoCaption;
window.removePhoto = removePhoto;
window.showNotification = showNotification;