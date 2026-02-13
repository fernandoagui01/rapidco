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
});