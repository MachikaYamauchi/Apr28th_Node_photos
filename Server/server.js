import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import 'dotenv/config';

// const db = mysql.createConnection({
//     host:'localhost',
//     port: 8889,
//     user: 'root',
//     password: 'root',
//     database: 'PhotoGallery'
// })

const db = mysql.createConnection({
    host:process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
})

let jsonData = [
    {
        "albumId": 1,
        "id": 1,
        "title": "accusamus beatae ad facilis cum similique qui sunt",
        "url": "https://via.placeholder.com/600/92c952",
        "thumbnailUrl": "https://via.placeholder.com/150/92c952"
      },
      {
        "albumId": 1,
        "id": 2,
        "title": "reprehenderit est deserunt velit ipsam",
        "url": "https://via.placeholder.com/600/771796",
        "thumbnailUrl": "https://via.placeholder.com/150/771796"
      },
      {
        "albumId": 1,
        "id": 3,
        "title": "officia porro iure quia iusto qui ipsa ut modi",
        "url": "https://via.placeholder.com/600/24f355",
        "thumbnailUrl": "https://via.placeholder.com/150/24f355"
      },
      {
        "albumId": 1,
        "id": 4,
        "title": "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
        "url": "https://via.placeholder.com/600/d32776",
        "thumbnailUrl": "https://via.placeholder.com/150/d32776"
      }
];

const server = express();
server.use(cors());
server.use(express.json()); // this tells node to apply json format to all data
server.use(express.static('uploads'));// make the "uploads" file to public so can access from "localhost:4400/uploads"



db.connect(error=>{
    if(error)
        console.log('Sorry cannot connect to db: ', error);
    else
        console.log('Connected to mysql db');
})

// configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
})

// create instance of multer configuration settings
const fileupload = multer({storage:storage})

// "file_fromC" should match with the name of input tag's value
server.post('/upload', fileupload.single("file_fromC"), (req, res) => {
    res.json({fileupload:true});
});

server.get('/photos', (req, res) => {
    let query = "CALL `getPhotos`()";
    db.query(query, (error, allphotos) => {
        if(error) {
            res.json({allphotos:false, message:error})
        }
        else {
            res.json({allphotos:allphotos[0], message:"returned photos"})
        }
    })
})

server.get("/photos/:photoid", (req, res) => {
    let query = "CALL `getPhotoByID`(?)";
    db.query(query, [req.params.photoid], (error, photo) => {
        if(error) {
            res.json({photo:false, message:error})
        }
        else {
            res.json({photo:photo[0][0], message:"Returned photo by ID"})
        }
    })
})

server.post('/photos', (req, res)=> {
    let query = "CALL `addPhoto`(?, ?, ?, ?)";
    db.query(query, [req.body.albumId_fromC, req.body.title_fromC, req.body.url_fromC, req.body.tn_fromC], (error, newphoto) => {
        if(error) {
            res.json({newphoto:false, message:error});
        }
        else {
            res.json({newphoto:newphoto[0], message:"add success"})
        }
    })
})

// When deleting, (1)fetch the filename by getPhotoById(), (2)delete the phisical file from uploads, (3)delete photo from DB
server.delete('/photos/:id', (req,res) => {
    let query = "CALL `deletePhoto`(?)";
    let getFilename = "CALL `getPhotoByID`(?)";
    db.query(getFilename, [req.params.id], (error, data) => {
        // res.json(data[0][0].url);
        if(error) {

        }
        else {
            let file_to_be_deleted = data[0][0].url;
            fs.unlink('./uploads/' + file_to_be_deleted, (error) => {
                if(error) {
                    res.json({deleteStatus:false, message:error});
                }
                else {
                    db.query(query, [req.params.id], (error, deleteStatus) => {
                        if(error) {
                            res.json({deleteStatus:false, message:error});
                        }
                        else {
                            let del_success = deleteStatus[0][0].DEL_SUCCESS
                            if(del_success === 1) {
                                res.json({deleteStatus:del_success, message:"successfullt deleted"});
                            }
                            else {
                                res.json({deleteStatus:del_success, message:"ID not found"});
                            }
                            
                        }
                    })
                }
            })
        }
        
    })

})

// // This is OK, but this is not recommended because of separtion of concerns.
// server.get('/employeesapi', (req, res) => {
//     // let allempSP = "CALL `All_Emp_data`()";
//     // we can write query inside "" as 
//     let allempSP = "SELECT * FROM Employees";
//     let query = db.query(allempSP, (error, data, fields) => {
//         if(error) {
//             // console.log(error);
//             res.json({ErrorMessage: error})
//         }
//         else {
//             // console.log(data);
//             res.json(data);
//         }
//     })
// })

// server.get('/employeessp', (req, res) => {
//     let allEmpSP = "CALL `All_Emp_data`()";
//     let query = db.query(allEmpSP, (error, data, fields) => {
//         if(error) {
//             res.json({ErrorMessage:error});
//         }
//         else {
//             // If fetching data from stored procedure of database, getting 2 arrays. that is why add [0].
//             res.json(data[0])
//         }
//     })
// })

// server.get('/employeesapi/:id', (req, res) => {
//     let emp_id = req.params.id;
//     // if there is 2 params, add (?, ?)
//     let empSP = "CALL `One_Emp_data`(?)";
//     // if there is two params, add params here like [emp_id, dep_id]
//     db.query(empSP, [emp_id], (error, data, fields) => {
//         if(error) {
//             res.json({ErrorMessage: error})
//         }
//         else {
//             res.json(data[0]);
//         }
//     })
// })

// server.post('/login', (req, res) => {
//     // get email and password from client
//     let email = req.body.email;
//     let password = req.body.password;
//     let loginQuery = 'CALL `login`(?, ?);';
//     db.query(loginQuery, [email, password], (error, data) => {
//         if(error) {
//             res.json({ErrorMessage:error});
//         }
//         else {
//             if(data[0].length === 0) {
//                 res.json({data:data[0], login: false, message:"Sorry, you have provided wrong credentials"})
//             }
//             else {
//                 res.json({
//                     userID:data[0].userID,
//                     email:data[0].email,
//                     data: data[0],
//                     login:true,
//                     message:"Login successfull"
//                     // Create the Authentification Key
//                 });
//             }
//         }
//     })
// })

// server.post('/signup', (req, res) => {
//     let first_name = req.body.first_name;
//     let last_name = req.body.last_name;
//     let phone_number = req.body.phone_number;
//     let email = req.body.email;
//     let password = req.body.password;
//     let signupQuery = 'CALL `signup`(?, ?, ?, ?, ?)';
//     db.query(signupQuery, [first_name, last_name, phone_number, email, password], (error, data) => {
//         if(error) {
//             res.json({signup: false, message:error})
//         }
//         else {
//             // if(data[0].length === 0) {
//             //     res.json({data:data[0], signup:false, message:"Sorry, you failed to signup"});
//             // }
//             // else {
//             //     res.json({
//             //         data:data[0],
//             //         signup:true,
//             //         message:"Signup success!!"
//             //     })
//             // }
//             res.json({
//                 signup:true,
//                 message:"Login successfull"
//             })
//         }
//     })
// })

// server.put('/updateUser', (req, res) => {
//     let userID = req.body.userID;
//     let first_name = req.body.first_name;
//     let last_name = req.body.last_name;
//     let phone_number = req.body.phone_number;
//     let email = req.body.email;
//     let password = req.body.password;
//     let query = "CALL `updateUser1`(?, ?, ?, ?, ?, ?)";
//     db.query(query, [userID, first_name, last_name, phone_number, email, password], (error, data) => {
//         if(error) {
//             res.json({update:false, message:error});
//         }
//         else {
//             res.json({update:true, message:"User successfully updated"});
//         }
//     })
// })

// server.delete('/deleteuser/:id', (req, res)=> {
//     let userID = req.params.id;
//     let query = " CALL `deleteUser`(?)";
//     db.query(query,[userID], (error, data)=> {
//         if(error) {
//             res.json({deleteUser:false, message:error})
//         }
//         else {
//             res.json({deleteUser:true, message:"User deleted successfully"})
//         }
//     })
// })

// server.get('/user/:id', (req, res) => {
//     // id is send by URL, so use params
//     let userID = req.params.id;
//     let query = "CALL `getUser`(?)";
//     db.query(query, [userID], (error, data) => {
//         if(error) {
//             res.json({user:false, message:error});
//         }
//         else {
//             if(data[0].length === 0) {
//                 res.json({user:false, message:"No user with that ID exists"})
//             }
//             else {
//                 res.json({user:true, message:"User found", userData:data[0]});
//             }
//         }
//     })
// })

// req is data from the client to the server
// res is data from the server to the client
server.get('/photosapi', (req, res) => {
    res.json(jsonData);
})

server.get('/photosapi/:photoid', (req, res) => {
    let id_from_client = req.params.photoid;
    res.json(jsonData.find(x => x.id == id_from_client));
})
server.listen(4400, function(){
    console.log('Server is successfully running on port 4400', process.env.DBPORT)
})