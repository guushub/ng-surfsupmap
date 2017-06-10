import { DivIcon } from 'leaflet';


export class WaterInfoIcon extends DivIcon {
        id: string;
        private _iconSize: number;
        private _direction: number;
        private _label: string;
        private _className: string;

        constructor(id: string, iconSize: number, direction: number, label: string, className: string) {
                super();
                this.id = id;
                this._iconSize = iconSize;
                this._direction = direction;
                this._label = label;
                this._className = className;
                this.options = {
                    iconSize: L.point(iconSize, iconSize),
                    className: className,
                    html: this._getHtml()
                }

        }

        private _getHtml() {
            const circleRadius = this._getCircleRadius();
            const direction = this._direction;
            const idMarkerArrow = `arrow-${this.id}`;
            const html = `<svg width=${this._iconSize} height=${this._iconSize}>
                            <defs>
                                ${this._getDef(idMarkerArrow)}
                            </defs>
                            <circle r='${circleRadius}' cx='${this._iconSize / 2}' cy='${this._iconSize / 2}' style='stroke-width: ${circleRadius / 5};'></circle>
                            <text text-anchor='middle' dy='0.3em' x='${this._iconSize / 2}' y='${this._iconSize / 2}'>${this._label}</text>
                            <polyline r='${circleRadius}' stroke-width='${circleRadius / 3}' marker-end='url(#${idMarkerArrow})' points='${this._getPolylinePoints()}'></polyline>
                        </svg>`;

            return html;
        }

        private _getDef(idMarkerArrow: string) {  
            const circleRadius = this._getCircleRadius();
            const defs = `<marker id='${idMarkerArrow}' markerWidth='${circleRadius}' markerHeight='${circleRadius}' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'>
                <path d='M0, 0.2 L0.7, 1 L1, 1.5 L1.4, 3 L1, 4.5 L0.7, 5 L0, 5.8 L4, 3 z'></path>
            </marker>`
            return defs;
        }

        private _getPolylinePoints() {
            const cx = this._iconSize / 2;
            const cy = this._iconSize / 2;
            const lineLength = this._getCircleRadius() * 1.2;

            const directionRad = this._direction * Math.PI / 180;
            const dx = lineLength / 2 * Math.sin(directionRad);
            const dy = lineLength / 2 * Math.cos(directionRad);

            var endPoint = {
                x: cx - dx,
                y: cy + dy
            };

            var startPoint = {
                x: cx + dx,
                y: cy - dy
            };

            return startPoint.x + "," + startPoint.y + " " + endPoint.x + "," + endPoint.y;
        }

        private _getCircleRadius() {
            return this._iconSize / 4;
        }

}