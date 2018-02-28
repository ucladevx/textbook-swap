import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import fetch from 'isomorphic-fetch';
import 'react-select/dist/react-select.css';

const ROOT = 'http://localhost:3000'

axios.defaults.withCredentials = true;

class searchBox extends Component{
    constructor(props){
        super(props)
        this.state = {
            backspaceRemoves: true,
			multi: this.props.multi,
            value: this.props.initState
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
                        console.log(userData.data)
                    })
                return { options: json.data };
            })
        }
    }

    // Do no filtering, just return all options (except already selected ones)
    filterOptions(options, filter, currentValues) {
        for (var i = 0; i < options.length; i++) {
            // check if option has already been selected
            if (currentValues != null) {
                for (var j = 0; j < currentValues.length; j++) {
                    if (options[i] != null && options[i].book_id === currentValues[j].book_id) {  
                        // delete selected options
                        options.splice(i, 1);
                    }
                }
            }
            // TODO: check if option is already one of the user's owned books       
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
