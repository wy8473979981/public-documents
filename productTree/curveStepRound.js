function getPosition(dot1, dot2, angle) {
  let x1 = dot1.left
  let y1 = dot1.top
  let x2 = dot2.left
  let y2 = dot2.top
  let PI = Math.PI

  // 两点间的x轴夹角弧度
  let xAngle = Math.atan2((y2 - y1), (x2 - x1))
  // 转为角度
  xAngle = 360 * xAngle / (2 * PI)
  // 两点间的长度
  let L = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1))
  // 计算等腰三角形斜边长度
  let L2 = L / 2 / Math.cos(angle * 2 * PI / 360)

  // 求第一个顶点坐标，位于下边
  let val1 = {}
  // 求第二个顶点坐标，位于上边
  let val2 = {}
  val1['x'] = x1 + Math.round(L2 * Math.cos((xAngle + angle) * 2 * PI / 360))
  val1['y'] = y1 + Math.round(L2 * Math.sin((xAngle + angle) * 2 * PI / 360))
  val2['x'] = x1 + Math.round(L2 * Math.cos((xAngle - angle) * 2 * PI / 360))
  val2['y'] = y1 + Math.round(L2 * Math.sin((xAngle - angle) * 2 * PI / 360))

  return [val1, val2]
}

function Step(context, t) {
  this._context = context
  this._t = t
}

Step.prototype = {
  areaStart: function() {
    this._line = 0
  },
  areaEnd: function() {
    this._line = NaN
  },
  lineStart: function() {
    this._x = this._y = NaN
    this._point = 0
  },
  lineEnd: function() {
    if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y)
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath()
    if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line
  },
  point: function(x, y) {
    x = +x, y = +y
    switch (this._point) {
      case 0:
        this._point = 1
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y)
        break
      case 1:
        this._point = 2 // falls through
      default: {

        if (this._t <= 0) {
          this._context.lineTo(this._x, y)
          this._context.lineTo(x, y)
        } else {
          var x1 = this._x * (1 - this._t) + x * this._t
          var xN = 6 // Math.abs(x - x1) * 0.2
          var yN = 6 // Math.abs(y - this._y) * 0.2
          /* 贝塞尔曲线 */
          // var p1 = [x1 - xN, this._y]
          // var p2 = [x1, this._y]
          // var p3 = [x1, y]
          // var p4 = [x1 + xN, y]
          // this._context.lineTo(p1[0], p1[1]);
          // this._context.bezierCurveTo(p2[0], p2[1], p3[0], p3[1], p4[0], p4[1])

          /* 圆角直线 */
          var p1 = [x1 - xN, this._y]
          var p2 = [x1, this._y + (this._y === y ? 0 : (this._y < y ? yN : -yN))]
          var p3 = [x1, y + (this._y === y ? 0 : (this._y < y ? -yN : yN))]
          var p4 = [x1 + xN, y]
          this._context.lineTo(p1[0], p1[1])
          this._context.quadraticCurveTo(x1, this._y, p2[0], p2[1])
          this._context.lineTo(p3[0], p3[1])
          this._context.quadraticCurveTo(x1, y, p4[0], p4[1])

          /* 直角直线 */
          // var p1 = [x1 - xN, this._y]
          // var p2 = [x1, this._y + (this._y === y ? 0 : (this._y < y ? yN : -yN))]
          // var p3 = [x1, y + (this._y === y ? 0 : (this._y < y ? -yN : yN))]
          // var p4 = [x1 + xN, y]
          // this._context.lineTo(p1[0], p1[1])
          // this._context.lineTo(p2[0], p2[1])
          // this._context.lineTo(p3[0], p3[1])
          // this._context.lineTo(p4[0], p4[1])

          /* 直角直线 */
          // this._context.lineTo(x1, this._y);
          // this._context.lineTo(x1, y);
        }
        break
      }
    }
    this._x = x, this._y = y
  }
}

/*Step.prototype = {
 areaStart: function() {
 this._line = 0
 },
 areaEnd: function() {
 this._line = NaN
 },
 lineStart: function() {
 this._x = this._y = NaN
 this._point = 0
 },
 lineEnd: function() {
 if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y)
 if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath()
 if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line
 },
 point: function(x, y) {
 x = +x, y = +y
 switch (this._point) {
 case 0:
 this._point = 1
 this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y)
 break
 case 1:
 this._point = 2 // proceed
 default: {
 var xN, yN, mYb, mYa
 if (this._t <= 0) {
 xN = Math.abs(x - this._x) * 0.25
 yN = Math.abs(y - this._y) * 0.25
 mYb = (this._y < y) ? this._y + yN : this._y - yN
 mYa = (this._y > y) ? y + yN : y - yN

 this._context.quadraticCurveTo(this._x, this._y, this._x, mYb)
 this._context.lineTo(this._x, mYa)
 this._context.quadraticCurveTo(this._x, y, this._x + xN, y)
 this._context.lineTo(x - xN, y)

 } else {
 var x1 = this._x * (1 - this._t) + x * this._t

 xN = Math.abs(x - x1) * 0.25
 yN = Math.abs(y - this._y) * 0.25
 mYb = (this._y < y) ? this._y + yN : this._y - yN
 mYa = (this._y > y) ? y + yN : y - yN

 this._context.lineTo(x1 - 10, this._y)
 this._context.quadraticCurveTo(x1, this._y, x1, this._y - 10)
 this._context.lineTo(x1, mYa)
 this._context.quadraticCurveTo(x1, y, x1 + xN, y)
 this._context.lineTo(x - xN, y)
 }
 break
 }
 }
 this._x = x, this._y = y
 }
 }*/

export default function curveStepRound(context) {
  return new Step(context, 0.5)
}

export function curveStepRoundBefore(context) {
  return new Step(context, 0)
}

export function curveStepRoundAfter(context) {
  return new Step(context, 1)
}
