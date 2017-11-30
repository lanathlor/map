import React, { Component } from 'react';
import {Grid, Card, Icon} from 'semantic-ui-react';
import firebase from 'firebase';
var config = {
	apiKey: "AIzaSyCLVpmJeXOD2_q3XedlpEaGGpSog0kQjBM",
	authDomain: "monkeymoneyfrance.firebaseapp.com",
	databaseURL: "https://monkeymoneyfrance.firebaseio.com",
	projectId: "monkeymoneyfrance",
	storageBucket: "monkeymoneyfrance.appspot.com",
	messagingSenderId: "451894989456"
};
firebase.initializeApp(config);

class Band extends Component{
	constructor(props){
		super(props)
		this.state = {
			info:false,
			node:false
		}
		this.i = 0;
	}
	componentWillMount(){
		firebase.database().ref(this.props.info["node"]).once("value", function(snap){
			this.i++;
			this.setState({node:snap.val()});
		}.bind(this))
	}
	componentWillUpdate(){
	}
	componentWillReceiveProps(props){
		firebase.database().ref(props.info["node"]).once("value", function(snap){
			this.i++;
			this.setState({node:snap.val()});
		}.bind(this))
	}
	render(){
		if (!this.props.info || !this.state.node){return null}
		this.i++;
		return (
 			<Grid key={this.i} >
				<Grid.Row key={this.i} >
					<Grid.Column width={'16'} key={this.i}>
						<Card 
							fluid={true}
							image={this.state.node["image"]}
							header={this.state.node["header"]}
							meta={this.state.node["meta"]}
							description={this.state.node["description"]}
							extra={<Icon name='close' onClick={() => this.props.fct()} size={'big'}/>}
							key={this.i}
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}

export default Band;
