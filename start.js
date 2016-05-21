var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var By = require('selenium-webdriver').By;

var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);
var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

var users = {
    user0: {name: 'bumei', password: 'MY2016code'},
    user1: {name: 'boniu', password: 'MY2016code'},
    user2: {name: 'zongjie', password: 'MY2016code'},
    user3: {name: 'huiyuanai', password: 'MY2016code'},
    test1: {name: 'pipinu', password: 'MY2014code'},
    test2: {name: 'yuyuyuyu', password: 'MY2012code'}
};
var user = null;
var stopFlag = false;

var login = function(userLabel) {
    user = users[userLabel];
    if (user == undefined) {
        console.log('No such user');
        return;
    }
    driver.get('https://onlineservices.immigration.govt.nz/secure/Login+Working+Holiday.htm');
    driver.wait(function() {
        return driver.isElementPresent(By.id('OnlineServicesLoginStealth_VisaLoginControl_userNameTextBox'));
    }, 10000);
    driver.findElement(By.id('OnlineServicesLoginStealth_VisaLoginControl_userNameTextBox')).sendKeys(user.name);
    driver.findElement(By.id('OnlineServicesLoginStealth_VisaLoginControl_passwordTextBox')).sendKeys(user.password);
    driver.findElement(By.id('OnlineServicesLoginStealth_VisaLoginControl_loginImageButton')).click();
};
var grabApplicationId = function() {
    if (stopFlag) {
        return;
    }
    driver.get('https://onlineservices.immigration.govt.nz/WORKINGHOLIDAY/Application/Create.aspx?CountryId=46');
    driver.wait(
        function() {
            return driver.isElementPresent(By.id('ctl00_ContentPlaceHolder1_whsStatusPanel'));
        },
        20000
    ).then(function(){}, function() {
        console.log('Scheme page not right.');
    });
    driver.findElement(By.id('ctl00_ContentPlaceHolder1_applyNowButton')).then(
        function(applyButton){
            driver.findElement(By.id('ctl00_ContentPlaceHolder1_countryLabel')).getText().then(function(countryText) {
                if (countryText == 'China') {
                    applyButton.click();
                    driver.getCurrentUrl().then(function(currentUrl) {
                        console.log(currentUrl);
                        console.log(user.name);
                    });
                } else {
                    console.log('Not scheme for China');
                }
            });
        },
        function() {
            grabApplicationId();
        }
    );
};
var handleInput = function(input) {
    switch (input.command) {
        case 'login':
            login(input.args);
            break;
        case 'start':
            stopFlag = false;
            grabApplicationId();
            break;
        case 'stop':
            stopFlag = true;
            break;
        default:
            console.log('Input not recognised.');
    }
};

var parseInput = function(input) {
    var matches = input.toString().match(/(\w+)(.*)/);
    return {
        command: matches[1].toLowerCase(),
        args: matches[2].trim()
    };
};

process.stdin.on('data', function(input) {
    try {
        handleInput(parseInput(input));
    } catch (e) {
        console.log(e);
    }
});

// driver.findElement(By.name('btnG')).click();
// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
// driver.quit();
