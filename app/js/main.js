class Snake{
    constructor(){
        this.name = "Snake";
        this.getName();
    }

    getName(){
        return this.name;
    }
}
 class App {
    constructor(){
        this.canvas = document.getElementById('playGround');
        this.ctx = this.canvas.getContext('2d');
        this.snake = new Snake();
        this.init();
        this.start();
    }

    init(){
        this.canvas.width = 600;
        this.canvas.height = 600;
    }

    start(){
        this.ctx.fillStyle = "rgb(200,0,0)";
        this.ctx.fillRect (10, 10, 50, 50);

        this.ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        this.ctx.fillRect (30, 30, 50, 50);
        console.log(this.snake.getName());
    }
 }

 new App();


