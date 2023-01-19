import React from "react";
import './Home.css';

class Home extends React.Component{

    state = {
        name:"",
        message: "Click a tab above to learn more about it!"
    }

    /**
     * Sets information box to display the purpose of the Home page
     */
    setHome = () =>{
        this.setState({
            name: "Home",
            message: "This is where you will find information about this project including main objectives and " +
                "details about the website such as information about each page."
        })
    }

    /**
     * Sets information box to display the purpose of the Information page
     */
    setInformation = () =>{
        this.setState({
            name: "Information",
            message: "This page pulls directly from our database and displays information such as " +
                "definitions and examples of each broadcast protocol."
        })
    }

    /**
     * Sets information box to display the purpose of the Test Your Knowledge page
     */
    setTestYourKnowledge = () =>{
        this.setState({
            name: "Test Your Knowledge",
            message: "This page give the user a randomly picked image of a broadcast protocol and the user is to" +
                " choose from a list of options of which protocol this is. In doing so, the page will give " +
                "a notification to the user whether or not their answer was correct and the next image will " +
                "be displayed."
        })
    }

    /**
     * Sets information box to display the purpose of the Try It Yourself page
     */
    setTryItYourself = () =>{
        this.setState({
            name: "Try It Yourself",
            message: "This is our user interaction page where the user can make diagrams by connecting nodes. These " +
                "charts can be named and sent to our database to be saved and analyzed by our server. This analyzed " +
                "data is then sent back to the front end and displayed on the right in our \"Information\" " +
                "side. This contains data on what kind of protocol this is (if one at all), connections and the " +
                "chart name given by the user."
        })
    }

    /**
     * This is where all the elements on the screen are rendered
     *
     * @returns {JSX.Element}
     */
    render() {
        return <div className="container">
            <article>
                <h1 className="title">Home Page</h1>
                <div className="home">
                    <h3>About</h3>
                    <h5>
                        Each of the website's four tabs are explained by a button below
                    </h5>
                    <div className="flexbox">
                        <div className="dropDownBox" onClick={this.setHome}>
                            <p>Home</p>
                        </div>
                        <div className="dropDownBox" onClick={this.setInformation}>
                            <p>Information</p>
                        </div>
                        <div className="dropDownBox" onClick={this.setTestYourKnowledge}>
                            <p>Test Your Knowledge</p>
                        </div>
                        <div className="dropDownBox" onClick={this.setTryItYourself}>
                            <p>Try It Yourself</p>
                        </div>
                    </div>
                    <div className="home">
                        <h4>{this.state.name}</h4>
                        <p>{this.state.message}</p>
                    </div>


                    <h3 className="title"></h3>
                    <h3 className="title"></h3>
                    <h3 className="title">Objectives</h3>
                    <div className="home">
                        <p>
                            This website is designed as a visual learning tool to help further the understanding of the
                            various broadcast protocols, along with correct implementation of Lamport clocks and vector
                            clocks in a meaningful and fun way.
                        </p>
                        <p>
                            We have fully implemented the MERN stack, seamlessly querying our backend database (MongoDB) and
                            processing these queries using Express as well as Node.js. These come together with our front
                            end to visually represent them using React.js. Below is a visual representation of how each
                            element of our project fit together to fill the structure of the MERN Stack.
                        </p>
                        <img className='image' src={"/images/MERN.png"}/>
                    </div>


                </div>
            </article>
        </div>
    }
}

export default Home;