//React Base
import React, { Component } from 'react';

//Hatch
import { StorageService } from '../index';

//Lib
import axios from 'axios';
import uuid from 'react-native-uuid';
import Config from 'react-native-config';


const stockSymbols = [
    'AAPL',
    'MSFT',
    'GOOGL',
    'AMZN',
    'TSLA',
    'BRK.B',
    'UNH',
    'JNJ',
    'XOM',
    'V',
    'WMT',
    'META',
    'LLY',
    'COST',
    'CSCO'
]

const cryptoSymbols = [
    'BTC',
    'ETH',
    'USDT',
    'ADA',
    'XRP',
    'SOL',
    'DOT',
    'DOGE',
    'DAI',
    'LTC',
    'ALGO',
    'ETC',
    'ICP',
    'MKR',
    'SHIB'
]

class TickerService extends Component {
    GetStockStuffs = async (symbol) => {
        return axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=PTVN2GYY4XIV99Z2`, {
            
        }).then(async (response) => {
            return response.data;
        }).catch(async (error) => {
            console.error('account error ', error);
        })
    }

    GetCryptoStuffs = async (symbol) => {
        return axios.get(`https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=${symbol}&market=USD&interval=5min&apikey=PTVN2GYY4XIV99Z2`, {
            
        }).then(async (response) => {
            console.log(response.data);
        }).catch(async (error) => {
            console.error('account error ', error);
        })
    }

    GetAggregateStuffs = async () => {
        let arr = [];
        stockSymbols.map(async (i)=>{
            let x = await this.GetStockStuffs(i);
            arr.push(x['Global Quote']);
        })
        return arr;
    }

}

export default new TickerService();