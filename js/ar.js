document.addEventListener('DOMContentLoaded', function() {
    const arButton = document.getElementById('arFlag');
    const arScene = document.getElementById('arScene');
    
    // Check if AR is available
    function isARSupported() {
        return navigator.xr && navigator.xr.isSessionSupported('immersive-ar');
    }
    
    arButton.addEventListener('click', async function() {
        if (!isMobile()) {
            alert('AR experience works best on mobile devices. Please open this on your phone or tablet.');
            return;
        }
        
        try {
            if (await isARSupported()) {
                showARInstructions();
            } else {
                alert('AR is not supported on your device. Please try a different browser or device.');
            }
        } catch (error) {
            console.error('AR support check failed:', error);
            alert('Could not check AR support. Please try again later.');
        }
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
                <p>Tap the flag to make it wave!</p>
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
    
    async function startARExperience() {
        arScene.innerHTML = `
            <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;" vr-mode-ui="enabled: false">
                <a-assets>
                    <img id="flag-texture" src="https://i.imgur.com/JqYeZZn.png" crossorigin="anonymous">
                </a-assets>
                
                <a-entity id="flag-entity" position="0 0 0" rotation="-90 0 0">
                    <a-plane id="flag" 
                             src="#flag-texture" 
                             width="1.5" 
                             height="1" 
                             position="0 0.5 0"
                             animation="property: rotation; to: -90 -30 0; dur: 1000; easing: easeInOutSine; loop: true; dir: alternate">
                    </a-plane>
                    <a-cylinder id="flag-pole" 
                                 radius="0.03" 
                                 height="2" 
                                 position="0 0 0" 
                                 color="#8B4513">
                    </a-cylinder>
                </a-entity>
                
                <a-entity camera></a-entity>
            </a-scene>
            <button class="ar-capture" id="arCapture">📸 Capture Photo</button>
            <button class="ar-close">Exit AR</button>
        `;
        
        arScene.classList.remove('hidden');
        
        document.querySelector('#arScene .ar-close').addEventListener('click', function() {
            arScene.classList.add('hidden');
            arScene.innerHTML = '';
        });
        
        document.getElementById('arCapture').addEventListener('click', captureARScreenshot);
        
        // Add click event to make flag wave
        const flag = document.querySelector('#flag-entity');
        flag.addEventListener('click', function() {
            const currentRotation = this.getAttribute('rotation');
            const newRotation = {
                x: currentRotation.x,
                y: currentRotation.y + (Math.random() * 60 - 30),
                z: currentRotation.z + (Math.random() * 10 - 5)
            };
            this.setAttribute('animation', `property: rotation; to: ${newRotation.x} ${newRotation.y} ${newRotation.z}; dur: 500; easing: easeInOutSine`);
        });
    }
    
    function captureARScreenshot() {
        try {
            const scene = document.querySelector('a-scene');
            scene.components.screenshot.capture('perspective').then(function(data) {
                // Create a temporary link to download the image
                const link = document.createElement('a');
                link.href = data;
                link.download = 'indian-flag-ar.jpg';
                link.click();
                
                // Show share options
                if (navigator.share) {
                    navigator.share({
                        title: 'Indian Flag in AR',
                        text: 'Check out this Indian flag I placed in AR!',
                        url: data
                    }).catch(err => {
                        console.log('Error sharing:', err);
                    });
                } else {
                    alert('Screenshot saved! You can now share it.');
                }
            });
        } catch (error) {
            console.error('Error capturing AR screenshot:', error);
            alert('Could not capture screenshot. Please try again.');
        }
    }
});