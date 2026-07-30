import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { ChevronRight, BookOpen, Layers } from 'lucide-react';

type SimpleRoadmap = {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
};

type RoadmapsResponse = {
  categories: Record<string, SimpleRoadmap[]>;
};

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState<Record<string, SimpleRoadmap[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch('/api/roadmaps');
        if (!res.ok) throw new Error('Failed to fetch roadmaps');
        const data: RoadmapsResponse = await res.json();
        setRoadmaps(data.categories);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>Loading roadmaps…</div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#ff5555' }}>{error}</div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#0A0A0F', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, padding: '32px 36px', color: '#fff' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <BookOpen size={24} color="#7C3AED" />
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>Developer Roadmaps</h1>
          </div>
          <p style={{ color: '#64748B', fontSize: 15 }}>
            Master coding pathways curated from real-world requirements. Click any roadmap to explore resources, practice challenges, and interview prep guides.
          </p>
        </div>
        {Object.entries(roadmaps).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 24 }}>{category}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {items.map((map) => (
                <a
                  key={map.slug}
                  href={`/${map.slug}`}
                  className="glass border-gradient card-hover"
                  style={{
                    padding: 28,
                    borderRadius: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>{map.icon}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: '#fff' }}>{map.title}</h3>
                    <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>{map.subtitle}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#C084FC', fontSize: 13, fontWeight: 600 }}>
                    View Roadmap <ChevronRight size={14} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
