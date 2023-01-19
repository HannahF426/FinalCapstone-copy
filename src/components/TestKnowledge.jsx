import React from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TestKnowledge.css';
import Xarrow from "react-xarrows";
import Interaction from "./Interaction";
import {useRouteMatch} from "react-router-dom";


class TestKnowledge extends React.Component {

    state = {
        currentImg: "/images/FIFO.png",
        imgID: -1
    };


    /**
     * This generates a random number based on the number range given
     *
     * @param min
     * @param max
     * @returns {*}
     */
    randomNumberInRange = (min, max) => {
        // get number between min (inclusive) and max (inclusive)
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * This sets the image state to a random image
     */
    randomImage = () =>{
        let tempNum = this.randomNumberInRange(0,4)
        console.log("Random number: " + tempNum)
        //this.setState({currentImg: "/images/causal.png"})

        if(tempNum === 0){
            this.setState({currentImg: "/images/diagrams/no_label/causal.png"})
            this.state.imgID = 0
        }
        else if(tempNum === 1){
            this.setState({currentImg: "/images/diagrams/no_label/FIFO.png"})
            this.state.imgID = 1
        }
        else if(tempNum === 2){
            this.setState({currentImg: "/images/diagrams/no_label/FIFOtotalorder.png"})
            this.state.imgID = 2
        }
        else if(tempNum === 3){
            this.setState({currentImg: "/images/diagrams/no_label/happens-before.png"})
            this.state.imgID = 3
        }
        else{
            this.setState({currentImg: '/images/diagrams/no_label/total-order.png'})
            this.state.imgID = 4
        }
    }

    /**
     * checks whether the user got the question right or wrong and displays the correct notification accordingly
     *
     * @param num
     */
    getAnswer = (num) => {
        if(num === this.state.imgID){
            toast.success('Correct!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }else{
            toast.error('Incorrect', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

        this.randomImage()
    }

    render(){

        const size = {
            height: 550,
            width: 550
        }

        // on load chooses a random diagram to start with
        return <div className="container" onLoad={this.randomImage}>

            <h1 className="title">Test Your Knowledge</h1>

            <h4 className="questionText">What diagram is this?</h4>

            <ToastContainer />

            <div className="flexbox">

                <div className="IBlockTest" >

                    <img style={size} className="image" src={this.state.currentImg}/>

                </div>

                <div className="IBlockTest">

                    <p className="testText" onClick={() => {this.getAnswer(0)}}>Causal</p>
                    <p className="testText" onClick={() => {this.getAnswer(1)}}>FIFO</p>
                    <p className="testText" onClick={() => {this.getAnswer(2)}}>FIFO Total Order</p>
                    <p className="testText" onClick={() => {this.getAnswer(3)}}>Happens Before</p>
                    <p className="testText" onClick={() => {this.getAnswer(4)}}>Total Order</p>

                </div>

            </div>
        </div>

    }
}

export default TestKnowledge;