let map2 = [
    ["s","#","e"," "," "," ","#"],
    [" ","#"," ","#","#"," "," "],
    [" ","#"," ","#"," "," "," "], 
    [" ","#"," ","#"," ","#"," "],
    [" "," "," ","#"," ","#","#"],
    [" ","#"," ","#"," ","#","#"],
    [" ","#"," "," "," "," "," "]
]

const Node = function(location, prev_node = null){
    this.location = location 
    this.prev_node = prev_node
}

const DFS = function(start , map) {
    this.root_node = new Node(start)
    this.map = map
    this.stack = [this.root_node]
    this.visited_node = [start.join(",")]
    this.width = this.map[0].length
    this.height = this.map.length
    this.path = []
    this.end_node = null 

    this.solve_maze = () => {
        while(this.stack.length > 0){
            let current_node = this.stack[0] 
            let x = current_node.location[0]
            let y = current_node.location[1]
            if(map[y][x] === "e"){
                this.end_node = current_node
                this.find_path()
                return  
            }

            if(!this.add_node(current_node)){
                this.stack.shift()
            }
        }
    }

    this.find_path = () => {
        let current_node = this.end_node
        while (current_node) {
            this.path.push(current_node.location)
            current_node = current_node.prev_node
        }
    }

    this.add_node = (node) => {
        let current_location = node.location
        let x = current_location[0] // col 
        let y = current_location[1] // row

        //Down 
        if(y + 1 < this.height && this.map[y + 1][x] !== "#" && !this.visited_node.includes(`${[x]},${[y + 1]}`)){
            let down = new Node([x , y + 1], node)
            this.stack = [down,...this.stack]
            this.visited_node.push(`${[x]},${[y + 1]}`)
            return true
        }

        //Right
        if(x + 1 < this.width && this.map[y][x + 1] !== "#" && !this.visited_node.includes(`${[x + 1]},${y}`)){
            let right = new Node([x + 1, y], node)
            this.stack = [right,...this.stack]
            this.visited_node.push(`${[x + 1]},${y}`)
            return true
        }

        //Up
        if(y - 1 >= 0 && this.map[y - 1][x] !== "#" && !this.visited_node.includes(`${[x]},${[y - 1]}`)){
            let up = new Node([x , y - 1], node)
            this.stack = [up,...this.stack]
            this.visited_node.push(`${[x]},${[y - 1]}`)
            return true
        }

        //Left
        if(x - 1 >= 0 && this.map[y][x - 1] !== "#" && !this.visited_node.includes(`${[x - 1]},${[y]}`)){
            let left = new Node([x - 1, y], node)
            this.stack = [left,...this.stack]
            this.visited_node.push(`${[x - 1]},${[y]}`)
            return true 
        }

        return false 

    }

    this.print_map = () => {
        for(let i = 0 ; i < this.path.length; i ++){ 
            let x = this.path[i][0]
            let y = this.path[i][1]
            let mark = i === 0 ? "E" : i === this.path.length - 1 ? "S" : "."
            this.map[y][x] = mark
        }

        for(let i = 0 ; i < this.map.length; i ++) { 
            console.log(this.map[i].join(" "))
        }
    }
}

let dfs = new DFS([0,0],map2)
dfs.solve_maze()
console.log(dfs.print_map())