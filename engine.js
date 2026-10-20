(function(root){
'use strict';
var OFFICIAL=['paytm.com','phonepe.com','pay.google.com','google.com','npci.org.in','bhimupi.org.in','sbi.co.in','onlinesbi.sbi','hdfcbank.com','icicibank.com','axisbank.com','kotak.com','pnbindia.in','bankofbaroda.in','canarabank.com','unionbankofindia.co.in','amazon.in','flipkart.com','cybercrime.gov.in','uidai.gov.in','incometax.gov.in','gov.in','nic.in'];
var SHORT=['bit.ly','tinyurl.com','t.co','cutt.ly','rb.gy','is.gd','goo.gl','ow.ly','shorturl.at','tiny.cc','t.ly','bitly.com','rebrand.ly','s.id','v.gd','lnkd.in','wa.link'];
var BADTLD=['xyz','top','click','live','icu','vip','buzz','site','online','cfd','sbs','rest','monster','cyou','work','link','info','shop','store','fun','today','life','ink','pw','cc','tk','ml','ga','cf','gq'];
var BRANDS=['paytm','phonepe','gpay','googlepay','bhim','npci','sbi','hdfc','icici','axis','kotak','pnb','upi','kyc','aadhaar','aadhar','amazon','flipkart','jio','airtel','bank','refund','reward'];

// each rule: id, weight, level (h/m/l), title, why, test(textLower,text) -> bool
var RULES=[
 {id:'pin',w:45,l:'h',t:'Asks for your UPI PIN',y:'You never need to enter your UPI PIN to RECEIVE money. PIN is only for sending. Anyone asking for it is a scammer.',
  re:/\b(upi\s*)?pin\b[^.\n]{0,12}(dalo|daalo|dal do|enter|share|batao|bhejo|type)|(enter|share|send|dalo|daalo|batao|bata do|bhejo|type)[^.\n]{0,40}(upi\s*pin|\bpin\b)|(upi\s*pin|\bpin\b)[^.\n]{0,30}(to receive|to get|receive|refund|claim|share|batao|bhejo)/i},
 {id:'otp',w:40,l:'h',t:'Asks for OTP, CVV, card number or password',y:'Banks and UPI apps never ask you to share OTP, CVV, card number or password with anyone.',
  re:/(ओटीपी|पिन)[^.\n]{0,30}(शेयर|बताएं|बताओ|भेजें|दें)|(शेयर|बताएं|बताओ|भेजें)[^.\n]{0,30}(ओटीपी|पिन)|(share|send|give|tell|batao|bata do|bhejo|dena|enter)[^.\n]{0,35}(otp|cvv|card\s*number|card no|password|atm pin|expiry|passcode)|(otp|cvv)[^.\n]{0,25}(share|send|batao|bhejo)/i},
 {id:'remote',w:45,l:'h',t:'Asks you to install a remote-control app',y:'AnyDesk, TeamViewer, QuickSupport and similar apps let a stranger see and control your phone, including your payment apps.',
  re:/anydesk|team\s*viewer|quick\s*support|rustdesk|screen\s*share|screen\s*shar/i},
 {id:'apk',w:40,l:'h',t:'Asks you to install an APK or unknown app',y:'Real banks and UPI apps come from Play Store or App Store only. An APK sent in a message can steal SMS and money.',
  re:/\.apk\b|install (this|the) (app|apk)|download (this|the) (app|apk)|apk file/i},
 {id:'collect',w:30,l:'h',t:'Asks you to approve a payment request to receive money',y:'Receiving money never needs your approval. If you "accept" or "approve" a collect request, money goes OUT of your account.',
  re:/\b(request|collect)[^.\n]{0,45}\b(approve|accept)\b|\bapprove (kar|karo|kijiye)\b|(approve|accept|confirm|allow)[^.\n]{0,40}(request|collect)[^.\n]{0,60}(receive|refund|prize|reward|cashback|money|amount)|(collect|payment)\s*request[^.\n]{0,60}(approve|accept)|scan[^.\n]{0,25}(qr)[^.\n]{0,40}(receive|refund|get money|prize)/i},
 {id:'kyc',w:32,l:'h',t:'Fake KYC, account block or SIM block warning',y:'Scammers say your account, SIM, wallet or electricity will be blocked unless you do "KYC" through a link or number. Banks do not do this over SMS or WhatsApp links.',
  re:/(kyc|re-?kyc|pan|aadhaar|aadhar)[^.\n]{0,60}(expire|expired|update|pending|verify|blocked|suspend|incomplete|mandatory)|(account|wallet|sim|upi|card|paytm|phonepe|gpay)[^.\n]{0,50}(block|blocked|suspend|suspended|deactivat|freeze|frozen|close[d]?)|(electricity|bijli)[^.\n]{0,40}(disconnect|cut|kat)|(केवाईसी|खाता|अकाउंट|सिम)[^.\n]{0,50}(बंद|ब्लॉक|अपडेट|एक्सपायर|सस्पेंड)/i},
 {id:'prize',w:28,l:'h',t:'Prize, lottery or cashback you did not ask for',y:'You cannot win a contest you never joined. "You won" messages ask for a fee or your details next.',
  re:/(you (have )?won|congratulations|lucky (draw|winner|customer)|lottery|kbc|jackpot|scratch card|gift card|reward points?|cashback of|claim your (prize|reward|gift)|jeet gaye|inaam)/i},
 {id:'refund',w:25,l:'h',t:'"Sent by mistake" or refund trick',y:'A common trick: someone sends you money, then asks you to return it, or says you will get a refund if you click or scan something.',
  re:/(sent|transferred|paid)[^.\n]{0,30}(by mistake|wrongly|galti se|wrong number)|(please|pls|kindly)[^.\n]{0,20}(return|refund|send back)[^.\n]{0,20}(money|amount|rs|\u20b9)|galti se[^.\n]{0,30}(paise|money|amount)|refund[^.\n]{0,60}(click|link|scan|approve|pin)/i},
 {id:'job',w:25,l:'h',t:'Easy-money job, task or investment offer',y:'"Like videos and earn", "work from home Rs 5000/day", "double your money", and group-join offers are very common frauds.',
  re:/(earn|income|kamao|kamaye)[^.\n]{0,25}(daily|per day|every day|\u20b9|rs\.?\s*\d|lakh|rozana)|work from home|part[- ]?time job|like (and )?(share|subscribe)|double (your )?money|guaranteed (return|profit)|task[- ]based|join (our|my|the) (telegram|whatsapp)[^.\n]{0,20}(group|channel)|(investment|trading)[^.\n]{0,25}(profit|return)[^.\n]{0,15}(daily|guarantee|100%)/i},
 {id:'authority',w:22,l:'h',t:'Pretends to be police, CBI, customs, TRAI or a courier',y:'"Digital arrest", parcel with drugs, SIM misuse, fake FedEx/customs calls are scams. Real police never ask for money on video call.',
  re:/digital arrest|\bcbi\b|narcotics|customs (officer|department)|fedex|trai\b|cyber ?crime (department|branch|police)|arrest warrant|parcel[^.\n]{0,40}(seized|illegal|drugs|held)|money laundering/i},
 {id:'urgent',w:12,l:'m',t:'Pressure to act very fast',y:'Scammers rush you so you do not think. Real banks give time and use official channels.',
  re:/(immediately|urgent|urgently|right now|within\s*\d+\s*(hours?|hrs?|minutes?|mins?)|today only|last (chance|warning|date)|turant|abhi|jaldi|aaj hi|expire[sd]? today|final notice|act now)/i},
 {id:'fee',w:20,l:'h',t:'Asks you to pay a small fee first',y:'"Pay Rs 10 to verify" or a "processing fee" before you get a prize, loan or refund is how the scam steals money and card data.',
  re:/(processing|registration|verification|delivery|release|clearance|security) (fee|charge|amount|deposit)|pay (a )?(small|nominal)|pay (rs\.?|\u20b9)\s*\d+[^.\n]{0,25}(verify|verification|receive|claim|release)/i},
 {id:'fakeapp',w:15,l:'m',t:'Sounds like your bank or UPI app, but is not from it',y:'Scam messages copy names like SBI, Paytm or PhonePe. Check the app itself, not the message.',
  re:/\b(dear (customer|user|sir|madam)|respected customer|valued customer|dear \w+ bank)\b/i},
 {id:'helpline',w:12,l:'m',t:'Gives a "customer care" number inside the message',y:'Scammers put fake helpline numbers in messages and Google results. Use the number printed on your card or in the official app.',
  re:/(call|contact|whatsapp|dial)[^.\n]{0,30}(customer care|helpline|support|toll[- ]?free|officer|agent)[^.\n]{0,30}(\+?91[\s-]?)?[6-9]\d{9}|customer care[^.\n]{0,20}[6-9]\d{9}/i}
];

function hostOf(u){
  try{var x=new URL(/^[a-z]+:\/\//i.test(u)?u:'http://'+u);return {host:x.hostname.toLowerCase(),proto:x.protocol,url:x,raw:u}}catch(e){return null}
}
function extractLinks(text){
  var m=text.match(/(?:https?:\/\/|www\.)[^\s<>"')\]]+|\b[a-z0-9][a-z0-9\-]{1,60}(?:\.[a-z0-9\-]{1,30})*\.(?:[a-z]{2,10})(?:\/[^\s<>"')\]]*)?/gi)||[];
  var out=[],seen={};
  m.forEach(function(s){
    s=s.replace(/[.,;:!?]+$/,'');
    if(/^[\w.\-]+@[\w\-]+$/.test(s))return;           // upi id
    if(/^\d+(\.\d+)*$/.test(s))return;
    if(!/^(https?:\/\/|www\.)/i.test(s)){
      var tld=s.split('/')[0].split('.').pop().toLowerCase();
      if(!/^(com|in|net|org|co|io|me|app|link|xyz|top|click|live|icu|vip|buzz|site|online|cfd|sbs|rest|monster|cyou|work|info|shop|store|fun|today|life|ink|pw|cc|tk|ml|ga|cf|gq|gov|ly|gl|is|to|id|us|uk|bank|upi|apk)$/.test(tld))return;
      if(/\.(txt|jpg|png|pdf|doc)$/i.test(s))return;
    }
    var k=s.toLowerCase();if(!seen[k]){seen[k]=1;out.push(s)}
  });
  return out.slice(0,10);
}
function isOfficial(host){
  return OFFICIAL.some(function(o){return host===o||host.endsWith('.'+o)});
}
function analyzeLink(raw){
  var h=hostOf(raw);if(!h||!h.host||h.host.indexOf('.')<0&&!/^\d+$/.test(h.host))return null;
  var host=h.host,f=[],labels=host.split('.'),tld=labels[labels.length-1];
  var official=isOfficial(host);
  if(official&&!/@/.test(raw)&&!/xn--/.test(host))return {link:raw,host:host,official:true,findings:[]};
  if(/^\d{1,3}(\.\d{1,3}){3}$/.test(host))f.push({w:30,l:'h',t:'Link uses a number address (IP), not a real website name',y:'Real services use proper names. A number address is a red flag.'});
  if(SHORT.indexOf(host)>-1)f.push({w:22,l:'h',t:'Short link hides where it goes',y:'Short links ('+host+') can hide a fake page. Do not open it from an unknown message.'});
  if(/xn--/.test(host))f.push({w:30,l:'h',t:'Look-alike characters in website name',y:'Some letters in this address are not normal English letters. This trick makes a fake site look real.'});
  if(/@/.test(raw.replace(/^[a-z]+:\/\//i,'').split('/')[0]))f.push({w:30,l:'h',t:'Link has "@" before the real website',y:'Everything before "@" is ignored by the browser. The page that opens is a different site.'});
  if(BADTLD.indexOf(tld)>-1)f.push({w:14,l:'m',t:'Website ending ".'+tld+'" is common in scams',y:'Cheap website endings are often used for throw-away scam pages. Banks use .com, .in, .co.in or .bank.in.'});
  var brand=BRANDS.filter(function(b){return host.indexOf(b)>-1});
  if(brand.length)f.push({w:30,l:'h',t:'Website name copies "'+brand[0]+'" but is not the official site',y:'The real '+brand[0]+' website is not '+host+'. Scammers add brand words to look real.'});
  if((host.match(/-/g)||[]).length>=2)f.push({w:10,l:'m',t:'Website name has many dashes',y:'Long names with dashes, like secure-update-bank-kyc.com, are typical of fake pages.'});
  if(labels.length>=5)f.push({w:8,l:'m',t:'Website name has many parts',y:'Many sub-parts can hide the real site name at the end.'});
  if(h.proto==='http:'&&!/^\d/.test(host))f.push({w:6,l:'l',t:'Link is not secure (http)',y:'Real payment pages use https. Not a proof of scam alone.'});
  if(/\.apk(\?|$)/i.test(raw))f.push({w:35,l:'h',t:'Link downloads an app file (APK)',y:'Do not install apps from links. Use Play Store or App Store.'});
  if(!f.length)f.push({w:6,l:'l',t:'Website "'+host+'" is not one we know',y:'It is not in our list of official bank and UPI sites. We cannot judge it. Do not enter payment details on it unless you opened it yourself from the official app or site.'});
  return {link:raw,host:host,official:false,findings:f};
}

function analyze(input){
  var text=String(input||'').slice(0,5000),norm=text.normalize('NFKC');
  var res={score:0,level:'low',reasons:[],links:[],safeLinks:[],empty:!norm.trim()};
  if(res.empty)return res;
  var total=0,reasons=[],matched=[];
  RULES.forEach(function(r){
    var m=norm.match(r.re);
    if(m){reasons.push({id:r.id,l:r.l,t:r.t,y:r.y,w:r.w,hit:m[0]});matched.push(m[0])}
  });
  // links
  extractLinks(norm).forEach(function(lk){
    var a=analyzeLink(lk);if(!a)return;
    if(a.official){res.safeLinks.push(a);return}
    res.links.push(a);
    a.findings.forEach(function(f){reasons.push({id:'link',l:f.l,t:f.t,y:f.y,w:f.w,hit:lk})});
  });
  // combos: money ask + link
  var hasLink=res.links.length>0;
  var ask=/(click|tap|open|visit|login|log in|verify|update|claim|install|download)/i.test(norm);
  if(hasLink&&ask)reasons.push({id:'combo',l:'m',t:'Message pushes you to open a link',y:'Unknown link plus "click / update / claim" is how most phishing starts.',w:10,hit:''});
  // Diminishing sum: sort high->low, each next counts 75% of previous factor
  var ws=reasons.map(function(r){return r.w}).sort(function(a,b){return b-a}),fac=1;
  ws.forEach(function(w){total+=w*fac;fac*=0.8});
  var hi=reasons.filter(function(r){return r.l==='h'}).length;
  total=Math.round(Math.min(100,total));
  // two or more strong signs: at least medium-high
  if(hi>=2)total=Math.max(total,60);
  if(hi===1)total=Math.max(total,30);
  if(reasons.length&&total<8)total=8;
  var order={h:0,m:1,l:2};reasons.sort(function(a,b){return order[a.l]-order[b.l]||b.w-a.w});
  res.score=total;res.reasons=reasons;res.level=total>=55?'high':total>=25?'medium':'low';
  res.matched=matched;
  return res;
}
var api={analyze:analyze,extractLinks:extractLinks,analyzeLink:analyzeLink,RULES:RULES};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ScamEngine=api;
})(typeof self!=='undefined'?self:this);
