import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  // Removed darkMode configuration - using light mode only
  plugins: [tailwindcssAnimate, typography],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
    'animation-delay-300',
    'animation-delay-600',
    'animate-bounce',
    'animate-float',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bounce': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsla(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        flame: {
          DEFAULT: 'hsl(var(--flame))',
          foreground: 'hsl(var(--flame-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        sans: ['var(--font-geist-sans)'],
        serif: ['var(--font-fraunces)', 'serif'],
        fraunces: ['var(--font-fraunces)', 'serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--foreground)',
              '--tw-prose-headings': 'var(--foreground)',
              '--tw-prose-links': 'hsl(var(--primary))',
              '--tw-prose-bold': 'hsl(var(--foreground))',
              '--tw-prose-counters': 'hsl(var(--muted-foreground))',
              '--tw-prose-bullets': 'hsl(var(--muted-foreground))',
              '--tw-prose-quotes': 'hsl(var(--foreground))',
              '--tw-prose-code': 'hsl(var(--foreground))',
              '--tw-prose-hr': 'hsl(var(--border))',
              '--tw-prose-th-borders': 'hsl(var(--border))',
              '--tw-prose-td-borders': 'hsl(var(--border))',
              
              // Base heading styles
              h1: {
                fontWeight: '500',
                fontFamily: 'var(--font-fraunces)',
                marginBottom: '0.5em',
                letterSpacing: '-0.025em',
                fontVariationSettings: "'SOFT' 25, 'WONK' 1",
              },
              h2: {
                fontWeight: '500',
                fontFamily: 'var(--font-fraunces)',
                marginTop: '1.5em',
                marginBottom: '0.5em',
                letterSpacing: '-0.025em',
                fontVariationSettings: "'SOFT' 25, 'WONK' 1",
              },
              h3: {
                fontWeight: '500',
                fontFamily: 'var(--font-fraunces)',
                marginTop: '1.5em',
                marginBottom: '0.5em',
                fontVariationSettings: "'SOFT' 0, 'WONK' 1",
              },
              h4: {
                fontWeight: '500',
                fontFamily: 'var(--font-fraunces)',
                marginTop: '1.25em',
                marginBottom: '0.5em',
              },
              
              // Text and link styling
              p: {
                lineHeight: '1.75',
                marginTop: '1.25em',
                marginBottom: '1.25em',
              },
              a: {
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'hsl(var(--primary) / 0.8)',
                },
              },
              
              // List styling
              ul: {
                marginTop: '1.25em',
                marginBottom: '1.25em',
              },
              ol: {
                marginTop: '1.25em',
                marginBottom: '1.25em',
              },
              li: {
                marginTop: '0.375em',
                marginBottom: '0.375em',
              },
              
              // Code and blockquote styling
              code: {
                fontWeight: '400',
              },
              blockquote: {
                fontStyle: 'italic',
                fontFamily: 'var(--font-fraunces)',
                fontWeight: '400',
                borderLeftWidth: '4px',
                borderLeftColor: 'hsl(var(--primary) / 0.3)',
                paddingLeft: '1rem',
              },
            },
          ],
        },
        
        // Base typography size variant
        base: {
          css: [
            {
              fontSize: '1rem',
              h1: {
                fontSize: '2.5rem',
                lineHeight: '1.1',
              },
              h2: {
                fontSize: '1.75rem',
                lineHeight: '1.2',
              },
              h3: {
                fontSize: '1.5rem',
                lineHeight: '1.3',
              },
              h4: {
                fontSize: '1.25rem',
                lineHeight: '1.4',
              },
            },
          ],
        },
        
        // Medium breakpoint typography adjustments
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '2rem',
              },
              h3: {
                fontSize: '1.75rem',
              },
              h4: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
        
        // Large breakpoint typography adjustments
        lg: {
          css: [
            {
              h1: {
                fontSize: '4rem',
              },
              h2: {
                fontSize: '2.5rem',
              },
              h3: {
                fontSize: '2rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
