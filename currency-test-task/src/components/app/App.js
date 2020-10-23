import React, { Component } from 'react';
import './App.css';
import { getCurrency } from '../../services/service';
import Spinner from "../spinner/spinner"
import Chart from 'react-google-charts';
import Select from 'react-select';

export default class App extends Component {
	state = {
		currencyID: 145,
		startDate: null,
		endDate: null,
		data: null,
		currentDate: null,
		previousDate: null,
		daysRange: null,
		loading: true,
	};

	componentDidMount() {
		const { currencyID } = this.state;
		const date = new Date();

		const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

		date.setDate(date.getDate() - 7);

		const previousDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

		this.getData(currencyID, previousDate, currentDate);
		this.setState({ currentDate, previousDate });
	}

	onChangeCurrency = (selectedOption) => {
		this.setState({
			currencyID: selectedOption.value,
		});
		this.getData(selectedOption.value, this.state.previousDate, this.state.currentDate);
	};

	onChangeStartDate = (e) => {
		this.setState({ previousDate: e.target.value });
	};

	onChangeEndDate = (e) => {
		this.setState({ currentDate: e.target.value });
	};

	getData = (id, previousDate, currentDate) => {
		getCurrency(id, previousDate, currentDate).then((data) => {
			const array = [['Неделя', null]];

			if (id === 145) {
				array[0][1] = 'Курс доллара';
			}
			if (id === 292) {
				array[0][1] = 'Курс евро';
			}
			if (id === 298) {
				array[0][1] = 'Курс российского рубля';
			}

			let date1 = new Date(previousDate);
			let date2 = new Date(currentDate);
			let daysRange = Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
			for (let i = 1; i <= daysRange; i++) {
				array.push([null, null]);
				array[i][0] = data[i - 1].Date.substr(0, 10);
				array[i][1] = data[i - 1].Cur_OfficialRate;
			}

			this.setState({ data: array, loading: false, daysRange });
		});
	};

	getDate = () => {
		if (this.state.previousDate !== this.state.currentDate) {
			if (new Date(this.state.currentDate) < new Date()) {
				if (new Date(this.state.previousDate) < new Date(this.state.currentDate)) {
					this.getData(this.state.currencyID, this.state.previousDate, this.state.currentDate);
				}
			}
		}
	};

	render() {
		const options = [
			{ value: 145, label: 'Доллар' },
			{ value: 292, label: 'Евро' },
			{ value: 298, label: 'Российский рубль' },
		];

		let minValue, maxValue;
		let currencies = [];
		if (this.state.currencyID === 145) {
			for (let i = 1; i <= this.state.daysRange; i++) {
				currencies.push(this.state.data[i][1]);
			}
			maxValue = Math.max.apply(null, currencies);
			minValue = Math.min.apply(null, currencies);
		}

		if (this.state.currencyID === 292) {
			for (let i = 1; i <= this.state.daysRange; i++) {
				currencies.push(this.state.data[i][1]);
			}
			maxValue = Math.max.apply(null, currencies);
			minValue = Math.min.apply(null, currencies);
		}

		if (this.state.currencyID === 298) {
			for (let i = 1; i <= this.state.daysRange; i++) {
				currencies.push(this.state.data[i][1]);
			}
			maxValue = Math.max.apply(null, currencies);
			minValue = Math.min.apply(null, currencies);
		}
		let content;
		if (!this.state.loading) {
			content = (
				<Chart
					width={1000}
					height={550}
					chartType="AreaChart"
					loader={<div><Spinner /></div>}
					data={this.state.data}
					options={{
						title: 'График курсов иностранной валюты по отношению к белорусскому рублю',
						hAxis: { title: 'День', titleTextStyle: { color: '#333' } },
						vAxis: {
							title: 'Значение валюты',
							minValue: minValue,
							maxValue: maxValue,
						},
						chartArea: { width: '60%', height: '70%' },
					}}
				/>
			);
		}
		return (
			<div>
				{content}
				<Select defaultValue={options[0]} className="list" options={options} onChange={this.onChangeCurrency} />
				<div className="date">
					<div>
						<label htmlFor="startDate">Начальная дата: </label>
						<input type="date" id="startDate" onChange={this.onChangeStartDate} />
					</div>
					<div>
						<label htmlFor="endDate">Конечная дата: </label>
						<input type="date" id="endDate" onChange={this.onChangeEndDate} />
					</div>
					<button onClick={this.getDate}>Отправить</button>
				</div>
			</div>
		);
	}
}
