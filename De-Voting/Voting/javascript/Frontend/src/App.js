import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import RegisterVoter from './Components/RegisterVoter/RegisterVoter';
import SignInVoter from './Components/SignInVoter/SignInVoter';
import Home from './Components/Home/Home';
import GetCurrentStanding from './Components/GetCurrentStanding/GetCurrentStanding';
import 'tachyons';
import 'bulma/css/bulma.css';
 import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      route: 'signin',
      isSignedIn: false,
      currentUser: null,
      votableItems: null
    }
  }

  

  onRouteChange = (route) => {
    if(route==='signin') {
      this.setState({isSignedIn: false})
      this.setState({isTransactionData: false})
    } else if (route === 'home'){
      this.setState({ isSignedIn: true })
    } else if (route === 'register') {
      this.setState({isSignedIn: false})
    }
    this.setState({route: route})
  }

  onUser = (user) => {
      this.setState({currentUser: user})

  }

  render() {
    const {isSignedIn, route, currentUser} = this.state;
    console.log(currentUser);
    return (  
      <div className="App"> 
          <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} onUser={this.onUser} currentUser={currentUser} />
          {   route === 'signin'
            ? <SignInVoter onRouteChange={this.onRouteChange} currentUser={currentUser} onUser={this.onUser}/>
            : route === 'register'
            ? <RegisterVoter onRouteChange={this.onRouteChange} />
            : route === 'home'
            ? <Home onRouteChange={this.onRouteChange} currentUser={currentUser} />
            : route === 'getcurrentstanding'
            ? <GetCurrentStanding onClickingView={this.onClickingView} />     
            : <div></div>
          }
    </div>
    );
  }
}

export default App;
