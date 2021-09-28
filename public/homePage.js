'use strict';

const logoutBtn = new LogoutButton();
const exchangeRates = new RatesBoard();
const moneyTransactions = new MoneyManager();
const chosen = new FavoritesWidget();
const time = 60000;

logoutBtn.action = () => ApiConnector.logout(function(logout) {
    if (logout.success) {
        location.reload();
    }
});

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

function getExchangeRates () {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            exchangeRates.clearTable();
            exchangeRates.fillTable(response.data);
        }
    });
}

setInterval(getExchangeRates(), time);

moneyTransactions.addMoneyCallback = (data) => ApiConnector.addMoney(data, (response) => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
        moneyTransactions.setMessage(response.success, 'Пополнение прошло успешно!');
    } else {
        moneyTransactions.setMessage( response.success, response.error);
    }
});

moneyTransactions.conversionMoneyCallback = (data) => ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyTransactions.setMessage(response.success, 'Конвертация прошла успешно!');
    } else {
        moneyTransactions.setMessage( response.success, response.error);
    }
});

moneyTransactions.sendMoneyCallback = (data) => ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyTransactions.setMessage(response.success, 'Перевод прошёл успешно!');
    } else {
        moneyTransactions.setMessage( response.success, response.error);
    }
});

ApiConnector.getFavorites((response) => {
    if (response.success) {
        chosen.clearTable();
        chosen.fillTable(response.data);
        moneyTransactions.updateUsersList(response.data);
    }
});

chosen.addUserCallback = (data) => ApiConnector.addUserToFavorites(data, (response) => {
    if (response.success) {
        chosen.clearTable();
        chosen.fillTable(response.data);
        moneyTransactions.updateUsersList(response.data);
        chosen.setMessage( response.success, 'Запись успешно добавлена!');
    } else {
        chosen.setMessage( response.success, response.error);
    }
});

chosen.removeUserCallback = (data) => ApiConnector.removeUserFromFavorites(data, (response) => {
    if (response.success) {
        chosen.clearTable();
        chosen.fillTable(response.data);
        moneyTransactions.updateUsersList(response.data);
        chosen.setMessage( response.success, 'Запись успешно удалена!');
    } else {
        chosen.setMessage( response.success, response.error);
    }
});