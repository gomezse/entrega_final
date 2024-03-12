export default class UsersResponseDto{
    constructor(user){
        this.first_name=user.name!=null?user.name.split(" ")[0]:user.first_name;
        this.last_name=user.name!=null?user.name.split(" ")[1]:user.last_name;
        this.email=user.email;
        this.orders=user.orders;
        this._id=user.id;
        this.role=user.role;
    }
}