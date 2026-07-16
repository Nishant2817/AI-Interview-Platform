import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Companies from "../components/landing/Companies";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function Landing() {
return (
    <main className="min-h-screen bg-[#0B1120] text-white">
    <Navbar />

    <Hero />

    <Stats />

    <section id="features" className="scroll-mt-32">
    <Features />
    </section>

    <section id="how-it-works" className="scroll-mt-32">
    <HowItWorks />
    </section>

    <section id="companies" className="scroll-mt-32">
    <Companies />
    </section>

    <section id="testimonials" className="scroll-mt-32">
    <Testimonials />
    </section>

    <CTA />

    <section id="about" className="scroll-mt-32">
    <Footer />
    </section>
    </main>
);
}
