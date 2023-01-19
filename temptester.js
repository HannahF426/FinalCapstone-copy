const mongoose = require("mongoose");
const {ObjectId} = require("mongodb");
const util = require('util');
var my_diagram = {};



function main() {
    mongoose.connect("mongodb+srv://CCraven:Asdfghjkl12@cluster0.inuhw.mongodb.net/Capstone")
        .then(r => {
        console.log("Hello");
        console.log(process.argv[2]);
        let userdataSchema = new mongoose.Schema({
            _id: ObjectId,
            name: String,
            connections: [mongoose.Schema.Types.Mixed]
        }, {strict: false});
        const UserData = mongoose.model('userdatas', userdataSchema)
        UserData.findOne({_id: '635ad5fd8f7d6e93878f99f6'}, 'connections',
            function (error, docs){

            let data = docs.toObject({getters:true});
            //console.log(diagram.nodes);
            data = data.connections;
            console.log(data);
            make_diagram(data);

            mongoose.disconnect().then(r => {
                console.log("\nFinished");
            });
        });
    });
}

    /**
     *  This function takes input from the user to build a timing diagram.
     *  The input will come in an array containing coordinates for an entire diagram.
     *  Array data should come in the form [(row, column),(row, column)] where the first set of
     *  coordinates are the "broadcast" event, and the second set of coordinates are the "receiving"
     *  of the message from the broadcast event.
     */
    function make_diagram(coords){
        let events_A = [];
        let events_B =[];
        let events_C = [];
        // loop through every set of coordinates in the diagram
        for(let set of coords){
            // the first value in the coordinates is a number related to how far down on the node
            // the event is.
            let b_event = set[0];
            // the second value in the coordinates is the node itself.For these diagrams we will only
            // have 3 nodes, so 0 = A , 1 = B , 2 = C
            let b_node = set[1];
            let r_event = set[2];
            let r_node = set[3];
            // add each event to an array for its corresponding node.
            if(b_node === 0){
                events_A.push([b_event, 'send', r_event, r_node]);
            }
            if(b_node === 1){
                events_B.push([b_event, 'send', r_event, r_node]);
            }
            if(b_node === 2){
                events_C.push([b_event, 'send', r_event, r_node]);
            }
            if(r_node === 0){
                events_A.push([r_event, 'receive', b_event, b_node]);
            }
            if(r_node === 1){
                events_B.push([r_event, 'receive', b_event, b_node]);
            }
            if(r_node === 2){
                events_C.push([r_event, 'receive', b_event, b_node]);
            }

        }
        //add all node arrays to a single array for looping through efficiently.
        let all_nodes =[events_A, events_B, events_C];
        my_diagram.A=[];
        my_diagram.B=[];
        my_diagram.C=[];
        // node counter keeps track of what node we are on. 0 = A; 1 = B; 2 = C
        let node_counter = 0;
        // event counter keeps track of what event we are on, aiding with translating to
        // a letter for each event. 0 = a; 1 = b; ... 10 = k ...
        let event_counter = 0;
        // loop through all nodes
        for(let node of all_nodes){
            // loop through all events on each node
            for(let event of node){
                // translate the node counter into an upper-case alphabetical letter
                let node_alpha = String.fromCharCode(node_counter+65);
                // create object for each event
                let temp_obj = {};
                temp_obj.other_node = [];
                // test if the current seen event is in the diagram already. if it is not, its the
                // first time we have seen this event and we need to create the object and add it to
                // the diagram. if it is in the diagram, then we are seeing the case where the event
                // is a broadcast to multiple nodes, and we simply need to add this event to the
                // already recorded events 'other_node' array.
                if(!(event[0] in Object.keys(my_diagram[node_alpha]))){
                    let this_event = String.fromCharCode(event_counter+65).toLowerCase();
                    // TODO: need to figure out how we will be getting lamport and vector data from
                    //  the user into these objects. This can be a goal for next sprint.
                    temp_obj.lamport = undefined;
                    temp_obj.vector = undefined;
                    temp_obj.send_receive = event[1];
                    temp_obj.other_node.push([event[2], event[3]]);
                    let curr_obj = {[this_event]: temp_obj};
                    my_diagram[node_alpha].push(curr_obj);
                    //increase event counter, so we can move onto the next letter
                    event_counter++;
                }
                else{
                    //our array of objects already has this event in it, so it must be a broadcast
                    //event that is sending to multiple nodes. now we add the other node to the
                    // objects "other_node" array
                    let this_event = String.fromCharCode(event_counter+64).toLowerCase();
                    my_diagram[node_alpha][event[0]][this_event].other_node.push([event[2],event[3]]);
                }
            }

            node_counter++;
        }
        // offset helps keep track of the starting letter for each node
        let offset = 0;
        // go to helper function so we can fix the coordinates that are in each events 'other_node'
        // array and translate them into letters.
        for(let node in my_diagram){
            update_helper(node,offset);
            offset = offset + my_diagram[node].length;
        }
        // final print of the diagram for testing purposes.
        console.log("My Diagram: ", util.inspect(my_diagram, {showHidden: true, depth: null}));
    }


/**
 * Helper function that replaces the arrays of coordinates in each events "other_node" to the
 * correlating event letter. ie, [0,0] -> a. the first number in the coordinates is the event, the
 * second number is the node. So the first event on the first node is 'a'.
 * @param node
 * @param offset
 */
function update_helper(node, offset){
    // this is a mess i know. but it works.
        for(let other_ev in my_diagram[node]) {
            for (let e of my_diagram[node][other_ev][String.fromCharCode(parseInt(other_ev)
                +offset+ 65).toLowerCase()].other_node) {
                let replacement = Object.keys(my_diagram[String.fromCharCode(e[1] + 65)][e[0]])
                    .toString();
                my_diagram[node][other_ev][String.fromCharCode(parseInt(other_ev) +offset+ 65)
                    .toLowerCase()].other_node.forEach(function (item, i) {
                    if (item === e)
                        my_diagram[node][other_ev][String.fromCharCode(parseInt(other_ev)
                            +offset+ 65).toLowerCase()].other_node[i] = replacement;
                });

            }

        }
    }

if (require.main === module) {
    main();
}
module.exports = {
    main
}