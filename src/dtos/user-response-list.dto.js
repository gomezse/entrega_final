export default class UsersResponseListDto{
    constructor(user){
        this._id=user._id;
        this.name=user.first_name;
        this.email=user.email;
        this.accountType =user.role;
    }
}