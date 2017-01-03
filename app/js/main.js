class Food {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 10;
        this.height = 10;
    }

    pickLocation(snake) {
        this.x = Math.floor(Math.random() * 31) * this.width;
        this.y = Math.floor(Math.random() * 31) * this.height;

        snake.tail.forEach(function (item) {
            if(snake.colisionDetect(item, this)){
                this.pickLocation(snake);
            }
        }.bind(this));

        while(this.x > 580){
            this.x = Math.floor(Math.random() * 31) * this.width;
        }
        while(this.y > 580){
            this.y = Math.floor(Math.random() * 31) * this.height;
        }
    }
}

class Snake {
    constructor() {
        this.direction = 1; // 0 - LEFT 1 - RIGHT 2 - UP 3 - DOWN
        this.width = 10;
        this.height = 10;
        this.tail = [
            {x: 0, y: 40, width: this.width, height: this.height},
            {x: 20, y: 40, width: this.width, height: this.height},
            {x: 40, y: 40, width: this.width, height: this.height}
        ];
        this.food = new Food();
        this.food.pickLocation(this);
    }

    wallHack(item) {
        this.last = this.tail[this.tail.length - 1];
        if (item.x > 600) {
            item.x = 0;
        }
        if (item.y > 600) {
            item.y = 0;
        }
        if (item.x < 0) {
            item.x = 600;
        }
        if (item.y < 0) {
            item.y = 600;
        }
    }

    collisionWall(item){
        if(item.x > 600 || item.y > 600 || item.x < 0 || item.y < 0){
            return true;
        }else{
            return false;
        }

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
            default:
                break;
        }
    }

    colisionDetect(rect1, rect2) {

        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y) {
            return true;
        } else {
            return false;
        }
    }

    insert() {
        let lastBall = this.tail[this.tail.length - 1];
        this.direct(lastBall);
    }
}
class App {
    constructor() {
        this.canvas = document.getElementById('playGround');
        this.ctx = this.canvas.getContext('2d');
        this.frameRate = 10;
        this.score = 0;
        this.snake = new Snake();
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.draw();
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
                if(this.snake.direction !== 1){
                    this.snake.direction = 0;
                }
                break; //Left key
            case 38:
                if (this.snake.direction !== 3){
                    this.snake.direction = 2;
                }
                break; //Up key
            case 39:
                if(this.snake.direction !== 0){
                    this.snake.direction = 1;
                }
                break; //Right key
            case 40:
                if(this.snake.direction !== 2){
                    this.snake.direction = 3;
                }
                break; //Down key
            default:
                break;
        }
    }

    update(last){
        this.ctx.fillStyle = "#000"
        this.snake.tail.forEach(function (item, index) {
            if(index === this.snake.tail.length - 1){
                //HEAD
                this.ctx.fillStyle = "green"
            }else{
                //BODY
                this.ctx.fillStyle = "#000"
            }
            this.ctx.fillRect(item.x, item.y, this.snake.width, this.snake.height);

            if(this.snake.colisionDetect(last, this.snake.food)){
                this.score++;
                this.snake.insert();
                this.snake.food.pickLocation(this.snake);
            }

            // this.snake.wallHack(item);

            //Collision wall or "canibal snake"
            if(item.x == this.last.x && item.y == this.last.y && index < this.snake.tail.length - 2 || this.snake.collisionWall(item)){
                //Game over
                alert("Gameover! Twój wynik to: " + this.score + " PTK" );
                //New Game
                this.score = 0;
                this.snake = new Snake();
            }
        }.bind(this));
    }

    show(){
        this.snake.insert();

        this.snake.tail.shift();

        this.ctx.clearRect(0, 0, 600, 600);
        this.ctx.beginPath();

        this.last = this.snake.tail[this.snake.tail.length - 1];
        this.update(this.last);

        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.snake.food.x, this.snake.food.y, this.snake.food.width, this.snake.food.height);
    }

    draw() {
        window.setTimeout(() => window.requestAnimationFrame(this.draw.bind(this)), 1000 / this.frameRate);
        this.show();
    }
}

new App();


