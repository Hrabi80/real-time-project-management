import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRoles } from 'src/modules/user/enums/user.enum';

@Injectable()
export class SeedService {
  async run() {
    await this.createUsers();
  }

  private async createUsers() {
    const usersData = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Admin@123',
        role: UserRoles.ADMIN,
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'Manager@123',
        role: UserRoles.MANAGER,
      },
      {
        name: 'Member User',
        email: 'member@example.com',
        password: 'Member@123',
        role: UserRoles.MEMBER,
      },
    ];

    for (const userData of usersData) {
      const user = new User();
      user.name = userData.name;
      user.email = userData.email;
      user.password = await bcrypt.hash(userData.password, 10);
      user.role = userData.role;
      await user.save();
    }

    console.log('Users seeded successfully');
  }
}
