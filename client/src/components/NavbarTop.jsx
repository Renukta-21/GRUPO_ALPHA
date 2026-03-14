import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RxHamburgerMenu } from 'react-icons/rx'
import { IoCartOutline } from 'react-icons/io5'
import logoDark from '../assets/logoDark.png'
import CategoryMenu from './CategoryMenu'

function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const goHome = () => {
    onNavigate?.()        // limpia el searchQuery en App
    navigate('/')
  }

  return (
    <div>
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <button className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
            <RxHamburgerMenu className="text-white" />
          </button>
          {/* Logo clickeable → home */}
          <img
            src={logoDark}
            alt="Logo"
            className="w-40 cursor-pointer"
            onClick={goHome}
          />
        </div>
        <button className="bg-amber-400 w-9 h-9 rounded-md flex justify-center items-center cursor-pointer">
          <IoCartOutline />
        </button>
        {menuOpen && (
          <CategoryMenu onClose={() => setMenuOpen(false)} />
        )}
      </div>
    </div>
  )
}

export default Navbar
