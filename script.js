window.onload = function() {
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30
    let ctx;
    let delay = 100;
    let snakee;
    let applee;
    let widthInBlocks = canvasWidth / blockSize;
    let heightInBlocks = canvasHeight / blockSize;

    init();

    function init() {
        let canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.display = "block"; // Pour centrer le canvas sur la page
        canvas.style.margin = "auto";   // 
        canvas.style.border = "30px solid gray";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4], [5,4], [4,4]], "right");
        applee = new Apple([10,10]);
        refreshCanvas();
    }

    function refreshCanvas() {
        snakee.advance();
        if(snakee.checkCollision()) {
            gameOver();
        } else {
            if(snakee.isEatingApple(applee)) {
                snakee.ateApple = true;
                do {
                    applee.setNewPosition(); 
                } while(applee.isOnSnake(snakee));
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            snakee.draw();
            applee.draw();
            setTimeout(refreshCanvas, delay);    
        }
    }

    function gameOver() {
        ctx.save();
        ctx.fillText("Game Over", 5, 15);
        ctx.restore();
    }

    function drawBlock(ctx, position) {
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
        ctx.fillStyle = "yellow"; // Couleur du corps du serpent
    }
    
    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";  // Couleur de la tête du serpent
            body.forEach(position => {
                drawBlock(ctx, position);
            });
            ctx.restore();
        }
        this.advance = function() {
            let nextPosition = this.body[0].slice();
            switch(this.direction) {
                case "left" : 
                    nextPosition[0]--;
                    break;
                case "right" : 
                    nextPosition[0]++;
                    break;
                case "down" :
                    nextPosition[1]++;
                    break;
                case "up" :
                    nextPosition[1]--;
                    break;
                default: 
                    throw('Invalid Direction')
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple) {
                this.body.pop(); 
            } else {
                this.ateApple = false;
            }
        }
        this.setDirection = function(newDirection) {
            let allowedDirections;
            switch(this.direction) {
                case "left" : 
                case "right" : 
                    allowedDirections = ["up", "down"];
                    break;
                case "down" :
                case "up" :
                    allowedDirections = ["left", "right"];
                    break;
                default: 
                    throw('Invalid Direction')
            }
            if(allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        }
        this.checkCollision = function() {
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];
            let rest = this.body.slice(1);
            let snakeX = head[0];
            let snakeY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks - 1;
            let maxY = heightInBlocks - 1;
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; 
            let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY; 
            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true;
            }
            rest.forEach(element => {
                if(snakeX === element[0] && snakeY === element[1]) {
                    snakeCollision = true;
                }
            });
            return wallCollision || snakeCollision
        }
        this.isEatingApple = function(appleToEat) {
            let head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                return true;
            } else {
                return false;
            }
        }
    }  
    
    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            let radius = blockSize / 2;
            let x = this.position[0] * blockSize + radius;
            let y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        }
        this.setNewPosition = function() {
            let newX = Math.round(Math.random() * (widthInBlocks - 1));
            let newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        }
        this.isOnSnake = function(snakeToCheck) {
            let isOnSnake = false;
            snakeToCheck.body.forEach(element => {
               if(this.position[0] === element[0] && this.position[1] === element[1]) {
                    isOnSnake = true;
                }
            });
            return isOnSnake; 
        }
    }

    document.onkeydown = function handleKeyDown(event) {
        let key = event.keyCode;
        let newDirection;
        switch(key) {
            case 37 :
                newDirection = "left";
                break;
            case 38 :
                newDirection = "up";
                break;
            case 39 :
                newDirection = "right";
                break;
            case 40 :
                newDirection = "down";
                break;
            default: 
                return
        }
        snakee.setDirection(newDirection);
    }
}
  
