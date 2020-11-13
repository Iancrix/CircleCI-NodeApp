import React, { Component } from 'react';
import "./ShowImages.css";

import axios from "axios";
class ShowImages extends Component {

    state = {
        imagesUrl: []
    }

    componentDidMount() {
        this.fetchImages();
    }

    setImages = (blobsList) => {
        var imagesUrl = [];

        const URL_endpoint = "https://bucketimagesti.blob.core.windows.net/container-images/";
        for (var i = 0; i < blobsList.length; i++) {
            var imageUrl = URL_endpoint + blobsList[i].name;
            imagesUrl.push(imageUrl);
        }

        this.setState({
            imagesUrl: imagesUrl
        });
    }

    fetchImages = () => {
        axios
            .get(
                `http://localhost:8080/upload`
            )
            .then(res => {
                this.setImages(res.data)
            })
            .catch(e => console.log(e));
    }

    onClick = (e) => {
        this.fetchImages();
    }

    render() {
        return (
            <div className="bg-image">
                <h1 className="title-image">Click to get images from Azure Blob Storage:</h1>
                <button className="btn-images" onClick={this.onClick}>GET IMAGES</button>
                <ul className="image-list">
                    {this.state.imagesUrl.map((imageUrl, i) =>
                        <li className="image-item">
                            <img className="img-it" src={imageUrl}></img>
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

export default ShowImages;
