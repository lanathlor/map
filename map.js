import React, { Component } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {Grid, Input, Icon} from 'semantic-ui-react';
import Band from './bandeau.js';
import firebase from 'firebase';
import Picker from './Picker.js'

const Leaflet = window.L;

var meta;
var ptr;

function getFilter(filter, tags){
	var regexp = new RegExp(filter + '[a-zA-Z0-9\\s]+');

	for (var key in tags){
		if (regexp.test(tags[key]) || filter === tags[key])
			return (true);
	}
	return (false);
}

class Mapper extends Component{
	constructor(props){
		super(props);
		this.state = {
			position: false, // position of all the marker. type : [].
			info:false, // info about all the marker. type : []. info[i] == position[i] : the index is matching for the pos and info.
			center:[48.8699667,2.3116347999999998], // center of the map. change it to make the map move. currently hard coded, will probably be on geoloc.
			OpenInfo:false, // false to hide the marker panel. true to display him.
			clickedMarker:1, //track if a marker was clicked. 1 by default. false to open the search panel, info to open the marker panel
			inputValue: '', // this is equal to the text in the search bar.
			clickTag:false, //false until user click on a orange tag. return to false on : click on blue, click on green, click on map
			key:0 // the picker will display marker with these in the tag. reserved for populare key / catégorie.
		}
		this.position = false;
		this.col = '16'; // the number of col taken by the map. in this version, stay at 16
		this.leafletMap = 0; // pointer on the map object. not used
		ptr = this; // pointer on this object, used in some function to keep this in scope
		this.time = Date.now(); // time at construction. used for test.
	}
	componentWillMount(){
		firebase.database().ref("/map/meta").once("value", function(snapshot){
			meta = snapshot.val();
			firebase.database().ref("/map/tracker").once("value", function(snap){
				var pos = [];
				var info = [];
				var i = 0;
				var j = 0;
				var val = snap.val();
				var keepTag = meta["keepInTag"].split("/");

				for (var key in val){
					pos[i] = [];
					info[i] = [];
					pos[i][0] = val[key]["lat"];
					pos[i][1] = val[key]["lng"];
					info[i]["node"] = meta["node"] + val[key]["node"];
					info[i]["tag"] = val[key]["tag"];
					while (keepTag[j]){
						info[i]["tag"][keepTag[j]] = val[key][keepTag[j]];
						j++;
					}
					j = 0;
					info[i]["key"] = key;
					i++;
				}
				this.setState({position:pos, info:info});
			}.bind(this));
		}.bind(this));
	}
	MoveOnMarker(pos, info){
		var new_pos = [];
		new_pos[0] = pos[0];
		new_pos[1] = pos[1];
		if (new_pos[0] === this.state.center[0] && new_pos[1] === this.state.center[1])
			new_pos[0] += 0.000001;
		this.col = '16';
		this.setState({center:new_pos, move:true, OpenInfo:true, clickedMarker:info, clickTag:false});
	}
	mapMove(){
		this.col = '16';
		this.setState({click:true, OpenInfo:false, clickedMarker:1, clickTag:false});
	}
	handleChange(event){
		ptr.col = '16';
		ptr.setState({filter:event.target.value, OpenInfo:false, clickedMarker:false, clickTag:false, inputValue:event.target.value});
	}
	handleClickBar(){
		if (ptr.state.clickedMarker && ptr.state.clickedMarker !== 1)
			return (null); // dont close the marker panel if open.
		ptr.setState({OpenInfo:false,clickedMarker:false});
	}
	makeAutoSearch(search, state, key){
		ptr.setState({filter:search, OpenInfo:false, clickedMarker:false, inputValue:search, clickTag:state, key:key});
	}
	goToName(pos, info){
		ptr.makeAutoSearch(info["tag"]["name"], false);
		ptr.MoveOnMarker(ptr.state.position[pos], info);
	}
	closeChange(){
		this.setState({filter:'',clickedMarker:1,inputValue:'', clickTag:false})
	}
	getTag(){
		return (meta["pop_tags"])
	}
	render(){
		var pos = this.state.position;
		var info = this.state.info;
		if (!this.state.position)
			return (null);
		var bounds = Leaflet.latLngBounds(pos);
		var dummy = [1];
		var bandeau;
		if (this.state.clickedMarker && this.state.clickedMarker !== 1){
			bandeau = <Grid.Column width={'3'} style={{
						backgroundColor:'white',
						position:"absolute",
						height:"100%",
						top:"55px",
						left:"15px",
						zIndex:100
					}}>
						<Band info={this.state.clickedMarker} ok={this.state.OpenInfo} fct={() => this.mapMove()}/>
					</Grid.Column>
		}
		else if (this.state.clickedMarker === false)
			bandeau = <Grid.Column width={'3'} style={{
						backgroundColor:'white',
						position:"absolute",
						height:"100%",
						top:"55px",
						left:"15px",
						zIndex:100
					}}>
						<Picker 
							tags={this.getTag()}
							filter={this.state.filter}
							click={this.state.clickTag}
							mark={info}
							categorie={this.state.key}
							close={() => this.mapMove()}
							fct={this.makeAutoSearch}
							goName={this.goToName}
						/>
					</Grid.Column>
		else
			bandeau = null;
		return (
			<Grid>
				<Grid.Row>
					<Grid.Column width={'8'}>
						<Input 
							placeholder='Search...'
							value={this.state.inputValue}
							onClick={this.handleClickBar}
							onChange={this.handleChange}
							fluid={true}
							style={{
								backgroundColor:'white',
								position:"absolute",
								width:"50%",
								height:"40px",
								zIndex:100
							}}
						>
							<input/>
							<Icon name='close' onClick={() => this.closeChange()} size={'big'}/>
    					</Input>
					</Grid.Column>
					{bandeau}
					<Grid.Column width={this.col}>
						<Map ref={m => {this.leafletMap = m; }} center={this.state.center} bounds={bounds} onClick={() => this.mapMove()} style={{
							zIndex:1
						}}>
							<TileLayer
								url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
								attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							/>
							<MarkerClusterGroup>
							{Object.keys(dummy).map(dumb => {
								var filtered = [];
								var i = 0;
								var j = 0;
								var markerCluster = Object.keys(pos).map(key =>{
									if (getFilter(this.state.filter, info[key]["tag"]) || !this.state.filter){
										return <Marker position={pos[key]} key={key} onClick={() => this.MoveOnMarker(pos[key], info[key])}/>
									} else
										return true;
									})
								while (markerCluster[i]){
									if (markerCluster[i] !== true){
										filtered[j] = markerCluster[i];
										j++;
									}
									i++;
								}
								return (filtered);
							})}
							</MarkerClusterGroup>
						</Map>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

export default Mapper;
