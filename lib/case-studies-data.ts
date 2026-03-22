// ============================================================
// CASE STUDIES DATA
// Deep writeups: Problem → Solution → Outcome
// Matched to project slugs in portfolio-data.ts
// ============================================================

export interface CaseStudy {
  slug:        string
  projectName: string
  tagline:     string
  status:      string
  duration:    string
  role:        string
  team:        string
  color:       string

  overview:    string

  problem: {
    heading: string
    body:    string
    points:  string[]
  }

  solution: {
    heading: string
    body:    string
    steps: {
      title:       string
      description: string
      tech:        string[]
    }[]
  }

  architecture: {
    heading:     string
    description: string
    layers: {
      name:        string
      components:  string[]
      description: string
    }[]
  }

  outcome: {
    heading: string
    body:    string
    metrics: { label: string; value: string; note: string }[]
  }

  learnings: string[]
  technologies: string[]
  links: { github?: string; live?: string }
}

export const caseStudies: CaseStudy[] = [
  // ── TraceLearn.ai ─────────────────────────────────────────
  {
    slug:        'tracelearn-ai',
    projectName: 'TraceLearn.ai',
    tagline:     'Turning runtime errors into learning opportunities with AI',
    status:      'production',
    duration:    '3 months',
    role:        'Full Stack Engineer',
    team:        'Solo Project',
    color:       '#00F5FF',

    overview:
      'TraceLearn.ai is an AI-powered debugging and learning platform. Developers paste broken code, pick a language, and receive instant error analysis, a corrected version, and personalized resources — all while tracking which concepts they struggle with across sessions.',

    problem: {
      heading: 'The Problem',
      body:
        'Developers — especially learners — spend disproportionate time deciphering cryptic error messages. Stack Overflow gives answers but rarely explains the "why". Existing tools fix code without building understanding. I wanted a tool that treats every bug as a teaching moment.',
      points: [
        'Runtime errors are opaque without deep language knowledge',
        'Existing AI tools just fix bugs — they don\'t explain concepts',
        'No platform tracked which error patterns a developer kept repeating',
        'Code execution in the browser is unsafe without sandboxing',
      ],
    },

    solution: {
      heading: 'The Solution',
      body:
        'A three-layer system: a secure Docker sandbox for execution, an LLM pipeline for analysis, and a session store that tracks concept mastery over time.',
      steps: [
        {
          title: 'Isolated Execution Sandbox',
          description:
            'Each code submission spins up a fresh Docker container with a strict memory cap (256 MB), CPU quota, and network isolation. The container runs the code, captures stdout/stderr, and is destroyed after 10 seconds — no persistent state, no escape vectors.',
          tech: ['Docker', 'Spring Boot', 'Linux cgroups'],
        },
        {
          title: 'LLM Analysis Pipeline',
          description:
            'The error trace and original code are sent to an LLM with a structured prompt that demands three outputs: a plain-English explanation of the root cause, a corrected code block, and 2–3 learning resource recommendations. The response is parsed into typed JSON before reaching the frontend.',
          tech: ['Spring Boot', 'OpenAI API', 'JSON Schema'],
        },
        {
          title: 'Session-Aware Learning Tracker',
          description:
            'Each session stores the error category and concept tags. A lightweight recommendation engine surfaces patterns: if a user keeps hitting NullPointerException in Java, the system proactively suggests OOP fundamentals rather than waiting for another error.',
          tech: ['MongoDB', 'Next.js', 'WebSockets'],
        },
        {
          title: 'Auth + Real-time Updates',
          description:
            'OAuth2 with GitHub for frictionless signup. JWT refresh tokens keep sessions alive. WebSocket pushes execution results back without polling — the UI updates the moment the container finishes.',
          tech: ['OAuth2', 'JWT', 'WebSockets', 'Next.js'],
        },
      ],
    },

    architecture: {
      heading: 'Architecture',
      description:
        'Three decoupled services: a Next.js frontend, a Spring Boot API gateway, and a Docker execution service. All three communicate via REST internally, with WebSocket for real-time push to the client.',
      layers: [
        {
          name: 'Frontend (Next.js)',
          components: ['Code editor', 'Language selector', 'Results panel', 'Learning dashboard'],
          description: 'Server components for initial load, client components for the editor and real-time socket connection.',
        },
        {
          name: 'API Layer (Spring Boot)',
          components: ['Auth service', 'LLM proxy', 'Session store', 'WebSocket hub'],
          description: 'Validates JWT, orchestrates Docker execution, calls the LLM API, persists session data, and pushes results over WebSocket.',
        },
        {
          name: 'Execution Layer (Docker)',
          components: ['Container manager', 'Language runtimes', 'Resource limits'],
          description: 'Isolated containers per submission. Supports Python, Java, Node.js, Go, and Rust runtimes.',
        },
        {
          name: 'Infrastructure (AWS)',
          components: ['EC2 t2.micro', 'NGINX reverse proxy', 'SSL via Certbot'],
          description: 'Single EC2 instance with NGINX handling SSL termination and routing to Spring Boot (8080) and WebSocket (8081).',
        },
      ],
    },

    outcome: {
      heading: 'Outcome',
      body:
        'Live in production on Vercel + AWS EC2. The platform handles real code submissions with sub-3-second end-to-end latency including Docker spin-up, LLM response, and WebSocket delivery.',
      metrics: [
        { label: 'Languages Supported', value: '5',   note: 'Python, Java, Node.js, Go, Rust' },
        { label: 'Avg. Response Time',  value: '~2.8s', note: 'Docker + LLM + WebSocket delivery' },
        { label: 'Auth Flow',           value: 'OAuth2', note: 'GitHub login with JWT refresh tokens' },
        { label: 'Container Lifespan',  value: '10s',  note: 'Hard kill after timeout — zero persistence' },
      ],
    },

    learnings: [
      'Docker container lifecycle management in a Java/Spring Boot environment requires explicit process group handling — a simple kill doesn\'t always clean child processes',
      'Structured LLM prompts with JSON schema constraints dramatically improve reliability vs. free-form responses',
      'WebSocket connection re-establishment on mobile is non-trivial — exponential backoff with a cap is essential',
      'NGINX WebSocket proxy requires explicit `Upgrade` and `Connection` header forwarding, easy to miss',
    ],

    technologies: ['Next.js', 'Spring Boot', 'WebRTC', 'WebSockets', 'AWS EC2', 'NGINX', 'Docker', 'MongoDB', 'OAuth2', 'JWT'],
    links: {
      github: 'https://github.com/souvikree/TraceLearn.ai',
      live:   'https://tracelearnai.vercel.app/',
    },
  },

  // ── Clype ─────────────────────────────────────────────────
  {
    slug:        'clype',
    projectName: 'Clype',
    tagline:     'End-to-end encrypted video calling and chat — built from scratch',
    status:      'production',
    duration:    '2 months',
    role:        'Full Stack Engineer',
    team:        'Solo Project',
    color:       '#00FF87',

    overview:
      'Clype is a privacy-first communication platform. Users join rooms for real-time video, audio, and text — all routed peer-to-peer with no media passing through a server. A Spring Boot signaling layer coordinates ICE negotiation; NGINX on AWS EC2 terminates SSL.',

    problem: {
      heading: 'The Problem',
      body:
        'Most video call platforms route media through their own servers for recording, moderation, or analytics. For users who need genuine privacy, this is a dealbreaker. I wanted to build a system where the server\'s only job is to say "hello" — and then get out of the way.',
      points: [
        'Existing platforms route media through central servers — inherently not private',
        'WebRTC NAT traversal (STUN/TURN) is poorly documented for real-world deployments',
        'WebSocket connection lifecycle on mobile is fragile without proper reconnection logic',
        'SSL termination for WebSocket upgrades is a common NGINX misconfiguration',
      ],
    },

    solution: {
      heading: 'The Solution',
      body:
        'WebRTC for peer-to-peer media (audio + video + screen share), Spring Boot for signaling, Socket.io for messaging, and NGINX for reverse proxy + SSL.',
      steps: [
        {
          title: 'WebRTC Signaling via Spring Boot',
          description:
            'The server only handles SDP offer/answer exchange and ICE candidate relay. Once peers exchange ICE candidates, the media stream goes directly between browsers. The server sees zero audio or video bytes.',
          tech: ['Spring Boot', 'WebSockets', 'WebRTC', 'STUN/TURN'],
        },
        {
          title: 'ICE Candidate Strategy',
          description:
            'Configured Google\'s public STUN server for most connections. For symmetric NAT cases (common in corporate networks), integrated a TURN relay server. Gathered candidates before the offer/answer to minimize ICE restart round-trips.',
          tech: ['WebRTC', 'STUN', 'TURN', 'ICE'],
        },
        {
          title: 'Messaging Layer',
          description:
            'Real-time chat inside rooms uses Socket.io rooms (not WebRTC data channels) for reliability. Messages are ephemeral — nothing persisted server-side.',
          tech: ['Socket.io', 'Node.js'],
        },
        {
          title: 'Production Deployment',
          description:
            'Spring Boot runs as a systemd service on EC2 t2.micro. NGINX handles SSL termination and WebSocket upgrade headers. SSL via Let\'s Encrypt / Certbot with auto-renewal.',
          tech: ['AWS EC2', 'NGINX', 'Let\'s Encrypt', 'systemd'],
        },
      ],
    },

    architecture: {
      heading: 'Architecture',
      description:
        'Signaling server (Spring Boot) + media (peer-to-peer WebRTC) + chat (Socket.io) + deployment (NGINX + EC2). The media plane never touches the server.',
      layers: [
        {
          name: 'Client (Next.js)',
          components: ['RTCPeerConnection', 'MediaStream API', 'Socket.io client', 'Room UI'],
          description: 'Manages local camera/mic, renders remote streams, handles ICE events, and sends/receives signaling messages.',
        },
        {
          name: 'Signaling (Spring Boot)',
          components: ['WebSocket handler', 'Room registry', 'ICE relay', 'User session'],
          description: 'Routes SDP and ICE messages between peers. Stateless per-message — room state held in memory.',
        },
        {
          name: 'Media (WebRTC P2P)',
          components: ['STUN (Google)', 'TURN relay', 'SRTP encryption'],
          description: 'Direct peer-to-peer encrypted media. SRTP encryption is mandatory in all WebRTC implementations.',
        },
        {
          name: 'Infrastructure',
          components: ['AWS EC2 t2.micro', 'NGINX', 'Certbot SSL', 'systemd'],
          description: 'NGINX on port 443, proxying to Spring Boot (8080) with WebSocket upgrade headers set correctly.',
        },
      ],
    },

    outcome: {
      heading: 'Outcome',
      body:
        'Deployed and functional. Video calls work reliably over most network types. The architecture proves that privacy-first communication doesn\'t require compromising on reliability.',
      metrics: [
        { label: 'Media Routing',    value: 'P2P',       note: 'Zero server-side media bytes' },
        { label: 'Encryption',       value: 'SRTP',      note: 'Mandatory in WebRTC spec' },
        { label: 'Deployment',       value: 'AWS EC2',   note: 'NGINX + systemd + Let\'s Encrypt' },
        { label: 'ICE Success Rate', value: '~95%',      note: 'Fallback to TURN for symmetric NAT' },
      ],
    },

    learnings: [
      'NGINX WebSocket proxying requires `proxy_http_version 1.1`, `Upgrade`, and `Connection` headers — missing any one of them silently breaks WebSocket connections',
      'WebRTC ICE gathering should complete before sending the offer to avoid slow connection establishment',
      'Mobile browsers aggressively kill background WebSocket connections — heartbeat pings every 25 seconds are essential',
      'Let\'s Encrypt certificates expire every 90 days — auto-renewal via cron + Certbot is non-optional in production',
    ],

    technologies: ['Next.js', 'Spring Boot', 'WebRTC', 'WebSockets', 'AWS EC2', 'NGINX', 'Socket.io', 'STUN/TURN'],
    links: {
      github: 'https://github.com/souvikree/clype',
      live:   'https://clype.vercel.app',
    },
  },

  // ── BloodLink ─────────────────────────────────────────────
  {
    slug:        'bloodlink',
    projectName: 'BloodLink',
    tagline:     'Real-time geolocation matching between blood donors and recipients',
    status:      'production',
    duration:    '6 weeks',
    role:        'Full Stack Engineer',
    team:        'Solo Project',
    color:       '#FF6B35',

    overview:
      'BloodLink connects blood donors with recipients in real-time using geolocation-based matching. Hospitals and recipients post requests; nearby registered donors receive instant push notifications. The platform also maintains a directory of blood banks with stock data.',

    problem: {
      heading: 'The Problem',
      body:
        'Blood donation in India is largely ad-hoc — WhatsApp forwards and phone chains. There was no platform that matched the urgency of the request with the proximity of available donors in real time.',
      points: [
        'No real-time matching between donors and recipients by location',
        'Blood bank stock data is not publicly accessible or up-to-date',
        'Donors have no way to know when they\'re needed nearby',
        'Recipients in emergencies lose critical time making phone calls',
      ],
    },

    solution: {
      heading: 'The Solution',
      body:
        'A MERN stack platform with geospatial queries (MongoDB 2dsphere index), real-time notifications via Socket.io, and a Google Maps integration for radius-based matching.',
      steps: [
        {
          title: 'Geospatial Donor Matching',
          description:
            'Donor locations stored as GeoJSON points in MongoDB. Recipient requests trigger a `$near` query with a configurable radius (default 10km). Results ranked by distance and blood type compatibility.',
          tech: ['MongoDB', '2dsphere index', 'GeoJSON'],
        },
        {
          title: 'Real-time Notifications',
          description:
            'Matched donors receive instant Socket.io events with request details. Donors can accept/decline; accepted donors get the recipient\'s contact and map link. The system re-queries if the first batch declines within 5 minutes.',
          tech: ['Socket.io', 'Node.js', 'Express'],
        },
        {
          title: 'Google Maps Integration',
          description:
            'Interactive map showing donor density, blood banks, and hospitals. Radius circles visualize the search area. Clicking a blood bank shows real-time stock by type.',
          tech: ['Google Maps API', 'React'],
        },
        {
          title: 'Donor & Blood Bank Management',
          description:
            'Full CRUD for donor profiles with blood type, last donation date, and availability toggle. Blood banks can update stock levels. Admins can verify donor registration.',
          tech: ['React', 'Node.js', 'MongoDB', 'JWT'],
        },
      ],
    },

    architecture: {
      heading: 'Architecture',
      description:
        'Standard MERN stack with Socket.io for real-time events and MongoDB geospatial indexing for location queries.',
      layers: [
        {
          name: 'Frontend (React)',
          components: ['Donor dashboard', 'Request board', 'Map view', 'Blood bank directory'],
          description: 'React SPA with Google Maps embedded. Socket.io client listens for incoming match events.',
        },
        {
          name: 'Backend (Node.js + Express)',
          components: ['Auth (JWT)', 'Matching engine', 'Notification service', 'Blood bank API'],
          description: 'REST APIs for CRUD + a Socket.io server for real-time push. Geospatial queries delegated to MongoDB.',
        },
        {
          name: 'Database (MongoDB)',
          components: ['Users collection', 'Requests collection', 'BloodBanks collection', '2dsphere index'],
          description: 'GeoJSON coordinates on donor documents. 2dsphere index enables `$near` and `$geoWithin` queries.',
        },
      ],
    },

    outcome: {
      heading: 'Outcome',
      body:
        'Functional platform matching donors to recipients in under 2 seconds for searches within a 10km radius. The geospatial indexing makes radius queries instantaneous even with thousands of donor records.',
      metrics: [
        { label: 'Match Latency',     value: '<2s',   note: 'From request to first donor notification' },
        { label: 'Search Radius',     value: '10km',  note: 'Configurable per request' },
        { label: 'Blood Types',       value: '8',     note: 'A+, A−, B+, B−, AB+, AB−, O+, O−' },
        { label: 'Geo Index',         value: '2dsphere', note: 'MongoDB native geospatial query' },
      ],
    },

    learnings: [
      'MongoDB 2dsphere indexes require coordinates in [longitude, latitude] order (not latitude, longitude) — the opposite of most mapping conventions',
      'Socket.io room management is the right abstraction for per-request notification channels — one room per active request',
      'Google Maps API costs can escalate quickly — static maps for list views and dynamic maps only for the detail view keeps costs manageable',
    ],

    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Google Maps API', 'JWT'],
    links: {
      github: 'https://github.com/souvikree/bloodlink',
    },
  },

  // ── Insurance Management System ───────────────────────────
  {
    slug:        'insurance-management-system',
    projectName: 'Insurance Management System',
    tagline:     'Scalable microservices architecture for insurance policy and claims management',
    status:      'production',
    duration:    '6 weeks',
    role:        'Backend Engineer',
    team:        'Solo Project',
    color:       '#00FF87',

    overview:
      'A microservices-based insurance platform built with Spring Boot. Separate services handle user management, policy administration, and claims processing. Services discover each other via Netflix Eureka and communicate over REST. The system was my first hands-on application of distributed systems patterns learned from my Netflix Eureka OSS contribution.',

    problem: {
      heading: 'The Problem',
      body:
        'A monolithic insurance application becomes a maintenance and scaling nightmare as business rules grow. Policy management, claims processing, and user management have very different load profiles — they shouldn\'t compete for the same resources.',
      points: [
        'Monolithic architecture couples unrelated business domains',
        'Claims processing is CPU-intensive; user auth is I/O-bound — they should scale independently',
        'No service discovery means hardcoded service URLs — fragile and unscalable',
        'Testing a monolith requires the entire application to be running',
      ],
    },

    solution: {
      heading: 'The Solution',
      body:
        'Three independent Spring Boot microservices behind a Eureka service registry. Each service owns its own MySQL schema. REST clients use Eureka to resolve service addresses dynamically.',
      steps: [
        {
          title: 'Service Decomposition',
          description:
            'Three bounded contexts: User Service (registration, auth, profiles), Policy Service (policy types, enrollment, renewals), Claims Service (submission, adjudication, payouts). Each deployed independently with its own database.',
          tech: ['Spring Boot', 'MySQL', 'Maven'],
        },
        {
          title: 'Service Discovery (Eureka)',
          description:
            'Each service registers with a Eureka server on startup. The Policy and Claims services discover the User Service via Eureka rather than hardcoded URLs. This was directly informed by my PR #1602 to Netflix Eureka which improved health check granularity.',
          tech: ['Netflix Eureka', 'Spring Cloud', 'Health checks'],
        },
        {
          title: 'Data Persistence (JPA)',
          description:
            'Each service uses Spring Data JPA with its own MySQL schema. No shared tables — inter-service data fetched via REST. JPA entity relationships kept within service boundaries to avoid cross-service coupling.',
          tech: ['Spring Data JPA', 'MySQL', 'Hibernate'],
        },
        {
          title: 'Testing Strategy',
          description:
            'Unit tests with JUnit 5 and Mockito for service and repository layers. Integration tests using MockMvc for REST endpoint verification. Each service tested independently — true to the microservices isolation principle.',
          tech: ['JUnit 5', 'Mockito', 'MockMvc'],
        },
      ],
    },

    architecture: {
      heading: 'Architecture',
      description:
        'Three Spring Boot services + Eureka registry. React frontend communicates with services via a lightweight API gateway pattern.',
      layers: [
        {
          name: 'Frontend (React)',
          components: ['Policy dashboard', 'Claims portal', 'Admin panel'],
          description: 'React SPA. API calls routed through service endpoints discovered via Eureka.',
        },
        {
          name: 'User Service',
          components: ['Registration', 'Login (JWT)', 'Profile management', 'Eureka client'],
          description: 'Handles all user identity concerns. Issues JWT tokens consumed by other services.',
        },
        {
          name: 'Policy Service',
          components: ['Policy CRUD', 'Enrollment', 'Renewal logic', 'Eureka client'],
          description: 'Manages policy lifecycle. Calls User Service via Eureka for validation.',
        },
        {
          name: 'Claims Service',
          components: ['Claim submission', 'Adjudication workflow', 'Payout tracking', 'Eureka client'],
          description: 'Most complex service. Validates claims against active policies from Policy Service.',
        },
        {
          name: 'Eureka Server',
          components: ['Service registry', 'Health dashboard', 'Load balancing'],
          description: 'Central registry. Services self-register and deregister on shutdown.',
        },
      ],
    },

    outcome: {
      heading: 'Outcome',
      body:
        'Fully functional microservices system demonstrating domain isolation, service discovery, and independent deployability. The testing suite covers all critical business logic paths.',
      metrics: [
        { label: 'Services',        value: '3',       note: 'User, Policy, Claims' },
        { label: 'Discovery',       value: 'Eureka',  note: 'Dynamic service resolution' },
        { label: 'Test Coverage',   value: 'Unit + Integration', note: 'JUnit 5 + MockMvc' },
        { label: 'Databases',       value: '3 schemas', note: 'One MySQL schema per service' },
      ],
    },

    learnings: [
      'Eureka\'s default health check is too coarse for production — custom HealthIndicator beans give per-dependency granularity (this became my OSS contribution)',
      'JPA lazy loading across service boundaries silently returns nulls — all cross-service data must go through explicit REST calls',
      'Service startup order matters with Eureka — services that depend on others need retry logic during the registration window',
      'MockMvc integration tests are significantly more valuable than unit tests alone for REST APIs — they catch serialization issues that unit tests miss',
    ],

    technologies: ['React', 'Spring Boot', 'MySQL', 'Maven', 'JUnit 5', 'Mockito', 'Netflix Eureka', 'Spring Cloud', 'JPA', 'Hibernate'],
    links: {
      github: 'https://github.com/souvikree/insurance-system',
    },
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug)
}

export function getCaseStudyByProject(projectName: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.projectName === projectName)
}