function Footer({ autor }) {
  return (
    <footer className="site-footer">
      <p>&copy; {new Date().getFullYear()} Blog de Clase — Escrito por {autor}</p>
    </footer>
  )
}

export default Footer