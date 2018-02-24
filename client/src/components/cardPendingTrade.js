import React, {Component} from 'react'
import {connect} from 'react-redux'
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
        this.onClickHandler = this.onClickHandler.bind(this)
    }
    
    onClickHandler(){
        console.log("Clicked Edit...")

        this.props.selectCard({
            bookHave: this.props.bookHave,
            booksWant: this.props.booksWant
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
                        <div className="ptAuthor">{this.props.bookHave.author}</div>
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
