import Head from 'next/head';
import Link from 'next/link';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Something went wrong</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '64px 20px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Something went wrong</h1>
        <p style={{ marginTop: 12, color: '#525252' }}>
          An unexpected error occurred. Please try again.
        </p>
        <p style={{ marginTop: 28 }}>
          <Link href="/" style={{ color: '#111827', textDecoration: 'underline' }}>
            Back home
          </Link>
        </p>
      </main>
    </>
  );
}
