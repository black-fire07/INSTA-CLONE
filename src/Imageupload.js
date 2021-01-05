import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import {db,storage} from './firebase';
import firebase from 'firebase';


export default function Imageupload({username}) {

    const [caption,setCaption] = useState('');
    const [progress,setProgress] = useState(0);
    const [image,setImage] = useState(null);

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleup = () => {
        const uploadtask = storage.ref(`images/${image.name}`).put(image);
        //press shift ctrl space

        uploadtask.on(
            "state_changed",
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (err) => {
                //error fun....
                alert(err.message);
            },
            () => {
                //complete fun....
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    })
            }
        )
    }

    return (
        <div className="imageup">
            {/* caption  input */}
            {/* file picker */}
            {/* post button */}

            <progress className="progress" value={progress} max="100"/>
            <input type="text" placeholder="Enter a Caption.." onChange={event=> setCaption(event.target.value)} value = {caption}/>
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleup}>
                upload
            </Button>

        </div>
    )
}
