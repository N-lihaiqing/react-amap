import React from 'react'
import {Map, Marker} from 'react-amap';


const gaodeMapSdk = 'https://webapi.amap.com/maps?v=1.4.2&key=0325e3d6d69cd56de4980b4f28906fd8';

let map = null, marker = null, geocoder = null, zoomLevel = 15;

class AMapModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: [114.066852, 22.562341],
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    /** 鼠标双击事件 */
    mapDblclick = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        this.setState({center: center});
        console.log("鼠标双击事件 " + center);
        // this.InfoWindow(e);
    };

    /** 鼠标单击事件 */
    mapClick = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        // this.setState({center: center});
        console.log("鼠标单击事件 " + center);
    };

    /** 鼠标移动事件 */
    mousemove = (e) => {


    };


    getMarker = (lnglats) => {
        let gspType = null;
        return (
            lnglats.map(function (item, index) {

                let url = "https://webapi.amap.com/theme/v1.3/markers/n/mark_b"+(index+1)+".png";
                if(index === 1){
                    gspType = "bringInfo";
                } else if(index === 2){
                    gspType = "dires";
                } else if(index === 3){
                    gspType = "track";
                } else if(index === 4){
                    gspType = "danger"
                }
                return(
                    <Marker
                        position={{longitude: item[0], latitude: item[1]}}
                        icon={url}
                        extData={lnglats}
                        key={index}
                        gspType={gspType}
                    />
                )
            })
        )
    };

    render() {

        let lnglats = [
            [114.127277,22.53317],
            [113.988574,22.567414],
            [114.081958,22.639678],
            [113.992694,22.501455]
        ];

        let marker = this.getMarker(lnglats);
        return (
            <Map
                style={{width: 1600, height: 800}}
                options={{center: this.state.center, layers: this.state.layers}}
                center={this.state.center}
                zoom={12}
                events={{
                    click: this.mapClick,
                    dblclick: this.mapDblclick,
                    mousemove: this.mousemove,
                }}
            >
                {marker}
            </Map>
        )
    }
}

export default AMapModule;