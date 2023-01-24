
// ゲームのメインコンポーネント
class Farm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            navFlag: false,
            botPrice: 10,
            addPrice: 100,
            upPrice: 300,
            botSwitch: false,
            addSwitch: false,
            upSwitch: false
        }

        this.interval;

        // 諸情報
        this.info = {
            resource: 0, //資源量（変動値）
            timeLog: 0, //プレイ時間（総計）
            gain: 1,
            opt: {
                // ここで生産量などを増加させる何かしらを追加していく
                addPush: 1,
                upPoint: 1
            }
        }

        // 小さい箱の収納
        this.materials = [];

        // 開始したかどうか
        this.startFlag = false;
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

    //資源を生産する際の処理
    changeResrc(data){
        /*
            gain...増加値
        */
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
    }

    // Farmコンポーネントで扱っているデータを、
    // 子コンポーネントで取得するための関数
    sendResrcData(){
        let data = {
            resource: this.info.resource
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
        if(this.materials.length <= 1 && this.startFlag == false){
            this.materialsAnime();
            this.startFlag = true;
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
    }

    materialsAnime = () => {
        if(this.materials.length > 0){
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
    onClickOpt(key){
        switch(key){
            // 初期ボタンが押された処理
            case "create":
                this.setState({
                    navFlag: true
                });
                this.createMaterial({
                    color: "#00e1ff"
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
                    botPrice: Math.floor(botPrice + 10)
                });
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
                    addPrice: Math.floor(addPrice + 100)
                });
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
                    upPrice: Math.floor(upPrice * 1.2)
                });
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
            }
        ]

        let opts = [];
        optElem.forEach(e => {
            opts.push(
                <div 
                    className={this.state[e.switch] ? "opt-nav-elem": "opt-nav-hide"}
                    id={e.id}
                    onClick={()=>{
                        this.onClickOpt(e.key);
                    }}
                >
                    <div className="corner"></div>
                    {e.text}
                    {e.price}
                </div>
            )
        });

        return(
            <div id={"farm-container"}>
                <Info
                    getResrcData={()=> {return this.sendResrcData()}}
                />
                <Objects
                    getResrcData={()=> {return this.sendResrcData()}}
                    addResrc={(key)=> this.changeResrc({key: key})}
                    createMaterial={(opt)=> this.createMaterial(opt)}
                />
                <div id="opt-nav">
                    {this.state.navFlag ? opts : <div className="opt-nav-elem" onClick={()=>{this.onClickOpt("create")}}>START</div>}
                </div>
            </div>
        );
    }
}
