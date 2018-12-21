import React from 'react';
import {Input, Icon, Tabs, Button} from 'antd';
import 'antd/dist/antd.css';
import './map.css';

let navigateWay = 'Driving';
let startLocation = [];
let endLocation = [];

class SearchPlate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchFrame: 'block',
            navigate: 'none'
        };

    }

    callback = (key) => {
        navigateWay = key;
        console.log(navigateWay);
    };


    /*打开导航*/
    openNavigate = () => {
        this.props.handle((result) => {
            startLocation.push(result.position.lat);
            startLocation.push(result.position.lng);
            console.log(startLocation);
        });
        this.setState({
            searchFrame: 'none',
            navigate: 'block'
        })
    };

    /*开启导航*/
    startPOI = () => {
        this.onLoadPOI((result) => {
            endLocation = result;
        })
    };

    /*加载POI搜索*/
    onLoadPOI = (callback) => {
        window.map.plugin('AMap.Autocomplete', function () {
            // 实例化Autocomplete
            let autoOptions = {
                // input 为绑定输入提示功能的input的DOM ID
                input: 'routeWay-end'
            };
            let autoComplete = new window.AMap.Autocomplete(autoOptions);


            window.AMap.event.addListener(autoComplete, 'select', onComplete);

            function onComplete(data) {
                debugger;
                let endLocation = [];
                endLocation.push(data.poi.location.lat);
                endLocation.push(data.poi.location.lng);
                callback(endLocation);
            }
        })
    };


    closeNavigate = () => {
        this.setState({
            searchFrame: 'block',
            navigate: 'none'
        })
    };

    render() {
        const {searchFrame, navigate} = this.state;
        return (


            <div className="search-parent">
                <div style={{display: searchFrame}}>
                    <input className="search-input-way" placeholder="Basic usage"/>
                    <div onClick={this.openNavigate} className="search-route"/>
                </div>
                <div onClick={this.search} className="search-button"/>
                <div className="search-circle"/>
                <div className="search-navigate" style={{display: navigate}}>
                    <div className="searchbox-content-common ">
                        <Tabs defaultActiveKey="Driving" onChange={this.callback}>
                            <Tabs.TabPane tab={<span className="bus-tab"><i/>公交</span>} key="Transfer"/>
                            <Tabs.TabPane tab={<span className="car-tab"><i/>驾车</span>} key="Driving"/>
                            <Tabs.TabPane tab={<span className="walk-tab"><i/>步行</span>} key="Walking"/>
                            <Tabs.TabPane tab={<span className="bike-tab"><i/>骑行</span>} key="Riding"/>
                        </Tabs>
                    </div>
                    <div className="search-route-start">
                        <div className="route-input-icon"/>
                        <input className="route-input" placeholder="我的位置"/>
                        <div className="route-clear"/>
                    </div>
                    <div className="search-route-end">
                        <div className="route-input-icon"/>
                        <input id="routeWay-end" onMouseOver={this.startPOI} className="route-input"
                               placeholder="输入终点或在图区上选点"/>
                    </div>
                    <div className="search-change">
                        <div className="change-start-end"/>
                    </div>
                    <div className="search-add-white"/>
                    <div className="search-closeNavigate" onClick={this.closeNavigate}/>
                </div>
            </div>

        )
    }
}

export default SearchPlate;