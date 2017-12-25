import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import axios from 'axios'

import '../styles/form.css'
import '../styles/vendors/buttons-core.css'
import '../styles/vendors/buttons.css'

const ROOT = 'https://cors.io/?http://www.loop-trading.com'

class Form extends Component{
    constructor(props){
        super(props)
        this.getChild = this.getChild.bind(this)
        this.setPage = this.setPage.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.state = {
            page: 0,
            search: []
        }
    }

    setPage(page){
        this.setState({
            page
        })
    }
    
    createDropdown(arr){
        var res = []
        arr.forEach((book) => {
                res.push(<option value={book.title}></option>)
            })
        return res
    }

    handleSearch(e){
        var input = e.target.value
        if (input.length >= 3){
            axios.get(ROOT+'/api/search/search_textbooks?search_input='+input)
                .then((res) => {
                    var ownedBooksSet = new Set()
                    var displayList = []
                    if (res.data.status == 0){
                        var searchResults = res.data.data
                        //TODO: Clear the search result UI state
                        /*
                        console.log("Making user request")
                        axios.get(ROOT+'/api/owned_books/get_owned_cards?user_id=user')
                            .then((userData) => {
                            
                                var userBooksInfo = userData.data;
							    for (var j = 0; j < userBooksInfo.length; j++) {
								    ownedBooksSet.add(userBooksInfo[j]["book_id"]);
								    console.log(userBooksInfo[j]["book_id"]);
							     }
                            
                                for (var i = 0; i < searchResults.length; i++){
                                    var book_id = searchResults[i]["book_id"];
								    if (!ownedBooksSet.has(book_id)) {
                                        var title = searchResults[i]["title"];
									    var author = searchResults[i]["author"];
									    var isbn = searchResults[i]["isbn"];
									    var img_url = searchResults[i]["img_url"];
                                        displayList.push({title, author, isbn, img_url})
                                    }
                                }
                                this.setState({search: displayList})
                            })
                            .catch((e)=>console.log(e)) 
                        */  
                        this.setState({search: searchResults})
                    }
                })
                .catch((e)=>console.log(e))
        }
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
                        <h1>Trade Created</h1>
                        <button className="formButton" onClick={()=>this.setPage(0)}>
                            Done
                        </button>
                    </div>
            )
        }

        var option = page.option
        var screen = page.screen

        if (option === "trade"){
            switch (page.screen){
                case 1:
                    return (
                        <div className="formContents">
                            <h3>Pick a book to offer</h3>

                            <input className="formInput" type="text" list="search" placeholder="Search by title, professor or class" onChange={(e)=>this.handleSearch(e)}></input>                                
                            {this.state.search.length != 0 && <datalist id="search">{this.createDropdown(this.state.search)}</datalist>}
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

/*
NOTES:
- we should add an option for when the book you want is not in the database, a custom book input of sorts
*/