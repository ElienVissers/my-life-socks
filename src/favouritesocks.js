import React from 'react';
import axios from './axios';

export class FavouriteSocks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.openEditMode = this.openEditMode.bind(this);
        this.closeEditMode = this.closeEditMode.bind(this);
    }
    handleChange(e) {
        this.setState({
            draftColor: e.target.value
        });
    }
    openEditMode() {
        this.setState({
            editMode: true,
        });
    }
    closeEditMode() {
        var self = this;
        axios.post('/socks/edit', {color: self.state.draftColor || this.props.color, shape: self.props.shape}).then((results) => {
            self.props.updateSocks(results.data);
            self.setState({
                editMode: false
            });
        });
    }
    render() {
        return (
            <div>

                {!this.state.editMode && !this.props.color && <div className="fav-socks-add">
                    <button onClick={this.openEditMode}>ADD FAVOURITE SOCKS</button>
                </div>}

                {!this.state.editMode && this.props.color && <div className="fav-socks-edit">
                    <div style={{backgroundColor: this.props.color, width: "50px", height: "50px"}}>
                    </div>
                    <button onClick={this.openEditMode}>EDIT FAVOURITE SOCKS</button>
                </div>}

                {this.state.editMode && <div className="fav-socks-choose">
                    <input type="color" defaultValue={this.props.color || '#000000'} onChange={this.handleChange} />
                    <input type="radio" value="short socks" checked={this.props.shape === "short socks"} onChange={e => this.props.handleChange2(e.target.value)} />
                    <label>short socks</label>
                    <input type="radio" value="long socks" checked={this.props.shape === "long socks"} onChange={e => this.props.handleChange2(e.target.value)} />
                    <label>long socks</label>
                    <button onClick={this.closeEditMode}>SAVE</button>
                </div>}
            </div>
        );
    }
}

//TO DO :
//1. make socks render nice above EDIT button
//2. make small preview icons and style color label above SAVE button
