'use client';

import RentHero from './rent-hero';
import HowItWorks from './how-it-works';
import RentOfferings from './rent-offerings';
import RentFAQ from './rent-faq';
import StickyMobileCTA from './sticky-mobile-cta';

const RentPageClient = () => {
  return (
    <>
      <RentHero />
      <HowItWorks />
      <RentOfferings />
      <RentFAQ />
      <StickyMobileCTA />
    </>
  );
};

export default RentPageClient;
