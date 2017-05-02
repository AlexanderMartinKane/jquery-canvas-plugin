'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (window.jQuery) {
  (function ($) {

    $.fn.canvas = function (params) {
      var Canvas = function () {
        function Canvas(options) {
          var _this = this;

          _classCallCheck(this, Canvas);

          this.options = options;

          this.color = this.options.color;
          this.backColor = this.options.backColor;
          this.lineWidth = this.options.lineWidth;
          this.scroll = this.options.scroll;
          this.grid = this.options.grid;
          this.gridColor = this.options.gridColor;
          this.reflection = this.options.reflection;
          this.rotation = this.options.rotation;

          this.points = [];
          this.pointsX = [];
          this.pointsY = [];

          this.paint;
          this.timerId;

          this.canvas = $('<canvas>').css('cursor', 'pointer');

          this.rotation ? this.canvas = this.canvas.css('border-radius', '50%')[0] : this.canvas = this.canvas[0];

          this.context = this.canvas.getContext("2d");

          this.canvas.width = this.options.width;
          this.canvas.height = this.options.height;

          this.canvas.onmousedown = function (event) {
            _this.paint = true;

            var pos = _this.getMousePos(event);

            _this.createPoint(pos.x, pos.y, false);
            _this.draw();
          };

          this.canvas.onmousemove = function (event) {
            if (_this.paint) {
              var pos = _this.getMousePos(event);

              _this.createPoint(pos.x, pos.y, true);
              _this.draw();
            }
          };

          this.canvas.onmouseup = function () {
            return _this.paint = false;
          };

          this.canvas.onmouseleave = function () {
            return _this.paint = false;
          };

          this.canvas.onmousewheel = function (event) {

            if (_this.scroll) {

              if (event.wheelDelta === +120) {
                _this.lineWidth += 1;
                _this.update();
              } else if (event.wheelDelta === -120) {
                _this.lineWidth -= 1;
                _this.update();
              }
            }
          };
        }

        _createClass(Canvas, [{
          key: 'createBackground',
          value: function createBackground() {
            this.context.beginPath();
            this.context.rect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = this.backColor;
            this.context.fill();
            this.context.closePath();

            if (this.grid) this.createGrid();
          }
        }, {
          key: 'createGrid',
          value: function createGrid() {

            for (var i = 0; i < 360; i += 15) {
              this.context.save();

              this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
              this.context.rotate(i * Math.PI / 180);
              this.context.translate(-(this.canvas.width / 2), -(this.canvas.height / 2));

              this.context.beginPath();
              this.context.moveTo(this.canvas.width / 2, this.canvas.height / 2);
              this.context.lineTo(this.canvas.width / 2, -(this.canvas.height / 2));
              this.context.strokeStyle = this.gridColor;
              this.context.stroke();
              this.context.closePath();

              this.context.restore();
            }
          }
        }, {
          key: 'connect',
          value: function connect() {
            this.context.strokeStyle = this.color;
            this.context.lineJoin = "round";
            this.context.lineWidth = this.lineWidth;

            // points.forEach()

            for (var i = 0; i < this.points.length; i++) {
              this.context.beginPath();

              if (this.points[i] && i) {
                this.context.moveTo(this.pointsX[i - 1], this.pointsY[i - 1]);
              } else {
                this.context.moveTo(this.pointsX[i] - 1, this.pointsY[i]);
              }

              this.context.lineTo(this.pointsX[i], this.pointsY[i]);
              this.context.stroke();
              this.context.closePath();
            }
          }
        }, {
          key: 'reflect',
          value: function reflect() {
            this.context.save();
            this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.context.scale(-1, 1);
            this.context.translate(-(this.canvas.width / 2), -(this.canvas.height / 2));

            this.connect();

            this.context.restore();
          }
        }, {
          key: 'draw',
          value: function draw() {

            for (var i = 0; i < 360; i += 30) {
              this.context.save();
              this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
              this.context.rotate(i * Math.PI / 180);
              this.context.translate(-(this.canvas.width / 2), -(this.canvas.height / 2));

              this.connect();
              if (this.reflection) this.reflect();

              this.context.restore();
            }
          }
        }, {
          key: 'rotate',
          value: function rotate(grades) {
            this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.context.rotate(Math.PI / grades);
            this.context.translate(-(this.canvas.width / 2), -(this.canvas.height / 2));
          }
        }, {
          key: 'clear',
          value: function clear() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.points = [];
            this.pointsX = [];
            this.pointsY = [];
          }
        }, {
          key: 'update',
          value: function update(value) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (value === 'clear' || value === 'reset') {
              this.points = [];
              this.pointsX = [];
              this.pointsY = [];
            }

            if (value === 'reset') {
              this.color = this.options.color;
              this.backColor = this.options.backColor;
              this.lineWidth = this.options.lineWidth;
              this.scroll = this.options.scroll;
              this.grid = this.options.grid;
              this.gridColor = this.options.gridColor;
              this.reflection = this.options.reflection;
              this.rotation = this.options.rotation;

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
        }, {
          key: 'createPoint',
          value: function createPoint(x, y, value) {
            this.pointsX.push(x);
            this.pointsY.push(y);
            this.points.push(value);
          }
        }, {
          key: 'getMousePos',
          value: function getMousePos(event) {
            var rect = this.canvas.getBoundingClientRect();

            return {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top
            };
          }
        }]);

        return Canvas;
      }();

      var id = "#" + $(this).attr('id');

      var defaults = {
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

      var canvasApp = new Canvas($.extend({}, defaults, params));

      $(id).append(canvasApp.canvas);

      var colorsDiv = $('<div>');

      var colorLabel = $('<label>').attr('for', 'color').text('Color').appendTo(colorsDiv);
      var colorInput = $('<input>').attr({
        'type': 'color',
        'name': 'color',
        'value': canvasApp.color
      }).on('input change', function () {
        canvasApp.color = $(this).val();
        canvasApp.update();
      }).appendTo(colorsDiv);

      var backColorLabel = $('<label>').attr('for', 'backColor').text('Background color').appendTo(colorsDiv);
      var backColorInput = $('<input>').attr({
        'type': 'color',
        'name': 'backColor',
        'value': canvasApp.backColor
      }).on('input change', function () {
        canvasApp.backColor = $(this).val();
        canvasApp.update();
      }).appendTo(colorsDiv);

      var gridColorLabel = $('<label>').attr('for', 'gridColor').text('Grid color').appendTo(colorsDiv);
      var gridColorInput = $('<input>').attr({
        'type': 'color',
        'name': 'gridColor',
        'value': canvasApp.gridColor
      }).on('input change', function () {
        canvasApp.gridColor = $(this).val();
        canvasApp.update();
      }).appendTo(colorsDiv);

      $(id).append(colorsDiv);

      var checkboxDiv = $('<div>');

      var gridLabel = $('<label>').attr('for', 'grid').text('Grid').appendTo(checkboxDiv);
      var gridInput = $('<input>').attr({
        'type': 'checkbox',
        'name': 'grid',
        'id': 'grid'
      }).prop('checked', canvasApp.grid).change(function () {
        this.checked ? canvasApp.grid = true : canvasApp.grid = false;
        canvasApp.update();
      }).appendTo(checkboxDiv);

      var reflectionLabel = $('<label>').attr('for', 'reflection').text('Reflection').appendTo(checkboxDiv);
      var reflectionInput = $('<input>').attr({
        'type': 'checkbox',
        'name': 'reflection',
        'id': 'reflection'
      }).prop('checked', canvasApp.reflection).change(function () {
        this.checked ? canvasApp.reflection = true : canvasApp.reflection = false;
        canvasApp.update();
      }).appendTo(checkboxDiv);

      var rotateAndDrawLabel = $('<label>').attr('for', 'rotateAndDraw').text('Rotate and draw').appendTo(checkboxDiv);
      var rotateAndDrawInput = $('<input>').attr({
        'type': 'checkbox',
        'name': 'rotateAndDraw',
        'id': 'rotateAndDraw'
      }).prop('checked', false).change(function () {

        if (this.checked) {
          clearInterval(canvasApp.timerId);

          $(id).find("input[name='drawAndRotate']").prop('checked', false);

          canvasApp.timerId = setInterval(function () {
            canvasApp.rotate(1800);
            canvasApp.update();
          }, 10);
        } else {
          clearInterval(canvasApp.timerId);
        }
      }).appendTo(checkboxDiv);

      var drawAndRotateLabel = $('<label>').attr('for', 'drawAndRotate').text('Draw and rotate').appendTo(checkboxDiv);
      var drawAndRotateInput = $('<input>').attr({
        'type': 'checkbox',
        'name': 'drawAndRotate',
        'id': 'drawAndRotate'
      }).prop('checked', false).change(function () {

        if (this.checked) {
          clearInterval(canvasApp.timerId);

          $(id).find("input[name='rotateAndDraw']").prop('checked', false);

          canvasApp.timerId = setInterval(function () {
            canvasApp.rotate(1200);
          }, 50);
        } else {
          clearInterval(canvasApp.timerId);
        }
      }).appendTo(checkboxDiv);

      $(id).append(checkboxDiv);

      var buttonsDiv = $('<div>');

      var resetBtn = $('<button>').text('Reset').click(function () {
        clearInterval(canvasApp.timerId);
        canvasApp.update('reset');
      }).appendTo(buttonsDiv);

      var clearBtn = $('<button>').text('Clear').click(function () {
        canvasApp.update('clear');
      }).appendTo(buttonsDiv);

      var linePlus = $('<button>').text('+').click(function () {
        canvasApp.lineWidth += 1;
        canvasApp.update();
      }).appendTo(buttonsDiv);

      var lineMinus = $('<button>').text('-').click(function () {
        canvasApp.lineWidth -= 1;
        canvasApp.update();
      }).appendTo(buttonsDiv);

      var saveBtn = $('<button>').text('Save').click(function () {
        window.open(canvasApp.canvas.toDataURL(), '_blank');
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
  })(window.jQuery);
} else {
  throw new Error('Canvas requires jQuery');
}