"use strict";

// Elementos del DOM
const startButton = document.getElementById("start-button");
const gameScreen = document.getElementById("game");
const startScreen = document.getElementById("start-screen");
const scoreDisplay = document.getElementById("scoreDisplay");

// Elementos del mensaje de fin de juego, victoria y botones
const gameOverScreen = document.getElementById("game-over-screen");
const victoryScreen = document.getElementById("victory-screen"); 
const finalScoreDisplay = document.getElementById("final-score");
const resetButton = document.getElementById("reset-button");
const mainMenuButton = document.getElementById("main-menu-button");

const victoryScoreDisplay = document.getElementById("victory-score");
const victoryResetButton = document.getElementById("victory-reset-button");
const victoryMenuButton = document.getElementById("victory-main-menu-button");

// Música y sonido de victoria
const backgroundMusic = new Audio("assets/musica.mp3");
const victorySound = new Audio("assets/victoria.mp3");
backgroundMusic.loop = true; // La música se repetirá en bucle

let runner;
let score = 0;
let enemigos = [];
let juegoEnCurso = false;
let gameLoopInterval;

// Iniciar el juego al hacer clic en el botón de inicio
startButton.addEventListener("click", function () {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    resetGame();
    iniciarJuego();
});

// Función para iniciar el juego
function iniciarJuego() {
    juegoEnCurso = true;
    backgroundMusic.play(); // Inicia la música de fondo
    gameLoopInterval = setInterval(gameLoop, 50);
    generarEnemigosConIntervaloAleatorio();
}

// Función para reiniciar el juego
function resetGame() {
    runner = new Runner();
    score = 0;
    scoreDisplay.innerText = "Puntaje: " + score + " / 40";
    enemigos = [];
    gameOverScreen.style.display = "none";
    victoryScreen.style.display = "none";
    gameScreen.style.filter = "none";
    clearInterval(gameLoopInterval);
}

// Detectar tecla de salto (flecha arriba)
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && juegoEnCurso) {
        runner.saltar();
    }
});

// Lógica del juego
function gameLoop() {
    if (!juegoEnCurso) return;

    enemigos.forEach((enemigo, index) => {
        if (enemigo.enemigo.getBoundingClientRect().right <= 0) {
            enemigo.eliminar();
            enemigos.splice(index, 1);
            score++;
            scoreDisplay.innerText = "Puntaje: " + score + " / 40";
        }
    });
    detectarColision();
    verificarVictoria(); // Verificar si se alcanzó la puntuación de victoria
}

// Generar enemigos aleatoriamente
function generarEnemigosConIntervaloAleatorio() {
    if (!juegoEnCurso) return;

    let tiempoAleatorio = calcularTiempoGeneracion();
    setTimeout(() => {
        if (juegoEnCurso) {
            generarEnemigo();
            generarEnemigosConIntervaloAleatorio();
        }
    }, tiempoAleatorio);
}

function calcularTiempoGeneracion() {
    if (score > 35) {
        return Math.floor(Math.random() * (3000 - 500 + 1)) + 400;
    } else if (score > 30) {
        return Math.floor(Math.random() * (3000 - 500 + 1)) + 500;
    } else if (score > 20) {
        return Math.floor(Math.random() * (3000 - 500 + 1)) + 600;
    } else if (score > 10) {
        return Math.floor(Math.random() * (3000 - 500 + 1)) + 800;
    } else {
        return Math.floor(Math.random() * (3000 - 500 + 1)) + 1000;
    }
}

function generarEnemigo() {
    let enemigo = new Enemigo();
    enemigos.push(enemigo);
    gameScreen.appendChild(enemigo.enemigo);
}

// Detectar colisiones entre el runner y los enemigos
function detectarColision() {
    enemigos.forEach(enemigo => {
        const rectEnemigo = enemigo.enemigo.getBoundingClientRect();

        if (rectEnemigo.left <= 125 && rectEnemigo.right >= 105) {
            const rectPersonaje = runner.personaje.getBoundingClientRect();
            const alturaJuego = gameScreen.clientHeight;

            const porcentajeBottom = ((alturaJuego - rectPersonaje.bottom) / alturaJuego) * 100;

            if (porcentajeBottom < 15) {
                gameOver();
            }
        }
    });
}

// Verificar si se ha alcanzado la puntuación de victoria
function verificarVictoria() {
    if (score === 40) {
        victoria();
    }
}

// Función de fin del juego
function gameOver() {
    juegoEnCurso = false;
    clearInterval(gameLoopInterval);
    backgroundMusic.pause(); // Pausar la música de fondo
    gameOverScreen.style.display = "block";
    gameScreen.style.filter = "blur(5px)";
    finalScoreDisplay.innerText = "Puntaje Final: " + score;
}

// Función de victoria
function victoria() {
    juegoEnCurso = false;
    clearInterval(gameLoopInterval);
    backgroundMusic.pause(); // Pausar la música de fondo
    victorySound.play(); // Reproducir el sonido de victoria
    victoryScreen.style.display = "block";
    gameScreen.style.filter = "blur(5px)";
    victoryScoreDisplay.innerText = "Puntaje Final: " + score;
}

// Evento para reiniciar el juego desde la pantalla de fin de juego
resetButton.addEventListener("click", function () {
    gameOverScreen.style.display = "none";
    gameScreen.style.filter = "none";
    resetGame();
    iniciarJuego();
});

// Evento para regresar al menú principal desde la pantalla de fin de juego
mainMenuButton.addEventListener("click", function () {
    resetGame();
    gameOverScreen.style.display = "none";
    gameScreen.style.display = "none";
    startScreen.style.display = "block";
});

// Evento para reiniciar el juego desde la pantalla de victoria
victoryResetButton.addEventListener("click", function () {
    victoryScreen.style.display = "none";
    gameScreen.style.filter = "none";
    resetGame();
    iniciarJuego();
});

// Evento para regresar al menú principal desde la pantalla de victoria
victoryMenuButton.addEventListener("click", function () {
    resetGame();
    victoryScreen.style.display = "none";
    gameScreen.style.display = "none";
    startScreen.style.display = "block";
});