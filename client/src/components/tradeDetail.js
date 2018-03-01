import React, {Component} from 'react'
import {connect} from 'react-redux'
import SweetAlert from 'sweetalert-react';

import CardDetailView from '../microcomponents/cardDetailView'

import '../styles/tradeDetail.css'
import '../styles/vendors/sweetalert.css'

import Loop from '../new_images/loop_black.png'
import Tick from '../new_images/tick_black.png'
import HalfLoop from '../new_images/halfLoop_black.png'

import axios from 'axios'
const ROOT = 'http://localhost:3000'
axios.defaults.withCredentials = true;

class TradeDetail extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            trade: null,
            acceptAlert: false,
            rejectAlert: false
        }
        this.generateDetail = this.generateDetail.bind(this)
        this.getTrade = this.getTrade.bind(this)
        this.getTrade()
    }
    
    getTrade(){
        var owned_book = this.props.bookHave.book_id
        axios.get(ROOT+'/api/found_trades/get_trade_by_book_owned', {
            params: {
                owned_book
            }
        })
        .then((res) => {
            console.log(res)
            if (res.status === 0){
                this.setState({
                    trade: res.data.data[0]
                })
            }
        })
    }
    
    acceptTrade(){
        var trade = this.state.trade
        if (!trade) return
        
        axios.post(ROOT+'/api/found_trades/update_status_accepted', {
            trade_id: trade.id,
            owned_book: trade.book_have, 
            target_user: trade.target_id, 
            wanted_book: trade.book_want
        })
        .then((res) => {
            window.location.reload();
        })
    }
    
    rejectTrade(){
        var trade = this.state.trade
        if (!trade) return

        axios.post(ROOT+'/api/found_trades/update_status_rejected', {
            trade_id: trade.id,
            owned_book: trade.book_have, 
            target_user: trade.target_id, 
            wanted_book: trade.book_want
        })
        .then((res) => {
            window.location.reload();
        })
    }
    
    generateDetail(){
        var page = this.state.page
        if (page === 0){
            return (
                <div className="tdDetailContents">
                    <div className="tdDetailContainer">
                        <div className="tdLeft">
                            <CardDetailView book={this.props.bookHave}></CardDetailView>
                        </div>
                        <div className="tdCenter">
                            <img src={Loop} className="tdImage"></img>
                        </div>
                        <div className="tdRight">
                            <CardDetailView book={this.props.bookWant}></CardDetailView>
                        </div>
                    </div>
                    <div className="tdButtonRow">
                        <button onClick={()=>this.setState({rejectAlert: true})} className="rejectButton">REJECT</button>
                        <button onClick={()=>this.setState({acceptAlert: true})} className="acceptButton">ACCEPT</button>
                        <SweetAlert
                            show={this.state.acceptAlert}
                            type="warning"
                            title="Are you sure you want to accept the trade?"
                            text="You will be emailed trade details once all members of the loop have confirmed!"
                            cancelButtonText="Cancel"
                            confirmButtonText="Accept Trade"
                            showCancelButton
                            onConfirm={() => {
                              console.log('confirm');
                              this.acceptTrade()
                            }}
                            onCancel={() => {
                              console.log('cancel');
                              this.setState({ acceptAlert: false });
                            }}
                            onEscapeKey={() => this.setState({ acceptAlert: false })}
                            onOutsideClick={() => this.setState({ acceptAlert: false })}
                        />
                        <SweetAlert
                            show={this.state.rejectAlert}
                            title="Are you sure you want to reject the trade?"
                            text="If you still would like to trade this book, please add it again."
                            type="warning"
                            showCancelButton
                            cancelButtonText="Cancel"
                            confirmButtonText="Reject Trade"
                            confirmButtonColor="#DD6B55"
                            onConfirm={() => {
                              console.log('confirm');
                              this.rejectTrade()
                            }}
                            onCancel={() => {
                              console.log('cancel');
                              this.setState({ rejectAlert: false });
                            }}
                            onEscapeKey={() => this.setState({ rejectAlert: false })}
                            onOutsideClick={() => this.setState({ rejectAlert: false })}
                        />
                    </div>
                </div>
            )
        }
        if (page === 1){
            return (
                <div className="tdDetailContents">
                    <div className="tdDetailTextContainer">
                        <h3>Are you sure you want to reject the trade?</h3>
                    </div>
                    <div className="tdButtonRow">
                        <button onClick={()=>this.setState({page: 0})} 
                            className="rejectButton">No... Take me back</button>
                        <button className="acceptButton">Yes</button>
                    </div>
                </div>
            )
        }
        if (page === 2){
            return (
                <div className="tdDetailContents">
                    <div className="tdDetailTextContainer">
                        <h3>Are you sure you want to accept the trade?</h3>
                        <h3>You will be emailed the details of the other members in your trade loop on confirmation.</h3>
                    </div>
                    <div className="tdButtonRow">
                        <button onClick={()=>this.setState({page: 0})} className="rejectButton">No... Take me back</button>
                        <button className="acceptButton">Yes</button>
                    </div>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div className="tdContainer">
                <div className="tdTitle">MATCHED TRADE</div>
                {
                    this.generateDetail()
                }
            </div>
        )
    }
}

export default TradeDetail