import React, { Component } from 'react';
import {Grid, Card, Image, Icon} from 'semantic-ui-react';

class Band extends Component{
	componentWillMount(){
		console.log("mount");
	}
	componentWillUpdate(){
		console.log("update");
	}
	render(){
		console.log("render");
		if (!this.props.info){return null}
		return (
 			<Grid>
				<Grid.Row>
					<Grid.Column width={'16'} style={{
						backgroundColor:'blue'
					}}>
						<Card fluid={true}>
							<Image src=''/>
							<Card.Content>
								<Card.Header>test</Card.Header>
								<Card.Meta>test</Card.Meta>
								<Card.Description>test</Card.Description>
							</Card.Content>
  						</Card>
						11-18<br/>11-19<br/>11-20<br/>{this.props.info["node"]}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}

export default Band;