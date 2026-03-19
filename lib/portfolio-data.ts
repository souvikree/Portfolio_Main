import { PortfolioData } from './types';

// ============================================
// PORTFOLIO DATA CONFIGURATION
// ============================================
// Edit this file to update your entire portfolio
// Add new projects, experiences, skills, etc. here
// ============================================

export const portfolioData: PortfolioData = {
  // ========== PERSONAL INFO ==========
  personal: {
    name: 'Souvik Ghosh',
    role: 'Software Engineer',
    email: 'souvikg3225@gmail.com',
    phone: '+91-8967869114',
    location: 'Kolkata, India',
    photoUrl: '/images/souvik.png',
    availableForWork: true,
  },

  // ========== ABOUT SECTION ==========
  about: {
    intro: "Building production-grade systems that scale. Passionate about distributed systems, real-time communication, and clean architecture.",
    philosophy: "I believe in writing code that's not just functional, but elegant and maintainable. Every line should serve a purpose, and every system should be built with scalability and user experience in mind.",
    personal: "When I'm not coding, I'm solving algorithmic challenges on LeetCode, contributing to open source, or exploring new technologies. I'm driven by the challenge of turning complex problems into simple, efficient solutions.",
    stats: [
      { label: 'LeetCode Solved', value: 250, suffix: '+' },
      { label: 'Production Projects', value: 3, suffix: '+' },
      { label: 'OSS Contributions', value: 1, suffix: '' },
      { label: 'Internship Experience', value: 1, suffix: '+ Years' },
    ],
  },

  // ========== SOCIAL LINKS ==========
  social: [
    { name: 'GitHub', url: 'https://github.com/souvikree', icon: 'Github' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/linkwithsouvik', icon: 'Linkedin' },
    { name: 'LeetCode', url: 'https://leetcode.com/souRee', icon: 'Code2' },
    { name: 'Email', url: 'mailto:souvikg3225@gmail.com', icon: 'Mail' },
  ],

  // ========== SKILLS ==========
  // Add new skills here
  skills: [
    {
      name: 'Languages',
      skills: [
        { name: 'Java', proficiency: 90 },
        { name: 'JavaScript', proficiency: 85 },
        { name: 'SQL', proficiency: 80 },
        { name: 'HTML/CSS', proficiency: 90 },
        { name: 'Bash', proficiency: 70 },
      ],
    },
    {
      name: 'Frontend',
      skills: [
        { name: 'React.js', proficiency: 90 },
        { name: 'Next.js', proficiency: 85 },
        { name: 'Tailwind CSS', proficiency: 95 },
      ],
    },
    {
      name: 'Backend',
      skills: [
        { name: 'Spring Boot', proficiency: 90 },
        { name: 'Node.js', proficiency: 85 },
        { name: 'Express', proficiency: 85 },
        { name: 'Microservices', proficiency: 80 },
        { name: 'REST API', proficiency: 90 },
        { name: 'WebSockets', proficiency: 85 },
        { name: 'WebRTC', proficiency: 80 },
      ],
    },
    {
      name: 'Databases',
      skills: [
        { name: 'MySQL', proficiency: 85 },
        { name: 'MongoDB', proficiency: 80 },
        { name: 'Oracle', proficiency: 75 },
      ],
    },
    {
      name: 'Tools',
      skills: [
        { name: 'Git', proficiency: 90 },
        { name: 'AWS EC2', proficiency: 75 },
        { name: 'NGINX', proficiency: 80 },
        { name: 'Maven', proficiency: 85 },
        { name: 'Postman', proficiency: 90 },
        { name: 'Linux', proficiency: 80 },
        { name: 'IntelliJ', proficiency: 90 },
        { name: 'Docker', proficiency: 60 },
      ],
    },
    {
      name: 'CS Fundamentals',
      skills: [
        { name: 'Data Structures & Algorithms', proficiency: 90 },
        { name: 'Object-Oriented Programming', proficiency: 90 },
        { name: 'Multithreading', proficiency: 80 },
        { name: 'Database Management', proficiency: 85 },
        { name: 'Operating Systems', proficiency: 75 },
        { name: 'Computer Networks', proficiency: 80 },
        { name: 'System Design', proficiency: 80 },
      ],
    },
  ],

  // ========== EXPERIENCE ==========
  // Add new job experiences here
  experience: [
    {
      company: 'Ardent Computech Pvt. Ltd.',
      role: 'MERN Stack Developer Intern',
      location: 'Kolkata, India',
      duration: 'Jun 2024 – Jul 2024',
      startDate: '2024-06',
      endDate: '2024-07',
      status: 'past',
      description: [
        'Developed and deployed secure RESTful APIs using Node.js and Express, implementing JWT-based authentication',
        'Built responsive React applications with modern UI/UX principles and state management',
        'Collaborated in an Agile team environment, participating in daily standups and sprint planning',
        'Tested and documented APIs using Postman, ensuring robust error handling and validation',
      ],
      technologies: ['React', 'Node.js', 'Express', 'JWT', 'REST API', 'Postman', 'Agile'],
    },
    {
      company: 'Your Next Role',
      role: 'Software Engineer',
      location: 'TBD',
      duration: 'Coming Soon',
      startDate: 'TBD',
      endDate: 'Present',
      status: 'upcoming',
      description: [
        'The next chapter is being written...',
        'Building innovative solutions and scaling systems',
        'Contributing to cutting-edge technology',
      ],
      technologies: [],
    },
  ],

  // ========== PROJECTS ==========
  // Add new projects here
  projects: [
    {
      name: 'Clype',
      description: 'Privacy-first real-time communication platform',
      longDescription: 'A comprehensive communication platform featuring real-time video calling, chat, and screen sharing with end-to-end encryption.',
      technologies: ['Next.js', 'Spring Boot', 'WebRTC', 'WebSockets', 'AWS EC2', 'NGINX'],
      githubUrl: 'https://github.com/souvikree/clype',
      liveUrl: 'https://clype.vercel.app',
      status: 'production',
      icon: '🔵',
      features: [
        'Real-time video and audio calling with WebRTC',
        'Instant messaging with WebSocket connections',
        'Screen sharing capabilities',
        'Deployed on AWS EC2 with NGINX reverse proxy',
      ],
    },
    {
      name: 'BloodLink',
      description: 'Real-time blood donation platform with geolocation',
      longDescription: 'Connect blood donors with recipients in real-time using location-based matching and instant notifications.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Google Maps API', 'Socket.io'],
      githubUrl: 'https://github.com/souvikree/bloodlink',
      status: 'production',
      icon: '🔴',
      features: [
        'Real-time donor-recipient matching',
        'Geolocation-based search within radius',
        'Instant push notifications',
        'Comprehensive donor and blood bank management',
      ],
    },
    {
      name: 'Insurance Management System',
      description: 'Distributed microservice insurance platform',
      longDescription: 'A scalable microservices-based insurance management system with policy administration and claims processing.',
      technologies: ['React', 'Spring Boot', 'MySQL', 'Maven', 'JUnit', 'Microservices'],
      githubUrl: 'https://github.com/souvikree/insurance-system',
      status: 'production',
      icon: '🟢',
      features: [
        'Microservices architecture for scalability',
        'Policy creation and management',
        'Claims processing workflow',
        'Comprehensive unit and integration testing',
      ],
    },
    {
      name: 'Future Project',
      description: 'Building something awesome...',
      longDescription: 'Stay tuned for the next innovation.',
      technologies: [],
      status: 'coming-soon',
      icon: '⚪',
      features: ['Under construction', 'Exciting new features coming soon'],
    },
  ],

  // ========== ACHIEVEMENTS ==========
  // Add new achievements here
  achievements: [
    {
      title: 'Netflix Eureka OSS Contributor',
      organization: 'Netflix',
      description: 'Contributed to Netflix Eureka (PR #1602): Enhanced service discovery by implementing custom health checks and improved fault tolerance in distributed microservices.',
      date: '2024',
      badge: 'Open Source',
      url: 'https://github.com/Netflix/eureka/pull/1602',
    },
    {
      title: 'J.P. Morgan Chase Software Engineering Simulation',
      organization: 'J.P. Morgan Chase & Co.',
      description: 'Completed software engineering virtual experience: Built Spring Boot microservices, implemented JPA for data persistence, and created REST APIs with comprehensive validation.',
      date: '2024',
      badge: 'Industry Simulation',
    },
    {
      title: 'Smart India Hackathon 2023',
      organization: 'Government of India',
      description: 'Participated in Smart India Hackathon 2023: Developed a digital workflow solution for government processes, focusing on efficiency and user experience.',
      date: '2023',
      badge: 'Hackathon',
    },
    {
      title: '250+ LeetCode Problems',
      organization: 'LeetCode',
      description: 'Solved 250+ algorithmic challenges across Arrays, Dynamic Programming, Graphs, and Trees. Consistent practice in Data Structures and Algorithms.',
      date: 'Ongoing',
      badge: 'DSA',
      url: 'https://leetcode.com/souRee',
    },
    {
      title: 'Full Stack Web Development',
      organization: 'Udemy',
      description: 'Completed comprehensive Full Stack Web Development course covering MERN stack, authentication, deployment, and modern development practices.',
      date: '2023',
      badge: 'Certification',
    },
  ],

  // ========== EDUCATION ==========
  // Add new education here
  education: [
    {
      institution: 'Heritage Institute of Technology',
      degree: 'Bachelor of Technology',
      field: 'Computer Science & Business Systems',
      location: 'Kolkata, India',
      duration: 'Oct 2021 – Jun 2025',
      score: 'CGPA: 7.53',
      highlights: [
        'Core coursework: Data Structures, Algorithms, Database Systems, Computer Networks',
        'Focus on distributed systems and software architecture',
      ],
    },
    {
      institution: 'Bankura Banga Vidyalay',
      degree: 'Higher Secondary (Class XII)',
      field: 'Science (WBCHSE)',
      location: 'Bankura, India',
      duration: 'Feb 2020 – Mar 2021',
      score: '89%',
    },
  ],

  // ========== THEMES ==========
  themes: [
    {
      name: 'cyber-noir',
      label: 'Cyber Noir',
      colors: {
        background: '#050508',
        foreground: '#F0F0FF',
        accent: '#00F5FF',
        secondary: '#7B2FFF',
        highlight: '#FF2D78',
        muted: '#0A0A15',
        border: 'rgba(0, 245, 255, 0.15)',
        card: 'rgba(255, 255, 255, 0.03)',
      },
      fonts: {
        heading: 'Space Grotesk',
        body: 'JetBrains Mono',
      },
    },
    {
      name: 'solar-flare',
      label: 'Solar Flare',
      colors: {
        background: '#0A0A0F',
        foreground: '#FEFEFE',
        accent: '#FF6B35',
        secondary: '#FFD166',
        highlight: '#EF233C',
        muted: '#1A1A1F',
        border: 'rgba(255, 107, 53, 0.15)',
        card: 'rgba(255, 255, 255, 0.03)',
      },
      fonts: {
        heading: 'Bebas Neue',
        body: 'Inter',
      },
    },
    {
      name: 'aurora',
      label: 'Aurora',
      colors: {
        background: '#020D1A',
        foreground: '#E8F4FF',
        accent: '#00FF87',
        secondary: '#0066FF',
        highlight: '#C77DFF',
        muted: '#0A1929',
        border: 'rgba(0, 255, 135, 0.15)',
        card: 'rgba(255, 255, 255, 0.03)',
      },
      fonts: {
        heading: 'Syne',
        body: 'DM Sans',
      },
    },
    {
      name: 'ghost-light',
      label: 'Ghost Light',
      colors: {
        background: '#F5F0E8',
        foreground: '#0D0D0D',
        accent: '#1A1A2E',
        secondary: '#16213E',
        highlight: '#C9184A',
        muted: '#E8E3DC',
        border: 'rgba(26, 26, 46, 0.15)',
        card: 'rgba(0, 0, 0, 0.02)',
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Satoshi',
      },
    },
  ],
};
