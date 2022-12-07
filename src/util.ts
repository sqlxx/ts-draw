import { RegionByHW, RegionByPts } from "./dom";

export function normalizeRect(rectByPts: RegionByPts): RegionByHW {
        let x = rectByPts.pt1.x;
        let y = rectByPts.pt1.y;

        let width = rectByPts.pt2.x - x;
        let height = rectByPts.pt2.y - y;

        if (width < 0) {
            x = rectByPts.pt2.x;
            width = - width;
        }

        if (height < 0) {
            y = rectByPts.pt2.y;
            height = -height;
        }

        return {x: x, y: y, width: width, height: height};

    }