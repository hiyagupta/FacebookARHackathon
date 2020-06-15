/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

// How to load in modules
const Scene = require('Scene');
const Time = require('Time');

//In milliseconds
const calculationSpeed = 50;

// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');

//Adding obstacleUpdate to the timer so it'll update over time;
const intervalTimer = Time.setInterval(obstacleUpdate, calculationSpeed);

var obstacleSpeed = 0.005;
var previousValue = -0.15;
var minX = -.1;
var maxX = .1;

function obstacleUpdate() {
    //Example code for retrieving an object
    Promise.all([Scene.root.findFirst('Obstacle'),]).then(function (results) {
        const obstacle = results[0];
        previousValue += obstacleSpeed;

        if (previousValue > 0.15) {
            obstacle.transform.x = getRandomFloat(minX, maxX);
            previousValue = -0.15;
        }

        obstacle.transform.y = 0;
        obstacle.transform.z = previousValue;
    })
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// To use variables and functions across files, use export/import keyword
// export const animationDuration = 10;

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

// To access scene objects
// const directionalLight = Scene.root.find('directionalLight0');

// To access class properties
// const directionalLightIntensity = directionalLight.intensity;

// To log messages to the console
// Diagnostics.log('Console message logged from the script.');