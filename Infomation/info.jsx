class Info extends React.Component{
    constructor(props){
        super(props);
    }

    // Farmの関数getResouceData()を実行
    getResrcData = ()=>{
        return this.props.getResouceData();
    }

    render(){
        return(
            <div id={"info-container"}>
                <b>岩﨑</b>
            </div>
        );
    }
}