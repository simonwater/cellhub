import React, { useEffect, useRef, useState } from "react";

interface SpreadsheetProps {
  data?: Record<string, any>; // 表格数据
  options?: Record<string, any>; // 配置选项
  height?: string | number; // 容器高度
  width?: string | number; // 容器宽度
}

let loaded: boolean = false;
let XSpreadSheet: any = null;
let id: number = 0;

const SpreadSheet: React.FC<SpreadsheetProps> = (props) => {
  const sheetEl = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<any>(null); // 引用 spreadsheet 实例
  const [containerid, setContainerId] = useState(`spreadsheet-${id++}`);

  function initSheet(element: HTMLDivElement) {
    // 初始化电子表格
    XSpreadSheet = (window as any)["x_spreadsheet"];
    if (!XSpreadSheet) return null;

    const sheet = new XSpreadSheet(`#${containerid}`, {
      view: {
        height: () =>
          element?.clientHeight || document.documentElement.clientHeight,
        width: () =>
          element?.clientWidth || document.documentElement.clientWidth,
      },
      ...props.options,
    });
    sheet.loadData(props.data || {});
    sheet.change((data: Record<string, any>) => {
      console.log(data);
    });
    return sheet;
  }

  useEffect(() => {
    const element = sheetEl.current;
    if (!element) return;

    if (!loaded) {
      loaded = true;
      loadPublicCss("third-party/x-spreadsheet/xspreadsheet.css");
      loadJs("third-party/x-spreadsheet/xspreadsheet.js", () => {
        sheetRef.current = initSheet(element);
      });
    } else {
      sheetRef.current = initSheet(element);
    }

    // 清理函数
    return () => {
      element.innerHTML = "";
    };
  }, [props.options]); // 仅在 options 变化时重建

  console.log(containerid);
  return (
    <>
      <div
        id={containerid}
        ref={sheetEl}
        style={{
          height: props.height || "100%",
          width: props.width || "100%",
        }}
      />
    </>
  );
};

function loadPublicCss(cssPath: string): void {
  const head = document.head || document.getElementsByTagName("head")[0];
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";

  // 使用 Vite 的基础路径
  const base = import.meta.env.BASE_URL;
  link.href = `${base}${cssPath}`;

  head.appendChild(link);
}

function loadJs(jsPath: string, callback: () => void): void {
  const script = document.createElement("script");
  script.src = `${import.meta.env.BASE_URL}${jsPath}`;
  script.onload = () => {
    callback();
  };
  document.body.appendChild(script);
}

export default SpreadSheet;
