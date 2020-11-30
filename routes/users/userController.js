const bcrypt = require("bcryptjs")
const User = require('./User')
const jwt = require('jsonwebtoken')

module.exports ={
    createUser: async (req, res) => {
      

        try{

            let createUser = new User({
                email: req.body.email,
                password: req.body.password
            })

            createUser.password

            let genSalt = await bcrypt.genSaltSync(10);
            let hashedPassword = await bcrypt.hashSync(createUser.password, genSalt);

            createUser.password = hashedPassword

            await createUser.save()

            res.json({
                message: 'user created'
            })
        }
        catch (e) {
            
            console.log(e.code);
            if(e.code === 11000){
                res.status(409).json({
                    message: "email already in sue"
                })
            }
            res.status(500).json({
                message: 'something went wrong'
            })
        }
    },
    signin: async (req, res) =>{

        try{

           let foundEmail = await User.findOne({
              email: req.body.email
           })
           console.log(foundEmail)
           if(!foundEmail){
              throw {message: "No user, please sign up!", status: 404}
           }else {

           let comparedPassword = await bcrypt.compare(req.body.password, foundEmail.password)
           if(!comparedPassword){
               throw {message:"Incorrect password", status: 401}
           }

           let token = jwt.sign({ email: foundEmail.email, _id: foundEmail._id }, 'gangstas', { expiresIn: '1m'});
           res.json({
               jwtToken: token
           })
        }
        }
        catch (e){

            if(e.status === 404){
                res.status(e.status).json({message: e.message})
            }else if(e.status === 401){
                res.status(e.status).json({message: e.message})
            } else 
            res.status(500).json({
                message: 'something went wrong'
            })
        }

    }

}