let map = [
    ["s","#"," ","e"," "," ","#"],
    [" ","#","#","#","#"," "," "],
    [" "," "," "," "," "," "," "], 
    [" ","#"," ","#"," ","#"," "],
    [" "," "," ","#"," ","#","#"],
    [" ","#"," ","#"," ","#","#"],
    [" ","#"," "," "," "," "," "]
]

const Node = function(location, prev_node = null){
    this.location = location
    this.prev_node = prev_node 
}

const BFS = function(rootLocation,map){
    this.root_node = new Node(rootLocation)
    this.quere = [this.root_node]
    this.visit_node = [rootLocation.join(",")]
    this.width = map[0].length
    this.height = map.length
    this.path = []
    this.map = map
    
    this.add = () => {
        while(this.quere.length > 0){
            let nodes = [...this.quere]
            for(let i = 0; i < nodes.length ; i ++){
                this.check_node(nodes[i])
            }
        }
    }   

    this.check_node = (node) => {
        this.quere.shift()
        let current_location = node.location
        let x = current_location[0] // col 
        let y = current_location[1] // row
        // top 
        if(y - 1 >= 0 && map[y - 1][x] !== "#" && !this.visit_node.includes(`${x},${y - 1}`)){
            let top = new Node([x , y - 1], node)
            this.quere.push(top)
            this.visit_node.push(`${x},${y - 1}`)
            if(map[y - 1][x] === "e"){
                this.find_path(top)
                return
            }
        }
        // right 
        if(x + 1 < this.width && map[y][x + 1] !== "#" && !this.visit_node.includes(`${x + 1},${y}`)){
            let right = new Node([ x + 1, y], node)
            this.quere.push(right)
            this.visit_node.push(`${x + 1},${y}`)
            if(map[y][x + 1] === "e"){
                this.find_path(right)
                return
            }
        }
        // down
        if(y + 1 < this.height && map[y + 1][x] !== "#" && !this.visit_node.includes(`${x},${y + 1}`)){
            let down = new Node([x, y + 1], node)
            this.quere.push(down)
            this.visit_node.push(`${x},${y + 1}`)
            if(map[y + 1][x] === "e"){
                this.find_path(down)
                return
            }
        }
        // left
        if(x - 1 >= 0 && map[y][x - 1] !== "#" && !this.visit_node.includes(`${x - 1},${y}`)){
            let left = new Node([x - 1, y], node)
            this.quere.push(left)
            this.visit_node.push(`${x - 1},${y}`)
            if(map[y][x - 1] === "e"){
                this.find_path(left)
                return
            }
        }
    }

    this.find_path = (end_node) => {
        let current_node = end_node
        while(current_node){
            this.path.push(current_node.location)
            current_node = current_node.prev_node
        }
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

let bfs = new BFS([0,0],map)
bfs.add()
console.log(bfs.print_map())