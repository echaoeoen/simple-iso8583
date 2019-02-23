# parser-iso8583
simple and easy to parsing iso8583 messages with configurable spec

**Installation**

    npm install parser-iso8583
 
**API**

    var iso8583 = require('parser-iso8583')

 **Spec Configuration**
 

    var  specs  =  new  iso8583.Specs()
    //spec.add(bit, spec)
    specs.add(2, new iso8583.Spec({len: 21})) //for fixed length
    specs.add(3,new  iso8583.Spec({lenType:  iso8583.Const.LVAR})) //for lvar
    specs.add(4,new  iso8583.Spec({lenType:  iso8583.Const.LLVAR})) //for llvar
    specs.add(5,new  iso8583.Spec({lenType:  iso8583.Const.LLLVAR})) //for lllvar
    specs.add(6,new  iso8583.Spec({len:  12, lenType:iso8583.Const.SPACE_RIGHT_PADDING})) // for SPACE RIGHT PADDING
    specs.add(7,new  iso8583.Spec({len:  12, lenType:iso8583.Const.SPACE_LEFT_PADDING})) // for SPACE RIGHT PADDING
    specs.add(8,new  iso8583.Spec({len:  12, lenType:iso8583.Const.ZERO_LEFT_PADDING})) // for SPACE RIGHT PADDING
    specs.add(9,new  iso8583.Spec({len:  12, lenType:iso8583.Const.ZERO_RIGTH_PADDING})) // for SPACE RIGHT PADDING
    
   **Parser Constructor**

    const conf = {
	    specs: specs, //spec configuration *required
	    useMTI: true, //if your iso are not using MTI fill false(for some case) *default true
	    useBit: true, //if your iso are not using bit definition fill false (for some case) *default true
	    lenBit: 16, //default 16
    }
    var parser = new iso8583.Parser(conf)
    // or
    var parser = new iso8583.Parser({specs: specs}) // using default config
    
**Parse From ISO**

    parser.fromISO(str)
    console.log(parser.MTI) // return MTI ex:2100
    console.log(parser.element) 
    // { bit_2: '190000001601020980445',
		 bit_3: '302000',
	     bit_4: '000000000000',
         bit_7: '1001101304',
	     bit_11: '000222',
	     bit_12: '101304',
	     bit_13: '1001',
	     bit_14: '1002',
	     bit_15: '1002',
	     bit_18: '0000',
	     bit_32: 'usertest',... }
**Parse To ISO**

    //add element parser.addElement(bit, value)
    parser.addElement(2,'190000001601020980445')
    parser.setMTI('2100')
    console.log(parser.toISO()) // return 2100F23E400128E180060000000004000000190000001601020980445302000000000000000100110130400022210130410011002100200001100002000001110000200000187001       ebayblabla       9615999        SIM-ATM BUU-Lt18                        020000000016010209804453600090010010010061011152000000001601020980445
