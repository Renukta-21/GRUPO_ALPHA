import { IoSearchSharp } from "react-icons/io5";

function Searchbar() {
    return (
        <div className="w-full flex">
            <div className="flex flex-1 items-center border-gray-100 border-[1px] rounded-3xl px-5 py-2">
                <IoSearchSharp />
                <input type="text" name="" id="" className="flex-1 outline-0 px-3" placeholder="Busar productos, marcas" />
            </div>
        </div>
    )
}

export default Searchbar