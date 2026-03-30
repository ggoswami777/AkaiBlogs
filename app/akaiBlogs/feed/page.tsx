import Navbar from "@/components/layout/Navbar"
import Footer2 from "@/components/layout/Footer2"
import ProfileCard from "@/components/ui/ProfileCard"
import FeedPageCard from "@/components/ui/FeedPageCard"
import FeedBlogsCard from "@/components/ui/FeedBlogsCard"

const Feed = () => {
  return (
    <section className=''>
      <Navbar/>
      <main className="max-w-[1600px] mx-auto px-4 pt-24 pb-12 grid grid-cols-1 md:grid-cols-12 gap-8 min-h-screen">
        <ProfileCard/>
        <FeedPageCard/>
      </main>
      <Footer2 />
    </section>
  )
}

export default Feed