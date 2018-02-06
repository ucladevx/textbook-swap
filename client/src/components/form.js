import React, { Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import {bindActionCreators} from 'redux';
import {userLogin} from '../actions';
import axios from 'axios'

import SearchBox from './searchBox'
import Summary from './summary'
import MinSummary from './minSummary'

import '../styles/form.css'

const ROOT = 'http://localhost:3000'
axios.defaults.withCredentials = true;

/*
TODO:
- Autoscroll
- Relationship status, route for money trades
*/

class Form extends Component{
    componentDidMount(){
        console.log("Component Did Mount");
        this.props.userLogin
    }

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
        var profSet = new Set();
        // set of classes
        var classSet = new Set();
        var profs =""
        var classes=""
        // successful query
            // create strings of professors and classes
            for (var i = 0; i < profClassInfo.length; i++) {
                // professor name already seen
                if (!profSet.has(profClassInfo[i]["professor_name"])) {
                    profs = profs + profClassInfo[i]["professor_name"] + ", ";;
                    profSet.add(profClassInfo[i]["professor_name"]);
                }

                // class name already seen
                if (!classSet.has(profClassInfo[i]["class_name"])) {
                    classes = classes + profClassInfo[i]["class_name"] + ", ";;
                    classSet.add(profClassInfo[i]["class_name"]);
                }
            // get rid of extraneous ", " at the end
            profs = profs.substring(0, profs.length - 2);
            classes = classes.substring(0, classes.length - 2);
            return ({
                profs, classes
            })
        }
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

    createTrade(type){
        // POST...
        var trade = {
            type,
            offer: this.state.offer,
            want: this.state.want
        }
        console.log("Trade Created", trade)
        console.log("Redirect...")
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
                            <h1 className="formTitle">NEW TRADE</h1>
                            <h3 className="formMessage">Select the book you can offer.</h3>
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

                            <div className="transitionButtonRow">

                                <button className="formPrev" onClick={()=>this.setPage(0)}>Previous</button>
                                {
                                    this.state.offer != null &&
                                    <button className="formNext" onClick={()=>this.setPage({option, screen: screen+2})}>Next</button>
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
                        <div className="formContents">
                            <h1 className="formTitle">NEW TRADE</h1>
                            <h3 className="formMessage">Select the book(s) you want to receive in return.</h3>
                            <div className="searchBoxAndResults">
                                <SearchBox
                                    onChange={this.processWant}
                                    multi={true}
                                    initState={this.state.want}
                                />

                                {
                                    this.state.want != null &&
                                    <Summary books={this.state.want} multi={true}></Summary>
                                }
                                <div className="transitionButtonRow">
                                    <button className="formPrev" onClick={()=>this.setPage({option, screen: screen-2})}>Previous</button>

                                    {
                                        this.state.want != null &&
                                        <button className="formNext" onClick={()=>this.setPage({option, screen: screen+1})}>Next</button>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                case 4:
                     return (
                         <div className="formContents">
                             <div>Confirm Trade
                                <div className='trade-container'>
                                    <div className='trade-left'>
                                        Books Offered
                                        <Summary books={this.state.offer} multi={false}/>
                                    </div>
                                    <div className='trade-right'>
                                        Books Wanted
                                        <MinSummary books={this.state.want}/>
                                    </div>
                                </div>
                                <div className="transitionButtonRow">
                                    <button className="formPrev" onClick={()=>this.setPage({option, screen: screen-1})}>Previous</button>
                                    <button className="formNext" onClick={()=>this.createTrade("TRADE")}>Create Trade</button>
                                </div>
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
            <div className="App">
              <div className="form-container">
                    {this.getChild(this.state.page)}
              </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({userLogin}, dispatch)
}

export default connect(mapStateToProps, userLogin)(withRouter(Form))

/*
NOTES:
- we should add an option for when the book you want is not in the database, a custom book input of sorts
*/
