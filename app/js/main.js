class Food {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 10;
        this.height = 10;
        this.pickLocation();
    }

    pickLocation() {
        this.x = Math.floor(Math.random() * 20) * this.width;
        this.y = Math.floor(Math.random() * 20) * this.height;
    }
}

class Snake {
    constructor(app) {
        this.ctx = app.ctx;
        this.direction = 0; // 0 - LEFT 1 - RIGHT 2 - UP 3 - DOWN
        this.width = 20;
        this.height = 20;
        this.tail = [
            {x: 40, y: 40, width: this.width, height: this.height},
            {x: 60, y: 40, width: this.width, height: this.height},
            {x: 80, y: 40, width: this.width, height: this.height}
        ];
        this.food = new Food();
        console.log(this.food);
    }

    wallHack(index) {
        if (this.tail[index].x >= 600) {
            this.tail[index].x = 0;
        }
        if (this.tail[index].y >= 600) {
            this.tail[index].y = 0;
        }
        if (this.tail[index].x <= 0) {
            this.tail[index].x = 600;
        }
        if (this.tail[index].y <= 0) {
            this.tail[index].y = 600;
        }
    }
    canibal(tail){
        this.tail.forEach(function (item) {
            if(this.colisionDetect(tail, item)){
                alert("Game over");
            }
        }.bind(this))
    }

    direct(lastBall) {
        switch (this.direction) {
            // 0 - LEFT; 1 - RIGHT; 2 - UP; 3 - DOWN
            case 0:
                this.tail.push({x: lastBall.x - this.width, y: lastBall.y, width: this.width, height: this.height});
                break
            case 1:
                this.tail.push({x: lastBall.x + this.width, y: lastBall.y, width: this.width, height: this.height});
                break
            case 2:
                this.tail.push({x: lastBall.x, y: lastBall.y - this.height, width: this.width, height: this.height});
                break
            case 3:
                this.tail.push({x: lastBall.x, y: lastBall.y + this.height, width: this.width, height: this.height});
                break
        }
    }

    colisionDetect(rect1, rect2) {

        if (rect1.x <= rect2.x + rect2.width && rect1.x + rect1.width >= rect2.x && rect1.y <= rect2.y + rect2.height && rect1.height + rect1.y >= rect2.y) {
            return true;
        } else {
            return false;
        }
    }

    update() {

        // this.x = this.x + this.speedX * this.app.scale;
        // this.y = this.y + this.speedY * this.app.scale;
        //
        // this.x = Math.max(Math.min(this.x, 600 - this.app.scale), 0);
        // this.y = Math.max(Math.min(this.y, 600 - this.app.scale), 0);
        //

        // console.log(this.tail[this.tail.length - 1], this.food);

        if(this.colisionDetect(this.tail[this.tail.length - 1], this.food)){
            this.food.pickLocation();
            this.insert();
        }
    }

    insert() {
        var lastBall = this.tail[this.tail.length - 1];
        this.direct(lastBall);
    }

    show() {
        this.ctx.clearRect(0, 0, 600, 600);
        this.ctx.beginPath();
        this.tail.shift();
        this.insert();
        this.ctx.fillStyle = "#000";

        this.tail.forEach(function (item, index) {
            this.ctx.fillRect(item.x, item.y, this.width - 1, this.height - 1);
            this.wallHack(index);
            this.canibal(this.tail[this.tail.length - 1]);
        }.bind(this));

        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.food.x, this.food.y, this.width, this.height);

    }
}
class App {
    constructor() {
        this.canvas = document.getElementById('playGround');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 10;
        this.snake = new Snake(this);
        this.init();
        this.start();
        this.assignEvent();
    }

    assignEvent() {
        window.addEventListener('keydown', this.keyHandler.bind(this), false);
    }

    keyHandler(e) {
        e.preventDefault();
        var code = e.keyCode;
        switch (code) {
            // 0 - LEFT; 1 - RIGHT; 2 - UP; 3 - DOWN
            case 37:
                this.snake.direction = 0;
                break; //Left key
            case 38:
                this.snake.direction = 2;
                break; //Up key
            case 39:
                this.snake.direction = 1;
                break; //Right key
            case 40:
                this.snake.direction = 3;
                break; //Down key
            default:
                break;
        }
    }

    init() {
        this.canvas.width = 600;
        this.canvas.height = 600;
    }

    start() {
        this.draw();
    }

    draw() {
        window.setTimeout(() => window.requestAnimationFrame(this.draw.bind(this)), 1000 / 10);
        this.snake.show();
        this.snake.update();
    }

    random(max) {
        return Math.floor(Math.random() * (max + 1));
    }
}

new App();


