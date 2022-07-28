class Objects extends React.Component {
  constructor(props) {
    super(props);
  }

  // Farmの関数getResouceData()を実行
  getResrcData = () => {
    return this.props.getResouceData();
  };
  render() {
    return (
      <div id={"obj-container"}>
        <button id="add" onClick={() => this.props.addResource(1)}>
          CLICK
        </button>
      </div>
    );
  }
}
