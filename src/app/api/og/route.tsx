import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get params
    const title = searchParams.get('title') || 'Dream Home Rescue';
    const type = searchParams.get('type') || 'default';
    const imageUrl = searchParams.get('image') || null;
    const subtitle = searchParams.get('subtitle') || null;
    const extraData = searchParams.get('extraData') || null;

    // Determine the style variations based on content type
    const getBadgeColor = () => {
      switch (type) {
        case 'event': return '#BF846F';
        case 'dog': return '#6EA4BF';
        case 'post': return '#5D8C39';
        case 'page': return '#554971';
        default: return '#F3A06E';
      }
    };

    const getTypeLabel = () => {
      switch (type) {
        case 'event': return 'Événement';
        case 'dog': return 'Adoption';
        case 'post': return 'Actualité';
        case 'page': return 'Page';
        default: return 'Dream Home Rescue';
      }
    };

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
            padding: '0px',
          }}
        >
          {/* Background pattern for visual interest - subtle dots */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(#D9D0C1 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3,
          }} />

          {/* Main content container */}
          <div style={{
            maxWidth: '1000px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}>
            {/* Logo or image */}
            {imageUrl ? (
              <div style={{
                position: 'relative',
                width: '500px',
                height: '320px',
                marginBottom: '40px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
              }}>
                <img
                  src={imageUrl}
                  alt={title}
                  width={500}
                  height={320}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                />
                {/* Gradient overlay on images for better text contrast */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '100px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                }} />
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#F3A06E',
                  borderRadius: '16px',
                  padding: '40px',
                  marginBottom: '40px',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
                }}
              >
                <span style={{ color: 'white', fontSize: '72px', fontWeight: 'bold' }}>
                  DHR
                </span>
              </div>
            )}

            {/* Title with text shadow for better legibility */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '900px',
                gap: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '64px',
                  fontFamily: 'serif',
                  letterSpacing: '-0.02em',
                  fontWeight: 'bold',
                  color: '#2D3142',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                {title}
              </div>

              {/* Optional subtitle */}
              {subtitle && (
                <div
                  style={{
                    fontSize: '32px',
                    fontFamily: 'sans-serif',
                    color: '#6B717E',
                    textAlign: 'center',
                    lineHeight: 1.4,
                    marginTop: '-8px',
                  }}
                >
                  {subtitle}
                </div>
              )}

              {/* Extra data like dates, breed, etc. */}
              {extraData && (
                <div
                  style={{
                    fontSize: '28px',
                    fontFamily: 'sans-serif',
                    color: getBadgeColor(),
                    textAlign: 'center',
                    fontWeight: '500',
                    marginTop: '4px',
                    padding: '8px 20px',
                    borderRadius: '30px',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    border: `2px solid ${getBadgeColor()}`,
                  }}
                >
                  {extraData}
                </div>
              )}
            </div>
          </div>

          {/* Type badge - with unique styling per type */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              backgroundColor: getBadgeColor(),
              color: 'white',
              fontSize: '24px',
              padding: '10px 30px',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {getTypeLabel()}
          </div>

          {/* Bottom info bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid #D9D0C1',
            }}
          >
            <div style={{
              color: '#2D3142',
              fontSize: '22px',
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
            }}>
              Dream Home Rescue
            </div>
            <div style={{
              color: '#6B717E',
              fontSize: '22px',
              fontFamily: 'sans-serif',
            }}>
              dreamhomerescue.org
            </div>
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