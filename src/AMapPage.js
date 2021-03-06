import React, {Component} from 'react';
import MapTypeWrapper from "./MapTypeWrapper/MapTypeWrapper";
import SecondDimensional from "./SecondDimensional";
import Toolbox from "./ToolBox/Toolbox";
import SearchPlate from "./MapPlate/SearchPlate";


class AMapPage extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){

    }

    handle = (type) => {
        if(type==='2'){
            this.refs.second.showDimensional('block');
            this.refs.three.showDimensional('none');
        }else if(type==='3'){
            this.refs.second.showDimensional('none');
            this.refs.three.showDimensional('block');
        }
    };


    render() {
        return (
            <div>
                <MapTypeWrapper handle={this.handle}/>
                <SecondDimensional ref="second"/>
            </div>
        );
    }


}

export default AMapPage;