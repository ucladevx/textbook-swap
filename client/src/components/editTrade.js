import React, { Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
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

class EditTrade extends Component{

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
        this.cancelTrade = this.cancelTrade.bind(this)
        this.tradeCallback = this.tradeCallback.bind(this)

        this.state = {
            page: {
                option: "trade",
                screen: 1
            },
            offer: this.props.offer,
            want: this.props.want,
            newWant: this.props.want
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
            newWant: value
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
    
    cancelTrade(){
        this.setState({
            newWant: this.state.want,
            page: {
                option: "trade",
                screen: 1
            }
        })
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
    
    tradeCallback(){
        var booksAdd = this.state.newWant
        var j = 1;
        var total = booksAdd.length
        console.log("REACHED CALLBACK")
        booksAdd.forEach((book) => {
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

                if (j === total){
                    console.log("done...")
                    window.location.reload();
                }
                else {
                    j++
                }
            })
            .catch((e) => console.log(e))
        })
    }
    // CHANGE THIS
    createTrade(){
        // POST...
        
        var booksRemove = this.state.want
        var l = booksRemove.length
        var i = 1
        
        booksRemove.forEach((book) => {
            console.log("Book:", book, "i:", i)
            axios.post(ROOT+'/api/possible_trades/remove', {
                 user_id: "user",
                 owned_book_id: this.state.offer.book_id,
                 wanted_book_id: book.book_id
                })
                .then((data) => {
                    if(data.status === 0){
						console.log('successfully removed wanted book from possible_trades');
					}
					else if(data.status === 1)
						console.log('db connection error for removing from possible_trades');
					else if(data.status === 2)
						console.log('db query error for removing from possible_trades');
					else if(data.status === 3){
						console.log('wanted book already removed');
				    }
                    i++
                    if (i === l){
                        this.tradeCallback()
                    }   
            })
    })
}

    getChild(page){
        var option = page.option
        var screen = page.screen

        if (option === "trade"){
            switch (page.screen){
                case 2:
                    return (
                        <div className="formContents">
                            <h1 className="formTitle">EDIT TRADE</h1>
                            <h3 className="formMessage">Modify the books you want to add to your trades.</h3>
                            <div className="searchBoxAndResults">
                                <SearchBox
                                    onChange={this.processWant}
                                    multi={true}
                                    initState={this.state.want}
                                />

                                <div className="searchResults">
                                    {
                                        this.state.want != null &&
                                        <Summary books={this.state.newWant} multi={true}></Summary>
                                    }
                                </div>
                            </div>
                            <div className="transitionButtonRow">
                                {/*NEED TO SAVE PREVIOUS STATE TO ENABLE CANCEL...*/}
                                <button className="formPrev" onClick={()=>this.cancelTrade()}>CANCEL</button>
                                {
                                    this.state.want != null &&
                                    this.state.want != this.state.newWant &&
                                    <button className="formNext" onClick={()=>this.createTrade()}>SUBMIT</button>
                                }
                            </div>
                        </div>
                    )
                case 1:
                     return (
                         <div className="formContents">
                            <h1 className="formTitle">TRADE INFO</h1>
                            <div className='confirmTradeContainer'>
                                <div className='confirmTradeLeft'>
                                    <h5> Offered Book </h5>
                                    <div className="ownedBookSummary">
                                        <Summary books={this.state.offer} multi={false}/>
                                    </div>
                                </div>
                                <div className='confirmTradeRight'>
                                    <h5> Wanted Books </h5>
                                    <MinSummary books={this.state.want}/>
                                </div>
                            </div>
                            <div className="transitionButtonRow">
                                <button className="formPrev" onClick={()=>this.setPage({option, screen: 2})}>EDIT TRADE</button>
                                <button className="formNext" onClick={()=>console.log("DELETE TRADE ROUTE")}>DELETE</button>
                            </div>
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

export default (withRouter(EditTrade))

/*
NOTES:
- we should add an option for when the book you want is not in the database, a custom book input of sorts
*/
