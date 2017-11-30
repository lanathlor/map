import React, { Component } from 'react';
import {Grid, Label} from 'semantic-ui-react';

function getFilter(filter, tags){
	var regexp = new RegExp(filter + '[a-zA-Z0-9\\s]+');

	for (var key in tags){
		if ((regexp.test(tags[key]) || filter === tags[key]) && key !== 'name')
			return (key);
	}
	return (-1);
}

class Picker extends Component{
	getTag(tag, state){
		console.log(tag);
		if (tag === this.props.filter){
			console.log("1");
		}
		this.props.fct(tag, state);
	}
	getName(i, state){
		this.props.goName(i, state);
	}
	render(){
		var regexp = new RegExp(this.props.filter + '[a-zA-Z0-9\\s]+');
		var tags = this.props.tags;
		return (
			<Grid>
				{Object.keys(tags).map(key => {
					if ((regexp.test(tags[key]) || this.props.filter === tags[key] || !this.props.filter || this.props.click)){
						return (
							<Grid.Row key={key}>
								<Grid.Column width={'16'}>
									<Label color={'orange'} size={"huge"} onClick={() => this.getTag(tags[key], true)}>
										<a>{tags[key]}</a>
									</Label>
								</Grid.Column>
							</Grid.Row>
						)
					} else
						return null;
				})}
				{Object.keys(this.props.mark).map(key =>{
					var info_tags = this.props.mark[key]["tag"];
					if ((regexp.test(info_tags["name"]) && this.props.filter) || this.props.filter === info_tags["name"]){
						return (
							<Grid.Row key={key}>
								<Grid.Column width={'16'}>
									<Label color={'blue'} size={"huge"} onClick={() => this.getName(key, this.props.mark[key])}>
										<a>{info_tags["name"]}</a>
									</Label>
								</Grid.Column>
							</Grid.Row>
						)
					}
					return (null);
				})}
				{Object.keys(this.props.mark).map(key =>{
					var info_tags = this.props.mark[key]["tag"];
					var ret = getFilter(this.props.filter, info_tags);
					if (ret !== -1 && this.props.filter){
						return (
							<Grid.Row key={key}>
								<Grid.Column width={'16'}>
									<Label color={'green'} size={"huge"} onClick={() => this.getTag(info_tags["name"], false)}>
										<a>{info_tags["name"]} : {info_tags[ret]}</a>
									</Label>
								</Grid.Column>
							</Grid.Row>
						)
					}
					return (null);
				})}
			</Grid>
		)
	}
}

export default Picker;