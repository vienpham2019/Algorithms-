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
        c.rect(this.x + size / 8 , this.y + size / 8, size * (3 / 4), size * (3 /4))
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
            if(i === 0 && j === 0){
                stack.push(node)
                visited_nodes.push(node)
            }
            nodes.push(node)
        }
    }

    block = new Block(0 , 0)
    start_node = new Block(0 , 0 , "blue")
    quere.push(start_node)
    end_node = new Block(width - size,height - size , "green")
    draw_maze()
}


const draw_maze = () => {
    myReq = requestAnimationFrame(draw_maze)
    c.clearRect(0,0,canvas.width, canvas.height)

    for(let i = 0; i < nodes.length; i ++){
        nodes[i].draw()
    }

    for(let i = 0; i < nodes_path.length; i ++){
        nodes_path[i].draw()
    }

    if(stack.length === 0){
        start_node.draw()
        end_node.draw()
        if(end_node.prev_node){
            find_path()
        }else if(finish_path){
            cancelAnimationFrame(myReq)
        }else{
            solve_maze()
        }
    }else{ 
        block.move()  
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
    let color = "purple"
    // top 
    let top = nodes.find(n => n.x === x + (size / 2) && n.y === y - (size / 2))
    if(top && !top.walls[2] && !nodes_path.find(n => n.x === top.x  - (size / 2) && n.y === top.y - (size / 2))){
        let top_x = top.x  - (size / 2)
        let top_y = top.y  - (size / 2)
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
    let right = nodes.find(n => n.x === x + (size * 3 / 2) && n.y === y + (size / 2))
    if(right && !right.walls[3] && !nodes_path.find(n => n.x === right.x - (size / 2) && n.y === right.y - (size / 2))){
        let right_x = right.x - (size / 2)
        let right_y = right.y - (size / 2)
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
    let bottom = nodes.find(n => n.x === x + (size / 2) && n.y === y + (size * 3 / 2) ) 
    if(bottom && !bottom.walls[0] && !nodes_path.find(n => n.x === bottom.x - (size / 2) && n.y === bottom.y  - (size / 2))){
        let bottom_x = bottom.x - (size / 2)
        let bottom_y = bottom.y - (size / 2)
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
    let left = nodes.find(n => n.x === x - (size / 2) && n.y === y + (size / 2))
    if(left && !left.walls[1] && !nodes_path.find(n => n.x === left.x  - (size / 2) && n.y === left.y - (size / 2))){
        let left_x = left.x - (size / 2)
        let left_y = left.y - (size / 2)
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
    if(current_node.x === 0 && current_node.y === 0){
        finish_path = true
        return
    }
    current_node = current_node.prev_node
}

setUp()
