import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Movie Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0d1f1f 0%, #1a3a3a 50%, #2d5a5a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 24 }}>🎬</div>
        <div style={{ color: 'white', fontSize: 48, fontWeight: 900, textAlign: 'center' }}>
          Watch Movies & TV Shows
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 24, marginTop: 16 }}>
          Stream unlimited content — free, fast, HD
        </div>
      </div>
    ),
    { ...size }
  );
}
