export const TOOLBOX = {
  show: true,
  orient: 'horizontal',
  itemSize: 15,
  itemGap: 5,
  showTitle: true,
  feature: {
    mark: {
      show: true
    },
    dataView: {
      show: true,
      title: 'dataView',
      readOnly: false,
      lang: ['dataView', 'close', 'refresh'],
      backgroundColor: '#fff',
      textareaColor: '#fff',
      textareaBorderColor: '#333',
      textColor: '#000',
      buttonColor: '#c23531',
      buttonTextColor: '#fff'
    },
    magicType: {
      show: true,
      title: 'magicType',
      type: [
        'line',
        'bar'
      ]
    },
    restore: {
      show: true,
      title: 'restore'
    },
    saveAsImage: {
      show: true,
      type: 'png',
      name: 'pic1',
      backgroundColor: '#ffffff',
      title: 'saveAsImage',
      pixelRatio: 1
    }
  },
  zlevel: 0,
  z: 2,
  left: 'auto',
  top: 'top',
  right: 50,
  bottom: 'auto',
  width: 'auto',
  height: 'auto'
};

export const toolboxSimple = (top: any = 'top', right: any = 50) => ({
  show: true,
  orient: 'horizontal',
  itemSize: 15,
  itemGap: 5,
  showTitle: true,
  feature: {
    mark: {
      show: true
    },
    dataView: {
      show: true,
      title: 'dataView',
      readOnly: false,
      lang: ['dataView', 'close', 'refresh'],
      backgroundColor: '#fff',
      textareaColor: '#fff',
      textareaBorderColor: '#333',
      textColor: '#000',
      buttonColor: '#c23531',
      buttonTextColor: '#fff'
    },
    restore: {
      show: true,
      title: 'restore'
    },
    saveAsImage: {
      show: true,
      type: 'png',
      name: 'pic1',
      backgroundColor: '#ffffff',
      title: 'saveAsImage',
      pixelRatio: 1
    }
  },
  zlevel: 0,
  z: 2,
  left: 'auto',
  top,
  right,
  bottom: 'auto',
  width: 'auto',
  height: 'auto'
});

export const PIE_LABEL = {
  show: true,
  formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}: }{c} {per|{d}%}  ',
  backgroundColor: '#F6F8FC',
  borderColor: '#8C8D8E',
  borderWidth: 1,
  borderRadius: 4,
  fontSize: 14,
  rich: {
    a: {
      color: '#6E7079',
      lineHeight: 20,
      align: 'center'
    },
    hr: {
      borderColor: '#8C8D8E',
      width: '100%',
      borderWidth: 1,
      height: 0
    },
    b: {
      color: '#4C5058',
      fontSize: 14,
      fontWeight: 'bold',
      lineHeight: 30
    },
    per: {
      color: '#fff',
      backgroundColor: '#4C5058',
      padding: [1, 2],
      borderRadius: 4,
      align: 'center'
    }
  }
};

export const echartsTitle = (text: String, fontSize = 17) => ({
  text,
  x: 'center',
  textStyle: {
    color: '#333',
    fontWeight: 'normal',
    fontSize
  }
});
