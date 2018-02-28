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
                <div className="cdText"><span>{this.props.book.title}</span></div>
                <div className="cdText"><span>{this.props.book.author}</span></div>
                <div className="cdText">ISBN: {this.props.book.isbn}</div>
                <div className="cdImageBox">
                    <img src={this.props.book.img_url} className="cdImage"></img>
                </div>
            </div>
            )
    }
}

export default CardDetailView