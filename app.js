(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
$('themeBtn').addEventListener('click',function(){var n=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}});
var EX=[
 'Dear customer, your SBI account will be blocked today. Update KYC immediately: http://sbi-kyc-update.xyz/login',
 'Sir galti se aapke account me Rs 5000 chale gaye. Please return the money. Maine request bheji hai, approve kar do aur UPI PIN dalo.',
 'Congratulations! You have won Rs 25,00,000 in KBC lucky draw. Pay Rs 999 processing fee to claim your prize. Call 9876543210 now.',
 'Rs 450.00 debited from A/c XX1234 on 20-10-26 to VPA shop@okaxis (UPI Ref 123456789012). If not you, call your bank on the number at the back of your card.'
];
var msg=$('msg');
var LV={low:['Low risk','No clear scam signs found. This is not a guarantee. Stay careful.'],medium:['Be careful - some scam signs','Do not click, pay or share anything until you check from the official app or bank.'],high:['High risk - looks like a scam','Do not reply, click or pay. Do not share any code or PIN.']};
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
function run(){
  var r=ScamEngine.analyze(msg.value);
  if(r.empty){msg.focus();return}
  var res=$('res');res.classList.add('show');
  var m=$('meter');m.className='meter lvl-'+(r.level==='medium'?'med':r.level);
  $('ring').style.setProperty('--v',r.score);$('score').textContent=r.score;
  $('verdict').textContent=LV[r.level][0];$('sub').textContent=LV[r.level][1];
  var ul=$('reasons');ul.innerHTML='';
  var tags={h:['h','Strong sign'],m:['m','Warning sign'],l:['l','Note']};
  r.reasons.forEach(function(x){
    var li=document.createElement('li');
    li.innerHTML='<b><span class="tag '+tags[x.l][0]+'">'+tags[x.l][1]+'</span>'+esc(x.t)+'</b><span>'+esc(x.y)+'</span>'+(x.hit?'<br><span>Found: &ldquo;'+esc(String(x.hit).slice(0,90))+'&rdquo;</span>':'');
    ul.appendChild(li);
  });
  r.safeLinks.forEach(function(s){var li=document.createElement('li');li.innerHTML='<b><span class="tag l">Note</span>Link to an official site ('+esc(s.host)+')</b><span>The website name matches a known official site. The message around it can still be fake, so open the app yourself.</span>';ul.appendChild(li)});
  if(!r.reasons.length&&!r.safeLinks.length){var li=document.createElement('li');li.innerHTML='<b>No scam pattern found</b><span>We did not find a link, a request for PIN/OTP, or known scam wording.</span>';ul.appendChild(li)}
  var t=$('todo');
  if(r.level==='low'){t.innerHTML='<b>Still, a quick habit:</b><ul><li>Never share OTP or UPI PIN.</li><li>Open your bank or UPI app yourself to check anything about money.</li></ul>'}
  else{t.innerHTML='<b>What to do now</b><ul><li>Do not click links, install apps or call numbers in this message.</li><li>Never share OTP, card details or UPI PIN.</li><li>Check only in your official bank / UPI app.</li><li>Already paid or shared details? Call <b>1930</b> at once, report at cybercrime.gov.in and tell your bank.</li></ul>'}
  res.scrollIntoView({behavior:'smooth',block:'nearest'});
}
$('go').addEventListener('click',run);
$('clear').addEventListener('click',function(){msg.value='';$('res').classList.remove('show');msg.focus()});
document.querySelectorAll('.chip').forEach(function(c){c.addEventListener('click',function(){msg.value=EX[+c.dataset.ex];run()})});
msg.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='Enter')run()});
if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
})();
