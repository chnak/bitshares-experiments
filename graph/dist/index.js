"use strict";

var _bitsharesjsWs = require("bitsharesjs-ws");

var _bitsharesjs = require("bitsharesjs");

var api = {
	connect: function connect() {
		return _bitsharesjsWs.Apis.instance("wss://bitshares.openledger.info/ws", true).init_promise;
	},
	fetchAssets: function fetchAssets(assets) {
		return new Promise(function (resolve, reject) {
			_bitsharesjsWs.Apis.instance().db_api().exec("lookup_asset_symbols", [assets]).then(function (asset_objects) {
				resolve(asset_objects);
			}).catch(function (error) {
				reject(error);
			});
		});
	},
	fetchStats: function fetchStats(base, quote, days, bucket_size) {
		return new Promise(function (resolve, reject) {
			var endDate = new Date();
			var startDate = new Date(endDate - 1000 * 60 * 60 * 24 * days);

			console.log("NOW", new Date());
			console.log("START", startDate);
			console.log("END", endDate);

			var endDateISO = endDate.toISOString().slice(0, -5);
			var startDateISO = startDate.toISOString().slice(0, -5);

			_bitsharesjsWs.Apis.instance().history_api().exec("get_market_history", [base.id, quote.id, bucket_size, startDateISO, endDateISO]).then(function (result) {
				if (result.length) {
					resolve(result);
				} else {
					reject("No results");
				}
			}).catch(function (error) {
				reject(error);
			});
		});
	}
};

var helpers = {
	getPrices: function getPrices(history) {
		var startElem = history[0];
		var endElem = history[history.length - 1];
		var startPrice = startElem.open_base / startElem.open_quote;
		var endPrice = endElem.close_base / endElem.close_quote;

		return { first: startPrice, last: endPrice };
	},
	formatPrices: function formatPrices(prices, base, quote) {
		var precision_diff = base.precision - quote.precision;

		if (precision_diff > 0) {
			prices.first = prices.first / precision_diff * 10;
			prices.last = prices.last / precision_diff * 10;
		} else if (precision_diff < 0) {
			prices.first = prices.first * 10 * precision_diff;
			prices.last = prices.last * 10 * precision_diff;
		}

		prices.change = Math.floor(prices.last / prices.first * 100 - 100);
		prices.first = Math.abs(prices.first).toFixed(4);
		prices.last = Math.abs(prices.last).toFixed(4);
		return prices;
	}
};

console.time("connect");
api.connect().then(function (res) {
	console.timeEnd("connect");
	console.time("requests");

	api.fetchAssets(["BTS", "OPEN.EOS", "USD"]).then(function (result) {
		var base = result[0],
		    quote = result[1],
		    usd = result[2];
		//console.log("ASSETS:",result)


		//console.log("Fetching infor for 7 day: ",base.symbol,quote.symbol);

		api.fetchStats(base, quote, 1, 3600).then(function (history) {
			var prices = helpers.formatPrices(helpers.getPrices(history), base, quote);
			console.log("PRICES", prices);
			console.timeEnd("requests");
		});
	});
});