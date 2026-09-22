import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import { copyToClipboard, productInquiryMessage } from './instagram'

/**
 * Lógica de los CTAs que abren el DM con un mensaje prearmado.
 * ig.me no acepta texto prearmado: copiamos el mensaje y dejamos que el <a> abra el DM
 * de forma nativa (sin preventDefault) para que no lo frene ningún bloqueador de popups.
 */
export function useInquiry(message: string) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 4000)
    return () => clearTimeout(t)
  }, [copied])

  function handleInquiry() {
    void copyToClipboard(message).then(setCopied)
  }

  return { copied, handleInquiry }
}

/** "Consultar por Instagram" de un producto (card y lightbox). */
export function useProductInquiry(product: Product) {
  return useInquiry(productInquiryMessage(product.name, product.detail))
}
