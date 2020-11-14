import React, { Component } from 'react';
import "./ShowImages.css";

import IP from "../../URL";
import ENV from "../../ENV";

import axios from "axios";
class ShowImages extends Component {

    state = {
        imagesUrl: [],
        public_ip: ""
    }

    componentDidMount() {
        this.fetchImages();
    }

    setImages = (blobsList) => {
        var imagesUrl = [];

        var URL_endpoint = "https://bucketimagesprod.blob.core.windows.net/containet-images-prod/";

        if (ENV !== 'prod') {
            URL_endpoint = "https://bucketimagesdev.blob.core.windows.net/container-images-dev/";
        }

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
                `http://${IP}/upload`
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
                <h1 className="title-image">Click to get images from Azure Blob Storage222:</h1>
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
