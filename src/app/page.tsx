import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeatureCard
  title="Mock Interviews"
  description="Practice interviews with AI."
/>

<FeatureCard
  title="Resume Analyzer"
  description="Improve your resume instantly."
/>

<FeatureCard
  title="Performance Feedback"
  description="Receive AI-powered feedback."
/>
      <Footer />
    </main>
  );
}