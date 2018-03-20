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
import accept_trade from "../img/accept-trade.gif";
import reject_trade from "../img/reject-trade.gif";

import '../styles/tradingGuide.css'

class TradingGuide extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="App">
                <div className = "guide">
                	<div className="container-fluid initial_info">
                        <h1 id='loop_title' >Loop Trading Guide</h1>
                		<div className="row what_is_loop">
                			<div className="col-md-6">
                                <div className="trade_desc">
                    				<h2>What is Loop? </h2>
                    				<p >
                    					Loop is an innovative way for students to trade textbooks! 
                                        Users pick what textbooks they want and what they're willing 
                                        to trade for them, and our algorithm will do the rest. <br/><br/>
                                        For example, <br />
                    					&emsp; You have book A, but want book B.  <br />
                    					&emsp; John has book B, but wants book C. <br />
                    					&emsp; Terry has book C, but wants book A. <br />
                    					<br />
                                        By comparing the book lists of all of our users, Loop uses a 
                                        sophisticated algorithm to automatically generates the smartest
                                        trade circles that maximize the number of people who get what they want,
                                        with almost no effort involved on the part of the user.
                                        <br /><br />
                                        People who get matched up with a trade can then meet up in person to complete the exchange.

                    				</p>
                                </div>
                			</div>
                            <div className="col-md-6 loop_anim">
                                <img src={loop_anim}/>
                            </div>
                		</div>
                	</div>
                </div>
                <div className="how_works">
                	<div className="container-fluid">
                		<h2>How Do I Create a New Trade?</h2>
                		<div className="row">
                			<div className=" descr col-md-6">
                				<h3>Step 1: Choose the book you are willing to offer. </h3>
                                <p> You can search by title, ISBN, author,
    class name, or professor name. </p>
                			</div>
                			<div className="col-md-6">
                				<img className='step' src={step1}/>
                			</div>
                		</div>
                		<div className="row next_step step_2">
                			<div className="col-md-6">
                				<img className='step' src={step2}/>
                			</div>
                			<div className="descr col-md-6">
                				<h3>Step 2:  Choose the book(s) you want to receive in return. </h3>
                                <p> You can select multiple books that you would like to potentially receive in return. However, our trading algorithm will only find one-to-one swaps, so you will only receive one of your wanted books in return. </p>
                			</div>
                		</div>
                		<div className="row next_step">
                			<div className="col-md-6 descr">
                				<h3>Step 3: Confirm and submit the trade. </h3>
                                <p> 
                                    The trade will be added to your bookshelf. You can modify the trade anytime by clicking on the trade card on the bookshelf and editing the books you want to receive in return, or you can also delete the trade completely. Our trade matching algorithm is run every night, and we will send you an email once a trade is found!
                                 </p>
                			</div>
                			<div className="col-md-6">
                				<img className='step' src={step3}/>
                            </div>
                		</div>
                	</div>
                </div>
                <div className="what_happens_next">
                    <div className="container-fluid">
                        <h2>What Happens Next?</h2>
                        <div className="row">
                            <div className=" descr col-md-6">
                                <h3> <span style={{color:'#5dce53'}}>Accepting</span> a Matched Trade</h3>
                                <p> If you would like to proceed with a matched trade, then you can accept it by clicking on the trade card. After all members of the trade loop accept the matched trade, you will receive an email telling you that your trade has been completed. This email will be a group email that contains the contact information of the other people in your trade loop, so you can coordinate meeting up in person to exchange the textbooks.
                                </p>
                            </div>
                            <div className="col-md-6">
                                <img className='step' src={accept_trade}/>
                            </div>
                        </div>
                        <div className="row next_step step_2">
                            <div className="col-md-6">
                                <img className='step' src={reject_trade}/>
                            </div>
                            <div className="descr col-md-6">
                                <h3><span style={{color:'#e88154'}}>Rejecting</span> a Matched Trade</h3>
                                <p> If you no longer want to proceed with a matched trade (even after previously accepting it), then you can reject it by clicking on the trade card. If anyone in the trade loop rejects the matched trade, then the whole trade loop is broken and everyone in the trade loop is notified by email. You can click a rejected trade card to remove it from your bookshelf and if you want, later re-create it as a new trade. </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null)(withRouter(TradingGuide))
