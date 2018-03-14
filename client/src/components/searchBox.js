import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import fetch from 'isomorphic-fetch';
import 'react-select/dist/react-select.css';

const ROOT = 'http://loop-trading.com'

axios.defaults.withCredentials = true;

class searchBox extends Component{
    constructor(props){
        super(props)
        this.state = {
            backspaceRemoves: true,
			multi: this.props.multi,
            value: this.props.initState,
            selected_offered_book: this.props.selected_offered_book,  // book that owner selected as "offered" book
            owned_books: []  // books owned by the user
        }
        this.onChange = this.onChange.bind(this)
        this.gotoUser = this.gotoUser.bind(this)
        this.toggleBackspaceRemoves = this.toggleBackspaceRemoves.bind(this)
        this.toggleCreatable = this.toggleCreatable.bind(this)
        this.getBooks = this.getBooks.bind(this)
        this.filterOptions = this.filterOptions.bind(this)
    }

    // Take this from parent, so that state is saved in the form itself
    onChange (value) {
        this.props.onChange(value)
		this.setState({
			value: value,
		});
	}

    getBooks(input){
        if (input.length < 3) {
			return Promise.resolve({ options: [] });
		}
        else {
            return fetch(ROOT+'/api/search/search_textbooks?search_input='+input)
            .then((res) => res.json())
            .then((json) => {
                axios.get(ROOT+'/api/owned_books/get_owned_cards?user_id=user')
                    .then((userData) => {
                        console.log("user's owned books: ", userData.data.data)
                        // fetch the owned books for the user
                        this.setState({
                            owned_books: userData.data.data,
                        });
                    })
                return { options: json.data };
            })
        }
    }

    // Do no filtering, just return all options (except already selected ones)
    filterOptions(options, filter, currentValues) {
        // get list of book_ids that cannot be valid options
        let invalid_book_ids = []; 
        // book_ids that have already been selected as options
        if (currentValues != null) {
            for (let i = 0; i < currentValues.length; i++) {
                invalid_book_ids.push(currentValues[i].book_id);
            }
        }
        // user's owned books cannot be options
        for (let j = 0; j < this.state.owned_books.length; j++) {
            invalid_book_ids.push(this.state.owned_books[j].book_id);
        }
        // the offered book that the user selected cannot be an option (for a new trade)
        if (this.state.selected_offered_book != null) {
            console.log("selected offered book", this.state.selected_offered_book);
            invalid_book_ids.push(this.state.selected_offered_book.book_id);
        }

        console.log("invalid book ids", invalid_book_ids);

        let k = 0; 
        while (k < options.length) {
            let haveDeleted = false;
            for (let l = 0; l < invalid_book_ids.length; l++) {
                if (options[k] != null && options[k].book_id === invalid_book_ids[l]) {  
                    // delete selected options
                    options.splice(k, 1);
                    haveDeleted = true;
                    break;
                }
            }
            // only increment k if we haven't deleted
            if (!haveDeleted) { k++; }
        } 
        return options;
    }

    gotoUser (value, event) {
		console.log("Selected", value)
	}

	toggleBackspaceRemoves () {
		this.setState({
			backspaceRemoves: !this.state.backspaceRemoves
		})
	}

	toggleCreatable () {
		this.setState({
			creatable: !this.state.creatable
		})
	}

    render () {
		const AsyncComponent = this.state.creatable
			? Select.AsyncCreatable
			: Select.Async;

		return (
			<div className="section">
				<AsyncComponent
                    multi={this.state.multi}
                    value={this.state.value}
                    onChange={this.onChange}
                    // onValueClick={this.gotoUser} // TODO: this makes the value a link in the search bar, so remove later?
                    valueKey="book_id"
                    labelKey="title"
                    loadOptions={this.getBooks}
                    backspaceRemoves={this.state.backspaceRemoves}
                    placeholder="Search by title, professor or class"
                    cache={false}
                    filterOptions={this.filterOptions}
            />
			</div>
		);
	}
}

export default searchBox
