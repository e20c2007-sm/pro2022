class Info extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            resrc: 0
        }
        this.interval;
    }

    // Farmの関数getResrcData()を実行
    getResrcData = ()=>{
        return this.props.getResrcData();
    }

    resrcCheck = ()=>{
        let srcNum = this.getResrcData().resource;
        if(srcNum != this.state.resrc){
            this.setState({
                resrc: srcNum
            });
        }
    }

    componentDidMount(){
        this.interval = setInterval(()=>{
            this.resrcCheck();
        }, 200);
    }

    render(){
        return(
            <div id={"info-container"}>
                <div id="info-nav">
                    {this.state.resrc}
                </div>
            </div>
        );
    }
}