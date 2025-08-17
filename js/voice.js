document.addEventListener('DOMContentLoaded', function() {
    const voicePledge = document.getElementById('voicePledge');
    const voiceFeedback = document.getElementById('voiceFeedback');
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        voicePledge.addEventListener('click', toggleVoiceRecognition);
    } else {
        voicePledge.disabled = true;
        voicePledge.title = "Voice recognition not supported in your browser";
    }
    
    let recognition;
    let isListening = false;
    const targetPledge = "India is my country and all Indians are my brothers and sisters I love my country and I am proud of its rich and varied heritage I shall always strive to be worthy of it I shall give my parents teachers and all elders respect and treat everyone with courtesy to my country and my people I pledge my devotion in their well-being and prosperity alone lies my happiness";
    
    function toggleVoiceRecognition() {
        if (isListening) {
            stopRecognition();
        } else {
            startRecognition();
        }
    }
    
    function startRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onstart = function() {
            isListening = true;
            voicePledge.textContent = "🎤 Stop Reciting";
            voicePledge.classList.add('voice-active');
            voiceFeedback.textContent = "Listening... Please recite the pledge.";
        };
        
        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            voiceFeedback.innerHTML = `<strong>You said:</strong> ${finalTranscript}<br>
                                     <em>Listening:</em> ${interimTranscript}`;
            
            // Simple check for accuracy
            const accuracy = calculateAccuracy(finalTranscript.toLowerCase(), targetPledge.toLowerCase());
            if (accuracy > 70) {
                voiceFeedback.innerHTML += `<br><br><strong style="color: var(--green)">Well done! ${Math.round(accuracy)}% accuracy</strong>`;
            }
        };
        
        recognition.onerror = function(event) {
            voiceFeedback.textContent = `Error occurred: ${event.error}`;
            stopRecognition();
        };
        
        recognition.onend = function() {
            if (isListening) {
                recognition.start(); // Continue listening
            }
        };
        
        recognition.start();
    }
    
    function stopRecognition() {
        if (recognition) {
            recognition.stop();
        }
        isListening = false;
        voicePledge.textContent = "🎤 Recite Pledge";
        voicePledge.classList.remove('voice-active');
        voiceFeedback.textContent += "\n\nStopped listening. Thank you for taking the pledge!";
    }
    
    function calculateAccuracy(userText, targetText) {
        const userWords = userText.split(/\s+/);
        const targetWords = targetText.split(/\s+/);
        
        let correctWords = 0;
        userWords.forEach(word => {
            if (targetWords.includes(word)) {
                correctWords++;
            }
        });
        
        return (correctWords / targetWords.length) * 100;
    }
});