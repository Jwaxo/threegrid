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
            
            for (var j=0;i<grid[i].length;j++) {
                
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
        var shape = 0;
        
        return shape;
    }
    
    return this;
}
