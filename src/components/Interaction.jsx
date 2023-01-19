import React from "react";
import axios from 'axios';
import './Interaction.css';
import Xarrow from "react-xarrows";

var check = require("../check");
const util = require('util');
var diagram = {};


class Interaction extends React.Component {

    state = {
        positions: [],
        connections: [],
        command: "Please select a starting node",
        arrowStart: "",
        arrowEnd: "",
        chartName: "",
        arrows: [],
        diagram: [],
        currEvent: '',
        results: []
    };

    /**
     * This handles the change in the state for the naming of the chart
     * @param event
     */
    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    };


    /**
     * This is word styling for the connections
     * @param word
     * @returns {string}
     */
    separate = (word) => {
        let newWord = "("
        for (let i = 0; i < word.length; i++) {
            newWord = newWord + word[i]
            if(i === 0 || i === 2){
                newWord = newWord + ","
            }
            if(i === 1){
                newWord = newWord + "),("
            }
        }
        return(newWord + ")")
    }

    /**
     * sets all contents of state back to its original values
     */
    resetState = () => {
        this.setState({
            arrows: [],
            positions: [],
            connections: [],
            chartName: "",
            arrowStart: "",
            arrowEnd: "",
            command: "Please select a starting node",
            diagram: [],
            currEvent: '',
            results: []
        })
    }

    /**
     * This is the tests for the lamport clocks
     * @param event
     */
    testLamp = (event) => {
        let lclock = document.getElementById(event.currentTarget.id).value
        let this_event = document.getElementById(event.currentTarget.id).name
        let result = check.check_lamport(this_event, lclock, this.state.diagram);
        if(result) {
            document.getElementById('display'+event.currentTarget.id).innerHTML = '\u2714';
        }
        else{
            document.getElementById('display'+event.currentTarget.id).innerHTML = '\u274C';
        }
        event.preventDefault();
    }

    /**
     * this is the tests for Vector clocks
     * @param event
     */
    testVector = (event) => {
        let vclock = document.getElementById(event.currentTarget.id).value
        let this_event = document.getElementById(event.currentTarget.id).name
        let result = check.check_vector(this_event, vclock, this.state.diagram);
        if(result) {
            document.getElementById('display'+event.currentTarget.id).innerHTML = '\u2714';
        }
        else{
            document.getElementById('display'+event.currentTarget.id).innerHTML = '\u274C';
        }
        event.preventDefault();
    }


    /**
     * This sends all data about the user created chart to the server to be saved in mongo and brought back
     * @param event
     */
    submit = (event) => {
        event.preventDefault();
        if(this.state.connections.length <= 2){
            alert("Please add more connections");
            return;
        }
        const payload = {
            chartName: this.state.chartName,
            connections: this.state.connections
        }
        axios({
            url: 'http://localhost:3050/api/userdata',
            method: 'POST',
            data: payload
        }).then(() => {
            console.log("Connections: " + payload.connections)
            console.log("Data has been sent to the server");
            //this.resetState();
        }).catch(() =>{
            console.log("Something went wrong sending data to server")
        }).finally(() => {
            axios
                .get("http://localhost:3050/api/userdata", {
                    /**'
                     * params option - can contain any number of key-value pairs.
                     */
                    params: {
                        chartName: payload.chartName
                    }
                })
                .then((response) => {
                    /**
                     * The 'then' method is executed only when the request is successfull.
                     */
                    this.setState({diagram: response.data.diagram});
                    this.setState({results: response.data.results});
                })
                .catch((err) => {
                    /**
                     *  The 'catch' method is executed only when the request fails to complete.
                     */
                    console.log(err);
                });
        });
    };

    /**
     * gets starting side anchors for the arrows (this makes it look neater)
     * @returns {string}
     */
    getStartAnchor = () => {
        if((this.state.arrowStart%3) < (this.state.arrowEnd%3)){
            return("right")
        }
        if((this.state.arrowStart%3) > (this.state.arrowEnd%3)){
            return("left")
        }
        else{
            return("auto")
        }
    }

    /**
     * gets ending side anchors for the arrows (this makes it look neater)
     * @returns {string}
     */
    getEndAnchor = () => {
        if((this.state.arrowStart%3) > (this.state.arrowEnd%3)){
            return("right")
        }
        if((this.state.arrowStart%3) < (this.state.arrowEnd%3)){
            return("left")
        }
        else{
            return("auto")
        }
    }

    /**
     * This will set an arrow based off the users choice of nodes
     */
    setArrow = () => {
        this.state.arrowStart = this.state.positions[0] * 3 + this.state.positions[1] + ""
        this.state.arrowEnd = this.state.positions[2] * 3 + this.state.positions[3] + ""
        this.state.arrows.push(<Xarrow start={this.state.arrowStart} end={this.state.arrowEnd}
                                       dashness={{animation: 2}}  headSize={5} color="black"
                                       startAnchor={this.getStartAnchor()} endAnchor={this.getEndAnchor()} ></Xarrow>)
        console.log("Arrow start Id: " + (this.state.positions[0] * 3 + this.state.positions[1]) +
            "\nArrow end Id: " + (this.state.positions[2] * 3 + this.state.positions[3]))
    }

    /**
     * This will add positional data to an array to be recorded before sent to server
     * @param row
     * @param col
     * @returns {number}
     */
    add = (row, col) =>{
        this.state.positions.push(row,col);
        if(this.state.positions.length % 4 === 0){
            this.setState({command: "Please select a starting node"})
            this.state.connections.push(this.state.positions)
            this.setArrow()
            this.setState({positions: []})
        } else {
            this.setState({command: "Please select a node to connect to"});
        }
        console.log("Positions: " + this.state.positions.toString() + "\nPosition Length: " +
            this.state.positions.length + "\nConnections: " + this.state.connections.toString() +
            "\nConnection Length: " + this.state.connections.length + "\n***********************************\n")
        return(0)
    }

    /**
     * this will get all information of the object recieved
     * @param obj
     * @returns {*[]}
     */
    getInfo = (obj) => {
        let info = [];
        for (let node in obj) {
            info.push("Node: " + node);
            for (let e in obj[node]) {
                let props = [];
                let comms = [];
                for (let event in obj[node][e]) {
                    for (let p in obj[node][e][event]) {
                        if(p === "send_receive") {
                            props.push(obj[node][e][event][p]);
                        }
                        else if(p === "other_node") {
                            comms.push(obj[node][e][event][p]);
                        }
                    }
                    info.push("Event: " + event );
                    info.push("Properties: " + props);
                    info.push("lamport:");
                    info.push("vector:");
                    info.push("Communications: " + comms.join() );
                }
            }
        }
        return info;
    }

    /**
     * this is where all elements are drawn to the screen
     * @returns {JSX.Element}
     */
    render(){
        return <div className="container">
            <h1 className="title">Interaction Page</h1>
            <div className="flexbox">
                <div className="IBlock">
                    <div className="addLittleSpace"></div>
                    <h3>{this.state.command}</h3>
                    <h6>Number of connections: {this.state.connections.length}</h6>
                    <div className="addLittleSpace"></div>
                    <div className="board">
                        <div className="addSpace"></div>
                        <div className="flexboxX">
                            <button onClick={() => this.add(0,0)} className="tileText" id={"0"}>0</button>
                            <button onClick={() => this.add(0,1)} className="tileText" id={"1"}>0</button>
                            <button onClick={() => this.add(0,2)} className="tileText" id={"2"}>0</button>
                        </div>
                        <div className="flexboxX">
                            <button onClick={() => this.add(1,0)} className="tileText" id={"3"}>0</button>
                            <button onClick={() => this.add(1,1)} className="tileText" id={"4"}>0</button>
                            <button onClick={() => this.add(1,2)} className="tileText" id={"5"}>0</button>
                        </div>
                        <div className="flexboxX">
                            <button onClick={() => this.add(2,0)} className="tileText" id={"6"}>0</button>
                            <button onClick={() => this.add(2,1)} className="tileText" id={"7"}>0</button>
                            <button onClick={() => this.add(2,2)} className="tileText" id={"8"}>0</button>
                        </div>
                        <div className="flexboxX">
                            <button onClick={() => this.add(3,0)} className="tileText" id={"9"}>0</button>
                            <button onClick={() => this.add(3,1)} className="tileText" id={"10"}>0</button>
                            <button onClick={() => this.add(3,2)} className="tileText" id={"11"}>0</button>
                        </div>
                    </div>
                    <input
                        type="text"
                        className="chartName"
                        name="chartName"
                        placeholder="Name your chart here"
                        value={this.state.chartName}
                        onChange={this.handleChange}
                    />

                    <div className="flexboxButtons">
                        <form onSubmit={this.submit}>
                            <button>Go</button>
                        </form>

                        <button className="resetButton" onClick={this.resetState}>Reset</button>

                    </div>

                </div>

                <div className="IBlock">
                    <div className="addLittleSpace"></div>
                    <h3>Information</h3>
                    <h3 className="colTitle">Connections:</h3>
                    <div className="conn"> {
                        this.state.connections.map((arrValue,arrIndex) => {
                            return(
                                <li key={arrIndex}>
                                    {this.separate(arrValue)}
                                </li>
                            )
                        })
                    }

                    </div>
                    <div className="colTitle">Chart Name: {this.state.chartName}</div>
                    <div className="diagramFormat">
                        <h5 className="titles">Diagram: </h5>
                        <h5 className="titles">Results: </h5>
                    </div>
                    <div className="diagramFormat">
                        <div className="leftcol">{
                            this.getInfo(this.state.diagram).map((arrValue,arrIndex) => {
                                if(arrValue.toString().includes('Node:')){
                                    return (
                                        <div style={{textAlign: 'center', fontWeight: 'bold', fontSize: '120%' }}>
                                            {arrValue}
                                        </div>
                                    )
                                }
                                if(arrValue.toString().includes('Event:')){
                                    let ev = arrValue.slice(7).toString();
                                    return (
                                        <div>
                                            <div style={{fontSize: '115%' }}>
                                                {arrValue}
                                            </div>
                                            <div style={{paddingLeft: '20px' }}>
                                                <label htmlFor="lamport">Lamport Clock:  </label>
                                                <input
                                                    type="text"
                                                    id={"l"+arrIndex.toString()}
                                                    style={{width: '80px', height: '30px', marginLeft: '5px'}}
                                                    name= {ev}
                                                    placeholder="ex, '1A'"/>

                                                <button id={"l"+arrIndex.toString()} onClick={this.testLamp} style={{marginLeft: '10px', height: '30px'}}>Test</button>
                                                <span style={{marginLeft: '10px'}} id={"displayl"+arrIndex.toString()}></span>

                                            </div>
                                            <div style={{paddingLeft: '20px' }}>
                                                <label htmlFor="vector">Vector Clock:  </label>
                                                <input
                                                    type="text"
                                                    id={"v"+arrIndex.toString()}
                                                    style={{width: '80px', height: '30px', marginLeft: '5px'}}
                                                    name= {ev}
                                                    placeholder="ex, '1,1,1'"/>
                                                <button id={"v"+arrIndex.toString()} onClick={this.testVector} style={{marginLeft: '10px', height: '30px'}}>Test</button>
                                                <span style={{marginLeft: '10px'}} id={"displayv"+arrIndex.toString()}></span>
                                            </div>
                                        </div>
                                    )
                                }
                                if(arrValue.toString().includes('Communications:')){
                                    return (
                                        <div style={{paddingLeft: '20px' }}>
                                            {arrValue}
                                        </div>
                                    )
                                }
                                if(arrValue.toString().includes('Properties:')){
                                    return (
                                        <div style={{paddingLeft: '20px' }}>
                                            {arrValue}
                                        </div>
                                    )
                                }
                            })
                        }
                        </div>
                        <div className="rightcol">
                            {
                                this.state.results.map((arrValue, arrIndex) => {
                                    let label;
                                    let color;

                                    switch (arrIndex) {
                                        case 0:
                                            label = 'FIFO';
                                            break;
                                        case 1:
                                            label = 'Causal';
                                            break;
                                        case 2:
                                            label = 'Total Order';
                                            break;
                                        case 3:
                                            label = 'FIFO Total Order';
                                            break;
                                        default:
                                            break;
                                    }

                                    color = arrValue ? 'green' : 'red';

                                    return (
                                        <div>
                                            {label}:
                                            <div style={{ color: color }}>
                                                {arrValue.toString()}
                                            </div>
                                        </div>
                                    );
                                })
                                }
                        </div>
                    </div>
                </div>
                <div>
                    {this.state.arrows}
                </div>

            </div>
        </div>
    }
}

//<img className='picSize' src='/images/timing-default.png' />
//<Xarrow start={"0"} end={"2"} headSize={5} color="black" ></Xarrow>
//<Xarrow start={"0"} end={"4"} headSize={5} color="black" ></Xarrow>
//<Xarrow start={"5"} end={"10"} headSize={5} color="black" ></Xarrow>
export default Interaction;