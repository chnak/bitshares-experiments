import {Apis} from "bitsharesjs-ws";
import {ChainStore} from "bitsharesjs";



var api = {
	connect: () => {
		return Apis.instance("wss://bitshares.openledger.info/ws", true).init_promise;
	},
	fetchAssets: (assets) => {
		return new Promise((resolve,reject) => {
			Apis.instance().db_api().exec( "lookup_asset_symbols", [ assets ] )
		    .then( asset_objects => {
		    	resolve(asset_objects);
		    }).catch( error => {
		        reject(error);
		    });
		});
	},
	fetchStats: (base,quote,days,bucket_size) => {
		return new Promise((resolve,reject)=>{
			let endDate = new Date();
			let startDate = new Date(endDate - 1000 * 60 * 60 * 24 * days);

			console.log("NOW",new Date())
			console.log("START",startDate)
			console.log("END",endDate)

			let endDateISO = endDate.toISOString().slice(0,-5);			
			let startDateISO =  startDate.toISOString().slice(0,-5);

			Apis.instance().history_api().exec("get_market_history", [
		        base.id, quote.id, bucket_size, startDateISO, endDateISO
		    ]).then(result => {
		    	if (result.length){
		    		resolve(result);
		    	}else{
		    		reject("No results");
		    	}
		    }).catch(error => {
		    	reject(error);
		    });
		});
	}
}

var helpers = {
	getPrices(history){
		let startElem = history[0];
		let endElem = history[history.length-1];
		let startPrice = startElem.open_base / startElem.open_quote;
		let endPrice = endElem.close_base / endElem.close_quote;

		return {first: startPrice, last: endPrice}
	},
	formatPrices(prices,base,quote){
		let precision_diff = base.precision - quote.precision;

		if (precision_diff > 0){
			prices.first = prices.first / precision_diff * 10;
			prices.last = prices.last / precision_diff * 10;
		}else if(precision_diff < 0){
			prices.first = prices.first * 10 * precision_diff;
			prices.last = prices.last * 10 * precision_diff ;
		}

		prices.change = Math.floor((prices.last / prices.first) * 100 - 100);
		prices.first = Math.abs(prices.first).toFixed(4);
		prices.last = Math.abs(prices.last).toFixed(4);
		return prices;
	}
}


console.time("connect");
api.connect().then((res) => {
	console.timeEnd("connect");
	console.time("requests");

    api.fetchAssets(["BTS","OPEN.EOS","USD"]).then((result) => {
    	let [base,quote,usd] = result;
    	//console.log("ASSETS:",result)


    	//console.log("Fetching infor for 7 day: ",base.symbol,quote.symbol);
    	api.fetchStats(base,quote,1,3600).then((history)=>{
    		let prices = helpers.formatPrices(helpers.getPrices(history),base,quote);
    		console.log("PRICES",prices);
    		console.timeEnd("requests");
    	});    	
    });    
});


