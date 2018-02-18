import React, {Component} from 'react'
import {connect} from 'react-redux'
import OldPlus from '../img/grey_plus.png'
import Plus from '../new_images/plus.png'
import '../styles/cardAdd.css'

class CardAdd extends Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        return (
            <div className="card">
                <img src={Plus} className="cardImage"></img>
                <h2 className="cardTitle">NEW TRADE</h2>
            </div>
        )
    }
}

export default CardAdd
