import { useState } from "react"

function CategoryMenu({ data, onClose }) {

  const [stack, setStack] = useState([data])

  const current = stack[stack.length - 1]

  function open(cat) {
    if (cat.children) {
      setStack([...stack, cat.children])
    }
  }

  function goBack() {
    setStack(stack.slice(0, -1))
  }

  return (
    <div className="fixed left-0 top-0 w-80 h-screen bg-slate-900 text-white p-4 z-10">

      <div className="flex justify-between mb-4">
        {stack.length > 1 && (
          <button onClick={goBack}>← Volver</button>
        )}
        <button onClick={onClose}>✕</button>
      </div>

      <ul className="space-y-4">
        {current.map((cat, i) => (
          <li
            key={i}
            onClick={() => open(cat)}
            className="flex justify-between cursor-pointer"
          >
            {cat.name}
            {cat.children && ">"}
          </li>
        ))}
      </ul>

    </div>
  )
}

export default CategoryMenu