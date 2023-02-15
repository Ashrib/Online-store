import express from 'express';
import {productModel ,categoryModel} from './dbmodels.mjs'
import mongoose from 'mongoose';

const router = express.Router()

router.post('/product', (req, res) => {
    const body = req.body;
   
  if ( // validation
      !body.name||
      !body.price||
      !body.unit||
      !body.category||
      !body.image
      
  ) {
      res.status(400).send({
          message: "required parameters missing",
      });
      return;
  }

  console.log(body)

    productModel.create({
        name: body.name,
        price: body.price,
        unit: body.unit,
        description: body.description,
        category: body.category,
        image:body.image ,
    },
        (err, saved) => {
            if (!err) {
                console.log(saved);
                res.send({
                    message: "Item posted successfully"
                });
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })

})

router.get('/products', (req, res) => {
    productModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "got all products successfully",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
 
})
//category
router.get('/categories', (req, res) => {
    categoryModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "got all categories successfully",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
 
})

router.post('/category', (req, res) => {
    const body = req.body;
   
  if ( // validation
      !body.category
       
  ) {
      res.status(400).send({
          message: "required parameters missing",
      });
      return;
  }

  console.log("cat body",body)

  categoryModel.findOne({ name: body.category }, (err, category) => {
    if (!err) {
        console.log("category: ", category);

        if (category) { // category already exist
            console.log("category already exist: ", category);
            res.status(400).send({ message: "category already exist, Please try a different name" });
            return;
        }

        else{
            categoryModel.create({
                name:body.category
            
            },
                (err, saved) => {
                    if (!err) {
                        console.log(saved);
                        res.send({
                            message: "Category posted successfully"
                        });
                    } else {
                        res.status(500).send({
                            message: "server error"
                        })
                    }
                })

        }
    }

   

})
})

router.get('/productFeed', (req, res) => {
    const page = req.query.page || 0

    productModel.find(
        { isDeleted: false },
        {},
        {
            sort: { "_id": -1 },
            limit: 50,
            skip: 0,
            populate:
            {
                path: "owner",
                select: 'fullName email'
            }
        }
        , (err, data) => {
            if (!err) {
                res.send({
                    message: "got all tweets successfully",
                    data: data
                })
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        });
})

router.get('/product/:id', (req, res) => {

    const id = req.params.id;

    productModel.findOne({ _id: id }, (err, data) => {
        if (!err) {
            if (data) {
                res.send({
                    message: `Get item by id: ${data._id} success`,
                    data: data
                });
            } else {
                res.status(404).send({
                    message: "item not found",
                })
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

router.delete('/product/:ids', (req, res) => {
    const id =req.params.ids;
    productModel.deleteOne({
        _id: id,
        owner: new mongoose.Types.ObjectId(req.body.token._id)

    }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "tweet has been deleted successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No tweet found with this id: " + id,
                });
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });


    
})

router.put('/product/:editId', async (req, res) => {

    const body = req.body;
    const id = req.params.editId;

    if ( // validation
        !body.text
     
    ) {
        res.status(400).send({
            message: "required parameters missing"
        });
        return;
    }

    try {
        let data = await productModel.findByIdAndUpdate(id,
            {
                text: body.text,
              
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "product modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})

export default router