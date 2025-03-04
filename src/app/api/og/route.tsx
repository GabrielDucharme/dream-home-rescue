import { ImageResponse } from 'next/og';
import { GeistSans } from 'geist/font/sans';
import { Fraunces } from 'next/font/google';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get params
    const title = searchParams.get('title') || 'Dream Home Rescue';
    const type = searchParams.get('type') || 'default';
    const imageUrl = searchParams.get('image') || null;

    // Basic template is shared across all types
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
            backgroundColor: '#F2E9DC',
            position: 'relative',
          }}
        >
          {/* Logo or image */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              width={400}
              height={300}
              style={{
                objectFit: 'cover',
                borderRadius: '12px',
                marginBottom: '40px',
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                backgroundColor: '#F3A06E',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '40px',
              }}
            >
              <span style={{ color: 'white', fontSize: '48px', fontWeight: 'bold' }}>
                DHR
              </span>
            </div>
          )}

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: '60px',
              fontFamily: 'serif',
              letterSpacing: '-0.02em',
              fontWeight: 'bold',
              color: '#2D3142',
              padding: '0 40px',
              textAlign: 'center',
              marginTop: '20px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>

          {/* Type badge */}
          {type !== 'default' && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                backgroundColor: type === 'event' ? '#BF846F' : '#6EA4BF',
                color: 'white',
                fontSize: '24px',
                padding: '8px 24px',
                borderRadius: '50px',
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
              }}
            >
              {type === 'event' ? 'Événement' : type === 'dog' ? 'Adoption' : type}
            </div>
          )}

          {/* Branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'calc(100% - 80px)',
              borderTop: '1px solid #D9D0C1',
              paddingTop: '20px',
              color: '#6B717E',
              fontSize: '24px',
              fontFamily: 'sans-serif',
            }}
          >
            dreamhomerescue.org
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(`Error generating OG image: ${e.message}`);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}