'use client';

import React, { useEffect, useState } from 'react';

interface RealityTextProps {
  text: string;
  reality?: string;
}

export default function RealityText({ text, reality = 'Fantasy' }: RealityTextProps) {
  const [dictionary, setDictionary] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDict = async () => {
      try {
        const slug = reality.toLowerCase();
        // Dynamically import the reality dictionary
        const dict = await import(`../config/realities/${slug}.json`);
        setDictionary(dict.tokens || {});
      } catch (e) {
        console.error(`Failed to load reality dictionary for ${reality}`, e);
        setDictionary({});
      }
    };
    fetchDict();
  }, [reality]);

  if (!text) return null;

  // Split text by {{...}}
  const parts = text.split(/(\{\{[^}]+\}\})/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('{{') && part.endsWith('}}')) {
          const replacement = dictionary[part];
          return (
            <strong key={i} className="text-white">
              {replacement || part}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
