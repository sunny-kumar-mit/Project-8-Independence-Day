document.addEventListener('DOMContentLoaded', function() {
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotContainer = document.getElementById('chatbotContainer');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');

  // Knowledge base for the chatbot
  const knowledgeBase = {
    "greeting": {
      response: "Namaste! I'm your guide to India's glorious history and culture. What would you like to know?",
      options: [
        "Tell me about India's independence",
        "Who were key freedom fighters?",
        "Explain the Indian flag"
      ]
    },
    "india's independence": {
      response: "India gained independence from British rule on August 15, 1947, after nearly 200 years of colonial rule. The independence movement was led by great leaders like Mahatma Gandhi, Jawaharlal Nehru, Sardar Patel, and many others who fought through non-violent civil disobedience and political negotiations.",
      image: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/201608/nehru_647_081515113435.jpg",
      options: [
        "What was the Quit India Movement?",
        "Tell me about the partition",
        "Who was the first Prime Minister?"
      ]
    },
    "key freedom fighters": {
      response: "India's freedom struggle was led by many brave souls:\n\n" +
               "• Mahatma Gandhi - Father of the Nation, led non-violent movements\n" +
               "• Jawaharlal Nehru - First Prime Minister, charismatic leader\n" +
               "• Sardar Patel - United India, Iron Man of India\n" +
               "• Bhagat Singh - Revolutionary martyr\n" +
               "• Subhash Chandra Bose - Led Indian National Army\n" +
               "• Rani Lakshmibai - Queen who fought British in 1857",
      image: "https://blogcdn.aakash.ac.in/wordpress_media/2024/08/Freedom-fighters-of-india.jpg",
      options: [
        "Tell me more about Gandhi",
        "What was Bhagat Singh's role?",
        "Explain the INA's contribution"
      ]
    },
    "indian flag": {
      response: "The Indian national flag, called Tiranga, has three horizontal stripes:\n\n" +
               "• Saffron (top): Represents courage and sacrifice\n" +
               "• White (middle): Represents peace and truth\n" +
               "• Green (bottom): Represents prosperity\n\n" +
               "The Ashoka Chakra (24-spoked wheel) in the center represents the eternal wheel of law. It was adopted on July 22, 1947.",
      image: "https://m.media-amazon.com/images/I/41JINRlOkpL.jpg",
      options: [
        "What do the 24 spokes represent?",
        "Who designed the flag?",
        "What are the flag rules?"
      ]
    },
    "quit india movement": {
      response: "The Quit India Movement was launched on August 8, 1942 at the Bombay session of the All-India Congress Committee. Mahatma Gandhi gave the famous 'Do or Die' speech, demanding immediate British withdrawal from India. Despite mass arrests of leaders, the movement sparked widespread civil disobedience across India.",
      options: [
        "What was the British response?",
        "How long did it last?",
        "What were the outcomes?"
      ]
    },
    "first prime minister": {
      response: "Jawaharlal Nehru became India's first Prime Minister after independence. His famous 'Tryst with Destiny' speech at midnight on August 15, 1947, marked India's independence. He laid the foundations of modern India, establishing democratic institutions and promoting scientific temper.",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Jawaharlal_Nehru_addressing_the_Indian_Science_Congress%2C_Lucknow%2C_3_January_1949.jpg?20200803202503",
      options: [
        "What were Nehru's policies?",
        "Tell me about his foreign policy",
        "How long was he PM?"
      ]
    },
    "default": {
      response: "I'm still learning about India's vast history. Could you ask something about:\n" +
               "- India's freedom struggle\n" +
               "- National symbols\n" +
               "- Famous freedom fighters\n" +
               "- Important events in 1947\n" +
               "- India's cultural heritage",
      options: [
        "Tell me about India's independence",
        "Explain the Indian flag",
        "Who were key freedom fighters?"
      ]
    }
  };

  // Toggle chatbot visibility
  chatbotToggle.addEventListener('click', function() {
    chatbotContainer.classList.toggle('visible');
    chatbotContainer.classList.toggle('hidden');
    if (chatbotContainer.classList.contains('visible')) {
      chatbotInput.focus();
    }
  });

  chatbotClose.addEventListener('click', function() {
    chatbotContainer.classList.remove('visible');
    chatbotContainer.classList.add('hidden');
  });

  // Send message function
  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
      addMessage(message, 'user');
      chatbotInput.value = '';
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        respondToMessage(message);
      }, 1000 + Math.random() * 1000); // Random delay for natural feel
    }
  }

  // Handle send button click
  chatbotSend.addEventListener('click', sendMessage);

  // Handle Enter key
  chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Add rich message with options
  function addRichMessage(text, options = [], imageUrl = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textPara = document.createElement('p');
    textPara.textContent = text;
    contentDiv.appendChild(textPara);
    
    if (imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = "Related image";
      contentDiv.appendChild(img);
    }
    
    if (options && options.length > 0) {
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'follow-up-options';
      
      options.forEach(optionText => {
        const optionButton = document.createElement('button');
        optionButton.className = 'follow-up-option';
        optionButton.textContent = optionText;
        optionButton.addEventListener('click', function() {
          addMessage(optionText, 'user');
          showTypingIndicator();
          setTimeout(() => {
            removeTypingIndicator();
            respondToMessage(optionText);
          }, 800);
        });
        optionsDiv.appendChild(optionButton);
      });
      
      contentDiv.appendChild(optionsDiv);
    }
    
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      typingDiv.appendChild(dot);
    }
    
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Handle quick options
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quick-option')) {
      const query = e.target.getAttribute('data-query');
      addMessage(query, 'user');
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        respondToMessage(query);
      }, 800);
    }
  });

  // Bot responses
  function respondToMessage(message) {
    const lowerMessage = message.toLowerCase();
    let responseData = knowledgeBase.default;

    if (/hello|hi|namaste|greetings/i.test(lowerMessage)) {
      responseData = knowledgeBase.greeting;
    } 
    else if (/independence|freedom|1947|partition/i.test(lowerMessage)) {
      responseData = knowledgeBase["india's independence"];
    }
    else if (/flag|tiranga|national symbol/i.test(lowerMessage)) {
      responseData = knowledgeBase["indian flag"];
    }
    else if (/freedom fighter|leader|gandhi|nehru|patel|bhagat singh|bose/i.test(lowerMessage)) {
      responseData = knowledgeBase["key freedom fighters"];
    }
    else if (/quit india|do or die|1942/i.test(lowerMessage)) {
      responseData = knowledgeBase["quit india movement"];
    }
    else if (/first prime minister|nehru|pandit/i.test(lowerMessage)) {
      responseData = knowledgeBase["first prime minister"];
    }

    // Add the response with options
    addRichMessage(
      responseData.response, 
      responseData.options, 
      responseData.image
    );
  }
});