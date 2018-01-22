import React, { Component } from 'react';
import '../styles/summary.css'

class Summary extends Component{
    constructor(props){
        super(props)
        this.generateList = this.generateList.bind(this)
    }

    generateList(){
        console.log("Summary", this.props.books)
        if (this.props.multi) {
            return this.props.books.map((book, i)=>{
                return (
                <div className='summaryContainer'>
                    <div className='imageContainer'>
                        <img src={book.img_url}
                        className='bookImage'/>
                    </div>
                    <div className='summaryText'>
                        <p>Title: {book.title}</p>
                        <p>Author: {book.author}</p>
                        <p>ISBN: {book.isbn}</p>
                        <p>Class: {book.details.classes}</p>
                        <p>Prof: {book.details.profs}</p>
                    </div>
                </div>
                )
            })
        }
        else {
            var book = this.props.books
            return (
                <div className='summaryContainer'>
                    <div className='imageContainer'>
                        <img src={book.img_url}
                        className='bookImage'/>
                    </div>
                    <div className='summaryText'>
                        <p>Title: {book.title}</p>
                        <p>Author: {book.author}</p>
                        <p>ISBN: {book.isbn}</p>
                        <p>Class: {book.details.classes}</p>
                        <p>Prof: {book.details.profs}</p>
                    </div>
                </div>
                )
        }
    }
    
    render(){        
        return (
            this.generateList()
        )
    }
}

export default Summary