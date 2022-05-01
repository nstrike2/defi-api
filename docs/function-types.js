/*
	same write endpoints
	add more write endpoints (edge cases)
	add read endpoints
	add base-layer ether calls
	add ERC4626 support
*/

/* #########################
	Basic types
######################### */

type hash = string;
type txHash = hash;
// Some amount of a token or ETH
type amount = number;
type exchangeRate = number;
type growthRate = number;
type callback = function;
type confirmation = txHash;
type gasPriority = number; // 0 = Low, 1 = Medium, 2 = High
type amounts = {amount} | {buyAmount} | {sellAmount};
type tokens = {token} | {buyToken?, sellToken?}
type basicRequest = {walletAddress?, gasPriority?, slippage?, transactionTime?};
type staticRequest = tokens & basicRequest;
// Sell token is assumed to be ETH, buy token is usually filled by protocol
type request = amounts & tokens & basicRequest;
// buyToken and sellToken are simply added to the tokens array
// bounds is an object that carries information about any bound information
	// the user may want to impose on their pool
type poolRequest = {tokens[]?, buyToken?, sellToken?, bounds{}?} & amounts & basicRequest;

type chainId = number | string;
type chainName = string;
type walletAddress = string;
type protocol = Axel.Protocol | string;
type action = Axel.Action | string;
type chain = Axel.Chain | chainId | chainName;
type token = Axel.Token | string;
type listenerName = string | Axel.ListenerName;

axel.protocols.Aave = new axel.Protocol();
axel.protocols.Aave.name = "Aave";

class Axel {
	constructor() {
		this.tokens = {};
		this.protocols = {};
		this.tokens.aWETH = new Axel.Token();
		this.tokens.aWETH.name = "aWETH";
		this.protocols.Aave = new Axel.Protocol();
		this.protocols.Aave.name = "Aave";
		this.protocols.Aave.token = this.tokens.aWETH;
	}
	static class Token {
		
	}
	static class Protocol {
		
	}
}


const request = {
	amount: 0.01,
	sellToken: axel.tokens.cETH,
}
axel.lend("Aave", request);
axel.borrow(axel.protocols.Aave, request);


/* #########################
	Internal endpoints
	######################### */

axel.protocolSupportsNetwork(protocol, chain?) => boolean;
	axel.protocolSupportsNetwork(axel.protocols.Aave);
	axel.protocolSupportsNetwork("Aave", "mainnet");
	axel.protocolSupportsNetwork(axel.protocols.Compound, "0x1");
	axel.protocolSupportsNetwork("Compound", 1);

axel.protocolSupportsAction(protocol, action) => boolean;
	axel.protocolSupportsAction(axel.protocols.Aave, "Lend") // true
	axel.protocolSupportsAction(axel.protocols.Yearn, axel.protocols.Yield) // true
	axel.protocolSupportsAction("Uniswap", axel.actions.Stake) // false
	axel.protocolSupportsAction("Compound", "Exchange") // false

axel.chainSupportsToken(token, chain?) => boolean;
	axel.chainSupportsToken(axel.tokens.cETH) // true
	axel.chainSupportsToken(axel.tokens.yvWETH, "0x4") // chain=rinkeby, false
	axel.chainSupportsToken("aWETH", axel.chains.Kovan) // true
	axel.chainSupportsToken("rETH", "mainnet") // true

	// Token supported by Axel
axel.tokenSupported(token) => boolean;
	axel.tokenSupported(axel.tokens.stETH) // true
	axel.tokenSupported("usd") // very false


axel.noop() => void;
	setTimeout(axel.noop, 1000);
	new Promise().then(axel.noop);


axel.on(listenerName, callback) => void;
	axel.on("walletConnect", (event) => {
		console.log(event);
	});
	axel.on(axel.listeners.balanceChange, axel.noop); // Listener for when the user's ETH Balance changes

// If the client has an active callback for this listener
axel.hasListener(listenerName) => boolean;
	axel.on("walletDisconnect", console.log);
	
	axel.hasListener("balanceChange") // false
	axel.hasListener(axel.listeners.balanceChange); // false
	
	axel.hasListener(axel.listeners.walletDisconnect); // true
	axel.hasListener("walletDisconnect") // true
	
axel.removeListener(listenerName) => void;
	axel.on("walletChange", console.log);
	axel.hasListener(axel.listeners.walletChange); // true
	axel.removeListener(axel.listeners.walletChange);
	axel.hasListener("walletChange"); // false
	
axel.onTokenBalanceChange(token, callback) => void;
	axel.onTokenBalanceChange("cAAVE", (event) => console.log(event));
	axel.onTokenBalanceChange(axel.tokens.cAAVE, (event) => console.log(event));
	
axel.hasTokenBalanceListener(token) => boolean;
	axel.hasTokenBalanceListener("rETH"); // false
	axel.onTokenBalanceChange("rETH", (event) => console.log(event));
	axel.hasTokenBalanceListener("rETH"); // true
	
axel.removeTokenBalanceListener(token) => void;
	axel.onTokenBalanceChange("rETH", (event) => console.log(event));
	axel.hasTokenBalanceListener("rETH"); // true
	axel.removeTokenBalanceListener("rETH");
	axel.hasTokenBalanceListener("rETH"); // false
	
axel.removeAllTokenBalanceListeners() => void;
	axel.onTokenBalanceChange("rETH", (event) => console.log(event));
	axel.onTokenBalanceChange(axel.tokens.cAAVE, (event) => console.log(event));
	axel.removeAllTokenBalanceListeners();
	axel.hasTokenBalanceListener(axel.tokens.rETH); // false
	axel.hasTokenBalanceListener("cAAVE"); // false
	
axel.removeAllListeners() => void;
	axel.on("walletChange", console.log);
	axel.onTokenBalanceChange("aWETH", console.info);
	axel.removeAllListeners();
	axel.hasListener(axel.listeners.walletChange); // false
	axel.hasTokenBalanceListener(axel.tokens.aWETH); // false

axel.changeChain(chainId) => void;
	axel.change
axel.changeWalletAddress(walletAddress) => walletAddress;
axel.walletConnected() => boolean;


axel.start() => void;
	await axel.start();
	// Initializes the axel instance, which includes
		// loads wallet variables if the wallet is already connected
		// begins the user's listeners
	// Make sure to include any listeners before running axel.start

	// be sure to define your event listeners before running your instance with axel.start()
	// if you try to define your event listeners after running the instance with axel.start(),
	// you may not be able to "catch" submitted events of those event listener types before you
	// define those event listeners in your control flow
	button.outline = "white";
	axel = new Axel(); // Loads all listeners and variables with noops and nulls respectively.
	axel.on(axel.listeners.walletConnect, event => button.outline = "green");
	axel.on(axel.listeners.walletDisconnect, event => button.outline = "white");
	await axel.start();


axel.update() => void;
	await axel.update();
	// Updates all relevant Axel variables.
	// Specifically, it updates the wallet address, the chain, and the end user's eth balance and any token balances the developer is listening for
axel.connect() => void;
	// Prompts the user to connect their wallet
	await axel.connect();

// Does not normally need to be called by the developer, unless they want to switch wallets or use a non-standard wallet.
axel.setWallet(wallet) => void;
	await axel.setWallet(window.ethereum);
	await axel.setWallet(provider); // any wallet provider

axel.call(jsonRPC) => callData;
	await axel.call([{
		"from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
		"to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
		"gas": "0x76c0",
		"gasPrice": "0x9184e72a000",
		"value": "0x9184e72a",
		"data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
	}, "latest"])


/* #########################
	Write endpoints
	######################### */

axel.sendTransaction(jsonRPC) => txHash;
	await axel.sendTransaction([{
		"from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
		"to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
		"gas": "0x76c0", // 30400
		"gasPrice": "0x9184e72a000", // 10000000000000
		"value": "0x9184e72a", // 2441406250
		"data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
	}])

axel.send(protocol, action, request) => confirmation;
	await axel.send("Compound", "lend", {amount: 0.01});

// This is equivalent to axel.supply
axel.lend(protocol, request) => confirmation;
	await axel.lend(axel.protocols.Compound, {amount: 0.01}); // Sell token is assumed to be ETH
	await axel.lend("Compound", {
		amount: 25,
		sellToken: "DAI"
	});
	await axel.lend("Compound", {
		amount: 25,
		token: axel.tokens.DAI,
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});
	await axel.lend("Compound", {
		amount: 25,
		sellToken: axel.tokens.DAI,
		gasPriority: 1, // Medium priority
		transactionTime: 30, // 30 minutes
	});
	await axel.lend("Compound", { // client can specify the amount of buy token they want to receive
		amount: 0.01,
		buyToken: axel.tokens.cDAI,
		gasPriority: 2, // Low priority
		transactionTime: 30, // 30 minutes
	});

// This is equivalent to axel.lend
axel.supply(protocol, request) => confirmation;
	await axel.supply(axel.protocols.Compound, {amount: 0.01}); // Sell token is assumed to be ETH
	await axel.supply("Compound", {
		amount: 25,
		sellToken: "DAI"
	});
	await axel.supply("Compound", {
		amount: 25,
		token: axel.tokens.DAI,
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});
	await axel.supply("Compound", {
		amount: 25,
		sellToken: axel.tokens.DAI,
		gasPriority: 1, // Medium priority
		transactionTime: 30, // 30 minutes
	});
	await axel.supply("Compound", { // client can specify the amount of buy token they want to receive
		amount: 0.01,
		buyToken: axel.tokens.cDAI,
		gasPriority: 2, // Low priority
		transactionTime: 30, // 30 minutes
	});

axel.borrow(protocol, request) => confirmation;
	await axel.borrow(axel.protocols.Compound, {amount: 0.01}); // Buy (borrow) token is assumed to be ETH
	await axel.borrow("Compound", {
		amount: 25,
		buyToken: axel.tokens.DAI,
		gasPriority: 2, // High priority
		transactionTime: 30, // 30 minutes
	});
	await axel.borrow("Compound", {
		amount: 25,
		token: "DAI",
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});

axel.repay(protocol, request) => confirmation;
	await axel.repay(axel.protocols.Compound, {amount: 0.01}); // Sell (repay) token is assumed to be ETH
	await axel.repay("Compound", {
		amount: 25,
		sellToken: axel.tokens.DAI,
		gasPriority: 2, // High priority
		transactionTime: 30, // 30 minutes
	});
	await axel.repay("Compound", {
		amount: 25,
		token: "DAI",
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});

axel.stake(protocol, request) => confirmation;
	await axel.stake(axel.protocols.Lido, {amount: 0.01}); // Sell token is assumed to be native staking token of the protocol, which in this case, is ETH
	await axel.stake("Lido", { // Client can specify buy token if they want a certain amount returned
		amount: 0.01,
		buyToken: "stETH", // if buy token is not the native return token of the protocol (in this case, stETH), Axel will error
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});
	await axel.stake("Lido", { // Client can specify sell token
		amount: 0.01,
		sellToken: axel.tokens.ETH, // if sell token is not the native staking token of the protocol (in this case, ETH), Axel will error
		gasPriority: 1, // Medium priority
		transactionTime: 30, // 30 minutes
	});
	await axel.stake("Lido", { // Client can specify sell token
		amount: 0.01,
		token: axel.tokens.ETH, // if sell token is not the native staking token of the protocol (in this case, ETH), Axel will error
		gasPriority: 2, // High priority
		transactionTime: 30, // 30 minutes
	});

axel.unstake(protocol, request) => confirmation;
	await axel.unstake("Lido", {amount: 0.01}); // Sell token, which you will be returned here, is assumed to be the native staking token of the protocol, which in this case, is ETH
	await axel.unstake(axel.protocols.Lido, {amount: 0.01});
	await axel.unstake("Lido", { // Client can specify buy token if they want to redeem a certain amount
		amount: 0.01,
		buyToken: "stETH", // if buy token is not the native return token of the protocol (in this case, stETH), Axel will error
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});
	await axel.unstake(axel.protocols.Lido, { // Client can specify buy token if they want to redeem a certain amount
		amount: 0.01,
		buyToken: axel.tokens.stETH, // if buy token is not the native return token of the protocol (in this case, stETH), Axel will error
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});

axel.deposit(protocol, request) => confirmation;
	await axel.deposit("Yearn", {amount: 0.01}); // sellToken is the token you deposit, assumed to be ETH here
	await axel.deposit(axel.protocols.Yearn, {amount: 0.01, sellToken: "WBTC"}); // specifying the sell token here
	await axel.deposit("Yearn", { // Client can specify buy token if they want a certain amount returned
		amount: 0.01,
		buyToken: "yvWBTC", // if buy token is not a token that can be returned by a vault on the protocol (in this case, yvWBTC), Axel will error
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});
	await axel.deposit(axel.protocols.Yearn, { // Client can specify buy token if they want a certain amount returned
		amount: 0.01,
		sellToken: axel.tokens.WBTC,
		buyToken: axel.tokens.yvWBTC, // if buy token is not the native return token of the protocol (in this case, stETH), axel will error
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});

axel.withdraw(protocol, request) => confirmation;
	await axel.withdraw("Yearn", {amount: 0.01});// Sell token, which you will be returned here, is assumed to be ETH
	await axel.withdraw(axel.protocols.Yearn, {amount: 0.01, sellToken: "WBTC"}); // specifying the sell token, which you will be returned here
	await axel.withdraw("Yearn", { // Client can specify buy token if they want a certain amount returned
		amount: 0.01,
		sellToken: "WBTC",
		buyToken: "yvWBTC", // if buy token is not a token that can be returned by a vault on the protocol (in this case, yvWBTC), Axel will error
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});
	await axel.withdraw(axel.protocols.Yearn, { // Client can specify buy token if they want a certain amount returned
		amount: 0.01,
		sellToken: axel.tokens.WBTC,
		buyToken: axel.tokens.yvWBTC, // if buy token is not the native return token of the protocol (in this case, stETH), axel will error
		gasPriority: 0, // Low priority
		transactionTime: 30, // 30 minutes
	});
// Buy token is required
axel.exchange(protocol, request) => confirmation;
	await axel.exchange("Uniswap", {
		amount: 0.01,
		buyToken: "USDC",
		sellToken: "DAI"
	});
	await axel.exchange(axel.protocols.Sushiswap, {
		amount: 0.01,
		buyToken: "USDC",
		// Sell token is assumed to be ETH
		slippage: 0.01, // 0.01% percent slippage allowed
	});

// TODO Add soon
// axel.createPool(protocol, poolRequest) => confirmation;


/* #########################
	Read endpoints
	######################### */

axel.rpcCall(rpcFunction, requestData) => callData;
	await axel.rpcCall("eth_getBlockByHash", [
		'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
		false
	]) // Returns the associated block


axel.estimateGas() => number;
	await axel.estimateGas(); // 21000

// token defaults to ETH, calls axel.getETHBalance
axel.getBalance(token?, walletAddress?, provider?) => amount;
	await axel.getBalance(); // 0.03 ETH
	await axel.getBalance(axel.tokens.aWETH); // 0.01 aWETH
	await axel.getBalance("aWETH", "0x1c87Ba20aB980f0c4C26AFEf9502967f6C4fD502"); // 0.01 aWETH

// otherwise, routes to axel.getERC20Balance
axel.getETHBalance(walletAddress?, provider?) => amount;
	await axel.getETHBalance(); // 0.03 ETH
	await axel.getETHBalance("0x1c87Ba20aB980f0c4C26AFEf9502967f6C4fD502", some_alchemy_bs); // 0.03 ETH
	
axel.getERC20Balance(token, walletAddress?, provider?) => amount;
	await axel.getERC20Balance("aWETH"); // 0.01 aWETH
	await axel.getERC20Balance(axel.tokens.aWETH, "0x1c87Ba20aB980f0c4C26AFEf9502967f6C4fD502"); // 0.01 aWETH

// Used for many protocols
axel.estimateLendingAPY(protocol, staticRequest?, chain?) => growthRate;
	axel.estimateLendingAPY("Aave"); // Returns lending APY for ETH -> aWETH
	
axel.estimateBorrowingAPY(protocol, staticRequest?, chain?) => growthRate;
	axel.estimateLendingAPY("Aave"); // Returns borrowing APY for ETH -> aWETH
	
axel.estimateRewardsAPY(protocol, staticRequest?, chain?) => growthRate;
	axel.estimateRewardsAPY("Lido"); // Returns rewards/staking APY for ETH -> stETH
	
axel.estimateYieldAPY(protocol, staticRequest?, chain?) => growthRate;
	axel.estimateYieldAPY("Yearn"); // Returns yield earning APY for ETH -> yvWETH
	
axel.estimateAPY(protocol, staticRequest?, chain?) => growthRate;
	axel.estimateAPY("Aave") // Returns lending APY for ETH -> aWETH
	axel.estimateAPY("Compound", { // Returns lending APY for DAI -> cDAI
		sellToken: "DAI",
	})
	axel.estimateAPY("Compound", { // Returns borrowing APY for cUSDC -> USDC
		buyToken: "USDC"
	})
	axel.estimateAPY("Lido"); // Returns the rewards APY for ETH
	
axel.estimateExchangeRate(sellToken, buyToken) => exchangeRate;
	axel.estimateExchangeRate("ETH", "USDC"); // 2768.94


/* #########################
	Sim endpoints
	######################### */

sim = new axel.Simulation()
sim.send(protocol, action, request) => void;


const priorBalance = sim.getERC20Balance("aWETH");
await sim.lend("Aave", {amount: 1});
await delay(10000);
const newBalance = sim.getERC20Balance("aWETH");
console.assert(newBalance - priorBalance === 1);
