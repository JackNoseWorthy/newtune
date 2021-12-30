import React from 'react';
import { Alert, Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import '../style.css';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailIsValid: true,
      password: '',
      passwordIsValid: true,
      userExists: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }
  
  handleSubmit() {
    let isValid = true;

    if(this.state.email.length) {
      this.setState({emailIsValid: true});
    }else {
      isValid = false;
      this.setState({emailIsValid: false});
    }

    if(this.state.password.length) {
      this.setState({passwordIsValid: true});
    }else {
      isValid = false;
      this.setState({passwordIsValid: false});
    }

    if(isValid) {
      axios({
        method: 'post',
        url: '/login',
        withCredentials: true,
        data: {
          email: this.state.email,
          password: this.state.password
        }
      }).then((response) => {
        this.props.history.push({
          pathname: '/search',
          state: {artists: response.data.artists}
        });
      }).catch((err) => {
        console.log(err);
        this.setState({userExists: false});
      });
    }
  }

  handleSignUp() {
    this.props.history.push({
      pathname: '/sign-up', 
    });
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value})
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value})
  }

  InvalidEmail(props) {
    if(!props.emailIsValid)
      return <Alert className='text-center' variant='danger'>Email is required</Alert>;

    return null;
  }

  InvalidPassword(props) {
    if(!props.passwordIsValid)
      return <Alert className='text-center' variant='danger'>Password is required</Alert>;

    return null;
  }

  InvalidEntity(props) {
    if(!props.entityIsValid)
      return <Alert className='text-center' variant='danger'>Invalid credentials</Alert>;

    return null;
  }

  render() {
    return(
      <div className='centre-div'>
        <Card className='card'>
          <Card.Body>

            <h1>Login</h1>

            <InputGroup className='mb-3' id='email'>
              <FormControl onChange={this.handleEmailChange} placeholder='Email'/>
            </InputGroup>

            <InputGroup className='mb-3' id='password'>
              <FormControl onChange={this.handlePasswordChange} placeholder='Password'/>
            </InputGroup>

            <this.InvalidEmail emailIsValid={this.state.emailIsValid}/>
            <this.InvalidPassword passwordIsValid={this.state.passwordIsValid}/>
            <this.InvalidEntity entityIsValid={this.state.userExists}/>

            <Button className='wide-button' variant='secondary' onClick={this.handleSignUp}>Sign Up</Button>
            <br/>
            <Button className='wide-button' variant='primary' onClick={this.handleSubmit}>Login</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}