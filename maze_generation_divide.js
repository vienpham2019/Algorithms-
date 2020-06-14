let size = 20 
// let width = size * 70
// let height = size * 40
let width = size * 45
let height = size * 40
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
            if(i === 0 && j != 0) {
                node.walls[0] = true
            }else if(i === rows - 1){
                node.walls[2] = true
            }

            if(j === 0){
                node.walls[3] = true 
            }else if(j === cols - 1 && i != rows - 1){
                node.walls[1] = true
            }
            nodes.push(node)
        }
    }

    // start_node = new Block(0 , 0 , "blue")
    // quere.push(start_node)
    // end_node = new Block(width - size,height - size , "green")
    draw_maze(nodes , cols, rows, 0, 0)
}

const draw_maze = (nodes_array , x_max, y_max, x_min , y_min) => {

    if(x_max - x_min < 1 || y_max - y_min < 1) return 

    let random_x = getRandom(x_min,x_max)
    let random_y = getRandom(y_min,y_max)
    let x_or_y = getRandom(-20, 20)
    
    for(let i = 0; i < nodes_array.length; i ++){
        if(x_or_y > 0) { // x
            if (
                nodes_array[i].x === random_x * size + (size / 2) 
                && nodes_array[i].y <= y_max * size + (size / 2)
                && nodes_array[i].y >= y_min * size + (size / 2)
                && nodes_array[i].x != (cols - 1) * size + (size / 2)
                ){
                nodes_array[i].walls[1] = true
                if (nodes_array[i].y === random_y * size + (size / 2)){
                    nodes_array[i].walls[1] = false
                }
            }
        }else{
            if(
                nodes_array[i].y === random_y * size + (size / 2)
                && nodes_array[i].x <= x_max * size + (size / 2)
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

    setTimeout(() => {
        if(x_or_y > 0){ 
            draw_maze(nodes_array, random_x, y_max, x_min, y_min) // right 
            draw_maze(nodes_array, x_max, y_max, random_x + 1, y_min) // left 
        }else{
            draw_maze(nodes_array, x_max, random_y, x_min, y_min) // top 
            draw_maze(nodes_array, x_max, y_max, x_min , random_y + 1) // bottom
        }
    }, 100);
}

const getRandom = (min,max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

setUp()
