import { RxHamburgerMenu } from "react-icons/rx";
import { IoCartOutline } from "react-icons/io5";
import logoDark from '../assets/logoDark.png'
import { useState } from "react";
import categories from "../../categories";
import CategoryMenu from "./CategoryMenu";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <div>
            <div className="flex justify-between items-center py-3">
                <div className="flex align-center">
                    <button className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                        <RxHamburgerMenu />
                    </button>
                    <img src={logoDark} alt="" className="w-40" />
                </div>
                <button className="bg-amber-400 w-9 h-9 rounded-md flex justify-center items-center cursor-pointer">
                    <IoCartOutline />
                </button>
                {menuOpen && (
                    <CategoryMenu
                        data={categories}
                        onClose={() => setMenuOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}

export default Navbar