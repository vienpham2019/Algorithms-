let size = 40 
// let width = size * 70
// let height = size * 40
let width = size * 35
let height = size * 20
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

    this.move = () => {
        let current_node = stack[0]
        let neighbor_nodes = []
        let x = current_node.x
        let y = current_node.y

        // top
        if(y - size > 0 && !visited_nodes.find(n => n.x === x && n.y === y - size)){
            let top = nodes.find(n => n.x === x && n.y === y - size)
            neighbor_nodes.push(top)
        }

        // right 
        if(x + size < width && !visited_nodes.find(n => n.x === x + size && n.y === y)){
            let right = nodes.find(n => n.x === x + size && n.y === y)
            neighbor_nodes.push(right)
        }

        // bottom
        if(y + size < height && !visited_nodes.find(n => n.x === x && n.y === y + size)){
            let bottom = nodes.find(n => n.x === x && n.y === y + size)
            neighbor_nodes.push(bottom)
        }

        // left
        if(x - size > 0 && !visited_nodes.find(n => n.x === x - size && n.y === y)){
            let left = nodes.find(n => n.x === x - size && n.y === y)
            neighbor_nodes.push(left)
        }

        if(neighbor_nodes.length > 0){
            let next_node = neighbor_nodes[Math.floor(Math.random() * neighbor_nodes.length)]
            stack.unshift(next_node)
            visited_nodes.push(next_node)
            this.dx = next_node.x - current_node.x
            this.dy = next_node.y - current_node.y

            this.x += this.dx 
            this.y += this.dy

            if(this.dx > 0) { // right 
                current_node.walls[1] = false 
                next_node.walls[3] = false 
            }else if(this.dx < 0){ // left
                current_node.walls[3] = false 
                next_node.walls[1] = false 
            } 

            if(this.dy > 0) { // down
                current_node.walls[2] = false 
                next_node.walls[0] = false 
            }else if(this.dy < 0){ // up
                current_node.walls[0] = false 
                next_node.walls[2] = false 
            }
        }else{
            let dx = current_node.x  - (this.x + (size / 2))
            let dy = current_node.y  - (this.y + (size / 2))
            this.x += dx 
            this.y += dy
            stack.shift()
        }
        this.draw()
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
    draw_maze(nodes , cols, rows, 0, 0)
    
    button.addEventListener('click' , () => {
       run_solve_maze()
    })
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
                if (nodes_array[i].y != random_y * size + (size / 2)){
                    nodes_array[i].walls[1] = true
                    let {x , y} = nodes_array[i]
                    let neightbor_node = nodes_array.find(node => node.x === x + size && node.y === y) 
                    if(neightbor_node){
                        neightbor_node.walls[3] = true
                    } 
                }
            }
        }else{
            if(
                nodes_array[i].y === random_y * size + (size / 2)
                && nodes_array[i].x <= x_max * size + (size / 2)
                && nodes_array[i].x >= x_min * size + (size / 2)
                ){
                if(nodes_array[i].x != random_x * size + (size / 2)){
                    nodes_array[i].walls[2] = true
                    let {x , y} = nodes_array[i]
                    let neightbor_node = nodes_array.find(node => node.x === x && node.y === y + size) 
                    if(neightbor_node){
                        neightbor_node.walls[0] = true
                    } 
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

const getRandom = (min,max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

setUp()
