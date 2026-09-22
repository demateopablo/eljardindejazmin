import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import { copyToClipboard, productInquiryMessage } from './instagram'

/**
 * Lógica del botón "Consultar por Instagram" (card y lightbox).
 * ig.me no acepta texto prearmado: copiamos el mensaje y dejamos que el <a> abra el DM
 * de forma nativa (sin preventDefault) para que no lo frene ningún bloqueador de popups.
 */
export function useProductInquiry(product: Product) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 4000)
    return () => clearTimeout(t)
  }, [copied])

  function handleInquiry() {
    void copyToClipboard(productInquiryMessage(product.name, product.detail)).then(setCopied)
  }

  return { copied, handleInquiry }
}
