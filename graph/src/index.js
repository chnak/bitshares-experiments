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
			Apis.instance().history_api().exec("get_fill_order_history", [base.id, quote.id, 1]).then((result)=>{
				console.log("G_F_O_H",result[0].time);
			});
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
	},
	getBalance: (account_name) => {
		e
	}
}

var helpers = {
	getStartEndPrices(history){
		let startElem = history[0];
		let endElem = history[history.length-1];
		let startPrice = startElem.open_base / startElem.open_quote;
		let endPrice = endElem.close_base / endElem.close_quote;
		return [startPrice,endPrice];
	},
	getTotalPrice(bucket){
		return bucket.base_volume / bucket.quote_volume;
	},
	formatPrice(price,base,quote){
		let precision_diff = base.precision - quote.precision;

		if (precision_diff > 0){
			price = price / Math.pow(10,precision_diff);
		}else if(precision_diff < 0){
			price = price * Math.pow(10,precision_diff);
		}
		return Math.abs(price).toFixed(4);
	},
	formatPrices(prices,base,quote){
		prices.forEach((price,index) => {
			prices[index] = this.formatPrice(price,base,quote);
		});
		return prices;
	}
}



function retrieveStats(){
	    api.fetchAssets(["BTS","OPEN.EOS","USD"]).then((result) => {
	    	let [bts,eos,usd] = result;
	    	let days_period = 7;
	    	let full_day_bucket = 86400;
	    	let hour_bucket = 3600;

	    	Promise.all([
	    		api.fetchStats(bts,usd,days_period,full_day_bucket),
	    		api.fetchStats(bts,eos,days_period,hour_bucket),
			]).then(([btsusd,btseos])=>{
				//Calculate bts in usd per day costs
				let usd_in_bts_days = [];
				btsusd.forEach(function(bucket){
	    			usd_in_bts_days.push(helpers.formatPrice(helpers.getTotalPrice(bucket),bts,usd));
	    		});

				let [startPrice,endPrice] = helpers.formatPrices(helpers.getStartEndPrices(btseos),bts,eos);

				let startPriceUsd = startPrice / usd_in_bts_days[0];
				let endPriceUSD = endPrice / usd_in_bts_days[usd_in_bts_days.length-1];
				console.log("STARTEND ",startPrice,endPrice);
				console.log("IN USD",startPriceUsd,endPriceUSD);
				console.log("BTS CHANGE FOR ",days_period," days: ",startPrice / endPrice);
				console.log("USD CHANGE FOR ",days_period," days: ",startPriceUsd / endPriceUSD);
			});
	    });    
}

function retrieveBalances(account_name){
	Apis.instance().db_api().exec("get_full_accounts", [["anlopan364test2"], false])
    .then( (results) => {
    	let balances = results[0][1].balances;
    	let active_balances = [];
    	let balance_assets = [];
    	balances.forEach(function(balance,index){
    		if (balance.balance != 0){
    			active_balances.push(balance);
    			balance_assets.push(balance.asset_type);
    		}
    	});

    	api.fetchAssets(balance_assets).then((result)=>{
			active_balances.forEach((balance,i)=>{
				active_balances[i].symbol = result[i].symbol
				active_balances[i].precision = result[i].precision
				active_balances[i].balanceReal = active_balances[i].balance / Math.pow(10,result[i].precision);
			});
    		console.log(active_balances);
    		console.timeEnd("test");
    	});
    });
}

console.time("connect")
api.connect().then((res) => {
	console.timeEnd("connect");
	console.time("test");
	retrieveStats();
	retrieveBalances("trfnd");
});



