import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';

import NavBar from '../components/navbar';
import Footer from '../components/footer';
import logo from "../img/logo_navbar.svg";
import step1 from "../img/step1.gif";
import step2 from "../img/step2.gif";
import step3 from "../img/step3.gif";
import loop_anim from "../img/loop-animation.gif";

import '../styles/tradingGuide.css'

class TradingGuide extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="App">
                <div class = "guide">
                	<div class="row initial_info">
                        <h1 id='loop_title' >Loop Trading Guide</h1>
                		<div class="col-md-6">
                			<div class="row">
                                <div class="trade_desc">
                    				<h2>What is loop? </h2>
                    				<p >
                    					Loop is an innovative way for students to trade textbooks! 
                                        Users pick what textbooks they want and what theyre willing 
                                        to trade for them, and our algorithm will do the rest. <br/><br/>
                                        For example, 
                    					<ul class="loop_list"> 
                    						<li>You have book A, but want book B </li>
                    						<li>John has book B, but wants book C </li>
                    						<li>Terry has book A, but wants book A </li>
                    					</ul><br />
                                        By comparing book lists of all of our users, Loop uses a 
                                        sophisticated algorithm to automatically generates the smartest
                                        trade circles that maximize the number of people who get what they want,
                                        with almost no effort involved on the part of the user.
                                        <br /><br />
                                        People who get matched up with a trade can then meet up in person to complete the exchange.

                    				</p>
                                </div>
                			</div>
                		</div>
                		<div class="col-md-6 loop_anim">
                			<img src={loop_anim}/>
                		</div>
                	</div>
                </div>
                <div class="how_works">
                	<div class="row">
                		<h2>How it works</h2>
                		<div class="row">
                			<div class=" descr col-md-4">
                				<h3>1. Choose what book you are willing to trade. </h3>
                                <p> You can search by title, ISBN, author,
    class name, or professor name </p>
                			</div>
                			<div class="col-md-8">
                				Animation <br/>
                				<img class='step' src={step1}/>
                			</div>
                		</div>
                		<div class="row next_step">
                			<div class="col-md-6">
                 				Animation <br/>
                				<img class='step' src={step2}/>
                			</div>
                			<div class="descr col-md-4">
                				<h3>2.  Choose the books you want </h3>
                                <p> You should choose the books you would be willing to receive a one​ ​to​ ​one​ swap for the
    book you chose in step 1 </p>
                			</div>
                            <div class="col-md-2"></div>
                		</div>
                		<div class="row next_step">
                			<div class="col-md-6 descr">
                				<h3> 3. Submit the trade </h3>
                                <p> 
                                    We'll send you an email once a trade is found! <br />
                                    This email will contain the contact information of the other people 
                                    involved in the trade. Reach out to them to schedule a meetup to 
                                    exhchange the books. 
                                 </p>
                			</div>
                			<div class="col-md-6">
    	           				Animation <br/>
                				<img class='step' src={step3}/>
                            </div>
                		</div>
                	</div>
                </div>
            </div>
        )
    }
}

export default connect(null)(withRouter(TradingGuide))
