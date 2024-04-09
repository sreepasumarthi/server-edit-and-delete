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
  