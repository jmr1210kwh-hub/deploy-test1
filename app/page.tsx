"use client";

import React, { useState } from 'react';
import { getPastLife } from '@/lib/past-life-data';

export default function Home() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // 1. Get deterministic past life data locally
      const pastLife = getPastLife(name);

      // 2. Call OpenAI API for storytelling
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          title: pastLife.title,
          year: pastLife.year
        }),
      });

      if (!response.ok) throw new Error('운명의 실타래를 푸는 데 실패했습니다.');

      const data = await response.json();

      setResult({
        ...pastLife,
        story: data.story
      });
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container">
        <h1>나의 전생 알아보기</h1>
        <p className="subtitle">시간의 흐름 속에 숨겨진 당신의 정체를 확인하세요</p>

        <form onSubmit={handleReveal} className="input-group">
          <input
            type="text"
            placeholder="당신의 이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading || !name.trim()} style={{ marginTop: '1.5rem' }}>
            {loading ? (
              <>
                <span className="loader"></span>
                운명을 읽는 중...
              </>
            ) : '전생의 문 열기'}
          </button>
        </form>

        {error && <p style={{ color: '#ff4b2b', marginTop: '1rem' }}>{error}</p>}

        {result && (
          <div className="result">
            <h2 className="past-life-title">당신은 전생에 "{result.title}"이었습니다.</h2>
            <p className="past-life-year">활동 시기: {result.year}</p>
            <div className="story">
              <p>{result.story}</p>
            </div>
          </div>
        )}
      </div>

      <footer>© 2026 Mystical Past Life Oracle. Powered by OpenAI.</footer>
    </main>
  );
}
