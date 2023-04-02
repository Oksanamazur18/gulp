// function defaultTask(cb) {
//     console.log('gulp works');
//      cb();
//    }
   
//    exports.default = defaultTask;

   import gulp from "gulp";

// import webp from "imagemin-webp";
// import extReplace from "gulp-ext-replace";


//   const gulp = require('gulp');
  
// const { series, parallel } = require('gulp');
import series from "gulp";
import parallel from "gulp";
// const pug = require('gulp-pug');
import pug from "gulp-pug";
// const sass = require('gulp-sass');
import sass from "gulp-sass";
// const autoprefixer = require('gulp-autoprefixer');
import autoprefixer from "gulp-autoprefixer";
// const cssnano = require('gulp-cssnano');
import cssnano from "gulp-cssnano";
// const rename = require("gulp-rename");
import rename from "gulp-rename";
// const babel = require('gulp-babel');
import babel from "gulp-babel";
// const uglify = require('gulp-uglify');
import uglify from "gulp-uglify";
// const concat = require('gulp-concat');
import concat from "gulp-concat";
// const imagemin = require('gulp-imagemin');
   import imagemin from "gulp-imagemin";
// const browserSync = require('browser-sync').create();
import pkg from "browser-sync";
const {browserSync} = pkg;

// const del = require('del');
// import {del} from "del";
import {deleteAsync}  from "del";


const html = () => {
    return gulp.src('src/pug/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('build'))
}

const styles = () => {
    return gulp.src('src/styles/*.scss')
        .pipe(sass().on('err', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename( { suffix: '.min' } ))
        .pipe(gulp.dest('build/css'))
}

const scripts = () => {
    return gulp.src('src/scripts/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('build/js'))
}
let image;
import("gulp-imagemin").then(res => {
  image = res;
});
const images = () => {
    return gulp.src('src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
}

const server = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false
    });
    browserSync.watch('build', browserSync.reload)
}

const deleteBuild = (cb) => {
    return deleteAsync('build/**/*.*').then(() => { cb() })
}

const watch = () => {
    gulp.watch('src/pug/**/*.pug', html);
    gulp.watch('src/styles/**/*.scss', styles);
    gulp.watch('src/scripts/**/*.js', scripts);
    gulp.watch('src/images/*.*', images);
}

export default {    deleteBuild,
    parallel(html, styles, scripts, images),
    parallel(watch, server)}