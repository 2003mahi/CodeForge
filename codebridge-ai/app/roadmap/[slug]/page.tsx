"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Star, 
  ExternalLink, 
  HelpCircle, 
  BookOpen 
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { generateDynamicRoadmap, RoadmapDetailData, TopicNode } from '@/data/roadmapDetailTemplates';

type SimpleRoadmap = {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
};

type RoadmapsResponse = {
  categories: Record<string, SimpleRoadmap[]>;
};

export default function RoadmapDetail() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [roadmap, setRoadmap] = useState<RoadmapDetailData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicNode | null>(null);
  const [userStatuses, setUserStatuses] = useState<Record<string, "completed" | "in-progress" | "unstarted">>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user status progression from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`roadmap-progress-${slug}`);
      if (stored) {
        try {
          setUserStatuses(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse stored roadmap progress", e);
        }
      }
    }
  }, [slug]);

  // Save progress to localStorage when userStatuses changes
  const saveProgress = (updated: Record<string, "completed" | "in-progress" | "unstarted">) => {
    setUserStatuses(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`roadmap-progress-${slug}`, JSON.stringify(updated));
    }
  };

  useEffect(() => {
    if (!slug) return;

    const fetchRoadmapMeta = async () => {
      try {
        const res = await fetch('/api/roadmaps');
        if (!res.ok) throw new Error('Failed to fetch roadmaps list');
        const data: RoadmapsResponse = await res.json();
        
        // Find the basic details across all categories
        let matchedMeta: SimpleRoadmap | undefined;
        for (const items of Object.values(data.categories)) {
          matchedMeta = items.find((r) => r.slug === slug);
          if (matchedMeta) break;
        }

        const title = matchedMeta ? matchedMeta.title : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
        const subtitle = matchedMeta ? matchedMeta.subtitle : '';
        const icon = matchedMeta ? matchedMeta.icon : '⚡';

        // Load predefined full roadmap details or dynamically generate high-quality fallback details
        const detailedData = generateDynamicRoadmap(slug, title, subtitle, icon);
        setRoadmap(detailedData);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error loading roadmap');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapMeta();
  }, [slug]);

  const toggleTopicStatus = (topicId: string, currentStatus: "completed" | "in-progress" | "unstarted") => {
    const nextStatusMap: Record<string, "completed" | "in-progress" | "unstarted"> = {
      unstarted: "in-progress",
      "in-progress": "completed",
      completed: "unstarted",
    };
    const next = nextStatusMap[currentStatus];
    const updated = { ...userStatuses, [topicId]: next };
    saveProgress(updated);
    
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic((prev) => prev ? { ...prev, status: next } : null);
    }
  };

  const getTopicStatus = (topic: TopicNode) => {
    return userStatuses[topic.id] || topic.status;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#0A0A0F', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Loading learning pathway...</div>
          <div className="shimmer" style={{ width: 180, height: 6, borderRadius: 3, margin: '0 auto' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', background: '#0A0A0F', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', color: '#ff5555' }}>
        <div style={{ textAlign: 'center', padding: 24 }} className="glass">
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Error</h3>
          <p style={{ color: '#94A3B8', marginBottom: 20 }}>{error}</p>
          <button onClick={() => router.push('/roadmap')} className="btn-ghost">Back to roadmaps</button>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <div style={{ display: 'flex', background: '#0A0A0F', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, padding: '32px 36px', color: '#fff' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
          <div>
            {/* Top Navigation */}
            <button 
              onClick={() => router.push('/roadmap')}
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: 6, 
                background: "transparent", 
                border: "none", 
                color: "#64748B", 
                fontSize: 13, 
                fontWeight: 600, 
                cursor: "pointer", 
                marginBottom: 20, 
                padding: 0 
              }}
            >
              <ArrowLeft size={14} /> Back to Roadmaps
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <span style={{ fontSize: 36 }}>{roadmap.icon}</span>
              <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" }}>{roadmap.title}</h1>
            </div>
            <p style={{ color: "#94A3B8", fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>{roadmap.subtitle}</p>

            {/* Connected Visual Roadmap Tree */}
            <div style={{ position: "relative", paddingLeft: 12 }}>
              {/* SVG Connecting Timeline Line */}
              <div style={{ 
                position: "absolute", 
                left: 16, 
                top: 20, 
                bottom: 20, 
                width: 2, 
                background: "linear-gradient(180deg, #7C3AED 0%, #3B82F6 50%, rgba(255,255,255,0.05) 100%)", 
                zIndex: 1 
              }} />

              {roadmap.groups.map((group, gIdx) => (
                <div key={gIdx} style={{ position: "relative", marginBottom: 44, zIndex: 2, paddingLeft: 32 }}>
                  
                  {/* Visual Group Node */}
                  <div style={{ 
                    position: "absolute", 
                    left: -6, 
                    top: 4, 
                    width: 14, 
                    height: 14, 
                    borderRadius: "50%", 
                    background: "#7C3AED", 
                    border: "3px solid #0A0A0F", 
                    boxShadow: "0 0 10px #7C3AED" 
                  }} />

                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{group.groupName}</h3>
                    <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{group.description}</p>
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
                            padding: "16px 20px", 
                            borderRadius: 14, 
                            cursor: "pointer", 
                            border: isSelected ? "1.5px solid #A855F7" : "1px solid rgba(255,255,255,0.06)",
                            background: isSelected ? "rgba(124, 58, 237, 0.08)" : "rgba(255,255,255,0.02)",
                            transition: "all 0.2s ease",
                            boxShadow: isSelected ? "0 0 15px rgba(168, 85, 247, 0.2)" : "none"
                          }}
                          onClick={() => setSelectedTopic({ ...topic, status })}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTopicStatus(topic.id, status);
                                }}
                                style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
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
                                <p style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{topic.desc}</p>
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
              <div 
                className="glass-dark" 
                style={{ 
                  padding: 24, 
                  borderRadius: 20, 
                  border: "1.5px solid rgba(168, 85, 247, 0.4)", 
                  background: "#0F0F16", 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column" 
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span 
                      className={`badge ${
                        getTopicStatus(selectedTopic) === "completed" 
                          ? "badge-green" 
                          : getTopicStatus(selectedTopic) === "in-progress" 
                            ? "badge-orange" 
                            : "badge-purple"
                      }`} 
                      style={{ textTransform: "capitalize" }}
                    >
                      {getTopicStatus(selectedTopic).replace('-', ' ')}
                    </span>
                    <button 
                      onClick={() => setSelectedTopic(null)}
                      style={{ 
                        background: "transparent", 
                        border: "none", 
                        color: "#64748B", 
                        fontSize: 11, 
                        fontWeight: 600, 
                        cursor: "pointer" 
                      }}
                    >
                      Clear Selection
                    </button>
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{selectedTopic.title}</h3>
                  <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6, marginBottom: 20 }}>{selectedTopic.desc}</p>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, marginBottom: 20 }}>
                    <div style={{ 
                      fontSize: 11, 
                      fontWeight: 700, 
                      color: "#64748B", 
                      letterSpacing: "0.06em", 
                      marginBottom: 10, 
                      textTransform: "uppercase" 
                    }}>
                      Quick Resources
                    </div>
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
                    <div style={{ 
                      fontSize: 11, 
                      fontWeight: 700, 
                      color: "#64748B", 
                      letterSpacing: "0.06em", 
                      marginBottom: 10, 
                      textTransform: "uppercase", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 4 
                    }}>
                      <HelpCircle size={12} /> Interview Question
                    </div>
                    <div style={{ 
                      padding: "12px 14px", 
                      background: "rgba(255,255,255,0.02)", 
                      border: "1px solid rgba(255,255,255,0.05)", 
                      borderRadius: 10 
                    }}>
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
              <div 
                className="glass" 
                style={{ 
                  padding: 32, 
                  borderRadius: 20, 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  textAlign: "center", 
                  height: "100%", 
                  border: '1px solid rgba(255,255,255,0.05)' 
                }}
              >
                <Star size={36} color="rgba(255,255,255,0.1)" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Select a Topic</h4>
                <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
                  Click on any topic card to view quick resources, progress controls, and frequent interview questions.
                </p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
