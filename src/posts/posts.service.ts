import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository
      .createQueryBuilder('post')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .getMany();
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      // .leftJoinAndSelect('post.comments', 'comment')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .where('post.id = :id', { id })
      .getOne();
    if (!post) {
      throw new NotFoundException('INVALID POST', {
        description: 'Post not found',
      });
    }
    return post;
  }

  async findOneWithComments(id: number): Promise<Post> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.id = :id', { id })
      .getOne();
    if (!post) {
      throw new NotFoundException('INVALID POST', {
        description: 'Post not found',
      });
    }
    return post;
  }

  create(data: CreatePostDto, userId: number): Promise<Post> {
    const newPost = new Post();
    newPost.userId = userId;
    newPost.title = data.title;
    newPost.content = data.content;
    newPost.tag = data.tag;

    return this.postsRepository.save(newPost);
  }

  async update(data: UpdatePostDto, userId: number): Promise<Post> {
    const existingPost = await this.postsRepository.findOneBy({ id: data.id });
    if (!existingPost) {
      throw new NotFoundException('INVALID POST', {
        description: 'Post not found',
      });
    }
    if (existingPost.userId !== userId) {
      throw new BadRequestException('INVALID POST', {
        description: 'User is not authorized to update this post',
      });
    }

    existingPost.title = data.title;
    existingPost.content = data.content;
    existingPost.tag = data.tag;

    return this.postsRepository.save(existingPost);
  }

  async delete(id: number, userId: number): Promise<DeleteResult> {
    const existingPost = await this.postsRepository.findOneBy({ id });
    if (!existingPost) {
      throw new NotFoundException('INVALID POST', {
        description: 'Post not found',
      });
    }
    if (existingPost.userId !== userId) {
      throw new BadRequestException('INVALID POST', {
        description: 'User is not authorized to delete this post',
      });
    }

    return this.postsRepository.delete(id);
  }
}
