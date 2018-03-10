import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import './cardImageView.css'
import BookImage from '../new_images/bookTemplate.jpg'

class CardImageView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imgUrl: this.props.imgUrl ? this.props.imgUrl : "https://coverimages.verbacompete.com/57f29092-b813-532e-95d0-74f38f1fbb77.jpg",
            title: this.props.title ? this.props.title : null
        }
    }

    render()
    {
        return (
            <div className="ciContainer" style={{backgroundColor: this.props.titleColor}}>
                <div className="ciImageBox" style={{backgroundColor: this.props.subtitleColor}}>
                    <img src={this.props.imgUrl} className="ciImage"></img>
                </div>
                {
                    this.props.title &&
                    <p className="ciText">{this.props.title}</p>
                }
            </div>
            )
    }
}

export default CardImageView
