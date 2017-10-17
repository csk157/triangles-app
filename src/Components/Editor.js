import { Component } from 'preact';
import TriangleEditor from 'triangles-editor';
import { TOOL_PENCIL, TOOL_BRUSH, TOOL_ERASER } from '../tools';

function eventToElementPoint(e) {
  return {
    x: e.pageX - e.target.offsetLeft,
    y: e.pageY - e.target.offsetTop
  };
}

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editor: null,
      isMouseDown: false,
      cursor: this.getCursor(this.props.size)
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentDidMount() {
    this.createEditor();
  }

  componentWillReceiveProps(nextProps) {
    const {
      size,
      backgroundColor,
      backgroundColorAlpha,
      showGrid
    } = this.props;

    if (size !== nextProps.size) {
      this.setState({
        cursor: this.getCursor(nextProps.size)
      });
    }

    if (
      backgroundColor !== nextProps.backgroundColor ||
      backgroundColorAlpha !== nextProps.backgroundColorAlpha
    ) {
      this.state.editor.setBackgroundColor(
        nextProps.backgroundColor,
        nextProps.backgroundColorAlpha
      );
    }

    if (showGrid !== nextProps.showGrid) {
      nextProps.showGrid
        ? this.state.editor.showGrid()
        : this.state.editor.hideGrid();
    }
  }

  createEditor() {
    const editor = TriangleEditor.createWithElement(this.canvas, {
      unitSize: 25
    });
    editor.begin();

    this.setState({ editor });
    this.props.onEditorInitialized(editor);
  }

  applyTool(point) {
    const { tool, color, colorAlpha, size } = this.props;
    const { editor } = this.state;

    const rect = Object.assign({}, point, { width: size, height: size });

    switch (tool) {
      case TOOL_PENCIL:
        editor.fillTriangleAt(point, color, colorAlpha);
        break;
      case TOOL_BRUSH:
        editor.fillInRectangle(rect, color, colorAlpha);
        break;
      case TOOL_ERASER:
        editor.eraseInRectangle(rect);
    }
  }

  onMouseDown(e) {
    const coord = eventToElementPoint(e);

    this.setState({ isMouseDown: true });
    this.applyTool(coord);
  }

  onMouseMove(e) {
    if (!this.state.isMouseDown) {
      return;
    }

    const coord = eventToElementPoint(e);
    this.applyTool(coord);
  }

  onMouseUp() {
    this.setState({ isMouseDown: false });
  }

  getCursor(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    context.strokeRect(1, 1, size - 2, size - 2);

    return canvas.toDataURL();
  }

  getCursorStyle() {
    if (this.props.tool === TOOL_PENCIL) {
      return `url(assets/pencil-cursor.png) 0 24, auto`;
    }

    return `url(${this.state.cursor}) 0 0, auto`;
  }

  render({ size }, { cursor }) {
    return (
      <canvas
        style={{ cursor: this.getCursorStyle() }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={el => {
          this.canvas = el;
        }}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
      />
    );
  }
}
