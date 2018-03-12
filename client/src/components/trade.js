import React, { Component } from 'react';
//import {connect} from 'react-redux';
//import {withRouter} from "react-router-dom";
import axios from 'axios'

import SearchBox from './searchBox'
import Summary from './summary'

import '../styles/tradingGuide.css'

class Trade extends Component{
    constructor(props){
        super(props)
        
        this.setOffer = this.setOffer.bind(this)
        this.setWant = this.setWant.bind(this)
        this.processOffer = this.processOffer.bind(this)
        this.processWant = this.processWant.bind(this)
        this.wrangle = this.wrangle.bind(this)
        
        this.state = {
            offer: null,
            want: null
        }
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
        value.forEach((book, i)=>{
             axios.get('http://www.loop-trading.com/api/book_to_class/get_prof_class_info?book_id='+value[i].book_id)
            .then((res)=>{
                value[i].details = this.wrangle(res.data.data)
                if (i == value.length - 1){
                    this.setOffer(value)
                }
            })
            .catch((e)=>console.log(e))
        })
    }
    
     processWant(value){
        value.forEach((book, i)=>{
             axios.get('http://www.loop-trading.com/api/book_to_class/get_prof_class_info?book_id='+value[i].book_id)
            .then((res)=>{
                value[i].details = this.wrangle(res.data.data)
                if (i == value.length - 1){
                    this.setWant(value)
                }
            })
            .catch((e)=>console.log(e))
        })
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
    
    render(){
        return (
            <div className='trade-splash'>
                <h1>NEW TRADE</h1>
                <div className='trade-container'>
                    <div className='trade-left'>
                        <h2>Pick books to offer</h2>
                        <SearchBox
                            onChange={this.processOffer}
                            multi={true}
                            initState={this.state.offer}
                            />
                        <Summary books={this.state.offer != null ? this.state.offer : []}/>
                    </div>
                    <div className='trade-right'>
                        <h2>Pick books you want</h2>
                        <SearchBox
                            onChange={this.processWant}
                            multi={true}
                            initState={this.state.want}
                            />
                        <Summary books={this.state.want != null ? this.state.want : []}/>
                    </div>
                </div>
                {
                    this.state.offer != null && this.state.offer.length > 0 && this.state.want != null && this.state.want.length > 0 &&
                        
                    <button>Create my trade</button>
                }
            </div>
        )
    }
}

export default Trade