import { Controller, Get, Post, Put, Delete, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostEntity } from '../entities/post.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ApiResponse, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { LikesService } from 'src/modules/likes/services/likes.service';
import { LikeEntity } from 'src/modules/likes/entities/like.entity';
import { CreateLikeDto } from 'src/modules/likes/dto/create-like.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService, 
              private readonly likesService: LikesService
  ) { }

  // Documentation whit swagger the service posts
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 200,
    type: CreatePostDto,
    description: 'Create a new post'
  })
  // now the respose error
  @ApiResponse({
    status: 400,
    type: CreatePostDto,
    description: 'BAD REQUEST: Create a new post'
  })
  @ApiResponse({
    status: 500,
    type: CreatePostDto,
    description: 'INTERNAL SERVER ERROR: Create a new post'
  })

  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto);
  }

  @Get(':id')
  findPostById(@Param('id') postId: string): Promise<PostEntity> {
    return this.postsService.findPostById(postId);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    type: CreatePostDto,
    description: 'Update a post'
  })
  @ApiResponse({
    status: 400,
    type: CreatePostDto,
    description: 'BAD REQUEST: Update a post'
  })
  @ApiResponse({
    status: 500,
    type: CreatePostDto,
    description: 'INTERNAL SERVER ERROR: Update a post'
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updatePost(@Param('id') postId: string, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
    return this.postsService.updatePost(postId, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    type: CreatePostDto,
    description: 'Delete a post'
  })
  @ApiResponse({
    status: 400,
    type: CreatePostDto,
    description: 'BAD REQUEST: Delete a post'
  })
  @ApiResponse({
    status: 500,
    type: CreatePostDto,
    description: 'INTERNAL SERVER ERROR: Delete a post'
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deletePost(@Param('id') postId: string): Promise<void> {
    return this.postsService.deletePost(postId);
  }

  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({
    status: 200,
    type: CreatePostDto,
    description: 'Like a post'
  })
  @ApiResponse({
    status: 400,
    type: CreatePostDto,
    description: 'BAD REQUEST: Like a post'
  })
  @ApiResponse({
    status: 500,
    type: CreatePostDto,
    description: 'INTERNAL SERVER ERROR: Like a post'
  })
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  likePost(@Param('id') postId: string, @Body('userId') userId: string): Promise<void> {
    return this.postsService.likePost(postId, userId)
  }

  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({
    status: 200,
    type: CreatePostDto,
    description: 'Unlike a post'
  })
  @ApiResponse({
    status: 400,
    type: CreatePostDto,
    description: 'BAD REQUEST: Unlike a post'
  })
  @ApiResponse({
    status: 500,
    type: CreatePostDto,
    description: 'INTERNAL SERVER ERROR: Unlike a post'
  })
  @Post(':id/unlike')
  @UseGuards(JwtAuthGuard)
  unlikePost(@Param('id') postId: string, @Body('userId') userId: string, ): Promise<any> {
    return this.postsService.unlikePost(postId, userId)
  }

  @ApiOperation({ summary: 'Find posts by user' })
  @ApiResponse({
    status: 200,
    type: [CreatePostDto],
    description: 'Find posts by user'
  })
  @ApiResponse({
    status: 400,
    type: CreatePostDto,
    description: 'BAD REQUEST: Find posts by user'
  })
  @ApiResponse({
    status: 500,
    type: CreatePostDto,
    description: 'INTERNAL SERVER ERROR: Find posts by user'
  })
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findPostsByUser(@Param('userId') userId: string): Promise<PostEntity[]> {
    return this.postsService.findPostsByUser(userId)
  }

  @ApiOperation({ summary: 'Find posts visible to user' })
  @ApiResponse({
    status: 200,
    type: [CreatePostDto],
    description: 'Find posts visible to user'
  })
  @ApiResponse({
    status: 400,
    type: CreatePostDto,
    description: 'BAD REQUEST: Find posts visible to user'
  })
  @ApiResponse({
    status: 500,
    type: CreatePostDto,
    description: 'INTERNAL SERVER ERROR: Find posts visible to user'
  })
  @Get('user/:userId/visible')
  @UseGuards(JwtAuthGuard)
  findPostsVisibleToUser(@Param('userId') userId: string): Promise<PostEntity[]> {
    return this.postsService.findPostsVisibleToUser(userId)
  }

  // Function to find posts of a specific followed user
  // have two parametres followersId and followingId
  @ApiOperation({ summary: 'Find posts of followed user' })
  @ApiResponse({
    status: 200,
    type: [CreatePostDto],
    description: 'Find posts of followed user'
  })
  @ApiResponse({
    status: 400,
    type: CreatePostDto,
    description: 'BAD REQUEST: Find posts of followed user'
  })
  @ApiResponse({
    status: 500,
    type: CreatePostDto,
    description: 'INTERNAL SERVER ERROR: Find posts of followed user'
  })
  // Endpoint to find posts of a specific followed user
  @Get('followed/:followerId/:followedUserId')
  @UseGuards(JwtAuthGuard)
  async findPostsOfFollowedUser(
    @Param('followerId') followerId: string,
    @Param('followedUserId') followedUserId: string,
  ): Promise<PostEntity[]> {
    console.log(followerId, followedUserId);
      return await this.postsService.findPostsOfFollowedUser(followerId, followedUserId);
  }

  // Endpoint para obtener todos los post de los usuarios con los que sigues
  @ApiOperation({ summary: 'Find posts of followed users' })
  @ApiResponse({
    status: 200,
    type: [CreatePostDto],
    description: 'Find posts of followed users'
  })
  @ApiResponse({
    status: 400,
    type: CreatePostDto,
    description: 'BAD REQUEST: Find posts of followed users'
  })
  @ApiResponse({
    status: 500,
    type: CreatePostDto,
    description: 'INTERNAL SERVER ERROR: Find posts of followed users'
  })
  @UseGuards(JwtAuthGuard)
  @Get('followed-post/:followerId/:page/:limit')
  async findPaginatedPosts(@Param() { followerId, page, limit } ): Promise<object[]> {
    console.log({
      followerId,
      page,
      limit
    });
    return await this.postsService.findPaginatedPosts(followerId, page, limit);
  }
}
