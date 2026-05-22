/* ==========================================================================
   銧碩科技 XIRI - Grid Dashboard Interactive JS Engine
   Handles: Page Routing, Dynamic Bottom Tab Injection, Left Modals,
            Spec Filtering, Chatbot Simulation, and Bilingual System
   ========================================================================== */

window.currentLanguage = 'ZH'; // Default system language

// 1. Configuration for pages and their respective dynamic bottom sub-tabs
const pageConfigs = {
    'page-about': {
        num: 1,
        titleZh: '關於銧碩',
        titleEn: 'About XIRI',
        subTabs: [
            { id: 'about-panel-1', titleZh: '01 永續綠能', descZh: '企業創立理念與低碳環保', titleEn: '01 Sustainability', descEn: 'Corporate R&D Philosophy' },
            { id: 'about-panel-2', titleZh: '02 企業願景', descZh: 'ESG 承諾與零污染未來', titleEn: '02 Vision & ESG', descEn: 'Eco commitment & Future' }
        ]
    },
    'page-tech': {
        num: 2,
        titleZh: '專利技術',
        titleEn: 'Patents & Tech',
        subTabs: [
            { id: 'tech-panel-1', titleZh: '01 微波裂解塔', descZh: '蓄熱熱處理與有機廢氣', titleEn: '01 Pyrolysis Tower', descEn: 'Microwave VOC Abatement' },
            { id: 'tech-panel-2', titleZh: '02 防回火均流', descZh: '專利隔絕防爆安全閥箱', titleEn: '02 Safe Inlet Valve', descEn: 'Explosion-Proof Valve' },
            { id: 'tech-panel-3', titleZh: '03 SCADA 系統', descZh: 'PLC自控盤智慧自動化', titleEn: '03 SCADA / PLC', descEn: 'Smart Automation Panel' },
            { id: 'tech-panel-4', titleZh: '04 防爆 LED', descZh: '高天棚防爆廠區智慧照明', titleEn: '04 Ex-Proof LED', descEn: 'High-Bay Factory Lighting' }
        ]
    },
    'page-projects': {
        num: 3,
        titleZh: '兩岸實績',
        titleEn: 'Cross-Strait',
        subTabs: [
            { id: 'proj-panel-1', titleZh: '01 台灣高精密', descZh: '半導體竹科中科專案實績', titleEn: '01 Taiwan High-Tech', descEn: 'Semiconductor Projects' },
            { id: 'proj-panel-2', titleZh: '02 山東保藍協力', descZh: '超低煙氣煙氣脫硫脫硝', titleEn: '02 Shandong Baolan', descEn: 'Air Pollution Synergy' }
        ]
    },
    'page-contact': {
        num: 4,
        titleZh: '聯絡我們',
        titleEn: 'Contact Us',
        subTabs: [
            { id: 'contact-panel-1', titleZh: '01 預約諮詢', descZh: '兩岸廠區客製技術估算', titleEn: '01 Schedule Meeting', descEn: 'Factory Energy & VOC Evaluation' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // A. Initialize Bilingual Toggler
    initLanguageSwitcher();
    
    // B. Launch Default Landing Page
    navigateToPage('page-about', 1);
});

// 2. High-Level Page Routing Switcher
window.navigateToPage = function(pageId, pageNum) {
    // A. Deactivate all page containers
    document.querySelectorAll('.page-container').forEach(page => {
        page.classList.remove('active');
    });
    
    // B. Activate requested page container
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // C. Synchronize Top Menu Link Active Styles
    document.querySelectorAll('.db-menu .menu-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeMenuBtn = document.getElementById(`nav-page-${pageNum}`);
    if (activeMenuBtn) {
        activeMenuBtn.classList.add('active');
    }
    
    // D. Dynamically inject bottom cards for this specific page
    injectBottomTabs(pageId);
    
    // E. Default active state to the first sub-tab card in the collection
    const config = pageConfigs[pageId];
    if (config && config.subTabs.length > 0) {
        const firstSubTab = config.subTabs[0];
        window.switchSubTab(firstSubTab.id, 0);
    }
    
    // F. Always shut down side modals during page navigation for clean visuals
    window.closeAllLeftModals();
};

// 3. Dynamic Bottom Cards Builder (Injected based on Active Page)
function injectBottomTabs(pageId) {
    const container = document.getElementById('db-dynamic-tabs-container');
    if (!container) return;
    
    container.innerHTML = ''; // Clean old nodes
    const config = pageConfigs[pageId];
    if (!config) return;
    
    const isEn = window.currentLanguage === 'EN';
    
    config.subTabs.forEach((tab, index) => {
        const cardBtn = document.createElement('button');
        cardBtn.className = `footer-tab-card ${index === 0 ? 'active' : ''}`;
        cardBtn.id = `sub-tab-card-${index}`;
        cardBtn.onclick = () => window.switchSubTab(tab.id, index);
        
        const cardIndex = document.createElement('span');
        cardIndex.className = 'tab-card-index';
        cardIndex.textContent = `0${index + 1}`;
        
        const cardContent = document.createElement('div');
        cardContent.className = 'tab-card-content';
        
        const cardTitle = document.createElement('span');
        cardTitle.className = 'tab-card-title';
        cardTitle.textContent = isEn ? tab.titleEn : tab.titleZh;
        
        const cardDesc = document.createElement('span');
        cardDesc.className = 'tab-card-desc';
        cardDesc.textContent = isEn ? tab.descEn : tab.descZh;
        
        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardDesc);
        
        const cardArrow = document.createElement('i');
        cardArrow.className = 'fa-solid fa-arrow-right-long tab-card-arrow';
        
        cardBtn.appendChild(cardIndex);
        cardBtn.appendChild(cardContent);
        cardBtn.appendChild(cardArrow);
        
        container.appendChild(cardBtn);
    });
}

// 4. Sub-Tab Panel Switcher (Controls Central Text and 3D Micro-interactions)
window.switchSubTab = function(panelId, idx) {
    const activePage = document.querySelector('.page-container.active');
    if (!activePage) return;
    
    // A. Shift Active Class on Content Panels
    activePage.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
    
    // B. Shift Active Class on Dynamic Bottom Tab Cards
    const cardsContainer = document.getElementById('db-dynamic-tabs-container');
    if (cardsContainer) {
        cardsContainer.querySelectorAll('.footer-tab-card').forEach((card, cIdx) => {
            if (cIdx === idx) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
    
    // C. Synchronize Active Index Display Numbers
    const pageId = activePage.id;
    const config = pageConfigs[pageId];
    if (config) {
        document.getElementById('footer-active-num').textContent = `0${idx + 1}`;
        document.getElementById('footer-total-num').textContent = `0${config.subTabs.length}`;
    }
    
    // D. Micro-interactions: Smoothly Rotate 3D Reactor Model and Move Badges
    const pageNum = config ? config.num : 1;
    const rotationAngle = (pageNum - 1) * 90 + idx * 18;
    const reactorImg = document.getElementById('reactor-visual-img');
    if (reactorImg) {
        reactorImg.style.transform = `scale(${1 - idx * 0.015}) rotate(${rotationAngle}deg)`;
    }
    
    const visualBadges = document.querySelectorAll('.visual-badge');
    visualBadges.forEach((badge, bIdx) => {
        const factor = (pageNum - 1) * 2 + idx + 1;
        const displacementX = factor * (bIdx + 1) * 6;
        const displacementY = factor * (bIdx + 1) * -4;
        badge.style.transform = `translate(${displacementX}px, ${displacementY}px)`;
    });
};

// 5. Bottom Navigation Indicator Arrows
window.slidePreviousSubTab = function() {
    const activePage = document.querySelector('.page-container.active');
    if (!activePage) return;
    const pageId = activePage.id;
    const config = pageConfigs[pageId];
    if (!config) return;
    
    const activePanel = activePage.querySelector('.tab-panel.active');
    let currentIndex = 0;
    if (activePanel) {
        currentIndex = config.subTabs.findIndex(tab => tab.id === activePanel.id);
    }
    
    let targetIndex = currentIndex - 1;
    if (targetIndex < 0) {
        targetIndex = config.subTabs.length - 1; // Wrap around to end
    }
    
    const targetSubTab = config.subTabs[targetIndex];
    window.switchSubTab(targetSubTab.id, targetIndex);
};

window.slideNextSubTab = function() {
    const activePage = document.querySelector('.page-container.active');
    if (!activePage) return;
    const pageId = activePage.id;
    const config = pageConfigs[pageId];
    if (!config) return;
    
    const activePanel = activePage.querySelector('.tab-panel.active');
    let currentIndex = 0;
    if (activePanel) {
        currentIndex = config.subTabs.findIndex(tab => tab.id === activePanel.id);
    }
    
    let targetIndex = currentIndex + 1;
    if (targetIndex >= config.subTabs.length) {
        targetIndex = 0; // Wrap around to front
    }
    
    const targetSubTab = config.subTabs[targetIndex];
    window.switchSubTab(targetSubTab.id, targetIndex);
};

// 6. Left Sidebar Modals Controllers
window.toggleLeftModal = function(modalId) {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;
    
    const isCurrentlyActive = overlay.classList.contains('active');
    
    // Close any other open modals first
    window.closeAllLeftModals();
    
    if (!isCurrentlyActive) {
        // Open the target modal
        overlay.classList.add('active');
        
        // Sync active styling on left sidebar icon
        document.querySelectorAll('.sidebar-left .side-icon').forEach(icon => {
            const clickAttr = icon.getAttribute('onclick');
            if (clickAttr && clickAttr.includes(modalId)) {
                icon.classList.add('active');
            }
        });
    }
};

window.closeLeftModal = function(event) {
    // Ensure modal closes only when background overlay is clicked directly
    if (event.target === event.currentTarget) {
        window.closeAllLeftModals();
    }
};

window.closeAllLeftModals = function() {
    document.querySelectorAll('.left-modal-overlay').forEach(overlay => {
        overlay.classList.remove('active');
    });
    
    document.querySelectorAll('.sidebar-left .side-icon').forEach(icon => {
        icon.classList.remove('active');
    });
};

// 7. Interactive Live Filter Spec Search Engine
window.filterSpecs = function() {
    const searchInput = document.getElementById('modal-search-input');
    if (!searchInput) return;
    
    const keyword = searchInput.value.trim().toLowerCase();
    const specItems = document.querySelectorAll('#spec-list .spec-item');
    
    specItems.forEach(item => {
        const titleText = item.querySelector('h4').textContent.toLowerCase();
        const bodyText = item.querySelector('p').textContent.toLowerCase();
        
        if (titleText.includes(keyword) || bodyText.includes(keyword)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
};

// 8. Dynamic Simulated Chatbot Assistant
window.handleChatKeyDown = function(event) {
    if (event.key === 'Enter') {
        window.sendChatMessage();
    }
};

window.sendChatMessage = function() {
    const chatInput = document.getElementById('chat-input-field');
    const chatBox = document.getElementById('chat-box');
    if (!chatInput || !chatBox) return;
    
    const messageText = chatInput.value.trim();
    if (!messageText) return;
    
    // A. Render User Bubble
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user';
    const userBubble = document.createElement('div');
    userBubble.className = 'msg-bubble';
    userBubble.textContent = messageText;
    userMsg.appendChild(userBubble);
    chatBox.appendChild(userMsg);
    
    // Clear Input
    chatInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // B. Render Typing Indicator
    const botMsg = document.createElement('div');
    botMsg.className = 'msg bot';
    const botBubble = document.createElement('div');
    botBubble.className = 'msg-bubble';
    botBubble.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
    botMsg.appendChild(botBubble);
    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // C. Deliver Intelligent Simulated Response based on Keywords
    setTimeout(() => {
        const lowerInput = messageText.toLowerCase();
        let botResponse = '';
        const isEn = window.currentLanguage === 'EN';
        
        if (isEn) {
            if (lowerInput.includes('microwave') || lowerInput.includes('pyrolysis') || lowerInput.includes('rto')) {
                botResponse = 'Our core patent is the **Regenerative Microwave Pyrolysis Tower (XIRI-M100)**. It couples rapid microwave heating with thermal storage, reducing energy consumption by **35%** compared to traditional RTO. VOC removal exceeds 99.9%.';
            } else if (lowerInput.includes('baolan') || lowerInput.includes('china') || lowerInput.includes('shandong')) {
                botResponse = 'Xiri is partnered with **Shandong Baolan Environmental Protection Group**, a national "Little Giant" enterprise. Together we build desulfurization, denitrification, and wet electrostatic precipitator plants for chemical and industrial projects.';
            } else if (lowerInput.includes('backfire') || lowerInput.includes('valve') || lowerInput.includes('safety')) {
                botResponse = 'Safety is paramount. Our patented **Anti-Backfire Gas Intake (XIRI-V50)** utilizes advanced fluid mix structures and automatic check valves to isolate pipeline fire risks.';
            } else if (lowerInput.includes('led') || lowerInput.includes('light') || lowerInput.includes('lighting')) {
                botResponse = 'We provide **EX d Explosion-Proof LED lighting** systems for hazardous zones. Integrating ambient light sensors and scheduling helps factories save up to **65%** in illumination power costs.';
            } else if (lowerInput.includes('phone') || lowerInput.includes('contact') || lowerInput.includes('call')) {
                botResponse = 'You can reach our Taiwan head office at **+886-37-688000**, or book an expert evaluation via the form in our Contact section!';
            } else {
                botResponse = 'Thank you for reaching out! XIRI Tech specializes in green technology, smart PLC panel integration, and air pollution controls with Shandong Baolan. Please feel free to test our Spec Search tool or fill out the Consultation form!';
            }
        } else {
            if (lowerInput.includes('微波') || lowerInput.includes('裂解') || lowerInput.includes('蓄熱') || lowerInput.includes('rto')) {
                botResponse = '我們的核心專利是**蓄熱式微波裂解塔 (XIRI-M100)**。結合高效率微波極速加熱與蓄熱裂解，比傳統 RTO **節省 35% 能耗**，VOCs 去除效率高達 **99.9%**。';
            } else if (lowerInput.includes('保藍') || lowerInput.includes('山東') || lowerInput.includes('合作')) {
                botResponse = '銧碩與中國大氣環保巨擘——**山東保藍環保集團**達成深度戰略合作，結合銧碩精密機械與保藍強大 EPC 總承包實力，共同在山東、江蘇聯手交付多套幹法脫硫脫硝與煙氣超低排放工程。';
            } else if (lowerInput.includes('回火') || lowerInput.includes('防爆') || lowerInput.includes('安全') || lowerInput.includes('閥箱')) {
                botResponse = '我們的專利**進氣輸入與均流防回火閥箱 (XIRI-V50)**，能有效混勻氣流，並具備精密單向阻火閥，從源頭徹底隔絕廢氣管道燃爆與回火風險。';
            } else if (lowerInput.includes('led') || lowerInput.includes('照明') || lowerInput.includes('節能') || lowerInput.includes('省電')) {
                botResponse = '我們專為易燃防爆等高危廠區提供國家級 **EX d 防爆認證的智慧 LED 高天棚照明系統**，搭配光感自動調光，最高可為廠區**省電達 65%**！';
            } else if (lowerInput.includes('電話') || lowerInput.includes('聯絡') || lowerInput.includes('地址') || lowerInput.includes('台灣')) {
                botResponse = '歡迎撥打我們的台灣總部電話：**+886-37-688000**，或親臨苗栗頭份建國廠。您也可以直接在『聯絡我們』分頁填寫表單，我們將派專屬工程師為您規劃。';
            } else {
                botResponse = '感謝您的提問！銧碩科技專注於專利綠能設備、PLC自控盤整合，並與山東保藍集團強強聯手。您可以點選左側『規格檢索』查看設備數據，或在『聯絡我們』填寫表單預約現場診斷！';
            }
        }
        
        botBubble.innerHTML = botResponse;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 850);
};

// 9. Contact Consultation Form Submit Handler
window.handleGridFormSubmit = function(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('g-submit-btn');
    const statusMsg = document.getElementById('g-status-msg');
    const name = document.getElementById('g-name').value;
    const company = document.getElementById('g-company').value;
    
    if (!submitBtn || !statusMsg) return;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = window.currentLanguage === 'EN' ? 
        'Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>' : 
        '傳送中... <i class="fa-solid fa-circle-notch fa-spin"></i>';
        
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = window.currentLanguage === 'EN' ? 
            'Submit Consultation <i class="fa-solid fa-paper-plane"></i>' : 
            '送出諮詢申請 <i class="fa-solid fa-paper-plane"></i>';
            
        statusMsg.className = 'form-status-msg success';
        
        if (window.currentLanguage === 'EN') {
            statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Request successfully submitted, ${name}! XIRI engineering specialists will contact you at ${company} shortly.`;
        } else {
            statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> 諮詢申請已成功送出！感謝您的預約，${name}。銧碩工程團隊將於最短時間內與貴公司（${company}）聯繫。`;
        }
        
        document.getElementById('db-contact-form').reset();
    }, 1200);
};

// 10. Instant Bilingual Translation Dictionary
const translationDict = {
    'ZH': {
        'txt-brand-title': '銧碩科技',
        'nav-page-1': '關於銧碩',
        'nav-page-2': '專利技術',
        'nav-page-3': '兩岸實績',
        'nav-page-4': '聯絡我們',
        'txt-header-order-btn': '預約諮詢',
        
        // Page 1
        'ab-tag-1': '<i class="fa-solid fa-seedling"></i> 永續綠能 • 專業研發',
        'ab-title-1': '科技綠能<br>銧耀永續生態',
        'ab-desc-1': '銧碩科技創立於 2013 年，以「銧」科技之光，照亮綠色製造的前景。我們是專業環境保護工程與污染防治設備研發者，融合先進的機械設計與智慧自控系統，致力於降低碳排與工業空汙，引領綠色工業革命。',
        'ab-btn-1': '探索專利技術 <i class="fa-solid fa-arrow-right-long"></i>',
        'ab-lbl-y': '創立年份',
        'ab-lbl-p': '研發發明專利',
        'ab-tag-2': '<i class="fa-solid fa-eye"></i> 企業願景 • 綠色地平線',
        'ab-title-2': '引領工業低碳<br>共築零汙染未來',
        'ab-desc-2': '我們的願景是成為亞太地區領先的綠色科技與環境治理指標廠商。我們深信工業發展與地球生態可以和諧共存，並持續透過前瞻的技術研發，協助各製造業工廠完成 ESG 轉型，守護乾淨的天空與水資源。',
        'ab-btn-2': '預約現場診斷 <i class="fa-solid fa-arrow-right-long"></i>',
        'ab-lbl-e': '綠色工藝指標',
        'ab-lbl-c': '永續發展承諾',
        
        // Page 2
        'te-tag-1': '<i class="fa-solid fa-microchip"></i> 專利蓄熱熱裂解設備',
        'te-title-1': '蓄熱微波裂解塔<br>VOCs 深度淨化',
        'te-desc-1': '本發明專利巧妙結合「微波極速加熱」與「蓄熱式高溫裂解」，讓揮發性有機廢氣分子在高溫蓄熱介質中均勻受熱、徹底裂解。**運行能耗相較傳統 RTO 降低高達 35%**，是高濃度 VOCs 去除的綠色黑科技。',
        'te-btn-1': '查看規格說明 <i class="fa-solid fa-arrow-right-long"></i>',
        'te-lbl-e': 'VOCs 去除效率',
        'te-lbl-s': '運轉能耗節省',
        'te-tag-2': '<i class="fa-solid fa-shield-halved"></i> 專利進氣與防爆防回火',
        'te-title-2': '防回火均流閥箱<br>徹底隔絕燃爆隱憂',
        'te-desc-2': '工業廢氣濃度波動劇烈，容易引起管道回火燃燒。本專利進氣輸入裝置，採用特殊的流體力學均流設計與精密單向阻火閥門，能確保氣流穩定，從源頭徹底杜絕逆流回燃危險，保障廠區運轉安全。',
        'te-btn-2': '索取技術樣冊 <i class="fa-solid fa-arrow-right-long"></i>',
        'te-lbl-sf': '最高安全等級',
        'te-lbl-m': '風阻混勻度提升',
        'te-tag-3': '<i class="fa-solid fa-gears"></i> 智慧控制系統整合',
        'te-title-3': 'PLC/SCADA 控制盤<br>無人化智慧監控',
        'te-desc-3': '專為環境工程打造的精密儀表盤與 PLC 自控系統，無縫整合了溫度、壓力、風量感測，可將整套廢氣設備接入中央 SCADA 中控室，支援變頻智慧風控與雲端異常警報，實現無人值守智慧運維。',
        'te-btn-3': '洽詢系統自控盤 <i class="fa-solid fa-arrow-right-long"></i>',
        'te-lbl-mo': '動態自動監測',
        'te-lbl-i': '工業物聯網架構',
        'te-tag-4': '<i class="fa-solid fa-lightbulb"></i> 廠區節能照明系統',
        'te-title-4': '高天棚防爆 LED<br>智慧節電省電照明',
        'te-desc-4': '針對化學、半導體與噴漆等易燃防爆高危險區域，提供國家標準認證的防爆智慧 LED 照明系統。搭配環境光感與時序自動調光，高光效、極低功耗，協助工廠減少高額經常性照明電力支出。',
        'te-btn-4': '預約照度節能估算 <i class="fa-solid fa-arrow-right-long"></i>',
        'te-lbl-ex': '國家級防爆認證',
        'te-lbl-sv': '最大照明省電率',
        
        // Page 3
        'pr-tag-1': '<i class="fa-solid fa-city"></i> 台灣半導體與高精密廠區',
        'pr-title-1': '高精密製程<br>VOCs 減排系統',
        'pr-desc-1': '銧碩科技在台灣竹科、中科等高精密半導體和電子製程廠區中，成功部署了多套客製化污染防治與 PLC 自動化自控盤，為各大上市公司提供合規、低耗且高度安全的廢氣收集治理工程。',
        'pr-btn-1': '諮詢半導體方案 <i class="fa-solid fa-arrow-right-long"></i>',
        'pr-lbl-a': '工程合規驗收',
        'pr-lbl-d': '高無塵室安全級',
        'pr-tag-2': '<i class="fa-solid fa-globe"></i> 戰略合作 • 中國省市佈局',
        'pr-title-2': '戰合山東保藍集團<br>聯手超低排放工程',
        'pr-desc-2': '我們與中國大氣環保巨擘——國家級專精特新「小巨人」**山東保藍集團（保藍環保）**達成了深度戰略合作。憑藉銧碩的精密機械研發與微波技術，配合保藍集團強大的 EPC 總承包實力，聯手在山東、江蘇等省市交付多套催化燃燒、煙氣電磁脫白與煙氣幹法脫硫脫硝項目。',
        'pr-btn-2': '檢視兩岸聯絡地圖 <i class="fa-solid fa-arrow-right-long"></i>',
        'pr-lbl-c': '共同協作大型案',
        'pr-lbl-p': '山東淄博技術配合',
        
        // Page 4
        'co-tag-1': '<i class="fa-solid fa-envelope"></i> 綠色轉型 • 即刻啟動',
        'co-title-1': '預約諮詢<br>客製技術評估',
        'g-submit-btn': '送出諮詢申請 <i class="fa-solid fa-paper-plane"></i>',
        
        // Badges
        'v-badge-1': '微波蓄熱專利',
        'v-badge-2': '省電 35%',
        'v-badge-3': '保藍環保配合'
    },
    'EN': {
        'txt-brand-title': 'XIRI Tech',
        'nav-page-1': 'About XIRI',
        'nav-page-2': 'Patents & Tech',
        'nav-page-3': 'Cross-Strait',
        'nav-page-4': 'Contact Us',
        'txt-header-order-btn': 'Consult Now',
        
        // Page 1
        'ab-tag-1': '<i class="fa-solid fa-seedling"></i> Sustainable Energy • Professional R&D',
        'ab-title-1': 'Green Energy<br>Sustaining Ecology',
        'ab-desc-1': 'Founded in 2013, Xiri Tech lights up green manufacturing with technology. As specialized environmental engineering and pollution abatement R&D leaders, we integrate machinery design and smart automation to lower carbon footprints and pioneer industrial revolution.',
        'ab-btn-1': 'Explore Patents & Tech <i class="fa-solid fa-arrow-right-long"></i>',
        'ab-lbl-y': 'Founded Year',
        'ab-lbl-p': 'Core Patents',
        'ab-tag-2': '<i class="fa-solid fa-eye"></i> Corporate Vision • ESG Horizon',
        'ab-title-2': 'Pioneering Low Emission<br>Co-building a Clean Future',
        'ab-desc-2': 'Our vision is to become the leading green tech and environmental treatment brand in the Asia-Pacific. We firmly believe industrial development can harmoniously coexist with Earth\'s ecosystems, continuing R&D to support manufacturer ESG transformations.',
        'ab-btn-2': 'Book Evaluation <i class="fa-solid fa-arrow-right-long"></i>',
        'ab-lbl-e': 'Green Process Index',
        'ab-lbl-c': 'ESG Commitment',
        
        // Page 2
        'te-tag-1': '<i class="fa-solid fa-microchip"></i> Patented RTO Microwave Pyrolysis',
        'te-title-1': 'Microwave Reactor<br>VOC Deep Purifying',
        'te-desc-1': 'This proprietary patent combines rapid microwave heating with regenerative pyrolysis, ensuring VOC molecules disintegrate evenly. **Operation cost is reduced by up to 35%** compared to traditional RTO, representing a breakthrough in carbon reduction.',
        'te-btn-1': 'View Specifications <i class="fa-solid fa-arrow-right-long"></i>',
        'te-lbl-e': 'VOC Removal Rate',
        'te-lbl-s': 'Energy Cost Saved',
        'te-tag-2': '<i class="fa-solid fa-shield-halved"></i> Patented Explosion-Proof Intake',
        'te-title-2': 'Anti-Backfire System<br>Preventing Pipeline Explosions',
        'te-desc-2': 'Industrial waste gas concentrations fluctuate wildly, posing backfire risks. Our patented intake uses advanced fluid mix structures and precision backfire check valves to stabilize flow and isolate explosion risks.',
        'te-btn-2': 'Request Brochure <i class="fa-solid fa-arrow-right-long"></i>',
        'te-lbl-sf': 'Safety Integrity Level',
        'te-lbl-m': 'Air Distribution Mix',
        'te-tag-3': '<i class="fa-solid fa-gears"></i> Smart Automation Integration',
        'te-title-3': 'PLC/SCADA Control Panel<br>Smart Remote Operations',
        'te-desc-3': 'Precision panels and PLC automation built for harsh environmental engineering. It seamlessly integrates temp, pressure, and gas flow inputs, bringing full status controls to SCADA and enabling cloud alerts.',
        'te-btn-3': 'Inquire SCADA Panel <i class="fa-solid fa-arrow-right-long"></i>',
        'te-lbl-mo': 'Dynamic Monitoring',
        'te-lbl-i': 'Industrial IoT Architecture',
        'te-tag-4': '<i class="fa-solid fa-lightbulb"></i> Eco-Friendly Factory Lighting',
        'te-title-4': 'Ex High-Bay LED<br>Intelligent Power Saving',
        'te-desc-4': 'Explosion-proof LED lighting systems certified to national and international standards for chemical, coating, and electronics hazard zones. Features ambient sensing and dimming to cut overhead power expenses.',
        'te-btn-4': 'Get Energy Evaluation <i class="fa-solid fa-arrow-right-long"></i>',
        'te-lbl-ex': 'Explosion-proof Cert',
        'te-lbl-sv': 'Max Power Saving Rate',
        
        // Page 3
        'pr-tag-1': '<i class="fa-solid fa-city"></i> Taiwan High-Tech Fabrication Sites',
        'pr-title-1': 'High Precision Fab<br>VOC Abatement Projects',
        'pr-desc-1': 'Xiri Tech has successfully deployed multiple custom environmental projects and PLC automation control panels in Hsinchu Science Park (HSP) and Central Taiwan Science Park (CTSP), delivering compliance and safety for listed electronics firms.',
        'pr-btn-1': 'Inquire High-Tech Solutions <i class="fa-solid fa-arrow-right-long"></i>',
        'pr-lbl-a': 'Compliance Audit Pass',
        'pr-lbl-d': 'Cleanroom Safety Level',
        'pr-tag-2': '<i class="fa-solid fa-globe"></i> Strategic Cross-Strait Engineering Synergy',
        'pr-title-2': 'Partnered with Baolan Group<br>Low Emission Plant Projects',
        'pr-desc-2': 'We have formed a deep strategic engineering partnership with Shandong Baolan Group (Baolan Environmental), a recognized national "Little Giant" enterprise in industrial emission control. Combining Xiri\'s microwave R&D with Baolan\'s massive EPC capacity, we co-deliver low-emission desulfurization and wet electrostatic precipitator projects across Shandong and Jiangsu provinces.',
        'pr-btn-2': 'View Cross-Strait Map <i class="fa-solid fa-arrow-right-long"></i>',
        'pr-lbl-c': 'Collaborative Megaprojects',
        'pr-lbl-p': 'Zibo Technical Alliance',
        
        // Page 4
        'co-tag-1': '<i class="fa-solid fa-envelope"></i> Eco Transition • Start Now',
        'co-title-1': 'Request Technical Consultation<br>& Onsite Assessment',
        'g-submit-btn': 'Submit Consultation <i class="fa-solid fa-paper-plane"></i>',
        
        // Badges
        'v-badge-1': 'Microwave Patents',
        'v-badge-2': 'Save Energy 35%',
        'v-badge-3': 'Baolan Synergy'
    }
};

function initLanguageSwitcher() {
    const langBtn = document.getElementById('lang-switch-btn');
    if (!langBtn) return;
    
    langBtn.addEventListener('click', () => {
        if (window.currentLanguage === 'ZH') {
            window.currentLanguage = 'EN';
            langBtn.textContent = 'ZH'; // Show target translation action on button
            applyTranslations('EN');
        } else {
            window.currentLanguage = 'ZH';
            langBtn.textContent = 'EN'; // Show target translation action on button
            applyTranslations('ZH');
        }
        
        // Refresh dynamically injected bottom tabs to switch language immediately
        const activePage = document.querySelector('.page-container.active');
        if (activePage) {
            const activePanel = activePage.querySelector('.tab-panel.active');
            const currentSubId = activePanel ? activePanel.id : null;
            
            injectBottomTabs(activePage.id);
            
            if (currentSubId) {
                const config = pageConfigs[activePage.id];
                const index = config.subTabs.findIndex(tab => tab.id === currentSubId);
                if (index !== -1) {
                    window.switchSubTab(currentSubId, index);
                }
            }
        }
    });
}

function applyTranslations(lang) {
    const t = translationDict[lang];
    if (!t) return;
    
    const isEn = lang === 'EN';
    
    // A. Apply standard ID translation mappings
    Object.keys(t).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = t[id];
        }
    });
    
    // B. Apply input placeholders & select elements translations
    const nameInput = document.getElementById('g-name');
    const compInput = document.getElementById('g-company');
    const emailInput = document.getElementById('g-email');
    const phoneInput = document.getElementById('g-phone');
    const serviceSelect = document.getElementById('g-service');
    const searchInput = document.getElementById('modal-search-input');
    const chatInput = document.getElementById('chat-input-field');
    
    if (isEn) {
        if (nameInput) nameInput.placeholder = 'Your Name *';
        if (compInput) compInput.placeholder = 'Company Name *';
        if (emailInput) emailInput.placeholder = 'Email Address *';
        if (phoneInput) phoneInput.placeholder = 'Contact Phone *';
        if (searchInput) searchInput.placeholder = 'Type keywords, e.g., microwave, RTO, valve';
        if (chatInput) chatInput.placeholder = 'Ask a question, e.g. microwave, energy...';
        
        if (serviceSelect && serviceSelect.options.length >= 6) {
            serviceSelect.options[0].text = 'Select Required Service *';
            serviceSelect.options[1].text = 'VOCs Abatement & Microwave Equipment';
            serviceSelect.options[2].text = 'PLC / SCADA Smart Systems Integration';
            serviceSelect.options[3].text = 'Smart LED Factory Lighting Solutions';
            serviceSelect.options[4].text = 'Mechanical & Electrical Installations';
            serviceSelect.options[5].text = 'Cross-Strait Synergy & Baolan Coops';
        }
    } else {
        if (nameInput) nameInput.placeholder = '您的姓名 *';
        if (compInput) compInput.placeholder = '公司名稱 *';
        if (emailInput) emailInput.placeholder = '電子郵件 *';
        if (phoneInput) phoneInput.placeholder = '聯絡電話 *';
        if (searchInput) searchInput.placeholder = '輸入關鍵字，例如：微波、蓄熱、防回火';
        if (chatInput) chatInput.placeholder = '輸入您的提問，例如：微波裂解塔、節能...';
        
        if (serviceSelect && serviceSelect.options.length >= 6) {
            serviceSelect.options[0].text = '請選擇您需要的服務 *';
            serviceSelect.options[1].text = 'VOCs 廢氣治理與微波設備諮詢';
            serviceSelect.options[2].text = 'PLC / SCADA 自動控制與系統整合';
            serviceSelect.options[3].text = '智慧 LED 節能照明規劃';
            serviceSelect.options[4].text = '廠務機電配管配電動力安裝';
            serviceSelect.options[5].text = '兩岸專案協力合作 (保藍配合)';
        }
    }
    
    // C. Apply Modal Titles and Content Text translations
    // Spec Search Modal
    const specHeader = document.querySelector('#modal-spec h3');
    const specDesc = document.querySelector('#modal-spec p');
    if (specHeader) specHeader.innerHTML = isEn ? '<i class="fa-solid fa-file-invoice"></i> Engineering Spec Search' : '<i class="fa-solid fa-file-invoice"></i> 工程設備規格快速檢索';
    if (specDesc) specDesc.textContent = isEn ? 'Please enter or select environmental engineering specifications and patent IDs:' : '請輸入或選取欲查詢的工業環境工程設備技術規格與專利證號：';
    
    const specList = document.getElementById('spec-list');
    if (specList) {
        if (isEn) {
            specList.innerHTML = `
                <div class="spec-item">
                    <h4>Microwave Pyrolysis Reactor — XIRI-M100</h4>
                    <p>Patent ID: I6543210. Treatment capacity: 50-1000 CMM. Saves 35% operational energy compared to standard RTO. VOC removal efficiency: 99.9%.</p>
                </div>
                <div class="spec-item">
                    <h4>Anti-Backfire Gas Intake — XIRI-V50</h4>
                    <p>Patent ID: I7865432. Equipped with dynamic air distribution and high-precision fire arresters. Safe backfire prevention rate +200%.</p>
                </div>
                <div class="spec-item">
                    <h4>SCADA Smart PLC Control Panel</h4>
                    <p>Based on PLC and Industrial IoT. Supports 24h real-time monitoring and cloud-based emergency alarms.</p>
                </div>
            `;
        } else {
            specList.innerHTML = `
                <div class="spec-item">
                    <h4>蓄熱式微波裂解塔 — XIRI-M100</h4>
                    <p>專利證號：I6543210。廢氣風量：50-1000 CMM，能耗較傳統 RTO 節省 35%，VOCs 去除率 99.9%。</p>
                </div>
                <div class="spec-item">
                    <h4>均流防回火閥箱 — XIRI-V50</h4>
                    <p>專利證號：I7865432。配備物理氣流均勻裝置與精密防爆阻火器，安全防回火回燃係數提升 200%。</p>
                </div>
                <div class="spec-item">
                    <h4>SCADA 智慧自動化控制盤</h4>
                    <p>基於 PLC 及工業物聯網架構，支援 24 小時動態感測監控與雲端安全報警系統。</p>
                </div>
            `;
        }
        // Re-apply keyword filter on switch if active
        window.filterSpecs();
    }
    
    // Call Direct Dial Modal
    const callHeader = document.querySelector('#modal-call h3');
    const callBody = document.querySelector('#modal-call .modal-body');
    if (callHeader) callHeader.innerHTML = isEn ? '<i class="fa-solid fa-phone-volume"></i> Cross-Strait Fast Call' : '<i class="fa-solid fa-phone-volume"></i> 兩岸廠區快速電話聯絡';
    if (callBody) {
        if (isEn) {
            callBody.innerHTML = `
                <div class="phone-card">
                    <span class="region-lbl">Taiwan HQ Site</span>
                    <h4>Miaoli Toufen Jianguo Plant</h4>
                    <p class="phone-num"><i class="fa-solid fa-phone"></i> +886-37-688000</p>
                    <p class="working-time">Service Hours: Mon-Fri 08:30 - 17:30 (GMT+8)</p>
                    <a href="tel:+88637688000" class="call-action-btn">Call Now</a>
                </div>
                <div class="phone-card">
                    <span class="region-lbl">China Strategic Engineering Center</span>
                    <h4>Shandong Zibo Liaison Office</h4>
                    <p class="phone-num"><i class="fa-solid fa-phone-flip"></i> 0533-XXXXXXX</p>
                    <p class="working-time">Collaborating with Shandong Baolan Environmental for low emission EPCs</p>
                </div>
            `;
        } else {
            callBody.innerHTML = `
                <div class="phone-card">
                    <span class="region-lbl">台灣總部廠區</span>
                    <h4>苗栗頭份建國廠</h4>
                    <p class="phone-num"><i class="fa-solid fa-phone"></i> +886-37-688000</p>
                    <p class="working-time">服務時間：週一至週五 08:30 - 17:30</p>
                    <a href="tel:+88637688000" class="call-action-btn">撥打電話</a>
                </div>
                <div class="phone-card">
                    <span class="region-lbl">中國工程戰略協作點</span>
                    <h4>山東保藍山東淄博聯絡點</h4>
                    <p class="phone-num"><i class="fa-solid fa-phone-flip"></i> 0533-XXXXXXX</p>
                    <p class="working-time">配合山東保藍環保有限公司執行大氣防治專案</p>
                </div>
            `;
        }
    }
    
    // Plant Address & Map Modal
    const mapHeader = document.querySelector('#modal-map h3');
    const mapBody = document.querySelector('#modal-map .modal-body');
    if (mapHeader) mapHeader.innerHTML = isEn ? '<i class="fa-solid fa-map-location-dot"></i> Xiri Tech Plant Locations' : '<i class="fa-solid fa-map-location-dot"></i> 銧碩科技兩岸廠務地圖';
    if (mapBody) {
        if (isEn) {
            mapBody.innerHTML = `
                <div class="address-row">
                    <div class="addr-box">
                        <span class="badge green">Taiwan HQ</span>
                        <h4>No. 176, Sec. 2, Jianguo Rd., Toufen City, Miaoli County</h4>
                        <p>Unified Business No: 54264936 • Certified Class-A Electrical and Fire Safety engineering credentials.</p>
                        <a href="https://maps.google.com/?q=No. 176, Sec. 2, Jianguo Rd., Toufen City, Miaoli County" target="_blank" class="map-link-btn">Open in Google Maps <i class="fa-solid fa-up-right-from-square"></i></a>
                    </div>
                    <div class="addr-box">
                        <span class="badge blue">Shandong Strategic Partner</span>
                        <h4>Shandong Baolan Environmental Protection Co., Ltd.</h4>
                        <p>Baolan Mansion, Zhangdian District, Zibo City, Shandong • State-recognized "Little Giant" enterprise, co-building flue-gas desulfurization & low-emission projects.</p>
                    </div>
                </div>
            `;
        } else {
            mapBody.innerHTML = `
                <div class="address-row">
                    <div class="addr-box">
                        <span class="badge green">台灣總部</span>
                        <h4>苗栗縣頭份市建國路二段176號</h4>
                        <p>統一編號：54264936 • 特約甲級電器與消防安全工程施工資質。</p>
                        <a href="https://maps.google.com/?q=苗栗縣頭份市建國路二段176號" target="_blank" class="map-link-btn">開啟 Google Map <i class="fa-solid fa-up-right-from-square"></i></a>
                    </div>
                    <div class="addr-box">
                        <span class="badge blue">山東戰合夥伴</span>
                        <h4>山東保藍環保有限公司</h4>
                        <p>山東省淄博市張店區山東保藍大樓 • 國家級專精特新小巨人，共同建置大型除塵脫白與超低排放項目。</p>
                    </div>
                </div>
            `;
        }
    }
    
    // Chatbot Modal
    const chatHeader = document.querySelector('#modal-chat h3');
    if (chatHeader) chatHeader.innerHTML = isEn ? '<i class="fa-solid fa-comments"></i> XIRI Smart Eco Assistant' : '<i class="fa-solid fa-comments"></i> 銧碩智慧綠能小幫手';
    
    const chatBox = document.getElementById('chat-box');
    if (chatBox && chatBox.children.length === 1) {
        const bubble = chatBox.querySelector('.msg.bot .msg-bubble');
        if (bubble) {
            bubble.innerHTML = isEn ? 
                'Hello! I am XIRI\'s intelligent assistant. Which green tech or Cross-Strait (Baolan Group) collaboration project are you interested in?' : 
                '您好！我是銧碩科技的智能助手。請問您對哪一項綠色科技或兩岸（保藍集團）合作項目有興趣？';
        }
    }
}
