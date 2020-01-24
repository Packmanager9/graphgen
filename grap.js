
window.addEventListener('DOMContentLoaded', (event) =>{




    let keysPressed = {};

document.addEventListener('keydown', (event) => {
   keysPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
 });


    let tutorial_canvas = document.getElementById("tutorial");


    let tutorial_canvas_context = tutorial_canvas.getContext('2d');

 //   tutorial_canvas_context.scale(.1, .1);  // this scales the canvas
    tutorial_canvas.style.background = "#FFFFFF"


    class Graph{
        constructor(){
            this.bar1 = new Rectangle(0, tutorial_canvas.height-50, 2, 1000, "black")
            this.bar2 = new Rectangle(50, 0, 1000, 2, "black")
            this.units = []
            this.prices = []
        }
        draw(){
            this.bar1.draw()
            this.bar2.draw()
            for(let q = 0 ; q < this.units.length; q++){
                this.units[q].draw()
            }
        }
        push(price){
            this.prices.push(price)
            let total = 0
            this.proportions = []
            for(let q = 0 ; q < this.prices.length; q++){  
                total += this.prices[q]
            }
            for(let q = 0 ; q < this.prices.length; q++){  
               this.proportions.push(((tutorial_canvas.height-5)/2)*(this.prices[q]/total))
            }
            this.proportions.sort((a, b) => (a > b) ? 1 : -1 )
            let startx = 52
            let starty = (tutorial_canvas.height-50)
            let newunits = []
            for(let q = 0 ; q < this.proportions.length; q++){  
              let box = new Rectangle(startx, starty-(2*this.proportions[q]),  (2*this.proportions[q]), 50,  getRandomLightColor())
              startx += 60
              newunits.push(box)
             }
             this.units = [...newunits]
             console.log(this)
        }
    }



    // can be drawn, or moved.
    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){

            this.x+=this.xmom
            this.y+=this.ymom

        }
    }

    // can be drawn, or moved with friction.  and richochet 
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 1

            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
           tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){

            this.xmom*=.9999
            this.ymom*=.9999   //friction

            this.x += this.xmom
            this.y += this.ymom

            if(this.x+this.radius > tutorial_canvas.width){

                if(this.xmom > 0){
                this.xmom *= -1
                }

            }
            if(this.y+this.radius > tutorial_canvas.height){
                if(this.ymom > 0){
                this.ymom *= -1
                }

            }
            if(this.x-this.radius < 0){
                if(this.xmom < 0){
                    this.xmom *= -1
                }

            }
            if(this.y-this.radius < 0){

                if(this.ymom < 0){
                    this.ymom *= -1
                }
        
            }

            // ^ this reflects balls off the wall
            // the internal checks make it always return to the screen

        }


    }

    // let x = 0
    // let y = 0

     let circ = new Circle(125, 200, 10, getRandomLightColor(), Math.random()-.5, Math.random()-.5)  // starts with ramndom velocities and color
     let rect = new Rectangle ( 200, 200, 50, 80, getRandomLightColor())
    // rect.ymom = 1

    // example objects

    let graph1 = new Graph()

    graph1.push(10)

    graph1.push(20)

    graph1.push(30)

    graph1.push(15)

// interval, fill this with game logic 
    window.setInterval(function(){ 
        tutorial_canvas_context.clearRect(0, 0, tutorial_canvas.width, tutorial_canvas.height)  // refreshes the image

        graph1.draw()

    }, 1) // length of refresh interval


const rectx = tutorial_canvas.getBoundingClientRect();

// Add the event listeners for mousedown, mousemove, and mouseup


tutorial_canvas.addEventListener('mousedown', e => {
    x = e.clientX - rectx.left;
    y = e.clientY - rectx.top;
    graph1.push(x)
});






    // run on any object with x/y attributes in the timer to give them wasd controls
    function players(racer){
        if (keysPressed['w']) {
                racer.y -= .7
        }
        if (keysPressed['a']) {
            racer.x -= .7
        }
        if (keysPressed['s']) {
            racer.y += .7
        }
        if (keysPressed['d']) {
            racer.x += .7
        }
        if (keysPressed['f']) {
        }


        // any key combination can be made from a nested if statement, all keys can just be accessed by name (if you can find it)

    }





// can check if one circle contains the cneter of the other circle, and / or it can check if any constructed object with an x and y attribute is inside of a circle. With tinkering, this can check boundaries of two circles.
function intersects(circle, left) {
    var areaX = left.x - circle.x;
    var areaY = left.y - circle.y;
    return areaX * areaX + areaY * areaY <= circle.radius * circle.radius;
}

// random color that will be visible on  blac backgroung
function getRandomLightColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[(Math.floor(Math.random() * 15)+1)];
    }
    return color;
  }


// checks if a square contains the centerpoint of a circle
function squarecircle(square, circle){

    let squareendh = square.y + square.height
    let squareendw = square.x + square.width

    if(square.x <= circle.x){
        if(square.y <= circle.y){
            if(squareendw >= circle.x){
                if(squareendh >= circle.y){
                    return true
                }
            }
        }
    }
    return false
}

// checks if two squares are intersecting ( not touching, for touching cnange the evaluations from ">" to ">=" etc)
function squaresquare(a, b){

    a.left = a.x
    b.left = b.x
    a.right = a.x + a.width
    b.right = b.x + b.width
    a.top = a.y 
    b.top = b.y
    a.bottom = a.y + a.height
    b.bottom = b.y + b.height



    if (a.left > b.right || a.top > b.bottom || 
        a.right < b.left || a.bottom < b.top)
    {
       return false
    }
    else
    {
        return true
    }
}





})