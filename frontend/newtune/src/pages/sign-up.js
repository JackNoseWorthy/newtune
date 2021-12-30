import React from 'react';
import '../style.css'
import { Alert, Button, Card, FormControl, InputGroup } from 'react-bootstrap'
import axios from 'axios'

const EMAIL_PATTERN = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;


export default class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      emailIsValid: true,
      password: '',
      passwordIsValid: true,
      entityIsValid: true
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }
  
  handleSubmit() {
    let isValid = true;

    if(!EMAIL_PATTERN.test(this.state.email)) {
      isValid = false;
      this.setState({emailIsValid: false});
    }else {
      this.setState({emailIsValid: true});
    }
    
    if(this.state.password.length < 8) {
      isValid = false;
      this.setState({passwordIsValid: false});
    }else {
      this.setState({passwordIsValid: true});
    }
    
    if(isValid) {
      axios({
        method: 'post',
        url: '/sign-up',
        withCredentials: true,
        data: {
          email: this.state.email,
          password: this.state.password
        }
      }).then((res) => {
        this.props.history.push({
          pathname: '/sign-up/spotify', 
        });
      }).catch((err) => {
        this.setState({entityIsValid: false});
      });
    }
    
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value})
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value })
  }

  InvalidEmail(props) {
    if(!props.emailIsValid)
      return <Alert className='text-center' variant='danger'>Invalid Email</Alert>;

    return null;
  }

  InvalidPassword(props) {
    if(!props.passwordIsValid)
      return <Alert className='text-center no-overflow' variant='danger'>Password must be at least 8 characters</Alert>;

    return null;
  }

  InvalidEntity(props) {
    if(!props.entityIsValid)
      return <Alert className='text-center no-overflow' variant='danger'>The server failed to validate the entity</Alert>;

    return null;
  }

  render() {
    return(
      <div className='centre-div'>
        <Card className='card'>
          <Card.Body>
            <div className='flex'>

              <h1>Sign Up</h1>

              <InputGroup className='mb-3' id='email'>
                <FormControl onChange={this.handleEmailChange} placeholder='Email'/>
              </InputGroup>

              <InputGroup className='mb-3' id='password'>
                <FormControl onChange={this.handlePasswordChange} placeholder='Password'/>
              </InputGroup>
              
              <this.InvalidEmail emailIsValid={this.state.emailIsValid}/>
              <this.InvalidPassword passwordIsValid={this.state.passwordIsValid}/>
              <this.InvalidEntity entityIsValid={this.state.entityIsValid}/>

              <Button className='wide-button' variant='primary' onClick={this.handleSubmit}>Sign Up</Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
}