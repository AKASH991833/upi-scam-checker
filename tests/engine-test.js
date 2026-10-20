const E=require('../engine.js');
const scam=[
"Dear customer your SBI YONO account will be blocked today. Update KYC immediately: http://sbi-kyc-update.xyz/login",
"Congratulations! You have won Rs 25,00,000 in KBC lucky draw. Pay Rs 999 processing fee to claim your prize. WhatsApp 9876543210",
"Sir galti se aapke account me 5000 rupay chale gaye. Please return the money. Mai request bhej raha hu approve kar do.",
"I sent Rs 5000 by mistake please send back. Also you will get refund, enter UPI PIN to receive money.",
"Your electricity will be disconnected tonight 9:30 PM. Call officer 9811122233 immediately and update bill via link bit.ly/3xyzAB",
"Install AnyDesk so our executive can help you with your refund.",
"Work from home! Earn Rs 5000 daily just by liking videos. Join our telegram group https://t.me/earnnow",
"Your PhonePe KYC is pending. Download this app: http://phonepe-kyc.top/kyc.apk",
"Share your OTP to confirm cashback of Rs 500 on your Paytm.",
"CBI officer here. A parcel in your name has illegal drugs. You are under digital arrest. Do not tell anyone.",
"Free Rs 2000 reward points will expire today! Claim now http://192.168.4.55/reward",
"आपका बैंक खाता आज बंद हो जाएगा, केवाईसी अपडेट के लिए OTP शेयर करें।",
"Dear user, your SIM will be blocked. Click https://t.ly/aB12 to re-verify Aadhaar.",
"Scan this QR code to receive your refund of Rs 1500.",
"Pay registration fee Rs 10 to release your parcel at customs."
];
const ok=[
"Rs 450.00 debited from A/c XX1234 on 20-10-26 to VPA shop@okaxis (UPI Ref 123456789012). If not you, call bank on number at back of your card.",
"Hi, I will pay you tomorrow evening for the DJ booking. Let me know your UPI ID.",
"Your OTP for login is 456123. Do not share this with anyone.",
"Your Amazon order has been shipped. Track at https://www.amazon.in/orders",
"Dinner at 8? I'll send you my share on GPay.",
"Rs 1,200 received from Ramesh via UPI. Your balance is Rs 5,300.",
"Happy Diwali! Wishing you and your family a wonderful year.",
"Meeting is at 5 PM today. Please bring the invoice copy.",
"Thanks for your payment of Rs 800. Invoice no 1021 attached.",
"Your electricity bill of Rs 1,430 is due on 28 Oct. Pay in the official app or at https://www.tatapower.com"
];
let fn=0,fp=0;
scam.forEach(m=>{const r=E.analyze(m);const hit=r.level!=='low';if(!hit)fn++;console.log((hit?'OK  ':'MISS'),r.score,r.level,'|',m.slice(0,60))});
ok.forEach(m=>{const r=E.analyze(m);const bad=r.level==='high'||r.score>=25;if(bad)fp++;console.log((bad?'FP  ':'OK  '),r.score,r.level,'|',m.slice(0,60),r.reasons.map(x=>x.id))});
console.log('scam missed',fn,'/',scam.length,' false alarms',fp,'/',ok.length);
console.log(JSON.stringify(E.extractLinks("pay at shop@okaxis or visit www.paytm.com and bit.ly/abc, file.txt 3.14")));
