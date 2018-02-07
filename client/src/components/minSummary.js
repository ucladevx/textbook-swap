import React, { Component } from 'react';
import '../styles/minSummary.css'

class MinSummary extends Component{
    constructor(props){
        super(props)
        this.generateList = this.generateList.bind(this)
    }

    generateList(){
        return this.props.books.map((book, i)=>{
            return (
            <div className='minSummaryCell'>
                <div className='minImageContainer'>
                    <img src={book.img_url}
                    className='minBookImage'/>
                </div>
                <div className='minSummaryText'>
                    <p>{book.title}</p>
                    <p>{book.author}</p>
                    {/*<p>ISBN: {book.isbn}</p>
                    <p>Class: {book.details.classes}</p>
                    <p>Prof: {book.details.profs}</p>*/}
                </div>
            </div>
            )
        })
    }
    
    render(){        
        return (
            <div className='minSummaryContainer'>
                {this.generateList()}
            </div>
        )
    }
}

export default MinSummary