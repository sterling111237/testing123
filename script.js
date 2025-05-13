// This file contains the JavaScript functionality for the interactive images application.
// It includes functions for opening and closing the modal in the main application,
// as well as functions for handling the login form submission.

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Here you can add your login logic (e.g., API call, validation)
            console.log('Username:', username);
            console.log('Password:', password);

            // For demonstration, we'll just alert the user
            alert('Login submitted for: ' + username);
        });
    }

    // Member Registration
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const memberName = document.getElementById('memberName').value;
            const memberEmail = document.getElementById('memberEmail').value;
            const contactPIC = document.getElementById('contactPIC').value;

            // Simulate admin approval process
            console.log('Registration submitted:', { memberName, memberEmail, contactPIC });
            alert('Registration submitted for admin approval.');
        });
    }

    // Posting
    const postingForm = document.getElementById('postingForm');
    if (postingForm) {
        postingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const postImage = document.getElementById('postImage').files[0];
            const postDescription = document.getElementById('postDescription').value;
            const postArea = document.getElementById('postArea').value;
            const postCategory = document.getElementById('postCategory').value;
            const postExpiration = document.getElementById('postExpiration').value;
            const postContact = document.getElementById('postContact').value;

            // Simulate post creation
            console.log('Post created:', { postImage, postDescription, postArea, postCategory, postExpiration, postContact });
            alert('Post created and pending moderation.');
        });
    }
});

function openModal(title, description) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDescription').innerText = description;
    document.getElementById('imageModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function filterFood() {
  const searchInput = document.getElementById('searchBar').value.toLowerCase();
  const foodCards = document.querySelectorAll('.image-card');

  foodCards.forEach(card => {
    const foodName = card.querySelector('.description').innerText.toLowerCase();
    if (foodName.includes(searchInput)) {
      card.style.display = 'block'; // Show the card if it matches the search
    } else {
      card.style.display = 'none'; // Hide the card if it doesn't match
    }
  });
}

// Mark as Done
function markAsDone(postId) {
    console.log(`Post ${postId} marked as done.`);
    alert(`Post ${postId} has been marked as done.`);
}

// Moderation (Extended Functionality)
function moderatePost(postId, action) {
    console.log(`Post ${postId} has been ${action}.`);
    alert(`Post ${postId} has been ${action}.`);
    if (action === 'taken down') {
        const reason = prompt('Please provide a reason for taking down the post:');
        if (reason) {
            console.log(`Reason for taking down post ${postId}: ${reason}`);
            alert(`Reason provided: ${reason}`);
        }
    }
}