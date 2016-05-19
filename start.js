var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var By = require('selenium-webdriver').By;

var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

driver.get('https://onlineservices.immigration.govt.nz/secure/Login+Working+Holiday.htm');
driver.wait(function() {
    return driver.isElementPresent(By.id('OnlineServicesLoginStealth_VisaLoginControl_userNameTextBox'));
}, 3000);
driver.findElement(By.id('OnlineServicesLoginStealth_VisaLoginControl_userNameTextBox')).sendKeys("pipilu");
driver.findElement(By.id('OnlineServicesLoginStealth_VisaLoginControl_passwordTextBox')).sendKeys("MY2014code");
driver.findElement(By.id('OnlineServicesLoginStealth_VisaLoginControl_loginImageButton')).click();
var grabApplicationId = function() {
    driver.get('https://onlineservices.immigration.govt.nz/WORKINGHOLIDAY/Application/Create.aspx?CountryId=46');
    driver.wait(function() {
        return driver.isElementPresent(By.id('ctl00_ContentPlaceHolder1_whsStatusPanel'));
    }, 15000);
    driver.findElement(By.id('ctl00_ContentPlaceHolder1_applyNowButton')).then(
        function(applyButton){
            driver.findElement(By.id('ctl00_ContentPlaceHolder1_countryLabel')).getText().then(function(countryText) {
                if (countryText == 'China') {
                    applyButton.click();
                    driver.getCurrentUrl().then(function(currentUrl) {
                        console.log(currentUrl);
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
grabApplicationId();

// driver.findElement(By.name('btnG')).click();
// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
// driver.quit();