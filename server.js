const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage: storage });


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


let crafts = [
    {
        _id: 1,
        name: "Beaded Jellyfish",
        description: "Create a hanging jellyfish using eggcartons and multicolored beads",
        supplies: [
            "string",
            "egg cartons",
            "beads"
        ],
        img: "images/bead-jellyfish.jpg"
    },
    {
        _id: 2,
        name: "Character Bookmarks",
        description: "Create a little birdy bookmark to always remin you were you were",
        supplies: [
            "yellow construction paper",
            "orange construction paper",
            "black construction paper"
        ],
        img: "images/bookmarks.jpeg"
    },

   {
        _id: 3,
        name: "Button Flowers",
        description: "Create a fun bouquet of flowers with your favorite buttons",
        supplies: [
            "multicolored buttons",
            "multicolored flet",
            "green straws",
            "ribbon"
        ],
        img: "images/button-flowers.jpeg"
    },
    {
        _id: 4,
        name: "Cheerio Necklaces",
        description: "Create a fun and edible necklace",
        supplies: [
            "Cheerios or Fruit Loops",
            "Elastic string"
        ],
        img: "images/cheerio-necklace.webp"
    },
    {
        _id: 5,
        name: "Cotton Ball Cupcakes",
        description: "Decorate your fun filled cupcake however you want.",
        supplies: [
            "Construction Paper",
            "Cotton Balls",
            "Black Sharpie",
            "Glitter"
        ],
        img: "images/cotton-ball-cupcakes.webp"
    },
    {
        _id: 6,
        name: "School Themed Mason Jars",
        description: "Let's make mason jars too",
        supplies: [
            "Construction Paper",
            "Cotton Balls",
            "Black Sharpie",
            "Glitter"
        ],
        img: "images/decorated-jars.jpeg"
    },
    {
        _id: 7,
        name: "Egg Carton Flowers",
        description: "Make a beautiful bouquet with egg cartons and other items you can find around the house",
        supplies: [
            "Egg Cartons",
            "Butons",
            "Green Pipe Cleaner",
            "Ribbon",
            "Canvas"
        ],
        img: "images/egg-carton-flowers.jpg"
    },
    {
        _id: 8,
        name: "Finger Puppets",
        description: "These little critters are easy to make, and will entertain your little one while they make a show.",
        supplies: [
            "Pom-poms",
            "Googly Eyes",
            "Pipe Cleaner"
        ],
        img: "images/finger-puppets.jpeg"
    },
    {
        _id: 9,
        name: "Ribbon Flower Headbands",
        description: "Let your little one show off her new style with these pretty and customizable headbands",
        supplies: [
            "Plain headband",
            "Ribbon",
            "Buttons",
            "Gems"
        ],
        img: "images/flower-headbands.jpg"
    },
    {
        _id: 10,
        name: "Hand Print Fish Puppets",
        description: "We all need to take every opportunity we can to remember those tiny hands, and what better way to do it, then to make fish puppets!",
        supplies: [
            "Popsicle sticks",
            "Cardstock",
            "Gems",
            "Googly Eyes"
        ],
        img: "images/handprint-fish.jpg"
    },
    {
        _id: 11,
        name: "Hand Print Tree",
        description: "This is a fun way to get your little one into finger painting.",
        supplies: [
            "Watercolor Paper",
            "Finger paint"
        ],
        img: "images/hand-print-tree.jpeg"
    },
    {
        _id: 12,
        name: "Melted Bead Bowl",
        description: "All they need to do is shape their faviorte design, warm it up and they have a brand new bowl.",
        supplies: [
            "Beads",
            "Bowl",
            "Parchment paper"
        ],
        img: "images/melted-bead-bowl.jpeg"
    },
    {
        _id: 13,
        name: "Monster Kites",
        description: "Let's make those scary toilet paper rolls fly!",
        supplies: [
            "Toilet paper rolls",
            "Paint",
            "Tissue Paper",
            "String"
        ],
        img: "images/monster-rolls.jpg"
    },
    {
        _id: 14,
        name: "Pool Noodle Boats",
        description: "Let's make a boat that will actually float, due to the floating bottom of a pool noodle.",
        supplies: [
            "Pool Noodle",
            "Straw",
            "Plastic Paper"
        ],
        img: "images/noodle-boats.png"
    },
    {
        _id: 15,
        name: "Paper Plate Bees",
        description: "Let's have fun with making cute little bees, or big bees actually.",
        supplies: [
            "Paper Plate",
            "Googly Eyes",
            "Close Pins",
            "Black pom poms",
            "Yellow Paint",
            "Black Paint"
        ],
        img: "images/paper-plate-bees.jpeg"
    },
    {
        _id: 16,
        name: "Paper Plate Dinosaurs",
        description: "Who would have thought that half a paper plate would be the base of a dinosaur.",
        supplies: [
            "Paper Plate",
            "Paint",
            "Close Pins",
            "Construction Paper"
        ],
        img: "images/paper-plate-dinosaurs.jpg"
    },
    {
        _id: 17,
        name: "Porcupine Leaves",
        description: "Let's turn an ordinary paper plate into a fun filled mask.",
        supplies: [
            "Leafs",
            "Berries",
            "Acorns",
            "Construction Paper"
        ],
        img: "images/porcupine-leaf.webp"
    },
    {
        _id: 18,
        name: "Rainbow Cloud",
        description: "Some cotton and color and you'll have a beautiful rainbow.",
        supplies: [
            "Paper Plate",
            "Cotton Balls",
            "Construction Paper"
        ],
        img: "images/rainbow-cloud.webp"
    },
    {
        _id: 19,
        name: "Fun Shaped Crayons",
        description: "Let's melt some crayons together and let them harden into fun shapes.",
        supplies: [
            "Broken Crayons",
            "Mold"
        ],
        img: "images/shaped-crayons.jpg"
    },
    {
        _id: 20,
        name: "Straw Ferris Wheel",
        description: "It might be too small to ride, but this farris wheel is the most colorful of all.",
        supplies: [
            "Multicolored straws",
            "Platform"
        ],
        img: "images/straw-faris-wheel.jpg"
    },
    {
        _id: 21,
        name: "Sunny String",
        description: "Let's practice our fine motor skills while we weave the string into a fun sun.",
        supplies: [
            "Yellow String",
            "Paper Plate",
            "Yellow construction paper",
            "Yellow and Orange beads"
        ],
        img: "images/sun-string.jpg"
    },
    {
        _id: 22,
        name: "Tissue Ballerinas",
        description: "These beautiful dancers will look great on display",
        supplies: [
            "Pipe cleaner",
            "Tissue Paper",
            "Elastics"
        ],
        img: "images/tisue-dancer.jpeg"
    },
    {
        _id: 23,
        name: "Toilet Paper Roll Animals",
        description: "These beautiful dancers will look great on display",
        supplies: [
            "Toilet Paper Rolls",
            "Construction Paper",
            "Googly Eyes"
        ],
        img: "images/toilet-paper-animals.jpeg"
    },
    {
        _id: 24,
        name: "Toilet Paper Butterfly",
        description: "Such a sweet little flyer",
        supplies: [
            "Toilet Paper Rolls",
            "Construction Paper",
            "Googly Eyes",
            "Buttons"
        ],
        img: "images/toilet-paper-butterfly.jpg"
    },
    {
        _id: 25,
        name: "Valentines Jar",
        description: "So much hearts all in one",
        supplies: [
            "Clay",
            "Glitter"
        ],
        img: "images/valentines-jar.webp"
    },
];


app.get("/api/crafts", (req, res) => {
    res.send(crafts);
});


app.post("/api/crafts", upload.single("img"), (req, res) => {
    const result = validateCraft(req.body);


    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }


    const craft = {
        _id: crafts.length + 1,
        name: req.body.name,
        description: req.body.description,
        supplies: req.body.supplies.split(","),
    };


    if (req.file) {
        craft.img = "images/" + req.file.filename;
    }


    crafts.push(craft);
    res.json(crafts);
});


const validateCraft = (craft) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        supplies: Joi.allow(""),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
    });


    return schema.validate(craft);
};


app.delete("/api/crafts/:id", (req,res) => {
    const craft = crafts.find((r)=>r._id === parseInt(req.params.id));
  
    if(!craft) {
      res.status(404).send("The craft could not be found");
      return;
    }
  
    const index = crafts.indexOf(craft);
    crafts.splice(index, 1);
    res.send(craft);
  
  });




app.listen(3040, () => {
    console.log("listening");
});



app.put("/api/crafts/:id", upload.single("img"), (req, res)=>{
    const craft = crafts.find((r)=>r._id === parseInt(req.params.id));
  
    if(!craft) res.status(400).send("craft with given id was not found");
  
    const result = validateCraft(req.body);
  
    if(result.error){
      res.status(400).send(result.error.details[0].message);
      return;
    }
  
    craft.name = req.body.name;
    craft.description = req.body.description;
    craft.supplies = req.body.supplies.split(",");
  
    if(req.file) {
      craft.img = "images/" + req.file.filename;
    }
  
    res.send(craft);
  });
  