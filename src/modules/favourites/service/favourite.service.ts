import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, Repository } from 'typeorm'; 
import { FavouritesEntity } from '../entities/favourites.entity';
import { FavouritesDto } from '../dto/create-favourite.dto';

@Injectable()
export class FavouritesService {
    constructor(
        @InjectRepository(FavouritesEntity)
        private readonly favouritesRepository: Repository<FavouritesEntity>
    ) {}
    // first add favourite
        // IN this service i need a function to add a post in favourite
    // the name is addFavourite and the parameter is FavouritesDto


    public async addFavourite(FavouritesDto: FavouritesDto): Promise<FavouritesEntity> {
        try {
         const favourite = this.favouritesRepository.create(FavouritesDto)
         return this.favouritesRepository.save(favourite)
        } catch (error) {
          throw new Error(error);
        }
      }
    

    // second delete a Favourite post
    // the name is deleteFavourite and the parameter is id

    public async deleteFavourite(idFavourite: FavouritesDto):Promise<DeleteResult | undefined>{
        try{
            const result = await this.favouritesRepository.delete(idFavourite);
      if (result.affected === 0) {
        throw new Error('Favourite not found');
      }
      return result
        }catch(error){
            throw new Error(error);
        }
    }

    // third get a favourites Post
    // the name is getFavourites 

    async getFavourites (userId: FavouritesDto['userId']):Promise<FavouritesEntity[]> {
      try {
        return this.favouritesRepository.find({where: { userId: userId }})
      } catch (error) {
        throw new Error(error);
      }
    }

}