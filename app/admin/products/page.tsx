import ProductsTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import Pagination from "@/components/ui/Pagination";
import { ProductsResponseSchema } from "@/src/schemas";
import { isValidPage } from "@/src/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getProducts(take : number, skip : number) {
  const url = `${process.env.API_URL}/products?take=${take}&skip=${skip}`//Take muestra el num de elementos y skip genera el salto de los elemntos
  const req = await fetch(url)
  const json = await req.json()
  const data = ProductsResponseSchema.parse(json)
  return {
    products: data.products,
    total: data.total
  }
}

type SearchParams = Promise<{page: string}>

export default async function ProductsPage({searchParams} : {searchParams: SearchParams}) {

  const {page} = await searchParams
  if(!isValidPage(+page)) redirect('/admin/products?page=1')//isValidPage verfica que se un numero entero positivo etc.
  const productsPerPage = 10
  const skip = (+page - 1) * productsPerPage//Segenera un skip de 10 en 10 elementos comenzando en 0
  const {products, total} = await getProducts(productsPerPage, skip)
  const totalPages = Math.ceil(total / productsPerPage)//Total de productos entre la cantidad que se desea listar de productos
  if(+page > totalPages) redirect('/admin/products?page=1')

  return (
    <>
      <Link
        href='/admin/products/new'
        className="rounded bg-green-400 font-bold py-2 px-10 "
      >Nuevo Producto</Link>

      <Heading>Administrar Productos</Heading>
      
      <ProductsTable
        products={products}
      />

      <Pagination 
          page={+page}
          totalPages={totalPages}
          baseUrl="/admin/products"
      />
    </>
  )
}
