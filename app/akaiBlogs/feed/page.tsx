import Navbar from "@/components/layout/Navbar"
import Footer2 from "@/components/layout/Footer2"
import ProfileCard from "@/components/ui/ProfileCard"
import FeedPageCard from "@/components/ui/FeedPageCard"
import FeedBlogsCard from "@/components/ui/FeedBlogsCard"

const Feed = () => {
  // temporary data
  const blogs = [
    {
      id: 1,
      author: "Yumi Chen",
      authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxnlJpfNuCETXCJAFL3Byq6BLZowZSiUwxj0EO4tpca53AsXZ6Zl2a6LoqyprVvgLKJpQsoEvSrRXri9HzwPgPaH9sVqjidzGJ1sQtxcpKqHlfSC3cBNxx7-6yoVSmLPzG5t7GVGoIyDcTyVADjc4yAiXo5oNWHbVEIzmSU6nkZAfvIwcoq6BgvI5TBxz-yLgKz4MQrX8Pwz3SyzzRhENVpISLvwmFehlGoy7hq2W10Iz5J7iauivTuMe_8_1oUCWM4fZYcKG0iw",
      time: "2 hours ago",
      category: "Metropolis",
      postImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA73UPeGtdzAWIrF5FaSUWypI8wRm6QYrHrAXi9HpyeC53c24-c2PE4BlAPigx8pWkiGHwmvex10fs4L8M9fBvfxX8kwH9WjTX2tUtl93omoYF494UtDC89e1kqE6zOOzQ77Y_WdiiOGuA0gEl2z1TQNNqiEE7y4I8wTFZR16Mo5iwPG0T6AoEM5UzNK2wMfVSOb5i7iRaHq8sY84NkcoPJbfm2Kndi2JSkv0o9hSyZ6yJv6ztj09iBB9shoqq-_pIvYEW_2mXNsw",
      title: "Kyoto Nights: A Visual Journey through the Gion Shadows",
      excerpt: "Capturing the silent whispers of the Gion district under the silver glow of the harvest moon. The lanterns cast long, flickering shadows against the ancient cedar walls...",
      likes: "1.2k",
      comments: "84"
    },
    {
      id: 2,
      author: "Hiroshi T.",
      authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP28LOFDV8Hvt_v1Sx04rABtJUyxvcb0LOrxQbWVyOxFRyX2hwUG5m46rbt2wBQXxGa1h44ZbTwzQ_zPApdR0I7FC0MIWaoI3Mhl74yHGhm_7TEn4WVZexzVQ3GuRpCdWJyPuRQHfGUhvP2h1mobFRD8TAUlJMywdUmtPf-kXGZxGuDUg_nhZv_U-xs5aHio4obyFk8BliAQkfNFKhspRnqKchOw9XPN_wL0w0t56vHROK4wMtthewJ0bj7Pru1SPbfvCXwtVz9g",
      time: "5 hours ago",
      category: "Craft",
      postImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvRysIdegdIHLanz_hCFSCLkMsUsAZXGPuluU7ZNPGUrK_jKwXFjwa_zkuYO--qnbJVd2nYz0s7J90grVv0XmTnxgxA4wu4q_fp-OhoVw-ozgmfJdXoxosU3J-mSRMWI389IDMytw7F5263Y3sb_vsIgIvJdNOYOeL1wdRs55xhVkXI4zQzk5bH7X1zZchxhobCQHkuWEP2nntod6M7FkQDOJUP4ecPRvLIqd2Y7MOJ63IswU01xCUjojmj_KhaOb6PPOg00Lptw",
      title: "Blade Craft: Inside the Workshop of Japan's Last Masters",
      excerpt: "The heat from the forge is a physical weight. Here, in a small village outside Gifu, the ancient traditions of sword-making live on in the hands of the masters...",
      likes: "3.4k",
      comments: "156"
    }
  ];

  return (
    <section className=''>
      <Navbar />
      <main className="max-w-[1700px] mx-auto px-4 pt-24 pb-6 grid grid-cols-1 md:grid-cols-12 gap-8 h-screen overflow-hidden">
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