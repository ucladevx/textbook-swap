import React, {Component} from 'react'
import {connect} from 'react-redux'
import Plus from '../new_images/plus.png'
import Loop from '../new_images/loop.png'
import Tick from '../new_images/tick.png'
import HalfLoop from '../new_images/halfLoop.png'
import Clock from '../new_images/waiting.png'
import Cross from '../new_images/cross.png'
import '../styles/cardClosedTrade.css'

import CardImageView from '../microcomponents/cardImageView'

var colorMap = {
    P: {
        title: "#52B9D1",
        subtitle: "#C2E4E7",
        bottom: "#3E99A8"
    },
    W: {
        title: "#52B9D1",
        subtitle: "#C2E4E7",
        bottom: "#3E99A8"
    },
    R: {
        title: "#E88154",
        subtitle: "#E69F81",
        bottom: "#C45F45"
    },
    N: {
        title: "#F8CC45",
        subtitle: "#FEF5CD",
        bottom: "#E2AA0F"
    },
    A: {
        title: "#5ECE54",
        subtitle: "#A7EFA0",
        bottom: "#4BB242"
    }
};

class CardClosedTrade extends Component {
    constructor(props) {
        super(props);
        this.printMessage = this.printMessage.bind(this);
        this.renderCenter = this.renderCenter.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    printMessage(){
        var type = this.props.color;
        if (type === "P"){
            return "NEW TRADE MATCH for "
        }
        else if (type === 'A'){
            return "COMPLETED trade for "
        }
        else if (type === 'R'){
            return "REJECTED trade for "
        }
        else if (type === 'W') {
            return "WAITING TO CONFIRM "
        }
        else return "PENDING MATCH for "
    }

    renderCenter(){
        var type = this.props.color;
        if (type === 'P'){
            return (
                <img className="centerImage" src={Loop}></img>
            )
        }
        else if (type === 'A') {
            return (
                <img className="centerImage" src={Tick}></img>
            )
        }
        else if (type === 'R') {
            return (
                <img className="centerCross" src={Cross}></img>
            )
        }
       else if (type === 'W') {
           return (
                <img className="centerImage" src={Clock}></img>
            )
       }
    }

    onClickHandler(){
        this.props.selectCard({
            bookHave: this.props.bookHave,
            bookWant: this.props.bookWant,
            color: this.props.color
        });

        this.props.onClick()
    }

    render()
    {
        if (!this.props){
            return <div></div>
        }
        var color = this.props.color;
        return (
            <div className="ctCard" onClick={()=>this.onClickHandler()} style={{backgroundColor: colorMap[color].title}}>
                <div className="ctTop">
                    <div className="ctLeft">
                        <CardImageView
                            title={this.props.bookHave.title}
                            imgUrl={this.props.bookHave.img_url}
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
                                title={this.props.bookWant.title}
                                imgUrl={this.props.bookWant.img_url}
                                titleColor={colorMap[color].title}
                                subtitleColor={colorMap[color].subtitle}
                            ></CardImageView>
                        </div>
                     }

                     {
                        false && this.props.color === "yellow" &&
                        <div className="ctRight">
                            {this.props.bookHave.title}
                        </div>
                     }
                </div>
                <div className="ctBottom" style={{backgroundColor: colorMap[color].bottom}}>
                    {`${this.printMessage()}${this.props.bookHave.title}`}
                </div>
            </div>
        )
    }
}

export default CardClosedTrade