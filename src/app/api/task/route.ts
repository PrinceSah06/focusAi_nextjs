import { reportWebVitals } from "next/dist/build/templates/pages";

export async function POST(req: Request){
    const {name} = await req.json()

    // return  {nam}

}
