/**
 * Catálogo.
 * - Los PRODUCTOS (nombre, detalle, precio, foto, visible) viven en
 *   `products.json`, que Mar edita desde el panel /admin. No editar a mano
 *   salvo migraciones: el panel sobreescribe el archivo entero.
 * - Las CATEGORÍAS y los AROMAS (con sus tags) siguen acá, en código.
 */
import type { Catalog, CategoryId, Product } from './productsSchema'
import catalogJson from './products.json'

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

export type { CategoryId, Product }

export interface Category {
  id: CategoryId
  name: string
  description: string
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
    description: 'En vaso (Gourmet, Imperial, Tenesse), moldeadas (bubble, arco iris) y en caramelera.',
  },
  {
    id: 'difusores',
    name: 'Difusores de aroma',
    description: 'Con varillas, para perfumar ambientes sin fuego.',
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

/**
 * Todos los productos del JSON en el orden del archivo (incluye ocultos).
 * No se valida con zod acá a propósito: el JSON solo lo escribe la API del
 * panel (que sí valida) y así el sitio público no carga zod.
 */
export const allProducts: Product[] = (catalogJson as Catalog).products

/** Los que se muestran en el sitio. */
export const products: Product[] = allProducts.filter((p) => p.visible)

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
