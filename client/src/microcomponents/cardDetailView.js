import React, {Component} from 'react'
import './cardDetailView.css'

class CardDetailView extends Component {
    render()
    {
        return (
            <div className="cdContainer">
                <div className="cdTextSection">
                    <div className="cdText"><span>{this.props.book.title}</span></div>
                    <div className="cdText"><span>{this.props.book.author}</span></div>
                    <div className="cdText">ISBN: {this.props.book.isbn}</div>
                </div>
                <div className="cdImageBox">
                    <img src={this.props.book.img_url} className="cdImage"></img>
                </div>
            </div>
            )
    }
}

export default CardDetailView