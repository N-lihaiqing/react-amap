import React from 'react';
import {Input, Icon, Tabs, Button} from 'antd';
import 'antd/dist/antd.css';
import './map.css';
import {location} from "../component"

let navigateWay = 'Driving';
let startLocation = [];
let driving;

class SearchPlate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchFrame: 'block',
            navigate: 'none',
            flag:false,
            endLocation:[]
        };

    }

    callback = (key) => {
        const {flag} = this.state;
        navigateWay = key;

        if(flag){
            this.setState({
                flag:false
            });

        }
    };


    /*打开导航*/
    openNavigate = () => {

        location((result)=>{
            startLocation.push(result.position.lng);
            startLocation.push(result.position.lat);
            console.log(startLocation);
        });
        this.setState({
            searchFrame: 'none',
            navigate: 'block'
        })
    };


    /*开始导航*/
    startNavigate = (endLocation) =>{

        if(driving){
            driving.clear();
        }

        let map = window.map;
        /*驾车路线规划*/
        if(navigateWay=='Driving'){

            this.state.flag=true;
            map.plugin("AMap.Driving", function() {
                driving = new window.AMap.Driving({
                    policy: window.AMap.DrivingPolicy.LEAST_TIME,
                    map:map,
                });

                driving.search(startLocation, endLocation, function (status, result) {
                    /*if(status=='complete'){
                        endLocation=[];
                    }*/
                });


            });
        }

        /*公交路线规划*/
        if(navigateWay=='Transfer'){

            this.state.flag=true;
            map.plugin("AMap.Transfer", function() {
                driving = new window.AMap.Transfer({
                    map:map,
                });

                driving.search(startLocation, endLocation, function (status, result) {
                    /*if(status=='complete'){
                        endLocation=[];
                    }*/
                });

            });
        }

        /*步行路线规划*/
        if(navigateWay=='Walking'){
            this.state.flag=true;
            map.plugin("AMap.Walking", function() {
                driving = new window.AMap.Walking({
                    map:map,
                });

                driving.search(startLocation, endLocation, function (status, result) {
                    /*if(status=='complete'){
                        endLocation=[];
                    }*/
                });

            });
        }

        /*骑行路线规划*/
        if(navigateWay=='Riding'){
            this.state.flag=true;
            map.plugin("AMap.Riding", function() {
                driving = new window.AMap.Riding({
                    // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
                    policy: window.AMap.RidingPolicy.LEAST_TIME,
                    map:map,
                });

                driving.search(startLocation, endLocation, function (status, result) {
                    /*if(status=='complete'){
                        endLocation=[];
                    }*/
                });

            });
        }
    };

    /*加载POI搜索*/
    onLoadPOI = () => {

        let map = window.map;
        let that = this;
        map.plugin('AMap.Autocomplete', function () {
            // 实例化Autocomplete
            let autoOptions = {
                // input 为绑定输入提示功能的input的DOM ID
                input: 'routeWay-end'
            };
            let autoComplete = new window.AMap.Autocomplete(autoOptions);


            window.AMap.event.addListener(autoComplete, 'select', onComplete);

            function onComplete(data) {

                let location = [];
                location.push(data.poi.location.lng);
                location.push(data.poi.location.lat);

                that.setState({
                   endLocation:location
                });
                /*replaceState(object nextState[, function callback])*/
                debugger;
                console.log(location);

                that.startNavigate(location);

            }
        });

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
                        <input id="routeWay-end" onMouseOver={this.onLoadPOI} className="route-input"
                               placeholder="输入终点"/>
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