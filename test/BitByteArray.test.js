const
	assert = require('assert'),
	BitByteArray = require('../BitByteArray.js');

describe('BitByteArray', () => {

	describe('#assign()', function () {

		it('should assign provided array of bits to beginning of local storage of bits', () => {
			let bitsArray = new BitByteArray(8);

			assert.equal(
				bitsArray.assign([
					1, 1, 1, 1,
				]),
				true
			);

			for (let i = 0; i < 4; i++) {
				assert.equal(bitsArray.getBit(i), 1);
			}

			for (let i = 4; i < 8; i++) {
				assert.equal(bitsArray.getBit(i), 0);
			}

			let bitsArray2 = new BitByteArray(8);

			assert.equal(
				bitsArray2.assign(bitsArray),
				true
			);

			for (let i = 0; i < 4; i++) {
				assert.equal(bitsArray2.getBit(i), 1);
			}

			for (let i = 4; i < 8; i++) {
				assert.equal(bitsArray2.getBit(i), 0);
			}
		});

		it('should assign provided array of bits to provided offset of local storage of bits', () => {
			let bitsArray = new BitByteArray(8);

			assert.equal(
				bitsArray.assign(
					[
						1, 1, 1, 1,
					],
					4
				),
				true
			);

			for (let i = 0; i < 4; i++) {
				assert.equal(bitsArray.getBit(i), 0);
			}

			for (let i = 4; i < 8; i++) {
				assert.equal(bitsArray.getBit(i), 1);
			}

			let bitsArray2 = new BitByteArray(4),
				bitsArray3 = new BitByteArray(8);

			bitsArray2.fill(1);

			assert.equal(
				bitsArray3.assign(bitsArray2, 4),
				true
			);

			for (let i = 0; i < 4; i++) {
				assert.equal(bitsArray3.getBit(i), 0);
			}

			for (let i = 4; i < 8; i++) {
				assert.equal(bitsArray3.getBit(i), 1);
			}
		});

	});

	describe('#length', () => {

		it('should display actual bits count', () => {
			let bitsArray = new BitByteArray(8);

			assert.equal(bitsArray.length, 8);
		});

		it('should resize local storage of bits', () => {
			let bitsArray = new BitByteArray(8);

			assert.equal(bitsArray.bits, 8);

			bitsArray.length = 4;

			assert.equal(bitsArray.bits, 4);

			bitsArray.length = 16;

			assert.equal(bitsArray.bits, 16);
		});
	});

	describe('bits manipulation', () => {

		describe('using index', () => {

			it('should display requested bit', () => {
				let bitsArray = new BitByteArray(8);

				bitsArray.assign([
					0, 1,
				]);

				assert.equal(bitsArray[0], 0);
				assert.equal(bitsArray[1], 1);
			});

			it('should edit requested bit', () => {
				let bitsArray = new BitByteArray(8);

				assert.equal(bitsArray[0], 0);

				bitsArray[0] = 1;

				assert.equal(bitsArray[0], 1);
			});

		});

		describe('using methods', () => {

			it('should display requested bit', () => {
				let bitsArray = new BitByteArray(8);

				bitsArray.assign([
					0, 1,
				]);

				assert.equal(bitsArray.getBit(0), 0);
				assert.equal(bitsArray.getBit(1), 1);
			});

			it('should edit requested bit', () => {
				let bitsArray = new BitByteArray(8);

				assert.equal(bitsArray.getBit(0), 0);

				bitsArray.setBit(0, 1);

				assert.equal(bitsArray.getBit(0), 1);
			});

		});

	});

	describe('#getBytes()', () => {

		it('should display local storage of bits as an array of bytes', () => {
			let bitsArray = new BitByteArray(16);

			for (var i = 0; i < bitsArray.length; i++) {
				bitsArray.setBit(i, 1);
			}

			assert.deepEqual(
				[ ...bitsArray.getBytes(), ],
				[
					255,
					255,
				]
			);
		});

	});

	describe('#toString()', () => {

		it('should display local storage of bits as a string', () => {
			let bitsArray = new BitByteArray(16);

			bitsArray.assign([
				0, 1, 0, 0, 1, 0, 0, 0,
			]);
			bitsArray.assign(
				[
					0, 1, 1, 0, 1, 0, 0, 1,
				],
				8
			);

			assert.equal(bitsArray.toString(), 'Hi');
		});

	});

	describe('#safe', () => {

		describe('proxy for BitByteArray', () => {

			it('should throw an error on out of index get request', () => {
				let bitsArray = new BitByteArray.safe();

				assert.throws(() => bitsArray.getBit(-1));
				assert.throws(() => bitsArray.getBit(8));
			});

			it('should throw an error on out of index set request', () => {
				let bitsArray = new BitByteArray.safe();

				assert.throws(() => bitsArray.setBit(-1));
				assert.throws(() => bitsArray.setBit(8));
			});

			// If main tests for get and set doesn't fail, we don't need to test proxy

		});

	});

	describe('#projectBitsArray', () => {

		it('should create booleans array from provided source array', () => {
			assert.deepEqual(
				[
					...BitByteArray.projectBitsArray([
						1, 500, 0,
					]),
				],
				[
					true, true, false,
				]
			);
		});

	});

	describe('#from', () => {

		describe('number', () => {

			it('should create BitByteArray with the only one 32 bit integer', () => {
				assert.deepEqual(
					[ ...BitByteArray.from(-1), ],
					[
						1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					]
				);
			});

		});

		describe('boolean', () => {

			it('should create BitByteArray with the only one bit', () => {
				assert.deepEqual(
					[ ...BitByteArray.from(true), ],
					[ 1, ]
				);
			});

		});

		describe('array of numbers', () => {

			it('if any of numbers is not in range of [0,255], it should create BitByteArray with a multiple 32 bit integers', () => {
				assert.deepEqual(
					[
						...BitByteArray.from([
							-1, -1,
						]),
					],
					[
						...[
							1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
						],
						...[
							1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
						],
					]
				);
			});

			it('if every number is in range of [0,255], it should create BitByteArray with a multiple 8 bit integers', () => {
				assert.deepEqual(
					[
						...BitByteArray.from([
							1, 1,
						]),
					],
					[
						...[
							0, 0, 0, 0, 0, 0, 0, 1,
						],
						...[
							0, 0, 0, 0, 0, 0, 0, 1,
						],
					]
				);
			});

		});

		describe('array of booleans', () => {

			it('should create BitByteArray with an provided array as a pure bit source', () => {
				assert.deepEqual(
					[
						...BitByteArray.from([
							true, true,
						]),
					],
					[
						1, 1,
					]
				);
			});

		});

		describe('string', () => {

			it('should create bit sequence corresponding to a provided text', () => {
				assert.deepEqual(
					[ ...BitByteArray.from('Test'), ],
					[
						...[
							0, 1, 0, 1, 0, 1, 0, 0,
						],
						...[
							0, 1, 1, 0, 0, 1, 0, 1,
						],
						...[
							0, 1, 1, 1, 0, 0, 1, 1,
						],
						...[
							0, 1, 1, 1, 0, 1, 0, 0,
						],
					]
				);
			});

		});

	});
});
