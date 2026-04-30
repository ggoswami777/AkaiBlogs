import Navbar from "@/components/layout/Navbar"
import Footer2 from "@/components/layout/Footer2"
import ProfileCard from "@/components/profile/ProfileCard"
import FeedPageCard from "@/components/blog/FeedPageCard"
import FeedBlogsCard from "@/components/blog/FeedBlogsCard"

import { blogsData } from "@/lib/data"

const Feed = () => {
  const blogs = blogsData;


  return (
    <section className=''>
      <main className="max-w-[1700px] mx-auto px-4 pt-4 pb-6 grid grid-cols-1 md:grid-cols-12 gap-8 h-screen overflow-hidden">

        <ProfileCard />
        <section className="col-span-1 md:col-span-8 lg:col-span-6 space-y-4 h-full overflow-y-auto no-scrollbar scroll-smooth pb-24">
          <div className="relative h-32 rounded-2xl overflow-hidden glass border-white/5 group">
            <img alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGqQusKRN51nhQea1nffq_Ca4j_-0PMBC1Kq8Vwk3S6jpo6nwpTYVY9C5t2-Ps7WCl_HN0E_e30iwbpfkb0j4bs6k63XOw7TVhsgAlwIeGTFvT_c1AUkp1dcYxDuM9IWKpJE9cCmcJjFGZmhNgQohmddj93Gwlxi6-sx2YwsqCglBPWx0yGxsya0QQ13S-hfTeEFKPcdM6GaS6YjQmr9ks2qHyAPzxsGcqEZtfsuw_kjHXipNXV2KUmSXhQXSsiLm-zQOqO1WCJg" />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <span className="inline-block text-primary font-bold tracking-[0.3em] uppercase mb-0.5 text-[9px]">The Daily Scroll</span>
              <h2 className="font-serif-jp text-xl text-white">Chronicles of the <span className="text-primary">Unseen</span></h2>
            </div>
          </div>
          {
            blogs.map((blog) => <FeedBlogsCard key={blog.id} blog={blog} />)
          }
        </section>
        <FeedPageCard />
      </main>
      <Footer2 />
    </section>
  )
}

export default Feed