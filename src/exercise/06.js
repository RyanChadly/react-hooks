// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js
import {ErrorBoundary} from 'react-error-boundary'
import * as React from 'react'

import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [{status, pokemon, error}, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) return
    setState({pokemon: null, status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({status: 'resolved', pokemon: pokemonData})
      })
      .catch(err => {
        setState({status: 'rejected', error: err})
      })
  }, [pokemonName])

  const result = () => {
    if (status === 'idle') {
      return 'Submit a pokemon'
    }
    if (status === 'rejected') {
      throw error
    }
    if (status === 'pending') {
      return <PokemonInfoFallback name={pokemonName} />
    }
    if (status === 'resolved') {
      return <PokemonDataView pokemon={pokemon} />
    }
    throw new Error('This should be impossible')
  }

  return result()
}
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }
  const handleReset = () => {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
