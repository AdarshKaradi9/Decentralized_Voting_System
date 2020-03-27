import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import 'tachyons';
class Signin extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                voterId: '',
                password: ''
            },
            currentUser: null,
            submitted: false,
            votableItems: null
        }
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(e) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    onSubmitSignIn =  (e) => {
        e.preventDefault();
        const ip = process.env.REACT_APP_IP;
        this.setState({ submitted: true });
         fetch(`http://${ip}:3001/validateVoter`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                voterId: this.state.user.voterId,
                password: this.state.user.password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.resStatus === 'success') {
                this.setState({currentUser: data});
                this.props.onUser(data);  
                this.props.onRouteChange('home');
            }else {
                alert('user does not exists!!')
                this.props.onRouteChange('signin');
            }
        })
        
        
    }


    render() {
        const { username, password, submitted, user } = this.state;
        return(
            <Jumbotron className='bg-white'>
                <article className="br3 ba dark-gray b--black-10 mv4 w-200 w-60-m w-25-l mw7 shadow-5 center">
            <main className="pa4 black-80">
                <div className="mw7 center ph3-ns">
                    <h1 className='pa3'>Login</h1>
                    <form name="form">
                        <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                            <input type="text" className="form-control" name="voterId" placeholder='Enter valid voter id' id="voterId" value={user.voterId} onChange={this.handleChange} />
                        </div>
                        <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                            <input type="password" className="form-control" name="password" placeholder='Enter password' id="password" value={user.password} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                            <Button variant="primary" onClick={this.onSubmitSignIn}>Login</Button>
                        </div>
                        <div className="form-group">
                            <h2>Or Join the network here!! <Button variant="dark" size='sm' onClick={()=> {this.props.onRouteChange('register')}}>register</Button></h2>                            
                        </div>
                    </form>
                </div>
            </main>
            </article>
            </Jumbotron>
            
        );
    }
}

export default Signin;