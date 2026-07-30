export type TopicNode = {
  id: string;
  title: string;
  desc: string;
  status: "completed" | "in-progress" | "unstarted";
  resources: string[];
  interviewQuestion: string;
};

export type RoadmapGroup = {
  groupName: string;
  description: string;
  topics: TopicNode[];
};

export type RoadmapDetailData = {
  title: string;
  subtitle: string;
  icon: string;
  groups: RoadmapGroup[];
};

// Subtopic lists for dynamically generating high-quality roadmaps
const subtopicDefinitions: Record<string, { title: string; desc: string; resources: string[]; interviewQuestion: string }[]> = {
  react: [
    { title: "Components & JSX", desc: "Understand functional components, props, state, JSX syntax rules, and rendering list of items.", resources: ["React Docs: Components", "React Beta: Describing the UI"], interviewQuestion: "What is JSX, and how does React compile it under the hood?" },
    { title: "Hooks & Lifecycle", desc: "Master basic hooks: useState, useEffect, useContext. Learn rules of hooks and cleanup functions.", resources: ["React Hooks API Reference", "Overreacted: A Complete Guide to useEffect"], interviewQuestion: "What are the rules of hooks, and why can we not use hooks inside conditionals or loops?" },
    { title: "State Management", desc: "Manage component state, lift state up, use context provider, and explore Zustand/Redux for global state.", resources: ["React State Management Guide", "Zustand Docs"], interviewQuestion: "Explain the difference between local state, context API state, and specialized state management like Redux." },
    { title: "Routing", desc: "Implement client-side routing using React Router, link components, route parameters, and protected routes.", resources: ["React Router Tutorial", "Protected Routes in React"], interviewQuestion: "How does client-side routing work, and what is the role of History API?" },
    { title: "Performance Tuning", desc: "Learn optimization techniques: useMemo, useCallback, React.memo, lazy loading, and profiling.", resources: ["React Docs: Optimizing Performance", "React Profiler Guide"], interviewQuestion: "When should you use useMemo and useCallback, and when are they counterproductive?" }
  ],
  nextjs: [
    { title: "App Router & File System", desc: "Master layout.js, page.js, loading.js, error.js structure, and dynamic segment routing in Next.js.", resources: ["Next.js App Router Docs", "File-based routing explanation"], interviewQuestion: "How does layout nesting work in Next.js App Router, and what are the benefits?" },
    { title: "Server vs Client Components", desc: "Understand when to use Server Components (default) and Client Components ('use client' directive).", resources: ["Next.js Rendering: Server Components", "Client Components Guide"], interviewQuestion: "What are React Server Components (RSC), and how do they differ from Server-Side Rendering (SSR)?" },
    { title: "Server Actions", desc: "Write asynchronous server functions invoked directly from client forms without separate API endpoints.", resources: ["Next.js Data Fetching & Server Actions", "Mutations with Server Actions"], interviewQuestion: "How do Server Actions secure form submissions and handle server-side errors?" },
    { title: "Optimizations & Deployment", desc: "Configure image optimization, font loader, metadata SEO, and Vercel/Node hosting configurations.", resources: ["Next.js Optimizing Assets", "Deploying Next.js Apps"], interviewQuestion: "How does next/image component prevent Layout Shift (CLS) automatically?" }
  ],
  typescript: [
    { title: "Basic Types & Annotations", desc: "Learn primitives, arrays, tuples, enums, any, unknown, and void declarations.", resources: ["TS handbook: Everyday Types", "TypeScript Deep Dive"], interviewQuestion: "What is the difference between any and unknown types in TypeScript?" },
    { title: "Interfaces vs Type Aliases", desc: "Understand type declarations, extending types, union and intersection types, and merging interfaces.", resources: ["TS Docs: Interfaces", "Types vs Interfaces Comparison"], interviewQuestion: "What are the main differences between a type alias and an interface?" },
    { title: "Generics", desc: "Create reusable components and functions using generic types, constraints, and utility types.", resources: ["TypeScript Generics Guide", "Advanced TS: Generics"], interviewQuestion: "What is a generic type constraint, and how do you write one using the 'extends' keyword?" },
    { title: "TSConfig & Tooling", desc: "Configure tsconfig.json compiler options: strictMode, target, moduleResolution, and build paths.", resources: ["TSConfig Reference", "TS Loader configurations"], interviewQuestion: "What compile options are enabled when strict is set to true in tsconfig.json?" }
  ],
  nodejs: [
    { title: "Event Loop & Async I/O", desc: "Deep dive into thread pool, libuv, microtasks, and macrotasks queues in Node.js runtime.", resources: ["Node.js Event Loop documentation", "Understanding Libuv"], interviewQuestion: "Explain how Node.js handles thousands of concurrent requests single-threaded." },
    { title: "Streams & File System", desc: "Learn fs module, readable/writable streams, pipe method, buffers, and handling large data files.", resources: ["Node.js Streams Handbook", "Working with Buffers in Node"], interviewQuestion: "Why should you use streams instead of fs.readFile for loading large files?" },
    { title: "Express Server & Routing", desc: "Build REST endpoints, use body-parsers, router objects, and structure modular application routes.", resources: ["Express Guide: Routing", "REST API Development with Express"], interviewQuestion: "What is Express middleware, and how does the middleware execution pipeline work?" },
    { title: "JWT & Security", desc: "Implement user authentication, token generation, payload encryption, and CORS headers configuration.", resources: ["JSON Web Token introduction", "Node.js Security Checklist"], interviewQuestion: "How does JWT auth work, and how do you secure access and refresh tokens?" }
  ],
  golang: [
    { title: "Syntax & Pointers", desc: "Learn Go variables, short declarations, control loops, arrays, slices, maps, and pointer safety.", resources: ["A Tour of Go", "Effective Go Guide"], interviewQuestion: "What is the difference between an array and a slice in Go, and how does slices grow?" },
    { title: "Goroutines & Channels", desc: "Master concurrent design, channels, buffered channels, select statement, and sync package tools.", resources: ["Go Concurrency Tutorial", "Goroutines Explained"], interviewQuestion: "Explain channels in Go and how they are used for thread synchronization." },
    { title: "Interfaces & Structs", desc: "Declare structs, define methods, implement interfaces implicitly, and compile-time type assertion.", resources: ["Go OOP Basics", "Implicit Interfaces in Go"], interviewQuestion: "What are implicit interfaces in Go and why are they considered highly decoupled?" },
    { title: "Testing in Go", desc: "Write unit tests using testing package, go test commands, table-driven tests, and benchmark functions.", resources: ["Testing in Go - Official", "Writing benchmarks in Go"], interviewQuestion: "How do you write a table-driven unit test in Go?" }
  ],
  rust: [
    { title: "Ownership & Borrowing", desc: "Understand stack vs heap, borrow checker rules, references, mutable references, and copy vs move.", resources: ["The Rust Programming Language Book", "Understanding Ownership"], interviewQuestion: "Explain how the Rust borrow checker prevents data races at compile time." },
    { title: "Lifetimes & Generics", desc: "Learn explicit lifetime annotations, lifetime elision, generic functions, traits, and bounds.", resources: ["Rust Book: Lifetimes", "Traits and Generics"], interviewQuestion: "What is a lifetime annotation, and does it change the actual runtime duration of a variable?" },
    { title: "Error Handling", desc: "Utilize Option and Result enums, match expressions, if let, unwrap, expect, and the '?' operator.", resources: ["Rust Book: Error Handling", "Error handling in Rust guide"], interviewQuestion: "Explain the difference between panic! and the Result enum in Rust error handling." },
    { title: "Cargo & Modules", desc: "Manage project hierarchy with modules, crates, cargo dependencies, workspaces, and lock files.", resources: ["Cargo Book", "Rust Module System"], interviewQuestion: "What does cargo.lock do, and why should it be checked into version control?" }
  ],
  docker: [
    { title: "Dockerfiles & Images", desc: "Write custom Dockerfiles, optimize caching with layer ordering, and use multi-stage builds.", resources: ["Docker Docs: Dockerfile Reference", "Best Practices for Dockerfiles"], interviewQuestion: "What is a multi-stage Docker build, and how does it reduce final image size?" },
    { title: "Containers & Volumes", desc: "Manage running containers, run detached container, inspect logs, and use volumes/bind mounts for persistence.", resources: ["Working with Volumes in Docker", "Docker CLI Reference"], interviewQuestion: "What is the difference between a bind mount and a docker volume?" },
    { title: "Docker Compose", desc: "Define multi-container applications in docker-compose.yml, set networks, link containers, and manage variables.", resources: ["Docker Compose Official Tutorial", "Compose File Syntax"], interviewQuestion: "How do you define service dependencies and health checks in docker-compose?" }
  ],
  kubernetes: [
    { title: "Pods & Deployments", desc: "Understand Pod lifecycle, write deployment YAML manifest files, and manage replica sets.", resources: ["Kubernetes Pods Docs", "Managing Deployments"], interviewQuestion: "What is a Pod, and why does Kubernetes run containers inside Pods instead of directly?" },
    { title: "Services & Ingress", desc: "Route internal cluster traffic using ClusterIP/NodePort Services, and external web traffic with Ingress controllers.", resources: ["Kubernetes Services Tutorial", "Ingress Controllers Guide"], interviewQuestion: "What is the difference between a Service and an Ingress in Kubernetes?" },
    { title: "ConfigMaps & Secrets", desc: "Store environment variables, configuration files, credentials, and inject them into container pods.", resources: ["Kubernetes ConfigMap and Secret Guide", "Injecting Configuration"], interviewQuestion: "How do you mount a Kubernetes Secret as a file inside a container?" }
  ]
};

// Explicit templates for core roadmaps
export const predefinedRoadmaps: Record<string, RoadmapDetailData> = {
  python: {
    title: "Python Developer Roadmap",
    subtitle: "Step-by-step guide to mastering modern Python development, from foundations to web APIs and asynchronous patterns.",
    icon: "🐍",
    groups: [
      {
        groupName: "1. Language Fundamentals",
        description: "Core syntax, data types, and structural patterns that every Python programmer must master.",
        topics: [
          {
            id: "py-basics",
            title: "Variables & Control Flow",
            desc: "Understand dynamic typing, loops, conditional branch logic, and pattern matching.",
            status: "completed",
            resources: ["Python Docs: Control Flow", "RealPython: Python Basics"],
            interviewQuestion: "What is the difference between '/' and '//' in division, and how does Python handle integers vs floats?",
          },
          {
            id: "py-functions",
            title: "Functions & Scope",
            desc: "Master positional/keyword arguments, *args, **kwargs, lambda functions, and LEGB scoping rules.",
            status: "completed",
            resources: ["Python Functions Guide", "Understanding LEGB Scope"],
            interviewQuestion: "Explain the difference between local, global, and nonlocal variable scopes in Python.",
          },
          {
            id: "py-ds",
            title: "Built-in Data Structures",
            desc: "Deep dive into Lists, Tuples, Dictionaries, and Sets. Learn about time complexities of their operations.",
            status: "in-progress",
            resources: ["Python Data Structures Docs", "Big-O Time Complexity of Python Lists/Dicts"],
            interviewQuestion: "Why are dictionary lookups O(1)? Explain how hashing works in Python.",
          },
        ],
      },
      {
        groupName: "2. Object-Oriented & Advanced Python",
        description: "Structure your applications cleanly with OOP principles and advanced language decorators.",
        topics: [
          {
            id: "py-oop",
            title: "OOP Principles",
            desc: "Classes, objects, inheritance, polymorphism, encapsulation, and special dunder (magic) methods.",
            status: "in-progress",
            resources: ["OOP in Python - RealPython", "Dunder Methods Guide"],
            interviewQuestion: "What is the __init__ method? How does it differ from __new__?",
          },
          {
            id: "py-adv",
            title: "Decorators & Generators",
            desc: "Write clean wrapper logic using decorators, and memory-efficient iterators using generators and the yield keyword.",
            status: "unstarted",
            resources: ["Primer on Python Decorators", "Python Generators & Yield"],
            interviewQuestion: "How do generators save memory? Write a custom decorator that measures function execution time.",
          },
          {
            id: "py-async",
            title: "AsyncIO & Concurrency",
            desc: "Learn cooperative multitasking using async/await, event loops, tasks, and concurrency vs parallelism.",
            status: "unstarted",
            resources: ["AsyncIO Walkthrough", "Threading vs Multiprocessing in Python"],
            interviewQuestion: "What is the Python GIL (Global Interpreter Lock)? How does it affect CPU-bound vs I/O-bound operations?",
          },
        ],
      },
      {
        groupName: "3. Web & API Frameworks",
        description: "Build high-performance REST APIs and microservices using industry-standard Python frameworks.",
        topics: [
          {
            id: "py-fastapi",
            title: "FastAPI / Flask",
            desc: "Create quick endpoints, utilize dependency injection, validate payloads with Pydantic, and automatic OpenAPI docs.",
            status: "unstarted",
            resources: ["FastAPI Tutorial", "SQLAlchemy integration"],
            interviewQuestion: "How does FastAPI leverage asynchronous code and type annotations to gain performance?",
          },
          {
            id: "py-django",
            title: "Django Framework",
            desc: "Build monolithic apps using Django's ORM, admin panel, template rendering, and user auth systems.",
            status: "unstarted",
            resources: ["Official Django Polls App", "Django REST Framework (DRF) Guide"],
            interviewQuestion: "What is Django's MVT pattern, and how does the Django ORM protect against SQL Injection?",
          },
        ],
      },
    ],
  },
  frontend: {
    title: "Frontend Developer Roadmap",
    subtitle: "Complete path for building interactive user interfaces, mastering React, state management, and asset pipelines.",
    icon: "🌐",
    groups: [
      {
        groupName: "1. Core Web Foundations",
        description: "The primary technologies powering all web browsers.",
        topics: [
          {
            id: "fe-html-css",
            title: "Semantic HTML & CSS3",
            desc: "Structured document layout, responsive layouts with Flexbox and Grid, CSS custom variables, and responsive units.",
            status: "completed",
            resources: ["MDN HTML Reference", "CSS Tricks: Grid Guide"],
            interviewQuestion: "What is the CSS box model, and what is the difference between content-box and border-box?",
          },
          {
            id: "fe-js",
            title: "Modern ES6+ JavaScript",
            desc: "DOM manipulation, closures, promises, async/await, fetch API, array methods, and prototypal inheritance.",
            status: "completed",
            resources: ["JavaScript Info", "Eloquent JavaScript Book"],
            interviewQuestion: "What is event bubbling in JavaScript and how do you stop it using event methods?",
          },
        ],
      },
      {
        groupName: "2. Single-Page App Frameworks",
        description: "Building scalable UI architectures using modern component libraries.",
        topics: [
          {
            id: "fe-react",
            title: "React.js Essentials",
            desc: "JSX, virtual DOM, components, props, hooks (useState, useEffect, useMemo, useCallback), and standard state rules.",
            status: "in-progress",
            resources: ["New React documentation", "React Hooks Reference"],
            interviewQuestion: "Why should you not update React state directly? How does the virtual DOM reconciliation work?",
          },
          {
            id: "fe-nextjs",
            title: "Next.js Framework",
            desc: "Server-side rendering (SSR), Static Site Generation (SSG), App Router, file-based routing, server actions, and optimization.",
            status: "unstarted",
            resources: ["Official Next.js Learn Course", "Next.js Rendering strategies"],
            interviewQuestion: "Explain the difference between Server Components and Client Components in Next.js 14 App Router.",
          },
        ],
      },
    ],
  },
  backend: {
    title: "Backend Developer Roadmap",
    subtitle: "Architecture path for system design, API frameworks, database indexing, caching, and server deployments.",
    icon: "⚙️",
    groups: [
      {
        groupName: "1. Servers & API Paradigms",
        description: "Creating secure, high-performance web servers and endpoint protocols.",
        topics: [
          {
            id: "be-servers",
            title: "Node.js / Express / Python",
            desc: "Setting up server routes, middlewares, handling requests, file streaming, and process cluster modules.",
            status: "completed",
            resources: ["Node.js Guides", "Express Web Routing"],
            interviewQuestion: "Explain the Node.js event loop and how it handles asynchronous I/O operations non-blockingly.",
          },
          {
            id: "be-apis",
            title: "REST vs GraphQL",
            desc: "Creating uniform REST resources, status codes, query filtering, and building flexible GraphQL schema APIs.",
            status: "in-progress",
            resources: ["RESTful API Best Practices", "GraphQL Official Intro"],
            interviewQuestion: "What is the over-fetching and under-fetching problem in REST, and how does GraphQL solve it?",
          },
        ],
      },
      {
        groupName: "2. Databases & Caching",
        description: "Data modeling, schema design, and microsecond caching logic.",
        topics: [
          {
            id: "be-sql",
            title: "Relational DBs (PostgreSQL)",
            desc: "Schemas, normalization, primary/foreign keys, joins, indexes, transaction ACID compliance, and query performance.",
            status: "in-progress",
            resources: ["PostgreSQL Tutorial", "Use The Index, Luke! Indexing Guide"],
            interviewQuestion: "What is a database transaction deadlock, and what are the ACID properties?",
          },
          {
            id: "be-cache",
            title: "Caching with Redis",
            desc: "Redis data structures, memory caching, TTL policies, cache invalidation, and session management.",
            status: "unstarted",
            resources: ["Redis University", "Cache patterns: write-through, read-through"],
            interviewQuestion: "Explain the cache stampede problem and how to mitigate it with locking.",
          },
        ],
      },
    ],
  },
  devops: {
    title: "DevOps Engineer Roadmap",
    subtitle: "Comprehensive path to master continuous integration, automation, containerization, and cloud infrastructure operations.",
    icon: "🔄",
    groups: [
      {
        groupName: "1. Version Control & OS Foundations",
        description: "Primary tools for source code management and operating system basics.",
        topics: [
          {
            id: "do-git",
            title: "Git & GitHub",
            desc: "Branching strategies, merge conflict resolution, rebase vs merge, pull requests.",
            status: "completed",
            resources: ["Git Documentation", "GitHub Guides"],
            interviewQuestion: "What is the difference between git reset and git revert, and when would you use each?",
          },
          {
            id: "do-linux",
            title: "Linux & Bash Scripting",
            desc: "Process monitoring, filesystem permissions, SSH keys, bash scripting foundations.",
            status: "in-progress",
            resources: ["Linux Command Line", "Bash Scripting Cheat Sheet"],
            interviewQuestion: "How do you search for a pattern in files recursively using command line tools like grep?",
          },
        ],
      },
      {
        groupName: "2. Containers & CI/CD",
        description: "Standard containerization techniques and continuous testing pipelines.",
        topics: [
          {
            id: "do-docker",
            title: "Docker Containers",
            desc: "Writing Dockerfiles, multi-stage builds, managing images, Docker Compose orchestration.",
            status: "unstarted",
            resources: ["Docker Official Get Started", "Best Practices for Dockerfiles"],
            interviewQuestion: "Explain the difference between a Docker image and a Docker container, and how overlay FS works.",
          },
          {
            id: "do-cicd",
            title: "CI/CD (GitHub Actions)",
            desc: "Automating builds, testing, linting, and deployments with GitHub Actions pipelines.",
            status: "unstarted",
            resources: ["GitHub Actions Quickstart", "YAML workflow syntax"],
            interviewQuestion: "What is a runner in GitHub Actions, and how do you configure a job dependencies flow?",
          },
        ],
      },
    ],
  },
  "full-stack": {
    title: "Full Stack Developer Roadmap",
    subtitle: "Master both ends of development: build interactive user interfaces and scale resilient backend server architectures.",
    icon: "🚀",
    groups: [
      {
        groupName: "1. Client & User Interface",
        description: "Building responsive, component-driven client applications.",
        topics: [
          {
            id: "fs-client",
            title: "React & Next.js",
            desc: "Component architecture, server vs client components, routing and rendering strategies.",
            status: "completed",
            resources: ["React Docs", "Next.js Learning Path"],
            interviewQuestion: "What is the difference between client-side rendering and static site generation?",
          },
          {
            id: "fs-styles",
            title: "Modern CSS & Responsive Web",
            desc: "Designing responsive interfaces with Flexbox, CSS Grid, and custom variables.",
            status: "completed",
            resources: ["CSS Grid Guide", "Responsive Web Design principles"],
            interviewQuestion: "How does CSS grid differs from Flexbox in terms of 1D vs 2D layout planning?",
          },
        ],
      },
      {
        groupName: "2. Server & Data Architecture",
        description: "Backend API endpoints, security middleware, and database engines.",
        topics: [
          {
            id: "fs-api",
            title: "REST APIs & Backend",
            desc: "RESTful principles, request routing, middleware security, validation.",
            status: "in-progress",
            resources: ["RESTful API Best Practices", "JWT Authentication Guide"],
            interviewQuestion: "How do you securely store user passwords in a database? Explain salt and hashing.",
          },
          {
            id: "fs-db",
            title: "Databases (SQL & NoSQL)",
            desc: "Data modeling, PostgreSQL, MongoDB, SQL queries, indexes, performance tuning.",
            status: "unstarted",
            resources: ["SQL vs NoSQL guide", "MongoDB fundamentals"],
            interviewQuestion: "What is an index in a database, and how does it speed up queries at the expense of writes?",
          },
        ],
      },
    ],
  },
  javascript: {
    title: "JavaScript Language Roadmap",
    subtitle: "Master the core programming language of the modern web, from syntax and asynchronous loops to memory profiles.",
    icon: "📜",
    groups: [
      {
        groupName: "1. Language Deep Dive",
        description: "Execution contexts, scopes, closures, and async event handling.",
        topics: [
          {
            id: "js-closures",
            title: "Closures & Scope",
            desc: "Lexical environments, execution context, block scope vs function scope, scope chain.",
            status: "completed",
            resources: ["MDN Closures", "Understanding Execution Context"],
            interviewQuestion: "What is a closure in JavaScript, and what are some common use cases for it?",
          },
          {
            id: "js-async",
            title: "Asynchronous Event Loop",
            desc: "Promises, async/await, microtasks vs macrotasks queues, call stack operations.",
            status: "in-progress",
            resources: ["JavaScript Event Loop explained", "Promises guide"],
            interviewQuestion: "Explain the order of execution between a setTimeout, a Promise.then, and console.log.",
          },
        ],
      },
      {
        groupName: "2. DOM & Client Environment",
        description: "Browser APIs, event loops, and development configurations.",
        topics: [
          {
            id: "js-dom",
            title: "DOM APIs & Event Flow",
            desc: "Event delegation, bubbling, capturing, modern Fetch API, WebSockets.",
            status: "unstarted",
            resources: ["DOM Event flow", "Fetch API reference"],
            interviewQuestion: "What is event delegation, and how does it optimize page memory?",
          },
          {
            id: "js-tools",
            title: "Vite, npm, & Tooling",
            desc: "Configuring Vite bundler, npm scripts, ESLint, and Prettier.",
            status: "unstarted",
            resources: ["Vite Guide", "Package.json reference"],
            interviewQuestion: "What is package-lock.json and why is it important to commit it?",
          },
        ],
      },
    ],
  },
  c: {
    title: "C Programming Roadmap",
    subtitle: "Master memory layouts, raw pointers, compilers, file operations, and systems-level development from scratch.",
    icon: "🔧",
    groups: [
      {
        groupName: "1. Foundations & Syntax",
        description: "Variables, basic operations, loops, static types, and compile structure.",
        topics: [
          {
            id: "c-syntax",
            title: "Data Types & Variables",
            desc: "Integer sizes, float limits, char data type, format specifiers, signed vs unsigned modifiers.",
            status: "completed",
            resources: ["C Syntax Reference", "Learn-C Basics"],
            interviewQuestion: "What is the difference between char, short, int, and long in C? How does it depend on compiler architecture?"
          },
          {
            id: "c-control",
            title: "Control Structures",
            desc: "If-else conditions, switch cases, for/while loops, break/continue statement behaviors.",
            status: "completed",
            resources: ["C Control Flow Guide", "Control flow loops tutorial"],
            interviewQuestion: "Explain switch case fall-through and why the break statement is crucial."
          }
        ]
      },
      {
        groupName: "2. Memory & Pointers",
        description: "Deep dive into pointer arithmetic, addresses, struct alignment, and stack vs heap allocations.",
        topics: [
          {
            id: "c-pointers",
            title: "Pointer Arithmetic & Addressing",
            desc: "Dereferencing pointers, void pointers, NULL pointers, array-pointer duality, and double pointers.",
            status: "in-progress",
            resources: ["Understanding Pointers in C", "Pointer Arithmetic Deep Dive"],
            interviewQuestion: "What is a wild pointer, a dangling pointer, and a memory leak? How do you prevent them?"
          },
          {
            id: "c-alloc",
            title: "Dynamic Memory Allocation",
            desc: "Heap management using malloc(), calloc(), realloc(), and proper cleanup using free().",
            status: "unstarted",
            resources: ["Malloc and Calloc guide", "C Memory management"],
            interviewQuestion: "What is the difference between malloc and calloc? What happens if you realloc to a smaller size?"
          }
        ]
      }
    ]
  },
  "product-design": {
    title: "Product Design Roadmap",
    subtitle: "Complete pathway to master user research, wireframing, interactive prototyping, usability testing, and design systems.",
    icon: "🎨",
    groups: [
      {
        groupName: "1. Research & Strategy",
        description: "Understand user problems, conduct competitor analysis, and map user personas.",
        topics: [
          {
            id: "pd-research",
            title: "User Research & Surveys",
            desc: "Quantitative and qualitative research, interviews, creating surveys, and analyzing patterns.",
            status: "completed",
            resources: ["Nielsen Norman Group Research Methods", "User Research Field Guide"],
            interviewQuestion: "What is usability testing, and how does it differ from beta testing or focus groups?"
          },
          {
            id: "pd-personas",
            title: "User Personas & Journey Maps",
            desc: "Drafting realistic target personas, mapping action paths, finding pain points, and design opportunity spaces.",
            status: "in-progress",
            resources: ["Creating UX Personas", "Customer Journey Mapping Guide"],
            interviewQuestion: "How do user journey maps help identify product feature priorities?"
          }
        ]
      },
      {
        groupName: "2. Design & Prototyping",
        description: "Build layouts, construct design components, and design high-fidelity interactive flow mockups.",
        topics: [
          {
            id: "pd-wireframing",
            title: "Wireframing & IA",
            desc: "Low-fidelity sketch wireframes, user flow charts, content mapping, and Information Architecture.",
            status: "in-progress",
            resources: ["Information Architecture Basics", "Figma Wireframing Kits"],
            interviewQuestion: "What is structural visual hierarchy in layouts, and how do wireframes establish it?"
          },
          {
            id: "pd-prototype",
            title: "Interactive Prototypes",
            desc: "Figma animations, variables, component states, interactive micro-interactions, and screen flows.",
            status: "unstarted",
            resources: ["Figma Prototyping Tutorials", "Advanced Prototyping with Variables"],
            interviewQuestion: "How do high-fidelity prototypes save engineering time and budget during product iteration?"
          }
        ]
      }
    ]
  }
};

// Generates high-quality interactive roadmap elements for any slug dynamically
export function generateDynamicRoadmap(slug: string, title: string, subtitle: string, icon: string): RoadmapDetailData {
  if (predefinedRoadmaps[slug]) {
    return predefinedRoadmaps[slug];
  }

  // Attempt to match subtopic from dictionary, or fallback
  const subtopics = subtopicDefinitions[slug] || [
    {
      title: `${title} Fundamentals`,
      desc: `Master core concepts, variables, syntax structures, and essential configuration for ${title}.`,
      resources: [`Official ${title} Documentation`, `${title} Quick Start Guide`],
      interviewQuestion: `What are the core design patterns or principles behind ${title}?`
    },
    {
      title: `Intermediate ${title} Operations`,
      desc: `Understand libraries, API integrations, data operations, security practices, and routing structures.`,
      resources: [`${title} Developer Guides`, `Building Projects with ${title}`],
      interviewQuestion: `How does ${title} handle concurrency, state, or caching in medium-to-large applications?`
    },
    {
      title: `Advanced ${title} & Production`,
      desc: `Optimize deployment pipelines, profiling metrics, design architecture patterns, and production hosting setup.`,
      resources: [`Advanced ${title} Patterns`, `${title} Performance Best Practices`],
      interviewQuestion: `What is the most complex scaling challenge you have faced with ${title}, and how did you resolve it?`
    }
  ];

  // Map subtopics to the standard groups
  const groups: RoadmapGroup[] = [
    {
      groupName: "1. Getting Started & Core Setup",
      description: `Understand the foundations, essential installations, and basic syntax rules of ${title}.`,
      topics: [
        {
          id: `${slug}-topic-1`,
          title: subtopics[0]?.title || `${title} Basics`,
          desc: subtopics[0]?.desc || `Essential foundations and syntax setup.`,
          status: "completed",
          resources: subtopics[0]?.resources || [`${title} Docs`],
          interviewQuestion: subtopics[0]?.interviewQuestion || `What is the most important concept in ${title}?`
        }
      ]
    },
    {
      groupName: "2. Developing Core Features",
      description: `Deep dive into standard modules, routing, design integrations, and backend connections.`,
      topics: [
        {
          id: `${slug}-topic-2`,
          title: subtopics[1]?.title || `${title} Operations`,
          desc: subtopics[1]?.desc || `Building intermediate application flows and structures.`,
          status: "in-progress",
          resources: subtopics[1]?.resources || [`${title} Reference Guide`],
          interviewQuestion: subtopics[1]?.interviewQuestion || `Explain the data lifecycle in a standard ${title} application.`
        }
      ]
    },
    {
      groupName: "3. Scaling & Deployments",
      description: `Optimize speeds, design scalable patterns, build pipeline integrations, and prepare for production launch.`,
      topics: [
        {
          id: `${slug}-topic-3`,
          title: subtopics[2]?.title || `${title} Optimization`,
          desc: subtopics[2]?.desc || `Production performance tuning, memory profiling, and CI/CD.`,
          status: "unstarted",
          resources: subtopics[2]?.resources || [`Advanced ${title} Guidelines`],
          interviewQuestion: subtopics[2]?.interviewQuestion || `How do you secure and scale ${title} in a enterprise environment?`
        }
      ]
    }
  ];

  // If we have extra subtopics in dictionary, append them to the groups accordingly
  if (subtopics.length > 3) {
    groups[0].topics.push({
      id: `${slug}-topic-4`,
      title: subtopics[3].title,
      desc: subtopics[3].desc,
      status: "unstarted",
      resources: subtopics[3].resources,
      interviewQuestion: subtopics[3].interviewQuestion
    });
  }
  if (subtopics.length > 4) {
    groups[1].topics.push({
      id: `${slug}-topic-5`,
      title: subtopics[4].title,
      desc: subtopics[4].desc,
      status: "unstarted",
      resources: subtopics[4].resources,
      interviewQuestion: subtopics[4].interviewQuestion
    });
  }

  return {
    title,
    subtitle: subtitle || `The developer-curated path to learning ${title} step-by-step from zero to expert.`,
    icon: icon || "⚡",
    groups
  };
}
