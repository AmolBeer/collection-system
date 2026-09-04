import React, { useRef, useEffect } from 'react';
import { Tooltip, Divider } from 'antd';
import {
  BoldOutlined, ItalicOutlined, UnderlineOutlined,
  FontSizeOutlined, FontColorsOutlined, BgColorsOutlined,
  AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined,
  ClearOutlined, UnorderedListOutlined, OrderedListOutlined,
} from '@ant-design/icons';

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  height?: number;
}

const fontSizes = [
  { label: '12px', value: '2' },
  { label: '14px', value: '3' },
  { label: '16px', value: '4' },
  { label: '18px', value: '5' },
  { label: '24px', value: '6' },
  { label: '32px', value: '7' },
];

const fontFamilies = [
  { label: '默认', value: '' },
  { label: '宋体', value: 'SimSun' },
  { label: '微软雅黑', value: 'Microsoft YaHei' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
];

const colors = [
  '#000000', '#333333', '#666666', '#999999',
  '#ef4444', '#f59e0b', '#22c55e', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, height = 250 }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const [bgColorPickerOpen, setBgColorPickerOpen] = React.useState(false);
  const [fontSizeOpen, setFontSizeOpen] = React.useState(false);
  const [fontFamilyOpen, setFontFamilyOpen] = React.useState(false);

  // 初始化内容
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const exec = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    handleChange();
  };

  const handleChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      handleChange();
    }
  };

  const toolbarBtnStyle: React.CSSProperties = {
    padding: '4px 8px', borderRadius: 4, border: '1px solid #e5e7eb',
    background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute', zIndex: 1050, background: '#fff',
    border: '1px solid #e5e7eb', borderRadius: 6, padding: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexWrap: 'wrap', gap: '4px',
  };

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
      {/* 工具栏 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px', background: '#fafafa', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap', position: 'relative' }}>
        <Tooltip title="加粗">
          <button type="button" style={toolbarBtnStyle} onMouseDown={(e) => { e.preventDefault(); exec('bold'); }}>
            <BoldOutlined />
          </button>
        </Tooltip>
        <Tooltip title="斜体">
          <button type="button" style={toolbarBtnStyle} onMouseDown={(e) => { e.preventDefault(); exec('italic'); }}>
            <ItalicOutlined />
          </button>
        </Tooltip>
        <Tooltip title="下划线">
          <button type="button" style={toolbarBtnStyle} onMouseDown={(e) => { e.preventDefault(); exec('underline'); }}>
            <UnderlineOutlined />
          </button>
        </Tooltip>

        <Divider type="vertical" style={{ margin: '0 4px' }} />

        {/* 字体 */}
        <div style={{ position: 'relative' }}>
          <button type="button" style={{ ...toolbarBtnStyle, minWidth: 70 }}
            onClick={() => { setFontFamilyOpen(!fontFamilyOpen); setFontSizeOpen(false); setColorPickerOpen(false); setBgColorPickerOpen(false); }}>
            字体 <span style={{ fontSize: '10px' }}>▼</span>
          </button>
          {fontFamilyOpen && (
            <div style={{ ...dropdownStyle, minWidth: 140 }}>
              {fontFamilies.map(f => (
                <button key={f.value} type="button" style={{ ...toolbarBtnStyle, width: '100%', justifyContent: 'flex-start', fontFamily: f.value }}
                  onMouseDown={(e) => { e.preventDefault(); exec('fontName', f.value); setFontFamilyOpen(false); }}>
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 字号 */}
        <div style={{ position: 'relative' }}>
          <button type="button" style={{ ...toolbarBtnStyle, minWidth: 60 }}
            onClick={() => { setFontSizeOpen(!fontSizeOpen); setFontFamilyOpen(false); setColorPickerOpen(false); setBgColorPickerOpen(false); }}>
            <FontSizeOutlined /> <span style={{ fontSize: '10px' }}>▼</span>
          </button>
          {fontSizeOpen && (
            <div style={{ ...dropdownStyle, minWidth: 80 }}>
              {fontSizes.map(s => (
                <button key={s.value} type="button" style={{ ...toolbarBtnStyle, width: '100%', justifyContent: 'flex-start' }}
                  onMouseDown={(e) => { e.preventDefault(); exec('fontSize', s.value); setFontSizeOpen(false); }}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 文字颜色 */}
        <div style={{ position: 'relative' }}>
          <button type="button" style={toolbarBtnStyle}
            onClick={() => { setColorPickerOpen(!colorPickerOpen); setBgColorPickerOpen(false); setFontSizeOpen(false); setFontFamilyOpen(false); }}>
            <FontColorsOutlined /> <span style={{ fontSize: '10px' }}>▼</span>
          </button>
          {colorPickerOpen && (
            <div style={{ ...dropdownStyle, width: 180 }}>
              {colors.map(c => (
                <button key={c} type="button" style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #e5e7eb', background: c, cursor: 'pointer' }}
                  onMouseDown={(e) => { e.preventDefault(); exec('foreColor', c); setColorPickerOpen(false); }} />
              ))}
            </div>
          )}
        </div>

        {/* 背景色 */}
        <div style={{ position: 'relative' }}>
          <button type="button" style={toolbarBtnStyle}
            onClick={() => { setBgColorPickerOpen(!bgColorPickerOpen); setColorPickerOpen(false); setFontSizeOpen(false); setFontFamilyOpen(false); }}>
            <BgColorsOutlined /> <span style={{ fontSize: '10px' }}>▼</span>
          </button>
          {bgColorPickerOpen && (
            <div style={{ ...dropdownStyle, width: 180 }}>
              {colors.map(c => (
                <button key={c} type="button" style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #e5e7eb', background: c, cursor: 'pointer' }}
                  onMouseDown={(e) => { e.preventDefault(); exec('hiliteColor', c); setBgColorPickerOpen(false); }} />
              ))}
            </div>
          )}
        </div>

        <Divider type="vertical" style={{ margin: '0 4px' }} />

        <Tooltip title="左对齐">
          <button type="button" style={toolbarBtnStyle} onMouseDown={(e) => { e.preventDefault(); exec('justifyLeft'); }}>
            <AlignLeftOutlined />
          </button>
        </Tooltip>
        <Tooltip title="居中">
          <button type="button" style={toolbarBtnStyle} onMouseDown={(e) => { e.preventDefault(); exec('justifyCenter'); }}>
            <AlignCenterOutlined />
          </button>
        </Tooltip>
        <Tooltip title="右对齐">
          <button type="button" style={toolbarBtnStyle} onMouseDown={(e) => { e.preventDefault(); exec('justifyRight'); }}>
            <AlignRightOutlined />
          </button>
        </Tooltip>

        <Divider type="vertical" style={{ margin: '0 4px' }} />

        <Tooltip title="无序列表">
          <button type="button" style={toolbarBtnStyle} onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }}>
            <UnorderedListOutlined />
          </button>
        </Tooltip>
        <Tooltip title="有序列表">
          <button type="button" style={toolbarBtnStyle} onMouseDown={(e) => { e.preventDefault(); exec('insertOrderedList'); }}>
            <OrderedListOutlined />
          </button>
        </Tooltip>

        <Divider type="vertical" style={{ margin: '0 4px' }} />

        <Tooltip title="清除格式">
          <button type="button" style={toolbarBtnStyle} onMouseDown={(e) => { e.preventDefault(); exec('removeFormat'); }}>
            <ClearOutlined />
          </button>
        </Tooltip>
        <Tooltip title="清空内容">
          <button type="button" style={toolbarBtnStyle} onClick={handleClear}>
            <ClearOutlined style={{ color: '#ef4444' }} />
          </button>
        </Tooltip>
      </div>

      {/* 编辑区 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleChange}
        onBlur={handleChange}
        style={{
          height, overflowY: 'auto', padding: '12px 16px',
          outline: 'none', fontSize: '14px', lineHeight: '1.8',
          background: '#fff', cursor: 'text',
        }}
        data-placeholder={placeholder}
        onMouseDown={() => {
          setColorPickerOpen(false); setBgColorPickerOpen(false);
          setFontSizeOpen(false); setFontFamilyOpen(false);
        }}
      />
    </div>
  );
};

export default RichTextEditor;
