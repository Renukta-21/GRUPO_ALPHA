import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RxHamburgerMenu } from 'react-icons/rx'
import { IoCartOutline } from 'react-icons/io5'
import logoDark from '../assets/logoDark.png'
import CategoryMenu from './CategoryMenu'
import { useCart } from '../hooks/useCart'

function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { totalItems, setOpen } = useCart()

  const goHome = () => {
    onNavigate?.()
    navigate('/')
  }

  return (
    <div>
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <button className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
            <RxHamburgerMenu className="text-white" />
          </button>
          <img
            src={logoDark}
            alt="Logo"
            className="w-40 cursor-pointer"
            onClick={goHome}
          />
        </div>

        {/* Botón carrito con badge */}
        <button
          onClick={() => setOpen(true)}
          className="relative bg-amber-400 w-9 h-9 rounded-md flex justify-center items-center cursor-pointer hover:bg-amber-300 transition-colors"
        >
          <IoCartOutline className="text-black" size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>

        {menuOpen && (
          <CategoryMenu onClose={() => setMenuOpen(false)} />
        )}
      </div>
    </div>
  )
}

export default Navbar
