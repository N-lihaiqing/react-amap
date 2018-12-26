import React from 'react';
import "./MapTypeWrapper.css";

class MapTypeWrapper extends React.Component{

    constructor(prop){
        super(prop);
    }

    hiddenDiv = () => {
        var $ = require("jquery");
        $("#mapType-wrapper").removeClass("expand");
    };

    showDiv = () => {
        var $ = require("jquery");
        $("#mapType-wrapper").addClass("expand");
    };

    mapType = (e) => {
        var $ = require("jquery");
        $(".mapTypeCard").removeClass("active");
        $(e.target).addClass("active");
        let className = $(e.target).prop("className").split(" ")[1];
        if(className == "normal"){

        } else if (className == "earth"){

        }
    };

    render(){
        return(
            <div className={"type-wrapper"} onMouseOut={this.hiddenDiv} onMouseOver={this.showDiv}>
                <div id="mapType-wrapper" className="">
                    <div id="mapType">
                        <div className="mapTypeCard normal active" onClick={this.mapType} >
                            {/*<div className="switch-box"><input type="checkbox" className="switch" />
                                <p>显示收藏点</p>
                            </div>*/}
                            <span>二维</span>
                        </div>
                        <div className="mapTypeCard earth" onClick={this.mapType}>
                            {/*<div className="switch-box"><input type="checkbox" className="switch" defaultChecked={true} />
                                <p>开启路网</p>
                            </div>*/}
                            <span>三维</span>
                        </div>
                        {/*<div className="mapTypeCard panorama choosedType active" data-name="panorama">
                            <span>全景</span>
                        </div>*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default MapTypeWrapper;