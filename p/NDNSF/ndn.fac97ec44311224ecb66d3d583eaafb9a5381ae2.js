/** 
 * @author: Wentao Shang
 * See COPYING for copyright and distribution information.
 */

var WebSocketTransport = function WebSocketTransport() {    
    this.ws = null;
    this.elementReader = null;
};

WebSocketTransport.prototype.connect = function(ndn) {
    if (this.ws != null)
	delete this.ws;
    
    this.ws = new WebSocket('ws://' + ndn.host + ':' + ndn.port);
    if (LOG > 3) console.log('WebSocket object created.');
    
    this.ws.binaryType = "arraybuffer";
    
    this.elementReader = new BinaryXmlElementReader(ndn);
    
    var self = this;
    this.ws.onmessage = function (/*MessageEvent*/ msg) {
	var result = msg.data;
				
	if(result == null || result == undefined || result == "" ) {
	    console.log('Invalid WebSocket message.');
	} else if (result instanceof ArrayBuffer) {
	    var bytearray = new Buffer(new Uint8Array(result));
	    
	    if (LOG>3) console.log('Binary response is ' + bytearray.toString('hex'));
	    
            // Find the end of the binary XML element and call ndn.onReceivedElement.
            self.elementReader.onReceivedData(bytearray);
	}
    };
    
    this.ws.onopen = function (ev) {
	if (LOG > 3) console.log('WebSocket connection opened.');
	if (LOG > 3) console.log('ReadyState: ' + this.readyState);

	// Fetch ccndid now
	ndn.fetchCcndId();
    };
	
    this.ws.onerror = function (ev) {
	console.log('WebSocket error.');
    };
	
    this.ws.onclose = function (ev) {
	console.log('WebSocket connection closed: code ' + ev.code);
	self.ws = null;
		
	// Close NDN when WebSocket is closed
	ndn.closeByTransport();
    };
};

/**
 * Send the Uint8Array data.
 */
WebSocketTransport.prototype.send = function(data) {
    if (this.ws != null) {
        // If we directly use data.buffer to feed ws.send(), 
        // WebSocket may end up sending a packet with 10000 bytes of data.
        // That is, WebSocket will flush the entire buffer
        // regardless of the offset of the Uint8Array. So we have to create
        // a new Uint8Array buffer with just the right size and copy the 
        // content from binaryInterest to the new buffer.
        //    ---Wentao
        var bytearray = new Uint8Array(data.length);
        bytearray.set(data);
        this.ws.send(bytearray.buffer);
    }
    else
	console.log('WebSocket connection is not established.');
};

/**
 * Close transport
 */
WebSocketTransport.prototype.close = function () {
    this.ws.close();
    if (LOG > 3) console.log('WebSocket connection closed.');
};
/** 
 * @author: Wentao Shang
 * See COPYING for copyright and distribution information.
 */

// Library namespace
var ndn = {};

var exports = ndn;

var require = function (ignore) { return ndn; };

// Factory method to create node.js compatible buffer objects
var Buffer = function Buffer (data, fmt) {
    var obj;

    if (typeof data == 'number')
	obj = new Uint8Array(data);
    else if (typeof data == 'string') {
        if (fmt == null || fmt == 'ascii') {
	    obj = new Uint8Array(data.length);
	    for (var i = 0; i < data.length; i++)
		obj[i] = data.charCodeAt(i);
	} else if (fmt == 'hex') {
	    obj = new Uint8Array(Math.floor(data.length / 2));
	    var i = 0;
	    data.replace(/(..)/g, function(ss) {
		    obj[i++] = parseInt(ss, 16);
		});
	} else if (fmt == 'base64') {
	    var hex = b64tohex(data);
	    obj = new Uint8Array(Math.floor(hex.length / 2));
	    var i = 0;
	    hex.replace(/(..)/g, function(ss) {
		    obj[i++] = parseInt(ss, 16);
		});
	} else 
	    throw new Error('Buffer: unknown encoding format ' + fmt);
    } else if (data instanceof Uint8Array) {
	obj = data.subarray(0);
    } else
	throw new Error('Buffer: unknown data type.');

    obj.__proto__ = Buffer.prototype;

    obj.toString = function (encoding) {
	if (encoding == null) {
	    var ret = "";
	    for (var i = 0; i < this.length; i++ )
		ret += String.fromCharCode(this[i]);
	    return ret;
	}

	var ret = "";
	for (var i = 0; i < this.length; i++)
	    ret += (this[i] < 16 ? "0" : "") + this[i].toString(16);

	if (encoding == 'hex') {
	    return ret;
	} else if (encoding == 'base64') {
	    return hex2b64(ret);
	} else
	    throw new Error('Buffer.toString: unknown encoding format ' + encoding);
    };

    obj.slice = function (begin, end) {
	return new Buffer(obj.subarray(begin, end));
    };

    obj.copy = function (target, targetStart) {
	target.set(this, targetStart);
    };

    return obj;
};

Buffer.prototype = Uint8Array.prototype;

Buffer.concat = function (arrays) {
    var totalLength = 0;
    for (var i = 0; i < arrays.length; ++i)
	totalLength += arrays[i].length;
    
    var result = new Buffer(totalLength);
    var offset = 0;
    for (var i = 0; i < arrays.length; ++i) {
	result.set(arrays[i], offset);
	offset += arrays[i].length;
    }
    return result;
};

// Factory method to create hasher objects
exports.createHash = function (alg) {
    if (alg != 'sha256')
	throw new Error('createHash: unsupported algorithm.');

    var obj = {};

    obj.md = new KJUR.crypto.MessageDigest({alg: "sha256", prov: "cryptojs"});

    obj.update = function (buf) {
	this.md.updateHex(buf.toString('hex'));
    };

    obj.digest = function () {
	return new Buffer(this.md.digest(), 'hex');
    };

    return obj;
};

// Factory method to create RSA signer objects
exports.createSign = function (alg) {
    if (alg != 'RSA-SHA256')
	throw new Error('createSign: unsupported algorithm.');

    var obj = {};

    obj.arr = [];

    obj.update = function (buf) {
	this.arr.push(buf);
    };

    obj.sign = function (keypem) {
	var rsa = new RSAKey();
	rsa.readPrivateKeyFromPEMString(keypem);
	var signer = new KJUR.crypto.Signature({"alg": "SHA256withRSA", "prov": "cryptojs/jsrsa"});
	signer.initSign(rsa);
	for (var i = 0; i < this.arr.length; i++)
	    signer.updateHex(this.arr[i].toString('hex'));

	return new Buffer(signer.sign(), 'hex');
    };

    return obj;
};

// Factory method to create RSA verifier objects
exports.createVerify = function (alg) {
    if (alg != 'RSA-SHA256')
	throw new Error('createSign: unsupported algorithm.');

    var obj = {};
    
    obj.arr = [];

    obj.update = function (buf) {
	this.arr.push(buf);
    };

    var getSubjectPublicKeyPosFromHex = function (hPub) {  
	var a = ASN1HEX.getPosArrayOfChildren_AtObj(hPub, 0); 
	if (a.length != 2) return -1;
	var pBitString = a[1];
	if (hPub.substring(pBitString, pBitString + 2) != '03') return -1;
	var pBitStringV = ASN1HEX.getStartPosOfV_AtObj(hPub, pBitString);
	if (hPub.substring(pBitStringV, pBitStringV + 2) != '00') return -1;
	return pBitStringV + 2;
    };

    var readPublicDER = function (pub_der) {
	var hex = pub_der.toString('hex');
	var p = getSubjectPublicKeyPosFromHex(hex);
	var a = ASN1HEX.getPosArrayOfChildren_AtObj(hex, p);
	if (a.length != 2) return null;
	var hN = ASN1HEX.getHexOfV_AtObj(hex, a[0]);
	var hE = ASN1HEX.getHexOfV_AtObj(hex, a[1]);
	var rsaKey = new RSAKey();
	rsaKey.setPublic(hN, hE);
	return rsaKey;
    };

    obj.verify = function (keypem, sig) {
	var key = new ndn.Key();
	key.fromPemString(keypem);

	var rsa = readPublicDER(key.publicToDER());
	var signer = new KJUR.crypto.Signature({"alg": "SHA256withRSA", "prov": "cryptojs/jsrsa"});
	signer.initVerifyByPublicKey(rsa);
	for (var i = 0; i < this.arr.length; i++)
	    signer.updateHex(this.arr[i].toString('hex'));
	var hSig = this.signature.signature.toString('hex');
	return signer.verify(hSig);
    };

    return obj;
};

//XXX: pure hack
exports.TcpTransport = WebSocketTransport;
/**
 * @author: Meki Cheraoui
 * See COPYING for copyright and distribution information.
 * This class contains all CCNx tags
 */

/**
 * Ported to node.js by Wentao Shang
 */


var CCNProtocolDTags = {

	/**
	 * Note if you add one of these, add it to the reverse string map as well.
	 * Emphasize getting the work done at compile time over trying to make something
	 * flexible and developer error-proof.
	 */

	 Any : 13,
	 Name : 14,
	 Component : 15,
	 Certificate : 16,
	 Collection : 17,
	 CompleteName : 18,
	 Content : 19,
	 SignedInfo : 20,
	 ContentDigest : 21,
	 ContentHash : 22,
	 Count : 24,
	 Header : 25,
	 Interest : 26,	/* 20090915 */
	 Key : 27,
	 KeyLocator : 28,
	 KeyName : 29,
	 Length : 30,
	 Link : 31,
	 LinkAuthenticator : 32,
	 NameComponentCount : 33,	/* DeprecatedInInterest */
	 RootDigest : 36,
	 Signature : 37,
	 Start : 38,
	 Timestamp : 39,
	 Type : 40,
	 Nonce : 41,
	 Scope : 42,
	 Exclude : 43,
	 Bloom : 44,
	 BloomSeed : 45,
	 AnswerOriginKind : 47,
	 InterestLifetime : 48,
	 Witness : 53,
	 SignatureBits : 54,
	 DigestAlgorithm : 55,
	 BlockSize : 56,
	 FreshnessSeconds : 58,
	 FinalBlockID : 59,
	 PublisherPublicKeyDigest : 60,
	 PublisherCertificateDigest : 61,
	 PublisherIssuerKeyDigest : 62,
	 PublisherIssuerCertificateDigest : 63,
	 ContentObject : 64,	/* 20090915 */
	 WrappedKey : 65,
	 WrappingKeyIdentifier : 66,
	 WrapAlgorithm : 67,
	 KeyAlgorithm : 68,
	 Label : 69,
	 EncryptedKey : 70,
	 EncryptedNonceKey : 71,
	 WrappingKeyName : 72,
	 Action : 73,
	 FaceID : 74,
	 IPProto : 75,
	 Host : 76,
	 Port : 77,
	 MulticastInterface : 78,
	 ForwardingFlags : 79,
	 FaceInstance : 80,
	 ForwardingEntry : 81,
	 MulticastTTL : 82,
	 MinSuffixComponents : 83,
	 MaxSuffixComponents : 84,
	 ChildSelector : 85,
	 RepositoryInfo : 86,
	 Version : 87,
	 RepositoryVersion : 88,
	 GlobalPrefix : 89,
	 LocalName : 90,
	 Policy : 91,
	 Namespace : 92,
	 GlobalPrefixName : 93,
	 PolicyVersion : 94,
	 KeyValueSet : 95,
	 KeyValuePair : 96,
	 IntegerValue : 97,
	 DecimalValue : 98,
	 StringValue : 99,
	 BinaryValue : 100,
	 NameValue : 101,
	 Entry : 102,
	 ACL : 103,
	 ParameterizedName : 104,
	 Prefix : 105,
	 Suffix : 106,
	 Root : 107,
	 ProfileName : 108,
	 Parameters : 109,
	 InfoString : 110,
	// 111 unallocated
	 StatusResponse : 112,
	 StatusCode : 113,
	 StatusText : 114,

	// Sync protocol
	 SyncNode : 115,
	 SyncNodeKind : 116,
	 SyncNodeElement : 117,
	 SyncVersion : 118,
	 SyncNodeElements : 119,
	 SyncContentHash : 120,
	 SyncLeafCount : 121,
	 SyncTreeDepth : 122,
	 SyncByteCount : 123,
	 ConfigSlice : 124,
	 ConfigSliceList : 125,
	 ConfigSliceOp : 126,

	// Remember to keep in sync with schema/tagnames.csvsdict
	 CCNProtocolDataUnit : 17702112,
	 CCNPROTOCOL_DATA_UNIT : "CCNProtocolDataUnit"
};

exports.CCNProtocolDTags = CCNProtocolDTags;

var CCNProtocolDTagsStrings = [
    null, null, null, null, null, null, null, null, null, null, null, null, null,
    "Any", "Name", "Component", "Certificate", "Collection", "CompleteName",
    "Content", "SignedInfo", "ContentDigest", "ContentHash", null, "Count", "Header",
    "Interest", "Key", "KeyLocator", "KeyName", "Length", "Link", "LinkAuthenticator",
    "NameComponentCount", null, null, "RootDigest", "Signature", "Start", "Timestamp", "Type",
    "Nonce", "Scope", "Exclude", "Bloom", "BloomSeed", null, "AnswerOriginKind",
    "InterestLifetime", null, null, null, null, "Witness", "SignatureBits", "DigestAlgorithm", "BlockSize",
    null, "FreshnessSeconds", "FinalBlockID", "PublisherPublicKeyDigest", "PublisherCertificateDigest",
    "PublisherIssuerKeyDigest", "PublisherIssuerCertificateDigest", "ContentObject",
    "WrappedKey", "WrappingKeyIdentifier", "WrapAlgorithm", "KeyAlgorithm", "Label",
    "EncryptedKey", "EncryptedNonceKey", "WrappingKeyName", "Action", "FaceID", "IPProto",
    "Host", "Port", "MulticastInterface", "ForwardingFlags", "FaceInstance",
    "ForwardingEntry", "MulticastTTL", "MinSuffixComponents", "MaxSuffixComponents", "ChildSelector",
    "RepositoryInfo", "Version", "RepositoryVersion", "GlobalPrefix", "LocalName",
    "Policy", "Namespace", "GlobalPrefixName", "PolicyVersion", "KeyValueSet", "KeyValuePair",
    "IntegerValue", "DecimalValue", "StringValue", "BinaryValue", "NameValue", "Entry",
    "ACL", "ParameterizedName", "Prefix", "Suffix", "Root", "ProfileName", "Parameters", "InfoString", null,
    "StatusResponse", "StatusCode", "StatusText", "SyncNode", "SyncNodeKind", "SyncNodeElement",
    "SyncVersion", "SyncNodeElements", "SyncContentHash", "SyncLeafCount", "SyncTreeDepth", "SyncByteCount",
    "ConfigSlice", "ConfigSliceList", "ConfigSliceOp" ];

exports.CCNProtocolDTagsStrings = CCNProtocolDTagsStrings;
/**
 * @author: Wentao Shang
 * See COPYING for copyright and distribution information.
 * This class represents CCNTime Objects
 */

/**
 * Ported to node.js by Wentao Shang
 */
var DataUtils = require('./DataUtils.js').DataUtils;

/**
 * Create CCNTime object. If input is null, set input to current JavaScript time
 */
var CCNTime = function CCNTime(input) {
    if (input == null) {
	var d = new Date()
	input = d.getTime();
    } else if (typeof input != 'number')
	throw new NONError('CCNTimeError', 'invalid input type ' + (typeof input));
    
    this.msec = input;  // in milliseconds
    this.binary = DataUtils.unsignedIntToBigEndian((input / 1000) * 4096);
};


CCNTime.prototype.encodeToBinary = function() {
    return this.binary;
};


CCNTime.prototype.getJavascriptDate = function () {
    var d = new Date();
    d.setTime( this.msec );
    return d
};

exports.CCNTime = CCNTime;
/**
 * This class contains utilities to help parse the data
 * author: Meki Cheraoui, Jeff Thompson
 * See COPYING for copyright and distribution information.
 */

/**
 * Ported to node.js by Wentao Shang
 */


var DataUtils = function DataUtils () {};

exports.DataUtils = DataUtils;

/*
 * arrays is an array of Buffers. Return a new Buffer which is the concatenation of all.
 */
DataUtils.concatArrays = function (arrays) {
    return Buffer.concat(arrays);
}

/**
 * Return true if a1 and a2 are the same length with equal elements.
 */
DataUtils.arraysEqual = function (a1, a2) {
    if (a1.length != a2.length)
        return false;
    
    for (var i = 0; i < a1.length; ++i) {
        if (a1[i] != a2[i])
            return false;
    }

    return true;
};

/*
 * Convert the big endian Buffer to an unsigned int.
 */
DataUtils.bigEndianToUnsignedInt = function (/*Buffer*/ bytes) {
    return parseInt(bytes.toString('hex'), 16);
};

/*
 * Convert the int value to a new big endian Buffer and return.
 * Throw Error ff value is negative. 
 */
DataUtils.unsignedIntToBigEndian = function (value) {
    if (value < 0)
        throw new NoNError('DataUtilsError', 'require unsigned int but get negative value: ' + value);

    var hex = Math.round(value).toString(16);
    if (hex.length % 2 == 1)
	hex = '0' + hex;
    
    return new Buffer(hex, 'hex');
};

DataUtils.toHex = function (buf) { return buf.toString('hex'); };
DataUtils.toString = function (buf) { return buf.toString(); };
DataUtils.toNumbers = function (str) { return new Buffer(str, 'hex'); };
DataUtils.toNumbersFromString = function (str) { return new Buffer(str); };
/**
 * @author: Meki Cheraoui, Jeff Thompson
 * See COPYING for copyright and distribution information.
 * This class represents a Name as an array of components where each is a byte array.
 */

/**
 * Ported to node.js by Wentao Shang
 */
var BinaryXMLEncoder = require('./util/BinaryXMLEncoder.js').BinaryXMLEncoder;
var BinaryXMLDecoder = require('./util/BinaryXMLDecoder.js').BinaryXMLDecoder;
var CCNProtocolDTags = require('./util/CCNProtocolDTags.js').CCNProtocolDTags;
var DataUtils = require('./util/DataUtils.js').DataUtils;

var LOG = 0;
 
/**
 * Create a new Name from _components.
 * If _components is a string, parse it as a URI.  Otherwise it is an array of components
 * where each is a string, byte array, ArrayBuffer or Uint8Array. 
 * Convert and store as an array of Uint8Array.
 * If a component is a string, encode as utf8.
 */
var Name = function Name(_components) {
    if (_components == null)
	this.components = [];
    else if (typeof _components == 'string') {
	this.components = Name.createComponentArray(_components);
    } else if (typeof _components == 'object') {
	this.components = [];
        if (_components instanceof Name)
            this.add(_components);
        else {
            for (var i = 0; i < _components.length; i++)
                this.add(_components[i]);
        }
    }
};

exports.Name = Name;

/**
 * Get the number of components in the Name object
 */
Name.prototype.size = function () {
    return this.components.length;
};

/**
 * Add a component at the end of the Name.
 * 'component' is a string, Array, Buffer or Name.
 * Convert to Buffer and add to this Name.
 * If a component is a string, encode as utf8.
 * Return 'this' Name object to allow chaining calls to add.
 */
Name.prototype.add = function (component) {
    if (component == null)
	return this;

    var result;
    if(typeof component == 'string')
        result = Name.stringComponentToBuffer(component);
    else if(typeof component == 'object' && component instanceof Buffer)
        result = component;
    else if (typeof component == 'object' && component instanceof Name) {
        var components;
        if (component == this)
            // special case, when we need to create a copy
            components = this.components.slice(0, this.components.length);
        else
            components = component.components;
        
        for (var i = 0; i < components.length; ++i)
            this.components.push(new Buffer(components[i]));

        return this;
    } else 
	throw new Error("Cannot add Name element at index " + this.components.length + ": Invalid type");
    
    this.components.push(result);
    return this;
};

// Alias for Name.add()
Name.prototype.append = function (component) {
    return this.add(component);
};

Name.prototype.appendVersion = function () {
    var d = new Date();
    var time = d.getTime().toString(16);

    if (time.length % 2 == 1)
	time = '0' + time;

    time = 'fd' + time;
    var binTime = new Buffer(time, 'hex');
    return this.add(binTime);
};

Name.prototype.appendSegment = function (seg) {
    if (seg == null || seg == 0)
	return this.add(new Buffer('00', 'hex'));

    var segStr = seg.toString(16);

    if (segStr.length % 2 == 1)
	segStr = '0' + segStr;

    segStr = '00' + segStr;
    return this.add(new Buffer(segStr, 'hex'));
};

Name.prototype.appendKeyID = function (/*Key*/ key) {
    var cmd = 'c12e4d2e4b00';  // '%C1.M.K%00'
    var digest = key.publicKeyDigest.toString('hex');
    var keyID = cmd + digest;
    return this.add(new Buffer(keyID, 'hex'));
};


// Convert URI string to Buffer. Handles special characters such as '%00'
// new Buffer(component, 'ascii') will encode '%00' as 0x20 (space)
// new Buffer(component, 'utf8') will encode '%C1' as a two-byte unicode character
// Both won't help in this case
Name.stringComponentToBuffer = function (component) {
    var buf = new Buffer(component.length);  // at least this length
    var pos = 0;  // # of bytes encoded into the Buffer
    var i = 0;
    while (i < component.length) {
	if (component[i] == '%') {
	    var hex = component.substr(i+1, 2);
	    buf[pos] = parseInt(hex, 16);
	    i += 2;
	} else
	    buf[pos] = component.charCodeAt(i);

	i++;
	pos++;
    }
    return buf.slice(0, pos);
};

/**
 * Parse name as a URI string and return an array of Buffer components.
 */
Name.createComponentArray = function (name) {
    name = name.trim();
    if (name.length <= 0)
        return [];

    var iColon = name.indexOf(':');
    if (iColon >= 0) {
        // Make sure the colon came before a '/'.
        var iFirstSlash = name.indexOf('/');
        if (iFirstSlash < 0 || iColon < iFirstSlash)
            // Omit the leading protocol such as ndn:
            name = name.substr(iColon + 1, name.length - iColon - 1).trim();
    }
    
    if (name[0] == '/') {
        if (name.length >= 2 && name[1] == '/') {
            // Strip the authority following "//".
            var iAfterAuthority = name.indexOf('/', 2);
            if (iAfterAuthority < 0)
                // Unusual case: there was only an authority.
                return [];
            else
                name = name.substr(iAfterAuthority + 1, name.length - iAfterAuthority - 1).trim();
        }
        else
            name = name.substr(1, name.length - 1).trim();
    }

    var array = name.split('/');
    
    for (var i = 0; i < array.length; ++i) {
        var component = array[i].trim();
        
        if (component.match(/[^.]/) == null) {
            // Special case for component of only periods.  
            if (component.length <= 2) {
                // Zero, one or two periods is illegal.  Ignore this componenent to be
                //   consistent with the C implmentation.
                // This also gets rid of a trailing '/'.
                array.splice(i, 1);
                --i;  
                continue;
            }
            else
                // Remove 3 periods.
                array[i] = component.substr(3, component.length - 3);
        }
        else
            array[i] = component;
        
        // Change the component to Buffer now.
        array[i] = Name.stringComponentToBuffer(array[i]);
    }

    return array;
};


Name.prototype.from_ccnb = function(/*XMLDecoder*/ decoder) {
    if (LOG>4) console.log('--------Start decoding Name...');

    decoder.readStartElement(this.getElementLabel());
		
    this.components = new Array();

    while (decoder.peekStartElement(CCNProtocolDTags.Component)) {
	this.add(decoder.readBinaryElement(CCNProtocolDTags.Component));
    }
		
    decoder.readEndElement();

    if (LOG>4) console.log('--------Finish decoding Name.');
};

Name.prototype.to_ccnb = function(/*XMLEncoder*/ encoder) {
    if (LOG>4) console.log('--------Encoding Name...');

    if (this.components == null)
	throw new Error('Cannot encode empty content name.');

    encoder.writeStartElement(this.getElementLabel());
    var count = this.components.length;
    for (var i = 0; i < count; i++) {
	encoder.writeElement(CCNProtocolDTags.Component, this.components[i]);
    }
    encoder.writeEndElement();

    if (LOG>4) console.log('--------Finish encoding Name.');
};

Name.prototype.encodeToBinary = function () {
    var enc = new BinaryXMLEncoder();
    this.to_ccnb(enc);
    return enc.getReducedOstream();
};

/**
 * Static method to parse a Buffer containing ccnb-formated Name bytes.
 * Return a parsed Name object.
 */
Name.parse = function (buf) {
    var dec = new BinaryXMLDecoder(buf);
    var name = new Name();
    name.from_ccnb(dec);
    return name;
};

Name.prototype.getElementLabel = function(){
    return CCNProtocolDTags.Name;
};


/**
 * Return component as an escaped string according to "CCNx URI Scheme".
 * We can't use encodeURIComponent because that doesn't encode all the characters we want to.
 */
Name.toEscapedString = function(component) {
    var result = "";
    var gotNonDot = false;
    for (var i = 0; i < component.length; ++i) {
        if (component[i] != 0x2e) {
            gotNonDot = true;
            break;
        }
    }
    if (!gotNonDot) {
        // Special case for component of zero or more periods.  Add 3 periods.
        result = "...";
        for (var i = 0; i < component.length; ++i)
            result += ".";
    }
    else {
        for (var i = 0; i < component.length; ++i) {
            var value = component[i];
            // Check for 0-9, A-Z, a-z, (+), (-), (.), (_)
            if (value >= 0x30 && value <= 0x39 || value >= 0x41 && value <= 0x5a ||
                value >= 0x61 && value <= 0x7a || value == 0x2b || value == 0x2d || 
                value == 0x2e || value == 0x5f)
                result += String.fromCharCode(value);
            else
                result += "%" + (value < 16 ? "0" : "") + value.toString(16).toUpperCase();
        }
    }
    return result;
};

// Return the escaped name string according to "CCNx URI Scheme".
Name.prototype.to_uri = function () {
    if (this.components.length == 0)
        return "/";
    
    var result = "";
	
    for(var i = 0; i < this.components.length; ++i)
	result += "/"+ Name.toEscapedString(this.components[i]);
    
    return result;
};


Name.is_text_encodable = function (/*Buffer*/ blob) {
    if (blob.length == 0) return false;

    for (var i = 0; i < blob.length; i++) {
	var c = blob[i];
	if (c < 0x20 || c > 0x7E) return false;
	if (c == 0x3C || c == 0x3E || c == 0x26) return false;
    }
    return true;
};

/**
 * Return a string of XML representation of the Name object
 * encoding can be 'hex' or 'base64'. if null, will use 'hex' by default
 */
Name.prototype.to_xml = function (encoding) {
    var xml = '<Name>';

    if (encoding == null)
	encoding = 'hex';

    for(var i = 0; i < this.components.length; i++) {
	var blob = this.components[i];
	if (Name.is_text_encodable(blob))
	    xml += '<Component ccnbencoding="text">' + blob.toString() + '</Component>';
	else 
	    xml += '<Component ccnbencoding="' + encoding + 'Binary">' + blob.toString(encoding).toUpperCase() + '</Component>';
    }
    xml += '</Name>';
    return xml;
};

/**
 * Return a new Name with the first nComponents components of this Name.
 */
Name.prototype.getPrefix = function (nComponents) {
    return new Name(this.components.slice(0, nComponents));
};

/**
 * Return a new Name with the suffix starting at the p-th component of this Name.
 */
Name.prototype.getSuffix = function (p) {
    return new Name(this.components.slice(p));
};

/**
 * Return a new Buffer of the component at i.
 */
Name.prototype.getComponent = function (i) {
    var result = new Buffer(this.components[i].length);
    this.components[i].copy(result);
    return result;
};


/**
 * Return true if this Name has the same components as name.
 */
Name.prototype.equals = function(name) {
    if (this.components.length != name.components.length)
        return false;
    
    // Start from the last component because they are more likely to differ.
    for (var i = this.components.length - 1; i >= 0; --i) {
        if (!DataUtils.arraysEqual(this.components[i], name.components[i]))
            return false;
    }
    
    return true;
};


/**
 * Returns true if 'this' is a prefix of 'name'
 */
Name.prototype.matches = function (name) {
    var i_name = this.components;
    var o_name = name.components;

    // The intrest name is longer than the name we are checking it against.
    if (i_name.length > o_name.length)
	return false;

    // Check if at least one of given components doesn't match.
    for (var i = 0; i < i_name.length; ++i) {
        if (!DataUtils.arraysEqual(i_name[i], o_name[i]))
            return false;
    }

    return true;
};

/**
 * Alias for Name.prototype.matches()
 * This function name is less confusing.
 */
Name.prototype.isPrefixOf = function (name) {
    return this.matches(name);
};


/**
 * Compare two name components according to CCNx canonical ordering rule
 * If comp1 < comp2, return -1
 * If comp1 = comp2, return 0
 * If comp1 > comp2, return 1
 * components can be either string or Buffer objects
 */
Name.compareComponents = function (comp1, comp2) {
    if (typeof comp1 == 'string')
	comp1 = Name.stringComponentToBuffer(comp1);

    if (typeof comp2 == 'string')
	comp2 = Name.stringComponentToBuffer(comp2);

    if (!(comp1 instanceof Buffer) || !(comp2 instanceof Buffer))
	throw new Error('Cannot compare Name components of unsupported type.');

    if (comp1.length < comp2.length)
        return -1;
    if (comp1.length > comp2.length)
        return 1;
    
    for (var i = 0; i < comp1.length; ++i) {
        if (comp1[i] < comp2[i])
            return -1;
        if (comp1[i] > comp2[i])
            return 1;
    }

    return 0;
};
/**
 * @author: Meki Cheraoui
 * See COPYING for copyright and distribution information.
 * This class represents ContentObject Objects
 */

/**
 * Ported to node.js by Wentao Shang
 */
var Name = require('./Name.js').Name;
var BinaryXMLEncoder = require('./util/BinaryXMLEncoder.js').BinaryXMLEncoder;
var BinaryXMLDecoder = require('./util/BinaryXMLDecoder.js').BinaryXMLDecoder;
var CCNProtocolDTags = require('./util/CCNProtocolDTags.js').CCNProtocolDTags;
var CCNTime = require('./util/CCNTime.js').CCNTime;
var KeyLocator = require('./Key.js').KeyLocator;
var KeyLocatorType = require('./Key.js').KeyLocatorType;
var PublisherPublicKeyDigest = require('./PublisherPublicKeyDigest.js').PublisherPublicKeyDigest;

var LOG = 0;

/**
 * When creating ContentObject in JS code, _name and _content must be specified while _signedinfo is optional.
 */
var ContentObject = function ContentObject(_name, _content, _signedInfo) {	
    if (_name == null) {
	this.name = null;
    } else if (typeof _name == 'string') {
	this.name = new Name(_name);
    } else if (_name instanceof Name) {
	this.name = _name;
    } else
	throw new Error('Cannot construct ContentObject due to unknown name type.');
    
    if (_content == null) {
	this.content = null;
    } else if (typeof _content == 'string') {
	this.content = new Buffer(_content);
    } else if (_content instanceof Buffer) {
	this.content = _content;
    } else
	throw new Error('Cannot construct ContentObject due to unknown content type.');
    
    this.signedInfo = _signedInfo;  // may be null

    this.signature = null;

    this.startSIG = null;
    this.endSIG = null;
    this.signedData = null;
};

exports.ContentObject = ContentObject;

/**
 * The 'key' parameter is a mandatory Key object
 * The optional 'param' is a JSON object that may contain the following fields:
 * { keyName: the name of the 'key'; if this field is present, the KeyLocator of this ContentObject will be filled with KeyName rather than Key bits
 *   contentType: the type of the ContentObject; if this filed is null, the default ContentType.DATA is used
 *   freshness: a number in seconds
 *   finalBlockID: a integer indicating the segment number of the final block
 * }
 * This 'param' is a high-level interface to set SignedInfo fields through ContentObject methods
 */
ContentObject.prototype.sign = function (key, param) {
    if (key == null || key.privateKeyPem == null) {
	throw new Error('Cannot sign ContentObject without a private key.');
    }

    // Set SignedInfo if it's empty
    if (this.signedInfo == null) {
	this.signedInfo = new SignedInfo();
	this.signedInfo.setFields(key, param);
    }

    var n1 = this.encodeObject(this.name);
    var n2 = this.encodeObject(this.signedInfo);
    var n3 = this.encodeContent();

    var rsa = require("crypto").createSign('RSA-SHA256');
    rsa.update(n1);
    rsa.update(n2);
    rsa.update(n3);
    
    var sig = new Buffer(rsa.sign(key.privateKeyPem));

    this.signature = new Signature();
    this.signature.signature = sig;
};

ContentObject.prototype.verify = function (/*Key*/ key) {
    if (key == null || key.publicKeyPem == null) {
	throw new Error('Cannot verify ContentObject without a public key.');
    }

    var verifier = require('crypto').createVerify('RSA-SHA256');
    verifier.update(this.signedData);
    return verifier.verify(key.publicKeyPem, this.signature.signature);
};

ContentObject.prototype.encodeObject = function encodeObject(obj) {
    var enc = new BinaryXMLEncoder(); 
    obj.to_ccnb(enc);
    return enc.getReducedOstream();
};

ContentObject.prototype.encodeContent = function encodeContent(obj) {
    var enc = new BinaryXMLEncoder();
    enc.writeElement(CCNProtocolDTags.Content, this.content);
    return enc.getReducedOstream();	
};

ContentObject.prototype.saveSignedData = function (bytes) {
    var sig = bytes.slice(this.startSIG, this.endSIG);
    this.signedData = sig;
};

ContentObject.prototype.from_ccnb = function (decoder) {
    if (LOG > 4) console.log('--------Start decoding ContentObject...');

    decoder.readStartElement(this.getElementLabel());

    if (decoder.peekStartElement(CCNProtocolDTags.Signature)) {
	this.signature = new Signature();
	this.signature.from_ccnb(decoder);
    }

    this.startSIG = decoder.offset;

    this.name = new Name();
    this.name.from_ccnb(decoder);
    
    if (decoder.peekStartElement(CCNProtocolDTags.SignedInfo)) {
	this.signedInfo = new SignedInfo();
	this.signedInfo.from_ccnb(decoder);
    }
    
    this.content = decoder.readBinaryElement(CCNProtocolDTags.Content);

    this.endSIG = decoder.offset;
    	
    decoder.readEndElement();
    
    this.saveSignedData(decoder.istream);

    if (LOG > 4) console.log('--------Finish decoding ContentObject.');
};

ContentObject.prototype.to_ccnb = function (encoder) {
    if (LOG > 4) console.log('--------Encoding ContentObject...');

    encoder.writeStartElement(this.getElementLabel());

    if (null != this.signature)
	this.signature.to_ccnb(encoder);
    
    this.startSIG = encoder.offset;
    
    if (null != this.name)
	this.name.to_ccnb(encoder);
    
    if (null != this.signedInfo)
	this.signedInfo.to_ccnb(encoder);

    encoder.writeElement(CCNProtocolDTags.Content, this.content);

    this.endSIG = encoder.offset;
    
    encoder.writeEndElement();
    
    //this.saveSignedData(encoder.ostream);

    if (LOG > 4) console.log('--------Finish encoding ContentObject');
};

/**
 * encoding can be 'hex' or 'base64'; if null, will use 'hex' by default
 */
ContentObject.prototype.to_xml = function (encoding) {
    var xml = '<ContentObject>';

    if (encoding == null)
	encoding = 'hex';  // default choice

    if (null != this.signature)
	xml += this.signature.to_xml(encoding);
    
    if (null != this.name)
	xml += this.name.to_xml(encoding);
    
    if (null != this.signedInfo)
	xml += this.signedInfo.to_xml(encoding);

    if (null != this.content)
	xml += '<Content ccnbencoding="' + encoding + 'Binary">' + this.content.toString(encoding).toUpperCase() + '</Content>';
    else 
	xml += '<Content/>'

    xml += '</ContentObject>';
    return xml;
};


ContentObject.prototype.encodeToBinary = function () {
    var enc = new BinaryXMLEncoder();
    this.to_ccnb(enc);
    return enc.getReducedOstream();
};

/**
 * Static method to parse a Buffer containing ccnb-formated ContentObject bytes.
 * Return a parsed ContentObject object.
 */
ContentObject.parse = function (buf) {
    var dec = new BinaryXMLDecoder(buf);
    var co = new ContentObject();
    co.from_ccnb(dec);
    return co;
};

ContentObject.prototype.getElementLabel = function () { return CCNProtocolDTags.ContentObject; };

/**
 * Signature
 */
var Signature = function Signature(_witness, _signature, _digestAlgorithm) {
    this.Witness = _witness;//byte [] _witness;
    this.signature = _signature;//byte [] _signature;
    this.digestAlgorithm = _digestAlgorithm//String _digestAlgorithm;
};

exports.Signature = Signature;

Signature.prototype.from_ccnb = function (decoder) {
    if(LOG>4) console.log('--------Start decoding Signature...');

    decoder.readStartElement(this.getElementLabel());	
		
    if (decoder.peekStartElement(CCNProtocolDTags.DigestAlgorithm)) {
	if(LOG>4)console.log('DIGIEST ALGORITHM FOUND');
	this.digestAlgorithm = decoder.readUTF8Element(CCNProtocolDTags.DigestAlgorithm); 
    }
    if (decoder.peekStartElement(CCNProtocolDTags.Witness)) {
	if(LOG>4)console.log('WITNESS FOUND');
	this.Witness = decoder.readBinaryElement(CCNProtocolDTags.Witness); 
    }
		
    //FORCE TO READ A SIGNATURE

    if(LOG>4)console.log('SIGNATURE FOUND');
    this.signature = decoder.readBinaryElement(CCNProtocolDTags.SignatureBits);

    decoder.readEndElement();

    if(LOG>4) console.log('--------Finish decoding Signature.');
};


Signature.prototype.to_ccnb = function (encoder) {
    if (LOG > 4) console.log('--------Encoding Signature...');

    if (!this.validate()) {
	throw new Error("Cannot encode: field values missing.");
    }
	
    encoder.writeStartElement(this.getElementLabel());

    if ((null != this.digestAlgorithm) && (!this.digestAlgorithm.equals(CCNDigestHelper.DEFAULT_DIGEST_ALGORITHM))) {
	encoder.writeElement(CCNProtocolDTags.DigestAlgorithm, OIDLookup.getDigestOID(this.DigestAlgorithm));
    }
	
    if (null != this.Witness) {
	// needs to handle null witness
	encoder.writeElement(CCNProtocolDTags.Witness, this.Witness);
    }

    encoder.writeElement(CCNProtocolDTags.SignatureBits, this.signature);

    encoder.writeEndElement();

    if (LOG > 4) console.log('--------Finish encoding Signature.');
};

/**
 * encoding can be 'hex' or 'base64'; if null, will use 'hex' by default
 */
Signature.prototype.to_xml = function (encoding) {
    var xml = '<Signature>';
    if (encoding == null)
	encoding = 'hex';
    // Currently we only encode signature bits
    if (this.signature != null)
	xml += '<SignatureBits ccnbencoding="' + encoding + 'Binary">' + this.signature.toString(encoding).toUpperCase() + '</SignatureBits>';
    xml += '</Signature>';
    return xml;
};

Signature.prototype.getElementLabel = function() { return CCNProtocolDTags.Signature; };

Signature.prototype.validate = function() {
    return null != this.signature;
};


/**
 * SignedInfo
 */

// ContentType blob represented as base64 string
var ContentType = {DATA:'DATA', ENCR:'ENCR', GONE:'GONE', KEY:'KEY/', LINK:'LINK', NACK:'NACK'};

exports.ContentType = ContentType;

var SignedInfo = function SignedInfo(_publisher, _timestamp, _type, _locator, _freshnessSeconds, _finalBlockID) {
    this.publisher = _publisher; //publisherPublicKeyDigest
    this.timestamp = _timestamp; // CCN Time
    this.type = _type; // ContentType
    this.locator = _locator; //KeyLocator
    this.freshnessSeconds = _freshnessSeconds; // Integer
    this.finalBlockID = _finalBlockID; //byte array
};

exports.SignedInfo = SignedInfo;

/**
 * Initialize SignedInfo with a Key and a Signing Paramter object
 * 
 * The mandatory 'key' paramter is the signing Key object
 * The optional 'param' is a JSON object that may contain the following fields:
 * { keyName: the name of the 'key'; if this field is present, the KeyLocator of this ContentObject will be filled with KeyName rather than Key bits
 *   contentType: the type of the ContentObject; if this filed is null, the default ContentType.DATA is used
 *   freshness: a number in seconds
 *   finalBlockID: a integer indicating the segment number of the final block
 * }
 */
SignedInfo.prototype.setFields = function (key, param) {
    if (key == null)
	throw new Error('Cannot set SignedInfo without key info.');

    this.publisher = new PublisherPublicKeyDigest(key.getKeyID());
    
    this.timestamp = new CCNTime();

    if (param == null) {
	this.type = ContentType.DATA;
	this.locator = new KeyLocator(key, KeyLocatorType.KEY);
    } else {
	if (param.contentType == null)
	    this.type = ContentType.DATA;  // default
	else
	    this.type = param.contentType;

	if (param.keyName == null)
	    this.locator = new KeyLocator(key, KeyLocatorType.KEY);
	else 
	    this.locator = new KeyLocator(param.keyName, KeyLocatorType.KEYNAME);

	this.freshnessSeconds = param.freshness;  // may be null
	this.finalBlockID = param.finalBlockID;   // may be null
    }
};

SignedInfo.prototype.from_ccnb = function (decoder) {
    if (LOG > 4) console.log('--------Start decoding SignedInfo...');

    decoder.readStartElement( this.getElementLabel() );
		
    if (decoder.peekStartElement(CCNProtocolDTags.PublisherPublicKeyDigest)) {
	if(LOG>4)console.log('DECODING PUBLISHER KEY');
	this.publisher = new PublisherPublicKeyDigest();
	this.publisher.from_ccnb(decoder);
    }

    if (decoder.peekStartElement(CCNProtocolDTags.Timestamp)) {
	if(LOG>4)console.log('DECODING TIMESTAMP');
	this.timestamp = decoder.readDateTime(CCNProtocolDTags.Timestamp);
    }

    if (decoder.peekStartElement(CCNProtocolDTags.Type)) {
	binType = decoder.readBinaryElement(CCNProtocolDTags.Type);

	this.type = binType.toString('base64');

	if(LOG>4)console.log('ContentType in SignedInfo is '+ this.type);
    } else {
	this.type = ContentType.DATA; // default
    }
    
    if (decoder.peekStartElement(CCNProtocolDTags.FreshnessSeconds)) {
	this.freshnessSeconds = decoder.readIntegerElement(CCNProtocolDTags.FreshnessSeconds);
	if(LOG>4)console.log('FRESHNESS IN SECONDS IS '+ this.freshnessSeconds);
    }
		
    if (decoder.peekStartElement(CCNProtocolDTags.FinalBlockID)) {
	if(LOG>4)console.log('DECODING FINAL BLOCKID');
	this.finalBlockID = decoder.readBinaryElement(CCNProtocolDTags.FinalBlockID);
    }
    
    if (decoder.peekStartElement(CCNProtocolDTags.KeyLocator)) {
	if(LOG>4)console.log('DECODING KEY LOCATOR');
	this.locator = new KeyLocator();
	this.locator.from_ccnb(decoder);
    }
    
    decoder.readEndElement();

    if (LOG > 4) console.log('--------Finish decoding SignedInfo.');
};

SignedInfo.prototype.to_ccnb = function (encoder) {
    if (LOG > 4) console.log('--------Encoding SignedInfo...');

    if (!this.validate()) {
	throw new Error('Cannot encode SignedInfo: field values missing.');
    }
    
    encoder.writeStartElement(this.getElementLabel());
    	
    if (null != this.publisher) {
	this.publisher.to_ccnb(encoder);
    }
    
    if (null != this.timestamp) {
	encoder.writeDateTime(CCNProtocolDTags.Timestamp, this.timestamp);
    }

    if (null != this.type && this.type != ContentType.DATA) {
	encoder.writeElement(CCNProtocolDTags.Type, new Buffer(this.type, 'base64'));
    }

    if (null != this.freshnessSeconds) {
	encoder.writeElement(CCNProtocolDTags.FreshnessSeconds, this.freshnessSeconds);
    }

    if (null != this.finalBlockID) {
	encoder.writeElement(CCNProtocolDTags.FinalBlockID, this.finalBlockID);
    }

    if (null != this.locator) {
	this.locator.to_ccnb(encoder);
    }

    encoder.writeEndElement();

    if (LOG > 4) console.log('--------Finish encoding SignedInfo.');
};

/**
 * encoding can be 'hex' or 'base64'; if null, will use 'hex' by default
 */
SignedInfo.prototype.to_xml = function (encoding) {
    var xml = '<SignedInfo>';

    if (encoding == null)
	encoding = 'hex';

    if (null != this.publisher)
	xml += this.publisher.to_xml(encoding);

    if (null != this.timestamp)
	xml += '<Timestamp ccnbencoding="' + encoding + 'Binary">' 
	    + this.timestamp.encodeToBinary().toString(encoding).toUpperCase()
	    + '</Timestamp>';

    if (null != this.type && this.type != ContentType.DATA)
	// Use base64 encoding for ContentType regardless of 'encoding' parameter
	xml += '<Type ccnbencoding="base64Binary"' + this.type + '</Type>';
    
    if (null != this.freshnessSeconds)
	xml += '<FreshnessSeconds>' + this.freshnessSeconds + '</FreshnessSeconds>';

    if (null != this.finalBlockID)
	xml += '<FinalBlockID ccnbencoding="' + encoding + 'Binary">' + this.finalBlockID.toString(encoding).toUpperCase() + '</FinalBlockID>';

    if (null != this.locator)
	xml += this.locator.to_xml(encoding);

    xml += '</SignedInfo>';
    return xml;
};

SignedInfo.prototype.getElementLabel = function () { 
    return CCNProtocolDTags.SignedInfo;
};


SignedInfo.prototype.validate = function () {
    // We don't do partial matches any more, even though encoder/decoder
    // is still pretty generous.
    if (null == this.publisher || null == this.timestamp || null == this.locator)
	return false;
    else
	return true;
};
/**
 * @author: Meki Cheraoui, Jeff Thompson
 * See COPYING for copyright and distribution information.
 * This class represents Interest Objects
 */

/**
 * Ported to node.js by Wentao Shang
 */
var Name = require('./Name.js').Name;
var BinaryXMLEncoder = require('./util/BinaryXMLEncoder.js').BinaryXMLEncoder;
var CCNProtocolDTags = require('./util/CCNProtocolDTags.js').CCNProtocolDTags;
var PublisherPublicKeyDigest = require('./PublisherPublicKeyDigest.js').PublisherPublicKeyDigest;
var DataUtils = require('./util/DataUtils.js').DataUtils;

var LOG = 0;

// _interestLifetime is in milliseconds.
var Interest = function Interest
   (_name, _faceInstance, _minSuffixComponents, _maxSuffixComponents, _publisherPublicKeyDigest, _exclude, 
    _childSelector, _answerOriginKind, _scope, _interestLifetime, _nonce) {		
    this.name = _name;
    this.faceInstance = _faceInstance;
    this.maxSuffixComponents = _maxSuffixComponents;
    this.minSuffixComponents = _minSuffixComponents;
	
    this.publisherPublicKeyDigest = _publisherPublicKeyDigest;
    this.exclude = _exclude;
    this.childSelector = _childSelector;
    this.answerOriginKind = _answerOriginKind;
    this.scope = _scope;
    this.interestLifetime = _interestLifetime;  // milli seconds
    this.nonce = _nonce;
};

exports.Interest = Interest;

Interest.RECURSIVE_POSTFIX = "*";

Interest.CHILD_SELECTOR_LEFT = 0;
Interest.CHILD_SELECTOR_RIGHT = 1;

Interest.ANSWER_NO_CONTENT_STORE = 0;
Interest.ANSWER_CONTENT_STORE = 1;
Interest.ANSWER_GENERATED = 2;
Interest.ANSWER_STALE = 4;		// Stale answer OK
Interest.MARK_STALE = 16;		// Must have scope 0.  Michael calls this a "hack"

Interest.DEFAULT_ANSWER_ORIGIN_KIND = Interest.ANSWER_CONTENT_STORE | Interest.ANSWER_GENERATED;


Interest.prototype.from_ccnb = function (/*XMLDecoder*/ decoder) {
    if (LOG>4) console.log('--------Start decoding Interest...');
    decoder.readStartElement(CCNProtocolDTags.Interest);

    this.name = new Name();
    this.name.from_ccnb(decoder);

    if (decoder.peekStartElement(CCNProtocolDTags.MinSuffixComponents))
	this.minSuffixComponents = decoder.readIntegerElement(CCNProtocolDTags.MinSuffixComponents);

    if (decoder.peekStartElement(CCNProtocolDTags.MaxSuffixComponents)) 
	this.maxSuffixComponents = decoder.readIntegerElement(CCNProtocolDTags.MaxSuffixComponents);
			
    if (decoder.peekStartElement(CCNProtocolDTags.PublisherPublicKeyDigest)) {
	this.publisherPublicKeyDigest = new PublisherPublicKeyDigest();
	this.publisherPublicKeyDigest.from_ccnb(decoder);
    }

    if (decoder.peekStartElement(CCNProtocolDTags.Exclude)) {
	this.exclude = new Exclude();
	this.exclude.from_ccnb(decoder);
    }
		
    if (decoder.peekStartElement(CCNProtocolDTags.ChildSelector))
	this.childSelector = decoder.readIntegerElement(CCNProtocolDTags.ChildSelector);
		
    if (decoder.peekStartElement(CCNProtocolDTags.AnswerOriginKind))
	this.answerOriginKind = decoder.readIntegerElement(CCNProtocolDTags.AnswerOriginKind);
		
    if (decoder.peekStartElement(CCNProtocolDTags.Scope))
	this.scope = decoder.readIntegerElement(CCNProtocolDTags.Scope);

    if (decoder.peekStartElement(CCNProtocolDTags.InterestLifetime))
	this.interestLifetime = 1000.0 * DataUtils.bigEndianToUnsignedInt
	    (decoder.readBinaryElement(CCNProtocolDTags.InterestLifetime)) / 4096;
		
    if (decoder.peekStartElement(CCNProtocolDTags.Nonce))
	this.nonce = decoder.readBinaryElement(CCNProtocolDTags.Nonce);
		
    decoder.readEndElement();

    if (LOG>4) console.log('--------Finish decoding Interest.');
};

Interest.prototype.to_ccnb = function (/*XMLEncoder*/ encoder) {
    if (LOG>4) console.log('--------Encoding Interest....');
    
    encoder.writeStartElement(CCNProtocolDTags.Interest);
    
    if (null != this.name)
	this.name.to_ccnb(encoder);
    
    if (null != this.minSuffixComponents) 
	encoder.writeElement(CCNProtocolDTags.MinSuffixComponents, this.minSuffixComponents);	
    
    if (null != this.maxSuffixComponents) 
	encoder.writeElement(CCNProtocolDTags.MaxSuffixComponents, this.maxSuffixComponents);
    
    if (null != this.publisherPublicKeyDigest)
	this.publisherPublicKeyDigest.to_ccnb(encoder);
    
    if (null != this.exclude)
	this.exclude.to_ccnb(encoder);
    
    if (null != this.childSelector) 
	encoder.writeElement(CCNProtocolDTags.ChildSelector, this.childSelector);
    
    if (this.DEFAULT_ANSWER_ORIGIN_KIND != this.answerOriginKind && this.answerOriginKind!=null) 
	encoder.writeElement(CCNProtocolDTags.AnswerOriginKind, this.answerOriginKind);
    
    if (null != this.scope) 
	encoder.writeElement(CCNProtocolDTags.Scope, this.scope);
    
    if (null != this.interestLifetime) 
	encoder.writeElement(CCNProtocolDTags.InterestLifetime, 
			     DataUtils.unsignedIntToBigEndian((this.interestLifetime / 1000.0) * 4096));
    
    if (null != this.nonce)
	encoder.writeElement(CCNProtocolDTags.Nonce, this.nonce);
    
    encoder.writeEndElement();
    
    if (LOG>4) console.log('--------Finish encoding Interest.');
};

/**
 * encoding can be 'hex' or 'base64'; if null, will use 'hex' by default
 */
Interest.prototype.to_xml = function (encoding) {
    var xml = '<Interest>';

    if (encoding == null)
	encoding = 'hex';

    if (null != this.name)
	xml += this.name.to_xml(encoding);
	
    if (null != this.minSuffixComponents) 
	xml += '<MinSuffixComponents>' + this.minSuffixComponents + '</MinSuffixComponents>';

    if (null != this.maxSuffixComponents) 
	xml += '<MaxSuffixComponents>' + this.maxSuffixComponents + '</MaxSuffixComponents>';

    if (null != this.publisherPublicKeyDigest)
	xml += this.publisherPublicKeyDigest.to_xml(encoding);
		
    if (null != this.exclude)
	xml += this.exclude.to_xml(encoding);
		
    if (null != this.childSelector)
	xml += '<ChildSelector>' + this.childSelector + '</ChildSelector>';

    if (this.DEFAULT_ANSWER_ORIGIN_KIND != this.answerOriginKind && this.answerOriginKind!=null) 
	xml += '<AnswerOriginKind>' + this.answerOriginKind + '</AnswerOriginKind>';
		
    if (null != this.scope) 
	xml += '<Scope>' + this.scope + '</Scope>';
		
    if (null != this.interestLifetime)
	xml += '<InterestLifetime ccnbencoding="' + encoding + 'Binary">' 
	    + DataUtils.unsignedIntToBigEndian((this.interestLifetime / 1000.0) * 4096).toString(encoding).toUpperCase()
	    + '</InterestLifetime>';
    
    if (null != this.nonce)
	xml += '<Nonce ccnbencoding="' + encoding + 'Binary">' + this.nonce.toString(encoding).toUpperCase() + '</Nonce>';
    
    xml += '</Interest>';

    return xml;
};


/*
 * Return encoded Buffer containing the ccnd-formated interest packet
 */
Interest.prototype.encodeToBinary = function () {
    var enc = new BinaryXMLEncoder();
    this.to_ccnb(enc);
    return enc.getReducedOstream();
};


/*
 * Return true if this.name.match(name) and the name conforms to the interest selectors.
 */
Interest.prototype.matches_name = function (/*Name*/ name) {
    if (!this.name.isPrefixOf(name))
        return false;
    
    if (this.minSuffixComponents != null &&
        // Add 1 for the implicit digest.
        !(name.components.length + 1 - this.name.components.length >= this.minSuffixComponents))
        return false;
    if (this.maxSuffixComponents != null &&
        // Add 1 for the implicit digest.
        !(name.components.length + 1 - this.name.components.length <= this.maxSuffixComponents))
        return false;
    if (this.exclude != null && name.components.length > this.name.components.length &&
        this.exclude.matches(name.components[this.name.components.length]))
        return false;
    
    return true;
};

/*
 * Return a new Interest with the same fields as this Interest.  
 * Note: This does NOT make a deep clone of the name, exclue or other objects.
 */
Interest.prototype.clone = function () {
    return new Interest(
	this.name, this.faceInstance, this.minSuffixComponents, this.maxSuffixComponents, 
	this.publisherPublicKeyDigest, this.exclude, this.childSelector, this.answerOriginKind, 
	this.scope, this.interestLifetime, this.nonce);
};

/*
 * Handle the interest Exclude element.
 * _values is an array where each element is either Uint8Array component or Exclude.ANY.
 */
var Exclude = function Exclude(_values) { 
    this.values = (_values || []);
    
    // Check the type of the input
    for (var i = 0; i < this.values.length; i++) {
	var component = this.values[i];
	
	// Exclude.ANY is special
	if (component == Exclude.ANY)
	    continue;
	
	if (typeof component == 'string')
	    // Convert string to Buffer
	    this.values[i] = Name.stringComponentToBuffer(component);
	else if (!(component instanceof Buffer))
	    // Otherwise it should be a Buffer
	    throw new Error('Cannot construct Exclude: unknown type of input component.');
    }
};

exports.Exclude = Exclude;

Exclude.ANY = "*";

Exclude.prototype.from_ccnb = function (/*XMLDecoder*/ decoder) {
    decoder.readStartElement(CCNProtocolDTags.Exclude);

    while (true) {
        if (decoder.peekStartElement(CCNProtocolDTags.Component))
            this.values.push(decoder.readBinaryElement(CCNProtocolDTags.Component));
        else if (decoder.peekStartElement(CCNProtocolDTags.Any)) {
            decoder.readStartElement(CCNProtocolDTags.Any);
            decoder.readEndElement();
            this.values.push(Exclude.ANY);
        }
        else if (decoder.peekStartElement(CCNProtocolDTags.Bloom)) {
            // Skip the Bloom and treat it as Any.
            decoder.readBinaryElement(CCNProtocolDTags.Bloom);
            this.values.push(Exclude.ANY);
        }
        else
            break;
    }
    
    decoder.readEndElement();
};

Exclude.prototype.to_ccnb = function (/*XMLEncoder*/ encoder) {
    if (this.values == null || this.values.length == 0)
	return;

    encoder.writeStartElement(CCNProtocolDTags.Exclude);
    
    // TODO: Do we want to order the components (except for ANY)?
    for (var i = 0; i < this.values.length; ++i) {
        if (this.values[i] == Exclude.ANY) {
            encoder.writeStartElement(CCNProtocolDTags.Any);
            encoder.writeEndElement();
        }
        else
            encoder.writeElement(CCNProtocolDTags.Component, this.values[i]);
    }

    encoder.writeEndElement();
};

Exclude.prototype.to_xml = function (encoding) {
    if (this.values == null || this.values.length == 0)
	return "";

    if (encoding == null)
	encoding = 'hex';
    
    var xml = '<Exclude>';
    
    // TODO: Do we want to order the components (except for ANY)?
    for (var i = 0; i < this.values.length; ++i) {
        if (this.values[i] == Exclude.ANY) {
            xml += '<Any></Any>';
        }
        else {
	    var blob = this.values[i];
	    if (Name.is_text_encodable(blob))
		xml += '<Component ccnbencoding="text">' + blob.toString() + '</Component>';
	    else 
		xml += '<Component ccnbencoding="' + encoding + 'Binary">' + blob.toString(encoding).toUpperCase() + '</Component>';
	}
    }

    xml += '</Exclude>';

    return xml;
};


/*
 * Return a string with elements separated by "," and Exclude.ANY shown as "*". 
 */
Exclude.prototype.to_uri = function () {
    if (this.values == null || this.values.length == 0)
	return "";

    var result = "";
    for (var i = 0; i < this.values.length; ++i) {
        if (i > 0)
            result += ",";
        
        if (this.values[i] == Exclude.ANY)
            result += "*";
        else
            result += Name.toEscapedString(this.values[i]);
    }
    return result;
};

/*
 * Return true if the component matches any of the exclude criteria.
 */
Exclude.prototype.matches = function (/*Buffer*/ component) {
    for (var i = 0; i < this.values.length; ++i) {
        if (this.values[i] == Exclude.ANY) {
            var lowerBound = null;
            if (i > 0)
                lowerBound = this.values[i - 1];
            
            // Find the upper bound, possibly skipping over multiple ANY in a row.
            var iUpperBound;
            var upperBound = null;
            for (iUpperBound = i + 1; iUpperBound < this.values.length; ++iUpperBound) {
                if (this.values[iUpperBound] != Exclude.ANY) {
                    upperBound = this.values[iUpperBound];
                    break;
                }
            }
            
            // If lowerBound != null, we already checked component equals lowerBound on the last pass.
            // If upperBound != null, we will check component equals upperBound on the next pass.
            if (upperBound != null) {
                if (lowerBound != null) {
                    if (Exclude.compareComponents(component, lowerBound) > 0 &&
                        Exclude.compareComponents(component, upperBound) < 0)
                        return true;
                }
                else {
                    if (Exclude.compareComponents(component, upperBound) < 0)
                        return true;
                }
                
                // Make i equal iUpperBound on the next pass.
                i = iUpperBound - 1;
            }
            else {
                if (lowerBound != null) {
                    if (Exclude.compareComponents(component, lowerBound) > 0)
                        return true;
                }
                else
                    // this.values has only ANY.
                    return true;
            }
        }
        else {
            if (DataUtils.arraysEqual(component, this.values[i]))
                return true;
        }
    }
    
    return false;
};

/**
 * Compare two Buffer components.
 * Return -1 if component1 is less than component2, 1 if greater or 0 if equal.
 * A component is less if it is shorter, otherwise if equal length do a byte comparison.
 */
Exclude.compareComponents = function (component1, component2) {
    return Name.compareComponents(component1, component2);
};
/**
 * @author: Meki Cheraoui, Wentao Shang
 * See COPYING for copyright and distribution information.
 * This class represents Key and KeyLocator Objects
 */

/**
 * Ported to node.js by Wentao Shang
 */
var Name = require('./Name.js').Name;
var CCNProtocolDTags = require('./util/CCNProtocolDTags.js').CCNProtocolDTags;
var PublisherID = require('./PublisherID.js').PublisherID;

var LOG = 0;

/**
 * Key
 */
var Key = function Key() {
    this.publicKeyDer = null;     // Buffer
    this.publicKeyDigest = null;  // Buffer
    this.publicKeyPem = null;     // String
    this.privateKeyPem = null;    // String
};


/**
 * Helper functions to read Key fields
 * TODO: generateRSA()
 */

Key.prototype.publicToDER = function () {
    return this.publicKeyDer;  // Buffer
};

Key.prototype.privateToDER = function () {
    // Remove the '-----XXX-----' from the beginning and the end of the key
    // and also remove any \n in the key string
    var lines = this.privateKeyPem.split('\n');
    priKey = "";
    for (var i = 1; i < lines.length - 1; i++)
	priKey += lines[i];
    return new Buffer(priKey, 'base64');    
};

Key.prototype.publicToPEM = function () {
    return this.publicKeyPem;
};

Key.prototype.privateToPEM = function () {
    return this.privateKeyPem;
};

Key.prototype.getKeyID = function () {
    return this.publicKeyDigest;
};

exports.Key = Key;

Key.prototype.readDerPublicKey = function (/*Buffer*/pub_der) {
    if (LOG > 4) console.log("Encode DER public key:\n" + pub_der.toString('hex'));

    this.publicKeyDer = pub_der;

    var hash = require("crypto").createHash('sha256');
    hash.update(this.publicKeyDer);
    this.publicKeyDigest = new Buffer(hash.digest());
    
    var keyStr = pub_der.toString('base64');
    var keyPem = "-----BEGIN PUBLIC KEY-----\n";
    for (var i = 0; i < keyStr.length; i += 64)
	keyPem += (keyStr.substr(i, 64) + "\n");
    keyPem += "-----END PUBLIC KEY-----";

    this.publicKeyPem = keyPem;

    if (LOG > 4) console.log("Convert public key to PEM format:\n" + this.publicKeyPem);
};

/**
 * Load RSA key pair from PEM-encoded strings.
 * Will throw an Error if both 'pub' and 'pri' are null.
 */
Key.prototype.fromPemString = function (pub, pri) {
    if (pub == null && pri == null)
	throw new Error('Cannot create Key object if both public and private PEM string is empty.');

    // Read public key
    if (pub != null) {
	this.publicKeyPem = pub;
	if (LOG>4) console.log("Key.publicKeyPem: \n" + this.publicKeyPem);
	
	// Remove the '-----XXX-----' from the beginning and the end of the public key
	// and also remove any \n in the public key string
	var lines = pub.split('\n');
	pub = "";
	for (var i = 1; i < lines.length - 1; i++)
	    pub += lines[i];
	this.publicKeyDer = new Buffer(pub, 'base64');
	if (LOG>4) console.log("Key.publicKeyDer: \n" + this.publicKeyDer.toString('hex'));
	
	var hash = require("crypto").createHash('sha256');
	hash.update(this.publicKeyDer);
	this.publicKeyDigest = new Buffer(hash.digest());
	if (LOG>4) console.log("Key.publicKeyDigest: \n" + this.publicKeyDigest.toString('hex'));
    }
    
    // Read private key
    if (pri != null) {
	this.privateKeyPem = pri;
	if (LOG>4) console.log("Key.privateKeyPem: \n" + this.privateKeyPem);
    }
};

Key.prototype.fromPem = Key.prototype.fromPemString;

/**
 * Static method that create a Key object.
 * Parameter 'obj' is a JSON object that has two properties:
 *   pub: the PEM string for the public key
 *   pri: the PEM string for the private key
 * Will throw an Error if both obj.pub and obj.pri are null.
 */
Key.createFromPEM = function (obj) {
    var key = new Key();
    key.fromPemString(obj.pub, obj.pri);
    return key;
};

/**
 * Load RSA key pair from PEM-formated files.
 */
Key.prototype.fromPemFile = function (pub, pri) {
    if (pub == null || pri == null) {
	throw new Error('KeyError', 'cannot create Key object without file name.');
    }

    // Read public key

    var pubpem = require('fs').readFileSync(pub).toString();
    if (LOG>4) console.log("Content in public key PEM file: \n" + pubpem);

    var pub_pat = /-----BEGIN\sPUBLIC\sKEY-----[\s\S]*-----END\sPUBLIC\sKEY-----/;
    pubKey = pub_pat.exec(pubpem)[0].toString();
    this.publicKeyPem = pubKey;
    if (LOG>4) console.log("Key.publicKeyPem: \n" + this.publicKeyPem);

    // Remove the '-----XXX-----' from the beginning and the end of the public key
    // and also remove any \n in the public key string
    var lines = pubKey.split('\n');
    pubKey = "";
    for (var i = 1; i < lines.length - 1; i++)
	pubKey += lines[i];
    this.publicKeyDer = new Buffer(pubKey, 'base64');
    if (LOG>4) console.log("Key.publicKeyDer: \n" + this.publicKeyDer.toString('hex'));

    var hash = require("crypto").createHash('sha256');
    hash.update(this.publicKeyDer);
    this.publicKeyDigest = new Buffer(hash.digest());
    if (LOG>4) console.log("Key.publicKeyDigest: \n" + this.publicKeyDigest.toString('hex'));

    // Read private key

    var pem = require('fs').readFileSync(pri).toString();
    if (LOG>4) console.log("Content in private key PEM file: \n" + pem);

    var pri_pat = /-----BEGIN\sRSA\sPRIVATE\sKEY-----[\s\S]*-----END\sRSA\sPRIVATE\sKEY-----/;
    this.privateKeyPem = pri_pat.exec(pem)[0].toString();
    if (LOG>4) console.log("Key.privateKeyPem: \n" + this.privateKeyPem);
};

/**
 * KeyLocator
 */
var KeyLocatorType = {
    KEY:1,
    CERTIFICATE:2,
    KEYNAME:3
};

exports.KeyLocatorType = KeyLocatorType;

var KeyLocator = function KeyLocator(_input, _type) { 
    this.type = _type;
    
    if (_type == KeyLocatorType.KEYNAME) {
    	if (LOG>3) console.log('KeyLocator: Set KEYNAME to ' + _input.to_uri());
    	this.keyName = new KeyName(_input);  // KeyName
    }
    else if (_type == KeyLocatorType.KEY) {
    	if (LOG>3) console.log('KeyLocator: Set KEY to ' + _input.publicKeyPem);
    	this.publicKey = _input;  // Key
    }
    else if (_type == KeyLocatorType.CERTIFICATE) {
    	if (LOG>3) console.log('KeyLocator: Set CERTIFICATE to ' + input.toString('hex'));
    	this.certificate = _input;  // Buffer
    }
};

exports.KeyLocator = KeyLocator;

KeyLocator.prototype.from_ccnb = function(decoder) {
    if (LOG>4) console.log('--------Start decoding KeyLocator...');

    decoder.readStartElement(this.getElementLabel());

    if (decoder.peekStartElement(CCNProtocolDTags.Key)) {
	encodedKey = decoder.readBinaryElement(CCNProtocolDTags.Key);

	this.publicKey = new Key();
	this.publicKey.readDerPublicKey(encodedKey);
	this.type = KeyLocatorType.KEY;
	    
	if(LOG>4) console.log('Public key in PEM format: '+ this.publicKey.publicKeyPem);
    } else if (decoder.peekStartElement(CCNProtocolDTags.Certificate)) {
	encodedCert = decoder.readBinaryElement(CCNProtocolDTags.Certificate);
			
	/*
	 * Certificates not yet working
	 */
			
	//CertificateFactory factory = CertificateFactory.getInstance("X.509");
	//this.certificate = (X509Certificate) factory.generateCertificate(new ByteArrayInputStream(encodedCert));

	this.certificate = encodedCert;
	this.type = KeyLocatorType.CERTIFICATE;

	if(LOG>4) console.log('CERTIFICATE FOUND: '+ this.certificate);
    } else  {
	this.type = KeyLocatorType.KEYNAME;		
	this.keyName = new KeyName();
	this.keyName.from_ccnb(decoder);
    }
    decoder.readEndElement();

    if (LOG>4) console.log('--------Finish decoding KeyLocator.');
};


KeyLocator.prototype.to_ccnb = function (encoder) {
    if(LOG>4) console.log('--------Encoding KeyLocator...');
    if(LOG>4) console.log('KeyLocator type is is ' + this.type);

    if (!this.validate()) {
	throw new Error('Cannot encode KeyLocator: field values missing.');
    }

    encoder.writeStartElement(this.getElementLabel());
	
    if (this.type == KeyLocatorType.KEY) {
	if(LOG>4) console.log('About to encode a public key:\n' + this.publicKey.publicKeyDer.toString('hex'));
	encoder.writeElement(CCNProtocolDTags.Key, this.publicKey.publicKeyDer);
    } else if (this.type == KeyLocatorType.CERTIFICATE) {
	try {
	    encoder.writeElement(CCNProtocolDTags.Certificate, this.certificate);
	} catch (e) {
	    throw new Error('Cannot encode KeyLocator: certificate encoding error.');
	}
    } else if (this.type == KeyLocatorType.KEYNAME) {
	this.keyName.to_ccnb(encoder);
    }
    encoder.writeEndElement();

    if (LOG>4) console.log('--------Finish encoding KeyLocator.');
};

/**
 * encoding can be 'hex' or 'base64'; if null, will use 'hex' by default
 */
KeyLocator.prototype.to_xml = function (encoding) {
    var xml = '<KeyLocator>';

    if (encoding == null)
	encoding = 'hex';

    if (this.type == KeyLocatorType.KEY) {
	xml += '<Key ccnbencoding="' + encoding + 'Binary">' + this.publicKey.publicKeyDer.toString(encoding).toUpperCase() + '</Key>';
    } else if (this.type == KeyLocatorType.CERTIFICATE) {
	// Treat certificate as blob
	xml += '<Certificate ccnbencoding="' + encoding + 'Binary">' + this.certificate.toString(encoding).toUpperCase() + '</Certificate>';
    } else if (this.type == KeyLocatorType.KEYNAME) {
	xml += this.keyName.to_xml(encoding);
    }
    xml += '</KeyLocator>';
    return xml;
};

KeyLocator.prototype.getElementLabel = function() {
    return CCNProtocolDTags.KeyLocator;
};

KeyLocator.prototype.validate = function() {
    return ((null != this.keyName) || (null != this.publicKey) || (null != this.certificate));
};


/**
 * KeyName is only used by KeyLocator.
 * Currently publisherID is never set by NDN.JS
 */
var KeyName = function KeyName(name, id) {
    this.name = name;  // Name
    this.publisherId = id;  // PublisherID
};

exports.KeyName = KeyName;

KeyName.prototype.from_ccnb = function (decoder) {
    if (LOG>4) console.log('--------Start decoding KeyName...');

    decoder.readStartElement(this.getElementLabel());

    this.name = new Name();
    this.name.from_ccnb(decoder);
    
    if ( PublisherID.peek(decoder) ) {
	this.publisherID = new PublisherID();
	this.publisherID.from_ccnb(decoder);
    }
    
    decoder.readEndElement();

    if (LOG>4) console.log('--------Finish decoding KeyName.');
};

KeyName.prototype.to_ccnb = function (encoder) {
    if (LOG>4) console.log('--------Encoding KeyName...');

    if (!this.validate()) {
	throw new Error('Cannot encode KeyName: field values missing.');
    }
	
    encoder.writeStartElement(this.getElementLabel());
	
    this.name.to_ccnb(encoder);

    if (null != this.publisherID)
	this.publisherID.to_ccnb(encoder);

    encoder.writeEndElement();

    if (LOG>4) console.log('--------Finish encoding KeyName.');
};

/**
 * encoding can be 'hex' or 'base64'; if null, will use 'hex' by default
 */
KeyName.prototype.to_xml = function (encoding) {
    var xml = '<KeyName>';

    if (encoding == null)
	encoding = 'hex';

    xml += this.name.to_xml(encoding);

    if (this.publisherID != null)
	xml += this.publisherID.to_xml(encoding);

    xml += '</KeyName>';
    return xml;
};
	
KeyName.prototype.getElementLabel = function () { return CCNProtocolDTags.KeyName; };

KeyName.prototype.validate = function () {
    // DKS -- do we do recursive validation?
    // null publisherID is ok
    return (null != this.name);
};
/**
 * @author: Meki Cheraoui, Wentao Shang
 * See COPYING for copyright and distribution information.
 * This class represents PublisherID object
 */

/**
 * Ported to node.js by Wentao Shang
 */
var CCNProtocolDTags = require('./util/CCNProtocolDTags.js').CCNProtocolDTags;
var CCNProtocolDTagsStrings = require('./util/CCNProtocolDTags.js').CCNProtocolDTagsStrings;

var isPublisherIDTag = function (tagVal) {
    if ((tagVal == CCNProtocolDTags.PublisherPublicKeyDigest) ||
	(tagVal == CCNProtocolDTags.PublisherCertificateDigest) ||
	(tagVal == CCNProtocolDTags.PublisherIssuerKeyDigest) ||
	(tagVal == CCNProtocolDTags.PublisherIssuerCertificateDigest)) {
	return true;
    }
    return false;
};

/**
 * id is the SHA-256 hash of the publisher public key Buffer
 * type can be either of CCNProtocolDtags.PublisherPublicKeyDigest | PublisherCertificateDigest | PublisherIssuerKeyDigest | PublisherIssuerCertificateDigest
 * while the latter three are usually not used
 */
var PublisherID = function PublisherID(id, type) {
    this.id = id;  // Buffer
    this.type = type;
};

exports.PublisherID = PublisherID;

PublisherID.prototype.from_ccnb = function (decoder) {
    // We have a choice here of one of 4 binary element types.
    var nextTag = decoder.peekStartElementAsLong();
		
    if (null == nextTag) {
	throw new Error('Cannot parse PublisherID.');
    } 
		
    if (!isPublisherIDTag(nextTag)) {
	throw new Error('Invalid PublisherID tag ' + nextTag);
    }
    this.id = decoder.readBinaryElement(nextTag);
    if (null == this.publisherID) {
	throw new Error('Cannot read PublisherID of type ' + nextTag);
    }

    this.type = nextTag;
};

PublisherID.prototype.to_ccnb = function (encoder) {
    if (!this.validate()) {
	throw new Error('Ccannot encode PublisherID: field value is missing.');
    }
    
    encoder.writeElement(this.getElementLabel(), this.id);
};


PublisherID.prototype.to_xml = function (encoding) {
    if (encoding == null)
	encoding = 'hex';

    var xml = '<' + CCNProtocolDTagsStrings[this.type] + ' ccnbencoding="' + encoding + 'Binary">' 
    + this.id.toString(encoding).toUpperCase() + '</' + CCNProtocolDTagsStrings[this.type] + '>';
    return xml;
};

// Check if the next component is a PublisherID
PublisherID.peek = function (decoder) {
    var nextTag = decoder.peekStartElementAsLong();
		
    if (null == nextTag) {
	return false;
    }
    return (isPublisherIDTag(nextTag));
};

PublisherID.prototype.getElementLabel = function () { 
    return this.type;
};

PublisherID.prototype.validate = function () {
    return ((null != this.id && (null != this.type)));
};
/**
 * @author: Meki Cheraoui
 * See COPYING for copyright and distribution information.
 * This class represents PublisherPublicKeyDigest Objects
 */

/**
 * Ported to node.js by Wentao Shang
 */
var CCNProtocolDTags = require('./util/CCNProtocolDTags.js').CCNProtocolDTags;

var LOG = 0;

var PublisherPublicKeyDigest = function PublisherPublicKeyDigest(/* Buffer */ pkd) {
    this.PUBLISHER_ID_LEN = 256/8;    
    this.publisherPublicKeyDigest = pkd;
    if (LOG>3 && pkd != null) console.log('PublisherPublicKeyDigest set to ' + pkd.toString('hex'));
};

exports.PublisherPublicKeyDigest = PublisherPublicKeyDigest;

PublisherPublicKeyDigest.prototype.from_ccnb = function (decoder) {
    this.publisherPublicKeyDigest = decoder.readBinaryElement(this.getElementLabel());
    
    if(LOG>4) console.log('Publisher public key digest is ' + this.publisherPublicKeyDigest.toString('hex'));

    if (null == this.publisherPublicKeyDigest) {
	throw new Error('Cannot parse publisher public key digest.');
    }

    if (this.publisherPublicKeyDigest.length != this.PUBLISHER_ID_LEN) {
	console.log('LENGTH OF PUBLISHER ID IS WRONG! Expected ' + this.PUBLISHER_ID_LEN + ", got " + this.publisherPublicKeyDigest.length);
    }
};

PublisherPublicKeyDigest.prototype.to_ccnb = function (encoder) {
    if (LOG>4) console.log('Encoding PublisherPublicKeyDigest...');
    //TODO Check that the ByteArray for the key is present
    if (!this.validate()) {
	throw new Error('Cannot encode PublisherPublicKeyDigest: field values missing.');
    }
    if(LOG>4) console.log('PUBLISHER KEY DIGEST IS ' + this.publisherPublicKeyDigest.toString('hex'));
    encoder.writeElement(this.getElementLabel(), this.publisherPublicKeyDigest);
    if(LOG>4) console.log('Finish encoding PublisherPublicKeyDigest.');
};

/**
 * encoding can be 'hex' or 'base64'; if null, will use 'hex' by default
 */
PublisherPublicKeyDigest.prototype.to_xml = function (encoding) {
    if (encoding == null)
	encoding = 'hex';

    var xml = '<PublisherPublicKeyDigest ccnbencoding="' + encoding + 'Binary">';
    if (this.publisherPublicKeyDigest != null)
	xml += this.publisherPublicKeyDigest.toString(encoding).toUpperCase();
    xml += '</PublisherPublicKeyDigest>';
    return xml;
};

PublisherPublicKeyDigest.prototype.getElementLabel = function () { return CCNProtocolDTags.PublisherPublicKeyDigest; };

PublisherPublicKeyDigest.prototype.validate = function () {
    return (null != this.publisherPublicKeyDigest);
};
/**
 * @author: Meki Cheraoui
 * See COPYING for copyright and distribution information.
 * This class represents Forwarding Entries
 */

/**
 * Ported to node.js by Wentao Shang
 */
var Name = require('./Name.js').Name;
var BinaryXMLEncoder = require('./util/BinaryXMLEncoder.js').BinaryXMLEncoder;
var CCNProtocolDTags = require('./util/CCNProtocolDTags.js').CCNProtocolDTags;
var PublisherPublicKeyDigest = require('./PublisherPublicKeyDigest.js').PublisherPublicKeyDigest;

var LOG = 0;

var ForwardingEntry = function ForwardingEntry(_action, _prefixName, _ccndId, _faceID, _flags, _lifetime) {
    //String
    this.action = _action;
    //Name
    this.prefixName = _prefixName;
    //PublisherPublicKeyDigest 
    this.ccndID = _ccndId;
    //Integer
    this.faceID = _faceID;
    //Integer
    this.flags = _flags;
    //Integer
    this.lifetime = _lifetime;  // in seconds
};

exports.ForwardingEntry = ForwardingEntry;

ForwardingEntry.prototype.from_ccnb = function (/*XMLDecoder*/ decoder) {
    if (LOG > 4) console.log('Start decoding ForwardingEntry...');
    decoder.readStartElement(this.getElementLabel());
    if (decoder.peekStartElement(CCNProtocolDTags.Action)) {
	this.action = decoder.readUTF8Element(CCNProtocolDTags.Action); 
    }
    if (decoder.peekStartElement(CCNProtocolDTags.Name)) {
	this.prefixName = new Name();
	this.prefixName.from_ccnb(decoder) ;
    }
    if (decoder.peekStartElement(CCNProtocolDTags.PublisherPublicKeyDigest)) {
	this.CcndId = new PublisherPublicKeyDigest();
	this.CcndId.from_ccnb(decoder);
    }
    if (decoder.peekStartElement(CCNProtocolDTags.FaceID)) {
	this.faceID = decoder.readIntegerElement(CCNProtocolDTags.FaceID); 
    }
    if (decoder.peekStartElement(CCNProtocolDTags.ForwardingFlags)) {
	this.flags = decoder.readIntegerElement(CCNProtocolDTags.ForwardingFlags); 
    }
    if (decoder.peekStartElement(CCNProtocolDTags.FreshnessSeconds)) {
	this.lifetime = decoder.readIntegerElement(CCNProtocolDTags.FreshnessSeconds); 
    }
    decoder.readEndElement();
    if (LOG > 4) console.log('Finish decoding ForwardingEntry.');
};

/**
 * Used by NetworkObject to encode the object to a network stream.
 */
ForwardingEntry.prototype.to_ccnb =function(/*XMLEncoder*/ encoder) {
    if (LOG > 4) console.log('--------Encoding ForwardingEntry...');
    encoder.writeStartElement(this.getElementLabel());
    if (null != this.action && this.action.length != 0)
	encoder.writeElement(CCNProtocolDTags.Action, this.action);	
    if (null != this.prefixName) {
	this.prefixName.to_ccnb(encoder);
    }
    if (null != this.CcndId) {
	this.CcndId.to_ccnb(encoder);
    }
    if (null != this.faceID) {
	encoder.writeElement(CCNProtocolDTags.FaceID, this.faceID);
    }
    if (null != this.flags) {
	encoder.writeElement(CCNProtocolDTags.ForwardingFlags, this.flags);
    }
    if (null != this.lifetime) {
	encoder.writeElement(CCNProtocolDTags.FreshnessSeconds, this.lifetime);
    }
    encoder.writeEndElement();
    if (LOG > 4) console.log('--------Finish encoding ForwardingEntry.');
};

ForwardingEntry.prototype.encodeToBinary = function () {
    var enc = new BinaryXMLEncoder();
    this.to_ccnb(enc);
    return enc.getReducedOstream();
};

ForwardingEntry.prototype.getElementLabel = function() { return CCNProtocolDTags.ForwardingEntry; };
/**
 * @author: Jeff Thompson
 * See COPYING for copyright and distribution information.
 * Encapsulate an Uint8Array and support dynamic reallocation.
 */

/**
 * Ported to node.js by Wentao Shang
 */


/*
 * Create a DynamicBuffer where this.array is a Buffer of size length.
 * If length is not supplied, use a default initial length.
 * The methods will update this.length.
 * To access the array, use this.array or call subarray.
 */
var DynamicBuffer = function DynamicBuffer(length) {
    if (!length)
        length = 16;

    this.array = new Buffer(length);
    this.length = length;
};

exports.DynamicBuffer = DynamicBuffer;

/*
 * Ensure that this.array has the length, reallocate and copy if necessary.
 * Update this.length which may be greater than length.
 */
DynamicBuffer.prototype.ensureLength = function(length) {
    if (this.array.length >= length)
        return;
    
    // See if double is enough.
    var newLength = this.array.length * 2;
    if (length > newLength)
        // The needed length is much greater, so use it.
        newLength = length;
    
    var newArray = new Buffer(newLength);
    this.array.copy(newArray);
    this.array = newArray;
    this.length = newLength;
};

/*
 * Call this.array.set(value, offset), reallocating if necessary. 
 */
DynamicBuffer.prototype.set = function(value, offset) {
    this.ensureLength(value.length + offset);
    value.copy(this.array, offset);
};

/*
 * Return this.array.subarray(begin, end);
 */
DynamicBuffer.prototype.subarray = function(begin, end) {
    return this.array.slice(begin, end);
};

/*
 * The same as subarray()
 */
DynamicBuffer.prototype.slice = function(begin, end) {
    return this.array.slice(begin, end);
};
/**
 * This class is used to encode ccnb binary elements (blob, type/value pairs).
 * 
 * @author: Meki Cheraoui
 * See COPYING for copyright and distribution information.
 */

/**
 * Ported to node.js by Wentao Shang
 */
var DynamicBuffer = require('./DynamicBuffer.js').DynamicBuffer;

var LOG = 0;

var XML_EXT = 0x00; 	
var XML_TAG = 0x01; 
var XML_DTAG = 0x02; 
var XML_ATTR = 0x03; 
var XML_DATTR = 0x04; 
var XML_BLOB = 0x05; 
var XML_UDATA = 0x06; 
var XML_CLOSE = 0x0;
var XML_SUBTYPE_PROCESSING_INSTRUCTIONS = 16; 

var XML_TT_BITS = 3;
var XML_TT_MASK = ((1 << XML_TT_BITS) - 1);
var XML_TT_VAL_BITS = XML_TT_BITS + 1;
var XML_TT_VAL_MASK = ((1 << (XML_TT_VAL_BITS)) - 1);
var XML_REG_VAL_BITS = 7;
var XML_REG_VAL_MASK = ((1 << XML_REG_VAL_BITS) - 1);
var XML_TT_NO_MORE = (1 << XML_REG_VAL_BITS); // 0x80
var BYTE_MASK = 0xFF;
var LONG_BYTES = 8;
var LONG_BITS = 64;

var bits_11 = 0x0000007FF;
var bits_18 = 0x00003FFFF;
var bits_32 = 0x0FFFFFFFF;


var BinaryXMLEncoder = function BinaryXMLEncoder(){
    this.ostream = new DynamicBuffer(100);
    this.offset = 0;
};

exports.BinaryXMLEncoder = BinaryXMLEncoder;

/*
 * Encode string in utf8.
 */
BinaryXMLEncoder.prototype.writeUString = function(/*String*/ utf8str) {
    this.encodeUString(utf8str, XML_UDATA);
};


BinaryXMLEncoder.prototype.writeBlob = function(/*Buffer*/ blob) {
    if (LOG > 4) console.log("writeBlob: ");
    if (LOG > 4) console.log(blob);
    this.encodeBlob(blob, blob.length);
};


BinaryXMLEncoder.prototype.writeStartElement = function (tag) {
    var dictionaryVal = tag;
    
    if (null == dictionaryVal) {
	this.encodeUString(tag, XML_TAG);
    } else {
	this.encodeTypeAndVal(XML_DTAG, dictionaryVal);
    }
};


BinaryXMLEncoder.prototype.writeEndElement = function() {
    if (LOG>4) console.log('Write end element at OFFSET ' + this.offset);
    this.ostream.ensureLength(this.offset + 1);
    this.ostream.array[this.offset] = XML_CLOSE;
    this.offset += 1;
};


BinaryXMLEncoder.prototype.writeElement = function(tag, data) {
    this.writeStartElement(tag);

    if (data != null) {
	if (typeof data == 'number') {
	    // Encode non-negative integer as decimal string
	    if(LOG>4) console.log('Going to write a number ' + data);
	
	    this.writeUString(data.toString());
	}
	else if (typeof data == 'string') {
	    if(LOG>4) console.log('Going to write a string ' + data);
	
	    this.writeUString(data);
	} else {
	    if(LOG>4) console.log('Going to write a blob ' + data.toString('hex') );

	    this.writeBlob(data);
	}
    }
    
    this.writeEndElement();
};


var TypeAndVal = function TypeAndVal(_type, _val) {
    this.type = _type;
    this.val = _val;
};


BinaryXMLEncoder.prototype.encodeTypeAndVal = function (type, val) {
    if(LOG>4) console.log('Encoding type ' + type + ' and value '+ val);
    if(LOG>4) console.log('Offset is ' + this.offset);
	
    if ((type > XML_UDATA) || (type < 0) || (val < 0)) {
	throw new Error('EncodeError: tag and value must be positive, and tag valid.');
    }
	
    // Encode backwards. Calculate how many bytes we need:
    var numEncodingBytes = this.numEncodingBytes(val);
    this.ostream.ensureLength(this.offset + numEncodingBytes);

    // Bottom 4 bits of val go in last byte with tag.
    this.ostream.array[this.offset + numEncodingBytes - 1] = 
    (BYTE_MASK &
     (((XML_TT_MASK & type) | 
       ((XML_TT_VAL_MASK & val) << XML_TT_BITS))) |
     XML_TT_NO_MORE); // set top bit for last byte
    val = val >>> XML_TT_VAL_BITS;
    
    // Rest of val goes into preceding bytes, 7 bits per byte, top bit
    // is "more" flag.
    var i = this.offset + numEncodingBytes - 2;
    while ((0 != val) && (i >= this.offset)) {
	this.ostream.array[i] = (BYTE_MASK & (val & XML_REG_VAL_MASK)); // leave top bit unset
	val = val >>> XML_REG_VAL_BITS;
	--i;
    }
    if (val != 0) {
	throw new Error('EncodeError: this should not happen: miscalculated encoding.');
    }
    this.offset += numEncodingBytes;
    
    return numEncodingBytes;
};


BinaryXMLEncoder.prototype.encodeUString = function (ustring, type) {
    if (null == ustring)
	throw new Error('EncodeError: cannot encode null string.');

    if (type == XML_TAG || type == XML_ATTR && ustring.length == 0)
	throw new Error('EncodeError: cannot encode empty string.');
    
    if(LOG>4) console.log("The string to write is: " + ustring);

    var strBytes = new Buffer(ustring, 'ascii');
    
    this.encodeTypeAndVal(type, 
			  (((type == XML_TAG) || (type == XML_ATTR)) ?
			   (strBytes.length-1) :
			   strBytes.length));
    
    if(LOG>4) console.log("THE string buffer to write is:");
    if(LOG>4) console.log(strBytes);
    
    this.writeString(strBytes);
    this.offset += strBytes.length;
};


BinaryXMLEncoder.prototype.encodeBlob = function (blob, length) {
    if (null == blob)
	throw new Error('EncodeError: cannot encode null blob.');
    
    if(LOG>4) console.log('Length of blob is ' + length);

    this.encodeTypeAndVal(XML_BLOB, length);

    this.writeBlobArray(blob);
    this.offset += length;
};

var ENCODING_LIMIT_1_BYTE = ((1 << (XML_TT_VAL_BITS)) - 1);
var ENCODING_LIMIT_2_BYTES = ((1 << (XML_TT_VAL_BITS + XML_REG_VAL_BITS)) - 1);
var ENCODING_LIMIT_3_BYTES = ((1 << (XML_TT_VAL_BITS + 2 * XML_REG_VAL_BITS)) - 1);

BinaryXMLEncoder.prototype.numEncodingBytes = function (x) {
    if (x <= ENCODING_LIMIT_1_BYTE) return (1);
    if (x <= ENCODING_LIMIT_2_BYTES) return (2);
    if (x <= ENCODING_LIMIT_3_BYTES) return (3);
    
    var numbytes = 1;
    
    // Last byte gives you XML_TT_VAL_BITS
    // Remainder each give you XML_REG_VAL_BITS
    x = x >>> XML_TT_VAL_BITS;
    while (x != 0) {
        numbytes++;
	x = x >>> XML_REG_VAL_BITS;
    }
    return (numbytes);
};

BinaryXMLEncoder.prototype.writeDateTime = function (tag, time) {    
    if(LOG>4)console.log('Encoding CCNTime: ' + time.msec);
    if(LOG>4)console.log('Encoding CCNTime in binary value:' + time.encodeToBinary().toString('hex'));
    
    this.writeElement(tag, time.encodeToBinary());
};

// This does not update this.offset.
BinaryXMLEncoder.prototype.writeString = function (input) {	
    if(typeof input === 'string'){
    	if(LOG>4) console.log('Going to write a string: ' + input);
        
        this.ostream.ensureLength(this.offset + input.length);
	this.writeBlobArray(new Buffer(input, 'ascii'));
    }
    else{
	if(LOG>4) console.log('Going to write a string in binary form: ');
	if(LOG>4) console.log(input);
	
	this.writeBlobArray(input);
    }
};


BinaryXMLEncoder.prototype.writeBlobArray = function (/* Buffer */ blob) {	
    this.ostream.set(blob, this.offset);
};


BinaryXMLEncoder.prototype.getReducedOstream = function () {
    return this.ostream.subarray(0, this.offset);
};
/**
 * This class is used to decode ccnb binary elements (blob, type/value pairs).
 * 
 * @author: Meki Cheraoui
 * See COPYING for copyright and distribution information.
 */

/**
 * Ported to node.js by Wentao Shang
 */
var CCNTime = require('./CCNTime.js').CCNTime;

var LOG = 0;

var XML_EXT = 0x00; 
var XML_TAG = 0x01; 
var XML_DTAG = 0x02; 
var XML_ATTR = 0x03; 
var XML_DATTR = 0x04; 
var XML_BLOB = 0x05; 
var XML_UDATA = 0x06; 
var XML_CLOSE = 0x0;
var XML_SUBTYPE_PROCESSING_INSTRUCTIONS = 16; 

var XML_TT_BITS = 3;
var XML_TT_MASK = ((1 << XML_TT_BITS) - 1);
var XML_TT_VAL_BITS = XML_TT_BITS + 1;
var XML_TT_VAL_MASK = ((1 << (XML_TT_VAL_BITS)) - 1);
var XML_REG_VAL_BITS = 7;
var XML_REG_VAL_MASK = ((1 << XML_REG_VAL_BITS) - 1);
var XML_TT_NO_MORE = (1 << XML_REG_VAL_BITS); // 0x80
var BYTE_MASK = 0xFF;
var LONG_BYTES = 8;
var LONG_BITS = 64;

var bits_11 = 0x0000007FF;
var bits_18 = 0x00003FFFF;
var bits_32 = 0x0FFFFFFFF;

var CCNB_DECODE_MAX_LEN = 32768;  // Stop decoding if field length is longer than a threshold

var BinaryXMLDecoder = function BinaryXMLDecoder(istream) {	
    this.istream = istream;  // Buffer
    this.offset = 0;
};

exports.BinaryXMLDecoder = BinaryXMLDecoder;


BinaryXMLDecoder.prototype.readStartElement = function (startTag) {
    tv = this.decodeTypeAndVal();
    		
    if (null == tv) {
	throw new Error('DecodeError: expected start element ' + startTag + ', got something not a tag.');
    }
    
    var decodedTag = null;
			
    if (tv.type() == XML_TAG) {
	// Tag value represents length-1 as tags can never be empty.
	decodedTag = this.decodeUString(tv.val());
    } else if (tv.type() == XML_DTAG) {
	decodedTag = tv.val();
    }
    
    if ((null ==  decodedTag) || decodedTag != startTag ) {
	throw new Error('DecodeError: expecting start element ' + startTag + ', got ' + decodedTag);
    }
};


BinaryXMLDecoder.prototype.peekStartElementAsString = function () {
    var decodedTag = null;
    var previousOffset = this.offset;
    try {
	// Have to distinguish genuine errors from wrong tags. Could either use
	// a special exception subtype, or redo the work here.
	//this.TypeAndVal 
	var tv = this.decodeTypeAndVal();

	if (null != tv) {
	    if (tv.type() == XML_TAG) {
		if (tv.val()+1 > CCNB_DECODE_MAX_LEN) {
		    throw new Error('DecodeError: length ' + (tv.val() + 1) + ' longer than expected maximum length.');
		}
		decodedTag = this.decodeUString(tv.val());
	    } else if (tv.type() == XML_DTAG) {
		decodedTag = tagToString(tv.val());					
	    }
	} // else, not a type and val, probably an end element. rewind and return false.
    }
    finally {
	this.offset = previousOffset;
    }
    return decodedTag;
};

BinaryXMLDecoder.prototype.peekStartElement = function (startTag) {
    if (typeof startTag == 'string') {
	var decodedTag = this.peekStartElementAsString();
	
	if ((null !=  decodedTag) && decodedTag == startTag) {
	    return true;
	}
	return false;
    } else if (typeof startTag == 'number') {
	var decodedTag = this.peekStartElementAsLong();
	if ((null !=  decodedTag) && decodedTag == startTag) {
	    return true;
	}
	return false;
    } else {
	throw new Error('DecodeError: should be string or number.');
    }
}


BinaryXMLDecoder.prototype.peekStartElementAsLong = function () {
    var decodedTag = null;
    var previousOffset = this.offset;
		
    try {
	// Have to distinguish genuine errors from wrong tags. Could either use
	// a special exception subtype, or redo the work here.
	//this.TypeAndVal
	var tv = this.decodeTypeAndVal();

	if (null != tv) {
	    if (tv.type() == XML_TAG) {
		if (tv.val()+1 > CCNB_DECODE_MAX_LEN) {
		    throw new Error('DecodeError: length ' + (tv.val() + 1) + ' longer than expected maximum length.');
		}
		// Tag value represents length-1 as tags can never be empty.
		var strTag = this.decodeUString(tv.val());
		decodedTag = stringToTag(strTag);
	    } else if (tv.type() == XML_DTAG) {
		decodedTag = tv.val();		
	    }
	} // else, not a type and val, probably an end element. rewind and return false.
    }
    finally {
	this.offset = previousOffset;
    }
    return decodedTag;
};


BinaryXMLDecoder.prototype.readBinaryElement = function (startTag){
    var blob = null;
    this.readStartElement(startTag);
    blob = this.readBlob();
    return blob;
};


BinaryXMLDecoder.prototype.readEndElement = function () {
    var next = this.istream[this.offset]; 
    
    this.offset++;
    
    if (next != XML_CLOSE) {
	throw new Error('DecodeError: expected end element, got ' + next);
    }
};


BinaryXMLDecoder.prototype.readUString = function () {
    var ustring = this.decodeUString();	
    this.readEndElement();
    return ustring;
};


BinaryXMLDecoder.prototype.readBlob = function () {
    var blob = this.decodeBlob();	
    this.readEndElement();
    return blob; // Buffer
};



BinaryXMLDecoder.prototype.readDateTime = function (startTag)  {
    var byteTimestamp = this.readBinaryElement(startTag);

    byteTimestamp = byteTimestamp.toString('hex');
    
    byteTimestamp = parseInt(byteTimestamp, 16);

    var lontimestamp = (byteTimestamp/ 4096) * 1000;

    //if(lontimestamp<0) lontimestamp =  - lontimestamp;

    if(LOG>4) console.log('DECODED DATE WITH VALUE');
    if(LOG>4) console.log(lontimestamp);

    var timestamp = new CCNTime(lontimestamp);
    //timestamp.setDateBinary(byteTimestamp);
    
    if (null == timestamp) {
	throw new Error('DecodeError: cannot parse timestamp: ' + byteTimestamp.toString('hex'));
    }
    return timestamp;
};

BinaryXMLDecoder.prototype.decodeTypeAndVal = function() {
    var type = -1;
    var val = 0;
    var more = true;

    do {	
	var next = this.istream[this.offset];
	if (next == null)  // Quit the loop
	    return null;
		
	if (next < 0) {
	    return null; 
	}

	if ((0 == next) && (0 == val)) {
	    return null;
	}
		
	more = (0 == (next & XML_TT_NO_MORE));
		
	if  (more) {
	    val = val << XML_REG_VAL_BITS;
	    val |= (next & XML_REG_VAL_MASK);
	} else {
	    type = next & XML_TT_MASK;
	    val = val << XML_TT_VAL_BITS;
	    val |= ((next >>> XML_TT_BITS) & XML_TT_VAL_MASK);
	}
		
	this.offset++;
		
    } while (more);
	
    if(LOG>4) console.log('TYPE is '+ type + ' VAL is '+ val);

    return new TypeAndVal(type, val);
};


BinaryXMLDecoder.peekTypeAndVal = function() {
    var tv = null;    
    var previousOffset = this.offset;
    
    try {
	tv = this.decodeTypeAndVal();
    } finally {
	this.offset = previousOffset;
    }
    
    return tv;
};


BinaryXMLDecoder.prototype.decodeBlob = function (blobLength) {
    if (null == blobLength) {
	var tv = this.decodeTypeAndVal();
	if (tv == null)
	    return null;
	blobLength = tv.val();
    }
    
    var bytes = this.istream.slice(this.offset, this.offset + blobLength);
    this.offset += blobLength;
    
    return bytes;
};


BinaryXMLDecoder.prototype.decodeUString = function (byteLength) {
    if (null == byteLength) {
	var tempStreamPosition = this.offset;
	
	var tv = this.decodeTypeAndVal();
	
	if ((null == tv) || (XML_UDATA != tv.type())) { // if we just have closers left, will get back null
	    this.offset = tempStreamPosition;
	    return "";
	}
			
	byteLength = tv.val();
    }

    var stringBytes = this.decodeBlob(byteLength);
    return stringBytes.toString();
};


//OBject containg a pair of type and value
var TypeAndVal = function TypeAndVal(_type, _val) {
    this.t = _type; // byte
    this.v = _val;  // byte
};

TypeAndVal.prototype.type = function () {
    return this.t;
};

TypeAndVal.prototype.val = function () {
    return this.v;
};


BinaryXMLDecoder.prototype.readIntegerElement = function (startTag) {
    if(LOG>4) console.log('READING INTEGER '+ startTag);
    if(LOG>4) console.log('TYPE OF '+ typeof startTag);
    
    var strVal = this.readUTF8Element(startTag);
    
    return parseInt(strVal);
};


BinaryXMLDecoder.prototype.readUTF8Element = function (startTag) {
    this.readStartElement(startTag);
    var strElementText = this.readUString();
    return strElementText;
};


/* 
 * Set the offset into the input, used for the next read.
 */
BinaryXMLDecoder.prototype.seek = function (offset) {
    this.offset = offset;
};
/**
 * This class uses BinaryXMLDecoder to follow the structure of a ccnb binary element to 
 * determine its end.
 * 
 * @author: Jeff Thompson
 * See COPYING for copyright and distribution information.
 */

/**
 * Ported to node.js by Wentao Shang
 */
var DynamicBuffer = require('./DynamicBuffer.js').DynamicBuffer;
var BinaryXMLDecoder = require('./BinaryXMLDecoder.js').BinaryXMLDecoder;


var XML_EXT = 0x00; 
var XML_TAG = 0x01; 
var XML_DTAG = 0x02; 
var XML_ATTR = 0x03; 
var XML_DATTR = 0x04; 
var XML_BLOB = 0x05; 
var XML_UDATA = 0x06; 
var XML_CLOSE = 0x0;
var XML_SUBTYPE_PROCESSING_INSTRUCTIONS = 16; 

var XML_TT_BITS = 3;
var XML_TT_MASK = ((1 << XML_TT_BITS) - 1);
var XML_TT_VAL_BITS = XML_TT_BITS + 1;
var XML_TT_VAL_MASK = ((1 << (XML_TT_VAL_BITS)) - 1);
var XML_REG_VAL_BITS = 7;
var XML_REG_VAL_MASK = ((1 << XML_REG_VAL_BITS) - 1);
var XML_TT_NO_MORE = (1 << XML_REG_VAL_BITS); // 0x80
var BYTE_MASK = 0xFF;
var LONG_BYTES = 8;
var LONG_BITS = 64;

var BinaryXMLStructureDecoder = function BinaryXMLDecoder() {
    this.gotElementEnd = false;
    this.offset = 0;
    this.level = 0;
    this.state = BinaryXMLStructureDecoder.READ_HEADER_OR_CLOSE;
    this.headerLength = 0;
    this.useHeaderBuffer = false;
    this.headerBuffer = new DynamicBuffer(5);
    this.nBytesToRead = 0;
};

exports.BinaryXMLStructureDecoder = BinaryXMLStructureDecoder;

BinaryXMLStructureDecoder.READ_HEADER_OR_CLOSE = 0;
BinaryXMLStructureDecoder.READ_BYTES = 1;

/*
 * Continue scanning input starting from this.offset.  If found the end of the element
 *   which started at offset 0 then return true, else false.
 * If this returns false, you should read more into input and call again.
 * You have to pass in input each time because the array could be reallocated.
 * This throws an exception for badly formed ccnb.
 */
BinaryXMLStructureDecoder.prototype.findElementEnd = function(input) {
    if (this.gotElementEnd)
        // Someone is calling when we already got the end.
        return true;
    
    var decoder = new BinaryXMLDecoder(input);
    
    while (true) {
        if (this.offset >= input.length)
            // All the cases assume we have some input.
            return false;
        
        switch (this.state) {
            case BinaryXMLStructureDecoder.READ_HEADER_OR_CLOSE:               
                // First check for XML_CLOSE.
                if (this.headerLength == 0 && input[this.offset] == XML_CLOSE) {
                    ++this.offset;
                    // Close the level.
                    --this.level;
                    if (this.level == 0) {
                        // Finished.
			this.gotElementEnd = true;
                        return true;
		    }
                    if (this.level < 0)
                        throw new Error("BinaryXMLStructureDecoderError: unexpected close tag at offset " + (this.offset - 1));
                    
                    // Get ready for the next header.
                    this.startHeader();
                    break;
                }
                
                var startingHeaderLength = this.headerLength;
                while (true) {
                    if (this.offset >= input.length) {
                        // We can't get all of the header bytes from this input. Save in headerBuffer.
                        this.useHeaderBuffer = true;
                        var nNewBytes = this.headerLength - startingHeaderLength;
                        this.headerBuffer.set
                            (input.subarray(this.offset - nNewBytes, nNewBytes), startingHeaderLength);
                        
                        return false;
                    }
                    var headerByte = input[this.offset++];
                    ++this.headerLength;
                    if (headerByte & XML_TT_NO_MORE)
                        // Break and read the header.
                        break;
                }
                
                var typeAndVal;
                if (this.useHeaderBuffer) {
                    // Copy the remaining bytes into headerBuffer.
                    nNewBytes = this.headerLength - startingHeaderLength;
                    this.headerBuffer.set
                        (input.subarray(this.offset - nNewBytes, nNewBytes), startingHeaderLength);

                    typeAndVal = new BinaryXMLDecoder(this.headerBuffer.array).decodeTypeAndVal();
                }
                else {
                    // We didn't have to use the headerBuffer.
                    decoder.seek(this.offset - this.headerLength);
                    typeAndVal = decoder.decodeTypeAndVal();
                }
                
                if (typeAndVal == null)
                    throw new Error("BinaryXMLStructureDecoderError: can't read header starting at offset " + (this.offset - this.headerLength));
                
                // Set the next state based on the type.
                var type = typeAndVal.t;
                if (type == XML_DATTR)
                    // We already consumed the item. READ_HEADER_OR_CLOSE again.
                    // ccnb has rules about what must follow an attribute, but we are just scanning.
                    this.startHeader();
                else if (type == XML_DTAG || type == XML_EXT) {
                    // Start a new level and READ_HEADER_OR_CLOSE again.
                    ++this.level;
                    this.startHeader();
                }
                else if (type == XML_TAG || type == XML_ATTR) {
                    if (type == XML_TAG)
                        // Start a new level and read the tag.
                        ++this.level;
                    // Minimum tag or attribute length is 1.
                    this.nBytesToRead = typeAndVal.v + 1;
                    this.state = BinaryXMLStructureDecoder.READ_BYTES;
                    // ccnb has rules about what must follow an attribute, but we are just scanning.
                }
                else if (type == XML_BLOB || type == XML_UDATA) {
                    this.nBytesToRead = typeAndVal.v;
                    this.state = BinaryXMLStructureDecoder.READ_BYTES;
                }
                else
                    throw new Error("BinaryXMLStructureDecoderError: unrecognized header type " + type);
                break;
            
            case BinaryXMLStructureDecoder.READ_BYTES:
                var nRemainingBytes = input.length - this.offset;
                if (nRemainingBytes < this.nBytesToRead) {
                    // Need more.
                    this.offset += nRemainingBytes;
                    this.nBytesToRead -= nRemainingBytes;
                    return false;
                }
                // Got the bytes.  Read a new header or close.
                this.offset += this.nBytesToRead;
                this.startHeader();
                break;
            
            default:
                // We don't expect this to happen.
                throw new Error("BinaryXMLStructureDecoderError: unrecognized state " + this.state);
        }
    }
};

/*
 * Set the state to READ_HEADER_OR_CLOSE and set up to start reading the header
 */
BinaryXMLStructureDecoder.prototype.startHeader = function () {
    this.headerLength = 0;
    this.useHeaderBuffer = false;
    this.state = BinaryXMLStructureDecoder.READ_HEADER_OR_CLOSE;    
};

/*
 *  Set the offset into the input, used for the next read.
 */
BinaryXMLStructureDecoder.prototype.seek = function (offset) {
    this.offset = offset;
};
/**
 * @author: Jeff Thompson
 * See COPYING for copyright and distribution information.
 */

/**
 * Ported to node.js by Wentao Shang
 */
var BinaryXMLStructureDecoder = require('./BinaryXMLStructureDecoder.js').BinaryXMLStructureDecoder;
var DataUtils = require('./DataUtils.js').DataUtils;

var LOG = 0;

/**
 * A BinaryXmlElementReader lets you call onReceivedData multiple times which uses a
 *   BinaryXMLStructureDecoder to detect the end of a binary XML element and calls
 *   elementListener.onReceivedElement(element) with the element. 
 * This handles the case where a single call to onReceivedData may contain multiple elements.
 */
var BinaryXmlElementReader = function BinaryXmlElementReader(elementListener) {
    this.elementListener = elementListener;
    this.dataParts = [];
    this.structureDecoder = new BinaryXMLStructureDecoder();
};


BinaryXmlElementReader.prototype.onReceivedData = function(/* Buffer */ rawData) {
    // Process multiple objects in the data.
    while(true) {
        // Scan the input to check if a whole ccnb object has been read.
        this.structureDecoder.seek(0);
        if (this.structureDecoder.findElementEnd(rawData)) {
            // Got the remainder of an object.  Report to the caller.
            this.dataParts.push(rawData.slice(0, this.structureDecoder.offset));
            this.elementListener.onMessage(DataUtils.concatArrays(this.dataParts));
        
            // Need to read a new object.
            rawData = rawData.slice(this.structureDecoder.offset, rawData.length);
            this.dataParts = [];
            this.structureDecoder = new BinaryXMLStructureDecoder();
            if (rawData.length == 0)
                // No more data in the packet.
                return;
            
            // else loop back to decode.
        }
        else {
            // Save for a later call to concatArrays so that we only copy data once.
            this.dataParts.push(rawData);
	    if (LOG>4) console.log('Incomplete packet received. Length ' + rawData.length + '. Wait for more input.');
            return;
        }
    }
};

exports.BinaryXmlElementReader = BinaryXmlElementReader;
/**
 * @author: Meki Cherkaoui, Jeff Thompson, Wentao Shang
 * See COPYING for copyright and distribution information.
 * This class represents the top-level object for communicating with an NDN host.
 */

/**
 * Ported to node.js by Wentao Shang
 */
var Name = require('./Name.js').Name;
var Interest = require('./Interest.js').Interest;
var ContentObject = require('./ContentObject.js').ContentObject;
var ForwardingEntry = require('./ForwardingEntry.js').ForwardingEntry;
var BinaryXMLDecoder = require('./util/BinaryXMLDecoder.js').BinaryXMLDecoder;
var CCNProtocolDTags = require('./util/CCNProtocolDTags.js').CCNProtocolDTags;
var Key = require('./Key.js').Key;
var KeyLocatorType = require('./Key.js').KeyLocatorType;
var TcpTransport = require('./TcpTransport.js').TcpTransport;

var LOG = 0;

/**
 * NDN wrapper
 */
var NDN = function NDN(settings) {
    settings = (settings || {});
    this.transport = new TcpTransport();
    this.host = (settings.host !== undefined ? settings.host : 'localhost');
    this.port = (settings.port || 9696);
    this.ready_status = NDN.UNOPEN;

    // Event handler
    this.onopen = function () { console.log("NDN connection established."); };
    this.onclose = function () { console.log("NDN connection closed."); };

    this.ccndid = null;
    this.default_key = new Key();
    this.default_key.fromPemString(
	// Public Key
	"-----BEGIN PUBLIC KEY-----\n" +
	"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDNpgZFC23yGSLsMo8mzTcmdni\n" +
	"pkUHI+i8CYagTEqHO+PnejF9Ep/D+MBvEtPXHSgExsDCHP8X7B6If1df58OWXB9G\n" +
	"PnXUsAsjKKXgOaKoMJr9NZXPqlBbJSrT0h5590hCm2ePPUVkvJKsOX6gCFnptbLz\n" +
	"F7pvb3zKDc+zXjyHPwIDAQAB\n" +
	"-----END PUBLIC KEY-----",
	// Private Key
	"-----BEGIN RSA PRIVATE KEY-----\n" +
	"MIICXAIBAAKBgQDDNpgZFC23yGSLsMo8mzTcmdnipkUHI+i8CYagTEqHO+PnejF9\n" +
	"Ep/D+MBvEtPXHSgExsDCHP8X7B6If1df58OWXB9GPnXUsAsjKKXgOaKoMJr9NZXP\n" +
	"qlBbJSrT0h5590hCm2ePPUVkvJKsOX6gCFnptbLzF7pvb3zKDc+zXjyHPwIDAQAB\n" +
	"AoGBALR4BTayI+3SkblekChlaAJFLVxOUGRgeylTOSV6QjAxWulFWvkAvbijf+tv\n" +
	"oW4uIy//OnZ57g6EmFmiN/mOvo3meBvWijHxUJG1suKrEgG8Gm0LZn0CyycTtutl\n" +
	"ziSDJ3F4whEZfuqciAFOTTgAXPRHMa/cZbSDo4aGR5mbqE0ZAkEA3+HmB/1SgwMB\n" +
	"bopCmkh+sslFhtD2xUxlXnlC3ur4rOmjtH7YE0Q2UDsJFj9eg/BA4fQ/orh9usGv\n" +
	"AVph7o6lswJBAN830Xc7cjxeF3vQyJk1vqqPf15FGvkraq7gHb5MPAtofh78PtzD\n" +
	"+hyblvWAYBstR/K6up1KG+LP6RXA43q7qkUCQA49540wjzQoV8n5X51C6VRkO1kF\n" +
	"J/2LC5PD8P4PQnx1bGWKACLRnwbhioVwyIlqGiaFjBrE07KyqXhTkJFFX8MCQAjW\n" +
	"qfmhpfVT+HQToU3HvgP86Jsv+1Bwcqn3/9WAKUR+X7gUXtzY+bdWRdT0v1l0Iowu\n" +
	"7qK5w37oop8U4y0B700CQBKRizBt1Nc02UMDzdamQsgnRjuIjlfmryfZpemyx238\n" +
	"Q0s2+cKlqbfDOUY/CAj/z1M6RaISQ0TawCX9NIGa9GI=\n" +
	"-----END RSA PRIVATE KEY-----"
	);
};

NDN.prototype.setDefaultKey = function (pubfile, prifile) {
    this.default_key = new Key();
    this.default_key.fromPemFile(pubfile, prifile);
};

NDN.prototype.getDefaultKey = function () {
    return this.default_key;
};

exports.NDN = NDN;

NDN.UNOPEN = 0;  // created but not opened yet
NDN.OPENED = 1;  // connection to ccnd opened
NDN.CLOSED = 2;  // connection to ccnd closed

NDN.ccndIdFetcher = new Name('/%C1.M.S.localhost/%C1.M.SRV/ccnd/KEY');

// Private callback fired by TcpTransport when TCP connection is established
NDN.prototype.fetchCcndId = function () {
    var i = new Interest(NDN.ccndIdFetcher);
    i.interestLifetime = 1000; // milliseconds
    this.transport.send(i.encodeToBinary());
};

// Private callback fired by TcpTransport when TCP connection is closed by remote host
NDN.prototype.closeByTransport = function () {
    this.ready_status = NDN.CLOSED;
    this.onclose();
};

// Connect NDN wrapper to local ccnd
NDN.prototype.connect = function () {
    if (this.ready_status == NDN.OPENED)
	throw new Error('Cannot connect because NDN connection is already opened.');

    this.transport.connect(this);
};

// Send packet through NDN wrapper
NDN.prototype.send = function (packet) {
    if (this.ready_status != NDN.OPENED)
	throw new Error('Cannot send because NDN connection is not opened.');
    
    if (packet instanceof Buffer)
	this.transport.send(packet);
    else if (packet instanceof Interest || packet instanceof ContentObject)
	this.transport.send(packet.encodeToBinary());
    else
	throw new Error('Cannot send object of type ' + packet.constructor.name);
};

// Close NDN wrapper
NDN.prototype.close = function () {
    if (this.ready_status != NDN.OPENED)
	throw new Error('Cannot close because NDN connection is not opened.');

    this.ready_status = NDN.CLOSED;
    this.transport.close();
};

// For fetching data
var PITTable = new Array();

var PITEntry = function PITEntry(interest) {
    this.interest = interest;  // Interest
    this.closure = [];    // Closure array
    this.timerID = -1;  // Timer ID
};

// Return the longest entry from PITTable that matches name.
var getEntryForExpressedInterest = function (/*Name*/ name) {
    var result = null;
    
    for (var i = 0; i < PITTable.length; i++) {
	if (PITTable[i].interest.matches_name(name)) {
            if (result == null || 
                PITTable[i].interest.name.components.length > result.interest.name.components.length)
                result = PITTable[i];
        }
    }
    
    return result;
};

var findIdenticalInterest = function (name) {
    for (var i = 0; i < PITTable.length; i++) {
	if (PITTable[i].interest.name.equals(name)) {
	    //XXX: different selectors are ignored for now
	    return PITTable[i];
        }
    }

    return null;
};

// For publishing data
var CSTable = new Array();

var CSEntry = function CSEntry(name, closure) {
    this.name = name;        // Name
    this.closure = closure;  // Closure
};

var getEntryForRegisteredPrefix = function (name) {
    for (var i = 0; i < CSTable.length; i++) {
	if (CSTable[i].name.isPrefixOf(name))
	    return CSTable[i];
    }
    return null;
};


/**
 * Prototype of 'onData': function (interest, contentObject) {}
 * Prototype of 'onTimeOut': function (interest) {}
 */
NDN.prototype.expressInterest = function (name, template, onData, onTimeOut) {
    if (this.ready_status != NDN.OPENED) {
	throw new Error('NDN connection is not established.');
    }

    var closure = new DataClosure(onData, onTimeOut);
    
    // Check existing entry first
    var entry = findIdenticalInterest(name);
    if (entry != null && entry.closure != null) {
	entry.closure.push(closure);
	return;
    }

    var interest = new Interest(name);
    if (template != null) {
	interest.minSuffixComponents = template.minSuffixComponents;
	interest.maxSuffixComponents = template.maxSuffixComponents;
	interest.publisherPublicKeyDigest = template.publisherPublicKeyDigest;
	interest.exclude = template.exclude;
	interest.childSelector = template.childSelector;
	interest.answerOriginKind = template.answerOriginKind;
	interest.scope = template.scope;
	interest.interestLifetime = template.interestLifetime;
    }
    else
        interest.interestLifetime = 4000;   // default interest timeout value in milliseconds.

    var pitEntry = new PITEntry(interest);
    pitEntry.closure.push(closure);
    PITTable.push(pitEntry);

    if (interest.interestLifetime == null)
	// Use default timeout value
	interest.interestLifetime = 4000;
	
    if (interest.interestLifetime > 0 && closure.onTimeout != null) {
	pitEntry.timerID = setTimeout(function() {
		if (LOG > 3) console.log("Interest time out.");
					
		// Remove PIT entry from PITTable.
		var index = PITTable.indexOf(pitEntry);
		if (index >= 0)
		    PITTable.splice(index, 1);
					
		// Raise timeout callback
		var arr_cb = pitEntry.closure;
		for (var i = 0; i < arr_cb.length; i++) {
		    if (arr_cb[i].onTimeout != null)
			arr_cb[i].onTimeout(pitEntry.interest);
		}
	    }, interest.interestLifetime);  // interestLifetime is in milliseconds.
	//console.log(closure.timerID);
    }

    this.transport.send(interest.encodeToBinary());
};

/**
 * Prototype of 'onInterest': function (interest) {}
 */
NDN.prototype.registerPrefix = function(prefix, onInterest) {
    if (this.ready_status != NDN.OPENED) {
	throw new Error('NDN connection is not established.');
    }

    if (this.ccndid == null) {
	throw new Error('ccnd node ID unkonwn. Cannot register prefix.');
    }

    if (this.default_key == null) {
	throw new Error('Cannot register prefix without default key');
    }
    
    var fe = new ForwardingEntry('selfreg', prefix, null, null, 3, 2147483647);
    var feBytes = fe.encodeToBinary();

    var co = new ContentObject(new Name(), feBytes);
    co.sign(this.default_key);  // Use default key to sign registration packet
    var coBinary = co.encodeToBinary();

    var interestName = new Name(['ccnx', this.ccndid, 'selfreg', coBinary]);
    var interest = new Interest(interestName);
    interest.scope = 1;
    
    var closure = new InterestClosure(onInterest);
    var csEntry = new CSEntry(prefix, closure);
    CSTable.push(csEntry);

    var data = interest.encodeToBinary();
    this.transport.send(data);

    if (LOG > 3) console.log('Prefix registration packet sent.');
};

/**
 * This is called when an entire binary XML element is received, such as a ContentObject or Interest.
 */
NDN.prototype.onMessage = function(msg) {
    if (LOG > 4) console.log('Complete message received. Length ' + msg.length + '. Start decoding.');
    
    var decoder = new BinaryXMLDecoder(msg);
    // Dispatch according to packet type
    if (decoder.peekStartElement(CCNProtocolDTags.Interest)) {  // Interest packet
	var interest = new Interest();
	interest.from_ccnb(decoder);
	
	if (LOG > 3) console.log('Interest name is ' + interest.name.to_uri());
	
	var entry = getEntryForRegisteredPrefix(interest.name);
	if (entry != null && entry.closure != null && entry.closure.onInterest != null) {
	    entry.closure.onInterest(interest);
	}				
    } else if (decoder.peekStartElement(CCNProtocolDTags.ContentObject)) {  // Content packet
	var co = new ContentObject();
	co.from_ccnb(decoder);

	if (LOG > 3) console.log('ContentObject name is ' + co.name.to_uri());

	if (this.ccndid == null && NDN.ccndIdFetcher.isPrefixOf(co.name)) {
	    // We are in starting phase, record publisherPublicKeyDigest in ccndid
	    if(!co.signedInfo || !co.signedInfo.publisher 
	       || !co.signedInfo.publisher.publisherPublicKeyDigest) {
		console.log("Cannot contact router, close NDN now.");
		
		// Close NDN if we fail to connect to a ccn router
		this.ready_status = NDN.CLOSED;
		this.transport.close();
	    } else {
		if (LOG>3) console.log('Connected to local ccnd.');
		this.ccndid = co.signedInfo.publisher.publisherPublicKeyDigest;
		if (LOG>3) console.log('Local ccnd ID is ' + this.ccndid.toString('hex'));
		
		// Call NDN.onopen after success
		this.ready_status = NDN.OPENED;
		this.onopen();
	    }
	} else {
	    var pitEntry = getEntryForExpressedInterest(co.name);
	    if (pitEntry != null) {
		// Remove PIT entry from PITTable
		var index = PITTable.indexOf(pitEntry);
		if (index >= 0)
		    PITTable.splice(index, 1);

		var arr_cb = pitEntry.closure;
		
		// Cancel interest timer
		clearTimeout(pitEntry.timerID);

		// No signature verification
		for (var i = 0; i < arr_cb.length; i++) {
		    var cl = arr_cb[i];
		    if (cl.onData != null)
			cl.onData(pitEntry.interest, co);
		}
	    }
	}
    }
};

var DataClosure = function DataClosure(onData, onTimeout) {
    this.onData = onData;
    this.onTimeout = onTimeout;
};

var InterestClosure = function InterestClosure(onInterest) {
    this.onInterest = onInterest;
};
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
/**
 * CryptoJS core components.
 */
var CryptoJS = CryptoJS || (function (Math, undefined) {
    /**
     * CryptoJS namespace.
     */
    var C = {};

    /**
     * Library namespace.
     */
    var C_lib = C.lib = {};

    /**
     * Base object for prototypal inheritance.
     */
    var Base = C_lib.Base = (function () {
        function F() {}

        return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function (overrides) {
                // Spawn
                F.prototype = this;
                var subtype = new F();

                // Augment
                if (overrides) {
                    subtype.mixIn(overrides);
                }

                // Create default initializer
                if (!subtype.hasOwnProperty('init')) {
                    subtype.init = function () {
                        subtype.$super.init.apply(this, arguments);
                    };
                }

                // Initializer's prototype is the subtype object
                subtype.init.prototype = subtype;

                // Reference supertype
                subtype.$super = this;

                return subtype;
            },

            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);

                return instance;
            },

            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function () {
            },

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function (properties) {
                for (var propertyName in properties) {
                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }

                // IE won't copy toString using the loop above
                if (properties.hasOwnProperty('toString')) {
                    this.toString = properties.toString;
                }
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function () {
                return this.init.prototype.extend(this);
            }
        };
    }());

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = C_lib.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.create();
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        },

        /**
         * Converts this word array to a string.
         *
         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
         *
         * @return {string} The stringified word array.
         *
         * @example
         *
         *     var string = wordArray + '';
         *     var string = wordArray.toString();
         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
         */
        toString: function (encoder) {
            return (encoder || Hex).stringify(this);
        },

        /**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */
        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            // Clamp excess bits
            this.clamp();

            // Concat
            if (thisSigBytes % 4) {
                // Copy one byte at a time
                for (var i = 0; i < thatSigBytes; i++) {
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                }
            } else if (thatWords.length > 0xffff) {
                // Copy one word at a time
                for (var i = 0; i < thatSigBytes; i += 4) {
                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                }
            } else {
                // Copy all words at once
                thisWords.push.apply(thisWords, thatWords);
            }
            this.sigBytes += thatSigBytes;

            // Chainable
            return this;
        },

        /**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */
        clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            // Clamp
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
        },

        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {WordArray} The random word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.random(16);
         */
        random: function (nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
                words.push((Math.random() * 0x100000000) | 0);
            }

            return new WordArray.init(words, nBytes);
        }
    });

    /**
     * Encoder namespace.
     */
    var C_enc = C.enc = {};

    /**
     * Hex encoding strategy.
     */
    var Hex = C_enc.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }

            return hexChars.join('');
        },

        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
         */
        parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return new WordArray.init(words, hexStrLength / 2);
        }
    };

    /**
     * Latin1 encoding strategy.
     */
    var Latin1 = C_enc.Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }

            return latin1Chars.join('');
        },

        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
         */
        parse: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }

            return new WordArray.init(words, latin1StrLength);
        }
    };

    /**
     * UTF-8 encoding strategy.
     */
    var Utf8 = C_enc.Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @example
         *
         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function (wordArray) {
            try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
                throw new Error('Malformed UTF-8 data');
            }
        },

        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
         */
        parse: function (utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };

    /**
     * Abstract buffered block algorithm template.
     *
     * The property blockSize must be implemented in a concrete subtype.
     *
     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm.reset();
         */
        reset: function () {
            // Initial values
            this._data = new WordArray.init();
            this._nDataBytes = 0;
        },

        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function (data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
                data = Utf8.parse(data);
            }

            // Append
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
        },

        /**
         * Processes available data blocks.
         *
         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The processed data.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function (doFlush) {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                // Round down to include only full blocks,
                // less the number of blocks that must remain in the buffer
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }

            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords, offset);
                }

                // Remove processed words
                var processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return new WordArray.init(processedWords, nBytesReady);
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();

            return clone;
        },

        _minBufferSize: 0
    });

    /**
     * Abstract hasher template.
     *
     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */
    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        cfg: Base.extend(),

        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = CryptoJS.algo.SHA256.create();
         */
        init: function (cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Set initial values
            this.reset();
        },

        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-hasher logic
            this._doReset();
        },

        /**
         * Updates this hasher with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {Hasher} This hasher.
         *
         * @example
         *
         *     hasher.update('message');
         *     hasher.update(wordArray);
         */
        update: function (messageUpdate) {
            // Append
            this._append(messageUpdate);

            // Update the hash
            this._process();

            // Chainable
            return this;
        },

        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The hash.
         *
         * @example
         *
         *     var hash = hasher.finalize();
         *     var hash = hasher.finalize('message');
         *     var hash = hasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this._append(messageUpdate);
            }

            // Perform concrete-hasher logic
            var hash = this._doFinalize();

            return hash;
        },

        blockSize: 512/32,

        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
         */
        _createHelper: function (hasher) {
            return function (message, cfg) {
                return new hasher.init(cfg).finalize(message);
            };
        },

        /**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} hasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
         */
        _createHmacHelper: function (hasher) {
            return function (message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
            };
        }
    });

    /**
     * Algorithm namespace.
     */
    var C_algo = C.algo = {};

    return C;
}(Math));
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function (Math) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Initialization and round constants tables
    var H = [];
    var K = [];

    // Compute constants
    (function () {
        function isPrime(n) {
            var sqrtN = Math.sqrt(n);
            for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n % factor)) {
                    return false;
                }
            }

            return true;
        }

        function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
        }

        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
            if (isPrime(n)) {
                if (nPrime < 8) {
                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                nPrime++;
            }

            n++;
        }
    }());

    // Reusable object
    var W = [];

    /**
     * SHA-256 hash algorithm.
     */
    var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init(H.slice(0));
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];

            // Computation
            for (var i = 0; i < 64; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                } else {
                    var gamma0x = W[i - 15];
                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                   (gamma0x >>> 3);

                    var gamma1x = W[i - 2];
                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
                                   (gamma1x >>> 10);

                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }

                var ch  = (e & f) ^ (~e & g);
                var maj = (a & b) ^ (a & c) ^ (b & c);

                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;

                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
            H[5] = (H[5] + f) | 0;
            H[6] = (H[6] + g) | 0;
            H[7] = (H[7] + h) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Return final computed hash
            return this._hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.SHA256('message');
     *     var hash = CryptoJS.SHA256(wordArray);
     */
    C.SHA256 = Hasher._createHelper(SHA256);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacSHA256(message, key);
     */
    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
}(Math));
var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad="=";

function hex2b64(h) {
  var i;
  var c;
  var ret = "";
  for(i = 0; i+3 <= h.length; i+=3) {
    c = parseInt(h.substring(i,i+3),16);
    ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
  }
  if(i+1 == h.length) {
    c = parseInt(h.substring(i,i+1),16);
    ret += b64map.charAt(c << 2);
  }
  else if(i+2 == h.length) {
    c = parseInt(h.substring(i,i+2),16);
    ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
  }
  if (b64pad) while((ret.length & 3) > 0) ret += b64pad;
  return ret;
}

// convert a base64 string to hex
function b64tohex(s) {
  var ret = ""
  var i;
  var k = 0; // b64 state, 0-3
  var slop;
  for(i = 0; i < s.length; ++i) {
    if(s.charAt(i) == b64pad) break;
    v = b64map.indexOf(s.charAt(i));
    if(v < 0) continue;
    if(k == 0) {
      ret += int2char(v >> 2);
      slop = v & 3;
      k = 1;
    }
    else if(k == 1) {
      ret += int2char((slop << 2) | (v >> 4));
      slop = v & 0xf;
      k = 2;
    }
    else if(k == 2) {
      ret += int2char(slop);
      ret += int2char(v >> 2);
      slop = v & 3;
      k = 3;
    }
    else {
      ret += int2char((slop << 2) | (v >> 4));
      ret += int2char(v & 0xf);
      k = 0;
    }
  }
  if(k == 1)
    ret += int2char(slop << 2);
  return ret;
}

// convert a base64 string to a byte/number array
function b64toBA(s) {
  //piggyback on b64tohex for now, optimize later
  var h = b64tohex(s);
  var i;
  var a = new Array();
  for(i = 0; 2*i < h.length; ++i) {
    a[i] = parseInt(h.substring(2*i,2*i+2),16);
  }
  return a;
}
// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2

// convert a (hex) string to a bignum object
function parseBigInt(str,r) {
  return new BigInteger(str,r);
}

function linebrk(s,n) {
  var ret = "";
  var i = 0;
  while(i + n < s.length) {
    ret += s.substring(i,i+n) + "\n";
    i += n;
  }
  return ret + s.substring(i,s.length);
}

function byte2Hex(b) {
  if(b < 0x10)
    return "0" + b.toString(16);
  else
    return b.toString(16);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s,n) {
  if(n < s.length + 11) { // TODO: fix for utf-8
    alert("Message too long for RSA");
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  while(i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if(c < 128) { // encode using utf-8
      ba[--n] = c;
    }
    else if((c > 127) && (c < 2048)) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    }
    else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while(n > 2) { // random non-zero pad
    x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

// PKCS#1 (OAEP) mask generation function
function oaep_mgf1_arr(seed, len, hash)
{
    var mask = '', i = 0;

    while (mask.length < len)
    {
        mask += hash(String.fromCharCode.apply(String, seed.concat([
                (i & 0xff000000) >> 24,
                (i & 0x00ff0000) >> 16,
                (i & 0x0000ff00) >> 8,
                i & 0x000000ff])));
        i += 1;
    }

    return mask;
}

var SHA1_SIZE = 20;

// PKCS#1 (OAEP) pad input string s to n bytes, and return a bigint
function oaep_pad(s, n, hash)
{
    if (s.length + 2 * SHA1_SIZE + 2 > n)
    {
        throw "Message too long for RSA";
    }

    var PS = '', i;

    for (i = 0; i < n - s.length - 2 * SHA1_SIZE - 2; i += 1)
    {
        PS += '\x00';
    }

    var DB = rstr_sha1('') + PS + '\x01' + s;
    var seed = new Array(SHA1_SIZE);
    new SecureRandom().nextBytes(seed);
    
    var dbMask = oaep_mgf1_arr(seed, DB.length, hash || rstr_sha1);
    var maskedDB = [];

    for (i = 0; i < DB.length; i += 1)
    {
        maskedDB[i] = DB.charCodeAt(i) ^ dbMask.charCodeAt(i);
    }

    var seedMask = oaep_mgf1_arr(maskedDB, seed.length, rstr_sha1);
    var maskedSeed = [0];

    for (i = 0; i < seed.length; i += 1)
    {
        maskedSeed[i + 1] = seed[i] ^ seedMask.charCodeAt(i);
    }

    return new BigInteger(maskedSeed.concat(maskedDB));
}

// "empty" RSA key constructor
function RSAKey() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N,E) {
  if (typeof N !== "string")
  {
    this.n = N;
    this.e = E;
  }
  else if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);
  }
  else
    alert("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
  return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
  var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
}

// Return the PKCS#1 OAEP RSA encryption of "text" as an even-length hex string
function RSAEncryptOAEP(text, hash) {
  var m = oaep_pad(text, (this.n.bitLength()+7)>>3, hash);
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
RSAKey.prototype.encryptOAEP = RSAEncryptOAEP;
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;
// Depends on rsa.js and jsbn2.js

// Version 1.1: support utf-8 decoding in pkcs1unpad2

// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
function pkcs1unpad2(d,n) {
  var b = d.toByteArray();
  var i = 0;
  while(i < b.length && b[i] == 0) ++i;
  if(b.length-i != n-1 || b[i] != 2)
    return null;
  ++i;
  while(b[i] != 0)
    if(++i >= b.length) return null;
  var ret = "";
  while(++i < b.length) {
    var c = b[i] & 255;
    if(c < 128) { // utf-8 decode
      ret += String.fromCharCode(c);
    }
    else if((c > 191) && (c < 224)) {
      ret += String.fromCharCode(((c & 31) << 6) | (b[i+1] & 63));
      ++i;
    }
    else {
      ret += String.fromCharCode(((c & 15) << 12) | ((b[i+1] & 63) << 6) | (b[i+2] & 63));
      i += 2;
    }
  }
  return ret;
}

// PKCS#1 (OAEP) mask generation function
function oaep_mgf1_str(seed, len, hash)
{
    var mask = '', i = 0;

    while (mask.length < len)
    {
        mask += hash(seed + String.fromCharCode.apply(String, [
                (i & 0xff000000) >> 24,
                (i & 0x00ff0000) >> 16,
                (i & 0x0000ff00) >> 8,
                i & 0x000000ff]));
        i += 1;
    }

    return mask;
}

var SHA1_SIZE = 20;

// Undo PKCS#1 (OAEP) padding and, if valid, return the plaintext
function oaep_unpad(d, n, hash)
{
    d = d.toByteArray();

    var i;

    for (i = 0; i < d.length; i += 1)
    {
        d[i] &= 0xff;
    }

    while (d.length < n)
    {
        d.unshift(0);
    }

    d = String.fromCharCode.apply(String, d);

    if (d.length < 2 * SHA1_SIZE + 2)
    {
        throw "Cipher too short";
    }

    var maskedSeed = d.substr(1, SHA1_SIZE)
    var maskedDB = d.substr(SHA1_SIZE + 1);

    var seedMask = oaep_mgf1_str(maskedDB, SHA1_SIZE, hash || rstr_sha1);
    var seed = [], i;

    for (i = 0; i < maskedSeed.length; i += 1)
    {
        seed[i] = maskedSeed.charCodeAt(i) ^ seedMask.charCodeAt(i);
    }

    var dbMask = oaep_mgf1_str(String.fromCharCode.apply(String, seed),
                           d.length - SHA1_SIZE, rstr_sha1);

    var DB = [];

    for (i = 0; i < maskedDB.length; i += 1)
    {
        DB[i] = maskedDB.charCodeAt(i) ^ dbMask.charCodeAt(i);
    }

    DB = String.fromCharCode.apply(String, DB);

    if (DB.substr(0, SHA1_SIZE) !== rstr_sha1(''))
    {
        throw "Hash mismatch";
    }

    DB = DB.substr(SHA1_SIZE);

    var first_one = DB.indexOf('\x01');
    var last_zero = (first_one != -1) ? DB.substr(0, first_one).lastIndexOf('\x00') : -1;

    if (last_zero + 1 != first_one)
    {
        throw "Malformed data";
    }

    return DB.substr(first_one + 1);
}

// Set the private key fields N, e, and d from hex strings
function RSASetPrivate(N,E,D) {
  if (typeof N !== "string")
  {
    this.n = N;
    this.e = E;
    this.d = D;
  }
  else if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);
    this.d = parseBigInt(D,16);
  }
  else
    alert("Invalid RSA private key");
}

// Set the private key fields N, e, d and CRT params from hex strings
function RSASetPrivateEx(N,E,D,P,Q,DP,DQ,C) {
  //alert("RSASetPrivateEx called");
  if (N == null) throw "RSASetPrivateEx N == null";
  if (E == null) throw "RSASetPrivateEx E == null";
  if (N.length == 0) throw "RSASetPrivateEx N.length == 0";
  if (E.length == 0) throw "RSASetPrivateEx E.length == 0";

  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);
    this.d = parseBigInt(D,16);
    this.p = parseBigInt(P,16);
    this.q = parseBigInt(Q,16);
    this.dmp1 = parseBigInt(DP,16);
    this.dmq1 = parseBigInt(DQ,16);
    this.coeff = parseBigInt(C,16);
  } else {
    alert("Invalid RSA private key in RSASetPrivateEx");
  }
}

// Generate a new random private key B bits long, using public expt E
function RSAGenerate(B,E) {
  var rng = new SecureRandom();
  var qs = B>>1;
  this.e = parseInt(E,16);
  var ee = new BigInteger(E,16);
  for(;;) {
    for(;;) {
      this.p = new BigInteger(B-qs,1,rng);
      if(this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
    }
    for(;;) {
      this.q = new BigInteger(qs,1,rng);
      if(this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
    }
    if(this.p.compareTo(this.q) <= 0) {
      var t = this.p;
      this.p = this.q;
      this.q = t;
    }
    var p1 = this.p.subtract(BigInteger.ONE);	// p1 = p - 1
    var q1 = this.q.subtract(BigInteger.ONE);	// q1 = q - 1
    var phi = p1.multiply(q1);
    if(phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
      this.n = this.p.multiply(this.q);	// this.n = p * q
      this.d = ee.modInverse(phi);	// this.d = 
      this.dmp1 = this.d.mod(p1);	// this.dmp1 = d mod (p - 1)
      this.dmq1 = this.d.mod(q1);	// this.dmq1 = d mod (q - 1)
      this.coeff = this.q.modInverse(this.p);	// this.coeff = (q ^ -1) mod p
      break;
    }
  }
}

// Perform raw private operation on "x": return x^d (mod n)
function RSADoPrivate(x) {
  if(this.p == null || this.q == null)
    return x.modPow(this.d, this.n);

  // TODO: re-calculate any missing CRT params
  var xp = x.mod(this.p).modPow(this.dmp1, this.p); // xp=cp?
  var xq = x.mod(this.q).modPow(this.dmq1, this.q); // xq=cq?

  while(xp.compareTo(xq) < 0)
    xp = xp.add(this.p);
  // NOTE:
  // xp.subtract(xq) => cp -cq
  // xp.subtract(xq).multiply(this.coeff).mod(this.p) => (cp - cq) * u mod p = h
  // xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq) => cq + (h * q) = M
  return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
}

// Return the PKCS#1 RSA decryption of "ctext".
// "ctext" is an even-length hex string and the output is a plain string.
function RSADecrypt(ctext) {
  var c = parseBigInt(ctext, 16);
  var m = this.doPrivate(c);
  if(m == null) return null;
  return pkcs1unpad2(m, (this.n.bitLength()+7)>>3);
}

// Return the PKCS#1 OAEP RSA decryption of "ctext".
// "ctext" is an even-length hex string and the output is a plain string.
function RSADecryptOAEP(ctext, hash) {
  var c = parseBigInt(ctext, 16);
  var m = this.doPrivate(c);
  if(m == null) return null;
  return oaep_unpad(m, (this.n.bitLength()+7)>>3, hash);
}

// Return the PKCS#1 RSA decryption of "ctext".
// "ctext" is a Base64-encoded string and the output is a plain string.
//function RSAB64Decrypt(ctext) {
//  var h = b64tohex(ctext);
//  if(h) return this.decrypt(h); else return null;
//}

// protected
RSAKey.prototype.doPrivate = RSADoPrivate;

// public
RSAKey.prototype.setPrivate = RSASetPrivate;
RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
RSAKey.prototype.generate = RSAGenerate;
RSAKey.prototype.decrypt = RSADecrypt;
RSAKey.prototype.decryptOAEP = RSADecryptOAEP;
//RSAKey.prototype.b64_decrypt = RSAB64Decrypt;
/*! crypto-1.0.4.js (c) 2013 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
/*
 * crypto.js - Cryptographic Algorithm Provider class
 *
 * Copyright (c) 2013 Kenji Urushima (kenji.urushima@gmail.com)
 *
 * This software is licensed under the terms of the MIT License.
 * http://kjur.github.com/jsrsasign/license
 *
 * The above copyright and license notice shall be 
 * included in all copies or substantial portions of the Software.
 */

/**
 * @fileOverview
 * @name crypto-1.0.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version 1.0.4 (2013-Mar-28)
 * @since 2.2
 * @license <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
 */

/** 
 * kjur's class library name space
 * @name KJUR
 * @namespace kjur's class library name space
 */
if (typeof KJUR == "undefined" || !KJUR) KJUR = {};
/**
 * kjur's cryptographic algorithm provider library name space
 * <p>
 * This namespace privides following crytpgrahic classes.
 * <ul>
 * <li>{@link KJUR.crypto.MessageDigest} - Java JCE(cryptograhic extension) style MessageDigest class</li>
 * <li>{@link KJUR.crypto.Signature} - Java JCE(cryptograhic extension) style Signature class</li>
 * <li>{@link KJUR.crypto.Util} - cryptographic utility functions and properties</li>
 * </ul>
 * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
 * </p>
 * @name KJUR.crypto
 * @namespace
 */
if (typeof KJUR.crypto == "undefined" || !KJUR.crypto) KJUR.crypto = {};

/**
 * static object for cryptographic function utilities
 * @name KJUR.crypto.Util
 * @class static object for cryptographic function utilities
 * @property {Array} DIGESTINFOHEAD PKCS#1 DigestInfo heading hexadecimal bytes for each hash algorithms
 * @description
 */
KJUR.crypto.Util = new function() {
    this.DIGESTINFOHEAD = {
	'sha1':      "3021300906052b0e03021a05000414",
        'sha224':    "302d300d06096086480165030402040500041c",
	'sha256':    "3031300d060960864801650304020105000420",
	'sha384':    "3041300d060960864801650304020205000430",
	'sha512':    "3051300d060960864801650304020305000440",
	'md2':       "3020300c06082a864886f70d020205000410",
	'md5':       "3020300c06082a864886f70d020505000410",
	'ripemd160': "3021300906052b2403020105000414"
    };

    /**
     * get hexadecimal DigestInfo
     * @name getDigestInfoHex
     * @memberOf KJUR.crypto.Util
     * @function
     * @param {String} hHash hexadecimal hash value
     * @param {String} alg hash algorithm name (ex. 'sha1')
     * @return {String} hexadecimal string DigestInfo ASN.1 structure
     */
    this.getDigestInfoHex = function(hHash, alg) {
	if (typeof this.DIGESTINFOHEAD[alg] == "undefined")
	    throw "alg not supported in Util.DIGESTINFOHEAD: " + alg;
	return this.DIGESTINFOHEAD[alg] + hHash;
    };

    /**
     * get PKCS#1 padded hexadecimal DigestInfo
     * @name getPaddedDigestInfoHex
     * @memberOf KJUR.crypto.Util
     * @function
     * @param {String} hHash hexadecimal hash value
     * @param {String} alg hash algorithm name (ex. 'sha1')
     * @param {Integer} keySize key bit length (ex. 1024)
     * @return {String} hexadecimal string of PKCS#1 padded DigestInfo
     */
    this.getPaddedDigestInfoHex = function(hHash, alg, keySize) {
	var hDigestInfo = this.getDigestInfoHex(hHash, alg);
	var pmStrLen = keySize / 4; // minimum PM length

	if (hDigestInfo.length + 22 > pmStrLen) // len(0001+ff(*8)+00+hDigestInfo)=22
	    throw "key is too short for SigAlg: keylen=" + keySize + "," + alg;

	var hHead = "0001";
	var hTail = "00" + hDigestInfo;
	var hMid = "";
	var fLen = pmStrLen - hHead.length - hTail.length;
	for (var i = 0; i < fLen; i += 2) {
	    hMid += "ff";
	}
	var hPaddedMessage = hHead + hMid + hTail;
	return hPaddedMessage;
    };

    /**
     * get hexadecimal SHA1 hash of string
     * @name sha1
     * @memberOf KJUR.crypto.Util
     * @function
     * @param {String} s input string to be hashed
     * @return {String} hexadecimal string of hash value
     * @since 1.0.3
     */
    this.sha1 = function(s) {
        var md = new KJUR.crypto.MessageDigest({'alg':'sha1', 'prov':'cryptojs'});
        return md.digestString(s);
    };

    /**
     * get hexadecimal SHA256 hash of string
     * @name sha256
     * @memberOf KJUR.crypto.Util
     * @function
     * @param {String} s input string to be hashed
     * @return {String} hexadecimal string of hash value
     * @since 1.0.3
     */
    this.sha256 = function(s) {
        var md = new KJUR.crypto.MessageDigest({'alg':'sha256', 'prov':'cryptojs'});
        return md.digestString(s);
    };

    /**
     * get hexadecimal SHA512 hash of string
     * @name sha512
     * @memberOf KJUR.crypto.Util
     * @function
     * @param {String} s input string to be hashed
     * @return {String} hexadecimal string of hash value
     * @since 1.0.3
     */
    this.sha512 = function(s) {
        var md = new KJUR.crypto.MessageDigest({'alg':'sha512', 'prov':'cryptojs'});
        return md.digestString(s);
    };

    /**
     * get hexadecimal MD5 hash of string
     * @name md5
     * @memberOf KJUR.crypto.Util
     * @function
     * @param {String} s input string to be hashed
     * @return {String} hexadecimal string of hash value
     * @since 1.0.3
     */
    this.md5 = function(s) {
        var md = new KJUR.crypto.MessageDigest({'alg':'md5', 'prov':'cryptojs'});
        return md.digestString(s);
    };

    /**
     * get hexadecimal RIPEMD160 hash of string
     * @name ripemd160
     * @memberOf KJUR.crypto.Util
     * @function
     * @param {String} s input string to be hashed
     * @return {String} hexadecimal string of hash value
     * @since 1.0.3
     */
    this.ripemd160 = function(s) {
        var md = new KJUR.crypto.MessageDigest({'alg':'ripemd160', 'prov':'cryptojs'});
        return md.digestString(s);
    };
};

/**
 * MessageDigest class which is very similar to java.security.MessageDigest class
 * @name KJUR.crypto.MessageDigest
 * @class MessageDigest class which is very similar to java.security.MessageDigest class
 * @param {Array} params parameters for constructor
 * @description
 * <br/>
 * Currently this supports following algorithm and providers combination:
 * <ul>
 * <li>md5 - cryptojs</li>
 * <li>sha1 - cryptojs</li>
 * <li>sha224 - cryptojs</li>
 * <li>sha256 - cryptojs</li>
 * <li>sha384 - cryptojs</li>
 * <li>sha512 - cryptojs</li>
 * <li>ripemd160 - cryptojs</li>
 * <li>sha256 - sjcl (NEW from crypto.js 1.0.4)</li>
 * </ul>
 * @example
 * // CryptoJS provider sample
 * &lt;script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/core.js"&gt;&lt;/script&gt;
 * &lt;script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/sha1.js"&gt;&lt;/script&gt;
 * &lt;script src="crypto-1.0.js"&gt;&lt;/script&gt;
 * var md = new KJUR.crypto.MessageDigest({alg: "sha1", prov: "cryptojs"});
 * md.updateString('aaa')
 * var mdHex = md.digest()
 *
 * // SJCL(Stanford JavaScript Crypto Library) provider sample
 * &lt;script src="http://bitwiseshiftleft.github.io/sjcl/sjcl.js"&gt;&lt;/script&gt;
 * &lt;script src="crypto-1.0.js"&gt;&lt;/script&gt;
 * var md = new KJUR.crypto.MessageDigest({alg: "sha256", prov: "sjcl"}); // sjcl supports sha256 only
 * md.updateString('aaa')
 * var mdHex = md.digest()
 */
KJUR.crypto.MessageDigest = function(params) {
    var md = null;
    var algName = null;
    var provName = null;
    var _CryptoJSMdName = {
	'md5': 'CryptoJS.algo.MD5',
	'sha1': 'CryptoJS.algo.SHA1',
	'sha224': 'CryptoJS.algo.SHA224',
	'sha256': 'CryptoJS.algo.SHA256',
	'sha384': 'CryptoJS.algo.SHA384',
	'sha512': 'CryptoJS.algo.SHA512',
	'ripemd160': 'CryptoJS.algo.RIPEMD160'
    };

    /**
     * set hash algorithm and provider
     * @name setAlgAndProvider
     * @memberOf KJUR.crypto.MessageDigest
     * @function
     * @param {String} alg hash algorithm name
     * @param {String} prov provider name
     * @description
     * @example
     * // for SHA1
     * md.setAlgAndProvider('sha1', 'cryptojs');
     * // for RIPEMD160
     * md.setAlgAndProvider('ripemd160', 'cryptojs');
     */
    this.setAlgAndProvider = function(alg, prov) {
	if (':md5:sha1:sha224:sha256:sha384:sha512:ripemd160:'.indexOf(alg) != -1 &&
	    prov == 'cryptojs') {
	    try {
		this.md = eval(_CryptoJSMdName[alg]).create();
	    } catch (ex) {
		throw "setAlgAndProvider hash alg set fail alg=" + alg + "/" + ex;
	    }
	    this.updateString = function(str) {
		this.md.update(str);
	    };
	    this.updateHex = function(hex) {
		var wHex = CryptoJS.enc.Hex.parse(hex);
		this.md.update(wHex);
	    };
	    this.digest = function() {
		var hash = this.md.finalize();
		return hash.toString(CryptoJS.enc.Hex);
	    };
	    this.digestString = function(str) {
		this.updateString(str);
		return this.digest();
	    };
	    this.digestHex = function(hex) {
		this.updateHex(hex);
		return this.digest();
	    };
	}
	if (':sha256:'.indexOf(alg) != -1 &&
	    prov == 'sjcl') {
	    try {
		this.md = new sjcl.hash.sha256();
	    } catch (ex) {
		throw "setAlgAndProvider hash alg set fail alg=" + alg + "/" + ex;
	    }
	    this.updateString = function(str) {
		this.md.update(str);
	    };
	    this.updateHex = function(hex) {
		var baHex = sjcl.codec.hex.toBits(hex);
		this.md.update(baHex);
	    };
	    this.digest = function() {
		var hash = this.md.finalize();
		return sjcl.codec.hex.fromBits(hash);
	    };
	    this.digestString = function(str) {
		this.updateString(str);
		return this.digest();
	    };
	    this.digestHex = function(hex) {
		this.updateHex(hex);
		return this.digest();
	    };
	}
    };

    /**
     * update digest by specified string
     * @name updateString
     * @memberOf KJUR.crypto.MessageDigest
     * @function
     * @param {String} str string to update
     * @description
     * @example
     * md.updateString('New York');
     */
    this.updateString = function(str) {
	throw "updateString(str) not supported for this alg/prov: " + this.algName + "/" + this.provName;
    };

    /**
     * update digest by specified hexadecimal string
     * @name updateHex
     * @memberOf KJUR.crypto.MessageDigest
     * @function
     * @param {String} hex hexadecimal string to update
     * @description
     * @example
     * md.updateHex('0afe36');
     */
    this.updateHex = function(hex) {
	throw "updateHex(hex) not supported for this alg/prov: " + this.algName + "/" + this.provName;
    };

    /**
     * completes hash calculation and returns hash result
     * @name digest
     * @memberOf KJUR.crypto.MessageDigest
     * @function
     * @description
     * @example
     * md.digest()
     */
    this.digest = function() {
	throw "digest() not supported for this alg/prov: " + this.algName + "/" + this.provName;
    };

    /**
     * performs final update on the digest using string, then completes the digest computation
     * @name digestString
     * @memberOf KJUR.crypto.MessageDigest
     * @function
     * @param {String} str string to final update
     * @description
     * @example
     * md.digestString('aaa')
     */
    this.digestString = function(str) {
	throw "digestString(str) not supported for this alg/prov: " + this.algName + "/" + this.provName;
    };

    /**
     * performs final update on the digest using hexadecimal string, then completes the digest computation
     * @name digestHex
     * @memberOf KJUR.crypto.MessageDigest
     * @function
     * @param {String} hex hexadecimal string to final update
     * @description
     * @example
     * md.digestHex('0f2abd')
     */
    this.digestHex = function(hex) {
	throw "digestHex(hex) not supported for this alg/prov: " + this.algName + "/" + this.provName;
    };

    if (typeof params != "undefined") {
	if (typeof params['alg'] != "undefined") {
	    this.algName = params['alg'];
	    this.provName = params['prov'];
	    this.setAlgAndProvider(params['alg'], params['prov']);
	}
    }
};


/**
 * Signature class which is very similar to java.security.Signature class
 * @name KJUR.crypto.Signature
 * @class Signature class which is very similar to java.security.Signature class
 * @param {Array} params parameters for constructor
 * @property {String} state Current state of this signature object whether 'SIGN', 'VERIFY' or null
 * @description
 * <br/>
 * As for params of constructor's argument, it can be specify following attributes:
 * <ul>
 * <li>alg - signature algorithm name (ex. {MD5,SHA1,SHA224,SHA256,SHA384,SHA512,RIPEMD160}withRSA)</li>
 * <li>provider - currently 'cryptojs/jsrsa' only</li>
 * <li>prvkeypem - PEM string of signer's private key. If this specified, no need to call initSign(prvKey).</li>
 * </ul>
 * <h4>SUPPORTED ALGORITHMS AND PROVIDERS</h4>
 * Signature class supports {MD5,SHA1,SHA224,SHA256,SHA384,SHA512,RIPEMD160}
 * withRSA algorithm in 'cryptojs/jsrsa' provider.
 * <h4>EXAMPLES</h4>
 * @example
 * // signature generation
 * var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA", "prov": "cryptojs/jsrsa"});
 * sig.initSign(prvKey);
 * sig.updateString('aaa');
 * var hSigVal = sig.sign();
 *
 * // signature validation
 * var sig2 = new KJUR.crypto.Signature({"alg": "SHA1withRSA", "prov": "cryptojs/jsrsa"});
 * sig2.initVerifyByCertificatePEM(cert)
 * sig.updateString('aaa');
 * var isValid = sig2.verify(hSigVal);
 */
KJUR.crypto.Signature = function(params) {
    var prvKey = null; // RSAKey for signing
    var pubKey = null; // RSAKey for verifying

    var md = null; // KJUR.crypto.MessageDigest object
    var sig = null;
    var algName = null;
    var provName = null;
    var algProvName = null;
    var mdAlgName = null;
    var pubkeyAlgName = null;
    var state = null;

    var sHashHex = null; // hex hash value for hex
    var hDigestInfo = null;
    var hPaddedDigestInfo = null;
    var hSign = null;

    this._setAlgNames = function() {
	if (this.algName.match(/^(.+)with(.+)$/)) {
	    this.mdAlgName = RegExp.$1.toLowerCase();
	    this.pubkeyAlgName = RegExp.$2.toLowerCase();
	}
    };

    this._zeroPaddingOfSignature = function(hex, bitLength) {
	var s = "";
	var nZero = bitLength / 4 - hex.length;
	for (var i = 0; i < nZero; i++) {
	    s = s + "0";
	}
	return s + hex;
    };

    /**
     * set signature algorithm and provider
     * @name setAlgAndProvider
     * @memberOf KJUR.crypto.Signature
     * @function
     * @param {String} alg signature algorithm name
     * @param {String} prov provider name
     * @description
     * @example
     * md.setAlgAndProvider('SHA1withRSA', 'cryptojs/jsrsa');
     */
    this.setAlgAndProvider = function(alg, prov) {
	this._setAlgNames();
	if (prov != 'cryptojs/jsrsa')
	    throw "provider not supported: " + prov;

	if (':md5:sha1:sha224:sha256:sha384:sha512:ripemd160:'.indexOf(this.mdAlgName) != -1) {
	    try {
		this.md = new KJUR.crypto.MessageDigest({'alg':this.mdAlgName,'prov':'cryptojs'});
	    } catch (ex) {
		throw "setAlgAndProvider hash alg set fail alg=" + this.mdAlgName + "/" + ex;
	    }

	    this.initSign = function(prvKey) {
		this.prvKey = prvKey;
		this.state = "SIGN";
	    };

	    this.initVerifyByPublicKey = function(rsaPubKey) {
		this.pubKey = rsaPubKey;
		this.state = "VERIFY";
	    };

	    this.initVerifyByCertificatePEM = function(certPEM) {
		var x509 = new X509();
		x509.readCertPEM(certPEM);
		this.pubKey = x509.subjectPublicKeyRSA;
		this.state = "VERIFY";
	    };

	    this.updateString = function(str) {
		this.md.updateString(str);
	    };
	    this.updateHex = function(hex) {
		this.md.updateHex(hex);
	    };
	    this.sign = function() {
                var util = KJUR.crypto.Util;
		var keyLen = this.prvKey.n.bitLength();
		this.sHashHex = this.md.digest();
		this.hDigestInfo = util.getDigestInfoHex(this.sHashHex, this.mdAlgName);
		this.hPaddedDigestInfo = 
                    util.getPaddedDigestInfoHex(this.sHashHex, this.mdAlgName, keyLen);

		var biPaddedDigestInfo = parseBigInt(this.hPaddedDigestInfo, 16);
		this.hoge = biPaddedDigestInfo.toString(16);

		var biSign = this.prvKey.doPrivate(biPaddedDigestInfo);
		this.hSign = this._zeroPaddingOfSignature(biSign.toString(16), keyLen);
		return this.hSign;
	    };
	    this.signString = function(str) {
		this.updateString(str);
		this.sign();
	    };
	    this.signHex = function(hex) {
		this.updateHex(hex);
		this.sign();
	    };
	    this.verify = function(hSigVal) {
                var util = KJUR.crypto.Util;
		var keyLen = this.pubKey.n.bitLength();
		this.sHashHex = this.md.digest();

		var biSigVal = parseBigInt(hSigVal, 16);
		var biPaddedDigestInfo = this.pubKey.doPublic(biSigVal);
		this.hPaddedDigestInfo = biPaddedDigestInfo.toString(16);
                var s = this.hPaddedDigestInfo;
                s = s.replace(/^1ff+00/, '');

		var hDIHEAD = KJUR.crypto.Util.DIGESTINFOHEAD[this.mdAlgName];
                if (s.indexOf(hDIHEAD) != 0) {
		    return false;
		}
		var hHashFromDI = s.substr(hDIHEAD.length);
		//alert(hHashFromDI + "\n" + this.sHashHex);
		return (hHashFromDI == this.sHashHex);
	    };
	}
    };

    /**
     * Initialize this object for verifying with a public key
     * @name initVerifyByPublicKey
     * @memberOf KJUR.crypto.Signature
     * @function
     * @param {RSAKey} rsaPubKey RSAKey object of public key
     * @since 1.0.2
     * @description
     * @example
     * sig.initVerifyByPublicKey(prvKey)
     */
    this.initVerifyByPublicKey = function(rsaPubKey) {
	throw "initVerifyByPublicKey(rsaPubKeyy) not supported for this alg:prov=" + this.algProvName;
    };

    /**
     * Initialize this object for verifying with a certficate
     * @name initVerifyByCertificatePEM
     * @memberOf KJUR.crypto.Signature
     * @function
     * @param {String} certPEM PEM formatted string of certificate
     * @since 1.0.2
     * @description
     * @example
     * sig.initVerifyByCertificatePEM(certPEM)
     */
    this.initVerifyByCertificatePEM = function(certPEM) {
	throw "initVerifyByCertificatePEM(certPEM) not supported for this alg:prov=" + this.algProvName;
    };

    /**
     * Initialize this object for signing
     * @name initSign
     * @memberOf KJUR.crypto.Signature
     * @function
     * @param {RSAKey} prvKey RSAKey object of private key
     * @description
     * @example
     * sig.initSign(prvKey)
     */
    this.initSign = function(prvKey) {
	throw "initSign(prvKey) not supported for this alg:prov=" + this.algProvName;
    };

    /**
     * Updates the data to be signed or verified by a string
     * @name updateString
     * @memberOf KJUR.crypto.Signature
     * @function
     * @param {String} str string to use for the update
     * @description
     * @example
     * sig.updateString('aaa')
     */
    this.updateString = function(str) {
	throw "updateString(str) not supported for this alg:prov=" + this.algProvName;
    };

    /**
     * Updates the data to be signed or verified by a hexadecimal string
     * @name updateHex
     * @memberOf KJUR.crypto.Signature
     * @function
     * @param {String} hex hexadecimal string to use for the update
     * @description
     * @example
     * sig.updateHex('1f2f3f')
     */
    this.updateHex = function(hex) {
	throw "updateHex(hex) not supported for this alg:prov=" + this.algProvName;
    };

    /**
     * Returns the signature bytes of all data updates as a hexadecimal string
     * @name sign
     * @memberOf KJUR.crypto.Signature
     * @function
     * @return the signature bytes as a hexadecimal string
     * @description
     * @example
     * var hSigValue = sig.sign()
     */
    this.sign = function() {
	throw "sign() not supported for this alg:prov=" + this.algProvName;
    };

    /**
     * performs final update on the sign using string, then returns the signature bytes of all data updates as a hexadecimal string
     * @name signString
     * @memberOf KJUR.crypto.Signature
     * @function
     * @param {String} str string to final update
     * @return the signature bytes of a hexadecimal string
     * @description
     * @example
     * var hSigValue = sig.signString('aaa')
     */
    this.signString = function(str) {
	throw "digestString(str) not supported for this alg:prov=" + this.algProvName;
    };

    /**
     * performs final update on the sign using hexadecimal string, then returns the signature bytes of all data updates as a hexadecimal string
     * @name signHex
     * @memberOf KJUR.crypto.Signature
     * @function
     * @param {String} hex hexadecimal string to final update
     * @return the signature bytes of a hexadecimal string
     * @description
     * @example
     * var hSigValue = sig.signHex('1fdc33')
     */
    this.signHex = function(hex) {
	throw "digestHex(hex) not supported for this alg:prov=" + this.algProvName;
    };

    /**
     * verifies the passed-in signature.
     * @name verify
     * @memberOf KJUR.crypto.Signature
     * @function
     * @param {String} str string to final update
     * @return {Boolean} true if the signature was verified, otherwise false
     * @description
     * @example
     * var isValid = sig.verify('1fbcefdca4823a7(snip)')
     */
    this.verify = function(hSigVal) {
	throw "verify(hSigVal) not supported for this alg:prov=" + this.algProvName;
    };

    if (typeof params != "undefined") {
	if (typeof params['alg'] != "undefined") {
	    this.algName = params['alg'];
	    this.provName = params['prov'];
	    this.algProvName = params['alg'] + ":" + params['prov'];
	    this.setAlgAndProvider(params['alg'], params['prov']);
	    this._setAlgNames();
	}
	if (typeof params['prvkeypem'] != "undefined") {
	    if (typeof params['prvkeypas'] != "undefined") {
		throw "both prvkeypem and prvkeypas parameters not supported";
	    } else {
		try {
		    var prvKey = new RSAKey();
		    prvKey.readPrivateKeyFromPEMString(params['prvkeypem']);
		    this.initSign(prvKey);
		} catch (ex) {
		    throw "fatal error to load pem private key: " + ex;
		}
	    }
	}
    }
};

/*! rsapem-1.1.js (c) 2012 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
//
// rsa-pem.js - adding function for reading/writing PKCS#1 PEM private key
//              to RSAKey class.
//
// version: 1.1.1 (2013-Apr-12)
//
// Copyright (c) 2010-2013 Kenji Urushima (kenji.urushima@gmail.com)
//
// This software is licensed under the terms of the MIT License.
// http://kjur.github.com/jsrsasign/license/
//
// The above copyright and license notice shall be 
// included in all copies or substantial portions of the Software.
// 
//
// Depends on:
//
//
//
// _RSApem_pemToBase64(sPEM)
//
//   removing PEM header, PEM footer and space characters including
//   new lines from PEM formatted RSA private key string.
//

/**
 * @fileOverview
 * @name rsapem-1.1.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version 1.1
 * @license <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
 */
function _rsapem_pemToBase64(sPEMPrivateKey) {
  var s = sPEMPrivateKey;
  s = s.replace("-----BEGIN RSA PRIVATE KEY-----", "");
  s = s.replace("-----END RSA PRIVATE KEY-----", "");
  s = s.replace(/[ \n]+/g, "");
  return s;
}

function _rsapem_getPosArrayOfChildrenFromHex(hPrivateKey) {
  var a = new Array();
  var v1 = ASN1HEX.getStartPosOfV_AtObj(hPrivateKey, 0);
  var n1 = ASN1HEX.getPosOfNextSibling_AtObj(hPrivateKey, v1);
  var e1 = ASN1HEX.getPosOfNextSibling_AtObj(hPrivateKey, n1);
  var d1 = ASN1HEX.getPosOfNextSibling_AtObj(hPrivateKey, e1);
  var p1 = ASN1HEX.getPosOfNextSibling_AtObj(hPrivateKey, d1);
  var q1 = ASN1HEX.getPosOfNextSibling_AtObj(hPrivateKey, p1);
  var dp1 = ASN1HEX.getPosOfNextSibling_AtObj(hPrivateKey, q1);
  var dq1 = ASN1HEX.getPosOfNextSibling_AtObj(hPrivateKey, dp1);
  var co1 = ASN1HEX.getPosOfNextSibling_AtObj(hPrivateKey, dq1);
  a.push(v1, n1, e1, d1, p1, q1, dp1, dq1, co1);
  return a;
}

function _rsapem_getHexValueArrayOfChildrenFromHex(hPrivateKey) {
  var posArray = _rsapem_getPosArrayOfChildrenFromHex(hPrivateKey);
  var v =  ASN1HEX.getHexOfV_AtObj(hPrivateKey, posArray[0]);
  var n =  ASN1HEX.getHexOfV_AtObj(hPrivateKey, posArray[1]);
  var e =  ASN1HEX.getHexOfV_AtObj(hPrivateKey, posArray[2]);
  var d =  ASN1HEX.getHexOfV_AtObj(hPrivateKey, posArray[3]);
  var p =  ASN1HEX.getHexOfV_AtObj(hPrivateKey, posArray[4]);
  var q =  ASN1HEX.getHexOfV_AtObj(hPrivateKey, posArray[5]);
  var dp = ASN1HEX.getHexOfV_AtObj(hPrivateKey, posArray[6]);
  var dq = ASN1HEX.getHexOfV_AtObj(hPrivateKey, posArray[7]);
  var co = ASN1HEX.getHexOfV_AtObj(hPrivateKey, posArray[8]);
  var a = new Array();
  a.push(v, n, e, d, p, q, dp, dq, co);
  return a;
}

/**
 * read RSA private key from a ASN.1 hexadecimal string
 * @name readPrivateKeyFromASN1HexString
 * @memberOf RSAKey#
 * @function
 * @param {String} keyHex ASN.1 hexadecimal string of PKCS#1 private key.
 * @since 1.1.1
 */
function _rsapem_readPrivateKeyFromASN1HexString(keyHex) {
  var a = _rsapem_getHexValueArrayOfChildrenFromHex(keyHex);
  this.setPrivateEx(a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8]);
}

/**
 * read PKCS#1 private key from a string
 * @name readPrivateKeyFromPEMString
 * @memberOf RSAKey#
 * @function
 * @param {String} keyPEM string of PKCS#1 private key.
 */
function _rsapem_readPrivateKeyFromPEMString(keyPEM) {
  var keyB64 = _rsapem_pemToBase64(keyPEM);
  var keyHex = b64tohex(keyB64) // depends base64.js
  var a = _rsapem_getHexValueArrayOfChildrenFromHex(keyHex);
  this.setPrivateEx(a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8]);
}

RSAKey.prototype.readPrivateKeyFromPEMString = _rsapem_readPrivateKeyFromPEMString;
RSAKey.prototype.readPrivateKeyFromASN1HexString = _rsapem_readPrivateKeyFromASN1HexString;
/*! rsasign-1.2.2.js (c) 2012 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
//
// rsa-sign.js - adding signing functions to RSAKey class.
//
//
// version: 1.2.2 (13 May 2013)
//
// Copyright (c) 2010-2013 Kenji Urushima (kenji.urushima@gmail.com)
//
// This software is licensed under the terms of the MIT License.
// http://kjur.github.com/jsrsasign/license/
//
// The above copyright and license notice shall be 
// included in all copies or substantial portions of the Software.

//
// Depends on:
//   function sha1.hex(s) of sha1.js
//   jsbn.js
//   jsbn2.js
//   rsa.js
//   rsa2.js
//

// keysize / pmstrlen
//  512 /  128
// 1024 /  256
// 2048 /  512
// 4096 / 1024

/**
 * @fileOverview
 * @name rsasign-1.2.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version 1.2.2
 * @license <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
 */

/**
 * @property {Dictionary} _RSASIGN_DIHEAD
 * @description Array of head part of hexadecimal DigestInfo value for hash algorithms.
 * You can add any DigestInfo hash algorith for signing.
 * See PKCS#1 v2.1 spec (p38).
 */
var _RSASIGN_DIHEAD = [];
_RSASIGN_DIHEAD['sha1'] =      "3021300906052b0e03021a05000414";
_RSASIGN_DIHEAD['sha256'] =    "3031300d060960864801650304020105000420";
_RSASIGN_DIHEAD['sha384'] =    "3041300d060960864801650304020205000430";
_RSASIGN_DIHEAD['sha512'] =    "3051300d060960864801650304020305000440";
_RSASIGN_DIHEAD['md2'] =       "3020300c06082a864886f70d020205000410";
_RSASIGN_DIHEAD['md5'] =       "3020300c06082a864886f70d020505000410";
_RSASIGN_DIHEAD['ripemd160'] = "3021300906052b2403020105000414";

/**
 * @property {Dictionary} _RSASIGN_HASHHEXFUNC
 * @description Array of functions which calculate hash and returns it as hexadecimal.
 * You can add any hash algorithm implementations.
 */
var _RSASIGN_HASHHEXFUNC = [];
_RSASIGN_HASHHEXFUNC['sha1'] =      function(s){return KJUR.crypto.Util.sha1(s);};
_RSASIGN_HASHHEXFUNC['sha256'] =    function(s){return KJUR.crypto.Util.sha256(s);}
_RSASIGN_HASHHEXFUNC['sha512'] =    function(s){return KJUR.crypto.Util.sha512(s);}
_RSASIGN_HASHHEXFUNC['md5'] =       function(s){return KJUR.crypto.Util.md5(s);};
_RSASIGN_HASHHEXFUNC['ripemd160'] = function(s){return KJUR.crypto.Util.ripemd160(s);};

//_RSASIGN_HASHHEXFUNC['sha1'] =   function(s){return sha1.hex(s);}   // http://user1.matsumoto.ne.jp/~goma/js/hash.html
//_RSASIGN_HASHHEXFUNC['sha256'] = function(s){return sha256.hex;}    // http://user1.matsumoto.ne.jp/~goma/js/hash.html

var _RE_HEXDECONLY = new RegExp("");
_RE_HEXDECONLY.compile("[^0-9a-f]", "gi");

// ========================================================================
// Signature Generation
// ========================================================================

function _rsasign_getHexPaddedDigestInfoForString(s, keySize, hashAlg) {
    var pmStrLen = keySize / 4;
    var hashFunc = _RSASIGN_HASHHEXFUNC[hashAlg];
    var sHashHex = hashFunc(s);

    var sHead = "0001";
    var sTail = "00" + _RSASIGN_DIHEAD[hashAlg] + sHashHex;
    var sMid = "";
    var fLen = pmStrLen - sHead.length - sTail.length;
    for (var i = 0; i < fLen; i += 2) {
	sMid += "ff";
    }
    sPaddedMessageHex = sHead + sMid + sTail;
    return sPaddedMessageHex;
}

function _zeroPaddingOfSignature(hex, bitLength) {
    var s = "";
    var nZero = bitLength / 4 - hex.length;
    for (var i = 0; i < nZero; i++) {
	s = s + "0";
    }
    return s + hex;
}

/**
 * sign for a message string with RSA private key.<br/>
 * @name signString
 * @memberOf RSAKey#
 * @function
 * @param {String} s message string to be signed.
 * @param {String} hashAlg hash algorithm name for signing.<br/>
 * @return returns hexadecimal string of signature value.
 */
function _rsasign_signString(s, hashAlg) {
    //alert("this.n.bitLength() = " + this.n.bitLength());
    var hPM = _rsasign_getHexPaddedDigestInfoForString(s, this.n.bitLength(), hashAlg);
    var biPaddedMessage = parseBigInt(hPM, 16);
    var biSign = this.doPrivate(biPaddedMessage);
    var hexSign = biSign.toString(16);
    return _zeroPaddingOfSignature(hexSign, this.n.bitLength());
}

function _rsasign_signStringWithSHA1(s) {
    return _rsasign_signString.call(this, s, 'sha1');
}

function _rsasign_signStringWithSHA256(s) {
    return _rsasign_signString.call(this, s, 'sha256');
}

// PKCS#1 (PSS) mask generation function
function pss_mgf1_str(seed, len, hash) {
    var mask = '', i = 0;

    while (mask.length < len) {
        mask += hash(seed + String.fromCharCode.apply(String, [
                (i & 0xff000000) >> 24,
                (i & 0x00ff0000) >> 16,
                (i & 0x0000ff00) >> 8,
                i & 0x000000ff]));
        i += 1;
    }

    return mask;
}

/**
 * sign for a message string with RSA private key by PKCS#1 PSS signing.<br/>
 * @name signStringPSS
 * @memberOf RSAKey#
 * @function
 * @param {String} s message string to be signed.
 * @param {String} hashAlg hash algorithm name for signing.<br/>
 * @return returns hexadecimal string of signature value.
 */
function _rsasign_signStringPSS(s, hashAlg, sLen) {
    var hashFunc = _RSASIGN_HASHRAWFUNC[hashAlg];
    var mHash = hashFunc(s);
    var hLen = mHash.length;
    var emBits = this.n.bitLength() - 1;
    var emLen = Math.ceil(emBits / 8);
    var i;

    if (sLen === -1) {
        sLen = hLen; // same has hash length
    } else if ((sLen === -2) || (sLen === undefined)) {
        sLen = emLen - hLen - 2; // maximum
    } else if (sLen < -2) {
        throw "invalid salt length";
    }

    if (emLen < (hLen + sLen + 2)) {
        throw "data too long";
    }

    var salt = '';

    if (sLen > 0) {
        salt = new Array(sLen);
        new SecureRandom().nextBytes(salt);
        salt = String.fromCharCode.apply(String, salt);
    }

    var H = hashFunc('\x00\x00\x00\x00\x00\x00\x00\x00' + mHash + salt);
    var PS = [];

    for (i = 0; i < emLen - sLen - hLen - 2; i += 1) {
        PS[i] = 0x00;
    }

    var DB = String.fromCharCode.apply(String, PS) + '\x01' + salt;
    var dbMask = pss_mgf1_str(H, DB.length, hashFunc);
    var maskedDB = [];

    for (i = 0; i < DB.length; i += 1) {
        maskedDB[i] = DB.charCodeAt(i) ^ dbMask.charCodeAt(i);
    }

    var mask = (0xff00 >> (8 * emLen - emBits)) & 0xff;
    maskedDB[0] &= ~mask;

    for (i = 0; i < hLen; i++) {
        maskedDB.push(H.charCodeAt(i));
    }

    maskedDB.push(0xbc);

    return _zeroPaddingOfSignature(
            this.doPrivate(new BigInteger(maskedDB)).toString(16),
            this.n.bitLength());
}

// ========================================================================
// Signature Verification
// ========================================================================

function _rsasign_getDecryptSignatureBI(biSig, hN, hE) {
    var rsa = new RSAKey();
    rsa.setPublic(hN, hE);
    var biDecryptedSig = rsa.doPublic(biSig);
    return biDecryptedSig;
}

function _rsasign_getHexDigestInfoFromSig(biSig, hN, hE) {
    var biDecryptedSig = _rsasign_getDecryptSignatureBI(biSig, hN, hE);
    var hDigestInfo = biDecryptedSig.toString(16).replace(/^1f+00/, '');
    return hDigestInfo;
}

function _rsasign_getAlgNameAndHashFromHexDisgestInfo(hDigestInfo) {
    for (var algName in _RSASIGN_DIHEAD) {
	var head = _RSASIGN_DIHEAD[algName];
	var len = head.length;
	if (hDigestInfo.substring(0, len) == head) {
	    var a = [algName, hDigestInfo.substring(len)];
	    return a;
	}
    }
    return [];
}

function _rsasign_verifySignatureWithArgs(sMsg, biSig, hN, hE) {
    var hDigestInfo = _rsasign_getHexDigestInfoFromSig(biSig, hN, hE);
    var digestInfoAry = _rsasign_getAlgNameAndHashFromHexDisgestInfo(hDigestInfo);
    if (digestInfoAry.length == 0) return false;
    var algName = digestInfoAry[0];
    var diHashValue = digestInfoAry[1];
    var ff = _RSASIGN_HASHHEXFUNC[algName];
    var msgHashValue = ff(sMsg);
    return (diHashValue == msgHashValue);
}

function _rsasign_verifyHexSignatureForMessage(hSig, sMsg) {
    var biSig = parseBigInt(hSig, 16);
    var result = _rsasign_verifySignatureWithArgs(sMsg, biSig,
						  this.n.toString(16),
						  this.e.toString(16));
    return result;
}

/**
 * verifies a sigature for a message string with RSA public key.<br/>
 * @name verifyString
 * @memberOf RSAKey#
 * @function
 * @param {String} sMsg message string to be verified.
 * @param {String} hSig hexadecimal string of siganture.<br/>
 *                 non-hexadecimal charactors including new lines will be ignored.
 * @return returns 1 if valid, otherwise 0
 */
function _rsasign_verifyString(sMsg, hSig) {
    hSig = hSig.replace(_RE_HEXDECONLY, '');
    if (hSig.length != this.n.bitLength() / 4) return 0;
    hSig = hSig.replace(/[ \n]+/g, "");
    var biSig = parseBigInt(hSig, 16);
    var biDecryptedSig = this.doPublic(biSig);
    var hDigestInfo = biDecryptedSig.toString(16).replace(/^1f+00/, '');
    var digestInfoAry = _rsasign_getAlgNameAndHashFromHexDisgestInfo(hDigestInfo);
  
    if (digestInfoAry.length == 0) return false;
    var algName = digestInfoAry[0];
    var diHashValue = digestInfoAry[1];
    var ff = _RSASIGN_HASHHEXFUNC[algName];
    var msgHashValue = ff(sMsg);
    return (diHashValue == msgHashValue);
}

/**
 * verifies a sigature for a message string with RSA public key by PKCS#1 PSS sign.<br/>
 * @name verifyStringPSS
 * @memberOf RSAKey#
 * @function
 * @param {String} sMsg message string to be verified.
 * @param {String} hSig hexadecimal string of siganture.<br/>
 *                 non-hexadecimal charactors including new lines will be ignored.
 * @return returns 1 if valid, otherwise 0
 */
function _rsasign_verifyStringPSS(sMsg, hSig, hashAlg, sLen) {
    if (hSig.length !== this.n.bitLength() / 4) {
        return false;
    }

    var hashFunc = _RSASIGN_HASHRAWFUNC[hashAlg];
    var mHash = hashFunc(sMsg);
    var hLen = mHash.length;
    var emBits = this.n.bitLength() - 1;
    var emLen = Math.ceil(emBits / 8);
    var i;

    if (sLen === -1) {
        sLen = hLen; // same has hash length
    } else if ((sLen === -2) || (sLen === undefined)) {
        sLen = emLen - hLen - 2; // maximum
    } else if (sLen < -2) {
        throw "invalid salt length";
    }

    if (emLen < (hLen + sLen + 2)) {
        throw "data too long";
    }

    var em = this.doPublic(parseBigInt(hSig, 16)).toByteArray();

    for (i = 0; i < em.length; i += 1) {
        em[i] &= 0xff;
    }

    while (em.length < emLen) {
        em.unshift(0);
    }

    if (em[emLen -1] !== 0xbc) {
        throw "encoded message does not end in 0xbc";
    }

    em = String.fromCharCode.apply(String, em);

    var maskedDB = em.substr(0, emLen - hLen - 1);
    var H = em.substr(maskedDB.length, hLen);

    var mask = (0xff00 >> (8 * emLen - emBits)) & 0xff;

    if ((maskedDB.charCodeAt(0) & mask) !== 0) {
        throw "bits beyond keysize not zero";
    }

    var dbMask = pss_mgf1_str(H, maskedDB.length, hashFunc);
    var DB = [];

    for (i = 0; i < maskedDB.length; i += 1) {
        DB[i] = maskedDB.charCodeAt(i) ^ dbMask.charCodeAt(i);
    }

    DB[0] &= ~mask;

    var checkLen = emLen - hLen - sLen - 2;

    for (i = 0; i < checkLen; i += 1) {
        if (DB[i] !== 0x00) {
            throw "leftmost octets not zero";
        }
    }

    if (DB[checkLen] !== 0x01) {
        throw "0x01 marker not found";
    }

    return H === hashFunc('\x00\x00\x00\x00\x00\x00\x00\x00' + mHash +
                          String.fromCharCode.apply(String, DB.slice(-sLen)));
}

RSAKey.prototype.signString = _rsasign_signString;
RSAKey.prototype.signStringWithSHA1 = _rsasign_signStringWithSHA1;
RSAKey.prototype.signStringWithSHA256 = _rsasign_signStringWithSHA256;
RSAKey.prototype.sign = _rsasign_signString;
RSAKey.prototype.signWithSHA1 = _rsasign_signStringWithSHA1;
RSAKey.prototype.signWithSHA256 = _rsasign_signStringWithSHA256;
RSAKey.prototype.signStringPSS = _rsasign_signStringPSS;
RSAKey.prototype.signPSS = _rsasign_signStringPSS;
RSAKey.SALT_LEN_HLEN = -1;
RSAKey.SALT_LEN_MAX = -2;

RSAKey.prototype.verifyString = _rsasign_verifyString;
RSAKey.prototype.verifyHexSignatureForMessage = _rsasign_verifyHexSignatureForMessage;
RSAKey.prototype.verify = _rsasign_verifyString;
RSAKey.prototype.verifyHexSignatureForByteArrayMessage = _rsasign_verifyHexSignatureForMessage;
RSAKey.prototype.verifyStringPSS = _rsasign_verifyStringPSS;
RSAKey.prototype.verifyPSS = _rsasign_verifyStringPSS;
RSAKey.SALT_LEN_RECOVER = -2;

/**
 * @name RSAKey
 * @class key of RSA public key algorithm
 * @description Tom Wu's RSA Key class and extension
 */
/*! asn1hex-1.1.js (c) 2012 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
//
// asn1hex.js - Hexadecimal represented ASN.1 string library
//
// version: 1.1 (09-May-2012)
//
// Copyright (c) 2010-2012 Kenji Urushima (kenji.urushima@gmail.com)
//
// This software is licensed under the terms of the MIT License.
// http://kjur.github.com/jsrsasign/license/
//
// The above copyright and license notice shall be 
// included in all copies or substantial portions of the Software.
//
// Depends on:
//

// MEMO:
//   f('3082025b02...', 2) ... 82025b ... 3bytes
//   f('020100', 2) ... 01 ... 1byte
//   f('0203001...', 2) ... 03 ... 1byte
//   f('02818003...', 2) ... 8180 ... 2bytes
//   f('3080....0000', 2) ... 80 ... -1
//
//   Requirements:
//   - ASN.1 type octet length MUST be 1. 
//     (i.e. ASN.1 primitives like SET, SEQUENCE, INTEGER, OCTETSTRING ...)
//   - 

/**
 * @fileOverview
 * @name asn1hex-1.1.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version 1.1
 * @license <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
 */

/**
 * get byte length for ASN.1 L(length) bytes
 * @name getByteLengthOfL_AtObj
 * @memberOf ASN1HEX
 * @function
 * @param {String} s hexadecimal string of ASN.1 DER encoded data
 * @param {Number} pos string index
 * @return byte length for ASN.1 L(length) bytes
 */
function _asnhex_getByteLengthOfL_AtObj(s, pos) {
  if (s.substring(pos + 2, pos + 3) != '8') return 1;
  var i = parseInt(s.substring(pos + 3, pos + 4));
  if (i == 0) return -1; 		// length octet '80' indefinite length
  if (0 < i && i < 10) return i + 1;	// including '8?' octet;
  return -2;				// malformed format
}


/**
 * get hexadecimal string for ASN.1 L(length) bytes
 * @name getHexOfL_AtObj
 * @memberOf ASN1HEX
 * @function
 * @param {String} s hexadecimal string of ASN.1 DER encoded data
 * @param {Number} pos string index
 * @return {String} hexadecimal string for ASN.1 L(length) bytes
 */
function _asnhex_getHexOfL_AtObj(s, pos) {
  var len = _asnhex_getByteLengthOfL_AtObj(s, pos);
  if (len < 1) return '';
  return s.substring(pos + 2, pos + 2 + len * 2);
}

//
//   getting ASN.1 length value at the position 'idx' of
//   hexa decimal string 's'.
//
//   f('3082025b02...', 0) ... 82025b ... ???
//   f('020100', 0) ... 01 ... 1
//   f('0203001...', 0) ... 03 ... 3
//   f('02818003...', 0) ... 8180 ... 128
/**
 * get integer value of ASN.1 length for ASN.1 data
 * @name getIntOfL_AtObj
 * @memberOf ASN1HEX
 * @function
 * @param {String} s hexadecimal string of ASN.1 DER encoded data
 * @param {Number} pos string index
 * @return ASN.1 L(length) integer value
 */
function _asnhex_getIntOfL_AtObj(s, pos) {
  var hLength = _asnhex_getHexOfL_AtObj(s, pos);
  if (hLength == '') return -1;
  var bi;
  if (parseInt(hLength.substring(0, 1)) < 8) {
     bi = parseBigInt(hLength, 16);
  } else {
     bi = parseBigInt(hLength.substring(2), 16);
  }
  return bi.intValue();
}

/**
 * get ASN.1 value starting string position for ASN.1 object refered by index 'idx'.
 * @name getStartPosOfV_AtObj
 * @memberOf ASN1HEX
 * @function
 * @param {String} s hexadecimal string of ASN.1 DER encoded data
 * @param {Number} pos string index
 */
function _asnhex_getStartPosOfV_AtObj(s, pos) {
  var l_len = _asnhex_getByteLengthOfL_AtObj(s, pos);
  if (l_len < 0) return l_len;
  return pos + (l_len + 1) * 2;
}

/**
 * get hexadecimal string of ASN.1 V(value)
 * @name getHexOfV_AtObj
 * @memberOf ASN1HEX
 * @function
 * @param {String} s hexadecimal string of ASN.1 DER encoded data
 * @param {Number} pos string index
 * @return {String} hexadecimal string of ASN.1 value.
 */
function _asnhex_getHexOfV_AtObj(s, pos) {
  var pos1 = _asnhex_getStartPosOfV_AtObj(s, pos);
  var len = _asnhex_getIntOfL_AtObj(s, pos);
  return s.substring(pos1, pos1 + len * 2);
}

/**
 * get hexadecimal string of ASN.1 TLV at
 * @name getHexOfTLV_AtObj
 * @memberOf ASN1HEX
 * @function
 * @param {String} s hexadecimal string of ASN.1 DER encoded data
 * @param {Number} pos string index
 * @return {String} hexadecimal string of ASN.1 TLV.
 * @since 1.1
 */
function _asnhex_getHexOfTLV_AtObj(s, pos) {
  var hT = s.substr(pos, 2);
  var hL = _asnhex_getHexOfL_AtObj(s, pos);
  var hV = _asnhex_getHexOfV_AtObj(s, pos);
  return hT + hL + hV;
}

/**
 * get next sibling starting index for ASN.1 object string
 * @name getPosOfNextSibling_AtObj
 * @memberOf ASN1HEX
 * @function
 * @param {String} s hexadecimal string of ASN.1 DER encoded data
 * @param {Number} pos string index
 * @return next sibling starting index for ASN.1 object string
 */
function _asnhex_getPosOfNextSibling_AtObj(s, pos) {
  var pos1 = _asnhex_getStartPosOfV_AtObj(s, pos);
  var len = _asnhex_getIntOfL_AtObj(s, pos);
  return pos1 + len * 2;
}

/**
 * get array of indexes of child ASN.1 objects
 * @name getPosArrayOfChildren_AtObj
 * @memberOf ASN1HEX
 * @function
 * @param {String} s hexadecimal string of ASN.1 DER encoded data
 * @param {Number} start string index of ASN.1 object
 * @return {Array of Number} array of indexes for childen of ASN.1 objects
 */
function _asnhex_getPosArrayOfChildren_AtObj(h, pos) {
  var a = new Array();
  var p0 = _asnhex_getStartPosOfV_AtObj(h, pos);
  a.push(p0);

  var len = _asnhex_getIntOfL_AtObj(h, pos);
  var p = p0;
  var k = 0;
  while (1) {
    var pNext = _asnhex_getPosOfNextSibling_AtObj(h, p);
    if (pNext == null || (pNext - p0  >= (len * 2))) break;
    if (k >= 200) break;

    a.push(pNext);
    p = pNext;

    k++;
  }

  return a;
}

/**
 * get string index of nth child object of ASN.1 object refered by h, idx
 * @name getNthChildIndex_AtObj
 * @memberOf ASN1HEX
 * @function
 * @param {String} h hexadecimal string of ASN.1 DER encoded data
 * @param {Number} idx start string index of ASN.1 object
 * @param {Number} nth for child
 * @return {Number} string index of nth child.
 * @since 1.1
 */
function _asnhex_getNthChildIndex_AtObj(h, idx, nth) {
  var a = _asnhex_getPosArrayOfChildren_AtObj(h, idx);
  return a[nth];
}

// ========== decendant methods ==============================

/**
 * get string index of nth child object of ASN.1 object refered by h, idx
 * @name getDecendantIndexByNthList
 * @memberOf ASN1HEX
 * @function
 * @param {String} h hexadecimal string of ASN.1 DER encoded data
 * @param {Number} currentIndex start string index of ASN.1 object
 * @param {Array of Number} nthList array list of nth
 * @return {Number} string index refered by nthList
 * @since 1.1
 */
function _asnhex_getDecendantIndexByNthList(h, currentIndex, nthList) {
  if (nthList.length == 0) {
    return currentIndex;
  }
  var firstNth = nthList.shift();
  var a = _asnhex_getPosArrayOfChildren_AtObj(h, currentIndex);
  return _asnhex_getDecendantIndexByNthList(h, a[firstNth], nthList);
}

/**
 * get hexadecimal string of ASN.1 TLV refered by current index and nth index list.
 * @name getDecendantHexTLVByNthList
 * @memberOf ASN1HEX
 * @function
 * @param {String} h hexadecimal string of ASN.1 DER encoded data
 * @param {Number} currentIndex start string index of ASN.1 object
 * @param {Array of Number} nthList array list of nth
 * @return {Number} hexadecimal string of ASN.1 TLV refered by nthList
 * @since 1.1
 */
function _asnhex_getDecendantHexTLVByNthList(h, currentIndex, nthList) {
  var idx = _asnhex_getDecendantIndexByNthList(h, currentIndex, nthList);
  return _asnhex_getHexOfTLV_AtObj(h, idx);
}

/**
 * get hexadecimal string of ASN.1 V refered by current index and nth index list.
 * @name getDecendantHexVByNthList
 * @memberOf ASN1HEX
 * @function
 * @param {String} h hexadecimal string of ASN.1 DER encoded data
 * @param {Number} currentIndex start string index of ASN.1 object
 * @param {Array of Number} nthList array list of nth
 * @return {Number} hexadecimal string of ASN.1 V refered by nthList
 * @since 1.1
 */
function _asnhex_getDecendantHexVByNthList(h, currentIndex, nthList) {
  var idx = _asnhex_getDecendantIndexByNthList(h, currentIndex, nthList);
  return _asnhex_getHexOfV_AtObj(h, idx);
}

// ========== class definition ==============================

/**
 * ASN.1 DER encoded hexadecimal string utility class
 * @class ASN.1 DER encoded hexadecimal string utility class
 * @author Kenji Urushima
 * @version 1.1 (09 May 2012)
 * @see <a href="http://kjur.github.com/jsrsasigns/">'jwrsasign'(RSA Sign JavaScript Library) home page http://kjur.github.com/jsrsasign/</a>
 * @since 1.1
 */
function ASN1HEX() {
  return ASN1HEX;
}

ASN1HEX.getByteLengthOfL_AtObj = _asnhex_getByteLengthOfL_AtObj;
ASN1HEX.getHexOfL_AtObj = _asnhex_getHexOfL_AtObj;
ASN1HEX.getIntOfL_AtObj = _asnhex_getIntOfL_AtObj;
ASN1HEX.getStartPosOfV_AtObj = _asnhex_getStartPosOfV_AtObj;
ASN1HEX.getHexOfV_AtObj = _asnhex_getHexOfV_AtObj;
ASN1HEX.getHexOfTLV_AtObj = _asnhex_getHexOfTLV_AtObj;
ASN1HEX.getPosOfNextSibling_AtObj = _asnhex_getPosOfNextSibling_AtObj;
ASN1HEX.getPosArrayOfChildren_AtObj = _asnhex_getPosArrayOfChildren_AtObj;
ASN1HEX.getNthChildIndex_AtObj = _asnhex_getNthChildIndex_AtObj;
ASN1HEX.getDecendantIndexByNthList = _asnhex_getDecendantIndexByNthList;
ASN1HEX.getDecendantHexVByNthList = _asnhex_getDecendantHexVByNthList;
ASN1HEX.getDecendantHexTLVByNthList = _asnhex_getDecendantHexTLVByNthList;
/*! x509-1.1.js (c) 2012 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
// 
// x509.js - X509 class to read subject public key from certificate.
//
// version: 1.1 (10-May-2012)
//
// Copyright (c) 2010-2012 Kenji Urushima (kenji.urushima@gmail.com)
//
// This software is licensed under the terms of the MIT License.
// http://kjur.github.com/jsrsasign/license
//
// The above copyright and license notice shall be 
// included in all copies or substantial portions of the Software.
// 

// Depends:
//   base64.js
//   rsa.js
//   asn1hex.js

/**
 * @fileOverview
 * @name x509-1.1.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version 1.1
 * @license <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
 */

function _x509_pemToBase64(sCertPEM) {
  var s = sCertPEM;
  s = s.replace("-----BEGIN CERTIFICATE-----", "");
  s = s.replace("-----END CERTIFICATE-----", "");
  s = s.replace(/[ \n]+/g, "");
  return s;
}

function _x509_pemToHex(sCertPEM) {
  var b64Cert = _x509_pemToBase64(sCertPEM);
  var hCert = b64tohex(b64Cert);
  return hCert;
}

function _x509_getHexTbsCertificateFromCert(hCert) {
  var pTbsCert = ASN1HEX.getStartPosOfV_AtObj(hCert, 0);
  return pTbsCert;
}

// NOTE: privateKeyUsagePeriod field of X509v2 not supported.
// NOTE: v1 and v3 supported
function _x509_getSubjectPublicKeyInfoPosFromCertHex(hCert) {
  var pTbsCert = ASN1HEX.getStartPosOfV_AtObj(hCert, 0);
  var a = ASN1HEX.getPosArrayOfChildren_AtObj(hCert, pTbsCert); 
  if (a.length < 1) return -1;
  if (hCert.substring(a[0], a[0] + 10) == "a003020102") { // v3
    if (a.length < 6) return -1;
    return a[6];
  } else {
    if (a.length < 5) return -1;
    return a[5];
  }
}

// NOTE: Without BITSTRING encapsulation.
function _x509_getSubjectPublicKeyPosFromCertHex(hCert) {
  var pInfo = _x509_getSubjectPublicKeyInfoPosFromCertHex(hCert);
  if (pInfo == -1) return -1;    
  var a = ASN1HEX.getPosArrayOfChildren_AtObj(hCert, pInfo); 
  if (a.length != 2) return -1;
  var pBitString = a[1];
  if (hCert.substring(pBitString, pBitString + 2) != '03') return -1;
  var pBitStringV = ASN1HEX.getStartPosOfV_AtObj(hCert, pBitString);

  if (hCert.substring(pBitStringV, pBitStringV + 2) != '00') return -1;
  return pBitStringV + 2;
}

function _x509_getPublicKeyHexArrayFromCertHex(hCert) {
  var p = _x509_getSubjectPublicKeyPosFromCertHex(hCert);
  var a = ASN1HEX.getPosArrayOfChildren_AtObj(hCert, p); 
  if (a.length != 2) return [];
  var hN = ASN1HEX.getHexOfV_AtObj(hCert, a[0]);
  var hE = ASN1HEX.getHexOfV_AtObj(hCert, a[1]);
  if (hN != null && hE != null) {
    return [hN, hE];
  } else {
    return [];
  }
}

function _x509_getPublicKeyHexArrayFromCertPEM(sCertPEM) {
  var hCert = _x509_pemToHex(sCertPEM);
  var a = _x509_getPublicKeyHexArrayFromCertHex(hCert);
  return a;
}

// ===== get basic fields from hex =====================================
/**
 * get hexadecimal string of serialNumber field of certificate.<br/>
 * @name getSerialNumberHex
 * @memberOf X509#
 * @function
 */
function _x509_getSerialNumberHex() {
  return ASN1HEX.getDecendantHexVByNthList(this.hex, 0, [0, 1]);
}

/**
 * get hexadecimal string of issuer field of certificate.<br/>
 * @name getIssuerHex
 * @memberOf X509#
 * @function
 */
function _x509_getIssuerHex() {
  return ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 3]);
}

/**
 * get string of issuer field of certificate.<br/>
 * @name getIssuerString
 * @memberOf X509#
 * @function
 */
function _x509_getIssuerString() {
  return _x509_hex2dn(ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 3]));
}

/**
 * get hexadecimal string of subject field of certificate.<br/>
 * @name getSubjectHex
 * @memberOf X509#
 * @function
 */
function _x509_getSubjectHex() {
  return ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 5]);
}

/**
 * get string of subject field of certificate.<br/>
 * @name getSubjectString
 * @memberOf X509#
 * @function
 */
function _x509_getSubjectString() {
  return _x509_hex2dn(ASN1HEX.getDecendantHexTLVByNthList(this.hex, 0, [0, 5]));
}

/**
 * get notBefore field string of certificate.<br/>
 * @name getNotBefore
 * @memberOf X509#
 * @function
 */
function _x509_getNotBefore() {
  var s = ASN1HEX.getDecendantHexVByNthList(this.hex, 0, [0, 4, 0]);
  s = s.replace(/(..)/g, "%$1");
  s = decodeURIComponent(s);
  return s;
}

/**
 * get notAfter field string of certificate.<br/>
 * @name getNotAfter
 * @memberOf X509#
 * @function
 */
function _x509_getNotAfter() {
  var s = ASN1HEX.getDecendantHexVByNthList(this.hex, 0, [0, 4, 1]);
  s = s.replace(/(..)/g, "%$1");
  s = decodeURIComponent(s);
  return s;
}

// ===== read certificate =====================================

_x509_DN_ATTRHEX = {
    "0603550406": "C",
    "060355040a": "O",
    "060355040b": "OU",
    "0603550403": "CN",
    "0603550405": "SN",
    "0603550408": "ST",
    "0603550407": "L" };

function _x509_hex2dn(hDN) {
  var s = "";
  var a = ASN1HEX.getPosArrayOfChildren_AtObj(hDN, 0);
  for (var i = 0; i < a.length; i++) {
    var hRDN = ASN1HEX.getHexOfTLV_AtObj(hDN, a[i]);
    s = s + "/" + _x509_hex2rdn(hRDN);
  }
  return s;
}

function _x509_hex2rdn(hRDN) {
    var hType = ASN1HEX.getDecendantHexTLVByNthList(hRDN, 0, [0, 0]);
    var hValue = ASN1HEX.getDecendantHexVByNthList(hRDN, 0, [0, 1]);
    var type = "";
    try { type = _x509_DN_ATTRHEX[hType]; } catch (ex) { type = hType; }
    hValue = hValue.replace(/(..)/g, "%$1");
    var value = decodeURIComponent(hValue);
    return type + "=" + value;
}

// ===== read certificate =====================================


/**
 * read PEM formatted X.509 certificate from string.<br/>
 * @name readCertPEM
 * @memberOf X509#
 * @function
 * @param {String} sCertPEM string for PEM formatted X.509 certificate
 */
function _x509_readCertPEM(sCertPEM) {
  var hCert = _x509_pemToHex(sCertPEM);
  var a = _x509_getPublicKeyHexArrayFromCertHex(hCert);
  var rsa = new RSAKey();
  rsa.setPublic(a[0], a[1]);
  this.subjectPublicKeyRSA = rsa;
  this.subjectPublicKeyRSA_hN = a[0];
  this.subjectPublicKeyRSA_hE = a[1];
  this.hex = hCert;
}

function _x509_readCertPEMWithoutRSAInit(sCertPEM) {
  var hCert = _x509_pemToHex(sCertPEM);
  var a = _x509_getPublicKeyHexArrayFromCertHex(hCert);
  this.subjectPublicKeyRSA.setPublic(a[0], a[1]);
  this.subjectPublicKeyRSA_hN = a[0];
  this.subjectPublicKeyRSA_hE = a[1];
  this.hex = hCert;
}

/**
 * X.509 certificate class.<br/>
 * @class X.509 certificate class
 * @property {RSAKey} subjectPublicKeyRSA Tom Wu's RSAKey object
 * @property {String} subjectPublicKeyRSA_hN hexadecimal string for modulus of RSA public key
 * @property {String} subjectPublicKeyRSA_hE hexadecimal string for public exponent of RSA public key
 * @property {String} hex hexacedimal string for X.509 certificate.
 * @author Kenji Urushima
 * @version 1.0.1 (08 May 2012)
 * @see <a href="http://kjur.github.com/jsrsasigns/">'jwrsasign'(RSA Sign JavaScript Library) home page http://kjur.github.com/jsrsasign/</a>
 */
function X509() {
  this.subjectPublicKeyRSA = null;
  this.subjectPublicKeyRSA_hN = null;
  this.subjectPublicKeyRSA_hE = null;
  this.hex = null;
}

X509.prototype.readCertPEM = _x509_readCertPEM;
X509.prototype.readCertPEMWithoutRSAInit = _x509_readCertPEMWithoutRSAInit;
X509.prototype.getSerialNumberHex = _x509_getSerialNumberHex;
X509.prototype.getIssuerHex = _x509_getIssuerHex;
X509.prototype.getSubjectHex = _x509_getSubjectHex;
X509.prototype.getIssuerString = _x509_getIssuerString;
X509.prototype.getSubjectString = _x509_getSubjectString;
X509.prototype.getNotBefore = _x509_getNotBefore;
X509.prototype.getNotAfter = _x509_getNotAfter;

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Extended JavaScript BN functions, required for RSA private ops.

// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

// (public)
function bnClone() { var r = nbi(); this.copyTo(r); return r; }

// (public) return value as integer
function bnIntValue() {
  if(this.s < 0) {
    if(this.t == 1) return this[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this[0];
  else if(this.t == 0) return 0;
  // assumes 16 < DB < 32
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
}

// (public) return value as byte
function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

// (public) return value as short (assumes DB>=16)
function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) alternate constructor
function bnpFromNumber(a,b,c) {
  if("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))	// force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
      if(this.isEven()) this.dAddOffset(1,0); // force odd
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this[i]&((1<<p)-1))<<(8-p);
        d |= this[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}

function bnEquals(a) { return(this.compareTo(a)==0); }
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
}

// (public) this & a
function op_and(x,y) { return x&y; }
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

// (public) this | a
function op_or(x,y) { return x|y; }
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

// (public) this ^ a
function op_xor(x,y) { return x^y; }
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

// (public) this & ~a
function op_andnot(x,y) { return x&~y; }
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

// (public) ~this
function bnNot() {
  var r = nbi();
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}

// (public) this << n
function bnShiftLeft(n) {
  var r = nbi();
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
}

// (public) this >> n
function bnShiftRight(n) {
  var r = nbi();
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for(var i = 0; i < this.t; ++i)
    if(this[i] != 0) return i*this.DB+lbit(this[i]);
  if(this.s < 0) return this.t*this.DB;
  return -1;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0, x = this.s&this.DM;
  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
  return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this[j]&(1<<(n%this.DB)))!=0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
}

// (public) this | (1<<n)
function bnSetBit(n) { return this.changeBit(n,op_or); }

// (public) this & ~(1<<n)
function bnClearBit(n) { return this.changeBit(n,op_andnot); }

// (public) this ^ (1<<n)
function bnFlipBit(n) { return this.changeBit(n,op_xor); }

// (protected) r = this + a
function bnpAddTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]+a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r[i++] = c;
  else if(c < -1) r[i++] = this.DV+c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

// (public) this - a
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

// (public) this * a
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

// (public) this^2
function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

// (public) this / a
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

// (public) this % a
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a,q,r);
  return new Array(q,r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n,w) {
  if(n == 0) return;
  while(this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while(this[w] >= this.DV) {
    this[w] -= this.DV;
    if(++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
}

// A "null" reducer
function NullExp() {}
function nNop(x) { return x; }
function nMulTo(x,y,r) { x.multiplyTo(y,r); }
function nSqrTo(x,r) { x.squareTo(r); }

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) { return this.exp(e,new NullExp()); }

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0; // assumes a,this >= 0
  r.t = i;
  while(i > 0) r[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
  r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0; // assumes a,this >= 0
  while(--i >= 0) r[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

function barrettConvert(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
}

function barrettRevert(x) { return x; }

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = x*y mod m; x,y != r
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e,m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = nbi();
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }

  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e[j]>>(i-k1))&km;
    else {
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
    }

    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {	// ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }

    while(j >= 0 && (e[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
  return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
}

var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    //Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// JSBN-specific extension
BigInteger.prototype.square = bnSquare;

// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)
