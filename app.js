const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')


mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"))
db.once("open", () => { console.log("Database Connected")})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));



app.get('/',(req,res) => {
    res.render('home')
})

app.get('/makecampground',async(req,res) => {
    const camp = new Campground({title: 'My backyard', description:'Cheap place'})
    await camp.save()
    res.send(camp)
});

app.get('/campgrounds',async(req,res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index',{camps})

});
app.get('/campgrounds/:id/edit',async(req,res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{camp})

})

app.get('/campgrounds/new',(req,res) => {
    res.render('campgrounds/new')

})

app.get('/campgrounds/:id',async(req,res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/show',{camp})

});

app.post('/campgrounds',async(req,res) => {
const campground = new Campground(req.body.campground)
await campground.save();
res.redirect(`/campgrounds/${campground._id}`)
});

app.put('/campgrounds/:id',async(req,res) => {
        const {id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
        res.redirect(`/campgrounds/${id}`)
    });

app.delete('/campgrounds/:id',async(req,res) => {
        const {id } = req.params;
        const campground = await Campground.findByIdAndDelete(id)
        res.redirect(`/campgrounds/`)
    });

app.use(async(req,res) => {
      res.render('campgrounds/404Page.ejs')

    });





app.listen(3000, () => {
    console.log('Serving on port 3000')
})