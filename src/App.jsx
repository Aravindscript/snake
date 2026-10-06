import React, { useCallback, useEffect, useState } from "react";
import "./style.css";

const BOARD_SIZE = 20;
const GAME_SPEED = 170;

const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
  { x: 5, y: 10 },
];

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function randomApple(snake) {
  let apple;

  do {
    apple = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (
    snake.some(
      (part) => part.x === apple.x && part.y === apple.y
    )
  );

  return apple;
}

/* =========================================
   TOP REAL SNAKE SVG
========================================= */

function SnakeLogo() {
  return (
    <svg
      className="real-snake-logo"
      viewBox="0 0 100 65"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Snake body */}
      <path
        d="
          M 15 40
          C 18 18, 31 12, 43 25
          C 53 37, 61 51, 73 42
          C 82 35, 78 19, 66 17
        "
        fill="none"
        stroke="#39f36f"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner transparent/highlight body */}
      <path
        d="
          M 15 40
          C 18 18, 31 12, 43 25
          C 53 37, 61 51, 73 42
          C 82 35, 78 19, 66 17
        "
        fill="none"
        stroke="#8affae"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Snake head */}
      <ellipse
        cx="66"
        cy="16"
        rx="13"
        ry="10"
        fill="#32e966"
        stroke="#71ff9a"
        strokeWidth="2"
      />

      {/* Head shine */}
      <ellipse
        cx="70"
        cy="12"
        rx="4"
        ry="2"
        fill="#c7ffda"
        opacity="0.75"
      />

      {/* Eyes */}
      <circle
        cx="61"
        cy="11"
        r="3"
        fill="white"
      />

      <circle
        cx="72"
        cy="11"
        r="3"
        fill="white"
      />

      <circle
        cx="61"
        cy="11"
        r="1.5"
        fill="#111"
      />

      <circle
        cx="72"
        cy="11"
        r="1.5"
        fill="#111"
      />

      {/* Tongue */}
      <path
        d="M 78 17 L 94 17"
        stroke="#ff5875"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M 94 17 L 99 13"
        stroke="#ff5875"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M 94 17 L 99 21"
        stroke="#ff5875"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Body highlight dots */}
      <circle cx="25" cy="24" r="2" fill="#baffcf" />
      <circle cx="40" cy="28" r="2" fill="#baffcf" />
      <circle cx="56" cy="43" r="2" fill="#baffcf" />
      <circle cx="73" cy="39" r="2" fill="#baffcf" />
    </svg>
  );
}

/* =========================================
   GAME SNAKE HEAD
========================================= */

function SnakeHead({ direction }) {
  let rotation = 0;

  if (direction === "UP") rotation = -90;
  if (direction === "DOWN") rotation = 90;
  if (direction === "LEFT") rotation = 180;

  return (
    <div
      className="snake-head"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className="head-shine" />

      <div className="snake-eye eye-one">
        <span />
      </div>

      <div className="snake-eye eye-two">
        <span />
      </div>

      <div className="snake-tongue">
        <i />
        <i />
      </div>
    </div>
  );
}

/* =========================================
   APPLE
========================================= */

function Apple() {
  return (
    <div className="apple">
      <div className="apple-shine" />
      <div className="apple-leaf" />
      <div className="apple-stem" />
    </div>
  );
}

/* =========================================
   APP
========================================= */

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [apple, setApple] = useState(
    randomApple(INITIAL_SNAKE)
  );

  const [direction, setDirection] = useState("RIGHT");
  const [nextDirection, setNextDirection] = useState("RIGHT");

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  /* Direction */

  const changeDirection = useCallback(
    (newDirection) => {
      const current = DIRECTIONS[direction];
      const next = DIRECTIONS[newDirection];

      if (
        current.x + next.x === 0 &&
        current.y + next.y === 0
      ) {
        return;
      }

      setNextDirection(newDirection);
    },
    [direction]
  );

  /* Keyboard controls */

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (key === "arrowup" || key === "w") {
        changeDirection("UP");
      }

      if (key === "arrowdown" || key === "s") {
        changeDirection("DOWN");
      }

      if (key === "arrowleft" || key === "a") {
        changeDirection("LEFT");
      }

      if (key === "arrowright" || key === "d") {
        changeDirection("RIGHT");
      }

      if (
        (key === "enter" || key === "r") &&
        gameOver
      ) {
        restartGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [changeDirection, gameOver]);

  /* Game loop */

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake((currentSnake) => {
        const move = DIRECTIONS[nextDirection];

        const head = currentSnake[0];

        const newHead = {
          x: head.x + move.x,
          y: head.y + move.y,
        };

        /* Wall collision */

        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE
        ) {
          setGameOver(true);
          return currentSnake;
        }

        /* Self collision */

        const hitSelf = currentSnake.some(
          (part) =>
            part.x === newHead.x &&
            part.y === newHead.y
        );

        if (hitSelf) {
          setGameOver(true);
          return currentSnake;
        }

        let newSnake = [
          newHead,
          ...currentSnake,
        ];

        /* Apple */

        if (
          newHead.x === apple.x &&
          newHead.y === apple.y
        ) {
          setScore((oldScore) => oldScore + 1);

          setApple(randomApple(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });

      setDirection(nextDirection);
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [nextDirection, apple, gameOver]);

  /* Restart */

  function restartGame() {
    const freshSnake = INITIAL_SNAKE.map(
      (part) => ({ ...part })
    );

    setSnake(freshSnake);
    setApple(randomApple(freshSnake));

    setDirection("RIGHT");
    setNextDirection("RIGHT");

    setScore(0);
    setGameOver(false);
  }

  return (
    <main className="game-container">

      <section className="game-card">

        {/* =========================
            TITLE
        ========================== */}

        <div className="game-title">

          <SnakeLogo />

          <h1>SNAKE GAME</h1>

        </div>

        {/* =========================
            BOARD
        ========================== */}

        <div className="board">

          <div className="grid-background" />

          {/* Apple */}

          <div
  className="apple-position"
  style={{
    left: `${((apple.x + 0.5) / BOARD_SIZE) * 100}%`,
    top: `${((apple.y + 0.5) / BOARD_SIZE) * 100}%`,
  }}
>
  <Apple />
</div>

          {/* Snake */}

          {snake.map((part, index) => {
            const isHead = index === 0;
            const isTail =
              index === snake.length - 1;

            return (
              <div
                key={`${part.x}-${part.y}-${index}`}
                className={`snake-position ${
                  isHead
                    ? "head-position"
                    : ""
                } ${
                  isTail
                    ? "tail-position"
                    : ""
                }`}
                style={{
                  left: `${(part.x / BOARD_SIZE) * 100}%`,
                  top: `${(part.y / BOARD_SIZE) * 100}%`,
                }}
              >

                {isHead ? (
                  <SnakeHead
                    direction={direction}
                  />
                ) : (
                  <div className="snake-segment">

                    <div className="inside-glow" />

                    <div className="inside-dot" />

                  </div>
                )}

              </div>
            );
          })}

          {/* Game Over */}

          {gameOver && (
            <div className="game-over">

              <strong>
                GAME OVER!
              </strong>

              <span>
                Press Restart
              </span>

            </div>
          )}

        </div>

        {/* =========================
            SCORE
        ========================== */}

        <div className="bottom-area">

          <div className="score">
            Score: {score}
          </div>

          <button
            className="restart-button"
            onClick={restartGame}
          >
            Restart
          </button>

        </div>

        {/* =========================
            CONTROLS
        ========================== */}

        <div className="control-area">

          <div className="keyboard-label">
            W A S D / ARROW KEYS
          </div>

          <button
            className="control up"
            onClick={() =>
              changeDirection("UP")
            }
          >
            ↑
          </button>

          <div className="control-row">

            <button
              className="control"
              onClick={() =>
                changeDirection("LEFT")
              }
            >
              ←
            </button>

            <button
              className="control"
              onClick={() =>
                changeDirection("DOWN")
              }
            >
              ↓
            </button>

            <button
              className="control"
              onClick={() =>
                changeDirection("RIGHT")
              }
            >
              →
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}

export default App;