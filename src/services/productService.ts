import http from './http'

export interface Product {
  id: number
  title: string
  price: number
  image: string
  description: string
  category: string
}

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await http.get('/products')
  return data
}

export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await http.get(`/products/${id}`)
  return data
}

export const getCategories = async (): Promise<string[]> => {
  const { data } = await http.get( '/products/categories')
  return data
}