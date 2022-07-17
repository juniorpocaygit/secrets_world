import './GameOver.css'

const GameOver = ({retry, score}) => {
  return (
    <div>
      <h1>Fim do Jogo!</h1>
      <h2>
        A sua pontução foi: <span>{score}</span> pontos</h2>
      <button onClick={retry}>Resetar jogo</button>
    </div>
  );
}

export default GameOver