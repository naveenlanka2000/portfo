'use client';

import dynamic from 'next/dynamic';

import { defaultLanguageTapeItems } from '@/components/tape/icons';

const AppleCarousel = dynamic(() => import('@/components/AppleCarousel').then((m) => m.AppleCarousel), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full rounded-3xl bg-black/5" aria-hidden />,
});

const LanguageTape = dynamic(() => import('@/components/tape/LanguageTape').then((m) => m.LanguageTape), {
  ssr: false,
  loading: () => <div className="h-[72px] w-full" aria-hidden />,
});

export function HighlightsLazy() {
  return (
    <section className="pb-16">
      <div className="mt-8">
        <AppleCarousel
          ariaLabel="Highlights"
          cards={[
            {
              title: 'Secure Backend Services',
              sub: 'Validation & Access Control',
              img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=70',
            },
            {
              title: 'Workflow-Driven APIs',
              sub: 'Booking & Scheduling',
              img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=70',
            },
            {
              title: 'Robust Data Systems',
              sub: 'MySQL Schema & Queries',
              img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1800&q=70',
            },
            {
              title: 'Polished Interfaces',
              sub: 'React + Motion',
              img: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1800&q=70',
            },
            {
              title: 'ML-Powered Research',
              sub: 'CNN-Based Classification',
              img: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1800&q=70',
            },
          ]}
        />

        <div className="relative left-1/2 right-1/2 -mx-[50vw] mt-[3cm] w-screen overflow-x-clip">
          <div className="px-5 sm:px-8 lg:px-12">
            <LanguageTape
              items={defaultLanguageTapeItems}
              speedPxPerSec={170}
              direction="ltr"
              gap={18}
              size={44}
              pauseOnHover={false}
              hoverZoomScale={1.35}
              hoverLiftPx={-4}
              className="mt-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
