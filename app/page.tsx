import React from 'react'
import Image from 'next/image'
import BackgroundImage from '../public/image.png'

const Page = () => {
  return (
    <section className="relative w-screen h-screen overflow-hidden">

      {/* Background Image */}
      <Image
        src={BackgroundImage}
        alt="background"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>

      {/* Side Fade (cinematic effect) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center h-full text-white text-4xl font-bold mx-5">
        <div className='text-primary inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-[rgb(var(--primary)/0.1)]
        border-[rgb(var(--primary)/0.3)] text-xs uppercase font-bold tracking-[0.2em]'>
          <span className='size-2 bg-[rgb(var(--primary))] rounded-full animate-pulse'></span>
          Live in The Shogunate
        </div>
        <h1 className='text-6xl md:text-8xl font-black tracking-tighter text-white leading-none mt-5'>
          Stories from the
          <br />
          <span className='text-primary italic'>Edge of the Blade</span>
        </h1>
        <p className='inline-flex items-center text-lg md:text-xl text-slate-300 font-medium 
        mt-10 leading-tight max-w-2xl'>
          A Japanese-themed social blogging sanctuary for the modern ronin.
          Forge your legacy, share your path, and find your clan.
        </p>
        <div className='flex flex-col sm:flex-row gap-2 mt-10 items-center justify-center'>
          <button className='text-lg btn-primary btn-primary:hover px-10 py-4'>Begin Your Journey</button>
          <button className='text-lg btn-glass px-10 py-4'>View the Archive</button>
        </div>
      </div>

    </section>
  )
}

export default Page