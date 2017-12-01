import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'

import '../styles/form.css'
import '../styles/vendors/buttons-core.css'
import '../styles/vendors/buttons.css'

class Form extends Component{
    constructor(props){
        super(props)
        
        this.getChild = this.getChild.bind(this)
        this.setPage = this.setPage.bind(this)
    
        this.state = {
            page: 0
        }
    }
    
    setPage(page){
        this.setState({
            page
        })
    }
    
    getChild(page){
        if (page === 0){
            return (
                    <div>
                        <h1>Create a Trade</h1>
                        <button className="formButton" onClick={()=>this.setPage({option: "trade", screen: 1})}>
                            I want to trade a textbook  
                        </button>
                        <button className="formButton" onClick={()=>this.setPage({option: "buy", screen: 1})}>
                            I want to buy a textbook  
                        </button>
                        <button className="formButton" onClick={()=>this.setPage({option: "sell", screen: 1})}>
                            I want to sell a textbook 
                        </button>
                    </div>
            )
        }
        
         if (page === 1){
            return (
                    <div>
                        <h1>Trade Created, Remove Me</h1>
                    </div>
            )
        }
        
        var option = page.option
        var screen = page.screen
        
        if (option === "trade"){
            switch (page.screen){
                case 1:
                    return (
                        <div>Pick a book to offer
                            <button onClick={()=>this.setPage(0)}>Prev</button>
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                        </div>
                    )
                case 2:
                     return (
                         <div>Confirm book
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                         </div>
                     )
                case 3:
                    return (
                        <div>Pick the book you want to obtain
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                        </div>
                    )
                case 4:
                     return (
                         <div>Confirm
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            <button onClick={()=>this.setPage(1)}>Done</button>
                         </div>
                     )
            }
        }
        
        if (option === "buy"){
            switch (page.screen){
                case 1:
                    return (
                        <div>Pick a book to buy
                            <button onClick={()=>this.setPage(0)}>Prev</button>
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                        </div>
                    )
                case 2:
                     return (
                         <div>Confirm book
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                         </div>
                     )
                case 3:
                    return (
                        <div>Pick the price you can pay
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                        </div>
                    )
                case 4:
                     return (
                         <div>Confirm
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            <button onClick={()=>this.setPage(1)}>Done</button>
                         </div>
                     )
            }
        }
        
        if (option === "sell"){
            switch (page.screen){
                case 1:
                    return (
                        <div>Pick a book to sell
                            <button onClick={()=>this.setState({page:0})}>Prev</button>
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                        </div>
                    )
                case 2:
                     return (
                         <div>Confirm book
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                         </div>
                     )
                case 3:
                    return (
                        <div>Pick the price you want to sell at
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                        </div>
                    )
                case 4:
                     return (
                         <div>Confirm trade
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            <button onClick={()=>this.setState({page:1})}>Done</button>
                         </div>
                     )
            }
        }

    }

    render(){
        return (
            <div className="App">
              <div className="form-container">
                    {this.getChild(this.state.page)}
              </div>
            </div>
        )
    }
}

export default connect(null)(withRouter(Form))
