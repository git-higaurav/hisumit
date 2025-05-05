import Work from "./_pages/Work";
import Landing from "./_pages/page";
import About from "./_pages/About";
import Service from "./_pages/Service";
import Testimonials from "./_pages/Testimonials";
import Footer from "./_pages/Footer";
import Contact from "./_pages/Contact";
import Works from "./_pages/Works";
export default function Home() {
  return (
    <>
      <Landing />
      <Works />
      {/* <Work /> */}
      <About />
      <Service />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}
