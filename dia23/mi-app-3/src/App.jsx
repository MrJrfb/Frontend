import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Nav from './components/Nav'
import PostList from './components/PostList'
import Footer from './components/Footer'

const posts = [
  { id: 1, titulo: 'Por que usar componentes', resumen: 'Dividir la interfaz en piezas reutilizables facilita el mantenimiento.', categoria: 'React' },
  { id: 2, titulo: 'Flexbox en 5 minutos', resumen: 'Las bases del modelo de caja flexible para maquetar sin dolor.', categoria: 'CSS' },
  { id: 3, titulo: 'Menus que todos pueden usar', resumen: 'Buenas practicas de aria-label y navegacion por teclado.', categoria: 'Accesibilidad' },
]

const categorias = ['Todas', 'React', 'CSS', 'Accesibilidad']

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')

  const postsFiltrados = categoriaActiva === 'Todas'
    ? posts
    : posts.filter((post) => post.categoria === categoriaActiva)

  return (
    <>
      <Header titulo="Blog de Clase" tagline="Practicando componentes, props y useState" />
      <Nav
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSeleccionar={setCategoriaActiva}
      />
      <PostList posts={postsFiltrados} />
      <Footer autor="Estudiante de Frontend Web" />
    </>
  )
}

export default App