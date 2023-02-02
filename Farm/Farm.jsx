
// ゲームのメインコンポーネント
class Farm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            startRdy: false,
            botPrice: 10,
            addPrice: 150,
            upPrice: 200,
            botSwitch: false,
            addSwitch: false,
            upSwitch: false,
            readyOk: false,
            botLevel: 0,
            addLevel: 0,
            upLevel: 0
        }

        this.interval;

        // 諸情報
        this.info = {
            resource: 0, //資源量（変動値）
            timeLog: 0, //プレイ時間（総計）
            resrcLog: 0, //資源量（総計）
            boxLog: 0, //箱の生成数（総計）
            gain: 1,
            opt: {
                // ここで生産量などを増加させる何かしらを追加していく
                addPush: 1,
                upPoint: 1
            }
        }

        // 小さい箱の収納
        this.materials = [];

        // ゲームの状態
        this.gameState = {
            startFlag: false,
            stopFlag: false
        }
    }

    componentDidMount(){
        this.interval = setInterval(()=>{
            let botSwitch = false;
            let addSwitch = false;
            let upSwitch = false;
            if(this.info.resource >= this.state.botPrice){
                botSwitch = true;
            }
            if(this.info.resource >= this.state.addPrice){
                addSwitch = true;
            }
            if(this.info.resource >= this.state.upPrice){
                upSwitch = true;
            }
            this.setState({
                botSwitch: botSwitch,
                addSwitch: addSwitch,
                upSwitch: upSwitch
            });
        }, 100);
    }

    // ゲームをストップさせる
    gameStoper = ()=>{
        this.gameState.stopFlag = !this.gameState.stopFlag;
    }

    //資源を生産する際の処理
    changeResrc(data){

        if(data.key == "def"){
            data.gain = this.info.opt.upPoint;
        }
        this.info.resource += data.gain;

        let posit = data.data;
        if(posit){
            popUpAdd({
                num: data.gain,
                x: posit.x,
                y: posit.y
            });
        }

        if(!(this.state.startRdy) && !(this.state.readyOk)){
            if(this.info.resource >= 1){
                this.setState({
                    readyOk: true
                });
            }
        }
    }

    // Farmコンポーネントで扱っているデータを、
    // 子コンポーネントで取得するための関数
    sendResrcData(){
        let data = {
            resource: this.info.resource,
            time: this.info.timeLog,
            bots: this.info.botsLog,
            allResrc: this.info.resrcLog,
            level: {
                botLvr: this.state.botLevel,
                addLvr: this.state.addLevel,
                upLvr: this.state.upLevel
            }
        }
        return data;
    }

    createMaterial = (opt) => {
        this.materials.push(
            new Material({
                x: def.size.w/2,
                y: def.size.h/2,
                xWay: (Math.random(1)+1)*def.nums[randomNum(2)],
                yWay: (Math.random(1)+1)*def.nums[randomNum(2)],
                r: rSize,
                width: def.size.w,
                height: def.size.h,
                color: opt.color,
                limit: opt.limit
            })
        );
        if(this.materials.length <= 1 && this.gameState.startFlag == false){
            this.materialsAnime();
            this.gameState.startFlag = true;
        }
        if(opt.limit && this.info.opt.addPush > 1){
            if(!(opt.loops)){
                opt.loops = this.info.opt.addPush - 1;
            }else{
                opt.loops = opt.loops-1;
            }
            if(opt.loops > 0){
                setTimeout(()=>{
                    this.createMaterial(opt);
                }, 200);
            }
        }
        playSound({
            path: `${soundsDir}/drop.mp3`,
            key: "se"
        });
    }

    materialsAnime = () => {
        if(this.materials.length > 0 && this.gameState.stopFlag == false){
            ctx.clearRect(0, 0, rect.width, rect.height);
            let deleteIndex = [];
            this.materials.forEach((e, i) => {
                let list = e.draw(ctx);
                if(list){
                    if(list.flag == "delete"){
                        deleteIndex.push(i);
                    }else{
                        this.changeResrc({
                            key: "def",
                            data: {
                                x: list.x,
                                y: list.y
                            }
                        });
                    }
                }
            });
            deleteIndex.forEach(e => {
                this.materials.splice(e, 1);
            });
        }
        requestAnimationFrame(this.materialsAnime);
    }

    // オプションのクリック時処理
    onClickOpt(key, e){
        playSound({
            path: `${soundsDir}/click.mp3`,
            key: "se"
        });
        
        switch(key){
            // 初期ボタンが押された処理
            case "create":
                this.createMaterial({
                    color: "#00e1ff"
                });

                this.setState({
                    startRdy: true,
                    readyOk: "",
                    botLevel: this.state.botLevel + 1
                });
                this.info.resource = 0;
                playSound({
                    path: `${soundsDir}/mainBgm.mp3`,
                    key: "bgm",
                    looped: true
                });
                break;

            // BOTボタンの処理
            case "resrcBot":
                this.createMaterial({
                    color: "#00e1ff"
                });

                let botPrice = this.state.botPrice;
                this.changeResrc({
                    key: "origin",
                    gain: -(botPrice)
                });
                this.setState({
                    botPrice: Math.floor(botPrice + 10),
                    botLevel: this.state.botLevel + 1
                });
                popAnimationAdd(e.clientX, e.clientY, "opt");
                break;
            
            //box+1ボタンの処理
            case "plusBox":
                this.info.opt.addPush++;
                let addPrice = this.state.addPrice;
                this.changeResrc({
                    key: "origin",
                    gain: -(addPrice)
                });
                this.setState({
                    addPrice: Math.floor(addPrice * 2),
                    addLevel: this.state.addLevel + 1
                });
                popAnimationAdd(e.clientX, e.clientY, "opt");
                break;
            
            // Point Upみたいな処理
            case "upPrice":
                this.info.opt.upPoint++;
                let upPrice = this.state.upPrice;
                this.changeResrc({
                    key: "origin",
                    gain: -(upPrice)
                });
                this.setState({
                    upPrice: Math.floor(upPrice * 1.2),
                    upLevel: this.state.upLevel + 1
                });
                popAnimationAdd(e.clientX, e.clientY, "opt");
                break;
            
            default:
                console.log("不具合です。");
        }
    }

    render(){

        let optElem = [
            {
                text: <span>Box Bot +1</span>,
                id: "bot-btn",
                switch: "botSwitch",
                key: "resrcBot",
                price: 
                    <div className="price-content">
                        <div className="price-content-inner">
                            <div className="set-tri"></div>
                            <div className="price-viewer">
                                {this.state.botPrice}
                            </div>
                        </div>
                    </div>,
                level: 
                <div
                    className="level-content"
                    style={{
                        "opacity": (this.state.botLevel != 0) ? 1 : 0
                    }}
                >
                    Lv.<span className="level-entity">{this.state.botLevel}</span>
                </div>
                    
            },
            {
                text: <span>Get Box +1</span>,
                id: "plus-btn",
                switch: "addSwitch",
                key: "plusBox",
                price: 
                    <div className="price-content">
                        <div className="price-content-inner">
                            <div className="set-tri"></div>
                            <div className="price-viewer">
                                {this.state.addPrice}
                            </div>
                        </div>
                    </div>,
                level: 
                <div
                    className="level-content"
                    style={{
                        "opacity": (this.state.addLevel != 0) ? 1 : 0
                    }}
                >
                    Lv.<span className="level-entity">{this.state.addLevel}</span>
                </div>
            },
            {
                text: <span>Point UP</span>,
                id: "up-price-btn",
                switch: "upSwitch",
                key: "upPrice",
                price: 
                    <div className="price-content">
                        <div className="price-content-inner">
                            <div className="set-tri"></div>
                            <div className="price-viewer">
                                {this.state.upPrice}
                            </div>
                        </div>
                    </div>,
                level: 
                    <div
                        className="level-content"
                        style={{
                            "opacity": (this.state.upLevel != 0) ? 1 : 0
                        }}
                    >
                        Lv.<span
                        className="level-entity">{this.state.upLevel}</span>
                    </div>

            }
        ]

        let opts = [];
        optElem.forEach(e => {
            opts.push(
                <div 
                    className={this.state[e.switch] ? "opt-nav-elem": "opt-nav-hide"}
                    id={e.id}
                    onClick={(event)=>{
                        this.onClickOpt(e.key, event);
                    }}
                >
                    {e.level}
                    {e.text}
                    {e.price}
                    <div className="corner"></div>
                </div>
            )
        });

        let elems = [
            <Info
                getResrcData={()=> {return this.sendResrcData()}}
            />,
            <Menu
                gameStoper={() => this.gameStoper()}
                getResrcData={()=> {return this.sendResrcData()}}
            />,
            <div id="opt-nav">
                {opts}
            </div>
        ];

        let beginElems = 
            <div className="shadow-screen" style={{"background": "#1d1d1dea", "width": "100svw", "height": "100svh", "position": "fixed", "top": 0, "left": 0, "pointerEvents": this.state.readyOk ? "auto" : "none", "zIndex": 450, "transition": "3s", "opacity": this.state.readyOk ? 1 : 0}}>
                <div className="shadow-screen-inner" style={{"width": "100%", "height": "100%", "position": "relative", "pointerEvents": this.state.readyOk ? "auto" : "none"}}>
                    <div className="title-text" style={{"color": "#00e1ff", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "space-between", "boxSizing": "border-box", "width": "100svw", "height": "40%", "padding": "50px 15svw","position": "absolute", "top": "25%", "left": "50%", "transform": "translateX(-50%)", "pointerEvents": this.state.readyOk ? "auto" : "none", "zIndex": 499}}>
                        <div style={{"width": "50%", "minWidth": "300px", "fontSize": "100px", "fontWeight": 900, "textAlign": "left"}}>Few</div>
                        <div style={{"width": "50%", "minWidth": "300px", "fontSize": "60px", "fontWeight": 900, "textAlign": "right"}}>Boxes</div>
                        <div style={{"width": "50%", "minWidth": "300px", "fontSize": "43px", "fontWeight": 900, "textAlign": "center"}}>Clicker</div>
                    </div>
                    <div id="opt-nav" style={{"zIndex": 500}}><div className="opt-nav-elem" onClick={()=>{if(this.state.readyOk){this.onClickOpt("create")}}}>START</div></div>
                </div>
            </div>

        return(
            <div id={"farm-container"}>
                {this.state.startRdy ? elems : beginElems}
                <Objects
                    getResrcData={()=> {return this.sendResrcData()}}
                    addResrc={(key)=> this.changeResrc({key: key})}
                    createMaterial={(opt)=> this.createMaterial(opt)}
                />
            </div>
        );
    }
}
