import React from 'react'
import { Header } from '../components/Header'
import { Container } from '../components/Container'
import Footer from '../components/Footer'

function Landing() {
  return (
    <div>
        <Header />
        <Container className="min-h-screen">
            Landing
        </Container>
        <Footer />
    </div>
  )
}

export default Landing