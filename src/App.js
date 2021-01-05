import React, { useState, useEffect } from 'react';
import './App.css';
import Post from "./Post";
import { auth, db } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import Imageupload from './Imageupload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [opensignin, setopensignin] = useState(false);
  const [open,setOpen] = useState(false);
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [user,setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user)=>{
      if(user) {
        //log in
        console.log(user);
        setUser(user);

      } else {
        //log out
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }

  }, [user,username]);


  //use effect runs  piece of code based on info
  //run everytime posts change
  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post:doc.data()
      })));
    })
  }, []);
  
  const signup = (event) =>{
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
      .then((authuser) => {
        return authuser.user.updateProfile({
          displayName: username
        })
      })
      .catch((err)=>alert(err.message));
      setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email,password)
      .catch((err)=>alert(err.message));

    setopensignin(false);  
  } 

// firebase gives you real time database like socket.io...
//onCLose listening calls outside the model
  return (
    <div className="app">



      <Modal
  open={open}
  onClose={()=>setOpen(false)}
>
<div style={modalStyle} className={classes.paper}>
      <center className="signup">
      <img
          className="app-header-im"
          src = "https://assets.website-files.com/5c75b94c8dd1ae50d3b9294b/5d48831280adb734a5db5620_hukglfkfklk%3B.png"
          alt=""/>

          <Input 
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e)=> setUsername(e.target.value)}/>

          <Input 
          placeholder="email"
          type="text"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}/>

          <Input 
          placeholder="password"
          type="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}/>

          <Button type="Submit" onClick={signup}>Sign up</Button>

      </center>
    </div>
</Modal>
<Modal
  open={opensignin}
  onClose={()=>setopensignin(false)}
>
<div style={modalStyle} className={classes.paper}>
      <center className="signup">
      <img
          className="app-header-im"
          src = "https://assets.website-files.com/5c75b94c8dd1ae50d3b9294b/5d48831280adb734a5db5620_hukglfkfklk%3B.png"
          alt=""/>

          <Input 
          placeholder="email"
          type="text"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}/>

          <Input 
          placeholder="password"
          type="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}/>

          <Button type="Submit" onClick={signIn}>Sign In</Button>

      </center>
    </div>
</Modal>
      <div className="app-header">
        <img
          className="app-header-im"
          src = "https://assets.website-files.com/5c75b94c8dd1ae50d3b9294b/5d48831280adb734a5db5620_hukglfkfklk%3B.png"
          alt=""/>

{user ? (
          <Button onClick = {()=>auth.signOut()}>Log Out</Button>):(
            <div className="login">
              <Button onClick = {()=>setopensignin(true)}>Sign In</Button>
            <Button onClick = {()=>setOpen(true)}>Sign Up</Button>
            </div>
  )}
            
          </div>

          <div className="appposts">
            <div className="left">
              {/* with key whole page will not render only changes will update */}
          {posts.map(({id,post}) => {
             return <Post
             key = {id}
             postid = {id}
             user = {user}
             username={post.username}
             caption={post.caption}
             imageUrl={post.imageUrl} />
          })}
      {/* Header */}
</div>
      {/* Posts */}
<div className="right">
<InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
</div>
          </div>

        
      
      {user?.displayName ? (
      <Imageupload username={user.displayName}/>
      ):(
        <h3>you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
