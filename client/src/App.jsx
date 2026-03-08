import React from 'react'
import Navbar from './components/NavbarTop'
import Searchbar from './components/Searchbar'

function App() {
  return (
    <div className='bg-logo-blue w-full min-h-screen px-8'>
      <Navbar/>
      <Searchbar/>
    </div>
  )
}

export default App