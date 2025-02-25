import { create } from "zustand";
import { devtools } from 'zustand/middleware'
import { Coupon, CouponResponseSchema, Product, ShoppingCart } from "./schemas";

interface Store {
    total : number
    discount: number
    contents: ShoppingCart
    coupon: Coupon
    addToCart: (product: Product) => void
    updateQuantity: (id: Product['id'], quantity: number) => void//Actualiza la cantidad de los elementos seleccionados por medio del select que se encuentra en el componente ShoppingCartItem
    removeFromCart: (id: Product['id']) => void
    calculateTotal: () => void
    applyCoupon: (couponName: string) => Promise<void>
    applyDiscount: () => void
    clearOrder: () => void
}

const initialState = {
    total: 0,
    discount: 0,
    contents: [],
    coupon: {
        percentage: 0,
        name: '',
        message: ''
    },
}

export const useStore = create<Store>()(devtools((set, get) => ({
    ...initialState,
    addToCart: (product) => {
        const { id: productId, ...data } = product//Se hace destructiring de productId y se le asigna el id de product
        let contents : ShoppingCart = []//El contenido del carrito inicia como un arreglo vacío
        const duplicated = get().contents.findIndex(item => item.productId === productId)//con la variable get se obtienen los datos que hay en el state
        if(duplicated >= 0) {//La variable duplicated verifica si el producto que se está seleccionando en el carrito tiene el mismo id del producto que ya se encuentra en el carrito
            if(get().contents[duplicated].quantity >= get().contents[duplicated].inventory ) return//Se obtiene el state con la posición del arreglo y la cantidad y se verifica que la cantidad en esaposicion sea  igual o mayor que la cantidad que existe en el inventarios, al cumplirse esa condición, se manda un return paa que ya no cambié el state  
            contents = get().contents.map(item => item.productId === productId ? {//Se itera nuevamente sobre el state para identificar el elemento duplicado
                ...item,
                quantity: item.quantity + 1//Y se retorna el contenido del state, pero se aumenta la cantidad del producto
            } : item )//En caso de que no se encuentre el producto duplicado(el que se quiere agregar más de una vez), se retirna el item para no perder los datos 
        } else {//Significa que el articulo es nuevo y quiere ser agregado en el carrito de compras
            contents = [...get().contents, {//Se le asigna los datos que hay en el state, se le asgina el a productid el id de product y quantity cambia de 0 a 1
                ...data,
                quantity: 1,
                productId
            }]
        }
        set(() => ({//Set se utiliza para ecribir en el state los datos anteriores
            contents
        }))

        get().calculateTotal()//Se manda a llamar la función para que obtenga el total cada que se aprite el botón de +
    },
    updateQuantity: (id, quantity) => {//Se le pasa el id del producto que hay en el select de ShoppingCartItem y la cantidad
        set((state) => ({//Se obitene el state y se itera sobre los elementos
            contents : state.contents.map(item => item.productId === id ? {...item, quantity} : item )//Se identifica sobre cual elemento se eta realizando ek cambio mediente el id, en caso de que se encuentre el elemento, se toma un copia del item y se reescribe la cantidad a la cantidad que se le esta pasando
        }))//De no encontrar nungun elemento con el mismo id, se retorna el item sin nungún cambio realizado
        get().calculateTotal()//Y támbien manda a llamar la función para que obtenga el total cada que se aprite el select
    },
    removeFromCart: (id) => {//Se le pasa el id del producto que se desea eliminar medianteel botón de ShoppingCartItem
        set((state) => ({//Se obitene el state y se filtran todos los elementos que no tengan el mismo id que el elemento que se seleccionó con el botón
            contents: state.contents.filter(item => item.productId !== id)
        }))
        if(!get().contents.length) {//Si no hay elementos se manda a llamar la función de clearOrder
            get().clearOrder()
        }
        get().calculateTotal()//Y támbien manda a llamar la función para que obtenga el total cada que se aprite el botón de -
    },
    calculateTotal: () => {//Para obtener el total primero se obtiene el state actual y se hace una suma, sele pasa el total y el item
        const total = get().contents.reduce((total, item) => total + (item.quantity * item.price), 0 )//Al total se le suma el valor del precio multiplicado por el precio de cada item
        set(() => ({
            total//Y el total resultante se setea en el state
        }))

        if(get().coupon.percentage) {
            get().applyDiscount()// se utiliza esta función cuando se calcula el total o cuando se aplica el cupón y tenga un porcentaje mayor a 0
        }
    },
    applyCoupon: async (couponName) => {//API route generada en nest en el archivo de route.tsx
        const req = await fetch('/coupons/api', {
            method: 'POST',
            body: JSON.stringify({
                coupon_name: couponName
            })
        })
        const json = await req.json()
        const coupon = CouponResponseSchema.parse(json)
        set(() => ({
            coupon
        }))

        if(coupon.percentage) {//Solo se manda a llamar la funcion de descuento en caso de que el cupon tenga un porcentaje mayor a 0
            get().applyDiscount()
        }
    },
    applyDiscount: () => {
        const subtotalAmount = get().contents.reduce((total, item) => total + (item.quantity * item.price), 0 )//Se calcula el subtotal de lamima manera que los totales anteriores
        const discount = (get().coupon.percentage / 100) * subtotalAmount//Despues se obtiene el porcentaje de descuento y se hace un regla de 3 para obtner el descuento
        const total = subtotalAmount - discount//Y se le resta el descuento al subtotal

        set(() => ({//Se setea en el state el descuento y el nuevo total
            discount,
            total
        }))
    },
    clearOrder: () => {//Función que limpia el carrito y los descuentos
        set(() => ({
            ...initialState
        }))
    }
})))