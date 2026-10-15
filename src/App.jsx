//import { useState } from 'react'
import Header from './Components/Header.jsx'
import Hero from './Components/Hero.jsx'
import './App.css'
import BookSection from './Components/BookSection.jsx'
import About from './Components/About.jsx'
import Footer from './Components/Footer.jsx'

function App() {
  //const [count, setCount] = useState(0)

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

export default App
