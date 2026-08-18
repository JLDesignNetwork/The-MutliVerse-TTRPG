import React from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

import cyberpunkRed from '../../../../config/systems/cyberpunk-red.json';
import dnd5e from '../../../../config/systems/dnd5e.json';
import pathfinder2e from '../../../../config/systems/pathfinder-2e.json';
import starfinder from '../../../../config/systems/starfinder.json';
import vtm from '../../../../config/systems/vtm.json';
import w40k from '../../../../config/systems/w40k.json';

const staticSystems: Record<string, any> = {
  'cyberpunk-red': cyberpunkRed,
  'dnd5e': dnd5e,
  'pathfinder-2e': pathfinder2e,
  'starfinder': starfinder,
  'vtm': vtm,
  'w40k': w40k,
};

function getSystemConfig(slug: string) {
  if (staticSystems[slug]) {
    return staticSystems[slug];
  }
  try {
    const candidates = [
      path.join(process.cwd(), 'config', 'systems', `${slug}.json`),
      path.join(process.cwd(), '.web', 'config', 'systems', `${slug}.json`),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return JSON.parse(fs.readFileSync(candidate, 'utf8'));
      }
    }
  } catch (error) {
    return null;
  }
  return null;
}

export async function generateStaticParams() {
  const slugs = Object.keys(staticSystems);
  try {
    const candidates = [
      path.join(process.cwd(), 'config', 'systems'),
      path.join(process.cwd(), '.web', 'config', 'systems'),
    ];
    for (const dir of candidates) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files
          .filter(file => file.endsWith('.json') && file !== 'universal.json' && file !== 'upgradesLibrary.json')
          .forEach(file => {
            const s = file.replace('.json', '');
            if (!slugs.includes(s)) slugs.push(s);
          });
      }
    }
  } catch (error) {}
  return slugs.map(slug => ({ slug }));
}

export default async function SystemDocsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = getSystemConfig(slug);

  if (!config) {
    return (
      <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h1 style={{ color: '#f87171', fontSize: '2rem', marginBottom: '10px' }}>System Not Found</h1>
        <p style={{ color: '#888', marginBottom: '24px' }}>The system configuration for "{slug}" could not be found.</p>
        <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>&larr; Return to Character Converter</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '30px', fontSize: '0.9rem', fontWeight: 500 }}>
          &larr; Back to Character Converter
        </Link>
        
        <header style={{ marginBottom: '35px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <h1 style={{ fontSize: '2.4rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {config.systemName}
            </h1>
            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
              v{config.version || '2606.1.0'}
            </span>
          </div>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
            {config.description}
          </p>
        </header>

        <section style={{ marginBottom: '30px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#38bdf8', marginTop: 0, marginBottom: '12px', fontWeight: 600 }}>
            🎲 12-Die Array & Approaches Mapping
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            {config.mappings?.approaches?.userExplanation || "Direct approach mapping dynamically allocates the 12-die array based on native attribute priorities."}
          </p>
        </section>

        <section style={{ marginBottom: '30px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#4ade80', marginTop: 0, marginBottom: '12px', fontWeight: 600 }}>
            ⚡ Leveling & Power Scale Baseline
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            {config.mappings?.powerScale?.userExplanation || "Native character levels map to Power Scale tiers (1-4) with EXP translation budgets."}
          </p>
        </section>

        <section style={{ marginBottom: '30px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#facc15', marginTop: 0, marginBottom: '12px', fontWeight: 600 }}>
            🎒 Inventory Slot Taxes & Gear
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            {config.mappings?.slotTaxes?.userExplanation || "Fibonacci slot allocation limits apply to Ready, Stowed, and Invested equipment."}
          </p>
        </section>

        <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
          The Multiverse TTRPG Framework &copy; {new Date().getFullYear()} &bull; Deterministic System Library Engine
        </footer>
      </div>
    </div>
  );
}

