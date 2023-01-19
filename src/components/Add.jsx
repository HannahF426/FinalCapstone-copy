/*************************************************************************
 * This page is not used in our project but was used as a stepping stone
 * This may contain useful information about how some parts of the
 *      project's functionality for later use
 ************************************************************************/


import React, {useEffect, useState} from "react";
import axios from 'axios';
import './Add.css';

class Add extends React.Component{

    state = {
        title: '',
        body: '',
        testPost: []
    };

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    };

    submit = (event) => {
        event.preventDefault();

        const payload = {
            title: this.state.title,
            body: this.state.body
        }

        axios({
            url: 'http://localhost:3050/api/save',
            method: 'POST',
            data: payload
        }).then(() => {
            console.log("Data has been sent to the server");
            this.resetUserInputs();
        }).catch(() =>{
            console.log("Something went wrong sending data to server")
        });
    };

    resetUserInputs = () => {
        this.setState({
            title: '',
            body: ''
        });
    }
///////////////////////

    componentDidMount = () => {
        this.getTest();
    }

    displayTest = (testPost) => {
        if (!testPost.length) return null;
        return testPost.map((testPost, index) => (
            <div key={index} className="testPost">
                <h3>{testPost.title}</h3>
                <p>{testPost.body}</p>
            </div>
        ));
    }

    getTest = () => {
        axios.get('http://localhost:3050/api/test')
            .then((response) => {
                const data = response.data;
                this.setState({ testPost: data })
                console.log('Data has been received from server')
            })
            .catch(() => {
                console.log('Problem retrieving data from server')
            });
    }


////////////////////////
    render(){
        
        console.log("State: ", this.state);
        
        return <div className="container">

            <form onSubmit={this.submit}>
                <div className="form-input">
                    <input 
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={this.state.title}
                    onChange={this.handleChange}
                    />
                </div>

                <div className="form-input">
                    <textarea 
                    placeholder="body" 
                    name="body" 
                    cols="30" 
                    rows="10" 
                    value={this.state.body} 
                    onChange={this.handleChange}
                    ></textarea>
                </div>

                <button>Submit</button>

            </form>

            {this.displayTest(this.state.testPost)}

        </div>
    }
}
export default Add;