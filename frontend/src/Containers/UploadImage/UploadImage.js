import React, { Component } from 'react'
import "./UploadImage.css";

import axios from "axios";

class UploadImage extends Component {

    state = {
        selectedFile: null
    }

    onClick = (e) => {
        if (this.state.selectedFile !== null) {
            var formData = new FormData();
            formData.append("image", this.state.selectedFile);

            axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                console.log("Se inserto la imagen")

            })
                .catch(e => console.log(e));
        }
    }

    onChange = (e) => {
        this.setState({
            selectedFile: e.target.files[0]
        })
    }

    render() {
        return (
            <div className="bg-image">
                <input type="file" id="file-input" onChange={this.onChange} />
                <br />
                <button onClick={this.onClick} className="insert-button">Insert Image</button>
            </div>
        )
    }
}

export default UploadImage;
