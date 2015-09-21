module.exports = {
  '0' : [ // Basic, single square: there is an empty border with width 1 around it.
    {x:1,y:1},
    {x:5,y:1},
    {x:5,y:5},
    {x:1,y:5}
  ],
  '1' : [ // Extends to left edge.
    {x:0,y:1},
    {x:5,y:1},
    {x:5,y:5},
    {x:0,y:5}
  ],
  '5' : [ // Extends to left and bottom edges, with a small amount in the left-bottom corner not extended.
    {x:0,y:1},
    {x:5,y:1},
    {x:5,y:6},
    {x:1,y:6},
    {x:1,y:5},
    {x:0,y:5}
  ],
  '7' : [ // Extends to left, bottom, and diagonal-left-bottom edges.
    {x:0,y:1},
    {x:5,y:1},
    {x:5,y:6},
    {x:0,y:6}
  ],
  '17' : [ // Extends to left and right edges.
    {x:0,y:1},
    {x:6,y:1},
    {x:6,y:5},
    {x:0,y:5}
  ],
  '21' : [ // A "T"-junction, extending to left, right, and bottom edges, with corners cut in bottom-left and  -right.
    {x:0,y:1},
    {x:6,y:1},
    {x:6,y:5},
    {x:5,y:5},
    {x:5,y:6},
    {x:1,y:6},
    {x:1,y:5},
    {x:0,y:5}
  ],
  '29' : [ // An "Oklahoma" shape, extending to left, right, right-bottom, and bottom edges, with the bottom-left corner untouched.
    {x:0,y:1},
    {x:6,y:1},
    {x:6,y:6},
    {x:1,y:6},
    {x:1,y:5},
    {x:0,y:5}
  ],
  '31' : [ // Extends to left, right, and bottom, with corners also extended to the edge. Untouched line on top.
    {x:0,y:1},
    {x:6,y:1},
    {x:6,y:6},
    {x:0,y:6}
  ],
  '53' : [ // Extends to all four sides, but only the top-right corner extends to the edge; all other corners untouched.
    {x:0,y:1},
    {x:1,y:1},
    {x:1,y:0},
    {x:6,y:0},
    {x:6,y:5},
    {x:5,y:5},
    {x:5,y:6},
    {x:1,y:6},
    {x:1,y:5},
    {x:0,y:5}
  ],
  '85' : [ // Extends to all four edges with no corner extending fully. Forms a cross.
    {x:0,y:1},
    {x:1,y:1},
    {x:1,y:0},
    {x:5,y:0},
    {x:5,y:1},
    {x:6,y:1},
    {x:6,y:5},
    {x:5,y:5},
    {x:5,y:6},
    {x:1,y:6},
    {x:1,y:5},
    {x:0,y:5}
  ],
  '95' : [ // Extends to all four edges with the top two corners untouched.
    {x:0,y:1},
    {x:1,y:1},
    {x:1,y:0},
    {x:5,y:0},
    {x:5,y:1},
    {x:6,y:1},
    {x:6,y:6},
    {x:0,y:6}
  ],
  '127' : [ // This is the same shape as above, but turned on its side. Somehow they are different shapes. I am confused.
    {x:0,y:1},
    {x:1,y:1},
    {x:1,y:0},
    {x:6,y:0},
    {x:6,y:6},
    {x:1,y:6},
    {x:1,y:5},
    {x:0,y:5}
  ],
  '255' : [ // Touches all four edges, with no corners "exposed".
    {x:0,y:0},
    {x:6,y:0},
    {x:6,y:6},
    {x:0,y:6}
  ]
};
