"use strict";
import express from 'express';//подключаем express
import ExpressHandlebars from 'express-handlebars';//шоблонизатор
import path from 'path';//получаем абсолютный путь до файла
import bodyParser from 'body-parser';/* Для поддержки работы нам нужно установить промежуточное ПО body-parser */
import mongodb from 'mongodb';//импортировать установленный драйвер

const __dirname = path.resolve();//переобразовываем path
const PORT = process.env.PORT ?? 3001;//проверяет есть ли порт
const app = express();//инициализация Express
const handlebars = ExpressHandlebars.create({//handlebars
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static(path.resolve(__dirname, 'app')));//определяем корневую папку
app.use(bodyParser.urlencoded({extended: true}));//Используем его для обработки всех форм

const mongoClient = new mongodb.MongoClient('mongodb://localhost:27017/', {//настройки подключения
	useUnifiedTopology: true
});
mongoClient.connect(async function(error, mongo) {//установливаем подключение к MongoDB
    if(!error) {
        const db = mongo.db('test');//подключаемся к созданной базе данных
        const coll = db.collection('users');//получаем колекцию из базы

        let user = await coll.find().toArray();

    } else {
        console.error(err);
    }
});


app.get('/', async (req, res) => {
    await res.render('index', {title: 'Главная страница'});
});


app.use((req, res) => {
    res.status(404).send('Page not found');
});
app.listen(PORT, () => {
    console.log(`Server running ${PORT}`);
});