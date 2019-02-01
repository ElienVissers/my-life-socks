import React from 'react';
import axios from './axios';

export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: true,
            bioExists: false,
            bioValue: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.closeEditMode = this.closeEditMode.bind(this);
    }
    componentDidMount() {
        axios.get('/bio/exists').then(results => {
            if (results.data != null) {
                this.setState({
                    bioExists: true
                });
                this.setState({
                    bioValue: results.data
                });
            }
        });
    }
    handleChange(e) {
        this.setState({
            bioValue: e.target.value
        });
    }
    closeEditMode() {
        var self = this;
        axios.post('/bio/edit', {bio: self.state.bioValue}).then((results) => {
            console.log("results from /bio/edit: ", results);
            if (typeof results.data == 'string') {
                self.setState({
                    editMode: false
                });
                self.setState({
                    bioValue: results.data.bio
                });
            } else if (results.data.error) {
                self.setState({
                    error: true
                });
            }
        });
    }
    render() {
        return (
            <div>
                {this.state.error && <div className="error">Oops, something went wrong!</div>}
                {this.state.editMode && <div className="bio-editmode">
                    <textarea value={this.state.bioValue} onChange={this.handleChange}/>
                    <button onClick={this.closeEditMode}>SAVE</button>
                </div>}
            </div>
        );
    }
}



//when registered the bio (column or table) will be null --> "eddit you bio" is displayed
//click on it --> textarea and save button; when the button is clicked make axios request to save bio in db
//when it is saved in db, BioEditor needs to call a function updateBio() and pass it the new bio --> the bio will live in app's state ; the function will also show the saved bio and edit button

//bioEditor will have a state property similar to uploaderIsVisible --> editMode: true or false (show textarea and save button or not); bioExists: true or false (show "create bio" or show the bio and edit button) ==> conditional rendering within the bioEditor :)

//the bio content will live in apps state
//while typing: there is a previously saved bio and the currently being typed draftBio (can be a prop of bioEditor)
