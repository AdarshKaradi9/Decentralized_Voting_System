import React from 'react'
import 'tachyons';
class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            votables: {},
            picked: null,
            election: null,
            ballotCast: false
        }
        this.getVotables();
        this.getElections();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getVotables = () => {
        const ip = process.env.REACT_APP_IP
        fetch(`http://${ip}:3001/queryWithQueryString` , {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                selected: 'votableItem'
            })
        })
        .then(response => response.json())
        .then(data => this.setState({ votables:data}));
    }

    getElections = () => {
        const ip = process.env.REACT_APP_IP
            fetch(`http://${ip}:3001/queryWithQueryString` , {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    selected: 'election'
                })
            })
            .then(response => response.json())
            .then(data1 => this.setState({ election:data1}))
            }

    handleChange(e) {
        this.setState({ [e.target.name] : e.target.value });
     }
              

    handleSubmit(event) {
        event.preventDefault();
        const ip = process.env.REACT_APP_IP;
        this.setState({ submitted: true });
         fetch(`http://${ip}:3001/castBallot`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                voterId: this.props.currentUser.data.voterId,
                electionId: this.state.election[0].Record.electionId,
                picked: this.state.picked
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                this.setState({ ballotCast: data.ballotCast})
                alert(`You voted for ${this.state.picked} with voter Id ${this.props.currentUser.data.voterId}`);
            }
            else 
                alert(`${data.error}`)
            })
        
    }
      

    handleResult = () => {
        this.props.onRouteChange('getcurrentstanding');
    }

    renderVotables = () => {
        const {votables} =this.state
        console.log(votables);
        if (votables.length > 0) {
            <div>Vote Here:</div>
            return this.state.votables.map(votable => {
                return(
                   <ul>
                     <li>
                       <label>
                         <input
                           type="radio"
                           value={votable.Key}
                           name="picked"
                           checked={this.state.picked === votable.Key}
                           onChange={this.handleChange}
                         />
                         {votable.Key} {votable.Record.description}
                       </label>
                     </li>
                    </ul>
                
                )
               })
            }
            
        }
    render() {
        return (
            <div className='jumbotron'>
                <div className='center'>
                    <h1>Votable Items</h1>
                        <form onSubmit={this.handleSubmit}> {this.renderVotables()}
                            <button type="submit" onClick={this.handleSubmit} >Cast Vote</button> 
                        </form>
                        {   this.state.ballotCast==true
                            ?<div>Your voter Id is {this.props.currentUser.data.voterId} and you have voted for {this.state.picked} </div>
                            :<div></div> }
                    <button type="submit" onClick={this.handleResult} >Current Results</button> 
                 </div>
            </div>
            
        )
    }
}

export default Home;