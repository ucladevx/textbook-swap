import React, {Component} from 'react'
import {connect} from 'react-redux'
import SweetAlert from 'sweetalert-react';

import CardDetailView from '../microcomponents/cardDetailView'

import '../styles/tradeDetail.css'
import '../styles/vendors/sweetalert.css'

import Loop from '../new_images/loop_black.png'
import Tick from '../new_images/tick_black.png'
import HalfLoop from '../new_images/halfLoop_black.png'
import request from 'request';

import axios from 'axios'
const ROOT = 'http://www.loop-trading.com'
axios.defaults.withCredentials = true;

class TradeDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            acceptAlert: false,
            rejectAlert: false,
            swal: {
              show: false,
              status: null,
              type: null,
              text: null,
              title: null,
              confirmButtonText: null,
              cancelButtonText:null,
              onConfirm: null,
              confirmButtonColor: null
          }
        }
        this.generateDetail = this.generateDetail.bind(this)
        this.getTrade = this.getTrade.bind(this)
        this.acceptTrade = this.acceptTrade.bind(this)
        this.rejectTrade = this.rejectTrade.bind(this)
        this.openSwal = this.openSwal.bind(this)
        this.handleAlert = this.handleAlert.bind(this)
        this.getTrade()
    }
    
    openSwal(type) {
        if (type === 'A'){
            this.setState({swal : {
                          show: true,
                          status: 'A',
                          type: "warning",
                          title: "Are you sure you want to accept the trade?",
                          text: "You will be emailed trade details once all members of the loop have confirmed!",
                          confirmButtonText: "Accept Trade",
                          cancelButtonText: "Cancel",
                        }})
        }
        else if (type === 'R'){
            this.setState({swal : {
                          show: true,
                          status: 'R',
                          type: "warning",
                          title: "Are you sure you want to reject the trade?",
                          text: "If you would still like to trade this book, please add it again.",
                          confirmButtonText: "Reject Trade",
                          cancelButtonText: "Back",
                          confirmButtonColor: "#DD6B55"
                        }})
        }
    }
    
    handleAlert(){
        var status = this.state.swal.status
        
        if (!status){
            return
        }
        
        if (status === 'A'){
            this.acceptTrade()
        }
        else if (status === 'R'){
            this.rejectTrade()
        }
    }

    getTrade(){
        var owned_book = this.props.bookHave.book_id
        axios.get(ROOT+'/api/found_trades/get_trade_by_book_owned', {
            params: {
                owned_book
            }
        })
        .then((res) => {
            console.log(res.data)
            if (res.data.status === 0){
                this.setState({
                    trade: res.data.data[0]
                })
            }
        })
    }

    acceptTrade(){
        console.log("ID to Accept:", this.state.trade.trade_id);
        var trade = this.state.trade
        if (!trade) return

        axios.post(ROOT+'/api/found_trades/update_status_accepted', {
            trade_id: trade.trade_id,
            owned_book: trade.book_have,
            target_user: trade.target_id,
            wanted_book: trade.book_want
        })
        .then((res) => {
            console.log(res.data);
            window.location.reload();
        })
    }

    rejectTrade(){
        var trade = this.state.trade
        if (!trade) return

        axios.post(ROOT+'/api/found_trades/update_status_rejected', {
            trade_id: trade.trade_id,
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
                            <img src={Loop} alt="Loop" className="tdImage"></img>
                        </div>
                        <div className="tdRight">
                            <CardDetailView book={this.props.bookWant}></CardDetailView>
                        </div>
                    </div>
                    <div className="tdButtonRow">
                        <button onClick={()=>this.openSwal('R')} className="rejectButton">REJECT</button>
                        <button onClick={()=>this.openSwal('A')} className="acceptButton">ACCEPT</button>
                        <SweetAlert
                            show={this.state.swal.show}
                            type={this.state.swal.type}
                            title={this.state.swal.title}
                            text={this.state.swal.text}
                            showCancelButton={this.state.swal.cancelButtonText != null}
                            confirmButtonColor={this.state.swal.confirmButtonColor}
                            cancelButtonText={this.state.swal.cancelButtonText}
                            confirmButtonText={this.state.swal.confirmButtonText}
                            onConfirm={() => this.handleAlert(this.state.swal.status)}
                            onCancel={() => this.setState({ swal: {show: false} })}
                            onEscapeKey={() => this.setState({ swal: {show: false} })}
                            onOutsideClick={() => this.setState({ swal: {show: false} })}
                        />
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
