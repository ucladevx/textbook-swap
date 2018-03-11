import React, {Component} from 'react'
import Plus from '../new_images/plus.png'
import '../styles/cardAdd.css'

class CardAdd extends Component {
    render()
    {
        return (
            <div onClick={()=>this.props.onClick()} className="cardAdd">
                <img src={Plus} className="cardAddImage"></img>
                <h2 className="cardAddTitle">NEW TRADE</h2>
            </div>
        )
    }
}

export default CardAdd
