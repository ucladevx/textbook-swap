import React, {Component} from 'react'
import {connect} from 'react-redux'
import CardDetailView from '../microcomponents/cardDetailView'
import '../styles/tradeDetail.css'
import Loop from '../new_images/loop_black.png'
import Tick from '../new_images/tick_black.png'
import HalfLoop from '../new_images/halfLoop_black.png'

class TradeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "blue",
            page: 0
        }
        this.generateDetail = this.generateDetail.bind(this)
    }
    
    generateDetail(){
        var page = this.state.page
        if (page === 0){
            return (
                <div className="tdDetailContents">
                    <div className="tdDetailContainer">
                        <div className="tdLeft">
                            <CardDetailView></CardDetailView>
                        </div>
                        <div className="tdCenter">
                            <img src={Loop} className="tdImage"></img>
                        </div>
                        <div className="tdRight">
                            <CardDetailView></CardDetailView>
                        </div>
                    </div>
                    <div className="tdButtonRow">
                        <button onClick={()=>this.setState({page: 1})} className="rejectButton">REJECT</button>
                        <button onClick={()=>this.setState({page: 2})} className="acceptButton">ACCEPT</button>
                    </div>
                </div>
            )
        }
        if (page === 1){
            return (
                <div className="tdDetailContents">
                    <div className="tdDetailContainer">
                        <h3>Are you sure you want to reject the trade?</h3>
                    </div>
                    <div className="tdButtonRow">
                        <button onClick={()=>this.setState({page: 0})} 
                            className="rejectButton">No... Take me back</button>
                        <button className="acceptButton">Yep</button>
                    </div>
                </div>
            )
        }
        if (page === 2){
            return (
                <div className="tdDetailContents">
                    <div className="tdDetailContainer">
                        <h3>Are you sure you want accept the trade?
                        You will be emailed the details of the other members in your trade loop on confirmation.</h3>
                    </div>
                    <div className="tdButtonRow">
                        <button onClick={()=>this.setState({page: 0})} className="rejectButton">No... Take me back</button>
                        <button className="acceptButton">Yep</button>
                    </div>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div className="tdContainer">
                <h2 className="tdTitle">MATCHED TRADE</h2>
                {
                    this.generateDetail()
                }
            </div>
        )
    }
}

export default TradeDetail