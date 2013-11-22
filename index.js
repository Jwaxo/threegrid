module.exports = function(grid) {
    //'grid' must be a sequentially-keyed array of sequentially-keyed arrays
    //  that correspond to some sort of grid. So grid[3][4] refers to a
    //  gridpoint that is three to the right and four below the top-left of
    //  the rendering field, viewed from the top-down.

    require('three'); //Assigns the renderer to THREE automatically
    
    //The following lookup list is used to define similar shapes (IE, shapes that
    //rotate to equal each other. It assumes the corners check, and 'rotates'
    //indicates how many clockwise rotations it takes to get to the original
    this.shapeLookup = {
        '4' : {
            'original' : 1,
            'rotates' : 3
        },
        '8' : {
            'original' : 1,
            'rotates' : 2
        },
        '64' : {
            'original' : 1,
            'rotates' : 1
        },
        '68' : {
            'original' : 17,
            'rotates' : 2
        },
        '69' : {
            'original' : 21,
            'rotates' : 1
        },
        '71' : {
            'original' : 29,
            'rotates' : 1
        },
        '84' : {
            'original' : 21,
            'rotates' : 3
        },
        '87' : {
            'original' : 53,
            'rotates' : 2
        },
        '93' : {
            'original' : 53,
            'rotates' : 1
        },
        '116' : {
            'original' : 29,
            'rotates' : 3
        },
        '124' : {
            'original' : 31,
            'rotates' : 3
        },
        '125' : {
            'original' : 95,
            'rotates' : 3
        },
        '162' : {
            'original' : 21,
            'rotates' : 2
        },
        '199' : {
            'original' : 31,
            'rotates' : 1
        },
        '209' : {
            'original' : 29,
            'rotates' : 2
        },
        '213' : {
            'original' : 53,
            'rotates' : 3
        },
        '215' : {
            'original' : 95,
            'rotates' : 1
        },
        '223' : {
            'original' : 127,
            'rotates' : 1
        },
        '241' : {
            'original' : 31,
            'rotates' : 2
        },
        '245' : {
            'original' : 95,
            'rotates' : 2
        },
        '247' : {
            'original' : 127,
            'rotates' : 2
        },
        '253' : {
            'original' : 127,
            'rotates' : 3
        }
    };

    this.renderGrid = function(config) {
        //'config' has a number of optional parameters, which include:
        //  scale - value to multiply the standard three scale by
        //  type - designates the field in gridpoints that states similar types
        //  asset_location - if a gridpoint has a folder assigned to its type,
        //      where to look. Requires the fs module to be installed.
        
        this.grid = grid; //We use it in virtually every function, so assign it.
    
        var map = {};
        var thisShape = 0;
        
        for (var x=0;x<grid.length;x++) {
            
            for (var y=0;y<grid[x].length;y++) {
                
                grid[x][y].shape = this.findShape(x,y, false);
                
            }
            
        }
    
        return map;
    }
    
    this.findShape = function(x,y,checkCorners) {
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
        var cornersRef = [6,4,2,0]; //These ones are in the corners
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
        
        //Now we look through our submitted grid and mark which tiles around
        //each tile have the same parent, are a parent of, or are a child of
        for (var i=0;i<8;i++) {
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
                binaryArray.push(1);
            } else {
                binaryArray.push(0);
            }
        }
        
        //If the option is marked, we can eliminate corner pieces that also
        //don't have siblings around them, as this means they won't be touching
        //our "center" tiles 
        if (checkCorners === true) {
            for (var i=0;i<8;i++) {
                if (binaryArray[i] === 1
                    && cornersRef.indexOf(i) > -1
                    && (binaryArray[(i+1)%8] === 0 || binaryArray[(i-1)%8] === 0)
                    ) {
                    binaryArray[i] = 0;
                }
            }
        }
        
        shape = binaryArray.reverse().join('');

        shape = parseInt(shape, 2);
        console.log ('Shape in integer for ' + x + ',' + y + ' is ' + shape);

        
        return shape;
    }
    
    return this;
}
