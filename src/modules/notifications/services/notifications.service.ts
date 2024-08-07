import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationEntity } from '../entities/notification.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UserService } from 'src/modules/users/services/user.service';
import { string } from 'joi';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // Function to create a new notification
  async createNotification(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = this.notificationRepository.create(createNotificationDto);
      // Save the notification in the database
      return await this.notificationRepository.save(notification);
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // Function to delete a notification by ID
  async deleteNotification(notificationId: string): Promise<void> {
    if (!notificationId) {
      throw new HttpException('Notification ID not provided', HttpStatus.BAD_REQUEST);
    }
    
    try {
      const result = await this.notificationRepository.delete(notificationId);
      
      if (result.affected === 0) {
        throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new HttpException('Notification not found', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Function to find notifications by user ID
  async findNotificationsByUser(userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { userId: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
/*       let { id, status, action, title, description, notificationDate, receptorUser, emisorUser }: any = await this.notificationRepository.find({ where: { receptorUser: userId } })
      emisorUser = await this.userService.getUserById(emisorUser);
      const username = user.userName;
      return { id, status, action, title, description, notificationDate, receptorUser, emisorUser } */

      return await this.notificationRepository.find({where: { receptorUser: userId } })

    } catch (error) {
      console.error('Error finding notifications:', error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
