import { Component } from "preact";
import styles from "./style";
import Editor from "./Components/Editor";
import Sidebar from "./Components/Sidebar";
import { TOOL_PENCIL } from "./tools";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: { hex: "#000", rgb: { r: 0, g: 0, b: 0, a: 1 }, source: "rgb" },
      backgroundColor: {
        hex: "#FFF",
        rgb: { r: 255, g: 255, b: 255, a: 1 },
        source: "rgb"
      },
      tool: TOOL_PENCIL,
      size: 30,
      editor: null,
      showGrid: true
    };

    this.onChangeColor = this.onChangeColor.bind(this);
    this.onChangeBackgroundColor = this.onChangeBackgroundColor.bind(this);
    this.onChangeSize = this.onChangeSize.bind(this);
    this.onChangeTool = this.onChangeTool.bind(this);
    this.onEditorInitialized = this.onEditorInitialized.bind(this);
    this.onToggleGridVisibility = this.onToggleGridVisibility.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSaveSvg = this.onSaveSvg.bind(this);
  }

  onChangeColor(color) {
    console.log(color);
    this.setState({ color });
  }

  onChangeBackgroundColor(color) {
    this.setState({ backgroundColor: color });
  }

  onChangeSize(e) {
    this.setState({ size: parseInt(e.target.value) });
  }

  onChangeTool(tool) {
    this.setState({ tool });
  }

  // needed for saving 🤢
  onEditorInitialized(editor) {
    this.setState({ editor });
  }

  onSave() {
    const data = this.state.editor.toDataURL();
    const dlLink = document.createElement("a");
    dlLink.download = "image.png";
    dlLink.href = data;
    dlLink.dataset.downloadurl = data;
    dlLink.click();
  }

  onSaveSvg() {
    const data = this.state.editor.toSVG();
    console.log(data);
    const dlLink = document.createElement("a");
    dlLink.download = "image.svg";
    dlLink.href = data;
    dlLink.dataset.downloadurl = data;
    dlLink.click();
  }

  onToggleGridVisibility() {
    this.setState({ showGrid: !this.state.showGrid });
  }

  render({}, { color, backgroundColor, size, tool, showGrid }) {
    return (
      <div>
        <Sidebar
          tool={tool}
          color={color}
          backgroundColor={backgroundColor}
          size={size}
          showGrid={showGrid}
          onChangeColor={this.onChangeColor}
          onChangeBackgroundColor={this.onChangeBackgroundColor}
          onChangeSize={this.onChangeSize}
          onChangeTool={this.onChangeTool}
          onSave={this.onSave}
          onSaveSvg={this.onSaveSvg}
          onToggleGridVisibility={this.onToggleGridVisibility}
        />

        <Editor
          backgroundColor={parseInt(backgroundColor.hex.replace("#", ""), 16)}
          backgroundColorAlpha={backgroundColor.rgb.a}
          onEditorInitialized={this.onEditorInitialized}
          onSave={this.onSave}
          tool={tool}
          color={parseInt(color.hex.replace("#", ""), 16)}
          colorAlpha={color.rgb.a}
          size={size}
          showGrid={showGrid}
        />
      </div>
    );
  }
}
