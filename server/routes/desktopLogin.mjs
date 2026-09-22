export function handleDesktopLoginRoutes(req, res, pathname) {
    if (pathname === '/desktop-login' && req.method === 'GET') {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeetFloo Desktop Login</title>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <style>
        body {
            background-color: #121214;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: rgba(255, 255, 255, 0.05);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        h2 {
            margin-top: 0;
            font-size: 1.25rem;
            font-weight: 600;
        }
        p {
            color: #a1a1aa;
            font-size: 0.875rem;
            margin-bottom: 2rem;
        }
        .success-msg {
            display: none;
            margin-top: 1.5rem;
        }
        .open-btn {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            font-weight: 600;
            border-radius: 0.5rem;
            text-decoration: none;
            cursor: pointer;
            border: none;
            font-size: 0.95rem;
            transition: all 0.2s;
        }
        .open-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        .check-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 1rem;
            background: rgba(52, 211, 153, 0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #34d399;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="loginSection">
            <h2>Sign in to MeetFloo</h2>
            <p>Log in with Google to continue in the desktop app.</p>
            
            <div style="display: flex; justify-content: center;">
                <div id="g_id_onload"
                    data-client_id="${process.env.VITE_GOOGLE_CLIENT_ID || ''}"
                    data-context="signin"
                    data-ux_mode="popup"
                    data-callback="handleCredentialResponse"
                    data-auto_prompt="false">
                </div>

                <div class="g_id_signin"
                    data-type="standard"
                    data-shape="pill"
                    data-theme="filled_black"
                    data-text="continue_with"
                    data-size="large"
                    data-logo_alignment="left">
                </div>
            </div>
        </div>
        
        <div class="success-msg" id="successMsg">
            <div class="check-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h3 style="margin: 0 0 0.5rem; font-size: 1.15rem; font-weight: 600; color: #f4f4f5;">Signed in successfully!</h3>
            <p style="color: #a1a1aa; font-size: 0.85rem; margin-bottom: 1.25rem;">
                Opening MeetFloo on your computer...
            </p>
            <button id="openAppBtn" class="open-btn">
                Open MeetFloo Desktop App
            </button>
            <p style="font-size: 0.75rem; color: #71717a; margin-top: 1.5rem; margin-bottom: 0;">
                You can safely close this browser window once the app opens.
            </p>
        </div>
    </div>

    <script>
        function handleCredentialResponse(response) {
            if (response.credential) {
                const deepLinkUrl = 'meetfloo://auth?token=' + encodeURIComponent(response.credential);
                
                // Hide login buttons and show success message
                document.getElementById('loginSection').style.display = 'none';
                const successDiv = document.getElementById('successMsg');
                successDiv.style.display = 'block';

                const openBtn = document.getElementById('openAppBtn');
                openBtn.onclick = function() {
                    window.location.href = deepLinkUrl;
                };

                // Trigger deep link automatically
                window.location.href = deepLinkUrl;
            }
        }
    </script>
</body>
</html>
        `;
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(html);
        return true;
    }
    return false;
}
