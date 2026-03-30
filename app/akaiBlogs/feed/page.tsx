import Navbar from "@/components/layout/Navbar"
import ProfileCard from "@/components/ui/ProfileCard"

const Feed = () => {
  return (
    <section className=''>
      <Navbar/>
      <main className="max-w-[1600px] mx-auto px-4 pt-24 pb-12 grid grid-cols-1 md:grid-cols-12 gap-8 min-h-screen">
        <ProfileCard/>
      </main>
    </section>
  )
}

export default Feed