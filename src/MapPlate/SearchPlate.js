import React from 'react';
import {Tabs} from 'antd';
import 'antd/dist/antd.css';
import './map.css';
import $ from 'jquery';



class SearchPlate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchFrame: 'block',
            navigate: 'none',
            routeClearEnd:'none'
        };
        this.navigateWay = 'Driving'; //    导航方式
        this.startLocation = [];      //    起点坐标
        this.driving='';              //    导航路径
        this.cityCode='';             //    城市编码
        this.endLocation=[];          //    终点坐标
    }

    changeTabs = (key) => {

        this.navigateWay = key;

        if(this.endLocation.length>0){
            this.startNavigate(this.endLocation);
        }
    };


    /*打开导航*/
    openNavigate = () => {

        if(sessionStorage.getItem('startLocation') && sessionStorage.getItem('cityCode')){

            this.startLocation = sessionStorage.getItem('startLocation').split(',');
            this.cityCode = sessionStorage.getItem('cityCode');
        }
        this.setState({
            searchFrame: 'none',
            navigate: 'block'
        })
    };


    /*开始导航*/
    startNavigate = (endLocation) =>{

        if(this.driving){
            this.driving.clear();
        }

        let map = window.map;
        let that = this;
        /*驾车路线规划*/
        if(this.navigateWay=='Driving'){

            this.state.flag=true;
            map.plugin("AMap.Driving", function() {
                that.driving = new window.AMap.Driving({
                    policy: window.AMap.DrivingPolicy.LEAST_TIME,
                    map:map,
                });

                that.driving.search(that.startLocation, endLocation, function (status, result) {
                    /*if(status=='complete'){
                        endLocation=[];
                    }*/
                });


            });
        }

        /*公交路线规划*/
        if(this.navigateWay=='Transfer'){

            this.state.flag=true;
            map.plugin("AMap.Transfer", function() {
                that.driving = new window.AMap.Transfer({
                    map:map,
                    city:that.cityCode
                });

                that.driving.search(that.startLocation, endLocation, function (status, result) {
                });

            });
        }

        /*步行路线规划*/
        if(this.navigateWay=='Walking'){
            this.state.flag=true;
            map.plugin("AMap.Walking", function() {
                that.driving = new window.AMap.Walking({
                    map:map,
                });

                that.driving.search(that.startLocation, endLocation, function (status, result) {
                    /*if(status=='complete'){
                        endLocation=[];
                    }*/
                });

            });
        }

        /*骑行路线规划*/
        if(this.navigateWay=='Riding'){
            this.state.flag=true;
            map.plugin("AMap.Riding", function() {
                that.driving = new window.AMap.Riding({
                    // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
                    policy: window.AMap.RidingPolicy.LEAST_TIME,
                    map:map,
                });

                that.driving.search(that.startLocation, endLocation, function (status, result) {
                    /*if(status=='complete'){
                        endLocation=[];
                    }*/
                });

            });
        }
    };

    /* 起始点坐标的POI搜索 */
    startOPI = () =>{

        let map = window.map;
        let that = this;
        map.plugin('AMap.Autocomplete', function () {
            // 实例化Autocomplete
            let autoOptions = {
                // input 为绑定输入提示功能的input的DOM ID
                input: 'routeWay-start'
            };
            let autoComplete = new window.AMap.Autocomplete(autoOptions);


            window.AMap.event.addListener(autoComplete, 'select', onComplete);

            function onComplete(data) {

                that.startLocation = [];
                that.startLocation.push(data.poi.location.lng);
                that.startLocation.push(data.poi.location.lat);

            }
        });

    };

    /* 终点POI搜索 */
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

                that.endLocation = [];
                that.endLocation.push(data.poi.location.lng);
                that.endLocation.push(data.poi.location.lat);
                that.setState({
                    routeClearEnd:'block'
                });
                that.startNavigate(that.endLocation);

            }
        });

    };

    //  关闭路线导航
    closeNavigate = () => {

        if(this.driving){
            this.driving.clear();
        }

        this.setState({
            searchFrame: 'block',
            navigate: 'none',
            routeClearEnd:'none'
        });

        this.startLocation = [];

        $('#routeWay-start').val('');
        $('#routeWay-end').val('');
        $('#routeWay-end').attr('placeholder','终点位置')
    };

    //  清除所选的终点位置
    clearEndLocation=()=>{

        if(this.driving){
            this.driving.clear();
        }
        this.endLocation=[];
        $('#routeWay-end').val('');
    };

    //  更换查询路线
    changeRoute =()=>{
        let startHtml = $('#routeWay-start').val();
        let endHtml = $('#routeWay-end').val();
        $('#routeWay-start').val(endHtml);

        if(startHtml==''){
            $('#routeWay-end').val('');
            $('#routeWay-end').attr('placeholder','我的位置')
        }else{
            $('#routeWay-end').val(startHtml);
        }


        let location = this.endLocation;
        this.endLocation = this.startLocation;
        this.startLocation = location;

        this.startNavigate(this.endLocation);
    };

    render() {
        const {searchFrame, navigate,routeClearEnd} = this.state;
        return (


            <div className="search-parent">
                <div style={{display: searchFrame}}>
                    <input className="search-input-way" placeholder="请输入设施和道路名称"/>
                    <div title="路线" onClick={this.openNavigate} className="search-route"/>
                </div>
                <div onClick={this.search} className="search-button"/>
                <div className="search-circle"/>
                <div className="search-navigate" style={{display: navigate}}>
                    <div className="searchbox-content-common ">
                        <Tabs defaultActiveKey="Driving" onChange={this.changeTabs}>
                            <Tabs.TabPane tab={<span className="bus-tab"><i/>公交</span>} key="Transfer"/>
                            <Tabs.TabPane tab={<span className="car-tab"><i/>驾车</span>} key="Driving"/>
                            <Tabs.TabPane tab={<span className="walk-tab"><i/>步行</span>} key="Walking"/>
                            <Tabs.TabPane tab={<span className="bike-tab"><i/>骑行</span>} key="Riding"/>
                        </Tabs>
                    </div>
                    <div className="search-route-start">
                        <div className="route-input-icon"/>
                        <input id="routeWay-start" className="route-input" onClick={this.startOPI} placeholder="我的位置"/>
                        <div className="route-clear"/>
                    </div>
                    <div className="search-route-end">
                        <div className="route-input-icon"/>
                        <input id="routeWay-end" onMouseOver={this.onLoadPOI} className="route-input"
                               placeholder="请输入终点位置"/>
                        <div onClick={this.clearEndLocation} style={{display:routeClearEnd}} className="route-clear-end"/>
                    </div>
                    <div onClick={this.changeRoute} className="search-change">
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