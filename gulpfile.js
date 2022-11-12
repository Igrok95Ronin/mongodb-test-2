import gulp from 'gulp';//gulp
import dartSass from 'sass';/* припроцессор sass/scss */
import gulpSass from 'gulp-sass'/* припроцессор sass/scss */
const sass = gulpSass(dartSass);/* припроцессор sass/scss */
import cleanCSS from 'gulp-clean-css';//min css
import concat from 'gulp-concat';/* объединяет несколько файлов в один и меняет название */
import sourcemaps from 'gulp-sourcemaps'/* карта */
import autoprefixer from 'gulp-autoprefixer';/* web префиксы для старых браузеров */
import uglify from 'gulp-uglify';/* минификация js */
import babel from 'gulp-babel';/* Переобразует js в старый стандарт npm i gulp-babel -D */
import imagemin from 'gulp-imagemin';/* минификация изображений npm i -D gulp-imagemin@7.1.0 эту версию*/
import newer from 'gulp-newer';/* позволяет отслеживать новые файлы */


function style() {
    return gulp.src('src/scss/*.scss')
    .pipe(sourcemaps.init())/* начало карты */
    .pipe(concat('style.min.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version'],/* префиксы для старых версий последние 10 версий браузеров */
        grid: true
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())/* конец карты */
    .pipe(gulp.dest("app/css"))
}

function script() {
    return gulp.src('src/js/main.js')
    .pipe(babel({
        presets: ['@babel/env']/* для поддержки старых версий js этот пресет необходимо отдельно
        установить npm i -D @babel/preset-env */
    }))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
}

function images() {
    return gulp.src('./src/img/*')
    .pipe(newer('app/img'))
    .pipe(imagemin(/* минификация */
            [
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ]
        ))
    .pipe(gulp.dest('app/img/'))
}

function fonts() {
    return gulp.src('./src/fonts/*')
    .pipe(gulp.dest('app/fonts'))
}

function icons() {
    return gulp.src('./src/icons/*')
    .pipe(gulp.dest('app/icons'))
}


function watches() {
    gulp.watch('src/scss/', style);
    gulp.watch('src/js', script);
    gulp.watch('src/img', images);
    gulp.watch('src/fonts', fonts);
    gulp.watch('src/icons', icons);
} 


export default  gulp.parallel(style, script, images, fonts, icons, watches);