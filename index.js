const road = document.getElementById("road");
const score = document.getElementById("score");
const startScreen = document.getElementById("startScreen");

let player = { start: false, speed: 0.3, score: 0 };
let obstacle = { speed: 0.2 };

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function keyUp(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function randomColor() {
  let randomColor = Math.floor(Math.random() * 5);
  if (randomColor == 0) {
    return "red";
  }
  if (randomColor == 1) {
    return "blue";
  }
  if (randomColor == 2) {
    return "green";
  }
  if (randomColor == 3) {
    return "yellow";
  }
  if (randomColor == 4) {
    return "orange";
  }
}

function generateLines() {
  for (let x = 0; x < 7; x++) {
    let div = document.createElement("div");
    div.setAttribute("id", "line");
    div.classList.add("line1");
    div.y = x * 9.375;
    div.style.top = div.y + "rem";
    road.appendChild(div);
  }
  for (let x = 0; x < 7; x++) {
    let div = document.createElement("div");
    div.setAttribute("id", "line");
    div.classList.add("line2");
    div.y = x * 9.375;
    div.style.top = div.y + "rem";
    road.appendChild(div);
  }
}

function generatePlayerCar() {
  let car = document.createElement("div");
  car.setAttribute("id", "car");
  car.setAttribute("class", "car");
  road.appendChild(car);

  player.x = car.offsetLeft / 16;
  player.y = car.offsetTop / 16;
}

function generateObstacles() {
  for (let i = 0; i < 5; i++) {
    let obstacle = document.createElement("div");
    obstacle.setAttribute("class", "obstacle");
    obstacle.y = (i + 1) * -10;
    obstacle.style.top = obstacle.y + "rem";
    obstacle.style.left = Math.floor(Math.random() * 35) + "rem";
    obstacle.style.backgroundColor = randomColor();

    road.appendChild(obstacle);
  }
}

function isCollide(car, item) {
  let carParams = car.getBoundingClientRect();
  let itemParams = item.getBoundingClientRect();

  return !(
    carParams.top > itemParams.bottom ||
    carParams.bottom < itemParams.top ||
    carParams.left > itemParams.right ||
    carParams.right < itemParams.left
  );
}

function moveLines() {
  let lines = document.querySelectorAll("#line");
  lines.forEach(function (item) {
    if (item.y >= 70) {
      item.y -= 75;
    }
    item.y += obstacle.speed;
    item.style.top = item.y + "rem";
  });
}

function endGame() {
  player.start = false;
  startScreen.classList.remove("hide");
  startScreen.innerHTML =
    "Game Over <br> Your Final Score is " +
    player.score +
    "<br> Press here to Restart the Game";
}

function moveObstacle(car) {
  let enemy = document.querySelectorAll(".obstacle");
  enemy.forEach(function (item) {
    if (isCollide(car, item)) {
      endGame();
    }
    if (item.y >= 70) {
      item.y = -5;
      item.style.left = Math.floor(Math.random() * 35) + "rem";
      player.score++;
      score.textContent = player.score;
    }
    item.y += obstacle.speed;
    item.style.top = item.y + "rem";
  });
}

function gamePlay() {
  let car = document.getElementById("car");

  let roadParams = road.getBoundingClientRect();

  if (player.start) {
    moveLines();
    moveObstacle(car);
    if (keys.ArrowUp && player.y > roadParams.top / 16 + 6) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < roadParams.bottom / 16 - 6) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < roadParams.width / 16 - 3) {
      player.x += player.speed;
    }

    car.style.top = player.y + "rem";
    car.style.left = player.x + "rem";

    requestAnimationFrame(gamePlay);
  }
}

function start() {
  startScreen.classList.add("hide");
  road.textContent = "";
  player.start = true;
  player.score = 0;
  score.textContent = player.score;

  generateLines();
  generatePlayerCar();

  generateObstacles();

  requestAnimationFrame(gamePlay);
}

startScreen.addEventListener("click", (e) => {
  e.preventDefault();
  start();
});
