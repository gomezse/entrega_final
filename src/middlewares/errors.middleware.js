export const errorMiddleware =(error,req,res,next) =>{
    console.log(error);
    res.status(error.code||500)
    .json({message:error.message,name:error.name});
};