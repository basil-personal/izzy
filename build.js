/**
 * Password-protect _source.html using CryptoJS AES.
 * Usage: STATICRYPT_PW=REDACTED node build.js
 * The password is passed via env var so it never appears in committed files.
 */
const fs = require('fs');
const crypto = require('crypto');

const PASSWORD = process.env.STATICRYPT_PW;
if (!PASSWORD) {
  console.error('ERROR: Set STATICRYPT_PW environment variable.\nUsage: STATICRYPT_PW=yourpassword node build.js');
  process.exit(1);
}

const source = fs.readFileSync('_source.html', 'utf8');

// Encrypt with CryptoJS-compatible format (OpenSSL):
// "Salted__" + 8-byte salt + ciphertext
// CryptoJS.AES.decrypt() on the client can read this directly from base64.
const salt = crypto.randomBytes(8);
const keyIv = crypto.pbkdf2Sync(PASSWORD, salt, 10000, 48, 'md5');
const key = keyIv.subarray(0, 32);
const iv = keyIv.subarray(32, 48);
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
let ct = cipher.update(source, 'utf8');
ct = Buffer.concat([ct, cipher.final()]);
// OpenSSL format: "Salted__" + salt + ciphertext, then base64 the whole thing
const openssl = Buffer.concat([Buffer.from('Salted__'), salt, ct]);
const encrypted = openssl.toString('base64');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>~*~ iZzYsBaCh ~*~</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"><\/script>
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%}
body{
  font-family:'Comic Neue','Comic Sans MS',cursive;
  display:flex;align-items:center;justify-content:center;
  background:
    radial-gradient(ellipse at 20% 50%,rgba(255,105,180,.3) 0%,transparent 50%),
    radial-gradient(ellipse at 80% 20%,rgba(135,206,235,.3) 0%,transparent 50%),
    radial-gradient(ellipse at 50% 80%,rgba(155,89,182,.2) 0%,transparent 50%),
    linear-gradient(180deg,#FFE4F0,#FFC0CB,#FFB6C1);
  position:relative;
}
body::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><text y='28' font-size='24' opacity='.12'>%E2%9C%A8</text></svg>"),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><text y='40' font-size='28' opacity='.08'>%F0%9F%A6%8B</text></svg>");
  background-size:80px 80px,120px 120px;
  animation:bgFloat 15s ease-in-out infinite;
}
@keyframes bgFloat{
  0%,100%{background-position:0 0,60px 60px}
  50%{background-position:40px 20px,20px 80px}
}
.w{
  background:#C0C0C0;border:2px solid #808080;border-top-color:#fff;border-left-color:#fff;
  box-shadow:4px 4px 0 rgba(0,0,0,.3),inset 1px 1px 0 #fff;
  width:90%;max-width:360px;position:relative;z-index:10;
}
.tb{
  background:linear-gradient(180deg,#0058A8,#003C7A);color:#fff;
  font-family:'VT323',monospace;font-size:14px;padding:4px 8px;
  display:flex;justify-content:space-between;align-items:center;user-select:none;
}
.tb-btns{display:flex;gap:2px}
.tb-b{width:16px;height:14px;background:#C0C0C0;border:1px outset #fff;font-size:9px;line-height:12px;text-align:center;font-family:monospace}
.bd{background:#fff;padding:24px 20px;text-align:center}
.icon{
  width:70px;height:70px;margin:0 auto 14px;
  background:linear-gradient(135deg,#FF69B4,#9B59B6);border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:34px;
  border:3px solid #FF1493;box-shadow:0 0 20px rgba(255,20,147,.5);
  animation:pulse 2s ease-in-out infinite;
}
@keyframes pulse{
  0%,100%{box-shadow:0 0 20px rgba(255,20,147,.5);transform:scale(1)}
  50%{box-shadow:0 0 35px rgba(255,20,147,.8);transform:scale(1.05)}
}
.t1{font-family:'Press Start 2P',monospace;font-size:10px;color:#FF1493;margin-bottom:4px;line-height:1.6}
.bn{
  font-family:'Press Start 2P',monospace;font-size:24px;margin-bottom:6px;
  background:linear-gradient(90deg,#FF1493,#9B59B6,#FF69B4,#00CED1);
  background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;animation:grad 3s ease infinite;
}
@keyframes grad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.sub{font-size:17px;color:#9B59B6;font-weight:700;margin-bottom:16px}
.am{
  background:#FFFFCC;border:1px solid #ccc;padding:10px;font-style:italic;
  font-size:13px;color:#555;margin-bottom:16px;text-align:left;line-height:1.5;
}
.al{font-weight:700;color:#0000FF;font-style:normal;font-size:11px;font-family:'VT323',monospace}
.pc{position:relative;background:#f2f2f2;border:2px inset #ccc;margin:0 0 12px}
.pc input{
  width:100%;padding:12px;border:none;outline:none;
  font-family:'Comic Neue',cursive;font-size:16px;background:transparent;box-sizing:border-box;
}
.btn{
  background:linear-gradient(180deg,#FF69B4,#FF1493);color:#fff;
  border:2px outset #FF69B4;padding:12px 24px;
  font-family:'Press Start 2P',monospace;font-size:10px;
  cursor:pointer;text-transform:uppercase;letter-spacing:1px;width:100%;
  -webkit-appearance:none;appearance:none;
}
.btn:active{border-style:inset;transform:translate(1px,1px)}
.sb{
  background:#C0C0C0;border-top:1px solid #808080;padding:4px 8px;
  font-family:'VT323',monospace;font-size:12px;color:#555;text-align:center;
}
.blink{animation:blink 1s step-end infinite}
@keyframes blink{50%{opacity:0}}
.err{color:#FF1493;font-family:'VT323',monospace;font-size:14px;margin-bottom:8px;min-height:18px}
.bd2{text-align:center;padding:6px 0;font-size:14px;letter-spacing:8px;opacity:.5;margin-bottom:8px}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
.shake{animation:shake .4s ease}
@media(max-width:360px){.bn{font-size:20px}.t1{font-size:9px}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important}}
</style>
</head>
<body>
<div class="w" id="win">
<div class="tb"><span>iZzYsBaCh - Sign On</span><div class="tb-btns"><div class="tb-b">_</div><div class="tb-b">&#9633;</div><div class="tb-b">X</div></div></div>
<div class="bd">
<div class="icon">&#x1F470;</div>
<div class="t1">~*~ U aRe InViTeD 2 ~*~</div>
<div class="bn">IzZy'S BaCh</div>
<div class="sub">&#x1F98B; eNtEr PaSsWoRd 2 SiGn On &#x1F98B;</div>
<div class="am">
<div class="al">&#x2728; Auto Response from BrIdE2bE_iZzY:</div><br>
"tHiS pAgE iS tOp SeCrEt!! oNlY iNvItEd GiRlZ aLlOwEd &#x1F48D;&#x2728; AsK tHe GrOuP cHaT 4 tHe PaSsWoRd xOxO &#x1F98B;&#x1F496;"
</div>
<div class="err" id="err"></div>
<div class="pc"><input type="text" id="pw" placeholder="eNtEr PaSsWoRd..." autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false"></div>
<div class="bd2">&#x1F98B; &#x1F98B; &#x1F98B;</div>
<button type="button" class="btn" id="go">&#x2728; SiGn On 2 PaRtY &#x2728;</button>
</div>
<div class="sb" id="status"><span class="blink">_</span> wAiTiNg FoR pAsSwoRd...</div>
</div>
<script>
var ED="${encrypted}";
function doDecrypt(){
  var pw=document.getElementById("pw").value;
  if(!pw){document.getElementById("err").textContent="eNtEr a PaSsWoRd!!";return}
  document.getElementById("go").textContent="dEcRyPtInG...";
  document.getElementById("go").disabled=true;
  setTimeout(function(){
    try{
      var dec=CryptoJS.AES.decrypt(ED,pw,{kdf:CryptoJS.kdf.OpenSSL,hasher:CryptoJS.algo.MD5}).toString(CryptoJS.enc.Utf8);
      if(!dec||dec.length<50){throw new Error("bad")}
      document.open();document.write(dec);document.close();
    }catch(e){
      document.getElementById("err").textContent="wRoNg PaSsWoRd bAbE!! tRy AgAiN";
      document.getElementById("win").style.animation="shake .4s ease";
      setTimeout(function(){document.getElementById("win").style.animation=""},500);
      document.getElementById("go").textContent="\\u2728 SiGn On 2 PaRtY \\u2728";
      document.getElementById("go").disabled=false;
    }
  },50);
}
document.getElementById("go").addEventListener("click",doDecrypt);
document.getElementById("pw").addEventListener("keydown",function(e){if(e.key==="Enter"||e.keyCode===13){e.preventDefault();doDecrypt()}});
<\/script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('Built index.html (' + Math.round(fs.statSync('index.html').size / 1024) + 'KB)');
