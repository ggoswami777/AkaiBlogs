import FooterNavigation from '@/components/ui/FooterNavigation'
import ProfileCardPage from '@/components/ui/ProfilePageCard'
import ProfilePageNavbar from '@/components/ui/ProfilePageNavbar'
import React from 'react'

const page = () => {
  return (
    <>
      <ProfilePageNavbar></ProfilePageNavbar>
      <ProfileCardPage></ProfileCardPage>
      <FooterNavigation></FooterNavigation>
    </>
  )
}

export default page