// Data management for portfolio
class PortfolioDataManager {
    constructor() {
        this.data = {};
        this.currentLanguage = 'en';
    }

    async loadData() {
        try {
            const response = await fetch('data/portfolio.json');
            if (!response.ok) {
                throw new Error('Failed to load portfolio data');
            }
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            // Fallback to default data if JSON loading fails
            this.data = this.getDefaultData();
            return this.data;
        }
    }

    setLanguage(language) {
        this.currentLanguage = language;
    }

    getText(path) {
        const keys = path.split('.');
        let value = this.data;
        
        for (const key of keys) {
            if (value && typeof value === 'object') {
                value = value[key];
            } else {
                return '';
            }
        }
        
        // If the value is an object with language keys, return the current language
        if (value && typeof value === 'object' && value[this.currentLanguage]) {
            return value[this.currentLanguage];
        }
        
        // If it's a string, return as is
        if (typeof value === 'string') {
            return value;
        }
        
        return '';
    }

    getProjects() {
        return this.data.projects || [];
    }

    getSkills() {
        return this.data.skills || { frontend: [], backend: [] };
    }

    getEducation() {
        return this.data.education || [];
    }

    getFuturePlans() {
        return this.data.futurePlans || [];
    }

    getDefaultData() {
        // Fallback data in case JSON fails to load
        return {
            personal: {
                name: "Khamko",
                tagline: {
                    en: "Photographer | Web Developer | Lifelong Learner",
                    vi: "Nhiếp Ảnh Gia | Lập Trình Viên Web | Học Hỏi Suốt Đời",
                    lo: "ຊ່າງພາບ | ນັກພັດທະນາເວັບ | ຜູ້ຮຽນຮູ້ຕະຫຼອດຊີວິດ",
                    zh: "摄影师 | 网页开发者 | 终身学习者",
                    th: "ช่างภาพ | นักพัฒนาเว็บ | ผู้เรียนรู้ตลอดชีวิต"
                },
                about: {
                    text1: {
                        en: "Hello! I'm Khamko, a passionate photographer, front-end developer, and travel enthusiast. I love capturing the world through my lens and translating creative ideas into beautiful, functional websites.",
                        vi: "Xin chào! Tôi là Khamko, một nhiếp ảnh gia đam mê, nhà phát triển front-end và người đam mê du lịch. Tôi thích ghi lại thế giới qua ống kính và chuyển đổi những ý tưởng sáng tạo thành những trang web đẹp mắt và chức năng.",
                        lo: "ສະບາຍດີ! ຂ້ອຍແມ່ນ Khamko, ຊ່າງພາບທີ່ມີໄຟໃນຮ້ອງ, ນັກພັດທະນາ front-end ແລະ ຜູ້ໃຈຮັກການທ່ອງທ່ຽວ.",
                        zh: "你好！我是Khamko，一名充满激情的摄影师、前端开发者和旅行爱好者。",
                        th: "สวัสดี! ฉันคือ Khamko ช่างภาพที่มีความหลงใหล นักพัฒนา front-end และผู้รักการท่องเที่ยว"
                    },
                    text2: {
                        en: "My journey in photography allows me to explore new perspectives, while coding challenges me to bring designs to life with a focus on user experience.",
                        vi: "Hành trình nhiếp ảnh của tôi cho phép tôi khám phá những góc nhìn mới, trong khi lập trình thách thức tôi biến thiết kế thành hiện thực.",
                        lo: "ການເດີນທາງໃນການຖ່າຍຮູບຂອງຂ້ອຍເຮັດໃຫ້ຂ້ອຍສາມາດສຳຫຼວດທັດສະນະໃໝ່.",
                        zh: "我的摄影之旅让我能够探索新的视角，而编程挑战我将设计变为现实。",
                        th: "การเดินทางในการถ่ายภาพของฉันช่วยให้ฉันสำรวจมุมมองใหม่ ๆ"
                    }
                }
            },
            projects: [],
            skills: { frontend: [], backend: [] },
            education: [],
            futurePlans: []
        };
    }
}

// Initialize data manager
const portfolioDataManager = new PortfolioDataManager();

// Function to render dynamic content
async function renderPortfolioContent() {
    await portfolioDataManager.loadData();
    
    // Update personal info
    updatePersonalInfo();
    
    // Update projects
    updateProjects();
    
    // Update skills
    updateSkills();
    
    // Update education
    updateEducation();
    
    // Update future plans
    updateFuturePlans();
}

function updatePersonalInfo() {
    // Update tagline
    const taglineElement = document.querySelector('[data-key="tagline"]');
    if (taglineElement) {
        taglineElement.textContent = portfolioDataManager.getText('personal.tagline');
    }
    
    // Update about texts
    const aboutText1Element = document.querySelector('[data-key="aboutText1"]');
    if (aboutText1Element) {
        aboutText1Element.textContent = portfolioDataManager.getText('personal.about.text1');
    }
    
    const aboutText2Element = document.querySelector('[data-key="aboutText2"]');
    if (aboutText2Element) {
        aboutText2Element.textContent = portfolioDataManager.getText('personal.about.text2');
    }
}

function updateProjects() {
    const projects = portfolioDataManager.getProjects();
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (portfolioGrid && projects.length > 0) {
        portfolioGrid.innerHTML = '';
        
        projects.forEach((project, index) => {
            const projectElement = document.createElement('div');
            projectElement.className = 'portfolio-item';
            projectElement.innerHTML = `
                <img src="${project.image}" alt="${project.title?.[portfolioDataManager.currentLanguage] || 'Project'}" loading="lazy">
                <div class="portfolio-item-info">
                    <h3>${project.title?.[portfolioDataManager.currentLanguage] || 'Untitled Project'}</h3>
                    <p>${project.description?.[portfolioDataManager.currentLanguage] || 'No description available'}</p>
                    ${project.technologies ? `<div class="technologies">${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</div>` : ''}
                    <div class="project-links">
                        ${project.link && project.link !== '#' ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                        ${project.github && project.github !== '#' ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Code</a>` : ''}
                    </div>
                </div>
            `;
            portfolioGrid.appendChild(projectElement);
        });
    }
}

function updateSkills() {
    const skills = portfolioDataManager.getSkills();
    
    // Update frontend skills
    updateSkillCategory('frontend', skills.frontend || []);
    
    // Update backend skills  
    updateSkillCategory('backend', skills.backend || []);
}

function updateSkillCategory(category, skillsArray) {
    const categoryElement = document.querySelector(`[data-key="${category}Dev"]`)?.closest('.skill-category');
    if (!categoryElement || skillsArray.length === 0) return;
    
    // Find or create skills container
    let skillsContainer = categoryElement.querySelector('.skills-container');
    if (!skillsContainer) {
        skillsContainer = document.createElement('div');
        skillsContainer.className = 'skills-container';
        categoryElement.appendChild(skillsContainer);
    }
    
    skillsContainer.innerHTML = '';
    
    skillsArray.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item';
        skillElement.innerHTML = `
            <span>${skill.name}</span>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.level}%"></div>
            </div>
        `;
        skillsContainer.appendChild(skillElement);
    });
}

function updateEducation() {
    const education = portfolioDataManager.getEducation();
    const timeline = document.querySelector('.timeline');
    
    if (timeline && education.length > 0) {
        timeline.innerHTML = '';
        
        education.forEach((edu, index) => {
            const eduElement = document.createElement('div');
            eduElement.className = `timeline-item ${edu.position || 'left'}`;
            eduElement.innerHTML = `
                <div class="timeline-content">
                    <h3>${edu.period}</h3>
                    ${edu.title ? `<p><b>${edu.title[portfolioDataManager.currentLanguage] || edu.title.en}</b></p>` : ''}
                    ${edu.role ? `<p><b>${edu.role[portfolioDataManager.currentLanguage] || edu.role.en}</b></p>` : ''}
                    ${edu.institution ? `<p>${typeof edu.institution === 'object' ? (edu.institution[portfolioDataManager.currentLanguage] || edu.institution.en) : edu.institution}</p>` : ''}
                </div>
            `;
            timeline.appendChild(eduElement);
        });
    }
}

function updateFuturePlans() {
    const futurePlans = portfolioDataManager.getFuturePlans();
    const plansContainer = document.querySelector('.future-plans-content');
    
    if (plansContainer && futurePlans.length > 0) {
        plansContainer.innerHTML = '';
        
        futurePlans.forEach((plan, index) => {
            const planElement = document.createElement('div');
            planElement.className = 'future-plan-item';
            planElement.innerHTML = `
                <h3>${plan.title?.[portfolioDataManager.currentLanguage] || plan.title?.en || 'Untitled Plan'}</h3>
                <p>${plan.description?.[portfolioDataManager.currentLanguage] || plan.description?.en || 'No description available'}</p>
            `;
            plansContainer.appendChild(planElement);
        });
    }
}

// Enhanced updateContent function to work with dynamic data
function updateContentWithData(lang) {
    portfolioDataManager.setLanguage(lang);
    
    // Update navigation (existing functionality)
    document.querySelectorAll(".nav-links a").forEach((link) => {
        const key = link.getAttribute("href").substring(1);
        if (translations[lang][key]) {
            link.textContent = translations[lang][key];
        }
    });

    // Update static translated elements (existing functionality)
    document.querySelectorAll("[data-key]").forEach((element) => {
        const key = element.getAttribute("data-key");
        if (translations[lang][key]) {
            if (element.tagName === "INPUT" && element.type !== "submit") {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Update dynamic content from JSON
    updatePersonalInfo();
    updateProjects();
    updateEducation();
    updateFuturePlans();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load portfolio data first
    renderPortfolioContent();
    
    // Set up language change listener
    const languageSelect = document.getElementById("language-select");
    if (languageSelect) {
        languageSelect.addEventListener("change", function() {
            const lang = this.value;
            updateContentWithData(lang);
            localStorage.setItem('selectedLanguage', lang);
        });
        
        // Load saved language preference
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        languageSelect.value = savedLanguage;
        updateContentWithData(savedLanguage);
    }
});
