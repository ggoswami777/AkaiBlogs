import { Search } from 'lucide-react'
import React from 'react'

const SearchBar = () => {
  return (
    <div className='hidden lg:flex items-center glass rounded-full px-4 py-2 gap-2'>
      <span className='material-symbols-outlined text-red-600 text-xl'><Search/></span>
      
      <input className='bg-transparent border-none focus:ring-0 text-sm focus:outline-none placeholder:text-slate-500 w-48' type="text" placeholder='Search Scrolls...' />
    </div>
  )
}

export default SearchBar