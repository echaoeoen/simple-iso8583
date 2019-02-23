let Spec = require('./spec')

var ConvertBase = function (num) {
    return {
        from : function (baseFrom) {
            return {
                to : function (baseTo) {
                    return parseInt(num, baseFrom).toString(baseTo);
                }
            };
        }
    };
};

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

function bin2hex(bin){
    let res = ''
    while(bin.length != 0){
        let temp = bin.substring(0, 4)
        res += parseInt(temp, 2).toString(16)
        bin = bin.replace(temp, '')
    }
    return res.toUpperCase()
}
function hex2bin(hex){
    // console.log(hex)
    // console.log(hex.substring(0,16))
    // console.log((parseInt(hex.substring(0,16) , 16).toString(2)).padStart(8, '0'))
    // console.log((parseInt('F23E400128E18006' , 16).toString(2)).padStart(8, '0'))
    // console.log(hex.substring(16,32), )
    // console.log((parseInt(hex.substring(16,32) , 16).toString(2)).padStart(8, '0'))
    // if(hex.length = 16)
    //     return (parseInt(hex, 16).toString(2)).padStart(4, '0');
    // else {
    //     return (parseInt(hex.substring(0,16) , 16).toString(2)).padStart(4, '0') + (parseInt(hex.substring(16,32) , 16).toString(2)).padStart(4, '0');

    // }
    let hexbin = {
        "0": "0000",
        "1": "0001",
        "2": "0010",
        "3": "0011",
        "4": "0100",
        "5": "0101",
        "6": "0110",
        "7": "0111",
        "8": "1000",
        "9": "1001",
        "A": "1010",
        "B": "1011",
        "C": "1100",
        "D": "1101",
        "E": "1110",
        "F": "1111"
    }
    let res = ''
    for (let i = 0; i < hex.length; i++) {
        // console.log(hex[i], hexbin[hex[i]])
        res+=hexbin[hex[i]]
    }
    // console.log(res, ConvertBase(hex).from(16).to(2), res == ConvertBase(hex).from(16).to(2))
    // let re = ConvertBase(res).from(2).to(16)
    // console.log(hex, bin2hex(res))
    return res
}
exports.Specs = Spec.Specs
exports.Spec = Spec.Spec
exports.Const = Spec
exports.Parser = function(options) {
    let _this = this
    _this.options = {
        specs: {},
        lenType: Spec.FIXED,
        usingBit: true,
        lenBit: 16,
        usingMTI: true
    }
    for (const prop in options) {
        if (_this.options.hasOwnProperty(prop)) {
            if (prop == 'specs') _this.options.specs = options.specs.arr
            else _this.options[prop] = options[prop];  
        }
    }
    _this.bits = []
    _this.MTI = ''
    _this.element = {}
    _this.addElement = function(key, value){
        _this.element['bit_'+key] = ''+value
    }
    _this.setMTI = function(MTI){
        _this.MTI = MTI
    }
    _this.extractBit = function(bitString){
        let binary = hex2bin(bitString)
// console.log(binary)
        _this.bits = []
        for (let i = 1; i < binary.length; i++) {
            if (binary[i] == '1'){
                _this.bits.push(i+1)
            }
            // console.log(i, binary[i])
        }
        // console.log('bit')
        return _this.bits
    }
    _this.unpack = function(strIso){
        // console.log('disini', _this)
        let index = 0
        if(_this.usingMTI) index = 2
        _this.element = {}
        let iterate = _this.bits
        if (!_this.options.usingBit) iterate = _this.options.specs
        for(let i in iterate){
            let key = i
            if (_this.options.usingBit) key = 'bit_'+ _this.bits[i]
            
            // console.log(key)
            const spec = _this.options.specs[key]
            // console.log(spec,strIso)
            let selected = ''
            if(spec.lenType == Spec.FIXED){
                selected = strIso.substring(0, spec.len)
                strIso = strIso.replace(selected, '')
            } else if(spec.lenType == Spec.LLLVAR) {
                let len = strIso.substring(0, 3)
                strIso = strIso.replace(len, '')
                selected = strIso.substring(0, parseInt(len))
                strIso = strIso.replace(selected, '')
            } else if(spec.lenType == Spec.LLVAR) {
                let len = strIso.substring(0, 2)
                strIso = strIso.replace(len, '')
                selected = strIso.substring(0, parseInt(len))
                strIso = strIso.replace(selected, '')
                
            } else if(spec.lenType == Spec.LVAR) {
                let len = strIso.substring(0, 1)
                strIso = strIso.replace(len, '')
                selected = strIso.substring(0, parseInt(len))
                strIso = strIso.replace(selected, '')

            } else if(spec.lenType == Spec.ZERO_LEFT_PADDING) {
                selected = strIso.substring(0, spec.len)
                strIso = strIso.replace(selected, '')
                selected = Spec.unSetZeroLeftPadding(selected)
            } else if(spec.lenType == Spec.ZERO_RIGHT_PADDING) {
                selected = strIso.substring(0, spec.len)
                strIso = strIso.replace(selected, '')
                selected = Spec.unSetZeroRightPadding(selected)
                
            } else if(spec.lenType == Spec.SPACE_LEFT_PADDING) {
                selected = strIso.substring(0, spec.len)
                strIso = strIso.replace(selected, '')
                selected = Spec.unSetSpaceLeftPadding(selected)
                
            } else if(spec.lenType == Spec.SPACE_RIGHT_PADDING) {
                selected = strIso.substring(0, spec.len)
                strIso = strIso.replace(selected, '')
                selected = Spec.unSetSpaceRightPadding(selected)    
            }
            _this.element[key] = selected
        }
    }
    _this.fromISO = function (strIso){
        let len = ''
        switch(_this.options.lenType){
            case Spec.LLLLVAR: 
                len = strIso.substring(0,4)
                len = parseInt(len)
                strIso = strIso.substring(4, 4+len)
                // console.log(len, strIso)
                break
            case Spec.LLLVAR: 
                len = strIso.substring(0,3)
                len = parseInt(len)
                strIso = strIso.substring(3, 3+len)
                break
            case Spec.LLVAR: 
                len = strIso.substring(0,2)
                len = parseInt(len)
                strIso = strIso.substring(2, 2+len)  
                break
            case Spec.LVAR: 
                len = strIso.substring(0,1)
                len = parseInt(len)
                strIso = strIso.substring(1, 1+len)
                break
            default: break
        }
        if (_this.options.usingMTI) {
            _this.MTI = strIso.substring(0,4)
            strIso = strIso.replace(_this.MTI, '')
        }
        if (_this.options.usingBit) {
            let bitString = strIso.substring(0, _this.options.lenBit)
            strIso = strIso.replace(bitString, '')
            _this.extractBit(bitString)
        }
        _this.unpack(strIso)
    }
    _this.intractBit = function(){
        let strBit = '0'.repeat(_this.options.lenBit*4)
        // console.log(strBit)
        for (let i = 0; i < _this.bits.length; i++) {
            const element = _this.bits[i] - 1
            // console.log(element)
            strBit = setCharAt(strBit,element,'1')
        }
        // console.log(strBit)

        return bin2hex(strBit)
    }
    _this.toISO = function(){
        let strElem = ''
        let strBit = ''
        _this.bits = [1]
        for (const key in _this.options.specs) {
            let spec = _this.options.specs[key]
            let bit = key.replace('bit_','')
            _this.bits.push(parseInt(bit))
            let elem = _this.element[key]
            let len = elem.length
            if(spec.lenType == Spec.LLLVAR) {
                len = Spec.setZeroLeftPadding(""+len, 3)
                elem = len + elem
            } else if(spec.lenType == Spec.LLVAR) {
                len = Spec.setZeroLeftPadding(""+len, 2)
                elem = len + elem
            } else if(spec.lenType == Spec.LVAR) {
                len = Spec.setZeroLeftPadding(""+len, 1)
                elem = len + elem
            } else if(spec.lenType == Spec.ZERO_LEFT_PADDING) {
                elem = Spec.setZeroLeftPadding(elem, spec.len)
            } else if(spec.lenType == Spec.ZERO_RIGHT_PADDING) {
                elem = Spec.setZeroRightPadding(elem, spec.len)
            } else if(spec.lenType == Spec.SPACE_LEFT_PADDING) {
                elem = Spec.setSpaceLeftPadding(elem, spec.len)
                
            } else if(spec.lenType == Spec.SPACE_RIGHT_PADDING) {
                elem = Spec.setSpaceRightPadding(elem, spec.len)
            }
            strElem+=elem
        }
        strBit = (_this.options.usingBit ? _this.intractBit() : '')
        // console.log(_this.MTI, _this.bits, strBit)
        let res = (_this.options.usingMTI ? _this.MTI : '') + strBit + strElem
        let len = res.length
        // console.log(res.length)
        switch(_this.options.lenType){
            case Spec.LLLLVAR: 
                len = Spec.setZeroLeftPadding(""+len, 4)
                break
            case Spec.LLLVAR: 
                len = Spec.setZeroLeftPadding(""+len, 3)
                break
            case Spec.LLVAR: 
                len = Spec.setZeroLeftPadding(""+len, 2)
                break
            default: 
                len = '' 
                break
        }

        return len + res
    }
}