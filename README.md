# BitByteArray

[![npm version](https://img.shields.io/npm/v/@zekfad/bitbytearray?style=for-the-badge)](https://www.npmjs.com/package/@zekfad/bitbytearray)![node version](https://img.shields.io/node/v/@zekfad/bitbytearray?style=for-the-badge)

Simple basic bits array for JavaScript.

## Install

Install via npm:

```
npm install --save @zekfad/bitbytearray
```

## Usage

### Example

Simple array of bits:

```js
const BitByteArray = require('./BitByteArray.js');

const myBitsArray = new BitByteArray(16);

console.log([ ...myBitsArray, ]);
/*
[
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
]
*/

myBitsArray.assign([
	0, 1, 0, 0, 1, 0, 0, 0,
]);

myBitsArray.assign(
	[
		0, 1, 1, 0, 1, 0, 0, 1,
	],
	8
);

console.log(myBitsArray.toString()); // Hi
```

Manipulate strings:

```js
const BitByteArray = require('./BitByteArray.js');

const utf8string = 'UTF-8 Строка';
const myBitsArray = BitByteArray.from(utf8string);

console.log([ ...myBitsArray, ]);
/*
[
  0, 1, 0, 1, 0, 1, 0, 1,
  0, 1, 0, 1, 0, 1, 0, 0,
  0, 1, 0, 0, 0, 1, 1, 0,
  0, 0, 1, 0, 1, 1, 0, 1,
  0, 0, 1, 1, 1, 0, 0, 0,
  0, 0, 1, 0, 0, 0, 0, 0,
  1, 1, 0, 1, 0, 0, 0, 0,
  1, 0, 1, 0, 0, 0, 0, 1,
  1, 1, 0, 1, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 1, 0,
  1, 1, 0, 1, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 0, 1,
  ... 44 more items
]
*/

console.log(utf8string === myBitsArray.toString()); // false
console.log(utf8string === myBitsArray.toString('utf8')); // true
console.log(myBitsArray.toString('utf8')); // UTF-8 Строка

// Change dash to space
myBitsArray.assign(
	[
		0, 0, 1, 0, 0, 0, 0, 0,
	],
	3 * 8
)

console.log(myBitsArray.toString('utf-8')); // UTF 8 Строка
```

Array-like access by index:

```js
const BitByteArray = require('./BitByteArray.js');

const myBitsArray = BitByteArray.from(2);

console.log([...myBitsArray, ]);
/*
[
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 0
]
*/

myBitsArray[29] = 1;

console.log([ ...myBitsArray, ]);
/*
[
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 0
]
*/

console.log(
	parseInt(
		[ ...myBitsArray, ]
			.join(''),
		2
	)
); // 6
```

### Notes
This module doesn't implement all methods of normal `Array`, you should use spread operator (`[ ...myBitsArray, ]`), if you need to work with bits in array-like way, and then use `BitByteArray.from(BitByteArray.projectBitsArray(myNormalArray))`.


## API

### `BitByteArray` class

#### `BitByteArray.safe(length)`

Get class representing an array of bits with index assign checks.

* `length` (`number`) - Bits array length.

Returns `BitByteArray`


#### `BitByteArray.from(source)`

Create an array of bits from existing data.

* `source` (`number`|`number[]`|`boolean`|`boolean[]`|`string`) - Source data.

returns `BitByteArray` - Created BitByteArray.


#### `new BitByteArray(length)`

Create an array of bits.

* `length` (`number`) - Bits array length.


### `BitByteArray` instance

#### `length`

Get/set array of bits' length.


#### `setLength(length)`

Change array of bits' length.

* `length` (`number`) - Bits array length.

Returns `number` - Bits array length.


#### `setBit(offset, bit)`

Change bit on a given offset.

* `offset` (`number`) - Bit offset.
* `bit` (`number`|`boolean`) - Bit.

Returns `number` - Bit.


#### `getBit(offset)`

Get bit on a given offset.

* `offset` (`number`) - Bit offset.

Returns `number` - Bit.


#### `getBytes()`

Get local storage of bytes as an array of numbers.

Returns `number[]` - Bytes array.


#### `toString(encoding)`

Get local storage of bytes as a string.

* `encoding` (`string`) - Encoding.

Returns `string` - String representation of bits array.


#### `assign(bits, offset)`

Assign array of bits to an instance.

* `bits` (`number[]`|`boolean[]`) - Bits array.
* `offset` (`number`) - Assign offset.

Returns `boolean` - Returns true if no errors found.


#### `fill(bit)`

Fill local storage of bits with a provided bit.

* `bit` (`number`|`boolean`) - Bit.

Returns `BitByteArray` - Returns instance if no errors found.


#### `*[Symbol.iterator]()`

Generate bits sequence.

Yields `number` - Next number in the sequence.


#### ***`[index]`***

Access a bit by index in array-like way (in read-write mode).

Returns `number` - Bit.


#### ***Internal: `checkOffset(offset)`***

Check if given offset is acceptable.

* offset (`number`) - Bit offset.

Returns `boolean` - Returns true if given argument is acceptable.


#### ***Internal: `setBytes(length)`***

Change array of bits' count of bytes.

* `length` (`number`) - Count of bytes.

Returns `number` - Count of bytes.
