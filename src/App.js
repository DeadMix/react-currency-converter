import React, { useEffect, useState } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
	const [leftCurrency, setLeftCurrency] = useState('UAH');
	const [rightCurrency, setRightCurrency] = useState('USD');
	const [leftPrice, setLeftPrice] = useState(0);
	const [rightPrice, setRightPrice] = useState(0);
	const [currencies, setCurrencies] = useState([]);

	useEffect(() => {
		fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
			.then(res => res.json())
			.then(json => {
				setCurrencies(json);
			})
			.catch(err => console.warn(err))
	}, []);

	const rates = currencies.reduce((obj, value) => {
		obj[value.cc] = value.rate;
		return obj;
	}, {});
	rates["UAH"] = 1;


	const onChangeLeftPrice = (value) => {
		const price = value / rates[rightCurrency];
		const result = price * rates[leftCurrency];

		setLeftPrice(value);
		setRightPrice(result.toFixed(3));
	}
	const onChangeRightPrice = (value) => {
		const price = value * rates[rightCurrency];
		const result = price / rates[leftCurrency];

		setRightPrice(value);
		setLeftPrice(result.toFixed(3));
	}

	useEffect(() => {
		onChangeLeftPrice(leftPrice);
	}, [leftCurrency]);

	useEffect(() => {
		onChangeRightPrice(rightPrice);
	}, [rightCurrency]);

	return (
		<div className="App">
			<Block
				value={leftPrice}
				currency={leftCurrency}
				onChangeCurrency={setLeftCurrency}
				onChangeValue={onChangeLeftPrice}
			/>
			<Block
				value={rightPrice}
				currency={rightCurrency}
				onChangeCurrency={setRightCurrency}
				onChangeValue={onChangeRightPrice}
			/>
		</div>
	);
}

export default App;
