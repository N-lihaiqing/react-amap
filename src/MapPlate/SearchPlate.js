import React, {Component} from 'react';
import { Input ,Icon} from 'antd';



class SearchPlate extends Component{

    constructor(props){
        super(props);
    }



    render(){

        return(
            <div style={{zIndex:'2',position:'absolute',left:'80px',top:'50px'}}>
                <Input addonBefore={"测试"}  placeholder="Basic usage" addonAfter={<Icon type="setting" />}/>
                <button><Icon type="search"/></button>
                <button><Icon type="ellipsis"/></button>
            </div>
        )
    }
}

export default SearchPlate;