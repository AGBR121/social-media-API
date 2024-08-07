import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostEntity } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { FollowersEntity } from '../../followers/entities/followers.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { LikeEntity } from 'src/modules/likes/entities/like.entity';
import { CreateLikeDto } from 'src/modules/likes/dto/create-like.dto';
import { FavouritesEntity } from 'src/modules/favourites/entities/favourites.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository < PostEntity > ,
    @InjectRepository(FollowersEntity)
    private readonly followersRepository: Repository < FollowersEntity > ,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository < UserEntity > ,
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository < LikeEntity >,
    @InjectRepository(FavouritesEntity)
    private readonly favouritesRepository: Repository <FavouritesEntity>
  ) {}

  async getAllPublicsPosts(): Promise < PostEntity[] > {
    try {
      const posts = await this.postRepository.find({ where: { isPublic: true } });
      if (!posts) throw new HttpException('Posts not found', 500);
      return posts;
    } catch (error) {
      throw new Error(error)
    }
  }

  // Function to create a new post
  async createPost(createPostDto: CreatePostDto): Promise < PostEntity > {
    try {
      if (!createPostDto) {
        throw new HttpException('Post not created, please complete the form', 400);
      }
      const post = this.postRepository.create(createPostDto);
      if (!post) throw new HttpException('Post not created', 500);
      return await this.postRepository.save(post);
    } catch (error) {
      throw error;
    }
  }

  // Function to update a post by ID
  async updatePost(postId: string, updatePostDto: UpdatePostDto): Promise < PostEntity > {
    try {
      if (!updatePostDto) {
        throw new HttpException('Post not updated, please complete the form', 400);
      }
      const post = this.postRepository.update(postId, updatePostDto);
      if (!post) throw new HttpException('Post not updated', 500);
      return post.then(() => this.postRepository.findOneBy({
        postId: postId
      }));
    } catch (error) {
      throw new HttpException('Post not updated', 500);
    }
  }

  // Function to delete a post by ID
  async deletePost(postId: string): Promise < any > {
    try {
      if (!postId) throw new HttpException('Post not deleted, please provide the id', 400);
      return await this.postRepository.delete(postId);
    } catch (error) {
      throw new HttpException('Post not deleted', 500);
    }
  }

  // Function to like a post by ID
  async likePost(createLikeDto: CreateLikeDto): Promise < any > {
    try {
      const like = this.likeRepository.create(createLikeDto);
      await this.likeRepository.save(like);
      await this.postRepository.increment({ postId: like.postId }, 'likes', 1);
    } catch (error) {
      throw new HttpException('Post not liked', 500);
    }
  }

  // Function to unlike a post by ID
  async unlikePost(createLikeDto: CreateLikeDto): Promise < any > {
    try {
      const like = this.likeRepository.create(createLikeDto);
      await this.likeRepository.delete(like);
      await this.postRepository.decrement({
        postId: like.postId
      }, 'likes', 1);
    } catch (error) {
      throw new HttpException('Post not unliked', 500);
    }
  }

  // Function to find a post by Id
  async findPostById(postId: string): Promise < PostEntity > {
    try {
      const post = await this.postRepository.findOneBy({
        postId: postId
      });
      return post;
    } catch (error) {
      throw new HttpException('server error', 500);
    }
  }

  // Function to find all posts by a specific user
  async findPostsByUser(userId: string): Promise < PostEntity[] > {
    try {
      if (!userId) throw new HttpException('Posts not found, please provide the id', 400);
      const posts = await this.postRepository.findBy({
        userId: userId
      });
      if (!posts) throw new HttpException('Posts not found', 500);
      return posts;
    } catch (error) {
      throw new HttpException('server error', 500);
    }
  }

  // Function to find all posts visible to a specific user (public posts and posts of followed users)
  async findPostsVisibleToUser(userId: string): Promise < PostEntity[] > {
    try {
      if (!userId) throw new HttpException('Posts not found, please provide the id', 400);
      const posts = await this.postRepository.find({
        where: {
          isPublic: true,
          userId: userId
        }
      });
      if (!posts) throw new HttpException('Posts not found', 500);
      return posts;
    } catch (error) {
      throw new HttpException('server error', 500);
    }
  }

 // Function to find posts of a specific followed user
  async findPostsOfFollowedUser(followerId: string, followedUserId: string): Promise<PostEntity[]> {
    try {
      if (!followerId || !followedUserId) {
        throw new HttpException('Invalid request', 400);
      }
      const isFollowing = await this.followersRepository.findOne({ where: { followerId, followingId: followedUserId } });

      if (!isFollowing) {
        throw new HttpException('You are not following this user', 400);
      }

      const posts = await this.postRepository.find({ where: { postId: followedUserId, isPublic: true } });
      return posts;
    } catch (error) {
      throw new HttpException('server error', 500);
    }
}

 // Function to find paginated posts of all followed users
  async findPaginatedPosts(followerId: string, page: number, limit: number): Promise<object[]> {
    try {
      if (!followerId || !page || !limit) {
        throw new HttpException('Invalid request', 400);
      }

      const followings = await this.followersRepository.find({ where: { followerId } });

      const followedUsersPosts = await Promise.all(followings.map(async (following) => {
        const followedUser = await this.userRepository.findOne({ where: { userId: following.followingId } });
        const posts = await this.postRepository.find({
          where: { postId: following.followingId,isPublic: true},
          order: { updateDate: 'DESC' },
          skip: (page - 1) * limit,
          take: limit,
        });
        return {
          follower: followerId,
          following: followedUser.userName,
          posts,
        };
    }));

      // Sort by post date, descending
      followedUsersPosts.sort((a, b) => {
        if (a.posts.length && b.posts.length) {
          return b.posts[0].updateDate.getTime() - a.posts[0].updateDate.getTime();
        }
        return 0;
      });

      return followedUsersPosts;
    } catch (error) {
      throw new HttpException('server error', 500);
    }
  }

// to find posts public that user that i am following
async findPostsPublicByUser(userId: string): Promise<PostEntity[]> {
  try {
    if (!userId) throw new HttpException('Posts not found, please provide the id', 400);
    const posts = await this.postRepository.find({ where: { isPublic: true, postId: userId } });
    if(!posts) throw new HttpException('Posts not found', 500);
    return posts;
  } catch (error) {
    throw new HttpException('server error', 500);
  }
}

  async postSearch(search: string): Promise<PostEntity[]> {
    try {
      if (!search) {
        throw new HttpException('search not found', 400);
      }
      const subStrings = search.split(' ');
      const posts = await this.postRepository.find({ where: { isPublic: true } });
      const postsFiltered = posts.filter(post => {
        if (!post.title || !post.description) {
          return '';
        } 
        const titleWords = post.title.split(' ');
        const descriptionWords = post.description.split(' ');
        return subStrings.some(sub => titleWords.includes(sub) || descriptionWords.includes(sub));
      });
      if (!postsFiltered) {
        throw new HttpException('Posts not found', 404);
      }
      return postsFiltered;
    } catch (error) {
      throw new HttpException('server error', 500);
    }
  }

  async postByUserLike(userId: string): Promise<PostEntity[]> {
    try{
      
      const likes = await this.likeRepository.find({ where: { userId: userId } });

      if (!userId) {
        throw new HttpException('userId not valid', 400);
      }

      if (!likes) {
        throw new HttpException('Likes not found', 404);
      }
      const post = [];

      for (const like of likes) {
        const postLike = await this.postRepository.findOne({ where: { postId: like.postId } });
        post.push(postLike);
      }
      if (!post) {
        throw new HttpException('Posts not found', 404);
      }
      return post;
      }
      catch (error) {
        throw new HttpException('server error', 500);
      }
  }

  async getFavouritesPost(userId: string): Promise <PostEntity[]>{
    
    try{
        if(!userId){
        throw new HttpException('userdId not valid',400);
      }

      const favourites = await this.favouritesRepository.find({where: { userId: userId}});

      if(!favourites){
        throw new HttpException('Likes not found',400)
      }

      const posts = [];

      for (const favourite of favourites){
        const postFavourite = this.favouritesRepository.findOne({where: { postId: favourite.postId}})
        posts.push(postFavourite);
      }

      if(!posts){
        throw new HttpException('posts not found',404)
      }
      return posts;
    }catch (error){
      throw new HttpException('internal server error',500);
    }

  }
}
