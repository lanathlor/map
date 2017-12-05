import React, { Component } from 'react';
import {Grid, List} from 'semantic-ui-react';

function getFilter(filter, tags){
	var regexp = new RegExp(filter + '[a-zA-Z0-9\\s]+');

	for (var key in tags){
		if ((regexp.test(tags[key]) || filter === tags[key]) && key !== 'name')
			return (key);
	}
	return (-1);
}

class Picker extends Component{
	getTag(tag, state, key){
		console.log(key);
		this.props.fct(tag, state, key); // call map.makeAutoSearch
	}
	getName(i, state){
		this.props.goName(i, state); //call map.goToName. zoom and open the marker panel
	}
	render(){
		var regexp = new RegExp(this.props.filter + '[a-zA-Z0-9\\s]+');
		var tags = [];
		var icon = [];
		var key_pop = [];
		var already_did = [];
		for (var key in this.props.tags){
			tags.push(this.props.tags[key]["label"]); // the icon and name are linked by key
			icon.push(this.props.tags[key]["icon"]);
			key_pop.push(key);
		}
		return (<Grid.Column width={'16'} style={{padding:'0.5em 0em 0em 0.6em',width:'350px'}}>
                <List relaxed size='big' divided style={{background:'white'}}>
                    {Object.keys(tags).map(key=>{ // popular tag
                    	if (this.props.filter) {return (null)} // if the user start to type in the search bar, we dont render the pop tag
                        return(
                            <List.Item key={key} style={{padding:'0.5em'}} onClick={()=> this.getTag(tags[key], true, key_pop[key])}>
                                {//<List.Icon name={icon[key]} size='large' verticalAlign='middle' />
                            	}
                                <List.Content verticalAlign={'middle'}>
                                    <List.Header >{tags[key]}</List.Header>
                                </List.Content>
                            </List.Item>
                        )
                    })}
                    {Object.keys(this.props.mark).map(key => { // by name
                    	var info_tags = this.props.mark[key]["tag"];
                    	if ((regexp.test(info_tags["name"]) && this.props.filter) || this.props.filter === info_tags["name"]){
							already_did[key] = 1; // if we reader by name, we save it to dont render a second time by tag
							return (
								<List.Item key={key} style={{padding:'0.5em'}} onClick={()=> this.getName(key, this.props.mark[key])}>
									<List.Content verticalAlign={"middle"}>
										<List.Header> {info_tags["name"]} </List.Header>
									</List.Content>
								</List.Item>
							)
						}
						return (null);
                    })}
                    {Object.keys(this.props.mark).map(key =>{ //by key_pop
					var info_tags = this.props.mark[key]["tag"];
					if (this.props.categorie === info_tags["categorie"]){
						already_did[key] = 1;
						return (
							<List.Item key={key} style={{padding:'0.5em'}} onClick={()=> this.getName(key, this.props.mark[key])}>
								<List.Content width={'16'}>
									<List.Header>{info_tags["name"]}</List.Header>
								</List.Content>
							</List.Item>
						)
					}
					return (null);
					})}
                    {Object.keys(this.props.mark).map(key =>{ //by tag
					var info_tags = this.props.mark[key]["tag"];
					var ret = getFilter(this.props.filter, info_tags);
					if (ret !== -1 && this.props.filter && !already_did[key]){
						return (
							<List.Item key={key} style={{padding:'0.5em'}} onClick={()=> this.getName(key, this.props.mark[key])}>
								<List.Content width={'16'}>
									<List.Header>{info_tags["name"]}</List.Header>
								</List.Content>
							</List.Item>
						)
					}
					return (null);
					})}
                </List>
            </Grid.Column>);
	}
}

export default Picker;