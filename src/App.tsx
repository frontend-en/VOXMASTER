import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FreeDiagnostic } from './components/FreeDiagnostic';
import { Pricing } from './components/Pricing';
import { ContactForm } from './components/ContactForm';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { MobileCTA } from './components/MobileCTA';

export default function App() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground relative">
        {/* <BackgroundDecor /> */}
        <Header />
      
      <main className="pb-20 md:pb-0 overflow-x-hidden">
        <Hero />
        
        <section id="free-diagnostic">
          <FreeDiagnostic />
        </section>
        
        <section id="book">
          <ContactForm />
        </section>
        
        <section id="price">
          <Pricing />
        </section>
        
        <section id="testimonials">
          <Testimonials />
        </section>
        
        <section id="faq">
          <FAQ />
        </section>
        
        <section id="about">
          <About />
        </section>
      </main>
      
        <Footer />
        <MobileCTA />
      </div>
    </>
  );
}