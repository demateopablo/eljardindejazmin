/**
 * Catálogo. Un solo lugar para editar productos, precios y aromas.
 * - `price`: número en pesos (se formatea como "$ 12.800"). `null` muestra
 *   "Precio a consultar".
 * - `image`: importar la foto desde ./assets con el alias @assets (ver ejemplo
 *   comentado). Sin imagen se muestra un placeholder.
 */
// import velaGourmet from '@assets/vela-gourmet.jpg'

import tagBouquetDeRosas from '../assets/tags/bouquet-de-rosas.webp'
import tagCitrus from '../assets/tags/citrus.webp'
import tagCocoYVainilla from '../assets/tags/coco-y-vainilla.webp'
import tagFrambuesa from '../assets/tags/frambuesa.webp'
import tagJazmin from '../assets/tags/jazmin.webp'
import tagLavanda from '../assets/tags/lavanda.webp'
import tagNaranjaYPimienta from '../assets/tags/naranja-y-pimienta.webp'
import tagPapayaYMelon from '../assets/tags/papaya-y-melon.webp'
import tagPeraYFloresBlancas from '../assets/tags/pera-y-flores-blancas.webp'
import tagVerbenaYLima from '../assets/tags/verbena-y-lima.webp'

export type CategoryId = 'velas' | 'difusores' | 'wax-melts' | 'jabones'

export interface Category {
  id: CategoryId
  name: string
  description: string
}

export interface Product {
  id: string
  category: CategoryId
  name: string
  /** Detalle corto debajo del nombre: material, tamaño, forma… */
  detail?: string
  /** Precio en pesos; null = a consultar */
  price: number | null
  image?: string
  imageAlt?: string
}

export interface Aroma {
  name: string
  /** Tag impreso (assets/tags). Si no hay, se muestra una tarjeta de texto. */
  tag?: string
}

export const categories: Category[] = [
  {
    id: 'velas',
    name: 'Velas aromáticas',
    description: 'En vaso (Gourmet, Imperial, Tennessee), moldeadas (bubble, arco iris) y en caramelera.',
  },
  {
    id: 'difusores',
    name: 'Difusores de aroma',
    description: 'Con cañitas de ratán, para perfumar ambientes sin fuego.',
  },
  {
    id: 'wax-melts',
    name: 'Wax melts',
    description: 'Pastillas de cera perfumada para hornitos.',
  },
  {
    id: 'jabones',
    name: 'Jabones artesanales',
    description: 'De glicerina, hechos a mano, con aromas suaves.',
  },
]

export const products: Product[] = [
  // ── Velas ──────────────────────────────────────────────
  { id: 'vela-gourmet', category: 'velas', name: 'Vela en vaso Gourmet', detail: 'Aroma a elección', price: 18200 },
  { id: 'vela-gourmet-gel', category: 'velas', name: 'Vela en vaso Gourmet', detail: 'Parafina en gel · aroma a elección', price: 20500 },
  { id: 'vela-imperial', category: 'velas', name: 'Vela en vaso Imperial', detail: 'Aroma a elección', price: 13000 },
  { id: 'vela-imperial-gel', category: 'velas', name: 'Vela en vaso Imperial', detail: 'Parafina en gel · aroma a elección', price: 15200 },
  { id: 'vela-tennessee', category: 'velas', name: 'Vela en vaso Tennessee', detail: 'Aroma a elección', price: 17500 },
  { id: 'vela-tennessee-gel', category: 'velas', name: 'Vela en vaso Tennessee', detail: 'Parafina en gel · aroma a elección', price: 19200 },
  { id: 'vela-whisky', category: 'velas', name: 'Vela en vaso de whisky', detail: 'Aroma a elección', price: null },
  { id: 'vela-bubble', category: 'velas', name: 'Vela bubble', detail: 'Moldeada · aroma a elección', price: 17400 },
  { id: 'vela-arco-iris', category: 'velas', name: 'Vela arco iris', detail: 'Moldeada · aroma a elección', price: 22150 },
  { id: 'caramelera-chica', category: 'velas', name: 'Vela en caramelera', detail: 'Chica · aroma a elección', price: 10500 },

  // ── Difusores ──────────────────────────────────────────
  { id: 'difusor-125', category: 'difusores', name: 'Difusor de cañas', detail: '125 cc · envase plástico · aroma a elección', price: 12800 },

  // ── Wax melts ──────────────────────────────────────────
  { id: 'wax-melts', category: 'wax-melts', name: 'Wax melts', detail: 'Aroma a elección', price: null },

  // ── Jabones ────────────────────────────────────────────
  { id: 'jabon-chico-cuadrado', category: 'jabones', name: 'Jabón de glicerina', detail: 'Chico · cuadrado', price: 5720 },
  { id: 'jabon-chico-oval', category: 'jabones', name: 'Jabón de glicerina', detail: 'Chico · oval', price: 3250 },
  { id: 'jabon-grande', category: 'jabones', name: 'Jabón de glicerina', detail: 'Grande', price: 7160 },
]

/** Aromas disponibles para todos los productos. */
export const aromas: Aroma[] = [
  { name: 'Citrus', tag: tagCitrus },
  { name: 'Frambuesa', tag: tagFrambuesa },
  { name: 'Bouquet de rosas', tag: tagBouquetDeRosas },
  { name: 'Verbena y lima', tag: tagVerbenaYLima },
  { name: 'Naranja y pimienta', tag: tagNaranjaYPimienta },
  { name: 'Lavanda', tag: tagLavanda },
  { name: 'Jazmín', tag: tagJazmin },
  { name: 'Coco y vainilla', tag: tagCocoYVainilla },
  { name: 'Pera y flores blancas', tag: tagPeraYFloresBlancas },
  { name: 'Papaya y melón', tag: tagPapayaYMelon },
]

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** "$ 12.800" */
export function formatPrice(price: number): string {
  return priceFormatter.format(price)
}
