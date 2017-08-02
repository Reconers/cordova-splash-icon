var fs     = require('fs');
var xml2js = require('xml2js');
var ig     = require('imagemagick');
var colors = require('colors');
var _      = require('underscore');
var Q      = require('q');

/**
 * Check which platforms are added to the project and return their splash screen names and sizes
 *
 * @param  {String} projectName
 * @return {Promise} resolves with an array of platforms
 */
var getPlatforms = function (projectName) {
    var deferred = Q.defer();
    var platforms = [];
    platforms.push({
        name : 'ios',
        // TODO: use async fs.exists
        isAdded : fs.existsSync('platforms/ios'),
        splashPath : 'platforms/ios/' + projectName + '/Resources/splash/',
        splash : [
            { name : 'Default-568h@2x~iphone.png',    width : 640,  height : 1136 },
            { name : 'Default-667h.png',              width : 750,  height : 1334 },
            { name : 'Default-736h.png',              width : 1242,  height : 2208 },
            { name : 'Default-Landscape-736h.png',    width : 2208,  height : 1242 },
            { name : 'Default-Landscape@2x~ipad.png', width : 2048, height : 1536 },
            { name : 'Default-Landscape~ipad.png',    width : 1024, height : 768 },
            { name : 'Default-Portrait@2x~ipad.png',  width : 1536, height : 2048 },
            { name : 'Default-Portrait~ipad.png',     width : 768,  height : 1024 },
            { name : 'Default@2x~iphone.png',         width : 640,  height : 960 },
            { name : 'Default~iphone.png',            width : 320,  height : 480 },
        ],
        iconPath : 'platforms/ios/' + projectName + '/Resources/icons/',
        icon : [
            { name : 'icon.png',          width : 57,  height : 57 },
            { name : 'icon@2x.png',       width : 114, height : 114 },
            { name : 'icon-small.png',    width : 29,  height : 29 },
            { name : 'icon-small@2x.png', width : 58,  height : 58 },
            { name : 'icon-small@3x.png', width : 87,  height : 87 },
            { name : 'icon-40.png',       width : 40,  height : 40 },
            { name : 'icon-40@2x.png',    width : 80,  height : 80 },
            { name : 'icon-50.png',       width : 50,  height : 50 },
            { name : 'icon-50@2x.png',    width : 100, height : 100 },
            { name : 'icon-60.png',       width : 60,  height : 60 },
            { name : 'icon-60@2x.png',    width : 120, height : 120 },
            { name : 'icon-60@3x.png',    width : 180, height : 180 },
            { name : 'icon-72.png',       width : 72,  height : 72 },
            { name : 'icon-72@2x.png',    width : 144, height : 144 },
            { name : 'icon-76.png',       width : 76,  height : 76 },
            { name : 'icon-76@2x.png',    width : 152, height : 152 },
            { name : 'icon-83.5@2x.png',    width : 167, height : 167 },
        ]
    });
    platforms.push({
        name : 'android',
        isAdded : fs.existsSync('platforms/android'),
        splashPath : 'platforms/android/res/',
        splash : [
            { name : 'drawable-land-ldpi/screen.png',  width : 320, height: 200 },
            { name : 'drawable-land-mdpi/screen.png',  width : 480, height: 320 },
            { name : 'drawable-land-hdpi/screen.png',  width : 800, height: 480 },
            { name : 'drawable-land-xhdpi/screen.png', width : 1280, height: 720 },
            { name : 'drawable-land-xxhdpi/screen.png', width : 1600, height: 960 },
            { name : 'drawable-land-xxxhdpi/screen.png', width : 1920, height: 1280 },
            { name : 'drawable-port-ldpi/screen.png',  width : 200, height: 320 },
            { name : 'drawable-port-mdpi/screen.png',  width : 320, height: 480 },
            { name : 'drawable-port-hdpi/screen.png',  width : 480, height: 800 },
            { name : 'drawable-port-xhdpi/screen.png', width : 720, height: 1280 },
            { name : 'drawable-port-xxhdpi/screen.png', width : 960, height: 1600 },
            { name : 'drawable-port-xxxhdpi/screen.png', width : 1280, height: 1920 },
        ],
        iconPath : 'platforms/android/res/',
        icon : [
            { name : 'mipmap-ldpi/icon.png',   width : 36, height: 36 },
            { name : 'mipmap-mdpi/icon.png',   width : 48, height: 48 },
            { name : 'mipmap-hdpi/icon.png',   width : 72, height: 72 },
            { name : 'mipmap-xhdpi/icon.png',  width : 96, height: 96 },
            { name : 'mipmap-xxhdpi/icon.png', width : 144, height: 144 },
            { name : 'mipmap-xxxhdpi/icon.png', width : 192, height: 192 },
        ]
    });
    // TODO: add all platforms
    deferred.resolve(platforms);
    return deferred.promise;
};


/**
 * @var {Object} settings - names of the config file and of the splash image
 * TODO: add option to get these values as CLI params
 */
var settings = {};
settings.CONFIG_FILE = 'config.xml';
settings.SPLASH_FILE = 'splash.png';
settings.ICON_FILE   = 'icon.png';

/**
 * @var {Object} console utils
 */
var display = {};
display.success = function (str) {
    str = '✓  '.green + str;
    console.log('  ' + str);
};
display.error = function (str) {
    str = '✗  '.red + str;
    console.log('  ' + str);
};
display.header = function (str) {
    console.log('');
    console.log(' ' + str.cyan.underline);
    console.log('');
};

/**
 * read the config file and get the project name
 *
 * @return {Promise} resolves to a string - the project's name
 */
var getProjectName = function () {
    var deferred = Q.defer();
    var parser = new xml2js.Parser();
    data = fs.readFile(settings.CONFIG_FILE, function (err, data) {
        if (err) {
            deferred.reject(err);
        }
        parser.parseString(data, function (err, result) {
            if (err) {
                deferred.reject(err);
            }
            var projectName = result.widget.name[0];
            deferred.resolve(projectName);
        });
    });
    return deferred.promise;
};

/**
 * Crops and creates a new splash in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} splash
 * @return {Promise}
 */
var generateSplash = function (platform, splash) {
    var deferred = Q.defer();
    ig.crop({
        srcPath: settings.SPLASH_FILE,
        dstPath: platform.splashPath + splash.name,
        quality: 1,
        format: 'png',
        width: splash.width,
        height: splash.height,
    } , function(err, stdout, stderr){
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
            display.success(splash.name + ' created');
        }
    });
    return deferred.promise;
};

/**
 * Crops and creates a new icon in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} splash
 * @return {Promise}
 */
var generateIcon = function (platform, icon) {
    var deferred = Q.defer();
    ig.crop({
        srcPath: settings.ICON_FILE,
        dstPath: platform.iconPath + icon.name,
        quality: 1,
        format: 'png',
        width: icon.width,
        height: icon.height,
    } , function(err, stdout, stderr){
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
            display.success(icon.name + ' created');
        }
    });
    return deferred.promise;
};

/**
 * Generates splash based on the platform object
 *
 * @param  {Object} platform
 * @return {Promise}
 */
var generateSplashForPlatform = function (platform) {
    var deferred = Q.defer();
    display.header('Generating splash screen for ' + platform.name);
    var all = [];
    var splashes = platform.splash;
    splashes.forEach(function (splash) {
        all.push(generateSplash(platform, splash));
    });
    Q.all(all).then(function () {
        deferred.resolve();
    }).catch(function (err) {
        console.log(err);
    });
    return deferred.promise;
};

/**
 * Generates icon based on the platform object
 *
 * @param  {Object} platform
 * @return {Promise}
 */
var generateIconForPlatform = function (platform) {
    var deferred = Q.defer();
    display.header('Generating icon screen for ' + platform.name);
    var all = [];
    var icons = platform.icon;
    icons.forEach(function (icon) {
        all.push(generateIcon(platform, icon));
    });
    Q.all(all).then(function () {
        deferred.resolve();
    }).catch(function (err) {
        console.log(err);
    });
    return deferred.promise;
};

/**
 * Goes over all the platforms and triggers splash screen generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateSplashes = function (platforms) {
    var deferred = Q.defer();
    var sequence = Q();
    var all = [];
    _(platforms).where({ isAdded : true }).forEach(function (platform) {
        sequence = sequence.then(function () {
            return generateSplashForPlatform(platform);
        });
        all.push(sequence);
    });
    Q.all(all).then(function () {
        deferred.resolve();
    });
    return deferred.promise;
};


/**
 * Goes over all the platforms and triggers icon generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateIcons = function (platforms) {
    var deferred = Q.defer();
    var sequence = Q();
    var all = [];
    _(platforms).where({ isAdded : true }).forEach(function (platform) {
        sequence = sequence.then(function () {
            return generateIconForPlatform(platform);
        });
        all.push(sequence);
    });
    Q.all(all).then(function () {
        deferred.resolve();
    });
    return deferred.promise;
};

/**
 * Checks if at least one platform was added to the project
 *
 * @return {Promise} resolves if at least one platform was found, rejects otherwise
 */
var atLeastOnePlatformFound = function () {
    var deferred = Q.defer();
    getPlatforms().then(function (platforms) {
        var activePlatforms = _(platforms).where({ isAdded : true });
        if (activePlatforms.length > 0) {
            display.success('platforms found: ' + _(activePlatforms).pluck('name').join(', '));
            deferred.resolve();
        } else {
            display.error('No cordova platforms found. Make sure you are in the root folder of your Cordova project and add platforms with \'cordova platform add\'');
            deferred.reject();
        }
    });
    return deferred.promise;
};

/**
 * Checks if a valid splash file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validSplashExists = function () {
    var deferred = Q.defer();
    fs.exists(settings.SPLASH_FILE, function (exists) {
        if (exists) {
            display.success(settings.SPLASH_FILE + ' exists');
            deferred.resolve();
        } else {
            display.error(settings.SPLASH_FILE + ' does not exist in the root folder');
            deferred.reject();
        }
    });
    return deferred.promise;
};

/**
 * Checks if a valid splash file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validIconExists = function () {
    var deferred = Q.defer();
    fs.exists(settings.SPLASH_FILE, function (exists) {
        if (exists) {
            display.success(settings.ICON_FILE + ' exists');
            deferred.resolve();
        } else {
            display.error(settings.ICON_FILE + ' does not exist in the root folder');
            deferred.reject();
        }
    });
    return deferred.promise;
};

/**
 * Checks if a config.xml file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var configFileExists = function () {
    var deferred = Q.defer();
    fs.exists(settings.CONFIG_FILE, function (exists) {
        if (exists) {
            display.success(settings.CONFIG_FILE + ' exists');
            deferred.resolve();
        } else {
            display.error('cordova\'s ' + settings.CONFIG_FILE + ' does not exist in the root folder');
            deferred.reject();
        }
    });
    return deferred.promise;
};

display.header('Checking Project & Splash');

atLeastOnePlatformFound()
    .then(validSplashExists)
    .then(validIconExists)
    .then(configFileExists)
    .then(getProjectName)
    .then(getPlatforms)
    .then(generateSplashes)
    .then(getProjectName)
    .then(getPlatforms)
    .then(generateIcons)
    .catch(function (err) {
        if (err) {
            console.log(err);
        }
    }).then(function () {
        console.log('');
    });
