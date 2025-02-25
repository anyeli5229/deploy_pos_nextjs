import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams//Se identifica el querystring de la url
    const transactionDate = searchParams.get('transactionDate')//Y see limpia y obtiene el valor de la fecha
    const url = `${process.env.API_URL}/transactions?transactionDate=${transactionDate}`//Url generada para el api route
    const req = await fetch(url)
    const response = await req.json()
    return Response.json(response)
}