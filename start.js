var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.get('https://onlineservices.immigration.govt.nz/secure/Login+Working+Holiday.htm');
driver.findElement(By.id('OnlineServicesLoginStealth_VisaLoginControl_userNameTextBox'));
// driver.findElement(By.name('btnG')).click();
// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
// driver.quit();