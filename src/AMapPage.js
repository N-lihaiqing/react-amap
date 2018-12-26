import React, {Component} from 'react';
import SearchPlate from "./MapPlate/SearchPlate";
import AMapData from "./AMapData";
import DropdownFun from "./ToolBox/DropdownFun";
import ToolBar from "./ToolZoom/ToolBar";
import MapTypeWrapper from "./MapTypeWrapper/MapTypeWrapper";



class AMapPage extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){

    }

    render() {
        return (
            <div>
                <SearchPlate />
                <AMapData />
                <DropdownFun />
                <ToolBar/>
                <MapTypeWrapper/>
            </div>
        );
    }


}

export default AMapPage;