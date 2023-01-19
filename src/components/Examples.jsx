/*************************************************************************
 * This page is not used in our project but was used as a stepping stone
 * This may contain useful information about how some parts of the
 *      project's functionality for later use
 ************************************************************************/

import React from "react";
import axios from 'axios';
import './Examples.css';

class Examples extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            title: '',
            body: '',
            name: '',
            nodes: {
                A: {
                    events: {
                        a: {
                            lamport: '',
                            vector: '',
                            send_receive: '',
                            other_node: ['', '']
                        },
                        b: {
                            lamport: '',
                            vector: '',
                            send_receive: '',
                            other_node: ['', '']
                        },
                        c: {
                            lamport: '',
                            vector: '',
                            send_receive: '',
                            other_node: ['', '']
                        }
                    }
                },
                B: {
                    events: {
                        d: {
                            lamport: '',
                            vector: '',
                            send_recieve: '',
                            other_node: ['', '']
                        },
                        e: {
                            lamport: '',
                            vector: '',
                            send_recieve: '',
                            other_node: ['', '']
                        },
                        f: {
                            lamport: '',
                            vector: '',
                            send_recieve: '',
                            other_node: ['', '']
                        }
                    }
                },
                C: {
                    events: {
                        g: {
                            lamport: '',
                            vector: '',
                            send_recieve: '',
                            other_node: ['', '']
                        },
                        h: {
                            lamport: '',
                            vector: '',
                            send_recieve: '',
                            other_node: ['', '']
                        },
                        i: {
                            lamport: '',
                            vector: '',
                            send_recieve: '',
                            other_node: ['', '']
                        }
                    }
                }
            },
            definition: '',
            testPost: [],
            diagramPost: []
        }
    }

    componentDidMount = () => {
        this.getDiagram();
    }

    getTest = () => {
        axios.get('http://localhost:3050/api')
            .then((response) => {
                const data = response.data;
                this.setState({ testPost: data })
                console.log('Data has been received from server')
            })
            .catch(() => {
                console.log('Problem retrieving data from server')
            });
    }

    displayTest = (testPost) => {
        if (!testPost.length) return null;
        return testPost.map((testPost, index) => (
            <div key={index} className="post">
                <h3>{testPost.title}</h3>
                <p>{testPost.body}</p>
            </div>
        ));
    }

    /**
     * Retrieves the diagrams from the api
     */
    getDiagram = () => {
        axios.get('http://localhost:3050/api')
            .then((response) => {
                const data = response.data;
                this.setState({ diagramPost: data })
                console.log('Data has been recieved from server')
            })
            .catch(() => {
                console.log('Problem retrieving data from server')
            });
    }

    /**
     * this function displays the information about each diagram
     *
     * @param diagramPost - this is the diagrams received from mongo
     * @returns {JSX.Element|null} - Elements to be rendered
     */
    displayDiagram = (diagramPost) => {
        if (!diagramPost.length) return null;
        let temp = "";

        return (
            <div>
                {
                    diagramPost.map((diagram, index) =>
                        <div key={index} className="post">
                            <h3>
                                {diagram.name.toUpperCase()}
                            </h3>
                            <div className="postScroll">
                                {
                                    this.getInfo(diagram.nodes).map((subItem1, subIndex1) => (
                                        <li>{subItem1}</li>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }

    /**
     * This function is a helper method for displaying the diagrams, this iterates through the data and returns an array
     * with all the information in the object
     *
     * @param obj - this is the nested "node" data received from mongo
     * @returns {*[]} - an array of information about each part of the node data
     */

    getInfo = (obj) => {
        const info = []
        for (let i in obj){
            for (let e in obj[i]){
                for (let j in obj[i][e]){
                    const data = []
                    for(let k in obj[i][e][j]){
                        data.push(obj[i][e][j][k])
                    }
                    info.push("Node " + i + ", Event " + e + "(" + j + "): " + data.join(""))

                }
                //info.push("Item: " + i + ", test: " + e)
            }
        }
        return info;
    }

    /**
     * renders the Example page
     * @returns {JSX.Element}
     */
    render(){
        return <div className="container">
            <h1 className="title">Examples Page</h1>
            <div>
                <h2>Diagram Posts:</h2>
                {this.displayDiagram(this.state.diagramPost)}
            </div>
        </div>
    }

}

export default Examples;