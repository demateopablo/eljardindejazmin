import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Historia } from './components/Historia'
import { Catalogo } from './components/Catalogo'
import { ComoComprar } from './components/ComoComprar'
import { Seguinos } from './components/Seguinos'
import { Footer } from './components/Footer'
import { WhatsAppFloat } from './components/WhatsAppFloat'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Historia />
        <Catalogo />
        <ComoComprar />
        <Seguinos />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
