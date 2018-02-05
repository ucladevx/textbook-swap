import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import './cardDetailView.css'
import BookImage from '../new_images/bookTemplate.jpg'

class CardDetailView extends Component {
    constructor(props) {
        super(props);
    }
    
    render()
    {
        return (
            <div className="cdContainer">
                <div className="cdText">HISTORY OF INDIA</div>
                <div className="cdText">PINKER</div>
                <div className="cdText">ISBN: 1234567</div>
                <div className="cdImageBox">
                    <img src={BookImage} className="cdImage"></img>
                </div>
            </div>
            )
    }
}

export default CardDetailView