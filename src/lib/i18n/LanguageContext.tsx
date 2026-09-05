'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'gu';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  en: {
    gov_header: "Government of Gujarat • Labour, Skill Development & Employment Dept.",
    official_portal: "Smart Governance Portal",
    worker_login: "Worker Login",
    admin_login: "Department Admin Login",
    hero_title: "ShramikSetu AI: Empowering India's Workforce",
    hero_subtitle: "A unified digital ecosystem bridging migrant workers, labor contractors, and welfare administrators through deterministic AI, voice accessibility, and verified skill mapping.",
    get_started: "Get Started",
    features: "AI Features",
    how_it_works: "How it Works",
    privacy: "Privacy & Compliance",
    portals: "Portals",
    highlights: "Gujarat Highlights",

    tagline: "National Social Governance & Labor Empowerment Initiative",
    judge_hub_badge: "Unified Portal Access Hub",
    select_portal_role: "Select Portal Role to Access",
    select_portal_desc: "Select any portal role below to access dedicated platform features.",

    role1_badge: "ROLE 1 • INFORMAL WORKER",
    worker_portal_title: "Worker Portal",
    worker_portal_desc: "Voice Speech-to-Text in Hindi & Gujarati, AI Welfare Scheme Eligibility Check, Job Offer Notifications & 1-Click Application, Emergency Helplines.",
    enter_worker_dash: "Enter Worker Dashboard",

    role2_badge: "ROLE 2 • LABOR CONTRACTOR",
    contractor_portal_title: "Contractor Portal",
    contractor_portal_desc: "Search Privacy-Masked Workers by District & Skill, Broadcast Jobs to Eligible Workers, View Application History & Direct Contact Info.",
    enter_contractor_dash: "Enter Contractor Portal",

    role3_badge: "ROLE 3 • GOVT ADMINISTRATOR",
    admin_portal_title: "Admin Command Center",
    admin_portal_desc: "Multi-Graph Risk & Wage Analytics, Worker Directory & Direct Messaging, e-Nyay Grievance Resolution, Job Market Takedown Oversight.",
    enter_admin_dash: "Enter Admin Command Center",

    slide1_tag: "Proud Gujarat Heritage",
    slide1_title: "Vibrant Gujarat: Industrial Excellence & Growth",
    slide1_subtitle: "Empowering millions of migrant laborers driving India's fastest-growing industrial state.",

    slide2_tag: "Government Welfare Engine",
    slide2_title: "Shramik Annapurna & Welfare Schemes",
    slide2_subtitle: "Direct access to subsidized meals, housing, insurance, and medical safety for construction workers.",

    slide3_tag: "Smart Governance",
    slide3_title: "AI-Powered Skill Passport & Verification",
    slide3_subtitle: "Verifying craftsmanship and connecting skilled artisans directly with verified contractors.",

    slide4_tag: "Worker Protection",
    slide4_title: "e-Nyay Direct Grievance Redressal",
    slide4_subtitle: "Zero-barrier voice reporting in Hindi & Gujarati ensuring minimum wage & fair labor rights.",

    skill_passport_title: "Portable Digital Skill Passport",
    skill_passport_desc: "Move between contractors and districts without losing your work history. Your verified skills, experience, and certifications are securely stored and easily shareable.",
    ai_engine_title: "Deterministic AI Engine",
    ai_engine_desc: "Our AI understands native voice speech in Hindi and Gujarati, processing user input reliably to evaluate welfare scheme eligibility with 100% precision.",
    privacy_title: "Responsible AI & Privacy Protection",
    privacy_desc: "Worker data is strictly compartmentalized. Contractor search uses data masking to prevent unauthorized contact while allowing transparent skill discovery.",

    email_label: "Email Address",
    password_label: "Password",
    sign_in: "Sign In",
    login_title: "Sign in to your account",
    dashboard: "Worker Dashboard",
    welfare: "Check Welfare Schemes",
    wage_check: "Minimum Wage Check",
    grievance: "Grievance Portal (e-Nyay)"
  },
  hi: {
    gov_header: "गुजरात सरकार • श्रम, कौशल विकास और रोजगार विभाग",
    official_portal: "स्मार्ट सुशासन पोर्टल",
    worker_login: "श्रमिक लॉगिन",
    admin_login: "विभागीय एडमिन लॉगिन",
    hero_title: "श्रमिकसेतु AI: भारत के कार्यबल का सशक्तिकरण",
    hero_subtitle: "निश्चित AI, वॉयस एक्सेसिबिलिटी और सत्यापित कौशल मैपिंग के माध्यम से प्रवासी श्रमिकों, श्रम ठेकेदारों और कल्याण प्रशासकों को जोड़ने वाला एक एकीकृत डिजिटल पारिस्थितिकी तंत्र।",
    get_started: "शुरू करें",
    features: "AI विशेषताएं",
    how_it_works: "यह कैसे काम करता है",
    privacy: "गोपनीयता और अनुपालन",
    portals: "पोर्टल",
    highlights: "गुजरात की मुख्य विशेषताएं",

    tagline: "राष्ट्रीय सामाजिक शासन और श्रम सशक्तिकरण पहल",
    judge_hub_badge: "एकीकृत पोर्टल एक्सेस हब",
    select_portal_role: "पहुंचने के लिए पोर्टल भूमिका चुनें",
    select_portal_desc: "समर्पित प्लेटफॉर्म सुविधाओं तक पहुंचने के लिए नीचे दिए गए किसी भी पोर्टल की भूमिका चुनें।",

    role1_badge: "भूमिका 1 • असंगठित श्रमिक",
    worker_portal_title: "श्रमिक पोर्टल",
    worker_portal_desc: "हिंदी और गुजराती में वॉयस स्पीच-टू-टेक्स्ट, AI कल्याण योजना पात्रता जांच, नौकरी की पेशकश सूचनाएं और 1-क्लिक आवेदन, आपातकालीन हेल्पलाइन।",
    enter_worker_dash: "श्रमिक डैशबोर्ड में प्रवेश करें",

    role2_badge: "भूमिका 2 • श्रम ठेकेदार",
    contractor_portal_title: "ठेकेदार पोर्टल",
    contractor_portal_desc: "जिले और कौशल द्वारा गोपनीयता-संरक्षित श्रमिकों की खोज करें, योग्य श्रमिकों को नौकरियां प्रसारित करें, आवेदन इतिहास और प्रत्यक्ष संपर्क जानकारी देखें।",
    enter_contractor_dash: "ठेकेदार पोर्टल में प्रवेश करें",

    role3_badge: "भूमिका 3 • सरकारी प्रशासक",
    admin_portal_title: "एडमिन कमांड सेंटर",
    admin_portal_desc: "मल्टी-ग्राफ जोखिम और मजदूरी विश्लेषण, श्रमिक निर्देशिका और सीधा संदेश, ई-न्याय शिकायत निवारण, जॉब मार्केट ओवरसाइट।",
    enter_admin_dash: "एडमिन कमांड सेंटर में प्रवेश करें",

    slide1_tag: "गर्वित गुजरात विरासत",
    slide1_title: "वाइब्रेंट गुजरात: औद्योगिक उत्कृष्टता और विकास",
    slide1_subtitle: "भारत के सबसे तेजी से बढ़ते औद्योगिक राज्य को चलाने वाले लाखों प्रवासी श्रमिकों को सशक्त बनाना।",

    slide2_tag: "सरकारी कल्याण इंजन",
    slide2_title: "श्रमिक अन्नपूर्णा और कल्याणकारी योजनाएं",
    slide2_subtitle: "निर्माण श्रमिकों के लिए रियायती भोजन, आवास, बीमा और चिकित्सा सुरक्षा तक सीधी पहुंच।",

    slide3_tag: "स्मार्ट शासन",
    slide3_title: "AI-संचालित कौशल पासपोर्ट और सत्यापन",
    slide3_subtitle: "कारीगरी का सत्यापन करना और कुशल कारीगरों को सीधे सत्यापित ठेकेदारों से जोड़ना।",

    slide4_tag: "श्रमिक सुरक्षा",
    slide4_title: "ई-न्याय प्रत्यक्ष शिकायत निवारण",
    slide4_subtitle: "हिंदी और गुजराती में शून्य-बाधा वॉयस रिपोर्टिंग न्यूनतम मजदूरी और निष्पक्ष श्रम अधिकार सुनिश्चित करती है।",

    skill_passport_title: "पोर्टेबल डिजिटल कौशल पासपोर्ट",
    skill_passport_desc: "अपने कार्य इतिहास को खोए बिना ठेकेदारों और जिलों के बीच जाएं। आपके सत्यापित कौशल, अनुभव और प्रमाणन सुरक्षित रूप से संग्रहीत हैं और आसानी से साझा करने योग्य हैं।",
    ai_engine_title: "निश्चित AI इंजन",
    ai_engine_desc: "हमारा AI हिंदी और गुजराती में मूल वॉयस स्पीच को समझता है, 100% सटीकता के साथ कल्याणकारी योजना पात्रता का मूल्यांकन करने के लिए उपयोगकर्ता इनपुट को मज़बूती से संसाधित करता है।",
    privacy_title: "जिम्मेदार AI और गोपनीयता सुरक्षा",
    privacy_desc: "श्रमिक डेटा को सख्ती से अलग रखा गया है। ठेकेदार खोज अनधिकृत संपर्क को रोकने के लिए डेटा मास्किंग का उपयोग करती है।",

    email_label: "ईमेल पता",
    password_label: "पासवर्ड",
    sign_in: "साइन इन करें",
    login_title: "अपने खाते में साइन इन करें",
    dashboard: "श्रमिक डैशबोर्ड",
    welfare: "कल्याणकारी योजनाएं जांचें",
    wage_check: "न्यूनतम मजदूरी जांच",
    grievance: "शिकायत पोर्टल (ई-न्याय)"
  },
  gu: {
    gov_header: "ગુજરાત સરકાર • શ્રમ, કૌશલ્ય વિકાસ અને રોજગાર વિભાગ",
    official_portal: "સ્માર્ટ સુશાસન પોર્ટલ",
    worker_login: "શ્રમિક લૉગિન",
    admin_login: "વિભાગીય એડમિન લૉગિન",
    hero_title: "શ્રમિકસેતુ AI: ભારતના કાર્યબળનું સશક્તિકરણ",
    hero_subtitle: "નિશ્ચિત AI, વોઇસ એક્સેસિબિલિટી અને ચકાસાયેલ કૌશલ્ય મેપિંગ દ્વારા સ્થળાંતરિત કામદારો, શ્રમ કોન્ટ્રાક્ટરો અને કલ્યાણ સંચાલકોને જોડતી એકીકૃત ડિજિટલ ઇકોસિસ્ટમ.",
    get_started: "શરૂ કરો",
    features: "AI વિશેષતાઓ",
    how_it_works: "તે કેવી રીતે કામ કરે છે",
    privacy: "ગોપનીયતા અને પાલન",
    portals: "પોર્ટલ",
    highlights: "ગુજરાતના મુખ્ય આકર્ષણો",

    tagline: "રાષ્ટ્રીય સામાજિક શાસન અને શ્રમ સશક્તિકરણ પહેલ",
    judge_hub_badge: "એકીકૃત પોર્ટલ ઍક્સેસ હબ",
    select_portal_role: "ઉપયોગ કરવા માટે પોર્ટલ ભૂમિકા પસંદ કરો",
    select_portal_desc: "સમર્પિત પ્લેટફોર્મ સુવિધાઓનો ઉપયોગ કરવા માટે નીચેનામાંથી કોઈપણ પોર્ટલ ભૂમિકા પસંદ કરો.",

    role1_badge: "ભૂમિકા 1 • અસંગઠિત શ્રમિક",
    worker_portal_title: "શ્રમિક પોર્ટલ",
    worker_portal_desc: "હિન્દી અને ગુજરાતીમાં વોઇસ સ્પીચ-ટુ-ટેક્સ્ટ, AI કલ્યાણકારી યોજના પાત્રતા તપાસ, જોબ ઑફર સૂચનાઓ અને 1-ક્લિક અરજી, ઇમરજન્સી હેલ્પલાઇન.",
    enter_worker_dash: "શ્રમિક ડેશબોર્ડમાં પ્રવેશ કરો",

    role2_badge: "ભૂમિકા 2 • શ્રમ કોન્ટ્રાક્ટર",
    contractor_portal_title: "કોન્ટ્રાક્ટર પોર્ટલ",
    contractor_portal_desc: "જિલ્લા અને કૌશલ્ય દ્વારા ગોપનીયતા-સુરક્ષિત શ્રમિકો શોધો, પાત્ર શ્રમિકોને નોકરીઓ પ્રસારિત કરો, અરજીનો ઇતિહાસ અને સીધો સંપર્ક જુઓ.",
    enter_contractor_dash: "કોન્ટ્રાક્ટર પોર્ટલમાં પ્રવેશ કરો",

    role3_badge: "ભૂમિકા 3 • સરકારી સંચાલક",
    admin_portal_title: "એડમિન કમાન્ડ સેન્ટર",
    admin_portal_desc: "મલ્ટી-ગ્રાફ જોખમ અને વેતન વિશ્લેષણ, શ્રમિક ડિરેક્ટરી અને સીધો સંદેશ, ઇ-ન્યાય ફરિયાદ નિવારણ, જોબ માર્કેટ ઓવરસાઇટ.",
    enter_admin_dash: "એડમિન કમાન્ડ સેન્ટરમાં પ્રવેશ કરો",

    slide1_tag: "ગૌરવશાળી ગુજરાત વારસો",
    slide1_title: "વાઇબ્રન્ટ ગુજરાત: ઔદ્યોગિક શ્રેષ્ઠતા અને વિકાસ",
    slide1_subtitle: "ભારતના સૌથી ઝડપથી વિકસતા ઔદ્યોગિક રાજ્યને આગળ ધપાવતા લાખો સ્થળાંતરિત કામદારોને સશક્ત બનાવવું.",

    slide2_tag: "સરકારી કલ્યાણ એન્જિન",
    slide2_title: "શ્રમિક અન્નપૂર્ણા અને કલ્યાણકારી યોજનાઓ",
    slide2_subtitle: "બાંધકામ કામદારો માટે સબસીડીવાળા ભોજન, આવાસ, વીમા અને તબીબી સુરક્ષાની સીધી ઍક્સેસ.",

    slide3_tag: "સ્માર્ટ સુશાસન",
    slide3_title: "AI-સંચાલિત કૌશલ્ય પાસપોર્ટ અને ચકાસણી",
    slide3_subtitle: "કારીગરીની ચકાસણી કરવી અને કુશળ કારીગરોને ચકાસાયેલ કોન્ટ્રાક્ટરો સાથે સીધા જોડવા.",

    slide4_tag: "શ્રમિક સુરક્ષા",
    slide4_title: "ઇ-ન્યાય સીધું ફરિયાદ નિવારણ",
    slide4_subtitle: "હિન્દી અને ગુજરાતીમાં શૂન્ય-અવરોધ વોઇસ રિપોર્ટિંગ લઘુત્તમ વેતન અને ન્યાયી શ્રમ અધિકારો સુનિશ્ચિત કરે છે.",

    skill_passport_title: "પોર્ટેબલ ડિજિટલ કૌશલ્ય પાસપોર્ટ",
    skill_passport_desc: "તમારા કાર્ય ઇતિહાસને ગુમાવ્યા વિના કોન્ટ્રાક્ટરો અને જિલ્લાઓ વચ્ચે જાઓ. તમારી ચકાસાયેલ કુશળતા, અનુભવ અને પ્રમાણપત્રો સુરક્ષિત રીતે સંગ્રહિત છે અને સરળતાથી શેર કરી શકાય છે.",
    ai_engine_title: "ચોક્કસ AI એન્જિન",
    ai_engine_desc: "અમારું AI હિન્દી અને ગુજરાતીમાં સ્થાનિક વોઇસ સ્પીચ સમજે છે, 100% ચોકસાઈ સાથે કલ્યાણકારી યોજનાની પાત્રતાનું મૂલ્યાંકન કરવા માટે વપરાશકર્તા ઇનપુટ પર પ્રક્રિયા કરે છે.",
    privacy_title: "જવાબદાર AI અને ગોપનીયતા સુરક્ષા",
    privacy_desc: "શ્રમિક ડેટાને સખત રીતે વર્ગીકૃત કરવામાં આવ્યો છે. કોન્ટ્રાક્ટર શોધ અનધિકૃત સંપર્ક અટકાવવા માટે ડેટા માસ્કિંગનો ઉપયોગ કરે છે.",

    email_label: "ઈમેલ સરનામું",
    password_label: "પાસવર્ડ",
    sign_in: "સાઇન ઇન કરો",
    login_title: "તમારા ખાતામાં સાઇન ઇન કરો",
    dashboard: "શ્રમિક ડેશબોર્ડ",
    welfare: "કલ્યાણકારી યોજનાઓ તપાસો",
    wage_check: "લઘુત્તમ વેતન તપાસ",
    grievance: "ફરિયાદ પોર્ટલ (ઇ-ન્યાય)"
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('shramik_lang') as Language;
    if (saved && ['en', 'hi', 'gu'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('shramik_lang', lang);
  };

  const t = (key: string) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
