import React, { Component } from 'react';
import {Spinner,Nav,NavbarBrand,Navbar,Jumbotron,Table,Card,Button,Col,Row,Container,Form,FormControl} from 'react-bootstrap'
import axios from '../axios';

class Flashcard extends Component {
    constructor() {
        super();
        this.state = {
            showMeaning : false,
            currentWord : {}
        }
    }

    componentDidMount() {
        console.log("this props")
         console.log(this.props)
        let randomIndex = Math.floor((Math.random() * this.props.words.length) + 0)
        let randomWord = this.props.words[randomIndex]
        this.setState({currentWord : randomWord},()=>{
            console.log(this.state)
        })

    }


    render() {
        const meaningFlipHandler = () => {
            this.setState({showMeaning : true},()=>{
                console.log(this.state)
            })
        }

        const nextHandler = () =>{
            let randomIndex = Math.floor((Math.random() * this.props.words.length) + 0)
            let randomWord = this.props.words[randomIndex]
            this.setState({currentWord : randomWord,showMeaning:false},()=>{
                console.log(this.state)
            })
        }

        const responseHandler = async (response) =>{
            //0 is incorrect
            //1 is correct
           await axios.post("/responseHandler" ,{response:response,word:this.state.currentWord}).then((response) => {
               console.log(response)
               if(response.data.status === "success"){
                   nextHandler()
               }
            }, (error) => {
                console.log(error);
            });
        }


        let meaning = (
            <div>
            </div>
        )

        let showMeaningButton = (
            <Button onClick={meaningFlipHandler}>Click to see meeaning</Button>
        )

        let correctButton = (
            <div></div>
        )

        let incorrectButton = (
            <div></div>
        )

        if (this.state.showMeaning === true) {
            meaning = (
                <Card.Subtitle style={{fontSize: 30}} className="mb-2 text-muted">
                    {this.state.currentWord.meaning}
                </Card.Subtitle>
            )
            showMeaningButton = (
                <div></div>
            )

            correctButton = (
                <Button onClick={() => responseHandler("correct")}>Correct</Button>
            )

            incorrectButton = (
                <Button onClick={() => responseHandler("incorrect")}>Incorrect</Button>
            )

        }


        return (
            <div>
                <Card style={{width: '100%', height: '100%', textAlign: "center"}}>
                    <Card.Body>
                        <strong><Card.Title style={{fontSize: 70}}>{this.state.currentWord.word}</Card.Title></strong>
                        {showMeaningButton}
                        {meaning}
                        {correctButton} {incorrectButton}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}


export default Flashcard;