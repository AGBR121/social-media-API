// src/modules/notifications/entities/notification.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';// if need more entity you can add here
import { UserEntity } from '../../users/entities/user.entity';

export enum NotificationAction {
    MESSAGES = 'messages',
    LIKES = 'likes',
    COMMENTS = 'comments',
    FOLLOWS = 'follows',
  }

@Entity('notifications')
export class NotificationEntity {
    // here define the notification entity
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({type: 'varchar', length:100, nullable: false})
    emisorUser: string;
    
    @ManyToOne(()=>UserEntity, (user) => user.id)
    receptorUser:UserEntity;

    @Column({type: 'boolean', default: false})
    status: boolean;

    @Column({ type: 'enum', enum: NotificationAction, nullable: false })
    action: NotificationAction;

    @Column({type: 'varchar', length: 100, nullable: false})
    title: string;

    @Column({type: 'varchar', length:100, nullable: false})
    description: string; 
    
    @Column({type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP'})
    notificationDate: Date;
}
