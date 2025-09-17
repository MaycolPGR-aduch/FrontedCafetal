// src/hooks/useCafetalApi.ts
import * as React from 'react'

export type Warehouse = { id: number; code: string; name: string }
export type Uom       = { id: number; code: string; description: string }
export type Product   = { id: number; sku: string; name: string; category: string; uom: string }

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8080/api/v1'

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// -------- Warehouses --------
export function useWarehouses() {
  const [data, setData] = React.useState<Warehouse[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refetch = React.useCallback(async () => {
    try {
      setLoading(true); setError(null)
      setData(await getJSON<Warehouse[]>(`${API_BASE}/warehouses`))
    } catch (e: any) { setError(e?.message ?? 'Error desconocido') }
    finally { setLoading(false) }
  }, [])

  React.useEffect(() => { refetch() }, [refetch])
  return { data, loading, error, refetch }
}

// -------- UOMs --------
export function useUoms() {
  const [data, setData] = React.useState<Uom[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refetch = React.useCallback(async () => {
    try {
      setLoading(true); setError(null)
      setData(await getJSON<Uom[]>(`${API_BASE}/uoms`))
    } catch (e: any) { setError(e?.message ?? 'Error desconocido') }
    finally { setLoading(false) }
  }, [])

  React.useEffect(() => { refetch() }, [refetch])
  return { data, loading, error, refetch }
}

// -------- Products (filtros server-side) --------
export function useProducts(params?: { search?: string; category?: string }) {
  const [data, setData] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const search = params?.search?.trim() ?? ''
  const category = params?.category ?? 'all'

  const refetch = React.useCallback(async () => {
    try {
      setLoading(true); setError(null)
      const qs = new URLSearchParams()
      if (search) qs.set('search', search)
      if (category !== 'all') qs.set('category', category)
      setData(await getJSON<Product[]>(`${API_BASE}/products?${qs.toString()}`))
    } catch (e: any) { setError(e?.message ?? 'Error desconocido') }
    finally { setLoading(false) }
  }, [search, category])

  React.useEffect(() => { refetch() }, [refetch])
  return { data, loading, error, refetch }
}
