// البيانات العالمية
let countries = [];
let cities = [];
let hadiths = [];
let surahs = [];
let selectedCountry = '';
let selectedCity = '';
let selectedSurah = null;
let showTranslation = false;
let selectedLanguage = 'en';
let availableTranslations = [];
let audioPlayer = null;
let currentAyah = 1;
let ayahAudios = [];
let isPlaying = false;
let playbackMode = 'continuous'; // 'continuous' or 'ayah-by-ayah'
let algerianProvinces = []; // إضافة قائمة ولايات الجزائر
let worldRegions = {}; // إضافة مناطق العالم
let quranReciters = []; // إضافة قائمة القراء
let availableTafsirs = []; // إضافة قائمة التفاسير
let selectedTafsir = 'ar.muyassar'; // التفسير الافتراضي
let showTafsir = false; // عرض التفسير أم لا
let tafsirs = {}; // تخزين بيانات التفسير للسورة الحالية

// تهيئة البرنامج عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadAlgerianProvinces(); // تحميل ولايات الجزائر
    loadWorldRegions(); // تحميل مناطق العالم
    loadQuranReciters(); // تحميل قائمة القراء
    loadAvailableTranslations(); // تحميل الترجمات المتاحة
    loadAvailableTafsirs(); // تحميل التفاسير المتاحة
    fetchCountries();
    fetchHadiths();
    fetchSurahs();
    updateCurrentDate();
    
    // إضافة أحداث التغيير للمناطق الجغرافية
    document.getElementById('country-select').addEventListener('change', onCountryChange);
    document.getElementById('city-select').addEventListener('change', onCityChange);
    
    // إضافة أحداث للقرآن الكريم
    document.getElementById('surah-select').addEventListener('change', onSurahChange);
    document.getElementById('translation-language').addEventListener('change', changeTranslationLanguage);
    document.getElementById('toggle-translation-btn').addEventListener('click', toggleTranslation);
    document.getElementById('play-audio-btn').addEventListener('click', playQuranAudio);
    document.getElementById('reciter-select').addEventListener('change', onReciterChange);
    document.getElementById('playback-mode').addEventListener('change', changePlaybackMode);
    document.getElementById('next-ayah-btn').addEventListener('click', playNextAyah);
    document.getElementById('prev-ayah-btn').addEventListener('click', playPrevAyah);
    document.getElementById('tafsir-select').addEventListener('change', changeTafsir);
    document.getElementById('toggle-tafsir-btn').addEventListener('click', toggleTafsir);
});

// تهيئة أزرار التنقل
function initializeNavigation() {
    const prayerTimesBtn = document.getElementById('prayer-times-btn');
    const quranBtn = document.getElementById('quran-btn');
    const prayerTimesSection = document.getElementById('prayer-times-section');
    const quranSection = document.getElementById('quran-section');
    
    prayerTimesBtn.addEventListener('click', () => {
        prayerTimesSection.classList.add('active');
        quranSection.classList.remove('active');
        prayerTimesBtn.classList.add('active');
        quranBtn.classList.remove('active');
    });
    
    quranBtn.addEventListener('click', () => {
        quranSection.classList.add('active');
        prayerTimesSection.classList.remove('active');
        quranBtn.classList.add('active');
        prayerTimesBtn.classList.remove('active');
    });
}

// تحديث التاريخ الحالي (هجري وميلادي)
function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    
    // التاريخ الميلادي
    const gregorianDate = moment().format('DD MMMM YYYY');
    
    // التاريخ الهجري
    moment.locale('ar-SA');
    const hijriDate = moment().format('iD iMMMM iYYYY');
    
    dateElement.innerText = `${hijriDate} | ${gregorianDate}`;
}

// تحميل ولايات الجزائر
function loadAlgerianProvinces() {
    algerianProvinces = [
        "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار", "البليدة", "البويرة",
        "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة",
        "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة",
        "وهران", "البيض", "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي", "خنشلة",
        "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت", "غرداية", "غليزان"
    ];
}

// تحميل مناطق العالم
function loadWorldRegions() {
    worldRegions = {
        "أفريقيا": ["الجزائر", "مصر", "المغرب", "تونس", "ليبيا", "السودان", "الصومال", "جيبوتي", "موريتانيا", "جنوب أفريقيا", "نيجيريا", "كينيا", "إثيوبيا", "تنزانيا", "أوغندا", "غانا", "السنغال"],
        "آسيا": ["السعودية", "الإمارات", "قطر", "البحرين", "الكويت", "عمان", "اليمن", "العراق", "سوريا", "لبنان", "فلسطين", "الأردن", "تركيا", "إيران", "باكستان", "أفغانستان", "الهند", "بنغلاديش", "ماليزيا", "إندونيسيا", "الصين", "اليابان", "كوريا الجنوبية"],
        "أوروبا": ["المملكة المتحدة", "فرنسا", "ألمانيا", "إيطاليا", "إسبانيا", "البرتغال", "هولندا", "بلجيكا", "سويسرا", "النمسا", "السويد", "النرويج", "فنلندا", "الدنمارك", "روسيا", "أوكرانيا", "بولندا"],
        "أمريكا الشمالية": ["الولايات المتحدة", "كندا", "المكسيك", "كوبا", "جامايكا", "بنما", "كوستاريكا"],
        "أمريكا الجنوبية": ["البرازيل", "الأرجنتين", "تشيلي", "كولومبيا", "بيرو", "فنزويلا", "الإكوادور", "بوليفيا"],
        "أوقيانوسيا": ["أستراليا", "نيوزيلندا", "بابوا غينيا الجديدة", "فيجي"]
    };
}

// جلب قائمة الدول
async function fetchCountries() {
    try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries');
        countries = response.data.data;
        
        // إضافة الجزائر مع ولاياتها
        const algeriaIndex = countries.findIndex(country => country.country === 'Algeria');
        if (algeriaIndex !== -1) {
            countries[algeriaIndex].cities = algerianProvinces;
        }
        
        // ترتيب الدول حسب المناطق
        organizeCountriesByRegion();
        
        populateCountriesDropdown();
    } catch (error) {
        console.error('خطأ في جلب الدول:', error);
        
        // في حالة الفشل، على الأقل إضافة ولايات الجزائر
        countries.push({
            country: 'الجزائر',
            cities: algerianProvinces
        });
        
        populateCountriesDropdown();
    }
}

// تنظيم الدول حسب المناطق
function organizeCountriesByRegion() {
    // إضافة خيار للتصفية حسب المنطقة
    const regionSelect = document.createElement('select');
    regionSelect.id = 'region-select';
    regionSelect.className = 'form-select form-select-lg mb-3';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'جميع مناطق العالم';
    regionSelect.appendChild(defaultOption);
    
    // إضافة المناطق
    for (const region in worldRegions) {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    }
    
    // إضافة حدث التغيير للمنطقة
    regionSelect.addEventListener('change', onRegionChange);
    
    // إضافة عنصر المنطقة قبل اختيار الدولة
    const countrySelect = document.getElementById('country-select');
    countrySelect.parentNode.insertBefore(regionSelect, countrySelect);
}

// معالجة تغيير المنطقة
function onRegionChange(event) {
    const selectedRegion = event.target.value;
    const countrySelect = document.getElementById('country-select');
    
    // إعادة تعيين قائمة الدول
    countrySelect.innerHTML = '<option value="">اختر الدولة</option>';
    
    if (selectedRegion) {
        // الدول في المنطقة المحددة
        const regionCountries = worldRegions[selectedRegion] || [];
        
        // عرض الدول في المنطقة المحددة فقط
        countries.forEach(country => {
            // البحث عن اسم الدولة بالعربية أو الإنجليزية
            if (regionCountries.includes(country.country) || 
                regionCountries.some(c => country.country.includes(c) || c.includes(country.country))) {
                const option = document.createElement('option');
                option.value = country.country;
                option.textContent = country.country;
                countrySelect.appendChild(option);
            }
        });
    } else {
        // عرض جميع الدول
        populateCountriesDropdown();
    }
}

// تعبئة قائمة الدول في القائمة المنسدلة
function populateCountriesDropdown() {
    const countrySelect = document.getElementById('country-select');
    countrySelect.innerHTML = '<option value="">اختر الدولة</option>';
    
    // إضافة الجزائر في المقدمة
    const algeriaOption = document.createElement('option');
    algeriaOption.value = 'Algeria';
    algeriaOption.textContent = 'الجزائر';
    countrySelect.appendChild(algeriaOption);
    
    countries.forEach(country => {
        if (country.country !== 'Algeria') { // تجنب تكرار الجزائر
            const option = document.createElement('option');
            option.value = country.country;
            option.textContent = country.country;
            countrySelect.appendChild(option);
        }
    });
}

// معالجة تغيير الدولة
function onCountryChange(event) {
    selectedCountry = event.target.value;
    
    if (selectedCountry) {
        const country = countries.find(c => c.country === selectedCountry);
        if (country) {
            cities = country.cities;
            populateCitiesDropdown();
        }
    } else {
        // إعادة تعيين قائمة المدن إذا لم يتم اختيار دولة
        document.getElementById('city-select').innerHTML = '<option value="">اختر المدينة</option>';
    }
}

// تعبئة قائمة المدن في القائمة المنسدلة
function populateCitiesDropdown() {
    const citySelect = document.getElementById('city-select');
    citySelect.innerHTML = '<option value="">اختر المدينة</option>';
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// معالجة تغيير المدينة
function onCityChange(event) {
    selectedCity = event.target.value;
    
    if (selectedCity) {
        document.getElementById('current-city').textContent = `${selectedCity}, ${selectedCountry}`;
        fetchPrayerTimes(selectedCity, selectedCountry);
    }
}

// جلب مواقيت الصلاة للمدينة المحددة
async function fetchPrayerTimes(city, country) {
    try {
        // استخدام واجهة برمجة التطبيقات لمواقيت الصلاة
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        const response = await axios.get(`https://api.aladhan.com/v1/calendarByCity`, {
            params: {
                city,
                country,
                method: 2, // طريقة الحساب (2 هي لجمعية العالم الإسلامي)
                month,
                year
            }
        });
        
        if (response.data.code === 200) {
            const today = date.getDate() - 1; // الفهرس يبدأ من 0
            const timings = response.data.data[today].timings;
            
            // تحديث مواقيت الصلاة على الواجهة
            document.getElementById('fajr-time').textContent = formatTime(timings.Fajr);
            document.getElementById('sunrise-time').textContent = formatTime(timings.Sunrise);
            document.getElementById('dhuhr-time').textContent = formatTime(timings.Dhuhr);
            document.getElementById('asr-time').textContent = formatTime(timings.Asr);
            document.getElementById('maghrib-time').textContent = formatTime(timings.Maghrib);
            document.getElementById('isha-time').textContent = formatTime(timings.Isha);
        }
    } catch (error) {
        console.error('خطأ في جلب مواقيت الصلاة:', error);
    }
}

// تنسيق وقت الصلاة لإزالة معلومات المنطقة الزمنية
function formatTime(timeString) {
    return timeString.split(' ')[0];
}

// جلب الأحاديث النبوية
async function fetchHadiths() {
    try {
        // استخدام واجهة برمجة التطبيقات للأحاديث النبوية
        const response = await axios.get('https://api.hadith.sutanlab.id/books/muslim?range=1-300');
        
        if (response.data.code === 200) {
            hadiths = response.data.data.hadiths;
            displayRandomHadith();
            
            // تغيير الحديث كل دقيقة
            setInterval(displayRandomHadith, 60000);
        }
    } catch (error) {
        console.error('خطأ في جلب الأحاديث:', error);
        
        // استخدام بعض الأحاديث المضمنة كاحتياط
        hadiths = [
            { arab: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى" },
            { arab: "مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ، وَذَلِكَ أَضْعَفُ الْإِيمَانِ" },
            { arab: "لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ" },
            { arab: "يا أيها الناس، افشوا السلام، وأطعموا الطعام، وصلوا بالليل والناس نيام، تدخلوا الجنة بسلام" }
        ];
        displayRandomHadith();
        setInterval(displayRandomHadith, 60000);
    }
}

// عرض حديث عشوائي
function displayRandomHadith() {
    if (hadiths.length > 0) {
        const randomIndex = Math.floor(Math.random() * hadiths.length);
        const hadithText = document.getElementById('hadith-text');
        hadithText.textContent = hadiths[randomIndex].arab;
    }
}

// جلب قائمة سور القرآن الكريم
async function fetchSurahs() {
    try {
        const response = await axios.get('https://api.alquran.cloud/v1/surah');
        
        if (response.data.code === 200) {
            surahs = response.data.data;
            populateSurahsDropdown();
        }
    } catch (error) {
        console.error('خطأ في جلب سور القرآن:', error);
    }
}

// تعبئة قائمة السور في القائمة المنسدلة
function populateSurahsDropdown() {
    const surahSelect = document.getElementById('surah-select');
    
    surahs.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.number;
        option.textContent = `${surah.number}. ${surah.name} (${surah.englishName})`;
        surahSelect.appendChild(option);
    });
}

// معالجة تغيير السورة
async function onSurahChange(event) {
    const surahNumber = event.target.value;
    
    if (surahNumber) {
        try {
            // إيقاف التشغيل الحالي إذا كان موجودًا
            if (audioPlayer && !audioPlayer.paused) {
                audioPlayer.pause();
                isPlaying = false;
                updatePlayButton();
            }
            
            // إعادة تعيين القيم
            currentAyah = 1;
            ayahAudios = [];
            tafsirs = {}; // إعادة تعيين التفاسير للسورة الجديدة
            
            // جلب آيات السورة باللغة العربية
            const arabicResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
            
            if (arabicResponse.data.code === 200) {
                selectedSurah = {
                    arabic: arabicResponse.data.data,
                    translation: null,
                    tafsir: null
                };
                
                // جلب الترجمة باللغة المحددة
                await fetchSurahTranslation(surahNumber, selectedLanguage);
                
                // جلب التفسير المحدد
                await fetchSurahTafsir(surahNumber, selectedTafsir);
                
                displaySurah();
                
                // تحديث عناصر التحكم بالتشغيل
                document.getElementById('playback-controls').style.display = 'flex';
            }
        } catch (error) {
            console.error('خطأ في جلب آيات السورة:', error);
        }
    }
}

// جلب ترجمة السورة باللغة المحددة
async function fetchSurahTranslation(surahNumber, translationId) {
    try {
        const translationResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/${translationId}`);
        
        if (translationResponse.data.code === 200) {
            selectedSurah.translation = translationResponse.data.data;
            
            // تحديث العرض إذا كانت الترجمة مرئية
            if (showTranslation) {
                displaySurah();
            }
        }
    } catch (error) {
        console.error('خطأ في جلب الترجمة:', error);
    }
}

// جلب تفسير السورة
async function fetchSurahTafsir(surahNumber, tafsirId) {
    try {
        // تحقق مما إذا كان لدينا التفسير المخزن مسبقًا
        if (tafsirs[tafsirId]) {
            selectedSurah.tafsir = tafsirs[tafsirId];
            return;
        }

        const tafsirResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/${tafsirId}`);
        
        if (tafsirResponse.data.code === 200) {
            // تخزين التفسير في الذاكرة لتجنب التحميل المتكرر
            tafsirs[tafsirId] = tafsirResponse.data.data;
            selectedSurah.tafsir = tafsirResponse.data.data;
            
            // تحديث العرض إذا كان التفسير مرئيًا
            if (showTafsir) {
                displaySurah();
            }
        }
    } catch (error) {
        console.error('خطأ في جلب التفسير:', error);
        // إنشاء رسالة خطأ في حالة عدم توفر التفسير
        selectedSurah.tafsir = {
            name: 'غير متوفر',
            ayahs: selectedSurah.arabic.ayahs.map(ayah => ({
                number: ayah.number,
                numberInSurah: ayah.numberInSurah,
                text: 'عذراً، هذا التفسير غير متوفر حاليًا.'
            }))
        };
        
        if (showTafsir) {
            displaySurah();
        }
    }
}

// تغيير لغة الترجمة
function changeTranslationLanguage(event) {
    selectedLanguage = event.target.value;
    
    if (selectedSurah) {
        // إعادة تحميل الترجمة باللغة الجديدة
        fetchSurahTranslation(selectedSurah.arabic.number, selectedLanguage);
    }
}

// تبديل عرض الترجمة
function toggleTranslation() {
    const toggleBtn = document.getElementById('toggle-translation-btn');
    const translationPanel = document.getElementById('translation-panel');
    const translationTab = document.getElementById('translation-tab');
    
    showTranslation = !showTranslation;
    
    if (showTranslation) {
        toggleBtn.textContent = 'إخفاء الترجمة';
        translationTab.click(); // تنشيط تبويب الترجمة
    } else {
        toggleBtn.textContent = 'عرض الترجمة';
    }
}

// تبديل عرض التفسير
function toggleTafsir() {
    const toggleBtn = document.getElementById('toggle-tafsir-btn');
    const tafsirTab = document.getElementById('tafsir-tab');
    
    showTafsir = !showTafsir;
    
    if (showTafsir) {
        toggleBtn.textContent = 'إخفاء التفسير';
        tafsirTab.click(); // تنشيط تبويب التفسير
        
        // إذا لم يكن التفسير محملاً بعد
        if (!selectedSurah.tafsir && selectedSurah) {
            fetchSurahTafsir(selectedSurah.arabic.number, selectedTafsir);
        } else {
            displayTafsir();
        }
    } else {
        toggleBtn.textContent = 'عرض التفسير';
    }
}

// تغيير التفسير المحدد
function changeTafsir(event) {
    selectedTafsir = event.target.value;
    
    if (selectedSurah) {
        // إعادة تحميل التفسير بالتفسير الجديد
        fetchSurahTafsir(selectedSurah.arabic.number, selectedTafsir);
    }
}

// عرض آيات السورة المحددة
function displaySurah() {
    if (selectedSurah) {
        const arabicContainer = document.getElementById('arabic-text');
        const translationContainer = document.getElementById('translation-text');
        
        // عرض الآيات العربية
        let arabicHTML = `<h2 class="text-center mb-4">${selectedSurah.arabic.name}</h2>`;
        arabicHTML += '<div class="bismillah text-center mb-4">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>';
        
        selectedSurah.arabic.ayahs.forEach(ayah => {
            arabicHTML += `<span class="ayah" data-ayah="${ayah.numberInSurah}">${ayah.text} <span class="ayah-number">${convertToArabicNumbers(ayah.numberInSurah)}</span></span> `;
        });
        
        arabicContainer.innerHTML = arabicHTML;
        
        // عرض الترجمة إذا كانت متاحة
        if (selectedSurah.translation) {
            const translation = selectedSurah.translation;
            const translationDirection = availableTranslations.find(t => t.id === selectedLanguage)?.direction || 'ltr';
            
            let translationHTML = `<h2 class="text-center mb-4">${translation.englishName}</h2>`;
            translationHTML += `<div class="bismillah text-center mb-4">${translation.ayahs[0].text.includes("بسم الله") ? "" : translation.ayahs[0].text}</div>`;
            
            translation.ayahs.forEach(ayah => {
                translationHTML += `<span class="ayah" data-ayah="${ayah.numberInSurah}">${ayah.text} <span class="ayah-number">${ayah.numberInSurah}</span></span> `;
            });
            
            translationContainer.innerHTML = translationHTML;
            translationContainer.style.direction = translationDirection;
            translationContainer.className = `quran-text translation ${translationDirection === 'rtl' ? 'rtl-text' : 'ltr-text'}`;
        }
        
        // عرض التفسير إذا كان متاحًا ومفعلاً
        if (showTafsir && selectedSurah.tafsir) {
            displayTafsir();
        }
    }
}

// عرض تفسير السورة
function displayTafsir() {
    if (selectedSurah && selectedSurah.tafsir) {
        const tafsirContainer = document.getElementById('tafsir-text');
        const tafsir = selectedSurah.tafsir;
        const selectedTafsirInfo = availableTafsirs.find(t => t.id === selectedTafsir);
        
        let tafsirHTML = `<h2 class="text-center mb-4">${tafsir.name || selectedTafsirInfo?.name || 'التفسير'}</h2>`;
        tafsirHTML += `<div class="tafsir-author text-center mb-4">${selectedTafsirInfo?.author || ''}</div>`;
        
        // إذا كان التفسير متاحًا
        if (tafsir.ayahs && tafsir.ayahs.length > 0) {
            tafsirHTML += '<div class="tafsir-content">';
            tafsir.ayahs.forEach(ayah => {
                const ayahText = selectedSurah.arabic.ayahs.find(a => a.numberInSurah === ayah.numberInSurah)?.text;
                tafsirHTML += `
                    <div class="tafsir-ayah" data-ayah="${ayah.numberInSurah}">
                        <div class="original-ayah">${ayahText || ''} <span class="ayah-number">${convertToArabicNumbers(ayah.numberInSurah)}</span></div>
                        <div class="tafsir-text">${ayah.text}</div>
                    </div>
                `;
            });
            tafsirHTML += '</div>';
        } else {
            tafsirHTML += '<div class="alert alert-warning">لا يوجد تفسير متاح لهذه السورة.</div>';
        }
        
        tafsirContainer.innerHTML = tafsirHTML;
        tafsirContainer.style.direction = selectedTafsirInfo?.lang === 'ar' ? 'rtl' : 'ltr';
        tafsirContainer.className = `quran-text tafsir ${selectedTafsirInfo?.lang === 'ar' ? 'rtl-text' : 'ltr-text'}`;
    }
}

// تحميل قائمة القراء
function loadQuranReciters() {
    quranReciters = [
        { id: 'ar.alafasy', name: 'مشاري العفاسي', qiraat: 'حفص عن عاصم' },
        { id: 'ar.minshawi', name: 'محمد صديق المنشاوي', qiraat: 'حفص عن عاصم' },
        { id: 'ar.abdulbasit', name: 'عبد الباسط عبد الصمد', qiraat: 'حفص عن عاصم' },
        { id: 'ar.abdullahbasfar', name: 'عبد الله بصفر', qiraat: 'حفص عن عاصم' },
        { id: 'ar.shaatree', name: 'أبو بكر الشاطري', qiraat: 'حفص عن عاصم' },
        { id: 'ar.ahmedajamy', name: 'أحمد بن علي العجمي', qiraat: 'حفص عن عاصم' },
        { id: 'ar.husary', name: 'محمود خليل الحصري', qiraat: 'حفص عن عاصم' },
        { id: 'ar.husarymujawwad', name: 'محمود خليل الحصري (مجود)', qiraat: 'حفص عن عاصم' },
        { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي', qiraat: 'حفص عن عاصم' },
        { id: 'ar.muhammadayyoub', name: 'محمد أيوب', qiraat: 'حفص عن عاصم' },
        { id: 'ar.hudhaify', name: 'علي بن عبدالرحمن الحذيفي', qiraat: 'حفص عن عاصم' },
        { id: 'ar.ibrahimakhbar', name: 'إبراهيم الأخضر', qiraat: 'حفص عن عاصم' },
        { id: 'ar.saadalghamidi', name: 'سعد الغامدي', qiraat: 'حفص عن عاصم' },
        { id: 'ar.muhammadkhalialhusary', name: 'محمد خليل الحصري', qiraat: 'حفص عن عاصم' },
        { id: 'fr.leclerc', name: 'يوسف لوكليرك', qiraat: 'ورش عن نافع' },
        { id: 'ar.aymanswoaid', name: 'أيمن سويد', qiraat: 'قالون عن نافع' },
        { id: 'ar.hanirifai', name: 'هاني الرفاعي', qiraat: 'قالون عن نافع' },
        { id: 'dz.abubakraljazairi', name: 'أبوبكر الجزائري', qiraat: 'ورش عن نافع' },
        { id: 'dz.yassinaljazairi', name: 'ياسين الجزائري', qiraat: 'ورش عن نافع' },
        
        // إضافة المزيد من القراء من الموقع الإسلامي
        // حفص عن عاصم
        { id: 'ar.abdulrasheedsufi', name: 'عبد الرشيد صوفي', qiraat: 'حفص عن عاصم' },
        { id: 'ar.muhammadjibreel', name: 'محمد جبريل', qiraat: 'حفص عن عاصم' },
        { id: 'ar.muhammadsiddiqminshawi', name: 'محمد صديق المنشاوي (مجود)', qiraat: 'حفص عن عاصم' },
        { id: 'ar.mahmoudalibanna', name: 'محمود علي البنا', qiraat: 'حفص عن عاصم' },
        { id: 'ar.mahmoudeltablawy', name: 'محمود الطبلاوي', qiraat: 'حفص عن عاصم' },
        { id: 'ar.abdulsamadhussein', name: 'عبد الصمد حسين', qiraat: 'حفص عن عاصم' },
        { id: 'ar.mustafaismail', name: 'مصطفى إسماعيل', qiraat: 'حفص عن عاصم' },
        { id: 'ar.alialhuthaify', name: 'علي الحذيفي (مجود)', qiraat: 'حفص عن عاصم' },
        { id: 'ar.yasserdossari', name: 'ياسر الدوسري', qiraat: 'حفص عن عاصم' },
        { id: 'ar.fares3bbad', name: 'فارس عباد', qiraat: 'حفص عن عاصم' },
        { id: 'ar.waelraksan', name: 'وائل الركسان', qiraat: 'حفص عن عاصم' },
        
        // رواية ورش عن نافع
        { id: 'mr.ibrahimaldosari', name: 'إبراهيم الدوسري', qiraat: 'ورش عن نافع' },
        { id: 'ma.mohamedsabri', name: 'محمد صبري', qiraat: 'ورش عن نافع' },
        { id: 'tn.arradhwan', name: 'الرضوان التونسي', qiraat: 'ورش عن نافع' },
        { id: 'ma.muhammadrifai', name: 'محمد رفعت', qiraat: 'ورش عن نافع' },
        { id: 'ly.hanidarwish', name: 'هاني درويش الليبي', qiraat: 'ورش عن نافع' },
        
        // قالون عن نافع
        { id: 'tn.sahbi', name: 'صاحبي التونسي', qiraat: 'قالون عن نافع' },
        { id: 'tn.sheikhmohammad', name: 'الشيخ محمد التونسي', qiraat: 'قالون عن نافع' },
        { id: 'tn.abdulaziz', name: 'عبد العزيز التونسي', qiraat: 'قالون عن نافع' },
        
        // رواية الدوري عن أبي عمرو
        { id: 'eg.bassitrawi', name: 'باسط رواي', qiraat: 'الدوري عن أبي عمرو' },
        { id: 'sd.noreen', name: 'نورين السوداني', qiraat: 'الدوري عن أبي عمرو' },
        { id: 'sd.ibrahim', name: 'إبراهيم السوداني', qiraat: 'الدوري عن أبي عمرو' },
        
        // رواية السوسي عن أبي عمرو
        { id: 'eg.ahmad', name: 'أحمد المصري', qiraat: 'السوسي عن أبي عمرو' },
        
        // رواية شعبة عن عاصم
        { id: 'eg.shaaban', name: 'شعبان المصري', qiraat: 'شعبة عن عاصم' },
        { id: 'iq.khalaf', name: 'خلف العراقي', qiraat: 'شعبة عن عاصم' },
        
        // رواية الليثي عن أبي الحارث
        { id: 'sd.ibrahim2', name: 'إبراهيم السوداني الليثي', qiraat: 'الليثي عن أبي الحارث' },
        
        // رواية قنبل عن ابن كثير
        { id: 'sa.bandar', name: 'بندر السعودي', qiraat: 'قنبل عن ابن كثير' },
        
        // روايات أخرى
        { id: 'sa.hudhaifi', name: 'الحذيفي (رواية البزي)', qiraat: 'البزي عن ابن كثير' },
        { id: 'eg.ahmad2', name: 'أحمد المصري (رواية خلف عن حمزة)', qiraat: 'خلف عن حمزة' },
        { id: 'eg.taha', name: 'طه المصري (رواية روح عن يعقوب)', qiraat: 'روح عن يعقوب' }
    ];
    
    // تعبئة قائمة القراء
    const reciterSelect = document.getElementById('reciter-select');
    reciterSelect.innerHTML = '';
    
    // تجميع القراء حسب القراءة
    const qiraatGroups = {};
    quranReciters.forEach(reciter => {
        if (!qiraatGroups[reciter.qiraat]) {
            qiraatGroups[reciter.qiraat] = [];
        }
        qiraatGroups[reciter.qiraat].push(reciter);
    });
    
    // إضافة القراء في مجموعات
    for (const qiraat in qiraatGroups) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = qiraat;
        
        qiraatGroups[qiraat].forEach(reciter => {
            const option = document.createElement('option');
            option.value = reciter.id;
            option.textContent = reciter.name;
            optgroup.appendChild(option);
        });
        
        reciterSelect.appendChild(optgroup);
    }
}

// تحميل الترجمات المتاحة
function loadAvailableTranslations() {
    availableTranslations = [
        { id: 'en.sahih', language: 'الإنجليزية', name: 'صحيح انترناشونال', direction: 'ltr' },
        { id: 'fr.hamidullah', language: 'الفرنسية', name: 'حميد الله', direction: 'ltr' },
        { id: 'es.cortes', language: 'الإسبانية', name: 'كورتيس', direction: 'ltr' },
        { id: 'de.aburida', language: 'الألمانية', name: 'أبو ريدة', direction: 'ltr' },
        { id: 'ru.kuliev', language: 'الروسية', name: 'كولييف', direction: 'ltr' },
        { id: 'tr.diyanet', language: 'التركية', name: 'ديانت', direction: 'ltr' },
        { id: 'id.indonesian', language: 'الإندونيسية', name: 'وزارة الشؤون الدينية', direction: 'ltr' },
        { id: 'it.piccardo', language: 'الإيطالية', name: 'بيكاردو', direction: 'ltr' },
        { id: 'nl.keyzer', language: 'الهولندية', name: 'كيزر', direction: 'ltr' },
        { id: 'pt.elhayek', language: 'البرتغالية', name: 'الحايك', direction: 'ltr' },
        { id: 'ur.ahmedali', language: 'الأردية', name: 'أحمد علي', direction: 'rtl' },
        { id: 'hi.farooq', language: 'الهندية', name: 'محمد فاروق خان', direction: 'ltr' },
        { id: 'zh.jian', language: 'الصينية', name: 'محمد ما جيان', direction: 'ltr' },
        { id: 'ms.basmeih', language: 'الماليزية', name: 'باسميه', direction: 'ltr' },
        { id: 'bs.mlivo', language: 'البوسنية', name: 'مليفو', direction: 'ltr' },
        { id: 'ja.japanese', language: 'اليابانية', name: 'اليابانية', direction: 'ltr' },
        { id: 'ko.korean', language: 'الكورية', name: 'الكورية', direction: 'ltr' },
        { id: 'bn.bengali', language: 'البنغالية', name: 'البنغالية', direction: 'ltr' },
        { id: 'th.thai', language: 'التايلاندية', name: 'التايلاندية', direction: 'ltr' },
        { id: 'fa.makarem', language: 'الفارسية', name: 'مكارم شيرازي', direction: 'rtl' },
        { id: 'ku.asan', language: 'الكردية', name: 'برهان محمد أمين', direction: 'rtl' },
        { id: 'az.musayev', language: 'الأذربيجانية', name: 'موسايف', direction: 'ltr' },
        { id: 'ha.gumi', language: 'الهوسا', name: 'غومي', direction: 'ltr' },
        { id: 'sw.barwani', language: 'السواحيلية', name: 'الشيخ علي برواني', direction: 'ltr' },
        { id: 'so.abduh', language: 'الصومالية', name: 'عبده', direction: 'ltr' },
        { id: 'ml.abdulhameed', language: 'المالايالامية', name: 'عبد الحميد وكمال', direction: 'ltr' },
        { id: 'pl.bielawskiego', language: 'البولندية', name: 'بيلاوسكيغو', direction: 'ltr' },
        { id: 'sv.bernstrom', language: 'السويدية', name: 'برنستروم', direction: 'ltr' },
        { id: 'tg.ayati', language: 'الطاجيكية', name: 'آياتي', direction: 'ltr' },
        { id: 'ta.tamil', language: 'التاميلية', name: 'جان ترست', direction: 'ltr' },
        { id: 'ug.saleh', language: 'الأويغورية', name: 'محمد صالح', direction: 'rtl' },
        { id: 'uz.sodik', language: 'الأوزبكية', name: 'محمد صادق', direction: 'ltr' }
    ];

    // تعبئة قائمة اللغات
    const languageSelect = document.getElementById('translation-language');
    languageSelect.innerHTML = '';

    availableTranslations.forEach(translation => {
        const option = document.createElement('option');
        option.value = translation.id;
        option.textContent = translation.language + ' - ' + translation.name;
        languageSelect.appendChild(option);
    });
}

// تحميل التفاسير المتاحة
function loadAvailableTafsirs() {
    availableTafsirs = [
        { id: 'ar.muyassar', name: 'التفسير الميسر', author: 'مجمع الملك فهد لطباعة المصحف الشريف', lang: 'ar' },
        { id: 'ar.tabari', name: 'تفسير الطبري (جامع البيان)', author: 'أبو جعفر محمد بن جرير الطبري', lang: 'ar' },
        { id: 'ar.qurtubi', name: 'تفسير القرطبي (الجامع لأحكام القرآن)', author: 'أبو عبد الله محمد بن أحمد القرطبي', lang: 'ar' },
        { id: 'ar.ibnkathir', name: 'تفسير ابن كثير', author: 'عماد الدين إسماعيل بن عمر بن كثير', lang: 'ar' },
        { id: 'ar.saadi', name: 'تفسير السعدي', author: 'عبد الرحمن بن ناصر السعدي', lang: 'ar' },
        { id: 'ar.jalalayn', name: 'تفسير الجلالين', author: 'جلال الدين المحلي وجلال الدين السيوطي', lang: 'ar' },
        { id: 'ar.thalabi', name: 'تفسير الثعلبي', author: 'أبو إسحاق أحمد بن محمد الثعلبي', lang: 'ar' },
        { id: 'ar.baghawi', name: 'تفسير البغوي (معالم التنزيل)', author: 'الحسين بن مسعود البغوي', lang: 'ar' },
        { id: 'ar.zamakhshari', name: 'تفسير الزمخشري (الكشاف)', author: 'أبو القاسم محمود بن عمر الزمخشري', lang: 'ar' },
        { id: 'ar.razi', name: 'تفسير الرازي (مفاتيح الغيب)', author: 'فخر الدين الرازي', lang: 'ar' },
        { id: 'ar.ibnarabi', name: 'تفسير ابن عربي', author: 'محيي الدين ابن عربي', lang: 'ar' },
        { id: 'ar.baydawi', name: 'تفسير البيضاوي (أنوار التنزيل)', author: 'عبد الله بن عمر البيضاوي', lang: 'ar' },
        { id: 'ar.mawardi', name: 'تفسير الماوردي (النكت والعيون)', author: 'أبو الحسن علي بن محمد الماوردي', lang: 'ar' },
        { id: 'ar.nasafi', name: 'تفسير النسفي (مدارك التنزيل)', author: 'عبد الله بن أحمد النسفي', lang: 'ar' },
        { id: 'ar.shawkani', name: 'تفسير الشوكاني (فتح القدير)', author: 'محمد بن علي الشوكاني', lang: 'ar' },
        { id: 'ar.alusi', name: 'تفسير الألوسي (روح المعاني)', author: 'شهاب الدين محمود الألوسي', lang: 'ar' },
        { id: 'ar.ibnashur', name: 'تفسير ابن عاشور (التحرير والتنوير)', author: 'محمد الطاهر بن عاشور', lang: 'ar' },
        { id: 'ar.wasit', name: 'التفسير الوسيط', author: 'مجمع البحوث الإسلامية بالأزهر', lang: 'ar' },
        { id: 'ar.tanwir', name: 'تفسير التحرير والتنوير', author: 'محمد الطاهر بن عاشور', lang: 'ar' },
        { id: 'ar.kashani', name: 'تفسير المولى محسن الكاشاني', author: 'محسن الكاشاني', lang: 'ar' },
        { id: 'en.tafisr', name: 'Tafsir Ibn Kathir (English)', author: 'Ibn Kathir (Translated)', lang: 'en' },
        { id: 'ur.tafsir', name: 'تفسير ابن كثير (أردو)', author: 'ابن كثير (مترجم)', lang: 'ur' }
    ];

    // تعبئة قائمة التفاسير
    const tafsirSelect = document.getElementById('tafsir-select');
    tafsirSelect.innerHTML = '';

    // تجميع التفاسير حسب اللغة
    const tafsirsByLang = {};
    availableTafsirs.forEach(tafsir => {
        if (!tafsirsByLang[tafsir.lang]) {
            tafsirsByLang[tafsir.lang] = [];
        }
        tafsirsByLang[tafsir.lang].push(tafsir);
    });

    // إضافة التفاسير في مجموعات
    for (const lang in tafsirsByLang) {
        const langName = lang === 'ar' ? 'التفاسير العربية' : 
                       lang === 'en' ? 'التفاسير الإنجليزية' : 
                       lang === 'ur' ? 'التفاسير الأردية' : 'تفاسير أخرى';
        
        const optgroup = document.createElement('optgroup');
        optgroup.label = langName;
        
        tafsirsByLang[lang].forEach(tafsir => {
            const option = document.createElement('option');
            option.value = tafsir.id;
            option.textContent = `${tafsir.name} (${tafsir.author})`;
            optgroup.appendChild(option);
        });
        
        tafsirSelect.appendChild(optgroup);
    }
}

// تغيير وضع التشغيل (مستمر أو آية بآية)
function changePlaybackMode() {
    playbackMode = document.getElementById('playback-mode').checked ? 'ayah-by-ayah' : 'continuous';
}

// تشغيل التلاوة الصوتية للسورة المحددة
async function playQuranAudio() {
    const surahNumber = document.getElementById('surah-select').value;
    
    if (!surahNumber) {
        alert('الرجاء اختيار سورة أولاً');
        return;
    }
    
    const playBtn = document.getElementById('play-audio-btn');
    const reciterId = document.getElementById('reciter-select').value;
    
    if (isPlaying) {
        // إيقاف التلاوة إذا كانت قيد التشغيل
        if (audioPlayer) {
            audioPlayer.pause();
        }
        isPlaying = false;
        updatePlayButton();
        return;
    }
    
    try {
        // ظهور معلومات التحميل
        playBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> جاري التحميل...';
        
        // جلب روابط صوت الآيات إذا لم تكن محملة بعد
        if (ayahAudios.length === 0) {
            const response = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/${reciterId}`);
            
            if (response.data.code === 200) {
                const surah = response.data.data;
                
                if (surah.ayahs && surah.ayahs.length > 0) {
                    // حفظ روابط صوت كل آية
                    ayahAudios = surah.ayahs.map(ayah => ayah.audio);
                }
            }
        }
        
        if (ayahAudios.length > 0) {
            if (!audioPlayer) {
                audioPlayer = new Audio();
                
                // إضافة حدث انتهاء التشغيل
                audioPlayer.addEventListener('ended', onAudioEnded);
            }
            
            // تشغيل الآية الحالية
            playAyah(currentAyah);
            isPlaying = true;
            updatePlayButton();
        } else {
            throw new Error('لم يتم العثور على ملفات صوتية للسورة المحددة');
        }
    } catch (error) {
        console.error('خطأ في تحميل التلاوة:', error);
        playBtn.innerHTML = '<i class="fas fa-play me-2"></i> استماع للتلاوة';
        alert('حدث خطأ أثناء تحميل الملف الصوتي. يرجى المحاولة مرة أخرى.');
    }
}

// تشغيل آية محددة
function playAyah(ayahNumber) {
    if (ayahAudios.length === 0 || ayahNumber > ayahAudios.length || ayahNumber < 1) {
        return;
    }
    
    // تحديث الآية الحالية
    currentAyah = ayahNumber;
    
    // إلغاء تحديد جميع الآيات
    document.querySelectorAll('.ayah').forEach(el => {
        el.classList.remove('highlighted');
    });
    
    // تحديد الآية الحالية
    const currentElements = document.querySelectorAll(`.ayah[data-ayah="${ayahNumber}"]`);
    currentElements.forEach(el => {
        el.classList.add('highlighted');
        
        // تمرير إلى الآية الحالية
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    
    // تحديث عناصر التحكم
    document.getElementById('ayah-counter').textContent = `${convertToArabicNumbers(ayahNumber)} / ${convertToArabicNumbers(ayahAudios.length)}`;
    
    // تعيين مصدر الصوت وتشغيله
    audioPlayer.src = ayahAudios[ayahNumber - 1];
    audioPlayer.play();
}

// معالجة انتهاء تشغيل الصوت
function onAudioEnded() {
    if (playbackMode === 'continuous') {
        // الانتقال إلى الآية التالية في الوضع المستمر
        if (currentAyah < ayahAudios.length) {
            playAyah(currentAyah + 1);
        } else {
            // انتهت التلاوة
            isPlaying = false;
            updatePlayButton();
        }
    } else {
        // في وضع آية بآية، توقف بعد كل آية
        isPlaying = false;
        updatePlayButton();
    }
}

// تحديث زر التشغيل
function updatePlayButton() {
    const playBtn = document.getElementById('play-audio-btn');
    
    if (isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause me-2"></i> إيقاف التلاوة';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play me-2"></i> استماع للتلاوة';
    }
}

// تشغيل الآية التالية
function playNextAyah() {
    if (currentAyah < ayahAudios.length) {
        playAyah(currentAyah + 1);
        isPlaying = true;
        updatePlayButton();
    }
}

// تشغيل الآية السابقة
function playPrevAyah() {
    if (currentAyah > 1) {
        playAyah(currentAyah - 1);
        isPlaying = true;
        updatePlayButton();
    }
}

// معالجة تغيير القارئ
function onReciterChange() {
    // إيقاف التشغيل الحالي إذا كان موجودًا
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
    }
    
    // إعادة تعيين القيم
    isPlaying = false;
    currentAyah = 1;
    ayahAudios = [];
    updatePlayButton();
}

// تحويل الأرقام الإنجليزية إلى أرقام عربية
function convertToArabicNumbers(num) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumbers[digit] || digit).join('');
}