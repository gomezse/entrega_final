export default class UsersResponseDto{
    constructor(user){
        this.first_name=user.name.split(" ")[0];
        this.last_name=user.name.split(" ")[1];
        this.email=user.email;
        this.orders=user.orders;
    }
}