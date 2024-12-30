const canvas = document.getElementById('canvas');
canvas.width = '640';
canvas.height = '360';
const c = canvas.getContext('2d');

const gridSize = 40;
const gridColor = '#FFF';

/*
*   Musics & Images
*/
const capybaraMusic = new Audio('./assets/sounds/capybara.mp3');
capybaraMusic.load();
const tuyuMusic = new Audio('./assets/sounds/tuyu.mp3');
tuyuMusic.load();
const royaltyMusic = new Audio('./assets/sounds/royalty.mp3');
royaltyMusic.load();
const vortexMusic = new Audio('./assets/sounds/VORTEX (时光代理人第二季动画片头曲).mp3');
vortexMusic.load();

const capybaraImg = new Image();
capybaraImg.src = './assets/images/capybara.jpg';
const tuyuImg = new Image();
tuyuImg.src = './assets/images/tuyu.jpg';
const royaltyImg = new Image();
royaltyImg.src = './assets/images/royalty.jpg';
const vortexImg = new Image();
vortexImg.src = './assets/images/VORTEX (时光代理人第二季动画片头曲).jpg';

/*
*   Object
*/
const object = [
    {
        name: 'capybara',
        music: capybaraMusic,
        img: capybaraImg,
    },
    {
        name: 'tuyu',
        music: tuyuMusic,
        img: tuyuImg,
    },
    {
        name: 'royalty',
        music: royaltyMusic,
        img: royaltyImg,
    },
    {
        name: 'VORTEX (时光代理人第二季动画片头曲)',
        music: vortexMusic,
        img: vortexImg,
    }
]

let snakes = [
    {
        x: gridSize*0,
        y: 0,
        img: null,
    },
    {
        x: gridSize*0,
        y: 0,
        img: null,
    },
]

let direction = {x: 1, y: 0};
let foods = [];
let gameInterval;
let currentMusic;


function drawGrid() {
    c.clearRect(0,0,canvas.width,canvas.height);

    c.fillStyle = '#aaa';
    c.fillRect(0,0,canvas.width,canvas.height);

    for (let x = 0; x <= canvas.width; x += gridSize) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, canvas.height);
        c.strokeStyle = gridColor;
        c.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(canvas.width, y);
        c.strokeStyle = gridColor;
        c.stroke();
    }
}

function spawnFood() {
    const random = Math.floor(Math.random() * object.length);
    const food = {
        x: Math.floor(Math.random() * (canvas.width/gridSize))*gridSize,
        y: Math.floor(Math.random() * (canvas.height/gridSize))*gridSize,
        img: object[random].img,
        music: object[random].music,
    };
    foods.push(food);
}

function drawFood() {
    for (let i = 0; i < foods.length; i++) {
        const food = foods[i];
        c.drawImage(food.img,food.x,food.y,gridSize,gridSize);
    }
}

function moveSnake() {
    const newHead = {
        x: snakes[0].x + direction.x * gridSize,
        y: snakes[0].y + direction.y * gridSize,
        img: null,
    };


    if (newHead.x >= canvas.width) {
        newHead.x = 0;
    };
    if (newHead.x < 0) {
        newHead.x = canvas.width;
    };
    if (newHead.y >= canvas.height) {
        newHead.y = 0;
    };  
    if (newHead.y < 0) {
        newHead.y = canvas.height;
    };

    for (let i = 0; i < snakes.length - 1; i++) {
        snakes[i].img = snakes[i+1].img;
    }

    snakes.unshift(newHead);

    const foodIndex = foods.findIndex(food => food.x === snakes[0].x && food.y === snakes[0].y);
    if (foodIndex !== -1) {
        if (currentMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        }
        currentMusic = foods[foodIndex].music;
        foods[foodIndex].music.play();
        snakes.pop();
        const snake = {x: snakes[snakes.length-1].x - direction.x * gridSize, y: snakes[snakes.length-1].y - direction.y * gridSize, img: foods[foodIndex].img};
        snakes.push(snake);
        foods.splice(foodIndex,1);
        spawnFood();
    } else {
        snakes.pop();
    }

}

function drawSnake() {
    for (let i = 0; i < snakes.length; i++) {
        const segment = snakes[i];
        c.fillStyle = 'green';
        if (segment.img) {
            c.drawImage(segment.img, segment.x, segment.y, gridSize, gridSize);
        } else {
            c.fillRect(segment.x, segment.y, gridSize, gridSize);
        }

        c.strokeStyle = 'black';
        c.lineWidth = 1;
        c.strokeRect(segment.x, segment.y, gridSize, gridSize);
    }
}

document.addEventListener("keydown", function(e) {
    if (e.key === "w") {
        if (direction.y !== 1) {
            direction.y = -1;
            direction.x = 0;
        }
    } else if (e.key === "a") {
        if (direction.x !== 1) {
            direction.y = 0;
            direction.x = -1;
        }
    } else if (e.key === "s") {
        if (direction.y !== -1) {
            direction.y = 1;
            direction.x = 0;
        }
    } else if (e.key === "d") {
        if (direction.x !== -1) {
            direction.y = 0;
            direction.x = 1;
        }
    }
})

function updateGame() {
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake()
}

function start() {
    drawGrid();
    spawnFood();
    drawFood();
    tuyuImg.onload = function() {c.drawImage(tuyuImg, -20, -20, 20, 20);};
    capybaraImg.onload = function() {c.drawImage(capybaraImg, -20, -20, 20, 20);};

    gameInterval = setInterval(updateGame, 1000/5);
}
