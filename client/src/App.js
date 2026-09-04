import React, { useContext } from 'react'
import Header from './components/headers/Header'
import Pages from './components/mainpages/Pages'
import {BrowserRouter as Router } from 'react-router-dom'
import { DataProvider, GlobalState } from './GlobalState'

function AppContent() {
  const state = useContext(GlobalState);
  const [loading] = state.loading;

  if (loading) {
    return <h2 style={{ textAlign: "center", padding: "20px" }}>Loading...</h2>;
  }

  return (
    <Router>
    <div className='App'>
      <Header/>
      <Pages/>
    </div>
    </Router>
  )
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  )
}

export default App
