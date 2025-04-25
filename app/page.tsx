import Work from "./_pages/_components/Work";
import Landing from "./_pages/landing/page";
import About from "./_pages/_components/About";
import Service from "./_pages/_components/Service";
import Testimonials from "./_pages/_components/Testimonials";
import Footer from "./_pages/_components/Footer";
import Contact from "./_pages/_components/Contact";

export default function Home() {
 return(
  <>
      <Landing />
      <Work />
        <About />
        <Service />
        <Testimonials />
        <Contact />
        <Footer />
  </>
 )
}
