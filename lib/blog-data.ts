export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTime: string
  date: string
  featured?: boolean
  externalUrl?: string   // if set, clicking opens this URL instead of the internal page
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-real-time-apps-with-webrtc-and-spring-boot',
    title: 'Building Real-Time Apps with WebRTC and Spring Boot',
    excerpt: 'A deep dive into peer-to-peer video communication using WebRTC for signaling and Spring Boot as the signaling server — covering STUN/TURN configuration, ICE candidates, and NAT traversal.',
    content: `
## Introduction

Real-time video communication has become a core feature of modern applications. In this post I walk through how I built Clype — a privacy-first communication platform — using WebRTC for peer-to-peer communication and Spring Boot as the signaling server.

## Why WebRTC?

WebRTC enables peer-to-peer audio and video without plugins, with low latency and end-to-end encryption by default.

## Architecture Overview

1. **Signaling Server** (Spring Boot + WebSockets) — coordinates session initiation
2. **STUN/TURN Servers** — handles NAT traversal
3. **Client** (Next.js) — manages MediaStream and RTCPeerConnection

## Setting Up the Signaling Server

\`\`\`java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(signalingHandler(), "/ws/signal")
                .setAllowedOrigins("*");
    }
}
\`\`\`

## ICE Candidate Exchange

\`\`\`javascript
pc.onicecandidate = ({ candidate }) => {
  if (candidate) {
    signalingSocket.send(JSON.stringify({
      type: 'ice-candidate',
      candidate,
      room: roomId
    }))
  }
}
\`\`\`

## Lessons Learned

- Always handle connection state changes gracefully
- TURN servers are essential for production — don't skip them
- Media stream cleanup is critical to prevent memory leaks
    `.trim(),
    category: 'Backend',
    tags: ['WebRTC', 'Spring Boot', 'WebSockets', 'Real-Time', 'Java'],
    readTime: '8 min read',
    date: '2024-11-15',
    featured: true,
  },
  {
    slug: 'microservices-with-spring-boot-and-netflix-eureka',
    title: 'Microservices with Spring Boot & Netflix Eureka',
    excerpt: 'How I contributed to Netflix Eureka and what I learned about service discovery, fault tolerance, and distributed systems architecture in production microservices.',
    content: `
## The Microservices Challenge

When building the Insurance Management System, I chose a microservices architecture to ensure scalability and maintainability.

## Service Discovery with Eureka

\`\`\`java
@SpringBootApplication
@EnableEurekaClient
public class PolicyService {
    public static void main(String[] args) {
        SpringApplication.run(PolicyService.class, args);
    }
}
\`\`\`

## Contributing to Netflix Eureka

My contribution (PR #1602) focused on implementing custom health checks for service-level granularity.

## Key Takeaways

1. Circuit breakers are non-negotiable in distributed systems
2. Health checks should reflect business-level service health
3. Service mesh thinking helps even in simpler architectures
    `.trim(),
    category: 'Architecture',
    tags: ['Microservices', 'Spring Boot', 'Netflix Eureka', 'Java', 'Open Source'],
    readTime: '6 min read',
    date: '2024-10-02',
    featured: true,
  },
  {
    slug: 'full-stack-react-next-tailwind-best-practices',
    title: 'Full-Stack React & Next.js: Patterns I Swear By',
    excerpt: "After building multiple production applications with React and Next.js, here are the architectural patterns, component design principles, and performance optimizations I consistently reach for.",
    content: `
## Why Patterns Matter

After building BloodLink, Clype, and several other applications, I've settled on patterns that consistently produce maintainable, performant code.

## Component Architecture

- **Primitives** — base UI components
- **Composites** — combinations of primitives
- **Sections** — page-level components with data dependencies

## Data Fetching Patterns

\`\`\`tsx
async function ProjectsList() {
  const projects = await fetchProjects()
  return <ProjectsGrid projects={projects} />
}
\`\`\`

## Performance: What Actually Matters

1. Image optimization with Next.js Image component
2. Bundle splitting via dynamic imports
3. Suspense boundaries for progressive loading
4. Memoization — only when profiled, not preemptively
    `.trim(),
    category: 'Frontend',
    tags: ['React', 'Next.js', 'TypeScript', 'Performance', 'Architecture'],
    readTime: '7 min read',
    date: '2024-08-20',
  },
  {
    slug: 'leetcode-dsa-journey-250-problems',
    title: 'My LeetCode Journey: 250+ Problems and What I Learned',
    excerpt: 'Solving 250+ LeetCode problems changed how I think about code. Key patterns, hard lessons, and why consistent algorithmic practice makes you a better engineer.',
    content: `
## Why Grind LeetCode?

I started my LeetCode journey not for interviews, but to think more clearly about algorithms. 250+ problems later, the impact on my everyday engineering has been massive.

## The Most Impactful Patterns

### Two Pointers
\`\`\`java
int left = 0, right = arr.length - 1;
while (left < right) {
    int sum = arr[left] + arr[right];
    if (sum == target) return new int[]{left, right};
    else if (sum < target) left++;
    else right--;
}
\`\`\`

### Dynamic Programming
The hardest to learn, the most rewarding. Start with the recurrence relation, then optimize.

## How It Made Me a Better Engineer

After grinding DP problems, I started naturally thinking about overlapping subproblems in system design.
    `.trim(),
    category: 'Career',
    tags: ['DSA', 'LeetCode', 'Java', 'Algorithms', 'Career Growth'],
    readTime: '5 min read',
    date: '2024-07-10',
  },
  {
    slug: 'deploying-java-apps-aws-ec2-nginx',
    title: 'Deploying Java Apps on AWS EC2 with NGINX',
    excerpt: 'A practical guide to deploying Spring Boot applications on AWS EC2, configuring NGINX as a reverse proxy, setting up SSL certificates, and keeping things running in production.',
    content: `
## Production Deployment Reality

After deploying Clype on AWS EC2, I want to share the exact steps and gotchas I encountered.

## EC2 Setup

\`\`\`bash
sudo apt install openjdk-17-jdk -y
sudo nano /etc/systemd/system/clype.service
\`\`\`

## NGINX as Reverse Proxy

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
    }
    location /ws/ {
        proxy_pass http://localhost:8080/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
\`\`\`

## SSL with Let's Encrypt

\`\`\`bash
sudo certbot --nginx -d yourdomain.com
\`\`\`

Production deployments are humbling. Start simple, monitor everything, and iterate.
    `.trim(),
    category: 'DevOps',
    tags: ['AWS', 'EC2', 'NGINX', 'Spring Boot', 'DevOps', 'Deployment'],
    readTime: '9 min read',
    date: '2024-06-05',
  },
  {
    slug: 'mern-stack-internship-learnings',
    title: 'What My MERN Stack Internship Taught Me',
    excerpt: 'Reflections from my internship at Ardent Computech — professional skills, technical lessons, and mindset shifts that formal education simply cannot replicate.',
    content: `
## The Gap Between Theory and Practice

Nothing prepares you for real-world software development like actually doing it in a professional environment.

## What Changed

### JWT Authentication in Practice

\`\`\`javascript
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
)
\`\`\`

### API Design Discipline
Consistent naming, proper status codes, and comprehensive error messages matter more than you think.

## Soft Skills Were the Biggest Surprise

- **Communication** — asking the right questions early saves hours
- **Estimation** — always add buffer; complexity hides in details

## Advice for Future Interns

Ship something real. Even small features in production teach you more than any side project.
    `.trim(),
    category: 'Career',
    tags: ['MERN Stack', 'Internship', 'Node.js', 'React', 'Career'],
    readTime: '4 min read',
    date: '2024-08-01',
  },
]

export const blogCategories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))]