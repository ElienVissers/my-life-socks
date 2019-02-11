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
            draftColor: this.props.color || "#000000"
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
        let socks;
        if (this.props.shape == "short socks") {
            socks = <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="163.732px" height="130.013px" viewBox="338.443 173.289 163.732 130.013" enableBackground="new 338.443 173.289 163.732 130.013" xmlSpace="preserve">
                <path fill="#DD2C2C" d="M496.778,231.311c-11.329,12.783-22,16.667-22,16.667c0,0-11-14-5.668-33.504c3.418-12.503,17.095-18.666,18.667-19.333c3.279-1.392,12.668-2.667,12.668-2.667S503.271,223.984,496.778,231.311z"/>
                <path fill={this.state.color} d="M368.445,300.883c-13-0.575-20.667-10.906-20.667-10.906c0,0-11-14-5.668-33.504c3.418-12.503,17.095-18.666,18.667-19.333c3.279-1.392,74.002-43.164,74.002-43.164s-1.776-5.979,0-18.667c0.333-2.379,69.77-2.99,67.333,0c-1.013,1.242,0.514,25.81-0.667,42c-0.544,7.452-3.884,13.377-4.333,14c-7.201,10-103.182,63.914-105.667,65C375.445,303.302,373.299,301.098,368.445,300.883z"/>
                <path fill="#000000" d="M503.447,172.931h-70.625v20.173l-78.296,45.208l0.043,0.076c-7.344,4.758-12.625,11.934-14.906,20.444c-2.443,9.115-1.191,18.63,3.528,26.797c4.715,8.167,12.33,14,21.445,16.454c3.043,0.818,6.124,1.219,9.196,1.219c5.52,0,10.972-1.318,15.977-3.877l0.029,0.049l1.586-0.91l0,0l0,0l94.359-54.471c10.678-6.167,17.244-17.182,17.635-29.502h0.029V172.931L503.447,172.931z M499.779,176.603v5.257h-63.281v-5.257H499.779z M436.498,195.223v-9.677h63.281v5.134c-5.838,0.157-11.549,1.771-16.639,4.705c-8.168,4.719-14.012,12.334-16.459,21.439c-2.438,9.115-1.182,18.635,3.529,26.797c0.758,1.305,1.619,2.543,2.533,3.733l-81.553,47.099L359.55,239.65L436.498,195.223z M365.588,298.535c-8.163-2.185-14.982-7.428-19.206-14.748c-4.229-7.305-5.357-15.834-3.162-24.006c2.029-7.563,6.701-13.953,13.196-18.206l31.55,54.647C381.023,299.707,373.156,300.55,365.588,298.535z M483.949,240.889l-8.004,4.629c-0.924-1.181-1.807-2.415-2.559-3.72c-4.229-7.329-5.348-15.858-3.162-24.011c2.186-8.153,7.43-14.982,14.74-19.207c4.537-2.619,9.629-4.067,14.805-4.229v19.825h-0.01C499.521,225.33,493.613,235.316,483.949,240.889z"/>
            </svg>;
        } else if (this.props.shape == "long socks") {
            socks = <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="164.978px" height="233.449px" viewBox="338.453 121.39 164.978 233.449" enableBackground="new 338.453 121.39 164.978 233.449" xmlSpace="preserve">
                <path fill={this.state.color} d="M501.32,265.809c0,0-2.929,13.806-5.25,17.832c-1.723,2.987-9.5,10-9.5,10s-70.435,44.441-96,55c-4.6,1.899-14.524,3.911-19.5,4c-4.001,0.071-12.022-2.02-15.5-4c-4.242-2.416-10.569-10.517-12.5-15c-2.091-4.856-3.768-15.867-2.5-21c1.167-4.727,5.937-13.683,9.5-17c17.886-16.653,84.584-49,84.584-49V121.39h66.666V265.809z"/>
                <path fill="#000000" d="M503.427,121.39h-70.625v123.256l-78.3,45.203l0.048,0.081c-15.639,10.14-20.807,30.911-11.382,47.237c4.719,8.172,12.334,14.006,21.439,16.453c3.048,0.818,6.134,1.219,9.201,1.219c5.52,0,10.967-1.314,15.978-3.871l0.028,0.047l1.586-0.91h0.005l0,0l94.364-54.479c10.682-6.162,17.254-17.172,17.639-29.497h0.023L503.427,121.39L503.427,121.39z M499.755,125.071v5.257H436.48v-5.257H499.755z M436.48,246.76V134h63.275v108.212c-5.844,0.157-11.543,1.776-16.639,4.705c-8.168,4.719-14.012,12.334-16.455,21.439c-2.447,9.115-1.189,18.63,3.525,26.807c0.762,1.3,1.619,2.539,2.527,3.729l-81.553,47.094l-31.645-54.794L436.48,246.76z M365.574,350.068c-8.163-2.186-14.987-7.424-19.216-14.744c-8.415-14.563-3.853-33.088,10.034-42.212l31.55,54.646C380.999,351.24,373.132,352.101,365.574,350.068z M483.935,292.43l-8,4.624c-0.93-1.186-1.805-2.414-2.568-3.724c-4.223-7.314-5.348-15.844-3.162-24.011c2.195-8.163,7.43-14.982,14.75-19.207c4.533-2.619,9.623-4.062,14.801-4.229v19.825h-0.01C499.503,276.872,493.587,286.858,483.935,292.43z"/>
            </svg>;
        }
        return (
            <div>

                {!this.state.editMode && !this.props.color && <div className="fav-socks-add">
                    <button onClick={this.openEditMode}>ADD FAVOURITE SOCKS</button>
                </div>}

                {!this.state.editMode && this.props.color && <div className="fav-socks-edit">
                    <h5>Favourite Socks:</h5>
                    <div className="favourite-socks" style={{fill: this.props.color}}>{socks}</div>
                    <button onClick={this.openEditMode}>EDIT FAVOURITE SOCKS</button>
                </div>}

                {this.state.editMode && <div className="fav-socks-choose">
                    <input type="color" defaultValue={this.props.color || '#000000'} onChange={this.handleChange} />
                    <label>color</label>
                    <input type="radio" value="short socks" checked={this.props.shape === "short socks"} onChange={e => this.props.handleChange2(e.target.value)} />
                    <label>short socks</label>
                    <input type="radio" value="long socks" checked={this.props.shape === "long socks"} onChange={e => this.props.handleChange2(e.target.value)} />
                    <label>long socks</label>
                    <br />
                    <button onClick={this.closeEditMode}>SAVE</button>
                </div>}
            </div>
        );
    }
}

//react-color :

//import { CirclePicker } from 'react-color';
// handleChange(color) {
//     this.setState({
//         draftColor: color.hex
//     });
// }
// <CirclePicker
//       color={this.state.draftColor}
//       onChange={this.handleChange}
// />
