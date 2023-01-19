import React from "react";
import axios from 'axios';
import './Information.css';

class Information extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
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
        let temp = "/images/causal-fix";
        const columnDimensions = {
            columnGap:40,
            columns: 3,
        }
        const imgSize = {
            height: 500,
            width: 900
        }

        return (
            <div>
                {
                    diagramPost.map((diagram, index) =>
                        <div key={index} className="post">
                            <h3>
                                {diagram.name.toUpperCase()}
                            </h3>

                            <div class="innerPost">

                                <img style={imgSize} className='img' src={"/images/" + diagram.name + ".png"}/>
                                <h5>Definition:</h5>
                                <p>{diagram.definition}</p>

                                <div style={columnDimensions} className="blocktext">
                                    {
                                        this.getInfo(diagram.nodes).map((subItem1, subIndex1) => (
                                            <li>{subItem1}</li>
                                        ))
                                    }
                                </div>
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
     * renders the Information page
     * @returns {JSX.Element}
     */
    render(){
        return <div className="container">
            <h1 className="title">Information Page</h1>
            <div>
                {this.displayDiagram(this.state.diagramPost)}
            </div>
        </div>
    }

}

export default Information;