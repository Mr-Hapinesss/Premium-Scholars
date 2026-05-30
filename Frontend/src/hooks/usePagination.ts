import { useState } from 'react'

export function usePagination(initialPage = 1, initialLimit = 12) {
  const [page,  setPage]  = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const nextPage = () => setPage(p => p + 1)
  const prevPage = () => setPage(p => Math.max(1, p - 1))
  const goTo     = (n: number) => setPage(n)
  const reset    = () => setPage(1)

  return { page, limit, setLimit, nextPage, prevPage, goTo, reset }
}