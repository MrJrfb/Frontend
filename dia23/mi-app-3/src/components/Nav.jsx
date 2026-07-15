function Nav({ categorias, categoriaActiva, onSeleccionar }) {
  return (
    <nav className="site-nav" aria-label="Filtrar por categoria">
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria}>
            <button
              className="nav-btn"
              aria-current={categoria === categoriaActiva ? 'page' : undefined}
              onClick={() => onSeleccionar(categoria)}
            >
              {categoria}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav