// language.js - Language switching functionality

// Global variable to store current language
let currentLanguage = 'en'; // Default language is English

// Language dictionaries for different languages
const languageMap = {
    // English
    'en': {
        // Instruction text for each step
        step0: 'Welcome to the Bulk Density Simulation!',
        step1: 'Click on the \'Start Simulation\' button to begin.',
        step2: 'Click the button to turn ON the weighing scale.',
        step3: 'Click on the Petri dish to place it on the weighing scale.',
        step4: 'Click the \'Tare\' button to tare the weight.',
        step5: 'Click the powder box cap to open it.',
        step6: 'Click on the spatula to collect the sample.',
        step7: 'Click on the Petri dish to transfer the sample to the test tubes.',
        step8: 'Click the \'Start\' button to start tapping.',
        step9: 'Tapping completed. Results are displayed below.',
        completed: 'Simulation completed! Results are displayed in the measurement panel.',

        // UI elements
        step: 'Step',
        startBtn: 'Start Simulation',
        restartBtn: 'Restart Simulation',

        // Measurement panel
        measure: 'Measurements',
        chemical: 'Chemical Name',
        sample: 'Sample Weight (g)',
        bulk: 'Bulk Density',
        tapped: 'Tapped Density',
        bulkVolume: 'Bulk Volume (cm³)',
        tappedVolume: 'Tapped Volume (cm³)',
        tapCount: 'Number of Taps',

        // Language selection
        lang: 'Select language',

        // Popup
        settings: 'Simulation Settings',
        chemicalSelect: 'Chemical / Powder Selection:',
        weightSelect: 'Sample Weight (gm):',
        tapSelect: 'Number of Taps:',
        okBtn: 'OK'
    },

    // Hindi
    'hi': {
        // Instruction text for each step
        step0: 'बल्क घनत्व सिमुलेशन में आपका स्वागत है!',
        step1: 'शुरू करने के लिए \'सिमुलेशन शुरू करें\' बटन पर क्लिक करें।',
        step2: 'वजन मापने के यंत्र को चालू करने के लिए बटन पर क्लिक करें।',
        step3: 'पेट्री डिश को वजन मापने के यंत्र पर रखने के लिए उस पर क्लिक करें।',
        step4: 'वजन को शून्य करने के लिए \'टेयर\' बटन पर क्लिक करें।',
        step5: 'पाउडर बॉक्स के ढक्कन को खोलने के लिए उस पर क्लिक करें।',
        step6: 'नमूना इकट्ठा करने के लिए स्पैटुला पर क्लिक करें।',
        step7: 'नमूने को टेस्ट ट्यूब में स्थानांतरित करने के लिए पेट्री डिश पर क्लिक करें।',
        step8: 'टैपिंग शुरू करने के लिए \'शुरू\' बटन पर क्लिक करें।',
        step9: 'टैपिंग पूरी हुई। परिणाम नीचे प्रदर्शित हैं।',
        completed: 'सिमुलेशन पूरा हुआ! परिणाम मापन पैनल में प्रदर्शित हैं।',

        // UI elements
        step: 'चरण',
        startBtn: 'सिमुलेशन शुरू करें',
        restartBtn: 'सिमुलेशन पुनः प्रारंभ करें',

        // Measurement panel
        measure: 'मापन',
        chemical: 'रसायन का नाम',
        sample: 'नमूना वजन (ग्राम)',
        bulk: 'बल्क घनत्व',
        tapped: 'टैप्ड घनत्व',
        bulkVolume: 'बल्क आयतन (सेमी³)',
        tappedVolume: 'टैप्ड आयतन (सेमी³)',
        tapCount: 'टैप की संख्या',

        // Language selection
        lang: 'भाषा चुनें',

        // Popup
        settings: 'सिमुलेशन सेटिंग्स',
        chemicalSelect: 'रसायन / पाउडर चयन:',
        weightSelect: 'नमूना वजन (ग्राम):',
        tapSelect: 'टैप की संख्या:',
        okBtn: 'ठीक है'
    },

    // Gujarati
    'gu': {
        // Instruction text for each step
        step0: 'બલ્ક ઘનતા સિમ્યુલેશનમાં આપનું સ્વાગત છે!',
        step1: 'શરૂ કરવા માટે \'સિમ્યુલેશન શરૂ કરો\' બટન પર ક્લિક કરો.',
        step2: 'વજન માપવાના યંત્રને ચાલુ કરવા માટે બટન પર ક્લિક કરો.',
        step3: 'પેટ્રી ડિશને વજન માપવાના યંત્ર પર મૂકવા માટે તેના પર ક્લિક કરો.',
        step4: 'વજનને શૂન્ય કરવા માટે \'ટેર\' બટન પર ક્લિક કરો.',
        step5: 'પાવડર બોક્સના ઢાંકણને ખોલવા માટે તેના પર ક્લિક કરો.',
        step6: 'નમૂનો એકત્રિત કરવા માટે સ્પેટુલા પર ક્લિક કરો.',
        step7: 'નમૂનાને ટેસ્ટ ટ્યુબમાં સ્થાનાંતરિત કરવા માટે પેટ્રી ડિશ પર ક્લિક કરો.',
        step8: 'ટેપિંગ શરૂ કરવા માટે \'શરૂ\' બટન પર ક્લિક કરો.',
        step9: 'ટેપિંગ પૂર્ણ થઈ. પરિણામો નીચે દર્શાવેલ છે.',
        completed: 'સિમ્યુલેશન પૂર્ણ થયું! પરિણામો માપન પેનલમાં દર્શાવેલ છે.',

        // UI elements
        step: 'પગલું',
        startBtn: 'સિમ્યુલેશન શરૂ કરો',
        restartBtn: 'સિમ્યુલેશન ફરીથી શરૂ કરો',

        // Measurement panel
        measure: 'માપન',
        chemical: 'રસાયણનું નામ',
        sample: 'નમૂના વજન (ગ્રામ)',
        bulk: 'બલ્ક ઘનતા',
        tapped: 'ટેપ્ડ ઘનતા',
        bulkVolume: 'બલ્ક આયતન (સેમી³)',
        tappedVolume: 'ટેપ્ડ આયતન (સેમી³)',
        tapCount: 'ટેપની સંખ્યા',

        // Language selection
        lang: 'ભાષા પસંદ કરો',

        // Popup
        settings: 'સિમ્યુલેશન સેટિંગ્સ',
        chemicalSelect: 'રસાયણ / પાવડર પસંદગી:',
        weightSelect: 'નમૂના વજન (ગ્રામ):',
        tapSelect: 'ટેપની સંખ્યા:',
        okBtn: 'ઠીક છે'
    },

    // Bengali
    'bn': {
        // Instruction text for each step
        step0: 'বাল্ক ঘনত্ব সিমুলেশনে আপনাকে স্বাগতম!',
        step1: 'শুরু করতে \'সিমুলেশন শুরু করুন\' বাটনে ক্লিক করুন।',
        step2: 'ওজন মাপার যন্ত্র চালু করতে বাটনে ক্লিক করুন।',
        step3: 'পেট্রি ডিশকে ওজন মাপার যন্ত্রে রাখতে এটিতে ক্লিক করুন।',
        step4: 'ওজন শূন্য করতে \'টেয়ার\' বাটনে ক্লিক করুন।',
        step5: 'পাউডার বাক্সের ঢাকনা খুলতে এটিতে ক্লিক করুন।',
        step6: 'নমুনা সংগ্রহ করতে স্প্যাচুলায় ক্লিক করুন।',
        step7: 'নমুনাকে টেস্ট টিউবে স্থানান্তর করতে পেট্রি ডিশে ক্লিক করুন।',
        step8: 'ট্যাপিং শুরু করতে \'শুরু\' বাটনে ক্লিক করুন।',
        step9: 'ট্যাপিং সম্পন্ন হয়েছে। ফলাফল নীচে প্রদর্শিত হচ্ছে।',
        completed: 'সিমুলেশন সম্পন্ন হয়েছে! ফলাফল পরিমাপ প্যানেলে প্রদর্শিত হচ্ছে।',

        // UI elements
        step: 'ধাপ',
        startBtn: 'সিমুলেশন শুরু করুন',
        restartBtn: 'সিমুলেশন পুনরায় শুরু করুন',

        // Measurement panel
        measure: 'পরিমাপ',
        chemical: 'রাসায়নিকের নাম',
        sample: 'নমুনা ওজন (গ্রাম)',
        bulk: 'বাল্ক ঘনত্ব',
        tapped: 'ট্যাপড ঘনত্ব',
        tapCount: 'ট্যাপের সংখ্যা',

        // Language selection
        lang: 'ভাষা নির্বাচন করুন',

        // Popup
        settings: 'সিমুলেশন সেটিংস',
        chemicalSelect: 'রাসায়নিক / পাউডার নির্বাচন:',
        weightSelect: 'নমুনা ওজন (গ্রাম):',
        tapSelect: 'ট্যাপের সংখ্যা:',
        okBtn: 'ঠিক আছে'
    },

    // Malayalam
    'ml': {
        // Instruction text for each step
        step0: 'ബൾക്ക് ഡെൻസിറ്റി സിമുലേഷനിലേക്ക് സ്വാഗതം!',
        step1: 'ആരംഭിക്കാൻ \'സിമുലേഷൻ ആരംഭിക്കുക\' ബട്ടണിൽ ക്ലിക്ക് ചെയ്യുക.',
        step2: 'തൂക്കം അളക്കുന്ന യന്ത്രം ഓൺ ചെയ്യാൻ ബട്ടണിൽ ക്ലിക്ക് ചെയ്യുക.',
        step3: 'പെട്രി ഡിഷ് തൂക്കം അളക്കുന്ന യന്ത്രത്തിൽ വയ്ക്കാൻ അതിൽ ക്ലിക്ക് ചെയ്യുക.',
        step4: 'തൂക്കം പൂജ്യമാക്കാൻ \'ടെയർ\' ബട്ടണിൽ ക്ലിക്ക് ചെയ്യുക.',
        step5: 'പൗഡർ ബോക്സിന്റെ അടപ്പ് തുറക്കാൻ അതിൽ ക്ലിക്ക് ചെയ്യുക.',
        step6: 'സാമ്പിൾ ശേഖരിക്കാൻ സ്പാച്ചുലയിൽ ക്ലിക്ക് ചെയ്യുക.',
        step7: 'സാമ്പിൾ ടെസ്റ്റ് ട്യൂബുകളിലേക്ക് മാറ്റാൻ പെട്രി ഡിഷിൽ ക്ലിക്ക് ചെയ്യുക.',
        step8: 'ടാപ്പിംഗ് ആരംഭിക്കാൻ \'ആരംഭിക്കുക\' ബട്ടണിൽ ക്ലിക്ക് ചെയ്യുക.',
        step9: 'ടാപ്പിംഗ് പൂർത്തിയായി. ഫലങ്ങൾ താഴെ പ്രദർശിപ്പിച്ചിരിക്കുന്നു.',
        completed: 'സിമുലേഷൻ പൂർത്തിയായി! ഫലങ്ങൾ അളവ് പാനലിൽ പ്രദർശിപ്പിച്ചിരിക്കുന്നു.',

        // UI elements
        step: 'ഘട്ടം',
        startBtn: 'സിമുലേഷൻ ആരംഭിക്കുക',
        restartBtn: 'സിമുലേഷൻ വീണ്ടും ആരംഭിക്കുക',

        // Measurement panel
        measure: 'അളവുകൾ',
        chemical: 'രാസവസ്തുവിന്റെ പേര്',
        sample: 'സാമ്പിൾ തൂക്കം (ഗ്രാം)',
        bulk: 'ബൾക്ക് ഡെൻസിറ്റി',
        tapped: 'ടാപ്പ്ഡ് ഡെൻസിറ്റി',
        bulkVolume: 'ബൾക്ക് വോലിയം (സെമീ³)',
        tappedVolume: 'ടാപ്പ്ഡ് വോലിയം (സെമീ³)',
        tapCount: 'ടാപ്പുകളുടെ എണ്ണം',

        // Language selection
        lang: 'ഭാഷ തിരഞ്ഞെടുക്കുക',

        // Popup
        settings: 'സിമുലേഷൻ സെറ്റിംഗുകൾ',
        chemicalSelect: 'രാസവസ്തു / പൗഡർ തിരഞ്ഞെടുക്കൽ:',
        weightSelect: 'സാമ്പിൾ തൂക്കം (ഗ്രാം):',
        tapSelect: 'ടാപ്പുകളുടെ എണ്ണം:',
        okBtn: 'ശരി'
    },

    // Tamil
    'ta': {
        // Instruction text for each step
        step0: 'பொருண்மை அடர்த்தி சிமுலேஷனுக்கு வரவேற்கிறோம்!',
        step1: 'தொடங்க \'சிமுலேஷனைத் தொடங்கு\' பொத்தானைக் கிளிக் செய்யவும்.',
        step2: 'எடை அளவியை இயக்க பொத்தானைக் கிளிக் செய்யவும்.',
        step3: 'பெட்ரி தட்டை எடை அளவியில் வைக்க அதைக் கிளிக் செய்யவும்.',
        step4: 'எடையை சுழியாக்க \'டேர்\' பொத்தானைக் கிளிக் செய்யவும்.',
        step5: 'பவுடர் பெட்டியின் மூடியைத் திறக்க அதைக் கிளிக் செய்யவும்.',
        step6: 'மாதிரியை சேகரிக்க ஸ்பாட்டுலாவைக் கிளிக் செய்யவும்.',
        step7: 'மாதிரியை சோதனைக் குழாய்களுக்கு மாற்ற பெட்ரி தட்டைக் கிளிக் செய்யவும்.',
        step8: 'தட்டுதலைத் தொடங்க \'தொடங்கு\' பொத்தானைக் கிளிக் செய்யவும்.',
        step9: 'தட்டுதல் முடிந்தது. முடிவுகள் கீழே காட்டப்பட்டுள்ளன.',
        completed: 'சிமுலேஷன் முடிந்தது! முடிவுகள் அளவீட்டுப் பலகையில் காட்டப்பட்டுள்ளன.',

        // UI elements
        step: 'படி',
        startBtn: 'சிமுலேஷனைத் தொடங்கு',
        restartBtn: 'சிமுலேஷனை மீண்டும் தொடங்கு',

        // Measurement panel
        measure: 'அளவீடுகள்',
        chemical: 'இரசாயனப் பெயர்',
        sample: 'மாதிரி எடை (கிராம்)',
        bulk: 'பொருண்மை அடர்த்தி',
        tapped: 'தட்டப்பட்ட அடர்த்தி',
        bulkVolume: 'பொருண்மை கனஅளவு (செமீ³)',
        tappedVolume: 'தட்டப்பட்ட கனஅளவு (செமீ³)',
        tapCount: 'தட்டுகளின் எண்ணிக்கை',

        // Language selection
        lang: 'மொழியைத் தேர்ந்தெடுக்கவும்',

        // Popup
        settings: 'சிமுலேஷன் அமைப்புகள்',
        chemicalSelect: 'இரசாயனம் / பவுடர் தேர்வு:',
        weightSelect: 'மாதிரி எடை (கிராம்):',
        tapSelect: 'தட்டுகளின் எண்ணிக்கை:',
        okBtn: 'சரி'
    },

    // Marathi
    'mr': {
        // Instruction text for each step
        step0: 'बल्क घनता सिम्युलेशनमध्ये आपले स्वागत आहे!',
        step1: 'सुरू करण्यासाठी \'सिम्युलेशन सुरू करा\' बटणावर क्लिक करा.',
        step2: 'वजन मापन यंत्र चालू करण्यासाठी बटणावर क्लिक करा.',
        step3: 'पेट्री डिश वजन मापन यंत्रावर ठेवण्यासाठी त्यावर क्लिक करा.',
        step4: 'वजन शून्य करण्यासाठी \'टेअर\' बटणावर क्लिक करा.',
        step5: 'पावडर बॉक्सचे झाकण उघडण्यासाठी त्यावर क्लिक करा.',
        step6: 'नमुना गोळा करण्यासाठी स्पॅट्युलावर क्लिक करा.',
        step7: 'नमुना टेस्ट ट्यूबमध्ये हस्तांतरित करण्यासाठी पेट्री डिशवर क्लिक करा.',
        step8: 'टॅपिंग सुरू करण्यासाठी \'सुरू\' बटणावर क्लिक करा.',
        step9: 'टॅपिंग पूर्ण झाले. परिणाम खाली दर्शविले आहेत.',
        completed: 'सिम्युलेशन पूर्ण झाले! परिणाम मापन पॅनेलमध्ये दर्शविले आहेत.',

        // UI elements
        step: 'चरण',
        startBtn: 'सिम्युलेशन सुरू करा',
        restartBtn: 'सिम्युलेशन पुन्हा सुरू करा',

        // Measurement panel
        measure: 'मापने',
        chemical: 'रसायनाचे नाव',
        sample: 'नमुना वजन (ग्रॅम)',
        bulk: 'बल्क घनता',
        tapped: 'टॅप्ड घनता',
        bulkVolume: 'बल्क आकारमान (सेमी³)',
        tappedVolume: 'टॅप्ड आकारमान (सेमी³)',
        tapCount: 'टॅपची संख्या',

        // Language selection
        lang: 'भाषा निवडा',

        // Popup
        settings: 'सिम्युलेशन सेटिंग्ज',
        chemicalSelect: 'रसायन / पावडर निवड:',
        weightSelect: 'नमुना वजन (ग्रॅम):',
        tapSelect: 'टॅपची संख्या:',
        okBtn: 'ठीक आहे'
    }
};

// No longer needed since we're using a select element
// function toggleLanguagePanel() {
//     const panel = document.getElementById('languagePanel');
//     panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
// }

// Function to change language
function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    // Update current language
    currentLanguage = lang;

    // Get the language dictionary
    const dict = languageMap[lang];
    if (!dict) {
        console.error('Language dictionary not found for:', lang);
        return;
    }

    // Update UI elements
    try {
        // Update measurement panel
        document.getElementById('measurementTitle').innerText = dict.measure;
        document.getElementById('chemicalNameLabel').innerText = dict.chemical;
        document.getElementById('sampleWeightLabel').innerText = dict.sample;
        document.getElementById('bulkLabel').innerText = dict.bulk;
        document.getElementById('tappedLabel').innerText = dict.tapped;

        // Update volume labels
        document.getElementById('bulkVolumeLabel').innerText = dict.bulkVolume || 'Bulk Volume (cm\u00b3)';
        document.getElementById('tappedVolumeLabel').innerText = dict.tappedVolume || 'Tapped Volume (cm\u00b3)';

        document.getElementById('tapCountLabel').innerText = dict.tapCount;

        // Update only the simulation start button - machine buttons remain in English
        document.getElementById('startSimulationBtn').innerText = dict.startBtn;

        // Note: We don't change the text of machine buttons (ON, TARE, START) as these are physical machine labels

        // Update step counter
        const stepCounter = document.getElementById('stepCounter');
        if (stepCounter) {
            const stepNumber = window.currentStep || 0;
            stepCounter.innerText = `${dict.step} ${stepNumber}`;
        }

        // Update select element to show current language
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = lang;
        }

        // Force update the instruction text directly based on current step
        const instructionText = document.getElementById('instructionText');
        if (instructionText) {
            const currentStep = window.currentStep || 0;
            const stepKey = `step${currentStep}`;
            if (dict[stepKey]) {
                instructionText.innerText = dict[stepKey];
                console.log('Directly updated instruction text to:', dict[stepKey]);
            }
        }
    } catch (error) {
        console.error('Error updating UI elements:', error);
    }
}

// Function to update instruction text based on current step and language
function updateInstructionText() {
    console.log('Updating instruction text with language:', currentLanguage);
    // Get current step
    const currentStep = window.currentStep || 0;

    // Get language dictionary
    const dict = languageMap[currentLanguage];
    if (!dict) {
        console.error('Language dictionary not found for:', currentLanguage);
        return;
    }

    // Get instruction text element
    const instructionText = document.getElementById('instructionText');
    if (!instructionText) {
        console.error('Instruction text element not found');
        return;
    }

    try {
        // Update step counter
        const stepCounter = document.getElementById('stepCounter');
        if (stepCounter && currentStep > 0) {
            stepCounter.innerText = `${dict.step} ${currentStep}`;
        }

        // Update instruction text based on current step
        const stepKey = `step${currentStep}`;
        if (dict[stepKey]) {
            instructionText.innerText = dict[stepKey];
            console.log('Updated instruction text to:', dict[stepKey]);
        } else {
            // Fallback to step0 if the step key doesn't exist
            instructionText.innerText = dict.step0;
            console.log('Fallback to step0 instruction text:', dict.step0);
        }
    } catch (error) {
        console.error('Error updating instruction text:', error);
    }
}

// Function to play audio for instructions with a specified delay
function playInstructionAudio(delay = 0) {
    console.log('playInstructionAudio called, currentStep:', window.currentStep, 'with delay:', delay);

    const audio = document.getElementById('instructionAudio');
    if (!audio) {
        console.error('Audio element not found!');
        return;
    }

    // Set the audio source based on the current language and step
    const currentStep = window.currentStep || 0;
    console.log('Current step for audio:', currentStep, 'Current language:', currentLanguage);

    // Only play audio for English language
    // For other languages, we'll skip audio playback until those files are provided
    if (currentLanguage !== 'en' && currentLanguage !== undefined) {
        console.log('Skipping audio playback for non-English language:', currentLanguage);
        return;
    }

    // Map step numbers to the corresponding audio file names
    // Currently only implemented for English (default)
    let audioFile = '';

    // Use the numbered filenames for English
    switch(currentStep) {
        case 1:
            audioFile = 'start1.mp3';
            break;
        case 2:
            audioFile = 'startSimulation2.mp3';
            break;
        case 3:
            audioFile = 'ON3.mp3';
            break;
        case 4:
            audioFile = 'petri4.mp3';
            break;
        case 5:
            audioFile = 'tare5.mp3';
            break;
        case 6:
            audioFile = 'cap6.mp3';
            break;
        case 7:
            audioFile = 'spatula7.mp3';
            break;
        case 8:
            audioFile = 'transfer8.mp3';
            break;
        case 9:
            audioFile = 'starttapping9.mp3';
            break;
        case 10:
            audioFile = 'completed10.mp3';
            break;
        default:
            // No audio for step 0 or invalid steps
            console.log('No audio file for step:', currentStep);
            return;
    }

    // Set the audio source to the root audio directory for English
    const audioPath = `audio/${audioFile}`;
    console.log('Setting audio source to:', audioPath);
    audio.src = audioPath;

    // Make sure the audio is not muted and volume is up
    audio.muted = false;
    audio.volume = 1.0;

    // Create a user interaction event handler to enable audio playback
    // This helps with browsers that require user interaction before playing audio
    const enableAudio = () => {
        // Remove the event listeners after first interaction
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);

        // Resume the audio context if it exists and is suspended
        if (window.audioContext && window.audioContext.state === 'suspended') {
            window.audioContext.resume();
        }
    };

    // Add event listeners for user interaction
    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);

    // Play the audio with the specified delay
    setTimeout(() => {
        console.log('Playing audio after delay:', audio.src);
        audio.play().then(() => {
            console.log('Audio playback started successfully');
        }).catch(error => {
            console.error('Audio playback error:', error);

            // If there's an error, try playing again after user interaction
            const retryPlay = () => {
                document.removeEventListener('click', retryPlay);
                audio.play().catch(e => console.error('Retry audio playback failed:', e));
            };
            document.addEventListener('click', retryPlay);
        });
    }, delay);
}

// Function to play audio for a specific step with a delay
window.playAudioForStep = function(step, delay = 0) {
    console.log(`Playing audio for step ${step} with delay ${delay}ms`);

    // Store the original step
    const originalStep = window.currentStep;

    // Temporarily set the current step to the specified step
    window.currentStep = step;

    // Play the audio with the specified delay
    playInstructionAudio(delay);

    // Restore the original step
    window.currentStep = originalStep;
}

// Function to play the error message audio
window.playErrorAudio = function() {
    console.log('Playing error message audio');

    // Only play for English language
    if (currentLanguage !== 'en' && currentLanguage !== undefined) {
        console.log('Skipping error audio for non-English language:', currentLanguage);
        return;
    }

    const audio = document.getElementById('instructionAudio');
    if (audio) {
        // Set the source to followCurrent.mp3
        audio.src = 'audio/followCurrent.mp3';

        // Make sure audio is not muted and volume is up
        audio.muted = false;
        audio.volume = 1.0;

        // Play the audio
        audio.play().then(() => {
            console.log('Error audio playback started successfully');
        }).catch(error => {
            console.error('Error audio playback failed:', error);
        });
    }
}

// Store the original functions from main.js
window.mainJsUpdateInstructionText = window.updateInstructionText;
window.mainJsPlayInstructionAudio = window.playInstructionAudio;

// Override with our language-aware functions
console.log('Setting language-aware functions');
window.updateInstructionText = updateInstructionText;
window.playInstructionAudio = playInstructionAudio;

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set default language to English
    changeLanguage('en');

    // We'll play start1.mp3 when the start popup appears
    // This is now handled in the start-popup.js file
});
