import { Component } from 'preact';
import classNames from 'classnames';
import { ChromePicker } from 'react-color';
import { TOOL_PENCIL, TOOL_BRUSH, TOOL_ERASER } from '../tools';

import './sidebar.css';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSizeSlider: false,
      showColorPicker: false,
      showBackgroundColorPicker: false
    };

    this.showSizeSlider = this.showSizeSlider.bind(this);
    this.hideSizeSlider = this.hideSizeSlider.bind(this);

    this.showColorPicker = this.showColorPicker.bind(this);
    this.hideColorPicker = this.hideColorPicker.bind(this);
    this.showBackgroundColorPicker = this.showBackgroundColorPicker.bind(this);
    this.hideBackgroundColorPicker = this.hideBackgroundColorPicker.bind(this);
  }

  showSizeSlider() {
    this.setState({ showSizeSlider: true });
  }

  hideSizeSlider() {
    this.setState({ showSizeSlider: false });
  }

  showColorPicker() {
    this.setState({ showColorPicker: true });
  }

  hideColorPicker() {
    this.setState({ showColorPicker: false });
  }

  showBackgroundColorPicker() {
    this.setState({ showBackgroundColorPicker: true });
  }

  hideBackgroundColorPicker() {
    this.setState({ showBackgroundColorPicker: false });
  }

  colorToCSS(color) {
    return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
  }

  render({
    onChangeColor,
    onChangeBackgroundColor,
    onToggleGridVisibility,
    onChangeSize,
    onChangeTool,
    onSave,
    onSaveSvg,
    color,
    backgroundColor,
    size,
    tool,
    showGrid
  }) {
    return (
      <div className="sidebar">
        <div>
          <img src="/assets/triangle-logo.png" width="28" />
        </div>

        <div
          className={classNames('tool', { selected: tool === TOOL_PENCIL })}
          role="button"
          onClick={() => onChangeTool(TOOL_PENCIL)}
        >
          <img src="/assets/edit.png" />
        </div>

        <div
          className={classNames('tool', { selected: tool === TOOL_BRUSH })}
          role="button"
          onClick={() => onChangeTool(TOOL_BRUSH)}
        >
          <img src="/assets/brush.svg" />
        </div>

        <div
          className={classNames('tool', { selected: tool === TOOL_ERASER })}
          role="button"
          onClick={() => onChangeTool(TOOL_ERASER)}
        >
          <img src="/assets/eraser.svg" />
        </div>

        {[TOOL_BRUSH, TOOL_ERASER].includes(tool) && (
          <div className="tool" onClick={this.showSizeSlider}>
            {size}
          </div>
        )}

        {this.state.showSizeSlider && (
          <div className="popover">
            <div className="cover" onClick={this.hideSizeSlider} />
            <div className="sliderWrapper">
              <input
                className="slider"
                type="range"
                min="5"
                max="100"
                value={size}
                onChange={onChangeSize}
              />
            </div>
          </div>
        )}

        <div className="tool">
          <div className="color-wrapper">
            <div
              className="color"
              style={{ background: this.colorToCSS(color) }}
              onClick={this.showColorPicker}
            />
          </div>

          {this.state.showColorPicker ? (
            <div className="popover">
              <div className="cover" onClick={this.hideColorPicker} />
              <ChromePicker color={color.rgb} onChangeComplete={onChangeColor} />
            </div>
          ) : null}
        </div>

        <div className="tool">
          <div className="color-wrapper">
            <div
              className="color"
              style={{ background: this.colorToCSS(backgroundColor) }}
              onClick={this.showBackgroundColorPicker}
            />
          </div>

          {this.state.showBackgroundColorPicker ? (
            <div className="popover">
              <div className="cover" onClick={this.hideBackgroundColorPicker} />
              <ChromePicker
                color={backgroundColor.rgb}
                onChangeComplete={onChangeBackgroundColor}
              />
            </div>
          ) : null}
        </div>

        <div
          className="tool"
          role="button"
          onClick={onSave}
        >
          <img src="/assets/download.svg" />
        </div>

        <div
          className="tool"
          role="button"
          onClick={onSaveSvg}
        >
          <img src="/assets/download.svg" />
        </div>

        <div
          className={classNames('tool', { selected: showGrid })}
          role="button"
          onClick={onToggleGridVisibility}
        >
          <img src="/assets/grid.svg" />
        </div>
      </div>
    );
  }
}
