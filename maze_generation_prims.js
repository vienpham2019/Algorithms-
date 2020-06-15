let size = 30 
// let width = size * 70
// let height = size * 40
let width = size * 60
let height = size * 30
let canvas = document.getElementById("maze")
let button = document.getElementById('solve_maze_btn')
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
let myReqDraw

const Node = function(x , y , neighbor_node = [], prev_node = null){
    this.x = x
    this.y = y
    this.neighbor_node = neighbor_node
    this.prev_node = prev_node 
    this.walls = [true,true,true,true] // [top, right , bottom , left ]

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

const Block = function(x , y , color = "red", prev_node = null){
    this.x = x 
    this.y = y 
    this.dx = size
    this.dy = size
    this.prev_node  = prev_node
    this.color = color

    this.draw = () => {
        c.beginPath()
        c.rect(this.x - (size / 2), this.y - (size / 2), size - 3, size - 3)
        c.fillStyle = this.color
        c.fill()
    }
}

const setUp = () => {
    for(let i = 0; i < rows ; i ++){
        for(let j = 0; j < cols ; j ++){
            let x = j * size + (size / 2)
            let y = i * size + (size / 2)
            let node = new Node(x, y)

            if(i === 0 && j === 0) {
                node.walls[3] = false
            }

            if(j === cols - 1 && i === rows - 1){
                node.walls[1] = false
            }

            if(i === 0 && j === 0){
                stack.push(node)
                visited_nodes.push(node)
            }

            nodes.push(node)
        }
    }

    start_node = new Block(size / 2,size / 2, "blue")
    quere.push(start_node)
    end_node = new Block((cols - 1) * size + (size / 2),( rows - 1 ) * size + (size / 2) , "green")
    
    button.addEventListener('click' , () => {
       run_solve_maze()
    })

    setup_prims_maze(nodes, cols , rows)
}

let neighbors_node = []
let visited_neighbors_node = []
let current_neighbor_node

const setup_prims_maze = (nodes_array , w , h) => {
    let midd_x =  Math.floor(w / 2) * size + (size / 2)
    let midd_y =  Math.floor(h / 2) * size + (size / 2)
    let center_node = nodes_array.find(node => node.x === midd_x && node.y === midd_y)
    neighbors_node.push(center_node)
    visited_neighbors_node.push(center_node)
    current_neighbor_node = center_node

    draw_prims_maze()
}

const draw_prims_maze = () => {
    myReqDraw = requestAnimationFrame(draw_prims_maze)
    c.clearRect(0,0,canvas.width, canvas.height)

    for(let i = 0; i < nodes.length; i ++){
        nodes[i].draw()
    }

    if(neighbors_node.length === 0){
        cancelAnimationFrame(myReqDraw)
    }

    add_neighbor_node()
}

const add_neighbor_node = () => {
    let {x , y} = current_neighbor_node
    
    let {top , right , bottom , left} = get_top_right_bottom_left(current_neighbor_node , nodes) 

    if(
        top 
        && !visited_neighbors_node.find(node => node.x === x && node.y === y - size)
        && !neighbors_node.find(node => node.x === x && node.y === y - size)
    ){
        neighbors_node.push(top)
        top.prev_node = current_neighbor_node
    }

    if(
        right 
        && !visited_neighbors_node.find(node => node.x === x + size && node.y === y)
        && !neighbors_node.find(node => node.x === x + size && node.y === y)
    ){
        neighbors_node.push(right)
        right.prev_node = current_neighbor_node
    }

    if(
        bottom 
        && !visited_neighbors_node.find(node => node.x === x && node.y === y + size)
        && !neighbors_node.find(node => node.x === x && node.y === y + size)
    ){
        neighbors_node.push(bottom)
        bottom.prev_node = current_neighbor_node
    }

    if(
        left 
        && !visited_neighbors_node.find(node => node.x === x - size && node.y === y)
        && !neighbors_node.find(node => node.x === x - size && node.y === y)
    ){
        neighbors_node.push(left)
        left.prev_node = current_neighbor_node
    }

    neighbors_node = neighbors_node.filter(node => node.x === x && node.y === y ? false : true )

    link_node_with_random_neighbor()
}

const link_node_with_random_neighbor = () => {
    if(neighbors_node.length === 0) return
    let random_num = getRandom(0 , neighbors_node.length)
    let random_neighbor = neighbors_node[random_num]
    let {top , right , bottom , left} = get_top_right_bottom_left(random_neighbor,visited_neighbors_node)

    if(top && top.x === random_neighbor.prev_node.x && top.y === random_neighbor.prev_node.y){
        random_neighbor.walls[0] = false 
        top.walls[2] = false
    }

    if(right && right.x === random_neighbor.prev_node.x && right.y === random_neighbor.prev_node.y){
        random_neighbor.walls[1] = false 
        right.walls[3] = false
    }

    if(bottom && bottom.x === random_neighbor.prev_node.x && bottom.y === random_neighbor.prev_node.y){
        random_neighbor.walls[2] = false 
        bottom.walls[0] = false
    }

    if(left && left.x === random_neighbor.prev_node.x && left.y === random_neighbor.prev_node.y){
        random_neighbor.walls[3] = false 
        left.walls[1] = false
    }

    current_neighbor_node = random_neighbor
    visited_neighbors_node.push(random_neighbor)
}

const get_top_right_bottom_left = (node , array ) => {
    let {x , y} = node
    let top = array.find(n => n.x === x && n.y === y - size)
    let right = array.find(n => n.x === x + size && n.y === y)
    let bottom = array.find(n => n.x === x && n.y === y + size)
    let left = array.find(n => n.x === x - size && n.y === y)

    return {top , right , bottom , left }
}

const getRandom = (min,max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

const run_solve_maze = () => {
    myReq = requestAnimationFrame(run_solve_maze)
    c.clearRect(0,0,canvas.width, canvas.height)

    for(let i = 0; i < nodes.length; i ++){
        nodes[i].draw()
    }

    for(let i = 0; i < nodes_path.length; i ++){
        nodes_path[i].draw()
    }

    start_node.draw()
    end_node.draw()
    if(end_node.prev_node){
        find_path()
    }
    if(finish_path){
        cancelAnimationFrame(myReq)
    }
    if(!end_node.prev_node && !finish_path){
        solve_maze()
    }
}

const solve_maze = () => {
    let quere_nodes = [...quere]
    quere.shift()
    // visited_nodes_for_path.push(current_node)
    if(end_node.prev_node){
        return
    }
    for(let i = 0; i < quere_nodes.length ; i ++){
        check_neighbor_node(quere_nodes[i])
    }
}

const check_neighbor_node = (node) => {
    let x = node.x
    let y = node.y
    let color = "MidnightBlue"
    let current_find_node = nodes.find(c_n => c_n.x === node.x && c_n.y === node.y )
    // top 
    let top = nodes.find(n => n.x === x && n.y === y - size)
    if(top && !current_find_node.walls[0] && !nodes_path.find(n => n.x === top.x && n.y === top.y)){
        let top_x = top.x
        let top_y = top.y
        if(top_x === end_node.x && top_y === end_node.y){
            end_node.prev_node = node 
            current_node = node 
            return 
        }else{
            let top_block = new Block(top_x, top_y, color, node)
            quere.push(top_block)
            nodes_path.push(top_block)
        }
    }

    // right
    let right = nodes.find(n => n.x === x + size && n.y === y )
    if(right && !current_find_node.walls[1] && !nodes_path.find(n => n.x === right.x  && n.y === right.y)){
        let right_x = right.x 
        let right_y = right.y 
        if(right_x === end_node.x && right_y === end_node.y){
            end_node.prev_node = node 
            current_node = node 
            return 
        }else{
            let right_block = new Block(right_x, right_y, color ,node)
            quere.push(right_block)
            nodes_path.push(right_block)
        }
    }

    // bottom
    let bottom = nodes.find(n => n.x === x && n.y === y + size ) 
    if(bottom && !current_find_node.walls[2] && !nodes_path.find(n => n.x === bottom.x  && n.y === bottom.y )){
        let bottom_x = bottom.x 
        let bottom_y = bottom.y 
        if(bottom_x === end_node.x && bottom_y === end_node.y){
            end_node.prev_node = node 
            current_node = node 
            return 
        }else{
            let bottom_block = new Block(bottom_x, bottom_y, color ,node)
            quere.push(bottom_block)
            nodes_path.push(bottom_block)
        }
    }

    // left 
    let left = nodes.find(n => n.x === x - size && n.y === y)
    if(left && !current_find_node.walls[3] && !nodes_path.find(n => n.x === left.x && n.y === left.y)){
        let left_x = left.x 
        let left_y = left.y 
        if(left_x === end_node.x && left_y === end_node.y){
            end_node.prev_node = node 
            current_node = node 
            return 
        }else{
            let left_block = new Block(left_x,left_y, color , node)
            quere.push(left_block)
            nodes_path.push(left_block)
        }
    }

}

const find_path = () => {
    current_node.color = "green"
    if(current_node.x === start_node.x && current_node.y === start_node.y){
        finish_path = true
        return
    }
    current_node = current_node.prev_node
}

setUp()
