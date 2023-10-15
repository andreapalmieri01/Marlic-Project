import { Injectable } from '@angular/core';
import { User } from '../Models/user';

//Send data to root path.
@Injectable({
  providedIn : 'root'
})

/**
 * Class that acts as a Service to send a
 * user logged in to other project components.
 * It will be used to send the logged in user to the dashboard.
 */
export class UserService{

  /**
   * Variable to which a user logged
   * in with the set method will be associated.
   */
  private user : User | undefined;

  //Constructor for this component.
  constructor(){}

  /**
   * Method that allows you to set
   * a user logged in to the above variable.
   * This method is called in the Login component of both users.
   */
  setUser(user: User){
    this.user = user;
  }

  /**
   * Method that allows you to
   * take the User object.
   */
  getUser(){
    return this.user;
  }
}
