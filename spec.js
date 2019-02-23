exports.FIXED = 'fixed'
exports.LLLLVAR = 'llllvar'
exports.LLLVAR = 'lllvar'
exports.LLVAR = 'llvar'
exports.LVAR = 'lvar'
exports.ZERO_LEFT_PADDING = 'zero_left'
exports.ZERO_RIGHT_PADDING = 'zero_right'
exports.SPACE_LEFT_PADDING = 'space_left'
exports.SPACE_RIGHT_PADDING = 'space_right'

exports.Spec = function(options){
    this.lenType = exports.FIXED
    if (options.lenType) this.lenType = options.lenType
    this.label = options.label
    this.len = options.len
}
exports.Specs = function(){
    this.arr = {}
    this.add = function(bit, spec){
        this.arr['bit_'+bit] = spec
    }
}
exports.setPaddingLeft = function (text, len, padding){
    while (text.length < len) {
        text = padding + text
    }
    return text
}
exports.setPaddingRight = function (text, len, padding){
    while (text.length < len) {
        text += padding
    }
    return text
}

exports.unSetPaddingLeft = function (text, padding){
    while (text[0] == padding) {
        text = text.substring(1, text.length)
        if(text.length == 0) break
    }
    return text
}
exports.unSetPaddingRight = function (text, padding){
    while (text[text.length - 1] == padding) {
        text = text.substring(0, text.length - 1)
        if(text.length == 0) break
    }
    return text
}

exports.setZeroLeftPadding = function(text, len){
    return exports.setPaddingLeft(text, len, '0')
}
exports.setSpaceLeftPadding = function(text, len){
    return exports.setPaddingLeft(text, len, ' ')
}
exports.setZeroRightPadding = function(text, len){
    return exports.setPaddingRigth(text, len, '0')
}
exports.setSpaceRightPadding = function(text, len){
    return exports.setPaddingRight(text, len, ' ')
}


exports.unSetZeroLeftPadding = function(text){
    return exports.unSetPaddingLeft(text, '0')
}
exports.unSetSpaceLeftPadding = function(text){
    return exports.unSetPaddingLeft(text, ' ')
}
exports.unSetZeroRightPadding = function(text){
    return exports.unSetPaddingRigth(text, '0')
}
exports.unSetSpaceRightPadding = function(text){
    return exports.unSetPaddingRight(text, ' ')
}
