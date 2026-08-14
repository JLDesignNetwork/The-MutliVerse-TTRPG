import React from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// Helper to load system config
const getSystemConfig = (slug: string) => {
  try {
    const filePath = path.join(process.cwd(), 'config', 'systems', `${slug}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
};

export async function generateStaticParams() {
  const systemsDir = path.join(process.cwd(), 'config', 'systems');
  if (!fs.existsSync(systemsDir)) return [];
  
  const files = fs.readdirSync(systemsDir);
  return files
    .filter(file => file.endsWith('.json') && file !== 'universal.json' && file !== 'upgradesLibrary.json')
    .map(file => ({
      slug: file.replace('.json', ''),
    }));
}

export default async function SystemDocsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = getSystemConfig(slug);

  if (!config) {
    return (
      <div className="docs-container" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#f87171' }}>System Not Found</h1>
        <p>The system configuration for "{slug}" could not be found.</p>
        <Link href="/" style={{ color: '#3b82f6' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div className="docs-container" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>&larr; Back to App</Link>
      
      <header style={{ marginBottom: '40px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#fff' }}>{config.systemName}</h1>
        <div style={{ display: 'flex', gap: '15px', color: '#888', fontSize: '0.9rem' }}>
          <span>Version: {config.version}</span>
          <span>Engine: Deterministic System Library</span>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#ccc', marginTop: '20px', lineHeight: '1.6' }}>
          {config.description}
        </p>
      </header>

      <section className="docs-section" style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#4ade80', borderBottom: '1px solid #333', paddingBottom: '10px' }}>12-Die Array & Approaches</h2>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', marginTop: '15px', lineHeight: '1.6' }}>
          <p>{config.mappings?.approaches?.userExplanation || "No explanation provided."}</p>
        </div>
      </section>

      <section className="docs-section" style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#4ade80', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Leveling & Power Scale</h2>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', marginTop: '15px', lineHeight: '1.6' }}>
          <p>{config.mappings?.powerScale?.userExplanation || "No explanation provided."}</p>
        </div>
      </section>

      <section className="docs-section" style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#4ade80', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Inventory Slot Taxes</h2>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', marginTop: '15px', lineHeight: '1.6' }}>
          <p>{config.mappings?.slotTaxes?.userExplanation || "No explanation provided."}</p>
        </div>
      </section>

      <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #333', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
        Multiverse TTRPG Engine &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
