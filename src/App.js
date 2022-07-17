//CSS
import './App.css';

//React
import {useCallback, useEffect, useState} from 'react'

//Data
import {wordsList} from './data/words'

//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]


function App() {
  const [gameStage, setGameStage] = useState (stages[0].name)
  const [words] = useState (wordsList)

  const [pickedWord, setPickedWord] = useState ("")
  const [pickedCategory, setPickedCategory] = useState ("")
  const [letters, setLetters] = useState ([])

  const [guessedLetters, setGeussedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState (0)


  const pickWordAndCategory = useCallback( () => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    const word =  words[category][Math.floor(Math.random() * words[category].length)];

    return {word, category}
  },[words])



  //iniciar o jogo
  const startGame = useCallback (() => {
    clearLetterState()
    const { word, category } = pickWordAndCategory()
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

 

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  //processa a letra enviada
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    //Checar se a letra ja foi utilizada
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return
    }

    if(letters.includes(normalizedLetter)){
      setGeussedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses -1)
    }
  } 

  const clearLetterState = () => {
    setGeussedLetters([])
    setWrongLetters([])
  }

  //Checa condição de derrota
  useEffect(() => {

    if (guesses <= 0) {
      clearLetterState()
      setGameStage(stages[2].name);
    }

  },[guesses])

  //reinicia o jogo
  const retry = () => {
    setScore(0)
    setGuesses(3)
    setGameStage(stages[0].name);
  }

  //Checa condição de vitória
  useEffect (() => {
    const uniqueLetters = [...new Set(letters)]

    //Condicao de vitória
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){

      //adicionar ao score
      setScore((actualScore) => actualScore += 100)

      //reiniciar o jogo
      startGame()
    }


  }, [guessedLetters, letters, startGame, gameStage])


  return (
    <div className="App">
        {gameStage === 'start' && <StartScreen startGame={startGame}/>}
        {gameStage === 'game' && (<Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}/>)}
        {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
