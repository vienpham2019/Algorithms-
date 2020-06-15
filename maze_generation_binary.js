let size = 30 
// let width = size * 70
// let height = size * 40
let width = size * 60
let height = size * 30
let canvas = document.getElementById("maze")
canvas.width = width
canvas.height = height
canvas.style.background = "black"

let c = canvas.getContext("2d")
let nodes = []

let cols = width / size 
let rows = height / size 

let block 

let visited_nodes = []
let stack = []

let quere = []
let finish_path = false 
let nodes_path = []
let path = []
let current_node 
let start_node, end_node 

let myReq

const Node = function(x , y , neighbor_node = [], prev_node = null){
    this.x = x
    this.y = y
    this.neighbor_node = neighbor_node
    this.prev_node = prev_node 
    // this.walls = [true,true,true,true] // [top, right , bottom , left ]
    this.walls = [false,false,false,false] // [top, right , bottom , left ]

    this.draw = (color = "white") => {
        let x = this.x - (size / 2)
        let y = this.y - (size / 2)

        // Top 
        if(this.walls[0]){
            c.beginPath()
            c.moveTo(x, y)
            c.lineTo(x + size , y)
            c.lineWidth = 4
            c.lineCap = "round"
            c.strokeStyle = color
            c.stroke()
        }

        // right
        if(this.walls[1]){
            c.beginPath()
            c.moveTo(x + size, y)
            c.lineTo(x + size , y +size)
            c.lineWidth = 4
            c.lineCap = "round"
            c.strokeStyle = color
            c.stroke()
        }

        // bottom
        if(this.walls[2]){
            c.beginPath()
            c.moveTo(x + size, y + size)
            c.lineTo(x, y +size)
            c.lineWidth = 4
            c.lineCap = "round"
            c.strokeStyle = color
            c.stroke()
        }

        // left 
        if(this.walls[3]){
            c.beginPath()
            c.moveTo(x, y + size)
            c.lineTo(x, y)
            c.lineWidth = 4
            c.lineCap = "round"
            c.strokeStyle = color
            c.stroke()
        }
    }
}

const setUp = () => {
    for(let i = 0; i < rows ; i ++){
        for(let j = 0; j < cols ; j ++){
            let x = j * size + (size / 2)
            let y = i * size + (size / 2)
            let node = new Node(x, y)

            if(j === 0){
                node.walls[3] = true 
            }else if(j === cols - 1 && i != rows - 1){
                node.walls[1] = true
            }

            nodes.push(node)
        }
    }

    draw_binary_maze(nodes, cols , rows)
}


const draw_binary_maze = (nodes_array , w , h) => {
    for(let i = 0 ; i < h ; i ++){
        for(let j = 0 ; j < w ; j ++){
            let right_or_down = getRandom(-20 , 20)
            let next_x = j * size + (size / 2) 
            let next_y = i * size + (size / 2) 
            let next_node = nodes_array.find(node => node.x === next_x && node.y === next_y)
            setTimeout(() => {
                setTimeout(() => {
                    if(right_or_down < 0){ // down 
                        next_node.walls[2] = true
                    }else{ // right 
                        next_node.walls[1] = true
                    }
                    next_node.draw()
                }, j * 5);
            }, (i) * (w * 5));
        }
    }
}

const getRandom = (min,max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

setUp()
