import React,{Component} from 'react';
import NavBar from './components/Navbar'
import Drilling from './components/Drilling'
import Completion from './components/Completion'
import RedBox from './components/RedBox'
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import './App.css';

export default class App extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>
        <div className="crownquest">CROWNQUEST</div>
        <BrowserRouter>
        <NavBar/>
        <Switch>
          <Route exact path="/" component={Drilling}/>
          <Route exact path="/completion" component={Completion}/>
          <Route exact path="/redbox" component={RedBox}/>
        </Switch>
      </BrowserRouter>
      </div>
      
    )
  }
}