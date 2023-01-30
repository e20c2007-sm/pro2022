class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "archive": false,
            "setting": false,
            "showed": false
        }
    }

    showMenu = (key)=>{
        let showState = this.state.showed;
        let targetFlag = this.state[key];
        if(showState){
            if(targetFlag){
                this.setState({
                    [key]: false,
                    "showed": false
                });
                this.props.gameStoper();
            }else{
                this.setState({
                    "archive": false,
                    "setting": false,
                });
                setTimeout(()=>{
                    this.setState({
                        [key]: true
                    });
                }, 100);
            }
        }else{
            this.setState({
                [key]: !targetFlag,
                "showed": true
            });
            this.props.gameStoper();
        }
    }

    render(){

        return(
            <div id="menu-container">
                <div id="menu-container-inner">
                    <div id="menu-btn-container">
                        <div
                            style={{
                                "opacity": (!(this.state.archive) && this.state.showed) ? 0.4 : 1
                            }}
                            className="menu-btn"
                            id="archive-btn"
                           onClick={()=>this.showMenu("archive")} 
                        >実績</div>
                        <div
                            style={{
                                "opacity": (!(this.state.setting) && this.state.showed) ? 0.4 : 1
                            }}
                            className="menu-btn"
                            id="setting-btn"
                            onClick={()=>this.showMenu("setting")}     
                        >設定</div>
                    </div>

                    <div
                        id="bg-screen"
                        style={{
                            "transition": "500ms linear",
                            "opacity": this.state.showed ? 1 : 0,
                            "pointerEvents": this.state.showed ? "auto" : "none"
                        }}    
                    >
                        <div style={{"position": "absolute", "opacity": this.state.archive ? 1 : 0, "pointerEvents": this.state.archive ? "auto" : "none"}}><Archive getResrcData={()=>{return this.props.getResrcData()}}></Archive></div>
                        <div style={{"position": "absolute", "opacity": this.state.setting ? 1 : 0, "pointerEvents": this.state.setting ? "auto" : "none"}}><Setting></Setting></div>
                    </div>
                </div>
            </div>
        );
    }
}


class Archive extends React.Component{
    constructor(props){
        super(props);
        
        this.interval;
    }

    getResrcData = ()=>{
        return this.props.getResrcData();
    }

    resrcCheck = ()=>{
        let data = this.getResrcData();

    }

    componentDidMount(){
        this.interval = setInterval(()=>{
            this.resrcCheck();
        }, 200);
    }

    render(){
        return(
            <div id="archive-container">
                <div className="menu-title">実績</div>
                <div className="menu-title-sub">Archive</div>
            </div>
        );
    }
}

class Setting extends React.Component{
    constructor(props){
        super(props);

    }

    changedVolume = (key, e)=>{
        let volume = e.target.value;
        if(volume > 0){
            volume /= 20;
        }
        volumeChange({key: key, volume: volume});
    }

    render(){
        return(
            <div id="setting-container">
                <div className="menu-title">設定</div>
                <div className="menu-title-sub">Setting</div>

                <div className="range-mask">
                    <div className="range-name">BGM</div>
                    <input type={"range"} value={volumes.bgm*20} className="volume-range" min={0} max={20} onChange={(e)=>this.changedVolume("bgm", e)}></input>
                </div>

                <div className="range-mask" >
                    <div className="range-name">SE</div>
                    <input type={"range"} value={volumes.se*20} className="volume-range" min={0} max={20} onChange={(e)=>this.changedVolume("se", e)}></input>
                </div>
            </div>
        );
    }
}