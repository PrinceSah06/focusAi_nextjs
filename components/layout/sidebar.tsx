"use client"
import React from 'react'
import Link from "next/link";
import {usePathname} from 'next/navigation'
import {CheckSquare} from 'lucide-react'
const Sidebar = () => {


    const path = usePathname()
    // console.log(path)
    const links = [
  { href: "/home", label: "Home" ,icon:CheckSquare},
  { href: "/tasks", label: "Tasks" ,icon:CheckSquare },
  { href: "/schedule", label: "Schedule" ,icon:CheckSquare },
  { href: "/stats", label: "Stats"  ,icon:CheckSquare},
];


  return (
    <div className='bg-gray-500 h-screen w-64 flex  flex-col  justify-between  space-y-2'>
        <div className={``}>
        <h1 className='text-4xl pt-2 mx-2 border-black border-b pb-5 '>FocusAI</h1>
           <div className={`pt-4  flex flex-col gap-2`}>   {links.map((e)=>{
const Icon = e.icon
return <Link className={`flex  bg-slate-500 w-full border
                  rounded-2xl   items-center gap-3  text-xl font-bold p-4
                   hover:text-white 
                  ${e.href === path
  ? 'bg-slate-700 text-white'
  : 'bg-slate-500'
} hover:bg-slate-700   
                   `} key={e.href} href={e.href}>
                    <Icon size={20}/><span className=''>{e.label}</span></Link>

        })}</div> 
         
        </div>
      
      <div> <p className='bottom-6 text-2xl hover:text-red-300 text-bold font-semibold'>Logout</p>
      </div>
    </div>
  )
}

export default Sidebar
