import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Historia } from './components/Historia'
import { InstagramFeed } from './components/InstagramFeed'
import { Catalogo } from './components/Catalogo'
import { Souvenirs } from './components/Souvenirs'
import { ComoComprar } from './components/ComoComprar'
import { Seguinos } from './components/Seguinos'
import { Footer } from './components/Footer'
import { InstagramFloat } from './components/InstagramFloat'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalogo />
        <Souvenirs />
        <Historia />
        <InstagramFeed />
        <ComoComprar />
        <Seguinos />
      </main>
      <Footer />
      <InstagramFloat />
    </>
  )
}
