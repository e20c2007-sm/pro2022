
// ヘッダー
function Header(props){
    return(
        <header>
            <div>
                {/* ここはヘッダーです。 */}
            </div>
        </header>
    );
}

// フッター
function Footer(props){
    return(
        <footer>
            <div>
                {/* ここはフッターです。 */}
            </div>
        </footer>
    );
}

// メイン（ゲーム画面）
function Main(props){
    return(
        <main>
            <div id="game-container">
                <Farm />
            </div>
        </main>
    );
}

class Containers extends React.Component{
    render(){
        return(
            <div id="site-wrapper">
                <Header/>
                <Main/>
                <Footer/>
            </div>
        );
    }
}

// 描画
ReactDOM.render(
    <Containers/>,
    $("#containers")[0]
);