import React, { useState } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import ScrollCanvas from './components/ScrollCanvas';
import AboutSection from './components/AboutSection';
import QualitySection from './components/QualitySection';
import ExportSection from './components/ExportSection';
import ProductsGrid from './components/ProductsGrid';
import CatalogSpecSection from './components/CatalogSpecSection';
import Certifications from './components/Certifications';
import AdsSection from './components/AdsSection';
import EventsSection from './components/EventsSection';
import CareersSection from './components/CareersSection';
import SocialMediaSection from './components/SocialMediaSection';
import ProductModal from './components/ProductModal';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF3E3] text-[#1B2A3A] font-sans relative">
      {/* Async Frame Preloader */}
      {loading && (
        <Preloader
          totalFrames={155}
          setLoadedImages={setLoadedImages}
          onComplete={() => setLoading(false)}
        />
      )}

      {/* Main App Layout */}
      {!loading && (
        <>
          <Navbar onOpenContact={() => setIsContactOpen(true)} />
          
          <main>
            {/* Pinned Scroll Canvas Hero Section */}
            <ScrollCanvas
              loadedImages={loadedImages}
              onOpenContact={() => setIsContactOpen(true)}
            />

            {/* 0. Hakkımızda / Misyon & Vizyon Section */}
            <AboutSection />

            {/* 1. Endüstriyel Üretim & Kalite Section */}
            <QualitySection />

            {/* 2. İhracat Ağımız & Referanslarımız Section (Placed directly below QualitySection) */}
            <ExportSection onOpenContact={() => setIsContactOpen(true)} />

            {/* 3. Ürünlerimiz Grid Section */}
            <ProductsGrid
              onSelectProduct={(product) => setSelectedProduct(product)}
              onOpenContact={() => setIsContactOpen(true)}
            />

            {/* 4. Interactive Catalog & Spec Sheet Section */}
            <CatalogSpecSection onOpenContact={() => setIsContactOpen(true)} />

            {/* 5. Sertifikalar ve Dünya Standartları Section */}
            <Certifications />

            {/* 6. Reklamlar Section */}
            <AdsSection />

            {/* 7. Etkinlikler Section */}
            <EventsSection />

            {/* 8. Bize Katılın (Kariyer) Section */}
            <CareersSection />

            {/* 9. Sosyal Medya Section */}
            <SocialMediaSection />
          </main>

          {/* Corporate Footer */}
          <Footer onOpenContact={() => setIsContactOpen(true)} />

          {/* Dialog Modals */}
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onOpenContact={() => setIsContactOpen(true)}
          />

          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        </>
      )}
    </div>
  );
}
