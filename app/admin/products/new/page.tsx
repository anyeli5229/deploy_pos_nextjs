import AddProductForm from "@/components/products/AddProductForm";
import ProductForm from "@/components/products/ProductForm";
import Heading from "@/components/ui/Heading";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <>
        <Link
            href='/admin/products?page=1'
            className="rounded bg-green-400 font-bold py-2 px-10 "
        >Volver</Link>

        <Heading>Nuevo Producto</Heading>

        <AddProductForm>
          {/* Los componentes que toman children se hacen de apertura y de cierre, se hace de está manera porque AddProductForm es un elemento del cliente, pero ProductForm necesita hacer una consultar para traerse las categorías  */}
            <ProductForm />
        </AddProductForm>
    </>
  )
}
