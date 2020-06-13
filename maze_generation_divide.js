let size = 40 
// let width = size * 70
// let height = size * 40
let width = size * 35
let height = size * 20
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
            if(i === 0 && j === 0){
                stack.push(node)
                visited_nodes.push(node)
            }
            nodes.push(node)
        }
    }

    // start_node = new Block(0 , 0 , "blue")
    // quere.push(start_node)
    // end_node = new Block(width - size,height - size , "green")
    draw_maze(nodes , cols, rows, 0, 0)
}

const draw_maze = (nodes_array , w, h, x_min , y_min) => {

    if(w <= 1 || h <= 1) return 

    let random_x = getRandom(x_min,w)
    let random_y = getRandom(y_min,h)
    let x_or_y = getRandom(-1, 2)
    console.log(random_x , random_y , w)
    
    for(let i = 0; i < nodes_array.length; i ++){
        if(x_or_y > 0) { // x
            if (
                nodes_array[i].x === random_x * size + (size / 2) 
                && nodes_array[i].y <= h * size + (size / 2)
                && nodes_array[i].y >= y_min * size + (size / 2)
                ){
                nodes_array[i].walls[1] = true
                if (nodes_array[i].y === random_y * size + (size / 2)){
                    nodes_array[i].walls[1] = false
                }
            }
        }else{
            if(
                nodes_array[i].y === random_y * size + (size / 2)
                && nodes_array[i].x <= w * size + (size / 2)
                && nodes_array[i].x >= x_min * size + (size / 2)
                ){
                nodes_array[i].walls[2] = true
                if(nodes_array[i].x === random_x * size + (size / 2)){
                    nodes_array[i].walls[2] = false
                }
            }
        }
        nodes_array[i].draw()
    }

    if(x_or_y > 0){ // right and left 
        // draw_maze(nodes_array, random_x, h , 0, 0)
        draw_maze(nodes_array, w , h, random_x, y_min)
    }else{ // top 
        draw_maze(nodes_array, w, random_y, 0, 0)
    }
    
}

const getRandom = (min,max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

setUp()
