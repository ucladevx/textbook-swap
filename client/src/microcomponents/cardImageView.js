import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import './cardImageView.css'
import BookImage from '../new_images/bookTemplate.jpg'

var color
class CardImageView extends Component {
    constructor(props) {
        super(props);
        
        color = {
            title: {
                backgroundColor: this.props.titleColor
            },
            subtitle: {
                backgroundColor: this.props.subtitleColor
            }
        }
    }
    
    render()
    {
        return (
            <div className="ciContainer" style={color.title}>
                <div className="ciImageBox" style={color.subtitle}>
                    <img src={BookImage} className="ciImage"></img>
                </div>
                <p className="ciText">HISTORY OF INDIA</p>
            </div>
            )
    }
}

export default CardImageView