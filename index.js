"use strict";
import express from 'express';//подключаем express
import ExpressHandlebars from 'express-handlebars';//шоблонизатор
import path from 'path';//получаем абсолютный путь до файла
import bodyParser from 'body-parser';/* Для поддержки работы нам нужно установить промежуточное ПО body-parser */
import mongodb, { ObjectId } from 'mongodb';//импортировать установленный драйвер

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
        const db = mongo.db('test2');//подключаемся к созданной базе данных
        const coll = db.collection('content');//получаем колекцию из базы


        app.get('/', async (req, res) => {
            const headerData = await coll.findOne({_id: ObjectId("6370a094527938d9ee5604d9")});
            const mainImg = await coll.findOne({_id: ObjectId('6370a5c3527938d9ee5604da')});

            await res.render('index', {
                title: 'Главная страница',
                header: headerData,
                imgSrc: mainImg
            });

            console.log(headerData);
            console.log(mainImg);
        });
        
        
        app.use((req, res) => {
            res.status(404).send('Page not found');
        });
        app.listen(PORT, () => {
            console.log(`Server running ${PORT}`);
        });
    } else {
        console.error(err);
    }
});
