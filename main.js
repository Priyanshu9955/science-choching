// change nav Style on Scroll
window.addEventListener("scroll", () => {
  document
    .querySelector("nav")
    .classList.toggle("window-scroll", window.scrollY > 0);
});

// show/hide faq answer
const faqs = document.querySelectorAll(".faq");
faqs.forEach((faq) => {
  faq.addEventListener("click", () => {
    faq.classList.toggle("open");

    //change icons
    // answer.nextElementSibling.classList.toggle('active')
    const icon = faq.querySelector(".faq_icon i");
    if (icon.className == "ri-add-fill") {
      icon.className = "ri-subtract-fill";
    } else {
      icon.className = "ri-add-fill";
    }
  });
});

//  show/hide nav menu
const menu = document.querySelector(".nav_menu");
const menuBtn = document.querySelector("#open-menu-button");
const closeBtn = document.querySelector("#close-menu-button");

menuBtn.addEventListener("click", () => {
  menu.style.display = "flex";
  closeBtn.style.display = "inline-block";
  menuBtn.style.display = "none";
});

// close nav menu
const closeNav = () => {
  menu.style.display = "none";
  closeBtn.style.display = "none";
  menuBtn.style.display = "inline-block";
};

closeBtn.addEventListener("click", closeNav)





// /* ================== Google Auth Setup ============ */

// Decode JWT token
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Handle Google Login Callback
function handleCredentialResponse(response) {
    const data = parseJwt(response.credential);
    const userInfo = {
        name: data.name,
        email: data.email,
        picture: data.picture,
        id: data.sub
    };
    
    // Store user information
    localStorage.setItem('authInfo', JSON.stringify(userInfo));
    
    // Redirect to index page
    window.location.href = 'index.html';
}

// Check if user is logged in
function checkLogin() {
    const authInfo = localStorage.getItem('authInfo');
    return authInfo ? JSON.parse(authInfo) : null;
}

// Update Navigation Bar
function updateNavbar() {
    const userInfo = checkLogin();
    
    // Find auth container in the navigation menu
    const authNavItems = document.querySelectorAll('.auth-nav-item');
    
    authNavItems.forEach(item => {
        if (userInfo) {
            // User is logged in
            item.innerHTML = `
                <div class="user-profile-nav" style="display: flex; align-items: center; gap: 10px;">
                    <img src="${userInfo.picture}" alt="Profile" style="width: 30px; height: 30px; border-radius: 50%;">
                    <span style="color: white; font-size: 0.9rem;">${userInfo.name}</span>
                    <button onclick="logout()" class="btn btn-primary" style="padding: 5px 15px; font-size: 0.8rem;">Logout</button>
                </div>
            `;
        } else {
            // User is not logged in
            item.innerHTML = `<a href="login.html" class="btn btn-primary" style="padding: 5px 15px; background: transparent;">LogIn/Sign Up</a>`;
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem('authInfo');
    window.location.href = 'login.html';
}

// Run updates on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    updateCourseDetails();
});

// Update Course Details page based on login state
function updateCourseDetails() {
    const userInfo = checkLogin();
    
    // Enroll button update
    const enrollBtns = document.querySelectorAll('.enroll-box .btn');
    if (enrollBtns.length > 0) {
        enrollBtns.forEach(btn => {
            if (userInfo) {
                const courseKey = 'enrolled_' + window.location.pathname;
                if (localStorage.getItem(courseKey) === 'true') {
                    btn.textContent = 'Enrolled';
                    btn.href = '#';
                    btn.style.backgroundColor = 'var(--color-sucess)';
                    btn.style.borderColor = 'var(--color-sucess)';
                    btn.style.pointerEvents = 'none';
                } else {
                    btn.href = '#';
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        localStorage.setItem(courseKey, 'true');
                        btn.textContent = 'Enrolled';
                        btn.style.backgroundColor = 'var(--color-sucess)';
                        btn.style.borderColor = 'var(--color-sucess)';
                        btn.style.pointerEvents = 'none';
                    });
                }
            } else {
                btn.href = 'login.html';
            }
        });
    }

    // Video lock update
    const lockOverlays = document.querySelectorAll('.lock-overlay');
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    
    if (lockOverlays.length > 0 && userInfo) {
        lockOverlays.forEach(overlay => overlay.style.display = 'none');
        videoThumbnails.forEach(thumb => {
            thumb.style.filter = 'none';
        });
    }
}


/* ================== Web3Forms Setup ============ */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const statusDiv = document.getElementById('form-status');
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            statusDiv.innerHTML = '<p style="color: blue;">Sending your message...</p>';
            
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    statusDiv.innerHTML = '<p style="color: #00d26a;">Message sent successfully!</p>';
                    contactForm.reset();
                } else {
                    console.log(response);
                    statusDiv.innerHTML = `<p style="color: red;">${json.message}</p>`;
                }
            })
            .catch(error => {
                console.log(error);
                statusDiv.innerHTML = '<p style="color: red;">Something went wrong!</p>';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                setTimeout(() => {
                    statusDiv.innerHTML = '';
                }, 5000);
            });
        });
    }
});