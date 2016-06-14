#!/usr/bin/env bash

uglifycss css/bootstrap.min.css css/stylesheet.css css/media.css css/font-awesome.min.css > css/combined.min.css
uglifyjs js/jquery.min.js js/bootstrap.min.js js/custom.js > js/combined.min.js
optipng images/*.png