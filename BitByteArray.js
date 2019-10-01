const BitByte = require('@zekfad/bitbyte');

/** Class representing an array of bits. */
class BitByteArray {
	/**
	 * Create an array of bits.
	 * @param {number} length - Bits array length.
	 */
	constructor(length = 0) {
		if ('[object Number]' !== Object.prototype.toString.call(length))
			throw new Error('Length must be a number');
		this.bytes = [];
		this.length = length;
	}
	/**
	 * Set array of bits' length.
	 * @type {number}
	 */
	set length(length) {
		this.bits = this.setLength(length);
	}
	/**
	 * Get array of bits' length.
	 * @type {number}
	 */
	get length() {
		return this.bits;
	}
	/**
	 * Change array of bits' length.
	 * @param {number} length - Bits array length.
	 * @returns {number} - Bits array length.
	 */
	setLength(length) {
		if ('[object Number]' !== Object.prototype.toString.call(length))
			throw new Error('Length must be a number');
		this.setBytes(Math.ceil(length / 8));
		let actions = this.length > length ? this.length : length;
		for (let i = 0; i < actions; i++) {
			if (i <= length) {
				Object.defineProperty(this, i, {
					get: function () {
						return this.getBit(i);
					},
					set: function (newBit) {
						return this.setBit(i, newBit);
					},
					enumerable  : true,
					configurable: true,
				});
			} else delete this[i];
		}
		return length;
	}
	/**
	 * Change array of bits' count of bytes.
	 * @param {number} length - Count of bytes.
	 * @returns {number} - Count of bytes.
	 */
	setBytes(length) {
		if ('[object Number]' !== Object.prototype.toString.call(length))
			throw new Error('Length must be a number');
		for (let i = 0; i < length; i++) {
			if (i >= this.bytes.length) {
				this.bytes[i] = new BitByte();
			}
		}
		return this.bytes.length = length;
	}
	/**
	 * Change bit on a given offset.
	 * @param {number} offset - Bit offset.
	 * @param {number|boolean} bit - Bit.
	 * @returns {number} - Bit.
	 */
	setBit(offset, bit) {
		this.checkOffset(offset);
		return this.bytes[Math.floor(offset / 8)].setBit(offset % 8, bit);
	}
	/**
	 * Get bit on a given offset.
	 * @param {number} offset - Bit offset.
	 * @returns {number} - Bit.
	 */
	getBit(offset) {
		this.checkOffset(offset);
		return this.bytes[Math.floor(offset / 8)].getBit(offset % 8);
	}
	/**
	 * Get local storage of bytes as an array of numbers.
	 * @returns {number[]} - Bytes array.
	 */
	getBytes() {
		return this.bytes.map(byte => byte.getByte());
	}
	/**
	 * Get local storage of bytes as a string.
	 * @param {string} encoding - Encoding.
	 * @returns {string} - String representation of bits array.
	 */
	toString(encoding = 'ascii') {
		encoding = encoding.toLowerCase();
		if ('utf8' === encoding || 'utf-8' === encoding) {
			let bytes = this.getBytes(),
				out = [];

			for (let i = 0; i < bytes.length; i++) {
				out.push(`%${bytes[i].toString(16)}`);
			}
			try {
				return decodeURIComponent(out.join(''));
			} catch (error) {
				return this.toString('ascii');
			}
		}
		return this.getBytes()
			.map(byte => String.fromCharCode(byte))
			.join('');
	}
	/**
	 * Assign array of bits to an instance.
	 * @param {number[]|boolean[]} bits - Bits array.
	 * @param {number} offset - Assign offset.
	 * @returns {boolean} - Returns true if no errors found.
	 */
	assign(bits, offset = 0) {
		if ('[object Array]' !== Object.prototype.toString.call(bits) && !(bits instanceof BitByteArray))
			throw new Error('Bits must be an array or BitByteArray instance');
		if ('[object Number]' !== Object.prototype.toString.call(offset))
			throw new Error('Offset must be a number');
		[ ...bits, ].forEach((bit, index) => this.setBit(offset + index, bit));
		return true;
	}
	/**
	 * Fill local storage of bits with a provided bit.
	 * @param {number|boolean} bit - Bit.
	 * @returns {BitByteArray} - Returns instance if no errors found.
	 */
	fill(bit = 0) {
		for (var i = 0; i < this.length; i++) {
			this.setBit(i, bit);
		}
		return this;
	}
	/**
	 * Check if given offset is acceptable.
	 * @param {number} offset - Bit offset.
	 * @returns {boolean} - Returns true if given argument is acceptable.
	 */
	checkOffset(offset) {
		if ('[object Number]' !== Object.prototype.toString.call(offset)) {
			throw new Error('Offset must be a number');
		}
		if (offset >= this.length || offset < 0) {
			throw new Error('Offset must be less than array length');
		}
		return true;
	}
	/**
	 * Generate bits sequence.
	 * @yields {number} - Next number in the sequence.
	 */
	*[Symbol.iterator]() {
		for (let i = 0; i < this.length; i++) {
			yield this.getBit(i);
		}
	}
}

/**
 * Add left padding for provided array and return array of bits.
 * @param {number[]|boolean[]} source - Source data.
 * @param {number} length - Required array length.
 * @returns {number[]} - Padded array.
 */
function bitsArrayLeftPad(source, length) {
	let output = [];

	output.length = length;

	for (let i = output.length - 1; i > -1; i--) {
		output[i] = !source[i - (output.length - source.length)] ^ true;
	}

	return output;
}

/**
 * Create an array of bits from existing data.
 * @param {number|number[]|boolean|boolean[]|string} source - Source data.
 * @returns {BitByteArray} - Created BitByteArray.
 */
BitByteArray.from = function (source) {
	let bitsArray = new BitByteArray();

	switch (Object.prototype.toString.call(source)) {
		case '[object Number]':
			var data = (source >>> 0)
					.toString(2)
					.split('')
					.map(i => +i),
				fullBitsArray = bitsArrayLeftPad(data, 4 * 8);

			bitsArray.length = fullBitsArray.length;
			bitsArray.assign(fullBitsArray);
			break;
		case '[object Boolean]':
			bitsArray.length = 1;
			bitsArray.setBit(0, source);
			break;
		case '[object Array]':
			var isBooleansArray = true,
				isNumbersArary = true,
				isCharsArray = true;
			for (let i = 0; i < source.length; i++) {
				if (true === isBooleansArray)
					if ('[object Boolean]' !== Object.prototype.toString.call(source[i]))
						isBooleansArray = false;
				if (true === isNumbersArary)
					if ('[object Number]' === Object.prototype.toString.call(source[i])
						|| '[object Boolean]' === Object.prototype.toString.call(source[i])) {
						if (true === isCharsArray)
							isCharsArray = source[i] > -1 && source[i] <= 255;
					} else {
						isNumbersArary = false;
						isCharsArray = false;
					}
			}
			if (isBooleansArray) {
				bitsArray.length = source.length;
				bitsArray.assign(source);
			} else if (isNumbersArary) {
				let tempBitsArray = [];
				if (isCharsArray) {
					source.forEach(char => {
						char ^= false;
						[ ...new BitByte(char), ]
							.forEach(bit => tempBitsArray.push(bit));
					});
				} else {
					source.forEach(number => {
						let binaryNumber = BitByteArray.from(number);

						tempBitsArray.push(...bitsArrayLeftPad([ ...binaryNumber, ], binaryNumber.bytes.length * 8));
					});
				}
				bitsArray.length = tempBitsArray.length;
				bitsArray.assign(tempBitsArray);
			}
			break;
		case '[object String]':
			var tempBitsArray = [],
				bytes = [],
				uriString = encodeURIComponent(source);

			for (let i = 0; i < uriString.length; i++) {
				if (uriString[i] !== '%' && uriString[i].charCodeAt(0) <= 255)
					bytes.push(uriString[i].charCodeAt(0));
				else {
					bytes.push(parseInt(uriString[i + 1] + uriString[i + 2], 16));
					i += 2;
				}
			}

			bytes.forEach(char => {
				[ ...new BitByte(char), ]
					.forEach(bit => tempBitsArray.push(bit));
			});

			bitsArray.length = tempBitsArray.length;
			bitsArray.assign(tempBitsArray);
			break;
	}
	return bitsArray;
};

/**
 * Get class representing an array of bits with index assign checks.
 * @param {number} length - Bits array length.
 * @returns {BitByteArray}
 */
BitByteArray.safe = function (...args) {
	return new Proxy(new BitByteArray(...args), {
		get: function (obj, prop) {
			if ('[object Symbol]' !== Object.prototype.toString.call(prop) && !isNaN(+prop))
				obj.checkOffset(+prop);
			return obj[prop];
		},
		set: function (obj, prop, value) {
			if ('[object Symbol]' !== Object.prototype.toString.call(prop) && !isNaN(+prop))
				obj.checkOffset(+prop);
			return obj[prop] = value;
		},
	});
};

/**
 * Create booleans array from provided source array.
 * @param {Array.} source - Source array.
 * @returns {boolean[]} - Booleans array.
 */
BitByteArray.projectBitsArray = function (source) {
	if ('[object Array]' !== Object.prototype.toString.call(source) && !(source instanceof BitByteArray))
		throw new Error('Source must be an array or BitByteArray instance');
	return [ ...source, ].map(elem => !elem ^ true);
};

module.exports = BitByteArray;
