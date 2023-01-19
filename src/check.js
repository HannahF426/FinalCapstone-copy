/**
 * A file to check a given object is of the following :
 *  -Happens-before
 *  -Concurrent events
 *  -Lamport clocks
 *  -Vector clocks
 *  -Total-order broadcasts
 *
 */


/* These imports are for if you are not connecting on front end, and using the main method
    that is commented out below.
const mongoose = require("mongoose");
const {ObjectId} = require("mongodb");*/
var diagram = {};



/* ****!!! This blocked out code is for testing purposes if not connecting on the front-end.
function main() {
    mongoose.connect("mongodb+srv://CCraven:Asdfghjkl12@cluster0.inuhw.mongodb.net/Capstone").then(r =>{
    console.log("Hello");
    let diagramSchema = new mongoose.Schema({
        _id: ObjectId,
        chartName: String,
        diagram: [mongoose.Schema.Types.Mixed],
        results: Array
    }, {strict: false});
    const Diagram = mongoose.model('userdatas', diagramSchema);
    let test_diagram = ""; //name of test diagram

    Diagram.findOne({chartName: ""}, 'diagram', function (error, docs) {
        //Setting up for tests
        diagram = docs.toObject({getters:true});
        diagram = diagram.diagram;
        diagram = diagram[0];
        console.log(diagram)
        //Testing happens before relationship
        let event1 = "c";
        let event2 = "d";
       /!* console.log("We are testing : ", test_diagram, "\n and the events: ", event1, " & ", event2);
        console.log("\n\t====== HAPPENS BEFORE TEST =======");
        let hb = happens_before(event1, event2);
        if(hb === true){
            console.log("Event", event1,"happens before event", event2);
        }
        else{
            console.log("Event", event1,"DOES NOT happen before event", event2);
        }

        //Testing concurrency
        console.log("\n\t====== CONCURRENCY TEST =======");
        let con = concurrent(event1, event2);
        if(con === true){
            console.log("Events", event1, "&", event2, "are concurrent");
        }
        else{
            console.log("Events", event1, "&", event2, "are not concurrent");
        }
        //Testing lamport clocks
        console.log("\n\t====== LAMPORT CLOCK TEST =======");
        let ex_clock = "(4,A)";
        let lamport_test = check_lamport(event1, ex_clock);
        if(lamport_test) {
            console.log("The given lamport clock,", ex_clock, "is valid for event", event1 );
        }
        else{
            console.log("The given lamport clock,", ex_clock, "is NOT valid for event", event1);
        }

        //Testing vector timestamps
        console.log("\n\t====== VECTOR TIMESTAMP TEST =======");
        let ex_vector = "<2,2,3>";
        let vector_test = check_vector(event2, ex_vector);
        if(vector_test) {
            console.log("The given vector timestamp,", ex_vector, "is valid for event", event2 );
        }
        else{
            console.log("The given vector timestamp,", ex_vector, "is NOT valid for event", event2);
        }*!/

        // Testing fifo broadcast protocol
        console.log("\n\t====== FIFO BROADCAST TEST =======");
        let fifo_result = test_fifo();
        if(fifo_result) {
            console.log("The given diagram is a valid FIFO broadcast.");
        }
        else{
            console.log("The given diagram is NOT a valid FIFO broadcast.");
        }

        // Testing causal broadcast protocol
        console.log("\n\t====== CAUSAL BROADCAST TEST =======");
        let causal_result = test_causal();
        if(causal_result) {
            console.log("The given diagram is a valid causal broadcast.");
        }
        else{
            console.log("The given diagram is NOT a valid causal broadcast.");
        }

        // Testing total-order broadcast protocol
        console.log("\n\t====== TOTAL ORDER BROADCAST TEST =======");
        let to_result = test_totalorder();
        if(to_result) {
            console.log("The given diagram is a valid total-order broadcast.");
        }
        else{
            console.log("The given diagram is NOT a valid total-order broadcast.");
        }

        // Testing total-order broadcast protocol
        let fifo_to_result = test_fifo_totalorder();
        if(fifo_to_result) {
            console.log("The given diagram is a valid FIFO total-order broadcast.");
        }
        else{
            console.log("The given diagram is NOT a valid FIFO total-order broadcast.");
        }

        mongoose.disconnect().then(r => {
            console.log("\nFinished");
        });
    });
});
}
*/
/**
 * Starting point of the diagram testing
 * @param userDiagram - the user entered diagram
 * @return {*[]} - the results of testing the diagram
 */
function go(userDiagram){
    diagram = userDiagram
    let results = [];
    results.push(test_fifo());
    results.push(test_causal());
    results.push(test_totalorder());
    results.push(test_fifo_totalorder());
    return results;
}

/**
 * Helper function to retrieve the Node of a certain event.
 */
function getNode(event){
    for (let t_nodes in diagram) {
        for (let e of diagram[t_nodes]){
            let this_event = Object.keys(e).join();
            if(this_event === event){
                return t_nodes;
            }
        }
    }
}

/**
 * Happens before logic:
 *      -a and b occurred on the same node, and a occured before b
 *      in that nodes logical execution order or
 *      -event a is the sending of some message m, and event b is the receipt
 *      of that message or
 *      -there exists an event c such that a happens before c and
 *      c happens before b
 * @param event_a  - checking if event a happens before :
 * @param event_b   - event b
 */
function happens_before(event_a, event_b){
    // loops to find the nodes of the events
    let node_A = getNode(event_a);
    let node_B = getNode(event_b);
    let a_key = Object.keys(event_a).join()
    let b_key = Object.keys(event_b).join()


    //if the nodes are the same, assuming events keys are labeled in logical order of execution,
    //if event_a < event_b, then a happens before b and returns true
    if(node_A === node_B && a_key < b_key){
        return true;
    }
    //if the nodes are not the same, then testing if event a is sending to event b.
    // if the node a is sending to, is event b, and event b has received a message from event a
    // then a happens before b and returns true.
    else if(node_A !== node_B && event_a[a_key]['other_node'].includes(b_key) &&
        event_b[b_key]['other_node'].includes(a_key) && event_a[a_key]['send_receive'] === 'send' &&
        event_b[b_key]['send_receive'] === 'receive'){
        return true;
    }
    else{
        let event_c;
        event_c = event_a[a_key]['other_node'];
        for(let event of event_c) {
            let this_node = getNode(event);
            if (this_node === node_B){
                if(b_key>event) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Concurrent logic:
 *      -if neither a happens before b, nor b happens before a
 *
 * @param event_a
 * @param event_b
 */
function concurrent(event_a, event_b){
    return happens_before(event_a, event_b) === false &&
        happens_before(event_b, event_a) === false;
}

/**
 * Lamport Clock logic
 *      -Each node maintains a counter t, incremented on every local event e.
 *      Let L(e) be the value of t after that increment
 *      Attach current t to messages sent over network
 *      Recipient moves its clock forward to timestamp in the
 *      message (if greater than local counter), then increments
 *
 * @param given_event
 */
function get_time(given_event, diagram){
    //object holding lamport clocks for all seen events.
    let events = {};
    // step into the nodes of the diagram
    for (let t_nodes in diagram) {
        // object that holds all the events on the node
        let temp = diagram[t_nodes];
        // counter variable
        let t = 0;
        // counter variable
        let prev_set=0;
        //step into each event on the node
        for(let event_obj of temp) {
            // object that holds information on the current event.
            let curr_event = Object.keys(event_obj).join();
            if (event_obj['send_receive'] === "receive") {
                let rcv_from = event_obj['other_node'];
                let rcv_time = events[rcv_from[0]];
                if(rcv_time!==undefined) {
                    rcv_time = rcv_time[0];
                }
                else{
                    rcv_time = 1;
                }
                if(Math.max(rcv_time, t, prev_set) === t){
                    prev_set = ++t;
                    events[curr_event] = [++t,getNode(curr_event)];
                }
                else if(Math.max(rcv_time, t, prev_set)===prev_set){
                    events[curr_event] = [++prev_set,getNode(curr_event)];
                }
                else{
                    events[curr_event] = [++rcv_time,getNode(curr_event)];
                    prev_set = rcv_time;
                }
            }
             else if(event_obj['send_receive'] === "send") {
                 if(Math.max(prev_set, t)===t){
                     events[curr_event] = [++t, t_nodes];
                     prev_set = t;
                 }
                 else{
                     events[curr_event] = [++prev_set, t_nodes];
                 }

                for(let other_event in event_obj['other_node']) {
                    let temp2 = event_obj['other_node'];
                    temp2 = temp2[other_event];
                    let send_time = events[temp2];
                    if (send_time !== undefined) {
                        send_time = send_time[0];
                    } else {
                        send_time = 1;
                    }
                    if(Math.max(send_time, t) === t){
                        events[temp2] = [t+1,getNode(temp2)];
                    }
                    else{
                        events[temp2] = [++send_time,getNode(temp2)];
                    }
                }
            } else{
                events[curr_event] = [++t, t_nodes];
            }

             if(curr_event === given_event) {
                 return events[curr_event];
             }
        }
    }
}

/**
 *  Helper function to increment the vector clock on the correct node
 * @param vector - previous vector clock
 * @param node - the node that needs to be updated
 * @return {*} - returns the updated vector clock
 */
function update_vector(vector, node){
    if(node === "A"){
        vector[0] += 1;
    }
    else if(node === "B"){
        vector[1] += 1;
    }
    else if(node === "C"){
        vector[2] += 1;
    }
    return vector;
}

/**
 * Checks if the given lamport clock is correct compared to the calculated one
 * @param given_event the event that we are testing
 * @param given_clock the clock that we are testing
 * @return {boolean} returns true if correct, false if incorrect
 */
function check_lamport(given_event, given_clock, diagram){
    let curr_clock = get_time(given_event, diagram);
    curr_clock = "("+curr_clock.toString()+")";
    given_clock = "("+given_clock[0]+ ',' +given_clock[1] +")";
    return curr_clock === given_clock;
}

/**
 * Calculates the correct vector clock for a given event,
 * then tests if the given vector clock matches the calculated vector clock
 * @param given_event
 * @param given_vector
 * @return {boolean}
 */
function check_vector(given_event, given_vector, diag) {
    diagram = diag
    // object holding seen events and their time stamps
    let seen_events = {};
    // step into the nodes of the diagram
    for (let t_nodes in diagram) {
        // object that holds all the events on the node
        let temp = diagram[t_nodes];
        // counter variable
        let t = 0;
        // counter variable
        let prev_set = 0;
        let vector = [0, 0, 0];
        //step into each event on the node
        let last_seen = '';
        for (let event_obj of temp) {
            let curr_event = Object.keys(event_obj).join();
            if (!(curr_event in seen_events)) {
                let this_event_obj = event_obj[curr_event];
                // object that holds information on the current event.
                if (this_event_obj['send_receive'] === "send") {
                    vector = update_vector(vector, t_nodes);
                    seen_events[curr_event] = vector.toString();
                    prev_set = t;
                } else if (this_event_obj['send_receive'] === "receive") {
                    let other_node_temp = this_event_obj['other_node'];
                    //gets the node of the event we are looking at
                    other_node_temp = getNode(other_node_temp.join());
                    //gets the actual object for the node of the object
                    let other_node = diagram[other_node_temp];
                    if(event_obj['other_node'] in seen_events){
                        let past_event = this_event_obj['other_node'];
                        let past_vec = JSON.parse('[' + seen_events[past_event] + ']');
                        // temp vect to obtains correct vector from previous event in current node
                        // along with vector from event that sent a message to this event
                        let max_vec = [0,0,0];
                        for(let num in past_vec){
                            max_vec[num] = Math.max(past_vec[num],vector[num]);
                        }
                        vector = update_vector(max_vec, t_nodes);
                        seen_events[curr_event] = vector.toString();
                    }
                    else {
                        // resets vector timing
                        vector = [0, 0, 0];
                        //go through each event on the node to determine timing
                        for (let other_event of other_node) {
                            let ev_key = Object.keys(other_event).join()
                            if (other_event['send_receive'] === "receive") {
                                //gets the event and corresponding vector from corresponding event
                                let past_event = other_event['other_node'];
                                let past_event_vec = seen_events[past_event];
                                if (!(ev_key in seen_events)&& past_event_vec !== undefined) {
                                    // need to parse the vector because it is stored as string, need
                                    // it to be an array for calculations
                                    past_event_vec= JSON.parse('[' + past_event_vec + ']');
                                    // temp vect to obtains correct vector from previous event in current node
                                    // along with vector from event that sent a message to this event
                                    let max_vec = [0,0,0];
                                    for(let num in past_event_vec){
                                        max_vec[num] = Math.max(past_event_vec[num],vector[num]);
                                    }
                                    vector = update_vector(max_vec, other_node_temp);
                                    seen_events[ev_key] = vector.toString();
                                }
                            } else {
                                // if the corresponding event has not already been seen and calculated
                                // a vector clock, then it updates vector and adds to seen_events
                                if (!(ev_key in seen_events)) {
                                    let past_event_vec = update_vector(vector, other_node_temp);
                                    seen_events[ev_key] = past_event_vec.toString();
                                }
                                // if the current event has not been seen/calculated, then it processes
                                else if (!(curr_event in seen_events)) {
                                    let past_event_vec = seen_events[ev_key];
                                    past_event_vec= JSON.parse('[' + past_event_vec + ']');
                                    vector = update_vector(past_event_vec, t_nodes);
                                    seen_events[curr_event] = vector.toString();
                                }
                            }
                        }
                    }
                    // if the current event has not been seen/calculated, then it processes
                    if (!(curr_event in seen_events)) {
                        let past_event = this_event_obj['other_node'];
                        let past_event_vec = seen_events[past_event];
                        past_event_vec= JSON.parse('[' + past_event_vec + ']');
                        let last_seen_vec = JSON.parse('[' + last_seen + ']');
                        let max_vec = [0,0,0];
                        let i=0;
                        for(let num in past_event_vec){
                            max_vec[i] = Math.max(past_event_vec[num],last_seen_vec[num]);
                            i++;
                        }
                        vector = update_vector(max_vec, t_nodes);
                        seen_events[curr_event] = vector.toString();
                    }
                }
                // if the current event is the one we are looking for, then tests if the calculated
                // vector timestamp is the correct timestamp, then returns the result.
                if (curr_event === given_event) {
                    given_vector = "<" + given_vector[0] + "," + given_vector[2] + "," + given_vector[4] + ">";
                    let curr_vec = seen_events[curr_event];
                    curr_vec = "<" + curr_vec.toString() + ">";
                    return curr_vec === given_vector;
                }
                //holds the last visited event on the CURRENT node, so that it can
                // be used for calculations later.
                last_seen = seen_events[curr_event];
            }
        }
    }
}

/**
 *  If m1 and m2 are broadcast by the same node, and broadcast(m1) -->
 * broadcast (m2), then m1 must be delivered before m2.
 * !!! messages must send from same node !!!
 */
function test_fifo(){
// test result to see if the given ordering is causal
    var result = false;
    // loop through the nodes in the diagram
    for(let nodes in diagram){
        let this_node = diagram[nodes];
        // loops through events in a node
        // first message to compare
        var m1 = undefined;
        // second message to compare
        var m2 = undefined;
        for(let events of this_node){
            let this_event = Object.keys(events).join();
            // finds a message that is a "send" for m1
            if(events[this_event]['send_receive'] === 'send'){
                // if m1 has not been set, then sets it to m1
                if(m1 === undefined) {
                    m1 = events[this_event];
                }
                    // to reach here then it must be that m1 is defined
                    // if m1 is defined, but m2 isnt, then the event we are looking at will
                // be set to m2
                else if(m2 === undefined){
                    m2 = events[this_event];
                }
                //now, if both m1 and m2 have been accounted for, we need to test that if the event
                // from m1 happens before the event of m2, then if that is true, we need to test if
                // the receiving (the other event corresponding with) m1 happens before the receiving
                // of the m2 message.
                if( m1 !== undefined && m2 !== undefined) {
                    // where the receiving of m1 is, typically an array of 2 events if m1 was a
                    // broadcast to 2 different nodes.
                    let other_events1 = m1['other_node'];
                    // same as above, but in relation to m2.
                    let other_events2 = m2['other_node'];
                    //go through all of the events that have been received, testing the if the
                    //receiving of m1 happens before the receiving of m2.
                    for(let rcvs in other_events1){
                        rcvs = other_events1[rcvs];
                        // node that has received the m1 messsage
                        for(let rcvs2 in other_events2){
                            rcvs2= other_events2[rcvs2];
                            let r1_node = getNode(rcvs);
                            let r2_node = getNode(rcvs2);
                            // node that has received the m2 message
                            //tests if they are the same node.
                            if(r1_node === r2_node){
                                //checks if m1 was received before m2
                                if(rcvs < rcvs2){
                                    result = true;
                                }
                                else{
                                    //if m1 was not received before m2 then the current diagram
                                    // cannot be labelled as a fifo diagram so we return false.
                                    result = false;
                                    return result;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return result;
}

/**
 * Helper method that finds all messages that are sends. It then adds the letter
 * representing the event to an array, and the object itself also to an array.
 * when all messages have been checked it returns both arrays
 * @return {*[]} an array holding the array of events and array of event objects
 */
function get_messages_helper(){
    var send_msgs = [];
    var send_objs = [];
    var all_sends = [];
    // loop through the nodes in the diagram
    for (let nodes in diagram) {
        let this_node = diagram[nodes];
        // loops through events in a node
        for (let events of this_node) {
            let this_event = Object.keys(events).join();
            // finds a message that is a "send" for m1
            if (events[this_event]['send_receive'] === 'send') {
                // if m1 has not been set, then sets it to m1
                send_msgs.push(this_event);
                send_objs.push(events);
            }
        }
    }
    all_sends.push(send_msgs);
    all_sends.push(send_objs);
    return all_sends;
}

/**
 * Helper method to return object format of an event
 */
function getEventObj(event){
    for(let node in diagram){
        //console.log("test1: ", node);
        for(let inner of diagram[node]){
            //console.log("test2: ", inner);
            if(Object.keys(inner).join()===event){
                return inner;
            }
        }

    }

}


/**
 *  If broadcast(m1) --> broadcast(m2) then m1 must be delivered before m2.
 * !!! messages can be sent from different nodes.
 */
function test_causal() {
    // call helper function to find all messages that are sends
    var msgs = get_messages_helper();
    // breaks the resulting array into their individual arrays
    let send_msgs = msgs[0];
    let send_objs = msgs[1];
    var result = false;

    // loops through the array of messages, to test if a message m1 happens before a message m2
    for (let index = 0; index < send_objs.length; index++) {
        let m1 = send_objs[index];
        for (let event of send_objs) {
            let m2 = event;
            //console.log("m1: ", m1);
            //console.log("m2: ", m2);
            if (happens_before(m1, m2)) {
                // m1 broadcast does happen before m2 broadcast
                // now it finds the events that m1 and m2 broadcast to,
                // and places them in an array to test if they were received
                // in the correct order.
                //console.log("m1 other events: ", m1[send_msgs[index]]);
                //console.log("m2 other events: ", m2[send_msgs[send_objs.indexOf(m2)]]);
                let m1_other_events = m1[send_msgs[index]];
                let m2_other_events = m2[send_msgs[send_objs.indexOf(m2)]];
                m1_other_events = m1_other_events['other_node'];
                m2_other_events = m2_other_events['other_node'];
                //looping the events m1 and m2 sent to
                for( let ev of m1_other_events){
                    for(let ev2 of m2_other_events) {
                        let evObj = getEventObj(ev);
                        let evObj2 = getEventObj(ev2)
                        let evNode1 = getNode(ev);
                        let evNode2 = getNode(ev2);
                        if(evNode1=== evNode2) {
                            //checking if the receive of m1 happened before the receive of m2
                            if (happens_before(evObj, evObj2)) {
                                result = true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    return result;
}

/**
 * Helper function to test the order in which messages are received from m1 and m2,
 * helping with the classification of total order broadcast
 * @param m1_receives
 * @param m2_receives
 * @return {boolean[]}
 */
function test_receives_helper(m1_receives, m2_receives){
    let result = undefined;
    let diff_rcvd = false;
    for (let ev in m1_receives) {
        for (let ev2 in m2_receives) {
            let receive_m1 = m1_receives[ev];
            let receive_m2 = m2_receives[ev2];
            if(getNode(receive_m1) === getNode(receive_m2)) {
                let temp = happens_before(getEventObj(receive_m1), getEventObj(receive_m2));
                if(temp !== result && result !== undefined){
                    diff_rcvd = true;
                }
                result = temp;
            }
        }
    }
    return [result, diff_rcvd];
}

/**
 * If m1 is delivered before m2 on one node, then m1 must be delivered
 * before m2 on all nodes.
 */
function test_totalorder(){
    var result = false;
    //quick exit for now while i fix logic in here with user diagram
    var msgs = get_messages_helper();
    let send_msgs = msgs[0];
    let send_objs = msgs[1];
    for (let index = 0; index < send_msgs.length; index++) {
        let m1 = send_msgs[index];
        let m2 = send_msgs[index+1];
        //now to test if the RECEIVE of m1 happens before RECEIVE of m2
        //if it does, then we need to check if this is true on ALL other nodes
        let m1_other_events = send_objs[index];
        let m2_other_events = send_objs[index+1];
        m1_other_events = m1_other_events[m1]['other_node'];
        m2_other_events = m2_other_events[m2]['other_node'];
        let send_results = test_receives_helper(m1_other_events, m2_other_events);
        //decides what to do with results from helper function
        if(send_results[0]===false && send_results[1]===false){
            //if both are false, then we should switch m1 and m2, since the broadcast order doesnt
            // matter, it is the order in which they are received that we care.
            send_results = test_receives_helper(m2_other_events, m1_other_events);
            if(send_results[0] === true && send_results[1]===true){
                result = false;
            }
        }
        if(send_results[0] === true && send_results[1]===false){
            result = true;
        }
        //removes the messages that have been tested since we no longer need them
        send_msgs.splice(index,1);
        send_msgs.splice(index+1, 1);
    }
    return result;
}

/**
 *  Combination of FIFO broadcast and total order broadcast.
 *  checks if the diagram is causal and total order. if som then the
 *  diagram is FIFO total-order.
 */
function test_fifo_totalorder(){
    //this should be just testing if causal is true and total order is true?
    return test_causal() && test_totalorder();

}

/*if (require.main === module) {
    main();
}*/


module.exports = {
    go, check_lamport, check_vector
}
