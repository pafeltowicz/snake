const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;

const DIR_LEFT = 0;
const DIR_RIGHT = 1;
const DIR_UP = 2;
const DIR_DOWN = 3;

const FRAME_RATE = 1000 / 10;

class Food {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 10;
        this.height = 10;
    }

    pickLocation(snake) {
        this.x = Math.floor(Math.random() * (GAME_WIDTH / 10 - 1)) * this.width;
        this.y = Math.floor(Math.random() * (GAME_HEIGHT / 10 - 1)) * this.height;

        snake.tail.forEach((item) => {
            if (snake.collisionDetect(item, this) ||
                this.x >= (GAME_WIDTH - this.width) ||
                this.y >= (GAME_WIDTH - this.height)) {
                this.pickLocation(snake);
            }
        });
    }
}

class Snake {
    constructor() {
        this.direction = DIR_RIGHT;
        this.width = 10;
        this.height = 10;
        this.tail = [
            {x: 0, y: 40},
            {x: 20, y: 40},
            {x: 40, y: 40}
        ];
    }

    collisionWall(item) {
        return (item.x + this.width > GAME_WIDTH ||
        item.y + this.height > GAME_HEIGHT ||
        item.x < 0 || item.y < 0)
    }


    direct(lastBall) {
        switch (this.direction) {
            case DIR_LEFT:
                this.tail.push({x: lastBall.x - this.width, y: lastBall.y});
                break;
            case DIR_RIGHT:
                this.tail.push({x: lastBall.x + this.width, y: lastBall.y});
                break;
            case DIR_UP:
                this.tail.push({x: lastBall.x, y: lastBall.y - this.height});
                break;
            case DIR_DOWN:
                this.tail.push({x: lastBall.x, y: lastBall.y + this.height});
                break;
            default:
                break;
        }
    }

    collisionDetect(rect1, rect2) {
        return (rect1.x < rect2.x + this.width &&
        rect1.x + this.width > rect2.x &&
        rect1.y < rect2.y + this.height &&
        this.height + rect1.y > rect2.y);
    }

    insert() {
        let lastBall = this.tail[this.tail.length - 1];
        this.direct(lastBall);
    }
}
class App {
    constructor() {
        this.$canvas = document.getElementById('playGround');
        this.ctx = this.$canvas.getContext('2d');
        this.score = 0;
        this.snake = new Snake();
        this.food = new Food();
        this.food.pickLocation(this.snake);
        this.$canvas.width = GAME_WIDTH;
        this.$canvas.height = GAME_HEIGHT;
        this.colisionSnake = function (item, index, last) {
            return item.x === last.x && item.y === last.y &&
                index < this.snake.tail.length - 2;
        };
        this.draw();
        this.assignEvent();
    }

    assignEvent() {
        window.addEventListener('keydown', this.keyHandler.bind(this), false);
    }

    keyHandler(e) {
        e.preventDefault();
        let code = e.keyCode;
        switch (code) {
            case 37:
                if (this.snake.direction !== DIR_RIGHT) {
                    this.snake.direction = DIR_LEFT;
                }
                break; //Left key
            case 38:
                if (this.snake.direction !== DIR_DOWN) {
                    this.snake.direction = DIR_UP;
                }
                break; //Up key
            case 39:
                if (this.snake.direction !== DIR_LEFT) {
                    this.snake.direction = DIR_RIGHT;
                }
                break; //Right key
            case 40:
                if (this.snake.direction !== DIR_UP) {
                    this.snake.direction = DIR_DOWN;
                }
                break; //Down key
            default:
                break;
        }
    }

    update(last) {
        this.snake.tail.forEach((item, index) => {
            if (index === this.snake.tail.length - 1) {
                //HEAD
                this.ctx.fillStyle = "green";
            } else {
                //BODY
                this.ctx.fillStyle = "#000";
            }
            this.ctx.fillRect(item.x, item.y, this.snake.width, this.snake.height);

            if (this.snake.collisionDetect(last, this.food)) {
                this.score++;
                this.snake.insert();
                this.food.pickLocation(this.snake);
            }

            //Collision wall or "canibal snake"
            if (this.colisionSnake(item, index, last) ||
                this.snake.collisionWall(item)) {
                //Game over
                alert("Gameover! Twój wynik to: " + this.score + " PTK");
                // New Game
                this.resetGame();
            }
        });
    }

    show() {
        this.snake.insert();
        this.snake.tail.shift();
        this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.ctx.beginPath();
        this.last = this.snake.tail[this.snake.tail.length - 1];
        this.update(this.last);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(
            this.food.x,
            this.food.y,
            this.food.width,
            this.food.height
        );
    }

    draw() {
        window.setTimeout(() =>
            window.requestAnimationFrame(this.draw.bind(this)), FRAME_RATE);
        this.show();
    }

    resetGame() {
        this.snake = new Snake();
        this.score = 0;
        this.food.pickLocation(this.snake);
    }
}

window.addEventListener('load', () => new App(), false);





