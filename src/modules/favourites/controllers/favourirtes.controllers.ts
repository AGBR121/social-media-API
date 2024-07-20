import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { FavouritesService } from '../service/favourite.service';
import { FavouritesDto } from '../dto/create-favourite.dto';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags("Favourites")
@Controller('favourites')
export class FavouritesController {
    constructor(private readonly FavouritesService: FavouritesService) {}

    @ApiResponse({
        status: 201,
        description: 'Favorite added.',
      })
      @ApiResponse({
        status: 400,
        description: 'Bad request.'
      })
      @ApiResponse({
        status: 401,
        description: 'Unauthorized'
      })
    @Post('/add')
    @UseGuards(JwtAuthGuard)
    public async AddFavourites(@Body() body: FavouritesDto){
        return await this.FavouritesService.addFavourite(body);
    }
    
    @ApiResponse({
        status: 200,
        description: 'Favorite deleted.',
      })
      @ApiResponse({
        status: 400,
        description: 'Bad request.'
      })
      @ApiResponse({
        status: 401,
        description: 'Unauthorized'
      })
      @ApiResponse({
        status: 404,
        description: 'Favorite not found.'
      })
      
    @Delete('/delete/:id')
    @UseGuards(JwtAuthGuard)
    public async DeleteFavourites(@Param('id') id: any){
        return await this.FavouritesService.deleteFavourite(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all favourites.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request.'
    })  
    @ApiResponse({
      status: 401,
      description: 'Unauthorized'
    })
    @ApiResponse({
        status: 404,
        description: 'Favourites not found.'
    })
    @Get('/get/:userId')
    @UseGuards(JwtAuthGuard)
    public async GeFavourites(@Param('userId') userId: string){
        return await this.FavouritesService.getFavourites(userId);
        
    }

}