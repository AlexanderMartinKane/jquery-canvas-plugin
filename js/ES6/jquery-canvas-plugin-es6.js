if ( window.jQuery ) {
  (function ( $ ) {

    $.fn.canvas = function(params) {

      class Canvas {

        constructor(options) {

          this.options = options;

          this.color      = this.options.color;
          this.backColor  = this.options.backColor;
          this.lineWidth  = this.options.lineWidth;
          this.scroll     = this.options.scroll;
          this.grid       = this.options.grid;
          this.gridColor  = this.options.gridColor;
          this.reflection = this.options.reflection;
          this.rotation   = this.options.rotation;

          this.points  = [];
          this.pointsX = [];
          this.pointsY = [];

          this.paint;
          this.timerId;

          this.canvas = $('<canvas>').css('cursor', 'pointer');

          this.rotation ? this.canvas = this.canvas.css('border-radius', '50%')[0] : this.canvas = this.canvas[0];
            
          this.context  = this.canvas.getContext("2d");
          
          this.canvas.width  = this.options.width;
          this.canvas.height = this.options.height;

          this.canvas.onmousedown = (event) => {
            this.paint = true;

            let pos = this.getMousePos(event);

            this.createPoint(pos.x, pos.y, false);
            this.draw();
          }

          this.canvas.onmousemove = (event) => {
            if (this.paint) {
              let pos = this.getMousePos(event);

              this.createPoint(pos.x, pos.y, true);
              this.draw();
            }
          }

          this.canvas.onmouseup = () => this.paint = false;

          this.canvas.onmouseleave = () => this.paint = false;

          this.canvas.onmousewheel = (event) => {

            if (this.scroll) {

              if (event.wheelDelta === +120) {
                this.lineWidth += 1;
                this.update();
              } else if (event.wheelDelta === -120) {
                this.lineWidth -= 1;
                this.update();
              }
              
            }

          }

        }
      
        createBackground() {
          this.context.beginPath();
          this.context.rect(0, 0, this.canvas.width, this.canvas.height);
          this.context.fillStyle = this.backColor;
          this.context.fill();
          this.context.closePath();

          if (this.grid) this.createGrid();
        }

        createGrid() {

          for (var i = 0; i < 360; i += 15) {
            this.context.save();

            this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.context.rotate(i * Math.PI / 180);
            this.context.translate( -(this.canvas.width / 2), -(this.canvas.height / 2) );

            this.context.beginPath();
            this.context.moveTo(this.canvas.width / 2, this.canvas.height / 2);
            this.context.lineTo( this.canvas.width / 2, -(this.canvas.height / 2) );
            this.context.strokeStyle = this.gridColor;
            this.context.stroke();
            this.context.closePath();

            this.context.restore();
          }

        }

        connect() {
          this.context.strokeStyle = this.color;
          this.context.lineJoin    = "round";
          this.context.lineWidth   = this.lineWidth;

          // points.forEach()

          for (let i = 0; i < this.points.length; i++) {     
            this.context.beginPath();

            if (this.points[ i ] && i) {
              this.context.moveTo(this.pointsX[ i - 1 ], this.pointsY[ i - 1 ]);
            } else {
              this.context.moveTo(this.pointsX[ i ] - 1, this.pointsY[ i ]);
            }

            this.context.lineTo(this.pointsX[ i ], this.pointsY[ i ]);
            this.context.stroke();
            this.context.closePath();
          }

        }

        reflect() {
          this.context.save();
          this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
          this.context.scale(-1, 1);
          this.context.translate( -(this.canvas.width / 2), -(this.canvas.height / 2) );
          
          this.connect();

          this.context.restore();
        }

        draw() {

          for (let i = 0; i < 360; i += 30) {
            this.context.save();
            this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.context.rotate(i * Math.PI / 180);
            this.context.translate( -(this.canvas.width / 2), -(this.canvas.height / 2) );

            this.connect();
            if (this.reflection) this.reflect();
            
            this.context.restore();
          }
         
        }

        rotate(grades) {
          this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
          this.context.rotate(Math.PI / grades);
          this.context.translate( -(this.canvas.width / 2), -(this.canvas.height / 2) );
        }

        clear() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

          this.points  = [];
          this.pointsX = [];
          this.pointsY = [];
        }

        update(value) {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

          if (value === 'clear' || value === 'reset') {
            this.points  = [];
            this.pointsX = [];
            this.pointsY = [];
          } 

          if (value === 'reset') {
            this.color         = this.options.color;
            this.backColor     = this.options.backColor;
            this.lineWidth     = this.options.lineWidth;
            this.scroll        = this.options.scroll;
            this.grid          = this.options.grid;
            this.gridColor     = this.options.gridColor;
            this.reflection    = this.options.reflection;
            this.rotation      = this.options.rotation;

            $(id).find("input[name='color']").val(this.color);
            $(id).find("input[name='backColor']").val(this.backColor);
            $(id).find("input[name='grid']").prop('checked', this.grid);
            $(id).find("input[name='gridColor']").val(this.gridColor);
            $(id).find("input[name='reflection']").prop('checked', this.reflection);
            $(id).find("input[name='rotateAndDraw']").prop('checked', false);
            $(id).find("input[name='drawAndRotate']").prop('checked', false);
          }

          this.createBackground();

          if (value === undefined) {
            this.draw();        
          }

        }

        createPoint(x, y, value) {
          this.pointsX.push(x);
          this.pointsY.push(y);
          this.points.push(value);
        }

        getMousePos(event) {
          let rect = this.canvas.getBoundingClientRect();

          return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          };
        }

      }

      const id = "#" + $(this).attr('id');

      const defaults = {
        width: 600,
        height: 600,
        lineWidth: 1,
        scroll: false,
        color: '#000000',
        backColor: '#ffffff',
        grid: false,
        gridColor: "#ffffff",
        reflection: true,
        rotation: false
      };

      const canvasApp = new Canvas( $.extend({}, defaults, params) );

      $(id).append(canvasApp.canvas);

      const colorsDiv  = $('<div>');

      const colorLabel = $('<label>').attr('for', 'color').text('Color').appendTo(colorsDiv);
      const colorInput = $('<input>').attr({
       'type': 'color',
       'name': 'color',
       'value': canvasApp.color 
      }).on('input change', function(){
        canvasApp.color = $(this).val();
        canvasApp.update();
      }).appendTo(colorsDiv);

      const backColorLabel = $('<label>').attr('for', 'backColor').text('Background color').appendTo(colorsDiv);
      const backColorInput = $('<input>').attr({
        'type': 'color',
        'name': 'backColor',
        'value': canvasApp.backColor
      }).on('input change', function(){
        canvasApp.backColor = $(this).val();
        canvasApp.update();
      }).appendTo(colorsDiv);

      const gridColorLabel = $('<label>').attr('for', 'gridColor').text('Grid color').appendTo(colorsDiv);
      const gridColorInput = $('<input>').attr({
        'type': 'color',
        'name': 'gridColor',
        'value': canvasApp.gridColor
      }).on('input change', function(){
        canvasApp.gridColor = $(this).val();
        canvasApp.update();
      }).appendTo(colorsDiv);

      $(id).append(colorsDiv);

      const checkboxDiv = $('<div>');

      const gridLabel = $('<label>').attr('for', 'grid').text('Grid').appendTo(checkboxDiv);
      const gridInput = $('<input>').attr({
        'type': 'checkbox',
        'name': 'grid',
        'id': 'grid'
      }).prop('checked', canvasApp.grid).change(function(){
        this.checked ? canvasApp.grid = true : canvasApp.grid = false;
        canvasApp.update();
      }).appendTo(checkboxDiv);

      const reflectionLabel = $('<label>').attr('for', 'reflection').text('Reflection').appendTo(checkboxDiv);
      const reflectionInput = $('<input>').attr({
        'type': 'checkbox',
        'name': 'reflection',
        'id'  : 'reflection'
      }).prop('checked', canvasApp.reflection).change(function(){
        this.checked ? canvasApp.reflection = true : canvasApp.reflection = false;
        canvasApp.update();
      }).appendTo(checkboxDiv);

      const rotateAndDrawLabel = $('<label>').attr('for', 'rotateAndDraw').text('Rotate and draw').appendTo(checkboxDiv);
      const rotateAndDrawInput = $('<input>').attr({
        'type': 'checkbox',
        'name': 'rotateAndDraw',
        'id'  : 'rotateAndDraw'
      }).prop('checked', false).change(function(){

        if (this.checked) {
          clearInterval(canvasApp.timerId);

          $(id).find("input[name='drawAndRotate']").prop('checked', false);

          canvasApp.timerId = setInterval(function(){
            canvasApp.rotate(1800);
            canvasApp.update();
          }, 10);
        } else {
          clearInterval(canvasApp.timerId);
        }

      }).appendTo(checkboxDiv);

      const drawAndRotateLabel = $('<label>').attr('for', 'drawAndRotate').text('Draw and rotate').appendTo(checkboxDiv);
      const drawAndRotateInput = $('<input>').attr({
        'type': 'checkbox',
        'name': 'drawAndRotate',
        'id'  : 'drawAndRotate'
      }).prop('checked', false).change(function(){

        if (this.checked) {
          clearInterval(canvasApp.timerId);

          $(id).find("input[name='rotateAndDraw']").prop('checked', false);

          canvasApp.timerId = setInterval(function(){
            canvasApp.rotate(1200);
          }, 50);
        } else {
          clearInterval(canvasApp.timerId);
        }

      }).appendTo(checkboxDiv);

      $(id).append(checkboxDiv);

      const buttonsDiv = $('<div>');

      const resetBtn = $('<button>').text('Reset').click( () => {
        clearInterval(canvasApp.timerId);
        canvasApp.update('reset');
      }).appendTo(buttonsDiv);

      const clearBtn = $('<button>').text('Clear').click( () => {
        canvasApp.update('clear');
      }).appendTo(buttonsDiv);

      const linePlus = $('<button>').text('+').click( () => {
        canvasApp.lineWidth += 1;
        canvasApp.update();
      }).appendTo(buttonsDiv);

      const lineMinus = $('<button>').text('-').click( () => {
        canvasApp.lineWidth -= 1;
        canvasApp.update();
      }).appendTo(buttonsDiv);

      const saveBtn = $('<button>').text('Save').click( () => {
         window.open( canvasApp.canvas.toDataURL(),'_blank' );
      }).appendTo(buttonsDiv);

      $(id).append(buttonsDiv);

      if (!canvasApp.rotation) {
        rotateAndDrawLabel.hide();
        rotateAndDrawInput.hide();
        drawAndRotateLabel.hide();
        drawAndRotateInput.hide();
      }

      canvasApp.createBackground();

      return this;
    };

  })( window.jQuery );
} else {
  throw new Error('Canvas requires jQuery')
}