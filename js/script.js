document.addEventListener('DOMContentLoaded', () => {
    // ====================================================
    // DOM Elements
    // ====================================================
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const quoteForm = document.getElementById('quoteForm');
    const feedback = document.getElementById('formFeedback');

    // ====================================================
    // 1. Form Validation & Background Submission (AJAX)
    // ====================================================
    if (quoteForm && feedback) {
        quoteForm.addEventListener('submit', async (e) => {
            // Stop the form from redirecting to the Formspree website
            e.preventDefault(); 
            
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            
            // RegEx for Email and Phone
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phonePattern = /^\d{10}$|^(\(\d{3}\)\s*|^\d{3}-)\d{3}-?\d{4}$/;

            if (!emailPattern.test(email)) {
                feedback.textContent = "Please enter a valid email address.";
                feedback.className = "error";
                return; // Stop the script here
            } else if (!phonePattern.test(phone)) {
                feedback.textContent = "Please enter a valid 10-digit phone number.";
                feedback.className = "error";
                return; // Stop the script here
            } 

            // If validation passes, show loading text
            feedback.textContent = "Sending...";
            feedback.className = "success";
            
            // Send the data to Formspree invisibly in the background
            try {
                const response = await fetch(quoteForm.action, {
                    method: 'POST',
                    body: new FormData(quoteForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success! Show the message and clear the form
                    feedback.textContent = "Thank you! Your request has been sent.";
                    feedback.className = "success";
                    quoteForm.reset(); 
                } else {
                    feedback.textContent = "Oops! There was a problem submitting your form.";
                    feedback.className = "error";
                }
            } catch (error) {
                feedback.textContent = "Oops! Check your internet connection and try again.";
                feedback.className = "error";
            }
        });
    }

    // ====================================================
    // 2. Scroll Fade Animations
    // ====================================================
    const faders = document.querySelectorAll('.scroll-fade');
    if (faders.length > 0) {
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once it appears
                }
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });
    }

    // ====================================================
    // 3. Mobile Menu Toggle
    // ====================================================
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // ====================================================
    // 4. Smooth Scroll for Navigation
    // ====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ====================================================
    // 5. FAQ Accordion Toggle (For Resources Page)
    // ====================================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                // Toggle active class for the arrow rotation
                question.classList.toggle('active');
                
                // Get the answer div that immediately follows the button
                const answer = question.nextElementSibling;
                
                // Toggle open/close smooth animation
                if (question.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    answer.style.maxHeight = 0;
                }
            });
        });
    }
    // ====================================================
    // 6. Chatbot Logic
    // ====================================================
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const chatContainer = document.getElementById("chat-container");
    const chatLauncher = document.getElementById("chat-launcher");
    const chatCloseBtn = document.getElementById("chat-close-btn");

    // Toggle chat open/closed
    if (chatLauncher && chatContainer) {
        chatLauncher.addEventListener("click", () => {
            chatContainer.classList.add("chat-open");
            userInput.focus();
        });
    }

    if (chatCloseBtn && chatContainer) {
        chatCloseBtn.addEventListener("click", () => {
            chatContainer.classList.remove("chat-open");
        });
    }

    // Helper function to handle the logic
    async function runChat() {
        const text = userInput.value.trim();
        if (!text) return;

        // 1. Display user message
        chatBox.innerHTML += `<div class="user-msg">${text}</div>`;
        userInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;

        // 2. Show loading
        const loadingId = "loading-" + Date.now();
        chatBox.innerHTML += `<div class="bot-msg" id="${loadingId}">Typing...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            // 3. Send to backend
            const response = await fetch("https://rapidcochatbot.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            // 4. Show response
            document.getElementById(loadingId).remove();
            chatBox.innerHTML += `<div class="bot-msg">${data.reply}</div>`;

        } catch (error) {
            document.getElementById(loadingId).remove();
            chatBox.innerHTML += `<div class="bot-msg" style="color: red;">Error connecting to server.</div>`;
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Attach events to send button and Enter key
    if (sendButton && userInput) {
        sendButton.addEventListener("click", runChat);
        userInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") runChat();
        });
    }
});