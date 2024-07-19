// src/modules/followers/services/followers.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFollowerDto } from '../dto/create-follower.dto';
import { FollowersEntity } from '../entities/followers.entity';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(FollowersEntity)
    private readonly followerRepository: Repository<FollowersEntity>
  ) {}

  // Function to create a new follower
  // createFollower(createFollowerDto: CreateFollowerDto): Promise<FollowerEntity> { ... }

  // Function to find a follower by ID
  // findFollowerById(followerId: string): Promise<FollowerEntity> { ... }

  // Function to find all followers
  // findAllFollowers(): Promise<FollowerEntity[]> { ... }

  // Function to delete a follower by ID
  // deleteFollower(followerId: string): Promise<void> { ... }

  // Function to find followers by user ID
  // findFollowersByUser(userId: string): Promise<FollowerEntity[]> { ... }
}
