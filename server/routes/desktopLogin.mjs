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
            color: #34d399;
            margin-top: 1rem;
            display: none;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <div class="container">
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
        
        <p class="success-msg" id="successMsg">Success! Redirecting back to the app...</p>
    </div>

    <script>
        function handleCredentialResponse(response) {
            if (response.credential) {
                document.getElementById('successMsg').style.display = 'block';
                // Send the token back to the desktop app via deep link
                window.location.href = 'meetfloo://auth?token=' + encodeURIComponent(response.credential);
                
                // Provide status and redirect browser back to homepage (./)
                setTimeout(() => {
                    document.getElementById('successMsg').innerHTML = 'Logged in successfully! Redirecting you to <a href="./" style="color: #60a5fa; text-decoration: underline;">MeetFloo Home (./)</a>...<br><br><span style="font-size: 0.75rem; color: #71717a;">If the desktop app didn\\'t open, please click "Open MeetFloo" in the browser prompt.</span>';
                    setTimeout(() => {
                        window.location.href = './';
                    }, 2500);
                }, 1500);
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
