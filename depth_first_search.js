let map = [
    ["s","#"," "," "," "," ","#"],
    [" ","#"," ","#","#"," "," "],
    [" ","#"," ","#"," "," "," "], 
    [" ","#"," ","#"," ","#"," "],
    [" "," "," ","#"," ","#","#"],
    [" ","#"," ","#"," ","#","#"],
    [" ","#"," "," "," "," ","e"]
]

const Node = function(location, prev_node = null){
    this.location = location 
    this.prev_node = prev_node
}

const DFS = function(start , map) {
    this.root_node = new Node(start)
    this.map = map
    this.stack = [this.root_node]
    this.visited_node [this.root_node.location.join(",")]
    this.width = this.map[0].length - 1
    this.height = this.map.length - 1
}