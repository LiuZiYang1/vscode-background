import defBase64 from './defBase64';
import { version, BACKGROUND_VER } from './constants';

/**
 * 通过配置获取样式文本
 *
 * @param {object} options 用户配置
 * @param {boolean} useFront 是否前景图
 * @returns {string}
 */
function getStyleByOptions(options: object, useFront: boolean): string {
    const styleArr: string[] = [];
    for (const k in options) {
        // 在使用背景图时，排除掉 pointer-events
        if (!useFront && ~['pointer-events', 'z-index'].indexOf(k)) {
            continue;
        }

        // eslint-disable-next-line
        if (options.hasOwnProperty(k)) {
            styleArr.push(`${k}:${options[k]}`);
        }
    }
    return styleArr.join(';') + ';';
}

/**
 * 生成css样式
 *
 * @export
 * @param {Array<string>} arr 图片数组
 * @param {any} [style={}] 自定义样式
 * @param {Array<any>} [styles=[]] 每个背景图的自定义样式
 * @param {boolean} [useFront=true] 是否用前景图
 * @returns
 */
export default function (arr: Array<string>, style: any = {}, styles: Array<any> = [], useFront = true): string {
    const [img0, img1, img2] = (arr && arr.length)
        ? [
            arr[0] || 'none',
            arr[1] || 'none',
            arr[2] || 'none'
        ]
        : defBase64;

    const defStyle = getStyleByOptions(style, useFront); // 默认样式
    const [styel0, style1, style2] = [                   // 3个子项样式
        defStyle + getStyleByOptions(styles[0], useFront),
        defStyle + getStyleByOptions(styles[1], useFront),
        defStyle + getStyleByOptions(styles[2], useFront)
    ];

    // 在前景图时使用 ::after
    const frontContent = useFront ? '::after' : '::before';

    const content = `

/*css-background-start*/
/*${BACKGROUND_VER}.${version}*/

[id="workbench.parts.editor"] .split-view-view:nth-child(1) .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element${frontContent}{background-image: url('${img0}');${styel0}}

[id="workbench.parts.editor"] .split-view-view:nth-child(2) .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element${frontContent}{background-image: url('${img1}');${style1}}

[id="workbench.parts.editor"] .split-view-view:nth-child(3) .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element${frontContent}{background-image: url('${img2}');${style2}}

[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

/*css-background-end*/
`;

    return content;
}
