class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "archive": false,
            "setting": false,
            "showed": false,
            "guideElems": []
        }
        this.guides = [];
        this.interval;
        this.clears = 0;
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

    componentDidMount(){
        setInterval(()=>{
            if($(".cleared-archive").length > this.clears){
                this.clears = $(".cleared-archive").length;

                this.guides.push(
                    <div className="guide-item" onClick={()=>this.showMenu("archive")}>
                        {"実績を解除しました。"}
                    </div>
                );
                this.setState({
                    guideElems: this.guides
                });
                playSound({
                    path: "./sounds/popGuide.mp3",
                    key: "se"
                });

                setTimeout(()=>{
                    this.guides.splice(0, 1);
                    this.setState({
                        guideElems: this.guides
                    });
                }, 10000);
            }
        }, 500);
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
                        ><img className="menu-icon" src="./Menu/archive.png" /></div>
                        <div
                            style={{
                                "opacity": (!(this.state.setting) && this.state.showed) ? 0.4 : 1
                            }}
                            className="menu-btn"
                            id="setting-btn"
                            onClick={()=>this.showMenu("setting")}     
                        ><img className="menu-icon" src="./Menu/setting.png" /></div>
                    </div>

                    <div id="guide-container">
                        {this.state.guideElems}
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



// 実績
class Archive extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            level: {
                botLvr: 0,
                addLvr: 0,
                upLvr: 0
            }
        }

        this.interval;

        this.lvrLine = {
            bot: 50,
            add: 20,
            up: 30
        }
    }

    getResrcData = ()=>{
        return this.props.getResrcData();
    }

    resrcCheck = ()=>{
        let data = this.getResrcData();
        this.setState({
            level: data.level
        });
    }

    componentDidMount(){
        this.interval = setInterval(()=>{
            this.resrcCheck();
        }, 200);
    }

    showDescription = (desc, e)=>{
        $(".archive-description").remove();
        let cleared = e.target.classList.contains("cleared-archive");
        let px = e.pageX;
        let py = e.pageY;
       
        let ox = window.pageXOffset;
        let oy = window.pageYOffset;
       
        let obj = document.elementFromPoint(px - ox, py - oy);
        let data = obj.getBoundingClientRect();
        let x= data.left + ((data.right - data.left)/2);
        let y = data.bottom;
        
        let elem = $("<div></div>");
        elem.addClass("archive-description");

        let title = $("<div></div>", {"class": `archive-title ${cleared ? "archive-clear-title" : ""}`});
        title.text(cleared ? desc.title : "？？？");
        
        let content;
        
        if(cleared){
            content = $("<div></div>", {"class": "clear-archive-container"});
            let backText = $("<div></div>", {"class": "archive-clear-text"});
            let passive = $(`<div></div>`, {"class": "passive-content"});
            backText.text("CLEAR");
            passive.html(`条件:${desc.content}`);
            content.append(passive).append(backText);
        }else{
            content = $("<div></div>", {"class": "archive-content"});
            content.html(`条件:<br/>${desc.content}`);
        }


        elem.append(title).append(content).css({"position": "absolute", "top": `${y-10}px`, "left": `${x}px`, "transform": "translateX(-50%)", "z\-index": 700});
        let target = elem.appendTo("#containers");
        setTimeout(() => {
            $(window).click(()=>{
                target.remove();
                $(window).off();
            });
        }, 100);
    }

    render(){

        let archives = [
            {
                id: "bot-archive",
                className: (this.state.level.botLvr >= this.lvrLine.bot) ? "cleared-archive" : "",
                key: "bot",
                description: {
                    title: "資源無限生成機関の完成だ！",
                    content: `【Box Bot】のレベルをLv${this.lvrLine.bot}まで上げる`,
                    passive: "Botの資源獲得量が+10になる"
                },
                locked: !(this.state.level.botLvr >= this.lvrLine.bot) ? "-lock" : ""
            },
            {
                id: "add-archive",
                className: (this.state.level.addLvr >= this.lvrLine.add) ? "cleared-archive" : "",
                key: "add",
                description: {
                    title: "わー！凄くいっぱい出てくる！",
                    content: `【Get Box】のレベルをLv${this.lvrLine.add}まで上げる`,
                    passive: "10秒ごとに1クリックが発生する"
                },
                locked: !(this.state.level.addLvr >= this.lvrLine.add) ? "-lock" : ""
            },
            {
                id: "up-archive",
                className: (this.state.level.upLvr >= this.lvrLine.up) ? "cleared-archive" : "",
                key: "up",
                description: {
                    title: "楽して稼げるお仕事はいかが？",
                    content: `【Point UP】のレベルをLv${this.lvrLine.up}まで上げる`,
                    passive: "ごく稀に黄金のBoxが出現する"
                },
                locked: !(this.state.level.upLvr >= this.lvrLine.up) ? "-lock" : ""
            }
        ];

        let archiveElem = [];
        archives.forEach(e => {
            archiveElem.push(
                <div id={e.id} className={`archives star-archive ${e.className}`} onClick={(event)=>this.showDescription(e.description, event)}>
                    <img src={`./Menu/icons/${e.key}-icon${e.locked}.png`} className="archive-icon" />
                </div>
            );
        });

        return(
            <div id="archive-container">
                <div className="menu-title">実績</div>
                <div className="menu-title-sub">Archive</div>
                <div id="star-archives">
                    {archiveElem}
                </div>
            </div>
        );
    }
}



// 設定
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