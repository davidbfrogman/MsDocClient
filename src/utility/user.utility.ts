import { User } from 'models';

export class UserUtility {
    public static BuildUsersFromResponse(response: any): Array<User> {
        const usersArray = Array<User>();
        for (const users in response) {
          const user = new User();
          user.name = users;
          user.email = response[users];
          user.nameAndEmail = `${user.name} <${user.email}>`;
          if (user.name.length !== 0) {
            usersArray.push(user);
          }
        }
        return usersArray;
    }
}
