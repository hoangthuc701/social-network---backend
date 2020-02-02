exports.createPostValidator = (req,res,next)=>{
    //check title
    req.check('title',"Write a title").notEmpty();
    req.check('title',"Title must be between 5 to 50 charaters.").isLength({
        min:4,
        max:50
    });
     //check body
     req.check('body',"Write a body").notEmpty();
     req.check('body',"Body must be between 5 to 500 charaters.").isLength({
         min:4,
         max:500 
     });
     //check for error
     const errors = req.validationErrors();
     if (errors)
     {
         const firstError = errors.map((err)=> err.msg)[0];
         return res.status(400).json({
             error: firstError
         })
         
     }
     //process to next middleware
     next();
}
exports.userSignUpValidator = (req,res,next)=>{
    req.check('name',"Name is required.").notEmpty();
    req.check('email',"Email must be between 3 to 32 characters.")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
        min:4,
        max:32
    })
    req.check('password',"Password is required.").notEmpty()
    req.check('password')
    .isLength({
        min:6
    })
    .withMessage("Password must containt at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain number")
    //check for error
    const errors = req.validationErrors();
    if (errors)
    {
        const firstError = errors.map((err)=> err.msg)[0];
        return res.status(400).json({
            error: firstError
        })
        
    }
    //process to next middleware
    next();
}
exports.passwordResetValidator = (req,res,next)=>{
    //console.log(req.body.newPassword);
    //check for password
    req.check("newPassword", "Password is required").notEmpty()
    req.check("newPassword")
        .isLength({min:6})
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("Password must contain a number")
    //check for error
    const errors = req.validationErrors();
    if (errors)
    {
        const firstError = errors.map((err)=> err.msg)[0];
        return res.status(400).json({
            error: firstError
        })
        
    }
    //process to next middleware
    next();
}