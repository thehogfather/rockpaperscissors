(() => {
  let gameHistory = []
  const ROCK = '✊', PAPER = '✋', SCISSORS = '✌'
  const choiceLookUp = { ROCK, PAPER, SCISSORS }
  const distribution = { ROCK: 0.29, PAPER: 0.64, SCISSORS: 1 }

  const computerPlay = () => {
    const choice = Math.random()
    return choice <= distribution.ROCK ? ROCK
      : choice <= distribution.PAPER ? PAPER : SCISSORS
  }

  const getOutcome = (player1, player2) => {
    const round = {[player1]: player1, [player2]: player2}
    return round[ROCK] && round[PAPER] ? 'Paper covers rock'
      : round[ROCK] && round[SCISSORS] ? 'Rock breaks scissors'
      : round[PAPER] && round[SCISSORS] ? 'Scissors cuts paper'
      : 'Tie'
  }

  const playRound = (humanChoice) => {
    const computerChoice = computerPlay()
    let outcome = getOutcome(computerChoice, humanChoice)
    if (computerChoice === humanChoice ) {
      gameHistory.unshift([0, 0, outcome, computerChoice, humanChoice])
    } else if (computerChoice === ROCK && humanChoice === SCISSORS ||
      computerChoice === PAPER && humanChoice === ROCK ||
      computerChoice === SCISSORS && humanChoice === PAPER) {
        gameHistory.unshift([1, 0, outcome, computerChoice, humanChoice])
    } else {
      gameHistory.unshift([0, 1, outcome, computerChoice, humanChoice])
    }
    render(gameHistory)
  }

  const showGameOver = () => {
    d3.select('.gameover').style('display', 'block')
    d3.select('.game').style('display', 'none')
  }

  const render = (gameHistory) => {
    const historyHead = gameHistory[0] || []
    const defaultEmoticonSize = '30pt'
    const zoomedEmoticonSize = '60pt'
    const numberOfRounds = 30
    let computerChoice = historyHead[3] || '', humanChoice = historyHead[4] || ''
    d3.select('.computer').html(computerChoice).transition().ease(d3.easeBounce).duration(500).style('font-size', zoomedEmoticonSize)
      .transition().style('font-size', defaultEmoticonSize)
    d3.select('.human').html(humanChoice).transition().ease(d3.easeBounce).duration(500).style('font-size', zoomedEmoticonSize)
      .transition().style('font-size', defaultEmoticonSize)
    const combined = gameHistory.reduce((a = [0, 0], b = [0, 0]) => [a[0] + b[0], a[1] + b[1]], [0, 0])
    const nonTiedRounds = combined[0] + combined[1]
    if (combined[0] > combined[1]) {
      combined.push(nonTiedRounds < numberOfRounds ? 'I am winning' : 'I Won')
    } else if (combined[0] < combined[1]) {
      combined.push(nonTiedRounds < numberOfRounds ? 'You are winning' : 'You won!  (╯°□°）╯︵ ┻━┻')
    } else {
      combined.push('So far, it\'s a tie')
    }
    const gameResult = d3.select('.game-result')
    const resultRow = gameResult.html('')
      .selectAll('.round').data(gameHistory)
      .enter().append('tr')
    resultRow.append('td').html(data => data[3])
    resultRow.append('td').html(data => data[4])
    resultRow.append('td').html(data => data[2])

    const summaryRow = d3.select('.game-result-table .current-score').html('')
    summaryRow.append('td').html(() => combined[0])
    summaryRow.append('td').html(() => combined[1])
    summaryRow.append('td').html(() => combined[2])
    if (nonTiedRounds >= numberOfRounds && combined[0] !== combined[1]) {
      return showGameOver()
    }
  }
  const resetGame = () => {
    gameHistory = []
    d3.select('.gameover').style('display', 'none').select('.message').html('')
    d3.selectAll('.game, .game-result-table').style('display', 'flex')
    render(gameHistory)
  }
  const initialiseInteractivity = () => {
    d3.selectAll('.human-controls li').on('click', () => playRound(choiceLookUp[d3.event.target.className.toUpperCase()]))
    d3.select('.reset').on('click', resetGame )
  }
  initialiseInteractivity()
})()
