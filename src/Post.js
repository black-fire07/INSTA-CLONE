import React, { useEffect, useState } from 'react';
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import firebase from 'firebase';
import { Button } from '@material-ui/core';


function Post({username,caption,imageUrl,postid,user}) {

    const [comments, setComments] = useState([]);
    const [comment,setComment] = useState('');

    useEffect(()=>{
        let unsubscribe;
        if(postid){
            unsubscribe = db
                .collection("posts")
                .doc(postid)
                .collection("comments")
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot)=>{
                    setComments(snapshot.docs.map((doc)=>doc.data()));
                });
        }
        return () =>{
            unsubscribe();
        }
    },[postid]);

    const postcom = (e) => {
       e.preventDefault();
       db.collection("posts").doc(postid).collection("comments").add({
           text: comment,
           username: user.displayName,
           timestamp: firebase.firestore.FieldValue.serverTimestamp()
       });
       setComment('');
    }

    const postdel = () => {
        db.collection("posts").doc(postid).delete();
    }

    return (
        <div className="post">

            <div className="post-header">

            <Avatar className="post-avatar" alt={username} src="/static/images/avatar/1.jpg"/>
            <h3>{username}</h3>
            {/* headr avatar username */}
            {user?(
            <Button className="del" onClick={postdel}>Delete</Button>):(
                null
            )}

            </div>

            <img className="post-im" src={imageUrl}/>
            {/* image */}

            <h4><strong>{username}:</strong> {caption}</h4>
            {/* username caption */}

            <div className="comment">
                {comments.map(comm => {
                    return <p>
                        <strong>{comm.username}</strong> {comm.text}
                    </p>
                })}
            </div>

            {user && 
            <form className="box">
            <input 
            className="input"
          placeholder="Add a comment..."
          type="text"
          value={comment}
          onChange={(e)=> setComment(e.target.value)}/>

          <button className="button"
          disabled={!comment}
          type="submit"
          onClick={postcom}>Send</button>
            </form>
            }
            
            {/* comments */}
        </div>
    )
}

export default Post
