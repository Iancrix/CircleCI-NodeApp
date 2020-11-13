import React from 'react';
import ReactDOM from 'react-dom';
import ShowImages from './Containers/ShowImages/ShowImages';
import UploadImage from "./Containers/UploadImage/UploadImage";

it('renders welcome message', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ShowImages />, div);
});

it('renders welcome message', () => {
    const div = document.createElement('div');
    ReactDOM.render(<UploadImage />, div);
});