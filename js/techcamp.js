(function() { 
    //----------------------------------------------------------
 	// Define a Board
    var Board = function(width, height) {
        this.grid = new createjs.Shape();
        this.targets = [];
        this.characters = [];
        this.items = [];
        
        width = typeof width !== 'undefined' ? width : 800;
        height = typeof height !== 'undefined' ? height : 600;

        this.x = this.y = 0;
        this.width = width;
        this.height = height;

        this.grid.graphics.beginFill("grey").drawRect(0, 0, 800, 600, "grey");
        
        this.grid.graphics.setStrokeStyle(0.5);
        
        var numXLines = (this.width / Board.squareWidth);
        var numYLines = (this.height / Board.squareWidth);
        
        for (var i = 1; i < numXLines; i++){
            this.grid.graphics.beginStroke("white");
            this.grid.graphics.moveTo(Board.squareWidth*i, 0);
            this.grid.graphics.lineTo(Board.squareWidth*i, this.height);
        }
        
        for (var j = 1; j < numYLines; j++){
            this.grid.graphics.beginStroke("white");
            this.grid.graphics.moveTo(0, Board.squareWidth*j);
            this.grid.graphics.lineTo(this.width, Board.squareWidth*j);
        }
        
        this.addChild(this.grid);
        
        
    }
    
    Board.squareWidth = 50;
    
    Board.prototype = new createjs.Container();
    
    Board.prototype.clear = function() {
        
        for (i = 0; i < this.targets.length; i++) {
            this.removeChild(this.targets[i]);
        }
        
        for (i = 0; i < this.characters.length; i++) {
            this.removeChild(this.characters[i]);
        }
        
        for (i = 0; i < this.items.length; i++) {
            this.removeChild(this.items[i]);
        }

    }
    
    Board.prototype.setBoardConfiguration = function(config) {
        switch (config) {
            case 'a':
            case 'A':
                var numTargets = (this.height/Board.squareWidth)/4;
                
                for(var i = 1; i <= numTargets; i++) {
                    this.targets[i-1] = new Square();
                    this.targets[i-1].moveToSquare((4*i)+1,(4*i)+1);
                    this.addChild(this.targets[i-1]);
                }
                break;
        }
    }
    
    Board.prototype.addCharacter = function (characterObject){
        this.characters[this.characters.length] = characterObject;
        this.addChild(characterObject);
    }
    
    Board.prototype.add = function (itemObject) {
        this.items[this.items.length] = itemObject;
        this.addChild(itemObject);
    }
    
    
    window.Board = Board;
    
    //----------------------------------------------------------
 	// Define a BoardPiece
 	var BoardPiece = function() {
        this.initialize();
    }
    
    BoardPiece.prototype = new createjs.Shape();
    
    BoardPiece.prototype.moveToSquare = function (xSquare, ySquare) {     
        this.x = (Board.squareWidth*xSquare) - (Board.squareWidth/2);
        this.y = (Board.squareWidth*ySquare) - (Board.squareWidth/2);
        }
    
    BoardPiece.prototype.getCurrentSquare = function () {
    
        var pos = {
            xSquare: (this.x + (Board.squareWidth/2))/Board.squareWidth,
            ySquare: (this.y + (Board.squareWidth/2))/Board.squareWidth
        }
        
        return pos;
    }
    
    //----------------------------------------------------------
 	// Define a Square
    var Square = function(x, y, width, height, color) {
        x = typeof x !== 'undefined' ? x : 0;
        y = typeof y !== 'undefined' ? y : 0;
        width = typeof width !== 'undefined' ? width : Board.squareWidth;
        height = typeof height !== 'undefined' ? height : Board.squareWidth;
        color = typeof color !== 'undefined' ? color : "red";
        
        this.initialize();
        
        this.x = this.regX = Board.squareWidth/2;
        this.y = this.regY = Board.squareWidth/2;
        
        this.graphics.beginFill(color).drawRect(x, y, width, height, color);
    }

    Square.prototype = new BoardPiece();
    
    window.Square = Square;
    
    //----------------------------------------------------------
    // Define a Circle
    var Circle = function(x, y, radius , color) {
        x = typeof x !== 'undefined' ? x : 0;
        y = typeof y !== 'undefined' ? y : 0;
        radius = typeof radius !== 'undefined' ? radius : (Board.squareWidth/2);
        color = typeof color !== 'undefined' ? color : "blue";
        
        this.initialize();
        
        this.x = this.regX = Board.squareWidth/2;
        this.y = this.regY = Board.squareWidth/2;
        
        this.graphics.beginFill(color).drawCircle(this.x, this.y, radius);
        
        
    }

   	Circle.prototype = new BoardPiece();
    
    window.Circle = Circle;
    
    //----------------------------------------------------------
    // Define a Robot
    var Robot = function(x, y, width, height, color) {
        width = typeof width !== 'undefined' ? width : Board.squareWidth;
        height = typeof height !== 'undefined' ? height : Board.squareWidth;
        color = typeof color !== 'undefined' ? color : "red";
        
        this.initialize();
        this.graphics.beginFill(color).drawRect(0, 0, width, height, color);
        
        this.x = this.regX = width/2;
        this.y = this.regY = height/2;
        this.alpha = 0.8;
    }
    
    Robot.prototype = new BoardPiece();
    
    Robot.prototype.doTween = function(moveToX, moveToY, animationTime, callback) {
        createjs.Tween.get(this).to({x: moveToX, y: moveToY}, animationTime).call(handleComplete);
        
        function handleComplete(){
            if (typeof callback !== 'undefined') {
                callback();
            }

        }
    }

	Robot.prototype.move = function(numSteps, callback) {
        
        var xStep = Board.squareWidth;
        var yStep = Board.squareWidth;
        
        if (this.direction == "up") {
             xStep = 0;
             yStep *= -1;
        }
        else if (this.direction == "right") {
            yStep = 0;
        }
        else if (this.direction == "down") {
            xStep = 0;
        }
        else if (this.direction == "left") {
            xStep *= -1;
            yStep = 0;
        }
        
        
        var moveToX = this.x + (xStep * numSteps);
        var moveToY = this.y + (yStep * numSteps);
        var animationTime = 500 * (numSteps < 0 ? numSteps*-1 : numSteps);
        
        this.doTween(moveToX, moveToY, animationTime, callback)
    }
    
    Robot.prototype.right = function(numSteps, callback) {
        this.direction = "right";
        this.move(numSteps, callback);
    }
    
    Robot.prototype.left = function(numSteps, callback) {
        this.direction = "left";
        this.move(numSteps, callback);
    }
    
    Robot.prototype.up = function(numSteps, callback) {
        this.direction = "up";
        this.move(numSteps, callback);
    }
    
    Robot.prototype.down = function(numSteps, callback) {
        this.direction = "down";
        this.move(numSteps, callback);
    }
    
    Robot.prototype.turn = function(direction, callback) {
        this.rotation += (90 * direction);
        this.rotation = this.rotation < 0 ? 360 - this.rotation : this.rotation %= 360;
        
        if (typeof callback !== 'undefined') {
            callback();
        }
    }
    
    Robot.prototype.turnRight = function(callback) {
        
        if (arguments.length == 2) {
            // Ok I have been called from the takeSteps method
            this.turn(1, arguments[1]);
        }
        else {
            this.turn(1, callback);
        }
        
    }
    
    Robot.prototype.turnLeft = function(callback) {
        if (arguments.length == 2) {
            // Ok I have been called from the takeSteps method
            this.turn(-1, arguments[1]);
        }
        else {
            this.turn(-1, callback);
        }
    }
    
    Robot.prototype.eat = function(item, callback) {
        if (item.alpha > 0) {
            if ((item.x == this.x) && (item.y == this.y)) {
                item.alpha -= 0.1;

                if (item.alpha <= 0) {
                    this.parent.removeChild(item);
                }
            }
            else {
                this.alpha -= 0.1;
            }
        }
        else {
            this.alpha -= 0.1;
        }
        
    }
    
    Robot.prototype.takeSteps = function(steps, callback) {
        var numSteps = steps.length;
        var currentStep = 0;
        var theRobot = this;
        
        console.log("Taking " + numSteps + " steps");
        
        function runSteps() {
            console.log("Taking step " + currentStep);
            steps[currentStep].call(theRobot, 1, onComplete);
            
            function onComplete(){
                console.log("Step complete");
                currentStep++;

                if (currentStep < numSteps) {
                    runSteps()
                }
                else {
                    if (typeof callback !== 'undefined') {
                        callback();
                    }
                }
            
        	}
    	}
        
        runSteps();  
        
        
    }
    
     window.Robot = Robot;
    
    //----------------------------------------------------------
    // Define Roshan
    var Roshan = function(x, y, width, height, color) {
        width = typeof width !== 'undefined' ? width : 32;
        height = typeof height !== 'undefined' ? height : 48;
        color = typeof color !== 'undefined' ? color : "red";

        this.initialize();



        this.spritedata = {
            framerate: 20,
            images: ["imgs/roshan.png"],
            frames: {width:width, height:height, count:16},
            animations: {
                // start, end, next, speed
                down: [0,3, "down", 7],
                left: [4,7, "left", 7],
                right: [8,11, "right", 7],
                up: [12,15, "up", 7]
            }
        }

        this.spriteSheet = new createjs.SpriteSheet(this.spritedata);

        createjs.Sprite.call(this,this.spriteSheet);

        this.regX = width/2;
        this.regY = height/2;

        this.x = Board.squareWidth/2;
        this.y = Board.squareWidth/2;


        this.gotoAndStop(0);

    }

    // Inherit from createjs.Sprite
    Roshan.prototype = Object.create(createjs.Sprite.prototype);
    Roshan.prototype.constructor = Roshan;

    // Also take a copy of all the Robot methods (multiple inheritace)
    Roshan.prototype.moveToSquare = Robot.prototype.moveToSquare;
    Roshan.prototype.getCurrentSquare = Robot.prototype.getCurrentSquare;
    Roshan.prototype.doTween = Robot.prototype.doTween;
    Roshan.prototype.move = Robot.prototype.move;
    Roshan.prototype.right = Robot.prototype.right;
    Roshan.prototype.left = Robot.prototype.left;
    Roshan.prototype.up = Robot.prototype.up;
    Roshan.prototype.down = Robot.prototype.down;
    Roshan.prototype.turn = Robot.prototype.turn;
    Roshan.prototype.turnRight = Robot.prototype.turnRight;
    Roshan.prototype.turnLeft = Robot.prototype.turnLeft;
    Roshan.prototype.eat = Robot.prototype.eat;
    Roshan.prototype.takeSteps = Robot.prototype.takeSteps;

    // Methods
    Roshan.prototype.walkRight = function walkRight(steps, callback) {
        
        if (this.currentAnimation != null) return;
        
        steps = typeof steps !== 'undefined' ? steps : 1;
        var characterObject = this;
        characterObject.gotoAndPlay("right");
        characterObject.right(steps, function () {
            characterObject.gotoAndStop(0);
            
            if (typeof callback !== 'undefined') {
                callback();
            }
        });


    }

    Roshan.prototype.walkLeft = function walkLeft(steps, callback) {
        
        if (this.currentAnimation != null) return;
        
        steps = typeof steps !== 'undefined' ? steps : 1;
        var characterObject = this;
        characterObject.gotoAndPlay("left");
        characterObject.left(steps, allDone);

        function allDone() {
            characterObject.gotoAndStop(0);
            
            if (typeof callback !== 'undefined') {
                callback();
            }
        }
    }

    Roshan.prototype.walkUp = function walkUp(steps, callback) {
        
        if (this.currentAnimation != null) return;
        
        steps = typeof steps !== 'undefined' ? steps : 1;
        var characterObject = this;
        characterObject.gotoAndPlay("up");
        characterObject.up(steps, allDone);

        function allDone() {
            characterObject.gotoAndStop(0);
            
            if (typeof callback !== 'undefined') {
                callback();
            }
        }
    }

    Roshan.prototype.walkDown = function walkDown(steps, callback) {
        
        if (this.currentAnimation != null) return;
        
        var characterObject = this;
        steps = typeof steps !== 'undefined' ? steps : 1;
        characterObject.gotoAndPlay("down");
        characterObject.down(steps, allDone);

        function allDone() {
            characterObject.gotoAndStop(0);
            
            if (typeof callback !== 'undefined') {
                callback();
            }
        }
    }

    window.Roshan = Roshan;
   
}());

function init() {
    window.stage = new createjs.Stage("theCanvas");
    createjs.Ticker.addEventListener("tick", window.stage);
    window.board = new Board();
    window.stage.addChild(board); 
}

function logError(err) {
    document.getElementById("errorMessage").innerHTML = err.message;
    throw err;
}