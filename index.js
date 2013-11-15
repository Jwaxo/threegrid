module.exports = function() {

    require('three'); //Assigns the renderer to THREE automatically

    return function(grid, config) {
        //'grid' must be a sequentially-keyed array of sequentially-keyed arrays
        //  that correspond to some sort of grid. So grid[3][4] refers to a
        //  gridpoint that is three to the right and four below the top-left of
        //  the rendering field, viewed from the top-down.
        //'config' has a number of optional parameters, which include:
        //  scale - value to multiply the standard three scale by
        //  type - designates the field in gridpoints that states similar types
        //  asset_location - if a gridpoint has a folder assigned to its type,
        //      where to look
    
        var map = {};
        
        for (var i=0;i<grid.length;i++) {
            
        }
    
        return map;
    }
}();