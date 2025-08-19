var express = require('express');
var router = express.Router();

const Users = require('../models/users')
const sanPhamModel = require('../models/sanphams')
const Upload = require('../config/common/upload');

router.get('/', (req,res) => {
    res.send('vào api mobile');
})

router.post('/register', Upload.single('avatar'), async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;
        const imgURL = `${res.protocol}://${res.get("host")}/uploads/${file.filename}`;

        const NewUser = new Users({
            username: data.username,
            password: data.password,
            email: data.email,
            fullname: data.fullname,
            avatar: imgURL,
        })

        const result = await NewUser.save();
        if (result) {
            res.json({
                "status": 200,
                "message": "Thêm thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Thêm không thành công",
                "data": []
            });
        }

    } catch (error) {
        console.log(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ username, password })
        if (user) {
            res.json({
                "status": 200,
                "messenger": "Đăng nhâp thành công",
                "data": user,
            })
        } else {
            // Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status": 400,
                "messenger": "Lỗi, đăng nhập không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})




//================================================================

router.get('/sanphams', async (req, res) => {
    try {
        const result = await sanPhamModel.find().sort({createdAt : -1});
        if(result){
            res.json({
                "status" : "200",
                "messenger" : "Danh sách sinh viên",
                "data" : result
            })
        }else{
            res.json({
                "status" : "400",
                "messenger" : "Fail",
                "data" : []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

// add student 
router.post('/sanphams/add',Upload.single('avatar'), async (req,res) => {
    //Upload.array('image',5) => up nhiều file tối đa là 5
    //upload.single('image') => up load 1 file
    try{
        const data = req.body; // Lấy dữ liệu từ body
        const { file } = req //files nếu upload nhiều, file nếu upload 1 file
        const urlImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
            // files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
        //url hình ảnh sẽ được lưu dưới dạng: http://localhost:3000/upload/filename
        const sanpham = new StudentModel({
            name : data.name,
            gia : data.gia,
            soLuong : data.soLuong,
            image : urlImage
        });

        const result = await sanpham.save();

        if(result){
            res.json({
                "status" : "200",
                "messenger" : "Add student success",
                "data" : result
            })
        }else{
            res.json({
                "status" : "400",
                "messenger" : "Add student fail",
                "data" : []
            })
        }
    }catch(err){
        console.log(err)
    }
});


// delete student
router.delete('/sanphams/delete/:id', async (req,res) => {
    const {id} = req.params;
    const result = await sanPhamModel.deleteOne({_id : id});
    if(result){
        res.json({
            "status" : "200",
            "messenger" : "Delete student success",
            "data" : result
        })
    }else{
        res.json({
            "status" : "400",
            "messenger" : "Delete fail",
            "data" : []
        })
    }
});

router.put('/sanphams/update/:id', Upload.single('avatar'), async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;
        
        // Nếu có file ảnh được tải lên, thêm URL của ảnh vào dữ liệu cần cập nhật
        if (req.file) {
            const urlImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
            updateData.avatar = urlImage;
        }
        
        // Sử dụng findByIdAndUpdate để tìm và cập nhật dữ liệu
        const result = await sanPhamModel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (result) {
            res.json({
                status: 200,
                message: "Update student success",
                data: result
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Student not found",
                data: []
            });
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
});

//search Distributor
router.get('/search', async (req, res) => {
    try {
        const key = req.query.key

        const data = await sanPhamModel.find({ name: { "$regex": key, "$options": "i" } })
            .sort({ createdAt: -1 });

        if (data) {
            res.json({
                "status": 200,
                "messenger": "Thành công",
                "data": data
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

//search Distributor
router.get('/sort', async (req, res) => {
    try {
        const { type } = req.query;
        let data = null;
        if(type == 1){ // type nhập vào là true
            data = await sanPhamModel.find().sort({ point: 1 }); // tăng dần 
        }else{
            data = await sanPhamModel.find().sort({ point: -1 }); // giảm dần
        }  

        if (data) {
            res.json({ 
                "status": 200,
                "messenger": "Thành công",
                "data": data
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }

})


module.exports = router;