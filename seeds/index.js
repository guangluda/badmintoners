const mongoose = require('mongoose');
const Court = require('../models/court'); //requrie model

mongoose.connect('mongodb://localhost:27017/badmintonclash');

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',()=>{
    console.log('Databas connected!')
})


const seedDB = async()=>{
    await Court.deleteMany({});
    const C1 = new Court({
        author:'6331aeb93c5d10049243d115',
        title:'Capital Badminton Academy',
        location:'7518 LINDBERGH Dr., GAITHERSBURG, MD 20879',
        geometry: { 
            type: 'Point', 
            coordinates: [ -77.15414, 39.16504 ] 
        },
        website:'https://www.capitalbadminton.com/',
        description:'At the Capital Badminton Academy, it is our greatest ambition to promote the sport of badminton across DMV area and to train our players to compete in high-level tournaments. The shock-absorbed floor and the precise lighting system allow players to train in an injury-free environment. Our team consists of a crew of coaches coming from an internationally competitive background. Our coaches train and engage with players at the international levels and are excited to produce more extraordinary players in the future. With their professional experience, we aim to enhance our players’ quality of skills, physical ability, and mentality through an intensive and groundbreaking training method. Our training programs also range from the beginner’s level to the international level, which allows our players to flourish from a young age.',
        images:[
            {
              url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/v8labyksc9x23kttkkbg.jpg',
              filename: 'Badmintoner/v8labyksc9x23kttkkbg',
            },
            {
              url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/g0lpaozeuma1rezqcanz.jpg',
              filename: 'Badmintoner/g0lpaozeuma1rezqcanz',
            },
            {
              url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/ojiuqicvbnqrq4gungp8.jpg',
              filename: 'Badmintoner/ojiuqicvbnqrq4gungp8',
            },
            {
              url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/rwkmvvo7jzscssd1o2ho.jpg',
              filename: 'Badmintoner/rwkmvvo7jzscssd1o2ho',
            }
          ]
        
    });
    const C2 = new Court({
        author:'6331aeb93c5d10049243d115',
        title:'Northern Virginia Badminton Club',
        location:'44590 Guilford Dr # 100, Ashburn, VA 20147',
        geometry: { 
            type: 'Point', 
            coordinates: [ -77.460899, 39.025725 ] 
        },
        website:'https://novabadmintonacademy.com/nvbc/',
        description:'Northern Virginia Badminton Club (NVBC) was founded by a group of badminton players with a passion for the game and a vision to grow the sport in Ashburn, VA and its surrounding areas. Our main goal is to provide a fully dedicated and a one-stop badminton facility for fellow badminton players. We are situated in a high-ceiling (greater than 30′) facility housing 9 badminton courts with Olympic-level mats optimized for playing. We offer something for everyone in the family: coaching for children, seniors and adults; conditioning classes; summer camps; merchandise sales and many other amenities. We have players of all levels and welcome you all.',
        images:[
            {
              url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/g0lpaozeuma1rezqcanz.jpg',
              filename: 'Badmintoner/g0lpaozeuma1rezqcanz',
            },
            {
              url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/ojiuqicvbnqrq4gungp8.jpg',
              filename: 'Badmintoner/ojiuqicvbnqrq4gungp8',
            },
            {
              url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/rwkmvvo7jzscssd1o2ho.jpg',
              filename: 'Badmintoner/rwkmvvo7jzscssd1o2ho',
            },
            {
                url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/v8labyksc9x23kttkkbg.jpg',
                filename: 'Badmintoner/v8labyksc9x23kttkkbg',
              }
          ]
    });
    const C3 = new Court({
        author:'6331aeb93c5d10049243d115',
        title:'Royal Badminton Academy',
        location:'21598 Atlantic Blvd, Suite 100, Sterling, VA 20166',
        geometry: { 
            type: 'Point', 
            coordinates: [ -77.423075, 39.017625 ] 
        },
        website:'https://royalbadmintonacademy.com/',
        description:'Royal Badminton Academy has World-class badminton coaching for all levels for age 5 and above in the Northern Virginia and DC Metropolitan area. Head coach Dr. Afshin Royal is currently one of the best coaches in the region, who is completed his Doctorate in Physical Education and currently a faculty member of George Mason University, Former world ranking player, Badminton World Federation, and USA Badminton high-performance coach with 30 years of coaching and 40 years of playing experience. Indeed, the combination of knowledge and experience can help the principled development of badminton players. Dr. Afshin Royal is a master of finding the best way for players to progress quickly and healthily at the international level. He believes in teamwork with families to achieve goals. He strongly believes athletes can design their lifestyle in sports and learn how to find solutions with great discipline for the challenges.',
        images:[
            {
              url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/ojiuqicvbnqrq4gungp8.jpg',
              filename: 'Badmintoner/ojiuqicvbnqrq4gungp8',
            },
            {
              url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/rwkmvvo7jzscssd1o2ho.jpg',
              filename: 'Badmintoner/rwkmvvo7jzscssd1o2ho',
            },
            {
                url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/v8labyksc9x23kttkkbg.jpg',
                filename: 'Badmintoner/v8labyksc9x23kttkkbg',
              },
              {
                url: 'https://res.cloudinary.com/do2m8d7kl/image/upload/v1664595964/Badmintoner/g0lpaozeuma1rezqcanz.jpg',
                filename: 'Badmintoner/g0lpaozeuma1rezqcanz',
              }
          ]
    });
    await C1.save();
    await C2.save();
    await C3.save();   
}

seedDB().then(()=>{
    mongoose.connection.close()
});