import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post } from 'src/entity/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private dataSource: DataSource,
  ) {}

  findPostComment(postId: number): Promise<Comment[]> {
    return this.commentsRepository.findBy({ post: { id: postId } });
  }

  async createComment(
    data: CreateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const post = await this.dataSource
      .getRepository(Post)
      .findOneBy({ id: data.postId });

    if (!post) {
      throw new BadRequestException('INVALID DATA', {
        description: 'Post not found',
      });
    }

    const newComment = new Comment();
    newComment.userId = userId;
    newComment.content = data.content;
    newComment.post = post;

    return this.commentsRepository.save(newComment);
  }

  async updateComment(
    data: UpdateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const existingComment = await this.commentsRepository.findOneBy({
      id: data.id,
    });
    if (!existingComment) {
      throw new NotFoundException('INVALID COMMENT', {
        description: 'Comment not found',
      });
    }
    if (existingComment.userId !== userId) {
      throw new BadRequestException('INVALID COMMENT', {
        description: 'User is not authorized to update this comment',
      });
    }

    existingComment.content = data.content;

    return this.commentsRepository.save(existingComment);
  }

  async deleteComment(id: number, userId: number): Promise<DeleteResult> {
    const existingComment = await this.commentsRepository.findOneBy({ id });
    if (!existingComment) {
      throw new NotFoundException('INVALID COMMENT', {
        description: 'Comment not found',
      });
    }
    if (existingComment.userId !== userId) {
      throw new BadRequestException('INVALID COMMENT', {
        description: 'User is not authorized to delete this comment',
      });
    }

    return this.commentsRepository.delete(id);
  }
}
