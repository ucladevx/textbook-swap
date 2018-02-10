import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';

import NavBar from '../components/navbar';
import Footer from '../components/footer';
import goat_logo from "../img/goat.jpeg";

class TradingGuide extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="App">
            	<div class="row">
            		<div class="col-md-6">
            			<div class="row">
            				<h1>Loop Trading</h1>
            			</div>
            			<div class="row">
            				<h3>What is loop? </h3>
            				<p>
            					Loop is an innovative way for students to swap textbooks! For example, 
            					<ul> 
            						<li>You have book A, but want book B </li>
            						<li>John has book B, but wants book C </li>
            						<li>Terry has book A, but wants book A </li>
            					</ul>
            					Loop will make use of it's state of the art 
            				</p>
            			</div>
            		</div>
            		<div class="col-md-6">
            			image <br/>
            			<img src={goat_logo}/>
            		</div>
            	</div>
            	<div class="row">
            		<h2>How it works</h2>
            		<div class="row">
            			<div class="col-md-6">
            				1. Choose what book you are willing to trade. You can search by title, ISBN, author,
class name, or professor name
            			</div>
            			<div class="col-md-6">
            				Animation <br/>
            				<img src={goat_logo}/>
            			</div>
            		</div>
            		<div class="row">
            			<div class="col-md-6">
             				Animation <br/>
            				<img src={goat_logo}/>
            			</div>
            			<div class="col-md-6">
            				2.  Choose the books you would be willing to receive a one​ ​to​ ​one​ swap for the
book you chose in step 1
            			</div>
            		</div>
            		<div class="row">
            			<div class="col-md-6">
            				3. Submit these preferences - don’t worry, these can be edited later!
            			</div>
            			<div class="col-md-6">
	           				Animation <br/>
            				<img src={goat_logo}/>

            			</div>
            		</div>
            		<h3> How to get books </h3>
            		Once Loop detects a possible trade circle, the following will happen:
            		<ol>
						<li>You will get an email notification that a potential trade circle was formed</li>
						<li>On the Loops webpage, we will show what book you will receive in exchange for
						the book you are giving up</li>
						<li>Then, you can choose to accept or decline the trade - everyone​ ​in​ ​the​ ​trade
						circle​ ​must​ ​accept​ ​for​ ​the​ ​trade​ ​to​ ​go​ ​through</li>
						<li>If everyone accepts, you will be put in a group email with the rest of the members
						of the trade circle, and can facilitate the trade from there</li>
					</ol>
            	</div>

            </div>
        )
    }
}

export default connect(null)(withRouter(TradingGuide))
