import React from 'react';
import axios from './axios';

export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            draftBio: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.openEditMode = this.openEditMode.bind(this);
        this.closeEditMode = this.closeEditMode.bind(this);
    }
    handleChange(e) {
        this.setState({
            draftBio: e.target.value
        });
    }
    openEditMode(e) {
        e.preventDefault();
        this.setState({
            editMode: true,
            draftBio: this.props.bio
        });
    }
    closeEditMode(e) {
        e.preventDefault();
        var self = this;
        axios.post('/bio/edit', {bio: self.state.draftBio}).then((results) => {
            self.props.updateBio(results.data);
            if (typeof results.data == 'string') {
                self.setState({
                    editMode: false
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
            <div className="bioeditor">

                {!this.state.editMode && !this.props.bio && <div className="bio-add">
                    <button onClick={this.openEditMode}>ADD BIO</button>
                </div>}

                {!this.state.editMode && this.props.bio && <div className="bio-description">
                    <pre>{this.props.bio}</pre>
                    <button onClick={this.openEditMode}>EDIT BIO</button>
                </div>}

                {this.state.error && <div className="error">Oops, something went wrong!</div>}
                {this.state.editMode && <div className="bio-editmode">
                    <textarea defaultValue={this.props.bio} onChange={this.handleChange}/>
                    <button onClick={this.closeEditMode}>SAVE</button>
                </div>}
            </div>
        );
    }
}
