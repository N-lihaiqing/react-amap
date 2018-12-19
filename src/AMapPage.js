import React, {Component} from 'react';
import SearchPlate from "./MapPlate/SearchPlate";
import AMapData from "./AMapData";
import DropdownFun from "./DropdownFun";



class AMapPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            turnOn: false,
        }
    }


    render() {

        return (
            <div>
                <SearchPlate/>
                <AMapData/>
                <DropdownFun/>
            </div>
        );
    }


}

export default AMapPage;