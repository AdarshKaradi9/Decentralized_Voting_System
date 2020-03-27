import React from 'react'

class GetCurrentStanding extends React.Component {
    constructor() {
        super();
        this.state = {
            votables:{}
        }
        this.getVotables();
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

    renderResults = () => {
        const {votables} =this.state
        console.log(votables);
        if (votables.length > 0) {
            <div>Vote Here:</div>
            return this.state.votables.map(votable => {
                return(
                   <ul>
                     <li>
                       <label>
                         <strong>{votable.Key}</strong>: {votable.Record.count}
                       </label>
                     </li>
                    </ul>
                
                )
               })
            }
            
        }


    render() {
        return (
            <div>
            <h1>Results</h1>
            <div>{this.renderResults()}</div>
            </div>
        )
    }
}

export default GetCurrentStanding;