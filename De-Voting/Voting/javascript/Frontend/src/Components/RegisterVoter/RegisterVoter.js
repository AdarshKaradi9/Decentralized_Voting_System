import React from 'react';
import { Jumbotron } from 'react-bootstrap';

import './RegisterVoter.css';
class RegisterVoter extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                voterId: '',
                registrarId: '',
                firstName: '',
                LastName: '',
            },
            submitted: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit =  (e) => {
        const ip = process.env.REACT_APP_IP
        e.preventDefault();
        this.setState({ submitted: true });
         fetch(`http://${ip}:3001/registerVoter`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                voterId: this.state.user.voterId,
                registrarId: this.state.user.registrarId,
                firstName: this.state.user.firstName,
                lastName: this.state.user.lastName,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.props.onRouteChange('signin');
        })
        
    }


    render() {
        const { user, submitted } = this.state;
        return(
            <Jumbotron className='bg-white'>
            <article className="br3 ba dark-gray b--black-10 mv4 w-200 w-60-m w-25-l mw7 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="mw7 center ph3-ns register">
                         <h1 className='pa4'>Register</h1>
                        <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group' + (submitted && !user.username ? ' has-error' : '')}>
                        <input type="text" className="form-control" name="voterId" placeholder="Enter valid Voter Id" value={user.voterId} onChange={this.handleChange} />
                        {submitted && !user.voterId &&
                            <div className="help-block">VoterId is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.registrarId ? ' has-error' : '')}>
                        <input type="text" className="form-control" name="registrarId" placeholder="Enter RegistrarId" value={user.registrarId} onChange={this.handleChange} />
                        {submitted && !user.registrarId &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.firstName ? ' has-error' : '')}>
                        <input type="text" className="form-control" name="firstName"  placeholder="Enter firstname" value={user.firstName} onChange={this.handleChange} />
                        {submitted && !user.firstName &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.lastName ? ' has-error' : '')}>
                        <input type="text" className="form-control" name="lastName"  placeholder="Enter lastname" value={user.lastName} onChange={this.handleChange} />
                        {submitted && !user.lastName &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={this.handleSubmit} >Register</button>
                    </div>
                </form>
            </div>
            </main>
            </article>
            </Jumbotron>
        );
    }
}

export default RegisterVoter;