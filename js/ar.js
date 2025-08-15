document.addEventListener('DOMContentLoaded', function() {
    const arButton = document.getElementById('arFlag');
    const arScene = document.getElementById('arScene');
    const body = document.body;
    
    // Check for AR support
    async function checkARSupport() {
        if (navigator.xr) {
            return await navigator.xr.isSessionSupported('immersive-ar');
        }
        return false;
    }
    
    arButton.addEventListener('click', async function() {
        if (!isMobile()) {
            alert('AR experience works best on mobile devices. Please open this on your phone or tablet.');
            return;
        }
        
        try {
            const arSupported = await checkARSupport();
            if (arSupported) {
                startARExperience();
            } else {
                alert('AR is not supported on your device. Please try a different browser or device.');
            }
        } catch (error) {
            console.error('AR error:', error);
            alert('Error starting AR. Please try again.');
        }
    });
    
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    async function startARExperience() {
        // Hide main content
        document.querySelector('.container').classList.add('hidden');
        body.classList.add('ar-active');
        
        // Create AR scene
        arScene.innerHTML = `
            <a-scene 
                vr-mode-ui="enabled: false" 
                renderer="antialias: true; alpha: true" 
                embedded 
                arjs="sourceType: webcam; debugUIEnabled: false;"
            >
                <a-assets>
                    <img id="flag-texture" src="assets/images/flag-texture.png" crossorigin="anonymous">
                </a-assets>
                
                <a-entity id="flag-anchor" position="0 0 -1">
                    <a-cylinder id="flag-pole" radius="0.03" height="2" position="0 1 0" color="#8B4513"></a-cylinder>
                    <a-plane 
                        id="flag" 
                        src="#flag-texture" 
                        width="1.5" 
                        height="1" 
                        position="0.75 1.5 0"
                        animation="property: rotation; to: 0 -30 0; dur: 2000; easing: easeInOutSine; loop: true; dir: alternate"
                    ></a-plane>
                </a-entity>
                
                <a-camera gps-camera rotation-reader></a-camera>
            </a-scene>
            
            <div class="ar-controls">
                <button id="arExit" class="ar-button">Exit AR</button>
                <button id="arCapture" class="ar-button">📸 Capture</button>
            </div>
        `;
        
        arScene.classList.remove('hidden');
        
        // Add event listeners
        document.getElementById('arExit').addEventListener('click', exitAR);
        document.getElementById('arCapture').addEventListener('click', captureARScreenshot);
        
        // Make flag interactive
        const flag = document.getElementById('flag');
        flag.addEventListener('click', function() {
            this.setAttribute('animation', `
                property: rotation; 
                to: 0 ${-30 + Math.random() * 60} 0; 
                dur: 500; 
                easing: easeInOutSine
            `);
        });
    }
    
    function exitAR() {
        arScene.classList.add('hidden');
        arScene.innerHTML = '';
        document.querySelector('.container').classList.remove('hidden');
        body.classList.remove('ar-active');
    }
    
    async function captureARScreenshot() {
        try {
            const scene = document.querySelector('a-scene');
            const canvas = await scene.components.screenshot.getCanvas('perspective');
            const data = canvas.toDataURL('image/jpeg');
            
            // Create download link
            const link = document.createElement('a');
            link.href = data;
            link.download = 'indian-flag-ar.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Share if supported
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Indian Flag in AR',
                        text: 'Check out the Indian flag I hoisted in AR!',
                        files: [new File([data], 'indian-flag.jpg', { type: 'image/jpeg' })]
                    });
                } catch (shareError) {
                    console.log('Sharing cancelled', shareError);
                }
            }
        } catch (error) {
            console.error('Screenshot error:', error);
            alert('Could not capture screenshot. Please try again.');
        }
    }
});
