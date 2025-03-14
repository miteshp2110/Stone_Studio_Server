const db = require('../config/db');

exports.checkout = (req, res) => {
  const user_id = req.user.id;

  const orderQuery = `
    INSERT INTO orders (user_id, total_price, status)
    SELECT user_id, SUM(products.price * cart.quantity), 'completed'
    FROM cart JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;
  db.query(orderQuery, [user_id], (err, orderResult) => {
    if (err) return res.status(500).json(err);
    const order_id = orderResult.insertId;
    
    db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       SELECT ?, product_id, quantity, products.price
       FROM cart JOIN products ON cart.product_id = products.id
       WHERE cart.user_id = ?`,
      [order_id, user_id],
      (err, orderItemsResult) => {
        if (err) return res.status(500).json(err);
        db.query("DELETE FROM cart WHERE user_id = ?", [user_id], (err, deleteResult) => {
          if (err) return res.status(500).json(err);
          res.json({ success: true, order_id });
        });
      }
    );
  });
};


exports.orderHistory = (req, res) => {
  const user_id = req.user.id;
  db.query(" select orders.id,products.id as p_id ,products.name,products.image_urls,products.price, order_items.quantity, (products.price*order_items.quantity) as product_total,orders.created_at as date, orders.total_price,orders.status from orders join order_items join products  where orders.id = order_items.order_id and order_items.product_id = products.id and orders.user_id = ?;", [user_id], (err, results) => {
    if (err) return res.status(500).json(err);

    var orderMap = new Map();
    results.map((result) => {
      if(orderMap.has(result.id)){
        var currentOrder = orderMap.get(result.id);
        currentOrder.items.push({
          id: result.p_id,
          name: result.name,
          price: result.price,
          quantity: result.quantity,
          image: result.image_urls[0]
        });
        orderMap.set(result.id,currentOrder);
      }
      else{
        orderMap.set(result.id,{
          id:result.id,
          date:result.date,
          items:[
            {
              id: result.p_id,
              name: result.name,
              price: result.price,
              quantity: result.quantity,
              image: result.image_urls[0]
            }
          ],
          total:result.total_price,
          status:result.status==='completed'?'Delivered':'Pending'
        })
      }
    });
    const resultArray = Array.from(orderMap.values());
    // console.log(resultArray)
    // console.log(orderMap)
    res.json(resultArray);
  });
};
