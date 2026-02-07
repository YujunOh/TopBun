import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'TopBun - 대한민국 No.1 버거 커뮤니티';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF7E6',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25px 25px, #E76F51 2px, transparent 0)',
            backgroundSize: '50px 50px',
            opacity: 0.1,
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            zIndex: 1,
          }}
        >
          {/* Burger Icon */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {/* Top Bun */}
            <div
              style={{
                width: '140px',
                height: '45px',
                borderRadius: '70px 70px 10px 10px',
                background: 'linear-gradient(180deg, #f8c16b 0%, #c97c2a 100%)',
              }}
            />
            {/* Lettuce */}
            <div
              style={{
                width: '130px',
                height: '16px',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, #6ecf5b 0%, #3b8f3b 100%)',
              }}
            />
            {/* Cheese */}
            <div
              style={{
                width: '130px',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: '#f6c343',
              }}
            />
            {/* Patty */}
            <div
              style={{
                width: '135px',
                height: '24px',
                borderRadius: '12px',
                background: 'linear-gradient(180deg, #7b4a2a 0%, #4b2a18 100%)',
              }}
            />
            {/* Bottom Bun */}
            <div
              style={{
                width: '140px',
                height: '35px',
                borderRadius: '10px 10px 35px 35px',
                backgroundColor: '#b5652a',
              }}
            />
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '80px',
              fontWeight: 800,
              color: '#E76F51',
              letterSpacing: '-2px',
            }}
          >
            TopBun
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            대한민국 No.1 버거 커뮤니티
          </div>

          {/* Tags */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '8px',
            }}
          >
            {['리뷰', '랭킹', '월드컵', '티어리스트'].map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: '#E76F51',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  fontSize: '20px',
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* URL Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            fontSize: '24px',
            color: '#94a3b8',
          }}
        >
          topbun.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
