import React, {Component} from 'react'
import {connect} from 'react-redux'
import Plus from '../new_images/plus.png'
import Loop from '../new_images/loop.png'
import Tick from '../new_images/tick.png'
import HalfLoop from '../new_images/halfLoop.png'
import '../styles/cardClosedTrade.css'

import CardImageView from '../microcomponents/cardImageView'

var colorMap = {
    blue: {
        title: "#47AFCB",
        subtitle: "#C2E4E7",
        bottom: "#3E99A8"
    },
    red: {
        title: "#E37449",
        subtitle: "#E69F81",
        bottom: "#C45F45"
    },
    yellow: {
        title: "#F7C53C",
        subtitle: "#FEF5CD",
        bottom: "#E2AA0F"
    },
    green: {
        title: "#5ECE54",
        subtitle: "#A7EFA0",
        bottom: "#4BB242"
    }
}

class CardClosedTrade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: this.props.color ? this.props.color : "blue",
            bookHave: this.props.bookHave ? this.props.bookHave : "History of India",
            bookWant: this.props.bookWant ? this.props.bookWant : "History of India"
        }
        this.printMessage = this.printMessage.bind(this)
        this.renderCenter = this.renderCenter.bind(this)
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

    render()
    {
        var color = this.state.color
        return (
            <div className="ctCard" style={{backgroundColor: colorMap[color].title}}>
                <div className="ctTop">
                    <div className="ctLeft">
                        <CardImageView 
                            title={this.state.bookHave.title}
                            imgUrl={this.state.bookHave.img_url}
                            titleColor={colorMap[color].title} 
                            subtitleColor={colorMap[color].subtitle}>
                        </CardImageView>
                    </div>
                    {
                        // this.state.color != "yellow" &&
                        true &&
                        <div className="ctCenter">
                            {this.renderCenter()}
                        </div>
                    }
                    {
                        //this.state.color != "yellow" &&    
                        true &&
                        <div className="ctRight">
                            <CardImageView
                                title={this.state.bookWant.title}
                                imgUrl={this.state.bookWant.img_url}
                                titleColor={colorMap[color].title} 
                                subtitleColor={colorMap[color].subtitle}
                            ></CardImageView>
                        </div>
                     }
                    
                     {
                        false && this.state.color === "yellow" &&
                        <div className="ctRight">
                            {this.state.bookHave.title}
                        </div>
                     }
                </div>
                <div className="ctBottom" style={{backgroundColor: colorMap[color].bottom}}>
                    {`${this.printMessage()}${this.state.bookHave.title}`}
                </div>
            </div>
        )
    }
}

export default CardClosedTrade
