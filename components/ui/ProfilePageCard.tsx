import ProfileHeader from "./profile/ProfileHeader";

import ProfileStats from "./profile/ProfileStats";
import ProfileTabs from "./profile/ProfileTabs";
import ProfilePostCard from "./profile/ProfilePostCard";

const ProfileCardPage = () => {
  const profileData = {
    name: "Kenji Sato",
    username: "kenjisato",
    bio: "Digital nomad & coffee enthusiast. Sharing my journey through Tokyo's hidden neon streets and quiet temples.",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQREzBniPFG2Rv_94OnCxJg4cRDD40044S_MYT3ZXzSs4-9GW-Jv3-nb6sUnnqs2nTb6XE0OcJsPGnJDuMQJZ9QcIcQ_aHE1N7YwlkHcXxTBimzOzoqZ6IzCaH-CeERYMzm06b5vHmwCKTr24X--k89shI3ntfJqHPuc2pmf9UGQ60JwENsEpz0xxzRexZnHPo4N61bX1AIe4QBvRpu7bNUZKwep55iMNKLCoKqkRSQK4tfIUepeZ3C9uu4pIuIbkiT-5nAYtHiQ",
    stats: {
      followers: "1.2k",
      following: "850",
      posts: 42
    }
  };

  const posts = [
    {
      id: 1,
      title: "Midnight in Shinjuku",
      excerpt: "Found this amazing small ramen shop tucked away behind the main station. Best broth I've had this month!",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGqQusKRN51nhQea1nffq_Ca4j_-0PMBC1Kq8Vwk3S6jpo6nwpTYVY9C5t2-Ps7WCl_HN0E_e30iwbpfkb0j4bs6k63XOw7TVhsgAlwIeGTFvT_c1AUkp1dcYxDuM9IWKpJE9cCmcJjFGZmhNgQohmddj93Gwlxi6-sx2YwsqCglBPWx0yGxsya0QQ13S-hfTeEFKPcdM6GaS6YjQmr9ks2qHyAPzxsGcqEZtfsuw_kjHXipNXV2KUmSXhQXSsiLm-zQOqO1WCJg",
      likes: "2.4k",
      comments: 156,
      date: "Oct 24, 2023"
    },
    {
      id: 2,
      title: "Finding Zen in the Chaos",
      excerpt: "Even in the world's busiest city, silence is only a temple gate away. Spent the morning at Meiji Jingu.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCsuL_1udSYH8r1Z3LBdxqz8ressHppnxPzzvsEeRzvomxyyWun5CG0A9KvVnH2oIEJ_sv62s9bomWVL6TpNH2f2EOtMgL9wXRmyDBhMRgcP5Sjb7_1A8u8JFwp19u8-jPSvec6zjsVhVxXdIdBuMgPuOBR3Ph38x6CjhPnsVVfwTmQ63iAo0iFkkHh8bT45iRiYKf6QI377SmMuNh0yOp-wfH0U8y8aamo8pa6dM8pl-JSG71lPonCeQaZjR6ocjxdtFGwbF4IQ",
      likes: "1.8k",
      comments: 89,
      date: "Oct 20, 2023"
    },
    {
      id: 3,
      title: "Tokyo Coffee Culture",
      excerpt: "The attention to detail in these specialty shops is unreal. This pour-over took 10 minutes but was worth every second.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGFzYQJ-FElA9PXTUc9p53s7iUIm0geLKI-1uCLmgJx3S6gtALpCAm8IC2RzHg0jFwxvj63j4SEUNLYUVuTXeIgRtmBVA2PjK1nuXvIY6X2rOAL9xXet8uB9_RGKIuJEy84eboVy8PNnIyZh-NpbAO_-Dflf3xkmgF6Df7-0mx0MZlhG8H79T2f-9pIvyy4LLxkhcTYxHxYZKW9THXpJ6Miw_e5H1GNdSh2q0WqLZq2wW5R7G6-fL3wflFjjkPsKLIQT-pkRdN5w",
      likes: "3.1k",
      comments: 243,
      date: "Oct 15, 2023"
    }
  ];

  return (
    <main className="flex flex-col justify-center py-5 max-w-[1400px] mx-auto px-4">
      <div className="flex flex-col flex-1 max-w-[800px] w-full mx-auto mt-6 lg:mt-0">

        <ProfileHeader 
          name={profileData.name}
          username={profileData.username}
          bio={profileData.bio}
          avatarUrl={profileData.avatarUrl}
        />

        <div className="my-6">
          <ProfileStats 
            followers={profileData.stats.followers}
            following={profileData.stats.following}
            posts={profileData.stats.posts}
          />
        </div>

        <ProfileTabs />

        <div className="flex flex-col gap-6">
          {posts.map(post => (
            <ProfilePostCard 
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              likes={post.likes}
              comments={post.comments}
              date={post.date}
            />
          ))}
        </div>
        
        <div className="h-20 lg:hidden"></div>
      </div>
    </main>
  );
};

export default ProfileCardPage;