let map4 = [
    [" ","s","#","#","#","#","#"],
    [" "," "," "," ","#"," "," "],
    [" ","#","#"," "," "," "," "], 
    [" "," "," ","#","#","#"," "],
    [" ","#"," ","#","e"," "," "],
    [" ","#"," "," "," ","#"," "],
    [" ","#","#","#","#","#","#"]
]

const Node = function(location, g, h , f, parent_node = null){ 
    this.location = location 
    this.g = g 
    this.h = h 
    this.f = f 
    this.parent_node = parent_node
}

const A_algorithm = function(start , end , map){
    this.start = start // [x,y]
    this.end = end // [x,y]
    this.width = map[0].length 
    this.height = map.length 
    this.open_list = []
    this.close_list = []
    this.end_node = null 
    this.path = []

    this.solve_maze = () => {
        let start_node = this.set_node(start , 0)
        this.open_list.push(start_node)
        while(this.open_list.length > 0){
            let current_node = this.open_list.sort((a,b) => a.f - b.f)[0]
            this.close_list.push(current_node)
            if(current_node.location.join(",") === this.end.join(",")){
                this.end_node = current_node
                this.find_path()
                return
            }
            this.find_child_node(current_node)
        }
    }

    this.set_node = (node_location , g, parent_node = null) => {
        let x1 = node_location[0]
        let y1 = node_location[1]
        let x2 = this.end[0]
        let y2 = this.end[1]
        let h = (Math.abs(x1 - x2) + Math.abs(y1 - y2)) * 10
        let f = h + g 
        let node = new Node(node_location, g , h , f, parent_node)
        return node 
    }

    this.find_child_node = (node) => {
        let x = node.location[0]
        let y = node.location[1]

        // Right (x + 1, y)
        if(
            x + 1 < this.width 
            && map[y][x + 1] !== "#" 
            && !this.close_list.find(n => n.location.join(",") === `${x + 1},${y}`)
        ){
            let right_in_open = this.open_list.find(n => n.location.join(",") === `${x + 1},${y}`)
            let r_g = node.g + 10
            if(right_in_open && r_g < right_in_open.g){
                this.update_node(right_in_open, r_g , node)
            }else{
                let right = this.set_node([x + 1, y], r_g , node)
                this.open_list.push(right)
            }
        }

        // Top-Right (x + 1, y - 1)
        if(
            x + 1 < this.width 
            && y - 1 >= 0 
            && map[y - 1][x + 1] !== "#"
            && !this.close_list.find(n => n.location.join(",") === `${x + 1},${y - 1}`)
        ){
            let top_right_in_open = this.open_list.find(n => n.location.join(",") === `${x + 1},${y - 1}`)
            let tr_g = node.g + 14
            if(top_right_in_open && tr_g < top_right_in_open.g){
                this.update_node(top_right_in_open, tr_g , node)
            }else{
                let top_right = this.set_node([x + 1, y - 1], tr_g , node)
                this.open_list.push(top_right)
            }
        }

        // Top (x, y - 1)
        if(
            y - 1 >= 0 
            && map[y - 1][x] !== "#"
            && !this.close_list.find(n => n.location.join(",") === `${x},${y - 1}`)
        ){
            let top_in_open = this.open_list.find(n => n.location.join(",") === `${x},${y - 1}`)
            let t_g = node.g + 10
            if(top_in_open && t_g < top_in_open.g){
                this.update_node(top_in_open, t_g , node)
            }else{
                let top = this.set_node([x, y - 1], t_g , node)
                this.open_list.push(top)
            }
        }

        // Top-Left (x - 1, y - 1)
        if(
            x - 1 >= 0 
            && y - 1 >= 0 
            && map[y - 1][x - 1] !== "#"
            && !this.close_list.find(n => n.location.join(",") === `${x - 1},${y - 1}`)
        ){
            let top_left_in_open = this.open_list.find(n => n.location.join(",") === `${x - 1},${y - 1}`)
            let tl_g = node.g + 14
            if(top_left_in_open && tl_g < top_left_in_open.g){
                this.update_node(top_left_in_open, tl_g , node)
            }else{
                let top_left = this.set_node([x - 1, y - 1], tl_g , node)
                this.open_list.push(top_left)
            }
        }

        // Left (x - 1, y)
        if(
            x - 1 >= 0 
            && map[y][x - 1] !== "#"
            && !this.close_list.find(n => n.location.join(",") === `${x - 1},${y}`)
        ){
            let left_in_open = this.open_list.find(n => n.location.join(",") === `${x - 1},${y}`)
            let l_g = node.g + 10
            if(left_in_open && l_g < left_in_open.g){
                this.update_node(left_in_open, l_g , node)
            }else{
                let left = this.set_node([x - 1, y], l_g , node)
                this.open_list.push(left)
            }
        }

        // Bottom-Left (x - 1, y + 1)
        if(
            x - 1 >= 0 
            && y + 1 < this.height 
            && map[y + 1][x - 1] !== "#"
            && !this.close_list.find(n => n.location.join(",") === `${x - 1},${y + 1}`)
        ){
            let bottom_left_in_open = this.open_list.find(n => n.location.join(",") === `${x - 1},${y + 1}`)
            let bl_g = node.g + 14
            if(bottom_left_in_open && bl_g < bottom_left_in_open.g){
                this.update_node(bottom_left_in_open, bl_g , node)
            }else{
                let bottom_left = this.set_node([x - 1, y + 1], bl_g , node)
                this.open_list.push(bottom_left)
            }
        }

        // Bottom (x, y + 1)
        if(
            y + 1 < this.height 
            && map[y + 1][x] !== "#"
            && !this.close_list.find(n => n.location.join(",") === `${x},${y + 1}`)
        ){
            let b_g = node.g + 10
            let bottom_in_open = this.open_list.find(n => n.location.join(",") === `${x},${y + 1}`)
            if(bottom_in_open && b_g < bottom_in_open.g){
                this.update_node(bottom_in_open, b_g , node)
            }else{
                let bottom = this.set_node([x, y + 1], b_g , node)
                this.open_list.push(bottom)
            }
        }

        // Bottom-Right (x + 1, y + 1)
        if(
            x + 1 < this.width 
            && y + 1 < this.height 
            && map[y + 1][x + 1] !== "#"
            && !this.close_list.find(n => n.location.join(",") === `${x + 1},${y + 1}`)
        ){
            let br_g = node.g + 14
            let bottom_right_in_open = this.open_list.find(n => n.location.join(",") === `${x + 1},${y + 1}`)
            if(bottom_right_in_open && br_g < bottom_right_in_open.g){
                this.update_node(bottom_right_in_open, br_g , node)
            }else{
                let bottom_right = this.set_node([x + 1, y + 1], br_g , node)
                this.open_list.push(bottom_right)
            }
        }

        this.open_list = this.open_list.filter(n => n.location.join(",") !== node.location.join(","))
    }

    this.update_node = (node , g , parent) => {
        node.g = g 
        node.f = g + node.h 
        node.parent = parent 
    }

    this.find_path = () => {
        let current_node = this.end_node
        while(current_node){
            this.path.push(current_node.location)
            current_node = current_node.parent_node
        }
    }

    this.print_map = () => {
        for(let i = 0 ; i < this.path.length; i ++){ 
            let x = this.path[i][0]
            let y = this.path[i][1]
            let mark = i === 0 ? "E" : i === this.path.length - 1 ? "S" : "."
            map[y][x] = mark
        }

        for(let i = 0 ; i < map.length; i ++) { 
            console.log(map[i].join(" "))
        }
    }
}

let aa = new A_algorithm([1,0] , [4,4] , map4)
aa.solve_maze()
console.log(aa.print_map())