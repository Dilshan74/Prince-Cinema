import React from 'react'
import FeatureSection from '../components/FeatureSection'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'


const Home = () => {
  return (
    <main className="bg-[#05070d]">
      <HeroSection />
      <FeatureSection />
      
      <Footer />
    </main>
  )
}

export default Home
