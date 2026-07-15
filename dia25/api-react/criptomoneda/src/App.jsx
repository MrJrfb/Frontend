import { useState } from 'react'
import './App.css'
import EthereumPrice from './components/EthereumPrice'

function App() {
  const [count, setCount] = useState(0)

  return (
    < div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <EthereumPrice/>
    </div>
  )
}




export default App
