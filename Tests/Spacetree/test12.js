function init(){
    //init data
    var json = {
        id: "node02",
        name: "0.2",
        data: {},
        children: [{
            id: "node13",
            name: "1.3",
            data: {},
            children: [{
                id: "node24",
                name: "2.4",
                data: {},
                children: []
            }, {
                id: "node222",
                name: "2.22",
                data: {},
                children: []
            }]
        }, {
            id: "node125",
            name: "1.25",
            data: {},
            children: [{
                id: "node226",
                name: "2.26",
                data: {},
                children: []
            }, {
                id: "node237",
                name: "2.37",
                data: {},
                children: []
            }, {
                id: "node258",
                name: "2.58",
                data: {},
                children: []
            }]
        }, {
            id: "node165",
            name: "1.65",
            data: {},
            children: [{
                id: "node266",
                name: "2.66",
                data: {},
                children: []
            }, {
                id: "node283",
                name: "2.83",
                data: {},
                children: []
            }, {
                id: "node2104",
                name: "2.104",
                data: {},
                children: []
            }, {
                id: "node2109",
                name: "2.109",
                data: {},
                children: []
            }, {
                id: "node2125",
                name: "2.125",
                data: {},
                children: []
            }]
        }, {
            id: "node1130",
            name: "1.130",
            data: {},
            children: [{
                id: "node2131",
                name: "2.131",
                data: {},
                children: []
            }, {
                id: "node2138",
                name: "2.138",
                data: {},
                children: []
            }]
        }]
    };
    //end
    //init Node Types
    $jit.ST.Plot.NodeTypes.implement({
      'stroke-rect': {
        'render': function(node, canvas) {
          var width = node.getData('width'),
              height = node.getData('height'),
              pos = this.getAlignedPos(node.pos.getc(true), width, height),
              posX = pos.x + width/2,
              posY = pos.y + height/2;
          this.nodeHelper.rectangle.render('fill', {x: posX, y: posY}, width, height, canvas);
          this.nodeHelper.rectangle.render('stroke', {x: posX, y: posY}, width, height, canvas);
        }
      }
    });
    //init st
    //Create a new ST instance
    var st = new $jit.ST({
        //id of viz container element
        injectInto: 'infovis',
        //set distance between node and its children
        levelDistance: 50,
        //set an X offset
        offsetX: 130,
        //set node, edge and label styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            overridable: true,
            type: 'stroke-rect',
            height: 20,
            width: 60,
            //canvas specific styles
            CanvasStyles: {
              fillStyle: '#daa',
              strokeStyle: '#ffc',
              lineWidth: 2
            }
        },
        Edge: {
            overridable: true,
            type: 'line',
            color: '#ffc',
            lineWidth: 1
        },
        Label: {
            type: labelType,
            style: 'bold',
            size: 10,
            color: '#333'
        },
        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
            label.innerHTML = node.name;
            //set label styles
            var style = label.style;
            style.width = 60 + 'px';
            style.height = 17 + 'px';            
            style.cursor = 'pointer';
            style.color = '#333';
            style.fontSize = '0.8em';
            style.textAlign= 'center';
            style.paddingTop = '3px';
        }
    });
    //load json data
    st.loadJSON(json);
    //compute node positions and layout
    st.compute();
    //emulate a click on the root node.
    st.onClick(st.root);
    //end
    
    //Add Select All/None actions
    var nodeAll = $jit.id('select-all-nodes'),
        nodeNone = $jit.id('select-none-nodes'),
        edgeAll = $jit.id('select-all-edges'),
        edgeNone = $jit.id('select-none-edges'),
        labelAll = $jit.id('select-all-labels'),
        labelNone = $jit.id('select-none-labels');
    $jit.util.each([nodeAll, edgeAll, labelAll], function(elem) {
      elem.onclick = function() {
        var pn = elem.parentNode.parentNode.parentNode; //table
        var inputs = pn.getElementsByTagName('input');
        for(var i=0, l=inputs.length; i<l; i++) {
          if(inputs[i].type == 'checkbox') {
            inputs[i].checked = true;
          }
        }
      };
    });
    $jit.util.each([nodeNone, edgeNone, labelNone], function(elem) {
      elem.onclick = function() {
        var pn = elem.parentNode.parentNode.parentNode; //table
        var inputs = pn.getElementsByTagName('input');
        for(var i=0, l=inputs.length; i<l; i++) {
          if(inputs[i].type == 'checkbox') {
            inputs[i].checked = false;
          }
        }
      };
    });
    //get checkboxes
    var nWidth = $jit.id('n-width'),
        nHeight = $jit.id('n-height'),
        nColor = $jit.id('n-color'),
        nBorderColor = $jit.id('n-border-color'),
        nBorderWidth = $jit.id('n-border-width'),
        eLineWidth = $jit.id('e-line-width'),
        eLineColor = $jit.id('e-line-color'),
        lFontSize = $jit.id('l-font-size'),
        lFontColor = $jit.id('l-font-color');
    
    //init Morphing Animations
    var button = $jit.id('update'),
        restore = $jit.id('restore'),
        rand = Math.random,
        floor = Math.floor,
        colors = ['#33a', '#55b', '#77c', '#99d', '#aae', '#bf0', '#cf5', 
                  '#dfa', '#faccff', '#ffccff', '#CCC', '#C37'],
        colorLength = colors.length;
    //add click event for restore
    $jit.util.addEvent(restore, 'click', function() {
      if(init.busy) return;
      init.busy = true;
      
      st.graph.eachNode(function(n) {
        //restore width and height node styles
        n.setDataset('end', {
          width: 60,
          height: 20
        });
        //restore canvas specific styles
        n.setCanvasStyles('end', {
          fillStyle: '#daa',
          strokeStyle: '#ffc',
          lineWidth: 2
        });
        //restore font styles
        n.setLabelDataset('end', {
          size: 10,
          color: '#333'
        });
        //set adjacencies styles
        n.eachAdjacency(function(adj) {
          adj.setDataset('end', {
            lineWidth: 1,
            color: '#ffc'
          });
        });
      });
      st.compute('end');
      st.geom.translate({x:-130, y:0}, 'end');
      st.fx.animate({
        modes: ['linear', 
                'node-property:width:height',
                'edge-property:lineWidth:color',
                'label-property:size:color',
                'node-style:fillStyle:strokeStyle:lineWidth'],
        duration: 1500,
        onComplete: function() {
          init.busy = false;
        }
      });
    });
    //add click event for updating styles
    $jit.util.addEvent(button, 'click', function() {
      if(init.busy) return;
      init.busy = true;
      
      st.graph.eachNode(function(n) {
        //set random width and height node styles
        nWidth.checked && n.setData('width', floor(rand() * 40 + 20), 'end');
        nHeight.checked && n.setData('height', floor(rand() * 40 + 20), 'end');
        //set random canvas specific styles
        nColor.checked && n.setCanvasStyle('fillStyle', colors[floor(colorLength * rand())], 'end');
        nBorderColor.checked && n.setCanvasStyle('strokeStyle', colors[floor(colorLength * rand())], 'end');
        nBorderWidth.checked && n.setCanvasStyle('lineWidth', 10 * rand() + 1, 'end');
        //set label styles
        lFontSize.checked && n.setLabelData('size', 20 * rand() + 1, 'end');
        lFontColor.checked && n.setLabelData('color', colors[floor(colorLength * rand())], 'end');
        //set adjacency styles
        n.eachAdjacency(function(adj) {
          eLineWidth.checked && adj.setData('lineWidth', 10 * rand() + 1, 'end');
          eLineColor.checked && adj.setData('color', colors[floor(colorLength * rand())], 'end');
        });
      });
      st.compute('end');
      st.geom.translate({x:-130, y:0}, 'end');
      st.fx.animate({
        modes: ['linear', 
                'node-property:width:height',
                'edge-property:lineWidth:color',
                'label-property:size:color',
                'node-style:fillStyle:strokeStyle:lineWidth'],
        duration: 1500,
        onComplete: function() {
          init.busy = false;
        }
      });
    });
    //end
}