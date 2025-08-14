document.addEventListener('DOMContentLoaded', function() {
    const arButton = document.getElementById('arFlag');
    const arScene = document.getElementById('arScene');
    
    arButton.addEventListener('click', function() {
        if (!isMobile()) {
            alert('AR experience works best on mobile devices. Please open this on your phone or tablet.');
            return;
        }
        
        showARInstructions();
    });
    
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    function showARInstructions() {
        const overlay = document.createElement('div');
        overlay.className = 'ar-overlay';
        
        overlay.innerHTML = `
            <button class="ar-close">×</button>
            <h2>Hoist the Flag in AR</h2>
            <div class="ar-instructions">
                <p>Point your camera at a flat surface to place the Indian flag in your environment.</p>
                <p>Move around to view the flag from different angles.</p>
                <p>Tap the "Capture" button to take a photo with the flag.</p>
            </div>
            <button class="ar-capture">Start AR Experience</button>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.ar-close').addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        overlay.querySelector('.ar-capture').addEventListener('click', function() {
            document.body.removeChild(overlay);
            startARExperience();
        });
    }
    
    function startARExperience() {
        arScene.innerHTML = `
            <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
                <a-marker preset="hiro">
                    <a-entity position="0 0 0" rotation="-90 0 0">
                        <a-entity gltf-model="assets/models/indian-flag.gltf" scale="0.5 0.5 0.5" class="ar-flag-model"></a-entity>
                    </a-entity>
                </a-marker>
                <a-entity camera></a-entity>
            </a-scene>
            <button class="ar-capture" id="arCapture">Capture Photo</button>
            <button class="ar-close">Exit AR</button>
        `;
        
        arScene.classList.remove('hidden');
        
        document.querySelector('#arScene .ar-close').addEventListener('click', function() {
            arScene.classList.add('hidden');
            arScene.innerHTML = '';
        });
        
        document.getElementById('arCapture').addEventListener('click', function() {
            alert('In a complete implementation, this would capture the AR scene and allow sharing.');
            // Actual implementation would use:
            // 1. Capture canvas from A-Frame
            // 2. Convert to image
            // 3. Provide sharing options
        });
    }
});