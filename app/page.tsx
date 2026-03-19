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
      <div className="relative z-20 flex items-center justify-center h-full text-white text-4xl font-bold">
        HomePage
      </div>

    </section>
  )
}

export default Page