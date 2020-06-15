let map3 = [
    ["s","#","#","#","#","#","#"],
    [" "," "," "," ","#"," "," "],
    [" ","#","#"," "," "," "," "], 
    [" "," "," "," ","#","#"," "],
    [" ","#"," ","#"," "," "," "],
    [" ","#"," "," "," ","#","e"],
    [" ","#","#","#","#","#","#"]
]

const Node = function(location, distance, neightbors = []){
    this.location = location 
    this.distance = distance 
    this.neightbors = neightbors
}

const Dijkstra_A = function(start, map){
    this.start_node = new Node(start,0)
    this.visted_node = [start.join(",")]
    this.node_containers = [this.start_node]
    this.new_node_containers = []
    this.width = map[0].length 
    this.height = map.length 
    this.path = []
    this.end_node = null 

    this.solve = () => {
        while(this.node_containers.length > 0){
            this.add_node()
            if(this.end_node){
                this.find_path()
                return
            }
        }
    }

    this.add_node = () => {
        this.new_node_containers = []
        for(let i = 0; i < this.node_containers.length ; i ++){
            let c_node = this.node_containers[i]
            c_node.neightbors = [...c_node.neightbors,...this.add_neightbors(c_node)]
        }
        this.node_containers = [...this.new_node_containers]
    }

    this.add_neightbors = (node) => {
        let current_location = node.location
        let x = current_location[0] // col 
        let y = current_location[1] // row
        let distance = node.distance + 1
        let neightbors = []
        // top 
        if(y - 1 >= 0 && map[y - 1][x] !== "#" && !this.visted_node.includes(`${x},${y - 1}`)){
            let top = new Node([x , y - 1], distance , [node])
            this.new_node_containers.push(top)
            this.visted_node.push(`${x},${y - 1}`)
            neightbors.push(top)
            if(map[y - 1][x] === "e"){
                this.end_node = top 
            }
        }
        // right 
        if(x + 1 < this.width && map[y][x + 1] !== "#" && !this.visted_node.includes(`${x + 1},${y}`)){
            let right = new Node([ x + 1, y], distance , [node])
            this.new_node_containers.push(right)
            this.visted_node.push(`${x + 1},${y}`)
            neightbors.push(right)
            if(map[y][x + 1] === "e"){
                this.end_node = right
            }
        }
        // down
        if(y + 1 < this.height && map[y + 1][x] !== "#" && !this.visted_node.includes(`${x},${y + 1}`)){
            let down = new Node([x, y + 1], distance , [node])
            this.new_node_containers.push(down)
            this.visted_node.push(`${x},${y + 1}`)
            neightbors.push(down)
            if(map[y + 1][x] === "e"){
                this.end_node = down
            }
        }
        // left
        if(x - 1 >= 0 && map[y][x - 1] !== "#" && !this.visted_node.includes(`${x - 1},${y}`)){
            let left = new Node([x - 1, y], distance , [node])
            this.new_node_containers.push(left)
            this.visted_node.push(`${x - 1},${y}`)
            neightbors.push(left)
            if(map[y][x - 1] === "e"){
                this.end_node = left
            }
        }

        return neightbors
    }

    this.find_path = () => {
        current_node = this.end_node 
        while(current_node.location !== start){
            let sortest_neightbor = current_node.neightbors.sort((a,b) => a.distance - b.distance)[0]
            this.path.push(sortest_neightbor.location)
            current_node = sortest_neightbor
        }   
    }

    this.print_map = () => {
        for(let i = 0 ; i < this.path.length; i ++){ 
            let x = this.path[i][0]
            let y = this.path[i][1]
            let mark = i === this.path.length - 1 ? "S" : "."
            map[y][x] = mark
        }

        for(let i = 0 ; i < map.length; i ++) { 
            console.log(map[i].join(" "))
        }
    }

}

let d_a = new Dijkstra_A([0,0], map3)
d_a.solve()
console.log(d_a.path)
console.log(d_a.print_map())