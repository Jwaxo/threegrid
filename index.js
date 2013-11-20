module.exports = function(grid) {
    //'grid' must be a sequentially-keyed array of sequentially-keyed arrays
    //  that correspond to some sort of grid. So grid[3][4] refers to a
    //  gridpoint that is three to the right and four below the top-left of
    //  the rendering field, viewed from the top-down.

    require('three'); //Assigns the renderer to THREE automatically

    this.renderGrid = function(config) {
        //'config' has a number of optional parameters, which include:
        //  scale - value to multiply the standard three scale by
        //  type - designates the field in gridpoints that states similar types
        //  asset_location - if a gridpoint has a folder assigned to its type,
        //      where to look. Requires the fs module to be installed.
        
        this.grid = grid; //We use it in virtually every function, so assign it.
    
        var map = {};
        var thisShape = 0;
        
        for (var i=0;i<grid.length;i++) {
            
            for (var j=0;j<grid[i].length;j++) {
                
                thisShape = this.findShape(i,j);
                
            }
            
        }
    
        return map;
    }
    
    this.findShape = function(x,y) {
        //Returns any of the 255* possible shapes that a tile might take given
        //its surrounding siblings. The number when converted to binary refers
        //to each of the eight surrounding tiles starting from the top-left and
        //moving clockwise:
        //1 2 3             0 1 1
        //8 X 4 = 87654321  1 X 0 = 10100110 = 166
        //7 6 5             0 1 0

        //*Actually an unknown lesser number, as if any corner point does not
        //have sibling gridpoints touching it, it turns itself off, because it
        //will not affect the shape of the center point, the one we care about.
        var shape = '';
        var binaryArray = [];
        //Because the grid is arranged in HTML-render order to ease my mind at
        //a later date, y is inverted from the traditional thinking--higher
        //numbers are lower down.
        var siblings = [
            {
                "x" : x-1,
                "y" : y-1
            }, //1
            {
                "x" : x,
                "y" : y-1
            }, //2
            {
                "x" : x+1,
                "y" : y-1
            }, //3
            {
                "x" : x+1,
                "y" : y
            }, //4
            {
                "x" : x+1,
                "y" : y+1
            }, //5
            {
                "x" : x,
                "y" : y+1
            }, //6
            {
                "x" : x-1,
                "y" : y+1
            }, //7
            {
                "x" : x-1,
                "y" : y
            } //8
        ];

        for (var i=7;i>=0;i--) {
            if (this.grid[siblings[i].x]
                && this.grid[siblings[i].x][siblings[i].y]
                && this.grid[siblings[i].x][siblings[i].y].hasOwnProperty('id')
                && (
                    (this.grid[x][y].hasOwnProperty('parentid')
                        && (this.grid[siblings[i].x][siblings[i].y].hasOwnProperty('parentid')
                            && this.grid[siblings[i].x][siblings[i].y].parentid
                                == this.grid[x][y].parentid
                            ) || this.grid[siblings[i].x][siblings[i].y].id
                                == this.grid[x][y].parentid
                        ) || (this.grid[siblings[i].x][siblings[i].y].hasOwnProperty('parentid')
                        && this.grid[siblings[i].x][siblings[i].y].parentid
                            == this.grid[x][y].id
                        )
                    )
                ) {
                shape = shape + '1';
            } else {
                shape = shape + '0';
            }
        }
        console.log ('Shape in binary for ' + x + ',' + y + ' is ' + shape);
        
        return shape;
    }
    
    return this;
}
