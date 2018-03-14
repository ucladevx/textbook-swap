import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import axios from 'axios'

import SearchBox from './searchBox'
import Summary from './summary'
import MinSummary from './minSummary'

import TopRightBookshelfImage from '../img/Bookshelf_NewTrade1.svg'

import '../styles/form.css'

const ROOT = 'http://www.loop-trading.com:3000'
axios.defaults.withCredentials = true;

class EditTrade extends Component{
    componentDidMount(){
        var values =  this.props.want
        
        values.forEach((book, i)=>{
             axios.get(ROOT+'/api/book_to_class/get_prof_class_info?book_id='+values[i].book_id)
            .then((res)=>{
                values[i].details = this.wrangle(res.data.data)
                if (i === values.length - 1){
                    this.setState({
                        want: values
                    })
                }
            })
            .catch((e)=>console.log(e))
        })
        
    }
    
    constructor(props){
        super(props)
        this.getChild = this.getChild.bind(this)
        this.setPage = this.setPage.bind(this)
        this.setOffer = this.setOffer.bind(this)
        this.setWant = this.setWant.bind(this)
        this.editTrade = this.editTrade.bind(this)

        this.wrangle = this.wrangle.bind(this)
        this.processOffer = this.processOffer.bind(this)
        this.processWant = this.processWant.bind(this)
        this.renderSummary = this.renderSummary.bind(this)
        this.cancelTrade = this.cancelTrade.bind(this)
        this.editTradeCallback = this.editTradeCallback.bind(this)
        this.deleteTrade = this.deleteTrade.bind(this)
        
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
        console.log("Get prof for:", values)
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
    
    editTradeCallback(){
        var booksAdd = this.state.newWant
        var j = 0;
        var total = booksAdd.length
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
                
                j++

                if (j === total){
                    window.location.reload();
                }
            })
            .catch((e) => console.log(e))
        })
    }

    editTrade(){        
        var booksRemove = this.state.want
        var l = booksRemove.length
        var i = 0
        
        if (l === 0){
            this.editTradeCallback()
        }
        
        booksRemove.forEach((book) => {
            console.log("Book:", book, "i:", i)
            axios.post(ROOT+'/api/possible_trades/remove', {
                 user_id: "user",
                 owned_book_id: this.state.offer.book_id,
                 wanted_book_id: book.book_id
                })
                .then((res) => {
                    console.log(res.data)
                    if(res.data.status === 0){
						console.log('successfully removed wanted book from possible_trades');
					}
					else if(res.data.status === 1)
						console.log('db connection error for removing from possible_trades');
					else if(res.data.status === 2)
						console.log('db query error for removing from possible_trades');
					else if(res.data.status === 3){
						console.log('wanted book already removed');
				    }
                
                    i++
                
                    if (i === l){
                        console.log("i === l, call callback")
                        this.editTradeCallback()
                    }   
            })
    })
}
    
    deleteTrade(){
        axios.post(ROOT+'/api/owned_books/remove', {
            user_id: "user",
            book_id: this.state.offer.book_id
        })
            .then((res) => {
            console.log(res.data)
            if(res.data.status === 0){
				console.log('successfully removed owned book from owned book list');
            }
            else if(res.data.status === 1){
                console.log('db connection error for removing owned book');
            }
            else if(res.data.status === 2){
                console.log('db query error for removing owned book');
            }
            else if(res.data.status === 3){
                console.log('owned book already removed');
            }
            else {
                console.log('owned book error status', res.data.status);
            }
            window.location.reload();
        })
    }

    getChild(page){
        var option = page.option

        if (option === "trade"){
            switch (page.screen){
                case 2:
                    return (
                        <div className="formContents">
                            <div className="formHeader">
                                <h1 className="formTitle">EDIT TRADE</h1>
                                <img className="topRightBookshelfImage" src={TopRightBookshelfImage}/>
                            </div>
                            <h3 className="formMessage">Modify the book(s) you want to receive.</h3>
                            <div className="searchBoxAndResults" ref="editSearchBox">
                                <SearchBox
                                    onChange={this.processWant}
                                    multi={true}
                                    initState={this.state.want}
                                />

                                <div className="searchResults">
                                    {
                                        this.state.newWant != null &&
                                        <Summary books={this.state.newWant} multi={true}></Summary>
                                    }
                                </div>
                            </div>
                            <div className="transitionButtonRow">
                                <button className="formPrev" 
                                    onClick={
                                        ()=> {
                                            this.cancelTrade();
                                            this.refs.editSearchBox.scrollTop = 0;
                                        }
                                    }
                                >
                                CANCEL
                                </button>
                                {
                                    this.state.want != null &&
                                    this.state.want != this.state.newWant &&
                                    this.state.newWant != null &&
                                    <button className="formNext" onClick={()=>this.editTrade()}>SUBMIT</button>
                                }
                            </div>
                        </div>
                    )
                case 1:
                     return (
                         <div className="formContents confirmTradePage">
                            <div className="formHeader">
                                <h1 className="formTitle">TRADE INFO</h1>
                                <img className="topRightBookshelfImage" src={TopRightBookshelfImage}/>
                            </div>
                            <h3 className="formMessage">Edit or delete this trade using the buttons below.</h3>
                            <div className='confirmTradeContainer' ref="confirmTradeContainer">
                                <div className='confirmTradeLeft'>
                                    <h4> OFFERING </h4>
                                    <div className="ownedBookSummary">
                                        <Summary books={this.state.offer} multi={false}/>
                                    </div>
                                </div>
                                <div className='confirmTradeRight'>
                                    <h4> TRADES </h4>
                                    <MinSummary books={this.state.want}/>
                                </div>
                            </div>
                            <div className="transitionButtonRow">
                                <button className="formPrev" 
                                    onClick={
                                        ()=>{
                                            this.setPage({option, screen: 2});
                                            this.refs.confirmTradeContainer.scrollTop = 0;
                                        }
                                    }
                                >
                                EDIT TRADE
                                </button>
                                <button className="formNext" onClick={()=>this.deleteTrade()}>DELETE</button>
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
