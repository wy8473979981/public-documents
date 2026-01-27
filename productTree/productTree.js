import * as d3 from 'd3'
import curveStepRound from '@investment/mixins/curveStepRound'

const level1 = require('@investment/assets/img/cylbg01.svg')
const level0 = require('@investment/assets/img/cylbg02.svg')

export default {
  data () {
    return {
      treeData: null,
      minDepth: 3,
      duration: 150,
      colors: [
        '#4CB0FF',
        '#85B52C',
        '#FFA725',
        '#78909C',
        '#66BB6A',
        '#8D6E63',
        '#FFCA28',
        '#8555D9',
        '#9CCC65',
        '#FF7043',
        '#3367E3'
      ],
      loading: false,
      treeContainer: null,
      reserve: false,
      treeConfig: {
        width: 1200,
        height: 500,
        dx: 0,
        dy: 0,
        layerDis: 400, // x轴之间的距离
        nodeDis: 60, // y轴之间的距离,
        link: {
          textColor: '#ADB3C2',
          colors: {
            1: '#D9D9D9',
            2: '#D9D9D9',
            3: '#D9D9D9'
          }
        },
        node: {
          expand_colors: {
            0: '#D9D9D9',
            1: '#D9D9D9',
            2: '#D9D9D9'
          },
          width: 120,
          height: 32,
          radius: 4,
          virtualBgColor: '#F4F6F9',
          text_colors: {
            0: '#fff',
            1: '#fff',
            2: 'rgba(0,0,0,0.85)',
            3: '#3367E3'
          },
          colors_border: {
            0: '#34465A',
            1: '#727B95',
            2: '#D9D9D9',
            3: '#3367E3'
          },
          colors_bg: {
            0: 'url(#stream_level0)',
            1: 'url(#stream_level1)',
            2: '#FFF'
          }
        }
      }
    }
  },
  watch: {
    treeData () {
      if (!this.treeContainer) {
        this.initTree(this.$el.querySelector('.tree-container'))
      }else{
        if (this.$svg && this.$svg.node()) {
          this.treeContainer.removeChild(this.$svg.node(0))
        }
        this.initTree(this.$el.querySelector('.tree-container'))
      }
      this.loading = true

      this.initializeConfig()
      this.$svg
        .attr('viewBox', [0, 0, 0, 0])
        .style('opacity', 0)

      this.$linkContainer.selectAll('g').remove().exit()
      this.$relContainer.selectAll('g').remove().exit()
      this.$nodeContainer.selectAll('g.node').remove().exit()
      if (this.treeData && typeof this.treeData === 'object') {
        this.$root = d3.hierarchy(this.treeData)
        this.$root.x0 = this.treeConfig.dx
        this.$root.y0 = this.treeConfig.dy
        this.$root.descendants().forEach((d, i) => {
          d.id = d.data.productCode
          d._children = d.children
          if (d.depth && d.depth > this.minDepth - 1) d.children = null
        })
        this.updateGraph(this.$root)
        setTimeout(() => {
          this.initializeConfig()
          this.$svg
            .attr('viewBox', [0, 0, this.treeConfig.width, this.treeConfig.height])
            .style('opacity', 1)
          this.zoomFit(0)
          // this.openToggle() // 暂时解决位置不居中问题
          this.loading = false
        }, this.duration + 50)
      }
    }
  },
  methods: {
    openToggle (toggle) {
      this.loading = true
      if (this.$svg && this.$svg.node()) {
        this.treeContainer.removeChild(this.$svg.node(0))
      }
      this.initTree(this.$el.querySelector('.tree-container'))
      this.initializeConfig()
      this.$svg
        .attr('viewBox', [0, 0, 0, 0])
        .style('opacity', 0)
      const _deep = (items) => items && items.forEach(n => (n.children = (toggle || n.depth <= this.minDepth - 1 ? n._children : null), _deep(n._children)))
      _deep([this.$root])
      this.updateGraph(this.$root)
      setTimeout(() => {
        this.initializeConfig()
        this.$svg
          .attr('viewBox', [0, 0, this.treeConfig.width, this.treeConfig.height])
          .style('opacity', 1)
        this.zoomFit(0)
        this.loading = false
      }, this.duration + 50)
    },
    zoomFit (transitionDuration) {
      const bounds = this.$svg.node().getBBox()
      const parent = this.$svg.node().parentElement
      const fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
        fullHeight = parent.clientHeight || parent.parentNode.clientHeight
      const width = bounds.width,
        height = bounds.height
      const midX = bounds.x + width / 2,
        midY = bounds.y + height / 2
      if (width === 0 || height === 0) return // nothing to fit
      const scale = 0.85 / Math.max(width / fullWidth, height / fullHeight)
      const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY]

      const transform = d3.zoomIdentity
        .translate(translate[0], translate[1])
        .scale(Math.min(scale, 1))

      this.$svg
        .transition()
        .duration(transitionDuration || 0) // milliseconds
        .call(this.$zoom.transform, transform)
    },
    initTree (container = null) {
      if (!container) {
        throw Error('Container is empty!')
      }
      this.treeContainer = typeof container === 'string' ? document.querySelector(container) : container
      if (!this.treeContainer) {
        throw Error('Container not DOM!')
      }
      this.initializeConfig()
      this.initializeContainer()
    },
    initializeConfig () {
      const { width, height } = this.treeContainer.getBoundingClientRect()
      this.treeConfig.width = width - 20
      this.treeConfig.height = height - 20
      this.treeConfig.dy = width * 0.3
      this.treeConfig.dx = height / 2
    },
    initializeContainer () {
      const _this = this
      this.$svg = d3.create('svg')
        .attr('viewBox', [0, 0, this.treeConfig.width, this.treeConfig.height])
        .style('font', '12px "PingFangSC-Regular", "PingFang SC"')
        .style('width', '100%')
        .style('height', '100%')
        .style('user-select', 'none')
      this.$container = this.$svg.append('g')
      this.$zoom = d3.zoom()
        .scaleExtent([0.001, 1000])
        .on('zoom', event => {
          _this.$container.attr('transform', event.transform.toString())
        })
      this.$svg.call(this.$zoom).on('dblclick.zoom', null)
      this.treeContainer.appendChild(this.$svg.node())
      this.createMark()
      this.$linkContainer = this.$container
        .append('g')
        .attr('class', 'links')
      this.$relContainer = this.$container
        .append('g')
        .attr('class', 'relations')
      this.$nodeContainer = this.$container
        .append('g')
        .attr('class', 'nodes')
    },
    updateGraph (source) {
      const nodes = this.$root.descendants().reverse()
      const links = this.$root.links()
      const relationLinks = []
      const relationNodes = nodes.filter(n => n.data.relation && n.data.relation.target)
      relationNodes.forEach(node => {
        const targetNode = nodes.find(n => n.data.name === node.data.relation.target)
        if (targetNode) {
          relationLinks.push({ source: node, target: targetNode, data: { relation: true } })
        }
      })
      // Compute the new tree layout.
      this.treeConfig.layerDis = this.reserve ? 120 : 200
      this.treeConfig.nodeDis = this.reserve ? 180 : 50
      d3.tree().nodeSize([this.treeConfig.nodeDis, this.treeConfig.layerDis])(this.$root)
      let left = this.$root
      let right = this.$root
      this.$root.eachBefore(node => {
        if (node.x < left.x) left = node
        if (node.x > right.x) right = node
      })
      // const height = right.x - left.x
      const transition = this.$svg.transition()
        .duration(this.duration)
        // .attr('viewBox', [-this.treeConfig.width / 4, -this.treeConfig.height / 2, this.treeConfig.width, this.treeConfig.height])
        .tween('resize', window.ResizeObserver ? null : () => () => this.$svg.dispatch('toggle'))
      this.updateNode(source, nodes, transition)
      this.updateLink(source, links, transition)
      this.updateRelationLink(source, relationLinks, transition)
      // Stash the old positions for transition.
      this.$root.eachBefore(d => {
        d.x0 = d.x
        d.y0 = d.y
      })
    },
    updateNode (source, nodes, transition) {
      const _this = this
      // Update the nodes…
      const node = this.$nodeContainer.selectAll('g.node')
        .data(nodes, d => d.id)
      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('id', d => d.id)
        .attr('transform', d => {
          if (this.reserve) {
            return `translate(${source.x0},${source.y0})`
          }
          return `translate(${source.y0},${source.x0})`
        })
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
      nodeEnter.append('rect')
        .attr('class', (d) => d.id)
        .attr('width', this.treeConfig.node.width)
        .attr('height', this.treeConfig.node.height)
        .attr('stroke-width', d => {
          return d.depth >= 1 ? 1 : 0
        })
        .attr('stroke', d => {
          if(d.depth < 1){
            return ''
          }else{
            if(d.data?.productCode === _this.productCode){
              return this.treeConfig.node.colors_border[3]
            }else{
              return this.treeConfig.node.colors_border[2]
            }
          }
          // return d.depth > 1 ? this.treeConfig.node.colors_border[d.depth > 1 ? 2 : d.depth] : ''
        })
        .attr('stroke-dasharray', d => d.data.isVirtual ? 3 : 0)
        .attr('fill', d => {
          if(d.depth < 1){
            return this.treeConfig.node.colors_bg[d.depth]
          }else{
            return !d.data.isVirtual ? this.treeConfig.node.colors_bg[2] : this.treeConfig.node.virtualBgColor
          }
          // return d.depth <= 1 ? this.treeConfig.node.colors_bg[d.depth] : (!d.data.isVirtual ? this.treeConfig.node.colors_bg[2] : this.treeConfig.node.virtualBgColor)
        })
        .attr('rx', this.treeConfig.node.radius)
        .attr('ry', this.treeConfig.node.radius)
        .attr('x', (this.treeConfig.node.width / 2) * -1)
        .attr('y', (this.treeConfig.node.height / 2) * -1)
        .attr('text-anchor', 'middle')
        .attr('cursor', (d) => d.data?.level? 'pointer' : null)
      nodeEnter.append('text')
        .attr('fill', (d) => {
          if(d.depth < 1){
            return this.treeConfig.node.text_colors[d.depth]
          }else{
            if(d.data?.productCode === _this.productCode){
              return  this.treeConfig.node.text_colors[3]
            }else{
              return this.treeConfig.node.text_colors[2]
            }
          }
          // return d.depth <= 1 ? this.treeConfig.node.text_colors[d.depth] : this.treeConfig.node.text_colors[2]
        })
        .attr('x', 0)
        .attr('y', 5)
        .attr('text-anchor', 'middle')
        .style('fon-size', '12px')
        .style('font-weight', '400')
        // .on('mouseenter', (event, node) => {
        //   event.stopPropagation()
        //   event.preventDefault()
        //   _this.handleNodeMouseover(node, event)
        // })
        // .on('mouseleave', (event, node) => {
        //   event.stopPropagation()
        //   event.preventDefault()
        //   _this.handleNodeMousemove(node, event)
        // })
        .on('click', (event, node) => {
          event.stopPropagation()
          event.preventDefault()
          _this.handleNodeClick(node, event)
        })
        .append('tspan')
        .text((d) => {
          if (d.data.name && d.data.name.length > 7) {
            return d.data.name.substring(0, 7) + '...'
          } else {
            return d.data.name
          }
        })
      nodeEnter.append('rect')
        .attr('class', (d) => d.id)
        .attr('width', this.treeConfig.node.width)
        .attr('height', this.treeConfig.node.height)
        .attr('fill', 'transparent')
        .attr('rx', this.treeConfig.node.radius)
        .attr('ry', this.treeConfig.node.radius)
        .attr('x', (this.treeConfig.node.width / 2) * -1)
        .attr('y', (this.treeConfig.node.height / 2) * -1)
        .attr('text-anchor', 'middle')
        .attr('cursor', (d) => d.data?.level? 'pointer' : null)
        .on('click', (event, node) => {
          event.stopPropagation()
          event.preventDefault()
          _this.handleNodeClick(node, event)
        })
        // .on('mouseenter', (event, node) => {
        //   event.stopPropagation()
        //   event.preventDefault()
        //   _this.handleNodeMouseover(node, event)
        // })
        // .on('mousemove', (event, node) => {
        //   event.stopPropagation()
        //   event.preventDefault()
        //   _this.handleNodeMousemove(node, event)
        // })
        // .on('mouseleave', (event, node) => {
        //   event.stopPropagation()
        //   event.preventDefault()
        //   _this.handleNodeMouseout(node, event)
        // })
      this.createNodeIcon(nodeEnter)
      nodeEnter.append('title')
        .text((d) => d.data.name)
      // Transition nodes to their new position.
      node.merge(nodeEnter).transition(transition)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1)
        .attr('transform', (d) => {
          if (this.reserve) {
            return `translate(${d.x},${d.y})`
          } else {
            return `translate(${d.y},${d.x})`
          }
        })
      // Transition exiting nodes to the parent's new position.
      node.exit().transition(transition).remove()
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .attr('transform', (d) => {
          if (this.reserve) {
            return `translate(${source.x},${source.y})`
          } else {
            return `translate(${source.y},${source.x})`
          }
        })
      this.updateNodeIcon()
    },
    createNodeIcon (nodeEnter) {
      const nodeIcon = nodeEnter.append('g')
        .attr('class', 'icon-text')
        .attr('opacity', d => d.children || d._children ? 1 : 0)
        .on('click', (event, d) => {
          if (d.children || d._children) {
            d.children = d.children ? null : d._children
            this.updateGraph(d)
          }
        })
      nodeIcon.append('circle')
        .attr('class', 'icon-circle')
        .attr('r', 8)
        .attr('fill', d => d.depth <= 1 ? this.treeConfig.node.expand_colors[d.depth] : this.treeConfig.node.expand_colors[2])
        .attr('cx', !this.reserve ? this.treeConfig.node.width / 2 : 0)
        .attr('cy', !this.reserve ? 0 : this.treeConfig.node.height / 2)
      nodeIcon.append('text')
        .attr('class', (d) => `icon_${d.id}`)
        .attr('x', !this.reserve ? this.treeConfig.node.width / 2 : 0)
        .attr('y', !this.reserve ? 4 : this.treeConfig.node.height / 2 + 5)
        .attr('fill', '#FFF')
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '400')
        .append('tspan')
        .text((d) => {
          if (d.children && d.children.length && d._children && d._children.length) {
            return '-'
          } else {
            return '+'
          }
        })
    },
    updateNodeIcon () {
      const nodeIcon = this.$nodeContainer.selectAll('g.icon-text')
      nodeIcon.attr('opacity', d => d.children || d._children ? 1 : 0)
      nodeIcon.select('circle')
      .attr('cx', !this.reserve ? this.treeConfig.node.width / 2 : 0)
        .attr('cy', !this.reserve ? 0 : this.treeConfig.node.height / 2)
      nodeIcon.select('text')
        .attr('x', !this.reserve ? this.treeConfig.node.width / 2 : 0)
        .attr('y', !this.reserve ? 4 : this.treeConfig.node.height / 2 + 5)
        .select('tspan')
        .text((d) => {
          if (d.children && d.children.length && d._children && d._children.length) {
            return '-'
          } else {
            return '+'
          }
        })
    },
    updateLink (source, links, transition) {
      const diagonal = this.reserve ? this.getReversePath : this.getPath
      // Update the links…
      const link = this.$linkContainer.selectAll('g')
        .data(links, d => `${d.source.id}-${d.target.id}`)
      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append('g')
      linkEnter.append('path')
        .attr('id', d => `${d.source.id}-${d.target.id}`)
        .attr('marker-end', 'url(#marker_arrow)')
        .attr('stroke', d => d.target.depth <= 1 ? this.treeConfig.link.colors[d.target.depth] : this.treeConfig.link.colors[2])
        .attr('d', (d) => {
          const o = { x: source.x0, y: source.y0 }
          return diagonal({ source: o, target: o })
        })
      linkEnter.append('text')
        .style('font-size', '14px')
        .attr('fill', this.treeConfig.link.textColor)
        .attr('dx', -40)
        .attr('dy', -4)
        .append('textPath')
        .attr('startOffset', '100%')
        .attr('xlink:href', d => `#${d.source.id}-${d.target.id}`)
        // .text(d => {
        //   if (d.target.data.level === 1) {
        //     return d.target.data.stream === 0 ? '中游' : (d.target.data.stream === -1 ? '上游' : '下游')
        //   } else {
        //     return ''
        //   }
        // })
      // Transition links to their new position.
      link.merge(linkEnter)
        .transition(transition)
        .select('path')
        .attr('d', diagonal)
      // Transition exiting nodes to the parent's new position.
      link.exit()
        .transition(transition)
        .remove()
        .select('path')
        .attr('d', d => {
          const o = { x: source.x, y: source.y }
          return diagonal({ source: o, target: o })
        })
    },
    updateRelationLink (source, links, transition) {
      const diagonal = this.reserve ? this.getReversePath : this.getPath
      // Update the links…
      const link = this.$relContainer.selectAll('g').data(links)
      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append('g')
      linkEnter.append('path')
        .attr('marker-end', 'url(#marker_arrow)')
        .attr('stroke', d => d.target.depth <= 1 ? this.treeConfig.link.colors[d.target.depth] : this.treeConfig.link.colors[2])
        .attr('id', d => `rel-${d.source.id}-${d.target.id}`)
        .attr('d', d => {
          const o = { x: source.x0, y: source.y0 }
          return diagonal({ source: o, target: o, data: d.data })
        })
      linkEnter.append('text')
        .style('font-size', '14px')
        .attr('dx', -15)
        .attr('dy', -5)
        .attr('fill', this.treeConfig.link.textColor)
        .append('textPath')
        .attr('startOffset', '50%')
        .attr('xlink:href', d => `#rel-${d.source.id}-${d.target.id}`)
        .text('这就是关系')
      linkEnter.append('title').text('这就是关系')
      // Transition links to their new position.
      link.merge(linkEnter)
        .selectAll('path')
        .transition(transition)
        .attr('d', diagonal)
      // Transition exiting nodes to the parent's new position.
      const exitLink = link.exit()
      exitLink.transition(transition)
        .remove()
        .selectAll('path')
        .attr('d', d => {
          const o = { x: source.x, y: source.y }
          return diagonal({ source: o, target: o, data: d.data })
        })
    },
    createMark () {
      const _this = this
      const defs = this.$svg.append('svg:defs')
      defs.selectAll('marker')
        .data(_this.colors)
        .enter()
        .append('svg:marker')
        .attr('id', (d, i) => {
          return `marker_arrow_${_this.colors[i % 10]}`
        })
        .attr('markerHeight', 8)
        .attr('markerWidth', 8)
        .attr('markerUnits', 'strokeWidth')
        .attr('orient', 'auto')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('viewBox', '-8 -8 16 16')
        .append('svg:path')
        .attr('d', 'M 0,0 m -8,-8 L 8,0 L -8,8 Z')
        .attr('fill', (d, i) => {
          return _this.colors[i % 10]
        })
      defs.append('svg:marker')
        .attr('id', 'marker_arrow')
        .attr('markerHeight', 8)
        .attr('markerWidth', 8)
        .attr('markerUnits', 'strokeWidth')
        .attr('orient', 'auto')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('viewBox', '-8 -8 16 16')
        .append('svg:path')
        .attr('d', 'M 0,0 m -8,-8 L 8,0 L -8,8 Z')
        .attr('fill', '#ADB3C2')

      defs.append('pattern')
        .attr('id', 'stream_level0')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('patternContentUnits', 'objectBoundingBox')
        .append('image')
        .attr('xlink:href', level1).attr('width', 1).attr('height', 1)
        .attr('preserveAspectRatio', 'none')

      defs.append('pattern')
        .attr('id', 'stream_level1')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('patternContentUnits', 'objectBoundingBox')
        .append('image')
        .attr('xlink:href', level0).attr('width', 1).attr('height', 1)
        .attr('preserveAspectRatio', 'none')
    },
    getPath ({ source, target, data }) {
      // const diagonal = d3.line().curve(d3.curveStep)
      const diagonal = d3.line().curve(curveStepRound)
      // const diagonal = d3.line().curve(curveStepRoundAfter)
      const p1 = [source.y + this.treeConfig.node.width / 2, source.x]
      const p2 = [target.y - this.treeConfig.node.width / 2 - 5, target.x]
      if (p2[0] < source.y) {
        p2[0] = source.y
      }

      if (data && data.relation) {
        if (relationP2[1] < relationP1[1]) {
          relationP2[1] = relationP1[1]
        }
        return d3.line()([relationP1, relationP2])
      }
      return diagonal([p1, p2])
    },
    getReversePath ({ source, target, data }) {
      const diagonal = d3.line() // .curve(d3.curveMonotoneX)
      const p1 = [source.x, source.y + this.treeConfig.node.height / 2]
      const p5 = [target.x, target.y - this.treeConfig.node.height / 2 - 5]
      if (p5[1] < source.y) {
        p5[1] = source.y
      }
      if (data && data.relation) {
        const relationP1 = [source.x, source.y]
        const relationP2 = [target.x - this.treeConfig.node.width / 2  - 5, target.y]
        if (relationP2[1] < relationP1[1]) {
          relationP2[1] = relationP1[1]
        }
        return d3.line()([relationP1, relationP2])
      }
      // const stepX = (p5[0] - p1[0]) / 2
      const stepY = (p5[1] - p1[1]) / 2
      const p2 = [p1[0], p1[1] + stepY]
      // const p3 = [p1[0] + stepX, p1[1] + stepY]
      const p4 = [p5[0], p5[1] - stepY]
      return diagonal([p1, p2, p4, p5])
    },
    drawPath (lineData) {
      let path = ''
      path += `M${lineData[0].x},${lineData[0].y} ${lineData[1].x},${lineData[1].y}`
      path += ` M${lineData[1].x},${lineData[1].y} Q${lineData[2].x} ${lineData[2].y} ${lineData[3].x},${lineData[3].y}`
      path += ` M${lineData[3].x},${lineData[3].y} ${lineData[4].x},${lineData[4].y}`
      path += ` M${lineData[4].x},${lineData[4].y} Q${lineData[5].x} ${lineData[5].y} ${lineData[6].x},${lineData[6].y}`
      path += ` M${lineData[6].x},${lineData[6].y} ${lineData[7].x},${lineData[7].y}`
      return path
    },
    handleNodeMouseover (node, event) {
    },
    handleNodeMousemove (node, event) {
    },
    handleNodeMouseout (node, event) {
    },
    nodeSelectFunc(){
      const _this = this
      const node = this.$nodeContainer.selectAll('g')
      node.select('rect').attr('stroke', (d) => {
        if (d.depth < 1) {
          return ''
        } else {
          if (d.data?.productCode === _this.productCode) {
            return this.treeConfig.node.colors_border[3]
          } else {
            return this.treeConfig.node.colors_border[2]
          }
        }
      })
      node.select('text').attr('fill', (d) => {
        if (d.depth < 1) {
          return this.treeConfig.node.text_colors[d.depth]
        } else {
          if (d.data?.productCode === _this.productCode) {
            return this.treeConfig.node.text_colors[3]
          } else {
            return this.treeConfig.node.text_colors[2]
          }
        }
      })
      const nodeIcon = this.$nodeContainer.selectAll('g.icon-text')
      nodeIcon.select('text')
      .attr('fill', (d) => {
        return '#fff'
      })
    }
  }
}
