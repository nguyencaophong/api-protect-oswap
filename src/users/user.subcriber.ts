import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const hashPassword = await bcrypt.hash(event.entity.password, 10);
    event.entity.password = hashPassword;
  }
  // async beforeUpdate(event: UpdateEvent<User>) {
  //   const hashPassword = await bcrypt.hash(event.entity.password, 10);
  //   event.entity.password = hashPassword;
  // }
}
