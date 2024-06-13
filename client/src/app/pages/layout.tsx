import React from 'react'
import Link from 'next/link';

export default function PageLayout({
    children,
  }:    {
    children: React.ReactNode;
  }) {
    return (
    <>
        <div className='bg-bg-color flex justify-center items-center '>
        <nav className="bg-zinc-800 p-3 w-11/12
         mt-2  rounded-lg ">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <img src="" alt="Logo" />
        </div>
        <div className="text-white space-x-4">
          <Link href="/">Home</Link>
          <Link href="/" className="">
            Activities
          </Link>
          <Link href="/">Leaderboard</Link>
          <Link href="/">Community</Link>
          <Link href="/">Projects</Link>
          <Link href="/">Profile</Link>
        </div>
      </div>
    </nav>
    </div>
    
    <div >
        {children}
      </div>
     
    </>
  )
}
