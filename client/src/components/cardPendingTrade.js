import React, {Component} from 'react'
import {connect} from 'react-redux'
import Plus from '../new_images/plus.png'
import Loop from '../new_images/loop.png'
import Tick from '../new_images/tick.png'
import HalfLoop from '../new_images/halfLoop.png'
import '../styles/cardPendingTrade.css'

import CardImageView from '../microcomponents/cardImageView'

var colorMap = {
    yellow: {
        title: "#F7C53C",
        subtitle: "#FEF5CD",
        bottom: "#E2AA0F"
    }
}

class CardPendingTrade extends Component {
    constructor(props) {
        super(props);
//        this.printMessage = this.printMessage.bind(this)
//        this.renderCenter = this.renderCenter.bind(this)
        this.onClickHandler = this.onClickHandler.bind(this)
    }
    
    printMessage(){
        var type = this.props.color
        if (type === "blue"){
            return "NEW TRADE MATCH for "
        }
        else if (type === "green"){
            return "COMPLETED trade for "
        }
        else if (type === "red"){
            return "REJECTED trade for "
        }
        else return "PENDING MATCH for "
    }
    
    renderCenter(){
        var type = this.props.color
        if (type === "blue" || type === "red"){
            return (
                <img className="centerImage" src={Loop}></img>
            )
        }
        else if (type === "green") {
            return (
                <img className="centerImage" src={Tick}></img>
            )
        }
        else if (type === "yellow") {
            return (
                <img className="centerHalfLoop" src={HalfLoop}></img>
            )
        }
    }
    
    onClickHandler(){
        return
        this.props.selectCard({
            bookHave: this.state.bookHave,
            bookWant: this.state.bookWant
        })
        
        this.props.onClick()
    }

    render()
    {
        var color = this.props.color
        return (
            <div className="ctCard" onClick={()=>this.onClickHandler()} style={{backgroundColor: colorMap[color].title}}>
                <div className="ctTop">
                    <div className="ctLeft">
                        <CardImageView 
                            title=""
                            imgUrl={this.props.bookHave.img_url}
                            titleColor={colorMap[color].title} 
                            subtitleColor={colorMap[color].subtitle}>
                        </CardImageView>
                    </div>
                    <div className="ptRight">
                        <div className="ptTitle">{this.props.bookHave.title}</div>
                        <div>{this.props.bookHave.author}</div>
                    </div>
                </div>
                <div className="ptBottom" style={{backgroundColor: colorMap[color].bottom}}>
                    {this.props.booksWant.length} book{this.props.booksWant.length != 1 ? "s" : ""} wanted in exchange
                </div>
            </div>
        )
    }
}

export default CardPendingTrade
