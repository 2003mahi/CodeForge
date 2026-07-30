"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { BookOpen, ChevronRight, CheckCircle2, Circle, Star, ArrowLeft, ExternalLink, HelpCircle, Layers } from "lucide-react";

type TopicNode = {
  id: string;
  title: string;
  desc: string;
  status: "completed" | "in-progress" | "unstarted";
  resources: string[];
  interviewQuestion: string;
};

type RoadmapGroup = {
  groupName: string;
  description: string;
  topics: TopicNode[];
};

type RoadmapData = {
  title: string;
  subtitle: string;
  icon: string;
  groups: RoadmapGroup[];
};

const roadmaps: Record<string, RoadmapData> = {
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
    icon: "💻",
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
    icon: "☁️",
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
  fullstack: {
    title: "Full Stack Developer Roadmap",
    subtitle: "Master both ends of development: build interactive user interfaces and scale resilient backend server architectures.",
    icon: "⚡",
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
            resources: ["REST API Best Practices", "JWT Authentication Guide"],
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
    icon: "🟨",
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
};

export default function Roadmaps() {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicNode | null>(null);
  const [userStatuses, setUserStatuses] = useState<Record<string, "completed" | "in-progress" | "unstarted">>({});

  const activeRoadmap = selectedRoadmapId ? roadmaps[selectedRoadmapId] : null;

  const toggleTopicStatus = (topicId: string, currentStatus: "completed" | "in-progress" | "unstarted") => {
    const nextStatusMap: Record<string, "completed" | "in-progress" | "unstarted"> = {
      unstarted: "in-progress",
      "in-progress": "completed",
      completed: "unstarted",
    };
    const next = nextStatusMap[currentStatus];
    setUserStatuses((prev) => ({ ...prev, [topicId]: next }));
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic((prev) => prev ? { ...prev, status: next } : null);
    }
  };

  const getTopicStatus = (topic: TopicNode) => {
    return userStatuses[topic.id] || topic.status;
  };

  return (
    <div style={{ display: "flex", background: "#0A0A0F", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, padding: "32px 36px", color: "#fff" }}>
        
        {!activeRoadmap ? (
          /* Roadmap Directory Listing */
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <BookOpen size={24} color="#7C3AED" />
                <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" }}>Developer Roadmaps</h1>
              </div>
              <p style={{ color: "#64748B", fontSize: 15 }}>
                Master coding pathways curated from real-world requirements. Click any roadmap to explore resources, practice challenges, and interview prep guides.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
              {Object.entries(roadmaps).map(([key, map]) => (
                <div 
                  key={key} 
                  className="glass border-gradient card-hover" 
                  style={{ padding: 28, borderRadius: 20, cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                  onClick={() => setSelectedRoadmapId(key)}
                >
                  <div>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>{map.icon}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: "#fff" }}>{map.title}</h3>
                    <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, marginBottom: 20 }}>{map.subtitle}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C084FC", fontSize: 13, fontWeight: 600 }}>
                    Start learning path <ChevronRight size={14} />
                  </div>
                </div>
              ))}
            </div>

            {/* Impressive Stats Section */}
            <div className="glass-dark" style={{ marginTop: 48, padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#A855F7", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Layers size={18} /> WHY USE OUR INTERACTIVE ROADMAPS?
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                {[
                  { title: "No Tutorial Hell", text: "Linear paths that tell you exactly what is critical to learn and what is safe to defer." },
                  { title: "Integrated Challenges", text: "Click topics to see real-world coding problems linked in our Sandbox/Playground." },
                  { title: "AI-Curated Topics", text: "Continually kept up-to-date with developer hiring trends and top product firm requirements." }
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{item.title}</div>
                    <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Individual Active Roadmap View */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
            <div>
              {/* Top Navigation */}
              <button 
                onClick={() => { setSelectedRoadmapId(null); setSelectedTopic(null); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20, padding: 0 }}
              >
                <ArrowLeft size={14} /> Back to Roadmaps
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{activeRoadmap.icon}</span>
                <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em" }}>{activeRoadmap.title}</h1>
              </div>
              <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>{activeRoadmap.subtitle}</p>

              {/* Connected Visual Roadmap Tree */}
              <div style={{ position: "relative", paddingLeft: 12 }}>
                {/* SVG Connecting Timeline Line */}
                <div style={{ position: "absolute", left: 16, top: 20, bottom: 20, width: 2, background: "linear-gradient(180deg, #7C3AED 0%, #3B82F6 50%, rgba(255,255,255,0.05) 100%)", zIndex: 1 }} />

                {activeRoadmap.groups.map((group, gIdx) => (
                  <div key={gIdx} style={{ position: "relative", marginBottom: 40, zIndex: 2, paddingLeft: 32 }}>
                    
                    {/* Visual Group Node */}
                    <div style={{ 
                      position: "absolute", left: -6, top: 4, width: 14, height: 14, borderRadius: "50%", 
                      background: "#7C3AED", border: "3px solid #0A0A0F", boxShadow: "0 0 10px #7C3AED" 
                    }} />

                    <div style={{ marginBottom: 16 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{group.groupName}</h3>
                      <p style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{group.description}</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {group.topics.map((topic) => {
                        const status = getTopicStatus(topic);
                        const isSelected = selectedTopic?.id === topic.id;
                        
                        return (
                          <div 
                            key={topic.id}
                            className="glass-dark"
                            style={{ 
                              padding: "16px 20px", borderRadius: 14, cursor: "pointer", 
                              border: isSelected ? "1.5px solid #A855F7" : "1px solid rgba(255,255,255,0.06)",
                              background: isSelected ? "rgba(124, 58, 237, 0.08)" : "rgba(255,255,255,0.02)",
                              transition: "all 0.2s ease",
                              boxShadow: isSelected ? "0 0 15px rgba(168, 85, 247, 0.2)" : "none"
                            }}
                            onClick={() => setSelectedTopic(topic)}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTopicStatus(topic.id, status);
                                  }}
                                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                                >
                                  {status === "completed" ? (
                                    <CheckCircle2 size={18} color="#10B981" />
                                  ) : status === "in-progress" ? (
                                    <Circle size={18} color="#F59E0B" />
                                  ) : (
                                    <Circle size={18} color="rgba(255,255,255,0.2)" />
                                  )}
                                </button>
                                <div>
                                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{topic.title}</h4>
                                  <p style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{topic.desc}</p>
                                </div>
                              </div>
                              <ChevronRight size={16} color="#475569" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Topic Drawer Panel */}
            <div style={{ position: "sticky", top: 32, height: "calc(100vh - 64px)", overflowY: "auto" }}>
              {selectedTopic ? (
                <div className="glass-dark" style={{ padding: 24, borderRadius: 20, border: "1.5px solid rgba(168, 85, 247, 0.4)", background: "#0F0F16", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span className={`badge ${
                        getTopicStatus(selectedTopic) === "completed" ? "badge-green" : getTopicStatus(selectedTopic) === "in-progress" ? "badge-orange" : "badge-purple"
                      }`} style={{ textTransform: "capitalize" }}>
                        {getTopicStatus(selectedTopic)}
                      </span>
                      <button 
                        onClick={() => setSelectedTopic(null)}
                        style={{ background: "transparent", border: "none", color: "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                      >
                        Clear
                      </button>
                    </div>

                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{selectedTopic.title}</h3>
                    <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6, marginBottom: 20 }}>{selectedTopic.desc}</p>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", marginBottom: 10, textTransform: "uppercase" }}>Quick Resources</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {selectedTopic.resources.map((res, idx) => (
                          <a 
                            key={idx} 
                            href="#" 
                            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#C084FC", textDecoration: "none" }}
                            onClick={(e) => e.preventDefault()}
                          >
                            <ExternalLink size={12} /> {res}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", marginBottom: 10, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
                        <HelpCircle size={12} /> Interview Question
                      </div>
                      <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10 }}>
                        <p style={{ fontSize: 12, color: "#fff", fontStyle: "italic", lineHeight: 1.5 }}>
                          "{selectedTopic.interviewQuestion}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    <button 
                      className="btn-primary" 
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => toggleTopicStatus(selectedTopic.id, getTopicStatus(selectedTopic))}
                    >
                      Change Status
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass" style={{ padding: 32, borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", height: "100%" }}>
                  <Star size={36} color="rgba(255,255,255,0.1)" style={{ marginBottom: 12 }} />
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Select a Topic</h4>
                  <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
                    Click on any topic card to view quick resources, progress controls, and frequent interview questions.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
