import React, { Component } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {Grid} from 'semantic-ui-react';
import Band from './bandeau.js';
const Leaflet = window.L;

var position = {
	point1: {lat:48.8699667,lng:2.3116347999999998, node:"test"},
	point2: {lat:48.8669667,lng:2.3119347999999998, node:"test2"},
}

class Mapper extends Component{
	constructor(props){
		super(props);
		this.state = {
			position: false,
			info:false,
			center:[48.8699667,2.3116347999999998],
			OpenInfo:false,
			clickedMarker:false
		}
		this.position = false;
		this.col = '16';
		this.leafletMap = 0;
	}
	componentWillMount(){
		navigator.geolocation.getCurrentPosition(function(snap){
			var pos = [];
			var info = [];
			var i = 0;

			for (var key in position){
				pos[i] = [];
				info[i] = [];
				pos[i][0] = position[key]["lat"];
				pos[i][1] = position[key]["lng"];
				info[i]["node"] = position[key]["node"];
				i++;
			}
			this.setState({position:pos, info:info});
		}.bind(this));
	}
	MoveOnMarker(pos, info){
		if (pos[0] === this.state.center[0] && pos[1] === this.state.center[1])
			pos[0] += 0.000001;
		this.col = '14';
		this.setState({center:pos, move:true, OpenInfo:true, clickedMarker:info});
	}
	mapMove(){
		this.col = '16';
		this.setState({click:true, OpenInfo:false, clickedMarker:false});
	}
	render(){
		var bande = this.col === '16' ? '1' : '2';
		var pos = this.state.position;
		var info = this.state.info;
		var i = 0;
		if (!this.state.position)
			return (null);
		var bounds = Leaflet.latLngBounds(pos);
		return (
			<Grid>
				<Grid.Row>
					<Grid.Column width={bande} style={{
						backgroundColor:'white',
					}}>
						<Band info={this.state.clickedMarker} ok={this.state.OpenInfo}/>
					</Grid.Column>
					<Grid.Column width={this.col}>
						<Map ref={m => {this.leafletMap = m; }} center={this.state.center} bounds={bounds} onClick={() => this.mapMove()}>
							<TileLayer
								url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
								attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							/>
							<MarkerClusterGroup>
							{Object.keys(pos).map(key =>{
								return <Marker position={pos[key]} key={key} onClick={() => this.MoveOnMarker(pos[key], info[key])}/>
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