export const calculate = (svg: SVGElement, selectedPath: SVGPathElement) => {
    let pathData = selectedPath.getBoundingClientRect();

    let pathX = pathData.left + (pathData.right - pathData.left) / 2;
    let pathY = pathData.top + (pathData.bottom - pathData.top) / 2;

    let width = svg.clientWidth;
    let height = svg.clientHeight;

    let scaleX = width / pathData.width;
    let scaleY = height / pathData.height;
    let scale = Math.min(Math.min(scaleX, scaleY) / 2, 10);

    let dx = (width / 2 - pathX) * scale;
    let dy = (height / 2 - pathY) * scale;

    return [scale, 0, 0, scale, dx, dy];
}
