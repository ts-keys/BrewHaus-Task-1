import About from "../Components/About";
import BookSection from "../Components/BookSection";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import Hero from "../Components/Hero";

function Home () {
    return (
        <>
        <Header />
        <main>
            <Hero />
            <BookSection />
            <About />
        </main>
        <Footer />

        </>
    )
}
export default Home;