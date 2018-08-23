const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const formidable = require('formidable');
const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const delay = require('delay');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const config = require('../config/config.js');
const web3 = require('../web3/web3.js');

// parse user input from form and setup Web3 instance in the correct chain
router.use('/', parseUserInput, web3.setupNetwork);

// token transfer transactions
router.post('/token', web3.getContract, (req, res, next) => {
	console.log("sendTokens");
	web3.sendTxs(res.locals,
			web3.buildRawTokenTx(res.locals))
		.then((transactionRecords) => {
			writeToCSV(transactionRecords, "token");
			next();
		}, (reason) => { // if rejected, go to error handling route
			console.log("Caught error in .catch!!");
			req.errorMessage = reason.message;
			next('route');
		})
}, redirect)

// ether transfer transactions
router.post('/ether', (req, res, next) => {
	console.log("sendEthers");
	web3.sendTxs(res.locals,
			web3.buildRawEthTx(res.locals))
		.then((transactionRecords) => {
			writeToCSV(transactionRecords, "ether");
			next();
		}, (reason) => { // if rejected, go to error handling route
			console.log("Caught error in .catch!!");
			req.errorMessage = reason.message;
			next('route');
		})
}, redirect)

function parseUserInput(req, res, next) {
	console.log("parseUserInput");
	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		res.locals.myAddress = fields.fromAddress;
		res.locals.myPrivateKey = new Buffer(fields.fromPrivateKey, 'hex');
		res.locals.contractAddress = fields.contractAddress;
		if (typeof fields.chainId !== 'undefined') {
			res.locals.chainId = fields.chainId;
		}
		res.locals.gasPrice = fields.gasPrice;
		res.locals.csvInput = parse(fs.readFileSync(files.destinations.path, 'utf-8'), {
			columns: true
		})
		next();
	})
}

function writeToCSV(transactionRecords, txType) {

	var csvWriter = createCsvWriter({
		path: './outputs/transactions-' + txType + '.csv',
		header: [{ id: 'Name', title: 'Name' }, { id: 'Address', title: 'Address' }, { id: 'Amount', title: 'Amount' }, { id: 'TxHash', title: 'TxHash' }, ]
	});

	console.log("writeToCSV");
	csvWriter.writeRecords(transactionRecords)
		.then(() => {
			console.log("...Done");
		});
}

function redirect(req, res) {
	setTimeout(() => {
		let redirectPrefix = res.locals.chainId === '0x03' ? 'ropsten.' : '';
		console.log("Redirecting...");
		res.redirect('https://' + redirectPrefix + 'etherscan.io/address/' + res.locals.myAddress);
	}, 3000)
}

module.exports = router;
