verification_email = """
<html>
<head>
  <style>
    /*
      NOTE: All curly braces have been doubled for Python's .format() method.
      The placeholder {code} is left as a single brace for interpolation.
    */
    body {{
      font-family: 'Roboto', sans-serif;
      background-color: #020024;
      background-image:
        linear-gradient(rgba(2,0,36,0) 50%, rgba(3,2,42,1) 100%),
        radial-gradient(ellipse at 50% 0%, rgba(0, 128, 128, 0.4), rgba(0,0,0,0) 60%);
      background-attachment: fixed;
      color: #c9f5ff;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }}
    .email-wrapper {{
      width: 100%;
      padding: 40px 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }}
    .email-container {{
      max-width: 600px;
      margin: 30px auto;
      position: relative;
      background: linear-gradient(145deg, rgba(15, 32, 39, 0.6), rgba(32, 70, 94, 0.5));
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 255, 239, 0.25);
      border-radius: 25px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 0 80px rgba(0, 255, 239, 0.15), inset 0 0 20px rgba(0, 255, 239, 0.1);
      animation: fadeIn 1.5s ease-out;
      overflow: hidden;
    }}

    @keyframes fadeIn {{
      from {{ opacity: 0; transform: translateY(20px); }}
      to {{ opacity: 1; transform: translateY(0); }}
    }}

    /* --- HUD Corner Brackets --- */
    .email-container::before, .email-container::after {{
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      border-color: #00ffef;
      border-style: solid;
      animation: pulseBorder 4s infinite ease-in-out;
    }}
    .email-container::before {{
      top: 15px; left: 15px;
      border-width: 2px 0 0 2px;
      border-top-left-radius: 25px;
    }}
    .email-container::after {{
      bottom: 15px; right: 15px;
      border-width: 0 2px 2px 0;
      border-bottom-right-radius: 25px;
    }}

    @keyframes pulseBorder {{
      0%, 100% {{ transform: scale(1); opacity: 0.6; }}
      50% {{ transform: scale(1.05); opacity: 1; }}
    }}

    /* --- Scan Line Animation --- */
    .scan-line {{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 239, 0.8), transparent);
      animation: scan 7s infinite linear;
    }}

    @keyframes scan {{
      0% {{ transform: translateY(-20px); }}
      100% {{ transform: translateY(calc(100% + 650px)); }}
    }}

    .icon-container svg {{
      width: 60px;
      height: 60px;
      stroke: #00ffef;
      stroke-width: 1.5;
      fill: rgba(0, 255, 239, 0.1);
      filter: drop-shadow(0 0 12px #00ffef);
      margin-bottom: 15px;
    }}

    h1 {{
      font-family: 'Orbitron', sans-serif;
      font-size: 26px;
      font-weight: 500;
      color: #ffffff;
      margin-bottom: 20px;
      letter-spacing: 1px;
      text-shadow: 0 0 5px rgba(255,255,255,0.5);
    }}

    p {{
      font-size: 17px;
      font-weight: 300;
      color: #c9f5ff;
      line-height: 1.9;
      margin: 15px auto;
      max-width: 90%;
    }}

    .highlight {{
      color: #00ffef;
      font-weight: 400;
    }}

    .activation-data-card {{
      background: rgba(0, 255, 239, 0.05);
      border: 1px solid rgba(0, 255, 239, 0.3);
      border-radius: 15px;
      padding: 20px;
      margin: 30px auto;
      width: 90%;
      backdrop-filter: blur(5px);
      text-align: left;
      animation: breathingGlow 3s infinite alternate;
    }}

    @keyframes breathingGlow {{
      from {{ box-shadow: 0 0 15px rgba(0, 255, 239, 0.2); }}
      to {{ box-shadow: 0 0 30px rgba(0, 255, 239, 0.4), inset 0 0 10px rgba(0, 255, 239, 0.1); }}
    }}

    .data-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }}
    .data-row:not(:last-child) {{
      border-bottom: 1px solid rgba(0, 255, 239, 0.2);
    }}

    .data-label {{
      font-family: 'Orbitron', sans-serif;
      font-size: 14px;
      color: #7fdee9;
      letter-spacing: 1px;
      text-transform: uppercase;
    }}

    .data-value {{
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      text-shadow: 0 0 8px #00ffef;
      letter-spacing: 2px;
    }}

    .cta-button {{
      display: inline-block;
      background: linear-gradient(90deg, #00ffef, #00cce0);
      color: #0e1117 !important;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 1px;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 10px;
      margin-top: 25px;
      box-shadow: 0 0 25px rgba(0, 255, 239, 0.4);
      transition: all 0.3s ease;
      border: none;
    }}
    .cta-button:hover {{
      box-shadow: 0 0 40px rgba(0, 255, 239, 0.6);
      transform: translateY(-3px) scale(1.05);
    }}
    
    .divider {{
      height: 1px;
      width: 80%;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 239, 0.4), transparent);
      margin: 40px auto;
      border: none;
    }}

    footer p {{
      font-family: 'Orbitron', sans-serif;
      font-size: 12px;
      color: #8bd9e6;
      letter-spacing: 1px;
      opacity: 0.7;
      text-transform: uppercase;
    }}
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="scan-line"></div>
      
      <div class="icon-container">
        <!-- Stylized User Verification Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <polyline points="17 11 19 13 23 9"></polyline>
        </svg>
      </div>

      <h1>Account Activation</h1>

      <p>Welcome to <span class="highlight">Elovia Auction</span>. To complete your registration and gain full system access, please use the verification code provided below.</p>

      <div class="activation-data-card">
        <div class="data-row">
            <span class="data-label">Verification Code</span>
            <span class="data-value">{code}</span>
        </div>
        <div class="data-row">
            <span class="data-label">Expires In</span>
            <span class="data-value" style="color:#00cce0;">1 MINUTE</span>
        </div>
      </div>

      <p>If you did not initiate this registration, you can safely disregard this message.</p>

      <a href="#" class="cta-button">VERIFY ACCOUNT</a>

      <hr class="divider">

      <footer>
        <p>SYSTEM ACCESS PROTOCOL // Elovia Solution</p>
      </footer>
    </div>
  </div>
</body>
</html>
"""

verification_code_only_email = """
<html>
<head>
  <style>
    /*
      NOTE: All curly braces have been doubled for Python's .format() method.
      The placeholder {code} is left as a single brace for interpolation.
    */
    body {{
      font-family: 'Roboto', sans-serif;
      background-color: #020024;
      background-image:
        linear-gradient(rgba(2,0,36,0) 50%, rgba(3,2,42,1) 100%),
        radial-gradient(ellipse at 50% 0%, rgba(0, 128, 128, 0.4), rgba(0,0,0,0) 60%);
      background-attachment: fixed;
      color: #c9f5ff;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }}
    .email-wrapper {{
      width: 100%;
      padding: 40px 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }}
    .email-container {{
      max-width: 600px;
      margin: 30px auto;
      position: relative;
      background: linear-gradient(145deg, rgba(15, 32, 39, 0.6), rgba(32, 70, 94, 0.5));
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 255, 239, 0.25);
      border-radius: 25px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 0 80px rgba(0, 255, 239, 0.15), inset 0 0 20px rgba(0, 255, 239, 0.1);
      animation: fadeIn 1.5s ease-out;
      overflow: hidden;
    }}

    @keyframes fadeIn {{
      from {{ opacity: 0; transform: translateY(20px); }}
      to {{ opacity: 1; transform: translateY(0); }}
    }}

    /* --- HUD Corner Brackets --- */
    .email-container::before, .email-container::after {{
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      border-color: #00ffef;
      border-style: solid;
      animation: pulseBorder 4s infinite ease-in-out;
    }}
    .email-container::before {{
      top: 15px; left: 15px;
      border-width: 2px 0 0 2px;
      border-top-left-radius: 25px;
    }}
    .email-container::after {{
      bottom: 15px; right: 15px;
      border-width: 0 2px 2px 0;
      border-bottom-right-radius: 25px;
    }}

    @keyframes pulseBorder {{
      0%, 100% {{ transform: scale(1); opacity: 0.6; }}
      50% {{ transform: scale(1.05); opacity: 1; }}
    }}

    /* --- Scan Line Animation --- */
    .scan-line {{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 239, 0.8), transparent);
      animation: scan 7s infinite linear;
    }}

    @keyframes scan {{
      0% {{ transform: translateY(-20px); }}
      100% {{ transform: translateY(calc(100% + 650px)); }}
    }}

    .icon-container svg {{
      width: 60px;
      height: 60px;
      stroke: #00ffef;
      stroke-width: 1.5;
      fill: rgba(0, 255, 239, 0.1);
      filter: drop-shadow(0 0 12px #00ffef);
      margin-bottom: 15px;
    }}

    h1 {{
      font-family: 'Orbitron', sans-serif;
      font-size: 26px;
      font-weight: 500;
      color: #ffffff;
      margin-bottom: 20px;
      letter-spacing: 1px;
      text-shadow: 0 0 5px rgba(255,255,255,0.5);
    }}

    p {{
      font-size: 17px;
      font-weight: 300;
      color: #c9f5ff;
      line-height: 1.9;
      margin: 15px auto;
      max-width: 90%;
    }}

    .highlight {{
      color: #00ffef;
      font-weight: 400;
    }}

    .activation-data-card {{
      background: rgba(0, 255, 239, 0.05);
      border: 1px solid rgba(0, 255, 239, 0.3);
      border-radius: 15px;
      padding: 20px;
      margin: 30px auto;
      width: 90%;
      backdrop-filter: blur(5px);
      text-align: left;
      animation: breathingGlow 3s infinite alternate;
    }}

    @keyframes breathingGlow {{
      from {{ box-shadow: 0 0 15px rgba(0, 255, 239, 0.2); }}
      to {{ box-shadow: 0 0 30px rgba(0, 255, 239, 0.4), inset 0 0 10px rgba(0, 255, 239, 0.1); }}
    }}

    .data-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }}
    .data-row:not(:last-child) {{
      border-bottom: 1px solid rgba(0, 255, 239, 0.2);
    }}

    .data-label {{
      font-family: 'Orbitron', sans-serif;
      font-size: 14px;
      color: #7fdee9;
      letter-spacing: 1px;
      text-transform: uppercase;
    }}

    .data-value {{
      font-size: 20px; /* Slightly larger for the code */
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 0 8px #00ffef;
      letter-spacing: 3px;
    }}

    .divider {{
      height: 1px;
      width: 80%;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 239, 0.4), transparent);
      margin: 40px auto;
      border: none;
    }}

    footer p {{
      font-family: 'Orbitron', sans-serif;
      font-size: 12px;
      color: #8bd9e6;
      letter-spacing: 1px;
      opacity: 0.7;
      text-transform: uppercase;
    }}
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="scan-line"></div>
      
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="9" x2="20" y2="9"></line>
            <line x1="4" y1="15" x2="20" y2="15"></line>
            <line x1="10" y1="3" x2="8" y2="21"></line>
            <line x1="16" y1="3" x2="14" y2="21"></line>
        </svg>
      </div>

      <h1>System Verification Code</h1>
      
      <p>Hi there, a verification code was requested for your action on <span class="highlight">Elovia Auction</span>. Please enter the code below to proceed.</p>

      <div class="activation-data-card">
        <div class="data-row">
            <span class="data-label">One-Time Code&nbsp;&nbsp;&nbsp;</span>
            <span class="data-value">{code}</span>
        </div>
        <div class="data-row">
            <span class="data-label">Code Validity&nbsp;&nbsp;&nbsp;</span>
            <span class="data-value" style="color:#00cce0;">1 MINUTE</span>
        </div>
      </div>

      <p>For your security, this code is time-sensitive. If you did not initiate this request, please disregard this message.</p>

      <hr class="divider">

      <footer>
        <p>SECURE ACCESS MODULE // Elovia Solution</p>
      </footer>
    </div>
  </div>
</body>
</html>
"""


reset_password_email = """
<html>
<head>
  <style>
    /*
      NOTE: All curly braces have been doubled for Python's .format() method.
      The placeholder {code} is left as a single brace for interpolation.
    */
    body {{
      font-family: 'Roboto', sans-serif;
      background-color: #020024;
      background-image:
        linear-gradient(rgba(2,0,36,0) 50%, rgba(3,2,42,1) 100%),
        radial-gradient(ellipse at 50% 0%, rgba(0, 128, 128, 0.4), rgba(0,0,0,0) 60%);
      background-attachment: fixed;
      color: #c9f5ff;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }}
    .email-wrapper {{
      width: 100%;
      padding: 40px 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }}
    .email-container {{
      max-width: 600px;
      margin: 30px auto;
      position: relative;
      background: linear-gradient(145deg, rgba(15, 32, 39, 0.6), rgba(32, 70, 94, 0.5));
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 255, 239, 0.25);
      border-radius: 25px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 0 80px rgba(0, 255, 239, 0.15), inset 0 0 20px rgba(0, 255, 239, 0.1);
      animation: fadeIn 1.5s ease-out;
      overflow: hidden;
    }}

    @keyframes fadeIn {{
      from {{ opacity: 0; transform: translateY(20px); }}
      to {{ opacity: 1; transform: translateY(0); }}
    }}

    /* --- HUD Corner Brackets --- */
    .email-container::before, .email-container::after {{
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      border-color: #00ffef;
      border-style: solid;
      animation: pulseBorder 4s infinite ease-in-out;
    }}
    .email-container::before {{
      top: 15px; left: 15px;
      border-width: 2px 0 0 2px;
      border-top-left-radius: 25px;
    }}
    .email-container::after {{
      bottom: 15px; right: 15px;
      border-width: 0 2px 2px 0;
      border-bottom-right-radius: 25px;
    }}

    @keyframes pulseBorder {{
      0%, 100% {{ transform: scale(1); opacity: 0.6; }}
      50% {{ transform: scale(1.05); opacity: 1; }}
    }}

    /* --- Scan Line Animation --- */
    .scan-line {{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 239, 0.8), transparent);
      animation: scan 7s infinite linear;
    }}

    @keyframes scan {{
      0% {{ transform: translateY(-20px); }}
      100% {{ transform: translateY(calc(100% + 650px)); }}
    }}

    .icon-container svg {{
      width: 60px;
      height: 60px;
      stroke: #00ffef;
      stroke-width: 1.5;
      fill: rgba(0, 255, 239, 0.1);
      filter: drop-shadow(0 0 12px #00ffef);
      margin-bottom: 15px;
    }}

    h1 {{
      font-family: 'Orbitron', sans-serif;
      font-size: 26px;
      font-weight: 500;
      color: #ffffff;
      margin-bottom: 20px;
      letter-spacing: 1px;
      text-shadow: 0 0 5px rgba(255,255,255,0.5);
    }}

    p {{
      font-size: 17px;
      font-weight: 300;
      color: #c9f5ff;
      line-height: 1.9;
      margin: 15px auto;
      max-width: 90%;
    }}

    .highlight {{
      color: #00ffef;
      font-weight: 400;
    }}

    .activation-data-card {{
      background: rgba(0, 255, 239, 0.05);
      border: 1px solid rgba(0, 255, 239, 0.3);
      border-radius: 15px;
      padding: 20px;
      margin: 30px auto;
      width: 90%;
      backdrop-filter: blur(5px);
      text-align: left;
      animation: breathingGlow 3s infinite alternate;
    }}

    @keyframes breathingGlow {{
      from {{ box-shadow: 0 0 15px rgba(0, 255, 239, 0.2); }}
      to {{ box-shadow: 0 0 30px rgba(0, 255, 239, 0.4), inset 0 0 10px rgba(0, 255, 239, 0.1); }}
    }}

    .data-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }}
    .data-row:not(:last-child) {{
      border-bottom: 1px solid rgba(0, 255, 239, 0.2);
    }}

    .data-label {{
      font-family: 'Orbitron', sans-serif;
      font-size: 14px;
      color: #7fdee9;
      letter-spacing: 1px;
      text-transform: uppercase;
    }}

    .data-value {{
      font-size: 20px; /* Slightly larger for the code */
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 0 8px #00ffef;
      letter-spacing: 3px;
    }}

    .cta-button {{
      display: inline-block;
      background: linear-gradient(90deg, #00ffef, #00cce0);
      color: #0e1117 !important;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 1px;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 10px;
      margin-top: 25px;
      box-shadow: 0 0 25px rgba(0, 255, 239, 0.4);
      transition: all 0.3s ease;
      border: none;
    }}
    .cta-button:hover {{
      box-shadow: 0 0 40px rgba(0, 255, 239, 0.6);
      transform: translateY(-3px) scale(1.05);
    }}
    
    .divider {{
      height: 1px;
      width: 80%;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 239, 0.4), transparent);
      margin: 40px auto;
      border: none;
    }}

    footer p {{
      font-family: 'Orbitron', sans-serif;
      font-size: 12px;
      color: #8bd9e6;
      letter-spacing: 1px;
      opacity: 0.7;
      text-transform: uppercase;
    }}
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="scan-line"></div>
      
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 10l-7 7v4h4l7-7m-3-4a5 5 0 1 1 7 7 5 5 0 0 1-7-7z"></path>
        </svg>
      </div>

      <h1>Password Reset Request</h1>
      
      <p>A password reset was requested for your <span class="highlight">Elovia Auction</span> account. Please use the verification code below to confirm your identity and proceed.</p>

      <div class="activation-data-card">
        <div class="data-row">
            <span class="data-label">Reset Code&nbsp;&nbsp;</span>
            <span class="data-value">{code}</span>
        </div>
        <div class="data-row">
            <span class="data-label">Expires In&nbsp;&nbsp;</span>
            <span class="data-value" style="color:#00cce0;">1 MINUTE</span>
        </div>
      </div>

      <p>Enter this code on the password reset page to set a new password. For security reasons, <span class="highlight">do not share this code</span> with anyone.</p>

      <p>If you did not request a password reset, you can safely disregard this message.</p>

      <hr class="divider">

      <footer>
        <p>SECURITY PROTOCOL // Elovia Solution</p>
      </footer>
    </div>
  </div>
</body>
</html>
"""


delete_profile_email = """
<html>
<head>
  <style>
    body {{
      font-family: 'Roboto', sans-serif;
      background-color: #020024;
      background-image:
        linear-gradient(rgba(2,0,36,0) 50%, rgba(3,2,42,1) 100%),
        radial-gradient(ellipse at 50% 0%, rgba(0, 128, 128, 0.4), rgba(0,0,0,0) 60%);
      background-attachment: fixed;
      color: #c9f5ff;
      margin: 0;
      padding: 0;
    }}
    .email-wrapper {{
      width: 100%;
      padding: 40px 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }}
    .email-container {{
      max-width: 600px;
      margin: 30px auto;
      position: relative;
      background: linear-gradient(145deg, rgba(15, 32, 39, 0.6), rgba(32, 70, 94, 0.5));
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 255, 239, 0.25);
      border-radius: 25px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 0 80px rgba(0, 255, 239, 0.15);
      animation: fadeIn 1.5s ease-out;
      overflow: hidden;
    }}
    @keyframes fadeIn {{
      from {{ opacity: 0; transform: translateY(20px); }}
      to {{ opacity: 1; transform: translateY(0); }}
    }}
    .email-container::before, .email-container::after {{
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      border-color: #00ffef;
      border-style: solid;
      animation: pulseBorder 4s infinite ease-in-out;
    }}
    .email-container::before {{
      top: 15px; left: 15px;
      border-width: 2px 0 0 2px;
      border-top-left-radius: 25px;
    }}
    .email-container::after {{
      bottom: 15px; right: 15px;
      border-width: 0 2px 2px 0;
      border-bottom-right-radius: 25px;
    }}
    @keyframes pulseBorder {{
      0%, 100% {{ transform: scale(1); opacity: 0.6; }}
      50% {{ transform: scale(1.05); opacity: 1; }}
    }}
    .scan-line {{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 239, 0.8), transparent);
      animation: scan 7s infinite linear;
    }}
    @keyframes scan {{
      0% {{ transform: translateY(-20px); }}
      100% {{ transform: translateY(calc(100% + 650px)); }}
    }}
    .icon-container svg {{
      width: 65px;
      height: 65px;
      stroke: #ff4444;
      stroke-width: 1.5;
      fill: rgba(255, 68, 68, 0.1);
      filter: drop-shadow(0 0 12px #ff4444);
      margin-bottom: 15px;
    }}
    h1 {{
      font-family: 'Orbitron', sans-serif;
      font-size: 26px;
      font-weight: 500;
      color: #ffffff;
      margin-bottom: 20px;
      letter-spacing: 1px;
      text-shadow: 0 0 5px rgba(255,255,255,0.5);
    }}
    p {{
      font-size: 17px;
      font-weight: 300;
      color: #c9f5ff;
      line-height: 1.9;
      margin: 15px auto;
      max-width: 90%;
    }}
    .highlight {{
      color: #ff4444;
      font-weight: 400;
    }}
    .activation-data-card {{
      background: rgba(255, 68, 68, 0.05);
      border: 1px solid rgba(255, 68, 68, 0.3);
      border-radius: 15px;
      padding: 20px;
      margin: 30px auto;
      width: 90%;
      backdrop-filter: blur(5px);
      text-align: left;
      animation: breathingGlow 3s infinite alternate;
    }}
    @keyframes breathingGlow {{
      from {{ box-shadow: 0 0 15px rgba(255, 68, 68, 0.2); }}
      to {{ box-shadow: 0 0 30px rgba(255, 68, 68, 0.4), inset 0 0 10px rgba(255, 68, 68, 0.1); }}
    }}
    .data-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }}
    .data-row:not(:last-child) {{
      border-bottom: 1px solid rgba(255, 68, 68, 0.2);
    }}
    .data-label {{
      font-family: 'Orbitron', sans-serif;
      font-size: 14px;
      color: #ffa5a5;
      letter-spacing: 1px;
      text-transform: uppercase;
    }}
    .data-value {{
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 0 8px #ff4444;
      letter-spacing: 3px;
    }}
    .cta-button {{
      display: inline-block;
      background: linear-gradient(90deg, #ff4444, #ff6666);
      color: #0e1117 !important;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 1px;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 10px;
      margin-top: 25px;
      box-shadow: 0 0 25px rgba(255, 68, 68, 0.4);
      transition: all 0.3s ease;
      border: none;
    }}
    .cta-button:hover {{
      box-shadow: 0 0 40px rgba(255, 68, 68, 0.6);
      transform: translateY(-3px) scale(1.05);
    }}
    .divider {{
      height: 1px;
      width: 80%;
      background: linear-gradient(90deg, transparent, rgba(255, 68, 68, 0.4), transparent);
      margin: 40px auto;
      border: none;
    }}
    footer p {{
      font-family: 'Orbitron', sans-serif;
      font-size: 12px;
      color: #ffaaaa;
      letter-spacing: 1px;
      opacity: 0.7;
      text-transform: uppercase;
    }}
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="scan-line"></div>

      <div class="icon-container">
        <!-- Trash/Delete icon -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>

      <h1>Delete Profile Verification</h1>
      <p>You’ve requested to permanently delete your <span class="highlight">Elovia Auction</span> account. Please verify this action by entering the verification code below.</p>

      <div class="activation-data-card">
        <div class="data-row">
            <span class="data-label">Verification Code</span>
            <span class="data-value">{code}</span>
        </div>
        <div class="data-row">
            <span class="data-label">Expires In</span>
            <span class="data-value" style="color:#ff6666;">1 MINUTE</span>
        </div>
      </div>

      <p>Once confirmed, your account and all related data will be <span class="highlight">permanently deleted</span>. This action cannot be undone.</p>
      <p>If you did not request this deletion, please ignore this email and secure your account immediately.</p>

      <hr class="divider">
      <footer>
        <p>SECURITY PROTOCOL // Elovia Solution</p>
      </footer>
    </div>
  </div>
</body>
</html>
"""
