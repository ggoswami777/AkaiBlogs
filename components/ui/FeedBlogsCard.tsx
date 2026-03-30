const FeedBlogsCard = () => {
  return (
    <section className="col-span-1 md:col-span-8 lg:col-span-6 space-y-6">
      <div className="relative h-48 rounded-3xl overflow-hidden glass border-white/5 group">
        <img alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGqQusKRN51nhQea1nffq_Ca4j_-0PMBC1Kq8Vwk3S6jpo6nwpTYVY9C5t2-Ps7WCl_HN0E_e30iwbpfkb0j4bs6k63XOw7TVhsgAlwIeGTFvT_c1AUkp1dcYxDuM9IWKpJE9cCmcJjFGZmhNgQohmddj93Gwlxi6-sx2YwsqCglBPWx0yGxsya0QQ13S-hfTeEFKPcdM6GaS6YjQmr9ks2qHyAPzxsGcqEZtfsuw_kjHXipNXV2KUmSXhQXSsiLm-zQOqO1WCJg" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-8">
          <span className="inline-block text-primary font-bold tracking-[0.3em] uppercase mb-1 text-[10px]">The Daily Scroll</span>
          <h2 className="font-serif-jp text-3xl text-white">Chronicles of the <span className="text-primary">Unseen</span></h2>
        </div>
      </div>
      <div className="space-y-8">
        <article className="glass rounded-2xl overflow-hidden card-hover transition-all flex flex-col group">
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-charcoal border border-white/10 overflow-hidden">
                <img alt="Author" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxnlJpfNuCETXCJAFL3Byq6BLZowZSiUwxj0EO4tpca53AsXZ6Zl2a6LoqyprVvgLKJpQsoEvSrRXri9HzwPgPaH9sVqjidzGJ1sQtxcpKqHlfSC3cBNxx7-6yoVSmLPzG5t7GVGoIyDcTyVADjc4yAiXo5oNWHbVEIzmSU6nkZAfvIwcoq6BgvI5TBxz-yLgKz4MQrX8Pwz3SyzzRhENVpISLvwmFehlGoy7hq2W10Iz5J7iauivTuMe_8_1oUCWM4fZYcKG0iw" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Yumi Chen</h4>
                <p className="text-[10px] text-slate-500">2 hours ago in <span className="text-primary">Metropolis</span></p>
              </div>
            </div>
            <button className="text-slate-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="relative h-80 overflow-hidden">
            <img alt="Feed Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA73UPeGtdzAWIrF5FaSUWypI8wRm6QYrHrAXi9HpyeC53c24-c2PE4BlAPigx8pWkiGHwmvex10fs4L8M9fBvfxX8kwH9WjTX2tUtl93omoYF494UtDC89e1kqE6zOOzQ77Y_WdiiOGuA0gEl2z1TQNNqiEE7y4I8wTFZR16Mo5iwPG0T6AoEM5UzNK2wMfVSOb5i7iRaHq8sY84NkcoPJbfm2Kndi2JSkv0o9hSyZ6yJv6ztj09iBB9shoqq-_pIvYEW_2mXNsw" />
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-serif-jp text-white mb-4 group-hover:text-primary transition-colors">Kyoto Nights: A Visual Journey through the Gion Shadows</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
              Capturing the silent whispers of the Gion district under the silver glow of the harvest moon. The lanterns cast long, flickering shadows against the ancient cedar walls...
            </p>
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">favorite</span>
                  <span className="text-xs font-bold">1.2k</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">chat_bubble</span>
                  <span className="text-xs font-bold">84</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">share</span>
                </button>
              </div>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
            </div>
          </div>
        </article>
        <article className="glass rounded-2xl overflow-hidden card-hover transition-all flex flex-col group">
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-charcoal border border-white/10 overflow-hidden">
                <img alt="Author" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP28LOFDV8Hvt_v1Sx04rABtJUyxvcb0LOrxQbWVyOxFRyX2hwUG5m46rbt2wBQXxGa1h44ZbTwzQ_zPApdR0I7FC0MIWaoI3Mhl74yHGhm_7TEn4WVZexzVQ3GuRpCdWJyPuRQHfGUhvP2h1mobFRD8TAUlJMywdUmtPf-kXGZxGuDUg_nhZv_U-xs5aHio4obyFk8BliAQkfNFKhspRnqKchOw9XPN_wL0w0t56vHROK4wMtthewJ0bj7Pru1SPbfvCXwtVz9g" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Hiroshi T.</h4>
                <p className="text-[10px] text-slate-500">5 hours ago in <span className="text-primary">Craft</span></p>
              </div>
            </div>
            <button className="text-slate-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="relative h-80 overflow-hidden">
            <img alt="Feed Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvRysIdegdIHLanz_hCFSCLkMsUsAZXGPuluU7ZNPGUrK_jKwXFjwa_zkuYO--qnbJVd2nYz0s7J90grVv0XmTnxgxA4wu4q_fp-OhoVw-ozgmfJdXoxosU3J-mSRMWI389IDMytw7F5263Y3sb_vsIgIvJdNOYOeL1wdRs55xhVkXI4zQzk5bH7X1zZchxhobCQHkuWEP2nntod6M7FkQDOJUP4ecPRvLIqd2Y7MOJ63IswU01xCUjojmj_KhaOb6PPOg00Lptw" />
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-serif-jp text-white mb-4 group-hover:text-primary transition-colors">Blade Craft: Inside the Workshop of Japan's Last Masters</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
              The heat from the forge is a physical weight. Here, in a small village outside Gifu, the ancient traditions of sword-making live on in the hands of the masters...
            </p>
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">favorite</span>
                  <span className="text-xs font-bold">3.4k</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">chat_bubble</span>
                  <span className="text-xs font-bold">156</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">share</span>
                </button>
              </div>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default FeedBlogsCard;