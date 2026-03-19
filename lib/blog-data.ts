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
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-real-time-apps-with-webrtc-and-spring-boot',
    title: 'Building Real-Time Apps with WebRTC and Spring Boot',
    excerpt: 'A deep dive into building peer-to-peer video communication using WebRTC for signaling and Spring Boot as the signaling server — including STUN/TURN configuration, ICE candidates, and handling NAT traversal.',
    content: `
## Introduction

Real-time video communication has become a core feature of modern applications. In this post, I'll walk you through how I built Clype — a privacy-first communication platform — using WebRTC for peer-to-peer communication and Spring Boot as the signaling server.

## Why WebRTC?

WebRTC (Web Real-Time Communication) is a free, open-source project providing web browsers and mobile applications with real-time communication (RTC) via simple APIs. It enables:

- **Peer-to-peer audio/video** without plugins
- **Low latency** direct connections
- **End-to-end encryption** by default

## Architecture Overview

The architecture consists of three key parts:

1. **Signaling Server** (Spring Boot + WebSockets) — Coordinates session initiation
2. **STUN/TURN Servers** — Handles NAT traversal
3. **Client** (Next.js) — Manages MediaStream and RTCPeerConnection

## Setting Up the Spring Boot Signaling Server

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

The ICE (Interactive Connectivity Establishment) process is the heart of WebRTC's NAT traversal. Each peer gathers candidates and exchanges them through the signaling server:

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

## Conclusion

Building real-time communication is complex but rewarding. The combination of WebRTC's peer-to-peer capabilities with Spring Boot's robust WebSocket support creates a powerful foundation for communication applications.
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

When building the Insurance Management System, I chose a microservices architecture to ensure scalability and maintainability. Each business domain — policies, claims, users — became its own service.

## Service Discovery with Eureka

Netflix Eureka is a REST-based service that is primarily used in the AWS cloud for the purpose of load balancing and failover of middle-tier servers.

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

My contribution (PR #1602) focused on implementing custom health checks. The standard health check was too coarse-grained for our use case — we needed service-level granularity.

## Load Balancing with Ribbon

Combined with Ribbon on the client side, Eureka enables intelligent load balancing across service instances automatically.

## Key Takeaways

1. **Circuit breakers** are non-negotiable in distributed systems
2. **Health checks** should reflect business-level service health
3. **Service mesh** thinking helps even in simpler architectures

Building and contributing to open source distributed systems taught me more about production software than any tutorial ever could.
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

Code written without clear patterns becomes unmaintainable quickly. After building BloodLink, Clype, and several other applications, I've settled on a set of patterns that consistently produce maintainable, performant code.

## Component Architecture

I follow an atomic design approach, but simplified:

- **Primitives** — base UI components (buttons, inputs)
- **Composites** — combinations of primitives
- **Sections** — page-level components with data dependencies

## Data Fetching Patterns

With Next.js App Router, I prefer:

\`\`\`tsx
// Server Component for data fetching
async function ProjectsList() {
  const projects = await fetchProjects()
  return <ProjectsGrid projects={projects} />
}

// Client Component only for interactivity
'use client'
function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)
  // ...
}
\`\`\`

## State Management Philosophy

I avoid heavy state management libraries unless truly needed. React Context + useReducer handles 90% of cases beautifully.

## Performance: What Actually Matters

1. **Image optimization** with Next.js Image component
2. **Bundle splitting** via dynamic imports
3. **Suspense boundaries** for progressive loading
4. **Memoization** — but only when profiled, not preemptively

The biggest performance wins always come from the network layer, not JavaScript optimizations.
    `.trim(),
    category: 'Frontend',
    tags: ['React', 'Next.js', 'TypeScript', 'Performance', 'Architecture'],
    readTime: '7 min read',
    date: '2024-08-20',
  },
  {
    slug: 'leetcode-dsa-journey-250-problems',
    title: 'My LeetCode Journey: 250+ Problems and What I Learned',
    excerpt: 'Solving 250+ LeetCode problems changed how I think about code. Here are the key patterns, the hard lessons, and why consistent algorithmic practice makes you a better engineer overall.',
    content: `
## Why Grind LeetCode?

I started my LeetCode journey not for interviews, but because I wanted to think more clearly about algorithms. 250+ problems later, the impact on my everyday engineering has been massive.

## The Most Impactful Patterns

### Two Pointers
Elegant solutions for array problems that naive approaches solve in O(n²):

\`\`\`java
// Finding pair with target sum in sorted array
int left = 0, right = arr.length - 1;
while (left < right) {
    int sum = arr[left] + arr[right];
    if (sum == target) return new int[]{left, right};
    else if (sum < target) left++;
    else right--;
}
\`\`\`

### Sliding Window
Perfect for substring/subarray problems with a constraint.

### Dynamic Programming
The hardest to learn, the most rewarding. Start with the recurrence relation, then optimize.

## Lessons Beyond Algorithms

1. **Clarity first** — readable code beats clever code
2. **Edge cases** are where bugs hide — test them obsessively
3. **Time/space tradeoffs** are everywhere in real systems

## How It Made Me a Better Engineer

After grinding DP problems, I started naturally thinking about overlapping subproblems in system design. After graph problems, I see BFS/DFS patterns in API dependency resolution.

Algorithms aren't just interview prep — they're mental models for problem-solving.
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

Deploying an application is where theory meets reality. After deploying Clype on AWS EC2, I want to share the exact steps and gotchas I encountered.

## EC2 Setup

Start with a t2.micro for testing, but plan for at least t2.small for production Spring Boot apps:

\`\`\`bash
# Install Java 17
sudo apt install openjdk-17-jdk -y

# Create a systemd service for auto-restart
sudo nano /etc/systemd/system/clype.service
\`\`\`

## NGINX as Reverse Proxy

NGINX sits in front of your Spring Boot app, handling SSL termination and load balancing:

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /ws/ {
        proxy_pass http://localhost:8080/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
\`\`\`

## WebSocket Special Handling

The WebSocket upgrade headers are crucial — missing them breaks all real-time features.

## SSL with Let's Encrypt

\`\`\`bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
\`\`\`

## Monitoring

Set up basic monitoring with CloudWatch — at minimum, track CPU, memory, and disk I/O.

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
    excerpt: 'Reflections from my internship at Ardent Computech — the professional skills, technical lessons, and mindset shifts that formal education simply cannot replicate.',
    content: `
## The Gap Between Theory and Practice

Computer science education is fantastic at building mental models. But nothing prepares you for real-world software development like actually doing it in a professional environment.

## What Changed

### Code Review Culture
Having my code reviewed by experienced engineers was humbling and incredibly valuable. Every comment taught me something about readability, security, or performance.

### JWT Authentication in Practice
Implementing JWT auth properly — with refresh tokens, secure storage, and proper expiration — is far more nuanced than tutorials suggest:

\`\`\`javascript
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }  // Short-lived access token
)
// Refresh token stored in httpOnly cookie
\`\`\`

### API Design Discipline
RESTful API design is an art. Consistent naming, proper status codes, and comprehensive error messages matter more than you think when someone else is consuming your API.

## Soft Skills Were the Biggest Surprise

- **Communication** — asking the right questions early saves hours
- **Estimation** — always add buffer; complexity hides in details
- **Documentation** — write it as you build, not after

## Advice for Future Interns

Ship something real. Even small features in production teach you more than any side project because the stakes are real.
    `.trim(),
    category: 'Career',
    tags: ['MERN Stack', 'Internship', 'Node.js', 'React', 'Career'],
    readTime: '4 min read',
    date: '2024-08-01',
  },
]

export const blogCategories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))]
