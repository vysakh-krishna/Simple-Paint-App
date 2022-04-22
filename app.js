'use strict';

window.addEventListener("load", function () {
  const canvas = document.getElementById('canva');
  const clearboard=document.getElementById('clearbutton');
  const undo = document.getElementById('undobutton');

  // will make sure canvas is available
  if(canvas.getContext){
    canvas.height=450;
    canvas.width=900;
    let ctx = canvas.getContext('2d');

    // stores the triangles that are drawn.
    let shapes = [];

    // to ensure drawing has started
    let drawing = false;

    // to ensure drawing has finished
    let finishTriangle = false;

    // coordinated of triangle.
    let aX = 0;
    let aY = 0;
    let bX = 0;
    let bY = 0;
    let cX = 0;
    let cY = 0;

    let backgroundColor = null;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", drawingTriangle);
    canvas.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("dblclick",deleteTriangle);
    undo.addEventListener("click", undoLastMove);
    clearboard.addEventListener("click",clear);

    // to generate different backgroundColor
    function randomColor() {

      let randomColor = Math.floor(Math.random()*16777215).toString(16);
      return randomColor;

    }

    // check if the point is in the triangle and remove triangle, if it is.
    function deleteTriangle(e) {
      let x= e.clientX - canvas.getBoundingClientRect().left;
      let y= e.clientY - canvas.getBoundingClientRect().top;
      for (let i = 0; i < shapes.length ; i++) {
        if (isInside(x, y, shapes[i].aX, shapes[i].aY, shapes[i].bX, shapes[i].bY, shapes[i].cX, shapes[i].cY)) {
          shapes.splice(i,1);
          rerender();
          break;
        }
      }
    }

    // calculates the area of the triangle with provided coordinates
    function area(x1, y1, x2, y2, x3, y3){
      return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
    }

    // A function to check whether point P(x, y) lies inside the triangle formed by A(x, y), B(x, y) and C(x, y).
    function isInside(x,y,aX,aY,bX,bY,cX,cY) {

      let A = area (aX, aY, bX, bY, cX, cY);

      let A1 = area (x, y, bX, bY, cX, cY);

      let A2 = area (aX, aY, x, y, cX, cY);

      let A3 = area (aX, aY, bX, bY, x, y);

      // if point lies inside the triangle, then A1 + A2 + A3 must be equal to A
      return (A == A1 + A2 + A3);

    }

    // on mouse down it will capture the mouse position related to the board.
    function startDrawing(e) {

      drawing=true;
      backgroundColor = '#'+randomColor();
      aX= e.clientX - canvas.getBoundingClientRect().left;
      aY= e.clientY - canvas.getBoundingClientRect().top;

    }

    // on mouse move and if drawing is enabled it will capture the mouse position related to the board
    // and start drawing.
    function drawingTriangle(e) {

      if(drawing){
        bX= parseInt(e.clientX - canvas.getBoundingClientRect().left);
        bY= parseInt(e.clientY - canvas.getBoundingClientRect().top);
        cY=bY;
        let temp=bX-aX;
        cX=bX-(2*temp);
        rerender();
        ctx.beginPath();
        ctx.fillStyle = backgroundColor;
        ctx.moveTo(aX, aY); 
        ctx.lineTo(bX, bY); 
        ctx.lineTo(cX, cY); 
        ctx.closePath(); 
        ctx.fill();
        finishTriangle=true;
      }
      
    }

    // to erase the unwanted drawings from the board and redraw the ones that have been drawn before.
    function rerender() {
      ctx.clearRect(0, 0, ctx.canvas.width,canvas.height);
      for (let i = 0; i < shapes.length; i++) {
        let triangle = shapes[i];
        ctx.beginPath();
        ctx.fillStyle=triangle.backgroundColor;
        ctx.moveTo(triangle.aX,triangle.aY);
        ctx.lineTo(triangle.bX,triangle.bY);
        ctx.lineTo(triangle.cX,triangle.cY);
        ctx.closePath();
        ctx.fill();        
      }      
    }

    // get the end position of the triangle and push the coordinates to the shapes [].
    function endDrawing() {
      drawing=false;
      if(finishTriangle){
        let triangle={
          aX:aX,
          aY:aY,
          bX:bX,
          bY:bY,
          cX:cX,
          cY:cY,
          backgroundColor:backgroundColor,
        }
        shapes.push(triangle);
      }
      finishTriangle=false;
    }

    // clear the board and empty the shapes[]
    function clear() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes=[];
    }

    // remove the last element of the shapes[] and redraw the other triangles
    function undoLastMove() {
      shapes.pop();
      rerender();
    }

  }
  // if canvas not supported, gives an alert. 
  else{
    alert('Your system does not support this feature');
  }
})

