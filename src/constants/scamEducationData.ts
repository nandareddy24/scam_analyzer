export interface ScamArticle {
  id: string;
  title: string;
  category: string;
  icon: string;
  severity: 'high' | 'critical' | 'medium';
  summary: string;
  whatIsIt: string;
  howItWorks: string[];
  warningSigns: string[];
  whatNotToDo: string[];
  whatToDoIfTargeted: string[];
}

export const QUICK_SAFETY_RULES = [
  {
    id: 'rule_1',
    icon: 'key-outline',
    title: 'Never Share UPI PIN',
    description: 'UPI PIN is strictly required ONLY to send money out of your account, NEVER to receive money.',
    color: '#EF4444',
  },
  {
    icon: 'lock-closed-outline',
    id: 'rule_2',
    title: 'Never Share OTPs',
    description: 'One-Time Passwords are secret keys to your bank account. Bank officials will NEVER ask for your OTP.',
    color: '#F59E0B',
  },
  {
    icon: 'download-outline',
    id: 'rule_3',
    title: 'Never Install Unknown Apps/APKs',
    description: 'Avoid downloading APKs from SMS or screen-sharing apps like AnyDesk, RustDesk, or TeamViewer.',
    color: '#3B82F6',
  },
  {
    icon: 'hand-against-outline',
    id: 'rule_4',
    title: 'Never Approve Unknown Collect Requests',
    description: 'Reject any notification asking you to "Pay" or enter your PIN to claim cashbacks or refunds.',
    color: '#8B5CF6',
  },
  {
    icon: 'wallet-outline',
    id: 'rule_5',
    title: 'Verify Funds Inside Your Banking App',
    description: 'Always check your account balance directly in your official bank/UPI app before releasing goods.',
    color: '#10B981',
  },
  {
    icon: 'image-outline',
    id: 'rule_6',
    title: 'Do Not Trust Screenshots as Proof',
    description: 'Payment receipts can be easily forged using fake app generators. Independent verification is required.',
    color: '#0EA5E9',
  },
];

export const SCAM_ARTICLES: ScamArticle[] = [
  {
    id: 'scam_kyc',
    title: 'Fake KYC Update Scam',
    category: 'Banking & SIM Traps',
    icon: 'card-outline',
    severity: 'high',
    summary: 'Fraudsters threaten to block your bank account or SIM card unless you complete immediate online KYC.',
    whatIsIt:
      'A scam where fraudsters send urgent SMS or call posing as bank or telecom officials, warning that your account or SIM card will be blocked within 24 hours due to pending KYC.',
    howItWorks: [
      'Scammers send SMS with urgent threats: "Your account will be suspended today."',
      'They provide a phishing link or ask you to call an unverified mobile number.',
      'The link opens a fake bank website designed to capture your login password, card number, and OTP.',
      'Alternatively, they instruct you to download screen-sharing apps (AnyDesk) to steal money.',
    ],
    warningSigns: [
      'Urgent threats of immediate account/SIM blocking within 2 hours or 24 hours.',
      'SMS coming from non-official 10-digit mobile numbers instead of official bank headers (e.g. AD-SBIBNK).',
      'Links pointing to unofficial domains (.xyz, .top, .site, or http:// websites).',
    ],
    whatNotToDo: [
      'Do NOT click any web links embedded in KYC threat messages.',
      'Do NOT share your Aadhaar, PAN, card numbers, or OTP on phone calls.',
      'Do NOT download remote desktop screen-sharing apps like AnyDesk or TeamViewer.',
    ],
    whatToDoIfTargeted: [
      'Contact your official bank branch directly or call the toll-free number on your bank debit card.',
      'Report the phishing number to Cyber Helpline 1930.',
      'Block the sender number immediately on your phone.',
    ],
  },
  {
    id: 'scam_digital_arrest',
    title: 'Digital Arrest Scam',
    category: 'Extortion & Impersonation',
    icon: 'videocam-outline',
    severity: 'critical',
    summary: 'Scammers pose as CBI, Police, or Customs officers over video call, threatening illegal parcel arrest warrants.',
    whatIsIt:
      'A cyber extortion tactic where scammers impersonate law enforcement agencies (CBI, Police, Customs, ED) over WhatsApp video calls, claiming your name is linked to illegal narcotics or money laundering.',
    howItWorks: [
      'You receive an IVR call stating a parcel containing illegal drugs/passports in your name has been seized.',
      'The call transfers to fake officers wearing police uniforms on Skype or WhatsApp video call.',
      'They show fake arrest warrants and intimidate you into a "Digital Arrest" (keeping camera on continuously).',
      'They demand money transfers to "govt verification accounts" to cancel the warrant.',
    ],
    warningSigns: [
      'Demands to stay on continuous video call in a locked room ("Digital Arrest").',
      'Displaying fake court orders, CBI logos, or police badges over WhatsApp.',
      'Requests to transfer funds to private bank accounts for "secret security clearance".',
    ],
    whatNotToDo: [
      'Do NOT panic. Indian Law Enforcement NEVER conducts "Digital Arrests" or video call interrogations.',
      'Do NOT transfer any money to clear fictitious warrants.',
      'Do NOT share personal photos, IDs, or family details.',
    ],
    whatToDoIfTargeted: [
      'Disconnect the video call immediately.',
      'File a report at once on National Cyber Crime Portal (www.cybercrime.gov.in) or call 1930.',
      'Inform your nearest local police station.',
    ],
  },
  {
    id: 'scam_cashback',
    title: 'Cashback & Scratch Card Scam',
    category: 'UPI Traps',
    icon: 'gift-outline',
    severity: 'medium',
    summary: 'Fake scratch cards or cashback rewards that ask you to enter your UPI PIN to receive money.',
    whatIsIt:
      'A trap where scammers send web links or pop-ups promising Rs 500 - Rs 5,000 cashbacks on Paytm, PhonePe, or Google Pay.',
    howItWorks: [
      'You receive a link promising "Congratulations! You won Rs 2,500 cashback!"',
      'Clicking the link opens a fake page mimicking GPay or PhonePe with a "Pay" button.',
      'When you tap "Pay", your UPI app opens and prompts for your 6-digit UPI PIN.',
      'The moment you enter your PIN, money is debited from your account instead of credited.',
    ],
    warningSigns: [
      'Promising instant cash rewards for doing nothing.',
      'Buttons asking you to enter your UPI PIN to "receive" or "accept" payment.',
      'Unsolicited links shared via SMS, WhatsApp, or Telegram.',
    ],
    whatNotToDo: [
      'NEVER enter your UPI PIN to receive money. UPI PIN is ONLY used to DEDUCT money.',
      'Do NOT click on unverified scratch card links.',
    ],
    whatToDoIfTargeted: [
      'Cancel the request immediately if prompted for UPI PIN.',
      'Report the merchant UPI VPA in your payment app.',
    ],
  },
  {
    id: 'scam_lottery',
    title: 'Lottery & KBC Lucky Draw Scam',
    category: 'Financial Impersonation',
    icon: 'trophy-outline',
    severity: 'high',
    summary: 'Fake messages claiming you won Rs 25 Lakhs in KBC or lottery, requiring advance fees to release prizes.',
    whatIsIt:
      'Fraudulent claims that your phone number won millions in a lottery (like KBC Lucky Draw), requiring advance tax or processing fees.',
    howItWorks: [
      'You receive an audio message or WhatsApp banner featuring KBC logos claiming you won Rs 25 Lakhs.',
      'They instruct you to call a fake "KBC Manager" on WhatsApp.',
      'The manager demands Rs 10,000 to Rs 50,000 as "GST", "Govt Processing Fee", or "RBI Clearance Charge".',
      'Once you pay the advance fee, they block your number and disappear.',
    ],
    warningSigns: [
      'Winning a lottery you never bought a ticket for.',
      'Demands for advance processing fees or GST before releasing prize money.',
      'WhatsApp calls with international codes (+92, +91) using fake celebrity posters.',
    ],
    whatNotToDo: [
      'Do NOT pay any advance fees to claim prizes.',
      'Do NOT believe lottery claims for competitions you never participated in.',
    ],
    whatToDoIfTargeted: [
      'Ignore and block the WhatsApp sender.',
      'Report the fraud number on cybercrime.gov.in.',
    ],
  },
  {
    id: 'scam_job',
    title: 'Part-Time Job & YouTube Like Scam',
    category: 'Work From Home Traps',
    icon: 'briefcase-outline',
    severity: 'high',
    summary: 'Offers to earn Rs 5,000/day by liking YouTube videos or writing Google reviews, ending in task investment fraud.',
    whatIsIt:
      'Work-from-home fraud promising daily income for completing simple online tasks, which turns into a high-loss crypto or investment trap.',
    howItWorks: [
      'You get a Telegram message: "Earn Rs 3,000/day by simply liking YouTube videos."',
      'Initially, they pay you small sums (Rs 150 - Rs 500) to build trust.',
      'They invite you to a "VIP Telegram Group" and introduce "Paid Prepaid Tasks" requiring investments.',
      'You deposit Rs 10,000, but when you attempt to withdraw profits, they demand higher tax payments and freeze your funds.',
    ],
    warningSigns: [
      'Unbelievably high daily pay for trivial tasks like liking videos.',
      'Requirement to deposit your own money ("prepaid task") to earn returns.',
      'Communication strictly handled over Telegram or WhatsApp groups.',
    ],
    whatNotToDo: [
      'Do NOT pay money to get a job or task payout.',
      'Do NOT invest in unverified Telegram task schemes.',
    ],
    whatToDoIfTargeted: [
      'Stop transferring funds immediately.',
      'Report the bank transaction to your bank & Cyber Helpline 1930.',
    ],
  },
  {
    id: 'scam_customer_care',
    title: 'Fake Customer-Care Helpline Scam',
    category: 'Search Engine Traps',
    icon: 'headset-outline',
    severity: 'high',
    summary: 'Fake customer service numbers listed on Google Search that instruct users to download screen-sharing apps.',
    whatIsIt:
      'Fraudulent mobile numbers indexed on Google or social media pretending to be official support lines for banks, Amazon, Swiggy, or airlines.',
    howItWorks: [
      'When searching for helpline numbers on Google, you dial a fraud number listed on fake blogs.',
      'The scammer answers as official support and claims to process your refund or complaint.',
      'They instruct you to download AnyDesk or TeamViewer QuickSupport on your mobile phone.',
      'They view your 9-digit remote access code, view your phone screen, and steal bank OTPs in real-time.',
    ],
    warningSigns: [
      'Helpline numbers listed as 10-digit mobile numbers (e.g. 9876543210) instead of official 1800 toll-free lines.',
      'Agent forcing you to install remote access apps (AnyDesk, TeamViewer).',
      'Requests to make a Rs 5 or Rs 10 test payment to receive a refund.',
    ],
    whatNotToDo: [
      'NEVER install AnyDesk, TeamViewer, or screen-sharing software on request of a helpline agent.',
      'Do NOT trust phone numbers found in Google Search ads or blog comments.',
    ],
    whatToDoIfTargeted: [
      'Uninstall the remote app immediately and turn off Wi-Fi/Mobile Data.',
      'Freeze your bank account immediately by calling your bank branch.',
    ],
  },
  {
    id: 'scam_qr_code',
    title: 'QR Code Scam',
    category: 'Marketplace & Olx Traps',
    icon: 'qr-code-outline',
    severity: 'medium',
    summary: 'Scammers sending QR codes claiming scanning it will credit money to your bank account.',
    whatIsIt:
      'A trick used on OLX, Facebook Marketplace, or shop payments where buyers send you a QR code claiming "Scan to receive payment".',
    howItWorks: [
      'You list an item for sale online. A scammer contacts you, agreeing to buy it immediately.',
      'They claim: "I am sending a QR code. Scan it on GPay to receive the advance payment."',
      'When you scan the QR code, the app displays a "PAY" screen and prompts for your UPI PIN.',
      'Entering your PIN transfers money FROM your account to the scammer.',
    ],
    warningSigns: [
      'Buyer insisting that you MUST scan a QR code to receive money.',
      'Scanning a QR code that opens a PIN entry screen on your phone.',
    ],
    whatNotToDo: [
      'NEVER scan a QR code to RECEIVE money. QR codes are ONLY used to PAY money.',
    ],
    whatToDoIfTargeted: [
      'Refuse to scan QR codes for receiving funds.',
      'Report the buyer profile on OLX/Marketplace.',
    ],
  },
  {
    id: 'scam_upi_collect',
    title: 'UPI Collect-Request Scam',
    category: 'UPI Traps',
    icon: 'at-circle-outline',
    severity: 'high',
    summary: 'Push notifications requesting money transfer disguised as incoming credits.',
    whatIsIt:
      'Exploiting the UPI "Collect Money" feature where scammers send payment requests with deceptive notes like "Ref: Rs 5,000 Credit Approved".',
    howItWorks: [
      'The scammer triggers a collect request to your VPA.',
      'You receive a push notification in your UPI app: "X is requesting Rs 5,000".',
      'The note attached says "Click Approve to Receive Rs 5000 refund".',
      'Tapping approve and entering your PIN transfers your money out.',
    ],
    warningSigns: [
      'Receiving "Collect Money" notifications from unknown handles.',
      'Notes claiming that approving a request will credit your account.',
    ],
    whatNotToDo: [
      'Do NOT approve collect requests from unknown VPAs.',
      'Do NOT enter your PIN on collect requests.',
    ],
    whatToDoIfTargeted: [
      'Decline and block the VPA handle immediately inside your UPI app.',
    ],
  },
  {
    id: 'scam_phishing_url',
    title: 'Phishing Links & Spoofed Websites',
    category: 'Web Security',
    icon: 'globe-outline',
    severity: 'high',
    summary: 'Fake banking or reward websites designed to harvest netbanking passwords and OTPs.',
    whatIsIt:
      'Exact visual copies of official bank login portals or utility payment sites created to steal your credentials.',
    howItWorks: [
      'You receive an SMS with a link: "http://sbi-reward-points.top".',
      'The page looks identical to SBI YONO login.',
      'You enter your Username, Password, Profile Password, and OTP.',
      'Scammers receive your details in real time and drain your account.',
    ],
    warningSigns: [
      'Domain name anomalies (e.g. sbi-bank.top instead of sbi.co.in).',
      'Unencrypted HTTP connections without the HTTPS padlock icon.',
      'Links shortened via bit.ly or tinyurl.',
    ],
    whatNotToDo: [
      'Do NOT enter passwords or OTPs on links received via SMS.',
      'Do NOT log in to bank portals over public Wi-Fi.',
    ],
    whatToDoIfTargeted: [
      'Change your netbanking password immediately.',
      'Notify your bank internet banking division.',
    ],
  },
  {
    id: 'scam_screenshot',
    title: 'Fake Payment Screenshot Scam',
    category: 'Merchant & Retail Traps',
    icon: 'image-outline',
    severity: 'medium',
    summary: 'Fake receipt images generated using spoof apps to trick merchants into releasing goods without payment.',
    whatIsIt:
      'Using smartphone apps (FakePay, Spoof GPay) to generate fake "Payment Successful" screenshots with custom payee names and amounts.',
    howItWorks: [
      'A buyer purchases goods at a store or online.',
      'They show a screenshot or phone screen displaying "Rs 5,000 Paid to Your Store - Success".',
      'They urge you to check the screen quickly and leave with the items.',
      'When you check your bank account later, no actual money was received.',
    ],
    warningSigns: [
      'Customer refusing to wait for your SMS/Bank app confirmation sound (SoundBox).',
      'Font misalignment or subtle color mismatch on the screenshot.',
      'Missing genuine transaction reference numbers (RRN/UTR).',
    ],
    whatNotToDo: [
      'Do NOT rely on screenshots or customer phone screens as proof of payment.',
    ],
    whatToDoIfTargeted: [
      'Check your official merchant app or bank notification soundbox.',
      'Never release items until incoming credit is reflected in your bank statement.',
    ],
  },
];
