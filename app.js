AOS.init({
  duration: 1000,
  once: true,
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Add form input sanitization
function sanitizeInput(input) {
  return input.replace(/[^\w. ]/gi, "");
}

// Modified form submission handler
document
  .querySelector(".contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = sanitizeInput(document.getElementById("name").value);
    const email = document.getElementById("email").value;
    const message = sanitizeInput(document.getElementById("message").value);

    // Add CSRF token
    const csrfToken = Math.random().toString(36).slice(2);
    sessionStorage.setItem("csrfToken", csrfToken);

    // Form validation
    if (!name || !email || !message) {
      alert("Please fill in all fields");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter a valid email address");
      return;
    }

    alert("Thank you for your message! I will get back to you soon.");
    this.reset();
  });

// Language switcher
const languageSelect = document.getElementById("language-select");
const translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About",
    portfolio: "Portfolio",
    education: "Education",
    futurePlans: "Future Plans",
    contact: "Contact",
    
    // Home section
    welcome: "Welcome to My Portfolio",
    tagline: "Photographer | Web Developer | Lifelong Learner",
    learnMore: "Learn More",
    
    // About section
    aboutTitle: "About Me",
    aboutText1: "Hello! I'm Khamko, a passionate photographer, front-end developer, and travel enthusiast. I love capturing the world through my lens and translating creative ideas into beautiful, functional websites.",
    aboutText2: "My journey in photography allows me to explore new perspectives, while coding challenges me to bring designs to life with a focus on user experience. When I'm not behind the camera or writing code, you can find me discovering new places and cultures, which constantly inspire my work.",
    
    // Portfolio section
    portfolioTitle: "My Portfolio",
    project1Title: "Lao Shoes",
    project1Desc: "This is a third-year project to build a shoe shop website using PHP.",
    project2Title: "Football news",
    project2Desc: "This is a third-year project to build a football news website using PHP.",
    project3Title: "Phone shop",
    project3Desc: "This is a third-year project to build a phone shop website using PHP.",
    project4Title: "Phone shop",
    project4Desc: "This is a third-year project to build a phone shop website using JavaScript.",
    
    // Education section
    educationTitle: "Education & Skills",
    education1: "SomSouk Secondary School",
    education2Title: "Learn Vietnamese",
    education2Desc: "The University of Danang - University of Science and Education",
    education3Title: "Information technology",
    education3Desc: "The University of Danang - University of Science and Education",
    education4Title: "Internship",
    education4Role: "Web developer",
    education4Company: "Pascalia Asia Việt Nam",
    education5Title: "Web developer",
    education5Desc: ".....................",
    education6Title: "Web developer",
    education6Desc: ".......................",
    
    // Skills section
    skillsTitle: "Skills",
    frontendDev: "Frontend Development",
    backendDev: "Backend Development",
    
    // Future Plans section
    futurePlansTitle: "Future Plans",
    plan1Title: "Master New Technologies",
    plan1Desc: "Continuously learn and adapt to emerging web technologies and photography techniques.",
    plan2Title: "Start a Photography Blog",
    plan2Desc: "Share my experiences, tips, and insights with fellow photography enthusiasts.",
    plan3Title: "Web Development",
    plan3Desc: "My heart is set on becoming a dedicated Web Developer in Da Nang after graduation. I aspire to join a tech company where I can grow my skills, learn from experienced developers, and contribute my best work as a team member. Through hard work and dedication, I hope to build a stable career in this beautiful coastal city that I've grown to love.",
    
    // Contact section
    contactTitle: "Get in Touch",
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    sendMessage: "Send Message",
    
    // Footer
    copyright: "All rights reserved."
  },
  vi: {
    // Navigation
    home: "Trang chủ",
    about: "Giới thiệu",
    portfolio: "Dự án",
    education: "Học vấn",
    futurePlans: "Kế hoạch",
    contact: "Liên hệ",
    
    // Home section
    welcome: "Chào Mừng Đến Với Portfolio Của Tôi",
    tagline: "Nhiếp Ảnh Gia | Lập Trình Viên Web | Học Hỏi Suốt Đời",
    learnMore: "Tìm Hiểu Thêm",
    
    // About section
    aboutTitle: "Về Tôi",
    aboutText1: "Xin chào! Tôi là Khamko, một nhiếp ảnh gia đam mê, nhà phát triển front-end và người đam mê du lịch. Tôi thích ghi lại thế giới qua ống kính và chuyển đổi những ý tưởng sáng tạo thành những trang web đẹp mắt và chức năng.",
    aboutText2: "Hành trình nhiếp ảnh của tôi cho phép tôi khám phá những góc nhìn mới, trong khi lập trình thách thức tôi biến thiết kế thành hiện thực với trọng tâm là trải nghiệm người dùng. Khi không cầm máy ảnh hoặc viết code, bạn có thể tìm thấy tôi đang khám phá những địa điểm và văn hóa mới, điều này luôn truyền cảm hứng cho công việc của tôi.",
    
    // Portfolio section
    portfolioTitle: "Dự Án Của Tôi",
    project1Title: "Cửa Hàng Giày Lào",
    project1Desc: "Đây là dự án năm ba để xây dựng trang web cửa hàng giày bằng PHP.",
    project2Title: "Tin tức bóng đá",
    project2Desc: "Đây là dự án năm ba để xây dựng trang web tin tức bóng đá bằng PHP.",
    project3Title: "Cửa hàng điện thoại",
    project3Desc: "Đây là dự án năm ba để xây dựng trang web cửa hàng điện thoại bằng PHP.",
    project4Title: "Cửa hàng điện thoại",
    project4Desc: "Đây là dự án năm ba để xây dựng trang web cửa hàng điện thoại bằng JavaScript.",
    
    // Education section
    educationTitle: "Học Vấn & Kỹ Năng",
    education1: "Trường Trung Học SomSouk",
    education2Title: "Học Tiếng Việt",
    education2Desc: "Đại học Đà Nẵng - Đại học Sư phạm",
    education3Title: "Công nghệ thông tin",
    education3Desc: "Đại học Đà Nẵng - Đại học Sư phạm",
    education4Title: "Thực tập",
    education4Role: "Lập trình viên web",
    education4Company: "Pascalia Asia Việt Nam",
    education5Title: "Lập trình viên web",
    education5Desc: ".....................",
    education6Title: "Lập trình viên web",
    education6Desc: ".......................",
    
    // Skills section
    skillsTitle: "Kỹ Năng",
    frontendDev: "Phát Triển Frontend",
    backendDev: "Phát Triển Backend",
    
    // Future Plans section
    futurePlansTitle: "Kế Hoạch Tương Lai",
    plan1Title: "Thành Thạo Công Nghệ Mới",
    plan1Desc: "Liên tục học hỏi và thích nghi với các công nghệ web mới nổi và kỹ thuật nhiếp ảnh.",
    plan2Title: "Bắt Đầu Blog Nhiếp Ảnh",
    plan2Desc: "Chia sẻ kinh nghiệm, mẹo và hiểu biết của tôi với những người đam mê nhiếp ảnh.",
    plan3Title: "Phát Triển Web",
    plan3Desc: "Tôi quyết tâm trở thành một Nhà phát triển Web chuyên nghiệp tại Đà Nẵng sau khi tốt nghiệp. Tôi mong muốn gia nhập một công ty công nghệ nơi tôi có thể phát triển kỹ năng, học hỏi từ các nhà phát triển giàu kinh nghiệm và đóng góp công việc tốt nhất với tư cách là một thành viên trong nhóm. Thông qua làm việc chăm chỉ và cống hiến, tôi hy vọng xây dựng một sự nghiệp ổn định tại thành phố ven biển xinh đẹp mà tôi đã yêu thích.",
    
    // Contact section
    contactTitle: "Liên Hệ",
    nameLabel: "Tên",
    emailLabel: "Email",
    messageLabel: "Tin nhắn",
    sendMessage: "Gửi Tin Nhắn",
    
    // Footer
    copyright: "Bảo lưu mọi quyền."
  },
  lo: {
    // Navigation
    home: "ໜ້າຫຼັກ",
    about: "ກ່ຽວກັບ",
    portfolio: "ຜົນງານ",
    education: "ການສຶກສາ",
    futurePlans: "ແຜນອະນາຄົດ",
    contact: "ຕິດຕໍ່",
    
    // Home section
    welcome: "ຍິນດີຕ້ອນຮັບສູ່ Portfolio ຂອງຂ້ອຍ",
    tagline: "ຊ່າງພາບ | ນັກພັດທະນາເວັບ | ຜູ້ຮຽນຮູ້ຕະຫຼອດຊີວິດ",
    learnMore: "ຮຽນຮູ້ເພີ່ມເຕີມ",
    
    // About section
    aboutTitle: "ກ່ຽວກັບຂ້ອຍ",
    aboutText1: "ສະບາຍດີ! ຂ້ອຍແມ່ນ Khamko, ຊ່າງພາບທີ່ມີໄຟໃນຮ້ອງ, ນັກພັດທະນາ front-end ແລະ ຜູ້ໃຈຮັກການທ່ອງທ່ຽວ. ຂ້ອຍມັກຖ່າຍໂລກຜ່ານເລນຂອງຂ້ອຍ ແລະ ແປງຄວາມຄິດສ້າງສັນໃຫ້ເປັນເວັບໄຊທີ່ສວຍງາມ ແລະ ມີປະໂຫຍດ.",
    aboutText2: "ການເດີນທາງໃນການຖ່າຍຮູບຂອງຂ້ອຍເຮັດໃຫ້ຂ້ອຍສາມາດສຳຫຼວດທັດສະນະໃໝ່, ໃນຂະນະທີ່ການເຂົ້າລະຫັດທ້າທາຍຂ້ອຍໃຫ້ນຳເອົາການອອກແບບມາມີຊີວິດດ້ວຍການສຸມໃສ່ປະສົບການຂອງຜູ້ໃຊ້. ເມື່ອຂ້ອຍບໍ່ໄດ້ຢູ່ຫຼັງກ້ອງຫຼືຂຽນໂຄດ, ທ່ານສາມາດພົບຂ້ອຍໄດ້ວ່າກຳລັງຄົ້ນພົບສະຖານທີ່ ແລະ ວັດທະນະທຳໃໝ່, ເຊິ່ງໄດ້ໃຫ້ແຮງບັນດານໃຈແກ່ວຽກງານຂອງຂ້ອຍຢູ່ເສມໍ.",
    
    // Portfolio section
    portfolioTitle: "ຜົນງານຂອງຂ້ອຍ",
    project1Title: "ຮ້ານເກີບລາວ",
    project1Desc: "ນີ້ແມ່ນໂຄງການປີທີສາມເພື່ອສ້າງເວັບໄຊຮ້ານເກີບໂດຍໃຊ້ PHP.",
    project2Title: "ຂ່າວບານເຕະ",
    project2Desc: "ນີ້ແມ່ນໂຄງການປີທີສາມເພື່ອສ້າງເວັບໄຊຂ່າວບານເຕະໂດຍໃຊ້ PHP.",
    project3Title: "ຮ້ານໂທລະສັບ",
    project3Desc: "ນີ້ແມ່ນໂຄງການປີທີສາມເພື່ອສ້າງເວັບໄຊຮ້ານໂທລະສັບໂດຍໃຊ້ PHP.",
    project4Title: "ຮ້ານໂທລະສັບ",
    project4Desc: "ນີ້ແມ່ນໂຄງການປີທີສາມເພື່ອສ້າງເວັບໄຊຮ້ານໂທລະສັບໂດຍໃຊ້ JavaScript.",
    
    // Education section
    educationTitle: "ການສຶກສາ ແລະ ທັກສະ",
    education1: "ໂຮງຮຽນມັດທະຍົມ SomSouk",
    education2Title: "ຮຽນພາສາຫວຽດນາມ",
    education2Desc: "ມະຫາວິທະຍາໄລດານັງ - ມະຫາວິທະຍາໄລວິທະຍາສາດ ແລະ ການສຶກສາ",
    education3Title: "ເຕັກໂນໂລຊີສາລະເທດ",
    education3Desc: "ມະຫາວິທະຍາໄລດານັງ - ມະຫາວິທະຍາໄລວິທະຍາສາດ ແລະ ການສຶກສາ",
    education4Title: "ຝຶກງານ",
    education4Role: "ນັກພັດທະນາເວັບ",
    education4Company: "Pascalia Asia Việt Nam",
    education5Title: "ນັກພັດທະນາເວັບ",
    education5Desc: ".....................",
    education6Title: "ນັກພັດທະນາເວັບ",
    education6Desc: ".......................",
    
    // Skills section
    skillsTitle: "ທັກສະ",
    frontendDev: "ການພັດທະນາ Frontend",
    backendDev: "ການພັດທະນາ Backend",
    
    // Future Plans section
    futurePlansTitle: "ແຜນອະນາຄົດ",
    plan1Title: "ຊຳນານເຕັກໂນໂລຊີໃໝ່",
    plan1Desc: "ຮຽນຮູ້ ແລະ ປັບຕົວຢ່າງຕໍ່ເນື່ອງກັບເຕັກໂນໂລຊີເວັບທີ່ພົ້ນຂຶ້ນ ແລະ ເຕັກນິກການຖ່າຍຮູບ.",
    plan2Title: "ເລີ່ມຕົ້ນ Blog ຖ່າຍຮູບ",
    plan2Desc: "ແບ່ງປັນປະສົບການ, ຄຳແນະນຳ ແລະ ຄວາມເຂົ້າໃຈຂອງຂ້ອຍກັບເພື່ອນຮ່ວມຄວາມກະຕືລືລົ້ນໃນການຖ່າຍຮູບ.",
    plan3Title: "ການພັດທະນາເວັບ",
    plan3Desc: "ໃຈຂອງຂ້ອຍຕັ້ງໃຈທີ່ຈະກາຍເປັນນັກພັດທະນາເວັບທີ່ອຸທິດຕົນໃນດານັງຫຼັງຈາກຈົບການສຶກສາ. ຂ້ອຍປາດຖະໜາທີ່ຈະເຂົ້າຮ່ວມບໍລິສັດເຕັກໂນໂລຊີທີ່ຂ້ອຍສາມາດພັດທະນາທັກສະຂອງຂ້ອຍ, ຮຽນຮູ້ຈາກນັກພັດທະນາທີ່ມີປະສົບການ ແລະ ປະກອບສ່ວນວຽກງານທີ່ດີທີ່ສຸດຂອງຂ້ອຍໃນຖານະເປັນສະມາຊິກທີມ. ຜ່ານການເຮັດວຽກຢ່າງເພຍດແລະອຸທິດຕົນ, ຂ້ອຍຫວັງວ່າຈະສ້າງອາຊີບທີ່ໝັ້ນຄົງໃນເມືອງຊາຍຝັ່ງທະເລທີ່ສວຍງາມນີ້ທີ່ຂ້ອຍໄດ້ຮັກ.",
    
    // Contact section
    contactTitle: "ຕິດຕໍ່",
    nameLabel: "ຊື່",
    emailLabel: "ອີເມວ",
    messageLabel: "ຂໍ້ຄວາມ",
    sendMessage: "ສົ່ງຂໍ້ຄວາມ",
    
    // Footer
    copyright: "ສະຫງວນສິດທັງໝົດ."
  },
  zh: {
    // Navigation
    home: "首页",
    about: "关于",
    portfolio: "作品集",
    education: "教育",
    futurePlans: "未来计划",
    contact: "联系",
    
    // Home section
    welcome: "欢迎来到我的作品集",
    tagline: "摄影师 | 网页开发者 | 终身学习者",
    learnMore: "了解更多",
    
    // About section
    aboutTitle: "关于我",
    aboutText1: "你好！我是Khamko，一名充满激情的摄影师、前端开发者和旅行爱好者。我喜欢通过镜头捕捉世界，将创意想法转化为美观实用的网站。",
    aboutText2: "我的摄影之旅让我能够探索新的视角，而编程挑战我将设计变为现实，专注于用户体验。当我不在相机后面或编写代码时，你可以发现我在探索新的地方和文化，这不断激发我的工作灵感。",
    
    // Portfolio section
    portfolioTitle: "我的作品集",
    project1Title: "老挝鞋店",
    project1Desc: "这是一个使用PHP构建鞋店网站的大三项目。",
    project2Title: "足球新闻",
    project2Desc: "这是一个使用PHP构建足球新闻网站的大三项目。",
    project3Title: "手机商店",
    project3Desc: "这是一个使用PHP构建手机商店网站的大三项目。",
    project4Title: "手机商店",
    project4Desc: "这是一个使用JavaScript构建手机商店网站的大三项目。",
    
    // Education section
    educationTitle: "教育与技能",
    education1: "SomSouk中学",
    education2Title: "学习越南语",
    education2Desc: "岘港大学 - 科学与教育大学",
    education3Title: "信息技术",
    education3Desc: "岘港大学 - 科学与教育大学",
    education4Title: "实习",
    education4Role: "网页开发者",
    education4Company: "Pascalia Asia Việt Nam",
    education5Title: "网页开发者",
    education5Desc: ".....................",
    education6Title: "网页开发者",
    education6Desc: ".......................",
    
    // Skills section
    skillsTitle: "技能",
    frontendDev: "前端开发",
    backendDev: "后端开发",
    
    // Future Plans section
    futurePlansTitle: "未来计划",
    plan1Title: "掌握新技术",
    plan1Desc: "持续学习和适应新兴的网络技术和摄影技巧。",
    plan2Title: "开始摄影博客",
    plan2Desc: "与摄影爱好者分享我的经验、技巧和见解。",
    plan3Title: "网页开发",
    plan3Desc: "我决心在毕业后成为岘港的专业网页开发者。我渴望加入一家科技公司，在那里我可以提升技能，向经验丰富的开发者学习，并作为团队成员贡献我最好的工作。通过努力工作和奉献，我希望在这个我已经爱上的美丽海滨城市建立稳定的职业生涯。",
    
    // Contact section
    contactTitle: "联系我",
    nameLabel: "姓名",
    emailLabel: "邮箱",
    messageLabel: "消息",
    sendMessage: "发送消息",
    
    // Footer
    copyright: "版权所有。"
  },
  th: {
    // Navigation
    home: "หน้าแรก",
    about: "เกี่ยวกับ",
    portfolio: "ผลงาน",
    education: "การศึกษา",
    futurePlans: "แผนอนาคต",
    contact: "ติดต่อ",
    
    // Home section
    welcome: "ยินดีต้อนรับสู่ Portfolio ของฉัน",
    tagline: "ช่างภาพ | นักพัฒนาเว็บ | ผู้เรียนรู้ตลอดชีวิต",
    learnMore: "เรียนรู้เพิ่มเติม",
    
    // About section
    aboutTitle: "เกี่ยวกับฉัน",
    aboutText1: "สวัสดี! ฉันคือ Khamko ช่างภาพที่มีความหลงใหล นักพัฒนา front-end และผู้รักการท่องเที่ยว ฉันชอบบันทึกโลกผ่านเลนส์ของฉันและแปลความคิดสร้างสรรค์ให้เป็นเว็บไซต์ที่สวยงามและใช้งานได้",
    aboutText2: "การเดินทางในการถ่ายภาพของฉันช่วยให้ฉันสำรวจมุมมองใหม่ ๆ ในขณะที่การเขียนโปรแกรมท้าทายให้ฉันนำการออกแบบมาสู่ชีวิตโดยเน้นที่ประสบการณ์ของผู้ใช้ เมื่อฉันไม่ได้อยู่หลังกล้องหรือเขียนโค้ด คุณสามารถพบฉันได้ว่ากำลังค้นพบสถานที่และวัฒนธรรมใหม่ ๆ ซึ่งเป็นแรงบันดาลใจในงานของฉันอยู่เสมอ",
    
    // Portfolio section
    portfolioTitle: "ผลงานของฉัน",
    project1Title: "ร้านรองเท้าลาว",
    project1Desc: "นี่คือโครงการปีที่สามเพื่อสร้างเว็บไซต์ร้านรองเท้าโดยใช้ PHP",
    project2Title: "ข่าวฟุตบอล",
    project2Desc: "นี่คือโครงการปีที่สามเพื่อสร้างเว็บไซต์ข่าวฟุตบอลโดยใช้ PHP",
    project3Title: "ร้านโทรศัพท์",
    project3Desc: "นี่คือโครงการปีที่สามเพื่อสร้างเว็บไซต์ร้านโทรศัพท์โดยใช้ PHP",
    project4Title: "ร้านโทรศัพท์",
    project4Desc: "นี่คือโครงการปีที่สามเพื่อสร้างเว็บไซต์ร้านโทรศัพท์โดยใช้ JavaScript",
    
    // Education section
    educationTitle: "การศึกษาและทักษะ",
    education1: "โรงเรียนมัธยม SomSouk",
    education2Title: "เรียนภาษาเวียดนาม",
    education2Desc: "มหาวิทยาลัยดานัง - มหาวิทยาลัยวิทยาศาสตร์และการศึกษา",
    education3Title: "เทคโนโลยีสารสนเทศ",
    education3Desc: "มหาวิทยาลัยดานัง - มหาวิทยาลัยวิทยาศาสตร์และการศึกษา",
    education4Title: "ฝึกงาน",
    education4Role: "นักพัฒนาเว็บ",
    education4Company: "Pascalia Asia Việt Nam",
    education5Title: "นักพัฒนาเว็บ",
    education5Desc: ".....................",
    education6Title: "นักพัฒนาเว็บ",
    education6Desc: ".......................",
    
    // Skills section
    skillsTitle: "ทักษะ",
    frontendDev: "การพัฒนา Frontend",
    backendDev: "การพัฒนา Backend",
    
    // Future Plans section
    futurePlansTitle: "แผนอนาคต",
    plan1Title: "เชี่ยวชาญเทคโนโลยีใหม่",
    plan1Desc: "เรียนรู้และปรับตัวกับเทคโนโลยีเว็บที่เกิดขึ้นใหม่และเทคนิคการถ่ายภาพอย่างต่อเนื่อง",
    plan2Title: "เริ่มบล็อกการถ่ายภาพ",
    plan2Desc: "แบ่งปันประสบการณ์ เคล็ดลับ และข้อมูลเชิงลึกของฉันกับเพื่อนผู้ชื่นชอบการถ่ายภาพ",
    plan3Title: "การพัฒนาเว็บ",
    plan3Desc: "ใจของฉันตั้งใจที่จะเป็นนักพัฒนาเว็บที่อุทิศตนในดานังหลังจากจบการศึกษา ฉันปรารถนาที่จะเข้าร่วมบริษัทเทคโนโลยีที่ฉันสามารถพัฒนาทักษะ เรียนรู้จากนักพัฒนาที่มีประสบการณ์ และมีส่วนร่วมในงานที่ดีที่สุดของฉันในฐานะสมาชิกทีม ผ่านการทำงานหนักและความทุ่มเท ฉันหวังว่าจะสร้างอาชีพที่มั่นคงในเมืองชายฝั่งที่สวยงามนี้ที่ฉันได้รักใคร่",
    
    // Contact section
    contactTitle: "ติดต่อ",
    nameLabel: "ชื่อ",
    emailLabel: "อีเมล",
    messageLabel: "ข้อความ",
    sendMessage: "ส่งข้อความ",
    
    // Footer
    copyright: "สงวนลิขสิทธิ์"
  }
};

function updateContent(lang) {
  document.documentElement.lang = lang;
  
  // Set appropriate font for each language
  let fontFamily;
  switch(lang) {
    case "en":
      fontFamily = "'Fira Sans Condensed', sans-serif";
      break;
    case "vi":
      fontFamily = "'Oswald', sans-serif";
      break;
    case "lo":
      fontFamily = "'Noto Sans Lao', sans-serif";
      break;
    case "zh":
      fontFamily = "'Noto Sans SC', 'Microsoft YaHei', sans-serif";
      break;
    case "th":
      fontFamily = "'Noto Sans Thai', 'Sukhumvit Set', sans-serif";
      break;
    default:
      fontFamily = "'Fira Sans Condensed', sans-serif";
  }
  
  document.body.style.fontFamily = fontFamily;

  // Update navigation
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const key = link.getAttribute("href").substring(1);
    if (translations[lang][key]) {
      link.textContent = translations[lang][key];
    }
  });

  // Update all elements with data-key attributes
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
}

languageSelect.addEventListener("change", function () {
  const lang = this.value;
  updateContent(lang);
  localStorage.setItem('selectedLanguage', lang);
});

// Load saved language preference
const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
languageSelect.value = savedLanguage;
updateContent(savedLanguage);

// Lightbox for portfolio items
const portfolioItems = document.querySelectorAll(".portfolio-item");
portfolioItems.forEach((item) => {
  item.addEventListener("click", function () {
    const img = this.querySelector("img");
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    document.body.appendChild(lightbox);

    const lightboxImage = document.createElement("img");
    lightboxImage.src = img.src;
    lightbox.appendChild(lightboxImage);

    lightbox.addEventListener("click", (e) => {
      if (e.target !== e.currentTarget) return;
      lightbox.remove();
    });
  });
});

// Add lazy loading to images
document.querySelectorAll("img").forEach((img) => {
  img.loading = "lazy";
});

// Update external links
document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.setAttribute("rel", "noopener noreferrer");
});

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
});

// Hide menu on window resize
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    navLinks.style.display = "flex";
  } else {
    navLinks.style.display = "none";
  }
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}
