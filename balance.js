import Notification from './notification';

/**
 * Grid
 */
var Grid = {
  wrapper: $('.grid'),
  availableSpace: 266256,
  matrix: [
    [ 0, 0, 0, 0 ],
    [ 0, 0, 0, 0 ],
    [ 0, 0, 0, 0 ],
    [ 0, 0, 0, 0 ]
  ],

  /**
   * Build Shape and add it's DOM to Grid
   *
   * @param  shape   Shape object
   */
  addShape: function(shape) {
    if (!Grid.hasSpace(shape)) {
      return Notification.render({ type: 'error', msg: 'Not enough space' });
    }

    // find starting location for shape
    var coords = Grid.findLocationForShape(shape);
    if (coords) {
      Grid.drawShape(shape, coords);
    } else {
      return Notification.render({ type: 'error', msg: 'NO SPACE, try re-organizing?' });
    }

    // add offset relative to other shapes in grid
    shape.wrapper.css({
      top: shape.offset.y * 128 + 'px',
      left: shape.offset.x * 128 + 'px',
    });

    // add shape dom to grid
    this.wrapper.append(shape.wrapper);
    shape.enableDrag();
  },

  /**
   * Find space in Grid to fit the shape
   *
   * @param  shape        Shape object
   * @return false | coords   Return X,Y coords if shape can fit in Grid, otherwise false
   */
  findLocationForShape: function(shape) {
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 4; x++) {
        // attempt to draw shape at x, y
        if (Grid.willFitShape(shape, { x:x, y:y })) {
          return { x: x, y: y }
        }

        shape.offset.x++;
        if (x == 3) { shape.offset.x = 0; }
      }
      shape.offset.y++;
    }

    return false;
  },

  /**
   * Draw a shape in Grid's matrix
   *
   * @param shape     Shape object
   * @param coords    X,Y coords
   * @param flag      Optional flag to remove a shape (default: false)
   */
  drawShape: function(shape, coords, remove = false) {
    var x = coords.x
      , y = coords.y;

    shape.cells.forEach(function(item, index, obj) {
      var cell      = item.charAt(0)
        , direction = item.charAt(1);

      switch (Grid.matrix[y][x]) {
        case '1': if (cell === '3') { cell = '13'; } break;
        case '2': if (cell === '4') { cell = '24'; } break;
        case '3': if (cell === '1') { cell = '13'; } break;
        case '4': if (cell === '2') { cell = '24'; } break;
      }

      if (remove) {
        if (Grid.matrix[y][x].length == 2) {
          var first  = Grid.matrix[y][x].charAt(0)
            , second = Grid.matrix[y][x].charAt(1);

          Grid.matrix[y][x] = first == cell ? second : first;
        } else {
          Grid.matrix[y][x] = (cell === '0') ? Grid.matrix[y][x] : 0;
        }
      } else {
        Grid.matrix[y][x] = cell === '0' ? Grid.matrix[y][x] : cell;
      }

      switch (direction) {
        case '1': y--; break; // top
        case '2': x++; break; // right
        case '3': y++; break; // bottom
        case '4': x--; break; // left
      }
    });

    shape.coords = { x:coords.x, y:coords.y };

    // manage Grid's available space
    this.availableSpace = remove ? this.availableSpace + shape.area : this.availableSpace - shape.area;
  },

  /**
   * Check if cell can fit into matrix
   *
   * @param cell        Value to check (one of: [ 0, 1, 2, 3, 4, 5 ])
   * @param matrix_cell   Value of current matrix cell
   */
  willFit: function(cell, matrix_cell) {
    if (matrix_cell == 0) { return true; }

    switch (cell) {
      case '0': return true;
      case '1': if (matrix_cell == 3) { return true; } break;
      case '2': if (matrix_cell == 4) { return true; } break;
      case '3': if (matrix_cell == 1) { return true; } break;
      case '4': if (matrix_cell == 2) { return true; } break;
      default:
        return false;
    }

    return false;
  },

  /**
   * Check if whole shape will fit into matrix
   *
   * @param shape   Shape object
   * @param coords  X,Y coordiantes
   */
  willFitShape: function(shape, coords) {
    var x = coords.x
      , y = coords.y
      , result = true;

    shape.cells.forEach(function(item, index) {
      var cell = item.charAt(0)
        , direction = item.charAt(1);

      if (!result) { return false; }

      // check if shape is out of grid bounds
      if (y < 0 || y > 3 || x < 0 || x > 3) {
        return result = false;
      }

      // check if cell can physically fit into the matrix
      if (!Grid.willFit(cell, Grid.matrix[y][x])) {
        return result = false;
      }

      switch (direction) {
        case '1': y--; break; // top
        case '2': x++; break; // right
        case '3': y++; break; // bottom
        case '4': x--; break; // left
      }
    });

    return result;
  },

  /**
   * Check if Grid has enough available space for specified shape
   *
   * @param shape   Shape object
   */
  hasSpace: function(shape) {
    return this.availableSpace - shape.area >= 0 ? true : false;
  },
};

export default Grid;
