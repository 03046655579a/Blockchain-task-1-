const express = require('express');
const router = express.Router();
const Run = require('run-sdk');
const run = new Run({
    network: 'mock',
    
});
run.trust('*');


class Order extends Jig {

    init(){
        this.order = [];

    }

    set (order){
        console.log(order);
      this.order.push(order);
    }
    get(){
        return this.order;
    }
    getbyId(id){
        for (let i=0 ; i < this.order.length ; i++){
            if(this.order[i].orderId == id){
                return this.order[i];
            }
        }
        return res.status(400).json({
            error: "NO order found in DB"
          });
           
           
        }

        purchase(buy){
           
            for (let i=0 ; i < this.order.length ; i++){
                if(this.order[i].orderId == buy.orderId){
                    this.order[i].quantity = this.order[i].quantity - buy.quantity;
                    if(this.order[i].quantity <= 0){
                        this.order[i].Status = "Out Of Stock"
                    }
                    return this.order[i];
                }
            }
            
        }
        reverse(buy){
            for (let i=0 ; i < this.order.length ; i++){
                if(this.order[i].orderId == buy.orderId){
                    this.order[i].quantity = this.order[i].quantity + buy.quantity;
                    if(this.order[i].quantity > 0){
                        this.order[i].Status = "Available"
                    }
                    return this.order[i];
                }
            }
        }

}


const orderobj = new Order();
/*
 code to generate purse and owner private keys
 console.log(run.purse.address);
 console.log(run.purse.privkey);
 console.log(run.owner.address);
 console.log(run.owner.privkey);*/

router.param('orderId', async (req, res, next , id) => {
    try {
          const order = orderobj.getbyId(id);
          console.log("pohanch",order );
          if(!order){
            return res.status(400).json({
                error: "NO order found in DB"
              });
          }
          req.order = order;
           next();
    }catch(err) {
        console.log(err);
    }
})


router.post('/createproduct', async (req, res) => {
       
    try {
        orderobj.set(req.body);
        await orderobj.sync();
        res.json({
            location: orderobj.location
          });
    }catch(error) {
           console.log(error);    }
    

   

});

router.get("/getAllorder", async (req, res) => {
    try {
          res.json({reply: orderobj.get()})
          
    
    } catch (error) {
        console.log(error);
    }
    });

    router.get("/getstatus/:orderId", async (req, res) => {
        try {
              res.json({OrderStatus: req.order.Status})
              
        
        } catch (error) {
            console.log(error);
        }
        });

    router.post("/createorder/:orderId", async (req, res) => {
        try{
            const {orderName , orderId, price, quantity, Status} = req.body;
    if(req.order.Status == "Available" && req.order.quantity >= quantity && 
    req.order.orderId == orderId){
        console.log("enter");
      const purchase =  orderobj.purchase(req.body);
        await orderobj.sync();
        res.json({
            updatedversion: purchase
          });   
                   }

        } catch (err) {
            console.log(err);
        }
    });
     router.put("/reverseorder/:orderId", async (req, res) => {
         try {
            const {orderName , orderId, price, quantity, Status} = req.body;
            if(req.order.orderId == orderId){
                console.log("enter");
              const reversepurchases =  orderobj.reverse(req.body);
                await orderobj.sync();
                res.json({
                    updatedversion: reversepurchases
                  });   
                           }
             
         } catch (error) {
             console.log(error);
         }
     })


module.exports = router;
