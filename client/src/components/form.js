import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import axios from 'axios'

import SearchBox from './searchBox'
import Summary from './summary'
import MinSummary from './minSummary'

import TopRightBookshelfImage from '../img/Bookshelf_NewTrade1.svg'

import '../styles/form.css'

const ROOT = 'http://localhost:3000'
axios.defaults.withCredentials = true;

/*
TODO:
- Autoscroll
- Relationship status, route for money trades
*/

class Form extends Component{

    constructor(props){
        super(props)
        this.getChild = this.getChild.bind(this)
        this.setPage = this.setPage.bind(this)
        this.setOffer = this.setOffer.bind(this)
        this.setWant = this.setWant.bind(this)
        this.createTrade = this.createTrade.bind(this)

        this.wrangle = this.wrangle.bind(this)
        this.processOffer = this.processOffer.bind(this)
        this.processWant = this.processWant.bind(this)
        this.renderSummary = this.renderSummary.bind(this)

        this.state = {
            page: {
                option: "trade",
                screen: 1
            },
            offer: null,
            want: null,
        }
    }

    setPage(page){
        if (page === 0) {
            this.setState({
                page: 0,
                offer: null,
                want: null
            })
        }
        else {
            this.setState({
                page
            })
        }
    }
    setOffer(value){
        this.setState({
            offer: value
        })
    }
    setWant(value){
        this.setState({
            want: value
        })
    }

    renderSummary(){
        console.log("Render Summary")
        return (
            <Summary books={this.state.offer} multi={false}></Summary>
        )
    }

    wrangle(profClassInfo){

        console.log("prof class info", profClassInfo);

        var profSet = new Set();
        var classSet = new Set();
        var profs ="";
        var classes="";
        // successful query
        // create strings of professors and classes
        for (var i = 0; i < profClassInfo.length; i++) {
            // professor name already seen
            if (!profSet.has(profClassInfo[i]["professor_name"])) {
                profs = profs + profClassInfo[i]["professor_name"] + ", ";
                profSet.add(profClassInfo[i]["professor_name"]);
            }

            // class name already seen
            if (!classSet.has(profClassInfo[i]["class_name"])) {
                classes = classes + profClassInfo[i]["class_name"] + ", ";
                classSet.add(profClassInfo[i]["class_name"]);
            }
        }

        // get rid of extraneous ", " at the end
        profs = profs.substring(0, profs.length - 2);
        classes = classes.substring(0, classes.length - 2);

        return ({
            profs, classes
        })
    }

    processOffer(value){
        if (!value) {
            this.setOffer(null)
            return
        }

        axios.get(ROOT+'/api/book_to_class/get_prof_class_info?book_id='+value.book_id)
            .then((res)=>{
                value.details = this.wrangle(res.data.data)
                this.setOffer(value)
                console.log("Set Offer", value)
            })
            .catch((e)=>console.log(e))
    }

    processWant(values){
        if (!values) {
            // hmm... should this be setWant?
            this.setOffer(null)
            return
        }
        if (values.length === 0){
            this.setWant(null)
            return
        }
        values.forEach((book, i)=>{
             axios.get(ROOT+'/api/book_to_class/get_prof_class_info?book_id='+values[i].book_id)
            .then((res)=>{
                values[i].details = this.wrangle(res.data.data)
                if (i === values.length - 1){
                    this.setWant(values)
                }
            })
            .catch((e)=>console.log(e))
        })
    }
    
    createTrade(){
        // POST...
        
        axios.post(ROOT+'/api/owned_books/add', {
            user_id: "user",
            book_id: this.state.offer.book_id
        })
            .then((res) => {
                if(res.status === 0)
                        console.log('successfully added owned book to owned_books');
                else if(res.status === 1)
                    console.log('db connection error for owned_books');
                else if(res.status === 2)
                    console.log('db query error for owned_books');
                else if(res.status === 3)
                    console.log('owned book already exists');
        })
            .catch((e)=>console.log(e))
        
        var i = 1;
        var total = this.state.want.length
        
        this.state.want.forEach((book) => {
            axios.post(ROOT+'/api/possible_trades/add', {
                user_id: "user",
                owned_book_id: this.state.offer.book_id,
                wanted_book_id: book.book_id,
                status: 'V'
            })
            .then((res) => {
                if(res.status === 0)
                        console.log('successfully added trade relation to possible_trades');
                else if(res.status === 1)
                    console.log('db connection error for possible_trades');
                else if(res.status === 2)
                    console.log('db query error for possible_trades');
                else if(res.status === 3)
                    console.log('trade relation already exists');
                
                if (i === total){
                    window.location.reload();
                    this.props.onComplete()
                }
                else {
                    i++
                }
            })
            .catch((e) => console.log(e))
        })
    }

    getChild(page){
        if (page === 0){
            return (
                    <div className="formBox">
                        <h1 className="formTitle">CREATE A TRADE</h1>
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
                            <div className="formHeader">
                                <h1 className="formTitle">NEW TRADE</h1>
                                <img className="topRightBookshelfImage" src={TopRightBookshelfImage}/>
                            </div>
                            <h3 className="formMessage">Select the book you can offer.</h3>
                                <div className="ownedBookSearchAndResults" ref="ownedBookSearch">
                                    <div>
                                        <SearchBox
                                            onChange={this.processOffer}
                                            multi={false}
                                            initState={this.state.offer}
                                        />

                                        {
                                            this.state.offer != null &&
                                            <Summary
                                                books={this.state.offer} multi={false}
                                                className="formSummary"
                                             />
                                        }
                                    </div>
                                </div>

                            <div className="transitionButtonRow">
                                {
                                    this.state.offer != null &&
                                    <button className="formNext" 
                                        onClick={
                                            ()=> {
                                                this.setPage({option, screen: screen+2});
                                                this.refs.ownedBookSearch.scrollTop = 0;
                                            }
                                        }
                                    >
                                    Next
                                    </button>
                                }

                            </div>
                        </div>
                    )
                case 2:
                     return (
                         <div className="formContents">
                             <div>
                                <h3>Confirm books offered</h3>
                                <Summary books={this.state.offer} multi={false}></Summary>
                                <div className="transitionButtonRow">
                                    <button className="formPrev" onClick={()=>this.setPage({option, screen: screen-1})}>Previous</button>
                                    <button className="formNext" onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                                </div>
                             </div>
                        </div>
                     )
                case 3:
                    return (
                        <div className="formContents wantedBooksPage">
                            <div className="formHeader">
                                <h1 className="formTitle">NEW TRADE</h1>
                                <img className="topRightBookshelfImage" src={TopRightBookshelfImage}/>
                            </div>
                            <h3 className="formMessage">Select the book(s) you want to receive in return.</h3>
                            <div className="searchBoxAndResults" ref="wantedBookSearch">
                                <SearchBox
                                    onChange={this.processWant}
                                    multi={true}
                                    initState={this.state.want}
                                    selected_offered_book={this.state.offer}
                                />

                                <div className="searchResults">
                                    {
                                        this.state.want != null &&
                                        <Summary books={this.state.want} multi={true}></Summary>
                                    }
                                </div>
                            </div>
                            <div className="transitionButtonRow">
                                <button className="formPrev" 
                                    onClick={
                                        ()=>{
                                            this.setPage({option, screen: screen-2});
                                            this.refs.wantedBookSearch.scrollTop = 0;
                                        }
                                    }
                                >
                                Previous
                                </button>
                                {
                                    this.state.want != null &&
                                    <button className="formNext" 
                                        onClick={
                                            ()=>{
                                                this.setPage({option, screen: screen+1});
                                                this.refs.wantedBookSearch.scrollTop = 0;
                                            }
                                        }
                                    >
                                    Next
                                    </button>
                                }
                            </div>
                        </div>
                    )
                case 4:
                     return (
                         <div className="formContents confirmTradePage">
                            <div className="formHeader">
                                <h1 className="formTitle">NEW TRADE</h1>
                                <img className="topRightBookshelfImage" src={TopRightBookshelfImage}/>
                            </div>
                            <h3 className="formMessage">Confirm your trade information!</h3>
                            <div className='confirmTradeContainer' ref="confirmTradeContainer">
                                <div className='confirmTradeLeft'>
                                    <h4> OFFERING </h4>
                                    <div className="ownedBookSummary">
                                        <Summary books={this.state.offer} multi={false}/>
                                    </div>
                                </div>
                                <div className='confirmTradeRight'>
                                    <h4> WANTED </h4>
                                    <MinSummary books={this.state.want}/>
                                </div>
                            </div>
                            <div className="transitionButtonRow">
                                <button className="formPrev" 
                                    onClick={
                                        ()=>{
                                            this.setPage({option, screen: screen-1});
                                            this.refs.confirmTradeContainer.scrollTop = 0;
                                        }
                                    }
                                >
                                Previous
                                </button>
                                <button className="formNext" onClick={()=>this.createTrade("TRADE")}>Create Trade</button>
                            </div>
                         </div>
                     )
            }
        }

        if (option === "buy"){
            switch (page.screen){
                case 1:
                    return (
                        <div>Pick a book to buy
                            <SearchBox
                                onChange={this.setWant}
                                multi={false}
                                initState={this.state.want}
                            />
                            <button onClick={()=>this.setPage(0)}>Prev</button>
                            {
                                this.state.want != null &&
                                <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                            }
                        </div>
                    )
                case 2:
                     return (
                         <div>Confirm book
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Previous</button>
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                         </div>
                     )
                case 3:
                    return (
                        <div>Pick the price you can pay
                            $<input
                                 type='number'
                                 value={this.state.offer != null ? this.state.offer : ""}
                                 onChange={(e)=>this.setOffer(e.target.value)}
                            />
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Previous</button>
                            {this.state.offer != null &&
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>}
                        </div>
                    )
                case 4:
                     return (
                         <div>Confirm
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Previous</button>
                            <button onClick={()=>this.createTrade("BUY")}>Create Trade</button>
                         </div>
                     )
            }
        }

        if (option === "sell"){
            switch (page.screen){
                case 1:
                    return (
                        <div>Pick a book to sell
                            <SearchBox
                                onChange={this.setOffer}
                                multi={false}
                                initState={this.state.offer}
                            />
                            <button onClick={()=>this.setState({page:0})}>Prev</button>
                            {
                                this.state.offer != null &&
                                <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                            }
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
                            $<input
                                 type='number'
                                 value={this.state.want != null ? this.state.want : ""}
                                 onChange={(e)=>this.setWant(e.target.value)}
                            />
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            {this.state.want != null &&
                            <button onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>}
                        </div>
                    )
                case 4:
                     return (
                         <div>Confirm trade
                            <button onClick={()=>this.setPage({option, screen: screen-1})}>Prev</button>
                            <button onClick={()=>this.createTrade("SELL")}>Create Trade</button>
                         </div>
                     )
            }
        }

    }

    render(){
        return (
            <div>
                    {this.getChild(this.state.page)}
            </div>
        )
    }
}

export default (withRouter(Form))

/*
NOTES:
- we should add an option for when the book you want is not in the database, a custom book input of sorts
*/
