import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor:'white'
    },
    form: {
        width: '90%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
}));

export default function Login() {

    const classes = useStyles();
    const [user, setUser] = React.useState('');
    const [pwd, setPwd] = React.useState('');
    const handleChange = (event) => {
        setUser(event.target.value);
    };
    const handleChangePwd=(event)=>{
        setPwd(event.target.value)
    }
    localStorage.clear()
    localStorage.setItem("userLoggedIn","false")

    const submit = (e) => {
        e.preventDefault();
        
        let valid = false;
        if(user==="cquser"&&pwd==="cquser"){ valid=true}

        if (valid) {
            console.log("Isvalid")
            
                localStorage.setItem("userLoggedIn","true")
                window.location.href = '/app/drilling';
            
        } else {
            alert('invalid user');
        }
    }
        return (
        <Container maxWidth='xs'>
            <div  className={classes.paper}>
            <form className={classes.form} onSubmit={submit} >

                <TextField fullWidth margin="normal" id="user" label="Username" value={user} onChange={handleChange} />
                <TextField fullWidth margin="normal" type="password" id="password" label="Password" value={pwd} onChange={handleChangePwd} />
                <Button fullWidth type='submit'>Login</Button>
            </form>
            </div>
        </Container>
    )
}