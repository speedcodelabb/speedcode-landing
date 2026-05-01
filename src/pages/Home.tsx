import Hero from '../components/Hero';
import Values from '../components/Values';
import About from '../components/About';
import Portfolio from '../components/Portfolio';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Values />
      <Portfolio />
      <FAQ />
      <Contact />
    </>
  );
}
