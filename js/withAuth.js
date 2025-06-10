function checkAuthentication() {
    const token = localStorage.getItem('token');

    // If no token is found, redirect to login page
    if (!token) {
        redirectToLogin();
        return;
    }

    try {
        // Decode token to check expiration (assuming it's a JWT)
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

        if (payload.exp && payload.exp < currentTime) {
            // Token has expired, log out the user
            logoutUser();
        }
    } catch (error) {
        console.error("Invalid token format", error);
        logoutUser(); // Handle corrupted token
    }
}

// Function to log out the user
function logoutUser() {
    localStorage.removeItem('token'); // Remove token
    redirectToLogin();
}

// Function to redirect to login page
function redirectToLogin() {
    window.location.href = '../auth/login.html';
}

// Check authentication when the page loads
document.addEventListener("DOMContentLoaded", checkAuthentication);
