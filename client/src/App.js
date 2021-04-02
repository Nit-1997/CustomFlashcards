import React, { Component } from 'react';
import {Route,Switch} from 'react-router-dom';
import axios from './axios';
import {Spinner,Nav,NavbarBrand,Dropdown,Navbar,Jumbotron,Table,Card,Button,Col,Row,Container,Form,FormControl} from 'react-bootstrap'
import Flashcard from "./components/FlashCard"

class App extends Component {
    constructor() {
        super()
        this.state = {
           ciratio : null,
           words : null
        }
    }

    onChangeHandler = (e) => {
        this.setState({words:null},()=>{
            console.log(this.state);
        })
        this.setState({ciratio:e.target.value},()=>{
            console.log(this.state);
        })
    }

    onThresholdSetHandler = async() => {
        await axios.post("/getWords",{ciratio : this.state.ciratio}).then(response=>{
            console.log(response.data);
            this.setState({words : response.data},()=>{
                console.log(this.state)
            })
        }).catch(error => {
            console.log(error)
        });
    }

    async componentDidMount() {
        await axios.post("/getWords",{ciratio : this.state.ciratio}).then(response=>{
            console.log(response.data);
            this.setState({words : response.data},()=>{
                console.log(this.state)
            })
        }).catch(error => {
            console.log(error)
        });

    }


    render(){

        const sourceDataHandler = async () =>{
            await axios.post("/sourceDataFromCSV" ,{}).then((response) => {
                console.log(response)
                if(response.data.status === "success"){
                    console.log("Success")
                }
            }, (error) => {
                console.log(error);
            });
        }
        return (
              <div>
                  <Navbar bg="primary" variant="dark">
                      <Navbar.Brand href="#home">Custom Flashcards</Navbar.Brand>
                      <Nav className="mr-auto">
                         <Button variant="success" onClick={sourceDataHandler}>Source new data from CSV file</Button>
                      </Nav>
                      <Form inline>
                          <FormControl type="Number" placeholder="set threshold c/i ratio" className="mr-sm-2" onChange={this.onChangeHandler}/>
                          <Button variant="outline-light" onClick={this.onThresholdSetHandler}>Set</Button>
                      </Form>
                  </Navbar>
                  <div>
                      {this.state.words && (
                       <Flashcard words={this.state.words}/>
                      )}
                  </div>
              </div>
        )
    }
}

export default App;


