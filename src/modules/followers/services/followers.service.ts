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
  async createFollower(createFollowerDto: CreateFollowerDto): Promise<FollowersEntity> { 
    try{
      const follower =  this.followerRepository.create(createFollowerDto);
      if(!follower) {
        throw new Error('Follower not created, please give all required fields');
      };
  
      return await this.followerRepository.save(follower);
    }
    catch(err){
      throw new Error(err);
    }
   }

  // Function to find all followings by follower ID
  async findFollowingsById(followerId: FollowersEntity['follower']): Promise<String[]> {
    try{
      const followings = await this.followerRepository.find({ where: { follower: followerId } });
    
      if (!followings || followings.length === 0) {
        throw new Error('No followings found for the provided followerId');
      }
  
      const result = followings.map(following => following.following);
      
      return result;
    }
    catch(err){
      throw new Error(err);
    }
  }

  // Function to find followers by user ID
  async findFollowersByUser(followingID: FollowersEntity['following']): Promise<String[]> { 
    try{
      const followers = await this.followerRepository.find({ where: { following: followingID } });
      if(!followers) {
        throw new Error('No followers found for the provided userId');
      };
  
      const result = followers.map(follower => follower.follower);
  
      return result;
    }
    catch(err){
      throw new Error(err);
    }
   }

  // Function to delete a follower by ID
  async deleteFollower(followerId: string): Promise<string> { 
    try{
          // find follower by ID
    const follower = await this.followerRepository.findOneBy({id: followerId});
    if(!follower) {
      throw new Error('Follower not found');
    };
    // delete follower
    const deleted = await this.followerRepository.remove(follower);
    if(!deleted) {
      throw new Error('Follower not deleted');
    };
    return 'Follower deleted';
    }
    catch(err){
      throw new Error(err);
    }
  }
 }
