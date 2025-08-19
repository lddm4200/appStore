const express = require("express");
const router = express.Router();

const productModel = require("../models/products");
const Upload = require("../config/common/upload");

// xem danh sach
router.get("/product", async (req, res) => {
  const product = await productModel.find();
  res.send(product);
});

// them
router.post("/product/add", Upload.single("img"), async (req, res) => {
  try {
    const data = req.body; // Lấy dữ liệu từ body
    const { file } = req; //files nếu upload nhiều, file nếu upload 1 file
    const urlImage = `${req.protocol}://${req.get("host")}/uploads/${
      file.filename
    }`;
    const newproduct = new productModel({
      name: data.name,
      pice: data.pice,
      quantity: data.quantity,
      image: urlImage,
    }); // tao mot doi tuong moi

    const result = await newproduct.save(); // them vao database
    if (result) {
      // neu them thanh cong result !null thi tra ve du lieu
      res.json({
        status: 200,
        msg: "Them thanh cong",
        data: result,
      });
    } else {
      // neu them khong thanh cong result == null thi tra ve du lieu rong []
      res.json({
        status: 400,
        msg: "Them khong thanh cong",
        data: [],
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// // update
// router.put("/product/update/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = req.body;
//     const updateProduct = await productModel.findById(id);
//     let result = null;
//     if (updateProduct) {
//       // tao 1 doi tuong moi va them vao database

//       updateProduct.tenCongViec =
//         data.tenCongViec ?? updateCongViec.tenCongViec;
//       updateCongViec.fromDate = data.fromDate ?? updateCongViec.fromDate;
//       updateCongViec.toDate = data.toDate ?? updateCongViec.toDate;
//       updateCongViec.trangThai = data.trangThai ?? updateCongViec.trangThai;
//       updateCongViec.moTa = data.moTa ?? updateCongViec.moTa;
//       updateCongViec.id_NhanVien =
//         data.id_NhanVien ?? updateCongViec.id_NhanVien;
//       result = await updateCongViec.save();
//     }

//     if (result) {
//       // neu them thanh cong result !null thi tra ve du lieu
//       res.json({
//         status: 200,
//         msg: "Cap nhat thanh cong",
//         data: result,
//       });
//     } else {
//       // neu them khong thanh cong result == null thi tra ve du lieu rong []
//       res.json({
//         status: 400,
//         msg: "Cap nhat khong thanh cong",
//         data: [],
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// // xoa
// router.delete("/product/delete/:id", async (req, res) => {
//   const { id } = req.params;
//   const result = await CongViecModel.deleteOne({ _id: id });
//   console.log(result);
//   if (result) {
//     res.json({
//       status: "200",
//       msg: "Delete success",
//       data: result,
//     });
//   } else {
//     res.json({
//       status: "400",
//       msg: "Delete fail",
//       data: [],
//     });
//   }
// });

module.exports = router;
