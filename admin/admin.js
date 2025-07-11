// Global variables
let portfolioData = {};
let githubToken = '';
let repoName = '';
let isAuthenticated = false;

// Initialize the admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved GitHub credentials
    const savedToken = localStorage.getItem('githubToken');
    const savedRepo = localStorage.getItem('repoName');
    
    if (savedToken && savedRepo) {
        document.getElementById('githubToken').value = savedToken;
        document.getElementById('repoName').value = savedRepo;
        githubToken = savedToken;
        repoName = savedRepo;
        connectGitHub();
    }
});

// GitHub Authentication
async function connectGitHub() {
    githubToken = document.getElementById('githubToken').value;
    repoName = document.getElementById('repoName').value;
    
    if (!githubToken || !repoName) {
        showStatus('authStatus', 'Please enter both GitHub token and repository name.', 'error');
        return;
    }
    
    try {
        // Test the connection by trying to fetch the portfolio.json file
        const response = await fetch(`https://api.github.com/repos/${repoName}/contents/data/portfolio.json`, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const fileData = await response.json();
            const content = JSON.parse(atob(fileData.content));
            portfolioData = content;
            
            // Save credentials
            localStorage.setItem('githubToken', githubToken);
            localStorage.setItem('repoName', repoName);
            
            isAuthenticated = true;
            document.getElementById('authSection').style.display = 'none';
            document.getElementById('dashboard').classList.remove('hidden');
            
            showStatus('authStatus', 'Successfully connected to GitHub!', 'success');
            loadDashboardData();
        } else {
            throw new Error(`GitHub API error: ${response.status}`);
        }
    } catch (error) {
        showStatus('authStatus', `Connection failed: ${error.message}`, 'error');
        isAuthenticated = false;
    }
}

// Load data into dashboard forms
function loadDashboardData() {
    // Load personal info
    if (portfolioData.personal) {
        document.getElementById('personalName').value = portfolioData.personal.name || '';
        
        // Load taglines
        if (portfolioData.personal.tagline) {
            document.getElementById('taglineEn').value = portfolioData.personal.tagline.en || '';
            document.getElementById('taglineVi').value = portfolioData.personal.tagline.vi || '';
            document.getElementById('taglineLo').value = portfolioData.personal.tagline.lo || '';
            document.getElementById('taglineZh').value = portfolioData.personal.tagline.zh || '';
            document.getElementById('taglineTh').value = portfolioData.personal.tagline.th || '';
        }
        
        // Load about texts
        if (portfolioData.personal.about) {
            document.getElementById('aboutText1En').value = portfolioData.personal.about.text1?.en || '';
            document.getElementById('aboutText1Vi').value = portfolioData.personal.about.text1?.vi || '';
            document.getElementById('aboutText1Lo').value = portfolioData.personal.about.text1?.lo || '';
            document.getElementById('aboutText1Zh').value = portfolioData.personal.about.text1?.zh || '';
            document.getElementById('aboutText1Th').value = portfolioData.personal.about.text1?.th || '';
            
            document.getElementById('aboutText2En').value = portfolioData.personal.about.text2?.en || '';
            document.getElementById('aboutText2Vi').value = portfolioData.personal.about.text2?.vi || '';
            document.getElementById('aboutText2Lo').value = portfolioData.personal.about.text2?.lo || '';
            document.getElementById('aboutText2Zh').value = portfolioData.personal.about.text2?.zh || '';
            document.getElementById('aboutText2Th').value = portfolioData.personal.about.text2?.th || '';
        }
    }
    
    // Load other sections
    loadProjects();
    loadSkills();
    loadEducation();
    loadPlans();
}

// Tab management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Show selected tab
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Language tab management
function showLanguage(section, lang) {
    // Hide all language tabs for this section
    document.querySelectorAll(`#${section} .language-tab`).forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll(`[id^="${section}-"]`).forEach(content => content.classList.remove('active'));
    
    // Show selected language
    event.target.classList.add('active');
    document.getElementById(`${section}-${lang}`).classList.add('active');
}

// Personal Info Management
async function savePersonalInfo() {
    portfolioData.personal = {
        name: document.getElementById('personalName').value,
        tagline: {
            en: document.getElementById('taglineEn').value,
            vi: document.getElementById('taglineVi').value,
            lo: document.getElementById('taglineLo').value,
            zh: document.getElementById('taglineZh').value,
            th: document.getElementById('taglineTh').value
        },
        about: {
            text1: {
                en: document.getElementById('aboutText1En').value,
                vi: document.getElementById('aboutText1Vi').value,
                lo: document.getElementById('aboutText1Lo').value,
                zh: document.getElementById('aboutText1Zh').value,
                th: document.getElementById('aboutText1Th').value
            },
            text2: {
                en: document.getElementById('aboutText2En').value,
                vi: document.getElementById('aboutText2Vi').value,
                lo: document.getElementById('aboutText2Lo').value,
                zh: document.getElementById('aboutText2Zh').value,
                th: document.getElementById('aboutText2Th').value
            }
        }
    };
    
    await saveToGitHub('Personal information updated successfully!');
}

// Projects Management
function loadProjects() {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    
    if (portfolioData.projects && portfolioData.projects.length > 0) {
        portfolioData.projects.forEach((project, index) => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-item';
            projectDiv.innerHTML = `
                <div class="item-actions">
                    <button class="btn btn-warning" onclick="editProject(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteProject(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h4>${project.title?.en || 'No title'}</h4>
                <p><strong>Technologies:</strong> ${project.technologies?.join(', ') || 'None'}</p>
                <p>${project.description?.en || 'No description'}</p>
                <img src="${project.image}" alt="Project" style="max-width: 200px; margin-top: 10px;" onerror="this.style.display='none'">
            `;
            projectsList.appendChild(projectDiv);
        });
    } else {
        projectsList.innerHTML = '<p>No projects found. Add your first project!</p>';
    }
}

function showAddProjectForm() {
    document.getElementById('projectFormTitle').textContent = 'Add New Project';
    document.getElementById('projectId').value = '';
    clearProjectForm();
    document.getElementById('projectForm').classList.remove('hidden');
}

function editProject(index) {
    const project = portfolioData.projects[index];
    document.getElementById('projectFormTitle').textContent = 'Edit Project';
    document.getElementById('projectId').value = index;
    
    // Fill form with project data
    document.getElementById('projectImage').value = project.image || '';
    document.getElementById('projectTechnologies').value = project.technologies?.join(', ') || '';
    document.getElementById('projectLink').value = project.link || '';
    document.getElementById('projectGithub').value = project.github || '';
    
    // Fill multilingual fields
    document.getElementById('projectTitleEn').value = project.title?.en || '';
    document.getElementById('projectTitleVi').value = project.title?.vi || '';
    document.getElementById('projectTitleLo').value = project.title?.lo || '';
    document.getElementById('projectTitleZh').value = project.title?.zh || '';
    document.getElementById('projectTitleTh').value = project.title?.th || '';
    
    document.getElementById('projectDescEn').value = project.description?.en || '';
    document.getElementById('projectDescVi').value = project.description?.vi || '';
    document.getElementById('projectDescLo').value = project.description?.lo || '';
    document.getElementById('projectDescZh').value = project.description?.zh || '';
    document.getElementById('projectDescTh').value = project.description?.th || '';
    
    document.getElementById('projectForm').classList.remove('hidden');
}

function clearProjectForm() {
    document.getElementById('projectImage').value = '';
    document.getElementById('projectTechnologies').value = '';
    document.getElementById('projectLink').value = '';
    document.getElementById('projectGithub').value = '';
    
    document.getElementById('projectTitleEn').value = '';
    document.getElementById('projectTitleVi').value = '';
    document.getElementById('projectTitleLo').value = '';
    document.getElementById('projectTitleZh').value = '';
    document.getElementById('projectTitleTh').value = '';
    
    document.getElementById('projectDescEn').value = '';
    document.getElementById('projectDescVi').value = '';
    document.getElementById('projectDescLo').value = '';
    document.getElementById('projectDescZh').value = '';
    document.getElementById('projectDescTh').value = '';
}

async function saveProject() {
    const projectId = document.getElementById('projectId').value;
    const technologies = document.getElementById('projectTechnologies').value
        .split(',').map(tech => tech.trim()).filter(tech => tech);
    
    const projectData = {
        id: projectId || `project${Date.now()}`,
        title: {
            en: document.getElementById('projectTitleEn').value,
            vi: document.getElementById('projectTitleVi').value,
            lo: document.getElementById('projectTitleLo').value,
            zh: document.getElementById('projectTitleZh').value,
            th: document.getElementById('projectTitleTh').value
        },
        description: {
            en: document.getElementById('projectDescEn').value,
            vi: document.getElementById('projectDescVi').value,
            lo: document.getElementById('projectDescLo').value,
            zh: document.getElementById('projectDescZh').value,
            th: document.getElementById('projectDescTh').value
        },
        image: document.getElementById('projectImage').value,
        technologies: technologies,
        link: document.getElementById('projectLink').value,
        github: document.getElementById('projectGithub').value
    };
    
    if (!portfolioData.projects) {
        portfolioData.projects = [];
    }
    
    if (projectId && projectId !== '') {
        // Edit existing project
        portfolioData.projects[parseInt(projectId)] = projectData;
    } else {
        // Add new project
        portfolioData.projects.push(projectData);
    }
    
    await saveToGitHub('Project saved successfully!');
    loadProjects();
    cancelProjectForm();
}

function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        portfolioData.projects.splice(index, 1);
        saveToGitHub('Project deleted successfully!');
        loadProjects();
    }
}

function cancelProjectForm() {
    document.getElementById('projectForm').classList.add('hidden');
}

// Skills Management
function loadSkills() {
    loadSkillCategory('frontend');
    loadSkillCategory('backend');
}

function loadSkillCategory(category) {
    const container = document.getElementById(`${category}Skills`);
    container.innerHTML = '';
    
    if (portfolioData.skills && portfolioData.skills[category]) {
        portfolioData.skills[category].forEach((skill, index) => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-item';
            skillDiv.innerHTML = `
                <span>${skill.name}</span>
                <div>
                    <span class="skill-level">${skill.level}%</span>
                    <button class="btn btn-danger" onclick="deleteSkill('${category}', ${index})" style="margin-left: 10px; padding: 0.25rem 0.5rem; font-size: 0.8rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(skillDiv);
        });
    }
}

function addSkill(category) {
    const nameInput = document.getElementById(`new${category.charAt(0).toUpperCase() + category.slice(1)}Skill`);
    const levelInput = document.getElementById(`new${category.charAt(0).toUpperCase() + category.slice(1)}Level`);
    
    const name = nameInput.value.trim();
    const level = parseInt(levelInput.value);
    
    if (!name || !level || level < 0 || level > 100) {
        alert('Please enter a valid skill name and level (0-100)');
        return;
    }
    
    if (!portfolioData.skills) {
        portfolioData.skills = { frontend: [], backend: [] };
    }
    
    if (!portfolioData.skills[category]) {
        portfolioData.skills[category] = [];
    }
    
    portfolioData.skills[category].push({ name, level });
    
    nameInput.value = '';
    levelInput.value = '';
    
    loadSkillCategory(category);
}

function deleteSkill(category, index) {
    if (confirm('Are you sure you want to delete this skill?')) {
        portfolioData.skills[category].splice(index, 1);
        loadSkillCategory(category);
    }
}

async function saveSkills() {
    await saveToGitHub('Skills updated successfully!');
}

// Education Management
function loadEducation() {
    const educationList = document.getElementById('educationList');
    educationList.innerHTML = '';
    
    if (portfolioData.education && portfolioData.education.length > 0) {
        portfolioData.education.forEach((edu, index) => {
            const eduDiv = document.createElement('div');
            eduDiv.className = 'education-item';
            eduDiv.innerHTML = `
                <div class="item-actions">
                    <button class="btn btn-warning" onclick="editEducation(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteEducation(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h4>${edu.period} - ${edu.title?.en || 'No title'}</h4>
                <p><strong>Position:</strong> ${edu.position}</p>
                <p>${edu.institution?.en || edu.institution || 'No institution'}</p>
            `;
            educationList.appendChild(eduDiv);
        });
    } else {
        educationList.innerHTML = '<p>No education entries found. Add your first entry!</p>';
    }
}

function showAddEducationForm() {
    document.getElementById('educationFormTitle').textContent = 'Add New Education';
    document.getElementById('educationId').value = '';
    clearEducationForm();
    document.getElementById('educationForm').classList.remove('hidden');
}

function editEducation(index) {
    const edu = portfolioData.education[index];
    document.getElementById('educationFormTitle').textContent = 'Edit Education';
    document.getElementById('educationId').value = index;
    
    document.getElementById('educationPeriod').value = edu.period || '';
    document.getElementById('educationPosition').value = edu.position || 'left';
    
    // Fill multilingual fields
    document.getElementById('eduTitleEn').value = edu.title?.en || '';
    document.getElementById('eduTitleVi').value = edu.title?.vi || '';
    document.getElementById('eduTitleLo').value = edu.title?.lo || '';
    document.getElementById('eduTitleZh').value = edu.title?.zh || '';
    document.getElementById('eduTitleTh').value = edu.title?.th || '';
    
    if (typeof edu.institution === 'object') {
        document.getElementById('eduInstEn').value = edu.institution?.en || '';
        document.getElementById('eduInstVi').value = edu.institution?.vi || '';
        document.getElementById('eduInstLo').value = edu.institution?.lo || '';
        document.getElementById('eduInstZh').value = edu.institution?.zh || '';
        document.getElementById('eduInstTh').value = edu.institution?.th || '';
    } else {
        document.getElementById('eduInstEn').value = edu.institution || '';
    }
    
    document.getElementById('educationForm').classList.remove('hidden');
}

function clearEducationForm() {
    document.getElementById('educationPeriod').value = '';
    document.getElementById('educationPosition').value = 'left';
    
    document.getElementById('eduTitleEn').value = '';
    document.getElementById('eduTitleVi').value = '';
    document.getElementById('eduTitleLo').value = '';
    document.getElementById('eduTitleZh').value = '';
    document.getElementById('eduTitleTh').value = '';
    
    document.getElementById('eduInstEn').value = '';
    document.getElementById('eduInstVi').value = '';
    document.getElementById('eduInstLo').value = '';
    document.getElementById('eduInstZh').value = '';
    document.getElementById('eduInstTh').value = '';
}

async function saveEducation() {
    const educationId = document.getElementById('educationId').value;
    
    const educationData = {
        id: educationId || `edu${Date.now()}`,
        period: document.getElementById('educationPeriod').value,
        position: document.getElementById('educationPosition').value,
        title: {
            en: document.getElementById('eduTitleEn').value,
            vi: document.getElementById('eduTitleVi').value,
            lo: document.getElementById('eduTitleLo').value,
            zh: document.getElementById('eduTitleZh').value,
            th: document.getElementById('eduTitleTh').value
        },
        institution: {
            en: document.getElementById('eduInstEn').value,
            vi: document.getElementById('eduInstVi').value,
            lo: document.getElementById('eduInstLo').value,
            zh: document.getElementById('eduInstZh').value,
            th: document.getElementById('eduInstTh').value
        }
    };
    
    if (!portfolioData.education) {
        portfolioData.education = [];
    }
    
    if (educationId && educationId !== '') {
        portfolioData.education[parseInt(educationId)] = educationData;
    } else {
        portfolioData.education.push(educationData);
    }
    
    await saveToGitHub('Education saved successfully!');
    loadEducation();
    cancelEducationForm();
}

function deleteEducation(index) {
    if (confirm('Are you sure you want to delete this education entry?')) {
        portfolioData.education.splice(index, 1);
        saveToGitHub('Education deleted successfully!');
        loadEducation();
    }
}

function cancelEducationForm() {
    document.getElementById('educationForm').classList.add('hidden');
}

// Future Plans Management
function loadPlans() {
    const plansList = document.getElementById('plansList');
    plansList.innerHTML = '';
    
    if (portfolioData.futurePlans && portfolioData.futurePlans.length > 0) {
        portfolioData.futurePlans.forEach((plan, index) => {
            const planDiv = document.createElement('div');
            planDiv.className = 'plan-item';
            planDiv.innerHTML = `
                <div class="item-actions">
                    <button class="btn btn-warning" onclick="editPlan(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deletePlan(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h4>${plan.title?.en || 'No title'}</h4>
                <p>${plan.description?.en || 'No description'}</p>
            `;
            plansList.appendChild(planDiv);
        });
    } else {
        plansList.innerHTML = '<p>No future plans found. Add your first plan!</p>';
    }
}

function showAddPlanForm() {
    document.getElementById('planFormTitle').textContent = 'Add New Plan';
    document.getElementById('planId').value = '';
    clearPlanForm();
    document.getElementById('planForm').classList.remove('hidden');
}

function editPlan(index) {
    const plan = portfolioData.futurePlans[index];
    document.getElementById('planFormTitle').textContent = 'Edit Plan';
    document.getElementById('planId').value = index;
    
    // Fill multilingual fields
    document.getElementById('planTitleEn').value = plan.title?.en || '';
    document.getElementById('planTitleVi').value = plan.title?.vi || '';
    document.getElementById('planTitleLo').value = plan.title?.lo || '';
    document.getElementById('planTitleZh').value = plan.title?.zh || '';
    document.getElementById('planTitleTh').value = plan.title?.th || '';
    
    document.getElementById('planDescEn').value = plan.description?.en || '';
    document.getElementById('planDescVi').value = plan.description?.vi || '';
    document.getElementById('planDescLo').value = plan.description?.lo || '';
    document.getElementById('planDescZh').value = plan.description?.zh || '';
    document.getElementById('planDescTh').value = plan.description?.th || '';
    
    document.getElementById('planForm').classList.remove('hidden');
}

function clearPlanForm() {
    document.getElementById('planTitleEn').value = '';
    document.getElementById('planTitleVi').value = '';
    document.getElementById('planTitleLo').value = '';
    document.getElementById('planTitleZh').value = '';
    document.getElementById('planTitleTh').value = '';
    
    document.getElementById('planDescEn').value = '';
    document.getElementById('planDescVi').value = '';
    document.getElementById('planDescLo').value = '';
    document.getElementById('planDescZh').value = '';
    document.getElementById('planDescTh').value = '';
}

async function savePlan() {
    const planId = document.getElementById('planId').value;
    
    const planData = {
        id: planId || `plan${Date.now()}`,
        title: {
            en: document.getElementById('planTitleEn').value,
            vi: document.getElementById('planTitleVi').value,
            lo: document.getElementById('planTitleLo').value,
            zh: document.getElementById('planTitleZh').value,
            th: document.getElementById('planTitleTh').value
        },
        description: {
            en: document.getElementById('planDescEn').value,
            vi: document.getElementById('planDescVi').value,
            lo: document.getElementById('planDescLo').value,
            zh: document.getElementById('planDescZh').value,
            th: document.getElementById('planDescTh').value
        }
    };
    
    if (!portfolioData.futurePlans) {
        portfolioData.futurePlans = [];
    }
    
    if (planId && planId !== '') {
        portfolioData.futurePlans[parseInt(planId)] = planData;
    } else {
        portfolioData.futurePlans.push(planData);
    }
    
    await saveToGitHub('Future plan saved successfully!');
    loadPlans();
    cancelPlanForm();
}

function deletePlan(index) {
    if (confirm('Are you sure you want to delete this plan?')) {
        portfolioData.futurePlans.splice(index, 1);
        saveToGitHub('Future plan deleted successfully!');
        loadPlans();
    }
}

function cancelPlanForm() {
    document.getElementById('planForm').classList.add('hidden');
}

// GitHub API Functions
async function saveToGitHub(successMessage) {
    if (!isAuthenticated) {
        showStatus('saveStatus', 'Not authenticated with GitHub', 'error');
        return;
    }
    
    try {
        // Get current file to get SHA
        const response = await fetch(`https://api.github.com/repos/${repoName}/contents/data/portfolio.json`, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch current file: ${response.status}`);
        }
        
        const fileData = await response.json();
        
        // Update file
        const updateResponse = await fetch(`https://api.github.com/repos/${repoName}/contents/data/portfolio.json`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Update portfolio data - ${new Date().toISOString()}`,
                content: btoa(JSON.stringify(portfolioData, null, 2)),
                sha: fileData.sha
            })
        });
        
        if (updateResponse.ok) {
            showStatus('saveStatus', successMessage, 'success');
        } else {
            throw new Error(`Failed to update file: ${updateResponse.status}`);
        }
        
    } catch (error) {
        showStatus('saveStatus', `Save failed: ${error.message}`, 'error');
    }
}

// Utility Functions
function showStatus(elementId, message, type) {
    const statusElement = document.getElementById(elementId);
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    statusElement.style.display = 'block';
    
    setTimeout(() => {
        statusElement.style.display = 'none';
    }, 5000);
}
