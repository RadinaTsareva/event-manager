import React from 'react';
import { useState } from 'react';
import EventsService from '../../services/eventsService';
import Button from '../common/Button/Button';
import classes from './ImageUpload.module.scss';

const ImageUpload = () => {
    const [fileArray, setFileArray] = useState([]);

    const uploadMultipleFiles = (e) => {
        const fileObj = [e.target.files];
        const fileArr = [...fileArray]
        for (let i = 0; i < fileObj[0].length; i++) {
            fileArr.push(URL.createObjectURL(fileObj[0][i]))
        }
        setFileArray(fileArr)
    }

    const uploadFiles = async (e) => {
        await EventsService.uploadPics(fileArray)
        setFileArray([])
    }

    const deleteImageHandler = (e) => {
        const fileArr = [...fileArray]
        const index = fileArr.indexOf(e.target.src)
        fileArr.splice(index, 1)
        setFileArray(fileArr)
    }

    return (
        <form className={classes.Form}>
            <div className="form-group multi-preview">
                {(fileArray || []).map(url => (
                    <img key={url} onClick={deleteImageHandler} src={url} alt="..." />
                ))}
            </div>

            <div className="form-group">
                <input type="file" className="form-control" onChange={uploadMultipleFiles} multiple />
            </div>
            <Button onClick={uploadFiles}>Upload</Button>
        </form >
    )
}

export default ImageUpload;