import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Page from './Page/Page.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Page/>
    </>
  )
}

export default App
